---
name: bug-reporting
description: >
  Load this skill whenever you are filing, reviewing, or generating accessibility
  bug reports — whether from automated tool output, manual testing, user reports,
  or testing with disabled people. The purpose of this skill is to make
  accessibility findings easier to report accurately, connect them to real
  people and tasks, and let developers reproduce, understand, and fix them
  without unnecessary back-and-forth. Absolutely always describe the barrier
  and its task impact before citing a WCAG criterion. Under no circumstances
  guess a disability diagnosis, treat automated tool output as a conformance
  conclusion, or expose secrets/personal data in a report.
---

# Accessibility Bug Reporting Skill

> **Canonical source**: `examples/ACCESSIBILITY_BUG_REPORTING_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when filing, reviewing, or generating accessibility bug reports
from any source — automated tool output, manual testing, user reports, or
testing with disabled people.

---

## Core Mandate

A useful report lets another person understand the barrier, identify the
people affected, reproduce it when possible, judge its impact, identify the
responsible source, and verify the correction. Not every field applies to
every finding — **do not delay a valid report because a selector, tool rule,
WCAG mapping, or code-level fix is unavailable.**

**Principles:**
1. **Describe the barrier before the standard** — state what task or interaction fails and under what conditions
2. **Identify the people affected** — describe access needs/interaction methods/AT when evidence supports it; never infer a diagnosis or imply one person represents an entire disability group
3. **State the evidence basis** — distinguish user reports, testing with disabled people, manual evaluation, automated results, and reasoned inference
4. **Record observed facts** separately from assumptions, suspected causes, and suggested fixes
5. **Use complementary testing methods** — automated, manual, and testing-with-disabled-people answer different questions; none substitutes for the others
6. **Collect only relevant context** — browser/AT/viewport/preferences matter only when they affect the result
7. **Protect people and systems** — remove personal data, credentials, tokens, and private content from every attachment
8. **Treat tool output as evidence, not a conformance decision**
9. **Separate severity from priority** — task impact and workaround quality inform severity; reach, frequency, deadlines, and business context inform priority
10. **Fix the source when possible** — a shared-component/template/token fix is usually safer than many page-specific patches
11. **Close with verification evidence** — a code change, automated pass, or visual check alone may not prove the user-facing barrier is gone

---

## Terminology

| Term | Meaning |
| --- | --- |
| **Finding** | An observed or suspected accessibility barrier or test result |
| **Issue** | Tracked work that may contain one or more related findings |
| **Occurrence** | One place or state in which a finding appears |
| **Root cause** | The source producing one or more occurrences (e.g., a shared component) |
| **Affected people** | People whose task/experience is confirmed or reasonably expected to be affected — describe only as specifically as the evidence allows |
| **Manual accessibility evaluation** | Human evaluation using relevant inputs/settings/AT — distinct from testing with disabled people |
| **Testing with disabled people** | Disabled participants using representative tasks, providing evidence from lived experience |
| **Conformance conclusion** | A conclusion about a defined scope, standard, level, and evaluation method |

**A failed automated rule does not automatically prove a WCAG failure. A
passed automated rule does not prove conformance.** Confirm the result and
its scope before making a conformance claim.

---

## Severity Scale (this skill)

| Severity | Definition |
| --- | --- |
| **Blocker** | A core task cannot be completed, or there's a serious safety/privacy/data-loss risk, with no reasonable workaround |
| **Major** | A task fails, is unreliable, or requires a substantial workaround |
| **Moderate** | The task remains possible but requires significant extra effort or assistance |
| **Minor** | Localized friction without material task loss |
| **Needs review** | The result or impact has not been confirmed |

This is an example scale, not a universal standard — calibrate locally with
disabled people and product teams, and document local definitions.

**Severity, priority, reach, frequency, and confidence answer different
questions** — do not conflate them:

| Field | Question |
| --- | --- |
| Severity | How serious is the task-level consequence in *this* occurrence? |
| Priority | When should the team address it? |
| Reach | How many people/pages/components may be affected? |
| Frequency | How often does the occurrence appear? |
| Confidence | How certain is the finding/impact/cause understanding? |

**Frequency and reach can increase priority, but they do not change the
severity of one occurrence** — do not automatically escalate a low-severity
issue to higher severity just because it appears on many pages; record that
as a priority factor instead.

---

## Critical: Minimum Information for a Useful Report

Include when known and relevant — do not reject a report from a user for
lacking technical detail; a triager can add locators, standards mapping, or
a verification plan later.

| Field | What to record |
| --- | --- |
| Title | Component/location, failure, and task effect |
| Location and state | Safe URL/route, component name, build, and the state in which the problem appears |
| People affected | Access needs/interaction methods/AT confirmed or likely affected; more than one group when relevant |
| Evidence basis and confidence | User report / testing with disabled people / manual evaluation / automated result / reasoned inference, plus uncertainty |
| Task and impact | What the person is trying to do, how the barrier affects it, workaround quality/cost |
| Steps or conditions | The shortest reliable path, including preconditions |
| Expected result | The user-facing behavior that should occur |
| Actual result | What was observed, including relevant AT output |
| Environment | Only the browser/OS/AT/input/viewport/zoom/preferences/locale that affect the result |
| Evidence | A small redacted excerpt or accessible attachment when it helps |

---

## Critical: Write a Specific Title

Identify the component, failure, and consequence.

**Good:** `Checkout: card error text is not associated with the field` /
`Account menu: keyboard focus moves behind the open dialog`

**Avoid:** `Accessibility issue`, `Screen reader bug`, `WCAG failure` — these
don't identify the affected behavior. Including a WCAG criterion in the
title is optional; the report should stay understandable to someone who
doesn't know the criterion number.

---

## Critical: Record Location and State Safely

```text
Page or route: /checkout/payment
Build or commit: 2026.07.18.2
Component: Payment form
UI state: Form submitted with an invalid card number
Account role: Test customer
```

Use an exact URL only when its query/fragment values are relevant AND safe
to share. **Remove or replace session identifiers, access tokens, email
addresses, names, account numbers, and other secrets/personal data:**

```text
Unsafe: https://example.com/orders/847291?token=secret-value
Safe:   https://example.com/orders/[test-order-id]
```

Never include production credentials — provide an approved test account
through the organization's secure process.

**Element locators:** start with a human-readable component name and
location; add a stable technical locator if it helps (`[data-component="cookie-settings"] [data-action="close"]`,
a tool-native selector, an accessibility-tree path, a test ID, or a short
XPath). **A full absolute DOM XPath should not be mandatory** — absolute
paths are brittle when wrappers, list positions, or generated markup change.
If no reliable locator exists, describe the visible label, accessible name,
role, nearby heading, and interaction state instead. Record iframe/shadow-root
boundaries when relevant.

---

## Critical: Preconditions and Steps to Reproduce

List only the steps needed to reach the failure, including input method and
AT command when they matter:

```text
Preconditions:
- Signed in as a test customer
- Cart contains one item
- NVDA is running with Firefox

