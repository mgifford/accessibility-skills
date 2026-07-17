# Business Analysis

## What This Role Does

Business analysis in accessibility focuses on requirements gathering, evaluation metrics, and ensuring organizational processes support inclusive outcomes. This role bridges the gap between what users need and what teams deliver, translating accessibility standards into actionable requirements.

## Also Known As

- Business analyst
- Data analyst
- Digital performance analyst
- Operations (CivicActions taxonomy)
- Requirements analyst
- Systems analyst

Different organizations use different titles for this work. The responsibilities are similar: understanding what needs to be built, measuring whether it was built correctly, and identifying gaps between current state and goals.

## Perspective

### What This Role Sees

- Whether accessibility requirements are defined in project scope and contracts
- Whether metrics exist to measure accessibility outcomes over time
- Whether time limits, error recovery, and CAPTCHA flows meet standards
- Whether procurement processes evaluate vendor accessibility
- Gaps between organizational goals and actual implementation

### What This Role Often Misses

- How requirements translate to actual code (ask Front-End Development)
- Whether content is clear and understandable (ask Content Authoring)
- Whether interactions work with a keyboard or screen reader (ask Testing)
- Whether the visual design supports accessibility (ask Visual Design)

### When to Bring This Role In

- At project kickoff to define accessibility requirements
- During procurement to evaluate vendor accessibility claims
- When metrics show declining accessibility scores
- When conflicts arise between accessibility goals and schedule/budget

## AI Persona Prompt

Use this prompt to get an AI agent to evaluate a website from this perspective:

```
You are a business analyst evaluating this website for accessibility requirements.
Your focus is on whether accessibility is properly defined, measured, and tracked.

Review the page and identify:
1. Missing or incomplete accessibility requirements in the content or structure
2. Areas where metrics could be defined but are not
3. Issues related to time limits, CAPTCHA, or error handling requirements
4. Opportunities to improve accessibility tracking and reporting

Frame each finding as a business requirement gap, not a code issue.
Reference specific WCAG success criteria where applicable.
```

## ARRM Task Summary

This role has limited tasks in the [W3C WAI ARRM](https://www.w3.org/WAI/planning/arrm/) data, reflecting that business analysis contributes to accessibility primarily through requirements and process rather than direct implementation.

### Primary Ownership (1)

- Alternate means of accessing CAPTCHA information are provided (IMG-016)

### Secondary Ownership (5)

- Users can prevent and correct form errors for legal/financial data (FRM-036, FRM-037, FRM-039)
- Time limits are manageable: users are notified and can extend (NAV-004, NAV-005)

### Contributor (3)

- Cognitive function tests provide alternatives (FRM-041, FRM-042)
- Timing is not essential to the event (ANM-031)

See [task-summary.md](./generated/task-summary.md) for full details.

## Collaboration Points

| Role | What to share | What to ask |
|------|---------------|-------------|
| Content Authoring | Plain language requirements | "Is this error message understandable?" |
| Front-End Dev | Implementation feasibility | "Can this requirement be met with current tech?" |
| Testing | Acceptance criteria | "How do we verify this requirement is met?" |
| UX Design | User research findings | "What do users actually need here?" |
| Visual Design | Design constraints | "Does this approach work visually?" |

## Key WCAG Criteria

- **3.3.4** — Error prevention for legal/financial data (AA)
- **2.2.1** — Timing adjustable (A)
- **1.1.1** — CAPTCHA alternatives (A)
- **2.2.6** — Timeouts (AAA)
