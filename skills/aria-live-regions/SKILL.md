---
name: aria-live-regions
description: >
  Load this skill whenever the project contains dynamic content updates,
  status messages, alerts, notifications, loading indicators, or any use of
  aria-live, role="status", role="alert", or role="log". Under no circumstances
  add or modify live-region markup without applying these rules. Prioritize
  correct politeness levels and avoid redundant announcements. Never use a
  fixed-delay clear-and-reinsert workaround — no standard guarantees it works.
---

# ARIA Live Regions Accessibility Skill

> **Canonical source**: `examples/ARIA_LIVE_REGIONS_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when implementing any dynamic content updates announced to
assistive technologies.
**Only load this skill if the project contains dynamic content updates.**

---

## Core Mandate

Live regions make dynamic status information available to screen reader
users without moving keyboard focus — they are useful for concise updates
(a result count, a saved confirmation, progress information). **Live regions
are not a general notification system.** They do not replace visible
content, native HTML, focus management, or a control's programmatic state.
Poorly timed or excessive announcements can be missed, duplicated,
reordered, or disruptive.

Prefer visible status messages — they also help magnification users,
cognitive/learning-disabled users, and anyone who wouldn't otherwise notice
a change elsewhere on the page. Use native HTML and programmatic control
state (e.g., `aria-expanded`) *before* reaching for a live region.

---

## Severity Scale (this skill)

| Level | Meaning |
|---|---|
| **Critical** | Dynamic content change conveys no information to AT; user cannot complete task |
| **Serious** | `assertive`/`role="alert"` used for non-urgent updates, interrupting mid-sentence; live region not exposed before the update it must report |
| **Moderate** | Status updates absent; success/failure not announced; announcements too verbose |
| **Minor** | Redundant announcements; live region content duplicates visible text unnecessarily |

---

## What WCAG 4.1.3 Actually Requires

WCAG 4.1.3 requires *existing* status messages to be programmatically
determinable so AT can present them without moving focus. It does **not**
require creating a new status message for every dynamic change — an updated
result list is content; a message like "18 results found" is the status
message. A dialog receiving focus is a change of context, not a status message.

**Choose the mechanism by situation, not by default reflex:**

| Situation | Primary mechanism |
|---|---|
| A button expands/collapses content | Keep focus on the button; update `aria-expanded` |
| A tab changes panels | Use the tabs pattern and its selected state |
| A modal dialog opens | Move focus into the dialog |
| An SPA changes route | Update the document title; move focus to a logical heading |
| A form reveals several errors | Error summary + focus management; associate each error with its field |
| Save/cart/filter/search completes | Concise visible `role="status"` message |
| An important time-sensitive condition occurs | Visible `role="alert"` message |
| A condition requires an immediate decision | Alert dialog; move focus into it |
| New entries appended to an ordered history | `role="log"` when that semantic matches |

Live regions can supplement focus management — they should not announce a
focus change that already provides the same information.

---

## Critical: `role="status"`, `role="alert"`, and `role="log"`

| Role | Implicit `aria-live` | Implicit `aria-atomic` | Use for |
|---|---|---|---|
| `role="status"` | `polite` | `true` | Advisory info not requiring immediate action |
| `role="alert"` | `assertive` | `true` | Important, usually time-sensitive information |
| `role="log"` | `polite` | — | Ordered sequences where new info is added (chat, activity log) |

```html
<p id="cart-status" role="status"></p>
<p id="connection-alert" role="alert"></p>
```

Do not add redundant explicit `aria-live`/`aria-atomic` values on these roles
unless a verified compatibility need justifies it. An alert does not receive
focus and should not require a response to dismiss — **if the user must stop
and respond, use the [ARIA APG alert dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)**
with full modal dialog keyboard handling instead. Do not use `role="alert"`
for routine validation, success confirmations, or every field error.

```html
<div role="log" aria-relevant="additions" aria-atomic="false">
  <p>Jordan uploaded quarterly-report.pdf.</p>
