---
name: forms
description: >
  Load this skill whenever the project contains forms, inputs, selects,
  checkboxes, radio buttons, text areas, or any validation flow. Under no
  circumstances create a form without visible labels, error identification, and
  keyboard accessibility. Absolutely always associate every input with a label
  and provide clear, accessible error messages.
---

# Forms Accessibility Skill

> **Canonical source**: `examples/FORMS_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when implementing or reviewing any form, input, or validation flow.
**Only load this skill if the project contains forms.**

---

## Core Mandate

Forms must be understandable and operable with keyboards, touch, speech input,
screen readers, screen magnification, browser autofill, password managers, and
other assistive technologies. Requirements apply to initial entry, validation,
recovery, review, submission, and authentication. Users must be able to
complete time-limited forms when a time limit is not essential, and complete
the form at 200%/400% zoom without losing content or functionality.

Prefer native HTML controls. Build a custom widget only when native controls
cannot meet the documented requirement, and implement the applicable keyboard,
focus, name, role, state, and value behaviour.

---

## Severity Scale (this skill)

| Level | Meaning |
| --- | --- |
| **Critical** | Blocks task completion entirely for one or more disability groups |
| **Serious** | Significantly impairs access; workaround unreasonable to expect |
| **Moderate** | Creates friction; workaround exists and is not too burdensome |
| **Minor** | Best-practice gap; marginal impact on access |

Do not assign severity from the violated rule alone — determine it from the
actual form and task. Consider: whether the defect blocks submission or
recovery; whether it affects authentication, payment, health, legal, safety,
or essential public services; how many users/controls are affected; whether a
reasonable workaround exists; whether it comes from a shared component; and
whether data can be lost.

---

## Critical: Labels

Every form control must have a programmatically associated label.
**Missing labels are Critical** — screen reader users cannot identify the field.

* Never use placeholder text as the sole label — it disappears on input, fails
  contrast requirements, and is not reliably announced by all screen readers
* Required fields must be identified in text, not by colour alone
* A control nested inside its own `<label>` is also valid
* Use `aria-label`/`aria-labelledby` only when a visible HTML label is not
  practical, and ensure the accessible name includes the words users can see
  (speech-input users identify controls by their visible label)
* Controls whose content already supplies a name (e.g., `<button>Save</button>`)
  don't need a separate label

```html
<!-- Bad: placeholder as only label — CRITICAL issue -->
<input type="email" placeholder="Email address">

<!-- Good: explicit label -->
<label for="email">
  Email address <span class="visually-hidden">(required)</span>
</label>
<input type="email" id="email" autocomplete="email" required>
```

**On `aria-required`:** Do not add `aria-required="true"` to native inputs
that already have the HTML `required` attribute — it is redundant and adds
noise to the accessibility tree. Use `aria-required` only on custom widgets
(e.g., `role="combobox"`, `role="listbox"`) that cannot use the native attribute.

**Required/optional fields:** explain how required fields are identified
before the first field (e.g., "Fields marked 'required' must be completed").
Don't rely on an asterisk or colour alone. Don't mark every optional field
when marking the smaller set of required fields would be clearer, or vice versa.

---

## Critical: Error Identification

Errors must be programmatically associated with their field.
**Absent error identification is Critical** — blind users receive no indication
something is wrong.

* Mark invalid fields with `aria-invalid="true"` after validation determines
  they are invalid; remove the invalid state and error association after correction
* Error messages must be specific and actionable — not just "invalid input"
* Never use colour or an icon alone to indicate an error
* Associate the error message with the field via `aria-describedby` (or a
  tested `aria-errormessage` implementation); preserve any existing hint association
* Keep the entered value unless security requires otherwise

```html
<label for="email">Email address</label>
<p id="email-hint">We will send the receipt to this address.</p>
<input id="email" name="email" type="email" autocomplete="email"
       aria-invalid="true" aria-describedby="email-hint email-error">
<p id="email-error">
  <strong>Error:</strong> Enter an email address in the format name@example.com.
