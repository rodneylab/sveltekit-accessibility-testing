import { expect, test } from '@playwright/test';
import 'dotenv/config';
import { existsSync, lstatSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import pa11y from 'pa11y';

export const BLOG_PATH = 'src/content/blog';
const __dirname = resolve();
export function getSlugs(location) {
	const directories = readdirSync(location).filter((element) =>
		lstatSync(`${location}/${element}`).isDirectory(),
	);
	const articles = [];

	directories.forEach((element) => {
		const contentPath = `${location}/${element}/index.md`;
		if (existsSync(contentPath)) {
			articles.push(element);
		}
	});
	return articles;
}

const postLocation = join(__dirname, BLOG_PATH);
const slugs = getSlugs(postLocation);

test.describe('it has no accessbility issues', () => {
	for (const slug of slugs) {
		const url = `${process.env.SITE_TEST_URL}/${slug}`;
		test.beforeEach(async ({ page }) => {
			await page.goto(url);
		});
		test(`${slug}: it has no issues identified by htmlcs or axe`, async () => {
			const results = await pa11y(url, {
				runners: ['axe', 'htmlcs'],
			});
			if (results.issues) {
				results.issues.forEach(({ code, message, runner, selector }) => {
					console.log({ code, message, runner, selector, url });
				});
			}
			expect(results.issues.length).toBe(0);
		});
	}
});
