import { dailySummary } from "../storage/sqlite.js";

(async () => {
  const logs = await dailySummary();
  console.log("=== Daily Summary (last 24h) ===");
  for (const l of logs) {
    const ts = new Date(l.ts).toISOString();
    console.log(`[${ts}] ${l.action}: ${l.detail}`);
  }
  process.exit(0);
})();
