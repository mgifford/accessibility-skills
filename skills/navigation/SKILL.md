---
name: navigation
description: >
  Load this skill whenever the project contains navigation components —
  primary navigation menus, dropdown menus, mega menus, breadcrumbs,
  pagination, mobile hamburger menus, or in-page jump navigation. Under no
  circumstances create navigation without proper landmark roles, keyboard
  support, and accessible labels. Absolutely always wrap navigation in
  <nav> with a unique aria-label.
---

# Navigation Accessibility Skill

> **Canonical source**: `examples/NAVIGATION_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when creating or reviewing navigation patterns: primary nav,
dropdowns, breadcrumbs, pagination, mobile menus, and in-page navigation.
**Only load this skill if the project contains navigation components.**

---

## Core Mandate

Navigation must remain understandable and operable with keyboards, touch,
speech input, screen readers, screen magnification, text resizing, and
browser zoom. Screen reader users rely on landmark structure to orient
themselves; keyboard users rely on predictable tab order and dropdown
behaviour; voice control users rely on visible, correctly-labelled
interactive elements; magnification users rely on nav that reflows without
breaking. Get navigation wrong and everything downstream is harder.

---

## Severity Scale (this skill)

| Level | Meaning |
|---|---|
| **Critical** | Navigation completely unreachable or creates a keyboard trap |
| **Serious** | Dropdown only works on hover; `role="menu"` misused; no `aria-current` |
| **Moderate** | Missing `aria-label` on secondary nav; breadcrumb not labelled |
| **Minor** | Nav item count exceeds 7; inconsistent `aria-expanded` update |

Do not assign severity from the pattern alone — determine the actual effect
on navigation and task completion. Consider whether users can reach main
content, whether a menu can be opened/operated/closed/left, whether focus
becomes trapped or lost, and whether the defect affects every page through a
shared component (a shared nav trap can block an entire site).

---

## Assistive Technology Context

Navigation behaves differently across AT. Test with:

| AT | Browser | Key behaviour |
|---|---|---|
| NVDA | Chrome | `H` key for headings, `R` for regions, list count announced on nav entry |
| JAWS | Chrome | `F6` for frames/regions, `Q` to move to main; announces nav landmark |
| VoiceOver | Safari (macOS) | `VO+U` rotor for landmarks and links; announces nav label |
| VoiceOver | Safari (iOS) | Swipe to navigate; nav landmark accessible via rotor |
| TalkBack | Chrome (Android) | Linear swipe navigation; landmarks via local context menu |
| Voice Control | Any | Users navigate by visible link text; all interactive elements need accurate visible labels. `aria-label` that differs from visible text breaks voice control |
| Screen magnification | Any | Sticky/fixed navbars shrink the visible viewport at high zoom (200%, 400%) |
| Reader Mode | Firefox/Edge/Safari | Strips nav from the article view — acceptable; main content must make sense without it |

**Voice Control note:** Dragon and iOS Voice Control navigate by speaking
visible link text. If `aria-label` differs from visible text, users cannot
activate the link by speaking what they see — **the accessible name must
contain the visible text** (WCAG 2.5.3 Label in Name).

---

## Critical: Landmark Structure

```html
<a class="skip-link" href="#main-content">Skip to main content</a>

<header>
  <a href="/">Service name</a>
  <nav aria-label="Primary">
    <ul>
      <li><a href="/services">Services</a></li>
      <li><a href="/guidance">Guidance</a></li>
    </ul>
  </nav>
</header>

<main id="main-content" tabindex="-1">
  <h1>Page title</h1>
</main>

<footer>
  <nav aria-label="Footer">…</nav>
