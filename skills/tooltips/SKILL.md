---
name: tooltips
description: >
  Load this skill whenever the project contains tooltip components, hover-
  triggered informational popups, title attribute tooltips, or any content
  revealed on hover or focus. Under no circumstances create tooltips that are
  only triggered by hover without keyboard equivalent access. Absolutely always
  ensure tooltips are dismissible, persistent enough to read, and not the sole
  source of essential information.
---

# Tooltips Accessibility Skill

> **Canonical source**: `examples/TOOLTIP_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when implementing or reviewing tooltip components.
**Only load this skill if the project contains tooltips.**

---

## Core Mandate

A tooltip is a short, non-interactive description that appears automatically
when its trigger receives keyboard focus or pointer hover. An accessible
tooltip must be available to keyboard, pointer, touch, magnification, and
assistive technology users without hiding essential information or blocking
the interface.

Tooltips are often the wrong solution. Persistent visible text, a clear control
label, a disclosure, or a dialog is usually easier to discover and use. This
guide covers authored tooltips; the HTML `title` attribute produces a
browser-controlled tooltip with different behavior and limitations (see below).

Use the project's `skills/bug-reporting/SKILL.md` severity/priority framework to
grade findings. The severity scale below is a skill-local shorthand, not a
universal standard.

---

## Severity Scale (this skill)

| Level | Meaning |
| --- | --- |
| **Critical** | Tooltip contains essential information with no other access route |
| **Serious** | Tooltip unreachable by keyboard or AT; interactive content trapped in a tooltip |
| **Moderate** | Tooltip accessible but WCAG 1.4.13 requirements not fully met |
| **Minor** | Best-practice gap; marginal impact |

---

## Choose the Right Pattern First

Calling every small popup a tooltip leads to incorrect semantics and keyboard
behavior. Classify the interaction before choosing ARIA:

| Need | Use |
|---|---|
| A control needs a clearer label | Improve its visible label |
| Short supplementary text should appear automatically on focus or hover | Tooltip |
| Instructions or requirements are needed to complete a task | Persistent visible help text |
| A user explicitly asks to show or hide short help | Button-controlled disclosure |
| The popup contains links, buttons, or other controls | Non-modal dialog or another appropriate popup pattern |
| A decision is required before work can continue | Modal dialog or alert dialog |
| An action completed or a process changed state | Status message, not a tooltip |
| Text is truncated only because of layout | Allow wrapping, expansion, or another way to read the full text |

An authored tooltip: describes an element, appears automatically after focus or
hover, contains only non-interactive content, does not receive focus, is
associated with its trigger through `aria-describedby`, remains available while
the trigger has focus or the pointer is over the trigger or tooltip, and can be
dismissed with `Escape`.

---

## Critical: Essential Information Must Not Live Only in a Tooltip

A tooltip is supplementary by definition. Put instructions, errors,
requirements, and other essential information in persistent visible text.
**Hiding essential content behind hover/focus only is Critical.**

Do not place error messages, legal text, security warnings, or task
requirements only in a tooltip. Do not attach essential explanations only to a
disabled control — a disabled native form control may not dispatch the
pointer/focus events a tooltip expects:

```html
<p id="publish-requirement">Add a page title before publishing.</p>
<button type="button" disabled aria-describedby="publish-requirement">
  Publish
