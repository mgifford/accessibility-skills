---
name: light-dark-mode
description: >
  Load this skill whenever the project supports light/dark mode, colour theme
  switching, high-contrast mode, or responds to prefers-color-scheme. Under no
  circumstances hard-code colours that break in alternative themes. Absolutely
  always test colour contrast in both light and dark themes, and respect user
  OS-level colour preferences via CSS media queries.
---

# Light/Dark Mode Accessibility Skill

> **Canonical source**: `examples/LIGHT_DARK_MODE_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules whenever implementing or reviewing colour theme support in
HTML, CSS, or JavaScript.
**Only load this skill if the project supports light/dark mode or user theme switching.**

---

## Core Mandate

All colour themes **must** meet WCAG 2.2 Level AA contrast in **both** light and
dark modes, including forced-colours / high contrast modes. Test all three —
not just the default.

## Modern CSS Color System Best Practices (2026)

1. Use `color-scheme` on `:root`. Start with `color-scheme: light dark;` so native form controls, scrollbars, and built-in surfaces match the active scheme.
2. Prefer `light-dark()` for theme tokens. Put colour choices in custom properties once and let CSS resolve the current scheme instead of duplicating every component rule.
3. Use `contrast-color()` for adaptive components that need automatic foregrounds against a known background. Treat it as an enhancement, not a guarantee.
4. Keep `prefers-color-scheme` for specialized cases, older browsers, and explicit overrides. It is still useful, but it should not be the only theming strategy.
5. Test with real users and accessibility tools. Verify light mode, dark mode, forced-colors, high contrast, and manual WCAG contrast before shipping.

---

## Severity Scale (this skill)

| Level | Meaning |
| --- | --- |
| **Critical** | Colour theme makes content or interaction completely inaccessible |
| **Serious** | Contrast or mode failure significantly impairs access for a disability group |
| **Moderate** | Theme degrades usability but content remains partially accessible |
| **Minor** | Best-practice gap; marginal impact |

---

## Required: CSS Custom Properties Pattern

Always use CSS custom properties for theme tokens. Declare `color-scheme: light dark;` on `:root` so the browser can render native controls in the right palette. Prefer `light-dark()` for token values, and use `prefers-color-scheme` only as a fallback or specialized override.

```css
:root {
  color-scheme: light dark;

  --color-text:       #1a1a1a;
  --color-background: #ffffff;
  --color-surface:    #f7f7f7;
  --color-link:       #0066cc;
  --color-focus:      #004499;
  --color-border:     #cccccc;
  --color-hover:      #f5f5f5;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-text:       #e8e8e8;
    --color-background: #121212;
    --color-surface:    #1b1b1b;
    --color-link:       #66aaff;
    --color-focus:      #9bd1ff;
    --color-border:     #444444;
    --color-hover:      #262626;
  }
}

