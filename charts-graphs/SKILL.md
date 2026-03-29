# Charts and Graphs Accessibility Skill

> **Canonical source**: `examples/CHARTS_GRAPHS_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when creating or reviewing any data visualisation.
**Only load this skill if the project contains charts or graphs.**

---

## Core Mandate

Every chart that conveys meaningful information must have an accessible
alternative communicating the same data and insights. This includes static
images, SVGs, canvas graphics, and JavaScript charting libraries.

---

## Severity Scale (this skill)

| Level | Meaning |
| --- | --- |
| **Critical** | Chart conveys essential data with no accessible alternative whatsoever |
| **Serious** | Alternative exists but is incomplete or significantly misleading |
| **Moderate** | Alternative present; colour independence or contrast gaps create friction |
| **Minor** | Best-practice gap; marginal impact on access |

---

## Critical: Every Chart Must Have a Text Alternative

A chart with no text alternative is **Critical** — blind users and users with
images disabled receive no data at all.

**Simple chart — brief `alt`:**

```html
<img src="quarterly-sales.png"
     alt="Bar chart: Q4 2024 highest at $2.3M, up 18% from Q3.">
```

**Complex chart — long description via `<figcaption>`:**

```html
<figure>
  <img src="trends.png"
       alt="Accessibility adoption rates 2019–2024 — see description below."
       aria-describedby="chart-desc">
  <figcaption id="chart-desc">
    <p>Line chart. Three sectors. Government: 42% (2019) → 78% (2024).
    Corporate: 28% → 61%, with a sharp increase in 2021.
    Non-profit: 19% → 47%. All sectors show year-over-year growth.</p>
  </figcaption>
</figure>
```

Text alternative must include: chart type, axes and units, overall trend or
finding, key data points, notable outliers or anomalies, and time range.

---

## Serious: Complex Charts Need an Adjacent Data Table

A complex chart with no data table is **Serious** — users cannot interrogate
individual values or verify the data.

```html
<details>
  <summary>View data table for this chart</summary>
  <table>
    <caption>2024 budget allocation by department</caption>
    <thead>
      <tr>
        <th scope="col">Department</th>
        <th scope="col">Budget</th>
        <th scope="col">Percentage</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Engineering</td><td>$1,200,000</td><td>40%</td></tr>
      <tr><td>Design</td><td>$600,000</td><td>20%</td></tr>
      <!-- … -->
    </tbody>
  </table>
</details>
```

---

## Serious: Canvas-Based Charts Require Accessible Alternatives

`<canvas>` renders as a flat bitmap — screen readers cannot read canvas content
at all. A chart rendered to canvas with no alternative is **Serious** at minimum,
**Critical** if the chart is the only presentation of the data.

### Step 1: Label the canvas element

```html
<canvas id="sales-chart"
        role="img"
        aria-label="Bar chart: monthly sales January–March 2024. March highest at $19,200."
        width="600" height="400">
  <!-- Fallback content for browsers without canvas support -->
  <p>Monthly sales data: January $12,400, February $15,800, March $19,200.</p>
