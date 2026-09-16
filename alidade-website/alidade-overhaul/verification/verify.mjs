/* verification/verify.mjs · ALIDADE v2 surface harness
   Cloned from the STARCHITECT v9 harness; same checks, ALIDADE screens and palette.
   Run: node verification/verify.mjs   (needs playwright; uses the local chromium if PW_CHROME is set)
   Checks every v2 surface at 1440 and 390:
     1. no horizontal scroll        2. every text node >= 10px
     3. every interactive element >= 44px on one axis (touch floor)   4. visible focus ring on first focusable
     5. reduced-motion: no running animations after load             6. no external network requests (zero CDN)
     7. AA contrast on a sample of text nodes against their computed background
     8. banned terms in visible text (ALIDADE house style permits em dashes; that check is off here)
   Exit code 1 on any failure. Report written to verification/report.json. */
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const here=dirname(fileURLToPath(import.meta.url));
const SCREENS=[
  ['website',        '../templates/website-v2/index.html'],
  ['platform-command',  '../ui_kits/platform-v2/index.html#command'],
  ['platform-matches',  '../ui_kits/platform-v2/index.html#matches'],
  ['platform-intel',    '../ui_kits/platform-v2/index.html#intel'],
  ['platform-pipeline', '../ui_kits/platform-v2/index.html#pipeline'],
  ['platform-proposals','../ui_kits/platform-v2/index.html#proposals'],
  ['platform-govfeed',  '../ui_kits/platform-v2/index.html#govfeed'],
  ['platform-partners', '../ui_kits/platform-v2/index.html#partners'],
  ['platform-control',  '../ui_kits/platform-v2/index.html#control'],
  ['mobile',         '../concepts/mobile-v2/index.html'],
  ['card-tokens',    '../guidelines/decision-token-reconciliation.card.html'],
  ['card-states',    '../guidelines/state-marks.card.html'],
  ['thumbnail',      '../thumbnail.html', [1440]],   // fixed 1280 tile, one width
];
const BANNED=/VOSB|Veteran[- ]Owned|veteran-(owned|built|led)|VetCert|main\.hypati\.us|hypatius\.io|Sara Dillan|Brian Willcott|CJADC2|Hypatius, Inc|HYPATIUS LLC\b|Hypatius LLC\b|Open WebUI|LEGION|NOMAD|PANTHEON/;
const b=await chromium.launch(process.env.PW_CHROME?{executablePath:process.env.PW_CHROME}:{});
const report=[]; let fails=0;
function note(screen,vp,check,ok,detail){ report.push({screen,vp,check,ok,detail}); if(!ok){ fails++; console.log(`  ✕ ${screen}@${vp} ${check}: ${detail}`); } }
for (const [s,path,only] of SCREENS){
  for (const [w,h] of [[1440,900],[390,844]].filter(v=>!only||only.includes(v[0]))){
    const ctx=await b.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});
    const p=await ctx.newPage();
    const ext=[]; p.on('request',r=>{ const u=r.url(); if(!u.startsWith('file:')&&!u.startsWith('data:')) ext.push(u); });
    const [file,hash]=path.split('#'); await p.goto('file://'+resolve(here,file)+(hash?'#'+hash:''),{waitUntil:'load'}); await p.waitForTimeout(500);
    const r=await p.evaluate(()=>{
      const out={};
      out.hscroll=document.documentElement.scrollWidth>document.documentElement.clientWidth+1;
      const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); const small=[]; const txt=[];
      let n; while((n=walker.nextNode())){ const t=n.textContent.trim(); if(!t) continue; const el=n.parentElement; if(!el||!el.offsetParent&&el.tagName!=='BODY') continue; const cs=getComputedStyle(el); if(cs.display==='none'||cs.visibility==='hidden') continue; const fs=parseFloat(cs.fontSize); txt.push(t); if(fs<10 && !el.closest('svg') && !el.classList.contains('al-sr')) small.push(`${fs}px "${t.slice(0,30)}"`); }
      out.small=small.slice(0,6); out.text=txt.join(' ');
      const inter=[...document.querySelectorAll('button,a[href],input,[role=button],[tabindex]:not([tabindex="-1"])')].filter(e=>e.offsetParent); const tiny=[];
      inter.forEach(e=>{ const r=e.getBoundingClientRect(); if(r.width<44&&r.height<44&&!e.classList.contains('al-skip')) tiny.push(`${e.tagName}.${e.className.toString().split(' ')[0]} ${Math.round(r.width)}x${Math.round(r.height)}`); });
      out.tiny=tiny.slice(0,6); out.interCount=inter.length;
      out.anim=document.getAnimations().filter(a=>a.playState==='running'&&(a.effect.getTiming().iterations===Infinity)).length;
      // contrast sample
      const lum=c=>{ const m=c.match(/\d+(\.\d+)?/g).map(Number); const [r,g,b]=m.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}); return .2126*r+.7152*g+.0722*b; };
      const parse=c=>{ const m=(c||'').match(/[\d.]+/g); if(!m) return [0,0,0,0]; const a=m.length>3?parseFloat(m[3]):1; return [+m[0],+m[1],+m[2],a]; };
      const bgOf=el=>{ // composite every translucent layer from the element up to an opaque one
        const layers=[]; let e=el; while(e){ const c=parse(getComputedStyle(e).backgroundColor); if(c[3]>0) layers.push(c); if(c[3]>=1) break; e=e.parentElement; }
        let out=[6,13,27]; for(const l of layers.reverse()){ out=out.map((v,i)=>Math.round(l[i]*l[3]+v*(1-l[3]))); } return `rgb(${out.join(', ')})`; };
      const lows=[]; const seen=new Set();
      document.querySelectorAll('span,div,td,th,dt,dd,a,b,p,li,output,kbd,small,h1,h2,h3').forEach(el=>{ if(!el.offsetParent) return; const t=(el.childNodes[0]&&el.childNodes[0].nodeType===3)?el.childNodes[0].textContent.trim():''; if(!t||seen.has(t)) return; seen.add(t); const cs=getComputedStyle(el); if(parseFloat(cs.opacity)<1) return; if(el.closest('[disabled],[aria-disabled="true"],[aria-hidden="true"]')) return; /* WCAG 1.4.3 exempts inactive controls and decoration */ const fg=cs.color, bg=bgOf(el); if(fg.startsWith('rgba')&&parseFloat(fg.split(',')[3])<1) return; const L1=lum(fg),L2=lum(bg); const cr=(Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05); const fs=parseFloat(cs.fontSize); const need=(fs>=18||(fs>=14&&parseInt(cs.fontWeight)>=700))?3:4.5; if(cr<need) lows.push(`${cr.toFixed(2)} "${t.slice(0,26)}" ${fg} on ${bg}`); });
      out.lows=lows.slice(0,8); out.lowCount=lows.length;
      return out;
    });
    note(s,w,'no-horizontal-scroll',!r.hscroll,'page scrolls horizontally');
    note(s,w,'type-floor-10px',r.small.length===0,r.small.join(' · '));
    note(s,w,'hit-target-44',r.tiny.length===0,r.tiny.join(' · ')+` (${r.interCount} interactive)`);
    note(s,w,'reduced-motion-still',r.anim===0,`${r.anim} infinite animations still running`);
    note(s,w,'zero-cdn',ext.length===0,ext.slice(0,3).join(' '));
    note(s,w,'contrast-aa',r.lowCount===0,`${r.lowCount} low: `+r.lows.join(' | '));
    const bt=r.text.match(BANNED); note(s,w,'banned-terms',!bt,bt?bt[0]:'');
    // focus ring
    await p.keyboard.press('Tab'); if(await p.evaluate(()=>document.activeElement?.classList.contains('al-skip'))) await p.keyboard.press('Tab'); const fr=await p.evaluate(()=>{ const e=document.activeElement; if(!e||e===document.body) return 'none'; const cs=getComputedStyle(e); return (cs.outlineStyle!=='none'&&parseFloat(cs.outlineWidth)>0)?'ok':`no outline on ${e.tagName}.${e.className.toString().split(' ')[0]}`; });
    note(s,w,'focus-visible',fr==='ok'||fr==='none',fr==='none'?'no focusable controls on this surface':fr);
    await ctx.close();
  }
}
await b.close();
writeFileSync(resolve(here,'report.json'),JSON.stringify(report,null,1));
console.log(`\n${report.length} checks · ${fails} failed · report.json written`);
process.exit(fails?1:0);
