---
name: speech-recognition
description: >
  Load this skill whenever the project must support speech input or voice
  control — dictation, "click by voice" grammars, Dragon NaturallySpeaking,
  Voice Control (iOS/macOS), Voice Access (Android), or any interface where
  users activate controls by speaking. Under no circumstances let an
  aria-label override a visible label without keeping the visible text intact
  and in order. Absolutely always ensure the accessible name contains the
  visible label, and load alongside keyboard/SKILL.md since speech tools
  commonly emulate keyboard and pointer input.
---

# Speech Recognition Accessibility Skill

> **Canonical source**: `examples/SPEECH_RECOGNITION_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when implementing or reviewing any interface that must
support speech input or voice control.
**Load alongside `keyboard/SKILL.md` — speech tools often rely on keyboard
and pointer emulation, so keyboard requirements are a foundation, not a substitute.**

---

## Core Mandate

Speech recognition can dictate text, navigate interfaces, activate controls,
emulate keyboard input, and operate a pointer. Speech recognition is not the
same as speaker recognition — speech recognition interprets words and
commands; speaker recognition tries to identify who is speaking.

**Core principles:**
1. Use visible, persistent labels — people must be able to determine what to say without guessing a hidden name
2. Match visible labels and accessible names — if a control has visible text, its accessible name must contain that text
3. Use native semantics — correct HTML names/roles/states/values/keyboard behavior give speech tools reliable information
4. Support more than direct label activation — keyboard emulation, name/number overlays, and pointer emulation vary by product
5. Do not require fine pointer control — provide alternatives to dragging, path gestures, and precise spatial interaction
6. Accept input from more than key events — dictation, paste, and autocomplete may change a field without firing expected keystrokes
7. Provide clear feedback — expose changed state, errors, confirmations, and results visually and programmatically
8. Test the supported environments — commands, overlays, and behavior vary by product, platform, and version

**Who uses speech input:** people with limited movement/strength/dexterity/
reach/endurance; repetitive strain injuries, pain, tremors, or fatigue;
people using speech instead of or alongside a keyboard/pointer; people with
cognitive/learning disabilities who find dictation easier than typing;
temporary or situational limitations; people combining speech with a screen
reader, magnifier, or switch. **Speech users are not necessarily sighted** —
do not design or test on the assumption that everyone using speech can see a
label, overlay, pointer, focus indicator, or visual result.

---

## Severity Scale (this skill)

| Level | Meaning |
|---|---|
| **Critical** | A control cannot be activated by any speech-tool method (name, overlay, or keyboard/pointer emulation) |
| **Serious** | Accessible name doesn't contain the visible label; validation depends only on `keydown` and silently rejects dictated/pasted input |
| **Moderate** | Repeated controls are hard to disambiguate; icon-only control has no accessible name |
| **Minor** | Hidden context inserted before rather than after the visible label; inconsistent localization of names |

---

## Critical: Visible Labels Must Be Contained in the Accessible Name (WCAG 2.5.3)

For a component with visible text or an image of text, the accessible name
must **contain** that visible text — having it at the *start* of the name is
documented best practice, not an additional normative requirement.

```html
<!-- Prefer: native text as the name -->
<button type="submit">Save</button>

<!-- Wrong: accessible name is "Confirm changes", not "Save" -->
<button type="submit" aria-label="Confirm changes">Save</button>

<!-- Acceptable when extra context is genuinely needed -->
<button type="submit" aria-label="Save document">Save</button>
```

`aria-label`/`aria-labelledby` can override names derived from child content
— inspect the **computed** accessible name rather than assuming every
labeling source combines. Do not use placeholder text as the only label — it
can disappear during dictation and isn't a substitute for a programmatically
associated `<label>`.

**Keep visible words contiguous and in order:**

```html
<!-- Good: visible label starts the accessible name -->
<button>Delete <span class="visually-hidden">quarterly report</span></button>

