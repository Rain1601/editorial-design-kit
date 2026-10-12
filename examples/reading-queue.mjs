import {mountChoiceSwitch} from '../skills/editorial-design/assets/editorial/choice-switch.mjs';
import {ItemList} from '../skills/editorial-design/assets/editorial/compound-components.mjs';
import {applyPalette} from '../skills/editorial-design/assets/editorial/palette-presets.mjs';
import {appearancePalettes} from './queue-config.mjs';

export const items = [
  {id:'borrowed-hour', en:{title:'The borrowed hour', author:'Mira Vale', kind:'Essay', description:'On leaving a little time unclaimed.', paragraphs:['At the end of the lane, a clockmaker left one clock unwound. Customers called it unfinished. She called it the hour that belonged to nobody.', 'Each evening she sat beneath it with a cup of tea. Nothing was measured there: not the cooling water, not the length of a conversation, not the quiet after a visitor left.'], thought:'What would you do with an hour you did not have to account for?'}, zh:{title:'借来的一小时', author:'米拉·维尔', kind:'随笔', description:'留一点不被安排的时间。', paragraphs:['小巷尽头，一位钟表匠留了一只没有上发条的钟。客人说它还没修好。她说，那是一个不属于任何人的小时。','每天傍晚，她端着茶坐在钟下。在那里，什么都不必计量：渐凉的茶水、一次谈话的长短，还有客人离开后的安静。'], thought:'如果有一小时不必交代用途，你会怎样度过？'}},
  {id:'rain-library', en:{title:'A library for rain', author:'Elias Reed', kind:'Short fiction', description:'A small archive of passing weather.', paragraphs:['The village library kept its rain in notebooks. A soft drizzle filled half a page; a summer storm could take an entire volume. No two readers agreed on how to describe the sound.', 'When the dry season came, the librarian opened the windows and read aloud. People gathered, remembering different afternoons. The notebooks held no water, but there was something in them worth sharing.'], thought:'A record can preserve a feeling without preserving the thing itself.'}, zh:{title:'雨的图书馆', author:'伊莱亚斯·里德', kind:'短篇小说', description:'为路过的天气，留一份小小的档案。', paragraphs:['村里的图书馆把雨收在笔记本中。细雨占半页，夏日暴雨能写满一整册。对于雨声该如何描述，读者们从未达成一致。','旱季到来，管理员推开窗，大声朗读。人们聚在一起，想起各自不同的午后。笔记本里没有水，却有值得分享的东西。'], thought:'记录留不住事物本身，却可能留住一种感受。'}},
  {id:'margin-garden', en:{title:'The margin garden', author:'Nora Finch', kind:'Field note', description:'Finding room at the edge of a page.', paragraphs:['A gardener drew her first planting plan on the back of a letter. The useful beds went in the middle. In the margins she sketched the flowers she had been told were impractical.', 'By autumn, bees spent most of their time along the edges. The next year she made the margins wider. The plan became less orderly, and the garden became more alive.'], thought:'Which useful things begin outside the plan?'}, zh:{title:'页边的花园', author:'诺拉·芬奇', kind:'田野笔记', description:'在一页纸的边缘，找到生长的余地。', paragraphs:['一位园丁在信纸背面画下第一张种植图。实用的菜畦排在中央。页边空白处，她画了几种别人说不实用的花。','到了秋天，蜜蜂大多停留在花园边缘。第二年，她把页边留得更宽。图纸不再那么整齐，花园却更有生气了。'], thought:'哪些有用的事物，是从计划之外开始的？'}}
];
const copy = {
  en:{skip:'Skip to reading', language:'Language', appearance:'Appearance', eyebrow:'A little room for attention', title:'Reading queue', deck:'Three small readings. Take one thought with you.', fiction:'Fictional collection · All titles, authors and excerpts are invented for this demo.', queue:'On the shelf', hint:'Choose a title to read its short excerpt.', thought:'A thought to keep', endnote:'End of fictional excerpt', footer:'A small shelf, an unhurried pace.', fictional:'Fictional', by:'By', selected:'Selected'},
  zh:{skip:'跳至阅读正文', language:'语言', appearance:'外观', eyebrow:'留一点专注的余地', title:'阅读清单', deck:'三篇小文，带走一个念头。', fiction:'虚构选集 · 所有标题、作者与节选均为本演示创作。', queue:'书架上', hint:'选择一个标题，阅读它的短篇节选。', thought:'留一个念头', endnote:'虚构节选完', footer:'小小书架，慢慢阅读。', fictional:'虚构', by:'作者：', selected:'已选择'}
};
// Session-only state. Appearance never owns or reconstructs reading state.
export function mountQueue(doc = document) {
  const state = {selected:items[0].id, language:'en', appearance:'paper'};
  const get = id => doc.getElementById(id);
  function render() {
    const words = copy[state.language];
    doc.documentElement.lang = state.language === 'zh' ? 'zh-CN' : 'en';
    doc.querySelectorAll('[data-copy]').forEach(el => {el.textContent = words[el.dataset.copy];});
    get('appearance').setAttribute('aria-label',words.appearance);
    get('queue').innerHTML = ItemList({id:'reading-items', label:words.queue, selected:state.selected, items:items.map(item => ({id:item.id, title:item[state.language].title, description:item[state.language].description, meta:`${words.fictional} · ${item[state.language].kind}`}))});
    const item = items.find(item => item.id === state.selected)[state.language];
    get('detail-meta').textContent = `${String(items.findIndex(item => item.id === state.selected)+1).padStart(2,'0')} / 03 · ${words.fictional} · ${item.kind}`;
    get('detail-title').textContent = item.title;
    get('detail-byline').textContent = `${words.by} ${item.author} · ${words.fictional}`;
    get('paragraph-one').textContent = item.paragraphs[0];
    get('paragraph-two').textContent = item.paragraphs[1];
    get('detail-thought').textContent = item.thought;
  }
  get('queue').addEventListener('click', event => {
    const button = event.target.closest('[data-item-id]');
    if (!button || !items.some(item => item.id === button.dataset.itemId)) return;
    state.selected = button.dataset.itemId;
    render();
    get('queue').querySelector(`[data-item-id="${state.selected}"]`).focus({preventScroll:true});
    get('announcement').textContent = `${copy[state.language].selected}: ${get('detail-title').textContent}`;
  });
  get('language').addEventListener('change', event => {state.language = event.target.value; render();});
  const appearanceSwitch=mountChoiceSwitch(get('appearance'),{choices:[{value:'paper',label:'Paper'},{value:'paper-night',label:'Paper Night'}],value:state.appearance,onChange:next=>{
    applyPalette(doc.documentElement, appearancePalettes[next]);
    doc.documentElement.style.colorScheme = next === 'paper-night' ? 'dark' : 'light';
    state.appearance = next;appearanceSwitch.setValue(next);
  }});
  applyPalette(doc.documentElement, appearancePalettes.paper);
  render();
  return {getState:() => ({...state})};
}
if (typeof document !== 'undefined') mountQueue();
