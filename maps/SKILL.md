# Maps Accessibility Skill

> **Canonical source**: `examples/MAPS_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when implementing or reviewing any static or interactive map.
**Only load this skill if the project contains maps.**

---

## Core Mandate

All users must access the essential information conveyed by a map through
accessible alternatives, keyboard-operable controls, and clear structured content.

---

## Severity Scale (this skill)

| Level | Meaning |
|---|---|
| **Critical** | Essential location data has no accessible alternative |
| **Serious** | Interactive map unreachable by keyboard; `role="application"` misused |
| **Moderate** | Skip link missing; colour independence gap; popup focus not managed |
| **Minor** | Missing `prefers-reduced-motion` for animations; legend incomplete |

---

## Critical: Text Alternatives for Static Maps

A meaningful map with no text alternative is **Critical** — blind users receive
no location information at all.

```html
<!-- Simple map -->
<img src="campus-map.png"
     alt="Campus map: main entrance on Elm Street,
          library to the north, parking to the east.">

<!-- Complex map with extended description -->
<figure>
  <img src="regional-map.png"
       alt="Regional accessibility map — detailed description below."
       aria-describedby="map-desc">
  <figcaption id="map-desc">
    <p>Three accessible transit routes through the downtown core.
    Route A runs north–south on Main Street with level boarding at all stops.
    Route B runs east–west on King Street. Route C is a loop serving the
    waterfront. All stops marked with a wheelchair symbol.</p>
  </figcaption>
</figure>
```

Always include: purpose, key features/routes, directional relationships,
meaning of colour coding or symbols.

---

## Serious: Skip Link Before Every Interactive Map

Every interactive map must be preceded by a skip link. Users who cannot or
do not wish to interact with the map must be able to bypass it.
**Missing skip link on an interactive map is Serious.**

```html
<a href="#map-skip-target" class="skip-link">Skip map</a>

<div id="map-container" aria-label="Interactive campus map">
  <!-- map renders here -->
</div>

<div id="map-skip-target" tabindex="-1">
  <h2>Map information as structured text</h2>
  <!-- table or list of locations -->
</div>
```

---

## Serious: Third-Party Map Embeds

Google Maps, Leaflet, and Mapbox iframes are the most common real-world case.
An `<iframe>` with no `title` is **Serious** — screen reader users cannot
identify what the frame contains.

```html
<!-- Always add a descriptive title to map iframes -->
<iframe
  src="https://maps.google.com/maps?q=…&output=embed"
  title="Interactive map showing our office location at 123 Main Street"
  width="600" height="450"
  loading="lazy">
</iframe>

<!-- Always provide a skip link before the iframe -->
<a href="#after-map" class="skip-link">Skip to location details</a>
<iframe …></iframe>
<div id="after-map">
  <p>Our office: 123 Main Street. <a href="https://maps.google.com/…">
  Open in Google Maps</a></p>
</div>
```

For Leaflet and Mapbox: these libraries render into a `<div>` with canvas/SVG.
Check the library's accessibility documentation for keyboard support options
before assuming the map is operable. Leaflet has basic keyboard support;
Mapbox GL JS requires additional configuration.

---

## Serious: Keyboard Controls

All mouse/touch map interactions must be keyboard-operable. **An interactive
map with no keyboard support is Serious.**

* Pan: arrow keys
* Zoom in/out: `+`/`-` keys or accessible buttons
* Marker activation: `Enter` or `Space` on focused marker
* Close popups: `Escape`

```html
<div role="group" aria-label="Map zoom controls">
  <button type="button" aria-label="Zoom in">+</button>
  <button type="button" aria-label="Zoom out">−</button>
  <button type="button" aria-label="Reset to default view">⟳</button>
</div>
```

---

## Serious: `role="application"` — Use with Extreme Caution

`role="application"` removes the screen reader's virtual cursor (reading mode),
meaning keyboard users lose the ability to navigate by headings, links, and
other landmarks within the map region. All keyboard interactions must then be
custom-implemented.

**Only use `role="application"` when:**
- Every user action within the region is fully keyboard-operable via custom handlers
- You have tested comprehensively with NVDA, JAWS, and VoiceOver
- There is a genuine interactive application — not just a static or embedded map

**Misusing `role="application"` is Serious** — it can strand screen reader users
with no way to interact with content they could previously navigate.

```html
<section aria-labelledby="map-heading">
  <h2 id="map-heading">Service Area Map</h2>
  <!-- Omit role="application" unless all interactions are fully custom-handled -->
  <div aria-label="Interactive service area map">
    <!-- map -->
  </div>