</div>
```

`role="log"` needs an accessible name (via a heading + `aria-labelledby`) and
each entry should be understandable on its own.

**`aria-live` bare values** (use only when no live-region role fits):

| Value | Meaning |
|---|---|
| `off` | Default — updates not presented unless focus is within the region |
| `polite` | Present at the next graceful opportunity |
| `assertive` | Highest priority — use only when interruption is imperative |

`assertive` indicates priority but does **not guarantee** any specific AT
will interrupt speech immediately — actual behavior depends on product,
settings, and other queued output. **Using `assertive`/`role="alert"` for
non-urgent updates is Serious.**

---

## Serious: `aria-atomic`, `aria-relevant`, and `aria-busy`

**`aria-atomic`** (default `false`): use `true` when the complete phrase
provides necessary context ("3 items in cart"); use `false` when each
addition is independently meaningful (a new chat log entry). `status`/`alert`
already default to `true`. When `true`, the region's accessible name/label
may also be presented — test the resulting full phrase, not just the
changed text node.

```html
<div role="status" aria-atomic="true" id="filter-status">
  Showing 24 of 156 results for "accessible forms"
</div>
```

**`aria-relevant`** — its default is **`additions text`**, not just
`additions`. Values: `additions`, `removals`, `text`, `all`. These are
suggestions to AT, not delivery guarantees. Use `removals`/`all` sparingly —
don't rely on removal announcements for critical information.

**`aria-busy`** — set `true` while a region receives a batch of related
updates, then reset to `false` when complete. AT may defer processing until
the region is no longer busy.

```js
results.setAttribute('aria-busy', 'true');
renderResults(items);
results.setAttribute('aria-busy', 'false');
```

**Always reset `aria-busy`, including after an error** — leaving it `true`
after an exception is a common failure. Don't use `aria-busy` as the only
loading indication; provide visible status too.

---

## Critical: Update Timing — No Fixed-Delay Workarounds

Live-region behavior depends on accessibility APIs observing the region
*before* the relevant content change — adding a live region and its
completed message in the same DOM operation may be missed. The useful rule:
**expose a stable live region first, then update its content in response to
a later event.** The region does not need to exist on initial page load — in
a component/SPA it can mount before a later update, as long as it's mounted
*before that update happens*. If users must understand information on
initial load, put it visibly in the reading order instead of relying on a
live region.

**No standard defines a reliable 50ms, 100ms, or any other fixed delay for
live regions.** Clearing a region and reinserting the same text after a
timeout can produce missed, duplicate, stale, or reordered output — **do not
use this pattern.** Instead:

* keep a stable announcement node
* update it after the component has mounted
* let the framework render the message from state
* announce only the final meaningful result of a rapid sequence
* suppress responses from stale asynchronous requests
* use a tested application-announcer abstraction when many components report status

`role="alert"` has special processing in many implementations, so
dynamically rendered alert content is often announced — this does not make
`alert` equivalent to adding `aria-live="assertive"` to any new element, and
does not make initial-page-load alerts reliable.

---

## Serious: Visibility and Content Scope

Use a visually hidden live region only when: equivalent visible information
already exists and a nonvisual supplement is genuinely needed, or a concise
announcement is needed to describe a complex visible update. **Do not
duplicate the same message in both a visible and a separate hidden live
region** — that causes repeated announcements.

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
```

**Never apply `hidden`, `display: none`, `visibility: hidden`, or
`aria-hidden="true"` to a live region while it's expected to announce** —
avoid rules like `.status:empty { display: none; }` when the empty region
must stay exposed before its next update.

Keep the live region narrow — announce the short status, not an entire
results container, form, table, or page section. Avoid nested live regions
and avoid a `role="alert"` inside another live region. Interactive controls
generally don't belong inside a live region; if a toast contains an action,
keep it persistent long enough to find and operate, with its own focus strategy.

---

## Implementation Patterns

**Visible status after an action:**

```html
<button type="button" id="add-to-cart">Add notebook to cart</button>
<p id="cart-status" role="status"></p>
```
```js
addButton.addEventListener('click', () => {
  addProduct('Notebook');
  cartStatus.textContent = 'Notebook added to cart. 3 items in cart.';
});
```

