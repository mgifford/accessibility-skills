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

Always use CSS custom properties for theme tokens. Never hardcode colour values
in component styles — hardcoded values cannot be overridden by the theme system
or user preferences.

```css
:root {
  --color-text:       #1a1a1a;
  --color-background: #ffffff;
  --color-link:       #0066cc;
  --color-focus:      #004499;
  --color-border:     #cccccc;
  --color-hover:      #f5f5f5;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-text:       #e8e8e8;
    --color-background: #1a1a1a;
    --color-link:       #66aaff;
    --color-focus:      #99ccff;
    --color-border:     #444444;
    --color-hover:      #2a2a2a;
  }
}

/* Manual override classes mirror the above values */
[data-theme="light"] { /* mirror :root light values */ }
[data-theme="dark"]  { /* mirror prefers-color-scheme dark values */ }
```

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

## Serious: Manual Theme Toggle

If providing a theme toggle button, **it must be keyboard accessible and
correctly labelled**.

* Default to `prefers-color-scheme`; fall back to `light`
* Persist user choice — see localStorage section below
* `aria-label` must describe the **action** ("Switch to dark mode"), not the current state
* In dark mode: show sun icon (action = switch to light); in light mode: show moon icon (action = switch to dark)
* Place toggle **after** nav items in DOM order so it does not interrupt navigation
* Do not make the toggle fixed/sticky

```html
<button id="theme-toggle" type="button" aria-label="Switch to dark mode">
  <svg aria-hidden="true" focusable="false" class="sun-icon"
       viewBox="0 0 24 24" width="20" height="20">
    <circle cx="12" cy="12" r="5" fill="currentColor"/>
    <path fill="currentColor"
          d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12
             M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
  </svg>
  <svg aria-hidden="true" focusable="false" class="moon-icon"
       viewBox="0 0 24 24" width="20" height="20">
    <path fill="currentColor" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
</button>
```

---

## Moderate: Theme Persistence — localStorage with `try/catch`

`localStorage` is unavailable in some private browsing modes, cross-origin
iframes, and storage-restricted environments. Always wrap access in `try/catch`
to prevent a JavaScript error from breaking the theme toggle entirely.

```js
const toggle  = document.getElementById('theme-toggle');
const mq      = window.matchMedia('(prefers-color-scheme: dark)');

// Safe localStorage helpers
function getStoredTheme() {
  try {
    return localStorage.getItem('theme');
  } catch {
    return null; // Private browsing or storage blocked
  }
}

function setStoredTheme(theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // Storage unavailable — preference will not persist across sessions.
    // The toggle still works for the current session.
  }
}

let userOverride = !!getStoredTheme();
let current      = getStoredTheme() || (mq.matches ? 'dark' : 'light');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  toggle.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  );
}

toggle.addEventListener('click', () => {
  current      = current === 'light' ? 'dark' : 'light';
  userOverride = true;
  setStoredTheme(current);
  applyTheme(current);
});

// Follow OS preference if no user override
mq.addEventListener('change', (e) => {
  if (!userOverride) {
    current = e.matches ? 'dark' : 'light';
    applyTheme(current);
  }
});

applyTheme(current);
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
with explicit values as the universal baseline.

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

## Definition of Done Checklist

* [ ] All text/UI elements meet WCAG 2.2 AA contrast in **light** mode
* [ ] All text/UI elements meet WCAG 2.2 AA contrast in **dark** mode
* [ ] `prefers-color-scheme` detected and respected by default
* [ ] Forced-colors mode: content comprehensible; no meaning conveyed by shadow, gradient, or background alone
* [ ] Focus rings use `outline`, not `box-shadow` alone
* [ ] Information not conveyed by colour alone — icon + text + colour
* [ ] Focus indicators visible and meeting 3:1 in all modes
* [ ] `localStorage` access wrapped in `try/catch`
* [ ] User preference persists across sessions where `localStorage` is available
* [ ] `prefers-reduced-motion` respected for theme transitions
* [ ] Zebra stripes use relative (5–10%) differences; fallback for forced-colors uses `border-bottom`
* [ ] SVGs use `currentColor`
* [ ] `color-mix()` gated behind `@supports` with explicit fallback values

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
* [CSS prefers-color-scheme (Media Queries Level 5)](https://www.w3.org/TR/mediaqueries-5/#prefers-color-scheme)
* [CSS forced-colors (Media Queries Level 5)](https://www.w3.org/TR/mediaqueries-5/#forced-colors)
* [CSS System Colors (CSS Color Level 4)](https://www.w3.org/TR/css-color-4/#css-system-colors)
* [MDN: forced-color-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/forced-color-adjust)
* [Baseline 2023: color-mix() browser support](https://caniuse.com/mdn-css_types_color_color-mix)

> **Standards horizon:** WCAG 3.0's proposed **APCA** (Advanced Perceptual
> Contrast Algorithm) replaces the current 4.5:1 / 3:1 luminance-ratio model
> with a perceptual contrast model that treats light-on-dark and dark-on-light
> differently. This will directly affect light/dark mode contrast targets.
> Do not apply APCA to production work until WCAG 3.0 is a published standard.
> Monitor: <https://www.w3.org/TR/wcag-3.0/> and <https://git.apcacontrast.com/>
