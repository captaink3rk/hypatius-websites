/* tour.js · v9 demo tour overlay. Reads window.TOUR = {title,next,steps:[{sel,cap,ms}]}.
   Dev-flag overlay for BD recordings. Press T to start, Esc to stop, → for next.
   Motion: transform and opacity only; honors prefers-reduced-motion. No dependencies. */
(function(){
'use strict';
const T=window.TOUR; if(!T||!T.steps||!T.steps.length) return;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const css=`
.sc-tour-btn{position:fixed;right:16px;bottom:calc(var(--sc-strip-h,18px) + 12px);z-index:80;display:inline-flex;align-items:center;gap:8px;min-height:36px;padding:0 14px;border-radius:var(--console-radius-sm,8px);border:1px solid var(--sc-gold-edge,rgba(232,163,61,.5));background:var(--sc-gold-fill,rgba(232,163,61,.09));color:var(--console-gold,#E8A33D);font:700 10px/1 "IBM Plex Mono",monospace;letter-spacing:.16em;text-transform:uppercase;cursor:pointer}
.sc-tour-btn:focus-visible{outline:2px solid var(--console-cyan,#40B4E5);outline-offset:2px}
.sc-tour-ring{position:fixed;z-index:79;pointer-events:none;border:2px solid var(--console-cyan,#40B4E5);border-radius:var(--console-radius,12px);box-shadow:0 0 0 9999px rgba(6,9,15,.62);transition:all ${RM?0:380}ms cubic-bezier(.16,1,.3,1);opacity:0}
.sc-tour-ring[data-on="true"]{opacity:1}
.sc-tour-cap{position:fixed;z-index:81;max-width:420px;padding:14px 16px;border-radius:var(--console-radius,12px);border:1px solid var(--console-line2,#324055);background:var(--console-panel,#10151E);color:var(--console-body,#A9BBCB);font:14px/1.55 "Rajdhani",system-ui,sans-serif;opacity:0;transform:translateY(6px);transition:opacity ${RM?0:220}ms,transform ${RM?0:220}ms}
.sc-tour-cap[data-on="true"]{opacity:1;transform:none}
.sc-tour-cap b{display:block;font:700 10px/1 "IBM Plex Mono",monospace;letter-spacing:.18em;text-transform:uppercase;color:var(--console-gold,#E8A33D);margin-bottom:8px}
.sc-tour-cap small{display:block;margin-top:10px;font:10px/1 "IBM Plex Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--sc-label,#7B8CA3)}`;
const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
const btn=document.createElement('button'); btn.className='sc-tour-btn'; btn.textContent='▸ Demo tour · T'; document.body.appendChild(btn);
const ring=document.createElement('div'); ring.className='sc-tour-ring'; document.body.appendChild(ring);
const cap=document.createElement('div'); cap.className='sc-tour-cap'; cap.setAttribute('role','status'); cap.setAttribute('aria-live','polite'); document.body.appendChild(cap);
let i=-1, timer=null, on=false;
function show(n){
  const s=T.steps[n]; if(!s){ stop(); if(T.next) location.href=T.next; return; }
  const el=document.querySelector(s.sel); if(!el){ show(n+1); return; }
  const r=el.getBoundingClientRect(), pad=8;
  Object.assign(ring.style,{left:(r.left-pad)+'px',top:(r.top-pad)+'px',width:(r.width+pad*2)+'px',height:(r.height+pad*2)+'px'}); ring.dataset.on='true';
  cap.innerHTML=`<b>${T.title} · ${n+1} / ${T.steps.length}</b>${s.cap}<small>→ next · Esc stop</small>`;
  const below=r.bottom+16+160<innerHeight;
  Object.assign(cap.style,{left:Math.min(Math.max(16,r.left),innerWidth-436)+'px',top:(below?r.bottom+16:Math.max(16,r.top-176))+'px'}); cap.dataset.on='true';
  clearTimeout(timer); timer=setTimeout(()=>show(n+1), s.ms||6500); i=n;
}
function start(){ on=true; btn.textContent='■ Stop tour · Esc'; show(0); }
function stop(){ on=false; clearTimeout(timer); ring.dataset.on='false'; cap.dataset.on='false'; btn.textContent='▸ Demo tour · T'; }
btn.addEventListener('click',()=>on?stop():start());
document.addEventListener('keydown',e=>{ if(e.target.tagName==='INPUT') return; if(e.key==='t'||e.key==='T'){ on?stop():start(); } if(on&&e.key==='ArrowRight'){ show(i+1); } if(on&&e.key==='Escape'){ stop(); } });
})();
