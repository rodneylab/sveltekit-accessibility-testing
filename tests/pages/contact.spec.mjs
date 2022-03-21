import { expect, test } from '@playwright/test';
import pa11y from 'pa11y';

const path = '/contact';
const url = `${process.env.SITE_TEST_URL}${path}`;

test.describe('it has no accessbility issues', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });
  test('it has no issues identified by htmlcs or axe', async () => {
    const results = await pa11y(url, {
      runners: ['axe', 'htmlcs'],
    });
    if (results.issues) {
      results.issues.forEach(({ code, message, runner, selector }) => {
        console.log({ code, message, runner, selector });
      });
    }
    expect(results.issues.length).toBe(0);
  });
});
