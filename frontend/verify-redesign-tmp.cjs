const { chromium } = require('playwright');
const path = require('path');
const SHOT_DIR = 'C:\\Users\\User\\AppData\\Local\\Temp\\claude\\c--Users-User-OneDrive-Attachments-Desktop-Pixel-Panel\\63d1f604-b868-4bbf-87e0-a5ed4e3398e0\\scratchpad\\shots';

const TEST_TITLE = 'ZZZ_CLAUDE_TEST_DELETE_ME_' + Date.now();

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errors = [];
  page.on('pageerror', (err) => errors.push('PAGEERROR: ' + err.message));

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'admin@pixelpanel.com');
  await page.fill('input[name="password"]', 'Admin@12345');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1200);
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(SHOT_DIR, 'redesign-1-overview.png') });

  await page.click('button:has-text("Users")');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SHOT_DIR, 'redesign-2-users.png') });

  await page.click('button:has-text("Stories")');
  await page.waitForTimeout(600);
  await page.click('button:has-text("New Story")');
  await page.waitForTimeout(500);

  await page.fill('label:has-text("Title") input', TEST_TITLE);
  await page.fill('label:has-text("Author") input', 'QA Bot');
  await page.fill('label:has-text("Description") textarea', 'Throwaway test story — safe to delete.');
  await page.fill('label:has-text("Cover Image URL") input', 'https://example.com/cover.jpg');

  // Click genre chips
  await page.click('button:has-text("Fantasy")');
  await page.click('button:has-text("Adventure")');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(SHOT_DIR, 'redesign-3-genre-chips.png') });

  await page.click('button:has-text("Save")');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SHOT_DIR, 'redesign-4-story-created.png') });

  console.log('TEST_TITLE:', TEST_TITLE);
  console.log('ERRORS:', JSON.stringify(errors));
  await browser.close();
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
