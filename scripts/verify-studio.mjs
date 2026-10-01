// Browser verification; uses an existing Playwright installation, no production dependency.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
// Run with PLAYWRIGHT_MODULE pointing to an existing Playwright installation.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');


const url = process.env.STUDIO_URL || 'http://localhost:3000';
const out = '.artifacts';
fs.mkdirSync(out, {recursive:true});
(async () => {
  const browser = await chromium.launch({headless:true,channel:'chrome',args:['--enable-unsafe-swiftshader']});
  const context = await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  const page = await context.newPage();
  const errors=[];
  page.on('pageerror', error => errors.push(error.message));
  const report={widths:[],states:[],routes:[],errors};
  await page.goto(url); await page.waitForSelector('canvas'); await page.waitForTimeout(1200);
  for (const width of [320,360,390,430,768,1024,1440]) {
    await page.setViewportSize({width,height:width<700?844:1000}); await page.evaluate(()=>scrollTo(0,0)); await page.waitForTimeout(300);
    const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,canvas:document.querySelectorAll('canvas').length,heading:document.querySelector('h1').innerText}));
    assert.ok(layout.scrollWidth<=width, `Overflow at ${width}: ${layout.scrollWidth}`);
    assert.equal(layout.canvas,1); assert.match(layout.heading,/Keith/);
    report.widths.push(layout);
    await page.screenshot({path:`${out}/width-${width}.png`});
  }
  for(const id of ['work-tracky','work-coop-tracker','work-371admin','how-i-build','experience','contact','work-tracky','identity']){
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.evaluate(id=>{const el=document.getElementById(id);scrollTo(0,el.getBoundingClientRect().top+scrollY-innerHeight*.24)},id);
    await page.waitForTimeout(1000);
    report.states.push({id, ...(await page.locator('canvas').evaluate(c=>({...c.dataset})))});
    await page.screenshot({path:`${out}/state-${id}.png`});
  }
  const before=await page.locator('canvas').getAttribute('data-frames'); await page.waitForTimeout(800); const after=await page.locator('canvas').getAttribute('data-frames');
  assert.equal(after,before,'Demand rendering must stop at rest'); report.idleFrames={before,after};
  await page.goto(`${url}/#how-i-build`);await page.waitForTimeout(1200);
  report.directAnchor=await page.locator('canvas').getAttribute('data-progress');
  await page.reload();await page.waitForTimeout(1200);report.reloadProgress=await page.locator('canvas').getAttribute('data-progress');
  await page.getByRole('button',{name:'Switch to dark theme'}).click();await page.waitForTimeout(200);await page.screenshot({path:`out-placeholder` .replace('out-placeholder',`${out}/dark-layers.png`)});
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  await page.getByRole('button',{name:'Reduced effects',exact:true}).click();assert.equal(await page.locator('canvas').count(),0);
  await page.screenshot({path:`${out}/reduced-effects.png`});
  for(const route of ['/resume','/projects/tracky','/projects/coop-tracker','/projects/371admin','/about','/experience','/creative']){
    const response=await page.goto(url+route);await page.waitForTimeout(route==='/creative'?1500:200);assert.equal(response.status(),200);report.routes.push({route,status:response.status()});
  }
  await page.goto(url+'/resume'); await page.emulateMedia({media:'print'});await page.pdf({path:`${out}/resume.pdf`,format:'A4',printBackground:true});await page.screenshot({path:`${out}/resume-print.png`,fullPage:true});await page.emulateMedia({media:'screen'});
  for(const preference of ['motion','saveData','stored']){
    const c=await browser.newContext({viewport:{width:390,height:844},reducedMotion:preference==='motion'?'reduce':'no-preference'});
    if(preference==='saveData')await c.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true,addEventListener(){},removeEventListener(){}}}));
    if(preference==='stored')await c.addInitScript(()=>localStorage.setItem('reduced-effects','true'));
    const p=await c.newPage();const requests=[];p.on('request',r=>requests.push(r.url()));await p.goto(url);await p.waitForTimeout(1200);
    assert.equal(await p.locator('canvas').count(),0,preference);assert.equal(requests.filter(r=>/\/studio\/.*maindashboard|\.mp4/.test(r)).length,0,`Heavy media requested: ${preference}`);
    report[preference]={canvas:0,heavyMedia:0,resources:requests.length};await c.close();
  }
  const f=await browser.newContext({viewport:{width:390,height:844}});const failure=await f.newPage();
  await failure.route('**/*.{webp,png,mp4}',r=>r.abort());await failure.goto(url);await failure.waitForTimeout(1500);assert.ok(await failure.getByRole('link',{name:'Contact me',exact:false}).isVisible());await failure.screenshot({path:`${out}/failed-images.png`});
  await failure.evaluate(()=>document.querySelector('canvas').dispatchEvent(new Event('webglcontextlost',{cancelable:true})));await failure.waitForTimeout(200);assert.equal(await failure.locator('canvas').count(),0);report.contextLoss='static fallback';
  await f.close();
  fs.writeFileSync(`${out}/verification.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});