</footer>
```

* `<nav>` wraps every major group of links that help users navigate the site,
  page, or process — don't wrap every incidental link list in a nav landmark;
  excess landmarks make region navigation harder
* When multiple `<nav>` elements are present, **every one** needs an
  understandable name so users can distinguish them: `aria-label="Primary"`,
  `"Footer"`, `"On this page"` — do not include the role word ("Primary
  navigation landmark" is redundant since the role is already exposed)
* Use `aria-labelledby` when a visible heading already names the region
* Use the **same** name for repeated navigation landmarks containing the same
  links; use **different** names when landmarks serve different purposes
* Do not add redundant `role="navigation"` to `<nav>`

**Missing `<nav>` landmark is Serious** — screen reader users cannot jump to
navigation via the rotor or landmarks list.

---

## Critical: Skip Link

Must be at or near the beginning of the body, before the content it bypasses,
and must be one of the first useful keyboard stops (not necessarily the
literal first DOM node). A permanently hidden skip link (`display:none`,
`visibility:hidden`, or `hidden`) is a Serious issue — it defeats WCAG 2.4.1.

```css
.skip-link {
  position: fixed;
  z-index: 1000;
  inset-block-start: 0.5rem;
  inset-inline-start: 0.5rem;
  padding: 0.75rem 1rem;
  color: #ffffff;
  background: #000000;
  transform: translateY(-200%);
}
.skip-link:focus { transform: translateY(0); }
```

Ensure activation moves both viewport and keyboard focus to the destination;
use `tabindex="-1"` on `<main>` for reliable programmatic focus; ensure sticky
headers don't obscure the destination. WCAG also permits other conforming
bypass mechanisms (headings, landmarks) depending on the conformance approach.

---

## Serious: Current Location (`aria-current`)

```html
<nav aria-label="Primary">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/guidance" aria-current="page">Guidance</a></li>
  </ul>
</nav>
```

Use the value matching the relationship — not always `"true"`:

* `aria-current="page"` — the current page
* `aria-current="step"` — the current step in a process
* `aria-current="location"` — current location within an environment (e.g., scroll-spy TOC)
* `aria-current="date"` / `"time"` — where applicable
* `aria-current="true"` — only when no more specific token applies

Do not use `aria-selected` for ordinary navigation links — reserve it for
widgets whose selected state is part of their role (tabs, listboxes). Always
also provide a **visual** current-item indicator that doesn't rely on colour
alone. **Missing `aria-current` on a current-location indicator is Serious**
— screen reader users cannot determine where they are without it.

---

## Serious: Site Navigation Is Not an Application Menu

**Using `role="menu"`/`"menuitem"`/`"menubar"` on ordinary site navigation is
Serious.** Those roles put screen readers into application-menu interaction
mode (arrow keys navigate, Tab exits the whole menu) — a mismatch with what
users expect from web navigation.

```html
<!-- Wrong -->
<nav><ul role="menu"><li role="menuitem"><a href="/about">About</a></li></ul></nav>

<!-- Right — native semantics, no ARIA menu roles -->
<nav aria-label="Primary">
  <ul><li><a href="/about">About</a></li></ul>
</nav>
```

The distinction is based on behaviour and purpose, not visual appearance.
`role="menu"`/`"menuitem"` is appropriate only for application toolbar/action/
context menus that genuinely implement full arrow-key interaction — see the
[WAI-ARIA APG menubar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)
for that distinct use case.

---

## Serious: Disclosure (Dropdown) Navigation

Use disclosure buttons for site navigation that shows/hides nested link
lists — do not force ordinary navigation into the ARIA menubar pattern.

```html
<nav aria-label="Primary" data-disclosure-nav>
  <ul>
    <li data-disclosure-item>
      <a href="/services">Services</a>
      <button type="button" aria-expanded="false" aria-controls="services-links">
        <span class="visually-hidden">Show Services submenu</span>
        <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20">
          <path d="m5 7 5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
      <ul id="services-links" hidden>
        <li><a href="/services/design">Design</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

**Do not mix link and dropdown trigger on a single element** — if "Services"
is both a link and the dropdown trigger, keyboard users can't reach the
dropdown without navigating away. Use a separate button (shown above), or a
button-only parent with an "Overview" link as the first child.

