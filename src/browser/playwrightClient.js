import { firefox } from '@playwright/test';

export async function createBrowser({ headless = true, storageState = null } = {}) {
  const browser = await firefox.launch({ headless });
  const context = await browser.newContext({ storageState: storageState || undefined });
  const page = await context.newPage();
  return { browser, context, page };
}
