/** Original editorial pictograms. Presentation only: never task or evidence progress. */
const drawings={
 toolbox:`<path d="M34 76 L36 113 Q79 119 124 113 L127 76 Z"/><path d="M62 51 L63 37 Q80 25 97 37 L98 51"/><g data-part="tools"><path d="M57 88 L53 51 L62 48 L70 88 Z"/><path d="M91 88 L91 55 Q79 47 87 37 L96 43 L103 35 Q113 47 102 56 L103 88"/></g><g data-part="lid"><path d="M34 76 Q36 49 62 49 L99 49 Q124 51 127 76 Z"/><path d="M34 76 L127 76"/></g><path d="M56 72 L56 86 M107 72 L107 86"/>`,
 paper:`<path d="M44 41 L105 38 L115 115 L49 119 Z"/><path d="M40 37 L103 34 L110 110 L43 114 Z"/><g data-part="page"><path d="M37 32 L99 30 L105 105 L40 110 Z"/><path class="edk-ink-line" d="M52 52 L86 50 M53 63 L89 61 M54 74 L83 72 M55 86 L72 84"/></g>`,
 pencil:`<path d="M34 109 Q62 113 106 108" class="edk-ink-line"/><path data-part="mark" class="edk-mark" pathLength="1" d="M41 102 Q51 94 66 101 T93 101"/><g data-part="pencil"><path d="M58 91 L96 37 L108 46 L70 100 Z"/><path d="M96 37 L101 30 Q104 28 108 31 L115 36 Q117 39 114 43 L108 46" class="edk-eraser"/><path d="M58 91 L54 107 L70 100 M96 37 L108 46 M62 94 L102 42"/></g>`
};
export function mountMicroIllustration(host,{kind='toolbox',size=96,label='Decorative illustration',replayLabel='Replay illustration',autoplay=true,colors={},reducedMotion}={}){
 if(!host?.ownerDocument||!drawings[kind]||!Number.isFinite(size)||size<32||size>240||typeof autoplay!=='boolean'||Object.entries(colors).some(([key,value])=>!['ink','fill','accent'].includes(key)||typeof value!=='string'))throw new TypeError('Invalid illustration options');
 const doc=host.ownerDocument,win=doc.defaultView,query=win?.matchMedia?.('(prefers-reduced-motion: reduce)'),reduce=reducedMotion??(()=>query?.matches??false);
 if(typeof reduce!=='function')throw new TypeError('Invalid reduced motion callback');
 const root=doc.createElement('span');root.className='edk-micro';root.style.setProperty('--micro-size',`${size}px`);for(const [key,value] of Object.entries(colors))root.style.setProperty(`--micro-${key}`,value);
 root.innerHTML=`<svg viewBox="0 0 160 145" role="img" class="edk-micro-svg"><g class="edk-micro-drawing">${drawings[kind]}</g></svg><button type="button" class="edk-micro-replay">↻</button>`;
 const svg=root.querySelector('svg'),button=root.querySelector('button');host.append(root);
 let effects=[],epoch=0,destroyed=false,observer=null,seen=false;
 function setLabels(nextLabel,nextReplay){svg.setAttribute('aria-label',nextLabel);button.setAttribute('aria-label',nextReplay);button.title=nextReplay;}
 setLabels(label,replayLabel);
 function settle(){epoch++;for(const effect of effects)effect.cancel();effects=[];root.dataset.motion='still';}
 async function play(){if(destroyed)return false;settle();seen=true;if(reduce()||!svg.animate)return true;const token=epoch;root.dataset.motion='playing';
 const animate=(part,frames,delay=0)=>{const el=root.querySelector(`[data-part="${part}"]`);effects.push(el.animate(frames,{duration:1100,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}));};
 if(kind==='toolbox'){animate('lid',[{transform:'translateY(0px) rotate(0deg)'},{transform:'translateY(-22px) rotate(-10deg)',offset:.6},{transform:'translateY(-18px) rotate(-8deg)'}]);animate('tools',[{transform:'translateY(19px)',opacity:0},{transform:'translateY(-3px)',opacity:1,offset:.65},{transform:'none',opacity:1}],90);}
 if(kind==='paper')animate('page',[{transform:'perspective(350px) rotateY(0deg)'},{transform:'perspective(350px) rotateY(-110deg)',offset:.48},{transform:'perspective(350px) rotateY(0deg)'}]);
 if(kind==='pencil'){animate('pencil',[{transform:'translate(24px,-19px) rotate(-12deg)'},{transform:'translate(-10px,5px) rotate(4deg)',offset:.4},{transform:'none'}]);animate('mark',[{strokeDashoffset:'1'},{strokeDashoffset:'1',offset:.35},{strokeDashoffset:'0'}]);}
 const running=[...effects];try{await Promise.all(running.map(effect=>effect.finished));}catch{return false;}if(destroyed||token!==epoch)return false;settle();return true;
 }
 const replay=()=>void play();button.addEventListener('click',replay);
 const preference=()=>{if(reduce())settle();};query?.addEventListener?.('change',preference);
 const visibility=()=>{if(doc.hidden)settle();};doc.addEventListener('visibilitychange',visibility);
 if(autoplay&&win?.IntersectionObserver){observer=new win.IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting&&!seen)void play();else if(!entry.isIntersecting&&root.dataset.motion==='playing')settle();}},{threshold:.5});observer.observe(root);}else if(autoplay)void play();
 root.dataset.motion??='still';
 return {play,settle,setLabels,getState:()=>({kind,played:seen,playing:root.dataset.motion==='playing'}),destroy(){if(destroyed)return;settle();destroyed=true;observer?.disconnect();query?.removeEventListener?.('change',preference);doc.removeEventListener('visibilitychange',visibility);button.removeEventListener('click',replay);root.remove();}};
}
