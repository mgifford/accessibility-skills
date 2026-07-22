---
name: tables
description: >
  Load this skill whenever the project contains HTML data tables (<table>
  elements). Under no circumstances use tables for layout purposes. Absolutely
  always include <th> elements with appropriate scope attributes, a <caption>
  or aria-labelledby, and ensure complex tables have headers associated with
  data cells. Apply these rules to every data table without exception.
---

# Tables Accessibility Skill

> **Canonical source**: `examples/TABLES_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when creating or reviewing HTML data tables.
**Only load this skill if the project contains data tables.**

---

## Core Mandate

Use tables for information whose meaning depends on relationships between
rows and columns. Mark those relationships in HTML so users can identify the
table, navigate its cells, and hear the relevant headers with each value. The
complexity of the markup should match the complexity of the information —
simplifying or splitting a table is often better than adding increasingly
complicated header associations.

**Never use tables for layout.** Use CSS Grid/Flexbox instead. Do not turn a
reading-oriented data table into an application-style grid (`role="grid"`)
unless users genuinely need spreadsheet-like keyboard interaction.

---

## Severity Scale (this skill)

| Level | Meaning |
|---|---|
| **Critical** | Table data is completely uninterpretable by screen reader users |
| **Serious** | Headers missing or misassociated; complex table with no navigation aid |
| **Moderate** | No name for the table when multiple tables share a page; zebra stripes lost in forced-colours without fallback |
| **Minor** | `<thead>`/`<tbody>` absent; obsolete `summary` attribute used |

---

## Choose the Correct Structure First

* A **list** — items that don't depend on column relationships
* A **definition list** — term/description pairs
* A **data table** — reading and comparing row-column data
* An **ARIA grid/treegrid** — only for an application-style composite widget
  with cell navigation or editing
* **CSS Grid/Flexbox** — page layout

Do not use a table merely to align form fields, cards, images, or page regions.

---

## Critical: Every Data Table Must Have `<th>` with `scope`

A table with only `<td>` cells is **Critical** — screen readers announce raw
data with no context. Use `<th>` for cells that label a row, column, or
group — never a bolded `<td>` as a visual substitute.

```html
<table>
  <caption>Monthly sales by region, first quarter 2025</caption>
  <thead>
    <tr>
      <th scope="col">Region</th>
      <th scope="col">January</th>
      <th scope="col">February</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">North</th>
      <td>$12,400</td>
      <td>$14,200</td>
    </tr>
  </tbody>
</table>
```

For a small, unambiguous table with only one header row or column, browsers
can sometimes infer header direction from `<th>` alone. Explicit
`scope="col"`/`scope="row"` remains the dependable authoring convention,
especially for large or similar-looking data. `<thead>`/`<tbody>`/`<tfoot>`
support sticky headers, styling, scripting, and repeating headers in print —
their presence does not by itself repair missing or incorrect header associations.

When a header row has an empty top-left corner cell (no header function),
leave it as `<td>` — don't add filler text like "blank" just to occupy the cell.

---

## Moderate: Captions and Table Names

`<caption>` is the native way to identify a table, especially with several
tables on one page. **WCAG does not require a caption in every case** — an
immediately associated heading or surrounding text can sometimes adequately
identify a simple table. Treat `<caption>` as the preferred default, but
don't force a duplicate name when another tested association already
supplies one.

```html
<table>
  <caption>2025 budget allocation by department</caption>
  <!-- header and data rows -->
</table>
```

The caption must be a direct child of `<table>` (before `<thead>`), concise
and specific. For unusual structure, a short summary can explain row/column
organization without repeating every value:

```html
<caption>
  Availability of holiday accommodation
  <span class="table-summary">Locations form row groups. Property types form columns.</span>
</caption>
```

The obsolete HTML `summary` attribute on `<table>` should not be used — use
visible caption content or a nearby description instead.

---

## Serious: Spanned Headers — `scope="colgroup"` / `scope="rowgroup"`

Use `colgroup`/`rowgroup` scope values **only when the corresponding group
actually exists** in the table structure (matching `<colgroup>` or `<tbody>`
row group):

```html
<table>
  <caption>Quarterly revenue by product line, CAD thousands</caption>
  <colgroup><col></colgroup>
  <colgroup span="2"></colgroup>
  <colgroup span="2"></colgroup>
  <thead>
    <tr>
      <th scope="col" rowspan="2">Product</th>
      <th scope="colgroup" colspan="2">First half</th>
      <th scope="colgroup" colspan="2">Second half</th>
    </tr>
    <tr>
      <th scope="col">Q1</th><th scope="col">Q2</th>
      <th scope="col">Q3</th><th scope="col">Q4</th>
    </tr>
  </thead>
  <tbody>
    <tr><th scope="row">Hardware</th><td>1,200</td><td>1,450</td><td>1,100</td><td>1,800</td></tr>
  </tbody>
