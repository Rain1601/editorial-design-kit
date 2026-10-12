export const busy = phase => ['preparing', 'review', 'writing'].includes(phase);
export const scopes = ['brief', 'expanded'];
export function createArtifacts(task, scope) {
  if (!scopes.includes(scope)) throw new Error('Invalid scope');
  const extra = scope === 'expanded' ? '\n\n## 试行与复盘\n先选择一个小场景进行试行，记录读者提出的第一条疑问。复盘时区分信息缺失与表达不清，再决定下一版调整。不要把一次试行当成普遍结论。' : '';
  return [
    {id:'draft', filename:'original-draft.md', title:['原创任务样稿','Original task specimen'], content:`# 把想法变成一个可讨论的起点\n\n> 本地规则模板生成的原创样稿；未经检索、事实核验或模型执行。\n\n## 原始任务\n${task}\n\n## 写作范围\n${scope === 'brief' ? '精简稿：任务、建议与下一步。' : '展开稿：任务、建议、下一步与试行复盘。'}\n\n## 给读者的开场\n每项新计划都需要一个能够共同讨论的起点。这份初稿先保留任务的原意，再把行动压缩到可以检查的小范围。读者可以从这里指出遗漏，而不必先接受一个完整结论。\n\n## 建议的行动\n先用一句话描述希望发生的变化，再明确谁会使用这份材料。把尚未验证的判断列为问题，把能够直接执行的事情写成动作。开始前，为第一项动作指定负责人和可观察的完成条件。\n\n## 下一步\n邀请一位实际使用者阅读本稿，记录一处不理解的表达与一项缺少的依据。根据反馈修订后，再讨论是否扩大范围。${extra}\n\n---\n本稿未读取附件内容，也未根据任务开展真实研究。正文为演示模板，不代表任务已实际完成。\n`},
    {id:'checklist', filename:'review-checklist.md', title:['审阅清单','Review checklist'], content:`# 从初稿到可用稿\n\n## 对照任务\n${task}\n\n## 审阅步骤\n- [ ] 核对任务原意是否完整保留。\n- [ ] 确认目标读者、使用场景与负责人。\n- [ ] 为事实陈述补充可追溯的依据。\n- [ ] 检查行动是否有明确的完成条件。\n${scope === 'expanded' ? '- [ ] 记录试行反馈，并说明它的适用范围。\n' : ''}- [ ] 人工修订并批准后再用于实际场景。\n\n本清单是原创演示样稿，不构成已完成的核验。\n`}
  ];
}
export class TaskEngine {
  constructor({schedule=(fn,ms)=>setTimeout(fn,ms), unschedule=id=>clearTimeout(id), onChange=()=>{}}={}) {
    this.schedule=schedule; this.unschedule=unschedule; this.onChange=onChange; this.timer=null; this.epoch=0;
    this.state={phase:'idle', input:'', files:[], scope:'', acknowledged:false, artifacts:[], logs:[], error:'', snapshot:null};
  }
  emit(){this.onChange(this.state);}
  edit(input, files=this.state.files){if(busy(this.state.phase))return false; this.state.input=input;this.state.files=files.map(({name,size,type,lastModified})=>({name,size,type,lastModified}));return true;}
  later(fn){const epoch=this.epoch;this.timer=this.schedule(()=>{if(epoch===this.epoch)fn();},650);}
  stop(){this.epoch++;if(this.timer!==null)this.unschedule(this.timer);this.timer=null;}
  start({fail=false}={}){
    if(busy(this.state.phase))return false;
    if(!this.state.input.trim() || this.state.input.length>3000){this.state.error='input';this.emit();return false;}
    this.stop();Object.assign(this.state,{phase:'preparing',error:'',scope:'',acknowledged:false,artifacts:[],logs:['started'],snapshot:{task:this.state.input.trim(),files:this.state.files.map(f=>({...f})),fail}});this.emit();
    this.later(()=>{this.state.logs.push('metadata');this.state.phase='review';this.state.logs.push('paused');this.emit();});return true;
  }
  choose(scope){if(this.state.phase!=='review'||!scopes.includes(scope))return false;this.state.scope=scope;this.emit();return true;}
  acknowledge(value){if(this.state.phase!=='review')return false;this.state.acknowledged=!!value;this.emit();return true;}
  approve(){
    if(this.state.phase!=='review'||!scopes.includes(this.state.scope)||!this.state.acknowledged)return false;
    this.state.phase='writing';this.state.logs.push('approved');this.emit();
    this.later(()=>{try{if(this.state.snapshot.fail)throw new Error('Demo failure');const artifacts=createArtifacts(this.state.snapshot.task,this.state.scope);this.state.artifacts=artifacts;this.state.phase='done';this.state.logs.push('finished');}catch{this.state.phase='error';this.state.error='generation';this.state.artifacts=[];this.state.logs.push('failed');}this.emit();});return true;
  }
  reject(){if(this.state.phase!=='review')return false;this.stop();this.state.phase='rejected';this.state.logs.push('rejected');this.emit();return true;}
  cancel(){if(!busy(this.state.phase))return false;this.stop();this.state.phase='cancelled';this.state.artifacts=[];this.state.logs.push('cancelled');this.emit();return true;}
  restart(){this.stop();Object.assign(this.state,{phase:'idle',scope:'',acknowledged:false,artifacts:[],logs:[],error:'',snapshot:null});this.emit();}
}
