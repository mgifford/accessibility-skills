---
name: svg
description: >
  Load this skill whenever the project contains SVG graphics — inline SVGs,
  external SVG files, SVG icons, SVG illustrations, or SVG-based data
  visualizations. Under no circumstances use SVG without proper accessible
  titles, descriptions, and ARIA roles where required. Absolutely always
  add <title> and <desc> to meaningful SVGs and set role="img" with
  aria-labelledby pointing to those elements. Also apply this skill whenever
  the project accepts untrusted or user-uploaded SVG content, which requires
  sanitization before rendering.
---

# SVG Accessibility Skill

> **Canonical source**: `examples/SVG_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when creating, optimising, or reviewing SVG graphics.
**Only load this skill if the project contains SVGs.**

---

## Core Mandate

SVG accessibility depends on the graphic's purpose and how it is embedded. A
decorative icon, an informative image, an icon inside a button, and an
interactive diagram require different patterns. Start by deciding what users
need from the graphic, then provide the simplest semantic implementation that
delivers the same information or function. The presence of `<title>`,
`<desc>`, `role="img"`, or `aria-label` does not by itself make an SVG
accessible — test the result in its final context.

SVG is also an active XML format that can contain scripts, event handlers,
and external resource references. **Untrusted SVG (uploads, pasted markup,
AI-generated output) must be sanitized before rendering** — see the Security
section below.

---

## Severity Scale (this skill)

| Level | Meaning |
| --- | --- |
| **Critical** | SVG conveys essential information with no accessible alternative; untrusted SVG rendered without sanitization |
| **Serious** | SVG is interactive but unreachable or unlabelled for AT users |
| **Moderate** | AT experience degraded but content still partially accessible |
| **Minor** | Best-practice gap; marginal impact |

---

## Choose the Pattern by Purpose and Context

| Context | Preferred pattern |
|:---|:---|
| Decorative SVG loaded with `<img>` | `<img src="…" alt="">` |
| Meaningful SVG loaded with `<img>` | `<img src="…" alt="Useful description">` |
| Decorative inline SVG | `<svg aria-hidden="true">…</svg>` |
| Simple meaningful inline SVG | `<svg role="img" aria-labelledby="…"><title>…</title></svg>` |
| Icon inside a named button or link | Name the HTML control and hide the SVG |
| Complex graphic | Short name plus visible summary, data, or detailed description |
| Reused sprite icon | Label or hide each outer `<svg>` instance, not the shared symbol |
| Interactive graphic | Prefer native HTML controls; provide an equivalent structured alternative |

Use native HTML semantics before ARIA. Do not add `role="img"` to an `<img>`
merely because its source is an SVG file — that's redundant.

---

## Critical: Decorative SVGs Must Be Hidden Completely from AT

```html
<svg aria-hidden="true" focusable="false">
  <!-- decorative icon — no title, no desc, no role needed -->
</svg>
```

`aria-hidden="true"` removes the SVG and its descendants from the
accessibility tree — do not place focusable or interactive content inside an
element hidden this way. `focusable="false"` addresses legacy IE/older Edge
behavior; it can remain for projects still supporting those browsers but
isn't a universal modern requirement. Do not add `<title>`/`<desc>` to an
intentionally-hidden SVG. **Never use `role="presentation"` as a substitute**
for `aria-hidden="true"` — it does not reliably suppress announcement across
browser/screen-reader combinations.

**When is an SVG decorative?** If the same meaning is conveyed by adjacent
visible text, or the image is purely ornamental, it's decorative. If removing
it would leave a user without needed information, it's meaningful.

---

## External SVG Used with `<img>`

Follows the same text-alternative rules as other image formats.

```html
<!-- Informative -->
<img src="/assets/images/service-area.svg" alt="Map showing the service area extending from Kingston to Ottawa" width="640" height="360">

<!-- Decorative -->
<img src="/assets/images/flourish.svg" alt="" width="120" height="24">

<!-- Functional (destination-describing) -->
<a href="/reports/annual-report.pdf">
  <img src="/assets/icons/download.svg" alt="Download annual report">
