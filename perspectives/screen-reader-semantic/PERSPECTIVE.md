# Screen Reader and Semantic Access Perspective

## Scope

Examine how content and interactive elements are perceived by people who use screen readers (JAWS, NVDA, VoiceOver, TalkBack) and braille displays, and how semantic HTML structure supports their navigation.

## Common Barriers

- Missing or unhelpful `alt` text on meaningful images
- Landmark regions absent or duplicated, breaking orientation
- Custom widgets without correct ARIA roles, states, or properties
- Live region announcements that are missing, mistimed, or overly verbose
- Heading hierarchy that does not reflect document structure
- Form inputs without programmatically associated labels
- Focus order that does not match logical reading order
- Link or button text that is ambiguous out of context ("Click here", "Read more")

## Relevant Topic Skills

- `image-alt-text` — alt text for images, SVGs, icons
- `aria-live-regions` — dynamic content announcements
- `forms` — label association, error identification
- `navigation` — landmarks, skip links, heading hierarchy
- `content-design` — heading structure, link text, reading order
- `keyboard` — focus order, roving tabindex

## Questions to Ask

1. Does every meaningful image have `alt` text that conveys its purpose, not its appearance?
2. Are landmarks (`<main>`, `<nav>`, `<header>`, `<aside>`) present and unique?
3. Do custom widgets expose correct roles, states, and properties to the accessibility tree?
4. Are live region announcements limited to meaningful changes and use the correct politeness level?
5. Does heading hierarchy reflect the logical document outline?
6. Can the content be navigated by heading alone?
7. Are form errors associated with their inputs via `aria-describedby` or equivalent?

## Evidence That Can Be Gathered Automatically

- Missing `alt` attributes (axe-core `image-alt` rule)
- Missing form labels (axe-core `label` rule)
- Duplicate landmark IDs (axe-core `duplicate-id-active`, `duplicate-id-aria`)
- Heading hierarchy violations (axe-core `heading-order`)
- Empty links or buttons (axe-core `empty-heading`, `button-name`)

## Evidence That Requires Manual Testing

- Whether `alt` text is *meaningful* in context (automated tools detect absence, not quality)
- Whether live region announcements are timely and non-redundant
- Whether the screen reader reading order matches the intended logical order
- Whether heading hierarchy makes sense when navigating linearly

## When Direct Research with Disabled Users Is Needed

- When the content structure is complex (multi-level navigation, nested accordions) and it is unclear whether screen reader users can orient themselves
- When custom widgets do not match known ARIA patterns and it is uncertain whether the interaction model is understandable
- When live region behaviour interacts with focus management in ways that cannot be verified by automated testing alone

## Common False Assumptions

- "Adding `role="button"` makes a `<div>` fully accessible." It does not provide keyboard interaction, focus management, or native semantics.
- "Screen readers read everything in DOM order." Some AT users navigate by landmarks or headings, not linear reading.
- "Automated testing confirms screen reader compatibility." Automated tools detect structural issues; they do not confirm that announcements are meaningful or complete.

## Limitations of AI Analysis

- AI cannot verify what a screen reader actually announces in a specific context.
- AI cannot determine whether `alt` text is *appropriate* for the image's role in the content.
- AI cannot assess whether the reading order produces a coherent mental model.
- AI cannot determine whether live region announcements are helpful or overwhelming.

## Escalation Triggers

- Custom widget with no known ARIA pattern and uncertain interaction model
- Complex content structure where landmark or heading navigation may fail
- Live region behaviour that cannot be verified without screen reader testing
- Finding that conflicts between two WCAG criteria (e.g., decorative image vs. informative image)

## ARRM Task Relevance

This perspective informs findings related to:

- IMG tasks (image alternatives)
- ARIA tasks (live regions, widget roles)
- SCT tasks (content structure, reading order)
- INP tasks (form input labels and descriptions)

This perspective does not assign ownership. ARRM role assignments determine ownership.
