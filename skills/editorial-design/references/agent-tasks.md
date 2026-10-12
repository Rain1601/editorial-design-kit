# Agent 任务页：受控组件与运行边界

把输入、执行记录、待确认与产物作为四个独立区域，按用户工作顺序排版。任务名称、请求范围、执行消息和产物由调用方提供，不把演示任务或固定的两份产物写进组件。组件负责呈现和派发动作；后端负责执行、取消、恢复、确认权限及结果发布。

## 文件与接入

入口 `../assets/editorial/agent-components.mjs` 汇总四个挂载器；也可直接导入 `agent-input.mjs`、`agent-execution.mjs`、`agent-approval.mjs` 和 `agent-artifacts.mjs`。样式使用 `agent-components.css`，按源码保留它的相对 CSS 依赖。在已有框架中适配受控模型即可，不改换技术栈。

可运行模板是 `agent-starter.html`，与 `agent-starter.css`、`agent-starter.mjs`、`agent-demo-engine.mjs`、`agent-demo-tasks.mjs` 及引用的公共模块一起复制，保持相对目录关系，用静态 HTTP 服务打开。以实际 import、CSS import 和 HTML 链接检查依赖闭包，不能只复制 HTML。演示引擎与演示任务属于可替换样例，不是生产执行适配器，也不是组件默认业务。

四个接口共享形态：

```js
const instance = mountTaskExecution(host, {
  prefix: 'analysis-', // 多实例使用不同前缀，避免 DOM ID / radio name 冲突
  labels: {log: '执行记录', logEmpty: '尚未收到执行事件'},
  onAction(action) { /* 按稳定 ID 更新调用方模型，再 update */ }
});
instance.update(model, {labels, language: 'zh'}); // zh / en
instance.destroy(); // 卸载前清理监听与节点
```

返回 `{update, destroy, elements}`；`elements` 是可检查的原生控件引用，不是业务状态仓库。所有 labels 为调用方提供的纯字符串。先校验模型再修改页面；模型不得包含不可信 HTML。`normalizeTaskInput`、`normalizeTaskExecution`、`normalizeTaskApproval`、`normalizeTaskArtifacts` 可分别预检模型并取得分离的结果，不修改输入对象。

## 输入：mountTaskInput

```js
{
  input: '',
  files: [{id: 'file-1', name: 'notes.csv', size: 0,
           type: 'text/csv', lastModified: 0}],
  busy: false, error: '', maxLength: 3000,
  canCancel: false, canRestart: false, fail: false,
  showDemoOptions: false // 默认隐藏演示故障控件；starter 显式启用
}
```

`maxLength` 可省略，默认 3000；其余字段显式提供。文件 ID 非空且唯一，size 是非负安全整数（保留 0 字节），lastModified 是非负有限数。

动作：`{type:'input',value}`、`{type:'files',files}`、`{type:'remove-file',id}`、`{type:'start'}`、`{type:'cancel'}`、`{type:'restart'}`、`{type:'example'}`、`{type:'fail',value}`。最后两项是模板入口与错误演示开关，具体行为由调用方提供；组件没有内置任务答案。

`files` 动作只携带新选择文件的元信息，不读取正文、不上传附件。调用方负责合并、去重、删除及需要的真实文件上传流程。开始按钮的可见性不等于服务端许可，适配器仍需校验任务和当前阶段。

labels：`taskLabel, taskHelp, placeholder, inputError, example, attachments, addFiles, fileHelp, fileEmpty, demoOptions, failOption, start, cancel, restart, bytes, unknownType, remove`。`error:'input'` 使用 `inputError` 文案；其他错误字符串按原文呈现。

## 执行记录：mountTaskExecution

```js
{
  status: '正在检查材料', description: '已收到两份文件的运行事件',
  tone: 'running',
  entries: [{id:'event-read-1', text:'材料读取完成'}]
}
```

`tone` 为 `idle | running | waiting | done | error | cancelled`。日志 ID 非空且唯一，不限制任务特有事件名称或数量。状态、说明和每条记录是纯字符串。labels 必须包含 `log, logEmpty`。组件不派发执行动作，不创造百分比、不按动画计时伪造日志。语言更新保留原 `details` 展开状态和身份相同的日志节点。

## 待确认：mountTaskApproval

```js
{
  request: {
    id: 'request-42', title: '选择发布范围', description: '核对后再继续',
    options: [
      {id:'chart', label:'图表', description:'导出已核验图表'},
      {id:'table', label:'数据表', description:'导出已核验记录'},
      {id:'both', label:'两者', description:'同时导出'}
    ],
    acknowledgement: '我已核对材料与范围'
  },
  status: 'pending', selectedId: null, acknowledged: false
}
```

