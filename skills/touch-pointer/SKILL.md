---
name: touch-pointer
description: >
  Load this skill whenever the project contains interactive UI elements that
  users touch, tap, click, drag, swipe, or gesture with — buttons, links,
  drag-and-drop interfaces, sliders, carousels, or custom touch interactions.
  Under no circumstances create touch targets smaller than 44×44 CSS pixels.
  Absolutely always provide pointer cancellation, single-pointer alternatives
  to gestures, and load alongside keyboard/SKILL.md since pointer and keyboard
  requirements are complementary.
---

# Touch and Pointer Accessibility Skill

> **Canonical source**: `examples/TOUCH_POINTER_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when implementing any interactive UI that users touch, click,
tap, drag, or gesture with.
**Load alongside `keyboard/SKILL.md` — pointer and keyboard requirements are complementary, not interchangeable.**

---

## Core Mandate

Build interfaces that work with touchscreens, mice, trackpads, pens, head
pointers, switch-controlled pointers, and other pointing devices. Do not
infer a person's abilities from the device they use — a touchscreen user may
also use a keyboard, speech input, a screen reader, or a mouse.

**A keyboard-only alternative does not by itself satisfy pointer-gesture
(2.5.1) or dragging (2.5.7) requirements** — the alternative must work with a
single pointer, without a path-based gesture or drag, even though keyboard
operability is separately required by 2.1.1. Native buttons conveniently
satisfy both at once.

---

## Severity Scale (this skill)

| Level | Meaning |
|---|---|
| **Critical** | Functionality only available via multi-point gesture with no single-pointer alternative; `user-scalable=no` prevents zoom |
| **Serious** | Drag-to-reorder with no single-pointer alternative; touch target under 24×24px for primary actions |
| **Moderate** | Mousedown/touchdown action with no up-event cancellation; motion gesture without UI alternative |
| **Minor** | Target under 44×44px for non-primary actions; spacing between targets too small |

Prioritize by actual user impact, task criticality, reach, and frequency —
don't assign severity solely from a success-criterion number or tool output.

---

## Start With an Input-Agnostic Base

Use native HTML controls and links — their built-in `click` activation works
across mouse, touch, pen, keyboard, and many AT.

```html
<!-- Incorrect -->
<div class="button" ontouchend="saveChanges()">Save changes</div>

<!-- Correct -->
<button type="button" id="save-button">Save changes</button>
<script>
  document.querySelector("#save-button").addEventListener("click", saveChanges);
</script>
```

Use Pointer Events for custom direct-manipulation components rather than
maintaining separate mouse/touch implementations. Do not gate core
functionality on `pointerType` — a pen user shouldn't lose a function a mouse user gets.

---

## Critical: Never Block Zoom (`user-scalable=no`)

```html
<!-- Critical violation — never do this -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

<!-- Correct -->
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Some libraries/frameworks add `user-scalable=no` automatically — audit the
viewport meta tag on every project. Do not rely on browsers ignoring
restrictive viewport settings; remove the restriction from the source. Test
text at 200% and layout at 400% zoom.

---

## Critical: Single-Pointer Alternatives for Multi-Point/Path Gestures (WCAG 2.5.1)

A **multipoint gesture** uses two or more contact points (pinch zoom). A
**path-based gesture** depends on the route/direction/shape traced, not just
start/end points. When content defines such a gesture, provide a way to
perform the same function with a single pointer and no path-based gesture —
the alternative must exist **in the content**, not just as a keyboard command.

```html
<div class="map-controls" aria-label="Map controls">
  <button type="button" data-map-action="zoom-in">Zoom in</button>
  <button type="button" data-map-action="zoom-out">Zoom out</button>
  <button type="button" data-map-action="north">Pan north</button>
</div>
```

