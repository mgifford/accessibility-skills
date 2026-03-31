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
information.**

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

---

## Critical: Text Contrast (WCAG 1.4.3)

Normal text and images of text must meet these minimums:

| Text type | Minimum (AA) | Enhanced (AAA) |
| --- | :---: | :---: |
| Normal text (below 18pt / 14pt bold) | **4.5:1** | 7:1 |
| Large text (18pt+ or 14pt+ bold) | **3:1** | 4.5:1 |
| Logotypes / purely decorative text | Exempt | Exempt |
| Disabled controls | Exempt | Exempt |

**"Large text"** means 18pt (≈ 24 CSS `px`) or larger in regular weight, or
14pt (≈ 18.67 CSS `px`) or larger in bold weight.

### Preferred CSS pattern — text colours via custom properties

```css
:root {
  --color-text:        #1a1a1a;   /* contrast vs #fff: 16.75:1 ✓ */
  --color-text-muted:  #595959;   /* contrast vs #fff:  7.0:1  ✓ */
  --color-heading:     #333333;   /* contrast vs #fff: 12.63:1 ✓ */
  --color-link:        #0066cc;   /* contrast vs #fff:  4.52:1 ✓ */
  --color-background:  #ffffff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-text:        #e8e8e8;   /* contrast vs #1a1a1a: 13.61:1 ✓ */
    --color-text-muted:  #b0b0b0;   /* contrast vs #1a1a1a:  7.0:1  ✓ */
    --color-link:        #66aaff;   /* contrast vs #1a1a1a:  5.74:1 ✓ */
    --color-background:  #1a1a1a;
  }
}
```

### Avoid

```css
/* Bad — 2.4:1 contrast, fails 1.4.3 */
.placeholder { color: #aaaaaa; }

/* Bad — informative text in low-contrast colour */
.note { color: #888; } /* fails against white background */
```

---

## Serious: Non-text Contrast (WCAG 1.4.11)

UI components and graphical objects required to understand or operate the
interface must have **3:1 contrast** against adjacent colours.

### Applies to

- Form input borders (text fields, checkboxes, radio buttons, selects)
- Interactive component boundaries (buttons without text, sliders, toggles)
- Icons and graphical objects that convey meaning
- Charts and data visualisation elements that encode information
- Status indicators (progress bars, meter fills)

### Does not apply to

- Decorative graphics that convey no meaning
- Inactive / disabled components
- Logos and brand marks
- Graphical elements supplementary to adjacent text

### Form control pattern

```css
/* Checkbox border must contrast 3:1 against its background */
input[type="checkbox"] {
  --checkbox-border: #767676; /* 4.54:1 against #fff ✓ */
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--checkbox-border);
  border-radius: 3px;
}
```

---

## Serious: Use of Color (WCAG 1.4.1)

Color alone must not be the sole means of conveying information, indicating an
action, prompting a response, or distinguishing a visual element. A second,
non-color cue must always accompany color.

### Common failure patterns

```html
<!-- Bad: required field indicated only by red label color -->
<label style="color: red;">Email address</label>
<input type="email">

<!-- Bad: error state communicated only by red border -->
<input type="email" style="border-color: red;">
```

### Preferred patterns

```html
<!-- Good: required field — asterisk + color + screen-reader text -->
<label>
  Email address
  <span aria-hidden="true" class="required-marker">*</span>
  <span class="sr-only">(required)</span>
</label>
<input type="email" aria-required="true">

<!-- Good: error state — icon + text + color + aria-invalid -->
<div class="field field--error">
  <label for="email">Email address</label>
  <input id="email" type="email"
         aria-describedby="email-error" aria-invalid="true">
  <p id="email-error" class="error-message">
    <svg role="img" aria-label="Error" aria-hidden="true">
      <use href="#icon-exclamation"></use>
    </svg>
    Please enter a valid email address.
  </p>
</div>
```

### Link distinction from surrounding text

Links within body text must be distinguishable from surrounding text by more
than color alone. Use underline (the browser default) or another non-color cue.

