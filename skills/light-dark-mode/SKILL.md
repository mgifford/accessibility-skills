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

## Critical Rule: Focus Is Navigation, Not Selection

**A theme must not change until the user explicitly activates an option.**

Moving keyboard focus or pointer hover across theme choices MUST NOT preview,
select, or apply a theme. Tabbing across System, Light, and Dark MUST leave the
page colours unchanged until the user presses Enter or Space.

This is a **Critical** requirement. Violations cause colour flashing during
keyboard navigation and disorient users with vestibular disorders, cognitive
disabilities, and low vision.

---

## Core Mandate

All colour themes **must** meet WCAG 2.2 Level AA contrast in **both** light and
dark modes, including forced-colours / high contrast modes. Test all three —
not just the default.

## Required: Three-Option Theme Selector Pattern

Use a visible three-option selector that shows all three options at the same time:

* System
* Light
* Dark

### Interaction pattern requirements

* MUST use a labelled group containing three native `<button type="button">` elements
* MUST use `aria-pressed="true"` for the selected option and `aria-pressed="false"` for others
* MUST NOT use a single cycling button
* MUST NOT use a two-state light/dark toggle
* MUST NOT use a menu that hides the available options
* MUST NOT use custom `role="radio"` elements
* MUST NOT use a radiogroup that changes theme when arrow-key focus moves
* MUST NOT use hover or focus previews
* MUST NOT automatically select when a user merely tabs to an option

### Keyboard requirements

The selector MUST work with standard native button behaviour. Users MUST be able to:

* Tab to each option
* Use Shift+Tab to move backwards
* Activate an option with Enter
* Activate an option with Space
* Activate an option with mouse, touch, switch device, voice control, or other pointer

Moving focus between the options MUST NOT change the theme. The theme MUST
change only after deliberate activation.

Do NOT add unnecessary custom keyboard handlers where native button behaviour
already provides the required functionality.

### Prevent colour flashing during keyboard navigation

Theme changes MUST occur only after explicit activation. Moving keyboard focus
or pointer hover across theme choices MUST NOT preview, select, or apply a theme.

Tabbing across System, Light, and Dark MUST leave the page colours unchanged
until the user presses Enter or Space.

---

## Required: HTML Structure

Use a group with an accessible label containing three native buttons:

```html
<div role="group" aria-label="Colour theme">
  <button
    type="button"
    class="theme-mode-btn"
    aria-pressed="false"
    data-theme-value="system">
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20">
      <path fill="none" stroke="currentColor" stroke-width="2" d="M3 4h18v12H3zM8 20h8"/>
    </svg>
    <span>System</span>
  </button>

  <button
    type="button"
    class="theme-mode-btn"
    aria-pressed="false"
    data-theme-value="light">
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20">
      <circle cx="12" cy="12" r="5" fill="currentColor"/>
    </svg>
    <span>Light</span>
  </button>

  <button
    type="button"
    class="theme-mode-btn"
    aria-pressed="true"
    data-theme-value="dark">
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20">
      <path fill="currentColor" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
    <span>Dark</span>
  </button>
</div>
```

---

## Required: Default Behaviour

Use `system` as the default preference when the user has not made an explicit choice.

Do NOT convert the system preference into a stored light or dark preference.

For example, when the user selects system while their operating system is
currently dark, store:

```
system
```

Do NOT store:

```
dark
```

This distinction is required so that later operating-system changes continue to
affect the page.

---

## Required: Storage Requirements

Use a clearly named storage key such as `theme-mode`. Valid stored values are
only: `system`, `light`, `dark`.

* Validate stored values before using them
* Wrap all `localStorage` reads and writes in `try/catch`
* The theme control MUST continue to work for the current page when storage is unavailable
* Do NOT allow a storage failure to stop script execution

Storage can be unavailable in:

* Privacy-restricted browsers
* Sandboxed contexts
* Private browsing modes
* Environments where storage access throws an exception

---

## Required: Theme Application Model

Maintain separate values for the selected mode and resolved theme:

```javascript
selectedMode = "system" | "light" | "dark";
resolvedTheme = "light" | "dark";
```

Apply both to the root element using explicit attributes:

```html
<html data-theme-mode="system" data-theme="dark">
```

* `data-theme-mode` represents the user's actual selection
* `data-theme` represents the currently rendered light or dark scheme

When system is active, listen for changes to:

```javascript
window.matchMedia("(prefers-color-scheme: dark)")
```

Update the resolved theme when that preference changes. Do NOT overwrite the
stored mode when the system preference changes.

---

## Required: Initial Rendering and Flash Prevention

Provide an early initialization pattern that runs before the primary stylesheet
or before the page is visibly rendered. The pattern MUST:

1. Safely read the stored preference
2. Validate the stored value
3. Default to system
4. Resolve system using `prefers-color-scheme`
5. Set the root theme attributes before the first significant paint
6. Set an appropriate `color-scheme` value

