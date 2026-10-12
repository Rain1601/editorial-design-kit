# Dashboard：重排与模块详情

Dashboard 先回答读者当前要比较、检查或处理什么。主趋势可以占更大面积，列表和备忘按内容选尺寸；不要把每一项都做成同宽同高的卡片。示例 `../assets/editorial/dashboard.html` 使用研究工作台与合成数据，包含趋势、队列、材料构成、问题、备忘和审阅节奏，不代表实时业务执行。

## 接入

复制 `dashboard-board.mjs` 与 `dashboard-board.css`，或直接复制完整 dashboard.html / css / mjs 及相对依赖。组件不要求外部拖拽库。宿主的直接子节点是模块，稳定 ID 与页面业务对象一致：

```html
<div id="board">
  <article data-module-id="trend" data-module-title="研究节奏"
           style="grid-column:span 8">
    <h2>研究节奏</h2>
    <button data-expand-module>展开 ↗</button>
    <button data-drag-handle aria-label="重排研究节奏">⠿</button>
    <!-- 原图表、表格或输入内容 -->
  </article>
</div>
```

```js
const board = mountDashboardBoard(host, {
  state: {order:['trend','queue'], expandedId:null},
  scrollOffset:120, // 按当前页的固定顶栏高度选择；默认24px
  labels:{close:'返回工作视图',modules:'其他模块',titles:{trend:'研究节奏',queue:'下一步'}},
  onChange: next => { savedLayout = next; },
  reducedMotion: () => matchMedia('(prefers-reduced-motion: reduce)').matches
});
board.getState();
board.setExpanded('trend');
board.setLabels({close:'Back to work view',titles:{trend:'Research rhythm',queue:'Up next'}});
board.setExpanded(null);
board.destroy();
```

state.order 必须包含本次所有模块且各出现一次；expandedId 为 null 或已知 ID。缺失、重复或未知身份在修改 DOM 前报错。getState 返回独立副本。没有固定列数的业务预设；附带 CSS 是12列布局起点，父页提供模块跨度，窄屏转为单列。采用非 dense 网格，让视觉顺序与 DOM 阅读顺序一致，允许内容需要的留白。

## 交互与职责

- 把手开始指针拖拽，原卡片随指针移动，占位与其他卡片按最近目标平滑让位；松手提交顺序并吸附。键盘空格／Enter抓取，方向键按线性顺序移动，空格／Enter提交。Escape、指针取消、失去捕获、窗口失焦或尺寸变化取消预排。草稿顺序不通过 onChange 提前提交。
- 展开按钮把原模块扩至主区，其他原模块 hidden / inert 并作为底部文字缩略导航；缩略导航选择另一模块，Escape或返回按钮收回。保留原节点，不克隆图表、输入或 ID。展开状态不是模态对话框，不引入焦点陷阱。
- 关闭回到打开前的触发控件和阅读位置。scrollOffset 与宿主固定顶栏协调，避免把放大内容藏在顶栏下面。固定顶栏属于页面布局，组件不替宿主创建。
- 状态与业务内容分开。翻译只更新原控件文案、模块标题和 setLabels；换配色只写语义变量。原输入、每张图的模式、顺序与 expandedId 沿用同一实例。不要在翻译时销毁卡片或重新挂载 board。
- 动效使用实际位置／大小的 FLIP，减少动态时直接应用新布局；不等待动画结束才决定顺序或模块身份。destroy 清理事件、动画与辅助节点，并还原挂载前 DOM／属性。组件不写磁盘或账号配置，持久化由调用方明确选择。

此版本不提供跨网格拖放、自由尺寸调整或拖到视口边缘自动滚动。长列表可用键盘连续移动；需要这些能力时按真实任务扩展并验证，不把当前示例称为完整布局编辑器。

## 验收

用不同跨度与长短内容验证指针提交、键盘取消、重复展开／切换／关闭。编辑一个输入，选一个图表模式，重排后放大，再换语言与主题；检查对象 ID、原内容、顺序与详情身份仍相同，回程恢复焦点。独立还原带 expandedId 的已保存状态并确认数据不被组件推断。程序检查与有限浏览器验证分别记录，不声称完整触屏／跨浏览器可访问性审计。
