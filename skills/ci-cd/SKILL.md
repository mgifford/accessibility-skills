---
name: ci-cd
description: >
  Load this skill when configuring or reviewing CI/CD pipelines, GitHub Actions
  workflows, or automated testing setups. Ensures accessibility regressions are
  caught before code reaches production by enforcing quality gates, structured
  reporting, and a zero-debt strategy across all pages and user preferences.
---

# CI/CD Accessibility Skill

> **Canonical source**: `examples/CI_CD_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when adding, reviewing, or maintaining CI/CD accessibility checks.

---

## Core Mandate

Every CI/CD pipeline must prevent accessibility regressions from reaching production.
Automated checks are the baseline, not the ceiling — combine rule-based scanning with
accessibility tree testing and, where practical, virtual screen reader testing.

**Zero-Debt strategy:** target 100 % Lighthouse Accessibility and Performance scores
on all pages across all devices and user preferences.

## The Strategy: Local-First and AI-Aligned

Automation is the baseline, not the ceiling. Prefer this stack:

* **Lighthouse CI** for high-level quality gates (100 % targets).
* **Playwright + axe-core** for dynamic interactions, mobile states, and light/dark coverage.
* **Local audits first** to reduce CI noise and shorten feedback loops.
* **Structured outputs (JSON artifacts)** so findings are AI-ready for triage and remediation workflows.

---

## Severity Scale (this skill)

| Level | Meaning |
| --- | --- |
| **Critical** | Blocks task completion entirely for one or more disability groups |
| **Serious** | Significantly impairs access; workaround unreasonable to expect |
| **Moderate** | Creates friction; workaround exists and is not too burdensome |
| **Minor** | Best-practice gap; marginal impact on access |

---

## Security Considerations

This skill references GitHub Actions that fetch and execute remote code. This
creates a **supply chain risk** (Snyk W012: Potentially malicious external URL).

### The Risk

GitHub Actions execute code from external repositories:
- `github/accessibility-scanner@v3` — runs accessibility scans against your site
- `AGENT_REMEDIATION_WORKFLOW.yml` — runs a Copilot coding agent that applies fixes
- Any pinned action version could be compromised upstream

### Mitigations

When implementing these workflows:

1. **Pin to commit SHAs, not tags** — Tags can be moved; commit SHAs cannot:
   ```yaml
   # Instead of:
   uses: actions/checkout@v4
   
   # Use:
   uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11  # v4.1.1
   ```

2. **Review action sources** — Only use actions from trusted publishers:
   - `actions/checkout`, `actions/setup-node`, `actions/upload-artifact` (GitHub official)
   - `github/accessibility-scanner` (GitHub official)
   - `dequelabs/axe-core-npm` (axe-core maintainers)

3. **Audit before copying workflows** — Review `AGENT_REMEDIATION_WORKFLOW.yml`
   before copying to your repo. Understand that it grants Copilot write access
   to create PRs.

4. **Use `permissions:` to limit blast radius** — Always declare minimum permissions:
   ```yaml
   permissions:
     contents: read
     issues: write  # only if creating issues
   ```

5. **Review Dependabot PRs** — When Dependabot proposes action updates, review
   the changelog before approving.

### Acceptance

This pattern is acceptable because:
- CI/CD automation requires executing external code by design
- Pinning to SHAs ensures you control exactly which code runs
- The actions referenced are from established, trusted publishers
- Repository permissions limit what any action can do

---

## Critical: Lighthouse CI Quality Gate

Enforce a strict score threshold. A drop to 99 % accessibility or performance **must
fail the build**.

**`.lighthouserc.js` (strict gate — use once baseline is clean):**
```javascript
module.exports = {
  ci: {
    collect: {
      staticDistDir: './_site',
      numberOfRuns: 1,
      settings: { emulatedFormFactor: 'mobile' },
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:performance':   ['error', { minScore: 1 }],
      },
    },
  },
};
```

**`.lighthouserc.json` (warn-first — use while resolving existing issues):**
```json
{
  "ci": {
    "collect": { "staticDistDir": "./_site", "numberOfRuns": 1 },
    "assert": {
      "assertions": {
        "categories:accessibility": ["warn", { "minScore": 0.9 }]
      }
    },
    "upload": { "target": "filesystem", "outputDir": ".lighthouseci" }
  }
}
```

> Start with `"warn"` + `minScore: 0.9`, then tighten to `"error"` + `minScore: 1`
> once the existing baseline is clean.

---

## Critical: axe-core on Every PR

Run axe-core via Playwright on every pull request to catch WCAG violations in
dynamic content (menus, modals, theme variants).

Run the same accessibility checks in both light and dark color schemes. A PR is
not fully covered unless the test suite explicitly emulates each scheme and
fails on violations in either mode. If you use visual regression tests, keep the
baselines separate for light and dark mode.

#### Dual light/dark mode coverage

Use one test body and run it twice, once for each color scheme:

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const colorScheme of ['light', 'dark'] as const) {
  test(`A11y: home page in ${colorScheme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
```

If the app has visual regression tests, keep separate baselines for each
scheme. That makes theme-specific failures obvious instead of hiding them in one
shared snapshot.

```typescript
// tests/a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const themes = ['light', 'dark'];

for (const theme of themes) {
  test(`A11y: Desktop & Mobile in ${theme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme as 'light' | 'dark' });
    await page.goto('/');

    const menuBtn = page.locator('#main-menu-toggle');
    if (await menuBtn.isVisible()) await menuBtn.click();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
```

**Missing axe-core checks on PRs is Critical** — dynamic violations are invisible to
Lighthouse and reach production silently. Missing one of the color-scheme passes
is also a coverage gap, because theme-specific regressions often only appear in
the scheme that was not exercised.

---

## Serious: GitHub Actions Workflows

### A. Lighthouse CI on every PR and push to `main`

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  pull_request:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
        with: { ruby-version: "3.2", bundler-cache: true }
      - run: bundle exec jekyll build
      - uses: actions/setup-node@v4
        with: { node-version: "22" }
      - run: npm install -g @lhci/cli
      - run: lhci autorun
```

### B. Scheduled accessibility scan with alert-fatigue guard

Run monthly; skip the scan when open `accessibility` issues already exist so
developers are not flooded with duplicate noise.

```yaml
# .github/workflows/accessibility-scan.yml
name: Accessibility Scan (Scheduled)

on:
  schedule:
    - cron: "0 0 1 * *"   # first day of every month
  workflow_dispatch:

permissions:
  contents: write
  issues: write
  pull-requests: write

jobs:
  accessibility-scanner:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check for existing open accessibility issues
        id: check_issues
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN || secrets.GITHUB_TOKEN }}
        run: |
          COUNT=$(gh issue list --label "accessibility" --state open --json number --jq '. | length')
          echo "count=$COUNT" >> $GITHUB_OUTPUT

      - name: Run GitHub Accessibility Scanner
        if: steps.check_issues.outputs.count == '0'
        uses: github/accessibility-scanner@v3
        with:
          urls: ${{ vars.ACCESSIBILITY_SCAN_URL || format('https://{0}.github.io/{1}/', github.repository_owner, github.event.repository.name) }}
          repository: ${{ github.repository }}
          token: ${{ secrets.GH_TOKEN || secrets.GITHUB_TOKEN }}
          cache_key: accessibility-scan-results
```

> Set the `ACCESSIBILITY_SCAN_URL` repository variable to override the default
> GitHub Pages URL. Multiple URLs can be provided as a newline-separated list.

### C. Full deep-crawl for AI-ready audit (manual trigger)

```yaml
name: Deep Site Audit
on: workflow_dispatch

jobs:
  crawl:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test --reporter=json > audit-report.json
      - uses: actions/upload-artifact@v4
        with:
          name: a11y-json-report
          path: audit-report.json
```

---

## Serious: Accessibility Tree Testing

Automated WCAG rule checks verify markup compliance; they cannot verify what a
screen reader **actually announces**. Add accessibility tree tests for complex
components: SVG diagrams, custom widgets, live regions, navigation landmarks.

### Playwright aria snapshots (Playwright ≥ v1.46)

Assert the exact accessible name, role, and structure that assistive technologies
consume — distinct from axe-core rule checks.

```typescript
// tests/a11y-tree.spec.ts
import { test, expect } from '@playwright/test';

test('main navigation is correctly announced', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('nav[aria-label="Main navigation"]'))
    .toMatchAriaSnapshot(`
      - navigation "Main navigation":
          - list:
              - listitem:
                  - link "Home"
              - listitem:
                  - link "About"
    `);
});

