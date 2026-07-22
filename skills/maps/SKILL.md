---
name: maps
description: >
  Load this skill whenever the project contains static or interactive maps,
  embedded map widgets (Google Maps, Leaflet, Mapbox, OpenStreetMap), or any
  geographic visualizations. Under no circumstances embed a map without a
  text-based alternative conveying the same information. Absolutely always
  ensure map controls are keyboard-accessible and that all meaningful map
  content is available without the visual map.
---

# Maps Accessibility Skill

> **Canonical source**: `examples/MAPS_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when implementing or reviewing any static or interactive map.
**Only load this skill if the project contains maps.**

---

## Core Mandate

No single text description works for every map. Start with the map's purpose
and the tasks it supports, then provide accessible content and controls that
preserve that purpose for people who cannot see, distinguish, point at, drag,
zoom, or interpret the visual map. Keep the map and its structured
alternative synchronized from the same data source.

---

## Severity Scale (this skill)

| Level | Meaning |
|---|---|
| **Critical** | Essential location data has no accessible alternative |
| **Serious** | Interactive map unreachable by keyboard; `role="application"` misused |
| **Moderate** | Skip link missing; colour independence gap; popup focus not managed |
| **Minor** | Missing `prefers-reduced-motion` for animations; legend incomplete |

---

## Classify the Map's Purpose First

| Map purpose | Essential task | Common accessible presentation |
|---|---|---|
| Simple locator | Where one place is and how to reach it | Concise alt, address, landmark, directions, contact info |
| Location directory | Find and compare services | Searchable list/table with names, addresses, distances, categories |
| Route/wayfinding | Travel from A to B | Ordered directions with distances, turns, landmarks, conditions |
| Thematic/quantitative | Compare values across areas | Summary + data table with region names, values, units, period |
| Boundary/zoning | Understand containment/adjacency | Named boundary descriptions, affected locations, downloadable data |
| Indoor/multi-floor | Navigate a building | Floor selector, accessible route instructions, entrances/lifts/stairs |
| Exploratory | Investigate spatial relationships | Synchronized filters, structured results, accessible query tools |

A map can serve more than one purpose — provide the alternatives needed for
every essential task rather than assuming one short `alt`, table, or
direction set is universally equivalent. WCAG 1.1.1's "equivalent purpose"
does not mean reproducing every pixel or street label — it means preserving
the information and tasks that matter in context. Research (the Map
Equivalent-Purpose Framework) found tables and turn-by-turn directions can be
insufficient when the purpose includes broad spatial understanding or
exploration — treat this as guidance, not a separate WCAG criterion, but
recognize when a table alone won't do.

---

## Critical: Text Alternatives for Static Maps

```html
<!-- Simple map: concise alt, details in HTML nearby -->
<figure>
  <img src="clinic-location.png"
       alt="The clinic is on the north side of King Street, immediately east of the Central Station entrance."
       width="960" height="540">
  <figcaption>
    Northside Clinic, 200 King Street. The step-free entrance is on King Street.
    <a href="#clinic-directions">Read accessible travel directions</a>.
  </figcaption>
</figure>
```

Do not fill `alt` with turn-by-turn instructions or every road label — keep
it concise and put detail nearby. For complex maps, provide both a short
alternative AND a visible structured long description or clearly associated link:

```html
<figure>
  <img src="accessible-transit-routes.png"
       alt="Map of step-free transit routes in the downtown area. Detailed route information follows."
       width="1200" height="800">
  <figcaption>
    Step-free transit routes, updated 15 July 2026.
    <a href="#transit-route-details">View route details and connections</a>.
  </figcaption>
</figure>
```

Prefer visible structured content over `aria-describedby` for complex
descriptions — AT generally flattens referenced headings/lists/tables into
one string, losing navigable structure. `alt=""` is appropriate only when
purely decorative or the same info is already fully available nearby — never
call a meaningful or interactive map decorative to hide accessibility problems.

---

## Critical: Structured Alternatives Matching the Task

**Location list/table** (for directories):

```html
<table id="branch-table">
  <caption>Library branches matching the current filters</caption>
  <thead>
    <tr><th scope="col">Branch</th><th scope="col">Address</th><th scope="col">Distance</th><th scope="col">Accessibility information</th></tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row"><a href="/branches/central">Central Library</a></th>
      <td>100 Main Street</td><td>600 metres</td>
      <td>Step-free entrance, lift, accessible washroom, hearing loop</td>
    </tr>
  </tbody>