<!-- Avoid: hidden words interrupt the visible label -->
<button aria-label="Delete the quarterly report permanently">Delete report</button>
```

The second example contains "Delete" and "report" but inserts other words
between them — some speech tools may not match the phrase a user sees. A
hidden *prefix* (context appearing before the visible word) is not
automatically a 2.5.3 failure if the visible text still appears intact, but
it can still make direct label activation harder — prefer not to put hidden
words before the text a person sees. Put format hints/constraints in an
`aria-describedby` description, not the name.

---

## Serious: Disambiguate Repeated Controls Without Renaming Them

Repeated labels ("Edit", "Delete", "Read more") can cause a speech tool to
present several matches — not automatically a conformance failure, but it
increases effort. Prefer specific visible labels when concise:

```html
<a href="/services">Read about services</a>
<a href="/products">Read about products</a>
```

For compact repeated actions, add contextual text **after** the visible action:

```html
<li>
  Billing address
  <a href="/account/billing/edit">Edit <span class="visually-hidden">billing address</span></a>
</li>
```

**Do not make accessible names unique by replacing or reordering the visible
label** — "Modify billing address" is not a good hidden name for a visible
"Edit" link.

---

## Moderate: Icon-Only Controls

Still need an accessible name under WCAG 4.1.2 (2.5.3 doesn't apply when
there's no visible text label):

```html
<button type="button" aria-label="Close dialog">
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
    <path d="M6 6 18 18M18 6 6 18"></path>
  </svg>
</button>
```

Persistent visible text is usually more discoverable than an icon alone. A
tooltip appearing only on hover/focus is **not** a persistent visible label —
a person must first discover or target the control before it helps. If an
icon-only design is retained: use a concise localized name; use a familiar
icon consistently; provide adequate target size/spacing; ensure name/number
overlays identify it; don't use color or position as the only description;
test with the supported speech tools.

---

## Critical: Native Semantics and Keyboard Operation

Speech tools often use accessibility APIs, keyboard emulation, or pointer
emulation — native HTML supplies reliable role/name/state/value/focus/
activation behavior for free.

```html
<!-- Wrong: not a reliable button -->
<div class="button" onclick="saveDocument()">Save</div>

<!-- Correct -->
<button type="button" onclick="saveDocument()">Save</button>
```

Do not publish tables claiming a particular spoken phrase always works for
every role — command grammar differs by speech product, platform, locale,
and version. Correct semantics still improve compatibility and remain
required for other AT. All functionality must be available through a
keyboard interface (unless the function requires path-dependent input) —
speech software can use that keyboard interface as one operating method. For
custom widgets: use the correct role only when no native element suffices;
implement the expected keyboard interaction; expose name/state/properties/
value; update programmatic state when visual state changes; follow an
established APG pattern. See `skills/keyboard/SKILL.md`.

---

## Serious: Dictation and Text Entry Must Not Depend Only on `keydown`

Speech dictation may insert, replace, or delete text without producing the
same `keydown` sequence as a physical keyboard.

```js
// Correct: responds to value changes regardless of input method
search.addEventListener('input', () => updateSuggestions(search.value));

// Wrong: dictation, paste, and autocomplete may bypass this logic
search.addEventListener('keydown', event => updateSuggestions(event.key));
```

Text-entry controls should: use native inputs/textareas; have persistent
visible labels; expose format instructions and errors programmatically;
accept paste, dictation, autocomplete, and programmatic value changes; allow
editing/correction before submission; avoid short time limits or speech-rate
assumptions; not require a specific punctuation phrase when another valid
value is acceptable; preserve entered content after validation errors. **Do
not infer that a lack of `keydown` means no input occurred** — validate the
current value at the appropriate event and again at submission.

---

## Serious: Dragging, Gestures, and Spatial Interaction Need Direct Alternatives

Dragging with a speech-controlled pointer can require several commands and
precise timing.

```html
<!-- Reordering alternative -->
<li>
  Budget report
  <button type="button">Move up <span class="visually-hidden">Budget report</span></button>
  <button type="button">Move down <span class="visually-hidden">Budget report</span></button>