Steps:
1. Open the checkout payment step.
2. Leave the card number empty.
3. Move to the Submit order button with Tab.
4. Activate the button with Enter.
5. Listen for feedback without moving focus.
```

For intermittent findings, record how many attempts reproduced it, timing/
network/loading conditions, and the earliest known build. **"Cannot
reproduce" is a triage state, not evidence the report is invalid** — preserve
the original conditions.

---

## Critical: Separate Expected and Actual Results

Write expected behavior as an **outcome**, not a required implementation:

```text
Expected:
After submission, the card number error is associated with the field. When
focus moves to the field, its label, invalid state, and error are available.

Actual:
The visible error appears, but the card number field has no programmatic error
association. When focus moves to the field, NVDA announces only its label.
```

Avoid putting a specific ARIA attribute or JS method in the expected result
unless the product contract requires that implementation — put possible code
changes under "Suggested fix" instead.

---

## Critical: Identify People Affected — Never Guess a Diagnosis

Connect the barrier to people and a task, not only to a technical defect or
tool rule. Describe people in terms of access needs/interaction methods/AT
**when evidence supports it** — do not guess a diagnosis, require disclosure
of one, or imply every person in a disability group has the same experience.

| Evidence status | Meaning |
| --- | --- |
| **Reported or confirmed by affected people** | A disabled person reported it, or it was observed while disabled participants performed the task |
| **Observed through manual evaluation** | An evaluator reproduced it using the relevant method/setting/AT — evidence of behavior, not equivalent to testing with disabled people |
| **Likely** | Affected population and impact reasonably inferred but not confirmed with affected people |
| **Unknown or needs review** | From automation or technical inspection; user impact not yet established |

**Useful:** "People who use screen readers are likely to be affected,
including some blind and low-vision people. Manual evaluation with NVDA and
Firefox found that submission failure was not announced. The impact has not
yet been confirmed through testing with disabled participants."

**Not useful:** "This affects blind people and violates WCAG."

A report can identify more than one affected population — avoid assuming a
one-to-one relationship between a WCAG criterion or automated rule and a
disability group.

---

## Serious: Record Only the Relevant Environment

An environment list is useful only when it describes conditions that
produced the result — **do not paste a generic browser/AT matrix into every
issue**:

```text
Test date and time: 2026-07-18 14:30 EDT
Browser: Firefox 140
Operating system: Windows 11 24H2
Assistive technology: NVDA 2026.1
Input: Keyboard
Viewport: 1280 by 720 CSS pixels
Zoom or text size: 200% text size
Color scheme: Dark
Forced colors: Active
prefers-reduced-motion: reduce
prefers-contrast: more
Locale and language: en-CA
```

Use the value actually tested — **do not infer a device type from a
viewport-width breakpoint**; viewport, input capability, browser, OS, and
physical device are separate facts. Relevant CSS preference values:
`prefers-color-scheme` (light/dark), `prefers-reduced-motion` (reduce/no-preference),
`prefers-contrast` (more/less/custom/no-preference), `forced-colors` (active/none).

---

## Serious: Add Technical Evidence Without Exposing Data

Technical evidence is optional when the observed behavior is already clear.

```html
<label for="card-number">Card number</label>
<input id="card-number" name="card-number">
<p id="card-number-error">Enter a card number.</p>
```

Explain what the excerpt demonstrates — here, the visible error isn't
programmatically associated with the field. Do not assume an excerpt shows
the entire computed accessibility tree.

**Before sharing HTML, DOM snapshots, logs, or screenshots, remove:** tokens/
cookies/hidden credentials; names/addresses/account data; private form field
values; unnecessary internal URLs or IDs. For screenshots/recordings:
describe the relevant content in the issue text; use arrows/markers plus
text, not color alone; provide captions/transcripts for video/audio; crop or
redact faces/names/private content.

---

## Serious: Standards, Rules, and Test Results

**WCAG mapping** — record the exact version, criterion, and level when known;
use `suspected`/`needs review` when uncertain; don't add criteria merely
because a tool lists them as tags:

```text
Standard: WCAG 2.2
Success Criterion: 1.3.1 Info and Relationships
Level: A
Relationship: Confirmed failure
```

**Tool/rule information** for automated results:

```text
Tool and version: axe-core 4.9.1
Rule ID and version: button-name
Configuration: wcag2a, wcag2aa tags
Test method: Automated
Raw outcome: failed
Human review: Confirmed / Rejected / Needs review
```

Keep a tool's impact/confidence value separate from the project's severity —
tool metadata is a heuristic, not the task/context/workaround/root-cause
assessment. **If using ACT Rules Format 1.1, preserve one of its outcomes**
(`inapplicable`, `passed`, `failed`, `cantTell`, `untested`) — send `cantTell`
results for human review; a `passed`/`inapplicable` result may still need
other tests before a WCAG conclusion.

---

## Serious: Plan Complementary Testing and Verification

Automated testing, manual evaluation, and testing with disabled people
answer different questions — state which methods are required, why, and
their limits.

* **Automated:** identifies machine-testable patterns and gives repeatable
  regression coverage; cannot determine full user impact, usability, or
  conformance. Preserve raw result/config; require human review before
  treating as a confirmed user-facing barrier; don't treat an automated pass
  as sufficient closure evidence.
* **Manual accessibility evaluation:** required when the result depends on
  human judgment or interaction — keyboard operation, focus, screen reader
  output, zoom/reflow, forced colors, labels/errors/status messages, and
  relevant states. Test a risk-based set of environments, not every
  combination for every issue.
* **Testing with disabled people:** examines real tasks and lived
  interaction; can find barriers standards-based evaluation misses. Plan it
  when: the task is critical (authentication, payment, health, safety,
  public services); the barrier/fix has major or uncertain impact; the
  component is complex/novel; workaround quality is unclear; reports from
  disabled people conflict with technical results. Do not use disabled
  participants to rediscover obvious known failures that should be fixed
  first. One participant confirms that person's experience — don't treat
  them as representative of an entire disability group. This does not
  replace standards-based evaluation, and standards-based evaluation doesn't
  replace learning directly from disabled people.

Record a verification plan: automated checks required/planned/completed;
manual checks required/planned/completed; relevant supported environments;
testing with disabled people required/planned/completed with rationale.

---

## Moderate: Record Scope, Frequency, and Root Cause

```text
Observed occurrences: 7
Pages checked: 12
Pages affected: 5
States checked: Default, error, disabled
Likely source: Shared address form component
Unchecked scope: Mobile app and authenticated administrator flow
```

Don't extrapolate from a sample without saying it's an estimate — a
sitewide template defect and seven unrelated content errors may share a
count but need different work. **Group findings conservatively** — combine
occurrences only when they share the same remediation unit or confirmed root
cause; don't merge findings merely because they share a rule ID or similar selector.

---

## Suggested Fixes and Acceptance Criteria

A suggested fix is optional — label it as a proposal; the responsible team
may know a safer source-level correction:

```text
Suggested fix:
Associate the error message with the field and expose the invalid state after
validation.
```

Acceptance criteria should describe **verifiable user-facing behavior**, not
just an attribute/selector/automated-rule result:

```text
- Submitting the empty field identifies the card number error in text.
- The field exposes the error association and invalid state programmatically.
- Keyboard focus remains predictable.
- The original interaction is manually retested.
- Testing with disabled people is completed when required by the verification plan.
```

---

## Markdown Issue Template

```markdown
## Accessibility finding

