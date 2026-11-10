import { test, expect } from "@playwright/test";

test("ShopPal demo recording", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Delegate the cart/i })
  ).toBeVisible();

  await page.getByRole("link", { name: /Try ShopPal/i }).click();
  await expect(page).toHaveURL(/\/chat/);

  const input = page.getByPlaceholder("Describe what you need");
  await input.fill("wireless earbuds under $80");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(
    page.getByRole("button", { name: /SoundWave Lite/i }).first()
  ).toBeVisible({ timeout: 15_000 });

  await input.fill("I'll take option 1");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText(/yes, pay/i).first()).toBeVisible({
    timeout: 15_000,
  });

  await input.fill("yes, pay");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText(/^PayPal checkout:/i).first()).toBeVisible({
    timeout: 20_000,
  });
});