</table>
```

For row groups spanning several rows, use `scope="rowgroup"` with `rowspan`
on the group header. Test grouped headers with the project's actual AT
combinations — if associations are difficult to understand, split into
simpler tables rather than adding more complexity.

---

## Serious: When to Use `headers` + `id` (Rarely)

Use only for tables so complex that `scope` causes headers to apply to the
wrong cells:

```html
<table>
  <caption>Accommodation availability</caption>
  <thead>
    <tr>
      <th id="location" scope="col">Location</th>
      <th id="studio" scope="col">Studio</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th id="paris" scope="row">Paris</th>
      <td headers="paris studio">11</td>
    </tr>
  </tbody>
</table>
```

Every ID must be unique in the document; every `headers` token must match a
real header cell. **Before reaching for `headers`/`id`, consider:** splitting
one table into several; transposing rows and columns; moving explanatory
material outside the grid; reducing nested header levels; offering a
filtered view. Even when technically correct, a table needing three or four
headers read per cell may be functionally inaccessible in practice — per
WebAIM, multiple levels of row/column headers are unlikely to be functionally
understandable to a screen reader user. Validate `headers`/`id` associations
after every schema or column change.

---

## Serious: Empty, Missing, and Special Values

An empty cell is ambiguous — it can mean zero, not applicable, unknown, not
reported, or intentionally blank. **Use explicit text where the distinction
matters:** `0` for a measured zero; `Not applicable`; `No data`; `Not
reported`; `Suppressed` for intentionally withheld values. Define shortened
symbols (`N/A`, em dash) in the caption or a nearby note; prefer full text
when space permits. Do not use `&nbsp;` to make an empty cell appear
occupied. Explain estimated/rounded/preliminary/revised values — don't rely
on colour or typographic style alone to identify them.

---

## Serious: Totals, Subtotals, and Footers

Mark total labels as headers when they identify the row's values:

```html
<tfoot>
  <tr><th scope="row">Total</th><td>$21,500</td><td>$24,500</td></tr>
</tfoot>
```

Do not communicate subtotals only through bold text, indentation, or
background colour — include visible text ("Subtotal") and preserve header
associations. If a total is calculated dynamically, expose update status
appropriately and ensure the exported value uses the same calculation.

---

## Moderate: Responsive Tables and Reflow

WCAG 1.4.10 allows two-dimensional scrolling for content that genuinely
requires it, including data tables — the exception applies to the table
itself, not the surrounding page.

```html
<div class="table-scroll" role="region" aria-labelledby="sales-caption" tabindex="0">
  <table>
    <caption id="sales-caption">Monthly sales by region</caption>
  </table>
</div>
```

```css
.table-scroll { max-inline-size: 100%; overflow: auto; }
.table-scroll:focus-visible { outline: 3px solid currentColor; outline-offset: 3px; }
```

Use a labelled region when separate discoverability genuinely helps — don't
turn every table wrapper into a landmark. Use `tabindex="0"` to make overflow
keyboard-scrollable, with a visible focus indicator.

**Avoid responsive CSS that changes `table`/`thead`/`tbody`/`tr`/`th`/`td` to
`display: block`** — browser/AT behavior varies and duplicated `data-label`
content can drift out of sync with the real headers. When a card presentation
is genuinely better on small screens, render a real alternative list or
definition-list view from the same data — expose one view at a time, preserve
all values and controls, and test both presentations. Test at 200%/400% zoom,
long translated strings, and narrow viewports.

---

## Moderate: Sticky Headers and Columns

```css
thead th {
  position: sticky;
  inset-block-start: 0;
  background: var(--table-header-background);
  z-index: 1;
}
```

Keep the original semantic `<th>` elements — do not create focusable cloned
headers. If a visual clone is unavoidable, hide it from AT and remove any
duplicate IDs. Ensure sticky content doesn't obscure focus, headings, or the
first data row. Test at high zoom and with text-spacing overrides.

---

## Moderate: Sortable Columns

Put a native button inside each sortable column header; put `aria-sort` on
the currently-sorted `<th>` **only** (not the button, not both):

```html
<th scope="col" aria-sort="ascending">
  <button type="button">
    Last name
    <span class="sort-icon" aria-hidden="true">▲</span>
  </button>
