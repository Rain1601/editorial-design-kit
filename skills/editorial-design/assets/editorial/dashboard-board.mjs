/** A stateful presentation adapter. Module contents and business data stay caller-owned. */
const preference=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
const defaults={close:'Back to dashboard',modules:'Other modules',reorderHint:'Press Space to reorder; arrow keys move; Enter saves; Escape cancels.',grabbed:'Reordering',moved:'Position',dropped:'Order saved',cancelled:'Reorder cancelled',titles:{}};
export function validateDashboardState(ids,state={order:ids,expandedId:null}){
 if(!Array.isArray(ids)||ids.some(id=>typeof id!=='string'||!id)||new Set(ids).size!==ids.length||!ids.length)throw new TypeError('Modules require unique nonempty IDs');
 if(!state||!Array.isArray(state.order)||state.order.length!==ids.length||new Set(state.order).size!==ids.length||state.order.some(id=>!ids.includes(id))||!(state.expandedId===null||ids.includes(state.expandedId)))throw new TypeError('Dashboard state must name every module exactly once and a known expanded module');
 return {order:[...state.order],expandedId:state.expandedId};
}
export function moveDashboardModule(order,id,target){
 if(!Array.isArray(order)||new Set(order).size!==order.length||!order.includes(id)||!Number.isInteger(target)||target<0||target>=order.length)throw new TypeError('Invalid reorder');
 const result=[...order];result.splice(result.indexOf(id),1);result.splice(target,0,id);return result;
}
export function mountDashboardBoard(host,{state,onChange=()=>{},labels={},reducedMotion=preference,scrollOffset=24}={}){
 if(!host?.ownerDocument||typeof onChange!=='function'||typeof reducedMotion!=='function'||!Number.isFinite(scrollOffset)||scrollOffset<0)throw new TypeError('A host and valid callbacks are required');
 const cards=[...host.children].filter(el=>el.hasAttribute('data-module-id')),ids=cards.map(el=>el.dataset.moduleId),byId=new Map(cards.map(el=>[el.dataset.moduleId,el]));
 let model=validateDashboardState(ids,state),copy={...defaults,...labels,titles:{...labels.titles}},drag=null,destroyed=false,returnFocus=null,returnScroll=null,returnAnchor=null;
 const doc=host.ownerDocument,win=doc.defaultView,originalNodes=[...host.childNodes],animations=new Map();
 const snapshots=cards.map(card=>({card,hidden:card.hidden,inert:card.inert,className:card.className,style:card.getAttribute('style'),expand:[...card.querySelectorAll('[data-expand-module]')].map(button=>({button,value:button.getAttribute('aria-expanded')}))}));
 const hostClass=host.className;
 host.classList.add('edk-dashboard-board');cards.forEach(card=>card.classList.add('edk-dashboard-card'));
 const tools=doc.createElement('div');tools.className='edk-dashboard-tools';tools.hidden=true;
 const close=doc.createElement('button');close.type='button';close.dataset.closeModule='';tools.append(close);
 const rail=doc.createElement('nav');rail.className='edk-dashboard-rail';rail.hidden=true;
 const live=doc.createElement('span');live.className='edk-dashboard-live';live.setAttribute('role','status');live.setAttribute('aria-live','polite');
 const hint=doc.createElement('span');hint.className='edk-dashboard-live';hint.id='edk-dashboard-hint-'+Math.random().toString(36).slice(2);
 const handles=cards.flatMap(card=>[...card.querySelectorAll('[data-drag-handle]')].map(handle=>({handle,described:handle.getAttribute('aria-describedby')})));
 for(const {handle,described} of handles)handle.setAttribute('aria-describedby',[described,hint.id].filter(Boolean).join(' '));
 host.append(tools,rail,live,hint);
 const notify=()=>onChange(getState());
 function getState(){return {order:[...model.order],expandedId:model.expandedId};}
 function title(id){return copy.titles[id]??byId.get(id).dataset.moduleTitle??id;}
 function animateLayout(before){
  for(const card of cards){animations.get(card)?.cancel();animations.delete(card);if(card.hidden||card===drag?.card)continue;const prior=before.get(card),next=card.getBoundingClientRect();if(!prior||!next.width||!next.height||reducedMotion()||!card.animate)continue;
   const dx=prior.left-next.left,dy=prior.top-next.top,sx=prior.width/next.width,sy=prior.height/next.height;if(Math.abs(dx)+Math.abs(dy)+Math.abs(sx-1)+Math.abs(sy-1)<.1)continue;
   const animation=card.animate([{transform:`translate(${dx}px,${dy}px) scale(${sx},${sy})`,transformOrigin:'top left'},{transform:'none',transformOrigin:'top left'}],{duration:260,easing:'cubic-bezier(.22,1,.36,1)'});animations.set(card,animation);animation.finished.catch(()=>{}).finally(()=>{if(animations.get(card)===animation)animations.delete(card);});
  }
 }
 const measure=()=>new Map(cards.filter(card=>!card.hidden).map(card=>[card,card.getBoundingClientRect()]));
 function reorder(order,before=measure()){for(const id of order)host.insertBefore(drag?.id===id&&drag.placeholder?drag.placeholder:byId.get(id),tools);if(drag)drag.handle.focus({preventScroll:true});animateLayout(before);}
 function renderRail(){const focused=rail.contains(doc.activeElement)?doc.activeElement.dataset.selectModule:null;rail.replaceChildren();rail.setAttribute('aria-label',copy.modules);for(const id of model.order){if(id===model.expandedId)continue;const button=doc.createElement('button');button.type='button';button.dataset.selectModule=id;button.textContent=title(id);rail.append(button);}if(focused)[...rail.children].find(button=>button.dataset.selectModule===focused)?.focus({preventScroll:true});}
 function render(){for(const card of cards){const active=model.expandedId===card.dataset.moduleId;card.hidden=model.expandedId!==null&&!active;card.inert=card.hidden;card.classList.toggle('is-expanded',active);for(const expand of card.querySelectorAll('[data-expand-module]'))expand.setAttribute('aria-expanded',String(active));}
  tools.hidden=rail.hidden=model.expandedId===null;renderRail();close.textContent=copy.close;hint.textContent=copy.reorderHint;
 }
 function setExpanded(id,{focus=true,emit=true,animate=true}={}){
  if(id!==null&&!byId.has(id))throw new TypeError('Unknown module');if(destroyed||id===model.expandedId)return;
  if(drag)finish(false);const before=animate?measure():new Map();const opening=model.expandedId===null&&id!==null;if(opening){returnFocus=doc.activeElement;returnScroll={left:win.scrollX,top:win.scrollY};returnAnchor={id,top:byId.get(id).getBoundingClientRect().top};}
  for(const animation of animations.values())animation.cancel();animations.clear();model.expandedId=id;render();
  const anchorCard=id===null&&returnAnchor?byId.get(returnAnchor.id):null,anchorTop=anchorCard&&!anchorCard.hidden?anchorCard.getBoundingClientRect().top:null;
  const restoredTop=Number.isFinite(anchorTop)&&Number.isFinite(returnAnchor?.top)?Math.max(0,win.scrollY+anchorTop-returnAnchor.top):returnScroll?.top;
  if(animate)animateLayout(before);
  if(focus){if(id!==null)close.focus({preventScroll:true});else if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});}
  if(opening){const rect=host.getBoundingClientRect();if(rect.top<scrollOffset||rect.top>win.innerHeight-100)win.scrollTo?.({left:win.scrollX,top:Math.max(0,win.scrollY+rect.top-scrollOffset),behavior:'instant'});}else if(id===null&&returnScroll){win.scrollTo?.({...returnScroll,top:restoredTop,behavior:'instant'});returnScroll=null;returnAnchor=null;}
  if(emit)notify();
 }
 function begin(id,handle,pointer=null){if(model.expandedId!==null||drag||destroyed)return;const card=byId.get(id);animations.get(card)?.cancel();animations.delete(card);drag={id,card,handle,order:[...model.order],draft:[...model.order],pointer};live.textContent=copy.grabbed+' '+title(id);handle.setAttribute('aria-pressed','true');card.classList.add('is-reordering');
  if(pointer){const rect=card.getBoundingClientRect(),style=win.getComputedStyle(card),placeholder=doc.createElement('div');placeholder.className='edk-dashboard-placeholder';placeholder.style.gridColumn=style.gridColumn;placeholder.style.gridRow=style.gridRow;placeholder.style.height=rect.height+'px';card.before(placeholder);drag.placeholder=placeholder;drag.style=card.getAttribute('style');drag.rect=rect;card.style.cssText+=`;position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;z-index:40;pointer-events:none;grid-column:auto;grid-row:auto;`;handle.setPointerCapture?.(pointer.id);}
 }
 function preview(target){const index=drag.draft.indexOf(drag.id);if(target===index)return;drag.draft=moveDashboardModule(drag.draft,drag.id,target);reorder(drag.draft);live.textContent=copy.moved+' '+(target+1)+' / '+ids.length;}
 function finish(commit){if(!drag)return;const current=drag,before=measure();drag=null;if(current.pointer){current.handle.releasePointerCapture?.(current.pointer.id);if(current.style===null)current.card.removeAttribute('style');else current.card.setAttribute('style',current.style);current.placeholder.replaceWith(current.card);}
  current.card.classList.remove('is-reordering');current.handle.removeAttribute('aria-pressed');model.order=commit?current.draft:current.order;reorder(model.order,before);current.handle.focus({preventScroll:true});live.textContent=commit?copy.dropped:copy.cancelled;if(commit)notify();
 }
 const click=e=>{const expand=e.target.closest('[data-expand-module]'),select=e.target.closest('[data-select-module]'),collapse=e.target.closest('[data-close-module]');if(expand&&host.contains(expand)){const card=expand.closest('[data-module-id]');if(byId.get(card?.dataset.moduleId)===card)setExpanded(card.dataset.moduleId);}else if(select&&rail.contains(select))setExpanded(select.dataset.selectModule);else if(collapse&&host.contains(collapse))setExpanded(null);};
 const down=e=>{if(e.button!==0||e.isPrimary===false)return;const handle=e.target.closest('[data-drag-handle]');if(!handle||!host.contains(handle)||model.expandedId!==null)return;const card=handle.closest('[data-module-id]');if(byId.get(card?.dataset.moduleId)!==card)return;e.preventDefault();handle.focus({preventScroll:true});begin(card.dataset.moduleId,handle,{id:e.pointerId,x:e.clientX,y:e.clientY});};
 const move=e=>{if(!drag?.pointer||drag.pointer.id!==e.pointerId)return;e.preventDefault();drag.card.style.transform=`translate(${e.clientX-drag.pointer.x}px,${e.clientY-drag.pointer.y}px)`;let best=Infinity,target=drag.draft.indexOf(drag.id);for(let i=0;i<drag.draft.length;i++){const node=drag.draft[i]===drag.id?drag.placeholder:byId.get(drag.draft[i]),r=node.getBoundingClientRect(),d=(e.clientX-(r.left+r.width/2))**2+(e.clientY-(r.top+r.height/2))**2;if(d<best){best=d;target=i;}}preview(target);};
 const up=e=>{if(drag?.pointer?.id===e.pointerId)finish(true);};const cancel=e=>{if(drag?.pointer?.id===e.pointerId)finish(false);};
 const key=e=>{if(e.key==='Escape'){if(drag){e.preventDefault();finish(false);}else if(model.expandedId!==null){e.preventDefault();setExpanded(null);}return;}const handle=e.target.closest('[data-drag-handle]');if(!handle||!host.contains(handle))return;
  if((e.key===' '||e.key==='Enter')&&!drag){e.preventDefault();begin(handle.closest('[data-module-id]').dataset.moduleId,handle);}else if(drag&&drag.handle===handle){if(e.key===' '||e.key==='Enter'){e.preventDefault();finish(true);}else if(['ArrowLeft','ArrowUp','ArrowRight','ArrowDown'].includes(e.key)){e.preventDefault();preview(Math.max(0,Math.min(ids.length-1,drag.draft.indexOf(drag.id)+(['ArrowLeft','ArrowUp'].includes(e.key)?-1:1))));}}
 };
 const listeners=[[host,'click',click],[host,'pointerdown',down],[win,'pointermove',move],[win,'pointerup',up],[win,'pointercancel',cancel],[host,'lostpointercapture',cancel],[host,'keydown',key],[win,'blur',()=>finish(false)],[win,'resize',()=>finish(false)]];for(const [el,type,handler]of listeners)el.addEventListener(type,handler);
 reorder(model.order);render();
 return {getState,setExpanded,setLabels(next){if(destroyed)return;if(!next||typeof next!=='object')throw new TypeError('Labels required');copy={...copy,...next,titles:{...copy.titles,...next.titles}};live.textContent='';renderRail();close.textContent=copy.close;hint.textContent=copy.reorderHint;},destroy(){if(destroyed)return;finish(false);destroyed=true;for(const [el,type,handler]of listeners)el.removeEventListener(type,handler);for(const animation of animations.values())animation.cancel();for(const {handle,described}of handles){if(described===null)handle.removeAttribute('aria-describedby');else handle.setAttribute('aria-describedby',described);}for(const saved of snapshots){saved.card.hidden=saved.hidden;saved.card.inert=saved.inert;saved.card.className=saved.className;if(saved.style===null)saved.card.removeAttribute('style');else saved.card.setAttribute('style',saved.style);for(const {button,value} of saved.expand){if(value===null)button.removeAttribute('aria-expanded');else button.setAttribute('aria-expanded',value);}}tools.remove();rail.remove();live.remove();hint.remove();for(const node of originalNodes)host.append(node);host.className=hostClass;}};
}
