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

All interactive functionality must be fully usable with a keyboard alone — no
mouse or touch required, except where the underlying function genuinely
depends on path-based movement. Keyboard access is not equivalent to pressing
Tab through every control — native and composite widgets use different key
conventions, and users must understand how to operate custom widgets.

---

## Severity Scale (this skill)

| Level | Meaning |
| --- | --- |
| **Critical** | Blocks task completion entirely for keyboard and AT users |
| **Serious** | Significantly impairs keyboard access; workaround unreasonable |
| **Moderate** | Creates friction for keyboard users; workaround exists |
| **Minor** | Best-practice gap; marginal keyboard impact |

Do not assign severity from the rule alone — determine the actual effect on
the task. Consider whether the defect prevents reaching, operating, or leaving
a component; whether it blocks an essential task or only an optional feature;
whether focus is lost or placed misleadingly; and whether a reasonable
keyboard method remains available.

---

## Critical: No Keyboard Trap

If focus can enter a component, users must be able to move focus away using
Tab, Shift+Tab, arrow keys, or Escape (depending on the component). If leaving
requires an unusual command, provide instructions before or within the component.

**A keyboard trap with no exit is Critical.** Restricting focus temporarily is
NOT a trap when it is a modal dialog with a standard/documented exit: focus
moves in on open, Tab/Shift+Tab stay within it, a keyboard-operable control
closes/completes it, and closing returns focus to the invoking control or
another logical location.

Test embedded editors, third-party widgets, iframes, media players, remote
desktops, and canvas applications carefully — they commonly consume Tab or
other keys and need an available, documented exit.

---

## Critical: All Interactive Elements Must Be Keyboard Reachable

Every element that can be activated by mouse must be reachable and activatable
by keyboard. **Use native elements** — they provide keyboard behaviour,
focusability, semantics, states, and browser integration built in at zero
extra cost:

```html
<!-- Good: built-in keyboard support -->
<button type="button">Save</button>
<a href="/about">About</a>

<!-- Avoid: requires full ARIA + JS to match native behaviour -->
<div role="button" tabindex="0">Save</div>
```

Adding `role="button"` and `tabindex="0"` does not add button behaviour by
itself — a custom button must also implement Enter and Space activation,
disabled state, focus styling, and the expected accessible name/state. Test
the actual result, not merely whether a `keydown` handler exists. Mouse and
touch handlers must not be the only way to operate a control.

---

## Critical: Expected Key Behaviours

Deviating from expected widget key behaviour is **Critical** — it breaks the
mental model AT users depend on. Do not override standard browser behaviour on
native controls without a documented need. Follow the current
[WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) for custom widgets (versioned
independently of WCAG — APG patterns are design guidance, not WCAG
requirements by themselves; always confirm the current version).

| Control | Required keys |
| --- | --- |
| Button | `Enter`, `Space` |
| Link | `Enter` |
| Checkbox | `Space` to toggle |
| Radio group | Arrow keys to move between options; `Space` to select |
| `<select>` | Browser/platform conventions for navigation and selection |
| Menu / menubar | Arrow keys; `Enter` to activate item; `Escape` to close |
| Tab widget | Arrow keys between tabs; Tab moves into the active panel |
| Dialog | `Escape` to close; focus trapped inside while open |
| Combobox | Depends on editable/select-only behaviour; `Escape` commonly closes |
| Tree view | Up/Down navigate visible nodes; Right expands/enters; Left collapses/parent |
| Slider | Arrow keys to change value; `Home`/`End` for min/max; Page Up/Down for larger steps |
| Grid | Arrow keys move among cells; Tab usually enters/leaves the composite |
| `<details>` summary | `Enter`/`Space` toggles disclosure |

Do not implement a widget from a summary table alone — use the complete
current APG pattern, document any variation, and test with representative
browsers and assistive technologies.

---

## Critical: Dialog Focus Management

Incorrect dialog focus management is **Critical** — keyboard and screen reader
users lose their place, or cannot reach dialog controls at all.

