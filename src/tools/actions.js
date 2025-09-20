export function buildTools(page) {
  return {
    navigate: async (url) => { await page.goto(url, { waitUntil: 'domcontentloaded' }); return `navigated:${page.url()}`; },
    click: async (selector) => { await page.click(selector); return `clicked:${selector}`; },
    type: async (selector, text) => { await page.fill(selector, text ?? ''); return `typed:${selector}`; },
    press: async (key) => { await page.keyboard.press(key); return `pressed:${key}`; },
    waitFor: async (selector, timeout = 8000) => { await page.waitForSelector(selector, { timeout }); return `waited:${selector}`; },
    extractHtml: async (selector = 'body') => await page.$eval(selector, el => el.innerHTML ?? ''),
    getUrl: async () => page.url(),
    queryAllTexts: async (selector) => page.locator(selector).allInnerTexts(),
    screenshot: async (path) => { await page.screenshot({ path, fullPage: true }); return `screenshot:${path}`; }
  };
}
