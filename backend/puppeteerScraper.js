const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// Scrape recent/popular Chinese and Korean light novels from BoxNovel
async function scrapeLightNovels() {
  const url = 'https://boxnovel.com/';
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait for the novel list to load
  await page.waitForSelector('.list-truyen .row');

  // Scrape novels
  const novels = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.list-truyen .row'));
    return rows.slice(0, 8).map(row => {
      const titleElem = row.querySelector('h3 a');
      const title = titleElem ? titleElem.textContent.trim() : '';
      const link = titleElem ? titleElem.href : '';
      const coverElem = row.querySelector('img');
      const cover = coverElem ? coverElem.src : '';
      // Author is not available on the homepage, so leave blank
      return { title, author: '', link, cover };
    });
  });

  await browser.close();
  return novels;
}

module.exports = { scrapeLightNovels }; 