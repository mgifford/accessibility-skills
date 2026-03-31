---
name: bug-reporting
description: >
  Load this skill whenever you are filing, reviewing, or generating accessibility
  bug reports — whether from automated tool output, manual testing, or AI agent
  scans. The purpose of this skill is to make accessibility errors easier to
  report accurately, so that developers can reproduce, understand, and fix them
  without additional back-and-forth. Absolutely always include the required
  fields (URL, XPath, HTML snippet, WCAG SC, rule ID, severity, frequency) in
  every report. Under no circumstances file a vague report that omits the
  failing element, the WCAG criterion, or the steps to reproduce.
---

# Accessibility Bug Reporting Skill

> **Canonical source**: `examples/ACCESSIBILITY_BUG_REPORTING_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when filing, reviewing, or generating accessibility bug reports
from any source — automated tool output, manual testing, or AI agent scans.

---

## Core Mandate

**Reproducibility is the single most important quality of a bug report.**
If a developer cannot reproduce the problem, they cannot fix it.

Every report must give enough information for a developer who was not present
during testing to reproduce, understand, and fix the problem without additional
back-and-forth.

---

## Severity Scale (this skill)

| Level | Meaning | Action |
| --- | --- | --- |
| **Critical** | Users cannot complete a core task at all | Must fix before release |
| **High** | Significant barrier that degrades or blocks a key workflow | Fix urgently |
| **Medium** | Noticeable barrier with a workaround available | Fix in near-term backlog |
| **Low** | Minor issue with minimal real-world impact | Fix when convenient |

---

## Critical: Required Fields

Every accessibility bug report **must** include all eight of the following fields.
**Omitting any required field is Critical** — the report cannot be acted on.

### 1. Page URL

Provide the exact URL where the issue was found, including query string and
fragment identifier if relevant.

```
URL: https://example.com/checkout?step=2#payment-form
```

If the issue appears on multiple pages, list all affected URLs or describe the
URL pattern (e.g. "all `/product/*` pages").

### 2. XPath — Simplified

Provide the shortest XPath that uniquely identifies the failing element.
Prefer attribute-based selectors over absolute paths.

```
//button[@id="submit-payment"]
//input[@name="card-number"]
//div[@role="dialog"][@aria-labelledby="modal-title"]
```

### 3. XPath — Full DOM Path

Provide the complete ancestor chain for disambiguation or when the simplified
XPath could match multiple elements.

```
/html/body/main/section[@id="checkout"]/form[@id="payment-form"]/fieldset[2]/input[@name="card-number"]
```

Automated tools must emit **both** XPath forms. The full path supports debugging
in environments where IDs change dynamically (e.g. React, Angular).

### 4. HTML Snippet

Include the minimal HTML fragment that demonstrates the problem. Trim surrounding
markup to the smallest context that still shows the issue.

```html
<!-- Bad: no accessible name -->
<button>
  <img src="close.svg">
</button>

<!-- Good: accessible name provided -->
<button>
  <img src="close.svg" alt="Close dialog">
</button>
```

Include parent elements only when the violation depends on the parent–child
relationship (e.g. missing `<label>` for `<input>`).

### 5. WCAG Success Criterion

Cite the specific WCAG 2.1 or 2.2 Success Criterion violated, including its level.

```
WCAG SC: 1.1.1 Non-text Content (Level A)
WCAG SC: 4.1.2 Name, Role, Value (Level A)
WCAG SC: 1.4.3 Contrast (Minimum) (Level AA)
```

### 6. ACT Rule or Checker Rule

Reference the rule from the testing tool or from the W3C ACT framework.

```
Rule ID:  image-alt
Rule:     Images must have alternate text
Tool:     axe-core 4.x

ACT Rule: 23a2a8 — Image button has accessible name
URL:      https://act-rules.github.io/rules/23a2a8
```

When multiple tools flag the same issue, list all rule IDs.

### 7. Severity

Assign a severity level using the taxonomy above. Use it consistently across
all reports in a project. When multiple tools report the same violation at
different severities, use the higher severity.

### 8. Frequency / Occurrence

Report how often the element appears on the page and across the site.

```
Frequency: 1 instance on this page
Frequency: Appears on every page in the main navigation
Frequency: Found on 23 of 47 pages crawled (49%)
```

For automated scans, include aggregate counts:

```json
{
  "rule": "image-alt",
  "occurrences": 14,
  "pages_affected": 6,
  "total_pages_scanned": 50
}
```

---

## High: Recommended Additional Fields

These fields are not always required but significantly improve report quality.
**Omitting them is a High severity gap** when the issue is complex or the audience is unfamiliar
with the codebase.

### Issue Summary (Title)

Write a concise title: `[Component] — [Failure mode] ([WCAG SC])`.

**Good:**

* `Close button missing accessible name (WCAG 1.1.1)`
* `Error message not associated with form field (WCAG 1.3.1)`

**Avoid:**

* `Accessibility issue found`
* `Screen reader problem on checkout`

### Description

Explain what is wrong and why it is a barrier for users with disabilities.

```
The "Close" button in the cookie-consent dialog contains only a decorative SVG
icon with no alt text, aria-label, or visible text. Screen reader users hear
"button" with no indication of its purpose, making it impossible to dismiss the
dialog by voice or from a screen reader virtual cursor.
```

### Steps to Reproduce

Number the steps a developer can follow to see the failure.

```
1. Go to https://example.com/shop
2. Wait for the cookie consent banner to appear
3. Open NVDA (or VoiceOver on macOS)
4. Press Tab to move focus to the "X" button in the banner
5. Listen to what the screen reader announces
```

For automated test output, include the command used:

```bash
npx axe https://example.com/shop --tags wcag2a,wcag2aa --reporter json
```

### Expected Behaviour

State what the correct experience should be.

```
Expected: Screen reader announces "Close cookie consent dialog, button"
          or equivalent meaningful label.
```

### Actual Behaviour

State what currently happens.

```
Actual: Screen reader announces "button" only. No accessible name is provided.
```

### Testing Environment

Specify the full stack. AT bugs are often environment-specific.

```
Browser:       Chrome 124 / Firefox 126 / Safari 17.4
OS:            Windows 11 / macOS 14 / iOS 17
Screen reader: NVDA 2024.1 / JAWS 2024 / VoiceOver
Zoom level:    100% / 200%
Tool:          axe-core 4.9.1 / Accessibility Insights 2.47 / Pa11y 6.2
```

### Impact Statement

Describe which disability groups are affected and how.

```
Impact: Blind and low-vision users relying on screen readers cannot identify
        or operate the close button. Users who rely on voice control software
        (e.g. Dragon NaturallySpeaking) cannot activate an unnamed button by
        speaking its label.
```

### Suggested Fix

Provide a concrete remediation when possible.

```html
<!-- Current (broken) -->
<button class="close-btn">
  <svg aria-hidden="true" ...></svg>
</button>

<!-- Fixed: Option A — aria-label -->
<button class="close-btn" aria-label="Close cookie consent dialog">
  <svg aria-hidden="true" ...></svg>
</button>

<!-- Fixed: Option B — visually hidden text -->
<button class="close-btn">
  <svg aria-hidden="true" ...></svg>
  <span class="visually-hidden">Close cookie consent dialog</span>
</button>
```

---

## Moderate: Structured Report Templates

### Markdown Template (for GitHub Issues)

```markdown
## Accessibility Issue: [Brief Description]

**URL:** [Full URL where issue was found]
**XPath:** `[Shortest unique XPath]`
**Full DOM path:** `[Full ancestor chain XPath]`
**WCAG SC:** [SC number] — [SC name] (Level [A/AA/AAA])
**Rule:** [Tool name] — [Rule ID]
**Severity:** [Critical / High / Medium / Low]
**Frequency:** [Number of instances; pages affected]

### HTML Snippet

```html
[Minimal failing HTML fragment]
```

### Description

[Explain what is wrong and why it creates a barrier]

### Steps to Reproduce

1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Behaviour

[What should happen]

### Actual Behaviour

[What currently happens]

### Testing Environment

| Item | Value |
|---|---|
| Browser | [name and version] |
| OS | [name and version] |
| Screen reader | [name and version, or N/A] |
| Testing tool | [name and version] |

### Impact

[Who is affected and how]

### Suggested Fix (optional)

[Code or prose describing the fix]
```

---

## Guidance for Automated Tools and AI Agents

Apply these additional rules when scripts or AI agents generate reports.

* **Emit both XPath forms** — simplified and full DOM path — in every violation.
* **Deduplicate before reporting** — group violations by rule and normalised XPath;
  report one issue with `frequency.instances_on_page` set to the count rather than
  filing hundreds of identical issues.
* **Map every rule to a WCAG SC** — maintain a rule-to-WCAG mapping so reports
  consistently include the criterion.
* **Preserve the HTML snippet at scan time** — DOM content may change after the
  scan; the preserved snippet allows verification of a deployed fix.
* **Use a single severity taxonomy** — if multiple tools report the same violation
  at different severities, use the higher severity.
* **Include a confidence score** for automated detections that require manual
  confirmation (e.g. colour contrast over a gradient):

```json
{
  "rule_id": "color-contrast",
  "confidence": "needs-review",
  "note": "Background is a CSS gradient; contrast check may be inaccurate. Manual verification required."
}
```

### AI Agent Prompt for Filing a GitHub Issue

When an AI agent files a GitHub Issue from scan output, use this prompt structure:

```
You are an accessibility engineer filing a GitHub Issue.
Given the following JSON violation report, create a well-structured
GitHub Issue using the Markdown template above.

Rules:
- Use the issue summary as the title.
- Populate all fields; write "N/A" only if the data is genuinely absent.
- Do not paraphrase WCAG criterion names; use the exact W3C wording.
- Include the HTML snippet in a fenced code block.
- Add the label "accessibility" to the issue.

Violation data:
[INSERT JSON HERE]
```

---

## Reporting to External Organisations

When reporting accessibility barriers to a third-party (vendor, government,
public website), adapt the report to the audience:

1. **Check for an existing channel** — look for an accessibility statement,
   `accessibility@` email, or feedback form.
2. **Be specific** — provide the exact page, element, and barrier.
3. **Focus on impact** — explain who is affected and what they cannot complete.
4. **Reference WCAG and applicable law** — cite the specific criterion and relevant
   legislation (Section 508, EN 301 549, AODA, etc.).
5. **Offer to help** — suggest the fix; organisations act faster when a solution
   accompanies the problem.
6. **Set a timeline** — request acknowledgement within a defined period (e.g.
   10 business days) and a remediation timeline for critical issues.
7. **Escalate if necessary** — contact the relevant enforcement body or ombudsman
   if no response is received.

### External Report Email Template

```
Subject: Accessibility barrier on [Page Title] — [WCAG SC]

Dear [Organisation Name] Accessibility Team,

I am writing to report an accessibility barrier I encountered on your website.

Page:    [Full URL]
Issue:   [One-sentence description of the barrier]
Impact:  [Who is affected and what they cannot do]
WCAG SC: [SC number and name, Level]

Steps to reproduce:
1. [Step 1]
2. [Step 2]

Expected: [What should happen]
Actual:   [What happens instead]

Suggested fix: [Brief description or code snippet if appropriate]

I am available to provide further information or test a proposed fix.
I would appreciate acknowledgement within 10 business days and a
remediation timeline for this critical barrier.

Thank you for your attention to this matter.

[Your name / organisation]
```

---

## Pre-Filing Quality Checklist

Before filing or submitting an accessibility bug report, verify each item:

* [ ] URL is exact and publicly accessible (or a test account is provided)
* [ ] XPath (simplified) uniquely identifies the element
* [ ] Full DOM path XPath is included
* [ ] HTML snippet is minimal and self-contained
* [ ] WCAG SC is cited with the correct level (A/AA/AAA)
* [ ] Automated rule ID is included (axe-core, ACT, or tool-specific)
* [ ] Severity is assigned using the project's standard taxonomy
* [ ] Frequency / occurrence count is provided
* [ ] Summary title follows `[Component] — [Failure] ([WCAG SC])` pattern
* [ ] Steps to reproduce are numbered and complete
* [ ] Expected and actual behaviours are stated separately
* [ ] Testing environment (browser, OS, AT, tool) is documented
* [ ] Impact on specific disability groups is described
* [ ] Duplicate violations are aggregated, not filed individually
* [ ] For automated output: confidence level is included where relevant

---

## Commonly Violated WCAG Criteria

| SC | Name | Level | Common Violations |
| --- | --- | --- | --- |
| 1.1.1 | Non-text Content | A | Missing `alt` on images, unlabelled icon buttons |
| 1.3.1 | Info and Relationships | A | Unsemantic heading structure, missing form labels |
| 1.3.3 | Sensory Characteristics | A | Instructions that rely on shape, colour, or position only |
| 1.4.1 | Use of Color | A | Status conveyed by colour alone |
| 1.4.3 | Contrast (Minimum) | AA | Text below 4.5:1 contrast ratio |
| 1.4.4 | Resize Text | AA | Page breaks at 200% zoom |
| 1.4.11 | Non-text Contrast | AA | UI component borders below 3:1 contrast |
| 2.1.1 | Keyboard | A | Elements not reachable or operable by keyboard |
| 2.4.3 | Focus Order | A | Illogical tab order, focus moves unexpectedly |
| 2.4.7 | Focus Visible | AA | No visible focus indicator |
| 3.3.1 | Error Identification | A | Form errors not described in text |
| 3.3.2 | Labels or Instructions | A | Form fields without visible labels |
| 4.1.2 | Name, Role, Value | A | Custom widgets missing ARIA name, role, or state |
| 4.1.3 | Status Messages | AA | Notifications not exposed to screen readers |

For the complete list, see the [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/).

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/ACCESSIBILITY_BUG_REPORTING_BEST_PRACTICES.md)
* [Writing Impactful Accessibility Reports](https://medium.com/openconcept-stories/writing-impactful-accessibility-reports-d6cdd84356fd) — Mike Gifford, OpenConcept
* [How to Fix Accessibility Bugs](https://github.com/readme/guides/fix-accessibility-bugs) — Mike Gifford, GitHub README Guides
* [Contacting Organizations about Inaccessible Websites](https://www.w3.org/WAI/teach-advocate/contact-inaccessible-websites/) — W3C WAI
* [ACT Rules Community Group](https://act-rules.github.io/) — W3C
* [Accessibility Insights for Web](https://github.com/microsoft/accessibility-insights-web) — Microsoft
* [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
