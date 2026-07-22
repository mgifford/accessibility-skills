---
name: user-personalization
description: >
  Load this skill whenever the project has personalization features, user
  preference controls, theme selectors, font size adjusters, motion toggles,
  contrast settings, or any user-configurable accessibility accommodations.
  Under no circumstances override or ignore user OS-level accessibility
  preferences without explicit user consent. Absolutely always persist user
  preferences, apply them immediately, and respect prefers-reduced-motion,
  prefers-contrast, and similar media queries.
---

# User Personalization Accessibility Skill

> **Canonical source**: `examples/USER_PERSONALIZATION_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when implementing user preference controls or reviewing
existing personalization features.
**Only load this skill if the project has personalization features.**

---

## Core Mandate

Personalization is an enhancement to an accessible foundation — not a repair
layer and not a substitute for WCAG conformance. Start by respecting OS,
browser, and AT settings; add site-specific controls only when they provide a
meaningful choice users cannot reliably get from those existing tools. The
page must still satisfy browser zoom, text resizing, text-spacing overrides,
forced colors, and keyboard operation whether or not it offers a preference
editor.

**Preference precedence model:** (1) start with an accessible default; (2)
follow a recognized system/browser preference when the site setting is
"System"/"Default"; (3) let an explicit site choice override only the
corresponding presentation dimension; (4) let "Reset to defaults" remove site
overrides and resume following the system. Do not interpret a media-query
match as a diagnosis — people choose dark mode, reduced motion, or increased
contrast for many reasons.

---

## Severity Scale (this skill)

| Level | Meaning |
|---|---|
| **Critical** | Overlay used as compliance substitute; interferes with user's AT |
| **Serious** | OS-level preferences (reduced-motion, colour scheme) not respected |
| **Moderate** | Personalization widget not keyboard accessible; state not announced |
| **Minor** | Preferences not persisted; `prefers-reduced-data` not considered |

---

## Critical: Never Use Accessibility Overlays as a Compliance Substitute

Third-party "accessibility overlay" widgets that claim to auto-fix issues
**must not** be used as a compliance substitute. **Using an overlay as a
compliance claim is Critical** — they cannot fix underlying structural issues
(missing labels, incorrect ARIA, tab order), actively interfere with users'
own AT (screen readers, browser zoom, OS high contrast), provide false
compliance assurance, and are widely rejected by the disability community
(see <https://overlayfactsheet.com/>).

A preference editor is different from an overlay: it lets a user choose among
presentations the site has deliberately designed and tested. Personalization
must not: claim to make an otherwise inaccessible site conformant; rewrite
semantics generically at runtime; interfere with AT or user styles; conceal
unresolved defects; or replace remediation in source templates. Runtime
remediation for a locked legacy system can be a documented, tested, temporary
risk mitigation — not conformance, and not a reason to stop underlying
remediation work.

---

## Required Outcome: Separate WCAG Requirements From Enhancements

WCAG usually requires content to *adapt* to user settings — it does not
generally require a site to reproduce browser settings in a custom panel.

| Requirement | What authors must actually do |
|:---|:---|
| 1.4.4 Resize Text (AA) | Don't prevent user-agent resizing; content/controls stay usable at 200%. A site text-size control is one technique, not a universal requirement. |
| 1.4.12 Text Spacing (AA) | Allow user overrides of line/paragraph/letter/word spacing without loss of content or function — the site does not have to *provide* spacing controls |
| 1.4.10 Reflow (AA) | Preserve content/functionality at the required narrow width |
| Contrast / non-text contrast | Every author-provided theme or preset must independently meet the applicable criteria |
| Reduced motion | Respect `prefers-reduced-motion` where motion may create a barrier; a site control can add an additional override |
| Reading mode, font choice, density | Useful enhancements when research demonstrates need — not automatic WCAG requirements |

Do not claim that adding a preference panel makes inaccessible content conformant.

---

## Serious: Respect User Preference Media Features (Progressive Enhancement)

Unsupported queries are ignored, so the default presentation must remain
accessible without them.

### Color scheme

```css
:root {
  color-scheme: light dark;
  --page-background: #ffffff;
  --text-color: #1f2937;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --page-background: #111827;
    --text-color: #f3f4f6;
  }
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --page-background: #111827;
  --text-color: #f3f4f6;
}
```

Absence of `data-theme` means "System"; an explicit selection sets the
attribute. See `skills/light-dark-mode/SKILL.md` for the complete theme-selector pattern.

### Reduced motion

**Do not apply a universal rule forcing every animation/transition to
`0.01ms !important`** — that pattern can break state changes and scripted
event assumptions that rely on `transitionend`/`animationend` firing.
Instead, remove or replace specific non-essential motion:

```css
.panel { transition: translate 200ms ease-out, opacity 200ms ease-out; }

