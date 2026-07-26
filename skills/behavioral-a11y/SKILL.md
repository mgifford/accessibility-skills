---
name: behavioral-a11y
description: >
  Load this skill when writing, reviewing, or interpreting behavioral
  accessibility automation — tests that manipulate a rendered page (resizing
  the viewport, pressing real keys, capturing and comparing screenshots)
  rather than only inspecting static markup or a single computed
  accessibility tree. Covers Reflow risk (SC 1.4.10) and Focus Visible risk
  (SC 2.4.7) checks. Absolutely always report indicator results separately
  from confirmed failures. Under no circumstances treat a clean behavioral
  scan as WCAG conformance, or collapse `cantTell`/test-error/indicator
  outcomes into a single pass/fail signal.
---

# Behavioral Accessibility Automation Skill

> **Canonical source**: `examples/BEHAVIORAL_ACCESSIBILITY_AUTOMATION.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when writing, running, or interpreting automated checks that
manipulate a rendered page rather than only inspecting static markup or a
single computed accessibility tree.

---

## Severity Scale (this skill)

| Level | Meaning |
| --- | --- |
| **Critical** | A behavioral result is reported or gated as a confirmed failure without meeting the preconditions in this skill |
| **Serious** | Indicator, `cantTell`, and confirmed-failure outcomes are collapsed into one pass/fail signal |
| **Moderate** | Fleet-scale findings are not clustered by root cause before reporting or triage |
| **Minor** | Missing documentation of a check's known false-positive/false-negative limitations |

---

## Critical: Why Behavioral Checks Exist

Static analysis and single-snapshot browser rule scans (axe-core and similar)
answer "is this attribute valid" or "does this element have an accessible
name." They cannot answer questions that only exist while a page is being
*used*: does layout still work at a narrow viewport, does a keyboard user get
a visible focus signal, does content clip when resized or spaced out, does a
dynamic UI state (open menu, validation error, loading indicator) preserve
the same guarantees as the initial page state.

A behavioral check answers these by actually doing what a user would do —
resizing, tabbing, hovering, waiting — and observing the result. That makes
behavioral checks more expensive and more prone to environmental flakiness
(animation, fonts, timing) than static checks, and it does **not** make them
a conformance test.

---

## Critical: Result Vocabulary

Every behavioral check must use one of these result categories. Using them
consistently is what keeps an automated result honest about what it actually
established.

| Category | Meaning |
| --- | --- |
| **Indicator** | Observed a signal correlated with a possible barrier, but did not rule out a legitimate explanation (an SC exception, intentional design, a false-positive-prone edge case). Route to human review. |
| **Confirmed failure** (for that tested instance) | Established every precondition needed to rule out common false-negative causes for *that instance*. Still not a full SC conformance claim. |
| **`cantTell`** | Could not reach a reliable verdict — page did not stabilize, screenshot coverage could not be established, focus resolution hit an unsupported case. Distinct from both pass and failure. |
| **Test error** | The check itself failed to run (navigation failure, unexpected exception) — distinct from `cantTell`, which means the page's behavior was ambiguous, not that the check failed to execute. |
| **Manual review required** | Categories automation does not attempt to resolve: whether an SC 1.4.10 exception legitimately applies, whether an indicator has sufficient contrast (SC 1.4.11) or size (SC 2.4.13), whether a focus order is logical. |

**A clean result is not a conformance claim.** A `no-overflow-detected`
Reflow result means only that this check, at this viewport, on this page
load, found no page-level horizontal overflow — nothing about content cut
off, overlapped, or an SC 1.4.10 exception applied elsewhere. A
`confirmed-no-visible-change` Focus Visible result means only that no pixel
difference above the configured threshold was detected within the padded
comparison region around that component, on that page load, after focus
demonstrably moved to it — not an unconditional claim that no visible focus
indicator exists.

---

## Critical: False Positives at Site and Fleet Scale

A false-positive probability that looks negligible for one target can
produce frequent false alarms once the same check runs across many targets.
Illustration: at a 0.5% false-positive probability per target with
independent results, the chance of at least one false alarm across 200
targets is 1 − (1 − 0.005)²⁰⁰ ≈ 63%. This is an illustration of how
per-target probabilities compound under an independence assumption — not a
measured result, and rarely a valid assumption for real websites.

**Correlation, not independence, is the normal case.** Website findings are
frequently correlated because pages share components, templates,
stylesheets, and application shells. A single missing focus style in a
shared button component can trigger the same finding on every page that
uses it. **Root-cause clustering is necessary**: report a defect traced to
one shared component as one systemic finding with N affected instances, not
N unrelated defects.

**False positives are not the same as flakiness.** A false positive is an
incorrect finding from a test that completed and produced a result.
Flakiness means repeated runs against the same target produce inconsistent
results — usually from timing, animation, or environment sensitivity. A
false positive calls for narrowing what the check claims; flakiness calls
for improving test stability (layout/visual-stability waits).

**Precision must be measured, not assumed.** Do not infer a precision figure
from a nominal false-positive probability alone — that number is useful for
reasoning about scale, not a claim about actual checks until measured
against reviewed results.

**Consequences:**
- Indicator-level results should produce reviewable evidence, not
  automatically block a build.
- Blocking should normally be reserved for deterministic confirmed
  failures, reproducible regressions against a reviewed baseline, and
  recurrence of a previously confirmed defect.
- `cantTell`, test errors, risk indicators, and reviewed exceptions remain
  distinct from a confirmed failure — collapsing any of them into "failure"
  for convenience defeats the purpose of the vocabulary above.
- None of these results, individually or in aggregate, establishes WCAG
  conformance.

See `skills/ci-cd/SKILL.md` for the resulting CI gating policy.

---

## Serious: Reflow Risk (SC 1.4.10) in Detail

**What it does:** sets a 320×720 CSS-pixel viewport, waits for layout to
stabilize (`load`, `document.fonts.ready`, a quiet period with no change in
`scrollWidth`/`scrollHeight`), attempts a horizontal scroll and reads the
resulting scroll movement (comparing magnitude, not sign, so it works for
right-to-left documents), measures `clientWidth`/`scrollWidth`, and
best-effort identifies elements overflowing the viewport.

**What it returns:** a `verdict` of `no-overflow-detected`,
`potential-reflow-barrier`, `cant-tell`, or `test-error`, plus dimensions,
scroll data, and candidate overflowing elements.

**What it cannot detect:**
- **Clipped content with no scrollbar** — `overflow: hidden` content that is
  silently truncated produces no scrollable overflow, so
  `scrollWidth`/`clientWidth` never diverge. This is a documented
  false-negative risk, not a solved case.
- **Whether an SC 1.4.10 exception applies** — the check cannot know whether
  an overflowing element is a data table, map, diagram, or other component
  that requires two-dimensional layout for its meaning.
- **Delayed layout changes shorter than the configured quiet period.**

**The SC 1.4.10 exception, precisely:** it exempts **parts of content that
require two-dimensional layout for their usage or meaning** — not the page
as a whole. Normative examples: data tables, maps, diagrams, video players,
games, presentations, interfaces requiring a persistently visible toolbar.
Consequences a reviewer must check that automation cannot:
- An excepted component does not exempt the rest of the page — headings,
  intro paragraphs, filters, search, and pagination around it must still
  reflow normally.
- Within an excepted component, individual sections may still need to
  reflow — a table's overall grid may need two dimensions, but a single
  cell's text content does not automatically inherit that exception.
- "Requires" is a meaning test, not a convenience test. A component that
  merely looks better in a wide fixed layout, without losing information or
  functionality if it reflowed, is not exempt.

Automated overflow detection can flag a candidate. Only a human reviewer
applying this test can confirm an exception.

---

## Serious: Focus Visible Risk (SC 2.4.7) in Detail

**What it does, per Tab stop:** records the active element before Tab;
sends a real `Tab` key press (not a programmatic `.focus()` call, which
would not exercise the same code paths); confirms focus moved and stayed in
the document; resolves the deepest active element through open shadow
roots; confirms the element is in the viewport; captures a screenshot of a
padded region around the element's bounding box; blurs and captures an
unfocused reference of the same region; restores focus; compares the two
region screenshots; repeats up to a configurable max stop count.

**Why region-scoped, not whole-page, comparison:** a whole-page pixel check
cannot distinguish a focus indicator from an unrelated animation elsewhere
on the page, and cannot distinguish "this element's indicator disappeared"
from "the previous element's indicator disappeared while this one has
none." Region-scoped comparison, combined with tracking whole-page visual
stability separately before testing begins, avoids both failure modes.

**What it cannot detect:**
- **Sufficient contrast, size, or usability of an indicator** — a
  `visible-change-detected` verdict means pixels changed, not that they
  changed enough (needs contrast-tool or manual review).
- **Obscuration by other content** — sticky headers, cookie banners, or
  other fixed-position content can sit on top of a real indicator; pixel
  comparison alone cannot detect overlap. Treat any current "pass" as
  silent on obscuration (SC 2.4.11) until a geometry-comparison module
  exists.
- **Cross-origin iframes**, and same-origin iframes beyond a
  `cant-tell-no-coverage` acknowledgement.
- **Indicators rendered well outside the padded comparison region** — a
  real but bounded tradeoff of region-scoped comparison; widen the padding
  for components known to use offset indicators.
- **Focus changes not driven by Tab** (mouse- or script-triggered focus
  outside the sequential Tab order).

**What a `confirmed-no-visible-change` result actually establishes:** no
pixel difference above the configured threshold was detected within the
padded region around that component, on that page load, and all of the
following held: focus demonstrably moved to it, it was applicable/rendered/
in-viewport, and the page was visually stable throughout. This is
deliberately narrower than "no visible focus indicator exists" — a real
indicator can still escape detection (outside the padded region, below the
pixel-diff threshold, or obscured). It is also not a statement about
contrast (SC 1.4.11), minimum size (SC 2.4.13), or obscuration (SC 2.4.11).

**Focus order evidence:** the same Tab traversal that drives this check can
*record* the sequence of elements visited, but cannot judge whether that
order is logical for the page's content and task. Treat a recorded stop
sequence as evidence for a human reviewer, not a verdict.

---

## Moderate: Documented Gaps (Not Yet Automated)

These checks are documented as natural extensions of the Reflow/Focus
Visible measurement approach but are not yet implemented as reusable
modules. Do not claim automated coverage for them without saying so:

- **Focus obscuration** (SC 2.4.11) — comparing the focused element's
  bounding rectangle against sticky/fixed-position ancestors or overlapping
  elements.
- **Text resizing and clipping** (SC 1.4.4 Resize Text) — same
  overflow/clipping signals as Reflow, but at 200% zoom rather than 320
  CSS pixels. Resize Text and Reflow are distinct checks; do not conflate
  them (see `skills/manual-testing/SKILL.md`).
- **Text spacing** (SC 1.4.12) — injecting the WCAG-specified user style
  override (line height 1.5×, paragraph spacing 2×, letter spacing 0.12em,
  word spacing 0.16em) and reusing overflow/clipping detection.
- **Content on hover or focus** (SC 1.4.13) — verifying dismissible,
  hoverable, and persistent behavior of hover/focus-triggered content.

---

## Moderate: Running These Checks at Fleet Scale

Use these terms consistently when reporting or triaging results at scale:

- **Unique finding** — one specific defect, described independently of how
  many pages or components it appears on.
- **Affected instance** — one occurrence of a unique finding: one
  component, on one page, in one state, on one test run.
- **Affected page** — a page containing at least one affected instance of
  at least one unique finding.
- **Probable root-cause cluster** — a group of affected instances that
  share enough context (same component, template, stylesheet rule,
  generated markup pattern) that a single fix is likely to resolve all of
  them together. "Probable" until a reviewer confirms the shared cause.

Raw page-level counts are not independent defects. "200 pages failed" is far
less actionable than "1 unique finding (missing focus indicator on the
shared header), 200 affected instances, 1 root-cause cluster."

**Suggested cadence:**

| Scope | When it runs | Purpose |
| --- | --- | --- |
| Component fixtures | Every pull request | Fast, deterministic regression coverage for known patterns |
| Changed pages and affected application states | Every pull request | Coverage matched to the actual diff |
| Representative templates | Every pull request | Catch shared-component regressions before they reach every page using the template |
| Full site or fleet inventory | Scheduled (nightly/weekly), not every PR | Coverage a PR-scoped run cannot afford; catches drift and pages outside the PR's diff |
| Manual review of representative findings per root-cause cluster | After each scan producing new indicators | Confirm or reject the cluster once, not once per affected instance |
| Periodic sampling of clean (no-finding) results | Scheduled, lower frequency | Estimate false-negative risk |

A check reporting no findings has not been shown to have zero false
negatives — periodically sample clean results and review manually or with a
different check.

---

## Definition of Done Checklist

* [ ] The check states its viewport, timing, and stabilization assumptions
* [ ] The result distinguishes indicator, confirmed-for-this-instance
      failure, `cantTell`, and test error
* [ ] The result includes machine-readable evidence (selector, rect, HTML
      excerpt) sufficient to locate the finding without re-running the check
* [ ] Documented limitations name specific false-positive and
      false-negative risks the check is known to have
* [ ] The check's own output states it does not establish WCAG conformance
* [ ] CI integration reports indicators separately from confirmed failures
      and does not silently convert every indicator into a blocking failure
* [ ] At fleet scale, findings are grouped into probable root-cause
      clusters and reported as unique findings with affected-instance
      counts, not one unrestricted item per affected page
* [ ] Blocking policy, if any, is limited to deterministic failures or
      reproducible regressions against a reviewed baseline — not
      first-seen indicators

---

## Key WCAG Criteria

* 1.4.4 Resize Text (AA) — not yet automated here; see Moderate gaps above
* 1.4.10 Reflow (AA) — Reflow risk indicator
* 1.4.12 Text Spacing (AA) — not yet automated here
* 1.4.13 Content on Hover or Focus (AA) — not yet automated here
* 2.4.7 Focus Visible (AA) — Focus Visible risk indicator
* 2.4.11 Focus Not Obscured Minimum (AA) — not yet automated here
* 2.4.13 Focus Appearance (AAA) — not covered by behavioral pixel comparison alone

---

## References

* [Full canonical guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/BEHAVIORAL_ACCESSIBILITY_AUTOMATION.md)
* [Reflow risk implementation](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/playwright/reflow-risk.mjs)
* [Focus Visible risk implementation](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/playwright/focus-visible-risk.mjs)
* [Playwright examples and tests](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/playwright/README.md)
* [CWAC (GOVTNZ)](https://github.com/GOVTNZ/cwac) — this repo's checks are independent reimplementations of CWAC's documented method; CWAC is GPLv3, the canonical repo is MIT, no CWAC code was copied or translated
* `skills/manual-testing/SKILL.md` — Reflow, zoom, and focus indicator manual testing
* `skills/ci-cd/SKILL.md` — risk-indicator/build-gate CI policy

> **Standards horizon:** These rules target WCAG 2.2 AA.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
