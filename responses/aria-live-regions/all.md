# Aria Live Regions Responses

## Eval 1

```html
<div role="status" aria-live="polite">announce</div>
```

## Eval 2

```html
<div id="search-status" aria-atomic="true">3 results found</div>
```

## Eval 3

```html
<div role="alert" aria-live="assertive">session warning</div>
```

## Eval 4

```html
<div id="chat-log" aria-live="polite" aria-atomic="false">New message</div>
```

## Eval 5

```html
<span class="visually-hidden">clip: live status updates</span>
<style>
.visually-hidden {
  position: absolute;
  clip: rect(1px, 1px, 1px, 1px);
  overflow: hidden;
}
</style>
```
