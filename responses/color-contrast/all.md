# Color Contrast Responses

## Eval 1

```css
:root {
  --color-text: #1f2937;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-text: #f9fafb;
  }
}
```

## Eval 2

```css
.chip {
  color: currentColor;
  border: 2px solid currentColor;
}
```

## Eval 3

```css
.control:focus-visible {
  outline: 2px solid currentColor;
}

@media (forced-colors: active) {
  .control:focus-visible {
    outline: 2px solid CanvasText;
  }
}
```

## Eval 4

```html
<label for="email">Email <span aria-hidden="true">*</span></label>
<input id="email" aria-invalid="true" required />
<svg aria-hidden="true" focusable="false"></svg>
```

## Eval 5

```css
.button:focus-visible {
  outline: 3px solid currentColor;
}
```

Use contrast tokens that respect prefers-color-scheme and keep the focus ring visible.
