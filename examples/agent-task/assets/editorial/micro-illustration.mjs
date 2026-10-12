/** Original editorial pictograms. Presentation only: never task or evidence progress. */
const drawings={
 toolbox:`
 <g data-part="lid" class="edk-toolbox-lid">
  <path class="edk-toolbox-hardware" d="M58 33 C59 17 65 13 80 13 C96 13 101 19 102 33 L96 33 C95 21 91 19 80 19 C69 19 65 22 64 33 Z"/>
  <path d="M25 33 C17 34 14 44 14 56 L18 74 Q20 81 29 82 L130 82 Q141 81 143 72 L147 52 C147 40 142 33 133 33 Z"/>
  <path class="edk-toolbox-inside" d="M19 47 Q20 44 29 44 L132 44 Q141 44 142 49 L138 72 Q136 77 129 77 L30 77 Q23 77 22 72 Z"/>
  <path class="edk-toolbox-detail" d="M25 34 Q21 37 21 44 M135 34 Q140 38 141 45 M29 46 Q77 45 130 46"/>
  <path class="edk-toolbox-hardware" d="M57 31 Q61 30 66 31 L67 35 L57 35 Z M94 31 L105 31 L105 35 L95 35 Z"/>
 </g>
 <path class="edk-toolbox-inside" d="M24 78 L135 78 L144 87 Q82 93 17 87 Z"/>
 <g data-part="tools">
  <g data-tool="screwdriver">
   <path class="edk-toolbox-metal" d="M51 66 L58 65 L67 91 L60 93 Z"/>
   <path class="edk-toolbox-wood" d="M37 42 C34 36 37 32 43 32 C49 31 53 36 55 42 L61 58 Q64 65 58 68 L51 70 Q45 69 44 64 Z"/>
   <path class="edk-toolbox-detail" d="M41 40 L49 60 M47 38 L55 59 M47 64 Q52 61 60 61"/>
  </g>
  <g data-tool="spanner">
   <path class="edk-toolbox-metal" d="M79 91 L87 65 C78 59 79 50 86 45 L91 43 L88 55 L96 58 L102 47 C107 54 106 61 99 65 L92 95 Z"/>
   <path class="edk-toolbox-detail" d="M86 85 L91 71 Q93 69 94 72 L89 87"/>
  </g>
  <g data-tool="pencil">
   <path class="edk-toolbox-accent" d="M109 91 L121 62 L128 65 L119 95 Z"/>
   <path class="edk-toolbox-wood" d="M121 62 L129 46 L128 65 L125 62 L123 64 Z"/>
   <path class="edk-toolbox-tip" d="M125 53 L129 46 L129 55 Z"/>
   <path class="edk-toolbox-detail" d="M125 65 L115 91"/>
  </g>
 </g>
 <g class="edk-toolbox-front">
  <path d="M16 86 Q79 92 144 86 L143 121 Q142 128 134 128 L27 129 Q18 129 17 122 Z"/>
  <path class="edk-toolbox-detail" d="M19 89 Q79 95 141 89 M21 94 L22 111 M138 94 L138 111 M18 118 Q31 119 33 128 M128 128 Q130 120 142 118"/>
  <g class="edk-toolbox-hardware"><path d="M35 91 Q42 90 49 91 L49 100 Q42 102 35 100 Z M111 91 L125 91 L125 100 Q118 102 111 100 Z"/><path d="M39 94 Q42 92 45 94 L45 107 Q42 111 39 108 Z M115 94 Q118 92 121 94 L121 107 Q119 111 115 108 Z"/></g>
  <path class="edk-toolbox-detail" d="M40 105 Q42 108 44 105 M116 105 Q118 108 120 105"/>
 </g>`,
 paper:`<path class="edk-paper-back" d="M34 54 Q31 54 32 58 L43 122 Q44 125 48 124 L111 113 Q114 112 113 109 L102 44 Z"/><path class="edk-paper-back" d="M41 42 Q37 42 38 46 L48 112 Q49 115 53 114 L118 103 Q121 102 120 98 L108 32 Z"/><g data-part="page"><path class="edk-paper-sheet" d="M48 30 Q44 30 45 35 L56 101 Q57 105 61 104 L125 93 Q129 92 128 88 L119 42 L100 22 Z"/><path class="edk-paper-fold" d="M100 22 Q99 34 104 40 Q109 44 119 42 Z"/><path class="edk-pencil-detail" d="M63 52 Q78 50 96 46 M65 65 Q81 63 94 60 M68 78 Q78 76 91 74"/></g>`,
 pencil:`<path class="edk-pencil-node" d="M35 95 C27 94 23 100 24 107 C25 114 32 117 39 114 C46 111 47 104 43 99 Q40 95 35 95 Z"/><path data-part="mark" class="edk-mark" pathLength="1" d="M46 107 Q76 116 96 101"/><g data-part="pencil"><g transform="translate(14 5)"><path class="edk-pencil-body" d="M100 83 Q118 64 135 44 Q138 41 135 38 L126 30 Q123 28 121 31 L87 71 Z"/><path class="edk-paper-sheet" d="M87 71 Q94 78 100 83 L82 96 Z"/><path class="edk-pencil-tip" d="M85 88 L82 96 L91 91 Z"/><path class="edk-pencil-detail" d="M100 69 Q112 56 121 46"/></g></g>`
};
export function mountMicroIllustration(host,{kind='toolbox',size=96,label='Decorative illustration',replayLabel='Replay illustration',autoplay=true,colors={},reducedMotion}={}){
 if(!host?.ownerDocument||!drawings[kind]||!Number.isFinite(size)||size<32||size>240||typeof autoplay!=='boolean'||Object.entries(colors).some(([key,value])=>!['ink','fill','accent'].includes(key)||typeof value!=='string'))throw new TypeError('Invalid illustration options');
 const doc=host.ownerDocument,win=doc.defaultView,query=win?.matchMedia?.('(prefers-reduced-motion: reduce)'),reduce=reducedMotion??(()=>query?.matches??false);
 if(typeof reduce!=='function')throw new TypeError('Invalid reduced motion callback');
 const root=doc.createElement('span');root.className='edk-micro';root.dataset.kind=kind;root.style.setProperty('--micro-size',`${size}px`);for(const [key,value] of Object.entries(colors))root.style.setProperty(`--micro-${key}`,value);
 root.innerHTML=`<svg viewBox="0 0 160 145" role="img" class="edk-micro-svg"><g class="edk-micro-drawing">${drawings[kind]}</g></svg><button type="button" class="edk-micro-replay">↻</button>`;
 const svg=root.querySelector('svg'),button=root.querySelector('button');host.append(root);
 let effects=[],epoch=0,destroyed=false,observer=null,seen=false;
 function setLabels(nextLabel,nextReplay){svg.setAttribute('aria-label',nextLabel);button.setAttribute('aria-label',nextReplay);button.title=nextReplay;}
 setLabels(label,replayLabel);
 if(kind!=='toolbox')button.hidden=true;
 function settle(){epoch++;for(const effect of effects)effect.cancel();effects=[];root.dataset.motion='still';}
 async function play(){if(destroyed)return false;settle();seen=true;if(kind!=='toolbox'||reduce()||!svg.animate)return true;const token=epoch;root.dataset.motion='playing';
 const animate=(part,frames,delay=0)=>{const el=root.querySelector(`[data-part="${part}"]`);effects.push(el.animate(frames,{duration:1100,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}));};
 if(kind==='toolbox'){animate('lid',[{transform:'perspective(300px) rotateX(73deg) translateY(11px)'},{transform:'perspective(300px) rotateX(-3deg)',offset:.75},{transform:'none'}]);animate('tools',[{transform:'translateY(24px)',opacity:0},{transform:'translateY(-2px)',opacity:1,offset:.75},{transform:'none',opacity:1}],150);}
 const running=[...effects];try{await Promise.all(running.map(effect=>effect.finished));}catch{return false;}if(destroyed||token!==epoch)return false;settle();return true;
 }
 const replay=()=>void play();button.addEventListener('click',replay);
 const preference=()=>{if(reduce())settle();};query?.addEventListener?.('change',preference);
 const visibility=()=>{if(doc.hidden)settle();};doc.addEventListener('visibilitychange',visibility);
 if(autoplay&&win?.IntersectionObserver){observer=new win.IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting&&!seen)void play();else if(!entry.isIntersecting&&root.dataset.motion==='playing')settle();}},{threshold:.5});observer.observe(root);}else if(autoplay)void play();
 root.dataset.motion??='still';
 return {play,settle,setLabels,getState:()=>({kind,played:seen,playing:root.dataset.motion==='playing'}),destroy(){if(destroyed)return;settle();destroyed=true;observer?.disconnect();query?.removeEventListener?.('change',preference);doc.removeEventListener('visibilitychange',visibility);button.removeEventListener('click',replay);root.remove();}};
}
