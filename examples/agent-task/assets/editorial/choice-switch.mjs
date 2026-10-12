/** Small, controlled choice group. The caller owns application state. */
export function mountChoiceSwitch(host,{choices,value,label='Appearance',onChange=()=>{}}){
  if(!host || !Array.isArray(choices) || !choices.length || new Set(choices.map(c=>c.value)).size!==choices.length)throw new TypeError('Unique choices and a host are required');
  const doc=host.ownerDocument;
  host.classList.add('choice-switch');host.setAttribute('role','group');host.setAttribute('aria-label',label);
  const buttons=choices.map(choice=>{const button=doc.createElement('button');button.type='button';button.textContent=choice.label;button.dataset.choice=choice.value;host.append(button);return button;});
  function setValue(next){if(!choices.some(c=>c.value===next))throw new RangeError('Unknown choice');buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.choice===next)));value=next;}
  function click(event){const button=event.target.closest('button[data-choice]');if(!buttons.includes(button)||button.dataset.choice===value)return;onChange(button.dataset.choice);}
  host.addEventListener('click',click);setValue(value);
  return {setValue,setLabel:next=>host.setAttribute('aria-label',next),destroy(){host.removeEventListener('click',click);buttons.forEach(b=>b.remove());}};
}
