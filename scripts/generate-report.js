// ---------------------------------------------------------------------------
// generate-report.js
// The "editor-in-chief". Reads raw findings from Playwright + Lighthouse,
// assigns severity, groups them, and writes a single audit-report.md.
// ---------------------------------------------------------------------------

const fs = require('fs');
const path = require('path');

const RESULTS_DIR = path.join(process.cwd(), 'audit-results');
const PLAYWRIGHT_FILE = path.join(RESULTS_DIR, 'playwright-findings.json');
const LIGHTHOUSE_DIR = path.join(RESULTS_DIR, 'lighthouse');
const REPORT_PATH = path.join(process.cwd(), 'audit-report.md');

// ---------------------------------------------------------------------------
// SEVERITY RULES: how urgent is each kind of problem?
//   Critical = site is broken for visitors, fix immediately
//   High     = clearly wrong, fix soon
//   Medium   = should fix, not on fire
//   Low      = cosmetic / nice-to-have
// ---------------------------------------------------------------------------
function severityForPlaywright(type) {
  switch (type) {
    case 'dead-link':
      return 'Critical';
    case 'console-error':
      return 'High';
    case 'broken-image':
      return 'High';
    case 'layout-overlap':
      return 'Medium';
    case 'slow-load':
      return 'Medium';
    default:
      return 'Low';
  }
}

// Lighthouse scores are 0–1. Lower score = worse = more urgent.
function severityForScore(score) {
  if (score < 0.5) return 'Critical';
  if (score < 0.7) return 'High';
  if (score < 0.9) return 'Medium';
  return 'Low';
}

// ---------------------------------------------------------------------------
// FILE-PATH HINT: guess which code file maps to a given URL path,
// so Claude Code knows where to look.
// ---------------------------------------------------------------------------
function filePathHint(pagePath) {
  if (pagePath === '/' || pagePath === '') {
    return 'app/page.tsx';
  }
  const clean = pagePath.replace(/^\/+|\/+$/g, '');
  return `app/${clean}/page.tsx`;
}

// ---------------------------------------------------------------------------
// STEP 1: Read the Playwright findings (if the file exists)
// ---------------------------------------------------------------------------
function loadPlaywrightFindings() {
  if (!fs.existsSync(PLAYWRIGHT_FILE)) {
    console.warn('⚠️  No Playwright findings file found — skipping that section.');
    return [];
  }
  try {
    const raw = fs.readFileSync(PLAYWRIGHT_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.warn('⚠️  Could not parse Playwright findings:', err.message);
    return [];
  }
}

// ---------------------------------------------------------------------------
// STEP 2: Read every Lighthouse result file in the lighthouse folder
// ---------------------------------------------------------------------------
function loadLighthouseFindings() {
  const findings = [];
  if (!fs.existsSync(LIGHTHOUSE_DIR)) {
    console.warn('⚠️  No Lighthouse results folder found — skipping that section.');
    return findings;
  }

  const files = fs
    .readdirSync(LIGHTHOUSE_DIR)
    .filter((f) => f.endsWith('.report.json'));

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(LIGHTHOUSE_DIR, file), 'utf-8');
      const data = JSON.parse(raw);
      const url = data.finalUrl || data.requestedUrl || 'unknown URL';
      const cats = data.categories || {};

      for (const key of Object.keys(cats)) {
        const cat = cats[key];
        if (typeof cat.score !== 'number') continue;
        findings.push({
          url,
          category: cat.title || key,
          score: cat.score,
          severity: severityForScore(cat.score),
        });
      }
    } catch (err) {
      console.warn(`⚠️  Skipped unreadable Lighthouse file ${file}:`, err.message);
    }
  }
  return findings;
}

// ---------------------------------------------------------------------------
// STEP 3: Sort everything so the most urgent items are at the top
// ---------------------------------------------------------------------------
const SEVERITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 };

function sortBySeverity(a, b) {
  return SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
}

