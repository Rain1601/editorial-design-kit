import {mountSelectionMotion,mountDetailsMotion,mountPresenceMotion} from './motion.mjs';
/** Controlled artifacts: original content is never translated; downloads belong to the caller. */
export function normalizeTaskArtifacts(model){
 if(!model||!Array.isArray(model.items))throw new TypeError('Artifacts items are required');
 const seen=new Set();const items=model.items.map(item=>{if(!item||typeof item.id!=='string'||!item.id||seen.has(item.id))throw new TypeError('Artifact ids must be nonempty and unique');seen.add(item.id);for(const key of ['title','filename','content'])if(typeof item[key]!=='string')throw new TypeError(`Artifact ${key} must be a string`);return {id:item.id,title:item.title,filename:item.filename,content:item.content};});
 if(model.selectedId!==null&&!seen.has(model.selectedId))throw new RangeError('Selected artifact must exist, or be null');
 if(!['bars','table'].includes(model.view))throw new RangeError('Unknown artifact view');if(model.busy!==undefined&&typeof model.busy!=='boolean')throw new TypeError('busy must be boolean');
 return {items,selectedId:model.selectedId,view:model.view,busy:model.busy??false};
}
function labelsCopy(labels={}){if(!labels||typeof labels!=='object')throw new TypeError('labels must be an object');for(const value of Object.values(labels))if(typeof value!=='string')throw new TypeError('Labels must be strings');return {...labels};}
/** Level-two headings and paragraph counts are text structure, never task progress. */
export function artifactStructure(content){if(typeof content!=='string')throw new TypeError('content must be a string');return content.split(/(?:^|\n)## /).slice(1).map(section=>{const [heading,...body]=section.split('\n');return {heading,count:body.join('\n').trim().split(/\n\s*\n/).filter(Boolean).length};});}
export function mountTaskArtifacts(host,{prefix='',labels={},onAction=()=>{},motion=false}={}){
 if(!host?.ownerDocument||typeof prefix!=='string'||typeof onAction!=='function')throw new TypeError('Invalid artifacts options');
 if(typeof motion!=='boolean')throw new TypeError('motion must be boolean');
 let text=labelsCopy(labels),state=null,language='zh',rendered=null,visible=false,lastSelected=null;const doc=host.ownerDocument,elements={},listeners=[],tabs=new Map();
 const wrapper=doc.createElement('div');wrapper.className='edk-agent-artifacts';host.append(wrapper);
 const node=(tag,id,parent=wrapper,className='')=>{const el=doc.createElement(tag);if(id){el.id=prefix+id;elements[id]=el;}if(className)el.className=className;parent.append(el);return el;};
 const bind=(el,event,fn)=>{el.addEventListener(event,fn);listeners.push(()=>el.removeEventListener(event,fn));};
 const labeled=[];const mark=(el,key)=>{labeled.push([el,key]);return el;};
 const empty=node('div','output-empty',wrapper,'empty');const icon=node('span',null,empty);icon.textContent='↳';icon.setAttribute('aria-hidden','true');mark(node('p',null,empty),'outputEmpty');mark(node('small',null,empty,'muted'),'outputHelp');
 const ready=node('div','output-ready');ready.hidden=true;mark(node('p',null,ready,'muted small'),'originalNote');const switcher=node('div','artifact-switch',ready,'choice-switch');switcher.setAttribute('role','group');
 const heading=node('div',null,ready,'artifact-heading');node('h3','artifact-title',heading);const download=mark(node('button','download',heading),'download');download.type='button';
 const preview=node('article','preview',ready);const structure=node('details','structure',ready);mark(node('summary',null,structure),'structure');mark(node('p',null,structure,'small muted'),'structureHelp');const chart=node('div','chart-switch',structure,'choice-switch');chart.setAttribute('role','group');
 const views=new Map();for(const [value,key] of [['bars','chart'],['table','data']]){const button=mark(node('button',null,chart),key);button.type='button';button.dataset.choice=value;views.set(value,button);bind(button,'click',()=>onAction({type:'artifact-view',value}));}
 const structureContent=node('div','structure-content',structure);
 const motionMarker=motion?node('span',null,switcher,'edk-motion-marker'):null;if(motionMarker){motionMarker.hidden=true;motionMarker.setAttribute('aria-hidden','true');switcher.classList.add('edk-motion-rail');}
 const selection=motion?mountSelectionMotion(switcher,motionMarker):null;
 const structureMotion=motion?mountDetailsMotion(structure):null;
 const presence=motion?mountPresenceMotion(ready):null;
 bind(download,'click',()=>{if(state?.selectedId!==null&&state?.selectedId)onAction({type:'download',id:state.selectedId});});
 function renderPreview(item){
  const signature=item?JSON.stringify([item.id,item.content]):null;if(signature===rendered)return;rendered=signature;preview.replaceChildren();if(!item)return;
  item.content.trim().split(/\n\s*\n/).filter(Boolean).forEach((block,index)=>{
   let el;const lines=block.split('\n');if(/^## /.test(lines[0])){el=doc.createElement('section');const h=doc.createElement('h2');h.textContent=lines.shift().slice(3);el.append(h);if(lines.length){const p=doc.createElement('p');p.textContent=lines.join('\n');el.append(p);}}
   else if(/^# /.test(lines[0])){el=doc.createElement('h3');el.textContent=block.slice(2);}
   else{el=doc.createElement('p');el.textContent=block.replace(/^> /,'');if(block.startsWith('> '))el.className='notice';}
   el.id=prefix+item.id+'-block-'+index;el.dataset.readingAnchor='';preview.append(el);
  });
 }
 function renderStructure(item){
  const rows=artifactStructure(item?.content??'');structureContent.replaceChildren();
  if(state.view==='table'){const table=doc.createElement('table'),caption=doc.createElement('caption');caption.textContent=text.structure??'';const head=doc.createElement('thead'),hr=doc.createElement('tr');[text.section??'',text.paragraphs??''].forEach(label=>{const th=doc.createElement('th');th.scope='col';th.textContent=label;hr.append(th);});head.append(hr);const body=doc.createElement('tbody');rows.forEach(row=>{const r=doc.createElement('tr');[row.heading,row.count].forEach(value=>{const td=doc.createElement('td');td.textContent=String(value);r.append(td);});body.append(r);});table.append(caption,head,body);structureContent.append(table);}
  else{const max=Math.max(1,...rows.map(row=>row.count));rows.forEach(row=>{const el=doc.createElement('div');el.className='bar-row';const name=doc.createElement('span'),bar=doc.createElement('span'),count=doc.createElement('span');name.textContent=row.heading;bar.className='bar';bar.style.width=`${row.count/max*100}%`;bar.setAttribute('aria-hidden','true');count.textContent=String(row.count);count.setAttribute('aria-label',`${row.count} ${text.paragraphs??''}`);el.append(name,bar,count);structureContent.append(el);});}
 }
 function update(model,options={}){
  const next=normalizeTaskArtifacts(model),nextText=labelsCopy(options.labels??text),nextLanguage=options.language??language;if(!['zh','en'].includes(nextLanguage))throw new RangeError('Unsupported language');
  state=next;text=nextText;language=nextLanguage;labeled.forEach(([el,key])=>el.textContent=text[key]??'');switcher.setAttribute('aria-label',text.artifacts??'');chart.setAttribute('aria-label',text.structureView??'');
  const ids=new Set(next.items.map(item=>item.id));for(const [id,entry] of tabs)if(!ids.has(id)){entry.cleanup();entry.button.remove();tabs.delete(id);}
  next.items.forEach((item,index)=>{let entry=tabs.get(item.id);if(!entry){const button=doc.createElement('button');button.type='button';button.dataset.choice=item.id;const click=()=>onAction({type:'select-artifact',id:item.id});button.addEventListener('click',click);entry={button,cleanup:()=>button.removeEventListener('click',click)};tabs.set(item.id,entry);}entry.button.textContent=item.title;entry.button.setAttribute('aria-pressed',String(next.selectedId===item.id));if(switcher.children[index]!==entry.button)switcher.insertBefore(entry.button,switcher.children[index]??null);});
  const item=next.items.find(value=>value.id===next.selectedId);empty.hidden=Boolean(item);if(presence){if(visible!==Boolean(item)){visible=Boolean(item);presence.setVisible(visible);}}else ready.hidden=!item;elements['artifact-title'].textContent=item?.title??'';download.disabled=!item||next.busy;
  if(selection){if(item){if(lastSelected!==item.id){selection.moveTo(tabs.get(item.id).button);lastSelected=item.id;}else selection.refresh();}else lastSelected=null;}
  views.forEach((button,value)=>button.setAttribute('aria-pressed',String(next.view===value)));renderPreview(item);renderStructure(item);
 }
 return {update,elements,destroy(){selection?.destroy();structureMotion?.destroy();presence?.destroy();listeners.forEach(fn=>fn());tabs.forEach(entry=>entry.cleanup());wrapper.remove();}};
}
