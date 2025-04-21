const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false }); // headless: false so you can see it
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  try {
    await page.goto('https://www.justdial.com/Delhi/Salons', {
      waitUntil: 'load', // <- changed from 'networkidle'
      timeout: 90000, // increased timeout
    });

    await page.waitForTimeout(7000); // wait for content to load

    const salons = await page.$$eval('.store-details .business-name', nodes =>
      nodes.map(n => ({
        name: n.textContent.trim(),
        url: n.href,
      }))
    );

    console.log('✅ Found salons:', salons);
  } catch (err) {
    console.error('❌ Scraping failed:', err);
  } finally {
    await browser.close();
  }
})();
