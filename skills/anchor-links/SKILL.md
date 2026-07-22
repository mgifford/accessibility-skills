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
focus indicator, and must not cause motion-related harm. Use a real `<a>`
element with an `href` for navigation; use a button only for actions that
don't navigate. Prefer native fragment navigation before adding JavaScript.

---

## Severity Scale (this skill)

| Level | Meaning |
|---|---|
| **Critical** | Anchor navigation blocks access or causes a trap |
| **Serious** | Skip link broken or permanently hidden; smooth scroll triggers vestibular harm |
| **Moderate** | Focus indicator obscured by sticky header; link text ambiguous in context |
| **Minor** | Non-slug IDs; missing `aria-current` in table of contents |

---

## Use Links for Navigation, Not Actions

Use an anchor when activation changes the URL or navigates to a location; use
a button when activation performs an action without navigation.

```html
<!-- Navigation to a page fragment -->
<a href="#installation">Installation instructions</a>

<!-- An action -->
<button type="button" id="copy-installation-link">Copy link to Installation</button>
```

Do not use dummy links for actions:

```html
<!-- Do not use these for actions -->
<a href="#">Open settings</a>
<a href="javascript:void(0)">Open settings</a>
```

An empty fragment navigates to the top of the document; a JavaScript URL loses
ordinary link semantics (history, copying, opening in a new tab, no-script
fallback). Do not add `role="link"` to a native anchor with `href` — the role
is already provided.

---

## Serious: Meaningful Link Text

WCAG 2.4.4 requires a link's purpose be determinable from its text alone or
text plus programmatically determined context — understanding every link
without any context is the stronger Level AAA criterion (2.4.9), still a
useful goal.

```html
<!-- Prefer -->
<a href="#installation">Installation instructions</a>
<a href="#wcag-criteria">Relevant WCAG success criteria</a>

<!-- Avoid when clearer wording is available -->
<a href="#section">Click here</a>
<a href="#section">Read more</a>
```

"Read more" is not automatically a Level A failure when programmatically
determined context supplies the purpose, but clearer text is easier to scan,
translate, and operate by speech. If a design must retain repeated visible
text, add hidden context inside the link rather than replacing it:

```html
<a href="#keyboard-testing">
  Read more<span class="visually-hidden"> about keyboard testing</span>
</a>
```

Do not use `aria-label` to replace useful visible text with a different name
— the accessible name should contain the visible words (supports speech input
and WCAG 2.5.3 Label in Name). For icon-only links, "Link to" is redundant —
screen readers already announce the role:

```html
<a href="#installation" aria-label="Installation section">
  <svg aria-hidden="true" focusable="false"><!-- anchor icon --></svg>
</a>
```

Links with the same purpose/destination should use consistent names; links
with the same text but different destinations need enough context to
distinguish them.

---

## Serious: Fragment Targets Must Be Unique, Visible, and Stable

The fragment after `#` must resolve to a unique `id` within the document; IDs
must not contain ASCII whitespace.

```html
<nav aria-label="On this page"><a href="#installation">Installation</a></nav>
<h2 id="installation">Installation</h2>
```

Do not target: an element with `hidden`/`display:none`/`visibility:hidden`;
content inside a closed disclosure; an inactive tab panel; an empty marker far
from the visible heading; or an element removed during hydration. If a deep
link points into collapsed or tabbed content, reveal the container before
scrolling or moving focus.

**Keep published IDs stable:** preserve an existing ID when the destination is
conceptually the same; provide an alias/redirect strategy when an ID must
change; don't regenerate every ID just because heading text/capitalization
changed. Generated slug systems must resolve duplicate headings deterministically
and produce the same ID during server rendering and client hydration.

---

## Serious: Skip Link

Must be the first focusable control (or part of the first small set of skip
links) and become fully visible when focused.
**A skip link that is permanently hidden (`display:none`, `visibility:hidden`)
is Serious** — it defeats WCAG 2.4.1 entirely.

```html
<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <header><!-- Site identity and repeated navigation --></header>
  <main id="main-content" class="skip-target" tabindex="-1">
    <h1>Page title</h1>
  </main>
</body>
```

```css
.skip-link {
  position: absolute;
  z-index: 1000;
  inset-block-start: 0;
  inset-inline-start: 1rem;
  padding: 0.75rem 1rem;
  color: #ffffff;
  background: #111827;
  font-weight: 700;
  transform: translateY(-150%);
}
.skip-link:focus {
  transform: translateY(0);
  outline: 3px solid #facc15;
  outline-offset: 2px;
}
@media (forced-colors: active) {
  .skip-link { color: LinkText; background: Canvas; border: 1px solid LinkText; }
  .skip-link:focus { outline-color: Highlight; }
}
```

After activation: focus is in the main content; the main heading/beginning of
content is visible; the next Tab reaches the first logical interactive
element in the main content; the skipped navigation is not traversed first.
`tabindex="-1"` allows focus without adding a tab stop — it is not sequential
tab order. Test at 400% zoom and with long translated text; the focused link
must not be clipped by the viewport, a cookie banner, a fixed header, or an
`overflow: hidden` ancestor.

