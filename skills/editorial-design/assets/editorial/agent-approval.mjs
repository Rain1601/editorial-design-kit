import {mountPresenceMotion} from './motion.mjs';
/** New requests require fresh selection and acknowledgement. IDs identify runtime gates. */
export function normalizeTaskApproval(model) {
  if (!model || !['pending', 'approved', 'hidden'].includes(model.status)) throw new TypeError('Unknown approval status');
  if (typeof model.acknowledged !== 'boolean' || !(model.selectedId === null || typeof model.selectedId === 'string')) throw new TypeError('Invalid approval selection');
  let request = null;
  if (model.request !== null) {
    const value = model.request;
    if (!value || typeof value.id !== 'string' || !value.id) throw new TypeError('Request requires a nonempty id');
    for (const key of ['title', 'description', 'acknowledgement']) if (typeof value[key] !== 'string') throw new TypeError(`request.${key} must be a string`);
    if (!Array.isArray(value.options) || !value.options.length) throw new TypeError('Request requires options');
    const ids = new Set();
    const options = value.options.map(option => {
      if (!option || typeof option.id !== 'string' || !option.id || typeof option.label !== 'string' || typeof option.description !== 'string') throw new TypeError('Invalid approval option');
      if (ids.has(option.id)) throw new TypeError('Duplicate approval option id'); ids.add(option.id);
      return {id: option.id, label: option.label, description: option.description};
    });
    if (model.selectedId !== null && !ids.has(model.selectedId)) throw new TypeError('Selection does not belong to request');
    request = {id: value.id, title: value.title, description: value.description, acknowledgement: value.acknowledgement, options};
  } else if (model.status !== 'hidden' || model.selectedId !== null || model.acknowledged) throw new TypeError('No request requires hidden, unselected state');
  return {request, status: model.status, selectedId: model.selectedId, acknowledged: model.acknowledged};
}

export function mountTaskApproval(host, {prefix = '', labels, onAction = () => {}, motion = false} = {}) {
  if (!host?.ownerDocument || typeof prefix !== 'string' || typeof onAction !== 'function') throw new TypeError('Invalid mount options');
  const validateLabels = value => {
    for (const key of ['decision', 'scope', 'approve', 'reject', 'chooseFirst', 'acknowledgeFirst', 'ready', 'approved']) if (typeof value?.[key] !== 'string') throw new TypeError(`labels.${key} must be a string`);
    return {...value};
  };
  let copy = validateLabels(labels), model = null, destroyed = false;
  const doc = host.ownerDocument;
  const make = (tag, id, className) => {const node = doc.createElement(tag); if (id) node.id = prefix + id; if (className) node.className = className; return node;};
  const root = make('div', 'review', 'review edk-agent-approval'); root.hidden = true;
  const decision = make('p', null, 'eyebrow'), title = make('h3'), description = make('p', null, 'muted');
  const fieldset = make('fieldset'), legend = make('legend'); fieldset.append(legend);
  const check = make('label', null, 'check'), ack = make('input', 'ack'), acknowledgement = make('span'); ack.type = 'checkbox'; check.append(ack, acknowledgement);
  const help = make('p', 'gate-help', 'small muted'); help.setAttribute('aria-live', 'polite');
  const actions = make('div', null, 'actions'), approve = make('button', 'approve', 'primary'), reject = make('button', 'reject');
  approve.type = reject.type = 'button'; approve.disabled = reject.disabled = true; actions.append(approve, reject);
  root.append(decision, title, description, fieldset, check, help, actions); host.append(root);
  if(typeof motion!=='boolean')throw new TypeError('motion must be boolean');
  const presence=motion?mountPresenceMotion(root):null;let visible=false;
  const inputs = new Map();
  const pending = () => !destroyed && model?.status === 'pending' && !!model.request;
  const emit = action => onAction({...action, requestId: model.request.id});
  const change = event => {if (!pending()) return; if (event.target === ack) emit({type: 'acknowledge', value: ack.checked}); else if ([...inputs.values()].includes(event.target) && event.target.checked) emit({type: 'choose', id: event.target.value});};
  const accept = () => {if (pending() && model.selectedId !== null && model.acknowledged) emit({type: 'approve', id: model.selectedId});};
  const decline = () => {if (pending()) emit({type: 'reject'});};
  root.addEventListener('change', change); approve.addEventListener('click', accept); reject.addEventListener('click', decline);
  return {
    elements: {root, decision, title, description, fieldset, legend, ack, acknowledgement, help, approve, reject, inputs},
    update(value, {labels: nextLabels = copy, language = 'zh'} = {}) {
      if (destroyed) throw new Error('Approval component destroyed');
      const next = normalizeTaskApproval(value), nextCopy = validateLabels(nextLabels);
      if (typeof language !== 'string') throw new TypeError('language must be a string');
      if (model && next.request?.id !== model.request?.id) {next.selectedId = null; next.acknowledged = false;}
      model = next; copy = nextCopy; root.lang = language;
      const nextVisible=model.status!=='hidden';
      if(presence){if(nextVisible!==visible){visible=nextVisible;presence.setVisible(visible);}else if(nextVisible)root.hidden=false;}else root.hidden=!nextVisible;
      // Keep the departing copy visible while actions are already blocked by hidden state.
      if(presence&&!nextVisible){ack.disabled=approve.disabled=reject.disabled=true;inputs.forEach(input=>input.disabled=true);return;}
      decision.textContent = copy.decision; legend.textContent = copy.scope; approve.textContent = copy.approve; reject.textContent = copy.reject;
      title.textContent = model.request?.title || ''; description.textContent = model.request?.description || ''; acknowledgement.textContent = model.request?.acknowledgement || '';
      const keep = new Set();
      for (const option of model.request?.options || []) {
        keep.add(option.id); let input = inputs.get(option.id);
        if (!input) {const label = make('label', null, 'scope-option'); input = make('input'); input.type = 'radio'; input.name = prefix + 'scope'; input.value = option.id; const span = make('span'); span.append(make('strong'), make('small')); label.append(input, span); fieldset.append(label); inputs.set(option.id, input);}
        const label = input.parentElement; label.querySelector('strong').textContent = option.label; label.querySelector('small').textContent = option.description;
        input.checked = model.selectedId === option.id; input.disabled = !pending();
      }
      for (const [id, input] of inputs) if (!keep.has(id)) {input.parentElement.remove(); inputs.delete(id);}
      // Keep existing controls when only labels change; reorder only changed option order.
      for (const [index, option] of (model.request?.options || []).entries()) {const label = inputs.get(option.id).parentElement; const at = fieldset.children[index + 1]; if (at !== label) fieldset.insertBefore(label, at || null);}
      ack.checked = model.acknowledged; ack.disabled = !pending(); reject.disabled = !pending(); approve.disabled = !pending() || model.selectedId === null || !model.acknowledged;
      help.textContent = model.status === 'approved' ? copy.approved : model.status === 'hidden' ? '' : model.selectedId === null ? copy.chooseFirst : !model.acknowledged ? copy.acknowledgeFirst : copy.ready;
    },
    destroy() {if (destroyed) return; destroyed = true; presence?.destroy();root.removeEventListener('change', change); approve.removeEventListener('click', accept); reject.removeEventListener('click', decline); root.remove(); inputs.clear();}
  };
}
