import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000/project/MDG';

const routes = ['bp_banksteward.html', 'ir_approval.html', 'history_rejected.html'];

async function inspectEmojis() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

  for (const route of routes) {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/${route}`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 600));

    const matches = await page.evaluate(() => {
      const all = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      const regex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      while ((node = walker.nextNode())) {
        if (regex.test(node.textContent)) {
          all.push({
            parentTag: node.parentElement ? node.parentElement.tagName : 'unknown',
            text: node.textContent.trim().slice(0, 100)
          });
        }
      }
      return all;
    });

    console.log(route, 'matches count:', matches.length);
    console.log(matches);
    await page.close();
  }

  await browser.close();
}

inspectEmojis().catch(console.error);