</canvas>
```

### Step 2: Provide an adjacent data table or text summary

Always include a data table or descriptive summary immediately adjacent to
the canvas element (see data table pattern above). This is the primary access
route for screen reader users and is more reliable than canvas ARIA alone.

### Step 3: Library-specific accessibility options

Most canvas charting libraries expose accessibility hooks — use them:

**Chart.js:**
```js
new Chart(ctx, {
  type: 'bar',
  data: { /* … */ },
  options: {
    plugins: {
      legend: { display: true },
    },
  },
  // Chart.js renders an accessible fallback table when configured
  // See: https://www.chartjs.org/docs/latest/general/accessibility.html
});
```

Set `aria-label` on the `<canvas>` element before Chart.js initialises, and
provide an adjacent summary or data table — Chart.js's built-in accessibility
table is a starting point but may need supplementing for complex charts.

**D3.js:**
D3 renders SVG by default, not canvas — use the SVG accessibility patterns
from `skills/svg/SKILL.md`. If using D3 with canvas, apply the canvas
`aria-label` + adjacent table pattern above.

**Highcharts, Vega-Lite, Observable Plot:**
Each has its own accessibility module or option. Check the library documentation
for screen reader output and keyboard navigation support. Always supplement
with an adjacent data table regardless of library claims.

### Testing canvas charts

Canvas accessibility is difficult to test by code inspection alone.
Test with NVDA+Chrome, JAWS+Chrome, and VoiceOver+Safari as a minimum.
If the screen reader announces nothing meaningful on the chart, the `aria-label`
is not being exposed correctly — move the label to a visually-hidden `<p>`
adjacent to the canvas as a fallback.

---

## Serious: Colour Independence

Colour as the sole encoding in a chart is **Serious** — approximately 8% of males
and 0.5% of females have colour vision deficiency, and will be unable to distinguish
data series.

Always add a **secondary visual indicator**:

* Patterns or textures in bar, area, or pie chart fills
* Direct value labels on data points or bars
* Distinct shapes for scatter plot or line chart data points
* Dash patterns or line thickness variation for line charts

```html
<!-- SVG pattern fills for colour-independent bars -->
<svg width="0" height="0" aria-hidden="true" style="position:absolute">
  <defs>
    <pattern id="pattern-dots" patternUnits="userSpaceOnUse" width="6" height="6">
      <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
    </pattern>
    <pattern id="pattern-stripes" patternUnits="userSpaceOnUse" width="6" height="6">
      <line x1="0" y1="0" x2="6" y2="6"
            stroke="currentColor" stroke-width="1.5"/>
    </pattern>
    <pattern id="pattern-cross" patternUnits="userSpaceOnUse" width="8" height="8">
      <line x1="0" y1="4" x2="8" y2="4"
            stroke="currentColor" stroke-width="1.5"/>
      <line x1="4" y1="0" x2="4" y2="8"
            stroke="currentColor" stroke-width="1.5"/>
    </pattern>
  </defs>
</svg>
<rect fill="url(#pattern-dots)" x="50" y="50" width="60" height="100"/>
<rect fill="url(#pattern-stripes)" x="130" y="80" width="60" height="70"/>
```

---

## Serious: Use Colorblind-Safe Palettes

### Okabe-Ito

The **Okabe-Ito palette** is the recommended default for quantitative data.
It was designed specifically for colour vision deficiency (deuteranopia, protanopia,
tritanopia) and is distinguishable for all common CVD types.

Hex values: `#E69F00`, `#56B4E9`, `#009E73`, `#F0E442`, `#0072B2`, `#D55E00`, `#CC79A7`, `#000000`

Reference: <https://jfly.uni-koeln.de/color/>

### ColorBrewer

