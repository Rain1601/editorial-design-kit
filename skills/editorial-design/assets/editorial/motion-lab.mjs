import {applyPalette} from './palette-presets.mjs';
import {mountChoiceSwitch} from './choice-switch.mjs';
import {mountDisclosureMotion,mountPresenceMotion,mountSelectionMotion} from './motion.mjs';
const $=id=>document.getElementById(id);
const zh=Object.fromEntries([...document.querySelectorAll('[data-copy]')].map(el=>[el.dataset.copy,el.textContent]));
const en={reduced:'Reduce motion',title:'Let every change leave a trace.',intro:'Three everyday interactions, three kinds of motion. Changes explain the content while keeping the reader oriented.',height:'Height · 220ms',article:'A report starts with a judgment.',summary:'Give the conclusion first, then reveal the evidence when needed. The trigger stays in place while content below makes room.',expand:'Reveal the evidence ＋',collapse:'Hide the evidence −',evidenceLabel:'EVIDENCE',quote:'A change should tell the reader where they were, and what just happened.',evidence:'This is an authored interaction specimen. Content may vary in length; no fixed height ceiling is used. Reversing a transition continues from its current height.',anchor:'This line follows the expanded content naturally, without being covered.',marker:'Position · 180ms',switchTitle:'Keep direction when changing perspective.',finding:'Findings',method:'Method',limits:'Limits',selectionNote:'An underline connects selections. Text changes immediately, without delaying reading.',presence:'Opacity and travel · 200ms',detailTitle:'Inspect one record while keeping the list.',recordContext:'Content and context',recordReturn:'Sources and reading return',recordState:'State and confirmation',note:'RECORD DETAIL',close:'Close ×',escape:'Escape closes the panel and returns focus to the selected record.',footer:'Local interaction specimen · Page-owned state · Language and appearance preserve selection'};
const views={finding:['动效帮助解释变化，不替代内容。','Motion explains a change; the content remains primary.'],method:['先确认用户动作和状态，再选择高度、位置或轻量进出。','Choose height, position or presence after defining the action and state.'],limits:['减少动态模式即时更新；示例不代表完整无障碍验收。','Reduced motion updates immediately. This specimen is not a full accessibility audit.']};
const records={context:['动作靠近对象。展开依据时保留上方摘要，不跳到另一页。','Keep actions near their objects. Reveal evidence beside its summary without navigating away.'],return:['关闭详情后回到原记录。核对来源时还应保存阅读锚点与焦点。','Return to the original record when details close. Source review also needs a reading anchor and focus return.'],state:['动效与业务状态分离。快速点击时最后一个动作生效，不等待旧动画结束。','Keep motion separate from business state. The latest action wins without waiting for an old animation.']};
let language='zh',expanded=false,selected='finding',record=null,returnTarget=null;
const copy=()=>language==='zh'?zh:en,pick=value=>value[language==='zh'?0:1];
const reducedMotion=()=>$('reduced').checked||matchMedia('(prefers-reduced-motion: reduce)').matches;
const disclosure=mountDisclosureMotion($('evidence'),{reducedMotion});
const presence=mountPresenceMotion($('detail-panel'),{reducedMotion});
const marker=mountSelectionMotion($('rail'),$('marker'),{reducedMotion});
function updateContent(){
 $('expand').textContent=expanded?(language==='zh'?'收起判断依据 −':en.collapse):copy().expand;$('expand').setAttribute('aria-expanded',String(expanded));
 document.querySelectorAll('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===selected)));
 $('perspective-title').textContent=copy()[selected];$('perspective-copy').textContent=pick(views[selected]);
 document.querySelectorAll('[data-record]').forEach(button=>{button.setAttribute('aria-pressed',String(button.dataset.record===record));button.setAttribute('aria-controls','detail-panel');});
 if(record){$('detail-heading').textContent=copy()[{context:'recordContext',return:'recordReturn',state:'recordState'}[record]];$('detail-copy').textContent=pick(records[record]);}
}
$('expand').onclick=()=>{expanded=!expanded;if(!expanded&&$('evidence').contains(document.activeElement))$('expand').focus({preventScroll:true});updateContent();disclosure.setExpanded(expanded);};
$('rail').addEventListener('click',event=>{const button=event.target.closest('[data-view]');if(!button)return;selected=button.dataset.view;updateContent();marker.moveTo(button);});
$('records').addEventListener('click',event=>{const button=event.target.closest('[data-record]');if(!button)return;record=button.dataset.record;returnTarget=button;updateContent();presence.setVisible(true);});
function close(){if(!record)return;record=null;updateContent();returnTarget?.focus({preventScroll:true});presence.setVisible(false);}
$('close').onclick=close;document.addEventListener('keydown',event=>{if(event.key==='Escape'&&record){event.preventDefault();close();}});
$('reduced').onchange=()=>{disclosure.setExpanded(expanded);presence.setVisible(Boolean(record));marker.refresh();};
const languageSwitch=mountChoiceSwitch($('language'),{choices:[{value:'zh',label:'中文'},{value:'en',label:'English'}],value:'zh',label:'语言 / Language',onChange:value=>{
 const anchors=[...document.querySelectorAll('main>section')];const line=document.querySelector('header').getBoundingClientRect().bottom+32;const anchor=anchors.filter(el=>el.getBoundingClientRect().top<=line).at(-1)||anchors[0];const top=anchor.getBoundingClientRect().top;
 language=value;languageSwitch.setValue(value);document.documentElement.lang=value==='zh'?'zh-CN':'en';document.querySelectorAll('[data-copy]').forEach(el=>el.textContent=copy()[el.dataset.copy]);updateContent();marker.refresh();scrollBy(0,anchor.getBoundingClientRect().top-top);
}});
const paletteSwitch=mountChoiceSwitch($('palette'),{choices:[{value:'paper',label:'Paper'},{value:'paper-night',label:'Paper Night'}],value:'paper',label:'外观 / Appearance',onChange:value=>{paletteSwitch.setValue(value);applyPalette(document.documentElement,value);document.documentElement.style.colorScheme=value==='paper'?'light':'dark';}});
applyPalette(document.documentElement,'paper');updateContent();marker.moveTo(document.querySelector('[data-view="finding"]'));
