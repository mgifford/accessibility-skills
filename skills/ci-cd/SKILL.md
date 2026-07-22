---
name: ci-cd
description: >
  Load this skill when configuring or reviewing CI/CD pipelines, GitHub Actions
  workflows, or automated testing setups. Ensures accessibility regressions are
  caught before code reaches production by enforcing quality gates, structured
  reporting, and layered automated + manual testing across all pages and user
  preferences.
---

# CI/CD Accessibility Skill

> **Canonical source**: `examples/CI_CD_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.
> The canonical guide states synchronization with this skill is **not automatic**
> — re-check this file against canonical periodically.

Apply these rules when adding, reviewing, or maintaining CI/CD accessibility checks.

---

## Core Mandate

CI can prevent known accessibility regressions, preserve tested semantics, and
produce evidence for human review. **It cannot establish WCAG conformance by
itself.** Automated rules, scores, snapshots, and AI output are inputs to an
accessibility evaluation, not substitutes for one. This guide targets WCAG 2.2
AA for in-scope content — that target is not itself a conformance claim.

Principles: test complete user tasks and relevant states, not only page loads;
run fast deterministic checks locally and repeat in CI; block known
regressions using explicit reviewable rules; keep accessibility, performance,
security, and functional signals distinct; test the final rendered/sanitized/
optimized output; keep humans responsible for severity, alternatives,
exceptions, and release decisions; give workflows and agents the least
authority needed for their task.

---

## Severity Scale (this skill)

| Level | Meaning |
| --- | --- |
| **Critical** | A core or safety-critical task cannot be completed and no reasonable accessible alternative exists |
| **Serious** | A major task is blocked or requires an unsafe, unreliable, or highly burdensome workaround |
| **Moderate** | A task remains possible but creates substantial difficulty, confusion, delay, or loss of information |
| **Minor** | Impact is limited and the task remains understandable and operable |

**Tool labels (axe `critical`/`serious`/`moderate`/`minor`, Lighthouse scores)
are triage inputs, not project severity** — map them into this taxonomy only
after evaluating actual user impact on the affected task.

---

## A Layered Testing Model

No single tool covers accessibility requirements. Choose layers by the
affected task and the likelihood/consequence of a regression:

| Layer | Useful for | Does not establish |
| --- | --- | --- |
| Static analysis / lint | Fast feedback on detectable source patterns | Runtime behavior or final output |
| Unit/component tests | Stable component contracts (names, roles, states) | Whole-page reading and focus order |
| Browser rule scans (axe-core) | Detectable rules in rendered states | Complete WCAG coverage or usability |
| Semantic assertions (role queries, ARIA snapshots) | Accessibility-tree structure and changes | Exact screen-reader speech |
| Visual checks | Theme/layout regressions, focus indicators | Meaning, keyboard access, or text alternatives |
| End-to-end tests | Operability, focus, state changes, errors | AT interoperability by itself |
| Manual and AT testing | Quality, sequence, interaction, compatibility | Universal behavior across all configurations |

Use `skills/manual-testing/SKILL.md` for checks automation cannot complete.

---

## Critical: Define the CI Contract Before Choosing Tools

For each check, document: the user task/page/component/states covered; the
command and config file; tool/browser/runtime/rule-set versions; whether the
result warns, blocks, or only produces an artifact; the baseline/expected
result; the owner and response process for failures; known false positives
and untested requirements; and evidence retained for review.

Do not describe a check as a merge gate unless branch protection actually
requires it. Do not describe a warning as a failure.

**Scores are not conformance percentages.** A Lighthouse accessibility score
of 100 does not mean 100% WCAG conformance, and 90 does not mean a page is 90%
accessible — it measures the weighted audits Lighthouse ran in one
configuration. Use individual audit results to investigate regressions. A
score threshold can be an additional signal but should not be the only gate;
also fail on specific rules/tasks the team has decided are blocking. Keep
performance budgets separate — a performance score must not raise or lower
accessibility severity.

```json
{
  "ci": {
    "collect": { "staticDistDir": "./_site", "numberOfRuns": 1 },
    "assert": {
      "assertions": { "categories:accessibility": ["warn", { "minScore": 0.9 }] }
    },
    "upload": { "target": "filesystem", "outputDir": ".lighthouseci" }
  }
}
```

This warns; it does not block. Raising the threshold (or moving to `"error"`)
can be useful after investigation, but the threshold still does not establish
conformance.

---

## Critical: axe-core on Every PR, Across States and Preferences

Scan meaningful states after the page is ready AND after relevant interaction
— do not scan only the initial route if users must open a menu, submit a
form, or complete another action.

```typescript
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const colorSchemes = ['light', 'dark'] as const;

