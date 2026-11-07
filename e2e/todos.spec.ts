import { expect, test as base, type Page } from "@playwright/test";

// Every visitor shares one list, so tests use unique text, assert only on their
// own items, and delete every to-do they created even when they fail.
const test = base.extend<{ createdIds: string[] }>({
  createdIds: async ({ page, request }, provide) => {
    const ids: string[] = [];
    page.on("response", async (response) => {
      if (response.request().method() === "POST" && new URL(response.url()).pathname === "/api/todos" && response.ok()) {
        ids.push((await response.json()).id);
      }
    });
    await provide(ids);
    for (const id of ids) {
      await request.delete(`/api/todos/${id}`);
    }
  },
});

const unique = (text: string) => `${text} ${crypto.randomUUID().slice(0, 8)}`;

async function addTodo(page: Page, text: string) {
  const created = page.waitForResponse((r) => r.request().method() === "POST" && r.url().endsWith("/api/todos"));
  await page.getByLabel("New to-do").fill(text);
  await page.getByRole("button", { name: "Add" }).click();
  await created;
}

test.beforeEach(async ({ page, createdIds }) => {
  void createdIds;
  await page.goto("/");
});

test("shows the Redo brand", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Redo" })).toBeVisible();
});

test("adds a to-do", async ({ page }) => {
  const text = unique("Buy milk");
  await addTodo(page, text);

  await expect(page.getByRole("list", { name: "To-dos" }).getByRole("listitem").filter({ hasText: text })).toHaveCount(1);
});

test("clears the input after adding", async ({ page }) => {
  const input = page.getByLabel("New to-do");
  const created = page.waitForResponse((r) => r.request().method() === "POST" && r.url().endsWith("/api/todos"));
  await input.fill(unique("Walk the dog"));
  await input.press("Enter");
  await created;

  await expect(input).toHaveValue("");
});

test("ignores blank to-dos", async ({ page }) => {
  let posted = false;
  page.on("request", (request) => {
    if (request.method() === "POST" && request.url().endsWith("/api/todos")) posted = true;
  });
  await page.getByLabel("New to-do").fill("   ");
  await page.getByRole("button", { name: "Add" }).click();

  await expect(page.getByLabel("New to-do")).toHaveValue("   ");
  expect(posted).toBe(false);
});

test("completes a to-do", async ({ page }) => {
  const text = unique("Water plants");
  await addTodo(page, text);
  await page.getByRole("checkbox", { name: text }).check();

  await expect(page.getByRole("checkbox", { name: text })).toBeChecked();
});

test("keeps to-dos after a reload", async ({ page }) => {
  const text = unique("Pay rent");
  await addTodo(page, text);
  const toggled = page.waitForResponse((r) => r.request().method() === "PATCH");
  await page.getByRole("checkbox", { name: text }).check();
  await toggled;
  await page.reload();

  await expect(page.getByRole("checkbox", { name: text })).toBeChecked();
});