</a>
```

`role="img"` is redundant on `<img>`; `aria-label` unnecessary when `alt` can
provide the name. **Internal SVG `<title>`/`<desc>` does not replace HTML
`alt`** when loaded through `<img>` — the HTML alt is what's read.

---

## Serious: Simple Meaningful Inline SVG

```html
<svg role="img" aria-labelledby="download-icon-title" viewBox="0 0 24 24">
  <title id="download-icon-title">Download</title>
  <path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14"></path>
</svg>
```

The `<title>` must be a direct child of `<svg>` with a unique ID, referenced
via `aria-labelledby`. A plain `aria-label` is a reasonable alternative when
managing a unique title ID adds needless complexity:

```html
<svg role="img" aria-label="Download" viewBox="0 0 24 24">…</svg>
```

**Do not use both patterns** without a specific tested reason — ARIA labelling
attributes take priority over `<title>` in the accessible-name calculation
(`aria-labelledby` > `aria-label` > direct child `<title>`). Note: some
browsers show `<title>` as a pointer tooltip — that is not a substitute for
visible text or a real accessible tooltip; it may not be discoverable by
keyboard, touch, or speech-input users.

---

## Serious: Icons Inside Buttons and Links

The HTML control should own the accessible name — hide the SVG icon.

```html
<!-- Visible text -->
<button type="button">
  <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6 18 18M18 6 6 18"></path></svg>
  Close
</button>

<!-- Icon-only -->
<button type="button" aria-label="Close dialog">
  <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6 18 18M18 6 6 18"></path></svg>
</button>
```

**Do not give both the button and its hidden icon separate versions of the
same name** — that produces duplicate or inconsistent announcements. Prefer a
visible label when the action may not be obvious — a familiar-looking icon
can mean different things across products.

For an external SVG asset loaded via `<img>` inside an already-labelled
button (e.g., a theme selector), use `alt=""` since the button supplies the
name — note that an external `<img>`-loaded SVG does not inherit
`currentColor` from the surrounding button; validate the asset's own colors
on every background it appears on, or inline the paths if it must follow a manual theme.

---

## Serious: Accessible Names and Descriptions — Correct ARIA Relationship

SVG accessible-name priority: `aria-labelledby` > `aria-label` > direct child
`<title>` > other fallbacks. Descriptions: `aria-describedby` > direct child `<desc>`.

```html
<svg role="img" aria-labelledby="weather-title" aria-describedby="weather-desc" viewBox="0 0 320 180">
  <title id="weather-title">Weekly temperature trend</title>
  <desc id="weather-desc">Temperatures rise from 12 degrees Monday to 21 degrees Friday.</desc>
</svg>
```

Keep IDs unique in the whole HTML document — a repeated component with fixed
SVG IDs can cause one instance to be labelled by another. **Do not put both
title and description IDs in `aria-labelledby`** — that concatenates both
strings into the accessible *name*; use `aria-labelledby` for the name and
`aria-describedby` for the description separately. **Do not bury essential
information in `<desc>`** — support for navigating long SVG descriptions
varies across AT; put essential details in visible HTML instead.

---

## Moderate: Complex Graphics, Diagrams, and Charts

A complex SVG needs more than one long accessible name: a concise name, a
visible summary of the purpose/conclusion, complete data in structured HTML
when needed, and keyboard-operable controls if interactive.

```html
<figure>
  <svg role="img" aria-labelledby="visitors-title" aria-describedby="visitors-summary" viewBox="0 0 640 360">
    <title id="visitors-title">Website visitors from January to March</title>
  </svg>
  <figcaption id="visitors-summary">
    Visitors increased each month, from 12,400 in January to 19,200 in March.
  </figcaption>
  <details>
    <summary>View the chart data</summary>
    <table>
      <caption>Monthly website visitors</caption>
      <thead><tr><th scope="col">Month</th><th scope="col">Visitors</th></tr></thead>
      <tbody><tr><th scope="row">January</th><td>12,400</td></tr></tbody>
    </table>
  </details>