</button>
```

---

## Serious: Tooltips Must Appear on Both Hover and Focus

A tooltip that only appears on hover is **Serious** — keyboard users cannot
trigger it. Keep focus on the trigger; a tooltip never receives focus. Do not
add the tooltip to the tab sequence or use arrow keys to navigate its text.

```js
document.querySelectorAll('[data-tooltip]').forEach((container) => {
  const trigger = container.querySelector('[data-tooltip-trigger]');
  const tooltip = document.getElementById(trigger.dataset.tooltipId);
  if (!tooltip || tooltip.getAttribute('role') !== 'tooltip') return;

  let pointerWithin = false;
  let triggerFocused = false;
  let dismissed = false;

  function updateTooltip() {
    tooltip.hidden = !(!dismissed && (pointerWithin || triggerFocused));
  }

  container.addEventListener('pointerenter', () => { pointerWithin = true; dismissed = false; updateTooltip(); });
  container.addEventListener('pointerleave', () => { pointerWithin = false; updateTooltip(); });
  trigger.addEventListener('focus', () => { triggerFocused = true; dismissed = false; updateTooltip(); });
  trigger.addEventListener('blur',  () => { triggerFocused = false; updateTooltip(); });
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !tooltip.hidden) {
      dismissed = true;
      updateTooltip();
      event.stopPropagation();
    }
  });
});
```

Track pointer and focus state separately — closing on pointer-leave when focus
still keeps the tooltip active is a common failure. If a positioning library is
used, inspect its rendered markup, focus handling, portal location, collision
behavior, and cleanup; a library name is not evidence of accessibility.

---

## Serious: ARIA Pattern Must Be Correct

**Incorrect ARIA on tooltips is Serious** — AT users receive wrong or no
supplementary information.

```html
<span class="tooltip-container" data-tooltip>
  <button type="button" aria-describedby="save-tooltip"
          data-tooltip-trigger data-tooltip-id="save-tooltip">
    Save
  </button>
  <span id="save-tooltip" role="tooltip" hidden>
    Saves changes to your draft.
  </span>
</span>
```

Rules:

* Tooltip element must have `role="tooltip"`; use a native interactive element
  for the trigger when the trigger performs an action
* Trigger must reference tooltip via `aria-describedby` (not `aria-labelledby`);
  `aria-describedby` may hold a space-separated list — preserve existing help,
  error, or instruction references when adding a tooltip
* Use `hidden` to conceal; never `aria-hidden="true"` on an active tooltip
* Each tooltip must have a unique `id`, including across repeated components;
  render the descriptive node before focus reaches the trigger
* Do not put `role="tooltip"` on the trigger itself
* Tooltips must **not** be focusable — no `tabindex` on the tooltip container
* Do not add `aria-live`, `role="status"`, or `role="alert"` to a tooltip
* Do not use `aria-expanded` or `aria-haspopup` for an automatically-displayed
  tooltip — those apply to button-controlled disclosures, not tooltips
* Let the tooltip's text provide its accessible description; avoid an
  `aria-label` that replaces different visible tooltip text

For icon-only triggers, name the control independently — the tooltip is a
description, not a replacement for the accessible name:

```html
<span class="tooltip-container" data-tooltip>
  <button type="button"
          aria-label="Delete quarterly report"
          aria-describedby="delete-tooltip"
          data-tooltip-trigger data-tooltip-id="delete-tooltip">
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path d="M5 7h14M9 7V4h6v3m-8 0 1 13h8l1-13"/>
    </svg>
  </button>
  <span id="delete-tooltip" role="tooltip" hidden>
    Permanently deletes the report.
  </span>
</span>
```

Avoid repeating exactly the same words as both name and description.

---

## Serious: Button-Controlled Help Is Not a Tooltip

When a user activates a button to show content, use a disclosure pattern
instead — do not give the content `role="tooltip"` and do not add a live
region merely because it became visible:

```html
<button type="button" id="password-help-button"
        aria-expanded="false" aria-controls="password-help">
  Password requirements
</button>
<div id="password-help" hidden>
  Use at least 12 characters. Include a number and a symbol.
