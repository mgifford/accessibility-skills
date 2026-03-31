---
name: keyboard
description: >
  Load this skill for every project containing interactive UI elements —
  buttons, links, modals, dropdowns, sliders, tabs, carousels, or any
  custom widget. Under no circumstances create an interactive component that
  cannot be fully operated by keyboard alone. Absolutely always ensure visible
  focus indicators, logical tab order, and no keyboard traps. Apply these
  rules to every interactive element without exception.
---

# Keyboard Accessibility Skill

> **Canonical source**: `examples/KEYBOARD_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules to every interactive UI element and feature.

---

## Core Mandate

All interactive functionality must be fully usable with a keyboard alone —
no mouse or touch required.

---

## Severity Scale (this skill)

| Level | Meaning |
| --- | --- |
| **Critical** | Blocks task completion entirely for keyboard and AT users |
| **Serious** | Significantly impairs keyboard access; workaround unreasonable |
| **Moderate** | Creates friction for keyboard users; workaround exists |
| **Minor** | Best-practice gap; marginal keyboard impact |

---

## Critical: No Keyboard Trap

Users must never become unable to move focus away from a component using
standard keys (Tab, Shift+Tab, Escape, arrow keys).
The only permitted exception is an intentional modal dialog trap where Escape
closes the dialog and returns focus to the trigger.

**A keyboard trap with no exit is Critical** — it locks keyboard users and
switch-access users into a dead end with no recovery path.

---

## Critical: All Interactive Elements Must Be Keyboard Reachable

Every element that can be activated by mouse must be reachable and activatable
by keyboard. **Use native elements** — they have keyboard support, focus
management, and ARIA semantics built in at zero extra cost:

```html
<!-- Good: built-in keyboard support -->
<button type="button">Save</button>
<a href="/about">About</a>

<!-- Avoid: requires full ARIA + JS to match native behaviour -->
<div role="button" tabindex="0">Save</div>
```

Never attach `click` handlers to non-interactive elements (`<div>`, `<span>`,
`<p>`) without also adding the correct `role`, `tabindex="0"`, and keyboard
event handlers for both `Enter` and `Space`.

---

## Critical: Expected Key Behaviours

Deviating from expected widget key behaviour is **Critical** — it breaks the
mental model that AT users depend on. Follow the
[WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) for each widget type.
The APG is versioned independently of WCAG — always confirm you are reading
the current version before implementing a pattern.

| Control | Required keys |
| --- | --- |
| Button | `Enter`, `Space` |
| Link | `Enter` |
| Checkbox | `Space` to toggle |
| Radio group | Arrow keys to move between options; `Space` to select |
| Select / listbox | Arrow keys to navigate; `Enter` to confirm |
| Menu / menubar | Arrow keys; `Enter` to activate item; `Escape` to close |
| Tab widget | Arrow keys between tabs; `Enter`/`Space` to activate tab |
| Dialog | `Escape` to close; focus trapped inside while open |
| Combobox | Arrow keys in list; `Enter` to select; `Escape` to collapse |
| Tree view | Arrow keys to expand/collapse/navigate nodes |
| Slider | Arrow keys to change value; `Home`/`End` for min/max |

---

## Critical: Dialog Focus Management

Incorrect dialog focus management is **Critical** — keyboard and screen reader
users lose their place, or cannot reach dialog controls at all.

### Preferred approach: `inert` attribute

The `inert` attribute prevents all interaction (focus, click, AT) with elements
outside the open dialog. It is simpler and more reliable than manual focusable-
element cycling and has good browser support (baseline 2023).

```js
const focusableSelectors = [
  'a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])',
  'textarea:not([disabled])', 'button:not([disabled])',
  '[tabindex]:not([tabindex="-1"])', 'details > summary'
].join(', ');

function openDialog(dialog, trigger) {
  // Make everything outside the dialog inert
  document.querySelectorAll('body > *:not(#dialog-container)')
    .forEach(el => el.setAttribute('inert', ''));

  dialog.removeAttribute('hidden');

  // Move focus to first focusable element inside dialog
  const first = dialog.querySelector(focusableSelectors);
  first?.focus();
}

function closeDialog(dialog, trigger) {
  // Remove inert from background content
  document.querySelectorAll('[inert]')
    .forEach(el => el.removeAttribute('inert'));

  dialog.setAttribute('hidden', '');
  trigger.focus(); // Return focus to the element that opened the dialog
}

dialog.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDialog(dialog, trigger);
});
```

### Manual focus trap (fallback when `inert` is unavailable)

For environments that do not support `inert`, implement a manual focus trap.
The `focus-trap` library provides a well-tested, production-ready implementation —
prefer it over hand-rolling this logic:

```js
// Using the focus-trap library (https://github.com/focus-trap/focus-trap)
import { createFocusTrap } from 'focus-trap';