for (const colorScheme of colorSchemes) {
  test(`home page in ${colorScheme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/');
    await expect(page.getByRole('main')).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test('navigation is tested while expanded', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

A clean scan means no violations were found in the tested scope — it does not
mean no barriers exist. **Missing axe-core checks on PRs is Critical**;
missing a color-scheme pass is also a coverage gap since theme-specific
regressions often only appear in the untested scheme.

Cover applicable combinations without an unnecessarily expensive matrix:
desktop and narrow reflow viewports; system/light/dark theme; default and
increased contrast; forced colors; reduced motion; default/hover/focus/active/
disabled/loading/success/error states; signed-in/signed-out/timeout/
permission states. Use pairwise or risk-based coverage for routine changes;
test every combination for high-risk components (authentication, payment,
safety, core navigation).

---

## Serious: Semantic Assertions and ARIA Snapshots

Role and accessible-name queries provide useful contracts:

```typescript
test('contact form exposes its controls and error', async ({ page }) => {
  await page.goto('/contact');
  const email = page.getByRole('textbox', { name: 'Email address' });
  await expect(email).toBeVisible();
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByText('Enter an email address')).toBeVisible();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
});

test('main navigation retains its semantic structure', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Main' }))
    .toMatchAriaSnapshot(`
      - navigation "Main":
        - list:
          - listitem:
            - link "Home"
    `);
});
```

Review snapshot changes; do not update them mechanically. An ARIA snapshot
represents the accessibility tree, not a transcript of what every screen
reader will announce — speech output also depends on the AT product, browser,
OS, settings, mode, and user action.

**Guidepup virtual screen reader** (unit-level, exact spoken output):

```typescript
import { virtual } from '@guidepup/virtual-screen-reader';

it('announces the dialog title and action buttons', async () => {
  document.body.innerHTML = `
    <dialog open aria-labelledby="dlg-title">
      <h2 id="dlg-title">Confirm deletion</h2>
      <button>Delete</button>
    </dialog>`;
  await virtual.start({ container: document.body });
  const spoken = await virtual.spokenPhraseLog();
  expect(spoken).toContain('Confirm deletion');
  await virtual.stop();
});
```

---

## Serious: Visual and Preference Regression Tests

Visual tests can find clipped text, missing focus indicators, theme-specific
contrast changes, and reflow regressions. Keep separate reviewed baselines for
materially different themes and forced-colors behavior. Do not use screenshot
equality as the only contrast test — anti-aliasing, transparency, gradients,
and rendering differences make pixel comparison unreliable; confirm computed
colors and visually inspect where contrast is critical. Emulate reduced
motion for deterministic tests, but never remove an animation from the
product merely to make a screenshot pass.

---

## Critical: CI Workflow Security

Apply these controls to accessibility workflows the same as build/deploy workflows:

* **Pin third-party actions to reviewed full commit SHAs, not tags** — tags can
  move; commit SHAs cannot
* **Declare minimum `GITHUB_TOKEN` permissions explicitly** at workflow or job level
* **Set `persist-credentials: false`** on checkout when later steps don't need Git access
* **Avoid `pull_request_target`** for workflows that execute untrusted PR code
* Pass untrusted values through environment variables or files and quote shell
  expansions — never interpolate them into executable script text
* Do not expose secrets to forked or untrusted code
* Restrict network access and tools for AI/transformation steps where practical
* Add timeouts, concurrency controls, and bounded crawl limits
* Treat uploaded HTML, JSON, screenshots, traces, and logs as potentially sensitive
* Keep artifact retention no longer than the review process requires
* Use environments and required reviewers for any workflow that can deploy or
  modify external systems
* Do not claim a workflow "has no access to secrets" or "cannot merge" unless
  its token permissions, event context, tools, and platform controls actually
  demonstrate that

```yaml
name: Accessibility checks