</div>
```

The expanded state communicates the change; focus remains on the button. If
the popup contains interactive controls or must manage focus, use an
appropriate dialog or popup pattern.

---

## Moderate: WCAG 1.4.13 — Content on Hover or Focus

| Requirement | Description | Severity if failing |
| --- | --- | --- |
| **Dismissible** | `Escape` dismisses without moving pointer or focus | Serious |
| **Hoverable** | User can move pointer over tooltip without it disappearing | Moderate |
| **Persistent** | Stays visible until trigger/tooltip loses hover or focus, is dismissed, or the info is no longer valid | Moderate |

Do not invent an auto-close duration — a tooltip that disappears after a fixed
timeout does not meet the persistence requirement while its trigger remains
active.

---

## Moderate: Touch and Activation

Touch devices do not provide dependable hover. Do not depend on a tooltip for
touch access. Use one of:

* Keep the information visible near the control
* Include it in the control's accessible name or existing description
* Provide a separate help button that opens a disclosure (see above)
* Use a non-modal dialog when the additional content is structured or interactive

---

## Moderate: Do Not Rely on the `title` Attribute

Browser-controlled `title` tooltips fall under the WCAG 1.4.13 exception when
their presentation is entirely user-agent controlled, but that exception does
not make `title` a dependable interface pattern. Authors cannot ensure
consistent keyboard, touch, magnification, timing, text size, or dismissal
behavior for `title`. Do not use `title` as the only:

* accessible name for a control
* source of instructions or validation requirements
* explanation of an icon
* way to reveal truncated text
* access path for touch users

---

## Moderate: Visual Design

* Normal-size tooltip text needs at least 4.5:1 contrast against its background
  (WCAG 1.4.3); large text needs 3:1
* A boundary, shape, or arrow needs 3:1 contrast against adjacent colors (WCAG
  1.4.11) only when that visual information is required to identify the
  component or state — a decorative arrow is not automatically subject to this
* Do not rely on color alone to associate a tooltip with its trigger
* At 400% zoom and narrow viewports: keep the tooltip within the viewport,
  allow text to wrap, avoid horizontal scrolling, don't cover the trigger or
  critical content, and preserve a way to dismiss it
* Detect viewport edges and reposition; recalculate placement after zoom,
  resize, content changes, and text-direction changes; avoid rendering inside
  an ancestor whose `overflow` clips the tooltip
* An icon-button trigger must still meet WCAG 2.2 Target Size (Minimum)
* Respect `prefers-reduced-motion`:

```css
[role="tooltip"] {
  position: absolute;
  max-inline-size: min(20rem, calc(100vw - 2rem));
  overflow-wrap: anywhere;
}
[role="tooltip"][hidden] { display: none; }