Examples: buttons for zooming/panning a map; previous/next buttons for a
swipe carousel; a menu command alongside drawing a shape; visible rotate/
resize controls. Gestures required by the browser or AT itself (a mobile
screen reader's navigation gestures) are outside the author's control — don't
reproduce or interfere with them.

---

## Critical: Non-Dragging Alternatives (WCAG 2.5.7 — WCAG 2.2)

If a function uses dragging, provide a way to complete it with a **single
pointer without dragging** — a keyboard-only alternative does not by itself
satisfy 2.5.7. Native buttons satisfy both the pointer requirement and
keyboard access at once.

```html
<ul id="task-list">
  <li>
    <span>Review content</span>
    <button type="button" data-move="up" aria-label="Move up: Review content">Move up</button>
    <button type="button" data-move="down" aria-label="Move down: Review content">Move down</button>
  </li>
</ul>
<p id="reorder-status" role="status" aria-atomic="true"></p>
```

```js
taskList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-move]");
  if (!button) return;
  const item = button.closest("li");
  const label = item.querySelector("span").textContent;
  const direction = button.dataset.move;
  if (direction === "up" && item.previousElementSibling) item.previousElementSibling.before(item);
  else if (direction === "down" && item.nextElementSibling) item.nextElementSibling.after(item);
  else return;
  updateMoveButtons();
  reorderStatus.textContent = `${label} moved ${direction}.`;
});
```

Drag-and-drop may remain as an enhancement. The non-dragging controls must
expose the same result, remain visible/discoverable, and preserve focus and
state after the move. Other patterns: select item + destination + activate
Move; tap a map control to pan; enter a value or click the track alongside
dragging a slider thumb.

---

## Serious: Pointer Cancellation (WCAG 2.5.2)

Activate ordinary controls on `click`, not `pointerdown`/`mousedown`/`touchstart`.

```js
// Right — fires on click; user can drag away to cancel
deleteButton.addEventListener("click", deleteItem);
```

WCAG permits several patterns: (1) the down event doesn't execute the
function; (2) the function completes on the up event and the user can abort
before releasing or undo after; (3) releasing reverses the down event's
outcome; (4) completing on down is essential. For destructive or
hard-to-reverse actions, also confirm or provide Undo:

```html
<button type="button" id="archive-button">Archive message</button>
<p id="archive-status" role="status"></p>
<button type="button" id="undo-archive" hidden>Undo archive</button>
```

---

## Serious: Target Size Minimum (WCAG 2.5.8 — WCAG 2.2)

Pointer targets must be at least **24×24 CSS pixels**, except when:

* **Spacing** — a 24px-diameter circle centered on the target doesn't
  intersect another target's equivalent circle (this is a specific geometric
  test, not just "add some margin")
* **Equivalent** — another control on the same page performs the same
  function and meets the size requirement
* **Inline** — the target is in a sentence, size constrained by line height
* **User agent control** — the browser determines the size, unmodified by the author
* **Essential** — the specific presentation is essential or legally required

**44×44 CSS pixels is the recommended default** for important/frequent
controls — easier to implement and test than relying on the spacing
exception, and it's also the WCAG 2.5.5 (AAA) Target Size Enhanced threshold.

```css
.icon-button {
  display: inline-grid;
  min-inline-size: 2.75rem;  /* 44px at default 16px root */
  min-block-size: 2.75rem;
  padding: 0.625rem;
  place-items: center;
}
.icon-button svg { inline-size: 1.5rem; block-size: 1.5rem; }
```

Use `rem` so the target grows with the user's default text size. **Put
padding on the interactive element itself, not a non-interactive wrapper** —
the whole padded area must be clickable:

```html
<a class="nav-link" href="/account/">Account</a>
```
```css
.nav-link { display: inline-flex; min-block-size: 2.75rem; padding: 0.625rem 0.875rem; align-items: center; }
```

Do not apply a blanket minimum width/height to every `<a>` — inline prose
links have a defined exception and forcing them into square boxes damages
reading and wrapping. Associate checkboxes/radios with visible `<label>`
elements so the label extends the operable area.

---

## Serious: Motion Actuation Alternative (WCAG 2.5.4)

If shaking, tilting, or gesturing toward a camera performs a function:
provide a conventional UI control for the same function; let the user
disable motion actuation; request sensor permission only in response to a
clear user action.

```html
<button type="button" id="undo-button">Undo last change</button>
<label><input type="checkbox" id="shake-toggle"> Enable shake to undo</label>
```

Keep the conventional button available whether motion input is enabled or
not — default the sensor feature to off.

