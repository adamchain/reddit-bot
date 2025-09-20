import { sleep } from "../outreach/policy.js";
import { makeDM } from "../outreach/generator.js";
import { enqueueDM, dueDMs, clearDM, logAction } from "../storage/sqlite.js";

const DM_DELAY_MS = 23 * 60 * 1000; // 23 minutes

export class DMQueue {
  constructor(r) { this.r = r; this.processing = false; }
  async enqueue({ username, contextLink }) {
    if (!username) return;
    await enqueueDM({ username, contextLink, added: Date.now() });
    await logAction("queueDM", `Queued DM for ${username}`);
  }
  async process() {
    if (this.processing) return;
    this.processing = true;
    while (true) {
      const due = await dueDMs(DM_DELAY_MS);
      for (const item of due) {
        try {
          const text = makeDM(item);
          await this.r.composeMessage({ to: item.username, subject: "Quick details on HeyWay", text });
          await logAction("sendDM", `Sent DM to ${item.username}`);
        } catch (e) {
          await logAction("dmError", e.message);
        }
        await clearDM(item.id);
        await sleep(2000);
      }
      await sleep(60000);
    }
  }
}
