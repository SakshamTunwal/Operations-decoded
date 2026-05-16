import { test, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// CONFIG: every page on the live site we want to audit
// ---------------------------------------------------------------------------
const BASE_URL = 'https://operationsdecoded.com';

const PAGES = [
  '/',
  '/about',
  '/blog',
  '/certifications',
  '/community',
  '/contact',
  '/login',
  '/news',
  '/privacy',
  '/solutions',
  '/terms',
  '/learn/concrete-floors',
  '/learn/last-mile',
  '/learn/demand-planning',
  '/learn/emergency-po',
  '/learn/grn-three-way-match',
  '/learn/incoterms-dock',
  '/learn/inventory-management',
  '/learn/order-to-cash',
  '/learn/procure-to-pay',
  '/learn/vendor-comparison',
];

const VIEWPORTS = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'mobile', width: 375, height: 667 },
];

// Where we save evidence + raw findings
const RESULTS_DIR = path.join(process.cwd(), 'audit-results');
const SCREENSHOTS_DIR = path.join(RESULTS_DIR, 'screenshots');

// Make sure the output folders exist before we start writing into them
for (const dir of [RESULTS_DIR, SCREENSHOTS_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// One big bucket that collects everything we find across all pages
type Finding = {
  page: string;
  viewport: string;
  type: 'console-error' | 'broken-image' | 'dead-link' | 'layout-overlap' | 'slow-load';
  detail: string;
};
const allFindings: Finding[] = [];

// ---------------------------------------------------------------------------
// HELPER: check every link on the page actually leads somewhere real
// ---------------------------------------------------------------------------
async function checkLinks(page: Page, pagePath: string, viewport: string) {
  const hrefs = await page.$$eval('a[href]', (anchors) =>
    anchors
      .map((a) => (a as HTMLAnchorElement).href)
      .filter((h) => h.startsWith('http'))
  );

  const unique = [...new Set(hrefs)];

  for (const href of unique) {
    // Skip mailto:, tel:, and external social links — only audit our own site
    if (!href.includes('operationsdecoded.com')) continue;

    try {
      const response = await page.request.head(href, { timeout: 15000 });
      if (response.status() >= 400) {
        allFindings.push({
          page: pagePath,
          viewport,
          type: 'dead-link',
          detail: `Link returned status ${response.status()}: ${href}`,
        });
      }
    } catch (err) {
      allFindings.push({
        page: pagePath,
        viewport,
        type: 'dead-link',
        detail: `Link could not be reached: ${href}`,
      });
    }
  }
}

// ---------------------------------------------------------------------------
// HELPER: detect elements that visually overlap or spill off-screen
// ---------------------------------------------------------------------------
async function checkLayout(page: Page, pagePath: string, viewport: string) {
  const overflow = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const offenders: string[] = [];
    const elements = Array.from(document.querySelectorAll('body *'));
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      // Element pokes more than 5px past the right edge = horizontal overflow
      if (rect.right > docWidth + 5 && rect.width > 0 && rect.height > 0) {
        const tag = el.tagName.toLowerCase();
        const cls =
          typeof el.className === 'string' ? el.className.slice(0, 60) : '';
        offenders.push(`<${tag} class="${cls}"> spills ${Math.round(
          rect.right - docWidth
        )}px past right edge`);
      }
    }
    return [...new Set(offenders)].slice(0, 10);
  });

  for (const item of overflow) {
    allFindings.push({
      page: pagePath,
      viewport,
      type: 'layout-overlap',
      detail: item,
    });
  }
}

// ---------------------------------------------------------------------------
// THE MAIN LOOP: one test per page per viewport
// ---------------------------------------------------------------------------
for (const pagePath of PAGES) {
  for (const vp of VIEWPORTS) {
    test(`Audit ${pagePath} [${vp.name}]`, async ({ page }) => {
      test.setTimeout(60000);

      // 1. Listen for console errors BEFORE we navigate
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          allFindings.push({
            page: pagePath,
            viewport: vp.name,
            type: 'console-error',
            detail: msg.text().slice(0, 300),
          });
        }
      });

      // 2. Set the screen size, then visit the page
      await page.setViewportSize({ width: vp.width, height: vp.height });

      const start = Date.now();
      const response = await page.goto(BASE_URL + pagePath, {
        waitUntil: 'networkidle',
        timeout: 45000,
      });
      const loadMs = Date.now() - start;

      // 3. Flag pages that took too long to load (> 5 seconds)
      if (loadMs > 5000) {
        allFindings.push({
          page: pagePath,
          viewport: vp.name,
          type: 'slow-load',
          detail: `Page took ${(loadMs / 1000).toFixed(1)}s to fully load`,
        });
      }

      // 4. Flag pages that didn't even return successfully
      if (response && response.status() >= 400) {
        allFindings.push({
          page: pagePath,
          viewport: vp.name,
          type: 'dead-link',
          detail: `Page itself returned status ${response.status()}`,
        });
      }

      // 5. Take a full-page screenshot as visual evidence
      const shotName = `${pagePath.replace(/\//g, '_') || 'home'}_${vp.name}.png`;
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, shotName),
        fullPage: true,
      });

      // 6. Check every image on the page actually rendered
      const brokenImages = await page.$$eval('img', (imgs) =>
        imgs
          .filter((img) => !img.complete || img.naturalWidth === 0)
          .map((img) => (img as HTMLImageElement).src)
      );
      for (const src of brokenImages) {
        allFindings.push({
          page: pagePath,
          viewport: vp.name,
          type: 'broken-image',
          detail: `Image failed to load: ${src}`,
        });
      }

      // 7. Run the link + layout helpers
      await checkLinks(page, pagePath, vp.name);
      await checkLayout(page, pagePath, vp.name);
    });
  }
}

// ---------------------------------------------------------------------------
// AFTER ALL TESTS: dump everything we found into one JSON file
// ---------------------------------------------------------------------------
test.afterAll(async () => {
  const outPath = path.join(RESULTS_DIR, 'playwright-findings.json');
  fs.writeFileSync(outPath, JSON.stringify(allFindings, null, 2));
  console.log(`\n✅ Playwright audit complete. ${allFindings.length} findings saved to ${outPath}`);
});