---

## Serious: Do Not Depend on Hover

Every function revealed on hover must also be available through a persistent
control or keyboard focus — touch devices may not support hover reliably.

```html
<button type="button" aria-expanded="false" aria-controls="account-menu">Account menu</button>
<ul id="account-menu" hidden>…</ul>
```

Content on hover/focus must be dismissible, hoverable, and persistent (WCAG
1.4.13) unless an exception applies. A visible button/disclosure is usually
more reliable than a tooltip for essential instructions.

---

## Moderate: Use `pointer`/`hover` Media Features Carefully

`pointer`/`hover` describe the *primary* device; `any-pointer`/`any-hover`
report capabilities across all available devices. **These do not detect
keyboard use, identify a disability, or reliably classify every pen as
coarse or every touchscreen as primary** — hybrid devices can report several
capabilities that change while the page is open.

```css
.toolbar button { min-inline-size: 2.75rem; min-block-size: 2.75rem; }
@media (any-pointer: coarse) { .toolbar { gap: 0.75rem; } }
```

**Never hide essential controls behind an accurate-pointer query:**

```css
/* Incorrect: touch and keyboard users may lose the controls */
@media (pointer: fine) { .editing-controls { display: flex; } }
```

Start with an accessible base layout, then use media queries only for enhancements.

---

## Moderate: Prefer Pointer Events for Custom Interaction

```js
surface.addEventListener("pointerdown", (event) => {
  if (activePointerId !== null) return;
  activePointerId = event.pointerId;
  surface.setPointerCapture(event.pointerId);
  beginPreview(event.clientX, event.clientY);
});
surface.addEventListener("pointerup", (event) => {
  if (event.pointerId !== activePointerId) return;
  activePointerId = null;
  commitInteraction(event.clientX, event.clientY);
});
surface.addEventListener("pointercancel", (event) => {
  if (event.pointerId === activePointerId) cancelInteraction();
});
surface.addEventListener("lostpointercapture", () => {
  if (activePointerId !== null) cancelInteraction();
});
```

Track the active `pointerId`; finish on `pointerup`; cancel cleanly on
`pointercancel`; account for `lostpointercapture`; don't assume every pointer
reports pressure/tilt/dimensions; still provide non-gesture, non-dragging
controls for the same function. Do not register both `touchend` and `click`
for the same action without preventing duplicate activation.

---

## Moderate: Preserve Browser Panning/Zooming With `touch-action`

```css
/* A horizontal carousel handles horizontal movement;
   preserve vertical page scroll and pinch zoom */
.carousel-viewport { touch-action: pan-y pinch-zoom; }
```

Use `touch-action` only on the smallest custom surface that needs it. **Never
broadly apply `touch-action: none` to `html`, `body`, page containers, maps,
canvases, or carousels** — it suppresses browser panning/zooming starting on
that element. Before restricting a gesture, confirm: the component genuinely
needs to handle it; page scrolling still works from the component; pinch
zoom remains available; a simple control provides the same function.
`touch-action` is preferable to non-passive `preventDefault()` on every touch move.

---

## Component Patterns

| Component | Required approach |
|:---|:---|
| Carousel | Prev/next/pause controls; don't require swiping; preserve scrolling and reduced-motion |
| Map | Named zoom/pan controls; address/coordinates/list alternative when the visual map alone isn't sufficient |
| Slider | Prefer `<input type="range">`; provide numeric input or click-the-track alongside thumb dragging |
| Sortable list | Move up/down/to controls in addition to drag-and-drop; announce result, preserve focus |
| Swipe action | Expose via a visible button/menu; swipe must not be the only way to delete/archive/reveal |
| Long press | Provide an ordinary button/menu; must not be the only route to a function |
| Drawing/signature | Avoid requiring fine path accuracy when not essential; offer typed/uploaded alternatives where the task allows |
| Canvas control | Provide an accessible DOM interface for all operations, names, values, and results — canvas pixels alone create no semantics |

Do not depend on double-tap, pressure, tilt, edge swipes, or device-specific
gestures for essential functions.

---

## Serious: Keep the Visible Label in the Accessible Name (WCAG 2.5.3)

