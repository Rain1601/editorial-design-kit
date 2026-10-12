import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeTaskExecution} from '../skills/editorial-design/assets/editorial/agent-execution.mjs';
import {normalizeTaskApproval} from '../skills/editorial-design/assets/editorial/agent-approval.mjs';

const execution = () => ({status:'Reviewing dataset', description:'Read two supplied files', tone:'running', entries:[{id:'read/csv:2026',text:'Opened dataset'}, {id:'verify-α',text:'Checked column types'}]});
const approval = () => ({request:{id:'publish-chart-3',title:'Select output',description:'Choose a reviewed format',acknowledgement:'I checked the underlying data',options:[{id:'svg',label:'SVG',description:'Vector'}, {id:'csv',label:'CSV',description:'Raw data'}, {id:'pdf',label:'PDF',description:'Document'}]},status:'pending',selectedId:'csv',acknowledged:true});

test('execution preserves arbitrary runtime text and independent entry identities without mutating input', () => {
  const value = execution(); const before = structuredClone(value); const result = normalizeTaskExecution(value);
  assert.deepEqual(result, before); result.entries[0].text = 'changed'; assert.deepEqual(value,before);
});
test('execution rejects duplicate events, missing text and invented tones', () => {
  const value = execution(); value.entries.push({...value.entries[0]}); assert.throws(()=>normalizeTaskExecution(value),/Duplicate/);
  assert.throws(()=>normalizeTaskExecution({...execution(),entries:[{id:'x'}]}),/text/);
  assert.throws(()=>normalizeTaskExecution({...execution(),tone:'90%'}),/tone/);
});
test('approval supports arbitrary options and returns a detached request', () => {
  const value = approval(); const before = structuredClone(value); const result=normalizeTaskApproval(value);
  assert.equal(result.request.options.length,3); assert.equal(result.selectedId,'csv'); result.request.options[0].label='changed'; assert.deepEqual(value,before);
});
test('approval rejects unknown selection and duplicate options instead of accepting a stale choice', () => {
  assert.throws(()=>normalizeTaskApproval({...approval(),selectedId:'brief'}),/does not belong/);
  const value=approval(); value.request.options.push({...value.request.options[0]}); assert.throws(()=>normalizeTaskApproval(value),/Duplicate/);
});
test('absence of a request requires a hidden and unacknowledged state', () => {
  assert.deepEqual(normalizeTaskApproval({request:null,status:'hidden',selectedId:null,acknowledged:false}),{request:null,status:'hidden',selectedId:null,acknowledged:false});
  assert.throws(()=>normalizeTaskApproval({...approval(),request:null}),/No request/);
  assert.throws(()=>normalizeTaskApproval({request:null,status:'hidden',selectedId:null,acknowledged:true}),/No request/);
});
test('terminal approval is represented separately from pending approval', () => {
  const terminal=normalizeTaskApproval({...approval(),status:'approved'}); assert.equal(terminal.status,'approved');
  assert.throws(()=>normalizeTaskApproval({...approval(),status:'running'}),/status/);
});

// Small DOM boundary fixture: exercise the approval gate and stable mounted controls.
class Node {
  constructor(tag, doc) {this.tagName=tag;this.ownerDocument=doc;this.children=[];this.dataset={};this.listeners=new Map();this.textContent='';}
  append(...nodes) {for(const node of nodes){node.remove();node.parentElement=this;this.children.push(node);}}
  remove(){if(this.parentElement){const p=this.parentElement;p.children=p.children.filter(x=>x!==this);this.parentElement=null;}}
  replaceChildren(...nodes){for(const old of [...this.children])old.remove();this.append(...nodes);}
  insertBefore(node,at){node.remove();const i=at?this.children.indexOf(at):-1;node.parentElement=this;if(i<0)this.children.push(node);else this.children.splice(i,0,node);}
  setAttribute(key,value){this[key]=value;}
  querySelector(tag){for(const child of this.children){if(child.tagName===tag)return child;const nested=child.querySelector(tag);if(nested)return nested;}return null;}
  addEventListener(type,fn){const items=this.listeners.get(type)||new Set();items.add(fn);this.listeners.set(type,items);}
  removeEventListener(type,fn){this.listeners.get(type)?.delete(fn);}
  dispatch(type,target=this){for(const fn of this.listeners.get(type)||[])fn({target});}
}
const host = () => {const doc={createElement:tag=>new Node(tag,doc)};return new Node('div',doc);};
const approvalLabels={decision:'Decision',scope:'Options',approve:'Approve',reject:'Reject',chooseFirst:'Choose first',acknowledgeFirst:'Acknowledge first',ready:'Ready',approved:'Approved'};
const {mountTaskApproval}=await import('../skills/editorial-design/assets/editorial/agent-approval.mjs');
const {mountTaskExecution}=await import('../skills/editorial-design/assets/editorial/agent-execution.mjs');

test('approval dispatches only a valid pending gate, includes request identity and blocks terminal actions',()=>{
  const actions=[];const mounted=mountTaskApproval(host(),{labels:approvalLabels,onAction:action=>actions.push(action)});
  const value=approval();mounted.update({...value,acknowledged:false});mounted.elements.approve.dispatch('click');assert.deepEqual(actions,[]);
  mounted.update(value);mounted.elements.approve.dispatch('click');assert.deepEqual(actions,[{type:'approve',id:'csv',requestId:'publish-chart-3'}]);
  mounted.update({...value,status:'approved'});mounted.elements.approve.dispatch('click');mounted.elements.reject.dispatch('click');assert.equal(actions.length,1);
  mounted.destroy();mounted.elements.approve.dispatch('click');assert.equal(actions.length,1);
});
test('new request IDs require fresh confirmation even when option identities repeat',()=>{
  const actions=[];const mounted=mountTaskApproval(host(),{labels:approvalLabels,onAction:a=>actions.push(a)});const value=approval();mounted.update(value);
  mounted.update({...value,request:{...value.request,id:'new-request'}});assert.equal(mounted.elements.ack.checked,false);assert.equal(mounted.elements.approve.disabled,true);
  mounted.elements.approve.dispatch('click');assert.deepEqual(actions,[]);assert.equal(value.acknowledged,true);
});
test('language updates retain controls and invalid models cannot partially alter the mounted gate',()=>{
  const mounted=mountTaskApproval(host(),{labels:approvalLabels});const value=approval();mounted.update(value);const csv=mounted.elements.inputs.get('csv');
  mounted.update(value,{labels:{...approvalLabels,scope:'范围'},language:'zh'});assert.equal(mounted.elements.inputs.get('csv'),csv);assert.equal(mounted.elements.legend.textContent,'范围');
  assert.throws(()=>mounted.update({...value,request:{...value.request,title:'Must not appear'},selectedId:'unknown'}));assert.equal(mounted.elements.title.textContent,value.request.title);assert.equal(mounted.elements.inputs.get('csv'),csv);
});
test('execution labels update without closing details or replacing retained log entries',()=>{
  const mounted=mountTaskExecution(host(),{labels:{log:'Execution',logEmpty:'No events'}});mounted.update(execution());mounted.elements.details.open=true;const first=mounted.elements.logs.children[0];
  mounted.update(execution(),{labels:{log:'执行记录',logEmpty:'暂无记录'},language:'zh'});assert.equal(mounted.elements.details.open,true);assert.equal(mounted.elements.logs.children[0],first);
  assert.throws(()=>mounted.update({...execution(),tone:'wrong'}));assert.equal(mounted.elements.status.textContent,'Reviewing dataset');
});
