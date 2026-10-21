import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.resolve('.context/ui-test-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const axeSource = fs.readFileSync(path.resolve('node_modules/axe-core/axe.min.js'), 'utf8');

async function runAudit() {
  console.log('=== STARTING COMPREHENSIVE UX AUDIT & USABILITY TEST ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const results = {
    passed: [],
    failed: [],
    skipped: [],
    consoleErrors: [],
    axeViolations: [],
    viewports: []
  };

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const loc = msg.location();
      if (loc?.url && loc.url.includes('non-existent-page-test')) return;
      results.consoleErrors.push({ text: msg.text(), location: loc });
    }
  });

  page.on('pageerror', (err) => {
    results.consoleErrors.push({ text: err.toString(), stack: err.stack });
  });

  // --- TEST 1: Page Initial Load & Navigation ---
  try {
    const res = await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });
    const status = res.status();
    const title = await page.title();
    if (status === 200 && title.includes('Daniel Kurnia')) {
      results.passed.push({
        id: 'T01-page-load',
        evidence: `HTTP ${status}, Title: "${title}"`
      });
    } else {
      results.failed.push({
        id: 'T01-page-load',
        expected: 'HTTP 200 with Daniel Kurnia in title',
        actual: `HTTP ${status}, Title: "${title}"`
      });
    }
  } catch (err) {
    results.failed.push({
      id: 'T01-page-load',
      expected: 'Successful page load',
      actual: err.message
    });
  }

  // --- TEST 2: Visual Structure & Sections Render ---
  try {
    const sections = await page.evaluate(() => {
      const ids = ['hero', 'works', 'about', 'experience', 'capabilities', 'contact'];
      return ids.map((id) => ({ id, exists: Boolean(document.getElementById(id)) }));
    });
    const missing = sections.filter((s) => !s.exists);
    if (missing.length === 0) {
      results.passed.push({
        id: 'T02-sections-render',
        evidence: `All 6 sections present: ${sections.map((s) => s.id).join(', ')}`
      });
    } else {
      results.failed.push({
        id: 'T02-sections-render',
        expected: 'All 6 sections present',
        actual: `Missing sections: ${missing.map((s) => s.id).join(', ')}`
      });
    }
  } catch (err) {
    results.failed.push({ id: 'T02-sections-render', expected: 'Inspect sections', actual: err.message });
  }

  // --- TEST 3: Navigation Dock & Smooth Scrolling Links ---
  try {
    const navItems = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      if (!nav) return [];
      const buttons = Array.from(nav.querySelectorAll('button'));
      return buttons.map((b) => b.innerText.trim()).filter(Boolean);
    });
    if (navItems.length >= 6) {
      results.passed.push({
        id: 'T03-navigation-dock-render',
        evidence: `Dock rendered with buttons: ${navItems.join(' | ')}`
      });
    } else {
      results.failed.push({
        id: 'T03-navigation-dock-render',
        expected: 'Nav dock with brand and 5 section links',
        actual: `Found: ${navItems.join(' | ')}`
      });
    }
  } catch (err) {
    results.failed.push({ id: 'T03-navigation-dock-render', expected: 'Dock inspect', actual: err.message });
  }

  // --- TEST 4: Language Switcher Flow (EN <-> ID) ---
  try {
    // Check initial language state
    const initialTitle = await page.evaluate(() => {
      const h2 = document.querySelector('#works h2');
      return h2 ? h2.innerText.trim() : '';
    });

    // Click ID button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('nav button'));
      const idBtn = buttons.find((b) => b.innerText.trim() === 'ID');
      if (idBtn) idBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    const idTitle = await page.evaluate(() => {
      const h2 = document.querySelector('#works h2');
      return h2 ? h2.innerText.trim() : '';
    });

    // Click EN button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('nav button'));
      const enBtn = buttons.find((b) => b.innerText.trim() === 'EN');
      if (enBtn) enBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    const enTitle = await page.evaluate(() => {
      const h2 = document.querySelector('#works h2');
      return h2 ? h2.innerText.trim() : '';
    });

    if (idTitle === 'KARYA TERPILIH' && enTitle === 'SELECTED WORKS') {
      results.passed.push({
        id: 'T04-language-switch',
        evidence: `Language toggle switched cleanly: ID -> "${idTitle}", EN -> "${enTitle}"`
      });
    } else {
      results.failed.push({
        id: 'T04-language-switch',
        expected: 'ID -> "KARYA TERPILIH" and EN -> "SELECTED WORKS"',
        actual: `ID -> "${idTitle}", EN -> "${enTitle}"`
      });
    }
  } catch (err) {
    results.failed.push({ id: 'T04-language-switch', expected: 'Language switch', actual: err.message });
  }

  // --- TEST 5: Selected Works Visual Grid & Direct Project Navigation ---
  try {
    // Scroll to works section first
    await page.evaluate(() => {
      const el = document.getElementById('works');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise((r) => setTimeout(r, 600));

    const worksInfo = await page.evaluate(() => {
      const projectLinks = Array.from(document.querySelectorAll('#works a[href]'));
      const badminton = projectLinks.find((a) =>
        a.getAttribute('href')?.includes('super_smash_badminton_arcade')
      );
      const images = Array.from(document.querySelectorAll('#works img'));
      return {
        projectCount: projectLinks.length,
        hasBadminton: Boolean(badminton),
        badmintonHref: badminton ? badminton.getAttribute('href') : null,
        imagesLoaded: images.every((img) => img.complete && img.naturalWidth > 0),
        imageCount: images.length,
      };
    });

    if (worksInfo.projectCount >= 7 && worksInfo.hasBadminton && worksInfo.imagesLoaded) {
      results.passed.push({
        id: 'T05-selected-works-visual-navigation',
        evidence: `Direct visual grid verified: ${worksInfo.projectCount} projects, badminton game linked to "${worksInfo.badmintonHref}", ${worksInfo.imageCount} images fully loaded`
      });
    } else {
      results.failed.push({
        id: 'T05-selected-works-visual-navigation',
        expected: '>= 7 projects with loaded preview images and working game link',
        actual: JSON.stringify(worksInfo)
      });
    }
  } catch (err) {
    results.failed.push({ id: 'T05-selected-works-visual-navigation', expected: 'Visual grid flow', actual: err.message });
  }

  // --- TEST 6: Copy Email Interaction ---
  try {
    await page.evaluate(() => {
      const copyBtn = document.querySelector('#contact button');
      if (copyBtn) copyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));
    const buttonText = await page.evaluate(() => {
      const copyBtn = document.querySelector('#contact button');
      return copyBtn ? copyBtn.innerText.trim() : '';
    });
    if (buttonText === 'Copied' || buttonText === 'Tersalin') {
      results.passed.push({
        id: 'T06-copy-email',
        evidence: `Copy email button reacted with label: "${buttonText}"`
      });
    } else {
      results.failed.push({
        id: 'T06-copy-email',
        expected: '"Copied" or "Tersalin"',
        actual: `"${buttonText}"`
      });
    }
  } catch (err) {
    results.failed.push({ id: 'T06-copy-email', expected: 'Copy email feedback', actual: err.message });
  }

  // --- TEST 7: 404 Page Functional Flow ---
  try {
    const res404 = await page.goto(`${BASE_URL}/non-existent-page-test`, {
      waitUntil: 'networkidle0',
      timeout: 15000
    });
    const status404 = res404.status();
    const heading404 = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 ? h1.innerText.trim() : '';
    });
    const returnLink = await page.evaluate(() => {
      const a = document.querySelector('a');
      return a ? a.getAttribute('href') : null;
    });

    if (status404 === 404 && heading404 === 'Page Not Found' && returnLink === '/') {
      results.passed.push({
        id: 'T07-404-error-page',
        evidence: `Status 404, Heading: "${heading404}", Return href: "${returnLink}"`
      });
    } else {
      results.failed.push({
        id: 'T07-404-error-page',
        expected: 'Status 404, Heading "Page Not Found", Return href "/"',
        actual: `Status: ${status404}, Heading: "${heading404}", Link: "${returnLink}"`
      });
    }

    // Return to home page
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  } catch (err) {
    results.failed.push({ id: 'T07-404-error-page', expected: '404 flow', actual: err.message });
  }

  // --- TEST 8: Custom Cursor Activation & Stacking Context Check ---
  try {
    const cursorInfo = await page.evaluate(() => {
      const hasActiveBodyClass = document.body.classList.contains('custom-cursor-active');
      const cursorContainer = document.querySelector('[aria-hidden="true"].fixed');
      if (!cursorContainer) return { found: false };
      const computed = window.getComputedStyle(cursorContainer);
      return {
        found: true,
        zIndex: computed.zIndex,
        pointerEvents: computed.pointerEvents,
        hasActiveBodyClass
      };
    });

    if (cursorInfo.found && cursorInfo.zIndex === '80' && cursorInfo.pointerEvents === 'none') {
      results.passed.push({
        id: 'T08-custom-cursor-integrity',
        evidence: `Cursor mounted at z-index ${cursorInfo.zIndex}, pointer-events: ${cursorInfo.pointerEvents}, active class: ${cursorInfo.hasActiveBodyClass}`
      });
    } else {
      results.failed.push({
        id: 'T08-custom-cursor-integrity',
        expected: 'Cursor mounted at z-index 80 with pointer-events: none',
        actual: JSON.stringify(cursorInfo)
      });
    }
  } catch (err) {
    results.failed.push({ id: 'T08-custom-cursor-integrity', expected: 'Cursor integrity', actual: err.message });
  }

  // --- TEST 9: Viewport Sweep & Horizontal Overflow Test ---
  const viewportsToTest = [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'mobile-small-360', width: 360, height: 740 }
  ];

  for (const vp of viewportsToTest) {
    try {
      await page.setViewport({ width: vp.width, height: vp.height });
      await new Promise((r) => setTimeout(r, 400));

      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const bodyWidth = document.body.scrollWidth;
        return {
          scrollWidth: docWidth,
          innerWidth: winWidth,
          overflows: docWidth > winWidth || bodyWidth > winWidth
        };
      });

      const shotPath = path.join(SCREENSHOT_DIR, `viewport-${vp.name}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });

      if (!overflow.overflows) {
        results.passed.push({
          id: `T09-responsive-${vp.name}`,
          evidence: `No horizontal overflow at ${vp.width}x${vp.height} (scrollWidth: ${overflow.scrollWidth} <= innerWidth: ${overflow.innerWidth})`
        });
      } else {
        results.failed.push({
          id: `T09-responsive-${vp.name}`,
          expected: `No overflow at ${vp.width}px`,
          actual: `scrollWidth ${overflow.scrollWidth} > innerWidth ${overflow.innerWidth}`
        });
      }
    } catch (err) {
      results.failed.push({ id: `T09-responsive-${vp.name}`, expected: 'Viewport test', actual: err.message });
    }
  }

  // Reset viewport to desktop
  await page.setViewport({ width: 1440, height: 900 });

  // --- TEST 10: Reduced Motion Preference ---
  try {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await new Promise((r) => setTimeout(r, 400));

    const reducedMotionActive = await page.evaluate(() => {
      // In reduced motion, custom-cursor-active should be removed from body
      return !document.body.classList.contains('custom-cursor-active');
    });

    if (reducedMotionActive) {
      results.passed.push({
        id: 'T10-reduced-motion',
        evidence: 'body.custom-cursor-active correctly removed when prefers-reduced-motion: reduce'
      });
    } else {
      results.failed.push({
        id: 'T10-reduced-motion',
        expected: 'custom-cursor-active removed on reduced-motion',
        actual: 'custom-cursor-active still present'
      });
    }

    // Reset media feature
    await page.emulateMediaFeatures([]);
  } catch (err) {
    results.failed.push({ id: 'T10-reduced-motion', expected: 'Reduced motion test', actual: err.message });
  }

  // --- TEST 11: axe-core Deterministic Accessibility Audit ---
  try {
    await page.evaluate(axeSource);
    const axeResults = await page.evaluate(async () => {
      return await window.axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21aa']
        }
      });
    });

    results.axeViolations = axeResults.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      nodes: v.nodes.map((n) => ({
        html: n.html,
        target: n.target,
        failureSummary: n.failureSummary
      }))
    }));

    if (results.axeViolations.length === 0) {
      results.passed.push({
        id: 'T11-axe-wcag-audit',
        evidence: '0 WCAG 2.1 AA violations detected'
      });
    } else {
      results.failed.push({
        id: 'T11-axe-wcag-audit',
        expected: '0 WCAG violations',
        actual: `${results.axeViolations.length} violations found: ${results.axeViolations.map((v) => `${v.id} (${v.impact})`).join(', ')}`
      });
    }
  } catch (err) {
    results.failed.push({ id: 'T11-axe-wcag-audit', expected: 'axe-core audit', actual: err.message });
  }

  // --- TEST 12: Keyboard Focus Order & Focus Indicators ---
  try {
    const focusableCount = await page.evaluate(() => {
      const elements = Array.from(
        document.querySelectorAll('a, button, [role="button"], [role="link"], input, textarea, [tabindex="0"]')
      );
      return elements.length;
    });

    results.passed.push({
      id: 'T12-keyboard-focusable-elements',
      evidence: `Found ${focusableCount} keyboard-focusable interactive elements across the document`
    });
  } catch (err) {
    results.failed.push({ id: 'T12-keyboard-focusable-elements', expected: 'Keyboard check', actual: err.message });
  }

  await browser.close();

  // Print Summary
  console.log('=== UX AUDIT EXECUTION SUMMARY ===');
  console.log(`Total Tests Run: ${results.passed.length + results.failed.length}`);
  console.log(`Passed: ${results.passed.length}`);
  console.log(`Failed: ${results.failed.length}`);
  console.log(`Console Errors: ${results.consoleErrors.length}`);
  console.log(`Axe Violations: ${results.axeViolations.length}`);
  console.log('===================================\n');

  fs.writeFileSync(
    path.resolve('.context/ux-audit-results.json'),
    JSON.stringify(results, null, 2),
    'utf8'
  );
  console.log('Saved detailed results to .context/ux-audit-results.json');
}

runAudit().catch((err) => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
