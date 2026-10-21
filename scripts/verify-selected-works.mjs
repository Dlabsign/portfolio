import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const OUT_DIR = path.resolve('.context/test-results');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function runTests() {
  console.log('=== RUNNING VERIFICATION TEST ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push({ url: page.url(), text: msg.text() });
    }
  });

  page.on('pageerror', (err) => {
    console.error('Captured pageerror:', err);
    pageErrors.push({ url: page.url(), text: err.toString(), stack: err.stack });
  });

  // Step 1: Test Home Page
  console.log('1. Loading portfolio homepage...');
  const res = await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log(`   Homepage HTTP status: ${res.status()}`);
  await new Promise(r => setTimeout(r, 2000));

  // Check Selected Works Section
  console.log('2. Inspecting Selected Works section...');
  const worksSection = await page.$('#works');
  if (!worksSection) {
    throw new Error('Section #works not found!');
  }

  // Check Project Links in Selected Works
  const projectLinks = await page.$$eval('#works a[href]', (links) => {
    return links.map(a => ({
      href: a.getAttribute('href'),
      title: a.querySelector('h3')?.innerText?.trim(),
      hasImage: !!a.querySelector('img'),
      imageSrc: a.querySelector('img')?.getAttribute('src'),
      ariaLabel: a.getAttribute('aria-label')
    }));
  });

  console.log(`   Found ${projectLinks.length} projects in Selected Works:`);
  projectLinks.forEach((p, idx) => {
    console.log(`   [${idx + 1}] "${p.title}" -> ${p.href} (Image: ${p.hasImage ? 'Yes' : 'No'})`);
  });

  // Verify Super Smash Badminton Arcade is included
  const badminton = projectLinks.find(p => p.title?.toLowerCase().includes('badminton'));
  if (!badminton) {
    throw new Error('Super Smash Badminton Arcade project NOT found in Selected Works!');
  }
  console.log('   ✓ Super Smash Badminton Arcade found!');
  console.log(`     Link: ${badminton.href}`);

  // Check computed font-family
  const fontFamilies = await page.evaluate(() => {
    const worksTitle = document.querySelector('#works h2');
    const firstProjectTitle = document.querySelector('#works h3');
    const body = document.body;
    return {
      bodyFont: window.getComputedStyle(body).fontFamily,
      worksTitleFont: worksTitle ? window.getComputedStyle(worksTitle).fontFamily : null,
      projectTitleFont: firstProjectTitle ? window.getComputedStyle(firstProjectTitle).fontFamily : null,
    };
  });
  console.log('3. Checking Typography & PP Neue integration:');
  console.log('   Body font:', fontFamilies.bodyFont);
  console.log('   Section Title font:', fontFamilies.worksTitleFont);
  console.log('   Project Title font:', fontFamilies.projectTitleFont);

  // Check that NO., Title, Category table headers were removed
  const legacyLabels = await page.evaluate(() => {
    const text = document.getElementById('works')?.innerText || '';
    const hasCategoryHeader = text.includes('Category & Scope') || text.includes('Kategori & Ruang Lingkup');
    const hasTableNoHeader = text.includes('No.') && text.includes('Judul');
    return { hasCategoryHeader, hasTableNoHeader };
  });
  console.log('4. Verifying removal of metadata/decoration table headers:');
  console.log('   Table headers removed:', !legacyLabels.hasTableNoHeader && !legacyLabels.hasCategoryHeader);

  // Take screenshot of Selected Works
  const worksEl = await page.$('#works');
  if (worksEl) {
    await worksEl.screenshot({ path: path.join(OUT_DIR, 'selected-works-preview.png') });
    console.log('   Screenshot saved: .context/test-results/selected-works-preview.png');
  }

  // Step 2: Test Navigation to Game
  console.log('5. Navigating to Super Smash Badminton Arcade game page...');
  const gameUrl = `${BASE_URL}/project/super_smash_badminton_arcade.html`;
  const gameRes = await page.goto(gameUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log(`   Game Page HTTP status: ${gameRes.status()}`);
  await new Promise(r => setTimeout(r, 1000));

  // Check game DOM elements
  const gameDetails = await page.evaluate(() => {
    const canvas = document.getElementById('gameCanvas');
    const menuOverlay = document.getElementById('menuOverlay');
    const portfolioBack = document.querySelector('header a[href="/"]');
    return {
      canvasExists: !!canvas,
      canvasWidth: canvas?.width,
      canvasHeight: canvas?.height,
      menuOverlayExists: !!menuOverlay,
      portfolioBackExists: !!portfolioBack,
      portfolioBackText: portfolioBack?.innerText?.trim(),
      pageTitle: document.title
    };
  });

  console.log('   Game Verification details:');
  console.log(`     Canvas: ${gameDetails.canvasExists} (${gameDetails.canvasWidth}x${gameDetails.canvasHeight})`);
  console.log(`     Menu Overlay: ${gameDetails.menuOverlayExists}`);
  console.log(`     Back to Portfolio Link: ${gameDetails.portfolioBackExists} ("${gameDetails.portfolioBackText}")`);
  console.log(`     Page Title: "${gameDetails.pageTitle}"`);

  // Take screenshot of game
  await page.screenshot({ path: path.join(OUT_DIR, 'game-screen.png') });
  console.log('   Screenshot saved: .context/test-results/game-screen.png');

  // Step 3: Test Round-trip navigation back to portfolio
  console.log('6. Testing navigation back to Portfolio...');
  if (gameDetails.portfolioBackExists) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.click('header a[href="/"]')
    ]);
    console.log(`   Successfully navigated back to: ${page.url()}`);
  }

  // Summary of errors
  console.log('\n=== TEST RESULTS SUMMARY ===');
  console.log(`Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Console errors detected:', consoleErrors);
  }
  console.log(`Page Errors: ${pageErrors.length}`);
  if (pageErrors.length > 0) {
    console.error('Page errors detected:', pageErrors);
  }

  await browser.close();

  if (consoleErrors.length === 0 && pageErrors.length === 0) {
    console.log('\n✓ ALL TESTS PASSED WITH 0 ERRORS!');
  } else {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test script failed:', err);
  process.exit(1);
});
