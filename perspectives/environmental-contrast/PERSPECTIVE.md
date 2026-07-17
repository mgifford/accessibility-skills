# Environmental Contrast Perspective

## Scope

Examine how colour, contrast, and visual presentation affect people with low vision, colour vision deficiency, or those viewing screens in challenging lighting conditions (bright sunlight, dim rooms). This perspective covers WCAG contrast requirements and the use of colour as information.

## Common Barriers

- Text that does not meet minimum contrast ratios against its background
- UI components (borders, icons, focus indicators) that do not meet 3:1 non-text contrast
- Information conveyed by colour alone with no secondary cue
- Low-contrast text or UI elements in dark mode that were designed for light mode
- Focus indicators that are invisible against adjacent colours
- Forced-colours (high contrast) mode that removes author styling and breaks meaning
- Colour-coded status indicators (red/green) without text or icon alternatives
- Links in body text that are distinguished only by colour

## Relevant Topic Skills

- `color-contrast` — text contrast, non-text contrast, forced-colours mode
- `light-dark-mode` — theme switching, contrast in both modes
- `content-design` — non-colour cues for information
- `charts-graphs` — colour in data visualisation
- `image-alt-text` — text alternatives for colour-dependent graphics

## Questions to Ask

1. Does all normal text meet 4.5:1 contrast against its background?
2. Does all large text (18pt+ or 14pt+ bold) meet 3:1 contrast?
3. Do UI components, icons, and focus indicators meet 3:1 non-text contrast?
4. Is colour ever the sole means of conveying information?
5. Are contrast ratios verified in both light and dark modes?
6. Are contrast ratios verified in forced-colours (Windows High Contrast) mode?
7. Are links in body text distinguishable without relying on colour?

## Evidence That Can Be Gathered Automatically

- Text contrast failures (axe-core `color-contrast`)
- Non-text contrast failures (axe-core `non-text-contrast`)
- Use of colour alone (axe-core `color-contrast` heuristic)
- Missing `prefers-color-scheme` media query for dark mode

## Evidence That Requires Manual Testing

- Verification that contrast ratios hold in actual dark mode rendering
- Confirmation that forced-colours mode preserves meaning
- Testing that colour-coded information has text alternatives visible in all modes
- Verification that focus indicators are visible against all adjacent backgrounds

## When Direct Research with Disabled Users Is Needed

- When the interface relies heavily on colour-coded information and it is uncertain whether secondary cues are sufficient
- When the design system uses colour tokens that may not have adequate contrast in all combinations
- When the interface is used outdoors or in variable lighting and ambient light performance matters

## Common False Assumptions

- "Meeting contrast ratios in light mode is sufficient." Dark mode and forced-colours mode may fail even if light mode passes.
- "Colour contrast is only about text." UI component boundaries, icons, focus indicators, and data visualisation elements also need 3:1 contrast.
- "Using red and green is fine if there are icons." The icons must be present, visible, and meaningful without colour.

## Limitations of AI Analysis

- AI can compute contrast ratios from CSS values but cannot verify rendering in forced-colours mode.
- AI can detect when colour is the only cue in HTML but cannot assess visual design decisions in images or canvas.
- AI cannot determine whether secondary cues (icons, text labels) are semantically meaningful or merely decorative.

## Escalation Triggers

- Colour-coded data visualisation where it is uncertain whether colourblind users can distinguish data series
- Interface that relies on colour to convey status across many components
- Design system with colour tokens that may not have adequate contrast in all theme combinations
- Finding that forced-colours mode removes essential visual meaning

## ARRM Task Relevance

This perspective informs findings related to:

- CSS tasks (colour, contrast, theme)
- VIS tasks (visual presentation)
- DYN tasks (dynamic colour changes, status indicators)

This perspective does not assign ownership. ARRM role assignments determine ownership.
