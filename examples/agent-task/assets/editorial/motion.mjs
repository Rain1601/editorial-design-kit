/** Presentation only. Caller owns selection, requests and accessibility controls. */
const preference=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
function options(region,{duration,reducedMotion}){
 if(!region?.style||!region.ownerDocument||!Number.isFinite(duration)||duration<0||typeof reducedMotion!=='function')throw new TypeError('Invalid motion options');
 return {duration,reducedMotion};
}
function controller(region,properties){
 const initial={hidden:region.hidden,inert:region.inert,styles:properties.map(key=>[key,region.style.getPropertyValue(key),region.style.getPropertyPriority(key)])};
 let animation=null,epoch=0,destroyed=false;
 const cancel=()=>{epoch++;animation?.cancel();animation=null;};
 return {cancel,get destroyed(){return destroyed;},async run(frames,opts,settle){
  cancel();const token=epoch;
  if(!opts.duration||opts.reducedMotion()||typeof region.animate!=='function'){settle();return true;}
  animation=region.animate(frames,{duration:opts.duration,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
  const current=animation;
  try{await current.finished;}catch{return false;}
  if(token!==epoch||destroyed)return false;
  settle();current.cancel();animation=null;return true;
 },destroy(){cancel();destroyed=true;region.hidden=initial.hidden;region.inert=initial.inert;for(const [key,value,priority] of initial.styles){if(value)region.style.setProperty(key,value,priority);else region.style.removeProperty(key);}}};
}
const computed=region=>region.ownerDocument.defaultView.getComputedStyle(region);
/** Animate measured height; no max-height ceiling or delayed height:auto jump. */
export function mountDisclosureMotion(region,{duration=220,reducedMotion=preference}={}){
 const opts=options(region,{duration,reducedMotion}),control=controller(region,['height','overflow']);
 return {async setExpanded(expanded){
  if(typeof expanded!=='boolean')throw new TypeError('expanded must be boolean');if(control.destroyed)return false;
  const start=region.hidden?0:region.getBoundingClientRect().height;control.cancel();
  region.hidden=false;region.inert=!expanded;region.style.height='auto';const end=expanded?region.getBoundingClientRect().height:0;
  region.style.height=end+'px';region.style.overflow='hidden';
  return control.run([{height:start+'px'},{height:end+'px'}],opts,()=>{region.hidden=!expanded;region.inert=!expanded;region.style.removeProperty('height');region.style.removeProperty('overflow');});
 },destroy:()=>control.destroy()};
}
/** Non-modal detail presence. Use an inner wrapper so layout is caller-controlled. */
export function mountPresenceMotion(region,{duration=200,offset=12,reducedMotion=preference}={}){
 const opts=options(region,{duration,reducedMotion});if(!Number.isFinite(offset))throw new TypeError('offset must be finite');const control=controller(region,[]);
 return {async setVisible(visible){
  if(typeof visible!=='boolean')throw new TypeError('visible must be boolean');if(control.destroyed)return false;
  const wasHidden=region.hidden,startOpacity=wasHidden?0:computed(region).opacity,startTranslate=wasHidden?offset+'px 0':computed(region).translate;
  control.cancel();region.hidden=false;region.inert=!visible;
  return control.run([{opacity:startOpacity,translate:startTranslate==='none'?'0px 0':startTranslate},{opacity:visible?1:0,translate:visible?'0px 0':offset+'px 0'}],opts,()=>{region.hidden=!visible;region.inert=!visible;});
 },destroy:()=>control.destroy()};
}
/** One marker follows stable controls; content remains in its original layout. */
export function mountSelectionMotion(host,marker,{duration=180,reducedMotion=preference}={}){
 const opts=options(marker,{duration,reducedMotion});if(marker.ownerDocument!==host?.ownerDocument||!host.contains(marker))throw new TypeError('Marker must belong to host');
 const control=controller(marker,['left','width']);let target=null;
 const measure=()=>{if(!target)return null;const parent=host.getBoundingClientRect(),rect=target.getBoundingClientRect();return {left:rect.left-parent.left+host.scrollLeft-host.clientLeft,width:rect.width};};
 const refresh=()=>{if(control.destroyed)return;const m=measure();if(m&&!marker.hidden&&parseFloat(marker.style.left)===m.left&&parseFloat(marker.style.width)===m.width)return;control.cancel();if(m&&m.width>0){marker.hidden=false;marker.style.left=m.left+'px';marker.style.width=m.width+'px';}else marker.hidden=true;};
 const observer=typeof ResizeObserver==='function'?new ResizeObserver(refresh):null;observer?.observe(host);host.ownerDocument.defaultView.addEventListener('resize',refresh);
 return {async moveTo(element){
  if(!element||element===marker||!host.contains(element))throw new TypeError('Selection target must belong to host');if(control.destroyed)return false;
  const previous=marker.hidden?null:marker.getBoundingClientRect();control.cancel();if(target)observer?.unobserve(target);target=element;observer?.observe(target);const m=measure();
  if(!m||m.width<=0){marker.hidden=true;return true;}
  marker.hidden=false;marker.style.left=m.left+'px';marker.style.width=m.width+'px';const rect=marker.getBoundingClientRect();
  return control.run([{transform:previous?`translateX(${previous.left-rect.left}px) scaleX(${previous.width/rect.width})`:'none'},{transform:'none'}],opts,()=>{});
 },refresh,destroy(){observer?.disconnect();host.ownerDocument.defaultView.removeEventListener('resize',refresh);control.destroy();}};
}

/** Native details semantics with immediate logical state during a closing transition. */
export function mountDetailsMotion(details,{onChange=()=>{},...motionOptions}={}){
 if(details?.tagName!=='DETAILS'||typeof onChange!=='function')throw new TypeError('A details element and onChange are required');
 const summary=[...details.children].find(el=>el.tagName==='SUMMARY');if(!summary)throw new TypeError('Details requires a summary');
 const originalChildren=[...details.childNodes];const region=details.ownerDocument.createElement('div');region.className='edk-motion-details';
 for(const child of [...details.childNodes])if(child!==summary)region.append(child);
 details.append(region);let expanded=details.open,destroyed=false,revision=0;
 region.hidden=!expanded;region.inert=!expanded;summary.setAttribute('aria-expanded',String(expanded));
 let skipMotion=false;const motion=mountDisclosureMotion(region,{...motionOptions,reducedMotion:()=>skipMotion||(motionOptions.reducedMotion??preference)()});
 async function setExpanded(next,{animate=true}={}){
  if(typeof next!=='boolean')throw new TypeError('expanded must be boolean');if(destroyed)return false;
  const token=++revision;expanded=next;summary.setAttribute('aria-expanded',String(next));
  if(!next&&region.contains(details.ownerDocument.activeElement))summary.focus({preventScroll:true});
  details.open=true;
  // Restoration does not replay motion or transiently overwrite logical state.
  skipMotion=!animate;const transition=motion.setExpanded(next);skipMotion=false;
  const settled=await transition;if(settled&&token===revision&&!destroyed)details.open=next;
  return settled;
 }
 const click=event=>{event.preventDefault();setExpanded(!expanded);onChange(expanded);};
 summary.addEventListener('click',click);
 return {getExpanded:()=>expanded,setExpanded,destroy(){if(destroyed)return;destroyed=true;revision++;summary.removeEventListener('click',click);motion.destroy();details.open=expanded;summary.removeAttribute('aria-expanded');for(const child of originalChildren)if(child.parentNode===details||child.parentNode===region)details.append(child);for(const child of [...region.childNodes])details.append(child);region.remove();}};
}
