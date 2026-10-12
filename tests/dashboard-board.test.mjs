import test from 'node:test';
import assert from 'node:assert/strict';
import {validateDashboardState,moveDashboardModule,mountDashboardBoard} from '../skills/editorial-design/assets/editorial/dashboard-board.mjs';
const ids=['hero','queue','notes','coverage'];
test('saved module order and expansion are independently restored without mutating caller state',()=>{
 const state={order:['notes','hero','coverage','queue'],expandedId:'coverage'};
 const result=validateDashboardState(ids,state);result.order.reverse();assert.deepEqual(state.order,['notes','hero','coverage','queue']);assert.equal(result.expandedId,'coverage');
});
test('unknown, omitted, duplicated and invalid expanded modules are rejected',()=>{
 for(const state of [{order:['hero','queue','notes'],expandedId:null},{order:['hero','queue','notes','notes'],expandedId:null},{order:['hero','queue','notes','other'],expandedId:null},{order:ids,expandedId:'other'},{order:ids,expandedId:undefined}])assert.throws(()=>validateDashboardState(ids,state),TypeError);
 assert.throws(()=>validateDashboardState(['same','same']),TypeError);assert.throws(()=>validateDashboardState([]),TypeError);
});
test('keyboard position updates preserve all identities and cancel can restore original snapshot',()=>{
 const original=[...ids];let preview=moveDashboardModule(original,'hero',3);assert.deepEqual(preview,['queue','notes','coverage','hero']);preview=moveDashboardModule(preview,'hero',1);assert.deepEqual(preview,['queue','hero','notes','coverage']);assert.deepEqual(original,ids);assert.deepEqual(moveDashboardModule(preview,'hero',0),ids);
});
test('reorder rejects out-of-range, fractional and unknown targets',()=>{
 for(const index of [-1,4,1.2])assert.throws(()=>moveDashboardModule(ids,'hero',index),TypeError);assert.throws(()=>moveDashboardModule(ids,'missing',0),TypeError);
});
test('invalid restored state fails before DOM mutation',()=>{
 let mutation=false;const host={ownerDocument:{},children:ids.map(id=>({hasAttribute:()=>true,dataset:{moduleId:id}})),classList:{add(){mutation=true;}}};
 assert.throws(()=>mountDashboardBoard(host,{state:{order:['hero'],expandedId:null}}),TypeError);assert.equal(mutation,false);
});