@media (prefers-reduced-motion: reduce) {
  :root:not([data-motion]) .panel { transition: none; }
  :root:not([data-motion]) { scroll-behavior: auto; }
}
:root[data-motion="reduce"] .panel { transition: none; }
```

If motion communicates essential state, replace it with an immediate state
change — don't remove the information.

### Contrast preferences

`prefers-contrast` can express `more`, `less`, or **`custom`** — do not treat
every match as a request for high contrast:

```css
@media (prefers-contrast: more) {
  :root { --border-width: 0.1875rem; --muted-text-color: currentColor; }
}
@media (prefers-contrast: less) {
  .decorative-texture { background-image: none; }
}
@media (prefers-contrast) {
  .decorative-gradient, .decorative-shadow { background-image: none; box-shadow: none; }
}
```

An unqualified `prefers-contrast` query is appropriate for reducing visual
complexity generally — it is not appropriate for imposing a specific
high-contrast palette, since the user may have requested *less* contrast or a custom palette.

### Reduced transparency and forced colors

```css
@media (prefers-reduced-transparency: reduce) {
  .dialog-backdrop { background: Canvas; opacity: 1; }
}
@media (forced-colors: active) {
  .button {
    color: ButtonText;
    background: ButtonFace;
    border: 0.125rem solid ButtonText;
  }
  .button:focus-visible { outline: 0.1875rem solid Highlight; }
}
```

Keep the default `forced-color-adjust: auto`; use `forced-color-adjust: none`
only for a narrowly scoped element with its own tested response — it is not
a general focus-indicator fix. Media Queries Level 5 remains a W3C Working
Draft — treat newer features as evolving, not a replacement for a tested
default.

---

## Moderate: Use an Accessible Preference Editor

Prefer an inline `<details>` disclosure when options are few — this avoids
modal focus-management requirements:

```html
<details class="display-preferences">
  <summary>Display preferences</summary>
  <form id="display-preferences-form">
    <fieldset>
      <legend>Color theme</legend>
      <label><input type="radio" name="theme" value="system" checked> System</label>
      <label><input type="radio" name="theme" value="light"> Light</label>
      <label><input type="radio" name="theme" value="dark"> Dark</label>
    </fieldset>
    <label for="text-size">Text size</label>
    <select id="text-size" name="textSize">
      <option value="default">Default</option>
      <option value="large">Large</option>
    </select>
    <button type="button" id="reset-display-preferences">Reset to defaults</button>
    <p id="display-preferences-status" role="status"></p>
  </form>
</details>
```

Native radio buttons and selects already expose selected values — don't add a
live-region announcement for every visual change unless testing shows it's
necessary; a concise status message when saved/reset/unsaved is enough. Label
the entry point by its purpose ("Display preferences", "Reading settings"),
not "Accessibility" — no single icon communicates every possible preference,
so keep a visible text label even if an icon is present.

If a modal is genuinely necessary, implement the complete pattern: accessible
name, initial focus, contained tab sequence, Escape dismissal, visible close
button, focus return to opener.

---

## Moderate: Apply Presentation With CSS Variables, Not Raw Stored Strings

```css
:root { --content-measure: 80ch; --reading-line-height: 1.5; }
:root[data-text-size="large"] { font-size: 125%; }
:root[data-reading-layout="comfortable"] { --content-measure: 70ch; --reading-line-height: 1.7; }
.reading-content { max-inline-size: var(--content-measure); }
```

Use relative sizing so browser zoom and user font settings keep working —
root percentages scale from the user's default rather than replacing it.
Avoid fixed-height text containers or clipping that fail when font/text
size/language/spacing changes.

---

## Serious: Validate, Apply, and Persist Values Safely

`localStorage` is unavailable in private browsing, cross-origin iframes, and
storage-restricted environments — always wrap access in `try/catch`.
**Validate every stored value against an allowlist before applying it** — do
not insert stored strings directly into CSS or class names.

```js
const preferenceKey = "site.displayPreferences.v1";
const defaults = Object.freeze({ theme: "system", textSize: "default", motion: "system" });
const allowedValues = Object.freeze({
  theme: ["system", "light", "dark"],
  textSize: ["default", "large", "x-large"],
  motion: ["system", "reduce"]
});

function sanitizePreferences(candidate = {}) {
  const source = candidate && typeof candidate === "object" && !Array.isArray(candidate) ? candidate : {};
  return Object.fromEntries(
    Object.entries(defaults).map(([name, defaultValue]) => {
      const value = source[name];
      return [name, allowedValues[name].includes(value) ? value : defaultValue];
    })
  );
}

