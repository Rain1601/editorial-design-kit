import {mountMicroIllustration} from './micro-illustration.mjs?v=0.29';
import {mountChoiceSwitch} from './choice-switch.mjs';
import {applyPalette} from './palette-presets.mjs';
import {mountTaskInput,mountTaskExecution,mountTaskApproval,mountTaskArtifacts} from './agent-components.mjs';
import {TaskEngine,busy} from './agent-demo-engine.mjs';
import {getDemoTask} from './agent-demo-tasks.mjs';
const $=id=>document.getElementById(id);
const toolbox=mountMicroIllustration($('agent-toolbox'),{kind:'toolbox',label:'工具包展开',replayLabel:'重播工具包展开'});
const pencil=mountMicroIllustration($('agent-pencil'),{kind:'pencil',size:56,label:'铅笔落笔',replayLabel:'重播铅笔落笔'});
const paper=mountMicroIllustration($('agent-paper'),{kind:'paper',size:56,label:'纸张翻动',replayLabel:'重播纸张翻动'});
const config=getDemoTask(new URLSearchParams(location.search).get('task')||'writing');
const view={language:'zh',appearance:'paper',selected:null,chart:'bars',fail:false};
const english={skip:'Skip to task input',eyebrow:'WORK NOTES / 01',title:'From a first thought,<br>to a draft worth reviewing.',dek:'Describe the task, set the scope, and let the demo continue. Every approval is yours.',boundary:'Local demo · No backend or model · No file uploads',inputTitle:'Describe the task',taskLabel:'What would you like to work on?',taskHelp:'Start with the goal and the intended reader.',example:'Try an example ↗',attachments:'Attachments',addFiles:'＋ Add local files',fileHelp:'Name, size, type and modified date only. File contents are never read.',fileEmpty:'No attachments yet. You can start without them.',demoOptions:'Demo options',failOption:'Simulate a generation error to explore recovery',start:'Start local demo →',cancel:'Cancel run',restart:'Start over',execution:'Execution & approval',log:'Execution log',logEmpty:'Steps will appear here as the local demo runs.',decision:'YOUR DECISION',reviewTitle:'How far should this draft go?',reviewHelp:'Choose a scope and acknowledge the demo limits. No artifacts are generated before approval.',scope:'Draft scope',brief:'Brief draft',briefHelp:'Opening, suggested actions, and next steps.',expanded:'Expanded draft',expandedHelp:'Add a small trial and a reflection section.',ack:'I understand this is a local template specimen. Files are not analyzed and facts are not verified.',approve:'Approve & continue →',reject:'Reject & revise',output:'Artifacts to take away',outputEmpty:'No artifacts yet.',outputHelp:'After approval, the demo creates two original specimens to view and download.',originalNote:'Original text stays intact. Interface language changes never translate or rewrite your content.',download:'Download Markdown ↓',structure:'Explore draft structure',structureHelp:'Paragraph counts by level-two heading in the selected specimen. This describes text structure, not execution progress.',session:'THIS SESSION',navInput:'01 / Task & attachments',navExecution:'02 / Execution & approval',navOutput:'03 / Original specimens',principle:'Approval comes first.',principleHelp:'The run pauses at scope selection. Approve, reject and revise, or cancel at any time.',privacy:'Task and file metadata stay in this page’s memory only. Refreshing clears them.',footer:'A process you can inspect. A draft you can refine.'};
const zh={"skip": "跳到任务输入", "eyebrow": "工作札记 / 01", "title": "从一个想法，<br>到一份可审阅的初稿。", "dek": "说明任务，划定范围，再让演示继续。每次确认，都由你决定。", "boundary": "本地演示 · 无真实后端或模型 · 附件不上传", "inputTitle": "交代任务", "taskLabel": "你想完成什么？", "taskHelp": "写下目标与读者。具体一点，就从这里开始。", "example": "试用一个示例 ↗", "attachments": "附件", "addFiles": "＋ 添加本地文件", "fileHelp": "仅查看名称、大小、类型与修改时间；不会读取文件正文。", "fileEmpty": "尚未添加附件。不影响演示启动。", "demoOptions": "演示选项", "failOption": "模拟一次生成错误，检查恢复流程", "start": "开始本地演示 →", "cancel": "取消执行", "restart": "重新开始", "execution": "执行与确认", "log": "展开执行记录", "logEmpty": "启动后，这里会记录实际发生的演示步骤。", "decision": "需要你的决定", "reviewTitle": "这次初稿，写到哪里？", "reviewHelp": "选择一个范围并确认演示边界。批准之前不会生成任何产物。", "scope": "写作范围", "brief": "精简稿", "briefHelp": "围绕任务给出开场、建议与下一步。", "expanded": "展开稿", "expandedHelp": "在精简稿基础上，加入试行与复盘。", "ack": "我理解这是本地模板样稿，未分析附件或核验事实。", "approve": "批准并继续 →", "reject": "拒绝，返回修改", "output": "可带走的产物", "outputEmpty": "这里还没有产物。", "outputHelp": "批准范围后，演示会生成两份可查看、可下载的原创样稿。", "originalNote": "样稿原文保持不变。界面语言切换不会翻译或改写你的内容。", "download": "下载 Markdown ↓", "structure": "查看样稿结构", "structureHelp": "按当前样稿的二级标题统计段落数；仅描述文本结构，不代表执行进度。", "session": "本次工作", "navInput": "01 / 任务与附件", "navExecution": "02 / 执行与确认", "navOutput": "03 / 原创样稿", "principle": "先确认，再继续。", "principleHelp": "执行在范围选择处暂停。你可以批准、拒绝修改，或随时取消。", "privacy": "任务与附件信息只保留在当前页面内存中。刷新后清空。", "footer": "一个可检查的过程，一份尚待打磨的初稿。", "chooseFirst": "先选择一个范围。", "acknowledgeFirst": "请确认已理解演示边界。", "ready": "范围已选定，可以批准。", "approved": "本次范围已批准。", "placeholder": "例如：为一次社区读书活动起草介绍，面向第一次参加的读者。", "inputError": "请输入 1–3000 个字符的任务。", "remove": "移除", "bytes": "字节", "unknownType": "未知类型", "chart": "结构图", "data": "数据", "section": "章节（原文）", "paragraphs": "段落数", "artifacts": "产物", "structureView": "结构视图"};
Object.assign(english,{chooseFirst:'Choose a scope first.',acknowledgeFirst:'Acknowledge the demo limits to continue.',ready:'Ready for approval.',approved:'This request was approved.',placeholder:'Describe the goal and intended reader.',inputError:'Enter a task of 1–3000 characters.',remove:'Remove',bytes:'bytes',unknownType:'Unknown type',chart:'Chart',data:'Data',section:'Section (original)',paragraphs:'Paragraphs',artifacts:'Artifacts',structureView:'Structure view'});
const phases={
 idle:['等待你的任务','Ready for your task','输入任务后开始本地演示。','Enter a task to begin the local demo.'],
 preparing:['正在准备任务','Preparing the task','本地演示正在记录任务与附件元信息，无可报告的百分比。','Recording the task and file metadata locally. No percentage is available.'],
 review:['已暂停 · 等待范围确认','Paused · Scope approval needed','请选择下方范围。批准、拒绝或取消均由你决定。','Choose a scope below, then approve, reject, or cancel.'],
 writing:['正在生成本地样稿','Creating local specimens','使用本地规则模板组装文本，未调用模型。','Assembling text with a local template. No model is involved.'],
 done:['已完成 · 产物可审阅','Done · Artifacts ready','可在下方阅读或下载。实际任务仍需人工处理与核验。','Read or download below. The actual task still needs human work and verification.'],
 rejected:['已拒绝 · 可以修改任务','Rejected · Ready for revision','任务与附件已保留。修改后重新启动，需要再次批准范围。','Task and attachments are retained. Revise and start again; scope approval is required again.'],
 cancelled:['已取消 · 未生成产物','Cancelled · No artifacts created','本次执行已停止。可以保留当前输入重新开始。','This run has stopped. Start over with your current input.'],
 error:['生成失败 · 可以重试','Generation failed · Retry available','演示错误已触发，未保留产物。关闭“模拟一次生成错误”后重新开始。','The simulated error was triggered. No artifacts were retained. Turn off error simulation and start again.']};