function fixture(){
 class Element{
  constructor(tag='DIV'){this.tagName=tag;this.children=[];this.dataset={};this.attrs=new Map();this.hidden=false;this.inert=false;this.className='';this.parentNode=null;this.isConnected=true;this.listeners=new Map();this.style={};this.classList={add:name=>{this.className+=' '+name;},toggle:(name,on)=>{this.className=this.className.split(' ').filter(s=>s!==name).concat(on?[name]:[]).join(' ');},remove:name=>this.classList.toggle(name,false)};}
  get childNodes(){return this.children;}setAttribute(key,value){this.attrs.set(key,String(value));if(key.startsWith('data-'))this.dataset[key.slice(5).replace(/-([a-z])/g,(_,a)=>a.toUpperCase())]=String(value);}getAttribute(key){return this.attrs.get(key)??null;}hasAttribute(key){return this.attrs.has(key);}removeAttribute(key){this.attrs.delete(key);}
  append(...nodes){for(const n of nodes){n.remove();n.parentNode=this;this.children.push(n);}}insertBefore(n,before){n.remove();n.parentNode=this;const i=this.children.indexOf(before);this.children.splice(i<0?this.children.length:i,0,n);}remove(){if(this.parentNode){if(this.contains(doc.activeElement))doc.activeElement=doc.body;this.parentNode.children.splice(this.parentNode.children.indexOf(this),1);this.parentNode=null;}}replaceChildren(...nodes){for(const n of [...this.children])n.remove();this.append(...nodes);}
  contains(n){return n===this||this.children.some(child=>child.contains(n));}querySelectorAll(selector){const attr=selector.slice(1,-1);return this.children.flatMap(child=>[...(child.hasAttribute(attr)?[child]:[]),...child.querySelectorAll(selector)]);}closest(selector){const attr=selector.slice(1,-1);return this.hasAttribute(attr)?this:this.parentNode?.closest(selector)??null;}
  addEventListener(type,fn){this.listeners.set(type,fn);}removeEventListener(type){this.listeners.delete(type);}focus(){doc.activeElement=this;}getBoundingClientRect(){return {left:0,top:(this.documentTop??0)-win.scrollY,width:100,height:100};}
 }
 const win={scrollX:0,scrollY:140,innerHeight:700,addEventListener(){},removeEventListener(){},scrollTo(value){this.scrollY=value.top;this.scrollX=value.left;}};
 const doc={defaultView:win,activeElement:null,createElement(tag){const el=new Element(tag.toUpperCase());el.ownerDocument=doc;return el;}};
 doc.body=doc.createElement('body');doc.activeElement=doc.body;const host=doc.createElement('div');const handles=[],cards=[];for(const id of ['a','b','c']){const card=doc.createElement('article');card.setAttribute('data-module-id',id);card.documentTop=cards.length*300;const handle=doc.createElement('button');handle.setAttribute('data-drag-handle','');const expand=doc.createElement('button');expand.setAttribute('data-expand-module','');card.append(handle,expand);host.append(card);handles.push(handle);cards.push(card);}
 return {host,handles,cards,doc,win,key(handle,key){host.listeners.get('keydown')({target:handle,key,preventDefault(){}});}};
}
test('keyboard draft only commits on Enter and Escape restores original DOM order',()=>{
 const f=fixture(),changes=[];const board=mountDashboardBoard(f.host,{reducedMotion:()=>true,onChange:s=>changes.push(s)});
 f.key(f.handles[0],' ');f.key(f.handles[0],'ArrowRight');assert.deepEqual(board.getState().order,['a','b','c']);assert.deepEqual(f.host.children.filter(el=>el.dataset.moduleId).map(el=>el.dataset.moduleId),['b','a','c']);f.key(f.handles[0],'Escape');assert.deepEqual(board.getState().order,['a','b','c']);assert.equal(changes.length,0);
 f.key(f.handles[0],' ');f.key(f.handles[0],'ArrowRight');f.key(f.handles[0],'Enter');assert.deepEqual(board.getState().order,['b','a','c']);assert.equal(changes.length,1);board.destroy();assert.deepEqual(f.host.children,f.cards);
});
test('expansion retains original content nodes and close restores caller focus and scroll',()=>{
 const f=fixture();const board=mountDashboardBoard(f.host,{reducedMotion:()=>true});const original=f.cards[1].children[0];original.focus();board.setExpanded('b');assert.equal(f.cards[1].children[0],original);assert.equal(f.cards[0].hidden,true);assert.equal(f.cards[1].hidden,false);board.setLabels({close:'返回',titles:{a:'模块 A'}});assert.equal(board.getState().expandedId,'b');f.win.scrollY=600;board.setExpanded('c');board.setExpanded(null);assert.equal(f.doc.activeElement,original);assert.equal(f.win.scrollY,140);assert.equal(f.cards.every(c=>!c.hidden),true);board.destroy();
});

test('close restores module viewport offset after localized content changes layout height',()=>{
 const f=fixture(),board=mountDashboardBoard(f.host,{reducedMotion:()=>true});f.handles[1].focus();const viewportTop=f.cards[1].getBoundingClientRect().top;board.setExpanded('b');f.cards[1].documentTop+=80;board.setLabels({close:'Return',titles:{a:'A'}});board.setExpanded(null);assert.equal(f.cards[1].getBoundingClientRect().top,viewportTop);assert.equal(f.win.scrollY,220);board.destroy();
});

test('native keyboard sequence keeps focus through DOM moves until commit',()=>{
 const f=fixture(),board=mountDashboardBoard(f.host,{reducedMotion:()=>true});f.handles[0].focus();
 const nativeKey=key=>{const target=f.doc.activeElement;if(f.host.contains(target))f.key(target,key);};
 nativeKey(' ');nativeKey('ArrowRight');assert.equal(f.doc.activeElement,f.handles[0]);nativeKey('ArrowRight');assert.equal(f.doc.activeElement,f.handles[0]);nativeKey('Enter');assert.deepEqual(board.getState().order,['b','c','a']);assert.equal(f.doc.activeElement,f.handles[0]);board.destroy();
});
