# 编辑式动效：表达变化与保留上下文

动效先回答一个具体问题：哪个区域展开了、当前读的是哪个对象、这次选择落在哪里。层级由内容顺序、留白和字体建立，动画帮助看清变化。不要默认循环装饰、延迟全部正文、用不断移动的形状替代真实执行记录，也不要用动画模拟未知进度。

输入／事件、业务状态和呈现分别处理：用户动作先更新调用方状态与可访问语义，再让 motion 呈现这个变化。Motion 组件不选择记录、不改变任务阶段、不批准请求、不保存数据。语言与配色切换沿用同一业务状态，不以重新播放入场作为重建页面的理由。

## 三种常用表达

| 变化 | 接口 | 默认时长 | 用途与边界 |
|---|---|---|---|
| 正文中的区域展开／收起 | `mountDisclosureMotion(region, options)` | 220ms | 高级设置、说明、详细记录；下面内容随自然高度移动 |
| 非模态详情出现／退出 | `mountPresenceMotion(region, options)` | 200ms | 主从详情、辅助注释；透明度与 12px 短距离变化 |
| 当前选择标记迁移 | `mountSelectionMotion(host, marker, options)` | 180ms | 少量平铺选项的下划线；选择身份由调用方持有 |

实现位于 `../assets/editorial/motion.mjs`。选用当前任务需要的一种即可；已有 reading-media、linked-charts、image-inspector 等交互继续使用自己的源码契约，不统一改成一种动效。

## 展开区域

```js
const disclosure = mountDisclosureMotion(region, {
  duration: 220,
  reducedMotion: () => matchMedia('(prefers-reduced-motion: reduce)').matches
});
// expanded 属于调用方；region 本身不是业务状态。
trigger.setAttribute('aria-expanded', String(expanded));
const settled = await disclosure.setExpanded(expanded);
disclosure.destroy();
```

返回 `{setExpanded(boolean):Promise<boolean>, destroy()}`。region 使用实际测量的当前高度向目标高度过渡，快速反向从当前呈现继续；展开完成恢复自然高度，正文换行或新增内容能正常增长。收起与展开的 hidden / inert 状态由组件同步处理。不要在同一区域再叠加独立 height 动画或自行修改同一 hidden / inert 状态。

通用设置保持在高级设置之前；展开改变后面的内容，不能通过容器垂直居中让页首漂移。折叠前若焦点位于区域内，调用方先把焦点送回触发按钮，避免焦点留在即将不可操作的区域。组件不替调用方维护 aria-expanded、触发按钮、阅读锚点或焦点回程。

## 非模态详情

```js
const presence = mountPresenceMotion(panel, {
  duration: 200, offset: 12,
  reducedMotion: () => matchMedia('(prefers-reduced-motion: reduce)').matches
});
const settled = await presence.setVisible(visible);
presence.destroy();
```

返回 `{setVisible(boolean):Promise<boolean>, destroy()}`。淡入淡出配合小幅位移即可表达前后关系；组件同步 panel 的 hidden / inert，不引入模态焦点陷阱。占据文档空间、绝对定位或压窄列表由页面布局选择，motion 不决定布局。

调用方更新当前对象、列表高亮和详情内容，保留稳定对象 ID。用户关闭详情时按任务回到触发按钮或原行；Escape 关闭行为、ARIA 关系以及焦点回程由调用方实现。需要模态交互时使用已有 dialog 契约，不把此组件当作完整对话框。

## 选择下划线

```js
const selection = mountSelectionMotion(host, marker, {
  duration: 180,
  reducedMotion: () => matchMedia('(prefers-reduced-motion: reduce)').matches
});
// host 提供定位上下文；marker 为装饰性绝对定位下划线。
marker.setAttribute('aria-hidden', 'true');
buttons.forEach(button => button.setAttribute('aria-pressed', String(button === selected)));
const settled = await selection.moveTo(selected);
selection.refresh(); // 换文案／布局后重新按当前目标测量
selection.destroy();
```

