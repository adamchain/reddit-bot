import 'dotenv/config.js';
import { runTask } from './agent/agentLoop.js';

const task = {
  goal: "Sign in to ExampleForum and comment 'Nice post!' on the most recent post about TypeScript.",
  target: { site: "https://example-forum.test" },
  inputs: {
    username: process.env.EF_USER || "demo_user",
    password: process.env.EF_PASS || "demo_pass",
    comment: "Nice post!"
  },
  allowDomains: ["example-forum.test"],
  maxSteps: 25,
  headless: true
};

runTask(task)
  .then(() => { console.log("Task complete."); process.exit(0); })
  .catch((err) => { console.error("Task failed:", err); process.exit(1); });
