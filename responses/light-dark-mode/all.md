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
* forced-colors and high contrast mode behaviour.
* Manual WCAG contrast checks for text, controls, and focus rings.
* `@supports` fallbacks still produce readable colours when the modern functions are unavailable.
```