返回 `{moveTo(element):Promise<boolean>, refresh(), destroy()}`。目标必须是本次 host 中当前可测量的选项元素；标记位置来自 host 与目标的实际矩形，不按选项序号乘固定宽度。窗口／宿主尺寸变化后刷新位置；语言切换导致按钮宽度变化时也调用 refresh。标记仅装饰，不能承担唯一的选中信息；调用方维护 aria-pressed、可见文字、焦点和业务选择。

## 中断、减少动态与完成语义

三个组件都接受可调用的 `reducedMotion` 判断，默认读取系统减少动态偏好。每次更新重新判断，减少动态时不做位移或高度旅行，直接应用终态；不要只在页面加载时缓存一次偏好。动画取消的 Promise 返回 false，当前请求稳定完成返回 true；后发请求决定终态，旧请求不得把较新的选择或可见性覆盖回去。

组件的 Promise 只说明呈现是否稳定，不说明业务成功。不要在动画完成后才批准请求或决定当前对象；如果确实有完成后的布局操作，先判断 settled 并核对当前请求身份。卸载调用 destroy，清理观察与正在进行的动画；不能把已取消的过渡当成失败的业务运行。

快速点击、键盘操作和减少动态都必须得到相同最终内容与语义。允许用户连续操作，不为保全动画锁住控件。视觉进入结束也不应自动抢焦点；仅按明确任务动作移动焦点。

## 最小验收

检查一次展开中反向收起、详情连续切换、不同长度选项与窗口缩放，以及系统减少动态开启后的立即更新。确认最后一个请求的终态有效、取消请求返回 false、收起区域不可操作、打开区域恢复自然尺寸。再检查键盘焦点与 aria-expanded / aria-pressed、主题与语言切换后的内容和位置。程序验证不等于完整可访问性审计；报告实际检查与未验证范围。

可运行样例是 `../assets/editorial/motion-lab.html`，与 `motion-lab.mjs`、`motion-lab.css` 及引用的公共模块保持相对目录关系。region 使用独立包装层，避免叠加既有 height / translate 动画；marker 的 transform-origin 应为 left center。样例保留选择、展开及详情身份，支持中文 / English、Paper / Paper Night 与显式减少动态开关。

## 原生 details 与实际页面

`mountDetailsMotion(details, {onChange, duration, reducedMotion})` 适配包含直接 summary 的原生 details。返回 `{getExpanded(), setExpanded(next, {animate:true}), destroy()}`；setExpanded 返回稳定完成的 Promise<boolean>。用户点击先更新逻辑状态及 aria-expanded，再呈现自然高度变化。收起时若焦点在正文内，回到 summary。onChange 只通知用户点击后的逻辑状态，程序恢复不会重复触发它。

关闭动画期间 details.open 暂时保持 true。保存状态必须读 getExpanded()，不能把过渡中的原生 open 当成业务状态。恢复页面用 `setExpanded(saved, {animate:false})`，避免语言切换重播入场。destroy 取消动画并还原子节点顺序，保留最新逻辑展开状态。

报告 reader 默认把该适配器用于说明区，把 selection 用于每张图的图表／数据标记；初始化与翻译恢复不播放。Agent 的 mountTaskExecution、mountTaskApproval、mountTaskArtifacts 使用 `{motion:true}` 显式启用：执行与产物结构展开、确认与产物区出现、产物下划线迁移。默认 false 保持原调用兼容。复制这些模块时包含 motion.mjs；挂载实例随页面卸载调用 destroy。

动效不清除确认、不批准任务、不改写产物。确认退出时内容暂时保留用于淡出，但控件立即禁用且调用方已结束 pending 状态。换标签时刷新标记测量，选择身份不变。减少动态偏好在每次状态更新检查，未实现播放中实时订阅系统偏好的变化。