</table>
```

Explain how distance was calculated; include units; preserve filters/sort
order; let users open the same details and perform the same actions from
both the map and the list view.

**Route directions:**

```html
<section id="clinic-directions" aria-labelledby="directions-heading">
  <h2 id="directions-heading">Step-free route from Central Station</h2>
  <p>Distance: 350 metres. Typical travel time: 6 to 10 minutes.</p>
  <ol>
    <li>Leave Central Station through the King Street step-free exit.</li>
    <li>Turn left and continue east for approximately 250 metres.</li>
  </ol>
  <p>Route data checked 15 July 2026. Call 555-0100 to confirm temporary closures.</p>
</section>
```

Include as applicable: distances/travel time; street names/landmarks/turns;
curb cuts/crossings/gradients/surfaces/steps; accessible entrances/lifts/
washrooms; known construction/closures; transit stop/platform info; an
alternative route when the shortest isn't accessible. Don't rely only on
cardinal directions — combine with street names, distance, and landmarks.

**Thematic/quantitative maps:** provide a plain-language summary, a data
table with every value needed for comparison, region names/categories/units/
missing-data indicators, and the time period/source. Do not replace a
choropleth map with a list of color names.

**Legends are content, not decoration** — put legend text in HTML, describe
colors/symbols/patterns/line styles/sizes, keep changes synchronized with
active layers, and never make the legend the only structured alternative.

---

## Serious: Interactive Map Page Structure and Skip Link

```html
<section aria-labelledby="service-map-heading">
  <h2 id="service-map-heading">Find an accessible service location</h2>
  <p><a href="#location-results-heading">Skip the interactive map and view locations</a></p>
  <div class="map-interface">
    <h3 id="map-view-heading">Interactive map</h3>
    <p id="map-instructions">Use the named map controls to move or zoom.</p>
    <div id="map-viewport" role="region" aria-labelledby="map-view-heading"
         aria-describedby="map-instructions">
      <!-- tested map library renders here -->
    </div>
  </div>
  <section aria-labelledby="location-results-heading">
    <h3 id="location-results-heading" tabindex="-1">Location results</h3>
    <p id="location-result-status" role="status" aria-atomic="true"></p>
    <ul id="location-results"><!-- same locations as map markers --></ul>
  </section>
</section>
```

**Missing skip link on an interactive map is Serious.** The visible link to
results is useful to screen reader, keyboard, switch, speech-input, mobile,
low-bandwidth, and cognitively disabled users — don't reveal it only on
keyboard focus.

---

## Serious: Third-Party Map Embeds

```html
<iframe src="https://maps.example.org/embed/service-locations"
        title="Interactive map of service locations" loading="lazy"></iframe>
<p><a href="#service-location-list">View service locations as a list</a>
   or <a href="/service-locations.csv">download the location data</a>.</p>
```

An `<iframe>` with no descriptive `title` is Serious. Confirm keyboard users
can enter/operate/leave the embed; test controls, markers, popups, consent
notices, and full-screen mode; keep the structured alternative **outside**
the iframe, available if the provider fails or is blocked; confirm changes
made in the embed are reflected in the site's alternative; retest after
provider/plugin/config updates. Do not trust a provider's accessibility
claim without testing the current rendered experience.

**Map libraries:** preserve a library's accessibility defaults unless
testing supports a change (e.g., Leaflet's container/markers are keyboard
operable by default — plugins can degrade that). Pin the version, review
release notes, retest after updates — do not recommend a plugin as
universally accessible or use unpinned `@latest` in production.

---

## Serious: Keyboard Controls and `role="application"`

All map functionality must be keyboard-reachable unless the underlying
movement is essential (WCAG's limited exception).

```html
<div class="map-controls" role="group" aria-labelledby="map-controls-heading">
  <h3 id="map-controls-heading">Map view controls</h3>
  <button type="button">Zoom in</button>
  <button type="button">Pan north</button>
  <button type="button">Reset map view</button>
</div>
```

Users reach every control in logical order; native buttons work with Enter/
Space; focus stays visible and unobscured by floating controls/popups; users
can move into and out of the map without a trap; rerendering the map doesn't
discard focus or move it to `<body>`. Do not capture page-level arrow keys
merely because a map is present — scope arrow-key panning to when the
viewport has focus, and always allow Tab/Shift+Tab to leave. Single-character
shortcuts must meet WCAG 2.1.4 (off/remap/scoped) with named buttons as an alternative.

**Most maps do not need `role="application"`.** It changes screen reader
interaction modes and suppresses ordinary reading commands. Prefer native
controls around the map, ordinary document content for results, a named
region for the viewport, and documented scoped keyboard behavior only where
the viewport needs it. **Misusing it is Serious** — only use application
semantics when the team understands the AT consequences, has implemented a
complete keyboard model, provides instructions and an exit path, and has
tested supported combinations. Adding the role does not make a map accessible.

**Large marker sets:** hundreds of markers must not create hundreds of
sequential Tab stops. Choose a tested model: one map-viewport Tab stop with
documented directional navigation; roving `tabindex` within the current
marker set; focusable markers only after narrowing results; or a structured
location list as the primary keyboard interface. There is no universal
WAI-ARIA map pattern — document the chosen behavior and test it.

---

## Moderate: Markers, Clusters, and Popup Focus Management

```html
<button type="button" class="map-marker" aria-label="City Hall, 123 Main Street"
        aria-expanded="false" aria-controls="city-hall-details">
  <svg aria-hidden="true" focusable="false"><!-- marker artwork --></svg>