</th>
```

When sorting changes: sort the complete dataset, not only the visible page,
unless clearly stated otherwise; move `aria-sort` to the newly sorted `<th>`;
use `ascending`/`descending`/`other` accurately; update the visible direction
indicator without depending on colour alone; keep keyboard focus on the
activated button; preserve header/data-cell associations. Do not replace the
button with a click handler on `<th>` itself.

---

## Moderate: Filtering, Search, and Result Counts

```html
<form id="employee-filters">
  <label for="department-filter">Department</label>
  <select id="department-filter" name="department">
    <option value="">All departments</option>
  </select>
  <button type="submit">Apply filters</button>
</form>
<p id="employee-results" role="status" aria-atomic="true">Showing 24 employees.</p>
```

Update the visible result count after filtering; use `role="status"` when it
changes without moving focus; keep active filters visible and
programmatically determinable; provide a clear way to remove filters; make
"No results" visible and announced. Do not announce every changed cell
through a live region. Keep the caption accurate when scope/date range changes.

---

## Moderate: Pagination and Large Datasets

Pagination is often more robust than rendering or virtualizing thousands of rows.

```html
<nav aria-label="Employees table pages">
  <a href="?page=1" aria-current="page">1</a>
  <a href="?page=2" rel="next">Next</a>
</nav>
```

Identify the current page with `aria-current="page"`; use links for
URL-based navigation, buttons for in-place state changes; preserve sort/filter
parameters; state the displayed range and total ("Rows 51 to 100 of 842");
move focus only when predictable and helpful. "Load more" controls need a
clear name, a result update, and predictable focus.

**Virtualization** (rendering only part of a dataset while scrolling) can
break find-in-page, table navigation, row counts, focus, and reading
continuity — prefer pagination when it meets the task. If virtualization is
necessary: expose accurate total row/column counts; expose correct indices
for rendered items; never recycle the focused row out from under the user;
preserve selection/editing state when items leave the DOM; keep headers
correctly associated; support zoom/text resizing/variable row height; test
continuous reading with screen readers, not just visual scrolling. Do not
claim thousands of rows are accessible merely because `aria-rowcount` is present.

---

## Serious: Row Selection and Row Actions

Do not make an entire `<tr>` an unnamed clickable control — put a real
checkbox, link, or button in a cell:

```html
<p id="select-invoice" class="visually-hidden">Select invoice</p>
<tr>
  <td><input type="checkbox" name="invoice" value="1042" aria-labelledby="select-invoice invoice-1042"></td>
  <th id="invoice-1042" scope="row">1042</th>
  <td>$1,240</td>
</tr>
```

The checkbox's computed name becomes "Select invoice 1042." Keep selected
state programmatically available and visually distinguishable without colour
alone. For repeated row actions, include the row's identifier in each
accessible name — avoid dozens of links announced only as "View" or "Edit."

---

## Serious: Forms and Editing in Tables

Every input needs a unique label including enough row/column context:

```html
<tr>
  <th scope="row">Widget A</th>
  <td>
    <label class="visually-hidden" for="widget-a-quantity">Quantity for Widget A</label>
    <input id="widget-a-quantity" name="widget-a-quantity" type="number" min="0" value="2">
  </td>
</tr>
```

Associate validation errors with the specific input; don't remove the input
from its row context on error; preserve user-entered values after
validation; make save/cancel/undo explicit; don't autosave on focus movement
unless users are warned and can recover. If users need spreadsheet-like
navigation/editing across many cells, evaluate an ARIA grid rather than
bolting ad hoc keyboard handling onto a data table.

---

## Moderate: Expandable Rows

```html
<tr>
  <th scope="row">Invoice 1042</th>
  <td>$1,240</td>
  <td>
    <button type="button" aria-expanded="false" aria-controls="invoice-1042-details">
      Show details for invoice 1042
    </button>
  </td>
</tr>
<tr id="invoice-1042-details" hidden>
  <td colspan="3">
    <h3>Invoice 1042 details</h3>
    <p>Issued 4 March 2025. Payment is due 3 April 2025.</p>
  </td>