---

## Moderate: Focus Management for Ordinary In-Page Links

Scrolling and focus are related but different — a visual scroll does not
prove keyboard focus or a screen reader's point of regard moved anywhere
useful. Start with native HTML and don't cancel the click:

```html
<a href="#testing">Testing</a>
<h2 id="testing">Testing</h2>
```

Do not automatically add `tabindex="-1"` to every heading or call `.focus()`
for every fragment merely because JavaScript can do so. Programmatic focus is
appropriate when native behavior doesn't provide an understandable transition,
or navigation has been intercepted:

```js
function focusFragmentTarget(target) {
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  target.scrollIntoView({ block: 'start' });
}
```

Do not add a positive `tabindex`; do not focus a hidden element. When focus
moves to a normally non-interactive target, provide a visible orientation cue:

```css
.skip-target:focus, .programmatic-focus-target:focus {
  outline: 3px solid currentColor;
  outline-offset: 0.25rem;
}
```

---

## Moderate: Sticky and Fixed Headers

Use CSS scroll offsets so fragment targets and focused elements are not placed
under a sticky header (WCAG 2.4.11 Focus Not Obscured Minimum also applies here):

```css
:root { --anchor-offset: 5rem; }
html { scroll-padding-block-start: var(--anchor-offset); }
h2[id], h3[id], main[id], .anchor-target {
  scroll-margin-block-start: var(--anchor-offset);
}
```

Set `scroll-padding-block-start` on the element that actually scrolls — for an
internal scrolling region, setting it only on `html` has no effect. The offset
must match the header at responsive breakpoints, zoom levels, and when
banners appear/disappear.

---

## Serious: Smooth Scroll Must Respect `prefers-reduced-motion`

The most robust default is immediate native scrolling. Unconditional
`scroll-behavior: smooth` can trigger vestibular disorders.
**Applying smooth scroll globally without the media query guard is Serious.**

```css
/* Never unconditional */
/* Bad: html { scroll-behavior: smooth; } */

@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}
```

```js
const allowMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
target.scrollIntoView({ behavior: allowMotion ? 'smooth' : 'auto', block: 'start' });
```

Do not pair smooth scroll with parallax, animated highlighting, or other
motion that makes the destination harder to track. Do not add JavaScript only
to reproduce behavior already available through native fragment navigation.

---

## Moderate: Table of Contents and Scroll-Spy

```html
<nav aria-labelledby="contents-heading">
  <h2 id="contents-heading">Contents</h2>
  <ol>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#configuration">Configuration</a></li>
  </ol>
</nav>
```

Match link wording to the destination heading; preserve heading hierarchy;
don't let a long TOC become another block users need to bypass.

For scroll-spy, mark the section currently in view with **`aria-current="location"`**
(not `"true"`), updated via IntersectionObserver or scroll listener:

```html
<nav aria-labelledby="on-this-page-heading">
  <ul>
    <li><a href="#overview" aria-current="location">Overview</a></li>
    <li><a href="#testing">Testing</a></li>
  </ul>
</nav>
```

Expose the current state visually too; keep only one link current. Do not
announce every scroll-spy change with a live region, and do not push a new
history entry on every scroll-spy update.

---

## Moderate: Heading Permalinks and Back-to-Top

A permalink navigates to the heading's fragment; keep it visually/structurally
separate from the heading so its accessible name doesn't become part of the
heading text:

```html
<div class="heading-with-permalink">
  <h2 id="installation">Installation</h2>
  <a class="permalink" href="#installation">
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">…</svg>
    <span class="visually-hidden">Permalink to Installation</span>
  </a>
</div>
```

The permalink needs a section-identifying accessible name, a visible focus
indicator, a usable target size, sufficient contrast if the icon identifies
the link, and availability without pointer hover. If activation copies the
URL instead of navigating, use a button named "Copy link to Installation" with
a status message after the copy succeeds.

For back-to-top links, use an explicit target rather than an empty `#`:

```html
<header id="page-top" class="programmatic-focus-target" tabindex="-1">…</header>
<a href="#page-top">Back to top</a>
```

Ensure the target isn't placed behind sticky content, and don't repeat the
link so often it adds noise to every short section.

---

## Serious: Single-Page Applications and Routers

An accessible router must handle both route and fragment navigation:

* Render a real anchor with a usable `href` (e.g., `/settings#notifications`)
  — never a button for route/fragment navigation
* Preserve modifier-click, open-in-new-tab, copying, and no-script behavior
* Wait until the destination route and target are rendered; reveal a collapsed
  parent before navigating to the target
* Update the URL and create the appropriate history entry; scroll the correct
  container; move focus when a route change requires it
* Handle the fragment on initial load, `hashchange`, and back/forward navigation
* Prevent stale async route content from moving focus after the user has
  navigated elsewhere

A full route change generally needs document-title and main-heading focus
management (see `skills/navigation/SKILL.md`); a same-page fragment change does
not automatically need the same route announcement.

---

