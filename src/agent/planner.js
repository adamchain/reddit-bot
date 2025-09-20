import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function planNextStep({ goal, pageUrl, pagePreviewHtml, history }) {
  const system = `You are a cautious web automation planner.
- Return NEXT SINGLE action as JSON: {"tool":"...", "args":{...},"reason":"..."}
- Tools: navigate(url), click(selector), type(selector,text), waitFor(selector), press(key), done().
- Prefer Playwright selectors: text=, role=, placeholder=, [name=], a:has-text("...").
- Avoid destructive actions. Stop with {"tool":"done","args":{},"reason":"..."} when goal achieved.`;

  const user = `Goal: ${goal}
URL: ${pageUrl}
HTML: ${pagePreviewHtml.slice(0, 4000)}
History: ${history.map(h => h.tool + ":" + JSON.stringify(h.args)).join(" | ")}`;

  const resp = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: system }, { role: "user", content: user }],
    temperature: 0.2
  });

  const text = resp.choices?.[0]?.message?.content ?? "{}";
  if (text.trim().toLowerCase() === "done") return { tool: "done", args: {}, reason: "planner decided" };
  try { const parsed = JSON.parse(text); if (!parsed.tool) throw new Error("no tool"); return parsed; }
  catch { return { tool: "waitFor", args: { selector: "body" }, reason: "fallback-parse-error" }; }
}
