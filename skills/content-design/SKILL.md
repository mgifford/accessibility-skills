---
name: content-design
description: >
  Load this skill whenever writing, editing, or reviewing any web content,
  copy, headings, labels, error messages, or instructions. Under no
  circumstances write inaccessible content — every piece of text must be
  clear, structured, and usable by people with cognitive, visual, and language
  differences. Absolutely always apply plain language, logical heading
  hierarchy, and meaningful link text.
---

# Content Design Accessibility Skill

> **Canonical source**: `examples/CONTENT_DESIGN_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when writing, editing, or reviewing any web content.

---

## Core Mandate

A technically accessible page that is confusing or poorly structured still creates
barriers. Design content for the widest possible audience: write clearly, structure
logically, and present information in the order users need it.

---

## Severity Scale (this skill)

| Level | Meaning |
| --- | --- |
| **Critical** | Content is completely inaccessible or incomprehensible to a disability group |
| **Serious** | Significant barrier; unreasonable to expect workaround |
| **Moderate** | Creates friction; workaround exists and is not too burdensome |
| **Minor** | Best-practice gap; marginal impact |

---

## Critical: Images Must Have Appropriate Text Alternatives

A meaningful image with no `alt` attribute or `alt=""` is **Critical** —
blind users receive no information. A decorative image with descriptive `alt` is
**Moderate** — it adds noise but does not block information.

* Meaningful images: `alt` text that conveys purpose, not appearance
* Decorative images: `alt=""` (empty string — the attribute must still be present)

---

## Serious: All Link Text Must Make Sense Out of Context

"Click here", "Read more", and "Learn more" are **Serious** — screen reader
users navigate by links and hear them without surrounding context.

```html
<!-- Serious issue -->
<a href="/report">Read more</a>

<!-- Good -->
<a href="/report">2024 Accessibility Annual Report</a>
```

For document links, include file type and size:

```html
<a href="/report.pdf">2024 Annual Report (PDF, 2.3 MB)</a>
```

Warn users when links open in new tabs:

```html
<a href="/report" target="_blank">
  Annual Report
  <span class="visually-hidden">(opens in new tab)</span>
</a>
```

---

## Serious: Heading Hierarchy Must Be Logical

Skipping heading levels is **Moderate**; having no `<h1>` or using headings
purely for visual styling is **Serious** — screen reader users rely on headings
for page navigation.

* One `<h1>` per page describing the page's main purpose
* Logical hierarchy: `h1` → `h2` → `h3` (do not skip levels)
* Headings must be descriptive and unique — not "Introduction" alone

---

## Moderate: Plain Language

Overly complex language is **Moderate** — it creates real barriers for users
with cognitive disabilities and low literacy, but the content is technically
still present.

* Common words, short sentences, active voice
* Target Grade 8 reading level or lower for general audiences
* Define technical terms inline; spell out abbreviations on first use
* Front-load key information — most important point first
* Avoid double negatives and conditional stacking
* Run a readability checker before publishing; target Flesch-Kincaid Grade 8 or lower

---

## Moderate: Tables

* Use only for genuinely tabular data — never for layout (**Critical** if layout table has no `role="presentation"`)
* `<caption>` or heading explaining what the table contains
* Header cells marked with `<th scope="col">` or `<th scope="row">`

**Missing `scope` on a simple table is Moderate**; missing it on a complex table
with multiple header rows is **Serious**.

---

## Moderate: Page Structure

* Use lists for three or more parallel items (not embedded in prose)
* Short paragraphs: 3–5 sentences maximum
* Inverted pyramid: most critical content at top

---

## Moderate: Forms — Writing Requirements

* Write form instructions before the form
* Label fields with what the user needs to enter
* Provide format examples for unusual inputs: `Date: DD/MM/YYYY`
* Error messages must describe the problem and the fix

(For code-level form requirements, also load `skills/forms/SKILL.md`.)

---

## Minor: Writing Style Details

* Active voice preferred: "The form saves your data" not "Your data is saved"
* Present tense where possible
* Gender-neutral and inclusive language throughout
* Consistent terminology: one term per concept across the site
* Unique, descriptive page `<title>` elements

---

## Definition of Done Checklist

* [ ] Reading level checked (Grade 8 or lower for general audiences)
* [ ] One `<h1>`, logical heading hierarchy, no skipped levels
* [ ] All link text descriptive out of context
* [ ] Document links include file type and size
* [ ] New-tab links warn the user
* [ ] All images have appropriate `alt` (meaningful description or empty for decorative)
* [ ] Tables use `<caption>` and `<th scope="…">`
* [ ] Consistent terminology across the page/site
* [ ] Unique, descriptive page title

---

## Key WCAG Criteria

* 1.1.1 Non-text Content (A) — **Critical if meaningful images lack alt**
* 1.3.1 Info and Relationships (A)
* 2.4.4 Link Purpose in Context (AA) — **Serious if links are ambiguous**
* 2.4.6 Headings and Labels (AA)
* 2.4.2 Page Titled (A)
* 3.1.5 Reading Level (AAA — target for general audiences)

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/CONTENT_DESIGN_ACCESSIBILITY_BEST_PRACTICES.md)
* [Plain Language Guidelines (digital.gov)](https://digital.gov/guides/plain-language)
* [Hemingway Editor — readability tool](https://hemingwayapp.com/)

> **Standards horizon:** WCAG 3.0 is in development. Content design
> requirements are not expected to change substantially.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