### Preferred approach: native `<dialog>` with `showModal()`

A modal dialog opened with `showModal()` places the rest of the document in an
inert state automatically — this is now the preferred pattern over manually
applying `inert` to every sibling.

```html
<button type="button" id="delete-trigger">Delete project</button>

<dialog id="delete-dialog" aria-labelledby="delete-title">
  <h2 id="delete-title">Delete project?</h2>
  <p>This action cannot be undone.</p>
  <form method="dialog">
    <button value="cancel" autofocus>Cancel</button>
    <button value="confirm">Delete project</button>
  </form>
</dialog>
```

```js
const trigger = document.getElementById('delete-trigger');
const dialog = document.getElementById('delete-dialog');

trigger.addEventListener('click', () => dialog.showModal());
dialog.addEventListener('close', () => {
  if (trigger.isConnected) trigger.focus();
});
```

Initial focus depends on the dialog's content — a short confirmation might
focus Cancel; a long informational dialog might focus a heading with
`tabindex="-1"` so users can read from the beginning. Do not always focus the
first interactive element without considering the content. If the trigger is
removed while the dialog is open, return focus to the nearest logical
workflow location rather than the document body.

Do not add `aria-modal="true"` to a container and assume it creates modality —
ARIA does not make content inert, contain focus, add keyboard handling, or
restore focus.

Native modal behaviour does not remove the need to test: initial focus
location, Tab/Shift+Tab containment, Escape and visible close controls, form
submission/cancellation, focus restoration, nested/stacked overlays, screen
reader announcement, and browser support in the project's support matrix.

### Manual approach (when native `<dialog>` is unavailable)

The `inert` attribute prevents all interaction (focus, click, AT) with
elements outside the open dialog. It has good browser support (baseline 2023)
and is simpler and more reliable than manual focusable-element cycling:

```js
function openDialog(dialog, trigger) {
  document.querySelectorAll('body > *:not(#dialog-container)')
    .forEach(el => el.setAttribute('inert', ''));
  dialog.removeAttribute('hidden');
  dialog.querySelector(focusableSelectors)?.focus();
}

function closeDialog(dialog, trigger) {
  document.querySelectorAll('[inert]').forEach(el => el.removeAttribute('inert'));
  dialog.setAttribute('hidden', '');
  trigger.focus();
}
```