Speech-input users (Dragon, iOS Voice Control) often activate a control by
saying its visible label — the accessible name must contain that text.

```html
<!-- Good -->
<button type="button">Send</button>
<button type="button" aria-label="Send application">Send</button>

<!-- Incorrect: visible text absent from accessible name -->
<button type="button" aria-label="Submit application">Send</button>
```

Putting the visible label at the **start** of a longer accessible name is a
useful convention for speech input. An icon-only button has no visible label
to compare under 2.5.3, but still needs a clear accessible name under 4.1.2 —
use familiar icons and a visible label where space allows; a tooltip is not a
substitute for a reliably available label.

---

## Preserve Orientation, Reflow, and Reachability

Support portrait and landscape unless one orientation is essential — don't
use orientation locks to compensate for an inflexible layout. At narrow
widths and high zoom: keep controls in a meaningful order; wrap toolbars
instead of shrinking targets below minimum size; prevent sticky
headers/banners/chat widgets from obscuring focused controls; keep dialogs/
menus within the viewport; avoid horizontal page scrolling except where
genuinely 2D content requires it. When an on-screen keyboard opens, focused
inputs/errors/submit controls must remain visible or scrollable into view.

---

## Account for Touch Screen Readers

Mobile screen readers change how touch input reaches the page — users may
explore by touch, swipe through the accessibility tree, and use a
screen-reader activation gesture instead of directly tapping. Use native
elements and accurate accessible names; keep the accessible target aligned
with the visible control; expose current state (expanded/selected/checked/
value); avoid custom gestures conflicting with AT gestures; don't require
spatial knowledge ("tap the shape in the upper-right corner"). Test both
direct touch with the screen reader off and touch exploration with it on —
passing one doesn't establish the other works.

---

## Prevent Accidental Activation and Data Loss

Touch input can be imprecise or interrupted. For consequential actions:
separate adjacent destructive/constructive actions; use clear labels instead
of ambiguous icons; don't execute on pointer-down; confirm hard-to-reverse
actions; offer Undo when practical; preserve entered data after validation
errors, orientation changes, or temporary disconnection. Target size is not
the only safeguard — a large Delete button next to Save with no recovery
path can still cause harm.

---

## Testing

* **Review:** inventory all controls/gestures; identify multipoint, path-
  based, dragging, swipe, long-press, pressure, tilt, and motion
  interactions; confirm each has the required single-pointer alternative
  (not just keyboard); measure actual target boxes in CSS pixels; search for
  restrictive viewport settings and broad `touch-action` rules; verify
  visible labels are in accessible names
* **Input:** complete every task with touch alone, mouse/trackpad alone, pen
  (if supported), and keyboard alone; test speech input for visible labels;
  test touch exploration and activation with mobile screen readers; test a
  hybrid device switching between input modes. **Use physical devices for
  final testing** — emulation doesn't reproduce hand occlusion, reach,
  accidental contact, or sensor permissions reliably
* **Visual/layout:** portrait/landscape; 200%/400% zoom; smallest supported
  viewport with on-screen keyboard; sticky/fixed content not obscuring
  controls; pinch zoom and page scroll from every custom gesture surface
* **Interaction state:** press down, move away, release — confirm
  cancellation works where required; interrupt a direct-manipulation
  interaction with scrolling/orientation change/loss of pointer capture;
  confirm drag alternatives produce the same result and preserve focus;
  confirm motion input can be disabled with its alternative still available

**Automated checks** can identify some small targets, invalid names,
restrictive viewport settings, and duplicate event patterns — cannot
determine whether a gesture is essential, whether an alternative is
equivalent/discoverable, or whether touch screen-reader interaction is
understandable. Manual testing remains required.

---

## Common Failures