</figure>
```

Do not duplicate a detailed table into `aria-label`/`<title>`/`<desc>` — long
image-name strings are hard to navigate. The ARIA Graphics Module defines
structured roles (`graphics-document`, `graphics-object`, `graphics-symbol`)
but support must be tested with actual AT combinations; these don't remove
the need for an equivalent text presentation. See `skills/charts-graphs/SKILL.md`
for chart-specific requirements.

---

## Reused Icons and SVG Sprites

```html
<svg aria-hidden="true" hidden>
  <symbol id="icon-download" viewBox="0 0 24 24">
    <path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14"></path>
  </symbol>
</svg>
<button type="button">
  <svg aria-hidden="true" viewBox="0 0 24 24"><use href="#icon-download"></use></svg>
  Download report
</button>
```

Names inside a shared symbol are rarely appropriate for every instance —
"Arrow" could mean Next, Previous, Expand, or Collapse depending on context.
Name the control or the outer rendered instance, not the shared symbol. An
external `<use>` target must reference a real distinct element (usually a
`<symbol>` with an ID) — **do not create recursive self-references**.

---

## Moderate: Colour, Contrast, and Themes

```css
.icon {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 2;
}
```

`currentColor` is useful, not mandatory — multi-colour graphics may need
several semantic tokens; validate every meaningful pairing in every theme. Do
not rely on colour alone — add text labels, patterns, line styles, or shapes
for statuses/series/selected states. Text inside SVG is subject to text
contrast requirements; required graphical information generally needs 3:1;
decorative details don't need 3:1 merely for appearing in a meaningful graphic.

```css
@media (forced-colors: active) {
  .icon { color: ButtonText; }
  .chart-line { fill: none; stroke: CanvasText; }
  .chart-line[data-selected="true"] { stroke: Highlight; stroke-width: 4; }
}
```

Do not set both `fill` and `stroke` on every path indiscriminately — it can
turn line artwork into solid shapes. Avoid `forced-color-adjust: none` unless
essential and tested against multiple system palettes.

---

## Text Inside SVG

Keep essential labels visible and legible; meet text contrast requirements.
**Do not convert essential labels to paths** merely to preserve a typeface,
and do not use `font-size="0"`, off-canvas positioning, or transparent SVG
text as a substitute for a real text alternative. Provide important
explanations in HTML. Test resizing/zoom — SVG labels can overlap or clip
even when the outer SVG scales. `<foreignObject>` can embed HTML in SVG but
adds rendering/fallback complexity — use ordinary HTML outside the SVG when it
can provide the same result.

---

## Critical: Interactive SVG

Prefer native HTML buttons, links, and disclosures placed near the graphic
over interaction inside the SVG itself:

```html
<div class="map">
  <svg aria-hidden="true" viewBox="0 0 640 360"><!-- Visual map --></svg>
  <ul class="map-locations">
    <li><a href="/locations/ottawa">Ottawa service centre</a></li>
  </ul>