</p>
```

Do not put `role="alert"` on error text that is already present when the page
loads — a live region only announces changes made *after* it is established.
Avoid combining several competing announcement mechanisms without AT testing.

---

## Critical: Error Summary

Provide an error summary when several fields can fail, the form is long,
errors may be outside the viewport, or users would otherwise have difficulty
locating them. **No error summary on multi-error, long, or complex forms is Critical.**

```html
<div id="error-summary" tabindex="-1" aria-labelledby="error-heading">
  <h2 id="error-heading">There are 2 errors</h2>
  <ul>
    <li><a href="#email">Email address: enter a valid email address</a></li>
    <li><a href="#dob-day">Date of birth: enter a real date</a></li>
  </ul>
</div>
```

* Place the summary before or at the beginning of the form; insert it after a
  failed submission and move focus to it
* Use links that identify both the field and the problem; activating a link
  must move focus to the relevant control
* Keep the inline field message as well as the summary; update the heading
  count when errors change
* Avoid adding `role="alert"` when focus movement already causes a clear
  announcement, unless testing shows an additional live announcement helps
* Focus movement is a deliberate response to the submit action — don't move
  focus on every inline validation change

---

## Critical: Do Not Block Paste

Never block paste, copy, or standard keyboard actions on any input.
**Blocking paste is Critical** — users with motor disabilities and those who use
password managers cannot re-type credentials they cannot physically type.

---

## Serious: Accessible Authentication (WCAG 3.3.8)

Authentication must not require users to remember, manipulate, or transcribe
information unless a conforming alternative or assistance mechanism exists.
At minimum:

* Allow password managers to identify and fill username/password fields
* Allow copy and paste into username, password, and verification-code fields
  — do not split a one-time code into controls that prevent pasting the whole code
* Do not ask for selected characters from a password
* Use appropriate autocomplete tokens (`username`, `current-password`, `new-password`,
  `one-time-code`)
* Provide a multi-factor path that doesn't require unsupported transcription
  or a cognitive puzzle; account recovery must meet the same requirements as login
* If a CAPTCHA or cognitive test is used, evaluate it against WCAG 3.3.8 and
  provide an applicable alternative

```html
<label for="username">Email address</label>
<input id="username" name="username" type="email" autocomplete="username">
<label for="password">Password</label>
<input id="password" name="password" type="password" autocomplete="current-password">
<button type="button" aria-controls="password" aria-pressed="false">
  Show password
</button>
```

A show-password button must update its visible label/pressed state
consistently, preserve focus, and not clear the value.

---

## Serious: Grouping Related Controls

Use `<fieldset>` + `<legend>` for related controls.
**Missing grouping is Serious** — radio and checkbox groups become unintelligible
without a group label.

```html
<fieldset>
  <legend>Notification preferences</legend>
  <label><input type="checkbox" name="email-notify"> Email</label>
  <label><input type="checkbox" name="sms-notify"> SMS</label>
</fieldset>
```

Keep legends concise; don't use `<fieldset>` solely for visual styling. For a
checkbox set that allows multiple selections, state that users may select
more than one.

---

## Serious: Input Types

Choose `type`, `autocomplete`, and `inputmode` independently according to what
the value means. This surfaces the correct virtual keyboard on mobile and
provides semantic meaning to AT.

| Information | Recommended control |
| --- | --- |
| Email address | `type="email" autocomplete="email"` |
| Telephone number | `type="tel" autocomplete="tel"` |
| Website address | `type="url" autocomplete="url"` |
| Search query | `type="search"` |
| Current / new password | `type="password" autocomplete="current-password"` / `"new-password"` |
| One-time code | One text input, `autocomplete="one-time-code" inputmode="numeric"` |
| Numeric quantity with increment/decrement semantics | `type="number"` |
| Numeric-looking identifier, postal code, card number | `type="text"` with matching `inputmode`/`autocomplete` |

### Do not treat all digits as numbers

Use `type="number"` only for values on which mathematical operations make
sense and `min`/`max`/`step` are useful — never for identifiers or values that
may contain leading zeros:

```html
<label for="quantity">Quantity</label>
<input id="quantity" name="quantity" type="number" min="1" max="20" step="1">

