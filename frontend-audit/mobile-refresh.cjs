/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
 const context = await browser.newContext({serviceWorkers:'block'});
 await context.route('**/api/properties?**', r=>r.fulfill({json:{properties:[],count:0,success:true}}));
 await context.addInitScript(() => localStorage.setItem('cookie-consent', 'declined'));
 const page = await context.newPage();
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 for(const width of [320,390,768,1024,1440]) {
  await page.setViewportSize({width,height:900});
  await page.goto('http://localhost:3000');
  await page.getByRole('button',{name:'Open navigation menu'}).waitFor({state:width<1024?'visible':'hidden'});
  await page.waitForTimeout(800);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);
  if(width<1024) {
   await page.getByRole('button',{name:'Open navigation menu'}).click();
   await page.locator('#mobile-property-search').fill('Lekki');
   assert.equal(await page.locator('#mobile-property-search').evaluate(e=>getComputedStyle(e).fontSize),'16px');
   await page.locator('#mobile-navigation button[aria-label="Search properties"]').click();
   await page.waitForURL('**/properties?area=Lekki');
   await page.getByRole('button',{name:'Open navigation menu'}).waitFor();
   assert.equal(await page.locator('#mobile-navigation').count(),0);
   console.log('MOBILE_SEARCH_PASS',width);
  }
 }
 await page.goto('http://localhost:3000/properties');
 await page.waitForTimeout(800);
 await page.getByRole('button',{name:'Map',exact:true}).click();
 await page.route('**/api/geocode?**', r=>r.fulfill({json:{results:[],success:true}}));
 await page.locator('#property-address-search').fill('Unknown address Lagos');
 await page.locator('form').filter({has:page.locator('#property-address-search')}).getByRole('button',{name:'Search',exact:true}).click();
 await page.getByRole('link',{name:'Search this address on Google Maps'}).waitFor();
 assert((await page.getByRole('link',{name:'Search this address on Google Maps'}).getAttribute('href')).includes('Unknown%20address%20Lagos'));
 console.log('MAP_NO_MATCH_FALLBACK_PASS');
 await page.goto('http://localhost:3000');
 await page.waitForTimeout(800);
 await page.clock.install();
 await page.evaluate(()=>window.dispatchEvent(new Event('beforeinstallprompt',{cancelable:true})));
 await page.evaluate(()=>window.dispatchEvent(new Event('pointerdown')));
 await page.clock.runFor(13000);
 await page.getByRole('heading',{name:'Install De-Greenacres App'}).waitFor();
 await page.getByRole('button',{name:'Later',exact:true}).click();
 assert(await page.evaluate(()=>Number(localStorage.getItem('degreenacres-install-snoozed-until'))>Date.now()+29*86400000));
 await page.reload(); await page.waitForTimeout(800);
 await page.evaluate(()=>{window.dispatchEvent(new Event('beforeinstallprompt',{cancelable:true}));window.dispatchEvent(new Event('pointerdown'));});
 await page.clock.runFor(14000);
 assert.equal(await page.getByRole('heading',{name:'Install De-Greenacres App'}).count(),0);
 console.log('INSTALL_LATER_PERSISTS_PASS');
 assert.deepEqual(errors,[]); console.log('PAGE_ERRORS',errors);
 await page.screenshot({path:'frontend-audit/mobile-refresh-desktop.png',fullPage:false});
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