</div>
```

If interaction must occur within the SVG: use SVG `<a href="…">` for genuine
navigation; provide a purpose-describing accessible name; preserve logical
DOM/focus order; support expected keyboard activation; show a visible,
unclipped focus indicator; meet target-size requirements; expose selected/
expanded/pressed states; ensure the accessible name contains the visible
label for speech input; provide an equivalent HTML list/table when the visual
layout can't be navigated non-visually. **Do not put every data point in the
tab order** — hundreds of focus stops make a visualization technically
reachable but practically unusable. **Do not create a "button" by adding only
`tabindex="0"` and a click listener to `<path>`/`<g>`** — that provides no
native button semantics or keyboard behaviour. An interactive SVG unreachable
by keyboard is **Critical**.

---

## Serious: Motion, Animation, and Flashing

```css
.loading-icon { transform-origin: center; }
@media (prefers-reduced-motion: no-preference) {
  .loading-icon { animation: spin 1s linear infinite; }
}
```

**Do not use a blanket `svg *` rule to reduce motion** — it can affect
unrelated components and override meaningful states. Target the specific
animated component and define an understandable static state:

```css
@media (prefers-reduced-motion: reduce) {
  .diagram-panel { animation: none; transition: none; }
}
```

For `<animate>`/`<animateTransform>`, use `begin="indefinite"` and only
trigger via `beginElement()` when `prefers-reduced-motion: no-preference` is confirmed.

**Rapid SVG animation is Critical** if it flashes at 3+ Hz (WCAG 2.3.1) —
this is not replaced by respecting reduced-motion preference; the flash
threshold applies regardless. WCAG 2.2.2 requires pause/stop/hide controls
for moving/blinking/auto-updating content lasting 5+ seconds and not
essential. WCAG 2.3.3 (Animation from Interactions, AAA) requires users be
able to disable non-essential interaction-triggered motion — respecting
`prefers-reduced-motion` is an effective approach even at AA.

---

## Responsive SVG and Zoom

Preserve `viewBox` so the graphic scales without cropping its internal
coordinate system — its removal during optimization is not just Minor, it
will break fluid layouts.

```css
.responsive-diagram { display: block; max-inline-size: 100%; block-size: auto; }
```

Test at 200%/400% zoom and narrow viewports — a scalable canvas doesn't
guarantee labels reflow or stay readable. For dense diagrams, consider a
simplified small-screen view plus an adjacent HTML explanation. Never
disable page zoom to compensate for an inflexible SVG layout.

---

## Standalone SVG Documents

An SVG opened directly in a browser is a document, not an `<img>` — include
namespace, language, and an accessible name:

```xml
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="diagram-title"
     viewBox="0 0 800 450" lang="en" xml:lang="en">
  <title id="diagram-title">Request approval workflow</title>
</svg>
```

If the standalone file is complex, link to an equivalent HTML description
near where users open it.

---

## Critical: Security, Sanitization, and Build Processing

SVG is an active XML format that can contain scripts, event handlers, links,
external resources, CSS, animation, filters, and embedded HTML via
`<foreignObject>`. **A file that looks like an image must not automatically
be treated as inert content.** Accessibility metadata must survive
processing, but never at the cost of weakening the security boundary — apply
security and accessibility checks to the same final artifact.

**Classify the SVG's trust level before processing:**

| Source | Required treatment |
|:---|:---|
| Author-controlled (reviewed icons in the repo) | Review changes, restrict build tooling, validate final output |
| Generated from a controlled source (Mermaid/chart renderer) | Treat renderer + config as dependencies; validate generated SVG |
| Platform-generated (hosted diagram service) | Record platform/renderer version; verify hosted result |
| **Untrusted** (uploads, pasted markup, user-edited, remote files, AI-generated) | **Enforce input limits, parse securely, sanitize with an SVG-aware allowlist, validate before display or export** |

Inline SVG, `<object>`, `<embed>`, and standalone documents have broader
capabilities than `<img>` and need greater scrutiny — an SVG safe for `<img>`
today may be downloaded, opened directly, or embedded inline by someone else
later. There is no single accessibility treatment across all embedding
contexts.

**Sanitize untrusted SVG** with a maintained, SVG-aware sanitizer/allowlist
(e.g., DOMPurify with a reviewed SVG profile) — a generic HTML allowlist may
remove essential SVG features or permit unneeded ones. **Do not:**

* insert untrusted SVG using `innerHTML` before sanitization
* treat well-formed XML as safe SVG
* treat `DOMParser`, `XMLSerializer`, a formatter, or SVGO as a sanitizer
* use regular expressions as an SVG sanitizer
* assume a filename, MIME type, or successful image preview proves safety
* modify sanitized markup with untrusted strings afterward

Sanitization should remove/reject: `<script>` and event-handler attributes
(`onclick`); `javascript:` and other unapproved URL schemes; unexpected
external `href`/`xlink:href`; external resources in CSS/`@import`/`url()`;
`<foreignObject>`/embedded HTML unless explicitly required; unapproved
animation/interactive elements; processing instructions, DTDs, external
entities. Same-document `#fragment` references (`<use href="#icon">`,
`marker-end="url(#arrowhead)"`) are commonly needed and safe to allow — but
validate every permitted fragment resolves to an allowed element in the same
sanitized document; allowing fragments does not imply allowing arbitrary
external URLs.