test('SVG diagram is exposed as a labelled image', async ({ page }) => {
  await page.goto('/diagrams');
  await expect(page.locator('svg[role="img"]').first())
    .toMatchAriaSnapshot(`
      - img "User Authentication Flowchart":
    `);
});
```

Generate baseline snapshots once with `--update-snapshots`; treat subsequent
diffs the same as visual regression diffs.

### Semantic role queries (any Playwright version)

```typescript
test('form controls have meaningful accessible names', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
  await expect(page.getByRole('button',  { name: 'Send message'  })).toBeEnabled();
});
```

`getByRole()` fails immediately when accessible names are missing or wrong —
earlier feedback than a manual screen reader audit.

### Guidepup virtual screen reader (unit-level)

For asserting exact spoken output without a real screen reader installed:

```typescript
import { virtual } from '@guidepup/virtual-screen-reader';

it('announces the dialog title and action buttons', async () => {
  document.body.innerHTML = `
    <dialog open aria-labelledby="dlg-title">
      <h2 id="dlg-title">Confirm deletion</h2>
      <button>Delete</button>
      <button>Cancel</button>
    </dialog>
  `;
  await virtual.start({ container: document.body });
  const spoken = await virtual.spokenPhraseLog();
  expect(spoken).toContain('Confirm deletion');
  expect(spoken).toContain('Delete, button');
  await virtual.stop();
});
```

GitHub Actions setup for Guidepup:
```yaml
- uses: guidepup/setup-action@v2
- run: npx jest tests/sr.test.ts
```

---

## Moderate: Local-First Developer Workflow

Run audits locally before pushing — fastest feedback loop, keeps CI noise low.

**`package.json` scripts:**
```json
{
  "scripts": {
    "test:a11y":       "lhci autorun && npx playwright test",
    "test:a11y:local": "lhci collect --url=http://localhost:3000 && lhci assert"
  }
}
```

**Install once:**
```bash
npm install -g @lhci/cli
npm install -D @playwright/test @axe-core/playwright
```

---

## Moderate: Shift-Left Accessibility Strategy

Prevent issues from entering commits in the first place. Catch problems in order
from fastest to slowest feedback:

1. **In-editor / local lint** — framework-specific a11y lint rules run as you type.
2. **Pre-commit gate** — run checks on changed files only; block commit when checks
   fail. Use `pre-commit` (Python) or `husky` + `lint-staged` (Node). Keep total
   runtime ≤ 30–60 seconds.
3. **PR gate** — re-run in CI for trust and consistency; fail PR on blocking
   regressions; publish artifact links.
4. **Scheduled depth scans** — nightly/weekly deeper scans; auto-label findings;
   trend metrics over time in `ACCESSIBILITY.md`.

**Suggested Definition of Done addition:**
> No UI-impacting commit is accepted unless local/pre-commit accessibility checks
> pass and PR CI accessibility checks are green.

**Policy model:**
* **Fast fail locally** — contributors get immediate feedback before push.
* **Strict PR enforcement** — no merge with blocking accessibility failures.
* **Transparent metrics** — show pass rate, open defects, and remediation trend in `ACCESSIBILITY.md`.
* **Waiver discipline** — only time-bound waivers with explicit owner and expiry.

---

## Moderate: AI-Assisted Remediation Loop

Close the detect → fix gap using GitHub's accessibility scanner and the Copilot
coding agent:

1. The scheduled scan (workflow B above) uses `github/accessibility-scanner@v3`
   and creates issues labelled `accessibility`.
2. A companion remediation workflow watches for that label event and passes the
   issue to a Copilot coding agent.
3. The agent locates the offending code, applies a minimal fix, and opens a
   **draft pull request** linked to the original issue.
4. A human reviews and merges the draft PR.

Copy [`examples/AGENT_REMEDIATION_WORKFLOW.yml`](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/AGENT_REMEDIATION_WORKFLOW.yml)
to `.github/workflows/accessibility-remediation.yml` to enable this loop.

Covered violation types: `image-alt`, `label`, `link-name`, `heading-order`,
`color-contrast`, `aria-required-attr`.

> Requires a GitHub Copilot subscription with the coding agent feature enabled
> and **Settings → Copilot → "Allow Copilot to create and approve pull requests"**
> turned on.

---

## Tool Comparison

| Approach | Finds WCAG rule violations | Finds announcement quality issues | Works for SVG / canvas | CI-friendly |
|:---|:---:|:---:|:---:|:---:|
| axe-core | ✅ | ❌ | Limited | ✅ |
| Lighthouse | ✅ | ❌ | ❌ | ✅ |
| Playwright aria snapshots | Partial | ✅ | ✅ | ✅ |
| Guidepup virtual screen reader | ❌ | ✅ | ✅ | ✅ |
| Manual screen reader testing | Partial | ✅ | ✅ | ❌ |

No single tool catches everything — use the approaches together.

---

## Governance and SLAs

* **Critical failures:** any page below 100 % Lighthouse Accessibility blocks the build.
* **Performance budget:** any page below 100 % Lighthouse Performance blocks the build.
* **Triage:** scheduled scan findings must be converted to GitHub Issues.
  If an issue remains open, subsequent scheduled scans are paused (alert-fatigue guard).
* **SLA:** triage critical failures within one business day; serious within one sprint.

---

## Definition of Done Checklist

* [ ] Lighthouse CI workflow runs on every PR and push to `main`
* [ ] axe-core (via Playwright) runs on every PR covering WCAG 2.x AA tags
* [ ] Both light and dark colour schemes tested
* [ ] Mobile emulation enabled in Playwright tests
* [ ] `.lighthouserc` score threshold set to `warn ≥ 0.9` or `error ≥ 1.0`
* [ ] Scheduled scan workflow present with alert-fatigue guard
* [ ] Scan failures auto-labelled `accessibility` and converted to issues
* [ ] Accessibility tree tests in place for SVG, custom widgets, and live regions
* [ ] Local `test:a11y` script documented in contributing guide
* [ ] `audit-report.json` artifact uploaded on manual deep-crawl run
* [ ] Pre-commit / lint-staged accessibility check present and runs on changed files
* [ ] Shift-left metrics (pass rate, open defects) tracked in `ACCESSIBILITY.md` table

---

## Key WCAG Criteria (automation coverage)

* 1.1.1 Non-text Content (A) — caught by axe-core / Lighthouse
* 1.3.1 Info and Relationships (A) — caught by axe-core
* 1.4.3 Contrast Minimum (AA) — caught by Lighthouse / axe-core
* 4.1.2 Name, Role, Value (A) — caught by axe-core + aria snapshots
* 4.1.3 Status Messages (AA) — partially caught by axe-core

> Automation covers ~30–40 % of WCAG issues. Pair with manual and assistive
> technology testing to achieve full conformance.

---

## Alternative Tools

* **[AccessLint](https://github.com/accesslint):** GitHub App for inline PR comments — useful backup for code-review-time catches.
* **[Open-Scans](https://github.com/mgifford/open-scans):** External scans using multiple engines against a live URL.
* **[Lighthouse CI server](https://github.com/GoogleChrome/lighthouse-ci):** Historical tracking and dashboards.
* **[CivicActions: Scaling Automation](https://accessibility.civicactions.com/posts/how-we-scale-inclusive-website-content-with-automated-testing-and-open-source-tools):** Enterprise-scale a11y philosophy.

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/CI_CD_ACCESSIBILITY_BEST_PRACTICES.md)
* [Shift-left automation guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/SHIFT_LEFT_ACCESSIBILITY_AUTOMATION.md)
* [GitHub Accessibility Scanner integration](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/GITHUB_ACCESSIBILITY_SCANNER_INTEGRATION.md)
* [Lighthouse CI documentation](https://github.com/GoogleChrome/lighthouse-ci)
* [axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)
* [Playwright aria snapshots](https://playwright.dev/docs/aria-snapshots)
* [Guidepup virtual screen reader](https://www.guidepup.dev)
* [github/accessibility-scanner action](https://github.com/marketplace/actions/accessibility-scanner)
* [WebDriver BiDi accessibility tree spec](https://github.com/w3c/webdriver-bidi/issues/443)