```js
document.querySelectorAll('[data-disclosure-nav]').forEach((navigation) => {
  const buttons = Array.from(navigation.querySelectorAll('[data-disclosure-item] > button[aria-controls]'));

  function close(button, restoreFocus = false) {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    button.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
    if (restoreFocus) button.focus();
  }
  function open(button) {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    button.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      expanded ? close(button) : open(button);
    });
    const item = button.closest('[data-disclosure-item]');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
        e.preventDefault();
        close(button, true);
      }
    });
    item.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget)) close(button);
    });
  });

  document.addEventListener('pointerdown', (event) => {
    buttons.forEach((button) => {
      const item = button.closest('[data-disclosure-item]');
      if (!item.contains(event.target)) close(button);
    });
  });
});
```

Requirements: `aria-expanded` and `hidden` stay synchronized; Tab/Shift+Tab
follow ordinary order; Escape closes and returns focus to the button; moving
focus outside the parent item closes its submenu; opening doesn't
automatically move focus or change the page; the component works without
hover; scope JavaScript to the nav component, not every `aria-controls`
element on the page.

**Hover behaviour is optional** — click/activation must be sufficient. If
hover or focus also reveals content, WCAG 1.4.13 requires it be dismissible
(without moving focus/pointer), hoverable (pointer can move onto it), and
persistent (stays until hover/focus removed or dismissed). A CSS
`transition-delay` alone does not satisfy hoverable/persistent behaviour.

---

## Moderate: Breadcrumbs

```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/services">Services</a></li>
    <li aria-current="page">Web accessibility</li>
  </ol>
</nav>
```

Use `<ol>` — order is meaningful. Hide decorative separators from AT
(preferably via CSS). The current item may be plain text or a link — don't
create a link that performs no useful navigation. Keep the visible breadcrumb
consistent with the actual page hierarchy. WCAG does not require breadcrumbs
on every site.

---

## Moderate: Pagination

```html
<nav aria-label="Pagination">
  <ul>
    <li><a href="?page=1" rel="prev">Previous</a></li>
    <li><a href="?page=1" aria-label="Page 1">1</a></li>
    <li><a href="?page=2" aria-label="Page 2" aria-current="page">2</a></li>
    <li><a href="?page=3" rel="next">Next</a></li>
  </ul>
</nav>
```

Use visible "Previous"/"Next" text where space permits; if only an arrow is
visible, the accessible name must contain "Previous"/"Next". Ensure the
current page has a visible non-colour distinction. Do not create links for
unavailable Previous/Next actions. Preserve filters, search terms, and sort
order in pagination URLs.

---

## Moderate: Responsive (Mobile) Navigation

Treat a typical responsive menu as a **non-modal disclosure** unless the
design genuinely requires a modal navigation drawer — do not apply `inert` to
the rest of the page for an ordinary hamburger menu.

```html
<button type="button" id="navigation-toggle" aria-expanded="false" aria-controls="responsive-navigation">
  <span>Menu</span>
  <svg aria-hidden="true" focusable="false"><!-- menu icon --></svg>
</button>
<nav id="responsive-navigation" aria-label="Primary" hidden>
  <ul><li><a href="/">Home</a></li></ul>
</nav>
```

```js
const toggle = document.getElementById('navigation-toggle');
const navigation = document.getElementById('responsive-navigation');

function setNavigationOpen(open) {
  toggle.setAttribute('aria-expanded', String(open));
  navigation.hidden = !open;
}
toggle.addEventListener('click', () => setNavigationOpen(toggle.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') { setNavigationOpen(false); toggle.focus(); }
});
```

For a **non-modal** disclosure: keep the toggle immediately before the nav in
DOM order; do not make the rest of the page inert; do not trap focus; do not
force focus into the first link (Tab naturally moves from toggle into the
revealed nav); support Escape to close and return focus; ensure links after
the nav remain reachable.

