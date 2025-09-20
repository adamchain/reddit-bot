import { createBrowser } from '../browser/playwrightClient.js';
import { buildTools } from '../tools/actions.js';
import { planNextStep } from './planner.js';
import { tryExampleForum } from '../adapters/example-forum.js';

export async function runTask(task) {
  const { target, goal, allowDomains = [], maxSteps = 20, headless = true } = task;
  if (!target?.site) throw new Error("task.target.site required");

  const { browser, context, page } = await createBrowser({ headless });
  const tools = buildTools(page);
  const history = [];
  let steps = 0;

  try {
    const siteUrl = new URL(target.site);
    if (allowDomains.length && !allowDomains.includes(siteUrl.hostname)) {
      throw new Error(`Domain ${siteUrl.hostname} not in allowDomains`);
    }
    await tools.navigate(target.site);

    const adapterHandled = await tryExampleForum(task, tools);
    if (adapterHandled) { console.log("[adapter] example-forum handled."); return; }

    while (steps < maxSteps) {
      steps += 1;
      await page.waitForTimeout(350);
      const pageUrl = await tools.getUrl();
      if (allowDomains.length) {
        const host = new URL(pageUrl).hostname;
        if (!allowDomains.includes(host)) throw new Error(`Left allow-list: ${host}`);
      }
      const html = await tools.extractHtml('body');
      const pagePreview = html.replace(/\s+/g, ' ').slice(0, 8000);

      const plan = await planNextStep({ goal, pageUrl, pagePreviewHtml: pagePreview, history });
      const { tool, args = {}, reason = "" } = plan;

      if (tool === "done") { console.log("[agent] Done:", reason); break; }
      if (!tools[tool]) { await tools.waitFor('body'); history.push({ tool: "waitFor", args: { selector: "body" } }); continue; }

      try {
        const res = await tools[tool](...(Array.isArray(args) ? args : Object.values(args)));
        history.push({ tool, args, res });
        console.log(`[agent] Step ${steps} -> ${tool}`, args, reason);
      } catch (e) {
        console.warn("[agent] Tool failed:", tool, args, e.message);
        await page.waitForTimeout(500);
      }
    }
    await tools.screenshot("final.png");
  } finally {
    await context.close(); await browser.close();
  }
}