## Minor: URL and History Stability

* Preserve the fragment in the URL after activation — supports bookmarking,
  sharing, reload, and Back/Forward
* Do not remove the hash after scrolling; do not use `history.replaceState()`
  for ordinary anchor navigation if it would prevent Back from working
* Use meaningful slug IDs (`#installation-guide` not `#section-3`) — this is a
  documented authoring convention, not a WCAG requirement (HTML permits more
  characters than letters/hyphens)
* IDs must not contain spaces; IDs must be unique within the page

---

## Testing

* **Keyboard (skip link):** Tab from browser chrome; confirm skip link is
  first/near-first focusable; confirm fully visible with focus indicator;
  Enter moves focus to main content; Tab continues with the first logical
  control in main content
* **Keyboard (anchor links):** reach link, confirm focus indicator; Enter
  activates; confirm target visible and not obscured; Tab/Shift+Tab logical;
  Back/Forward preserve history and focus
* **Screen reader:** review the links list for useful names; activate skip
  link and verify main content is the new location; activate TOC links and
  confirm destination is understandable; test direct fragment URLs on load/reload
* **Visual/zoom/motion:** 200%/400% zoom; narrow viewports; sticky
  headers/banners don't cover targets or focus; text-spacing overrides; high
  contrast/forced-colors; reduced motion gives immediate scroll; RTL content
* **Touch/speech:** adequate activation areas; permalinks don't require hover;
  accessible names match visible labels for speech input

**Automated checks** can catch: links without accessible names, empty/dummy
`href`, unresolved fragments, duplicate IDs, whitespace in IDs, positive
`tabindex`, focusable content hidden with `aria-hidden`, icon-only links
without text alternatives. Run a link checker against built output, not just
source Markdown. Automation cannot confirm focus placement, sticky-header
clearance, motion behavior, or whether the destination is understandable.

---

## Common Failures

| Failure | Correction |
|---|---|
| Using a button for fragment navigation | Use an anchor with a real `href` |
| Using `href="#"` as a JS action | Use a button, or the real fragment destination |
| Replacing visible text with a different `aria-label` | Keep the visible words in the accessible name |
| Linking to a missing or duplicate ID | Create one unique matching target |
| Regenerating IDs whenever heading text changes | Preserve published deep links |
| Moving focus to every heading automatically | Use native navigation; add focus management only where needed |
| Adding `tabindex="0"` to headings | Use `tabindex="-1"` for intentional programmatic focus only |
| Scrolling to content hidden behind a sticky header | Use correct scroll padding/margin; test responsive offsets |
| Using unconditional smooth scrolling | Gate with `prefers-reduced-motion: no-preference` |
| Pushing a history entry on every scroll-spy update | Update current state without polluting history |
| Linking into closed or inactive content | Reveal the containing disclosure/panel before navigation |

---

## Definition of Done Checklist

* [ ] All link text descriptive and meaningful out of context
* [ ] "Link to" not used in `aria-label` — role already announced
* [ ] Target elements have unique `id` values; published IDs kept stable
* [ ] Non-interactive targets have `tabindex="-1"` only when programmatic focus is needed
* [ ] Skip link: first in DOM (or near it), visible on focus, never `display:none`/`visibility:hidden`
* [ ] `scroll-padding`/`scroll-margin` clears sticky headers on both target and focus
* [ ] Smooth scroll wrapped in `prefers-reduced-motion: no-preference`
* [ ] `aria-current="location"` on active TOC/scroll-spy link (not `"true"`)
* [ ] Heading permalinks and back-to-top links have identifying names and visible targets
* [ ] SPA routers preserve real `href`, history, and modifier-click behavior
* [ ] IDs are unique within page and use hyphens, not spaces
* [ ] No focus traps after anchor navigation

---

## Key WCAG Criteria

* 2.4.1 Bypass Blocks (A) — **Serious if skip link broken or hidden**
* 2.4.4 Link Purpose in Context (A) — **Serious if link text is ambiguous**
* 2.4.7 Focus Visible (AA)
* 2.4.9 Link Purpose Link Only (AAA) — strong design goal beyond the Level A minimum
* 2.4.11 Focus Not Obscured Minimum (AA, WCAG 2.2) — sticky header obscuring target
* 2.5.3 Label in Name (A)
* 3.2.4 Consistent Identification (AA)

Smooth scroll animation is a best practice aligned with `prefers-reduced-motion`
but is not directly tested under WCAG 2.2 AA (2.3.3 Animation from Interactions
is Level AAA). The guard is still required as a progressive enhancement baseline.

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/ANCHOR_LINKS_ACCESSIBILITY_BEST_PRACTICES.md)
* [WCAG 2.2 Understanding 2.4.4 Link Purpose](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html)
* [WCAG 2.2 Understanding 2.4.9 Link Purpose Link Only](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-link-only.html)
* [WCAG 2.2 Understanding 2.4.11 Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
* [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

> **Standards horizon:** These rules target WCAG 2.2 AA. No breaking changes
> anticipated in WCAG 3.0 for anchor link patterns.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
