import { expect, test } from '@playwright/test';

// Smoke test - also confirms that the Playwright browsers are installed.
test('Startseite laedt', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Move-in2Stay/);
  await expect(page.locator('h1').first()).toBeVisible();
});

test('Kontaktseite ist erreichbar', async ({ page }) => {
  await page.goto('/kontakt');

  await expect(page.locator('h1').first()).toBeVisible();
});
