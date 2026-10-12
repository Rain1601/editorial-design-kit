# Editorial Design Kit

[English](README.md) · **简体中文**

面向 Codex 的可配置编辑设计 Skill，附带可复用组件和可运行示例。用字体、留白与内容建立层级，在换色或核对来源时保持上下文。

受 Anthropic 编辑设计启发，属于独立项目，不是 Anthropic 官方组件库。

![配色示意](docs/preview.svg)

## 复制给 Codex：安装并使用

将下面整段复制给 Codex，发送前把方括号改成你的页面任务。Codex 会安装 skill，再用于指定页面；已安装时沿用现有版本并保留本地修改。

```text
请使用 $skill-installer 安装 Editorial Design Kit：
https://github.com/Rain1601/editorial-design-kit/tree/main/skills/editorial-design

如果 editorial-design 已安装，先核对版本与本地修改，
不要直接覆盖已有定制。

然后使用 $editorial-design 完成以下任务：
任务类型：[优化已有页面 / 创建新页面]
项目路径：[项目路径]
目标页面：[页面文件、路由或页面名称]
使用者与主要任务：[谁使用，希望完成什么]

保持自然、简洁的编辑设计感，打磨字体、间距、信息层级和交互。
根据任务选择布局，不强制套用固定模板。
默认支持 Paper / Paper Night 和中文 / English 平铺按钮；
也允许按项目品牌定制色卡。颜色使用语义变量，布局与配色独立配置。

优化已有页面时，保留真实内容、业务行为和已有配置。
创建新页面时，先明确内容与状态，再组合需要的组件。
沿用现有框架，不为应用 skill 改换技术栈。

切换语言或配色时，保留阅读位置、选中对象、筛选排序、
展开状态、图表模式和来源面板状态；不改写来源原文。
按实际需要处理空、加载、错误、待确认和完成状态。
明确区分演示内容与真实执行。

验证受影响的交互，交付可运行预览、已验证行为及已知限制。
如果安装后尚未识别 skill，请说明需要重启 Codex，
并给出重启后继续执行的指令。
```

## 在线预览

