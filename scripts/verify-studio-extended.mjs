import {createRequire} from 'node:module';import fs from 'node:fs';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.STUDIO_URL||'http://localhost:3000';
(async()=>{
const browser=await chromium.launch({headless:true,channel:'chrome',args:['--enable-unsafe-swiftshader']});
const c=await browser.newContext({viewport:{width:1440,height:1000},recordVideo:{dir:'.artifacts/recordings',size:{width:1440,height:1000}}});
const page=await c.newPage();const report={};const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('PAGEERROR',e.message)});page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text().slice(0,1800))});
await page.goto(base);await page.waitForSelector('canvas');await page.waitForTimeout(900);
await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').innerText(),'Skip to main content');await page.keyboard.press('Enter');await page.waitForFunction(()=>document.activeElement.id==='main-content');report.skipLink=await page.evaluate(()=>document.activeElement.id);
await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(400);
const geometry=await page.evaluate(()=>{const y=id=>document.getElementById(id).getBoundingClientRect().top+scrollY-innerHeight*.24;return {from:y('work-371admin'),to:y('how-i-build')};});
const transitionResults=[];
for(const progress of [3.2,3.46,3.6,3.8,3.94,3.7,3.46,4]){
await page.evaluate(y=>scrollTo(0,y),geometry.from+(progress-3)*(geometry.to-geometry.from));await page.waitForTimeout(650);
transitionResults.push(await page.evaluate(()=>({videos:document.querySelectorAll('video').length,opacity:getComputedStyle(document.querySelector('.studio-canvas')).opacity,progress:Number(document.querySelector('canvas')?.dataset.progress),frame:document.querySelector('canvas')?.dataset.frames})));
if(progress===3.8)await page.screenshot({path:'.artifacts/continuous-transition.png'});
}
report.continuousTransition=transitionResults;
assert.ok(transitionResults.every(r=>r.videos===0 && r.opacity==='1'),'The 3D scene must remain visible throughout the transition');
assert.ok(transitionResults[5].progress<transitionResults[4].progress,'3D must reverse without a cut');
assert.notEqual(transitionResults[3].frame,transitionResults[4].frame,'Rendering must continue across the old video boundary');
assert.equal(await page.locator('video, .motion-study-link').count(),0);
await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(500);await page.locator('a[href="/projects/tracky"]').first().click();await page.waitForURL('**/projects/tracky');await page.getByRole('heading',{name:'TRACKY',exact:true,level:1}).waitFor();await page.goBack();await page.waitForTimeout(1500);console.log('BACK',await page.evaluate(()=>({url:location.href,canvases:document.querySelectorAll('canvas').length,scene:document.querySelector('.studio-canvas')?.className,video:document.querySelector('video')?.currentTime})));await page.screenshot({path:'.artifacts/back-extended.png'});await page.waitForSelector('canvas',{state:'attached'});report.backNavigation=page.url();
await page.setViewportSize({width:844,height:390});await page.evaluate(()=>scrollTo(0,1500));await page.waitForTimeout(800);const offBefore=await page.locator('canvas').getAttribute('data-frames');const second=await c.newPage();await second.goto('about:blank');await page.bringToFront();await page.evaluate(()=>scrollBy(0,100));await page.waitForTimeout(700);const offAfter=await page.locator('canvas').getAttribute('data-frames');assert.equal(offBefore,offAfter);report.offscreenFrames={offBefore,offAfter};await second.close();
await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(500);await page.setViewportSize({width:390,height:700});await page.waitForTimeout(300);report.viewportChange=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));await page.screenshot({path:'.artifacts/mobile-viewport-change.png'});
await c.close();
const f=await browser.newContext({viewport:{width:390,height:844}});await f.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type==='webgl'||type==='webgl2'||type==='experimental-webgl')return null;return original.call(this,type,...args)}});const failure=await f.newPage();await failure.goto(base);await failure.waitForTimeout(1000);assert.ok(await failure.locator('.studio-poster').isVisible());report.unsupportedWebGL='poster and HTML visible';await failure.screenshot({path:'.artifacts/no-webgl.png'});await f.close();
const s=await browser.newContext();await s.addInitScript(()=>Storage.prototype.setItem=function(){throw new DOMException('Blocked','SecurityError')});const storage=await s.newPage();await storage.goto(base);await storage.waitForSelector('canvas');await storage.getByRole('button',{name:'Reduced effects',exact:true}).click();assert.equal(await storage.locator('canvas').count(),0);report.blockedStorage='Reduced effects still works';await s.close();
const v=await browser.newContext();const vp=await v.newPage();await vp.route('**/*.mp4',r=>r.abort());await vp.goto(base);await vp.waitForSelector('canvas');await vp.evaluate(({from,to})=>scrollTo(0,from+.7*(to-from)),geometry);await vp.waitForTimeout(1000);assert.equal(await vp.locator('.is-video').count(),0);report.failedVideo='3D retained';await v.close();
report.errors=errors;fs.writeFileSync('.artifacts/extended-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});