<label for="postal-code">Postal code</label>
<input id="postal-code" name="postal-code" type="text" autocomplete="postal-code">
```

`inputmode` requests a virtual keyboard; it does not validate the value. Add
`pattern` only when the resulting constraint and error message are correct for
every accepted value — do not assume all users enter ASCII digits.

### Date inputs

Use a native `<input type="date">` when it meets the product's locale,
browser, and AT requirements — test the actual implementation. For dates like
date of birth, separate labelled text inputs are often easier to understand
and validate than a native date picker or custom calendar widget:

```html
<fieldset>
  <legend>Date of birth</legend>
  <p id="dob-hint">For example, 23 4 1980.</p>
  <label for="dob-day">Day</label>
  <input id="dob-day" name="dob-day" inputmode="numeric"
         autocomplete="bday-day" aria-describedby="dob-hint">
  <label for="dob-month">Month</label>
  <input id="dob-month" name="dob-month" inputmode="numeric" autocomplete="bday-month">
  <label for="dob-year">Year</label>
  <input id="dob-year" name="dob-year" inputmode="numeric" autocomplete="bday-year">
</fieldset>
```

Do not build a custom calendar dialog unless users need calendar-based
selection; if one is required, implement and test the complete dialog and
grid keyboard interaction (see the APG Date Picker pattern).

### `<select>` — single

Native `<select>` is well-supported by all AT. Always include a blank/placeholder
option as the first `<option>` when no default is appropriate.

### Multiple selection

`<select multiple>` has poor discoverability (Shift/Ctrl-click) and is
keyboard-unfriendly. **Prefer checkboxes inside a `<fieldset>`** for a short,
known list. `<select multiple>` may be appropriate for expert interfaces but
must be usability-tested with the intended audience; if used, add visible
instructions (`Hold Ctrl (or Cmd on Mac) to select multiple options.`) referenced
via `aria-describedby`.

### `<datalist>`

Provides autocomplete suggestions for a text input; natively keyboard
accessible but announcement quality varies — test with your AT matrix. Not a
replacement for a fully accessible combobox when the suggestion list is the
only valid set of values — use `role="combobox"` with the
[APG Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) instead.

---

## Serious: Autocomplete for Personal Data

Missing `autocomplete` on personal-data fields is **Serious** — it directly
impacts users with motor disabilities and cognitive conditions who rely on
autofill to avoid retyping. The label, `name`, `type`, and autocomplete token
should describe the same purpose.

```html
<input type="text"     id="name"         autocomplete="name">
<input type="email"    id="email"        autocomplete="email">
<input type="tel"      id="phone"        autocomplete="tel">
<textarea id="street"  autocomplete="street-address"></textarea>
<input type="text"     id="city"         autocomplete="address-level2">
<input type="text"     id="postal"       autocomplete="postal-code">
```

Test autofill without assuming `autocomplete="off"` will or should disable
password managers and browser assistance. Full token list:
[WCAG 1.3.5 Input Purposes](https://www.w3.org/TR/WCAG21/#input-purposes).

---

## Serious: Buttons and Submission Controls

* Every button must have a clear name describing its result; always specify
  `type` (a `<button>` inside a form defaults to `submit`)
* Distinguish primary submission from secondary actions; avoid vague labels
  like "Go" or "Continue" when a more specific label is practical
* Do not permanently disable the submit button merely because the form is
  incomplete — users must be able to discover validation errors and recover
* Prevent duplicate submissions without removing status information or
  trapping focus

---

## Serious: Async & Status Feedback

* Use `aria-live="polite"` / `role="status"` for routine progress and
  successful completion; reserve assertive announcements for urgent
  information that cannot wait
* Keep visible status text available long enough to read
* If submission navigates to a new page, provide a descriptive page title and
  heading there
* Do not announce every keystroke, character-count change, or validation
  state unless necessary at that moment

**Silent async failures are Serious** — screen reader users have no indication
the action completed or failed.

---

## Serious: 3.3.4 Error Prevention — Legal, Financial, Data

For forms that create legal commitments, financial transactions, test
responses, or changes to user-controlled data, provide at least one:

* **Reversible** — the submission can be undone
* **Checked** — data is checked for errors and the user can correct them
* **Confirmed** — the user can review, confirm, and correct before final submission

```html
<h2>Review your order</h2>
<dl>
  <dt>Plan</dt><dd>Annual plan</dd>
  <dt>Amount</dt><dd>$120.00</dd>
