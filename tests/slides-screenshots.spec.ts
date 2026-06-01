import { expect, test } from "@playwright/test";

test("capture the cover slide", async ({ page }, testInfo) => {
  await page.goto("/1");
  await expect(page.locator("h1").first()).toContainText("Что нового");

  await page.screenshot({
    path: testInfo.outputPath("cover-slide.png"),
    fullPage: true,
  });
});