@supports (color: light-dark(#000, #fff)) {
  :root {
    --color-text:       light-dark(#1a1a1a, #e8e8e8);
    --color-background: light-dark(#ffffff, #121212);
    --color-surface:    light-dark(#f7f7f7, #1b1b1b);
    --color-link:       light-dark(#0066cc, #66aaff);
    --color-focus:      light-dark(#004499, #9bd1ff);
    --color-border:     light-dark(#cccccc, #444444);
    --color-hover:      light-dark(#f5f5f5, #262626);
  }
}

/* Manual overrides can still narrow the active scheme when a user chooses one. */
[data-theme="light"] { color-scheme: light; }
[data-theme="dark"]  { color-scheme: dark; }
```

Component styles should continue to read from the tokens above rather than hardcode colour values.

---

## Serious: Contrast Ratios in Both Modes

**Check all of the following in both light and dark modes.** Contrast that
passes in light mode frequently fails in dark mode when colours are inverted
naively.

| Element | Minimum ratio | Severity if failing |
| --- | --- | --- |
| Normal text | 4.5:1 | Serious |
| Large text (18pt+ / 14pt+ bold) | 3:1 | Moderate |
| UI components and graphical objects | 3:1 | Moderate |
| Focus indicators | 3:1 against adjacent colours | Serious |

---

## Optional: Manual Theme Override (Tri-Mode)

Most projects should rely on `color-scheme` and `light-dark()` for defaults. Add
manual controls only when users need a persistent override.

If you provide a control, use a three-option selector: `light`, `dark`, and
`system`.

* **Control semantics:** use `role="radiogroup"` with three `role="radio"` options so the selected state is explicit via `aria-checked`.
* **Selected-state management:** implement roving `tabindex` so only the selected option has `tabindex="0"`; all others use `tabindex="-1"`.
* **Keyboard behavior:** radiogroup is a single Tab stop; support Arrow keys, Home/End, Space, and Enter.
* **System behavior:** when selected mode is `system`, resolve the visual theme from `prefers-color-scheme` and auto-update on OS/browser preference changes.
* **DOM order:** place the control after nav/menu items in tab order.
* **Positioning:** do not make the control fixed or sticky.
* **Icon safety:** use SVG with `currentColor` so icons stay theme-safe and forced-colors-safe.

```html
<header>
  <nav aria-label="Main navigation">
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>

  <div id="theme-mode-group" role="radiogroup" aria-label="Colour theme">
    <button
      type="button"
      class="theme-mode-btn"
      role="radio"
      aria-checked="false"
      tabindex="-1"
      data-theme-value="light">
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20">
        <circle cx="12" cy="12" r="5" fill="currentColor"/>
      </svg>
      <span>Light</span>
    </button>

    <button
      type="button"
      class="theme-mode-btn"
      role="radio"
      aria-checked="false"
      tabindex="-1"
      data-theme-value="dark">
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20">
        <path fill="currentColor" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
      </svg>
      <span>Dark</span>
    </button>

    <button
      type="button"
      class="theme-mode-btn"
      role="radio"
      aria-checked="true"
      tabindex="0"
      data-theme-value="system">
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20">
        <path fill="none" stroke="currentColor" stroke-width="2" d="M3 4h18v12H3zM8 20h8"/>
      </svg>
      <span>System</span>
    </button>
  </div>
</header>
```

---

## Moderate: Theme Persistence — Safe localStorage + System Mode

`localStorage` can be unavailable (private browsing, sandboxed iframes,
storage-restricted environments). Always wrap reads/writes in `try/catch` so
theme switching never crashes.

```js
const themeModeButtons = document.querySelectorAll('.theme-mode-btn');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const modeOrder = ['light', 'dark', 'system'];

function getStoredMode() {
  try {
    return localStorage.getItem('theme-mode');
  } catch {
    return null;
  }
}

function setStoredMode(mode) {
  try {
    localStorage.setItem('theme-mode', mode);
  } catch {
    // Storage unavailable; preference still works for current session.
  }
}

let mode = getStoredMode() || 'system';

function resolveTheme(activeMode) {
  if (activeMode === 'system') {
    return prefersDarkScheme.matches ? 'dark' : 'light';
  }
  return activeMode;
}

function updateSelection(activeMode) {
  themeModeButtons.forEach((button) => {
    const checked = button.dataset.themeValue === activeMode;
    button.setAttribute('aria-checked', checked ? 'true' : 'false');
    button.setAttribute('tabindex', checked ? '0' : '-1');
  });
}

function applyMode(activeMode) {
  const resolvedTheme = resolveTheme(activeMode);
  document.documentElement.setAttribute('data-theme-mode', activeMode);
  document.documentElement.setAttribute('data-theme', resolvedTheme);
  updateSelection(activeMode);
}

function getModeIndex(activeMode) {
  return modeOrder.indexOf(activeMode);
}

function focusModeByIndex(index) {
  const normalizedIndex = (index + modeOrder.length) % modeOrder.length;
  const nextMode = modeOrder[normalizedIndex];
  const nextButton = document.querySelector(`[data-theme-value="${nextMode}"]`);

  if (!nextButton) {
    return;
  }

  mode = nextMode;
  setStoredMode(mode);
  applyMode(mode);
  nextButton.focus();
}

themeModeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    mode = button.dataset.themeValue;
    setStoredMode(mode);
    applyMode(mode);
  });

  button.addEventListener('keydown', (event) => {
    const currentIndex = getModeIndex(mode);

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        focusModeByIndex(currentIndex + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        focusModeByIndex(currentIndex - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusModeByIndex(0);
        break;
      case 'End':
        event.preventDefault();
        focusModeByIndex(modeOrder.length - 1);
        break;
      case ' ':
      case 'Enter':
        event.preventDefault();
        mode = button.dataset.themeValue;
        setStoredMode(mode);
        applyMode(mode);
        break;
      default:
        break;
    }
  });
});

prefersDarkScheme.addEventListener('change', () => {
  if (mode === 'system') {
    applyMode('system');
  }
});

applyMode(mode);
```

---

## Serious: Forced-Colors / Windows High Contrast Mode

Windows High Contrast Mode (WHCM) is a critical accessibility mode for users
with low vision and light sensitivity. It overrides all CSS colours and
backgrounds with a small set of system colours, and removes many visual effects.

### What WHCM removes

The following CSS features are **silently discarded** in forced-colors mode —
if your UI relies on them to convey meaning, it will be broken for WHCM users:

* `box-shadow` (including focus rings implemented as box-shadow)
* `text-shadow`
* `background-image` (gradients, patterns, decorative images)
* `background-color` on non-interactive elements
* `border-color` set to `transparent`
* CSS `filter` and `backdrop-filter`
* `opacity` partially (elements may become fully opaque)

### Do not use these to convey meaning

Never rely on any of the above to communicate state, boundaries, hierarchy,
or interactivity. Examples of **problematic patterns**:

```css
/* Bad: focus ring implemented with box-shadow — invisible in WHCM */
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px #005fcc;
}

/* Bad: disabled state shown only by reduced opacity */
button:disabled { opacity: 0.4; }

/* Bad: card boundary shown only by box-shadow */
.card { box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
```

```css
/* Good: focus ring uses outline — survives forced-colors */
:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

/* Good: disabled state has both opacity AND border change */
button:disabled {
  opacity: 0.4;
  border: 2px solid currentColor;
}

/* Good: card boundary uses border, not shadow */
.card { border: 1px solid var(--color-border); }
```

### Forced-colors CSS

Use the `forced-colors` media query to restore meaning lost when colours are
overridden. Use only [CSS system colour keywords](https://www.w3.org/TR/css-color-4/#css-system-colors):

```css
@media (forced-colors: active) {
  /* Restore card boundaries lost when background-color is overridden */
  .card {
    border: 1px solid CanvasText;
  }

  /* Restore table row separation lost when zebra-stripe backgrounds disappear */
  tbody tr {
    border-bottom: 1px solid CanvasText;
  }

  /* Restore focus ring if it was implemented as box-shadow */
  :focus-visible {
    outline: 2px solid Highlight;
    outline-offset: 2px;
  }

  /* Restore button appearance */
  button {
    color: ButtonText;
    background-color: ButtonFace;
    border: 1px solid ButtonText;
    forced-color-adjust: none; /* Opt out for elements needing full control */
  }

  /* Status indicators that used background colour */
  .status-error   { border: 2px solid LinkText; }
  .status-success { border: 2px solid CanvasText; }
  .status-warning { border: 2px solid Highlight; }
}
```

### `forced-color-adjust: none`

Use `forced-color-adjust: none` sparingly — only on elements where you need
to preserve specific colours (e.g., a colour swatch tool, a data visualisation).
Overusing it defeats the purpose of forced-colours mode.

---

## Required: Colour Independence

Never convey information by colour alone. Every status indicator needs icon +
text label + colour:

```html
<!-- Good: three independent signals -->
<div class="status status-error">
  <svg role="img" aria-label="Error" focusable="false">
    <use href="#icon-warning"/>
  </svg>
  <span>Payment failed</span>
</div>

<!-- Bad: colour is the only signal — invisible in WHCM and to CVD users -->
<div class="status-error">Payment failed</div>
```

---

## Required: SVG Icons

Use `currentColor` so icons inherit theme colour and respond to forced-colours:

```html
<svg viewBox="0 0 24 24" class="icon" aria-hidden="true" focusable="false">
  <path fill="currentColor" d="…"/>
</svg>
```

For images with transparency that need to work across modes:

```html
<picture>
  <source srcset="logo-dark.svg"
          media="(prefers-color-scheme: dark)">
  <img src="logo-light.svg" alt="Company logo">
</picture>
```

---

## Required: Focus Indicators in All Modes

```css
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

* Minimum 3:1 contrast against adjacent colours
* At least 2px thick
* Must be visible in light mode, dark mode, and forced-colours mode
* **Never implement focus rings as `box-shadow` alone** — they vanish in WHCM

---

## Required: Motion

```css
* { transition: background-color 0.2s ease, color 0.2s ease; }

@media (prefers-reduced-motion: reduce) {
  * { transition: none; }
}
```

Never auto-animate theme changes based on time of day.

---

## Moderate: `contrast-color()` for Adaptive Components

Use `contrast-color()` for buttons, badges, tags, status indicators, and other dynamically themed components whose background comes from a token.

```css
:root {
  color-scheme: light dark;

  --button-bg:         light-dark(#005fcc, #66aaff);
  --badge-bg:          light-dark(#0f766e, #14b8a6);
  --tag-bg:            light-dark(#6d28d9, #8b5cf6);
  --status-success-bg: light-dark(#166534, #22c55e);
  --status-warning-bg: light-dark(#b45309, #f59e0b);
}

.button,
.badge,
.tag,
.status {
  background-color: var(--component-bg);
  color: white;
  border: 1px solid transparent;
}

.button { --component-bg: var(--button-bg); }
.badge { --component-bg: var(--badge-bg); }
.tag { --component-bg: var(--tag-bg); }
.status-success { --component-bg: var(--status-success-bg); }
.status-warning { --component-bg: var(--status-warning-bg); }

@supports (color: contrast-color(red)) {
  .button,
  .badge,
  .tag,
  .status {
    color: contrast-color(var(--component-bg));
    border-color: contrast-color(var(--component-bg));
  }
}
```

Practical uses include brand buttons, generated badges, tags, status pills, and cards that receive their background from data or theme tokens.

`contrast-color()` is not a replacement for testing. It currently returns only `black` or `white`, so mid-tone colours can still be problematic in practice. Automating the foreground choice helps, but it is only an enhancement, not a guarantee. Manual WCAG contrast checks still apply.

---

## Moderate: `color-mix()` for Relative Colour Computation

`color-mix()` lets you compute colours relative to a base token, which is
especially useful for zebra stripes and hover states that need to adapt to
both light and dark backgrounds.

```css
--color-table-row-even: color-mix(in srgb, var(--color-background) 95%, black);
--color-table-row-odd:  color-mix(in srgb, var(--color-background) 90%, black);
```

**Browser support:** `color-mix()` is baseline 2023 (Chrome 111+, Firefox 113+,
Safari 16.2+). It is **not supported** in older browsers — notably IE 11 and
older Safari versions still in use on some platforms.

There is no direct polyfill for `color-mix()` because it involves runtime colour
computation. The practical fallback is to define explicit values for each theme
and accept the duplication:

```css
/* Fallback: explicit values for each theme */
:root {
  --color-table-row-even: #f2f2f2;
  --color-table-row-odd:  #e5e5e5;
}
@media (prefers-color-scheme: dark) {
  :root {
    --color-table-row-even: #272727;
    --color-table-row-odd:  #343434;
  }
}

/* Progressive enhancement: override with color-mix() where supported */
@supports (color: color-mix(in srgb, red, blue)) {
  :root {
    --color-table-row-even: color-mix(in srgb, var(--color-background) 95%, black);
    --color-table-row-odd:  color-mix(in srgb, var(--color-background) 90%, black);
  }
}
```

Use `@supports` to apply `color-mix()` only where the browser supports it,
with explicit values as the universal baseline. This pairs well with `contrast-color()` when you want a softer border or hover state while keeping the binary foreground choice native.

---

## Moderate: Data Table Zebra Stripes

Define stripe colours relative to the page background — a 5–10% luminance step.
Absolute colour values that look right in light mode will look wrong in dark mode.

```css
tbody tr:nth-child(even) { background-color: var(--color-table-row-even); }
tbody tr:nth-child(odd)  { background-color: var(--color-table-row-odd);  }
```

In forced-colours mode, zebra stripe backgrounds are discarded — add a bottom
border in your `forced-colors` block to preserve row separation (see above).

---

## Validation and Testing

Before shipping, verify all of the following:

* Browser support for `light-dark()` and `contrast-color()` in the browsers you target, plus at least one browser that falls back to `prefers-color-scheme`.
* `color-scheme: light dark;` is declared on `:root` and native controls match the active scheme.
* `light-dark()` resolves correctly in light mode and dark mode.
* `contrast-color()` resolves as expected for buttons, badges, tags, status indicators, and other dynamic components.
* Forced-colors mode and high contrast mode preserve structure, labels, boundaries, and focus indicators.
* Manual WCAG contrast checks still pass for text, focus rings, and non-text UI.
* Real user testing and accessibility tools agree with the CSS result.

---

## Definition of Done Checklist

* [ ] All text/UI elements meet WCAG 2.2 AA contrast in **light** mode
* [ ] All text/UI elements meet WCAG 2.2 AA contrast in **dark** mode
* [ ] `color-scheme: light dark;` declared on `:root`
* [ ] Theme tokens use `light-dark()` with `prefers-color-scheme` only as fallback or a specialized override
* [ ] `contrast-color()` used behind `@supports` for adaptive components
* [ ] Forced-colors mode: content comprehensible; no meaning conveyed by shadow, gradient, or background alone
* [ ] Focus rings use `outline`, not `box-shadow` alone
* [ ] Information not conveyed by colour alone — icon + text + colour
* [ ] Focus indicators visible and meeting 3:1 in all modes
* [ ] Manual selector exposes `light`, `dark`, and `system` as explicit options when a selector is present
* [ ] Selector uses radiogroup semantics (`role="radiogroup"`, `role="radio"`, `aria-checked`) with roving `tabindex`
* [ ] Keyboard support includes single Tab stop plus Arrow keys, Home/End, Space, and Enter
* [ ] In `system` mode, theme resolves from `prefers-color-scheme` and auto-updates on preference change
* [ ] `localStorage` access wrapped in `try/catch`
* [ ] User preference persists across sessions where `localStorage` is available
* [ ] `prefers-reduced-motion` respected for theme transitions
* [ ] Zebra stripes use relative (5–10%) differences; fallback for forced-colors uses `border-bottom`
* [ ] SVGs use `currentColor`
* [ ] `color-mix()` and `contrast-color()` gated behind `@supports` with explicit fallback values
* [ ] Browser support, forced-colors, high contrast, light mode, dark mode, and manual WCAG contrast are verified

---

## Key WCAG Criteria

* 1.4.1 Use of Color (A)
* 1.4.3 Contrast Minimum (AA) — **Serious if failing in either mode**
* 1.4.11 Non-text Contrast (AA)
* 2.4.11 Focus Appearance (AA, WCAG 2.2)

> Note: **1.4.12 Text Spacing** is a typography requirement — it belongs in a
> content-design or typography skill, not here. It is not specific to
> light/dark mode.

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/LIGHT_DARK_MODE_ACCESSIBILITY_BEST_PRACTICES.md)
* [WCAG 2.2 Understanding 1.4.3 Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
* [WCAG 2.2 Understanding 2.4.11 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
* [MDN: light-dark()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark)
* [MDN: contrast-color()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/contrast-color)
* [CSS prefers-color-scheme (Media Queries Level 5)](https://www.w3.org/TR/mediaqueries-5/#prefers-color-scheme)
* [CSS forced-colors (Media Queries Level 5)](https://www.w3.org/TR/mediaqueries-5/#forced-colors)
* [CSS System Colors (CSS Color Level 4)](https://www.w3.org/TR/css-color-4/#css-system-colors)
* [MDN: forced-color-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/forced-color-adjust)
* [Baseline 2023: color-mix() browser support](https://caniuse.com/mdn-css_types_color_color-mix)
* [Smashing Magazine: Building Self-Correcting Color Systems With contrast-color()](https://www.smashingmagazine.com/2026/05/building-self-correcting-color-systems-contrast-color/)
* [CSS-Tricks: Exploring the CSS contrast-color() Function... A Second Time](https://css-tricks.com/exploring-the-css-contrast-color-function-a-second-time/)
* [Piccalilli: Some CSS only contrast options until contrast-color() is Baseline widely available](https://piccalil.li/blog/some-css-only-contrast-options-until-contrast-color-is-baseline-widely-available/)

> **Standards horizon:** WCAG 3.0's proposed **APCA** (Advanced Perceptual
> Contrast Algorithm) replaces the current 4.5:1 / 3:1 luminance-ratio model
> with a perceptual contrast model that treats light-on-dark and dark-on-light
> differently. This will directly affect light/dark mode contrast targets.
> Do not apply APCA to production work until WCAG 3.0 is a published standard.
> Monitor: <https://www.w3.org/TR/wcag-3.0/> and <https://git.apcacontrast.com/>
