/* ops.js · STARCHITECT v9 operator console
   Offline. No CDN. The theater is a procedural orthographic globe on canvas:
   a prototype proxy for the repo's self-hosted Cesium stack. Everything
   else here is the interaction model the repo should port 1:1.
   Composite exercise data. No customer information appears. */
(function(){
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const C={cyan:'#40B4E5',gold:'#E8A33D',mint:'#7FE8D8',red:'#FF5A4A',txt:'#EAF3FB',body:'#A9BBCB',mute:'#5B6C80',line:'#232B3A',bg:'#06090F'};
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- data: five control groups ---------------- */
const TG={
 1:{name:'TG1 Sentry',sub:'EO/IR custody pair · LEO 750 km',pf:'S1',ents:['s7','s9'],
    health:[['Array','nominal'],['Bus','nominal'],['EO/IR','degraded']],
    kv:[['Assets','S-7 · S-9'],['Custody','48219 · 94%'],['Δv pool','18.4 m/s'],['Next pass','KWA 06:12']],
    card:[['Q','◎','Task collect'],['W','↻','Slew / re-point'],['E','▲','Cross-cue'],['R','⌁','Burn · phase','high'],
          ['A','▤','Downlink'],['S','◇','Custody hold'],null,['X','✕','Cancel']]},
 2:{name:'TG2 Relay',sub:'Comms mesh · MEO 8000 km',pf:'R2',ents:['rel'],
    health:[['Array','nominal'],['Bus','nominal'],['X-link','nominal']],
    kv:[['Asset','Kestrel relay'],['Route','KWA ⇄ GUM ⇄ mesh'],['Bandwidth','340 mbps'],['Crosslink','ready']],
    card:[['Q','⇄','Reroute mesh'],['W','↑','Shift uplink'],['E','▲','Crosslink on'],['R','⌁','Boost TX','high'],
          ['A','▤','QoS priority'],null,null,['X','✕','Cancel']]},
 3:{name:'TG3 Warden',sub:'GSSAP-6 · GEO guardian',pf:'W3',ents:['gss'],
    health:[['Array','nominal'],['Bus','nominal'],['Optics','nominal']],
    kv:[['Asset','GSSAP-6'],['Threat','48219 · 14.2 km'],['Δv pool','22.8 m/s'],['COA','Shadow armed']],
    card:[['Q','◎','Inspect pass'],['W','↻','Station keep'],['E','▲','Standoff shadow','high'],['R','⌁','Evasive burn','high'],
          ['A','▤','Snap image'],['S','◇','Guard mode'],null,['X','✕','Cancel']]},
 4:{name:'TG4 Ground',sub:'Kwajalein + Guam · apertures',pf:'G4',ents:[],ll:[167.73,8.72],
    health:[['KWA','nominal'],['GUM','degraded'],['Fence','nominal']],
    kv:[['Sites','KWA · GUM'],['Tasking cap','27 sat-min'],['Status','nominal'],['Weather','KWA clear · GUM 3/8']],
    card:[['Q','◎','Radar fence'],['W','↻','Antenna re-point'],['E','▲','Filter notch'],['R','⌁','Site status'],
          null,null,null,['X','✕','Cancel']]},
 5:{name:'Contact 48219',sub:'Shadow class · red · GEO sector 4',pf:'48',ents:['obj'],red:true,
    health:[['Class','failed'],['Intent','degraded'],['Track','nominal']],
    kv:[['Class','Shadow · uncorr'],['Rel range','14.2 km · closing'],['Intent (AI)','Decoy screen 0.61'],['Branches','3 COAs · T+90s']],
    card:[['Q','◎','Track priority'],['W','↻','Characterize'],['E','▲','Predict branches'],null,
          null,null,null,['X','✕','Drop']]}
};
const ALERTS=[
 {tg:5,state:'lethal',t:'Proximity · 48219 closing',d:'14.2 km · sector 4'},
 {tg:2,state:'watch',t:'GPS degrade armed',d:'T-04:00 · go crosslink'},
 {tg:1,state:'go',t:'Track reacquired',d:'RT-0003 via GEODSS · ±0.09 km'}
];
const ADVISOR=[
 'Picture is amber. Custody 94 percent. GPS degrade armed, T minus 4.',
 'Custody under attack. Sector 4. Warden has standoff shadow armed.',
 'Commit window closing. Relay crosslink recommended before degrade.',
 'Track reacquired. GEODSS optical. Uncertainty 90 meters.'
];

/* ---------------- theater: procedural orthographic globe ---------------- */
const stage=$('#stage'), sx=stage.getContext('2d');
const MU=3.986004418e14, RE=6371;
const cam={lon:150,lat:12,tLon:150,tLat:12,zoom:1,tZoom:1};
let simT=0; // seconds
const ORB={
 s7 :{name:'SENTINEL-7',col:C.cyan,alt:750,inc:86,raan:10,ph:0,   side:'blue'},
 s9 :{name:'SENTINEL-9',col:C.cyan,alt:750,inc:86,raan:10,ph:180, side:'blue'},
 rel:{name:'KESTREL',   col:C.mint,alt:8000,inc:55,raan:300,ph:40,side:'blue'},
 gss:{name:'GSSAP-6',   col:C.cyan,alt:35786,inc:0.4,raan:0,ph:118,side:'blue'},
 obj:{name:'48219 SHADOW',col:C.red,alt:35786,inc:0.9,raan:0,ph:121.5,side:'red'}
};
const GS=[{n:'KWAJALEIN',lon:167.73,lat:8.72},{n:'GUAM',lon:144.8,lat:13.5}];
const d2r=Math.PI/180;
function ecef(o,t){ // circular orbit, ECI approximated as ECEF for the proxy
  const a=RE+o.alt, n=Math.sqrt(MU/Math.pow(a*1000,3)), u=n*t+o.ph*d2r, inc=o.inc*d2r, ra=o.raan*d2r;
  const xo=a*Math.cos(u), yo=a*Math.sin(u);
  return [xo*Math.cos(ra)-yo*Math.cos(inc)*Math.sin(ra), xo*Math.sin(ra)+yo*Math.cos(inc)*Math.cos(ra), yo*Math.sin(inc)];
}
function llToEcef(lon,lat,r){ const L=lon*d2r,B=lat*d2r; return [r*Math.cos(B)*Math.cos(L), r*Math.cos(B)*Math.sin(L), r*Math.sin(B)]; }
// project: rotate world so camera lon/lat faces viewer, orthographic
function proj(p,W,H,R){
  const L=-cam.lon*d2r, B=-cam.lat*d2r;
  let x=p[0]*Math.cos(L)-p[1]*Math.sin(L), y=p[0]*Math.sin(L)+p[1]*Math.cos(L), z=p[2];
  let y2=y, z2=z*Math.cos(B)-x*Math.sin(B), x2=z*Math.sin(B)+x*Math.cos(B);
  const s=R/RE; return {x:W/2+y2*s, y:H/2-z2*s, depth:x2, r:Math.hypot(y2,z2)};
}
function draw(){
  const W=stage.width=stage.clientWidth*devicePixelRatio, H=stage.height=stage.clientHeight*devicePixelRatio;
  const R=Math.min(W,H)*0.30*cam.zoom;
  sx.clearRect(0,0,W,H);
  // stars
  sx.fillStyle='rgba(234,243,251,.35)';
  for(let i=0;i<140;i++){ const x=(i*7919%W), y=(i*104729%H); sx.fillRect(x,y,1,1); }
  // limb: gold rim-light per brand hero direction
  const cx=W/2, cy=H/2;
  const g=sx.createRadialGradient(cx,cy,R*0.82,cx,cy,R*1.06);
  g.addColorStop(0,'rgba(232,163,61,0)'); g.addColorStop(.82,'rgba(232,163,61,.10)'); g.addColorStop(1,'rgba(232,163,61,0)');
  sx.fillStyle=g; sx.beginPath(); sx.arc(cx,cy,R*1.06,0,7); sx.fill();
  // globe body
  const gb=sx.createRadialGradient(cx-R*.35,cy-R*.4,R*.1,cx,cy,R);
  gb.addColorStop(0,'#101A28'); gb.addColorStop(1,'#050810');
  sx.fillStyle=gb; sx.beginPath(); sx.arc(cx,cy,R,0,7); sx.fill();
  sx.strokeStyle='rgba(232,163,61,.55)'; sx.lineWidth=1.2*devicePixelRatio; sx.stroke();
  // graticule
  sx.strokeStyle='rgba(64,180,229,.12)'; sx.lineWidth=1;
  for(let lat=-60;lat<=60;lat+=30){ sx.beginPath(); let first=true;
    for(let lon=-180;lon<=180;lon+=4){ const p=proj(llToEcef(lon,lat,RE),W,H,R); if(p.depth<0){first=true;continue;} first?sx.moveTo(p.x,p.y):sx.lineTo(p.x,p.y); first=false; } sx.stroke(); }
  for(let lon=-180;lon<180;lon+=30){ sx.beginPath(); let first=true;
    for(let lat=-90;lat<=90;lat+=4){ const p=proj(llToEcef(lon,lat,RE),W,H,R); if(p.depth<0){first=true;continue;} first?sx.moveTo(p.x,p.y):sx.lineTo(p.x,p.y); first=false; } sx.stroke(); }
  // ground sites + footprints
  GS.forEach(gs=>{ const p=proj(llToEcef(gs.lon,gs.lat,RE),W,H,R); if(p.depth<0)return;
    sx.fillStyle=C.gold; sx.beginPath(); sx.arc(p.x,p.y,3.5*devicePixelRatio,0,7); sx.fill();
    sx.strokeStyle='rgba(232,163,61,.35)'; sx.beginPath(); sx.arc(p.x,p.y,R*.19,0,7); sx.stroke();
    label(p.x+8*devicePixelRatio,p.y+12*devicePixelRatio,gs.n,C.gold); });
  // orbits: trail + body
  Object.entries(ORB).forEach(([id,o])=>{
    const a=RE+o.alt, T=2*Math.PI/Math.sqrt(MU/Math.pow(a*1000,3));
    sx.strokeStyle=o.col; sx.globalAlpha=.55; sx.lineWidth=1.5*devicePixelRatio; sx.beginPath();
    let first=true; const span=Math.min(T*0.45, 3600*6), steps=90;
    for(let i=0;i<=steps;i++){ const t=simT-span+span*i/steps; const p=proj(ecef(o,t),W,H,R);
      const behind=p.depth<0&&p.r<RE; if(behind){first=true;continue;} first?sx.moveTo(p.x,p.y):sx.lineTo(p.x,p.y); first=false; }
    sx.stroke(); sx.globalAlpha=1;
    const p=proj(ecef(o,simT),W,H,R); const behind=p.depth<0&&p.r<RE; if(behind)return;
    o._px=p; sx.fillStyle=o.col; sx.beginPath(); sx.arc(p.x,p.y,4.5*devicePixelRatio,0,7); sx.fill();
    sx.strokeStyle=C.bg; sx.lineWidth=2*devicePixelRatio; sx.stroke();
    label(p.x+10*devicePixelRatio,p.y-10*devicePixelRatio,o.name,o.col);
  });
  // FUI brackets on the live selection
  const t=TG[sel]; if(t&&t.ents.length){ t.ents.forEach(id=>{ const p=ORB[id]._px; if(!p)return; bracket(p.x,p.y,22*devicePixelRatio); }); }
  else if(t&&t.ll){ const p=proj(llToEcef(t.ll[0],t.ll[1],RE),W,H,R); if(p.depth>=0)bracket(p.x,p.y,26*devicePixelRatio); }
  // relative-range line for the contact
  if(ORB.gss._px&&ORB.obj._px){ sx.strokeStyle='rgba(255,90,74,.5)'; sx.setLineDash([4,5]); sx.lineWidth=1; sx.beginPath(); sx.moveTo(ORB.gss._px.x,ORB.gss._px.y); sx.lineTo(ORB.obj._px.x,ORB.obj._px.y); sx.stroke(); sx.setLineDash([]); }
}
function label(x,y,txt,col){ sx.font=`700 ${10*devicePixelRatio}px "IBM Plex Mono",monospace`; sx.fillStyle='rgba(6,9,15,.75)'; const w=sx.measureText(txt).width; sx.fillRect(x-3,y-10*devicePixelRatio,w+6,13*devicePixelRatio); sx.fillStyle=col; sx.fillText(txt,x,y); }
function bracket(x,y,s){ const k=s*.38; sx.strokeStyle=C.cyan; sx.lineWidth=2*devicePixelRatio;
  [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([dx,dy])=>{ sx.beginPath(); sx.moveTo(x+dx*s, y+dy*(s-k)); sx.lineTo(x+dx*s,y+dy*s); sx.lineTo(x+dx*(s-k),y+dy*s); sx.stroke(); }); }

/* ---------------- minimap ---------------- */
const mini=$('#mini'), mx=mini.getContext('2d');
function drawMini(){
  const W=mini.width=mini.clientWidth*2, H=mini.height=mini.clientHeight*2;
  mx.fillStyle=C.bg; mx.fillRect(0,0,W,H);
  mx.strokeStyle='rgba(64,180,229,.12)'; mx.lineWidth=1;
  for(let i=1;i<6;i++){ mx.beginPath(); mx.moveTo(W*i/6,0); mx.lineTo(W*i/6,H); mx.stroke(); }
  for(let i=1;i<3;i++){ mx.beginPath(); mx.moveTo(0,H*i/3); mx.lineTo(W,H*i/3); mx.stroke(); }
  const dot=(lon,lat,col,r)=>{ mx.fillStyle=col; mx.beginPath(); mx.arc((lon+180)/360*W,(90-lat)/180*H,r,0,7); mx.fill(); };
  GS.forEach(g=>dot(g.lon,g.lat,C.gold,3));
  Object.values(ORB).forEach(o=>{ const p=ecef(o,simT); const lon=Math.atan2(p[1],p[0])/d2r, lat=Math.atan2(p[2],Math.hypot(p[0],p[1]))/d2r; dot(lon,lat,o.col,4); });
  // camera reticle follows cam lon/lat
  const camEl=$('#mmCam'), w=mini.clientWidth, h=mini.clientHeight;
  camEl.style.left=((cam.lon+180)/360*w-30)+'px'; camEl.style.top=((90-cam.lat)/180*h-18)+'px'; camEl.style.width='60px'; camEl.style.height='36px';
}
$('#minimap').addEventListener('click',e=>{ const r=mini.getBoundingClientRect(); cam.tLon=(e.clientX-r.left)/r.width*360-180; cam.tLat=90-(e.clientY-r.top)/r.height*180; });

/* ---------------- selection ---------------- */
let sel=1;
function renderGroups(){
  $('#groups').innerHTML=Object.entries(TG).map(([n,t])=>`
    <button class="sc-group" data-tg="${n}" aria-pressed="${+n===sel}" data-side="${t.red?'red':'blue'}" data-idle="false">
      <span class="sc-group__n">${n}</span>
      <span><span class="sc-group__name">${t.name.replace(/^TG\d\s/,'')}</span><span class="sc-group__sub" style="display:block">${t.sub}</span></span>
      <span class="sc-group__idle sc-state" data-state="idle" hidden>Idle</span>
    </button>`).join('');
  $$('.sc-group').forEach(b=>b.addEventListener('click',()=>focusTG(+b.dataset.tg,true)));
}
function renderAlerts(){
  ALERTS.forEach(a=>{ const b=document.createElement('button'); b.className='sc-alert'; b.dataset.state=a.state; b.dataset.tg=a.tg; b.setAttribute('role','listitem');
    b.innerHTML=`<span class="sc-alert__t"><span class="sc-state" data-state="${a.state}"><span class="sc-sr">${a.state}</span></span>${a.t}</span><span class="sc-alert__d">${a.d}</span>`;
    b.addEventListener('click',()=>{ focusTG(a.tg,true); ping(a); feed(`<b>Alert</b> routed to ${TG[a.tg].name}`); });
    $('#alerts').appendChild(b); });
}
function renderSel(){
  const t=TG[sel];
  $$('.sc-group').forEach(g=>g.setAttribute('aria-pressed',+g.dataset.tg===sel));
  const pf=$('#portrait'); pf.textContent=t.pf; pf.dataset.side=t.red?'red':'blue';
  $('#selName').textContent=t.name; $('#selSub').textContent=t.sub; $('#cardFor').textContent=t.name.split(' ')[0].toUpperCase();
  $('#selState').dataset.state=t.red?'lethal':'track'; $('#selState').textContent=t.red?'Hostile':'Tracking';
  $('#facts').innerHTML=t.kv.map(k=>`<div><dt>${k[0]}</dt><dd>${k[1]}</dd></div>`).join('');
  // wireframe: three subsystem blocks on a bus line
  const xs=[14,104,194];
  $('#wire').innerHTML=`<line x1="30" y1="16" x2="230" y2="16" data-health="nominal" stroke-width="1.2"/>`+
    t.health.map((h,i)=>`<rect x="${xs[i]}" y="6" width="36" height="20" rx="3" fill="none" stroke-width="1.5" data-health="${h[1]}"/><text x="${xs[i]}" y="40" data-health="${h[1]}">${h[0].toUpperCase()} · ${h[1]==='nominal'?'100':h[1]==='degraded'?'88':'0'}%</text>`).join('');
  // command card 4×3, 12 slots; commit spans 2 in the last row
  const slots=t.card.slice(0,8).concat([null,null]);
  $('#card').innerHTML=slots.map(c=>c?`<button class="sc-order" data-o="${c[2]}" data-cost="${c[3]||'low'}" ${t.red&&c[0]!=='X'?'data-lethal="false"':''} title="${c[2]} · ${c[0]}"><span class="sc-order__t">${c[2]}</span><span class="sc-order__g" aria-hidden="true">${c[1]}</span><kbd class="sc-order__k">${c[0]}</kbd></button>`
                                     :`<button class="sc-order" disabled aria-label="No order in this slot"><span class="sc-order__g" style="color:var(--console-line2)">·</span></button>`).join('')
    +`<button class="sc-order sc-order--commit" data-o="COMMIT" title="Commit ritual · C"><span class="sc-order__g">Commit</span><kbd class="sc-order__k">C</kbd></button>`;
  $$('.sc-order[data-o]').forEach(b=>b.addEventListener('click',()=>stage_(b.dataset.o,b)));
  if(sel===3){ const e=$('.sc-order[data-o="Cross-cue"], .sc-order[data-o="Standoff shadow"]'); if(e){ e.dataset.cooldown='12s'; e.style.setProperty('--cd','62%'); } }
}
function focusTG(n,fly){
  sel=n; renderSel(); const t=TG[n];
  if(!fly)return;
  if(t.ents.length){ const p=ecef(ORB[t.ents[0]],simT); cam.tLon=Math.atan2(p[1],p[0])/d2r; cam.tLat=Math.atan2(p[2],Math.hypot(p[0],p[1]))/d2r*0.6; cam.tZoom=ORB[t.ents[0]].alt>20000?0.72:1.15; }
  else if(t.ll){ cam.tLon=t.ll[0]; cam.tLat=t.ll[1]; cam.tZoom=1.3; }
  $('#mmSector').textContent=(t.red?'Sector 4 · GEO':t.ents.length?'Sector '+n+' · '+(ORB[t.ents[0]].alt>20000?'GEO':ORB[t.ents[0]].alt>2000?'MEO':'LEO'):'Pacific · ground');
}

/* ---------------- orders, resources, queue ---------------- */
const queue=[]; let dv=41.2, cap=27, mopB=0, mopR=0;
const lastOrder={1:Date.now(),2:Date.now(),3:Date.now(),4:Date.now(),5:Date.now()};
function toast(html){ const t=$('#toast'); t.innerHTML=html; t.dataset.on='true'; clearTimeout(t._h); t._h=setTimeout(()=>t.dataset.on='false',2600); }
function feed(html){ const f=$('#feed'); const d=document.createElement('div'); d.innerHTML=html; f.prepend(d); while(f.children.length>5)f.lastChild.remove(); }
function callout(state,title,body){ const c=document.createElement('div'); c.className='sc-callout'; c.dataset.state=state; c.innerHTML=`<b>▸ ${title}</b>${body}`; const host=$('#callouts'); host.prepend(c); while(host.children.length>2)host.lastChild.remove(); setTimeout(()=>c.remove(),9000); }
function ping(a){ const mm=$('#mmPing'), o=TG[a.tg].ents[0]; if(o){ const p=ecef(ORB[o],simT); const lon=Math.atan2(p[1],p[0])/d2r, lat=Math.atan2(p[2],Math.hypot(p[0],p[1]))/d2r; mm.style.left=((lon+180)/360*100)+'%'; mm.style.top=((90-lat)/180*100)+'%'; }
  mm.dataset.fire='false'; void mm.offsetWidth; mm.dataset.fire='true';
  if(a.state==='lethal'){ const e=$('#edge'); e.dataset.fire='false'; void e.offsetWidth; e.dataset.fire='true'; } }
function renderQueue(){
  const q=$('#queue');
  q.innerHTML=queue.length?queue.map((it,i)=>`<div class="sc-qi"><span class="sc-qi__tg">${it.tg}</span><span class="sc-qi__o">${it.o}</span><span class="sc-qi__eta">${it.eta>0?'T-'+String(Math.floor(it.eta/60)).padStart(2,'0')+':'+String(it.eta%60).padStart(2,'0'):'EXEC'}</span><button class="sc-qi__x" data-i="${i}" aria-label="Cancel ${it.o}">✕</button><span class="sc-qi__bar"><i style="width:${Math.max(0,100-it.eta/it.eta0*100)}%"></i></span></div>`).join('')
    :`<div class="sc-qi sc-qi--empty">Queue empty. Stage an order.</div>`;
}
function stage_(o,btn){
  if(o==='Cancel'||o==='Drop'){ queue.length=0; renderQueue(); toast('Queue cleared'); return; }
  if(o==='COMMIT'){ if(!queue.length){ toast('Nothing staged. Commit needs an armed order.'); return; } toast('<span style="color:var(--console-gold)">◆ Commit ritual · CDR signature required · push locked in rehearsal</span>'); feed('<b>CDR</b> commit requested for '+queue.length+' staged'); return; }
  const cost=(btn&&btn.dataset.cost==='high')?6.2:0;
  if(cost&&dv-cost<0){ const r=$('#resDv'); r.dataset.state='refused'; setTimeout(()=>r.dataset.state='',900);
    toast('<span class="sc-state" data-state="refused">Δv budget exceeded · order refused</span>'); return; }
  if(cost){ dv=+(dv-cost).toFixed(1); $('#rDv').textContent=dv; if(dv<12)$('#resDv').dataset.state='watch'; }
  cap=Math.max(0,cap-1); $('#rCap').textContent=cap; $('#resCap').dataset.state=cap<10?'refused':cap<20?'watch':'';
  const eta=90+Math.floor(Math.random()*120); queue.unshift({tg:'TG'+sel,o,eta,eta0:eta}); if(queue.length>5)queue.pop(); renderQueue();
  lastOrder[sel]=Date.now();
  toast('Staged · <span style="color:var(--console-gold)">CDR commit required</span>');
  feed('<b>'+TG[sel].name+'</b> staged '+o.toLowerCase());
}
$('#queue').addEventListener('click',e=>{ const x=e.target.closest('.sc-qi__x'); if(x){ queue.splice(+x.dataset.i,1); renderQueue(); toast('Order cancelled before ignition'); } });

/* ---------------- keyboard: the console is keyboard-first ---------------- */
document.addEventListener('keydown',e=>{
  if(e.metaKey||e.ctrlKey){ if(e.key.toLowerCase()==='k'){ e.preventDefault(); togglePalette(); } return; }
  if($('#palette').dataset.open==='true'){ if(e.key==='Escape')togglePalette(false); return; }
  if(e.key>='1'&&e.key<='5'){ focusTG(+e.key,true); return; }
  const hk={q:0,w:1,e:2,r:3,a:4,s:5,d:6,x:7}[e.key.toLowerCase()];
  if(hk!==undefined){ const c=TG[sel].card[hk]; if(c){ const b=$(`.sc-order[data-o="${c[2]}"]`); stage_(c[2],b); } }
  if(e.key.toLowerCase()==='c')stage_('COMMIT');
});

/* ---------------- ⌘K palette ---------------- */
const SUGG=[
 {c:'task sentinel-7 to shadow object 48219 at 5 km standoff',r:'TASK-117 staged · rehearsal: push disabled, logged to queue'},
 {c:'compare coas',r:'COA-1 vs COA-2: Δv 12.4 / 31.0 · effect 164 s / 420 s · risk low / med'},
 {c:'picture summary',r:'Picture is amber: 48219 closing, custody 94 percent, GPS degrade T-04:00'},
 {c:'inject gps degrade now',r:'White cell authorization required. Request sent.'},
 {c:'show branch futures',r:'3 red COAs projected · decoy screen most probable (0.61)'}
];
function renderPal(f){ $('#palList').innerHTML=SUGG.filter(s=>s.c.includes(f.toLowerCase())).map((s,i)=>`<div class="sc-palette__row" data-i="${SUGG.indexOf(s)}" aria-selected="${i===0}">▸ ${s.c}</div>`).join('')||`<div class="sc-palette__row">No matching tool. Free text routes to the correlator.</div>`; }
function runPal(i){ const s=SUGG[i]||{c:$('#palIn').value,r:'Correlator parsing. Routed to MCP, sub 500 ms.'}; const o=$('#palOut'); o.dataset.on='true'; o.innerHTML=`<b>EXEC</b> ${s.c}<br>${s.r}`; feed('<b>⌘K</b> '+s.c); }
function togglePalette(force){ const p=$('#palette'); const open=force===undefined?p.dataset.open!=='true':force; p.dataset.open=open; if(open){ $('#palIn').value=''; $('#palOut').dataset.on='false'; renderPal(''); $('#palIn').focus(); } }
$('#palIn').addEventListener('input',e=>renderPal(e.target.value));
$('#palIn').addEventListener('keydown',e=>{ if(e.key==='Enter'){ const f=$('.sc-palette__row[aria-selected="true"]'); runPal(f?+f.dataset.i:-1); } });
$('#palList').addEventListener('click',e=>{ const r=e.target.closest('[data-i]'); if(r)runPal(+r.dataset.i); });
$('#palette').addEventListener('click',e=>{ if(e.target.id==='palette')togglePalette(false); });
$('#intentBar').addEventListener('click',()=>togglePalette(true));
$('#intentBar').addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ')togglePalette(true); });
$('#coaBtn').addEventListener('click',e=>{ const on=e.currentTarget.getAttribute('aria-pressed')!=='true'; e.currentTarget.setAttribute('aria-pressed',on); toast(on?'COA compare · 3 options · COA-A min total Δv recommended':'COA compare closed'); });

/* ---------------- ticks ---------------- */
let secs=0;
setInterval(()=>{ secs++; $('#clock').textContent=String(Math.floor(secs/60)).padStart(2,'0')+':'+String(secs%60).padStart(2,'0'); },1000);
setInterval(()=>{ // queue countdown + MOP
  queue.forEach(it=>it.eta-=5);
  for(let i=queue.length-1;i>=0;i--) if(queue[i].eta<=-10){ feed(`<b>${queue[i].tg}</b> ${queue[i].o.toLowerCase()} complete <span class="sc-mop">+15 MOP</span>`); mopB+=15; $('#sB').textContent=Math.floor(mopB/50); queue.splice(i,1); }
  renderQueue();
  // idle indicator: blue groups with nothing staged for 40 s
  $$('.sc-group[data-side="blue"]').forEach(g=>{ const n=+g.dataset.tg; const idle=!queue.some(q=>q.tg==='TG'+n)&&Date.now()-lastOrder[n]>40000; g.dataset.idle=idle; g.querySelector('.sc-group__idle').hidden=!idle; });
},5000);
const PLAYS=['jammer sweep · X-band','decoy release probable','plane change detected 48219','optical dazzle attempt · KWA'];
setInterval(()=>{ feed('<b data-side="red">Red cell</b> '+PLAYS[Math.floor(Math.random()*PLAYS.length)]); mopR+=10; $('#sR').textContent=Math.floor(mopR/50); },17000);
let ai=0; setInterval(()=>{ ai=(ai+1)%ADVISOR.length; const a=$('#advisor'); a.textContent=ADVISOR[ai]; a.style.animation='none'; void a.offsetWidth; a.style.animation=''; },9000);
setTimeout(()=>callout('go','Track reacquired','RT-0003 (JACKAL-3) via GEODSS optical · ±0.09 km'),6000);
setTimeout(()=>{ callout('lethal','Track lost','RT-0002 · custody lost · uncertainty ±1.85 km · sensor gated'); ping(ALERTS[0]); },14000);

/* ---------------- main loop ---------------- */
let last=performance.now();
function loop(now){
  const dt=(now-last)/1000; last=now;
  simT+=dt*60;                             // 60× sim rate
  const k=RM?1:Math.min(1,dt*2.2);
  cam.lon+=(cam.tLon-cam.lon)*k; cam.lat+=(cam.tLat-cam.lat)*k; cam.zoom+=(cam.tZoom-cam.zoom)*k;
  if(Math.abs(cam.tLon-cam.lon)<.01) cam.tLon+=dt*0.6; // slow ambient drift once settled
  draw(); drawMini(); requestAnimationFrame(loop);
}
renderGroups(); renderAlerts(); renderSel(); renderQueue(); requestAnimationFrame(loop);
setTimeout(()=>{ $('#title').dataset.gone='true'; setTimeout(()=>$('#title').remove(),600); }, RM?300:2400);
})();
