// node cap.js <site> <still|video> [seconds] [fps]
const {chromium}=require('/home/claude/.npm-global/lib/node_modules/@playwright/mcp/node_modules/playwright');
const [,,site,mode='still',secs='8',fps='24']=process.argv;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1440,height:900}});
 p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text())});
 await p.goto(`http://localhost:9200/${site}/?cap=1`);
 await p.waitForFunction('window.READY===true',null,{timeout:60000});
 await p.evaluate(()=>document.fonts.ready);
 const out=`/home/claude/herolab/out/${site}`;require('fs').mkdirSync(out+'/f',{recursive:true});
 if(mode==='still'){for(const t of [0.5,2,6]){await p.evaluate(t=>window.renderAt(t),t);await p.screenshot({path:`${out}/still_${t}.png`})}}
 else{const n=Math.round(+secs*+fps);for(let i=0;i<n;i++){await p.evaluate(t=>window.renderAt(t),i/+fps);await p.screenshot({path:`${out}/f/${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:90})}}
 await b.close();
})();
