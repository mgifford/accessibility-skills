# Progressive Enhancement Responses

## Eval 1

```html
<form action="/search" method="get">
  <label for="q">Search</label>
  <input id="q" name="q">
</form>
```

## Eval 2

```html
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>
<p>JavaScript enhances the menu.</p>
```

## Eval 3

```js
if ('fetch' in window) {
  const menu = document.querySelector('.menu');
}
// feature detection
```

## Eval 4

```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
```

## Eval 5

```html
<main>
  <h1>Semantic HTML</h1>
</main>

@media (prefers-reduced-motion: reduce) {}
@media (forced-colors: active) {}
```
