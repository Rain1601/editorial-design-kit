import test from 'node:test';
import assert from 'node:assert/strict';
import {mountDetailsMotion} from '../skills/editorial-design/assets/editorial/motion.mjs';

class Element {
 constructor(tag,doc){this.tagName=tag.toUpperCase();this.ownerDocument=doc;this.childNodes=[];this.attributes=new Map();this.events=new Map();this.hidden=false;this.inert=false;this.animations=[];this.focusCalls=0;
  const values=new Map();this.style={getPropertyValue:k=>values.get(k)||'',getPropertyPriority:()=>'',setProperty:(k,v)=>values.set(k,v),removeProperty:k=>values.delete(k)};
 }
 get children(){return this.childNodes.filter(node=>node.tagName);}
 append(...nodes){for(const node of nodes){node.remove();node.parentNode=this;this.childNodes.push(node);}}
 insertBefore(node,before){node.remove();node.parentNode=this;const at=this.childNodes.indexOf(before);if(at<0)this.childNodes.push(node);else this.childNodes.splice(at,0,node);}
 remove(){if(this.parentNode){const parent=this.parentNode;parent.childNodes=parent.childNodes.filter(node=>node!==this);this.parentNode=null;}}
 contains(node){return node===this||this.childNodes.some(child=>child===node||child.contains?.(node));}
 setAttribute(k,v){this.attributes.set(k,String(v));}
 removeAttribute(k){this.attributes.delete(k);}
 getAttribute(k){return this.attributes.get(k)??null;}
 addEventListener(type,fn){const listeners=this.events.get(type)||new Set();listeners.add(fn);this.events.set(type,listeners);}
 removeEventListener(type,fn){this.events.get(type)?.delete(fn);}
 dispatchClick(){let prevented=false;for(const fn of this.events.get('click')||[])fn({preventDefault(){prevented=true;}});return prevented;}
 focus(options){this.focusCalls++;this.focusOptions=options;this.ownerDocument.activeElement=this;}
 getBoundingClientRect(){return {height:this.hidden?0:120,left:0,width:200};}
 animate(frames){let resolve,reject;const result={frames,cancelled:false,finished:new Promise((yes,no)=>{resolve=yes;reject=no;}),finish(){resolve();},cancel(){this.cancelled=true;reject(new Error('cancelled'));}};this.animations.push(result);return result;}
}
class TextNode {
 constructor(text){this.textContent=text;}
 remove(){if(this.parentNode){const parent=this.parentNode;parent.childNodes=parent.childNodes.filter(node=>node!==this);this.parentNode=null;}}
}
function fixture({leadingText=false}={}){
 const doc={activeElement:null,defaultView:{}};doc.createElement=tag=>new Element(tag,doc);
 const details=doc.createElement('details'),summary=doc.createElement('summary'),body=doc.createElement('p'),button=doc.createElement('button');details.open=true;body.append(button);
 details.append(...(leadingText?[new TextNode('\n')]:[]),summary,new TextNode('\n'),body,new TextNode('\n'));
 const original=[...details.childNodes],outside=doc.createElement('button');doc.activeElement=outside;
 const motion=mountDetailsMotion(details,{reducedMotion:()=>false});const region=details.childNodes.at(-1);
 return {doc,details,summary,body,button,outside,original,motion,region};
}

test('logical close is immediate while native details stays open through the current transition',async()=>{
 const {motion,details,region,summary}=fixture();const closing=motion.setExpanded(false);
 assert.equal(motion.getExpanded(),false);assert.equal(details.open,true);assert.equal(summary.getAttribute('aria-expanded'),'false');assert.equal(region.inert,true);
 region.animations.at(-1).finish();assert.equal(await closing,true);assert.equal(details.open,false);assert.equal(region.hidden,true);motion.destroy();
});
test('interrupted close cannot overwrite a reopened details state',async()=>{
 const {motion,details,region}=fixture();const closing=motion.setExpanded(false),old=region.animations.at(-1);const reopening=motion.setExpanded(true);
 assert.equal(motion.getExpanded(),true);assert.equal(await closing,false);old.finish();assert.equal(details.open,true);
 region.animations.at(-1).finish();assert.equal(await reopening,true);assert.equal(details.open,true);assert.equal(region.hidden,false);assert.equal(region.inert,false);motion.destroy();
});
test('restoring without animation cancels previous travel and settles the latest state',async()=>{
 const {motion,details,region}=fixture();const closing=motion.setExpanded(false),old=region.animations.at(-1);
 const restored=motion.setExpanded(false,{animate:false});assert.equal(motion.getExpanded(),false);assert.equal(region.hidden,true);assert.equal(region.inert,true);
 assert.equal(await restored,true);assert.equal(await closing,false);assert.equal(old.cancelled,true);assert.equal(region.animations.length,1);assert.equal(details.open,false);
 old.finish();assert.equal(details.open,false);motion.destroy();
});
test('closing returns focus only from within the disappearing content',async()=>{
 const {motion,doc,summary,button,outside}=fixture();await motion.setExpanded(false,{animate:false});assert.equal(doc.activeElement,outside);assert.equal(summary.focusCalls,0);
 await motion.setExpanded(true,{animate:false});doc.activeElement=button;await motion.setExpanded(false,{animate:false});assert.equal(doc.activeElement,summary);assert.equal(summary.focusCalls,1);assert.deepEqual(summary.focusOptions,{preventScroll:true});motion.destroy();
});
test('destroy cancels transitions, removes click handling and restores all original child positions',async()=>{
 const {motion,details,summary,original,region}=fixture({leadingText:true});const closing=motion.setExpanded(false);motion.destroy();
 assert.equal(await closing,false);assert.equal(details.open,false);assert.equal(details.childNodes.length,original.length);original.forEach((node,index)=>assert.equal(details.childNodes[index]===node,true,`original child ${index} restored to its original position`));assert.equal(region.parentNode,null);assert.equal(summary.getAttribute('aria-expanded'),null);
 assert.equal(summary.dispatchClick(),false);assert.equal(details.open,false);assert.equal(await motion.setExpanded(true),false);motion.destroy();
});