```css
/* Good: underline preserved */
a {
  color: #0066cc;
  text-decoration: underline;
}
```

---

## Serious: Focus Appearance (WCAG 2.4.13)

WCAG 2.2 **2.4.13 Focus Appearance** (Level AA) requires visible keyboard focus
indicators that:

1. Enclose the focused component with an area of at least the **perimeter × 2 CSS px** in thickness.
2. Have **3:1 contrast** between focused and unfocused states.
3. Have **3:1 contrast** against every adjacent color in the unfocused state.

### Preferred CSS pattern

```css
:root {
  --focus-ring-color:  #0066cc;
  --focus-ring-width:  3px;
  --focus-ring-offset: 2px;
}

:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
  /* White halo ensures visibility on dark backgrounds */
  box-shadow: 0 0 0 calc(var(--focus-ring-width) + var(--focus-ring-offset))
              #ffffff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --focus-ring-color: #99ccff;
  }
}
```

### C40 two-color focus indicator

```css
/* Works on both light and dark surfaces */
:focus-visible {
  outline: 3px solid #000000;
  outline-offset: 1px;
  box-shadow: 0 0 0 5px #ffffff;
}
```

### Avoid

```css
/* NEVER do this — completely removes focus visibility */
:focus { outline: none; }

/* NEVER do this without providing an alternative focus style */
*:focus { outline: 0 !important; }
```

---

## Serious: Forced-Colors Mode (WCAG 1.4.3, 1.4.11)

Windows High Contrast Mode and `forced-colors` replace author colors with
system colors. Interfaces break when CSS `background-color`, `box-shadow`, or
`color` properties are the sole means of conveying meaning.

### Use `outline` for focus rings — it survives forced-colors

```css
/* Good: outline is forced-colors-safe */
:focus-visible {
  outline: 3px solid Highlight;
  outline-offset: 2px;
}

/* Risk: box-shadow may not render in forced-colors mode */
:focus-visible {
  box-shadow: 0 0 0 3px #0066cc; /* may be suppressed */
}
```

### Restore lost meaning in forced-colors mode

```css
@media (forced-colors: active) {
  .button {
    background-color: ButtonFace;
    color: ButtonText;
    border: 2px solid ButtonBorder;
  }

  /* Restore SVG icon visibility */
  .icon {
    forced-color-adjust: auto;
  }
}
```

### Testing forced-colors mode

- Enable **High Contrast Mode** in Windows Accessibility settings
- Chrome DevTools → Rendering → "Emulate CSS media feature forced-colors: active"
- Firefox: `about:config` → `ui.forcedColors: 1`

---

## Moderate: Semantic Color Token Pattern

Centralizing all design-system colors as CSS custom properties makes contrast
validation and theming manageable at scale.

```css
/* Token layer — raw values */
:root {
  --color-neutral-600: #595959;  /* 7.0:1 on #fff */
  --color-neutral-900: #1a1a1a;  /* 16.75:1 on #fff */
  --color-brand-500:   #0066cc;  /* 4.52:1 on #fff — OK for normal text ✓ */
  --color-brand-700:   #004c99;  /* 7.59:1 on #fff — OK for all text  ✓ */

  /* Semantic layer */
  --color-text-primary:   var(--color-neutral-900);
  --color-text-secondary: var(--color-neutral-600);
  --color-text-link:      var(--color-brand-500);
  --color-surface:        #ffffff;
  --color-border:         #e8e8e8; /* 3:1 for non-text ✓ */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-text-primary:   #e8e8e8;
    --color-text-secondary: #a0a0a0;  /* 7.11:1 on #1a1a1a ✓ */
    --color-text-link:      #66aaff;  /* 5.74:1 on #1a1a1a ✓ */
    --color-surface:        #1a1a1a;
    --color-border:         #444444;  /* 3.1:1 vs #1a1a1a ✓ */
  }
}
```

