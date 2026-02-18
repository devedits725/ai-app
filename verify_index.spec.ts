import { test, expect } from '@playwright/test';

test('verify index and banner ad', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  // Wait for redirect to auth if needed
  await page.waitForTimeout(2000);
  if (page.url().includes('/auth')) {
    // Click "Skip for now" to enter guest mode
    await page.click('text=SKIP FOR NOW');
    await page.waitForURL('http://localhost:3000/');
  }
  await page.screenshot({ path: 'verify_index_ads.png' });
});
