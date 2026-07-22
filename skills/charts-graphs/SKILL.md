---
name: charts-graphs
description: >
  Load this skill whenever the project contains charts, graphs, data
  visualizations, infographics, or any visual representation of data (bar
  charts, line charts, pie charts, scatter plots, dashboards). Under no
  circumstances render a chart without a text alternative, data table, or
  summary. Prioritize conveying the same information through non-visual means.
---

# Charts and Graphs Accessibility Skill

> **Canonical source**: `examples/CHARTS_GRAPHS_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when creating or reviewing any data visualisation.
**Only load this skill if the project contains charts or graphs.**

---

## Core Mandate

Charts must communicate their information and support their intended tasks
without requiring users to perceive a particular colour, inspect a visual
position, use a pointer, or understand an unexplained graphic. Accessibility
is not one long `alt` label — use a **layered presentation**: an
understandable visual, a concise summary, structured data when needed, and
accessible controls for any interaction. The appropriate depth depends on
purpose — a single-value sparkline and an exploratory dashboard don't need
the same amount of description.

**Start with the user's question** before choosing a chart type: what should
the chart answer, which comparison/trend/distribution matters, do users need
the conclusion, exact values, or exploration? The accessible summary should
answer the same question as the visual — don't describe every visual property
while omitting the conclusion.

---

## Severity Scale (this skill)

| Level | Meaning |
| --- | --- |
| **Critical** | Chart conveys essential data with no accessible alternative whatsoever |
| **Serious** | Alternative exists but is incomplete or significantly misleading |
| **Moderate** | Alternative present; colour independence or contrast gaps create friction |
| **Minor** | Best-practice gap; marginal impact on access |

---

## The Layered Information Model

Provide the layers users need, without duplicating everything into one long
accessible name:

1. **Title** — identifies the subject
2. **Context** — scope, dates, units, population, filters
3. **Summary** — the main trend, comparison, or finding
4. **Structured detail** — exact values/categories/relationships when needed
5. **Source and methodology** — lets users evaluate and reuse the information
6. **Interaction feedback** — active filters, selections, loading, errors

Do not put every layer into an image's `alt`, an SVG `<title>`, or one
`aria-label` — long accessible names are difficult to review and navigate.

**Choosing a representation:**

| Need | Suitable starting point |
|:---|:---|
| One conclusion with few values | Visible text, possibly a simple static chart |
| Exact comparison across rows/columns | HTML data table |
| Scalable static chart | SVG, or SVG exported as `<img>` |
| Dense rendering with many marks | Canvas + visible HTML summary and data access |
| User exploration/filtering | Chart + native HTML controls + structured results |
| Spatial relationships | Map/diagram + equivalent locations/relationships in text |

SVG is not automatically accessible, and canvas is not automatically
inaccessible — the implementation must expose equivalent information
regardless of rendering technology. If a table or short paragraph answers the
question more clearly than a chart, use the simpler representation.

---

## Critical: Every Chart Must Have a Text Alternative

A chart with no text alternative is **Critical** — blind users and users with
images disabled receive no data at all.

**Simple chart — concise `alt` for one clear takeaway:**

```html
<figure>
  <img src="/assets/charts/quarterly-sales.svg"
       alt="Sales increased each quarter, from $1.4 million in Q1 to $2.3 million in Q4."
       width="800" height="450">
  <figcaption>Quarterly sales for 2025. Values are in Canadian dollars.</figcaption>
</figure>
```

Write the alternative for the chart's *purpose in context*, not a visual
inventory. Avoid: "Chart", "Sales chart", a filename, every axis tick, or an
interpretation the data doesn't support. If the surrounding article already
states the same finding, keep `alt` concise rather than forcing a duplicate
announcement.

**Complex chart — short identification + visible long description:**

```html
<figure>
  <img src="/assets/charts/visitors-by-sector.svg"
       alt="Line chart of accessibility adoption from 2019 to 2024, described below."
       width="900" height="520">
  <figcaption>
    <h2>Accessibility adoption by sector, 2019 to 2024</h2>
    <p>Adoption increased in all three sectors. Government remained highest,
    rising from 42% to 78%. Corporate adoption rose from 28% to 61%, with its
    largest increase in 2021. Non-profit adoption rose from 19% to 47%.</p>
    <details><summary>View annual values</summary><!-- data table --></details>
    <p>Source: Annual organizational survey. Percentages are rounded.</p>
  </figcaption>
