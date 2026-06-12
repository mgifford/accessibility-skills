# Light Dark Mode Responses

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

```html
<button id="theme-toggle">Switch to dark mode</button>
<script>
try {
  localStorage.setItem('theme', 'dark');
} catch (error) {}
</script>
```

## Eval 3

```css
@media (forced-colors: active) {
  :root {
    color-scheme: light dark;
  }

  .button {
    outline: 2px solid CanvasText;
  }
}
```

## Eval 4

```css
.card {
  color: var(--color-text);
  background: var(--color-surface);
}
```

## Eval 5

```html
<meta name="color-scheme" content="light dark">
<html data-theme="auto">
```
