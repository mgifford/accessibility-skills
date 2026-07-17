# User Experience Design

## What This Role Does

User experience design ensures that interactions, information architecture, and research are grounded in accessibility. This role determines how users navigate, what patterns they encounter, and whether the experience works for everyone — including people with cognitive, motor, and sensory disabilities.

## Also Known As

- UX designer
- Interaction designer
- User researcher
- Product designer
- Information architect
- Service designer

UX design has the **largest number of ARRM tasks** of any role, reflecting the reality that accessibility is fundamentally an experience concern.

## Perspective

### What This Role Sees

- Whether navigation patterns are logical and predictable
- Whether error states and success states are communicated clearly
- Whether forms guide users through completion
- Whether dynamic content updates are announced
- Whether timing and animation respect user preferences
- Whether personalization options exist (font size, contrast, motion)

### What This Role Often Misses

- Whether the code matches the design intent (ask Front-End Development)
- Whether the writing is clear and understandable (ask Content Authoring)
- Whether the visual contrast meets minimums (ask Visual Design)
- Whether the implementation works with real assistive technology (ask Testing)

### When to Bring This Role In

- At the earliest stages of any project — accessibility is a design concern, not just a development concern
- When choosing interaction patterns (use [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/) as a starting point)
- When designing forms, error flows, or time-limited interactions
- When planning personalization or accommodation features
- When user research reveals accessibility barriers

## AI Persona Prompt

Use this prompt to get an AI agent to evaluate a website from this perspective:

```
You are a UX designer reviewing this website for accessible interaction patterns.
Your focus is on whether the experience works for all users, including those with
cognitive, motor, and sensory disabilities.

Review the page and identify:
1. Navigation patterns that are unclear or inconsistent
2. Forms that don't guide users or provide clear error recovery
3. Interactive elements that don't communicate their state (expanded, selected, active)
4. Content that relies on timing, animation, or hover-only interactions
5. Missing skip links or landmark navigation
6. Tables that are hard to navigate without visual structure
7. Links that open new windows without warning
8. Missing or inadequate personalization options
9. Focus management issues in dynamic content (modals, accordions, tabs)

For each issue, explain the user impact and suggest the appropriate
WAI-ARIA Authoring Practices pattern that should be used instead.
```

## ARRM Task Summary

This role has the most ARRM tasks of any role, with **96 primary ownership** and **87 secondary ownership** tasks.

### Primary Ownership (96)

Key areas include:
- **Input** — Keyboard access, focus, touch targets (INP-001 through INP-026)
- **Forms** — Error handling, validation, autocomplete (FRM-011 through FRM-042)
- **Navigation** — Skip links, focus order, consistency (NAV-001 through NAV-032)
- **Tables** — Structure, complexity, relationships (TAB-002 through TAB-017)
- **Media** — Captions, audio descriptions, transcripts (ANM-003 through ANM-035)
- **Semantics** — Language, structure (SCT-001 through SCT-029)
- **Dynamics** — Live regions, status (DYN-001 through DYN-003)

### Secondary Ownership (87)

Supports tasks across all other roles, particularly Content Authoring and Front-End Development.

### Contributor (7)

Advises on focus indicators, target sizes, content reflow, and link purpose.

See [task-summary.md](./generated/task-summary.md) for full details.

## Collaboration Points

| Role | What to share | What to ask |
|------|---------------|-------------|
| Business Analysis | User research findings | "What do users actually need?" |
| Content Authoring | Interaction copy needs | "What should this error message say?" |
| Front-End Dev | Interaction patterns | "Is this pattern implementable?" |
| Testing | User journey maps | "Does the full flow work?" |
| Visual Design | Design system patterns | "Does this pattern support accessibility?" |

## Key WCAG Criteria

- **2.1.1** — Keyboard (A)
- **2.4.3** — Focus order (A)
- **2.4.7** — Focus visible (AA)
- **3.2.2** — On input (A)
- **3.3.3** — Error suggestion (AA)
- **3.3.4** — Error prevention — legal, financial, data (AA)
- **4.1.2** — Name, role, value (A)
