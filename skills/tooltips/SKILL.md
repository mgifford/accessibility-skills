# Tooltips Accessibility Skill

> **Canonical source**: `examples/TOOLTIP_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when implementing or reviewing tooltip components.
**Only load this skill if the project contains tooltips.**

---

## Core Mandate

Tooltips must convey supplementary information to all users regardless of input
method. A tooltip unreachable by keyboard is an accessibility barrier.

Tooltips are **non-interactive supplementary labels only**. If the content is
essential, or contains links/buttons, use persistent text or a popover instead.

---

## Severity Scale (this skill)

| Level | Meaning |
| --- | --- |
| **Critical** | Tooltip contains essential information with no other access route |
| **Serious** | Tooltip unreachable by keyboard or AT |
| **Moderate** | Tooltip accessible but WCAG 1.4.13 requirements not fully met |
| **Minor** | Best-practice gap; marginal impact |

---

## Critical: Essential Information Must Not Live Only in a Tooltip

A tooltip is supplementary by definition. If the information it contains is
required to complete a task, it must also appear as persistent visible text.
**Hiding essential content behind hover/focus only is Critical.**

---

## Serious: Tooltips Must Appear on Both Hover and Focus

A tooltip that only appears on hover is **Serious** — keyboard users cannot
trigger it.

```js
function showTooltip() { tooltip.removeAttribute('hidden'); }
function hideTooltip() { tooltip.setAttribute('hidden', ''); }

trigger.addEventListener('mouseenter', showTooltip);
trigger.addEventListener('mouseleave', hideTooltip);
trigger.addEventListener('focusin',    showTooltip);
trigger.addEventListener('focusout',   hideTooltip);

// Escape dismisses without moving focus
trigger.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideTooltip();
});
```

---

## Serious: ARIA Pattern Must Be Correct

**Incorrect ARIA on tooltips is Serious** — AT users receive wrong or no
supplementary information.

```html
<button type="button" aria-describedby="save-tooltip">Save</button>
<div id="save-tooltip" role="tooltip" hidden>
  Save changes to your draft
</div>
```

Rules:

* Tooltip element must have `role="tooltip"`
* Trigger must reference tooltip via `aria-describedby` (not `aria-labelledby`)
* Use `hidden` to conceal; never `aria-hidden="true"` on an active tooltip
* Each tooltip must have a unique `id`
* Do not put `role="tooltip"` on the trigger itself
* Tooltips must **not** be focusable — no `tabindex` on the tooltip container

For icon-only triggers, add `aria-label` for the accessible name:

```html
<button type="button"
        aria-label="Delete item"
        aria-describedby="delete-tip">
  <!-- SVG icon, aria-hidden="true" focusable="false" -->
</button>
<div id="delete-tip" role="tooltip" hidden>
  Permanently removes this item from your account
</div>
```

---

## Moderate: WCAG 1.4.13 — Content on Hover or Focus

| Requirement | Description | Severity if failing |
| --- | --- | --- |
| **Dismissible** | `Escape` dismisses without moving pointer or focus | Serious |
| **Hoverable** | User can move pointer over tooltip without it disappearing | Moderate |
| **Persistent** | Stays visible until trigger loses focus/hover | Moderate |

---

## Moderate: Touch / Mobile — Toggletip Pattern

Hover tooltips do not work on touch screens. Use the toggletip pattern:

```html
<button type="button"
        aria-expanded="false"
        aria-controls="info-tip"
        aria-label="More information about password requirements">
  <span aria-hidden="true">ⓘ</span>
</button>
<div id="info-tip" hidden>
  Your password must be at least 12 characters and include a number.
</div>
```

Toggle `aria-expanded` and `hidden` together on click.

---

## Moderate: Visual Design

* Tooltip text: 4.5:1 contrast against tooltip background
* Tooltip background: 3:1 contrast against adjacent surfaces
* Respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: no-preference) {
  [role="tooltip"] { transition: opacity 0.15s ease; }
}
```

---

## When NOT to Use a Tooltip

* Label of control is self-explanatory
* Information must be readable at all times → use persistent help text
* Touch-only interface → use toggletip or persistent help text
* Content is long → use a popover or disclosure
* Content contains interactive elements (links, buttons) → use a popover

---

## Definition of Done Checklist

* [ ] `role="tooltip"` on tooltip element
* [ ] Trigger has `aria-describedby` pointing to tooltip id
* [ ] Tooltip appears on both hover and keyboard focus
* [ ] `Escape` dismisses without moving focus
* [ ] Tooltip hoverable (pointer can move over it without dismissal)
* [ ] Tooltip not focusable itself
* [ ] Text contrast 4.5:1; background 3:1 against surface
* [ ] Touch/mobile has toggletip fallback
* [ ] `prefers-reduced-motion` respected for animations
* [ ] Essential information not hidden tooltip-only

---

## Key WCAG Criteria

* 1.4.3 Contrast Minimum (AA)
* 1.4.13 Content on Hover or Focus (AA) — **Serious if hover-only**
* 2.1.1 Keyboard (A) — **Serious if keyboard cannot trigger tooltip**
* 4.1.2 Name, Role, Value (A)

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/TOOLTIP_ACCESSIBILITY_BEST_PRACTICES.md)
* [WCAG 2.2 Understanding 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
* [WAI-ARIA APG — Tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)

> **Standards horizon:** WCAG 3.0 is in development; 1.4.13 requirements are
> expected to carry forward.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
