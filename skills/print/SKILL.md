# Print Accessibility Skill

> **Canonical source**: `examples/PRINT_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when implementing or reviewing print stylesheets.
**Only load this skill if the project has print CSS in scope.**

---

## Core Mandate

Printing is an accessibility feature. Users with cognitive disabilities may
find printed material easier to process; users with low vision may enlarge it;
users without reliable internet need offline copies. Print styles must keep
content useful, readable, and free of colour-only meaning.

---

## Severity Scale (this skill)

| Level | Meaning |
|---|---|
| **Critical** | Print output is completely unusable (blank page, navigation only) |
| **Serious** | Content lost or meaning broken due to colour stripping; tables unreadable |
| **Moderate** | Orphaned headings; link URLs not revealed; layout breaks across pages |
| **Minor** | Typography not print-optimised; missing QR alternative to long URLs |

---

## Critical: Scope All Print Styles

```css
/* Preferred: single inline block */
@media print {
  /* all print styles here */
}

/* Alternative: separate file */
/* <link rel="stylesheet" href="print.css" media="print"> */
```

A site with no `@media print` block at all may print navigation, cookie banners,
and sidebars while omitting content — **Critical**.

---

## Critical: Hide Non-Essential Elements

```css
@media print {
  nav, header nav, footer, aside, .sidebar,
  .cookie-banner, .skip-link, .ad, .social-share,
  .print-hide, video, audio, iframe,
  [role="complementary"],
  form button[type="submit"]:not(.print-show) {
    display: none !important;
  }
}
```

Utility classes:
* `.print-hide` — elements to suppress in print only
* `.print-show` — elements hidden on screen but needed in print (e.g., postal address)

---

## Serious: Colour Dependence in Print

When browsers print with backgrounds off (the default in most browsers), any
information conveyed via background colour is lost. This is **Serious** for
data tables or status indicators that use colour alone.

```css
/* Add a text fallback for colour-coded states */
@media print {
  .status-error::after   { content: " [Error]"; }
  .status-success::after { content: " [OK]"; }
  .status-warning::after { content: " [Warning]"; }
}
```

For table cells with coloured backgrounds, ensure the cell already contains
a text label — do not rely on background colour to convey meaning.
Force-print backgrounds only when the SVG/image requires it:

```css
@media print {
  .required-background {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

---

## Serious: Reveal Link URLs

Printed links are dead without the URL. **Missing URL expansion is Serious**
for content-heavy pages where links carry information.

```css
@media print {
  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 0.875em;
    color: #333;
    word-break: break-all;
  }
  /* Suppress non-informative and internal links */
  a[href^="#"]::after,
  a[href^="javascript:"]::after,
  a[href].no-print-url::after {
    content: "";
  }
}
```

For pages with many long URLs, consider providing QR codes as an alternative.
A QR code adjacent to key links is printable, scannable, and avoids long URL
wrapping issues:

```html
<!-- Print-only QR code linking to the page -->
<img src="/qr/this-page.png"
     alt="QR code linking to this page online"
     class="print-show">
```

---

## Moderate: Print Typography

```css
@media print {
  body {
    font-family: Georgia, "Times New Roman", Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    color: #000;
    background: #fff;
  }
  h1 { font-size: 22pt; }
  h2 { font-size: 18pt; }
  h3 { font-size: 14pt; }
  p, li, td, th {
    font-size: 11pt;
    orphans: 3; /* Minimum lines at bottom of page */
    widows: 3;  /* Minimum lines at top of next page */
  }
}
```

Use serif typefaces for body text — they are conventionally more readable
in print. Use `pt` units for font sizes in print stylesheets. Set `orphans`
and `widows` to prevent isolated single lines.

---

## Moderate: Page Setup

```css
@page {
  margin: 2cm; /* Minimum for most printers; leave more for bound documents */
}
@page :first {
  margin-top: 3cm;
}
```

Avoid specifying `size: A4` unless the document is specifically designed for A4.
US readers use Letter (8.5×11in). Omit `size` and let the printer/user decide,
or document the choice explicitly.

---

## Moderate: Page Break Control

```css
@media print {
  h1, h2, h3 {
    page-break-after: avoid;
    break-after: avoid;   /* Modern equivalent */
  }
  figure, img, table, pre, blockquote {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .page-break-before {
    page-break-before: always;
    break-before: always;
  }
}
```

---

## Moderate: Tables

```css
@media print {
  table { border-collapse: collapse; width: 100%; }
  th, td {
    border: 1px solid #333;
    padding: 4pt;
    text-align: left;
  }
  thead { display: table-header-group; } /* Repeat header on each page */
  tr { page-break-inside: avoid; }
}
```

`thead { display: table-header-group }` is the most important table rule for
accessibility — without it, column headers only appear on the first page, making
multi-page tables unreadable. **Missing this is Serious for data-heavy tables.**

---

## Moderate: Images

```css
@media print {
  img {
    max-width: 100% !important;
    page-break-inside: avoid;
  }
  /* Ensure PNG images with transparency render on white */
  img {
    background: #fff;
  }
}
```

---

## Definition of Done Checklist

* [ ] All print styles scoped in `@media print`
* [ ] Nav, footer, ads, interactive widgets hidden
* [ ] Colour-coded states have text fallbacks in print (`.status-error::after` etc.)
* [ ] Link URLs revealed via `::after` (fragment and `javascript:` links suppressed)
* [ ] Long URLs: QR code alternative considered
* [ ] Serif body font, `pt` units, `12pt` base size, `orphans`/`widows` set
* [ ] `@page` margins defined (at least 2cm); `size` omitted or documented
* [ ] Headings: `break-after: avoid`
* [ ] Figures and tables: `break-inside: avoid`
* [ ] `thead { display: table-header-group }` for multi-page tables
* [ ] Tested using browser Print Preview: Chrome, Firefox, Safari

---

## Key WCAG Criteria

* 1.3.1 Info and Relationships (A) — structure preserved in print
* 1.4.1 Use of Color (A) — **Serious if colour-only meaning lost when backgrounds stripped**
* 1.4.3 Contrast Minimum (AA) — text readable on white paper
* 2.4.4 Link Purpose (AA) — URLs exposed for printed links

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/PRINT_ACCESSIBILITY_BEST_PRACTICES.md)
* [MDN: @media print](https://developer.mozilla.org/en-US/docs/Web/CSS/@media#media_types)
* [MDN: print-color-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/print-color-adjust)
* [MDN: orphans / widows](https://developer.mozilla.org/en-US/docs/Web/CSS/orphans)

> **Standards horizon:** These rules target WCAG 2.2 AA. No significant
> changes anticipated for print accessibility in WCAG 3.0.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