</dl>
<a href="/cart">Edit order</a>
<button type="submit">Confirm and pay $120.00</button>
```

**Absent error prevention on financial/legal forms is Serious**; it may become
**Critical** in regulated contexts (financial services, legal agreements,
medical data) where the error cannot be undone.

---

## Serious: Redundant Entry (WCAG 3.3.7)

Do not clear valid information after a validation error. Within the same
multi-step process, information previously entered or supplied must be
auto-populated or available for selection unless re-entry is essential,
required for security, or no longer valid. Examples: "Billing address is the
same as shipping address" option; carry an account identifier into later
steps; preserve a search query on the results page. Protect personal
information while preserving it — 3.3.7 does not require storing information
between separate sessions.

---

## Moderate: Instructions

Provide concise instructions before complex input groups, associated via
`aria-describedby`. This is **Moderate** — most users can infer requirements,
but users with cognitive disabilities benefit from upfront guidance.

* Place instructions before the input, not after
* State format, units, accepted file types, limits, and case sensitivity when relevant
* Do not hide essential instructions in placeholder text or a tooltip
* Do not require users to infer a format from an example alone
* Ensure instructions remain available while entering and reviewing information

---

## Moderate: Time Limits and Session Timeout

Avoid time limits unless essential (WCAG 2.2.1). For an inactivity timeout
using warn-and-extend:

* Warn before expiry; give at least 20 seconds to extend via a simple action;
  permit extension at least ten times
* Explain whether data will be lost; announce and display the warning
* Move focus into a correctly implemented modal dialog; return focus to the
  previous location after it closes

```html
<dialog id="timeout-dialog" aria-labelledby="timeout-title">
  <h2 id="timeout-title">Your session will expire in 2 minutes</h2>
  <p>Your unsaved information will be lost.</p>
  <button type="button" id="extend-session">Stay signed in</button>
  <button type="button" id="sign-out">Sign out</button>
