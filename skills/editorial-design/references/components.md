# 组件接入与边界

便携组件在 `../assets/editorial/`。入口 `starter.html`；用静态HTTP服务运行，ES modules不适合file协议。复制需要的模块、CSS和相对依赖；不要求复制全部页面。

| 用途 | 模块 / 接口 | CSS |
|---|---|---|
| Header/Sidebar/表格 | editorial-primitives.mjs / Header, Sidebar, DataTable | style.css |
| 卡片/列表 | compound-components.mjs / Card, ItemList | compound-components.css |
| 字段/菜单/反馈 | workspace-controls.mjs / TextField, ActionMenu, Notice, InlineAlert | workspace.css |
| 选中/详情/正负图 | workspace-components.mjs / ViewTabs, RecordDetail, SignedBars | workspace.css |
| 提示/展开/导航/分页/加载 | utility-components.mjs / Tooltip, mountTooltips, Accordion, Breadcrumb, Pagination, Loading | utility-components.css |
| 引用与来源 | citation-components.mjs / Citation; source-panel.mjs / mountSourcePanel | citation-components.css + source-panel.css |
| 正文媒体 | reading-media.mjs / createArticleVideo, createKineticFigure, mountMediaWindow | reading-media.css |
| 局部放大 | image-inspector.mjs / mountImageInspector | image-inspector.css |
| 数据点联动 | linked-charts.mjs / mountLinkedCharts | linked-charts.css |
| 文章/图解 | story-components.mjs / StoryLead, PullQuote, mountExplainer | story-components.css |
| 范围控制 | scope-controls.mjs / createScopeControls | scope-controls.css |
| 报告阅读 | report-reader.mjs / mountReportReader | report-reader.css + 来源CSS |
| Agent 输入/执行/待确认/产物 | agent-components.mjs / mountTaskInput, mountTaskExecution, mountTaskApproval, mountTaskArtifacts | agent-components.css |
| 展开/非模态出现/选择标记 | motion.mjs / mountDisclosureMotion, mountPresenceMotion, mountSelectionMotion；[契约](motion.md) | 宿主布局与标记样式 |

源码是当前接口依据；先看目标模块的签名与校验，不能凭类名猜参数。共享依赖 components.mjs、tokens.mjs、source-excerpt.mjs已附带。报告还依赖report-content.mjs与citation-sources.mjs；后者的命名样稿引用附带的项目说明，不是业务事实。使用新报告时显式传入模型，不靠旧命名样稿补内容。

## 状态与生命周期

安全 HTML 渲染器不持有业务状态。DataTable点击入口 `data-record`/排序`data-sort`，ItemList动作`data-item-id`；调用方按ID更新，不能按当前行号替换记录。内容字符串由组件转义。

挂载器返回对象按各模块签名使用。mountSourcePanel、mountTooltips等有destroy；报告有getState/destroy。卸载/重挂先清理监听、播放器与面板；同内容换语言先取得状态，换主题通常只写变量。图表 SignedBars 接受正/负/0/null；ChartFrame仅非负有限数，勿绕过校验。

来源输入必须明确id/title/text/caption/kind、可选locator/href，引用ID匹配本次来源集。kind使用组件已有枚举。面板只定位与筛选提供的摘录，不抓全文也不判断真假。关闭恢复首次打开时的坐标与引用焦点。保留陈述与原文出处身份。

报告合同当前限定authored-specimen，要求显式双语字段、章节/图表/来源ID；没有真实自动研究功能。用于生产内容时需要明确扩展合同，不把业务报告伪标为原创样稿。

## 便携包范围

本包包含系统字体组件、模板和原创报告样稿，不提供真实模型/数据后端或PDF导出。附带PDF规则仅为参考契约，历史字体路径不是运行依赖。已有产品按宿主隔离全局body/control规则。

## 局部主题、Portal 与额外交互

来源面板默认仍挂到body。若配色只施加在局部宿主，调用 `mountSourcePanel(host,{sources,portalContainer:host,scrollContainer:actualReader})`，让dialog继承相同变量；也可传入同文档内拥有相同主题的portal根。传入其他文档或不能append的容器会拒绝。主题应用用applyPalette逐项写变量，不覆盖原内联布局；scoped CSS也应覆盖portal。

DataTable只有原生Tab/Enter/Space按钮基础；ArrowUp/Down选行或roving tabindex由具体应用实现，按当前筛选排序后的ID操作。Accordion只接受文本与安全链接，不是任意控件插槽；高级筛选用宿主框架的受控disclosure，保留展开状态，保证通用区域位置稳定。不要把这些适配行为称为组件已经提供。

来源面板可选 headerAction:{label,onClick} 提供宿主动作；mountReportReader 的 sourcePanelAction 透传。主题回调只更新变量并保持实例及阅读回程，详见 palettes.md。

## 平铺选项切换

少量常用选项用并排按钮，避免藏进下拉菜单。`choice-switch.mjs / mountChoiceSwitch(host,{choices,value,label,onChange})` 搭配 `choice-switch.css`；choices 为 `{value,label}` 数组。调用方持有状态，回调处理后调用 setValue，按钮用 aria-pressed 表示选择，原生 Tab/Enter/Space 可操作。setLabel 更新语言，destroy 清理监听和按钮。换外观只更新变量，不重建阅读器或来源面板。多选项时可换行；不要把筛选列表一律改为按钮。

语言切换同样使用 choice-switch，固定“中文 / English”标签。翻译前保存阅读器 getState 的章节 ID、章内偏移、各图表模式与 details 状态；重挂后按章节偏移恢复，不能只复用全页像素坐标。列表重绘前保留展开对象 ID、筛选、排序与焦点。主题只改变量；不要为了切换语言修改或翻译来源原文。

## Agent 任务页

完整受控模型、动作与运行边界见 [agent-tasks.md](agent-tasks.md)。任务、请求选项与产物数量由调用方提供；组件不内置业务答案或执行后端。新 requestId 重置选择与确认，批准事件带 requestId；服务端仍校验当前阶段。语言只更新控件文案、配色只更新语义变量，保留任务身份和阅读位置。可运行 agent-starter.html 及其本地依赖演示接入，演示引擎不可当作真实 Agent 运行。

## Dashboard 模块

`mountDashboardBoard` 支持异形卡片指针／键盘重排、取消、原模块放大、底部模块导航与回程。源码 dashboard-board.mjs / css；完整 dashboard.html 示例保留双语、Paper 外观、输入与每图模式。接入见 [dashboard.md](dashboard.md)。

## 单页连续阅读

章节定位、原生滚动跟随与章内位置恢复：`chapter-navigator.mjs/css`。接口和使用边界见 [navigation-scroll.md](navigation-scroll.md)，完整示例为 `scroll-story.html`。所有章节连续可读，不强制分页。

## 小型动态插画

`micro-illustration.mjs/css` 提供 toolbox、paper、pencil；接口、语义换色、播放与卸载契约见 [micro-illustrations.md](micro-illustrations.md)。固定占位，语言只更新标签，默认一次播放。