### Summary
[Component or location: failure and task effect]

### Location and state
- Page or route:
- Build or commit:
- Component:
- Preconditions and UI state:
- Safe locator (optional):

### Steps or conditions
1.
2.

### Expected result
[Describe the user-facing outcome.]

### Actual result
[Describe what was observed.]

### People affected and impact
- People confirmed or likely to be affected:
- Relevant access needs, interaction methods, or assistive technologies:
- Affected task:
- Consequence:
- Workaround and its cost, if any:
- Evidence basis: User report / Testing with disabled people / Manual evaluation / Automated result / Reasoned inference
- Confidence: Confirmed for reported scope / Observed / Likely / Unknown
- Scope limits or uncertainty:

### Relevant environment
- Test date:
- Browser and operating system:
- Assistive technology and version:
- Input method:
- Viewport, zoom, text size, and orientation:
- Active preferences or display modes:

### Evidence
[Small redacted excerpt, attachment description, or link to protected evidence.]

### Standards and tests (optional)
- WCAG version, success criterion, and level:
- Relationship: Confirmed / Suspected / Needs review
- Tool, rule, version, and configuration:

### Verification plan
- Automated checks: Required / Not required / Planned / Completed
- Manual checks: Required / Not required / Planned / Completed
- Testing with disabled people: Required / Not required / Not yet determined / Planned / Completed
- Rationale:

### Scope and source
- Occurrences and sample checked:
- Suspected or confirmed root cause:

### Suggested fix (optional)
[Describe a possible approach without replacing acceptance criteria.]

### Acceptance criteria
- [ ] The reported user-facing barrier is no longer present.
- [ ] The original environment and interaction have been manually retested.
- [ ] An automated pass was not treated as sufficient evidence on its own.
- [ ] Testing with disabled people was completed when required by the verification plan.
- [ ] The impact statement does not go beyond the available evidence.
- [ ] Appropriate regression coverage has been added or updated.

### Privacy and attachment check
- [ ] Secrets, personal data, and private content have been removed.
- [ ] Screenshots are described and recordings have captions or transcripts.
```

---

## Machine-Readable Finding Schema

Machine-readable output can support imports, reporting, and regression
analysis — it must not require fields that don't exist for manual or
user-reported findings.

```json
{
  "schema_version": "1.1",
  "title": "Checkout: card error text is not associated with the field",
  "location": {
    "route": "/checkout/payment",
    "component": "Payment form",
    "locator": { "type": "stable-css", "value": "[data-component='payment-form']" }
  },
  "expected": "The field exposes its label, invalid state, and associated error programmatically.",
  "actual": "A visible error appears, but the field has no error association.",
  "affected_people": [{
    "description": "People who use screen readers",
    "status": "likely",
    "evidence_basis": "manual-evaluation",
    "scope_limit": "Observed with NVDA and Firefox; not yet evaluated with disabled participants"
  }],
  "standards": [{ "standard": "WCAG 2.2", "criterion": "1.3.1", "level": "A", "relationship": "confirmed-failure" }],
  "test_result": { "method": "manual", "status": "confirmed" },
  "verification": {
    "automated": { "required": true, "status": "planned" },
    "manual": { "required": true, "status": "completed-for-original-finding" },
    "testing_with_disabled_people": { "required": true, "status": "planned" }
  }
}
```

Version the schema, document null/omitted values, validate imports, and plan
migrations. Preserve a tool's raw output separately when exact round-trip
fidelity matters.

---

## Automation and AI Guardrails

Automation can collect and organize evidence — it should **not invent
certainty, affected populations, or lived experience.**

An automated/AI-assisted workflow should:
1. Preserve the raw result, tool/rule version, config, time, and tested URL/route
2. Label the method: automated / semi-automated / manual / user-reported / testing with disabled people
3. Retain the tool's original outcome; route `cantTell`/uncertain results to a review queue
4. Remove credentials and personal data before sending evidence to another system
5. **Avoid generating a WCAG mapping, affected population, impact statement,
   severity, or root cause when the evidence doesn't support it**
6. Distinguish confirmed participant evidence from manual observation and reasoned inference
7. Require human validation per the project's risk/triage rules before
   creating high-impact work or conformance claims
8. Group occurrences only when the remediation unit or root cause is sufficiently established
9. Update an existing issue with new occurrences instead of silently discarding duplicates
10. Preserve disagreements between a tool result, evaluator review, and participant feedback
11. Require manual user-facing retesting before closure when automation can't verify the outcome
12. Record whether testing with disabled people is required/planned/completed with rationale
13. **Never claim testing with disabled people occurred unless it actually did**

Do not close an issue only because the original automated rule passes — the
implementation may have changed the selector, hidden the tested node, or
introduced a different barrier.

**Deduplication:** use the issue tracker's ID as the durable identity — a
scan fingerprint can help correlate repeated results but is not a permanent
bug ID. If fingerprints are used: version the algorithm; include tool/rule
version; normalize URLs/selectors carefully; expect fingerprints to change
when markup changes; do not infer mobile/desktop from a width threshold;
don't merge results solely because hashes match.

---

## Finding Lifecycle

1. **Capture:** record barrier, location, state, people affected, impact, evidence basis, safe evidence
2. **Triage:** confirm the result when possible, identify missing context, separate severity from priority
3. **Isolate:** find the source component/template/token/process producing the occurrences
4. **Assign:** an owner who can change the source, not just the individual page
5. **Define:** agree on user-facing acceptance criteria, supported environments, verification plan
6. **Correct:** fix the source; update docs/examples/content guidance
7. **Prevent:** add proportionate regression coverage
8. **Retest:** repeat the original interaction and relevant adjacent states/preferences/environments
9. **Evaluate with disabled people:** complete planned participant testing where required
10. **Close:** record what changed, verification evidence, remaining limitations, follow-up

If a fix is partial, record the remaining occurrences/environments rather
than closing the broader issue as complete.

---

## Reporting to External Organizations

Look first for an accessibility statement, `accessibility@` contact, or
feedback form. Write for the person receiving the report, who may not be an
accessibility specialist. Lead with the page/feature, the barrier observed,
affected people/methods if known and safe to share, the task it prevents,
concise steps and environment, and a request for acknowledgement. WCAG
references and suggested fixes are optional. Do not include passwords,
personal information, or sensitive documents — and don't require a reporter
to disclose a diagnosis. There is no universal response deadline; appropriate
follow-up depends on the organization/contract/jurisdiction (this is not
legal advice).

```text
Subject: Accessibility barrier in [page or feature]