[示例首页](https://rain1601.github.io/editorial-design-kit/) · [Paper 报告](https://rain1601.github.io/editorial-design-kit/examples/research-report.html?report=evidence-to-judgment&palette=paper) · [Paper Night 报告](https://rain1601.github.io/editorial-design-kit/examples/research-report.html?report=evidence-to-judgment&palette=paper-night) · [Agent 任务页](https://rain1601.github.io/editorial-design-kit/examples/agent-task/agent-task.html) · [阅读清单](https://rain1601.github.io/editorial-design-kit/examples/reading-queue.html) · [安装 Codex Skill](https://github.com/Rain1601/editorial-design-kit/tree/main/skills/editorial-design)

直接打开即可体验，无需启动本地服务。外观选项改为平铺按钮，切换时保留当前报告和来源面板实例。将上方安装提示复制给 Codex 即可安装。

## 包含什么

- 自包含的 `editorial-design` Skill：设计原则、布局建议、交互契约与模板。
- 七套语义色卡，包含 Paper / Paper Night；支持完整自定义颜色 JSON，颜色与布局独立选择。
- 导航、表格、卡片、列表、阅读、媒体和来源核对的 Vanilla ES modules。可按现有 React/Vue 架构适配，不要求更换技术栈。
- 三份原创报告样稿及列表：摘要、章节导航、图表/数据独立切换、来源摘录与阅读回程。

Skill 用来指导 Codex，不会自动给应用添加前端依赖。示例使用原创建议和合成数据，不提供真实研究或 Agent 后端。

## 页面与组件支持范围

| 页面类型 | 当前支持 |
|---|---|
| 文章、案例、阅读页 | 正文层级、引文、媒体窗口、视频、动态图解、图片局部放大 |
| 研究报告 | 摘要、章节导航、图表／数据切换、引用与集中来源面板、返回阅读位置 |
| 研究库、列表与详情页 | 卡片、列表、表格、筛选排序、选中记录与详情 |
| Agent 任务页 | 输入、附件元信息、执行记录、待确认、产物预览与下载动作 |
| Dashboard 与财务分析页 | 布局指导、范围控制、正负数图表、多图表联动与来源核对；按任务组合 |
| 设置页 | 通用优先、高级展开、预览／保存／撤销规则，使用基础控件接入 |

可复用组件按用途包括：

- **结构与导航**：Header、Sidebar、标签／平铺选项切换、面包屑、分页。
- **内容与记录**：卡片、列表、表格、记录详情、文章开头与引文。
- **输入与反馈**：输入字段、动作菜单、提示、展开区、通知、错误与加载状态。
- **证据与媒体**：引用、集中来源面板、媒体窗口、视频、动态图解、图片局部放大。
- **图表与报告**：正负数图表、悬停联动、图表／数据切换、报告阅读器。
- **Agent 工作流**：受控输入、执行记录、确认请求和产物；任务、选项、文案与产物数量由调用方提供。

[组件接口与边界](skills/editorial-design/references/components.md) · [页面组合规则](skills/editorial-design/references/composition.md) · [Agent 接入契约](skills/editorial-design/references/agent-tasks.md)。

报告与 Agent 有可运行完整示例；Dashboard、财务分析和设置提供组合规则与基础组件，不表示所有页面形态都已有完整模板。组件源码为 Vanilla ES modules + CSS，可按已有 React/Vue 架构适配。PDF 已沉淀排版参考规则，但包内没有 PDF 渲染器。真实研究、Agent 执行、附件正文分析与后端仍需应用接入。

### 可复用 Agent 组件

Agent Studio 已改用四个受控组件：任务输入、执行记录、确认请求和产物。通过 [agent-components.mjs](skills/editorial-design/assets/editorial/agent-components.mjs) 与作用域样式接入，任务状态、文案和动作回调由调用方提供。[接入契约](skills/editorial-design/references/agent-tasks.md)。

[试用另一种任务](https://rain1601.github.io/editorial-design-kit/examples/agent-task/agent-task.html?task=review-plan)：同一套组件承载三种确认选项和三份产物。中文 / English、Paper / Paper Night 切换保留当前状态和阅读位置。[可独立使用的 starter](skills/editorial-design/assets/editorial/agent-starter.html) 随 skill 安装。定时器与模板引擎仅为本地演示；真实执行须接自己的后端。

### Motion Lab · 动态交互

启动示例服务后，打开[动效样例](skills/editorial-design/assets/editorial/motion-lab.html)。三个呈现适配器分别用于自然高度展开、选中下划线移动与非模态详情进出。快速反向操作取消旧动画，减少动态时直接应用最新状态；业务状态、ARIA 控件语义及焦点回程由调用方持有。[动效接入契约](skills/editorial-design/references/motion.md)。

## 本地安装

需要 Codex；安装和本地服务需 Python 3.10+，可选测试需 Node.js 18+。无 npm 依赖，不需要 `npm install`。

克隆仓库（或解压下载包），从项目根目录运行：

```sh
git clone https://github.com/Rain1601/editorial-design-kit.git
cd editorial-design-kit
python3 scripts/install-local.py
```

默认安装至 `~/.agents/skills/editorial-design`。只供某个项目使用时：

```sh
python3 scripts/install-local.py --dest /path/to/project/.agents/skills
```

`--dest` 是父级 skills 目录。安装器复制完整 Skill、资源和 LICENSE；已有安装时拒绝覆盖，不修改 Codex 配置或外观。避免在多个发现目录重复安装同名 Skill。

Codex 自动发现新增 Skill；未出现时重启 Codex。更新前先备份并移走已有目录，再重新安装；不会静默合并文件。卸载时先保存本地修改，然后仅删除已安装的 `editorial-design` 目录。

### 从 GitHub 安装

在 Codex 中输入即可安装本仓库中的 Skill：

```text
使用 $skill-installer 安装：
https://github.com/Rain1601/editorial-design-kit/tree/main/skills/editorial-design
```

已验证：官方 Skill Installer 从本仓库下载安装，独立 Codex CLI 会话使用下载的 Skill 生成可运行双语页面。版本与边界见 [VALIDATION.md](VALIDATION.md)。[Codex 官方 Skill 说明](https://learn.chatgpt.com/docs/build-skills)。

## 在 Codex 中使用

```text
使用 $editorial-design 优化现有研究报告。
保留真实内容和行为，采用 Paper / Paper Night。
换色时保留阅读位置、图表模式和来源面板状态。
```

```text
使用 $editorial-design 在当前 React 项目创建任务页。
采用自定义暖蓝灰、列表与详情栏布局。
保持自然简洁，复用当前应用架构。
```

颜色与布局分别选择，只复制所需模块及相对依赖。[Skill 入口](skills/editorial-design/SKILL.md)与内部详细规则目前以中文为主；双语 README 不表示内部文档已全部翻译。

## 运行示例

从项目根目录启动：

```sh
python3 -m http.server 8880 --bind 127.0.0.1
```

打开[示例入口](http://127.0.0.1:8880/)。端口被占用时换一个端口并调整地址。ES modules 需要 HTTP 服务，不能用 `file://` 打开。

| 示例 | 文件 |
|---|---|
| Agent 任务：输入、执行、待确认与产物 | [Agent Studio](examples/agent-task/agent-task.html) |
| 报告列表与独立阅读记录 | [报告列表](examples/report-library.html) |
| Paper 报告 | [Paper](examples/research-report.html?report=evidence-to-judgment&palette=paper) |
| Paper Night 报告 | [Paper Night](examples/research-report.html?report=evidence-to-judgment&palette=paper-night) |
| 色卡、自定义 JSON、布局和基础组件 | [Starter](skills/editorial-design/assets/editorial/starter.html) |

交互预览请从 HTTP 示例入口进入；GitHub 文件页显示源码。示例使用系统字体，字形可能随系统变化。阅读元数据仅保留在当前标签页 sessionStorage；来源面板打开状态不跨导航恢复。报告契约目前限定 `authored-specimen`，生产报告需显式适配契约。

## 验证

```sh
python3 scripts/check-portability.py
node --test tests/*.test.mjs examples/agent-task/tests/*.test.mjs
```

便携检查核对本地运行/文档链接、隔离安装、文件一致性及覆盖拒绝。契约测试核对数值、身份、阅读状态和配色。实际结果和边界见 [VALIDATION.md](VALIDATION.md)，不代表任意报告质量或完整无障碍验收。

## 许可与状态

**Editorial Design Kit · 0.1.0 · MIT。** 见 [LICENSE](LICENSE) 和[授权说明](LICENSE.md)。可安装的 Skill 内也附带 LICENSE。未打包专有字体、远程视频或品牌素材。

源码通过 GitHub 分发，不是 npm 包。仓库名 `editorial-design-kit`，Codex 调用名保留 `$editorial-design`。版本记录见 [CHANGELOG.md](CHANGELOG.md)。

第二次全新项目验证已从 GitHub 安装 skill，并用独立 Codex 会话生成 Agent Studio。确认/取消流程及实际浏览器交互均已核验；它是本地模板演示，未接真实 Agent 后端。详见 [Agent 示例](examples/agent-task/README.md)与[验证记录](VALIDATION.md)。

### 动效接入实际页面

[报告阅读页](https://rain1601.github.io/editorial-design-kit/examples/research-report.html?report=evidence-to-judgment) 已接入自然高度展开、图表／数据选择标记。[Agent Studio](https://rain1601.github.io/editorial-design-kit/examples/agent-task/agent-task.html?task=review-plan) 已接入执行记录与产物结构展开、确认与产物区短距离淡入，以及产物选择标记。中英文与 Paper 切换保留逻辑状态和阅读上下文。Agent 渲染组件通过 `{motion:true}` 启用，复制时一起带上依赖 motion.mjs。减少动态时直接应用最新状态。Agent 页面仍为本地模板演示，没有真实后端。

### Dashboard 模块交互

[打开 Dashboard](https://rain1601.github.io/editorial-design-kit/examples/dashboard.html)：不等大模块、指针与键盘重排及取消、模块就地放大与底部模块导航。中文 / English、Paper / Paper Night 切换保留布局、输入与每张图的模式。便携 skill 包含完整合成研究工作台与独立 `mountDashboardBoard` 组件。[接入契约](skills/editorial-design/references/dashboard.md)。

## 单页连续阅读

报告在一页里连续展示足够内容，目录同步定位、图解随滚动展开、注释就地展开。所有章节始终可读；语言与配色切换保留阅读锚点、展开状态和笔记，不强制章节分页。

[Paper](https://rain1601.github.io/editorial-design-kit/examples/scroll-story.html?release=0.26) · [Paper Night](https://rain1601.github.io/editorial-design-kit/examples/scroll-story.html?palette=paper-night&release=0.26) · [English](https://rain1601.github.io/editorial-design-kit/examples/scroll-story.html?language=en&release=0.26)

## 小型动态插画

原创 SVG 工具包展开、纸张翻动和铅笔落笔。固定小尺寸占位，支持语义换色、重播和减少动态。已接进报告与 Agent 页，正文保持单页连续展示，动画与业务状态独立。

[Report / 报告](https://rain1601.github.io/editorial-design-kit/examples/research-report.html?release=0.27) · [Agent](https://rain1601.github.io/editorial-design-kit/examples/agent-task/agent-task.html?release=0.28)