</figure>
```

Make the detailed description **visible** — this benefits magnification,
text-to-speech, translation, and unfamiliar-subject users, not just screen
reader users. `aria-describedby` can associate an image with a plain-text
description, but AT generally flattens referenced content into one string —
headings, lists, and tables lose navigable structure. **Do not use
`aria-describedby` as the only route to a structured long description.**

---

## Serious: Provide Structured Data When Users Need Values

```html
<details>
  <summary>View data for monthly website visitors</summary>
  <table>
    <caption>Monthly website visitors, January to March 2025</caption>
    <thead>
      <tr><th scope="col">Month</th><th scope="col">Visitors</th><th scope="col">Change</th></tr>
    </thead>
    <tbody>
      <tr><th scope="row">January</th><td>12,400</td><td>Not applicable</td></tr>
      <tr><th scope="row">February</th><td>15,800</td><td>27.4%</td></tr>
    </tbody>
  </table>
</details>
```

There is no standards-based threshold requiring a table after a particular
number of series or points — provide structured data when exact values or
independent comparison are part of the task. For very large datasets, offer a
usable filtered table plus a downloadable open format (CSV) — a download does
not replace an on-page summary. State how missing, suppressed, estimated, or
rounded values are represented.

---

## Serious: SVG Charts

**Atomic SVG image** — when the chart is exposed as one image:

```html
<figure>
  <svg role="img" aria-labelledby="sales-title" aria-describedby="sales-summary" viewBox="0 0 640 360">
    <title id="sales-title">Quarterly sales for 2025</title>
    <!-- Visual chart content -->
  </svg>
  <figcaption id="sales-summary">
    Sales increased in every quarter, from $1.4 million in Q1 to $2.3 million
    in Q4. Values are in Canadian dollars.
  </figcaption>
</figure>
```

**Do not put `role="list"`/`role="listitem"` on descendants of an SVG whose
root has `role="img"` and expect them to remain navigable** — the image role
represents an atomic graphic and its children are presentational; this is not
just inconsistently supported, it contradicts the `role="img"` semantics.

**Structured or interactive SVG** — when individual parts must be browsed or
operated, do not flatten the whole graphic with `role="img"`. The ARIA
Graphics Module defines structured graphic roles, but support must be tested
with the project's actual AT combinations. Even when a structured SVG
accessibility tree works, still provide a visible HTML summary and data
presentation — don't force users to traverse every bar, point, and grid line
to discover the conclusion. See `skills/svg/SKILL.md` for decorative-group
exclusion, unique IDs, and DOM order.

---

## Serious: Canvas-Based Charts Require Accessible Alternatives

`<canvas>` draws pixels — the bitmap exposes no visual objects, labels, or
relationships to AT. A chart rendered to canvas with no alternative is
**Serious** at minimum, **Critical** if it's the only presentation of the data.

```html
<figure>
  <canvas id="regional-sales-chart" width="800" height="450"
          role="img" aria-label="Q2 sales by region"
          aria-describedby="regional-sales-summary">
    Q2 sales by region. A summary and data table follow.
  </canvas>
  <figcaption id="regional-sales-summary">
    The West had the highest Q2 sales at $510,000. The East had the lowest at
    $280,000. A complete data table follows.
  </figcaption>
</figure>
```

Always keep the visual canvas synchronized with an adjacent summary/table —
this is the primary, most reliable access route, more so than canvas ARIA
alone. Canvas fallback content (focusable descendants mapping interactive
regions) requires one-to-one state/focus/hit-region/keyboard synchronization —
prefer visible HTML controls outside the canvas unless there's a tested
reason to use the fallback subtree. Do not put essential detail only in
canvas-drawing commands or library configuration.

**Library-specific notes:** Chart.js exposes accessibility hooks but its
built-in table is a starting point, not a full solution — supplement with an
adjacent summary. D3 renders SVG by default, not canvas — use SVG patterns
above. Highcharts/Vega-Lite/Observable Plot each have their own accessibility
module — check current docs and always supplement with an adjacent data table
regardless of library claims. Treat generated ARIA as code your team owns —
inspect the browser accessibility tree, don't rely on marketing descriptions.

---

## Serious: Colour and Visual Encoding

Do not use colour as the only way to identify a series, state, threshold, or
region — roughly 8% of males and 0.5% of females have colour vision
deficiency. Combine colour with: direct text labels, different line styles,
point shapes, fill patterns, symbols, boundaries, or explained position.

```html
<svg width="0" height="0" aria-hidden="true" style="position:absolute">
  <defs>
    <pattern id="pattern-dots" patternUnits="userSpaceOnUse" width="6" height="6">
      <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
    </pattern>
  </defs>