let trap;

function openDialog(dialog, trigger) {
  dialog.removeAttribute('hidden');
  trap = createFocusTrap(dialog, {
    escapeDeactivates: true,
    onDeactivate: () => closeDialog(dialog, trigger)
  });
  trap.activate();
}

function closeDialog(dialog, trigger) {
  trap?.deactivate();
  dialog.setAttribute('hidden', '');
  trigger.focus();
}
```

If writing a manual trap without a library, the complete cycle logic is:

```js
function trapFocus(dialog) {
  const focusable = Array.from(dialog.querySelectorAll(focusableSelectors));
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  dialog.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift+Tab: if on first element, wrap to last
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab: if on last element, wrap to first
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
```

---

## Serious: Focus Visibility

Every focusable element must have a clear, persistent visible focus indicator.
**Removing focus outlines without an equally visible replacement is Serious.**

```css
:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}
/* Never: :focus { outline: none; } without a visible replacement */
```

WCAG 2.4.11 minimum requirements:

* At least 2px thick
* Minimum 3:1 contrast ratio against adjacent colours
* Must be visible in both light and dark modes

---

## Serious: Focus Not Obscured (WCAG 2.4.12)

Sticky headers, cookie banners, floating toolbars, and chat widgets can cover
the focused element, making it invisible even though focus is technically visible.
**A focused element fully hidden behind a sticky overlay is Serious.**

```css
/* Add scroll-margin to all focusable elements to clear sticky headers */
:focus {
  scroll-margin-top: var(--sticky-header-height, 4rem);
  scroll-margin-bottom: var(--sticky-footer-height, 0);
}
```

Test by tabbing through the page with a sticky header present. If the focused
element scrolls under the header, the scroll margin is too small.

WCAG 2.4.12 requires the focused element is **not fully hidden**. Partial
obscuring (only a portion covered) is a Moderate issue; complete hiding is Serious.

---

## Serious: Focus Order

Tab order must follow logical reading and interaction sequence.
**Illogical focus order is Serious** — screen reader users build a spatial model
of the page from the focus sequence, and out-of-order focus breaks that model.

* Use semantic DOM order as the primary mechanism
* Never use positive `tabindex` values (`tabindex="2"` etc.) — they override DOM
  order globally and create unpredictable sequences
* `tabindex="0"` — use only to make custom widgets focusable
* `tabindex="-1"` — use only for programmatic focus targets (skip link anchors,
  modal focus management, scroll-into-view targets)
* If visual order differs from DOM order (e.g., CSS grid/flex reordering),
  fix the DOM order — do not use `tabindex` to compensate

---

## Serious: Roving Tabindex for Composite Widgets

Composite widgets (toolbars, radio groups, tree views, tab lists, menubars) must
use the **roving tabindex** pattern so only one item in the group is in the tab
stop at a time, and arrow keys move within the group.

This prevents the group's items from cluttering the page tab sequence and matches
the keyboard behaviour AT users expect from desktop applications.

```html
<div role="toolbar" aria-label="Text formatting">
  <button tabindex="0"  aria-pressed="false">Bold</button>
  <button tabindex="-1" aria-pressed="false">Italic</button>
  <button tabindex="-1" aria-pressed="false">Underline</button>
</div>
```

```js
const toolbar = document.querySelector('[role="toolbar"]');
const items   = Array.from(toolbar.querySelectorAll('button'));

toolbar.addEventListener('keydown', (e) => {
  const current = document.activeElement;
  const index   = items.indexOf(current);
  let   next    = -1;

  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    next = (index + 1) % items.length;
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    next = (index - 1 + items.length) % items.length;
  } else if (e.key === 'Home') {
    next = 0;
  } else if (e.key === 'End') {
    next = items.length - 1;
  }

  if (next !== -1) {
    e.preventDefault();
    // Move the roving tabindex
    items.forEach(btn => btn.setAttribute('tabindex', '-1'));
    items[next].setAttribute('tabindex', '0');
    items[next].focus();
  }
});
```

Apply the same pattern to radio groups, tab lists, and tree nodes. Consult the
[APG pattern](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex)
for the specific arrow key directions required for each widget type.

---

## Moderate: Skip Link & Landmarks

**Missing skip link is Moderate** — sighted keyboard users must Tab through all
navigation on every page load. Screen reader users have landmark navigation as an
alternative, but a skip link is the most reliable, lowest-friction bypass.

```html
<!-- First element in <body> — must be visible on focus -->
<a class="skip-link" href="#main">Skip to main content</a>