Include early in `<head>`:

```html
<meta name="color-scheme" content="light dark">
```

Explain that this early script is intended to reduce a flash of the incorrect
colour scheme during page load. Do NOT claim that a script can eliminate every
possible visual transition in every browser. Describe it as reducing or
preventing the common flash caused by applying the preference too late.

---

## Required: CSS Custom Properties Pattern

Use semantic theme tokens through CSS custom properties. Do NOT hard-code
component colours independently throughout the example.

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

/* Manual overrides narrow the active scheme when a user chooses one. */
[data-theme="light"] {
  color-scheme: light;
}
[data-theme="dark"] {
  color-scheme: dark;
}
```

Component styles MUST read from the tokens above rather than hardcode colour values.

---

## Required: Selected and Focus State Styling

The selected state MUST NOT be communicated through colour alone. Use multiple
cues such as:

* `aria-pressed`
* A visible checkmark or icon
* A thicker or otherwise distinct border
* Font-weight
* Text labels

Focus and selected state MUST be visually distinguishable from one another. A
focused but unselected option MUST NOT look identical to the selected option.

```css
.theme-mode-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 0.375rem;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 1rem;
  cursor: pointer;
}

/* Focus indicator — visible outline, not box-shadow */
.theme-mode-btn:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* Selected state — distinct from focus */
.theme-mode-btn[aria-pressed="true"] {
  border-color: var(--color-link);
  font-weight: 600;
  background: var(--color-background);
}
```

Use `:focus-visible` with a real outline. Do NOT remove the outline unless it
is replaced by an equal or stronger visible focus indicator.

---

## Required: Forced-Colours Support

The selector MUST remain usable in Windows High Contrast Mode and other
forced-colours environments. Do NOT rely only on:

* Background colours
* Gradients
* Box shadows
* Opacity
* SVG fill colours
* Colour differences

Use system colours where appropriate within `@media (forced-colors: active)`.

Ensure that:

* Button boundaries remain visible
* The selected option remains identifiable
* The focused option remains identifiable
* Selected and focused states remain distinct
* Icons using `currentColor` remain visible

Do NOT use `forced-color-adjust: none` unless there is a specific, documented
reason and the resulting colours are tested.

```css
@media (forced-colors: active) {
  .theme-mode-btn {
    border: 2px solid ButtonText;
    color: ButtonText;
    background: ButtonFace;
  }

  .theme-mode-btn:focus-visible {
    outline: 2px solid Highlight;
    outline-offset: 2px;
  }

  .theme-mode-btn[aria-pressed="true"] {
    border-color: Highlight;
    forced-color-adjust: none;
    background: Highlight;
    color: HighlightText;
  }
}
```

---

## Required: Accessible Naming and Status

Use visible text labels: System, Light, Dark. Icons MAY supplement the labels
but MUST NOT replace them.

Decorative icons MUST use:

```html
<svg aria-hidden="true" focusable="false">...</svg>
```

Do NOT dynamically replace stable button labels with phrases such as:

* Switch to dark
* Current dark mode
* Use system dark

The button label SHOULD describe the preference the button selects. The
selected state is communicated through `aria-pressed`.

It is acceptable to include a separate status message explaining the resolved
system theme, for example:

```html
<p class="visually-hidden" aria-live="polite" id="theme-status">
  System preference currently uses dark mode.
</p>
```

Do NOT make this announcement excessively verbose. Avoid announcing the same
state repeatedly when nothing has changed.

---

## Required: Reduced Motion

Do NOT use animated colour transitions by default. Theme changes can affect
most of the viewport and may be uncomfortable or disorienting.

If a transition example is included, it MUST:

* Be subtle
* Avoid transitioning every CSS property
* Respect `prefers-reduced-motion`
* Not delay the actual state change
* Not create intermediate low-contrast states

Prefer no theme-transition animation in the canonical example.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

---

## Required: Contrast Requirements

The skill MUST continue requiring WCAG 2.2 Level AA contrast testing in every
relevant state. Test at least:

* System resolving to light
* System resolving to dark
* Explicit Light
* Explicit Dark
* Forced colours
* Keyboard focus
* Selected option
* Hover
* Disabled controls (if any)
* Links
* Form fields
* Borders and graphical objects

Do NOT assume that colours which pass in light mode will pass in dark mode. Do
NOT present experimental CSS functions as substitutes for actual contrast testing.

---

## Required: Complete Example Implementation

Include a complete example containing:

1. Accessible HTML
2. CSS
3. Early anti-flash initialization
4. Main JavaScript
5. Safe storage handling
6. System-preference change handling
7. Forced-colours styles
8. Visible focus styles
9. Selected-state styles

The example MUST be internally consistent. Use the same storage key, data
attributes, class names, mode names, and selected-state mechanism throughout
all code samples. Do NOT provide fragments that contradict one another.

### Complete HTML

```html
<!DOCTYPE html>
<html lang="en" data-theme-mode="system" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title>Theme Selector Example</title>
  <style>
    /* Anti-flash: set theme as early as possible */
    html[data-theme="dark"] {
      color-scheme: dark;
    }
    html[data-theme="light"] {
      color-scheme: light;
    }
  </style>
  <script>
    /* Early initialization — runs before first paint */
    (function() {
      var stored = null;
      try { stored = localStorage.getItem('theme-mode'); } catch (e) {}
      var mode = (stored === 'light' || stored === 'dark') ? stored : 'system';
      var resolved = mode === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : mode;
      document.documentElement.setAttribute('data-theme-mode', mode);
      document.documentElement.setAttribute('data-theme', resolved);
    })();
  </script>
