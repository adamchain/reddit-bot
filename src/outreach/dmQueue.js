import { sleep } from "../outreach/policy.js";
import { makeDM } from "../outreach/generator.js";
import { enqueueDM, dueDMs, clearDM, logAction } from "../storage/sqlite.js";

function getRandomDMDelay() {
  // Random delay between 12-38 minutes (720-2280 seconds)
  const minSeconds = 12 * 60; // 12 minutes
  const maxSeconds = 38 * 60; // 38 minutes
  const randomSeconds = minSeconds + Math.random() * (maxSeconds - minSeconds);
  return Math.floor(randomSeconds * 1000); // Convert to milliseconds
}

export class DMQueue {
  constructor(r) {
    this.r = r;
    this.processing = false;
    this.scheduledDMs = new Map(); // Track individual DM delays
  }

  async enqueue({ username, contextLink }) {
    if (!username) return;
    const delay = getRandomDMDelay();
    const scheduledTime = Date.now() + delay;

    await enqueueDM({ username, contextLink, added: Date.now() });
    this.scheduledDMs.set(username, scheduledTime);

    const delayMinutes = Math.round(delay / 60000);
    await logAction("queueDM", `Queued DM for ${username} - will send in ${delayMinutes} minutes`);
  }
  async process() {
    if (this.processing) return;
    this.processing = true;
    while (true) {
      // Check all queued DMs to see if any are ready to send
      const allDMs = await dueDMs(0); // Get all DMs regardless of time
      const now = Date.now();

      for (const item of allDMs) {
        const scheduledTime = this.scheduledDMs.get(item.username);

        // Send DM if enough time has passed since it was scheduled
        if (scheduledTime && now >= scheduledTime) {
          try {
            const text = makeDM(item);
            await this.r.composeMessage({
              to: item.username,
              subject: "Quick details on the call automation stuff",
              text
            });
            await logAction("sendDM", `Sent DM to ${item.username}`);
            this.scheduledDMs.delete(item.username); // Remove from tracking
          } catch (e) {
            await logAction("dmError", `Failed to send DM to ${item.username}: ${e.message}`);
          }
          await clearDM(item.id);
          await sleep(2000); // Brief pause between DMs
        }
      }
      await sleep(60000); // Check every minute
    }
  }
}