| Failure | Correction |
|:---|:---|
| Browser zoom disabled because the layout breaks | Fix the responsive layout; remove viewport scaling restrictions |
| A keyboard command is the only alternative to a pinch/path gesture | Add controls that work with a single pointer without a path gesture |
| Keyboard reordering offered as the only drag alternative | Add single-pointer Move controls that don't require dragging |
| Action fires on `pointerdown` for perceived responsiveness | Complete on `click`/`pointerup`, with cancellation or Undo |
| "Every target requires 24×24px, no exceptions" | Apply the exact 2.5.8 rule and its defined exceptions |
| Vague spacing claimed to make an undersized target conform | Evaluate the actual 24px circle test |
| Every link forced into a square target | Leave inline prose links in normal flow |
| Padding placed on a wrapper around a small icon button | Put padding on the interactive element itself |
| Controls appear only on hover | Provide persistent or focus-triggered controls, touch-operable disclosure |
| `pointer: coarse` treated as a reliable touchscreen/stylus detector | Treat media features as capabilities; keep the base experience input-agnostic |
| Essential controls hidden unless `pointer: fine` matches | Keep core controls in the base layout |
| Separate touch and mouse handlers double-activate | Use native `click` or a unified Pointer Events implementation |
| `touch-action: none` applied to a whole page/component | Preserve panning/zooming; restrict only the necessary gesture axis |
| Motion input is always active with no way to disable | Provide a conventional alternative and a user-controlled disable |
| Mobile emulator is the only touch test | Test physical devices, hybrid inputs, and mobile screen readers |
| Passing keyboard tests treated as proof of pointer accessibility | Test gestures, dragging, cancellation, and target size separately |

---

## Definition of Done Checklist

* [ ] `user-scalable=no` and `maximum-scale` not in viewport meta tag
* [ ] All multi-point/path-based gesture functionality has a **single-pointer**
      alternative in the content (not just a keyboard command)
* [ ] All drag functionality has a **single-pointer, non-dragging** alternative
* [ ] Interactive targets: minimum 24×24px (with valid exception if smaller);
      44×44px recommended for primary controls
* [ ] Padding for small targets is on the interactive element, not a wrapper
* [ ] Actions fire on up-event (`click`, `pointerup`); destructive actions
      confirmable/undoable
* [ ] Device motion functionality has a UI alternative and can be disabled
* [ ] `pointer`/`hover` media queries only enhance an already-accessible base
      — never hide essential controls
* [ ] Custom interactions use Pointer Events and handle `pointercancel`/`lostpointercapture`
* [ ] `touch-action` scoped narrowly; page scroll and pinch zoom preserved elsewhere
* [ ] `aria-label` values begin with or contain the visible label text (WCAG 2.5.3)
* [ ] Sticky/fixed/overlay content doesn't obscure focused or operable controls
* [ ] Tested on physical devices: iOS VoiceOver (touch), TalkBack (Android),
      mouse/trackpad, keyboard alone

---

## Key WCAG Criteria

* 1.3.4 Orientation (AA)
* 1.4.4 Resize Text (AA) — **Critical if zoom blocked**
* 1.4.10 Reflow (AA)
* 1.4.13 Content on Hover or Focus (AA)
* 2.1.1 Keyboard (A) — separately required alongside pointer alternatives
* 2.5.1 Pointer Gestures (A) — **Serious if multi-point gesture has no single-pointer alternative**
* 2.5.2 Pointer Cancellation (A) — **Serious if actions fire on down-event**
* 2.5.3 Label in Name (A) — **Serious for voice control users**
* 2.5.4 Motion Actuation (A)
* 2.5.5 Target Size Enhanced (AAA) — 44×44px
* 2.5.7 Dragging Movements (AA, WCAG 2.2) — **Serious if drag has no single-pointer alternative**
* 2.5.8 Target Size Minimum (AA, WCAG 2.2) — **Serious below 24×24px**

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/TOUCH_POINTER_ACCESSIBILITY_BEST_PRACTICES.md)
* [WCAG 2.2 Understanding 2.5 Input Modalities](https://www.w3.org/WAI/WCAG22/Understanding/input-modalities)
* [WCAG 2.2 Understanding 2.5.7 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)
* [WCAG 2.2 Understanding 2.5.8 Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
* [Pointer Events Level 3](https://www.w3.org/TR/pointerevents3/)
* [MDN — Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)
* [MDN — touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action)

> **Standards horizon:** WCAG 2.5.x criteria are recent additions (2.1 and 2.2).
> WCAG 3.0 is expected to extend pointer and touch requirements further.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
