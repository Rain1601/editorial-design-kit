/** Continuous single-page chapters. All content stays mounted and visible; scroll owns reading progress. */
const preference=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
export function mountChapterNavigator(host,{state,onChange=()=>{},reducedMotion=preference}={}){
 if(!host?.ownerDocument||!host.style||typeof onChange!=='function'||typeof reducedMotion!=='function')throw new TypeError('Invalid chapter navigator options');
 const sections=[...host.children].filter(section=>section.hasAttribute('data-chapter-id'));
 const ids=sections.map(section=>section.getAttribute('data-chapter-id'));
 if(!sections.length||ids.some(id=>!id?.trim())||new Set(ids).size!==ids.length)throw new TypeError('Chapters require unique nonempty IDs');
 const headings=sections.map(section=>section.querySelector('[data-chapter-heading]'));
 if(headings.some(heading=>!heading||heading.getAttribute('tabindex')!=='-1'))throw new TypeError('Each chapter requires a focusable heading with tabindex=-1');
 const validate=value=>{if(!value||!ids.includes(value.chapterId)||!Number.isFinite(value.offset)||value.offset<0||value.offset>1)throw new TypeError('Invalid chapter state');return {chapterId:value.chapterId,offset:value.offset};};
 let current=validate(state??{chapterId:ids[0],offset:0});
 const original={className:host.getAttribute('class'),top:host.scrollTop,left:host.scrollLeft};
 const originals=sections.map(section=>({hidden:section.hidden,inert:section.inert,entered:section.classList.contains('is-entered')}));
 const win=host.ownerDocument.defaultView;let destroyed=false,frame=null,moving=null,observer=null,suppressReveal=false;const reveals=new Set();
 const sectionTop=section=>section.getBoundingClientRect().top-host.getBoundingClientRect().top+host.scrollTop-host.clientTop;
 const sectionHeight=section=>Math.max(1,section.getBoundingClientRect().height);
 const read=()=>{let i=0;for(let j=0;j<sections.length;j++)if(sectionTop(sections[j])<=host.scrollTop+1)i=j;const section=sections[i];return {chapterId:ids[i],offset:Math.max(0,Math.min(1,(host.scrollTop-sectionTop(section))/sectionHeight(section)))};};
 const update=()=>{if(destroyed)return;const next=read();if(next.chapterId!==current.chapterId||Math.abs(next.offset-current.offset)>0.0001){current=next;onChange({...current},{reason:'scroll'});}};
 const scroll=()=>{if(destroyed||frame!==null)return;frame=win.requestAnimationFrame(()=>{frame=null;update();});};
 const cancel=()=>{if(moving){win.cancelAnimationFrame(moving.frame);moving.resolve(false);moving=null;}};
 const position=next=>{const section=sections[ids.indexOf(next.chapterId)];host.scrollTop=sectionTop(section)+next.offset*sectionHeight(section);current=read();};
 host.classList.add('edk-chapters');sections.forEach(section=>{section.hidden=false;section.inert=false;});position(current);host.addEventListener('scroll',scroll,{passive:true});
 const interrupt=event=>{if(event.type!=='keydown'||['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))cancel();};
 for(const type of ['wheel','touchstart','pointerdown','keydown'])host.addEventListener(type,interrupt,{passive:true});
 // First observation establishes visible content without an entrance replay. Later entries are subtle.
 if(typeof win.IntersectionObserver==='function'){
  const seen=new WeakSet();observer=new win.IntersectionObserver(entries=>{for(const entry of entries){const section=entry.target,first=!seen.has(section);seen.add(section);if(!entry.isIntersecting)continue;section.classList.add('is-entered');if(first||suppressReveal||reducedMotion()||typeof section.animate!=='function')continue;observer.unobserve(section);const effect=section.animate([{opacity:.7,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,easing:'cubic-bezier(.22,1,.36,1)'});reveals.add(effect);effect.finished.catch(()=>{}).finally(()=>reveals.delete(effect));}suppressReveal=false;},{root:host,threshold:.12});sections.forEach(section=>observer.observe(section));
 }
 function setChapter(id,{focus=true,animate=true}={}){
  if(!ids.includes(id)||typeof focus!=='boolean'||typeof animate!=='boolean')throw new TypeError('Invalid chapter selection');if(destroyed)return Promise.resolve(false);cancel();
  const target=sections[ids.indexOf(id)],start=host.scrollTop,end=sectionTop(target);if(focus)headings[ids.indexOf(id)].focus({preventScroll:true});
  if(!animate||reducedMotion()||Math.abs(end-start)<1){host.scrollTop=end;update();return Promise.resolve(true);}
  return new Promise(resolve=>{const request={resolve,frame:null,started:null};moving=request;const step=time=>{if(destroyed||moving!==request)return;if(request.started===null)request.started=time;const progress=Math.min(1,(time-request.started)/300);host.scrollTop=start+(end-start)*(1-Math.pow(1-progress,3));update();if(progress<1)request.frame=win.requestAnimationFrame(step);else{moving=null;resolve(true);}};request.frame=win.requestAnimationFrame(step);});
 }
 function restore(next){const validated=validate(next);if(destroyed)return false;cancel();if(frame!==null){win.cancelAnimationFrame(frame);frame=null;}for(const effect of reveals)effect.cancel();suppressReveal=true;position(validated);return true;}
 return {getState:()=>({...current,...(!destroyed?read():{})}),setChapter,restore,destroy(){if(destroyed)return;destroyed=true;cancel();observer?.disconnect();for(const effect of reveals)effect.cancel();if(frame!==null)win.cancelAnimationFrame(frame);host.removeEventListener('scroll',scroll);for(const type of ['wheel','touchstart','pointerdown','keydown'])host.removeEventListener(type,interrupt);sections.forEach((section,i)=>{section.hidden=originals[i].hidden;section.inert=originals[i].inert;section.classList.toggle('is-entered',originals[i].entered);});if(original.className===null)host.removeAttribute('class');else host.setAttribute('class',original.className);host.scrollTop=original.top;host.scrollLeft=original.left;}};
}
