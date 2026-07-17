# Visual Design

## What This Role Does

Visual design ensures that the visual presentation of content is accessible — that color contrast meets minimums, that text remains readable when zoomed, that focus indicators are visible, and that information is not conveyed through visual means alone.

## Also Known As

- Visual designer
- UI designer
- Graphic designer
- Brand designer
- Motion designer

Visual design is sometimes mistaken for purely aesthetic work. In accessibility, it is a critical layer: the visual presentation determines whether users can read, perceive, and interact with content.

## Perspective

### What This Role Sees

- Whether text meets minimum contrast ratios (4.5:1 normal, 3:1 large)
- Whether non-text elements meet contrast requirements (icons, focus indicators, form borders)
- Whether information is conveyed through color alone
- Whether text remains readable at 200% zoom and 400% reflow
- Whether focus indicators are visible on interactive elements
- Whether animations respect `prefers-reduced-motion`
- Whether target sizes meet minimum requirements (24x24 CSS pixels)

### What This Role Often Misses

- Whether the HTML semantics match the visual presentation (ask Front-End Development)
- Whether content is clear and understandable (ask Content Authoring)
- Whether the interaction pattern works with keyboard and screen reader (ask UX Design)
- Whether the page works with real assistive technology (ask Testing)

### When to Bring This Role In

- At the start of any project — visual decisions have accessibility consequences
- When choosing color palettes or themes
- When designing focus indicators, hover states, or active states
- When designing for light mode, dark mode, and high contrast mode
- When creating icons, illustrations, or infographics

## AI Persona Prompt

Use this prompt to get an AI agent to evaluate a website from this perspective:

```
You are a visual designer reviewing this website for accessibility.
Your focus is on whether the visual presentation works for all users,
including those with low vision, color blindness, and contrast sensitivity.

Review the page and identify:
1. Color contrast failures (text, icons, focus indicators, form elements)
2. Information conveyed through color alone (no text alternative)
3. Text that overflows or gets truncated when zoomed to 200%
4. Missing or invisible focus indicators on interactive elements
5. Animations that cannot be reduced or stopped
6. Target sizes that are too small (below 24x24 CSS pixels)
7. Images of text that should be actual text
8. Content that reflows poorly at 400% zoom
9. High contrast mode issues (forced-colors media query)

For each issue, provide the specific CSS values needed for the fix
and reference the relevant WCAG success criterion.
```

## ARRM Task Summary

This role has **30 primary ownership** tasks, focused on visual presentation and non-text contrast.

### Primary Ownership (30)

Key areas include:
- **Images** — Text alternatives for visual content (IMG-018, IMG-021, IMG-022)
- **Input** — Focus indicators (INP-017)
- **Forms** — Visual labels, error presentation (FRM-022, FRM-031)
- **CSS** — Contrast, resize, reflow, target size, focus (CSS-006 through CSS-030)
- **Navigation** — Visual cues, tab indicators (NAV-001, NAV-027, NAV-029)
- **Media** — Timing, animation (ANM-033, ANM-034)
- **Semantics** — Visual presentation (SCT-016, SCT-027)

### Secondary Ownership (29)

Supports tasks primarily owned by Front-End Development and UX Design, particularly around contrast, focus, and target size.

### Contributor (7)

Advises on labels, input presentation, and dynamic content.

See [task-summary.md](./generated/task-summary.md) for full details.

## Collaboration Points

| Role | What to share | What to ask |
|------|---------------|-------------|
| Business Analysis | Brand requirements | "Can we meet contrast requirements with this palette?" |
| Content Authoring | Visual hierarchy needs | "Does this visual weight match the content importance?" |
| Front-End Dev | Design specs | "Does this focus indicator work in the implementation?" |
| Testing | Visual regression results | "Does the design hold up at 200% zoom?" |
| UX Design | Design system patterns | "Does this pattern support all states?" |

## Key WCAG Criteria

- **1.4.1** — Use of color (A)
- **1.4.3** — Contrast minimum (AA)
- **1.4.4** — Resize text (AA)
- **1.4.5** — Images of text (AA)
- **1.4.10** — Reflow (AA)
- **1.4.11** — Non-text contrast (AA)
- **1.4.12** — Text spacing (AA)
- **2.4.7** — Focus visible (AA)
- **2.4.13** — Focus appearance (AAA)
- **2.5.8** — Target size (minimum) (AA)
