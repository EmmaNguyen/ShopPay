import { test, expect } from "@playwright/test";

test.use({
  viewport: { width: 1280, height: 720 },
  video: { mode: "on", size: { width: 1280, height: 720 } },
});

test("ShopPal chat demo clip for hackathon video", async ({ page }) => {
  await page.goto("/chat");
  await expect(page.getByText(/Dallas\/Fort Worth · Terminal C · Gate C19/i)).toBeVisible({
    timeout: 15_000,
  });

  await page.getByRole("button", { name: /Show 3 picks/i }).click();
  await expect(page.getByRole("button", { name: /^Budget:/i }).first()).toBeVisible({
    timeout: 25_000,
  });
  await page.waitForTimeout(800);

  await page.getByRole("button", { name: /^Budget:/i }).first().click();
  await expect(page.getByRole("button", { name: /^yes, pay$/i })).toBeVisible({
    timeout: 15_000,
  });
  await page.waitForTimeout(600);

  await page.getByRole("button", { name: /^yes, pay$/i }).click();

  await expect(page.getByText(/Simulate PayPal approval/i)).toBeVisible({
    timeout: 25_000,
  });
  await page.waitForTimeout(800);

  await page.getByRole("button", { name: /Simulate PayPal approval/i }).click();
  await expect(page.getByText(/COMPLETED/i).first()).toBeVisible({ timeout: 25_000 });
  await page.waitForTimeout(2000);
});
