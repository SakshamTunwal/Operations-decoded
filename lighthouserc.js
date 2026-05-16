// ---------------------------------------------------------------------------
// Lighthouse CI configuration
// This is a settings file, not a script. It tells Lighthouse:
//   1. WHICH live pages to grade
//   2. HOW MANY times to test each (averaging makes scores reliable)
//   3. WHAT counts as a passing grade
//   4. WHERE to save the raw results for our report generator
// ---------------------------------------------------------------------------

const BASE_URL = 'https://operationsdecoded.com';

// The pages we want Lighthouse to grade.
// We grade a representative sample, not all 21 — full Lighthouse on every
// page would take ~20+ minutes. These cover every page TYPE on the site.
const URLS = [
  '/',                            // homepage
  '/about',                       // standard content page
  '/blog',                        // list/index page
  '/solutions',                   // key conversion page
  '/contact',                     // form page
  '/learn/inventory-management',  // representative learn/ sub-page
];

module.exports = {
  ci: {
    collect: {
      // The full list of URLs to test, built from BASE_URL + each path above
      url: URLS.map((path) => BASE_URL + path),

      // Run each page 3 times and use the median score.
      // A single run can be skewed by a one-off slow network moment;
      // 3 runs + median = a score you can trust.
      numberOfRuns: 3,

      settings: {
        // Emulate a normal desktop. We already cover mobile layout
        // separately in the Playwright script, and running Lighthouse
        // in both modes would double the runtime.
        preset: 'desktop',

        // Skip the PWA category — not relevant for a content site,
        // and skipping it speeds up each run.
        onlyCategories: [
          'performance',
          'accessibility',
          'best-practices',
          'seo',
        ],
      },
    },

    assert: {
      // These are our "passing grades." Lighthouse scores are 0–1
      // internally (0.9 = a score of 90 out of 100).
      // 'warn' means: record it in the report, but don't hard-fail.
      // We WANT warnings to flow into the report, not block the run.
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },

    upload: {
      // Save all results as local files (no cloud account needed).
      // Our report generator (File 3) reads from this folder.
      target: 'filesystem',
      outputDir: './audit-results/lighthouse',
    },
  },
};