For environments without `inert`, use the [`focus-trap` library](https://github.com/focus-trap/focus-trap)
(production-tested) rather than hand-rolling focus-cycling logic, or use the
[`wicg-inert` polyfill](https://github.com/WICG/inert).

---

## Critical: Non-Modal Disclosures and Popovers Must Not Trap Focus

Do not trap focus in ordinary disclosures, tooltips, menus, or non-modal
popovers unless the interaction pattern explicitly requires restricted focus.
For simple show/hide content, a button with `aria-expanded` is sufficient:

```html
<button type="button" aria-expanded="false" aria-controls="filter-panel">
  Filters
</button>
<div id="filter-panel" hidden><!-- Filter controls --></div>
```

When open content overlays the page: ensure keyboard users can enter and
leave it; close non-persistent content when interaction moves away; support
Escape where users reasonably expect it; return focus when closing would
otherwise cause focus loss; prevent the overlay from obscuring the new focus
location; do not open complex content merely because its trigger receives focus.

The HTML Popover API can be used where it meets the requirement — still test
focus behaviour and dismissal for the selected popover type.

---

## Serious: Focus Visibility

Every focusable element must have a clear, persistent visible focus indicator.
**Removing focus outlines without an equally visible replacement is Serious.**

```css
:focus-visible {
  outline: 3px solid var(--focus-color, #005fcc);
  outline-offset: 3px;
}
@media (forced-colors: active) {
  :focus-visible { outline-color: Highlight; }
}
```

Distinguish the applicable requirements:

* **2.4.7 Focus Visible (AA):** a visible mode of operation in which focus is visible
* **1.4.11 Non-text Contrast (AA):** component states may need 3:1 contrast against adjacent colours
* **2.4.13 Focus Appearance (AAA):** an enhanced minimum indicator area and 3:1 change between focused/unfocused pixels — do not describe this AAA formula as an AA requirement

A 3px solid outline with adequate contrast is a useful project default, not
the complete Focus Appearance formula. Test focus in light, dark,
increased-contrast, and forced-colours modes, and on every background a
control appears against.

---

## Serious: Focus Not Obscured (WCAG 2.4.11/2.4.12)

Sticky headers, sticky footers, cookie notices, chat panels, toolbars, virtual
keyboards, and persistent disclosures can obscure the focused element even
though focus is technically visible. **A focused element fully hidden behind
a sticky overlay is Serious.**

```css
html {
  scroll-padding-block-start: var(--sticky-header-height, 0);
  scroll-padding-block-end: var(--sticky-footer-height, 0);
}
[id] {
  scroll-margin-block-start: var(--sticky-header-height, 0);
}
```

CSS scroll spacing helps but does not prove conformance — test every
breakpoint, zoom level, text-spacing configuration, and persistent overlay.
WCAG 2.4.11 (AA) requires the focused element is not *entirely* hidden;
partial obscuring is Moderate, complete hiding is Serious. Prefer designs
where the complete focused component and its indicator remain visible — that
exceeds the AA minimum and aligns with 2.4.12 Focus Not Obscured Enhanced (AAA).

---

## Serious: Focus Order

Tab order must follow logical reading and interaction sequence.
**Illogical focus order is Serious** — screen reader users build a spatial model
of the page from the focus sequence, and out-of-order focus breaks that model.

* Use semantic DOM order as the primary mechanism; align visual order with DOM
  order — do not use CSS `order`, grid placement, or absolute positioning to
  create a misleading visual sequence
* Never use positive `tabindex` values — they create a separate, hard-to-maintain
  focus sequence
* `tabindex="0"` — only when an element legitimately belongs in sequential
  focus order and no native element provides the semantics
* `tabindex="-1"` — only for programmatic focus targets and inactive items in
  roving-tabindex patterns
* Do not add non-interactive headings/paragraphs/containers to the Tab order
  without a specific interaction requirement
* Do not use `autofocus` unless placing initial focus there is expected, tested,
  and won't surprise users
* When content is inserted, removed, reordered, or filtered, preserve focus or
  move it to a logical location — never leave focus on a deleted element

---

## Serious: Composite Widgets (Roving Tabindex)

Composite widgets (toolbars, radio groups, tree views, tab lists, menubars)
usually expose one Tab stop; arrow keys or other documented keys move among
internal items. Two recognized strategies:

1. **Roving tabindex:** one item has `tabindex="0"`, others `-1`; movement
   updates values and DOM focus
2. **`aria-activedescendant`:** DOM focus stays on a container while the
   attribute identifies the active descendant

Choose the strategy the relevant widget pattern specifies. Do not add custom
roving tabindex to a native radio group — browsers already provide its keyboard
behaviour.

```html
<div role="toolbar" aria-label="Text formatting">
  <button type="button" tabindex="0"  aria-pressed="false">Bold</button>
  <button type="button" tabindex="-1" aria-pressed="false">Italic</button>
  <button type="button" tabindex="-1" aria-pressed="false">Underline</button>
</div>
```

```js
toolbar.addEventListener('keydown', (event) => {
  const items = Array.from(toolbar.querySelectorAll('button:not([disabled])'));
  const current = items.indexOf(document.activeElement);
  let next = current;

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (current + 1) % items.length;
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (current - 1 + items.length) % items.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = items.length - 1;
  else return;

  event.preventDefault();
  items.forEach((item, index) => { item.tabIndex = index === next ? 0 : -1; });
  items[next].focus();
});
```

A production toolbar must also address orientation, directionality, disabled
items, and dynamic additions. Consult the
[APG roving tabindex practice](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex)
for the specific arrow-key directions per widget type.

---

## Moderate: Character-Key Shortcuts (WCAG 2.1.4)

If a shortcut uses only a printable character, punctuation mark, number, or
symbol, provide at least one of: a way to turn it off, a way to remap it to
include a non-printing modifier key, or activation only while the relevant
component has focus. Single-character shortcuts can be triggered accidentally
by speech input. Do not intercept browser, OS, or AT shortcuts, and avoid
preventing default behaviour unless the component genuinely replaces it with
an accessible equivalent. Display shortcut instructions in a form AT can perceive.

---

## Moderate: Skip Link & Landmarks

**Missing skip link is Moderate** — sighted keyboard users must Tab through all
navigation on every page load. Screen reader users have landmark navigation as
an alternative, but a skip link is the lowest-friction bypass.

```html
<a class="skip-link" href="#main-content">Skip to main content</a>
<header>…</header>
<nav aria-label="Primary">…</nav>
<main id="main-content" tabindex="-1">…</main>
<footer>…</footer>
```

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

The skip link must be **visible on focus** — permanently hidden (`display:
none`) is a Serious issue breaking WCAG 2.4.1. Use native landmarks without
redundant role attributes (`<header>` not `<header role="banner">`) unless the
element's native landmark role isn't exposed in context. Give multiple
navigation landmarks distinct accessible names.

---

## Moderate: Hidden, Unavailable, and Inert Content

Choose the mechanism that matches the intended state:

| Mechanism | Visual rendering | Sequential focus | Accessibility tree |
| --- | --- | --- | --- |
| `hidden` / `display: none` | Hidden | Removed | Normally removed |
| `visibility: hidden` | Hidden | Removed | Normally removed |
| `inert` | Usually visible unless separately styled | Descendants removed | Descendants excluded |
| `aria-hidden="true"` | Unchanged | **Unchanged** | Content hidden from AT |

**Never put a focusable element inside an `aria-hidden="true"` subtree** —
`aria-hidden` does NOT prevent keyboard focus, and can create a control that
receives focus without being exposed to a screen reader. Use `hidden` for
closed disclosures that should be unavailable; use `inert` when visible
content must temporarily become non-interactive. Native `<dialog>` with
`showModal()` provides document-level modal behaviour without manually
applying `inert` to every sibling. When removing `hidden`/`inert`, verify
focus order remains logical.

---

## Moderate: Dynamic Content and Client-Side Navigation

Do not move focus merely because content updated — move it when users need a
new interaction context or would otherwise lose their place. Appropriate
cases: opening/closing a modal, focusing an error summary after failed
submission, moving to the main heading after a client-side route change,
recovering when the focused element is deleted. On route change: update the
document title, move focus to an appropriate heading/main container,
announce the new context without duplicate announcements, and preserve
expected Back/Forward behaviour. Do not use positive `tabindex` or repeated
synthetic Tab events to manage application focus.

---

## Moderate: Touch & Pointer Equivalents (WCAG 2.5.x)

| Requirement | Description | Severity |
| --- | --- | --- |
| **2.5.1 Pointer Gestures** | Multi-point/path-based gestures need a single-pointer or keyboard alternative | Serious |
| **2.5.3 Label in Name** | Visible label text must be contained in the accessible name | Serious |
| **2.5.8 Target Size Minimum** | Interactive targets at least 24×24 CSS pixels; recommended 44×44 | Moderate |
| **user-scalable=no** | Never prevent pinch-to-zoom — blocks low-vision users | Serious |
| Drag-to-reorder | Must have a keyboard alternative (cut/paste, up/down button) | Serious |

```html
<!-- Never do this -->
<meta name="viewport" content="width=device-width, user-scalable=no">
<!-- Good -->
<meta name="viewport" content="width=device-width, initial-scale=1">
```

---

## Testing Expectations

* **Page-level:** Tab into the page from browser chrome; Tab/Shift+Tab through
  the complete page in both directions; confirm every interactive function is
  reachable and operable; confirm no inactive/hidden control receives focus;
  confirm focus indicator is always visible; confirm sticky/overlaid content
  never fully obscures focus; activate the skip link
* **Component:** test native controls without overriding browser behaviour;
  test every documented key for each custom widget; test first/last/disabled/
  dynamically added/removed items; test Tab/Shift+Tab entry and exit; test
  writing direction and orientation where relevant; confirm keyboard
  activation matches pointer activation
* **Dialog/overlay:** confirm initial focus is appropriate; confirm modal
  focus doesn't leave the dialog; confirm visible controls and Escape close it;
  confirm focus returns logically; confirm non-modal content doesn't trap
  focus; test nested overlays and repeated open/close
* **AT and display:** test keyboard operation with a screen reader running;
  200%/400% zoom; 320px viewport; light/dark/increased-contrast/forced-colours
  modes; speech input for controls whose visible labels are used as commands

**Automated checks** can detect positive `tabindex`, click handlers on
non-interactive elements, focusable descendants of `aria-hidden`/inert
content, missing accessible names, and some focus-indicator problems — but
cannot determine whether the complete focus order is meaningful or whether
custom interactions follow their expected keyboard model. Retain manual
keyboard walkthroughs for every new or changed interaction pattern.

---

## Definition of Done Checklist

* [ ] Tab through entire page: logical order, no unexpected skips
* [ ] Visible focus indicator on every focusable element (light and dark modes)
* [ ] All interactive elements activatable with correct keys per widget type table
* [ ] No keyboard trap (except intentional modal trap with working Escape)
* [ ] Dialog uses native `<dialog>`/`showModal()` (or `inert`/focus-trap fallback);
      first appropriate element receives focus; focus returns to trigger on close
* [ ] Non-modal disclosures/popovers do not trap focus
* [ ] Skip link present, first in DOM, visible on focus
* [ ] Skip link target has `tabindex="-1"` for programmatic focus
* [ ] Sticky header/footer: scroll-padding/margin prevents focused elements being hidden
* [ ] Hidden content not in tab order; no focusable element inside `aria-hidden`
* [ ] Composite widgets use roving tabindex or `aria-activedescendant`
* [ ] Character-key shortcuts can be disabled, remapped, or scoped
* [ ] Drag interactions have a keyboard alternative
* [ ] Touch targets meet 24×24px minimum (44×44 recommended)
* [ ] `user-scalable=no` not used
* [ ] Focus not obscured by overlapping sticky elements

---

## Key WCAG Criteria

* 2.1.1 Keyboard (A) — **Critical if violated**
* 2.1.2 No Keyboard Trap (A) — **Critical if violated**
* 2.1.4 Character Key Shortcuts (A)
* 2.4.1 Bypass Blocks (A)
* 2.4.3 Focus Order (A)
* 2.4.7 Focus Visible (AA)
* 2.4.11 Focus Not Obscured Minimum (AA, WCAG 2.2)
* 2.4.12 Focus Not Obscured Enhanced (AAA, WCAG 2.2)
* 2.4.13 Focus Appearance (AAA)
* 2.5.1 Pointer Gestures (A)
* 2.5.3 Label in Name (A)
* 2.5.8 Target Size Minimum (AA, WCAG 2.2)

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/KEYBOARD_ACCESSIBILITY_BEST_PRACTICES.md)
* [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/) — versioned independently of WCAG
* [APG: Developing a Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
* [APG: Dialog Modal Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
* [HTML Living Standard: The `dialog` element](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element)
* [HTML Living Standard: The `inert` attribute](https://html.spec.whatwg.org/multipage/interaction.html#the-inert-attribute)
* [`focus-trap` library](https://github.com/focus-trap/focus-trap)
* [`wicg-inert` polyfill](https://github.com/WICG/inert)

> **Standards horizon:** These rules target WCAG 2.2 AA. WCAG 3.0 is in
> development; keyboard and focus requirements are expected to be broadly
> compatible with 2.2.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