**Search results with stale-request handling:**

```js
let requestSequence = 0;
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const sequence = ++requestSequence;
  results.setAttribute('aria-busy', 'true');
  resultStatus.textContent = `Searching for ${query}.`;
  try {
    const items = await searchProducts(query);
    if (sequence !== requestSequence) return; // stale response, ignore
    renderSearchResults(results, items);
    resultStatus.textContent = `${items.length} results found for ${query}.`;
  } catch (error) {
    if (sequence === requestSequence) {
      resultStatus.textContent = 'Search could not be completed. Try again.';
    }
  } finally {
    if (sequence === requestSequence) results.setAttribute('aria-busy', 'false');
  }
});
```

Escape/render untrusted result data safely. Consider delaying the visible
"Searching" message so fast operations don't announce both loading and
completion in immediate succession.

**Character count — announce only at thresholds, not every keystroke:**

```js
const thresholds = new Set([100, 50, 20, 10, 0]);
let lastAnnounced = null;
summary.addEventListener('input', () => {
  const remaining = summary.maxLength - summary.value.length;
  remainingCount.textContent = remaining; // visible count updates continuously
  if (thresholds.has(remaining) && remaining !== lastAnnounced) {
    countStatus.textContent = `${remaining} characters remaining.`; // hidden status, threshold only
    lastAnnounced = remaining;
  }
});
```

**Form errors:** show a visible summary and move focus to it — this is a
focus-management pattern, a live region is not required for the summary
itself. Do not add `role="alert"` to every field error while the user is
typing; a concise nearby `role="status"` may suit a single async field check
if it doesn't duplicate what focus already presented.

**Progress:** use native `<progress>`; announce meaningful milestones or
completion, not every percentage change.

**Session timeout requiring a response:** use an alert *dialog*
(`role="alertdialog"`, `aria-modal="true"`, accessible name/description,
initial focus inside, keyboard containment, focus returned on close) — an
assertive announcement alone does not make a timed interaction accessible.
Follow WCAG 2.2.1 Timing Adjustable for the timeout itself.

---

## Moderate: Managing Multiple Updates

Rapid live-region updates can overwhelm the speech queue and hide the
outcome the user needs:

* announce the result of an explicit user action before background activity
* debounce filter/search announcements triggered by typing
* combine related updates into one useful sentence
* cancel or ignore stale asynchronous responses
* don't announce scroll, pointer movement, animation frames, or clock ticks
* avoid announcing a loading state when completion is effectively immediate
* provide pause/mute controls for persistent streams (chat, sports, monitoring)
* avoid simultaneous `status` and `alert` messages for the same event

Avoid prefixes like "Notification" or "Status" when the role already
provides that context.

---

## Framework and Component Guidance

The DOM and accessibility tree produced at runtime determine accessibility,
not the framework. Place a stable announcer near the application root when
many components need one; render announcement content through framework
state (not direct node mutation the framework also manages); ensure the
announcer has mounted before a later state change updates it; prevent nested
roots/portals from creating duplicate active announcers; treat hydration,
route transitions, and remounting as timing boundaries that may reset the
region; coalesce state updates so intermediate text isn't announced.

**React pattern (mount first, update via effect, no fixed delay needed
if the region is already mounted before state changes):**

```jsx
const [status, setStatus] = useState('');

useEffect(() => {
  // Runs after the region has mounted and rendered; no arbitrary timeout needed
}, [status]);

return (
  <>
    <div id="status-region" role="status" aria-atomic="true" className="visually-hidden">
      {status}
    </div>
  </>
);
```

A framework utility can coordinate priority, deduplication, and stale-request
handling — it still requires manual testing with supported AT.

---

## Testing

**Static inspection:** the chosen role matches the message's purpose;
implicit role properties aren't contradicted by explicit ones; the region is
exposed before the update it must report; the region isn't hidden from the
accessibility tree during the update; status text is short and doesn't wrap
a large changing container; live regions aren't nested; duplicate announcers
aren't mounted; `aria-busy` returns to `false` after success and failure.

