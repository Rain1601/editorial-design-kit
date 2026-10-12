/** Controlled task input. Attachments are metadata only; no file contents are read. */
const string=(value,key)=>{if(typeof value!=='string')throw new TypeError(`${key} must be a string`);return value;};
const boolean=(value,key)=>{if(typeof value!=='boolean')throw new TypeError(`${key} must be boolean`);return value;};
export function normalizeTaskInput(model){
 if(!model||!Array.isArray(model.files))throw new TypeError('Task input and files are required');
 const maxLength=model.maxLength??3000;if(!Number.isInteger(maxLength)||maxLength<1)throw new RangeError('maxLength must be a positive integer');
 const seen=new Set();const files=model.files.map(file=>{
  if(!file||typeof file.id!=='string'||!file.id||seen.has(file.id))throw new TypeError('File ids must be nonempty and unique');seen.add(file.id);
  if(!Number.isSafeInteger(file.size)||file.size<0||!Number.isFinite(file.lastModified)||file.lastModified<0)throw new TypeError('Invalid file metadata');
  return {id:file.id,name:string(file.name,'name'),size:file.size,type:string(file.type,'type'),lastModified:file.lastModified};
 });
 if(model.showDemoOptions!==undefined&&typeof model.showDemoOptions!=='boolean')throw new TypeError('showDemoOptions must be boolean');
 return {showDemoOptions:model.showDemoOptions??false,input:string(model.input,'input'),files,busy:boolean(model.busy,'busy'),error:string(model.error,'error'),maxLength,canCancel:boolean(model.canCancel,'canCancel'),canRestart:boolean(model.canRestart,'canRestart'),fail:boolean(model.fail,'fail')};
}
function labelsCopy(labels={}){if(!labels||typeof labels!=='object')throw new TypeError('labels must be an object');for(const value of Object.values(labels))if(typeof value!=='string')throw new TypeError('Labels must be strings');return {...labels};}
export function mountTaskInput(host,{prefix='',labels={},onAction=()=>{}}={}){
 if(!host?.ownerDocument||typeof prefix!=='string'||typeof onAction!=='function')throw new TypeError('Invalid task input options');
 let text=labelsCopy(labels),language='zh',state=null,serial=0;const doc=host.ownerDocument;const elements={};const listeners=[];const fileNodes=new Map();
 const wrapper=doc.createElement('div');wrapper.className='edk-agent-input';host.append(wrapper);
 const node=(tag,id,parent=wrapper,className='')=>{const el=doc.createElement(tag);if(id){el.id=prefix+id;elements[id]=el;}if(className)el.className=className;parent.append(el);return el;};
 const bind=(el,event,fn)=>{el.addEventListener(event,fn);listeners.push(()=>el.removeEventListener(event,fn));};
 const labeled=[];const mark=(el,key)=>{labeled.push([el,key]);return el;};
 const label=mark(node('label','task-label'),'taskLabel');label.htmlFor=prefix+'task';
 const task=node('textarea','task');task.rows=5;task.setAttribute('aria-describedby',prefix+'task-help '+prefix+'input-error');
 const meta=node('div',null,wrapper,'field-meta');mark(node('span','task-help',meta),'taskHelp');node('span','count',meta);
 const error=node('p','input-error',wrapper,'error');error.setAttribute('role','alert');
 const example=mark(node('button','example',wrapper,'text-button'),'example');example.type='button';
 const attachments=node('div',null,wrapper,'attachments');const heading=node('div',null,attachments,'attachment-heading');mark(node('h3',null,heading),'attachments');const add=mark(node('label',null,heading,'file-button'),'addFiles');add.htmlFor=prefix+'files';
 const files=node('input','files',heading);files.type='file';files.multiple=true;
 mark(node('p',null,attachments,'muted small'),'fileHelp');node('ul','file-list',attachments);mark(node('p','file-empty',attachments,'muted small'),'fileEmpty');
 const options=node('details','demo-options');mark(node('summary',null,options),'demoOptions');const check=node('label',null,options,'check');const fail=node('input','fail',check);fail.type='checkbox';mark(node('span',null,check),'failOption');
 const actions=node('div',null,wrapper,'actions');for(const key of ['start','cancel','restart']){const button=mark(node('button',key,actions,key==='start'?'primary':key==='restart'?'text-button':''),key);button.type='button';bind(button,'click',()=>onAction({type:key}));}
 bind(task,'input',()=>onAction({type:'input',value:task.value}));bind(example,'click',()=>onAction({type:'example'}));bind(fail,'change',()=>onAction({type:'fail',value:fail.checked}));
 bind(files,'change',()=>{const selected=Array.from(files.files||[],file=>{let id;do{id=prefix+'file-'+(++serial);}while(state?.files.some(item=>item.id===id));return {id,name:file.name,size:file.size,type:file.type,lastModified:file.lastModified};});files.value='';onAction({type:'files',files:selected});});
 function update(model,options={}){
  const next=normalizeTaskInput(model),nextText=labelsCopy(options.labels??text),nextLanguage=options.language??language;if(!['zh','en'].includes(nextLanguage))throw new RangeError('Unsupported language');
  state=next;text=nextText;language=nextLanguage;labeled.forEach(([el,key])=>el.textContent=text[key]??'');
  if(task.value!==next.input)task.value=next.input;task.maxLength=next.maxLength;task.placeholder=text.placeholder??'';task.disabled=next.busy;task.setAttribute('aria-invalid',String(Boolean(next.error)));
  elements.count.textContent=`${next.input.length} / ${next.maxLength}`;error.hidden=!next.error;error.textContent=next.error==='input'?(text.inputError??next.error):next.error;
  elements['demo-options'].hidden=!next.showDemoOptions;files.disabled=example.disabled=fail.disabled=next.busy;fail.checked=next.fail;elements.start.hidden=next.busy;elements.cancel.hidden=!next.canCancel;elements.restart.hidden=!next.canRestart;
  const ids=new Set(next.files.map(file=>file.id));for(const [id,entry] of fileNodes)if(!ids.has(id)){entry.el.remove();entry.cleanup();fileNodes.delete(id);}
  next.files.forEach((file,index)=>{let entry=fileNodes.get(file.id);if(!entry){const el=doc.createElement('li'),body=doc.createElement('div'),name=doc.createElement('strong'),details=doc.createElement('small'),remove=doc.createElement('button');remove.type='button';remove.dataset.fileId=file.id;body.append(name,details);el.append(body,remove);const click=()=>onAction({type:'remove-file',id:file.id});remove.addEventListener('click',click);entry={el,name,details,remove,cleanup:()=>remove.removeEventListener('click',click)};fileNodes.set(file.id,entry);}entry.name.textContent=file.name;entry.details.textContent=`${file.size.toLocaleString(language==='zh'?'zh-CN':'en-US')} ${text.bytes??''} · ${file.type||text.unknownType||''} · ${new Date(file.lastModified).toLocaleString(language==='zh'?'zh-CN':'en-US')}`;entry.remove.textContent=text.remove??'';entry.remove.setAttribute('aria-label',`${text.remove??''} ${file.name}`);entry.remove.disabled=next.busy;const list=elements['file-list'];if(list.children[index]!==entry.el)list.insertBefore(entry.el,list.children[index]??null);});
  elements['file-empty'].hidden=next.files.length>0;
 }
 return {update,elements,destroy(){listeners.forEach(fn=>fn());fileNodes.forEach(entry=>entry.cleanup());wrapper.remove();}};
}
