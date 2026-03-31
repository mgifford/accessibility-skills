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

Users should be able to customize content presentation to meet their individual
needs without compromising information, functionality, or accessibility.
Personalization must complement — never replace — proper accessible design.

Note: `1.4.12 Text Spacing` (AA) is the primary WCAG criterion that personalization
controls address. This skill is the correct home for that criterion.

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

Third-party "accessibility overlay" widgets that claim to auto-fix accessibility
issues **must not** be used as a substitute for proper accessible design.
**Using an overlay as a compliance claim is Critical** — they:

* Cannot fix underlying structural issues (missing labels, incorrect ARIA, tab order)
* Actively interfere with users' own assistive technologies (screen readers,
  browser zoom, OS high contrast)
* Provide false compliance assurance that may expose the organisation to legal risk
* Are widely rejected by the disability community — see <https://overlayfactsheet.com/>

The only acceptable use of overlay-like technology is custom remediation for
legacy vendor-locked systems as a **temporary bridge**, with a documented plan
and timeline for proper implementation.

---

## Serious: Implement CSS Media Queries First

Respect user OS-level preferences before adding any custom controls.
**Ignoring `prefers-reduced-motion` is Serious**; ignoring `prefers-color-scheme`
is Moderate to Serious depending on contrast impact.

```css
/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-text: #e8e8e8;
    --color-background: #1a1a1a;
  }
}

/* High contrast */
@media (prefers-contrast: more) {
  :root {
    --color-text: #000000;
    --color-background: #ffffff;
    --border-width: 2px;
  }
}

/* Windows High Contrast / forced colors */
@media (forced-colors: active) {
  .custom-focus-indicator {
    forced-color-adjust: none;
    outline: 2px solid CanvasText;
  }
}

/* Reduced transparency — Safari only as of 2025; treat as enhancement */
@media (prefers-reduced-transparency: reduce) {
  .modal-overlay {
    opacity: 1;
    background-color: var(--color-background);
  }
}
```

---

## Moderate: Personalization Widgets — The Right Approach

Custom personalization controls (font size, spacing, theme) are acceptable when:

* They offer user preferences, not claimed accessibility fixes
* They do not override the user's own AT settings or OS preferences
* They are labelled as "Display preferences" or "Reading preferences", not "Accessibility"
* Preferences are persisted safely — see localStorage section below

### Font Size Controls

```html
<div role="group" aria-label="Text size">
  <button type="button" aria-label="Decrease text size"
          onclick="adjustFontSize(-1)">A−</button>
  <button type="button" aria-label="Reset text size"
          onclick="resetFontSize()">A</button>
  <button type="button" aria-label="Increase text size"
          onclick="adjustFontSize(1)">A+</button>
</div>
```

```js
function adjustFontSize(delta) {
  const current = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  const next = `${Math.max(12, Math.min(32, current + delta))}px`;
  document.documentElement.style.fontSize = next;
  setStoredPref('font-size', next);
  announceChange(`Text size set to ${next}`);
}
function resetFontSize() {
  document.documentElement.style.fontSize = '';
  removeStoredPref('font-size');
  announceChange('Text size reset to default');
}
```

### Spacing Controls

```js
const spacingOptions = { normal: '1.5', wide: '1.75', wider: '2' };
function setSpacing(level) {
  document.documentElement.style.setProperty(
    '--line-height', spacingOptions[level]
  );
  setStoredPref('spacing', level);
  announceChange(`Line spacing set to ${level}`);
}
```

---

## Moderate: Safe localStorage Helpers

`localStorage` is unavailable in private browsing, cross-origin iframes, and
storage-restricted environments. Always wrap in `try/catch`.

```js
function getStoredPref(key) {
  try { return localStorage.getItem(key); }
  catch { return null; }
}
function setStoredPref(key, value) {
  try { localStorage.setItem(key, value); }
  catch { /* Preference will not persist — widget still works in session */ }
}
function removeStoredPref(key) {
  try { localStorage.removeItem(key); }
  catch { /* Silent */ }
}

/* Restore preferences on load */
window.addEventListener('DOMContentLoaded', () => {
  const fontSize = getStoredPref('font-size');
  const spacing  = getStoredPref('spacing');
  if (fontSize) document.documentElement.style.fontSize = fontSize;
  if (spacing)  setSpacing(spacing);
});
```

---

## Moderate: Announce State Changes to Screen Readers

```html
<div aria-live="polite" aria-atomic="true"
     class="visually-hidden" id="pref-announcement">
  <!-- JS inserts e.g. "Text size increased to large" -->
</div>
```

```js
function announceChange(message) {
  const region = document.getElementById('pref-announcement');
  region.textContent = '';
  // Brief timeout ensures screen readers catch the content change
  setTimeout(() => { region.textContent = message; }, 50);
}
```

---

## Minor: `prefers-reduced-data`

An emerging CSS media query (`prefers-reduced-data`) allows sites to serve
lighter content for users on metered connections. Support is currently limited
(no major browser has shipped it as of 2025), but it is worth monitoring as
it directly relates to personalization and web sustainability.

```css
/* Future-facing — gate behind @supports or feature detection */
@media (prefers-reduced-data: reduce) {
  .decorative-hero-image { display: none; }
  video[autoplay] { display: none; }
}
```

---

## COGA Connection — Identify Purpose (1.3.6)

WCAG 1.3.6 Identify Purpose (Level AAA) is the criterion that enables
personalisation for cognitive accessibility — it requires that UI components,
icons, regions, and links expose their purpose in machine-readable form so
that user agents or assistive technologies can adapt the presentation (for
example, substituting symbols or stripping non-essential content for users
with cognitive disabilities). If your project targets AAA or has cognitive
accessibility goals, this skill and 1.3.6 should be considered together.

---

## Definition of Done Checklist

* [ ] No third-party accessibility overlay used as compliance substitute
* [ ] CSS media queries implemented: `prefers-reduced-motion`, `prefers-color-scheme`, `prefers-contrast`, `forced-colors`
* [ ] Any widget labelled as "preferences" or "display settings", not "accessibility"
* [ ] `localStorage` access wrapped in `try/catch` in all read/write operations
* [ ] Preferences restored safely on `DOMContentLoaded`
* [ ] State changes announced to screen readers via `aria-live="polite"`
* [ ] Personalization controls are keyboard accessible
* [ ] Personalization does not override user's own AT settings

---

## Key WCAG Criteria

* 1.4.3 Contrast Minimum (AA)
* 1.4.4 Resize Text (AA)
* 1.4.12 Text Spacing (AA) — **primary criterion this skill addresses**
* 1.3.6 Identify Purpose (AAA) — connects personalization to cognitive accessibility
* 2.3.3 Animation from Interactions (AAA) — context for `prefers-reduced-motion`

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/USER_PERSONALIZATION_ACCESSIBILITY_BEST_PRACTICES.md)
* [Overlay Fact Sheet](https://overlayfactsheet.com/en/)
* [WCAG 2.2 Understanding 1.4.12 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
* [WCAG 2.2 Understanding 1.3.6 Identify Purpose](https://www.w3.org/WAI/WCAG22/Understanding/identify-purpose.html)
* [MDN: prefers-reduced-data](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-data)

> **Standards horizon:** WCAG 3.0 is in development; personalization
> requirements are expected to expand, not contract.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