选项任意数量（至少一个），ID 非空且唯一；组件没有 `brief / expanded` 预设。`selectedId` 为 null 或本请求中的选项 ID。status 为 `pending | approved | hidden`；无请求时必须 `{request:null,status:'hidden',selectedId:null,acknowledged:false}`。

动作：`{type:'choose',id,requestId}`、`{type:'acknowledge',value,requestId}`、`{type:'approve',id,requestId}`、`{type:'reject',requestId}`。只有有效 pending 请求、已有选择且已勾选确认时才能派发 approve；approved / hidden 阶段不能批准或拒绝。选择及勾选为受控动作，调用方应立即更新模型。

**每个新请求使用新 ID，并在调用方把 selectedId 重置为 null、acknowledged 重置为 false。** 挂载组件在请求 ID 改变时也清除本地显示中的旧确认，即便新旧选项 ID 相同。服务端仍须核对 requestId、任务阶段和已确认范围，不能用按钮禁用状态代替权限或并发校验。

labels 必须包含 `decision, scope, approve, reject, chooseFirst, acknowledgeFirst, ready, approved`。稳定控件与 radio name 保留；只换文案不重建确认请求。

## 产物：mountTaskArtifacts

```js
{
  items: [
    {id:'summary', title:'摘要', filename:'summary.md', content:'# 摘要\n\n已核验内容。'},
    {id:'appendix', title:'附录', filename:'appendix.md', content:'## 数据\n\n材料范围。'}
  ],
  selectedId: 'summary', view: 'bars', busy: false
}
```

items 可为空或任意数量，不固定两份。每个 ID 非空且唯一，title / filename / content 是原文字符串；selectedId 为 null 或现有产物 ID。view 为 `bars | table`，busy 可省略（默认 false）。

动作：`{type:'select-artifact',id}`、`{type:'artifact-view',value}`、`{type:'download',id}`。下载由调用方执行，组件不创建网络请求或默认发布。忙碌阶段禁用下载按钮，适配器还需校验最新产物身份和可下载状态。

labels：`outputEmpty, outputHelp, originalNote, download, structure, structureHelp, chart, data, artifacts, structureView, section, paragraphs`。预览以安全文本呈现有限 Markdown 结构，不是完整 Markdown / HTML 渲染器。`artifactStructure(content)` 按二级标题统计段落数；结构图表示文本结构，不代表任务进度、证据质量或模型可信度。

## 中文 / English 与 Paper / Paper Night

界面语言和配色属于调用方视图状态，任务模型保持原身份。少量选项复用 `choice-switch.mjs` 平铺为 `中文 / English` 与 `Paper / Paper Night`，避免藏进菜单。

- 换语言：更新 labels 与 language，保留 input、文件 ID、阶段、日志 ID、requestId、选择、确认、selectedId、view 和 details 展开状态。产物正文与来源原文保持不变，不自动翻译用户内容。
- 换配色：通过 `palette-presets.mjs / applyPalette` 更新语义变量，沿用同一组件实例，不重启任务、不清空确认、不重建产物。
- 阅读位置：语言更新前记录稳定阅读锚点及章内偏移，更新后恢复；不能仅按全页像素坐标猜测翻译后的对应位置。焦点和待确认控件需要保留，主题切换不强制滚到页首。
- 来源面板：如果接入现有 source-panel，保持同一来源身份、当前摘录与面板实例；关闭继续回到打开前位置。组件不自动添加、抓取或验证来源。

## 真实执行与验收

演示引擎只演示阶段、门控、取消和模板产物，不说明真实 Agent 已读附件、核验事实或完成研究。接真实运行时，从运行事件映射到 execution 模型，从真实权限请求映射 approval，从真实产物映射 artifacts；原样保留失败与缺口。后端用运行 ID / 请求 ID 使取消、重启后的旧回调失效，未经确认不能发布产物。

最小验收：换一个不同任务，使用不同请求选项和非固定数量的产物；检查输入与附件身份、运行记录、待确认阻止继续、批准 / 拒绝、取消后迟到回调失效、产物原文与下载。再在中文 / English 和 Paper / Paper Night 间切换，确认状态、焦点、展开与阅读位置保留。契约测试和模拟演示不等于真实后端验收。

## 可选动效

执行、确认和产物挂载函数接受 `{motion:true}`；默认 false。真实样例和 agent-starter 显式开启。保留原受控 model/action，不把呈现完成当成执行成功。语言只更新 labels，配色只更新语义变量；沿用实例、请求 ID、确认范围与产物 ID。执行记录与产物结构可自然高度展开，确认／产物区短距离淡入，产物选中下划线按实际宽度移动。依赖与生命周期见 [motion.md](motion.md)。
