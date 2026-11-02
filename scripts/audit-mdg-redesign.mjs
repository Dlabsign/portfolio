import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000/project/MDG';

const routes = [
  'landing_page.html',
  'login.html',
  'mm_request_material.html',
  'mm_datasteward.html',
  'mm_approval.html',
  'bp_create_vendor.html',
  'bp_create_customer.html',
  'bp_banksteward.html',
  'bp_approval.html',
  'part_request.html',
  'part_approval.html',
  'ir_create_request.html',
  'ir_approval.html',
  'history_approved.html',
  'history_rejected.html'
];

const screenshotsDir = path.join(__dirname, '../public/project/MDG/screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function runAudit() {
  console.log('=== STARTING MDG REDESIGN AUDIT (15 ROUTES) ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];
  const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

  for (const route of routes) {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore minor favicon or sheetjs warnings if any
        if (!text.includes('favicon.ico')) {
          consoleErrors.push(text);
        }
      }
    });

    try {
      // 1. Desktop Check (1280x800)
      await page.setViewport({ width: 1280, height: 800 });
      const url = `${BASE_URL}/${route}`;
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const status = response ? response.status() : 0;

      // Small wait for JS runtime initialization
      await new Promise(r => setTimeout(r, 600));

      // Check font family & text content for emojis
      const pageData = await page.evaluate(() => {
        const bodyFont = window.getComputedStyle(document.body).fontFamily;
        const pageText = document.body.innerText || '';
        const hasTheme = !!document.querySelector('link[href*="mdg-theme.css"]');
        return { bodyFont, pageText, hasTheme };
      });

      const hasInter = pageData.bodyFont.toLowerCase().includes('inter');
      const hasEmojis = emojiRegex.test(pageData.pageText);

      // Screenshot key landmark pages
      if (['landing_page.html', 'mm_approval.html', 'bp_create_vendor.html', 'part_request.html', 'login.html'].includes(route)) {
        const ssName = route.replace('.html', '-desktop.png');
        await page.screenshot({ path: path.join(screenshotsDir, ssName), fullPage: false });
      }

      // 2. Mobile Responsive Check (390x844 iPhone 14 standard)
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
      await new Promise(r => setTimeout(r, 300));
      if (['landing_page.html', 'mm_approval.html'].includes(route)) {
        const ssNameMobile = route.replace('.html', '-mobile.png');
        await page.screenshot({ path: path.join(screenshotsDir, ssNameMobile), fullPage: false });
      }

      results.push({
        route,
        status,
        hasTheme: pageData.hasTheme,
        hasInter,
        emojisFound: hasEmojis,
        consoleErrorsCount: consoleErrors.length,
        errors: consoleErrors.slice(0, 2)
      });
    } catch (err) {
      results.push({
        route,
        status: 'ERROR',
        error: err.message
      });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log('\n=== AUDIT RESULTS TABLE ===');
  console.table(results.map(r => ({
    Route: r.route,
    Status: r.status,
    ThemeCSS: r.hasTheme ? 'YES' : 'NO',
    FontInter: r.hasInter ? 'YES' : 'NO',
    Emojis: r.emojisFound ? 'FAIL (Found)' : 'PASS (0)',
    Errors: r.consoleErrorsCount
  })));

  const allPassed = results.every(r => r.status === 200 && r.hasTheme && r.hasInter && !r.emojisFound && r.consoleErrorsCount === 0);
  console.log('\nOVERALL AUDIT PASSED:', allPassed);

  fs.writeFileSync(
    path.join(__dirname, '../public/project/MDG/screenshots/audit_report.json'),
    JSON.stringify(results, null, 2)
  );
}

runAudit().catch(err => {
  console.error('Audit script failed:', err);
  process.exit(1);
});
