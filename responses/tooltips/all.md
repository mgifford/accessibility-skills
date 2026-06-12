# Tooltips Responses

## Eval 1

```html
<button aria-describedby="tip-1">Info</button>
<span id="tip-1" role="tooltip" hidden>Helpful text</span>
```

## Eval 2

```js
function hideTooltip() {
  hidden = true;
}

if (event.key === 'Escape') {
  hideTooltip();
}
```

## Eval 3

```html
<button aria-expanded="false" aria-controls="tip-panel">Details</button>
<div id="tip-panel" role="tooltip" hidden>More information</div>
```

## Eval 4

```html
<button aria-label="Delete item" aria-describedby="delete-tip">Delete</button>
<span id="delete-tip" aria-hidden="true">Permanently removes the item.</span>
```

## Eval 5

```css
@media (prefers-reduced-motion: reduce) {
  [role="tooltip"] {
    transition: none;
  }
}
```