</button>
<section id="city-hall-details" aria-labelledby="city-hall-heading" hidden>
  <h3 id="city-hall-heading">City Hall</h3>
  <p>123 Main Street. Step-free entrance on Queen Avenue.</p>
  <a href="/locations/city-hall">City Hall details</a>
</section>
```

Update both `hidden` and `aria-expanded` together. **Use ordinary non-modal
content for marker popups — do not add `role="dialog"`/`aria-modal="true"`
to every marker popup**, only when the interaction is genuinely modal. If a
popup has substantial content and focus moves into it, provide a close
control and return focus to the triggering marker on close. Do not put
"press Enter" instructions in a native button's name — the role already
communicates operation.

**Clusters** need an accessible name, a count, and a keyboard action:

```html
<button type="button" aria-expanded="false" aria-controls="downtown-location-results">
  Show 7 locations in downtown
</button>
```

Update `aria-expanded` and both views together on expansion; preserve focus
on the cluster control or move it only to a predictable results heading
after an explicit action; announce a concise result summary, not every marker.

---

## Moderate: Colour Independence

Never rely on colour alone for route/zone/state differentiation — route
numbers and line styles in addition to colour; icons and text labels in
addition to marker colours; hatching/boundary styles in addition to area
fills; numeric values in the data table. **Colour-only encoding is Moderate**
(Serious if the colour distinguishes routes/states with different safety
implications). Test in forced-colours mode — map tile backgrounds may be
overridden; ensure the location list/directions remain complete if tiles or
gradients disappear.

Contrast: authored normal text ≥4.5:1; large text ≥3:1; visual info required
to identify controls/states/graphical objects ≥3:1 (WCAG 1.4.11); focus
indicators need enough contrast against whatever they touch. Do not claim
every pixel, aerial photo, or incidental label must meet one universal ratio
— evaluate the authored information actually needed to understand/operate the map.

---

## Moderate: Target Size

WCAG 2.5.8 requires **24×24 CSS pixels minimum** or a listed exception — it
does **not** impose a universal 44×44 requirement at Level AA. Use 44×44 for
primary map controls as an inclusive practice aligning with the Level AAA
Target Size Enhanced criterion (2.5.5), not because AA requires it:

```css
.map-controls button { min-inline-size: 44px; min-block-size: 44px; }
```

Markers can be visually small with a larger transparent hit area, as long as
hit areas don't overlap ambiguously.

---

## Serious: Pointer, Touch, and Dragging Alternatives

Maps commonly depend on pinch/rotate/swipe/drag — these cannot be the only
way to operate essential functions. Provide zoom buttons as pinch
alternatives; pan controls/search/selection as drag alternatives; a button/
menu alternative to dragging a marker or route point; single-pointer marker/
control activation; actions completing on pointer-up rather than pointer-down.

An embedded map must not create a page-scrolling trap — users need a
reliable way to scroll past it without an undocumented multi-finger gesture.
Consider requiring an explicit "Use interactive map" action before the map
captures drag/wheel gestures, especially on small screens.

---

## Layer Toggles, Search, and Geolocation

```html
<fieldset>
  <legend>Locations to show</legend>
  <label><input type="checkbox" name="category" value="clinic" checked> Clinics</label>
  <label><input type="checkbox" name="step-free" value="yes"> Step-free entrance</label>
