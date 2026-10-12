# Continuous single-page reading

Default to enough content on one page. Keep the complete article mounted and readable; the outline navigates within it. Do not split a report into next/previous screens, force every chapter to viewport height, intercept wheel input, or require snapping. Functional app views may use separate navigation when the task calls for it.

## Adapter

Copy `assets/editorial/chapter-navigator.mjs` and `.css` together. The caller supplies a native scrolling host and its height. Its direct child sections require unique `data-chapter-id` values and a `[data-chapter-heading]` with `tabindex="-1"`.

```js
const reading = mountChapterNavigator(host, {
  state: {chapterId: 'question', offset: 0},
  onChange: state => updateOutline(state.chapterId)
});
await reading.setChapter('evidence');
const anchor = reading.getState();
translateExistingNodes();
reading.restore(anchor);
```

`offset` is a fraction of the chapter's actual rendered height, from 0 to 1. Save immediately before translation, restore after updating the original nodes, and repaint the outline from `getState()`; restoration is silent and skips animation. Browser scroll limits can clamp the last chapter's position. This is a chapter-relative reading anchor, not an exact word anchor across translations.

Explicit outline navigation focuses the target heading without an extra browser scroll. Passive scroll never moves focus. Wheel, touch, pointer and scroll keys cancel an in-flight outline jump; newer navigation supersedes older navigation. `destroy()` cancels pending work and restores original attributes and scroll position. Invalid identities or offsets reject before mutation.

Section entrance uses a short, subtle reveal. Reduced motion skips this and animated jumps. Native content remains readable if JavaScript is absent. Proximity snapping is available only by explicit caller choice for suitable short content; continuous reports leave it off.

## Specimen and boundaries

`assets/editorial/scroll-story.html` combines continuous prose, an outline, a curved scroll-driven relationship illustration, an inline annotation, a comparison table and a note. All four sections stay visible. Language changes preserve the chapter anchor, logical annotation expansion and input; palette changes preserve existing nodes. Notes are in-memory only.

The curved lines represent relationships and follow actual scroll geometry in either direction. They do not represent evidence quality, retrieval completion or Agent execution progress. The gray base drawing remains visible; reduced motion shows the whole drawing. This specimen is authored method content, not empirical research or an Anthropic asset.
