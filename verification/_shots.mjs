// screenshot helper: node verification/_shots.mjs out_dir  (writes contact shots for review)
import { chromium } from 'playwright';
import { resolve, dirname } from 'node:path'; import { fileURLToPath } from 'node:url'; import { mkdirSync } from 'node:fs';
const here=dirname(fileURLToPath(import.meta.url)); const out=process.argv[2]||resolve(here,'shots'); mkdirSync(out,{recursive:true});
const b=await chromium.launch({executablePath:process.env.PW_CHROME});
const S=[['website','../templates/website-v2/index.html',1440,true],['mobile','../concepts/mobile-v2/index.html',1440,true],
 ...['command','matches','intel','pipeline','proposals','govfeed','partners','control'].map(h=>['platform-'+h,'../ui_kits/platform-v2/index.html#'+h,1440,false]),
 ['platform-command-390','../ui_kits/platform-v2/index.html#command',390,false],['platform-partners-390','../ui_kits/platform-v2/index.html#partners',390,false],['website-390','../templates/website-v2/index.html',390,true]];
for(const [n,p,w,full] of S){ const ctx=await b.newContext({viewport:{width:w,height:w===390?844:900}}); const pg=await ctx.newPage(); const [f,h]=p.split('#'); await pg.goto('file://'+resolve(here,f)+(h?'#'+h:'')); await pg.waitForTimeout(500); await pg.screenshot({path:`${out}/${n}.png`,fullPage:full}); await ctx.close(); console.log(n); }
await b.close();