Hello,

I encountered an accessibility barrier in [page or feature].

Location: [safe URL, route, or feature name]
Task: [what you were trying to do]
Barrier: [what happened]
People or interaction methods affected, if known: [description]
Impact: [how this affected the task]

Steps or conditions:
1. [Step]

Expected: [user-facing outcome]
Actual: [observed result]

Relevant environment: [only details that affect the result]
WCAG reference, if known: [version, criterion, and level]

Please acknowledge this report and let me know how I can follow its status.

Thank you.
```

---

## Common Reporting Failures

* Requiring a full DOM XPath, HTML excerpt, tool rule, or WCAG criterion before accepting a report
* Copying an exact URL that contains a token or personal data
* Reporting only "fails WCAG" without describing the user-facing behavior
* Inferring a disability group or population-wide impact from a WCAG criterion or tool rule
* Treating a tool result as a confirmed defect or a conformance conclusion
* Treating an evaluator's use of assistive technology as equivalent to testing with disabled people
* **Assigning severity from a tool's impact field, or automatically increasing severity by occurrence count** (that's a priority signal, not severity)
* Claiming a viewport width proves the physical device type
* Listing every AT version instead of the environment actually tested
* Merging unrelated occurrences because the rule ID or selector looks similar
* Prescribing a code change without behavior-based acceptance criteria
* Skipping manual testing because an automated check passes
* Closing after a code merge or automated pass without repeating the original interaction
* Using disabled participants to rediscover known basic failures that should have been corrected first
* Generalizing one participant's experience to an entire disability group
* Disclosing a reporter's or participant's diagnosis, identity, or private content without informed permission

---

## Pre-Filing Quality Checklist

* [ ] Location and state recorded with secrets/tokens/personal data removed from URLs
* [ ] Title identifies component, failure, and task effect (not "Accessibility issue")
* [ ] Steps to reproduce are numbered, minimal, and complete
* [ ] Expected and actual results stated as user-facing outcomes, not implementation prescriptions
* [ ] People affected described only as specifically as the evidence allows — no guessed diagnosis
* [ ] Evidence basis and confidence level stated (user report / testing with disabled people / manual / automated / inference)
* [ ] Only relevant environment fields recorded — not a generic browser/AT matrix
* [ ] Technical evidence (HTML/screenshots/logs) redacted of secrets and personal data
* [ ] WCAG mapping marked confirmed/suspected/needs review as appropriate
* [ ] Severity assigned from task impact — not from tool output or occurrence count
* [ ] Frequency/reach recorded separately as a priority factor, not folded into severity
* [ ] Verification plan states which of automated/manual/disabled-people testing is required and why
* [ ] Findings grouped only when remediation unit or root cause is confirmed shared

---

## Commonly Violated WCAG Criteria

| SC | Name | Level | Common Violations |
| --- | --- | --- | --- |
| 1.1.1 | Non-text Content | A | Missing `alt` on images, unlabelled icon buttons |
| 1.3.1 | Info and Relationships | A | Unsemantic heading structure, missing form labels |
| 1.3.3 | Sensory Characteristics | A | Instructions relying on shape, colour, or position only |
| 1.4.1 | Use of Color | A | Status conveyed by colour alone |
| 1.4.3 | Contrast Minimum | AA | Text below 4.5:1 contrast ratio |
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
* [Website Accessibility Conformance Evaluation Methodology (WCAG-EM)](https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/)
* [Involving Users in Evaluating Web Accessibility](https://www.w3.org/WAI/test-evaluate/involving-users/)
* [Using Combined Expertise to Evaluate Web Accessibility](https://www.w3.org/WAI/test-evaluate/combined-expertise/)
* [Contacting Organizations about Inaccessible Websites](https://www.w3.org/WAI/teach-advocate/contact-inaccessible-websites/)
* [EARL 1.0 Schema](https://www.w3.org/TR/EARL10-Schema/) — non-normative W3C Working Group Note, not required for routine reports
* [ACT Rules Format 1.1](https://www.w3.org/TR/act-rules-format/)
* [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