@media (forced-colors: active) {
  [role="tooltip"] { color: CanvasText; background: Canvas; border-color: CanvasText; }
}
@media (prefers-reduced-motion: no-preference) {
  [role="tooltip"] { transition: opacity 0.15s ease; }
}
```

---

## Content Requirements

* Keep content to a short phrase or sentence; describe the trigger, don't
  introduce an unrelated message
* Avoid repeating the trigger's accessible name word for word
* Do not include headings, lists, links, buttons, fields, or other controls
* Write in plain language; keep dynamic descriptions stable while the trigger
  has focus
* If content needs structure or several sentences, use persistent help,
  `aria-details`, a disclosure, or a dialog instead
* Do not make ordinary prose focusable merely to attach a tooltip — extra tab
  stops make keyboard navigation harder

---

## When NOT to Use a Tooltip

* Label of control is self-explanatory
* Information must be readable at all times → use persistent help text
* Touch-only interface → use a help button/disclosure or persistent help text
* Content is long or structured → use a popover, disclosure, or dialog
* Content contains interactive elements (links, buttons) → use a popover or dialog

---

## Testing

* **Keyboard:** reach the trigger with Tab/Shift+Tab, confirm the tooltip
  appears without moving focus, confirm `Escape` closes it while focus stays
  on the trigger, confirm no tooltip tab stop exists, confirm the focus
  indicator remains visible
* **Pointer/magnification:** hover the trigger, move the pointer onto every
  part of the tooltip and confirm it stays visible, confirm it closes when
  neither hover nor focus retains it, test with screen magnification
* **Touch:** confirm every action is usable without first discovering hover
  content; confirm essential information is visible or reachable via an
  explicit control; test screen reader gestures and confirm long press is not required
* **Screen reader:** confirm the trigger's accessible name is correct without
  the tooltip, the tooltip text is exposed as a description, name/description
  aren't needlessly duplicated, focus is not moved, and repeated focus doesn't
  produce stale descriptions. Test supported browser/AT combinations and
  record versions — presentation varies and no single announcement is universal
* **Visual/responsive:** 200%/400% zoom, narrow viewports, text-spacing
  overrides, forced-colors mode, reduced motion, RTL text, viewport-edge placement
* **Automated:** can catch missing/duplicate IDs, unresolved `aria-describedby`
  references, invalid ARIA values, focusable descendants inside a tooltip,
  inadequate contrast, hidden triggers, and stale open tooltips in component
  tests — but cannot prove hoverability, persistence, positioning, or
  screen-reader presentation. Keep manual tests in the release process.

---

## Common Failures

| Failure | Correction |
|---|---|
| Showing the tooltip only on hover | Show it on keyboard focus too |
| Hiding it when the pointer leaves the trigger | Keep it open while the pointer is over the trigger or tooltip |
| Hiding it when pointer leaves even though focus remains | Track pointer and focus state separately |
| Closing it after a fixed timeout | Keep it visible until trigger removal, dismissal, or invalidation |
| Moving focus into the tooltip | Keep focus on the trigger |
| Putting a link or button in `role="tooltip"` | Use a disclosure, non-modal dialog, or other popup |
| Using `aria-expanded`/`aria-haspopup` for an automatic tooltip | Use `aria-describedby` and `role="tooltip"` |
| Relying on `title` for a control label or instruction | Provide a visible label and persistent/authored help |
| Overwriting existing `aria-describedby` IDs | Append and preserve all relevant references |
| Attaching essential help only to a disabled control | Make the explanation visible |

---

## Definition of Done Checklist

* [ ] A tooltip is the correct pattern (see the pattern-choice table above)
* [ ] Essential information is visible without opening the tooltip
* [ ] The trigger has a complete accessible name without depending on the tooltip
* [ ] `role="tooltip"` on tooltip element with a unique `id`
* [ ] Trigger references it via `aria-describedby` without losing other descriptions
* [ ] Tooltip appears on both hover and keyboard focus
* [ ] `Escape` dismisses without moving focus; not closed on a fixed timer
* [ ] Tooltip hoverable (pointer can move over it without dismissal)
* [ ] Tooltip and all descendants are not focusable; no interactive content inside
* [ ] Touch users have visible information or an explicit help control
* [ ] Disabled controls do not hide their explanation
* [ ] Text contrast 4.5:1; required non-text contrast 3:1
* [ ] Reflows/wraps and remains operable at zoom and with text-spacing overrides
* [ ] `prefers-reduced-motion` respected for animations
* [ ] Tested across keyboard, pointer, touch, magnification, and supported screen readers

---

## Key WCAG Criteria

* 1.3.1 Info and Relationships (A)
* 1.4.3 Contrast Minimum (AA)
* 1.4.10 Reflow (AA)
* 1.4.11 Non-text Contrast (AA)
* 1.4.12 Text Spacing (AA)
* 1.4.13 Content on Hover or Focus (AA) — **Serious if hover-only or not dismissible**
* 2.1.1 Keyboard (A) — **Serious if keyboard cannot trigger tooltip**
* 2.1.2 No Keyboard Trap (A)
* 2.4.7 Focus Visible (AA)
* 2.4.11 Focus Not Obscured Minimum (AA)
* 2.5.8 Target Size Minimum (AA)
* 4.1.2 Name, Role, Value (A)

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/TOOLTIP_ACCESSIBILITY_BEST_PRACTICES.md)
* [WCAG 2.2 Understanding 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
* [WAI-ARIA APG — Tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) (marked work-in-progress by W3C — useful guidance, not a substitute for user testing)
* [Technique SCR39: Hoverable, Dismissible, and Persistent](https://www.w3.org/WAI/WCAG22/Techniques/client-side-script/SCR39)
* [Failure F95: Content Shown on Hover Is Not Hoverable](https://www.w3.org/WAI/WCAG22/Techniques/failures/F95)

> **Standards horizon:** WCAG 3.0 is in development; 1.4.13 requirements are
> expected to carry forward.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