function readPreferences() {
  try {
    const stored = localStorage.getItem(preferenceKey);
    return stored ? sanitizePreferences(JSON.parse(stored)) : { ...defaults };
  } catch {
    return { ...defaults };
  }
}

function setOptionalAttribute(name, value, defaultValue) {
  if (value === defaultValue) document.documentElement.removeAttribute(name);
  else document.documentElement.setAttribute(name, value);
}

function applyPreferences(preferences) {
  setOptionalAttribute("data-theme", preferences.theme, "system");
  setOptionalAttribute("data-text-size", preferences.textSize, "default");
  setOptionalAttribute("data-motion", preferences.motion, "system");
}
```

Version the storage key (`.v1`) and migrate or discard old data deliberately
when the schema changes — don't try to interpret obsolete values. Explain
persistence accurately: say "saved on this device," not "follows you
everywhere," unless account sync actually provides that. Handle storage
denial/corruption safely and always provide a working Reset.

---

## Serious: Persist Preferences Without Creating a Privacy Profile

Store only the values needed to reproduce the chosen presentation — never a
presumed diagnosis or disability. Do not send preference values to analytics
merely because they're available; do not expose preferences in public
profiles; make account sync intentional and transparent; protect synced
settings as account data; document retention/cookie use under the project's
privacy process. User-preference media features can contribute to browser
fingerprinting — prefer CSS responses over reading/transmitting values
through JavaScript when possible.

---

## Moderate: Reduce Motion and Distraction Without Removing Meaning

Reduced motion isn't the same as removing all visual change. Prefer:
immediate state changes instead of movement across the viewport; crossfades
where opacity alone isn't problematic; paused decorative animation; manual
controls for carousels; no smooth scrolling; stable control positioning. If
moving/blinking/scrolling/auto-updating content meets WCAG 2.2.2's
conditions, provide Pause/Stop/Hide or update-frequency control — don't hide
these controls inside the same motion-heavy component. A site-level "Reduce
motion" setting can supplement `prefers-reduced-motion`; "System" must keep
responding when the OS setting changes.

---

## Moderate: Font Choices and Reading Adaptation

Evidence does not support naming one font as universally best for dyslexia or
any disability — do not tell users which font they need based on a
disability; let them choose based on the result they can see. If offering a
font choice: describe neutrally (Sans serif/Serif/Monospace); ensure full
language/character coverage; provide robust fallbacks; preserve user-agent
minimum font-size settings; provide Default and Reset.

A reading layout may constrain line length, increase spacing, remove
decorative backgrounds, reduce density, or reorder primary vs. supplementary
content — but must never silently remove instructions, warnings, error
messages, or required task information. If a setting hides optional
material, tell users what's hidden and provide an immediate way to restore
it. W3C COGA guidance and WAI-Adapt are supplemental resources, not
additional WCAG 2.2 conformance requirements.

---

## Keep Every Theme and Preset Independently Accessible

Every author-provided theme must independently meet: text contrast; non-text
contrast; focus visibility/not-obscured; visited-link distinction; selected/
checked/expanded/current/error states; chart/icon legibility; forced-color
behavior; print output. Do not label a site preset "High contrast" unless
it's a defined, tested, complete theme — and don't imply it's equivalent to
the OS forced-colors mode. **"Higher contrast" is often the more accurate label.**

---

## Progressive Enhancement and Failure Handling

The unenhanced page must remain readable and operable: use CSS media queries
even when a site control is also present; use native HTML controls before
custom widgets; don't require third-party scripts for basic access; don't
block rendering on remote preference services; preserve system preferences
if storage fails; keep reset/recovery available after a partial failure.

---

## Minor: `prefers-reduced-data`

An emerging media query for serving lighter content on metered connections.
Support is currently limited — gate behind `@supports` or feature detection
and treat as forward-looking, not a current requirement.

```css
@media (prefers-reduced-data: reduce) {
  .decorative-hero-image { display: none; }
  video[autoplay] { display: none; }
}
```

---

## Testing

* **Default/failure states:** test before JS runs and with JS disabled; block
  local storage and confirm settings still apply for the current page; insert
  malformed/obsolete stored values and confirm they're ignored; test first
  visit, returning visit, Reset, sign-out; confirm storage/network failure
  doesn't block content
* **System preferences:** test light/dark schemes and changing scheme while
  the page is open (System mode should follow); test reduced motion before
  and after load; test `prefers-contrast` values (more/less/custom); test at
  least one light and one dark forced-color palette
* **Site controls:** operate every setting with keyboard, touch, pointer, and
  speech input; confirm labels/groups/values/focus/status with a screen
  reader; confirm applying a setting doesn't move focus or navigate
  unexpectedly; confirm Reset returns presentation and controls to defaults
* **Content/layout:** resize text to 200%; test 400% zoom and required narrow
  width; apply all four Text Spacing override values; confirm controls,
  tables, diagrams, and messages remain available
* **Combinations:** test individual settings first, then high-risk
  combinations (extra-large text + comfortable layout, dark theme + reduced
  motion, explicit theme + forced colors, 400% zoom with panel open, stored
  preferences after a schema update) — use pairwise/risk-based coverage, not
  exhaustive combination testing

**Automated checks** can verify some contrast, labels, states, storage
behavior, and target sizes — cannot determine whether a preference is
understandable, whether combinations create cognitive overload, or whether
an injected remediation conflicts with AT. Include people who use relevant
personalization/AT features in usability testing.

---

## Common Failures

| Failure | Correction |
|:---|:---|
| A preference widget is claimed to make the site WCAG conformant | Remediate the source; describe the widget only as optional personalization |
| WCAG 1.4.12 said to *require* spacing controls | Test that user overrides work without loss of content/functionality — the site need not provide the controls |
| A text-size button treated as a replacement for browser zoom | Keep zoom enabled and support text resizing independently |
| All animations/transitions forced to `0.01ms !important` | Remove or replace specific non-essential motion without breaking state changes |
| `prefers-contrast` assumed to always mean high contrast | Handle `more`, `less`, and `custom` accurately |
| `forced-color-adjust: none` applied to custom focus indicators | Let forced colors apply by default; use system colors where needed |
| A site "High contrast" theme treated as forced-color mode | Test as an author theme; label its effect accurately |
| Every page adds A+/A-, font, color, speech, and nav controls | Add only researched settings that can be maintained and tested |
| A settings icon is the only label | Use visible text: "Display preferences" |
| Stored values inserted directly into classes or CSS | Validate against a small allowlist before applying |
| Local storage assumed permanent and universal | Handle denial/clearing; describe device/browser scope accurately |
| Preference values used to infer disabilities or enrich analytics | Store the minimum presentation state only |
| A reading mode silently removes warnings or instructions | Preserve required content; disclose any hidden optional material |
| Only individual options are tested | Test high-risk combinations, reset, migration, and failure states |

---

## Definition of Done Checklist

* [ ] No third-party accessibility overlay used as a compliance substitute
* [ ] Base experience is accessible without the preference editor
* [ ] Browser zoom, text resizing, user styles, extensions, AT are not blocked
* [ ] CSS media queries implemented: `prefers-reduced-motion` (targeted, not
      blanket `0.01ms`), `prefers-color-scheme`, `prefers-contrast`
      (more/less/custom), `forced-colors`
* [ ] Any widget labelled "preferences"/"display settings", not "accessibility"
* [ ] Explicit site choices override only the corresponding setting; System/Default follows the OS
* [ ] `localStorage` access wrapped in `try/catch`; stored values validated against an allowlist
* [ ] Preferences restored safely on load; storage key versioned
* [ ] Reset clears site overrides and updates controls
* [ ] Personalization controls are keyboard accessible with native semantics
* [ ] Preference data is minimized and never used to infer disability
* [ ] Every theme/preset independently meets contrast and state requirements
* [ ] Individual settings and high-risk combinations manually tested

---

## Key WCAG Criteria

* 1.4.3 Contrast Minimum (AA)
* 1.4.4 Resize Text (AA)
* 1.4.10 Reflow (AA)
* 1.4.11 Non-text Contrast (AA)
* 1.4.12 Text Spacing (AA) — **primary criterion this skill addresses**
* 1.3.6 Identify Purpose (AAA) — connects personalization to cognitive accessibility
* 2.2.2 Pause, Stop, Hide (A)
* 2.3.3 Animation from Interactions (AAA)
* 2.4.11 Focus Not Obscured Minimum (AA)

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/USER_PERSONALIZATION_ACCESSIBILITY_BEST_PRACTICES.md)
* [Overlay Fact Sheet](https://overlayfactsheet.com/en/)
* [WCAG 2.2 Understanding 1.4.12 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
* [WCAG 2.2 Understanding 1.3.6 Identify Purpose](https://www.w3.org/WAI/WCAG22/Understanding/identify-purpose.html)
* [Making Content Usable for People with Cognitive and Learning Disabilities (COGA)](https://www.w3.org/TR/coga-usable/)
* [WAI-Adapt Explainer](https://www.w3.org/TR/adapt/) (emerging, not stable)
* [MDN: prefers-reduced-data](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-data)

> **Standards horizon:** WCAG 3.0 is in development; personalization
> requirements are expected to expand, not contract.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