</head>
<body>
  <header>
    <nav aria-label="Main navigation">
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>

    <div role="group" aria-label="Colour theme" id="theme-selector">
      <button type="button" class="theme-mode-btn" aria-pressed="false" data-theme-value="system">
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20">
          <path fill="none" stroke="currentColor" stroke-width="2" d="M3 4h18v12H3zM8 20h8"/>
        </svg>
        <span>System</span>
      </button>

      <button type="button" class="theme-mode-btn" aria-pressed="false" data-theme-value="light">
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20">
          <circle cx="12" cy="12" r="5" fill="currentColor"/>
        </svg>
        <span>Light</span>
      </button>

      <button type="button" class="theme-mode-btn" aria-pressed="true" data-theme-value="dark">
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
        <span>Dark</span>
      </button>
    </div>
  </header>

  <main>
    <h1>Theme Selector Example</h1>
    <p>This page demonstrates a three-option theme selector with System, Light, and Dark modes.</p>
  </main>

  <p class="visually-hidden" aria-live="polite" id="theme-status"></p>

  <script>
    /* Main theme logic — runs after DOM ready */
    (function() {
      var STORAGE_KEY = 'theme-mode';
      var VALID_MODES = ['system', 'light', 'dark'];
      var buttons = document.querySelectorAll('.theme-mode-btn');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      var statusEl = document.getElementById('theme-status');
      var currentMode = 'system';

      function getStoredMode() {
        try {
          var stored = localStorage.getItem(STORAGE_KEY);
          return VALID_MODES.indexOf(stored) !== -1 ? stored : 'system';
        } catch (e) {
          return 'system';
        }
      }

      function setStoredMode(mode) {
        try {
          localStorage.setItem(STORAGE_KEY, mode);
        } catch (e) {
          /* Storage unavailable; preference still works for current session. */
        }
      }

      function resolveTheme(mode) {
        if (mode === 'system') {
          return prefersDark.matches ? 'dark' : 'light';
        }
        return mode;
      }

      function updateButtons(activeMode) {
        for (var i = 0; i < buttons.length; i++) {
          var btn = buttons[i];
          var isActive = btn.getAttribute('data-theme-value') === activeMode;
          btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        }
      }

      function applyMode(mode) {
        currentMode = mode;
        var resolved = resolveTheme(mode);
        document.documentElement.setAttribute('data-theme-mode', mode);
        document.documentElement.setAttribute('data-theme', resolved);
        updateButtons(mode);
      }

      function handleActivation(event) {
        var btn = event.currentTarget;
        var mode = btn.getAttribute('data-theme-value');
        setStoredMode(mode);
        applyMode(mode);
      }

      /* Attach click handlers — no keyboard handlers needed */
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', handleActivation);
      }

      /* Listen for OS preference changes */
      prefersDark.addEventListener('change', function() {
        if (currentMode === 'system') {
          applyMode('system');
        }
      });

      /* Initialize */
      applyMode(getStoredMode());
    })();
  </script>
