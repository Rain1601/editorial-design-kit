import test from 'node:test';
import assert from 'node:assert/strict';
import {TaskEngine} from '../task-engine.mjs';
import {getDemoTask} from '../task-config.mjs';
test('independent task config has three explicit options and three different artifacts',()=>{
 const config=getDemoTask('review-plan'),queue=[];
 const engine=new TaskEngine({scopeIds:config.options.map(o=>o.id),generate:config.generate,schedule:fn=>{queue.push(fn);return queue.length;},unschedule:()=>{}});
 engine.edit('A different delivery task');assert.ok(engine.start());queue.shift()();assert.equal(engine.choose('brief'),false);assert.ok(engine.choose('risks'));assert.equal(engine.approve(),false);engine.acknowledge(true);assert.ok(engine.approve());queue.shift()();assert.equal(engine.state.phase,'done');assert.deepEqual(engine.state.artifacts.map(a=>a.id),['review-plan','decision-notes','handoff']);assert.ok(engine.state.artifacts[0].content.includes('A different delivery task'));
 engine.restart();engine.start();queue.shift()();assert.equal(engine.state.scope,'');assert.equal(engine.state.acknowledged,false);assert.equal(engine.approve(),false);
});
test('unknown tasks and invalid runtime configuration do not fall back',()=>{
 assert.throws(()=>getDemoTask('unknown'),/Unknown/);assert.throws(()=>new TaskEngine({scopeIds:['same','same']}),/Invalid/);
});
