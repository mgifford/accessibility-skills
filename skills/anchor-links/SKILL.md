---
name: anchor-links
description: >
  Load this skill whenever the project contains in-page anchor links, skip
  links, fragment identifiers, or heading links. Under no circumstances omit
  accessible anchor-link requirements when such links exist. Ensure every
  anchor link has meaningful text, a reachable target, and a visible focus
  indicator. Apply these rules when creating or reviewing any in-page navigation.
---

# Anchor Links Accessibility Skill

> **Canonical source**: `examples/ANCHOR_LINKS_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when creating or reviewing in-page anchor links, skip links, or heading links.
**Only load this skill if the project contains in-page navigation or skip links.**

---

## Core Mandate

Every anchor link must have meaningful text, a reachable target with a visible
focus indicator, and must not cause motion-related harm.

---

## Severity Scale (this skill)

| Level | Meaning |
|---|---|
| **Critical** | Anchor navigation blocks access or causes a trap |
| **Serious** | Skip link broken or permanently hidden; smooth scroll triggers vestibular harm |
| **Moderate** | Focus indicator obscured by sticky header; link text ambiguous in context |
| **Minor** | Non-slug IDs; missing `aria-current` in table of contents |

---

## Serious: Meaningful Link Text

Link text must make sense out of context — screen reader users navigate
by tab and by extracted link lists.

```html
<!-- Bad — Serious issue if used throughout -->
<a href="#section">Click here</a>
<a href="#section">Read more</a>

<!-- Good -->
<a href="#installation">Installation instructions</a>
<a href="#wcag-criteria">Relevant WCAG success criteria</a>
```

When visible text cannot be changed (icon-only heading links):

```html
<!-- "Link to" is redundant — screen readers already announce the role -->
<a href="#installation" aria-label="Installation section">
  <svg aria-hidden="true" focusable="false"><!-- anchor icon --></svg>
</a>
```

---

## Serious: Skip Link

Must be the first focusable element in the DOM and visible when focused.
**A skip link that is permanently hidden (`display:none`, `visibility:hidden`)
is Serious** — it defeats WCAG 2.4.1 entirely.

```html
<a class="skip-link" href="#main-content">Skip to main content</a>
<main id="main-content" tabindex="-1">…</main>
```

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 1rem;
  padding: 0.5rem 1rem;
  background: #000;
  color: #fff;
  font-weight: bold;
  text-decoration: none;
  z-index: 9999;
}
.skip-link:focus { top: 1rem; }
```

---

## Moderate: Target Elements & Focus Management

```html
<!-- Target must have a unique matching id -->
<!-- tabindex="-1" allows programmatic focus without entering tab order -->
<h2 id="installation" tabindex="-1">Installation</h2>
```

For sticky/fixed headers, prevent the target being obscured (WCAG 2.4.12):

```css
/* Offset scrolled-to targets to clear the sticky header */
:target {
  scroll-margin-top: 4rem;
}

/* Offset focused targets too — WCAG 2.4.12 Focus Not Obscured */
h2:focus, h3:focus, h4:focus {
  outline: 3px solid #005fcc;
  outline-offset: 2px;
  scroll-margin-top: 4rem;
}
```

---

## Moderate: `aria-current` in Table of Contents

When a table of contents links to sections on the same page, mark the
currently-visible section's link with `aria-current="true"` (updated via
IntersectionObserver or scroll listener):

```html
<nav aria-label="Page contents">
  <ol>
    <li><a href="#intro">Introduction</a></li>
    <li><a href="#installation" aria-current="true">Installation</a></li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</nav>
```

---

## Serious: Smooth Scroll Must Respect `prefers-reduced-motion`

Unconditional `scroll-behavior: smooth` can trigger vestibular disorders.
**Applying smooth scroll globally without the media query guard is Serious.**

```css
/* Never unconditional */
/* Bad: html { scroll-behavior: smooth; } */

/* Good */
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}
```

JavaScript scroll:

```js
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

link.addEventListener('click', (e) => {
  e.preventDefault();
  const target = document.getElementById(link.hash.slice(1));
  target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  target.focus({ preventScroll: true });
});
```

---

## Minor: URL Stability

* Use meaningful slug IDs (`#installation-guide` not `#section-3`)
* Update `window.location.hash` when JS intercepts anchor clicks
* IDs must not contain spaces; use hyphens as separators
* IDs must be unique within the page — duplicate IDs break AT and `href="#id"` resolution

---

## Definition of Done Checklist

* [ ] All link text descriptive and meaningful out of context
* [ ] "Link to" not used in `aria-label` — role already announced
* [ ] Target elements have unique `id` values
* [ ] Non-interactive targets have `tabindex="-1"` if programmatic focus needed
* [ ] Skip link: first in DOM, visible on focus, not `display:none` or `visibility:hidden`
* [ ] `scroll-margin-top` set to clear sticky headers on both `:target` and `:focus`
* [ ] Smooth scroll wrapped in `prefers-reduced-motion: no-preference`
* [ ] `aria-current="true"` on active TOC link (if table of contents present)
* [ ] IDs are unique within page and use hyphens, not spaces
* [ ] No focus traps after anchor navigation

---

## Key WCAG Criteria

* 2.4.1 Bypass Blocks (A) — **Serious if skip link broken or hidden**
* 2.4.4 Link Purpose in Context (AA) — **Serious if link text is ambiguous**
* 2.4.7 Focus Visible (AA)
* 2.4.11 Focus Appearance (AA, WCAG 2.2)
* 2.4.12 Focus Not Obscured (AA, WCAG 2.2) — sticky header obscuring target

Note: Smooth scroll animation is a best practice aligned with `prefers-reduced-motion`
but is not directly tested under WCAG 2.2 AA (WCAG 2.3.3 Animation from Interactions
is Level AAA). The guard is still required as a progressive enhancement baseline.

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/ANCHOR_LINKS_ACCESSIBILITY_BEST_PRACTICES.md)
* [WCAG 2.2 Understanding 2.4.4 Link Purpose](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html)
* [WCAG 2.2 Understanding 2.4.12 Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured.html)
* [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

> **Standards horizon:** These rules target WCAG 2.2 AA. No breaking changes
> anticipated in WCAG 3.0 for anchor link patterns.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
