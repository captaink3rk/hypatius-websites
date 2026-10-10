// Brand easing curves as functions of t in [0,1], plus ramp helpers. Shared by the scene modules.
const bz=(a,b,u)=>3*a*u*(1-u)**2+3*b*u*u*(1-u)+u**3;
export const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
function cb(x1,y1,x2,y2){return t=>{let u=t;for(let i=0;i<8;i++){const x=bz(x1,x2,u)-t,d=(bz(x1,x2,u+1e-4)-bz(x1,x2,u))/1e-4;if(Math.abs(d)<1e-6)break;u=clamp(u-x/d)}return bz(y1,y2,u)}}
export const ease={corporate:cb(.2,.8,.2,1),starchitect:cb(.16,1,.3,1),alidade:cb(.22,.61,.36,1)};
export const ramp=(t,a,b,e=x=>x)=>e(clamp((t-a)/(b-a)));
