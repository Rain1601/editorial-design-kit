import {mountDetailsMotion} from './motion.mjs';
/** Runtime-owned status and event text; this component never fabricates progress. */
export function normalizeTaskExecution(model) {
  if (!model || typeof model !== 'object') throw new TypeError('Execution model is required');
  for (const key of ['status', 'description']) if (typeof model[key] !== 'string') throw new TypeError(`${key} must be a string`);
  if (!['idle', 'running', 'waiting', 'done', 'error', 'cancelled'].includes(model.tone)) throw new TypeError('Unknown execution tone');
  if (!Array.isArray(model.entries)) throw new TypeError('entries must be an array');
  const ids = new Set();
  const entries = model.entries.map(entry => {
    if (!entry || typeof entry.id !== 'string' || !entry.id || typeof entry.text !== 'string') throw new TypeError('Each entry requires a nonempty string id and text');
    if (ids.has(entry.id)) throw new TypeError('Duplicate execution entry id');
    ids.add(entry.id);
    return {id: entry.id, text: entry.text};
  });
  return {status: model.status, description: model.description, tone: model.tone, entries};
}

export function mountTaskExecution(host, {prefix = '', labels, onAction = () => {}, motion = false} = {}) {
  if (!host?.ownerDocument || typeof prefix !== 'string' || typeof onAction !== 'function') throw new TypeError('Invalid mount options');
  const validateLabels = value => {
    for (const key of ['log', 'logEmpty']) if (typeof value?.[key] !== 'string') throw new TypeError(`labels.${key} must be a string`);
    return {...value};
  };
  let copy = validateLabels(labels), destroyed = false;
  const doc = host.ownerDocument;
  const make = (tag, id, className) => {const node = doc.createElement(tag); if (id) node.id = prefix + id; if (className) node.className = className; return node;};
  const root = make('div', null, 'edk-agent-execution');
  const line = make('div', null, 'status-line');
  const symbol = make('span', 'phase-symbol'); symbol.setAttribute('aria-hidden', 'true');
  const heading = make('div'); const status = make('h3', 'status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  const description = make('p', 'status-help', 'muted'); heading.append(status, description); line.append(symbol, heading);
  const details = make('details', 'execution-log'); const summary = make('summary'); summary.textContent = copy.log;
  const logs = make('ol', 'logs'); const empty = make('p', 'log-empty', 'muted'); empty.textContent = copy.logEmpty;
  details.append(summary, logs, empty); root.append(line, details); host.append(root);
  if(typeof motion!=='boolean')throw new TypeError('motion must be boolean');const disclosure=motion?mountDetailsMotion(details):null;
  const elements = {root, symbol, status, description, details, summary, logs, empty};
  return {
    elements,
    update(model, {labels: nextLabels = copy, language = 'zh'} = {}) {
      if (destroyed) throw new Error('Execution component destroyed');
      const next = normalizeTaskExecution(model), nextCopy = validateLabels(nextLabels);
      if (typeof language !== 'string') throw new TypeError('language must be a string');
      copy = nextCopy; root.lang = language; root.dataset.tone = next.tone;
      status.textContent = next.status; description.textContent = next.description;
      symbol.textContent = next.tone === 'done' ? '✓' : next.tone === 'waiting' ? '◇' : ['error', 'cancelled'].includes(next.tone) ? '—' : '○';
      summary.textContent = copy.log; empty.textContent = copy.logEmpty; empty.hidden = next.entries.length > 0;
      const old = new Map([...logs.children].map(node => [node.dataset.entryId, node]));
      const nodes = next.entries.map(entry => {const node = old.get(entry.id) || make('li'); node.dataset.entryId = entry.id; node.textContent = entry.text; return node;});
      logs.replaceChildren(...nodes);
    },
    destroy() {if (destroyed) return; destroyed = true; disclosure?.destroy();root.remove();}
  };
}
