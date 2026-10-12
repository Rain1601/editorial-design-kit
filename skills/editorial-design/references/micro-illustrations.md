# 小型动态插画 / Micro illustrations

用于章节标题、Agent 输入区、笔记与空态的视觉标点。正文在一页连续展示；动画只在固定的小插画区域内部发生，不推动排版，不表达任务进度。三个原创 SVG 为工具包展开、纸张翻动和铅笔落笔，不包含 Anthropic 官方素材。

复制 `assets/editorial/micro-illustration.mjs` 和 `micro-illustration.css`，引入样式后使用：

```js
const illustration = mountMicroIllustration(host, {
  kind: 'toolbox', // toolbox | paper | pencil
  size: 96,       // 32–240 px
  label: '工具包展开',
  replayLabel: '重播工具包展开',
  autoplay: true,
  // Optional overrides; otherwise inherit the page's ink/surface/accent roles.
  colors: {accent: 'var(--brand-accent)'}
});
illustration.setLabels('Opening a toolkit', 'Replay toolkit opening');
await illustration.play();
illustration.settle();
illustration.destroy();
```

`colors` 只支持 ink/fill/accent 三个 CSS 颜色角色。保持语义变量能让 Paper、Paper Night 和自定义色卡共用同一图形。直接写固定颜色时调用方负责主题适配。尺寸改变占位，不改变正文信息。

进入视野播放一次，约 1.1 秒，带小范围错峰；静态图形是默认 DOM 状态，播放结束删除动画覆盖。重播按钮有可翻译名称和焦点样式。快速重播取消旧动画，旧 Promise 返回 false，不让过时完成覆盖新播放。离开视野或标签页隐藏时停在静帧；回到视野不自动反复播放。系统减少动态开启时立即静止，主动重播也跳过动画；无 Web Animations 时显示静帧。

语言切换调用 setLabels，不重建节点、不重播。主题直接更新上层语义色卡，不更改动画或业务状态。调用方卸载时 destroy，取消待执行动画、监听和观察器，移除本组件创建的节点。组件不持有报告阅读位置、Agent 输入、审批状态或产物。

可运行接入：`examples/research-report.html` 开头的纸张与末尾的铅笔、`examples/agent-task/agent-task.html` 标题旁的工具包；安装包自带 `assets/editorial/agent-starter.html` 同样使用工具包。报告示例在仓库 examples 下，核心模块和 Agent starter 随 skill 安装。

不要让每个段落都带循环插画。图形应有可理解的静态落点，动作只补充一个含义。复杂素材可另选 Lottie 或短视频，不能把技术选择误写成统一美学要求。