<header role="banner">…</header>
<nav aria-label="Main">…</nav>
<main id="main" tabindex="-1">…</main>
<aside>…</aside>
<footer>…</footer>
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

The skip link must be **visible on focus** — a skip link hidden permanently
(e.g., `display: none`) is a Serious issue as it breaks WCAG 2.4.1.

---

## Moderate: Hidden & Offscreen Content

* Elements with `display:none` or `visibility:hidden` are correctly excluded from tab order
* Use `aria-hidden="true"` on offscreen content that must remain in the DOM
  but is not currently available to users
* Modals and drawers: apply `inert` (or `aria-hidden`) to background content
  when the overlay is open; remove it when closed

**Keyboard-reachable content that is visually hidden is Serious** — users reach
invisible controls with no indication of what they have focused.

---

## Moderate: Touch & Pointer Equivalents (WCAG 2.5.x)

Pointer and touch requirements apply alongside keyboard requirements.

| Requirement | Description | Severity |
| --- | --- | --- |
| **2.5.1 Pointer Gestures** | Multi-point or path-based gestures (pinch, swipe) must have a single-pointer or keyboard alternative | Serious |
| **2.5.3 Label in Name** | Visible label text must be contained in the accessible name | Serious |
| **2.5.8 Target Size Minimum** | Interactive targets at least 24×24 CSS pixels; recommended 44×44 | Moderate |
| **user-scalable=no** | Never prevent pinch-to-zoom — blocks low-vision users | Serious |
| Drag-to-reorder | Must have keyboard alternative (e.g., cut/paste, up/down button) | Serious |

```html
<!-- Never do this -->
<meta name="viewport" content="width=device-width, user-scalable=no">

<!-- Good -->
<meta name="viewport" content="width=device-width, initial-scale=1">
```

For minimum target size:

```css
button, a, [role="button"] {
  min-width: 24px;
  min-height: 24px;
  /* Recommended: 44×44 for primary actions */
}
```

---

## Minor: `inert` Browser Support Note

`inert` is baseline 2023 (Chrome 102+, Firefox 112+, Safari 15.5+). For projects
requiring support of older browsers, use the
[`wicg-inert` polyfill](https://github.com/WICG/inert) or the
`focus-trap` library as the primary focus management mechanism.

---

## Definition of Done Checklist

* [ ] Tab through entire page: logical order, no unexpected skips
* [ ] Visible focus indicator on every focusable element (both light and dark modes)
* [ ] All interactive elements activatable with correct keys per widget type table
* [ ] No keyboard trap (except intentional modal trap with working Escape)
* [ ] Dialog open: background content made `inert`; first focusable element receives focus
* [ ] Dialog close: `inert` removed; focus returns to trigger
* [ ] Skip link present, first in DOM, visible on focus
* [ ] Skip link target has `tabindex="-1"` for programmatic focus
* [ ] Sticky header/footer: `scroll-margin` prevents focused elements being hidden
* [ ] Hidden content not in tab order
* [ ] Composite widgets use roving tabindex; arrow keys navigate within group
* [ ] Drag interactions have keyboard alternative
* [ ] Touch targets meet 24×24px minimum (44×44 recommended)
* [ ] `user-scalable=no` not used
* [ ] Focus not obscured by overlapping sticky elements (WCAG 2.4.12)

---

## Key WCAG Criteria

* 2.1.1 Keyboard (A) — **Critical if violated**
* 2.1.2 No Keyboard Trap (A) — **Critical if violated**
* 2.4.1 Bypass Blocks (A)
* 2.4.3 Focus Order (A)
* 2.4.7 Focus Visible (AA)
* 2.4.11 Focus Appearance (AA, WCAG 2.2)
* 2.4.12 Focus Not Obscured (AA, WCAG 2.2)
* 2.5.1 Pointer Gestures (A)
* 2.5.3 Label in Name (A)
* 2.5.8 Target Size Minimum (AA, WCAG 2.2)

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/KEYBOARD_ACCESSIBILITY_BEST_PRACTICES.md)
* [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/) — versioned independently of WCAG; always check current version
* [APG: Roving tabindex practice](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex)
* [WCAG 2.2 Understanding 2.4.11 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
* [WCAG 2.2 Understanding 2.4.12 Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured.html)
* [WCAG 2.2 Understanding 2.5.8 Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
* [MDN: The `inert` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert)
* [`focus-trap` library](https://github.com/focus-trap/focus-trap) — production-ready manual focus trap
* [`wicg-inert` polyfill](https://github.com/WICG/inert) — `inert` for older browsers

> **Standards horizon:** These rules target WCAG 2.2 AA. WCAG 3.0 is in
> development; keyboard and focus requirements are expected to be broadly
> compatible with 2.2.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
