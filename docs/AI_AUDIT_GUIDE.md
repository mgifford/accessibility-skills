# AI-Assisted Accessibility Audits: Skills vs Scanners

This guide helps teams decide when to use:

- AI skills (like the skills in this repository)
- Automated scanners (axe, Lighthouse, WAVE API, Pa11y, Siteimprove, etc.)
- Both together (recommended for most real audits)

The short version: automated tools find many code-level issues quickly, while AI helps interpret, prioritize, and extend findings into actionable remediation and manual testing plans.

## What Each Approach Is Good At

## Automated Scanners Are Best For

- Fast, repeatable checks across many pages.
- Catching detectable rule-based issues (missing labels, invalid ARIA, some contrast failures, landmark gaps).
- CI/CD quality gates and regression detection.
- Baseline metrics and trend tracking over time.

## AI Skills Are Best For

- Translating findings into plain-language fixes for designers, developers, QA, and content teams.
- Mapping issues to repository rules and WCAG success criteria with context.
- Spotting likely behavior risks from structure and semantics (focus flow risk, naming quality, heading logic, state announcements).
- Building prioritized remediation plans by severity, effort, and user impact.
- Generating audit narratives for reports, tickets, and stakeholder communication.

## How Bundled Skills Help With Specific Problems

Skills in this repository act like focused guidance modules. They help AI avoid
generic advice and produce issue-specific, implementation-ready guidance.

Use this problem-to-skill map during audits:

- Form field labels, validation, and error handling issues: `skills/forms/SKILL.md`
- Keyboard traps, missing focus visibility, or broken tab order: `skills/keyboard/SKILL.md`
- Landmark/heading/nav confusion for screen reader users: `skills/navigation/SKILL.md`
- Low contrast and unreadable UI states: `skills/color-contrast/SKILL.md`
- Missing alt text and image meaning gaps: `skills/image-alt-text/SKILL.md`
- Data table header associations and table semantics: `skills/tables/SKILL.md`
- SVG semantics and accessible naming: `skills/svg/SKILL.md`
- Touch target size and pointer interaction gaps: `skills/touch-pointer/SKILL.md`
- Ambiguous wording and hard-to-understand UX copy: `skills/plain-language/SKILL.md` and `skills/content-design/SKILL.md`
- End-to-end manual verification requirements: `skills/manual-testing/SKILL.md`

Start most audits with `skills/ACCESSIBILITY-general/SKILL.md`, then layer in
topic skills based on what the scan and manual checks reveal.

## CI/CD Scanning Is a Core Example

If someone asks how to do ongoing scans, use `skills/ci-cd/SKILL.md`.

That skill helps AI define:

- where to run scans in pull request and deployment workflows
- what should fail the build versus warn only
- how to publish structured results for developer triage
- how to prevent regressions with repeatable automated checks

Practical approach:

1. Start with an on-demand page scan for baseline findings.
2. Add CI scanning for changed templates/pages.
3. Use AI plus topic skills to convert CI findings into prioritized fixes.
4. Require manual-testing checks before release sign-off.

## Neither Scanner Nor AI Alone Is Enough

- Scanners miss many usability and behavior issues.
- AI can reason about issues, but can hallucinate or overstate certainty without evidence.
- Manual testing with keyboard and screen reader remains essential before sign-off.

Use `skills/manual-testing/SKILL.md` as the final validation layer.

## Decision Framework: What Should I Run?

Use this quick rule:

1. Need broad coverage quickly across many URLs? Start with scanners.
2. Need interpretation, prioritization, or team-ready remediation guidance? Add AI skills.
3. Need release confidence? Add manual keyboard and screen-reader verification.

## Recommended Audit Workflow (Practical)

1. Run automated scan(s).
2. Export JSON (or structured results).
3. Ask AI to analyze with relevant skills from this repo.
4. Ask AI to identify likely false positives and unclear items needing manual checks.
5. Convert findings into remediation tickets with severity and acceptance criteria.
6. Re-test after fixes with scanner + manual checks.

## Example Prompt Pattern for AI Analysis

Use a prompt like:

"Analyze this accessibility scan output using skills/ACCESSIBILITY-general/SKILL.md plus skills/forms/SKILL.md and skills/keyboard/SKILL.md. Group by severity, map to WCAG 2.2 SC where applicable, identify false-positive candidates, and provide fix recommendations and QA verification steps."

## When To Use the `cli-audit` Skill

Use `skills/cli-audit/SKILL.md` when you want Claude CLI to audit a live URL directly and return combined machine + structural evidence.

Typical command path in that skill:

`npx --yes --package=github:mgifford/accessibility-skills cli-audit-inspect <URL>`

What this gives you:

- `axe` violations and incomplete checks
- browser accessibility tree snapshot
- combined JSON for AI interpretation against this repository's WCAG-aligned rules

## Be Polite: Auditing Live Sites Responsibly

Bot abuse is a real problem. Many sites use Cloudflare or similar controls that
may block repeated automated requests. Treat accessibility auditing like a
respectful diagnostic activity, not crawling.

Do this:

- Get permission before scanning production systems you do not own.
- Start with a small URL set, then expand only when needed.
- Keep request volume low and avoid parallel hammering.
- Prefer off-peak testing windows for heavier scans.
- Identify your purpose clearly if a site owner asks (accessibility QA).
- If blocked, stop and coordinate allowlisting or test in staging.

Do not do this:

- Fire high-concurrency scans at full sites without consent.
- Retry aggressively when Cloudflare or WAF responses appear.
- Treat bot protections as obstacles to bypass.

If Cloudflare blocks your checks, document the blockage as an audit constraint
and proceed with owner-approved paths (staging URL, allowlisted IP, or manual
spot checks).

## Common Mistakes To Avoid

- Treating scanner pass/fail as a complete accessibility verdict.
- Asking AI for conclusions without attaching scan evidence.
- Reporting issues without severity, impacted users, or reproduction notes.
- Skipping manual tests for focus behavior, keyboard traps, and screen-reader announcements.

## Deliverables You Should Expect From AI

Ask AI to return:

1. Findings grouped by severity and impacted user group.
2. WCAG mapping (with confidence level if uncertain).
3. Concrete fix guidance per finding.
4. Manual verification steps per fix.
5. A short "residual risk" section documenting what is still unverified.

## Bottom Line

Use scanners for detection at scale.
Use AI skills for interpretation, prioritization, and remediation planning.
Use manual testing for final confidence.

That combination is the current best-practice path for real-world website audits.