</tr>
```

Update `aria-expanded`, button text, and `hidden` together. Keep focus on the
button unless the user's action clearly requests movement into the disclosed content.

---

## Moderate: Colour, Contrast, and Forced Colours

Zebra striping is supplemental, not sufficient on its own. Do not use row
colour as the only indication of overdue/selected/invalid/changed data — add
visible text, an icon, or a pattern. Ensure table text and required non-text
elements (focus indicators, form-control boundaries, sort/state icons) meet
applicable contrast requirements. Decorative cell borders and zebra stripes
don't automatically need 3:1.

```css
tbody tr:nth-child(even) { background: var(--table-stripe-background); }
@media (forced-colors: active) {
  th, td { border-block-end: 1px solid CanvasText; }
  .sort-icon { color: CanvasText; }
}
```

Test selected rows, invalid cells, focus, hover, sorting, and sticky headers
in every supported theme and forced-colours mode.

---

## Data Tables vs. ARIA Grids

A native `<table>` supports reading/comparison and normally doesn't place
cells in the Tab sequence — screen readers provide their own table
navigation. `role="grid"` is a composite widget creating expectations for
managed focus, arrow-key navigation, selection, editing, and exposed
row/column structure. Use a grid **only** when: users need spreadsheet-like
cell navigation/editing; the interaction model is documented and completely
implemented; only the intended cell/descendant is in the Tab sequence; arrow
keys/Home/End work predictably; row/column positions and states are
accurate; it's been tested with relevant AT. **Do not add `role="grid"` just
to make a table sound more interactive** — sort/filter buttons alone don't
make a table a grid. Prefer native `<table>`.

---

## Layout Tables — What to Do With Them

Remove and use CSS whenever practical. When a legacy layout table can't yet
be removed:

```html
<table role="presentation">
  <tr><td><!-- Layout content --></td></tr>