**Parse XML securely** when processed server-side: disable DTD processing
and external entity resolution; prevent network/local-file access from the
parser; avoid XSLT/XInclude unless explicitly required and secured; set
input/nesting/entity limits; fail closed on parse/sanitization failure.

**Limit resource consumption** — SVG can exhaust CPU/memory without executing
a script: cap input/decompressed size, element/attribute counts, path
complexity, `<use>` nesting depth, filter complexity, embedded data-URL size,
and rendered dimensions. Reject recursive references and content exceeding policy.

**Preserve accessibility during optimization** — configure the build to keep
`viewBox`; `<title>`/`<desc>` when used; `role`/`aria-*`/language attributes;
IDs referenced by ARIA, `<use>`, clip-paths, masks, filters, gradients;
semantic `<text>`; focus/theme/forced-colors/reduced-motion styles; public
sprite symbol IDs. Generate unique IDs for repeated inline components — an
optimizer that collapses every copy to the same ID breaks both rendering and
accessible names. Lock the optimizer version and test configuration changes
against representative fixtures; use separate edit-safe vs. production
optimization profiles.

**Recommended processing sequence:** (1) apply input/resource limits, (2)
parse with secure XML settings, (3) sanitize untrusted input with the
approved profile, (4) apply only controlled transformations, (5) optimize
with a reviewed versioned config, (6) validate the final SVG for both
security and accessibility, (7) insert/serve/export only the validated
result. If any later step can introduce untrusted markup, sanitize again
after that step.

A restrictive CSP reduces the effect of some unsafe SVG features but does not
replace parsing, sanitization, resource limits, or output validation — use it
as defence in depth, not a substitute.

---

## What Is NOT Required

* A `<desc>` for every SVG — `<title>` + `aria-labelledby` suffices when a
  name alone fully conveys meaning
* Focus styling inside non-interactive SVGs
* A `forced-colors` block when the SVG remains perceivable without it
* `role="img"` on decorative SVGs — use `aria-hidden="true"` instead

---

## Testing

* **Code review:** classify each SVG as decorative/informative/functional/
  complex/interactive; confirm embedding pattern matches; inspect name/
  description relationships; search repeated inline components for duplicate
  IDs; confirm build optimization preserves required attributes; classify the
  source's trust level and identify all embedding contexts it can be used in;
  review sanitizer/parser/optimizer/renderer config changes; confirm final
  output validation covers both security and accessibility
* **Browser/AT:** inspect the accessibility tree for expected role/name/
  description; confirm decorative icons are silent and named graphics
  announced once; navigate all SVG controls by keyboard only; test speech-
  input names against visible labels; 200%/400% zoom and narrow viewports;
  every supported theme; `prefers-reduced-motion`/`prefers-contrast`/forced
  colors; colour-independent meaning; test with images unavailable when the
  SVG is essential
* **Security/processing:** maintain valid AND adversarial fixtures; test the
  complete pipeline, not just the sanitizer in isolation — script/event
  handlers rejected; unsafe URL schemes rejected; unexpected external
  resources blocked; DTDs/external entities rejected without resolving;
  unapproved `<foreignObject>` rejected; recursive/excessive `<use>` rejected;
  oversized/complex input rejected; permitted same-document references still
  render; repeated inline instances keep unique IDs; optimized output still
  passes security rules and matches the accessible alternative. Run these
  whenever the sanitizer/parser/optimizer/renderer/allowlist/dependency
  version changes.

**Automated tools** can detect missing `<img alt>`, some accessible-name
problems, duplicate IDs, contrast failures, and certain ARIA errors — cannot
decide whether an alternative is equivalent, whether a graphic is truly
decorative, or whether an interactive visualization is usable. No automated
pass replaces manual SVG review.

---

## Common Failures

