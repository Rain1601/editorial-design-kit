# Agent Studio · 独立安装复用示例

[在线体验](https://rain1601.github.io/editorial-design-kit/examples/agent-task/agent-task.html) · [示例首页](../../index.html)

全新空项目从 GitHub 安装 editorial-design 后，由独立 Codex 会话应用 README 指令生成。Vanilla ES modules，无 npm 依赖。保留本目录结构，可直接用 HTTP 静态服务运行 `agent-task.html`。

## 体验流程

输入任务（或试用示例）→ 开始 → 暂停选择范围 → 勾选演示边界 → 批准 → 查看或下载两份原创样稿。也可拒绝后修改、取消、重新开始。展开演示选项可模拟生成错误，再关闭该选项恢复。

中文 / English 与 Paper / Paper Night 均为平铺按钮。切换保留输入、附件元信息、阶段、确认选择、展开日志、选中产物与结构图/数据模式。语言切换按阅读锚点及偏移恢复位置；固定顶部控制栏让阅读时也能直接切换。刷新会清空当前页面内存状态。

## 模拟边界与复用

TaskEngine 是本地计时器与模板演示，不调用真实 Agent、模型、检索或后端。附件仅使用名称、大小、类型和修改时间，不读取正文、不上传。样稿正文使用通用原创中文模板并保留原任务，界面翻译不改写原文。结构图统计文本段落，不表示执行进度。

实际复用安装资源中的 choice-switch.mjs / CSS、palette-presets.mjs、tokens.mjs 与 theme-contrast.mjs。TaskEngine、页面与内容是独立项目实现。发布前主会话补充固定控制栏与相应阅读锚点判断，并用浏览器核验实际交互。许可：[MIT](LICENSE)。

## 检查

从仓库根目录运行 `node --test examples/agent-task/tests/*.test.mjs`。状态检查覆盖双重确认、拒绝后重启、准备/待确认/生成三个阶段取消、旧回调隔离与错误恢复。便携检查核对相对依赖、UI 入口、色卡与复用文件一致性；安装资源比对使用本仓库 skills 目录。实际浏览器核验见 [VALIDATION](../../VALIDATION.md)。
