# Testing

## What This Role Does

Testing verifies that accessibility requirements are actually met — not just in theory, but in practice with real tools and real assistive technology. This role bridges the gap between "we built it" and "it works for everyone."

## Also Known As

- QA engineer
- Accessibility tester
- Quality assurance analyst
- Manual tester
- AT tester (assistive technology tester)
- Test engineer

Testing is unique among these roles: it has no primary ownership tasks in the W3C WAI ARRM data. This is because testing is not a phase — it is a verification activity that applies across every role's responsibilities. Testing validates that content authors wrote good alt text, developers implemented correct semantics, designers met contrast requirements, and so on.

## Perspective

### What This Role Sees

- Whether automated tools catch the easy issues (axe, WAVE, Lighthouse)
- Whether manual testing reveals what automation misses (keyboard, focus, screen reader)
- Whether the page works with real assistive technology (NVDA, JAWS, VoiceOver, TalkBack)
- Whether testing covers the full user journey, not just individual pages
- Whether regressions are caught before they reach production

### What This Role Often Misses

- The intent behind design decisions (ask UX Design)
- Whether content is clear and meaningful (ask Content Authoring)
- The technical constraints of the implementation (ask Front-End Development)
- Whether the organization's processes support accessibility (ask Business Analysis)

### When to Bring This Role In

- Before any release to production
- When automated test results seem too good to be true (they probably are)
- When users report accessibility barriers
- When new assistive technology versions are released
- During integration testing of third-party components

## AI Persona Prompt

Use this prompt to get an AI agent to evaluate a website from this perspective:

```
You are an accessibility tester evaluating this website.
Your focus is on verification — does this page actually work for users with disabilities?

Check for:
1. Automated issues that axe-core or similar tools would catch
2. Keyboard-only navigation issues (can you reach and operate everything?)
3. Screen reader announcement issues (are headings, labels, and states announced correctly?)
4. Focus management problems (does focus move where users expect?)
5. Color contrast failures (text and non-text)
6. Content reflow at 400% zoom
7. Form validation and error handling flows
8. Dynamic content updates (do live regions announce changes?)

For each issue, describe:
- How to reproduce it
- Which users are affected
- What the expected behavior should be
- The WCAG success criterion that is violated
```

## ARRM Task Summary

The Testing role has **0 tasks** in the ARRM data. This does not mean testing is unimportant — it means testing validates other roles' tasks rather than owning them directly.

### How Testing Relates to Other Roles

| Role's Task | What Testing Verifies |
|-------------|----------------------|
| Content: Alt text (IMG-001) | Is the alt text meaningful and accurate? |
| Dev: Keyboard access (INP-004) | Can every element be reached and activated by keyboard? |
| UX: Error prevention (FRM-035) | Do error messages actually help users fix problems? |
| Visual: Contrast (CSS-008) | Does the text meet 4.5:1 against its background? |

## Collaboration Points

| Role | What to share | What to ask |
|------|---------------|-------------|
| Business Analysis | Test results and metrics | "Do these results meet the requirements?" |
| Content Authoring | Screen reader test output | "Does this alt text make sense when heard?" |
| Front-End Dev | Automated test reports | "Do these violations have clear fixes?" |
| UX Design | User journey test results | "Does the interaction flow work end-to-end?" |
| Visual Design | Visual regression results | "Does the design hold up at 200% zoom?" |

## Key WCAG Criteria

Testing validates all WCAG criteria, but particularly:
- **4.1.1** — Parsing (A) — automated validation
- **1.3.1** — Info and relationships (A) — semantic structure verification
- **2.1.1** — Keyboard (A) — manual keyboard testing
- **2.4.7** — Focus visible (AA) — visual focus testing
- **1.4.3** — Contrast minimum (AA) — automated and manual contrast testing

## Testing Levels

1. **Automated** — axe-core, WAVE, Lighthouse (catches ~30% of issues)
2. **Manual keyboard** — Tab, Enter, Space, Escape, arrow keys (catches interaction issues)
3. **Screen reader** — VoiceOver, NVDA, JAWS, TalkBack (catches announcement issues)
4. **Zoom and reflow** — 200%, 400%, forced colors mode
5. **User testing** — Real people with disabilities using the product

No single level is sufficient. All five are needed for confidence.
