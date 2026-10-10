// Shared clock: real time in the browser, frame-stepped when captured (?cap=1), one still frame under reduced motion.
export function run(renderAt, {still=6}={}){
  const P=new URLSearchParams(location.search);
  window.renderAt=renderAt;
  if(P.get('cap')==='1'){window.READY=true;return}
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){renderAt(still);return}
  const t0=performance.now();const loop=()=>{renderAt((performance.now()-t0)/1000);requestAnimationFrame(loop)};loop();
}
export const ease={
  corporate:t=>cb(.2,.8,.2,1,t), starchitect:t=>cb(.16,1,.3,1,t), alidade:t=>cb(.22,.61,.36,1,t)};
export const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
export const ramp=(t,a,b,e=x=>x)=>e(clamp((t-a)/(b-a)));
function cb(x1,y1,x2,y2,t){ // cubic-bezier solve
  let u=t;for(let i=0;i<8;i++){const x=bz(x1,x2,u)-t;const d=(bz(x1,x2,u+1e-4)-bz(x1,x2,u))/1e-4;if(Math.abs(d)<1e-6)break;u-=x/d;u=clamp(u)}
  return bz(y1,y2,u)}
function bz(a,b,u){return 3*a*u*(1-u)**2+3*b*u*u*(1-u)+u**3}
