import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("shows the Redo brand", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Redo" })).toBeVisible();
});

test("adds a to-do", async ({ page }) => {
  await page.getByLabel("New to-do").fill("Buy milk");
  await page.getByRole("button", { name: "Add" }).click();

  await expect(page.getByRole("list", { name: "To-dos" }).getByRole("listitem")).toHaveText(["Buy milk"]);
});

test("clears the input after adding", async ({ page }) => {
  const input = page.getByLabel("New to-do");
  await input.fill("Walk the dog");
  await input.press("Enter");

  await expect(input).toHaveValue("");
});

test("ignores blank to-dos", async ({ page }) => {
  await page.getByLabel("New to-do").fill("   ");
  await page.getByRole("button", { name: "Add" }).click();

  await expect(page.getByRole("list", { name: "To-dos" }).getByRole("listitem")).toHaveCount(0);
});

test("completes a to-do", async ({ page }) => {
  await page.getByLabel("New to-do").fill("Water plants");
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByRole("checkbox", { name: "Water plants" }).check();

  await expect(page.getByRole("checkbox", { name: "Water plants" })).toBeChecked();
});

test("keeps to-dos after a reload", async ({ page }) => {
  await page.getByLabel("New to-do").fill("Pay rent");
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByRole("checkbox", { name: "Pay rent" }).check();
  await page.reload();

  await expect(page.getByRole("checkbox", { name: "Pay rent" })).toBeChecked();
});