</fieldset>
```

Announce a concise result summary ("12 locations shown") — don't announce
every marker added, tile loaded, pan movement, or zoom frame.

**Search:** a labeled search form + status message + ordinary links is
easier to implement and use than a custom autocomplete widget. If
suggestions are needed, implement and test the **complete** WAI-ARIA
combobox pattern — adding `role="listbox"`/`aria-autocomplete` to an
otherwise incomplete widget is not sufficient. Accept multiple input forms;
explain errors without clearing the query; announce a concise result count;
identify ambiguous addresses and let the user choose; preserve query/filters
across map/list views.

**Geolocation:** request permission only after a clear user action; explain
why and how it's used; provide address/place search when permission is
denied; handle stale/inaccurate locations without blaming the user; don't
require precise geolocation for a task that can use manual input.

---

## Low Vision, Zoom, Reflow, and Orientation

Browser zoom and map zoom are different — support both, and never override
browser zoom or pinch-to-zoom at the page level. Keep map controls and
alternatives available at 200%/400% browser zoom; preserve portrait/
landscape; avoid fixed-height layouts hiding controls when text grows. WCAG
1.4.10's two-dimensional-layout exception can apply to the map viewport
itself, but it does **not** exempt surrounding controls, search, status,
details, directions, and location results from reflow requirements.

---

## Canvas and SVG Maps

Canvas pixels have no child semantics — if drawn on `<canvas>`, provide
accessible DOM controls, results, names, states, and alternatives outside or
in a tested fallback structure; don't assume screen readers can inspect
painted markers. For SVG maps: give non-interactive maps an appropriate
accessible name/description; keep decorative paths out of the accessibility
tree; make interactive regions programmatically focusable and named; provide
a structured alternative for large/complex SVG maps. See `skills/svg/SKILL.md`.

---

## Indoor Maps and Wayfinding

Provide as applicable: building/entrance/floor/destination names; accessible
entrances and hours; lift/stair/escalator/ramp/platform locations; corridor
widths/door types/thresholds/gradients/surfaces/lighting; washrooms/refuge
areas/assistance points; landmarks and distances between decision points;
temporary lift outages/construction/closures; source and last-verification date.

```html
<label for="floor-select">Building floor</label>
<select id="floor-select">
  <option value="ground">Ground floor: entrance, reception, cafe</option>
  <option value="1">Floor 1: offices and meeting rooms 101 to 120</option>
