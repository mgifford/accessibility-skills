# Front-End Development

## What This Role Does

Front-end development translates design and content into accessible HTML, CSS, and JavaScript. This role implements semantic markup, keyboard interactions, ARIA attributes, focus management, and all the technical aspects that make interfaces work for assistive technology users.

## Also Known As

- Front-end engineer
- Full-stack developer
- Accessibility specialist
- Back-end engineer
- DevOps engineer
- Web developer

Accessibility is fundamentally a development concern. The code determines whether semantic structure exists, whether keyboard navigation works, and whether assistive technologies can interpret the interface.

## Perspective

### What This Role Sees

- Whether semantic HTML elements are used correctly
- Whether all interactive elements are keyboard-accessible
- Whether focus management works in modals, dialogs, and dynamic content
- Whether ARIA attributes are used correctly (or at all)
- Whether the DOM order matches the visual order
- Whether tab order is logical and predictable
- Whether CSS does not break in high contrast or zoom modes

### What This Role Often Misses

- Whether the content makes sense (ask Content Authoring)
- Whether the interaction pattern is the right one for users (ask UX Design)
- Whether the visual design meets contrast requirements (ask Visual Design)
- Whether the implementation works with real assistive technology (ask Testing)

### When to Bring This Role In

- As early as possible — accessibility is easier to build than to retrofit
- When implementing any interactive component (buttons, modals, tabs, carousels)
- When CSS changes might affect color contrast or focus indicators
- When JavaScript adds dynamic content that screen readers need to know about

## AI Persona Prompt

Use this prompt to get an AI agent to evaluate a website from this perspective:

```
You are a front-end developer reviewing this website for accessibility implementation.
Your focus is on HTML semantics, keyboard support, ARIA, and CSS accessibility.

Review the page and identify:
1. Missing or incorrect semantic HTML (divs used where native elements exist)
2. Interactive elements that are not keyboard-accessible
3. Missing or incorrect ARIA roles, states, and properties
4. Focus management issues (traps, missing indicators, illogical order)
5. CSS that breaks in high contrast mode or at 200% zoom
6. JavaScript that creates dynamic content without ARIA live regions
7. Forms without proper label associations
8. Tables without headers or captions
9. Tab order issues (positive tabindex, focusable non-interactive elements)

For each issue, provide the specific code pattern that should be used instead.
Reference WCAG success criteria and relevant ARIA APG patterns.
```

## ARRM Task Summary

This role has the second-largest task set in the ARRM data, with **90+ primary ownership** tasks focused on implementation.

### Primary Ownership (90+)

Key areas include:
- **Images** — Decorative images, longdesc, dynamic image updates (IMG-003 through IMG-020)
- **Semantics** — HTML structure, headings, lists, landmarks (SEM-001 through SEM-029)
- **Input** — Keyboard access, focus, tab order (INP-004 through INP-025)
- **Forms** — Labels, fieldsets, error handling, autocomplete (FRM-001 through FRM-034)
- **CSS** — Icon fonts, contrast, resize, reflow, target size (CSS-002 through CSS-030)
- **Navigation** — Skip links, focus order, new windows (NAV-012 through NAV-031)
- **Tables** — Headers, scope, captions (TAB-001 through TAB-015)
- **Dynamics** — Live regions, status updates (DYN-001 through DYN-003)

### Secondary Ownership (87)

Supports tasks primarily owned by UX Design and Visual Design.

### Contributor (5)

Advises on confirmation screens, focus indicators, target sizes, logical headings, and emoticon alternatives.

See [task-summary.md](./generated/task-summary.md) for full details.

## Collaboration Points

| Role | What to share | What to ask |
|------|---------------|-------------|
| Business Analysis | Technical feasibility | "Can this requirement be implemented?" |
| Content Authoring | Semantic structure needs | "Is this HTML matching the content intent?" |
| Testing | Implementation details | "How is this component coded?" |
| UX Design | Interaction implementation | "Does this match the intended behavior?" |
| Visual Design | CSS implementation | "Does this code match the design spec?" |

## Key WCAG Criteria

- **1.3.1** — Info and relationships (A)
- **2.1.1** — Keyboard (A)
- **2.1.2** — No keyboard trap (A)
- **2.4.3** — Focus order (A)
- **2.4.7** — Focus visible (AA)
- **4.1.2** — Name, role, value (A)