const logText={started:['开始本地演示；保存本次任务快照。','Local demo started; task snapshot captured.'],metadata:['已记录附件元信息；未读取正文。','File metadata recorded; no contents read.'],paused:['执行暂停，等待范围选择与明确批准。','Paused for scope selection and explicit approval.'],approved:['范围已批准，开始本地模板生成。','Scope approved; local template generation started.'],finished:['已生成本次任务的样稿。','Task specimens created.'],rejected:['范围请求已拒绝，返回可编辑状态。','Scope request rejected; editing enabled.'],cancelled:['用户取消本次执行；所有待执行回调已失效。','Run cancelled; pending callbacks invalidated.'],failed:['触发演示错误；未发布任何产物。','Simulated error triggered; no artifacts published.']};
function readingPosition(){const anchors=[...document.querySelectorAll('[data-reading-anchor]')].filter(el=>el.getClientRects().length);const readingLine=document.querySelector('.masthead').getBoundingClientRect().bottom+48;const anchor=anchors.filter(el=>el.getBoundingClientRect().top<=readingLine).at(-1)||anchors[0];return {id:anchor?.id,offset:anchor?.getBoundingClientRect().top||0,x:scrollX};}
function restorePosition(pos){const el=$(pos.id);if(el)window.scrollBy(pos.x-scrollX,el.getBoundingClientRect().top-pos.offset);}

