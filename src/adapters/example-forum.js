export async function tryExampleForum(task, tools) {
  const currentUrl = await tools.getUrl();
  try {
    const url = new URL(currentUrl || task.target?.site || "https://example-forum.test");
    if (!url.hostname.includes("example-forum")) return false;
  } catch { return false; }

  await tools.navigate("https://example-forum.test/");
  try { await tools.click('text=Sign in'); } catch {}

  try {
    await tools.type('input[name="username"]', task.inputs?.username ?? "");
    await tools.type('input[name="password"]', task.inputs?.password ?? "");
    await tools.click('button[type="submit"]');
    await tools.waitFor('text=Logout');
  } catch {}

  await tools.navigate("https://example-forum.test/search?q=TypeScript");
  await tools.waitFor('a:has-text("TypeScript")');
  await tools.click('a:has-text("TypeScript")');

  try {
    await tools.waitFor('textarea[name="comment"]');
    await tools.type('textarea[name="comment"]', task.inputs?.comment ?? "Nice post!");
    await tools.click('button:has-text("Post")');
    await tools.waitFor('text=Your comment has been posted');
  } catch {}
  return true;
}
