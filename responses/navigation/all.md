# Navigation Responses

## Eval 1

```html
<a class="skip-link" href="#main">Skip to main content</a>

<header>
  <nav aria-label="Main">
    <ul>
      <li><a href="/" aria-current="page">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
</header>

<main id="main" tabindex="-1">
  <h1>Home</h1>
</main>
```

## Eval 2

```html
<nav aria-label="Main">
  <ul>
    <li><a href="/about">About</a></li>
    <li><a href="/services">Services</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

## Eval 3

```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li aria-current="page">Product details</li>
  </ol>
</nav>
```

## Eval 4

```html
<nav aria-label="Main">
  <ul>
    <li>
      <a href="/services">Services</a>
      <button type="button"
        aria-expanded="false"
        aria-controls="services-submenu"
        aria-label="Services submenu">
        More
      </button>
      <ul id="services-submenu" hidden>
        <li><a href="/services/web">Web</a></li>
        <li><a href="/services/mobile">Mobile</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

## Eval 5

```html
<nav aria-label="Footer">
  <ul>
    <li><a href="/privacy">Privacy policy</a></li>
    <li><a href="/terms">Terms of service</a></li>
    <li><a href="/accessibility">Accessibility statement</a></li>
  </ul>
</nav>
```