const tr=(a,b)=>view.language==='zh'?a:b;
const pick=value=>Array.isArray(value)?value[view.language==='zh'?0:1]:value;
const labels=()=>({...view.language==='zh'?zh:english,scope:tr('确认范围','Approval scope'),outputHelp:tr('批准后生成可查看、下载的样稿。','Approve to create specimens to read and download.')});
const requestId=()=>config.id+':'+engine.epoch;
const engine=new TaskEngine({scopeIds:config.options.map(o=>o.id),generate:config.generate,onChange:()=>render()});
const input=mountTaskInput($('input-host'),{labels:labels(),onAction:action});
const execution=mountTaskExecution($('execution-host'),{motion:true,labels:labels()});
const approval=mountTaskApproval($('approval-host'),{motion:true,labels:labels(),onAction:action});
const artifacts=mountTaskArtifacts($('artifacts-host'),{motion:true,labels:labels(),onAction:action});
function render(){
 toolbox.setLabels(tr('工具包展开','Opening a toolkit'),tr('重播工具包展开','Replay toolkit opening'));
 pencil.setLabels(tr('铅笔落笔','Pencil drawing'),tr('重播铅笔落笔','Replay pencil drawing'));
 paper.setLabels(tr('纸张翻动','Turning a sheet'),tr('重播纸张翻动','Replay sheet turn'));
 const s=engine.state,active=busy(s.phase),phase=phases[s.phase],l=labels(),opts={labels:l,language:view.language};
 input.update({input:s.input,files:s.files.map(f=>({...f,id:JSON.stringify([f.name,f.size,f.lastModified])})),busy:active,error:s.error==='input'?'input':'',canCancel:active,canRestart:s.phase!=='idle',fail:view.fail,showDemoOptions:true},opts);
 execution.update({status:pick(phase.slice(0,2)),description:pick(phase.slice(2)),tone:({preparing:'running',review:'waiting',writing:'running',rejected:'cancelled'})[s.phase]||s.phase,entries:s.logs.map((key,i)=>({id:'log-'+i,text:pick(logText[key])}))},opts);
 const hasRequest=['review','writing','done'].includes(s.phase);
 approval.update({request:hasRequest?{id:requestId(),title:pick(config.reviewTitle),description:l.reviewHelp,acknowledgement:l.ack,options:config.options.map(o=>({id:o.id,label:pick(o.label),description:pick(o.description)}))}:null,status:s.phase==='review'?'pending':hasRequest?'approved':'hidden',selectedId:hasRequest?(s.scope||null):null,acknowledged:hasRequest?s.acknowledged:false},opts);
 if(!s.artifacts.some(a=>a.id===view.selected))view.selected=s.artifacts[0]?.id??null;
 artifacts.update({items:s.artifacts.map(a=>({...a,title:pick(a.title)})),selectedId:view.selected,view:view.chart,busy:active},opts);
}
function action(a){
 if(a.requestId&&a.requestId!==requestId())return;
 switch(a.type){
 case 'input':engine.edit(a.value);if(engine.state.error==='input')engine.state.error='';render();break;
 case 'files':{const files=[...engine.state.files];for(const f of a.files)if(!files.some(old=>old.name===f.name&&old.size===f.size&&old.lastModified===f.lastModified))files.push(f);engine.edit(engine.state.input,files);render();break;}
 case 'remove-file':engine.edit(engine.state.input,engine.state.files.filter(f=>JSON.stringify([f.name,f.size,f.lastModified])!==a.id));render();break;
 case 'fail':view.fail=a.value;render();break;
 case 'example':engine.edit(pick(config.sample));render();$('task').focus();break;
 case 'start':if(engine.start({fail:view.fail}))focusStatus();else $('task').focus();break;
 case 'cancel':engine.cancel();focusStatus();break;
 case 'restart':engine.restart();$('task').focus();break;
 case 'choose':engine.choose(a.id);break;
 case 'acknowledge':engine.acknowledge(a.value);break;
 case 'approve':if(engine.approve())focusStatus();break;
 case 'reject':engine.reject();$('task').focus();break;
 case 'select-artifact':view.selected=a.id;render();break;
 case 'artifact-view':view.chart=a.value;render();break;
 case 'download':{const item=engine.state.artifacts.find(x=>x.id===a.id);if(!item)return;const url=URL.createObjectURL(new Blob([item.content],{type:'text/markdown;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=item.filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);break;}
 }
}
function focusStatus(){$('status').tabIndex=-1;$('status').focus({preventScroll:true});}
const language=mountChoiceSwitch($('language'),{choices:[{value:'zh',label:'中文'},{value:'en',label:'English'}],value:'zh',label:'语言 / Language',onChange:value=>{
 const pos=readingPosition();view.language=value;language.setValue(value);document.documentElement.lang=value==='zh'?'zh-CN':'en';
 document.querySelectorAll('[data-i18n]').forEach(el=>{const text=labels()[el.dataset.i18n];if(el.dataset.i18n==='title')el.innerHTML=text;else el.textContent=text;});
 document.title=tr('Agent Studio · 任务工作台','Agent Studio · Task workspace');document.querySelector('nav').setAttribute('aria-label',tr('任务章节','Task sections'));render();restorePosition(pos);
}});
const appearance=mountChoiceSwitch($('appearance'),{choices:[{value:'paper',label:'Paper'},{value:'paper-night',label:'Paper Night'}],value:'paper',label:'外观 / Appearance',onChange:value=>{const pos=readingPosition();view.appearance=value;applyPalette(document.documentElement,value);document.documentElement.style.colorScheme=value==='paper'?'light':'dark';appearance.setValue(value);restorePosition(pos);}});
applyPalette(document.documentElement,'paper');render();