// ---------------------------------------------------------------------------
// STEP 4: Build the markdown report text
// ---------------------------------------------------------------------------
function buildReport(pwFindings, lhFindings) {
  const now = new Date().toLocaleString();
  const lines = [];

  lines.push('# 🔍 Operations Decoded — Site Audit Report');
  lines.push('');
  lines.push(`_Generated: ${now}_`);
  lines.push('');

  // Tag every Playwright finding with severity + file hint
  const taggedPw = pwFindings.map((f) => ({
    ...f,
    severity: severityForPlaywright(f.type),
    hint: filePathHint(f.page),
  }));

  // ---- Summary counts ----
  const all = [
    ...taggedPw.map((f) => f.severity),
    ...lhFindings.map((f) => f.severity),
  ];
  const count = (sev) => all.filter((s) => s === sev).length;

  lines.push('## 📊 Summary');
  lines.push('');
  lines.push(`- 🔴 **Critical:** ${count('Critical')}`);
  lines.push(`- 🟠 **High:** ${count('High')}`);
  lines.push(`- 🟡 **Medium:** ${count('Medium')}`);
  lines.push(`- ⚪ **Low:** ${count('Low')}`);
  lines.push('');
  lines.push(`Total issues found: **${all.length}**`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // ---- Functional / visual issues from Playwright (GROUPED) ----
  lines.push('## 🛠️ Functional & Visual Issues (Playwright)');
  lines.push('');

  if (taggedPw.length === 0) {
    lines.push('✅ No functional or visual issues detected. Great job!');
    lines.push('');
  } else {
    // Group identical issue types per page+viewport so 120 raw findings
    // collapse into a handful of clear, actionable items.
    const groups = {};
    for (const f of taggedPw) {
      const key = `${f.page}|||${f.viewport}|||${f.type}`;
      if (!groups[key]) {
        groups[key] = {
          page: f.page,
          viewport: f.viewport,
          type: f.type,
          severity: f.severity,
          hint: f.hint,
          count: 0,
          details: [],
        };
      }
      groups[key].count += 1;
      const d = (f.detail || '').trim();
      if (d && !groups[key].details.includes(d)) {
        groups[key].details.push(d);
      }
    }

    const grouped = Object.values(groups).sort(sortBySeverity);

    for (const g of grouped) {
      const times = g.count > 1 ? ` (×${g.count} occurrences)` : '';
      lines.push(`### [${g.severity}] ${g.type} — \`${g.page}\` [${g.viewport}]${times}`);
      lines.push('');
      lines.push(`- **Likely file to fix:** \`${g.hint}\``);
      lines.push(
        `- **Screenshot:** \`audit-results/screenshots/${(g.page.replace(/\//g, '_') || 'home')}_${g.viewport}.png\``
      );
      if (g.details.length === 1) {
        lines.push(`- **Detail:** ${g.details[0]}`);
      } else {
        lines.push(`- **Distinct details (${g.details.length}):**`);
        for (const d of g.details.slice(0, 12)) {
          lines.push(`  - ${d}`);
        }
        if (g.details.length > 12) {
          lines.push(`  - …and ${g.details.length - 12} more similar`);
        }
      }
      lines.push('');
    }

    // A "shared template" hint: if the same issue type hits many /learn/
    // pages on the same viewport, call it out as one root cause.
    const learnGroups = grouped.filter(
      (g) => g.page.startsWith('/learn/') && g.type === 'layout-overlap'
    );
    if (learnGroups.length >= 3) {
      lines.push('> 💡 **Root-cause hint:** the same `layout-overlap` issue appears on ' +
        `${learnGroups.length} different /learn/ pages. These pages share a template/components, ` +
        'so this is likely **one underlying bug** — fixing the shared learn-page layout once ' +
        'should resolve most of these at once.');
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('');

  // ---- Quality scores from Lighthouse ----
  lines.push('## 📈 Quality Scores (Lighthouse)');
  lines.push('');

  if (lhFindings.length === 0) {
    lines.push('⚠️ No Lighthouse data available for this run.');
    lines.push('');
  } else {
    lhFindings.sort(sortBySeverity);
    let currentUrl = '';
    for (const f of lhFindings) {
      if (f.url !== currentUrl) {
        currentUrl = f.url;
        lines.push(`### \`${f.url}\``);
        lines.push('');
      }
      const score100 = Math.round(f.score * 100);
      lines.push(
        `- [${f.severity}] **${f.category}:** ${score100}/100`
      );
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('## 📋 How to use this report');
  lines.push('');
  lines.push('1. Fix **Critical** items first, then High, Medium, Low.');
  lines.push('2. The "Likely file to fix" is a hint, not a guarantee.');
  lines.push('3. Open the screenshot to see exactly what the issue looks like.');
  lines.push('4. Paste this whole file into Claude Code to apply fixes.');
  lines.push('');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// STEP 5: Run everything and write the file
// ---------------------------------------------------------------------------
function main() {
  console.log('📝 Generating audit report...');

  const pwFindings = loadPlaywrightFindings();
  const lhFindings = loadLighthouseFindings();

  const report = buildReport(pwFindings, lhFindings);
  fs.writeFileSync(REPORT_PATH, report, 'utf-8');

  console.log(`✅ Report written to ${REPORT_PATH}`);
  console.log(
    `   ${pwFindings.length} functional/visual findings, ${lhFindings.length} Lighthouse scores.`
  );
}

main();