If the navigation genuinely is a **modal** drawer, implement it as a full
modal dialog: focus containment, accessible name, visible close button,
Escape handling, background inertness, and focus restoration. Don't create
partial modality by applying `inert` without the complete modal interaction
(see `skills/keyboard/SKILL.md`).

---

## Moderate: Consistent Navigation and Multiple Ways to Find Pages

Navigation repeated across a set of pages must occur in the same relative
order unless the user initiates a change (WCAG 3.2.3). Keep repeated link
names/destinations consistent; don't reorder navigation based on inferred
user characteristics without an explicit user-controlled personalization
feature.

For pages within a set, provide more than one way to locate a page (WCAG
2.4.5) unless it's a step or result within a process — hierarchical
navigation, site search, sitemap, table of contents, or index. Two
presentations of the same list don't count as meaningfully different ways.

---

## Moderate: Client-Side Routing and Dynamic Navigation

A route change must establish a clear new-page context: update the document
title, update the main heading/current-location state, move focus to a
logical target, preserve Back/Forward, and avoid duplicate announcements.

```html
<main id="main-content">
  <h1 id="page-heading" tabindex="-1">Account settings</h1>
</main>
```

```js
document.title = 'Account settings · Service name';
document.getElementById('page-heading').focus();
```

Do not automatically combine heading focus, main-region focus, assertive live
regions, AND route announcements — that produces repeated or interrupted
output. Choose one tested strategy. Preserve real `<a>` semantics for
route-changing links — do not use a button for navigation merely because
JavaScript handles the route.

---

## Reflow, Zoom, and Magnification

At 200%/400% zoom and narrow viewports: navigation must reflow without 2D
scrolling; controls/labels/focus indicators must not be clipped; sticky nav
must not consume an unreasonable portion of the viewport or obscure the
focused component; users must be able to dismiss persistent overlays; touch
targets remain usable without overlap. Test with actual browser zoom, not
just window resizing, and in both orientations.

---

## CMS and Framework Notes

