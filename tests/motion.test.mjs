import test from 'node:test';
import assert from 'node:assert/strict';
import {mountDisclosureMotion,mountPresenceMotion,mountSelectionMotion} from '../skills/editorial-design/assets/editorial/motion.mjs';
function region(hidden=true){
 const style={getPropertyValue:key=>style[key]||'',getPropertyPriority:()=>'',setProperty:(key,v)=>style[key]=v,removeProperty:key=>delete style[key]};
 const animations=[];const win={getComputedStyle:()=>({opacity:'0.45',translate:'6px 0'}),addEventListener(){},removeEventListener(){}};
 const el={style,hidden,inert:hidden,ownerDocument:{defaultView:win},getBoundingClientRect:()=>({height:120,left:10,width:80}),animate(frames){let resolve,reject;const a={frames,finished:new Promise((yes,no)=>{resolve=yes;reject=no;}),finish:()=>resolve(),cancel:()=>reject(new Error('cancelled'))};animations.push(a);return a;},animations};return el;
}
test('interrupted disclosure cannot apply stale visibility and settles natural height',async()=>{
 const el=region(),motion=mountDisclosureMotion(el,{reducedMotion:()=>false});const opening=motion.setExpanded(true);assert.equal(el.hidden,false);assert.equal(el.inert,false);const closing=motion.setExpanded(false);assert.equal(el.inert,true);assert.equal(await opening,false);el.animations.at(-1).finish();assert.equal(await closing,true);assert.equal(el.hidden,true);assert.equal(el.style.height,undefined);
 const reopened=motion.setExpanded(true);el.animations.at(-1).finish();assert.equal(await reopened,true);assert.equal(el.hidden,false);assert.equal(el.style.height,undefined);motion.destroy();assert.equal(el.hidden,true);
});
test('dynamic reduced motion cancels ongoing presence and immediately applies latest state',async()=>{
 const el=region();let reduced=false;const motion=mountPresenceMotion(el,{reducedMotion:()=>reduced});const opening=motion.setVisible(true);reduced=true;assert.equal(await motion.setVisible(false),true);assert.equal(await opening,false);assert.equal(el.hidden,true);assert.equal(el.inert,true);assert.equal(el.animations.length,1);assert.equal(await motion.setVisible(true),true);assert.equal(el.hidden,false);assert.equal(el.inert,false);motion.destroy();assert.equal(await motion.setVisible(true),false);
});
test('selection geometry follows actual target width and rejects foreign controls',async()=>{
 const marker=region(),host=region(false);marker.ownerDocument=host.ownerDocument;host.scrollLeft=0;host.clientLeft=0;const target={getBoundingClientRect:()=>({left:37,width:113})};host.contains=el=>el===marker||el===target;const motion=mountSelectionMotion(host,marker,{reducedMotion:()=>true});assert.equal(await motion.moveTo(target),true);assert.equal(marker.style.left,'27px');assert.equal(marker.style.width,'113px');await assert.rejects(motion.moveTo({}),/belong/);motion.destroy();assert.equal(marker.style.left,undefined);
});
test('invalid animation options and states are explicit',async()=>{
 const el=region();assert.throws(()=>mountPresenceMotion(el,{offset:Infinity}),/finite/);assert.throws(()=>mountDisclosureMotion(el,{duration:-1}),/Invalid/);await assert.rejects(mountDisclosureMotion(el).setExpanded('yes'),/boolean/);
});