</select>
<p id="floor-status" role="status" aria-atomic="true"></p>
```

On change, update the floor heading, locations, directions, and map
together. Real-time positioning is an enhancement, not the only navigation
method — indoor location can be inaccurate or unavailable; offer static
directions and a way to report outdated route data.

---

## Data Quality and Accessibility Information

Accessible presentation cannot correct inaccurate geographic data. Identify
the source and last-update date; explain whether distances are straight-
line/walking/driving/transit; distinguish verified accessibility info from
user-submitted or inferred info; provide a way to report errors and
temporary barriers; preserve missing/unknown values rather than presenting
them as "No"; avoid absolute route claims when conditions can change;
include contact info when a critical accessibility feature should be
confirmed before travel.

---

## Testing

* **Equivalent-purpose:** list the map's documented purposes/essential tasks;
  complete each task using the visual map, then using only the structured
  alternative and non-map controls; compare information/results/conclusions
  available; test with blind, low-vision, mobility-disabled, cognitively
  disabled, and DeafBlind users as appropriate. Don't evaluate equivalence
  by just checking a table exists.
* **Keyboard:** reach and operate search/filters/layers/controls/markers/
  clusters/details/results/full-screen; confirm focus order is logical and
  visible; confirm map updates don't lose focus; enter/leave the viewport
  and embed without a trap; confirm the structured alternative supports the
  same actions
* **Screen reader:** confirm controls/markers/clusters/states/results have
  useful names and roles; verify status messages are concise and not
  repeated excessively; read structured descriptions/tables/directions
  independently of the map; confirm opening/closing details doesn't cause
  unexpected focus changes
* **Visual/low-vision:** 200%/400% browser zoom; narrow viewports and both
  orientations; text spacing; light/dark/forced-colors; confirm labels don't
  disappear or overlap; confirm selected states/routes/boundaries remain
  distinguishable without colour; confirm the alternative remains usable
  when map imagery is hidden
* **Pointer/touch:** complete every task with a single pointer; zoom/pan
  without pinch or drag; verify alternatives to dragging markers/route
  points; check target size, spacing, and pointer cancellation; scroll the
  page past the map without a trap
* **Data/integration:** compare marker count/content with structured
  results; apply every filter and confirm both views stay synchronized;
  verify distances/units/coordinates/accessibility attributes; test empty/
  loading/error/offline/permission-denied states; retest after data/basemap/
  library updates

**Automated checks** can detect missing iframe titles, unnamed buttons,
invalid ARIA, duplicate IDs, focus-order regressions, contrast issues,
missing static-image alternatives, and map/list count mismatches — cannot
determine equivalent purpose, direction accuracy, route accessibility,
spatial comprehension, or third-party keyboard behavior. Manual and user
testing are required.

---

## Common Failures

| Failure | Correction |
|---|---|
| Using one generic `alt="Map"` | Describe the map's purpose and provide a task-appropriate structured alternative |
| Assuming a table or directions are always fully equivalent | Match the alternative to the documented purpose; add spatial descriptions when needed |
| Giving a complex table only through `aria-describedby` | Provide visible, navigable HTML or a clearly associated link |
| Adding `role="application"` to the map by default | Use named regions, native controls, ordinary content, scoped keyboard behavior |
| Capturing arrow keys while focus is elsewhere on the page | Scope map keys to the focused viewport; provide named controls |
| Making every marker a Tab stop | Use a tested navigation model and synchronized location list |
| Making every popup an `aria-modal="true"` dialog | Use ordinary non-modal details unless genuinely modal |
| Claiming WCAG AA universally requires 44×44 targets | Apply the 24×24 Level AA criterion; use 44×44 as an inclusive/AAA practice |
| **Confusing 2.4.11 (Focus Not Obscured) with 2.4.13 (Focus Appearance)** | 2.4.11 is Focus Not Obscured Minimum (AA); Focus Appearance is 2.4.13 (AAA) |
| Requiring pinch or drag as the only interaction | Provide single-pointer buttons and selection alternatives |
| Applying one contrast ratio to every map pixel | Test essential authored text, controls, states, and graphical objects accurately |
| Hiding an interactive map as decorative to dodge remediation | Remove interaction or expose accessible controls/information/alternatives |
| Announcing every pan, tile, or marker update | Announce concise completed-task results; keep persistent content visible |
| Trusting a map provider or plugin without testing | Test the current configured version; preserve an external structured alternative |
| Letting the map and location list use different data | Generate both from the same source and state |

---

## Definition of Done Checklist

* [ ] Map's purpose, audience, and essential tasks documented
* [ ] Static maps have concise alt text; complex maps have visible structured descriptions
* [ ] Location lists/tables/directions are visible, structured, and easy to find
* [ ] Map and non-map views use the same data, filters, and result state
* [ ] Skip link present before every interactive map
* [ ] Third-party `<iframe>` maps have descriptive `title`; alternative lives outside the iframe
* [ ] All map interactions keyboard-operable; arrow-key panning scoped to focused viewport
* [ ] `role="application"` used only with a fully tested custom keyboard model — not by default
* [ ] Large marker sets use a tested navigation model, not hundreds of Tab stops
* [ ] Marker popups are non-modal unless genuinely modal; focus returns to trigger on close
* [ ] Colour not used as sole differentiator; legend provided; tested in forced-colours mode
* [ ] Targets meet 24×24px minimum; 44×44px used for primary controls where practical
* [ ] Pinch/drag/path gestures have single-pointer button alternatives
* [ ] Map controls/alternatives usable at 200%/400% zoom and narrow viewports
* [ ] Status messages concise; persistent results remain visible in the page
* [ ] Data source, date, units, and limitations documented

---

## Key WCAG Criteria

* 1.1.1 Non-text Content (A) — **Critical if no text alternative**
* 1.3.3 Sensory Characteristics (A)
* 1.4.1 Use of Color (A) — **Moderate if colour-only encoding**
* 1.4.3 Contrast Minimum (AA)
* 1.4.10 Reflow (AA) — with a defined exception for the map viewport itself
* 1.4.11 Non-text Contrast (AA)
* 2.1.1 Keyboard (A) — **Serious if map controls not keyboard operable**
* 2.1.4 Character Key Shortcuts (A)
* 2.4.3 Focus Order (A)
* 2.4.11 Focus Not Obscured Minimum (AA, WCAG 2.2) — not Focus Appearance
* 2.5.5 Target Size Enhanced (AAA) — the 44×44 threshold
* 2.5.7 Dragging Movements (AA)
* 2.5.8 Target Size Minimum (AA) — 24×24, the actual AA requirement
* 4.1.2 Name, Role, Value (A)
* 4.1.3 Status Messages (AA)

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/MAPS_ACCESSIBILITY_BEST_PRACTICES.md)
* [Leaflet: A Guide to Basic Leaflet Accessibility](https://leafletjs.com/examples/accessibility/)
* [Mapbox GL JS accessibility](https://docs.mapbox.com/mapbox-gl-js/guides/accessibility/)
* [W3C WAI: Complex Images](https://www.w3.org/WAI/tutorials/images/complex/)
* [W3C WAI-ARIA APG: Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
* [Systematically Evaluating Equivalent Purpose for Digital Maps](https://arxiv.org/abs/2512.05310)

> **Standards horizon:** These rules target WCAG 2.2 AA.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
