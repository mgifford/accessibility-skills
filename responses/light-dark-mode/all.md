# Light Dark Mode Responses

## Eval 1

```css
:root {
  color-scheme: light dark;

  --color-text: light-dark(#1f2937, #f3f4f6);
  --color-background: light-dark(#ffffff, #111827);
  --color-surface: light-dark(#f8fafc, #1f2937);
  --color-link: light-dark(#0b5fff, #7cb2ff);
}

[data-theme="light"] {
  color-scheme: light;
}

[data-theme="dark"] {
  color-scheme: dark;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-text: #f3f4f6;
    --color-background: #111827;
    --color-surface: #1f2937;
    --color-link: #7cb2ff;
  }
}
```

## Eval 2

```css
.button,
.badge,
.tag,
.status {
  background-color: var(--component-bg);
  color: white;
}

.button { --component-bg: light-dark(#005fcc, #66aaff); }
.badge { --component-bg: light-dark(#0f766e, #14b8a6); }
.tag { --component-bg: light-dark(#6d28d9, #8b5cf6); }
.status-success { --component-bg: light-dark(#166534, #22c55e); }
.status-warning { --component-bg: light-dark(#b45309, #f59e0b); }

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

## Eval 3

`contrast-color()` is useful, but it is not a replacement for testing. It currently returns only `black` or `white`, so some mid-tone colors can still be problematic. Use it as an enhancement, then verify the result with manual WCAG contrast checks.

```css
.button {
  --button-bg: light-dark(#005fcc, #66aaff);
  background: var(--button-bg);
  color: contrast-color(var(--button-bg));
}
```

The goal is a safer default, not a promise.

## Eval 4

```css
@supports not (color: contrast-color(red)) {
  .button {
    color: white;
    background: #005fcc;
  }
}

@media (prefers-color-scheme: dark) {
  .button {
    background: light-dark(#005fcc, #66aaff);
  }
}
```

This keeps `prefers-color-scheme` as a fallback path while `light-dark()` remains the preferred token pattern.

## Eval 5

```md
## What to verify before shipping

* browser support for `light-dark()` and `contrast-color()` in the browsers you target.
* Light mode and dark mode rendering with `color-scheme: light dark;` on `:root`.
* forced-colours and high contrast mode behaviour.
* Manual WCAG contrast checks for text, controls, and focus rings.
* `@supports` fallbacks still produce readable colours when the modern functions are unavailable.
```

## Eval 6

```html
<div role="group" aria-label="Colour theme">
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
```

## Eval 7

```javascript
var selectedMode = 'system'; // 'system', 'light', or 'dark'
var resolvedTheme = 'light'; // 'light' or 'dark'

function resolveTheme(mode) {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

function applyMode(mode) {
  selectedMode = mode;
  resolvedTheme = resolveTheme(mode);
  document.documentElement.setAttribute('data-theme-mode', mode);
  document.documentElement.setAttribute('data-theme', resolvedTheme);
}

// Listen for OS changes when in system mode
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
  if (selectedMode === 'system') {
    applyMode('system');
  }
});
```

## Eval 8

```html
<script>
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
```

This runs synchronously in `<head>` before any rendering occurs, preventing flash of incorrect theme.

## Eval 9

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

## Eval 10

When a user selects "system", the stored value MUST be `system`, not the resolved `dark` or `light`. If you store `dark` because the OS happened to be dark at that moment, then:

1. When the user switches their OS to light mode, the page stays dark
2. The user has no way to get back to true system-following behavior
3. The preference is no longer "follow the OS" — it's "stay dark forever"

The correct approach:

```javascript
// Correct: store the mode, not the resolved theme
function setStoredMode(mode) {
  try {
    localStorage.setItem('theme-mode', mode); // 'system', 'light', or 'dark'
  } catch (e) {}
}

// When resolving, check the stored mode
function applyMode(mode) {
  var resolved = mode === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : mode;
  document.documentElement.setAttribute('data-theme', resolved);
}
```

This ensures that future OS changes continue to affect the page when the user has selected system.