</dialog>
```

Open a native `<dialog>` with `showModal()` where supported — `aria-modal`
alone does not create modal behaviour, manage focus, make the rest of the page
inert, or provide Escape handling. Session timeout is **Moderate** for
informational forms; **Critical** for transactional or legal submissions where
data loss cannot be recovered.

---

## Moderate: Validation Timing

* Validate on submit at minimum
* Inline validation on blur (field exit) is acceptable when clearly scoped to
  the field just left — do not validate fields the user has not yet visited
* Avoid disruptive real-time validation while the user is actively typing

---

## Moderate: Visual Layout and Interaction

* Meet text and non-text contrast for controls, borders, instructions,
  placeholders, errors, focus indicators, and disabled states
* Do not use colour alone for required, invalid, selected, success, or warning states
* Provide visible focus indicators; reflow without horizontal scrolling at 320px
* Support text-spacing overrides without clipping/overlap
* Provide adequate target sizes and spacing for touch/pointer input
* Do not obscure focused fields with sticky headers, virtual keyboards, or
  validation overlays
* Do not change context merely because a control receives focus or a value
  changes, unless users were advised of that behaviour

---

## Testing Expectations

* **Keyboard:** complete and submit using only the keyboard; operate every
  custom widget per its documented pattern; confirm focus order is logical;
  trigger errors and follow every error-summary link; confirm modal warnings
  contain focus and return it; test copy/paste/undo/redo/password-manager entry
* **Screen readers / speech input:** confirm each control's name, role, state,
  value, hint, and error are understandable; required/invalid states are
  announced; grouped controls include their shared question; status updates
  announced once and remain visible; visible labels included in accessible names
* **Magnification/reflow/touch:** 200%/400% zoom; 320px viewport; text-spacing
  overrides; touch targets and on-screen keyboard; browser autofill
* **Validation/recovery:** submit empty and partially/fully invalid forms;
  correct errors out of summary order; confirm valid values are preserved;
  test server-side errors, network errors, expired sessions, duplicate submissions
* **Authentication:** complete login with autofill/password manager; paste a
  complete password and one-time code; test every MFA/recovery path; confirm
  previously entered info is preserved in later steps

**Automated checks** can catch missing names, invalid ARIA, contrast failures,
and some state problems, but cannot determine whether instructions are
understandable, errors are useful, or the complete process is usable. Include
HTML validation, accessibility-tree/accessible-name assertions, axe-core,
keyboard interaction tests for custom widgets, focus-placement tests, and
paste tests for authentication fields. Test server-rendered errors as well as
client-side validation.

---

## Definition of Done Checklist

* [ ] All controls have programmatically associated `<label>`
* [ ] No placeholder-only labels
* [ ] `required` used on native inputs; `aria-required` not added redundantly
* [ ] Required state communicated in text (not colour alone)
* [ ] `<fieldset>`/`<legend>` used for grouped controls
* [ ] Appropriate `autocomplete` values on personal-data fields
* [ ] Paste and standard keyboard actions not blocked
* [ ] `<select multiple>` replaced with checkboxes where feasible
* [ ] `type="number"` used only where math/stepper semantics apply
* [ ] Date inputs tested with target AT matrix
* [ ] `<datalist>` usage tested with AT; constrained inputs use APG Combobox pattern
* [ ] `aria-invalid` set on invalid fields; removed when corrected
* [ ] Error messages are specific, actionable, and associated via `aria-describedby`
* [ ] Error summary present and receives focus on failed submit
* [ ] Async success/failure announced to screen readers
* [ ] Legal/financial/data-change forms have check/correct/confirm step (3.3.4)
* [ ] Multi-step forms avoid redundant entry (3.3.7)
* [ ] Authentication supports paste, password managers, and avoids cognitive puzzles (3.3.8)
* [ ] Session timeout warned before expiry with accessible native `<dialog>`
* [ ] No colour-only indication of any state
* [ ] Keyboard and screen reader walkthrough passes

---

## Key WCAG Criteria

* 1.3.1 Info and Relationships (A)
* 1.3.5 Identify Input Purpose (AA) — **Serious if absent on personal-data fields**
* 2.2.1 Timing Adjustable (A)
* 3.3.1 Error Identification (A) — **Critical if absent**
* 3.3.2 Labels or Instructions (A) — **Critical if absent**
* 3.3.3 Error Suggestion (AA)
* 3.3.4 Error Prevention — legal, financial, data (AA) — **Serious if absent**
* 3.3.7 Redundant Entry (A)
* 3.3.8 Accessible Authentication Minimum (AA)

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/FORMS_ACCESSIBILITY_BEST_PRACTICES.md)
* [WAI Forms Tutorial](https://www.w3.org/WAI/tutorials/forms/)
* [WAI-ARIA APG — Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
* [WAI-ARIA APG — Date Picker Dialog example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
* [WCAG 1.3.5 Input Purposes — full autocomplete token list](https://www.w3.org/TR/WCAG21/#input-purposes)
* [Understanding 3.3.4 Error Prevention](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html)
* [Understanding 3.3.7 Redundant Entry](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html)
* [Understanding 3.3.8 Accessible Authentication](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html)

> **Standards horizon:** These rules target WCAG 2.2 AA. WCAG 3.0 is in
> development; its proposed APCA contrast model may affect error-state colour
> choices but core labelling, grouping, and error requirements are expected to
> carry forward.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