</svg>
<rect fill="url(#pattern-dots)" x="50" y="50" width="60" height="100"/>
```

**Colorblind-safe palettes:**

* **[Okabe-Ito](https://jfly.uni-koeln.de/color/)** — recommended default for
  quantitative data: `#E69F00`, `#56B4E9`, `#009E73`, `#F0E442`, `#0072B2`, `#D55E00`, `#CC79A7`, `#000000`
* **[ColorBrewer](https://colorbrewer2.org/)** — sequential (ordered data),
  diverging (data with a meaningful centre), or qualitative (categorical)
  palettes with a colorblind-safe filter

Do not rely on a palette merely being *described* as "colour-blind safe" —
test the complete chart including line weight, point size, overlapping marks,
selected states, and every supported theme. Simulation is a review aid, not a
substitute for standards testing. Avoid: red/green as sole differentiators
(the most common CVD combination); saturated rainbow/jet palettes (poor
perceptual ordering, uniform to many CVD users).

**Contrast:** text labels ≥4.5:1 (or 3:1 for large text); required non-text
graphical information ≥3:1 against adjacent colour. Decorative grid lines
don't become subject to 3:1 merely for appearing in a chart — test only
visual information actually required to understand or operate the chart.

---

## Serious: Separate Data Browsing from Actions

Most chart values do not need to be interactive. Provide a summary/table for
browsing; reserve buttons, links, and checkboxes for actual actions
(filtering, selecting, drilling down). Use native HTML controls for legends
and filters:

```html
<fieldset class="series-controls">
  <legend>Data series shown</legend>
  <label><input type="checkbox" name="series" value="2024" checked> 2024 sales</label>
  <label><input type="checkbox" name="series" value="2025" checked> 2025 sales</label>
</fieldset>
```

**Do not add every data point to the page's Tab sequence** — a chart with
hundreds of focus stops is reachable but not practically operable.

---

## Serious: Keyboard Interaction

All functions available through pointer/touch must also work with a
keyboard. Prefer ordinary Tab navigation between native HTML controls. If a
chart genuinely needs a composite navigation model: one Tab stop to enter the
composite; arrow keys to move among comparable items; Home/End where useful;
preserve position when the chart updates; documented instructions before/at
the chart; expose the active item's name/value/state; a direct way to leave.
Do not invent keyboard behaviour just to look comprehensive — keys must match
the widget's real semantics and implementation. Focus indicators must remain
visible over every chart colour and not be clipped by the SVG viewBox or an
overflow container.

An interactive chart with no keyboard access is **Serious** if a static
alternative exists; **Critical** if it's the only presentation.

---

## Serious: Tooltips and Data Details

Do not make hover the only way to discover a value — use direct labels, an
accessible table, a focusable control, or a user-controlled detail panel. For
substantial detail, prefer a disclosure over a transient tooltip:

```html
<button type="button" aria-expanded="false" aria-controls="march-details">
  March: 19,200 visitors
</button>
<div id="march-details" hidden>
  <p>March increased by 21.5% from February.</p>
</div>
```

If custom content appears on hover/focus, WCAG 1.4.13 generally requires it
be dismissible (without moving pointer/focus), hoverable, and persistent. The
same content must be triggerable from keyboard focus; touch users need a tap
or persistent alternative. **Do not reference a tooltip with
`aria-describedby` while also setting `aria-hidden="true"` on it** — hidden
content cannot provide an accessible description.

---

## Moderate: Dynamic Updates and Status Messages

When filters change, update the visible title, summary, table, and chart from
the same data model. Expose result-count/loading/update-result status
programmatically:

```html
<p id="chart-status" role="status" aria-atomic="true"></p>
```

```js
function reportChartUpdate({ period, regions, total }) {
  document.getElementById("chart-status").textContent =
    `Showing ${period}: ${regions} regions, total sales ${total}.`;
}
```

Create the status region before updates occur; keep announcements concise.
Do not clear-and-rewrite live regions merely to force repeated speech, and do
not announce every point in a rapidly updating chart. WCAG 4.1.3 doesn't
require a status message for every change — it requires *existing* messages
to be programmatically determinable. For real-time charts, provide pause/
refresh controls and preserve focus/selection when new data arrives.

---

## Moderate: Animated Charts Must Respect `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  .chart-mark, .chart-axis {
    animation: none;
    transition: none;
  }
}
```

```js
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Chart.js
options: { animation: prefersReduced ? false : { duration: 800 } }
// D3.js
selection.transition().duration(prefersReduced ? 0 : 750).attr('height', d => yScale(d.value));
```

Target chart components specifically rather than a universal rule on all SVG
descendants. Keep default information understandable without animation; avoid
animating every mark on filter change; don't use motion as the only
indication of change; provide pause/stop controls per WCAG 2.2.2; avoid
flashing content (WCAG 2.3.1) regardless of motion preference. For looping/
auto-updating dashboards, provide a visible pause control.

---

## Moderate: Responsive Layout, Reflow, and Zoom

Test at 320 CSS pixels and 400% zoom — titles, summaries, controls,
descriptions, and table cells must reflow without loss of information. WCAG
1.4.10 has an exception for content genuinely requiring two-dimensional
layout (some maps, diagrams, data tables) — it does not require every chart
compressed until labels become unreadable.

```html
<div class="chart-scroll" role="region" aria-label="Monthly sales chart, horizontally scrollable" tabindex="0">
  <!-- Wide chart -->
