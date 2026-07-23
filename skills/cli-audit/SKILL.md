---
name: cli-audit
description: Audit live URLs using Playwright and Axe combined with WCAG skills
---

# CLI Audit Skill

Use this skill when asked to audit a live URL from Claude CLI.

Respect robots directives and site terms of service for every live-site audit request.

## Required Execution

When the user asks to audit a page URL, run:

```bash
npx --yes --package=github:mgifford/accessibility-skills cli-audit-inspect <URL>
```

This invocation is portable for Claude CLI users because it pulls the
inspection command from this repository package instead of requiring a local
`scripts/` file in the target project.

## Be Polite With Live Sites

When auditing live URLs, keep behavior respectful and low impact:

- Prefer single-page or small-batch checks first.
- Avoid rapid repeated scans against production pages.
- If Cloudflare/WAF blocks requests, do not brute-force retries.
- Recommend owner-approved alternatives: staging URLs, allowlisting, or manual checks.

## Required Parsing

Parse the emitted JSON and evaluate:

1. `axe.violations` for automated WCAG and best-practice failures.
2. `axe.incomplete` for potential violations that need manual confirmation.
3. `accessibilityTree` for behavioral issues that automated rules miss, including:
   - Missing or unclear names for interactive elements
   - Unexpected roles or role mismatches
   - Landmark and heading structure problems
   - State communication gaps (`expanded`, `checked`, `selected`, disabled state)
   - Dialog and menu semantics that can indicate focus-management risk

## Required Evaluation Method

Map findings to this repository's guidance before reporting:

- Start with `skills/ACCESSIBILITY-general/SKILL.md`.
- Then apply relevant topic skills based on observed problems (for example:
  `forms`, `keyboard`, `navigation`, `color-contrast`, `aria-live-regions`,
  `image-alt-text`, `tables`, `svg`, `touch-pointer`, `tooltips`).

## Reporting Requirements

For each issue reported:

1. Identify source: `axe` or `accessibilityTree`.
2. Include affected selector/path from axe nodes when available.
3. Provide impact summary and severity using the relevant skill scale.
4. Cite WCAG 2.2 success criteria when determinable.
5. Provide a concrete remediation recommendation tied to a skill rule.

If no issues are found, report residual risk clearly:

- Automated scans can miss interaction, timing, focus-flow, and assistive-tech
  behavior issues.
- Recommend manual keyboard and screen-reader validation using
  `skills/manual-testing/SKILL.md`.