on:
  pull_request:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: accessibility-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  accessibility:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - name: Check out repository
        uses: actions/checkout@<reviewed-full-commit-sha>
        with:
          persist-credentials: false
      - name: Set up Node.js
        uses: actions/setup-node@<reviewed-full-commit-sha>
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npm run test:a11y:ci
      - name: Upload debugging evidence after failure
        if: failure()
        uses: actions/upload-artifact@<reviewed-full-commit-sha>
        with:
          name: accessibility-test-evidence-${{ github.run_id }}
          path: test-results
          retention-days: 7
```

Before enabling: confirm actions/inputs exist in current official docs;
resolve each action release to its full commit SHA; review transitive action
code and release notes; validate fork behavior so untrusted PRs get no
privileged secrets; verify the build path matches production; run the
workflow in a test branch first.

---

## Serious: Scheduled Scanning and the GitHub Accessibility Scanner

Scheduled scans find drift, dependency changes, and pages missed by PR tests.
**Continue scanning even when known issues remain** — pausing every scan
because one issue is open can hide new regressions; prefer deduplication,
stable fingerprints, and clear ownership over an alert-fatigue pause.

For each scheduled scan, define: authorized target URLs and crawl boundaries;
public vs. authenticated states; frequency/timeout/resource limits; issue
deduplication and closure behavior; retention and redaction of reports;
triage responsibility; and behavior when the scanner/target is unavailable.
Never place authentication secrets, session data, or sensitive content in
logs, issue bodies, artifacts, or AI prompts.

The **GitHub Accessibility Scanner** (`github/accessibility-scanner`) is a
public-preview action whose interfaces, permissions, and Copilot integration
may change — review its current README, `action.yml`, and security guidance
immediately before adoption. It requires a token and documents broader
permissions than a read-only scan; treat that credential as privileged, use a
dedicated fine-grained credential, and do not assume the default
`GITHUB_TOKEN` is sufficient. If also using a separate remediation workflow,
configure the scanner to skip Copilot assignment so two remediation systems
don't act on the same finding.

```yaml
# .github/workflows/accessibility-scan.yml
name: Accessibility Scan (Scheduled)
on:
  schedule:
    - cron: "0 0 1 * *"
  workflow_dispatch:
permissions:
  contents: write
  issues: write
  pull-requests: write
jobs:
  accessibility-scanner:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<reviewed-full-commit-sha>
        with: { persist-credentials: false }
      - name: Run GitHub Accessibility Scanner
        uses: github/accessibility-scanner@<reviewed-full-commit-sha>
        with:
          urls: ${{ vars.ACCESSIBILITY_SCAN_URL }}
          repository: ${{ github.repository }}
          token: ${{ secrets.GH_TOKEN }}