**Manual interaction testing** (per important flow): start reading content
away from the update; initiate the action with the keyboard; confirm the
message is visible when it should be; confirm a polite message doesn't
needlessly interrupt; confirm an alert is reserved for an important
condition; trigger rapid updates and verify only the useful result is
presented; repeat the same action and verify the second outcome is announced;
trigger overlapping requests and confirm stale results aren't announced;
confirm focus remains logical and isn't moved by a status update.

**Automated checks** can detect invalid ARIA values, conflicting explicit/
implicit properties, live regions hidden with `aria-hidden`, nested live
regions, duplicate IDs, and components leaving `aria-busy="true"` after
tests complete. Add integration tests asserting the final DOM message after
a user action, including error and stale-request paths — a passing DOM
assertion is not proof an AT announced it correctly.

---

## Common Failures

| Failure | Correction |
|---|---|
| Adding a new live-region element and its message in one operation | Expose a stable region, then update it after a later event |
| Requiring the region to exist on initial page load | Require it exposed before the relevant update, including in mounted components |
| **Clearing and reinserting text after a fixed delay (e.g. 50ms)** | Remove the universal timeout; update stable state and test repeated outcomes |
| Using `assertive` for ordinary confirmations | Use `role="status"` |
| Expecting `assertive` to guarantee immediate interruption | Treat it as priority; test actual supported combinations |
| Putting `role="alert"` on every field error | Use an error summary, field associations, and focus management |
| Moving focus to content when an accordion opens | Keep focus on the disclosure control; update `aria-expanded` |
| Announcing an entire result list | Announce a concise result summary |
| Hiding an empty region with `display: none` | Keep the stable region exposed when a later update must be announced |
| Announcing every character, percentage, or second | Announce meaningful thresholds and completion |
| Leaving `aria-busy="true"` after an exception | Reset it in every completion path |
| Duplicating visible and hidden live messages | Use one status message or a tested non-duplicating design |

---

## Definition of Done Checklist

* [ ] Each message classified as control state, status, alert, log, dialog content, or focused content
* [ ] Visible information provided wherever practical
* [ ] `role="status"` used for advisory updates; `role="alert"` limited to important/time-sensitive updates
* [ ] Alert dialog + focus management used when a response is required
* [ ] Live region exposed before the relevant content update — no reliance on initial-page-load or fixed-delay announcement guarantees
* [ ] **No fixed-delay clear-and-reinsert workaround used**
* [ ] `aria-atomic`, `aria-relevant`, `aria-busy` used only when their behavior matches the update; default `aria-relevant` understood as `additions text`
* [ ] Region never hidden from the accessibility tree during an update
* [ ] Large containers and interactive controls not used as live regions
* [ ] Rapid, duplicate, and stale updates reduced or suppressed
* [ ] Focus management remains correct with announcements enabled or missed
* [ ] Success, error, loading, repeated-action, and overlapping-request paths tested
* [ ] Tested: NVDA+Chrome, JAWS+Chrome, VoiceOver+Safari (and NVDA+Firefox if in the support matrix)

---

## Key WCAG Criteria

* 4.1.3 Status Messages (AA) — **Critical if status updates not announced**
* 4.1.2 Name, Role, Value (A)
* 3.3.1 Error Identification (A)
* 3.3.3 Error Suggestion (AA)
* 2.4.3 Focus Order (A)
* 2.2.1 Timing Adjustable (A)

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/ARIA_LIVE_REGIONS_BEST_PRACTICES.md)
* [MDN — ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)
* [WAI-ARIA 1.2: Live Region Attributes](https://www.w3.org/TR/wai-aria-1.2/#attrs_liveregions)
* [ARIA Authoring Practices Guide: Alert Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)
* [WCAG 2.2 Understanding 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)

> **Standards horizon:** WCAG 3.0 is in development. Status message requirements
> are expected to be preserved and potentially expanded.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