</body>
</html>
```

---

## Required: Failure Patterns

The following patterns MUST be rejected:

### Binary toggle

A single button that alternates only between light and dark and provides no way
to return to System.

### Focus-triggered preview

JavaScript that changes the theme in a focus or arrow-key handler.

### Incorrect radio implementation

A radiogroup where arrow keys both move focus and immediately change the entire
page theme.

### Incorrect persistence

Storing `dark` when the user actually selected `system` and the system happened
to be dark.

### Colour-only selection

Showing the selected theme only through a different background colour.

### Unsafe storage

Using `localStorage.getItem()` or `setItem()` without exception handling.

### Late initialization

Waiting for `DOMContentLoaded` before applying the stored theme, causing an
avoidable flash of the wrong theme.

### Dynamic label confusion

Changing the selected option's accessible name instead of keeping its label
stable and exposing selection with `aria-pressed`.

---

## Severity Scale (this skill)

| Level | Meaning |
| --- | --- |
| **Critical** | Colour theme makes content or interaction completely inaccessible |
| **Serious** | Contrast or mode failure significantly impairs access for a disability group |
| **Moderate** | Theme degrades usability but content remains partially accessible |
| **Minor** | Best-practice gap; marginal impact |

---

## Validation and Testing

Before shipping, verify all of the following:

### Keyboard

1. Load the page.
2. Tab to the theme selector.
3. Continue tabbing through System, Light, and Dark.
4. Confirm that the page theme does NOT change as focus moves.
5. Press Enter on an unselected option.
6. Confirm that the theme changes once.
7. Press Space on another option.
8. Confirm that the theme changes once.
9. Confirm that focus remains visible.
10. Confirm that the selected state and focus state are distinguishable.

### System mode

1. Select System.
2. Confirm that system is stored.
3. Change the operating-system colour preference.
4. Confirm that the page updates without reloading.
5. Confirm that the stored value remains system.

### Persistence

1. Select Light.
2. Reload.
3. Confirm that Light remains selected.
4. Select Dark.
5. Reload.
6. Confirm that Dark remains selected.
7. Select System.
8. Reload.
9. Confirm that System remains selected and resolves correctly.

### Storage failure

Test or simulate `localStorage` throwing an exception. Confirm that:

* The page still renders
* The selector still works
* The selected preference works for the current page
* No uncaught JavaScript error stops execution

### Assistive technology

Test with at least:

* One desktop screen reader
* Keyboard only
* Browser zoom at 200% and 400%
* Forced-colours or Windows High Contrast Mode
* Touch or mobile interaction where practical

Confirm that assistive technology announces:

* The group label
* Each button label
* Pressed or not pressed state

### Visual stability

Record or observe keyboard traversal through the selector. Confirm that no
colour scheme is previewed while tabbing.

### Automated tests

Inspect the repository's existing testing conventions and add tests where the
project supports them. Tests SHOULD verify, where practical:

* All three options exist
* All options are native buttons
* Only one option has `aria-pressed="true"`
* Focus alone does not change the theme
* Click activation changes the theme
* Keyboard activation changes the theme
* System tracks `prefers-color-scheme`
* An explicit Light or Dark selection ignores later system changes
* Invalid stored values fall back to System
* Storage exceptions do not crash the control
* Selected mode and resolved theme use separate root attributes

Do NOT introduce a new test framework unless necessary. Follow the repository's
existing approach.

---

## Definition of Done Checklist

* [ ] All text/UI elements meet WCAG 2.2 AA contrast in **light** mode
* [ ] All text/UI elements meet WCAG 2.2 AA contrast in **dark** mode
* [ ] `color-scheme: light dark;` declared on `:root`
* [ ] Theme tokens use `light-dark()` with `prefers-color-scheme` only as fallback
* [ ] Forced-colours mode: content comprehensible; no meaning conveyed by shadow, gradient, or background alone
* [ ] Focus rings use `outline`, not `box-shadow` alone
* [ ] Information not conveyed by colour alone — icon + text + colour
* [ ] Focus indicators visible and meeting 3:1 in all modes
* [ ] Three-option selector with System, Light, and Dark visible simultaneously
* [ ] Selector uses native `<button type="button">` with `aria-pressed`
* [ ] Theme changes only on explicit activation (Enter, Space, click)
* [ ] Focus alone does NOT change the theme
* [ ] In `system` mode, theme resolves from `prefers-color-scheme` and auto-updates
* [ ] `localStorage` access wrapped in `try/catch`
* [ ] Invalid stored values fall back to system
* [ ] User preference persists across sessions where `localStorage` is available
* [ ] `prefers-reduced-motion` respected for theme transitions
* [ ] SVGs use `currentColor`
* [ ] `color-mix()` and `contrast-color()` gated behind `@supports` with explicit fallback values
* [ ] Browser support, forced-colours, high contrast, light mode, dark mode, and manual WCAG contrast are verified
* [ ] Keyboard user can tab across all options without changing page colours

---

## Key WCAG Criteria

* 1.4.1 Use of Color (A)
* 1.4.3 Contrast Minimum (AA) — **Serious if failing in either mode**
* 1.4.11 Non-text Contrast (AA)
* 2.4.11 Focus Appearance (AA, WCAG 2.2)

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

> **Standards horizon:** WCAG 3.0's proposed **APCA** (Advanced Perceptual
> Contrast Algorithm) replaces the current 4.5:1 / 3:1 luminance-ratio model
> with a perceptual contrast model that treats light-on-dark and dark-on-light
> differently. This will directly affect light/dark mode contrast targets.
> Do not apply APCA to production work until WCAG 3.0 is a published standard.
> Monitor: <https://www.w3.org/TR/wcag-3.0/> and <https://git.apcacontrast.com/>
