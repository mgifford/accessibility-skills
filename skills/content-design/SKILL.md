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

Content design and accessibility are inseparable. A technically accessible page that
is confusing or poorly structured still creates barriers. Design content for the
widest possible audience: write clearly, structure logically, and present
information in the order users need it.

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

* Every informative image needs meaningful alt text that conveys its purpose, not
  just its appearance
* Decorative images: `alt=""` (empty string — the attribute must still be present)
* Do not rely on images alone to convey information; support visual content with
  accompanying text
* Charts and graphs must be accompanied by a text summary or accessible data table
  (see `skills/charts-graphs/SKILL.md`)
* For diagram-specific guidance, see `skills/svg/SKILL.md`

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

Use consistent terminology: if a concept is called "accessibility statement" in
one place, do not call it "a11y disclosure" somewhere else.

---

## Serious: Heading Hierarchy Must Be Logical

Skipping heading levels is **Moderate**; having no `<h1>` or using headings
purely for visual styling is **Serious** — screen reader users rely on headings
for page navigation.

* One `<h1>` per page describing the page's main purpose
* Logical hierarchy: `h1` → `h2` → `h3` (do not skip levels)
* Headings must be descriptive and unique — not "Introduction" or "Overview" alone
* Write headings as statements or clear topic labels, not questions (unless FAQ
  format is appropriate)
* Navigation labels, button text, and form labels must be descriptive and
  unambiguous out of context

---

## Moderate: Plain Language

Overly complex language is **Moderate** — it creates real barriers for users
with cognitive disabilities and low literacy, but the content is technically
still present.

* Common words, short sentences, active voice
* Target Grade 8 reading level or lower for general audiences
* Avoid jargon, acronyms on first use, and insider terminology unless the
  audience requires it
* Define technical terms inline; spell out abbreviations on first use
* Front-load key information — most important point first
* Use the second person ("you") to speak directly to the reader
* Avoid double negatives and conditional stacking — write "Complete all required
  fields to proceed" instead of "You can only proceed if you have not failed to
  complete the required fields"
* Prefer short, concrete words over long, abstract ones ("use" instead of
  "utilize")
* Run a readability checker before publishing; target Flesch-Kincaid Grade 8 or
  lower for general audiences

---

## Moderate: Tables

* Use only for genuinely tabular data — never for layout (**Critical** if layout
  table has no `role="presentation"`)
* `<caption>` or heading explaining what the table contains
* Header cells marked with `<th scope="col">` or `<th scope="row">`
* Keep tables simple; avoid merging cells unless necessary
* Provide a text summary for complex tables

**Missing `scope` on a simple table is Moderate**; missing it on a complex table
with multiple header rows is **Serious**. (For code-level table requirements, also
load `skills/tables/SKILL.md`.)

---

## Moderate: Page and Content Structure

* Use lists for three or more parallel items (not embedded in dense prose)
* Short paragraphs: 3–5 sentences maximum; one idea per paragraph
* Inverted pyramid: most critical content at top
* Use white space generously

---

## Moderate: Forms — Writing Requirements

* Write form instructions before the form, not inside it
* Label fields with what the user needs to enter, not how the system stores it
* Provide format examples for unusual inputs: `Date: DD/MM/YYYY`
* Error messages must describe the problem and the fix — avoid system error codes

(For code-level form requirements, also load `skills/forms/SKILL.md`.)

---

## Moderate: Cognitive Accessibility

* Supplement complex content with summaries, key takeaways, or "what you need to
  know" sections
* Break long processes into numbered steps
* Use examples and analogies to explain abstract concepts
* Avoid time-pressured content presentation where possible
* Provide enough context so users can understand content without relying on
  memory of prior sections

---

## Minor: Writing Style Details

* Active voice preferred: "The form saves your data" not "Your data is saved"
* Present tense where possible
* Gender-neutral and inclusive language throughout
* Consistent terminology: one term per concept across the site; maintain a
  content style guide and a defined voice/tone applied consistently
* Unique, descriptive page `<title>` elements
* Review content periodically to remove outdated, misleading, or contradictory
  information

---

## Minor: Content for Diverse Audiences

* Assume a broad audience that includes people with cognitive, learning, and
  language differences
* Provide content in more than one format where feasible (e.g., video summary
  alongside written guidance)
* Consider whether translations or Easy Read versions are appropriate
* Avoid idioms, metaphors, or culturally specific references that may not
  translate

---

## Testing and Review

* Read content aloud to check for clarity and natural flow
* Have someone unfamiliar with the topic review it before publishing
* Test page navigation with keyboard only and confirm headings convey structure
* Use a screen reader to verify the content makes sense in linear reading order
* Check that all links are descriptive and functional
* Run a readability score on key pages and track it over time

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
* [ ] Reviewed by someone outside the team

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
* [Canada.ca Content Style Guide](https://design.canada.ca/style-guide/)
* [GOV.UK Style Guide](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/)
* [California ODI Content Design Guide](https://hub.innovation.ca.gov/content-design/odi-style-guide/)
* [ONS Content Guide: Structuring Content](https://service-manual.ons.gov.uk/content/writing-for-users/structuring-content)

> **Standards horizon:** WCAG 3.0 is in development. Content design
> requirements are not expected to change substantially.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