</div>
```

```css
.chart-scroll { max-inline-size: 100%; overflow: auto; }
```

When 2D scrolling is necessary: confine it to the chart/table, not the whole
page; provide a visible name and instructions; ensure keyboard reach; keep
controls/focus visible; provide a summary that doesn't require spatial
panning. Interactive chart controls must meet WCAG 2.5.8 Target Size Minimum
or a defined exception — small visual points can use larger invisible hit
areas without changing the apparent mark size.

---

## Guidance by Chart Type

* **Bar/column** — start quantitative axes at zero unless a clearly explained
  baseline is used; label categories/units; avoid 3D effects that distort
  length/position
* **Line** — distinguish series with labels/styles/shapes in addition to
  colour; identify gaps rather than visually connecting unobserved values;
  explain log/non-linear scales
* **Pie/donut** — use only when part-to-whole is the real task; avoid for
  precise comparison or numerous/similar slices; label slices directly; don't
  put a central total only as text embedded in the graphic
* **Scatterplots** — explain both axes, units, sample size, point size/shape
  meaning; describe clusters/correlation/outliers without overstating causation
* **Stacked charts** — only baseline-sharing segments are easy to compare;
  provide a table for precise cross-category comparison; label totals and
  whether values are absolute or percentages
* **Heat maps** — never a colour gradient alone; provide labels/symbols/
  boundaries/table for important cells; state scale, thresholds, missing-data treatment
* **Maps** — provide locations/values/routes in text or structured HTML, not
  visual position/colour/pointer exploration alone (see `skills/maps/SKILL.md`)

---

## Minor: Sonification and Multimodal Alternatives

Sonification (pitch/duration/rhythm/stereo position) is a useful *optional*
exploration mode, not a replacement for text and structured data. Explain
what each sound dimension represents; provide start/pause/replay/volume/mute
controls; never autoplay audio; provide equivalent values in text; don't use
sound as the only indication of state or error.

---

## Themes, Forced Colours, and Export

Validate every supported theme using semantic tokens (surfaces, text, axes,
series, focus, selection, status). In forced-colours mode: use text labels/
patterns/shapes that survive colour replacement; use system colours for
required strokes/focus indicators; do not apply `forced-color-adjust: none`
to the entire chart; confirm selected/hidden/highlighted series remain
distinguishable.

```css
@media (forced-colors: active) {
  .chart-series { fill: none; stroke: CanvasText; }
  .chart-series[data-selected="true"] { stroke: Highlight; stroke-width: 4; }
}
```

**Exports:** preserve a meaningful title and concise alternative in
HTML/PDF/presentation formats; include the visible summary and source;
include structured table tags where the format supports them; offer
underlying data in an open format; retain units/locale/date-range/filter/
missing-value notes; do not export only a screenshot when values are required
for the task. Test generated PDFs/spreadsheets independently — web-chart
accessibility does not automatically transfer to an export.

---

## Testing

* **Content review:** confirm title/scope/units/filters/source are accurate;
  compare the visible summary against current data; verify conclusions don't
  overstate correlation/precision/certainty; check missing/estimated/rounded values
* **Visual/interaction:** review all series in grayscale and CVD simulation;
  measure text and required non-text contrast in every theme/state; test
  200%/400% zoom and narrow viewports; test keyboard access, focus order,
  scroll regions; trigger tooltips/details via pointer, keyboard, and touch;
  change every filter and confirm summary/table/chart stay synchronized; test
  reduced motion, increased contrast, forced colours; pause real-time updates
  and verify users can finish reading
* **AT review:** confirm intended role/name/description; confirm visible
  structured detail remains navigable as headings/lists/tables; ensure
  decorative internals don't create noise; confirm controls announce name/
  role/value/state; confirm update messages are concise and not repeated excessively
* **Automated:** can detect missing names, invalid ARIA, table markup
  problems, contrast failures, duplicate IDs, and focus issues — cannot
  determine whether the summary is accurate, the table is equivalent, or
  exploration is practical. Include charts in component tests, page-level
  scans, visual regression, and data-sync tests; manual review still required

---

## Common Failures

| Failure | Correction |
|:---|:---|
| `alt="Chart"` identifies the object but not its information | State the purpose or main finding |
| Every visual detail placed in one long accessible name | Separate title, summary, structured data, and source |
| `aria-describedby` points to a complex table, assumed to preserve navigation | Keep the table visibly available as structured HTML |
| SVG root has `role="img"` while descendants use list/control roles | Choose an atomic image OR a tested structured graphic model, not both |
| Essential canvas data exists only in drawing commands | Provide a visible summary and HTML data access |
| Grid lines forced to 3:1 even though decorative | Test only visual information required to understand/operate the chart |
| Series differ only by colour | Add direct labels, line styles, point shapes, or patterns |
| Every data point added to the Tab order | Use a table for browsing; reserve controls for actual actions |
| Hover-only tooltips expose the only exact values | Provide direct labels, a table, keyboard access, or a persistent panel |
| A tooltip is both `aria-describedby` content and `aria-hidden="true"` | Keep description content exposed |
| Every filter change forced through a live region | Announce only meaningful status messages |
| Chart compressed to 320px until labels are unreadable | Reflow supporting content; use a contained labelled scroll region when needed |
| Library's accessibility claim accepted without testing output | Test the installed version and own the generated semantics |
| Web chart passes but PDF/image export has no alternative | Test and remediate every output format separately |

---

## Definition of Done Checklist

* [ ] The chart answers a documented user question
* [ ] Title, scope, units, date range, filters, source available where relevant
* [ ] Concise text alternative communicates the important finding
* [ ] Complex information has a visible long description or structured equivalent
* [ ] Exact values available in accessible HTML when the task requires them
* [ ] Missing/rounded/estimated/suppressed values explained
* [ ] Colour is not the only visual means of distinguishing data or state
* [ ] Colorblind-safe palette used (Okabe-Ito or ColorBrewer colorblind-safe filter)
* [ ] Text and required graphical information meet contrast requirements
* [ ] SVG uses either atomic `role="img"` OR a tested structured graphic model — not a hybrid
* [ ] Canvas charts: `role="img"` + `aria-label` + adjacent synchronized summary/table
* [ ] Only actual chart actions create interactive controls (not every data point)
* [ ] All functions keyboard operable; focus remains visible
* [ ] Hover information also available through focus and touch
* [ ] Dynamic updates preserve focus and provide concise status feedback
* [ ] Supporting content reflows; necessary 2D scrolling is contained and operable
* [ ] Target sizes meet WCAG 2.5.8 or a defined exception
* [ ] Reduced motion, forced colours, and supported themes tested
* [ ] Exported/downloaded formats preserve information and accessibility
* [ ] Tested with a screen reader

---

## Key WCAG Criteria

* 1.1.1 Non-text Content (A) — **Critical if no text alternative**
* 1.3.1 Info and Relationships (A)
* 1.3.3 Sensory Characteristics (A) — instructions can't depend only on position/shape
* 1.4.1 Use of Color (A) — **Serious if colour is sole encoding**
* 1.4.3 Contrast Minimum (AA)
* 1.4.10 Reflow (AA)
* 1.4.11 Non-text Contrast (AA)
* 1.4.13 Content on Hover or Focus (AA)
* 2.1.1 Keyboard (A)
* 2.2.2 Pause, Stop, Hide (A)
* 2.3.1 Three Flashes or Below Threshold (A) — **Critical for rapidly flashing charts**
* 2.5.8 Target Size Minimum (AA)
* 4.1.3 Status Messages (AA)

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/CHARTS_GRAPHS_ACCESSIBILITY_BEST_PRACTICES.md)
* [Okabe-Ito colorblind-safe palette](https://jfly.uni-koeln.de/color/)
* [ColorBrewer](https://colorbrewer2.org/)
* [WAI-ARIA Graphics Module](https://www.w3.org/TR/graphics-aria-1.0/)
* [Chart.js accessibility documentation](https://www.chartjs.org/docs/latest/general/accessibility.html)
* [WCAG 2.2 Understanding 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
* [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

> **Standards horizon:** Contrast requirements for data visualisation may
> change under WCAG 3.0's APCA model. The current 3:1 non-text ratio remains applicable.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