| Failure | Correction |
|:---|:---|
| `<img src="graphic.svg">` has no `alt` | Add context-appropriate `alt`, including `alt=""` for decoration |
| `role="img"` added to every HTML `<img>` | Use native `<img>` semantics and `alt` |
| Both title and description IDs put in `aria-labelledby` | Use `aria-labelledby` for name, `aria-describedby` for description |
| A long table placed in `<desc>` | Provide essential detail as visible, structured HTML |
| Repeated inline icons contain identical title IDs | Generate a unique ID per instance, or use direct `aria-label` |
| A sprite symbol references itself | Put real paths in the symbol; reference only from rendered instances |
| Forced-colours CSS sets both fill and stroke on every path | Apply targeted system colours without changing geometry |
| A clickable `<path>` has only a click handler | Use a native HTML control or implement complete keyboard semantics |
| Reduced motion implemented with `svg *` and `!important` | Target each animated component; define a meaningful static state |
| Well-formed XML treated as sanitized SVG | Parse securely and apply an SVG-aware allowlist sanitizer |
| A regex removes `<script>` and is called a sanitizer | Use a maintained SVG-aware sanitizer with a documented policy |
| Sanitized SVG later modified with untrusted strings | Keep later transforms controlled, or sanitize again before final validation |
| CSP treated as a replacement for sanitization | Use CSP only as an additional layer |
| An optimizer update accepted because the SVG "still looks correct" | Lock and test the optimizer; verify semantics, references, and alternatives |

---

## Definition of Done Checklist

* [ ] Every SVG classified by purpose (decorative/informative/functional/complex/interactive) and embedding context
* [ ] Decorative SVGs: `aria-hidden="true" focusable="false"`, no `<title>`, no `<desc>`
* [ ] Meaningful `<img>` SVGs have useful `alt`; decorative external images use `alt=""`
* [ ] Meaningful inline SVGs: `role="img"` + `<title>` + `aria-labelledby` (or `aria-label`)
* [ ] Complex SVGs: name + visible summary + structured HTML detail
* [ ] Icons inside named controls don't duplicate the control's accessible name
* [ ] Names/descriptions use the correct ARIA relationship (labelledby ≠ describedby)
* [ ] All referenced IDs preserved through optimisation; unique across repeated instances
* [ ] `currentColor` used where appropriate; non-text elements meet 3:1 contrast
* [ ] `viewBox` present and preserved
* [ ] Animated SVGs run only under `prefers-reduced-motion: no-preference`; no flashing at 3+ Hz regardless of preference
* [ ] Interactive SVGs keyboard operable with visible focus; prefer native wrapper elements
* [ ] **Untrusted SVG sanitized with an SVG-aware allowlist before any `innerHTML` insertion**
* [ ] **Scripts, event handlers, unsafe URL schemes, external resources, DTDs/entities rejected**
* [ ] **Resource limits applied (size, element count, `<use>` depth, filter complexity)**
* [ ] **Security and accessibility validation run after the last material transformation**
* [ ] Tested with screen reader on a supported OS/browser combination

---

## Key WCAG Criteria

* 1.1.1 Non-text Content (A) — **Critical if meaningful SVG has no text alternative**
* 1.3.1 Info and Relationships (A)
* 1.4.1 Use of Color (A)
* 1.4.3 Contrast Minimum (AA)
* 1.4.5 Images of Text (AA)
* 1.4.11 Non-text Contrast (AA)
* 2.1.1 Keyboard (A)
* 2.2.2 Pause, Stop, Hide (A)
* 2.3.1 Three Flashes or Below Threshold (A) — **Critical for flashing/strobing animations**
* 2.3.3 Animation from Interactions (AAA)
* 2.5.3 Label in Name (A)
* 2.5.8 Target Size Minimum (AA)
* 4.1.2 Name, Role, Value (A)

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/SVG_ACCESSIBILITY_BEST_PRACTICES.md)
* [SVG Accessibility API Mappings](https://www.w3.org/TR/svg-aam-1.0/)
* [WAI-ARIA Graphics Module](https://www.w3.org/TR/graphics-aria-1.0/)
* [DOMPurify](https://github.com/cure53/DOMPurify)
* [SVGO Documentation](https://svgo.dev/docs/)
* [OWASP XML External Entity Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html)
* [WCAG 2.2 Understanding 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
* [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

> **Standards horizon:** The 3:1 non-text contrast ratio may change under
> WCAG 3.0's APCA model. The current 3:1 requirement remains applicable.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