</section>
```

---

## Moderate: Accessible Markers & Popup Focus Management

```html
<!-- Marker as accessible button -->
<button type="button"
        aria-label="City Hall — open weekdays 9am to 5pm">
  <svg aria-hidden="true" focusable="false"><!-- pin icon --></svg>
</button>

<!-- Popup as dialog with focus management -->
<div role="dialog"
     aria-labelledby="popup-title"
     aria-modal="true"
     tabindex="-1"
     id="city-hall-popup">
  <h3 id="popup-title">City Hall</h3>
  <p>123 Main Street. Open Monday–Friday, 9am–5pm.</p>
  <a href="/city-hall">More information</a>
  <button type="button" aria-label="Close City Hall popup">✕</button>
</div>
```

Move focus into the popup on open. On close or `Escape`, return focus to the
triggering marker. Apply `inert` to the rest of the map while the popup is open.

---

## Moderate: Colour Independence

Never rely on colour alone for route or zone differentiation.
**Colour-only encoding is Moderate** (Serious if the colour is the only
distinction between route types with different safety or access implications).

* Provide a legend with text labels for all colour-coded elements
* Use pattern fills, line dashes, or icons as secondary indicators
* Test in forced-colours / Windows High Contrast mode — map tile backgrounds
  may be overridden
* Map text labels: 4.5:1 contrast; UI controls: 3:1

---

## Moderate: Layer Toggles

```html
<fieldset>
  <legend>Map layers</legend>
  <label>
    <input type="checkbox" name="layer-transit" checked>
    Transit routes
  </label>
  <label>
    <input type="checkbox" name="layer-a11y">
    Accessibility features
  </label>
</fieldset>
```

Announce layer changes to screen readers via `aria-live="polite"`.

---

## Minor: `prefers-reduced-motion` for Map Animations

Map panning, zooming flyovers, and animated tile loading should respect the
user preference:

```js
const prefersReduced = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Leaflet example
map.flyTo(latlng, zoom, {
  animate: !prefersReduced,
  duration: prefersReduced ? 0 : 1.5
});
```

---

## Required: Structured Text Alternative

For maps showing a list of locations, always provide an adjacent accessible table:

```html
<table>
  <caption>Accessible library branches</caption>
  <thead>
    <tr>
      <th scope="col">Branch</th>
      <th scope="col">Address</th>
      <th scope="col">Accessibility features</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Central Library</td>
      <td>100 Main St</td>
      <td>Ramp, elevator, braille signage</td>
    </tr>
  </tbody>
</table>
```

---

## Definition of Done Checklist

* [ ] Static maps have meaningful text alternative (inline or `<figcaption>`)
* [ ] Skip link present before every interactive map
* [ ] `<iframe>` maps have descriptive `title` attribute
* [ ] Third-party embed: skip link + text alternative provided
* [ ] All map interactions keyboard-operable
* [ ] Zoom/pan controls have accessible labels
* [ ] Markers are keyboard-focusable buttons with accessible names
* [ ] Popup dialogs: focus moves in on open, returns to trigger on close
* [ ] `role="application"` used only if all interactions are fully custom-handled
* [ ] Layer toggles use semantic checkboxes
* [ ] Colour not used as sole differentiator; legend provided
* [ ] Structured text alternative or table adjacent to complex map
* [ ] Map animations respect `prefers-reduced-motion`
* [ ] Tested in forced-colours mode

---

## Key WCAG Criteria

* 1.1.1 Non-text Content (A) — **Critical if no text alternative**
* 1.4.1 Use of Color (A) — **Moderate if colour-only encoding**
* 1.4.3 Contrast Minimum (AA)
* 2.1.1 Keyboard (A) — **Serious if map controls not keyboard operable**
* 2.4.3 Focus Order (A)
* 2.4.12 Focus Not Obscured (AA, WCAG 2.2)
* 4.1.2 Name, Role, Value (A)

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/MAPS_ACCESSIBILITY_BEST_PRACTICES.md)
* [Leaflet accessibility notes](https://leafletjs.com/examples/accessibility/)
* [Mapbox GL JS accessibility](https://docs.mapbox.com/mapbox-gl-js/guides/accessibility/)
* [WAI: Maps Tutorial](https://www.w3.org/WAI/tutorials/images/complex/#maps)

> **Standards horizon:** These rules target WCAG 2.2 AA.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
