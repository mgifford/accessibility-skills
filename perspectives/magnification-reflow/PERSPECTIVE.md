# Magnification and Reflow Perspective

## Scope

Examine how content behaves when users magnify the page to 200-400%, use screen magnifiers, or rely on content reflow at narrow viewports. This perspective covers low-vision users who need enlarged text, sufficient spacing, and layouts that do not break or overlap when zoomed.

## Common Barriers

- Content that requires horizontal scrolling at 200% zoom
- Text that cannot be resized to 200% without loss of content or functionality
- Fixed-width containers that overflow when text is enlarged
- Line height, paragraph spacing, or letter/word spacing that cannot be adjusted
- Information conveyed solely by colour position or spatial layout (lost when content reflows)
- Images of text that do not reflow when magnified
- Overlapping elements at high zoom levels
- Touch targets that become inaccessible when content reflows

## Relevant Topic Skills

- `color-contrast` — contrast at various zoom levels, forced-colours mode
- `content-design` — reading order, content structure that survives reflow
- `image-alt-text` — text alternatives for images of text
- `print` — layout resilience
- `progressive-enhancement` — graceful degradation

## Questions to Ask

1. Does the content reflow without horizontal scrolling at 320 CSS pixels wide (WCAG 1.4.10)?
2. Can text be resized to 200% without assistive technology?
3. Do line height, paragraph spacing, letter spacing, and word spacing meet minimum requirements (WCAG 1.4.12)?
4. Is information lost when content reflows (e.g., multi-column layout that collapses)?
5. Are images of text avoided, or do they have text alternatives?
6. Do fixed-position elements (sticky headers, modals) remain usable at high zoom?

## Evidence That Can Be Gathered Automatically

- Text resize failures (axe-core `meta-viewport` checks for `user-scalable=no`)
- Reflow violations detected via viewport testing
- CSS analysis for fixed-width containers that may overflow
- Colour contrast at various text sizes

## Evidence That Requires Manual Testing

- Actual zoom to 200% and 400% to verify content remains accessible
- Verification that content reflows without horizontal scrolling at 320px width
- Confirmation that spacing properties can be overridden by user stylesheets
- Testing that overlapping elements do not obscure content at high zoom

## When Direct Research with Disabled Users Is Needed

- When the layout is complex (multi-column, grid, dashboard) and it is unclear whether reflow produces a usable reading order
- When content depends on spatial relationships that may be lost when reflowed
- When the interface uses fixed positioning extensively and it is uncertain whether zoom users can access all controls

## Common False Assumptions

- "Users can just zoom in." Zooming is one strategy; reflow and spacing adjustments are equally important. Some users need both.
- "Media queries handle all zoom scenarios." Media queries respond to viewport size, not user zoom. CSS `em`/`rem` units and relative sizing are more resilient.
- "Contrast ratios are the same at all sizes." Large text and small text have different contrast requirements; magnification changes which threshold applies.

## Limitations of AI Analysis

- AI can detect `user-scalable=no` but cannot verify that the layout actually reflows correctly at 200% zoom.
- AI can check CSS spacing properties but cannot confirm that user stylesheets can override them.
- AI cannot determine whether spatial information lost during reflow is essential to understanding.

## Escalation Triggers

- Complex grid or dashboard layout where reflow may break information relationships
- Content with extensive fixed positioning that may be inaccessible when zoomed
- Images of text that cannot be replaced with real text
- Multi-column layouts where collapse order may not match reading order

## ARRM Task Relevance

This perspective informs findings related to:

- CSS tasks (layout, spacing, overflow)
- VIS tasks (visual presentation)
- RFL tasks (reflow and responsive design)

This perspective does not assign ownership. ARRM role assignments determine ownership.