</li>
```

If drag-and-drop is also available, both methods should update the same
model and provide confirmation. For sliders, pair the draggable control with
a direct entry or step control:

```html
<label for="volume">Volume</label>
<input id="volume" type="range" min="0" max="100" value="50">
<label for="volume-value">Volume percentage</label>
<input id="volume-value" type="number" min="0" max="100" value="50">
```

WCAG 2.5.7 requires author-created dragging to have a single-pointer
alternative unless essential — **a keyboard-only alternative does not
necessarily satisfy this single-pointer requirement.** Path-based or
multipoint gestures need a single-pointer alternative under 2.5.1 too, unless
the gesture is essential. See `skills/touch-pointer/SKILL.md`.

---

## Moderate: Focus, Scrolling, and Overlays

Some speech users emulate keyboard commands or combine speech with another
input method — focus order, visibility, and unobscured controls remain
important. Sticky headers/cookie notices/chat launchers must not hide a
focused component (WCAG 2.4.11).

```css
html { scroll-padding-block-start: var(--sticky-header-height, 4rem); }
:focus-visible { scroll-margin-block: 0.5rem; }
```

Ensure: focus doesn't move behind an open modal; closing a dialog returns
focus to a logical control; direct activation scrolls the target into view
when needed; overlays can be dismissed without dragging or precise pointer
movement; no essential control is permanently covered at supported viewport
sizes. Speech input can be combined with a screen reader, so interaction
must not depend on seeing focus or an overlay.

---

## Serious: Expose State, Results, and Error Feedback Programmatically

```html
<button type="button" aria-expanded="false" aria-controls="filters-panel">Filters</button>
<div id="filters-panel" hidden><!-- Filter controls --></div>
```

Update both `aria-expanded` and `hidden` together — similarly for
`aria-pressed`, `aria-checked`, selected tabs, and slider values.

```html
<p id="cart-status" role="status" aria-atomic="true"></p>
```

Use visible text and an appropriate status-message pattern (see
`skills/aria-live-regions/SKILL.md`) — don't move focus for every
confirmation. For errors needing immediate correction, associate the error
with the field and use the form's established error-summary strategy. Avoid
feedback that is: shown only by color/animation/icon change; available only
on hover; removed before it can be perceived; announced repeatedly for every
dictated character; hidden from accessibility APIs; disconnected from the
control that caused it.

---

## Moderate: Labels, Symbols, and Localization

Use the same human language for visible labels and accessible names —
translate `aria-label`, hidden context, descriptions, and error messages
with the rest of the interface. Do not normalize every symbol into an
unrelated word — the correct name depends on function: a magnifying-glass
icon used as a control is named "Search," not "Magnifying glass"; a visible
`X` used only as a close icon should have the function "Close." Test speech
matching in each supported interface and dictation language — a command
working in English may not work after translation.

---

## Product and Platform Variation

Speech tools differ in how they activate a control by name, display name/
number/grid overlays, disambiguate repeated names, emulate keyboard/pointer
input, handle embedded frames and shadow DOM, and switch between
command/dictation modes. **Do not put fixed command phrases, product
versions, or compatibility claims into a project standard unless the project
actively maintains and retests them.**

Record the actual test environment:

```text
Speech input product and version:
Operating system and version:
Browser and version:
Input and interface language:
Command, dictation, or mixed mode:
Viewport, zoom, and text size:
```

---

## Testing

* **Static inspection:** identify the visible label; inspect the computed
  accessible name/role; confirm visible words occur intact and in order in
  the name; check for hidden text before or inside the visible phrase;
  verify state/value/description relationships; confirm repeated controls
  can be distinguished; verify icon-only controls have concise names; verify
  names and hidden text are translated. Inspect the computed accessibility
  tree — don't infer the final name by reading attributes independently.
* **Keyboard foundation** (without a pointer): reach and operate all
  functionality; follow a logical focus order; open/use/close custom
  widgets; escape dialogs/menus/popovers; confirm focus stays visible and
  unobscured; complete drag alternatives.
* **Speech input test** (per supported environment): activate visibly
  labeled controls by speaking the visible label using the tool's
  documented grammar; inspect the tool's name/number overlay for
  discoverability; distinguish repeated controls; operate icon-only
  controls and custom widgets; dictate/edit/replace/submit text; trigger and
  correct validation errors; navigate modals/menus/tabs/disclosures/
  autocomplete; complete sorting/reordering/slider/map/canvas tasks through
  alternatives; confirm state changes and status feedback; repeat critical
  tasks after zoom/reflow/localization changes. Do not require every control
  to respond to one literal phrase like "Click [label]" — use the tested
  tool's documented grammar.
* **Test with users** who regularly use speech input — a technical pass
  cannot reveal the full effort of correcting recognition errors,
  disambiguating controls, or navigating a dense overlay.

**Automated checks** can detect controls without accessible names, some
visible-label-in-name mismatches, invalid/missing roles/states, click
handlers on non-interactive elements, and duplicate accessible names — cannot
determine whether a speech product actually recognizes a label, whether
repeated controls are practically distinguishable, or whether the total
number of commands makes a task unreasonably difficult. Treat uncertain
automated results as review items, not confirmed failures.

---

## Common Failures

| Failure | Correction |
|---|---|
| Visible "Save" button has hidden name "Confirm changes" | Use "Save," or a name beginning with "Save" |
| Hidden words inserted inside the visible phrase | Keep visible words contiguous and in order |
| Every repeated link is visibly "Read more" | Use specific visible text or append contextual hidden text after it |
| Placeholder is the only field label | Add a persistent, associated `<label>` |
| Icon-only button has no accessible name | Add a concise name; prefer persistent visible text |
| Tooltip treated as a visible label | Keep the label persistently visible when discoverability matters |
| Styled `<div>` acts as a button | Use `<button>` or implement the complete custom-widget contract |
| Validation runs only on `keydown` | Respond to `input`, current values, and submission |
| Reordering requires drag and drop only | Add Move up/Move down or position controls |
| Gesture is the only way to operate a feature | Add simple controls for the same result |
| Sticky content hides the focused control | Adjust layout/scrolling; test at supported sizes |
| State changes only visually | Update programmatic state and provide visible feedback |
| Project documentation promises universal spoken commands | Test and document the actual supported products and locales |
| Testing assumes every speech user can see | Include non-visual and combined AT use |

---

## Definition of Done Checklist

* [ ] Every control exposes an accurate name, role, state, and value
* [ ] Every visible text label is contained intact and in order in the accessible name
* [ ] Visible text appears at the start of the accessible name where practical
* [ ] Native HTML used where it can provide the required control
* [ ] Custom controls follow supported keyboard and ARIA patterns
* [ ] Repeated controls can be distinguished efficiently without renaming them
* [ ] Icon-only controls have concise, localized accessible names
* [ ] Form fields have visible, programmatically associated labels (not placeholder-only)
* [ ] Dictation, paste, autocomplete, editing, and correction update fields correctly
* [ ] Validation does not depend only on physical key events
* [ ] All functionality available through a keyboard interface
* [ ] Dragging and path-based gestures have single-pointer alternatives
* [ ] Focus remains logical, visible, and unobscured
* [ ] States, validation errors, confirmations, and results exposed programmatically
* [ ] Critical tasks tested in supported speech products, browsers, and languages
* [ ] Automated results supplemented by manual speech-input testing

---

## Key WCAG Criteria

* 1.3.1 Info and Relationships (A)
* 2.1.1 Keyboard (A)
* 2.4.3 Focus Order (A)
* 2.4.7 Focus Visible (AA)
* 2.4.11 Focus Not Obscured Minimum (AA)
* 2.5.1 Pointer Gestures (A)
* 2.5.3 Label in Name (A) — **Serious if visible label not contained in accessible name**
* 2.5.7 Dragging Movements (AA)
* 3.3.2 Labels or Instructions (A)
* 4.1.2 Name, Role, Value (A)
* 4.1.3 Status Messages (AA)

WCAG criteria describe outcomes, not product-specific spoken commands — a
command failing in one environment may indicate a content defect, a product
limitation, a localization issue, or an unsupported combination. Record the
environment and investigate before assigning a standards failure.

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/SPEECH_RECOGNITION_ACCESSIBILITY_BEST_PRACTICES.md)
* [W3C WAI Speech Recognition Perspective](https://www.w3.org/WAI/perspective-videos/voice/)
* [WCAG 2.2 Understanding 2.5.3 Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html)
* [WCAG 2.2 Understanding 2.5.7 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)
* [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
* [Providing Accessible Names and Descriptions](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/)

> **Standards horizon:** These rules target WCAG 2.2 AA.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
