import { chromium } from 'playwright'; import { resolve, dirname } from 'node:path'; import { fileURLToPath } from 'node:url'; import { mkdirSync } from 'node:fs';
const here=dirname(fileURLToPath(import.meta.url)); const out=process.argv[2]; mkdirSync(out,{recursive:true});
const b=await chromium.launch({executablePath:process.env.PW_CHROME});
for(const [n,f,w] of [['home','../hypatius-website/home.html',1440],['platforms','../hypatius-website/platforms.html',1440],['home-390','../hypatius-website/home.html',390]]){
  const ctx=await b.newContext({viewport:{width:w,height:900}}); const p=await ctx.newPage(); await p.goto('file://'+resolve(here,f)); await p.waitForTimeout(700);
  await p.addStyleTag({content:'.reveal{opacity:1!important;transform:none!important} .hero canvas{display:none}'});
  await p.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=700){ window.scrollTo(0,y); await new Promise(r=>setTimeout(r,50)); } window.scrollTo(0,0); });
  await p.waitForTimeout(400); await p.screenshot({path:`${out}/${n}.png`,fullPage:true}); await ctx.close(); console.log(n);
}
await b.close();
