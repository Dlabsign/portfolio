import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

async function verify() {
  console.log('--- STARTING VERIFICATION OF TYPE RACING PROJECT ---');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Verify Homepage
  console.log('1. Checking Homepage (#works)...');
  await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle0', timeout: 30000 });
  
  const worksContent = await page.content();
  const hasTypeRacingHome = worksContent.includes('Type Racing Stadium Edition');
  console.log('   Homepage has "Type Racing Stadium Edition":', hasTypeRacingHome);
  if (!hasTypeRacingHome) {
    throw new Error('Type Racing Stadium Edition not found on homepage!');
  }

  // 2. Verify Projects Archive Page
  console.log('2. Checking /projects archive...');
  await page.goto(`${BASE_URL}/projects`, { waitUntil: 'networkidle0', timeout: 30000 });
  const archiveContent = await page.content();
  const hasTypeRacingArchive = archiveContent.includes('Type Racing Stadium Edition');
  console.log('   /projects has "Type Racing Stadium Edition":', hasTypeRacingArchive);
  if (!hasTypeRacingArchive) {
    throw new Error('Type Racing Stadium Edition not found in /projects archive!');
  }

  // 3. Verify Project Detail Page
  console.log('3. Checking /projects/type-racing-stadium detail page...');
  await page.goto(`${BASE_URL}/projects/type-racing-stadium`, { waitUntil: 'networkidle0', timeout: 30000 });
  const detailContent = await page.content();
  const hasGameIframe = detailContent.includes('type_racing_stadium_edition.html');
  console.log('   Detail page has game iframe:', hasGameIframe);
  if (!hasGameIframe) {
    throw new Error('Game iframe not found on /projects/type-racing-stadium!');
  }

  // Check controls hint
  const hasControlsHint = detailContent.includes('Ketik huruf/kata') || detailContent.includes('Type the highlighted');
  console.log('   Detail page has custom controls hint:', hasControlsHint);

  // Take screenshot of the detail page
  await page.screenshot({ path: '.context/test-results/type-racing-detail.png', fullPage: false });
  console.log('   Screenshot of detail page captured!');

  await browser.close();
  console.log('--- ALL VERIFICATIONS PASSED SUCCESSFULLY! ---');
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