```

---

## Serious: AI-Assisted Remediation — Treat All Scan Input as Untrusted

An AI-generated patch is a **proposal, not evidence a barrier is fixed**.
Issues, comments, labels, repository content, HTML, SVG, URLs, and scan
output are all **untrusted input**.

Required review sequence:

1. A scanner or person records a reproducible finding
2. A human triages the affected task, impact, confidence, and scope
3. A maintainer **manually** triggers the remediation workflow with the issue number
4. Copilot reads the issue as untrusted file data in an isolated copy — without
   the repository's `.git` directory
5. The workflow uploads a patch, changed-file list, and report (does not commit/push/PR/merge itself)
6. A human reviews and applies an acceptable patch in a normal branch
7. Relevant automated, manual, and AT checks are rerun on the final implementation

A safe reference remediation workflow: is manual-only and requires explicit
confirmation; gives the workflow token **read-only** content and issue
permissions; keeps issue content out of shell commands, workflow expressions,
and static prompts; limits the agent to read/write tools in an isolated
working copy; **denies shell, URL, and memory tools**; blocks changes to
protected policy/workflow paths; does not commit, push, open a PR, close an
issue, or deploy; retains a review artifact for a limited period.

**Do not** trigger privileged AI remediation directly from an issue label, or
paste an issue body into a shell command, `GITHUB_OUTPUT`, workflow
expression, or static prompt — these are the classic script-injection paths
for untrusted GitHub content.

---

## Moderate: Local-First, Reproducible Setup

Install dependencies in the repository and commit the lockfile — avoid
requiring an unspecified latest global package.

```json
{
  "scripts": {
    "test:a11y": "playwright test tests/accessibility",
    "test:a11y:update": "playwright test tests/accessibility --update-snapshots",
    "test:a11y:ci": "playwright test tests/accessibility --reporter=line,json"
  }
}
```

```bash
npm install --save-dev @playwright/test @axe-core/playwright
npx playwright install --with-deps chromium
npm run test:a11y
```

Use `npm ci` in CI so the resolved dependency graph matches the reviewed lockfile.

---

## Moderate: Shift-Left Strategy

Catch problems in order from fastest to slowest feedback: (1) in-editor/local
lint with framework-specific a11y rules, (2) pre-commit gate on changed files
only (`husky`+`lint-staged` or `pre-commit`; keep total runtime ≤30–60s), (3)
PR gate re-running in CI, failing on blocking regressions, publishing artifact
links, (4) scheduled deeper scans with auto-labeled findings and trend
metrics. No UI-impacting commit should be accepted unless local/pre-commit
checks pass and PR CI checks are green.

---

## Baselines, Suppressions, and Exceptions

Prefer preventing new regressions while existing findings are assigned and
remediated. A baseline is a temporary inventory, not proof existing barriers
are acceptable. Every suppression/exception should include: the exact rule/
file/element/route/task affected; reason and supporting evidence; user impact
and available workaround; an accountable owner and linked issue; an expiry or
review date; and the narrowest practical scope. Do not suppress an entire
rule when one reviewed instance is the exception. Do not update snapshots or
baselines solely to make CI green.

---

## Sustainable Automation

Run fast targeted checks on every PR; reserve full crawls and large browser
matrices for schedules, releases, or high-risk changes. Cache reviewed
dependencies where it improves speed without hiding updates. Cancel obsolete
runs when it can't discard required evidence. Retain artifacts only as long
as necessary. Avoid duplicate scanners providing the same evidence. Use
deterministic tooling before AI when it can answer the question.

---

## Definition of Done Checklist

* [ ] Affected user tasks, pages, components, and states are defined for each check
* [ ] Dependencies, browsers, actions, and configuration are versioned and reviewable
* [ ] Final rendered output is tested (not source templates alone)
* [ ] Applicable themes, preferences, viewports, and interaction states are covered
* [ ] Automated results are interpreted within their documented limitations
      (score ≠ conformance; tool severity ≠ project severity)
* [ ] Required manual and AT tests are completed or precisely handed off
* [ ] New Critical and Serious barriers are not knowingly introduced
* [ ] Findings include reproducible evidence and an owner
* [ ] Suppressions and exceptions are narrow, justified, tracked, and dated
* [ ] Workflow permissions, untrusted input handling, secrets, and artifacts are reviewed
* [ ] Action references use reviewed full commit SHAs, not tags
* [ ] `persist-credentials: false` set where later steps don't need Git access
* [ ] `pull_request_target` avoided for workflows executing untrusted PR code
* [ ] AI remediation workflow is manual-trigger-only, read-only token scope,
      denies shell/URL/memory tools, and never commits/pushes/merges itself
* [ ] The final workflow is validated in a test branch before production use
* [ ] Documentation and this skill are kept in sync (not automatic)

---

## Key WCAG Criteria (automation coverage)

* 1.1.1 Non-text Content (A) — caught by axe-core / Lighthouse
* 1.3.1 Info and Relationships (A) — caught by axe-core
* 1.4.3 Contrast Minimum (AA) — caught by Lighthouse / axe-core (visual inspection still needed)
* 4.1.2 Name, Role, Value (A) — caught by axe-core + aria snapshots
* 4.1.3 Status Messages (AA) — partially caught by axe-core

> Automation covers roughly 30–40% of WCAG issues at best. Pair with manual
> and assistive technology testing — see `skills/manual-testing/SKILL.md`.

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/CI_CD_ACCESSIBILITY_BEST_PRACTICES.md)
* [Shift-left automation guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/SHIFT_LEFT_ACCESSIBILITY_AUTOMATION.md)
* [GitHub Accessibility Scanner integration](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/GITHUB_ACCESSIBILITY_SCANNER_INTEGRATION.md)
* [GitHub Actions Secure Use Reference](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)
* [GitHub: Script Injections](https://docs.github.com/en/actions/concepts/security/script-injections)
* [Lighthouse CI documentation](https://github.com/GoogleChrome/lighthouse-ci)
* [axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)
* [Playwright aria snapshots](https://playwright.dev/docs/aria-snapshots)
* [Guidepup virtual screen reader](https://www.guidepup.dev)
* [GitHub Accessibility Scanner](https://github.com/github/accessibility-scanner)

> **Standards horizon:** These rules target WCAG 2.2 AA.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