</table>
```

Do not use `<th>`, `<caption>`, or table-specific navigation inside it;
ensure content has a meaningful DOM order read linearly; ensure forms/
headings/lists retain their own native semantics; don't make the table
focusable or give it table-specific ARIA. `role="none"` is equivalent to
`role="presentation"` here. Treat this as temporary remediation, not a new
layout pattern.

---

## Print and Export

```css
@media print {
  thead { display: table-header-group; }
  tfoot { display: table-footer-group; }
  tr { break-inside: avoid; }
}
```

For exported PDF/spreadsheet/document/presentation files: preserve table
structure and header associations; include a title/caption; repeat headers
across pages/sheets; preserve units/filters/source/date range; explain
special values and abbreviations; test the exported format independently
with its own accessibility tools. **Accessible HTML does not guarantee an
accessible export** — test and remediate each output format separately.

---

## CMS and Framework Notes

**Drupal:** CKEditor's table plugin should be configured to require
`<caption>` and `scope` attributes. The
[Drupal Accessibility Coding Standards](https://www.drupal.org/docs/getting-started/accessibility/accessibility-coding-standards)
require WCAG 2.1 AA for contributed modules/themes.

**WordPress/other CMS:** Block editors often generate tables without
`<caption>` or `scope` — audit CMS-generated markup and configure the editor
or post-process output to add missing attributes.

**Generated tables (data-grid libraries, DataTables.js, AG Grid):** verify
the library outputs `<th scope="col">`, `<caption>`, and `<thead>` — many
don't by default. Configure or test the exact version to confirm authors can
create real header cells, captions/summaries can be added, `scope`/`headers`/
unique IDs are preserved, sanitization doesn't strip required attributes, and
exported formats preserve structure.

---

## Testing

* **Structural:** confirm the content is genuinely tabular; identify every
  row/column/row-group/column-group header; from each data cell, verify the
  headers a user needs; confirm `scope`/`headers` produces those exact
  associations; check captions, units, source, special-value definitions;
  validate IDs and `headers` references after sorting or re-rendering
* **Keyboard/visual:** operate sorting/filtering/pagination/selection/
  editing/disclosures without a pointer; confirm focus stays visible and
  doesn't move unexpectedly; scroll wide tables by keyboard; test 200%/400%
  zoom and narrow viewports; test every theme, forced colours, print, and
  exported formats
* **AT:** navigate to the table and confirm name/dimensions are useful; move
  through representative cells and verify announced headers; test grouped/
  spanned/irregular headers extensively; confirm sorting state, selected
  rows, expanded rows, input labels, errors, and result status
* **Automated:** can detect some missing headers, invalid ARIA, duplicate
  IDs, empty captions, contrast, and focus issues — usually cannot determine
  whether a cell is a header in context, whether associations express the
  intended relationship, or whether a complex table should be simplified.
  Manual cell-by-cell review remains required.

---

## Common Failures

| Failure | Correction |
|:---|:---|
| Bold `<td>` elements visually imitate headers | Use semantic `<th>` with correct associations |
| "Every `<th>` requires `scope`" stated as an absolute WCAG rule | Use explicit scope as a robust pattern where direction matters; don't misstate the criterion |
| "Every table requires a caption for conformance" stated as absolute | Use captions by default; recognize other tested associations can identify simple tables |
| `scope="colgroup"` used without a matching `<colgroup>` | Define the column groups in markup |
| `headers` values no longer match current IDs | Regenerate and validate associations from the current schema |
| Empty cells use `&nbsp;` or unexplained dashes | State zero, not applicable, missing, suppressed, or another accurate meaning |
| Responsive CSS changes all table elements to `display: block` | Preserve table semantics; use contained overflow or a real alternative view |
| Every scroll wrapper becomes a region landmark | Add a named region only when separate discovery is useful |
| `aria-sort` placed on the sort button | Put it on the currently sorted `<th>` only |
| Sorting reorders only the visible page without explanation | Sort the complete result set or clearly explain scope |
| An entire row is clickable | Put a named native link, button, or checkbox in a cell |
| Repeated controls announced only as "View"/"Edit" | Include the row identifier in each accessible name |
| `role="grid"` added without a grid keyboard model | Keep a native table, or implement the complete composite widget |
| Virtual rows disappear while they contain focus | Preserve focus and state, or use pagination |
| HTML table passes but exported PDF loses headers | Test and remediate each output format separately |

---

## Definition of Done Checklist

* [ ] Content requires row-column relationships and is not a layout table
* [ ] Every functional header is a `<th>` with the correct association
* [ ] Table has a useful name, normally via `<caption>` (or a tested alternative)
* [ ] Complex structure has a concise, discoverable explanation
* [ ] `scope`, groups, spans, IDs, and `headers` references match the current data
* [ ] Table simplified or split where complexity impedes understanding
* [ ] Empty/missing/zero/suppressed/estimated values are distinguishable
* [ ] Units, dates, currencies, and abbreviations are clear
* [ ] Wide tables scroll within a contained, keyboard-operable region
* [ ] Responsive presentation preserves table semantics or provides a real equivalent view
* [ ] Sticky headers don't duplicate semantics or obscure content
* [ ] Sort state on the correct `<th>` only; sort controls keyboard-operable
* [ ] Filtering/pagination/selection/editing/disclosures use named native controls
* [ ] Colour is not the only indication of meaning or state
* [ ] `role="grid"` used only with a complete, tested grid interaction model
* [ ] Virtualization (if used) preserves counts, positions, focus, and reading continuity
* [ ] Structure and relationships survive print and export
* [ ] Tested: NVDA+Chrome, JAWS+Chrome, VoiceOver+Safari

---

## Key WCAG Criteria

* 1.3.1 Info and Relationships (A) — **Critical if headers absent or misassociated**
* 1.3.2 Meaningful Sequence (A)
* 1.4.1 Use of Color (A)
* 1.4.3 Contrast Minimum (AA)
* 1.4.10 Reflow (AA)
* 1.4.11 Non-text Contrast (AA)
* 2.1.1 Keyboard (A)
* 2.4.3 Focus Order (A)
* 2.5.3 Label in Name (A)
* 2.5.8 Target Size Minimum (AA)
* 3.3.1 Error Identification (A) — editable tables
* 4.1.2 Name, Role, Value (A)
* 4.1.3 Status Messages (AA)

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/TABLES_ACCESSIBILITY_BEST_PRACTICES.md)
* [WAI Tables Tutorial](https://www.w3.org/WAI/tutorials/tables/)
* [WebAIM: Creating Accessible Tables](https://webaim.org/techniques/tables/data)
* [WAI-ARIA APG sortable table example](https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/)
* [WAI-ARIA APG grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
* [Drupal Accessibility Coding Standards](https://www.drupal.org/docs/getting-started/accessibility/accessibility-coding-standards)

> **Standards horizon:** These rules target WCAG 2.2 AA. No significant changes
> to table accessibility requirements are anticipated in WCAG 3.0.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
