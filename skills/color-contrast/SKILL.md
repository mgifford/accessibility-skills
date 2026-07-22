---
name: color-contrast
description: >
  Load this skill whenever the project contains text, UI components, icons, form
  controls, data visualisations, or focus indicators — in short, almost every
  project. Under no circumstances hard-code colour values without verifying
  contrast ratios. Absolutely always ensure text meets 4.5:1, large text meets
  3:1, and non-text UI elements meet 3:1 against adjacent colours. Test in light
  mode, dark mode, and forced-colors (high contrast) mode.
---

# Color Contrast Accessibility Skill

> **Canonical source**: `examples/COLOR_CONTRAST_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules whenever implementing or reviewing colour choices in HTML, CSS,
SVG, or any visual interface element.

---

## Core Mandate

Sufficient contrast between foreground and background colors is a prerequisite
for users to read text, identify UI components, perceive graphical content, and
track keyboard focus. **Color alone must never be the sole means of conveying
information.** Contrast depends on the colors actually adjacent after opacity,
gradients, images, overlays, states, and themes are applied — a passing palette
is not proof the finished interface passes.

All visual interface elements that convey information or require user interaction
must meet WCAG 2.2 Level AA contrast thresholds in **light mode, dark mode, and
forced-colors (high contrast) mode**.

---

## Severity Scale (this skill)

| Level | Meaning |
| --- | --- |
| **Critical** | Contrast failure makes content or interaction completely inaccessible |
| **Serious** | Contrast failure significantly impairs access for a disability group |
| **Moderate** | Contrast issue degrades usability but content remains partially accessible |
| **Minor** | Best-practice gap; marginal impact |

Prioritize by user impact when time is limited: (1) text/controls required to
complete a task, (2) keyboard focus indicators and component states, (3)
errors/warnings/required fields/status messages, (4) navigation/links/labels,
(5) charts and information-bearing graphics, (6) supporting/secondary content.

---

## Critical: Text Contrast (WCAG 1.4.3)

| Text type | Minimum (AA) | Enhanced (AAA) |
| --- | :---: | :---: |
| Normal text (below 18pt / 14pt bold) | **4.5:1** | 7:1 |
| Large text (18pt+ or 14pt+ bold) | **3:1** | 4.5:1 |
| Logotypes / purely decorative text | Exempt | Exempt |
| Disabled controls | Exempt | Exempt |

**"Large text"** means 18pt (≈ 24 CSS `px`) or larger at normal weight, or
14pt (≈ 18.67 CSS `px`) or larger in bold. WCAG thresholds are pass/fail — do
not round 4.499:1 up to 4.5:1. Treat thin or unusual typefaces cautiously — a
combination can meet the computed threshold but stay hard to read due to
narrow strokes.

The requirement covers body text, headings, link text, button/form labels,
**placeholder text**, text revealed on hover/focus, validation/status
messages, and text rendered as an image. Do not extend the logotype/decorative
exception to brand colors used for ordinary content.

If CSS specifies only a foreground or only a background, the other side may
come from an unknown user preference — always specify both sides of a color pair:

```css
html { background: #ffffff; color: #1b1f23; }
.notice { background: #f2f6fa; color: #243447; }
```

```css
/* Bad — fails 1.4.3 */
.placeholder { color: #aaaaaa; }
.note { color: #888; }
```

Prefer real text over images of text (WCAG 1.4.5) — it reflows, resizes, and
adapts to themes; use an image of text only when the presentation is
customizable or essential.

---

## Serious: Non-text Contrast (WCAG 1.4.11)

Visual information needed to identify a UI component or its state, and parts
of a graphic needed to understand it, need **3:1 contrast** against adjacent
colors. Examples: a checkbox boundary that identifies the control, a check
mark communicating checked state, an icon in an icon-only button, a slider
thumb/track, an error boundary, and chart lines/sectors/symbols needed to
read it.

This does not mean every decorative border must hit 3:1 — if text, shape,
position, or another treatment already identifies the component/state, a
low-contrast decorative border isn't necessarily the required information.
Does not apply to: purely decorative graphics, inactive/disabled components,
logos/brand marks, or graphics supplementary to adjacent text.

Native controls are a strong default — browsers/OS adapt them to user
preferences; replacing them creates responsibility for every state and mode:

```css
.checkbox {
  appearance: none;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  border: 2px solid #59636e; /* test against surrounding background */
  border-radius: 0.2rem;
}
.checkbox:checked {
  border-color: #005ea8;
  background-color: #005ea8;
}
```

Test the unchecked boundary against its background, the checked fill against
the surrounding background, AND the check mark against the checked fill — do
not rely on a code comment claiming a pair passes; measure the rendered
combination. Use `currentColor` for icon strokes so they adapt with the
button's text color.

---

## Serious: Use of Color (WCAG 1.4.1)

Color alone must not be the sole means of conveying information, prompting a
response, or distinguishing an element. Add a visible text, shape, pattern,
icon, or other non-color cue whenever color carries meaning.

```html
<!-- Bad: required/error indicated only by color -->
<label style="color: red;">Email address</label>
<input type="email" style="border-color: red;">

<!-- Good: icon + text + color + aria-invalid -->
<div class="field" data-state="error">
  <label for="email">Email address <span aria-hidden="true">(required)</span></label>
  <input id="email" type="email" required aria-invalid="true" aria-describedby="email-error">
  <p id="email-error" class="error-message">
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path d="M12 3 2 21h20L12 3Zm0 6v5m0 3v.01"></path>
    </svg>
    Enter an email address in the format name@example.com.
  </p>
</div>
```

**Links in body text** must be distinguishable from surrounding text by more
than color — underlining is the simplest dependable pattern:

```css
a {
  color: #005ea8;
  text-decoration-line: underline;
  text-decoration-thickness: max(1px, 0.08em);
}
```

A documented exception (WCAG technique G183) permits links without a default
underline when link text differs from surrounding text by ≥3:1 and gains a
non-color cue on hover/focus — this is harder to maintain; prefer persistent
underlines in prose. Charts/status indicators need labels, symbols, line
styles, or patterns in addition to color — a separate text-equivalent table
does not excuse the graphic itself from contrast requirements.

---

## Serious: Keyboard Focus Appearance

WCAG 2.2 AA requires a visible focus indicator (2.4.7). **2.4.13 Focus
Appearance is Level AAA** — do not present its area/contrast-change formula as
an AA requirement. WCAG 1.4.11 may still apply to an author-created focus
indicator as the visual information identifying the focused state.

```css
/* Start with the browser default; don't remove without a tested replacement */
:focus-visible {
  outline: 3px solid #005fcc;
  outline-offset: 3px;
}

/* Two-color indicator — more robust across light/dark surfaces */
:focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 2px;
  box-shadow: 0 0 0 5px #111111;
}
@media (forced-colors: active) {
  :focus-visible {
    outline: 3px solid Highlight;
    box-shadow: none;
  }
}
```

```css
/* NEVER do this without a tested replacement */
:focus { outline: none; }
```

Do not add `:focus:not(:focus-visible) { outline: none; }` as a universal
rule — browsers already determine when `:focus-visible` matches, and a
blanket suppression is risky. Test the indicator's geometry, clipping, and
adjacent colors on every surface and component state.

---

## Serious: Forced-Colors Mode

Windows High Contrast Mode / `forced-colors` replaces author colors with
system colors. Interfaces break when `background-color`, `box-shadow`, or
`color` are the sole means of conveying meaning — `outline` survives
forced-colors; `box-shadow` may be suppressed.

```css
@media (forced-colors: active) {
  .status-icon, .icon-button svg { fill: none; stroke: currentColor; }
  [aria-current="page"] { border-block-end: 0.25rem solid currentColor; }
  [aria-invalid="true"] { border: 3px solid Mark; }
}
```

Use native controls and semantic HTML first; add targeted corrections only
where testing shows information disappears. Avoid `forced-color-adjust: none`
unless preserving author colors is essential and tested against multiple
user-selected system palettes — it opts the element out of the mode's protections.

**Testing:** enable Windows High Contrast in Accessibility settings; Chrome
DevTools → Rendering → "Emulate CSS media feature forced-colors: active";
Firefox `about:config` → `ui.forcedColors: 1`.

---

## Moderate: Themes and Semantic Color Tokens

Validate complete foreground-background pairs, not isolated colors. Semantic
tokens make intended pairings explicit:

```css
:root {
  color-scheme: light dark;
  --surface: light-dark(#ffffff, #15191e);
  --text: light-dark(#1b1f23, #f4f6f8);
  --link: light-dark(#005ea8, #73b7f2);
  --control-border: light-dark(#59636e, #a7b0ba);
}
html { background: var(--surface); color: var(--text); }
.card { background: var(--surface); color: var(--text); border: 1px solid var(--control-border); }
```

`light-dark()` is useful when the project's browser support policy permits
it; provide a custom-property fallback for older browsers. See
`skills/light-dark-mode/SKILL.md` for a manual theme-selector implementation.

**Do not assume CSS color functions guarantee accessibility** — `color-mix()`
creates a color between two inputs but doesn't target a WCAG ratio;
`contrast-color()` picks from a limited result set in current implementations
and doesn't replace validating text/component/state requirements. Treat both
as implementation aids, not conformance tests.

```css
/* Bad: hard-coded value that may fail in dark mode */
.card { background-color: #ffffff; color: #333; }
```

---

## Serious: Variable Backgrounds, Opacity, and Overlays

For text over a gradient, image, video, or translucent surface, test the
**least favorable rendered region** that can occur in normal use. Use an
opaque or sufficiently opaque backing surface when the underlying content
can't be controlled:

```css
.hero-title {
  display: inline;
  padding: 0.15em 0.35em;
  color: #ffffff;
  background: #16202a;
  box-decoration-break: clone;
}
```

Be careful with `opacity` on a parent element — it blends text and background
with whatever is behind the component, changing both sides of the contrast
pair:

```css
/* Avoid: reduces opacity of the whole component */
.secondary-card { opacity: 0.6; }
/* Prefer: explicit, validated colors */
.secondary-card { background: #f2f6fa; color: #4d5966; }
```

Automated tools may report variable backgrounds as "incomplete" — that's a
limitation of the test, not evidence the content passes.

---

## Moderate: States That Need Separate Validation

Check each component in every state users can encounter: default, hover,
keyboard focus, active/pressed, selected/checked, visited, invalid/error,
success/warning/informational, disabled/inactive, browser autofill, text
selection, and open/expanded/current. Repeat across every supported theme.

**Disabled controls** are excepted from 1.4.3/1.4.11's specific ratios, but
the exception is not a design target: keep disabled controls identifiable
when practical; do not communicate the disabled state by color alone; explain
why a control is unavailable when needed; consider whether disabling is
necessary at all (a submit attempt with clear validation can be easier to
understand than an unexplained unavailable button).

```html
<button type="submit" disabled aria-describedby="submit-help">Submit</button>
<p id="submit-help">Add at least one contact before submitting.</p>
```

---

## Moderate: User Contrast Preferences

`prefers-contrast` and `forced-colors` address different situations — neither
is a light/dark theme selector. Use `prefers-contrast: more` as an
enhancement; the default presentation must already meet the conformance target:

```css
@media (prefers-contrast: more) {
  :root { --text-muted: var(--text); --control-border: currentColor; }
  a { text-decoration-thickness: 0.15em; }
  :focus-visible { outline-width: 4px; }
}
```

---

## Minor: APCA — Emerging Standard (Not Yet Required)

The Advanced Perceptual Contrast Algorithm (APCA) is a candidate replacement
for the WCAG 2.x contrast formula in WCAG 3.0, modeling perception more
accurately for thin strokes and small text. **APCA is not yet required** —
teams experimenting with it must continue meeting WCAG 2.2 AA in parallel.
Do not present fixed APCA thresholds as current WCAG requirements; treat
experimental methods as supplemental design evidence only.

---

## Testing

**Manual:** inspect actual rendered foreground/background colors (not
source-code values); measure text pairs without rounding; identify the visual
information required to find each component/state and measure it against the
relevant adjacent color; tab through and inspect focus on every background;
test all themes and component states; test Windows High Contrast/forced-colors
emulation; inspect gradients, images, opacity, overlays, sticky content, and
text selection manually. Grayscale/color-vision simulations are a review aid,
not a replacement for standards-based testing or lived experience.

**Automated:**

```js
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const theme of ["light", "dark"]) {
  test(`automated accessibility scan: ${theme}`, async ({ page }) => {
    await page.goto("/");
    await page.locator("html").evaluate((el, value) => { el.dataset.theme = value; }, theme);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
```

Automated tools can find many computable text contrast failures but cannot
reliably determine every background, required graphical detail, color-only
distinction, focus-indicator geometry, or forced-colors failure — use
automation to support manual review, not replace it. `focus-visible` and
`focus-order-semantics` are **not real axe-core rule IDs** — don't cite them;
keyboard focus appearance requires manual testing (see `skills/axe-rules/SKILL.md`
for the actual rule set).

**Design tokens:** maintain an explicit list of approved token pairings and
test those pairs when tokens change — don't test every token against every
other token, since many combinations aren't valid uses. Runtime tests are
still required because component CSS can introduce opacity/overlays that
token tests don't cover.

---

## Definition of Done Checklist

* [ ] All normal text meets 4.5:1 contrast in light and dark modes (or documented exception)
* [ ] All large text meets 3:1 contrast in light and dark modes
* [ ] Form controls, icons, and data-viz elements meet 3:1 non-text contrast
* [ ] No information conveyed by color alone — icon + text + color used together
* [ ] Links in body text are distinguishable from surrounding text without color
* [ ] Focus indicators use `outline`, meet 3:1 contrast, and are visible in all modes/surfaces
* [ ] Color tokens defined as CSS custom properties; no hard-coded values in components
* [ ] Every supported theme and component state tested (hover, focus, active,
      selected, visited, error, disabled, autofill, text selection)
* [ ] Text over gradients/images/overlays tested at the least favorable region
* [ ] Forced-colors / Windows High Contrast Mode tested — no meaning lost
* [ ] axe-core `color-contrast` rule passes in CI (manual review still required)
* [ ] Disabled controls clearly distinguished from enabled controls beyond opacity/color alone
* [ ] Approved design-token pairings documented and tested

---

## Key WCAG Criteria

* 1.4.1 Use of Color (A) — **Serious if failing**
* 1.4.3 Contrast Minimum (AA) — **Critical if failing for normal text**
* 1.4.5 Images of Text (AA)
* 1.4.6 Contrast Enhanced (AAA)
* 1.4.11 Non-text Contrast (AA) — **Serious if failing**
* 2.4.7 Focus Visible (AA)
* 2.4.13 Focus Appearance (AAA, WCAG 2.2) — not an AA requirement

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/COLOR_CONTRAST_ACCESSIBILITY_BEST_PRACTICES.md)
* [WCAG 2.2 Understanding 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
* [WCAG 2.2 Understanding 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
* [WCAG 2.2 Understanding 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
* [WCAG 2.2 Understanding 2.4.13 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
* [Technique G183: Links identified by color plus another cue](https://www.w3.org/WAI/WCAG22/Techniques/general/G183)
* [Technique C40: Two-color focus indicator](https://www.w3.org/WAI/WCAG22/Techniques/css/C40)
* [Media Queries Level 5: `prefers-contrast`](https://www.w3.org/TR/mediaqueries-5/#prefers-contrast)
* [APCA contrast tool](https://apcacontrast.com/)

> **Standards horizon:** WCAG 3.0's proposed APCA will replace the current
> luminance-ratio model with a perceptual contrast model. Do not apply APCA
> to production conformance work until WCAG 3.0 is a published standard.
> Monitor: <https://www.w3.org/TR/wcag-3.0/> and <https://git.apcacontrast.com/>