**Drupal:** the Menu module generates `<nav>` markup; the active-trail
`.is-active` class does not itself add `aria-current="page"` — set it
programmatically too. See the
[Drupal Accessibility Coding Standards](https://www.drupal.org/docs/getting-started/accessibility/accessibility-coding-standards).

**WordPress:** block themes use `<nav>` landmarks, but `wp_nav_menu()` does
not add `aria-label` by default when multiple menus are present — use the
`nav_menu_args` filter.

**React/SPA frameworks:** must announce page changes after navigation (see
Client-Side Routing above). Without this, screen reader users hear nothing
after a route change.

When reviewing any CMS/framework-generated nav, verify: native links and
landmarks are used; stable IDs for disclosure relationships; `aria-current`
added/updated correctly; visible and accessible names stay aligned; no menu
roles added to site nav; `aria-expanded`/`hidden` stay synchronized; hidden
responsive variants are removed from focus order and the accessibility tree.
Prefer correcting the shared template over patching individual pages.

---

## Testing

* **Structure:** inspect the landmark list for distinguishable major regions;
  confirm incidental link groups don't create unnecessary landmarks; confirm
  repeated identical navigation uses consistent names; confirm the current
  item is visible and programmatically identified
* **Keyboard:** activate the skip link and confirm focus/viewport movement;
  Tab/Shift+Tab through every nav control; open/close each disclosure with
  Enter/Space; Escape closes open submenus and responsive nav; confirm focus
  is never trapped, lost, or obscured; confirm site nav doesn't require
  application-menu arrow keys
* **Pointer/touch/speech:** operate with mouse, touch, and a large pointer;
  confirm hover-triggered content is dismissible/hoverable/persistent; confirm
  visible labels are contained in accessible names; activate controls by
  speaking their visible labels
* **Reflow:** 200%/400% zoom; 320px viewport; portrait/landscape; text-spacing
  overrides; light/dark/forced-colours modes
* **Routes/resilience:** follow links with JS disabled where progressive
  enhancement is required; test Back/Forward/refresh/deep-links/copied URLs;
  confirm route changes update title/heading/focus/current-state without
  duplicate announcements; test long labels, localization, and RTL text

**Automated checks** can catch duplicate IDs, broken `aria-controls`
references, missing/duplicate landmark names, invalid menu roles,
`aria-expanded`/`hidden` desync, and focusable content inside hidden/inert
navigation — but cannot determine whether labels are understandable, link
purpose is clear, or the complete navigation model is usable. Retain manual
keyboard, screen reader, magnification, and touch testing.

---

## Definition of Done Checklist

* [ ] `<nav>` landmark wraps every major navigation region (not incidental link lists)
* [ ] Every `<nav>` has a unique, understandable name (no role word in the name)
* [ ] Skip link: near the start of `<body>`, visible on focus, target has `tabindex="-1"`
* [ ] `aria-current` uses the value matching the relationship (page/step/location/true)
* [ ] `role="menu"`/`"menuitem"`/`"menubar"` not used on site navigation
* [ ] Dropdowns use the Disclosure pattern: `aria-expanded`, `aria-controls`, `hidden`
* [ ] Top-level link and dropdown trigger are separate elements
* [ ] Escape closes dropdown/responsive nav and returns focus to trigger
* [ ] Hover-revealed content is dismissible, hoverable, and persistent (WCAG 1.4.13)
* [ ] Breadcrumb: `<ol>`, named landmark, `aria-current="page"` on current item
* [ ] Pagination: named landmark, accessible Previous/Next names, `aria-current` on current page
* [ ] Responsive nav implemented as either complete non-modal or complete modal
      pattern — not a hybrid with partial `inert`
* [ ] Repeated navigation stays in consistent relative order across pages
* [ ] Multiple ways to find pages provided where WCAG 2.4.5 applies
* [ ] SPA/framework: focus moved and page title announced after route change,
      without duplicate announcements
* [ ] Voice Control tested: all links activatable by speaking visible text
* [ ] Tested at 200%/400% zoom: nav not covering content
* [ ] Tested: NVDA+Chrome, JAWS+Chrome, VoiceOver+Safari

---

## Key WCAG Criteria

* 2.4.1 Bypass Blocks (A) — **Serious if skip link absent or broken**
* 2.4.3 Focus Order (A)
* 2.4.4 Link Purpose in Context (A)
* 2.4.5 Multiple Ways (AA)
* 2.4.7 Focus Visible (AA)
* 2.4.11 Focus Not Obscured Minimum (AA, WCAG 2.2)
* 1.4.13 Content on Hover or Focus (AA)
* 2.5.3 Label in Name (A) — **Serious for voice control if violated**
* 3.2.3 Consistent Navigation (AA)
* 3.2.4 Consistent Identification (AA)
* 4.1.2 Name, Role, Value (A) — **Serious if `aria-expanded` not updated**

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/NAVIGATION_ACCESSIBILITY_BEST_PRACTICES.md)
* [Curated resources — navigation](../../resources/by-topic/navigation.md)
* [WAI Menus Tutorial](https://www.w3.org/WAI/tutorials/menus/)
* [WAI-ARIA APG — Disclosure Navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/)
* [WAI-ARIA APG — Menubar](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/) — application toolbar menus only
* [Adrian Roselli — Be careful using menu](https://adrianroselli.com/2023/05/be-careful-using-menu.html)
* [Drupal Accessibility Coding Standards](https://www.drupal.org/docs/getting-started/accessibility/accessibility-coding-standards)
* [WCAG 2.2 Understanding 3.2.3 Consistent Navigation](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html)
* [WCAG 2.2 Understanding 2.4.5 Multiple Ways](https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways.html)

> **Standards horizon:** These rules target WCAG 2.2 AA. No breaking changes
> to navigation requirements are anticipated in WCAG 3.0.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