```css
/* Good: references semantic token — works in all themes */
.card {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

/* Bad: hard-coded value that may fail in dark mode */
.card {
  background-color: #ffffff;
  color: #333;
}
```

---

## Minor: APCA — Emerging Standard

The **Advanced Perceptual Contrast Algorithm (APCA)** is a candidate replacement
for the WCAG 2.x contrast ratio formula expected in WCAG 3.0. It models contrast
perception more accurately for thin strokes, small font sizes, and saturated colors.

**APCA is not yet required.** Teams adopting it today must **continue to meet
WCAG 2.2 AA requirements** in parallel.

| Content type | Minimum Lc | Recommended Lc |
| --- | :---: | :---: |
| Normal body text (16px / 400 weight) | 60 | 75 |
| Large heading text (24px+ / 700 weight) | 45 | 60 |
| UI component labels | 45 | 60 |
| Placeholder / muted text | 30 | 45 |

---

## Recommended Contrast-Checking Tools

| Tool | Use case |
| --- | --- |
| [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) | Quick manual text contrast checks |
| [Colour Contrast Analyser (TPGi)](https://www.tpgi.com/color-contrast-checker/) | Desktop app for sampling on-screen colors |
| [axe DevTools](https://www.deque.com/axe/devtools/) | Browser extension with contrast violation detection |
| [apcacontrast.com](https://apcacontrast.com/) | APCA-based contrast evaluation |
| [Stark (Figma/Sketch plugin)](https://www.getstark.co/) | Design-time contrast checking |

### Testing programmatically with axe-core

```javascript
const axe = require("axe-core");

axe.run(document, {
  runOnly: {
    type: "rule",
    values: ["color-contrast", "color-contrast-enhanced"]
  }
}, (err, results) => {
  if (err) throw err;
  console.log("Contrast violations:", results.violations);
});
```

---

## Definition of Done Checklist

* [ ] All normal text meets 4.5:1 contrast in light and dark modes
* [ ] All large text meets 3:1 contrast in light and dark modes
* [ ] All form controls, icons, and data visualisation elements meet 3:1 non-text contrast
* [ ] No information conveyed by color alone — icon + text + color used together
* [ ] Links in body text are distinguishable from surrounding text without color
* [ ] Focus indicators use `outline`, meet 3:1 contrast, and are visible in all modes
* [ ] All colour tokens defined as CSS custom properties; no hard-coded values in components
* [ ] Light mode and dark mode verified with contrast checker
* [ ] Forced-colors / Windows High Contrast Mode tested — no meaning lost
* [ ] axe-core `color-contrast` rule passes in CI
* [ ] Disabled controls clearly distinguished from enabled controls beyond opacity alone

---

## Key WCAG Criteria

* 1.4.1 Use of Color (A) — **Serious if failing**
* 1.4.3 Contrast Minimum (AA) — **Critical if failing for normal text**
* 1.4.6 Contrast Enhanced (AAA)
* 1.4.11 Non-text Contrast (AA) — **Serious if failing**
* 2.4.7 Focus Visible (AA)
* 2.4.13 Focus Appearance (AA, WCAG 2.2) — **Serious if failing**

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/COLOR_CONTRAST_ACCESSIBILITY_BEST_PRACTICES.md)
* [WCAG 2.2 Understanding 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
* [WCAG 2.2 Understanding 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
* [WCAG 2.2 Understanding 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
* [WCAG 2.2 Understanding 2.4.13 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
* [WCAG 2.2 Technique C40: Creating a two-color focus indicator](https://www.w3.org/WAI/WCAG22/Techniques/css/C40)
* [APCA contrast tool](https://apcacontrast.com/)

> **Standards horizon:** WCAG 3.0's proposed **APCA** (Advanced Perceptual
> Contrast Algorithm) will replace the current luminance-ratio model with a
> perceptual contrast model that treats light-on-dark and dark-on-light
> differently. Do not apply APCA to production work until WCAG 3.0 is a
> published standard. Monitor: <https://www.w3.org/TR/wcag-3.0/> and
> <https://git.apcacontrast.com/>