**[ColorBrewer](https://colorbrewer2.org/)** provides sequential, diverging, and
qualitative palettes with filters for colorblind-safe, print-friendly, and
photocopy-safe combinations.

Use cases:
* **Sequential** (light → dark): for ordered data, quantities, magnitudes
* **Diverging** (two hues from a midpoint): for data with a meaningful centre
  (e.g., above/below average, positive/negative)
* **Qualitative** (distinct hues): for categorical data with no inherent order

To find a colorblind-safe palette on ColorBrewer: tick the "colorblind safe"
checkbox and select the number of data classes. The site will show only palettes
that pass CVD simulation.

Reference: <https://colorbrewer2.org/>

### What to avoid

* Red/green as sole differentiators — the most common CVD combination
* Saturated rainbow palettes (jet/spectrum) — appear as uniform yellow-green
  to many CVD users and have poor perceptual ordering
* Low-contrast adjacent colours — confirm each pair meets 3:1 against white
  or the chart background

---

## Moderate: Contrast Ratios

| Element | Minimum ratio | Severity if failing |
| --- | --- | --- |
| Text labels on or adjacent to chart | 4.5:1 | Serious |
| Large text axis labels (18pt+ / 14pt+ bold) | 3:1 | Moderate |
| Non-text graphical elements, data lines, chart borders | 3:1 | Moderate |

---

## Moderate: SVG Chart Markup

```html
<figure>
  <svg role="img"
       aria-labelledby="chart-title chart-desc"
       viewBox="0 0 400 300">
    <title id="chart-title">Monthly website visitors, Q1 2024</title>
    <desc id="chart-desc">
      Bar chart. January 12,400. February 15,800.
      March 19,200 — highest, up 54% from January.
    </desc>

    <!--
      Note on role="list" + role="listitem" on <g> elements:
      This pattern is not reliably supported across screen readers.
      NVDA and JAWS handle it inconsistently — some combinations
      announce list semantics, others ignore them entirely.
      TEST THIS PATTERN with your target AT matrix before shipping.
      A data table alternative (see above) is more reliable for
      individual data point access and should always be present.
    -->
    <g role="list" aria-label="Monthly visitors data">
      <g role="listitem" aria-label="January: 12,400 visitors">
        <rect x="50" y="155" width="60" height="124" fill="steelblue"/>
        <text x="80" y="149" text-anchor="middle">12,400</text>
      </g>
      <g role="listitem" aria-label="February: 15,800 visitors">
        <rect x="170" y="123" width="60" height="156" fill="steelblue"/>
        <text x="200" y="117" text-anchor="middle">15,800</text>
      </g>
    </g>
  </svg>
  <figcaption>Source: Analytics dashboard, Q1 2024</figcaption>
</figure>
```

---

## Moderate: Animated Charts Must Respect `prefers-reduced-motion`

Chart animations — bars growing, lines drawing, pie slices rotating — must be
disabled or drastically shortened when the user has requested reduced motion.
Some users experience nausea or disorientation from animated data visualisations,
particularly those involving rapid or continuous motion.

**CSS approach (for SVG-based charts):**

```css
@media (prefers-reduced-motion: reduce) {
  svg *,
  .chart-container * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**JavaScript approach (for canvas/JS-library charts):**

```js
const prefersReduced = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Chart.js example — disable animation globally
const chartConfig = {
  type: 'bar',
  data: { /* … */ },
  options: {
    animation: prefersReduced ? false : { duration: 800 },
    transitions: {
      active: {
        animation: { duration: prefersReduced ? 0 : 400 }
      }
    }
  }
};
```

**D3.js example:**

```js
const prefersReduced = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

selection
  .transition()
  .duration(prefersReduced ? 0 : 750)
  .attr('height', d => yScale(d.value));
```

For looping animations (auto-updating dashboards), provide a visible pause
control in addition to respecting the media query.

---

## Moderate: Interactive Charts Must Be Keyboard Operable

An interactive chart with no keyboard access is **Serious** if there is no
static alternative; **Moderate** if a data table or text summary exists.

* Focus indicators on interactive data points
* Data point values announced on focus (`aria-label` on each element)
* Arrow keys to navigate between data points within a series
* `Tab` to move between series or chart regions
* `Escape` to exit chart navigation and return to the page
* `Enter` or `Space` to activate interactive elements (tooltips, drill-down)

---

## Definition of Done Checklist

* [ ] All charts have text alternative (brief `alt` or `<figcaption>` describing data)
* [ ] Complex charts have adjacent data table
* [ ] Canvas charts: `aria-label` + `role="img"` on `<canvas>` + adjacent summary/table
* [ ] `role="list"` + `role="listitem"` on `<g>` elements tested with target AT matrix
* [ ] Colour not used as sole encoding method
* [ ] Secondary indicator added (pattern, label, shape, or dash)
* [ ] Colorblind-safe palette used (Okabe-Ito or ColorBrewer "colorblind safe")
* [ ] Red/green as sole differentiator avoided
* [ ] All contrast ratios met (text labels 4.5:1, non-text 3:1)
* [ ] SVG charts: `role="img"`, `<title>`, `<desc>`, `aria-labelledby` both IDs
* [ ] Animated charts: animation disabled or near-zero under `prefers-reduced-motion: reduce`
* [ ] Looping/auto-updating charts have visible pause control
* [ ] Interactive charts keyboard operable with announced focus
* [ ] Tested with screen reader

---

## Key WCAG Criteria

* 1.1.1 Non-text Content (A) — **Critical if no text alternative**
* 1.4.1 Use of Color (A) — **Serious if colour is sole encoding**
* 1.4.3 Contrast Minimum (AA)
* 1.4.11 Non-text Contrast (AA)
* 2.1.1 Keyboard (A)
* 2.3.1 Three Flashes or Below Threshold (A) — **Critical for rapidly flashing charts**

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/CHARTS_GRAPHS_ACCESSIBILITY_BEST_PRACTICES.md)
* [Okabe-Ito colorblind-safe palette](https://jfly.uni-koeln.de/color/)
* [ColorBrewer — sequential, diverging, and qualitative palettes with CVD filter](https://colorbrewer2.org/)
* [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) — keyboard patterns for interactive chart widgets
* [Chart.js accessibility documentation](https://www.chartjs.org/docs/latest/general/accessibility.html)
* [WCAG 2.2 Understanding 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
* [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

> **Standards horizon:** Contrast requirements for data visualisation are
> likely to change under WCAG 3.0's APCA model. The current 3:1 non-text ratio
> remains applicable.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
