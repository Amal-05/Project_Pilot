import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('Login');
  });

  test('should login successfully with admin credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@projectpilot.ai');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h2')).toContainText('My Organizations');
  });
});
