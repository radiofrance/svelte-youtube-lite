import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test('index page has expected h1', async ({ page }) => {
	await expect(page.getByRole('heading', { name: 'svelte-youtube-lite demo' })).toBeVisible();
})

test('once the button is clicked, it should display an iframe', async ({ page }) => {
	await page.getByRole('button', { name: 'Play video' }).first().click()
	expect(page.frameLocator('internal:role=link[name="YouTube video"i]'))
})