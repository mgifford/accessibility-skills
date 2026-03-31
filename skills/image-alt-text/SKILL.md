---
name: image-alt-text
description: >
  Load this skill whenever the project contains <img> elements, inline SVGs
  used as content images, CSS background images that convey meaning, or icon
  fonts. Under no circumstances omit alt text on meaningful images. Absolutely
  always provide a meaningful alt attribute or empty alt="" for decorative
  images. Apply WCAG 2.2 SC 1.1.1 — every non-text element requires a text
  alternative.
---

# Image Alt Text Accessibility Skill

> **Canonical source**: `examples/IMAGE_ALT_TEXT_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when creating, reviewing, or auditing any page containing images.
**Only load this skill if the project contains `<img>` elements, inline SVG images used as content, or CSS background images that may convey meaning.**

---

## Core Mandate

WCAG 2.2 Success Criterion 1.1.1 — Non-text Content (Level A): every non-text element must have a text alternative conveying the same meaning and purpose. There are no exceptions for decorative images — those require an explicit empty `alt` attribute.

Automated tools can flag missing alt text, but only human judgment can determine whether alt text is _meaningful_ and _appropriate_ for the context.

---

## Severity Scale (this skill)

| Level | Meaning |
| --- | --- |
| **Critical** | Image conveying essential meaning has no `alt` attribute, or `alt` is entirely absent |
| **Serious** | Functional image (button/link) has no text alternative, preventing keyboard/screen reader use |
| **Moderate** | Alt text is present but inaccurate, redundant ("image of…"), or missing meaningful context |
| **Minor** | Alt text is slightly verbose or could be improved but does not prevent understanding |

---

## The Alt Text Decision Tree

Use this flowchart (based on the [W3C WAI Images Tutorial](https://www.w3.org/WAI/tutorials/images/decision-tree/)):

```
Does the image contain text?
├── YES → Use the same text as the alt attribute (unless decorative/logo)
└── NO
    └── Is the image used for a functional purpose (link, button)?
        ├── YES → Describe the destination/action (e.g., "Go to homepage")
        └── NO
            └── Does the image convey information not present in surrounding text?
                ├── YES
                │   └── Is the image complex (chart, diagram, graph)?
                │       ├── YES → Provide a short alt + long description in nearby text
                │       └── NO  → Write a concise description of the content and meaning
                └── NO
                    └── Is the image purely decorative or redundant?
                        ├── YES → Use empty alt: alt=""
                        └── NO  → Re-evaluate — the image likely carries meaning
```

---

## Image Categories and Requirements

### Informative Images

Images that convey information not expressed in surrounding text.

```html
<!-- DO: Describe the meaning/content -->
<img src="quarterly-growth.png" alt="Bar chart showing 23% revenue growth in Q3 2024">

<!-- DON'T: Describe visual appearance only -->
<img src="quarterly-growth.png" alt="Blue and green bar chart">

<!-- DON'T: Use file names or generic labels -->
<img src="quarterly-growth.png" alt="quarterly-growth.png">
<img src="quarterly-growth.png" alt="image">
```

### Decorative Images

Images that are purely aesthetic and add no information beyond what the page text already provides.

```html
<!-- DO: Empty alt for decorative images -->
<img src="decorative-divider.png" alt="">

<!-- DO: aria-hidden for inline SVG decorations -->
<svg aria-hidden="true" focusable="false">...</svg>

<!-- DON'T: Omit alt entirely — screen readers announce the filename -->
<img src="decorative-divider.png">

<!-- DON'T: Use "decorative" or "spacer" as alt text -->
<img src="decorative-divider.png" alt="decorative">
```

**When is an image truly decorative?** Only if it is purely aesthetic (border, texture, flourish), adds no information beyond surrounding text, and removing it would not affect a user's understanding.

**If you are debating whether an image is decorative, it probably is not.** When in doubt, provide alt text. The cost of unnecessary alt text is low; the cost of missing alt text can be complete loss of meaning.

### Functional Images

Images that are the only content of a link or button.

```html
<!-- DO: Describe the link destination -->
<a href="/home">
  <img src="logo.svg" alt="Go to homepage">
</a>

<!-- DO: Describe the button action -->
<button>
  <img src="search-icon.svg" alt="Search">
</button>

<!-- DO: Use aria-label on the button, empty alt on the image -->
<button aria-label="Search">
  <img src="search-icon.svg" alt="">
</button>

<!-- DON'T: Leave functional images with empty alt (creates unlabelled control) -->
<button>
  <img src="search-icon.svg" alt="">
  <!-- Missing accessible name — use aria-label on the button instead -->
</button>
```

### Complex Images

Charts, graphs, diagrams, maps, and infographics where a short alt cannot convey all information.

```html
<!-- Pattern 1: Alt summary + adjacent long description -->
<figure>
  <img
    src="accessibility-adoption-chart.png"
    alt="Line chart: WCAG AA adoption rose from 38% in 2020 to 67% in 2024"
    aria-describedby="chart-desc">
  <figcaption id="chart-desc">
    Annual WCAG 2.1 Level AA adoption rates from 2020 to 2024 across a sample
    of 10,000 public websites. Adoption grew steadily from 38% (2020) to 67%
    (2024), driven by increased procurement requirements.
  </figcaption>
</figure>
```

### Images of Text

```html
<!-- DO: Reproduce the exact text in the alt attribute -->
<img src="sale-banner.png" alt="Summer Sale: 50% off all items through July 31">

<!-- DON'T: Describe that it is text -->
<img src="sale-banner.png" alt="Sale banner showing promotional text">
```

Prefer actual text over images of text whenever possible (WCAG 1.4.5).

### Groups of Images

When multiple images work together to convey a single piece of information (e.g., a star rating):

```html
<!-- Star rating: 4 out of 5 stars — only the first image needs meaningful alt -->
<img src="star-filled.png" alt="Rating: 4 out of 5 stars">
<img src="star-filled.png" alt="">
<img src="star-filled.png" alt="">
<img src="star-filled.png" alt="">
<img src="star-empty.png" alt="">
```

### Linked Images with Adjacent Text

When an image and text are together inside the same link:

```html
<!-- DO: Empty alt when link text describes the destination -->
<a href="/articles/accessibility-guide">
  <img src="accessibility-thumbnail.jpg" alt="">
  <span>The Complete Accessibility Guide</span>
</a>

<!-- DON'T: Duplicate the link text in alt -->
<a href="/articles/accessibility-guide">
  <img src="accessibility-thumbnail.jpg" alt="The Complete Accessibility Guide">
  The Complete Accessibility Guide
</a>
```

---

## Writing Quality Alt Text

1. **Be concise but complete.** Aim for 125 characters or fewer for simple images; use long descriptions for complex images.
2. **Describe content and purpose, not appearance.** "Person in a wheelchair using a laptop" is more useful than "image of a person".
3. **Context is everything.** The same image can have different alt text depending on how it is used.
4. **Do not start with "Image of", "Picture of", or "Photo of".** Screen readers already announce that they are reading an image.
5. **Avoid keyword stuffing.** Alt text serves users, not search engines.
6. **Include text that appears within the image.**
7. **Match the level of detail to the image's role.**

---

## Common Bad Alt Text Patterns (Critical/Serious to flag and fix)

### Missing or absent `alt` attribute — Critical

```html
<!-- WRONG: Screen reader reads the filename -->
<img src="Q3-revenue-chart-final-v2.png">

<!-- RIGHT -->
<img src="Q3-revenue-chart-final-v2.png"
     alt="Bar chart: Q3 2024 revenue reached $4.2M, up 18% from Q2">
```

### Filename or CMS-injected alt text — Serious

```html
<!-- WRONG -->
<img src="golden-retriever.jpg" alt="golden-retriever.jpg">
<img src="dog.png" alt="This image has an empty alt attribute; its file name is dog.png">
```

### Generic single-word placeholders — Serious

The following values are flagged as errors by multiple accessibility checkers:

```html
<!-- WRONG -->
<img src="photo.jpg" alt="image">
<img src="photo.jpg" alt="photo">
<img src="photo.jpg" alt="graphic">
<img src="photo.jpg" alt="chart">
<img src="photo.jpg" alt="alt">
<img src="spacer.gif" alt="spacer">     <!-- use alt="" instead -->
<img src="divider.png" alt="decorative"> <!-- use alt="" instead -->
```

### Draft/placeholder text — Serious

```html
<!-- WRONG -->
<img src="portrait.jpg" alt="TBD">
<img src="portrait.jpg" alt="TODO">
<img src="portrait.jpg" alt="placeholder">
<img src="portrait.jpg" alt="null">
<img src="portrait.jpg" alt="undefined">
```

### "Type" prefix phrases — Moderate

```html
<!-- WRONG: Redundant medium prefix -->
<img src="team-photo.jpg" alt="Image of the team">
<img src="team-photo.jpg" alt="Photo of team members">

<!-- RIGHT -->
<img src="team-photo.jpg" alt="The Civic Innovations team of 12 staff gathered outside City Hall">
```

### Alt text that duplicates a figcaption — Moderate

```html
<!-- WRONG: Screen reader announces the text twice -->
<figure>
  <img src="annual-report-cover.jpg"
       alt="2024 Annual Report cover showing the city skyline at dusk">
  <figcaption>2024 Annual Report cover showing the city skyline at dusk</figcaption>
</figure>

<!-- RIGHT: Caption fully describes — use empty alt -->
<figure>
  <img src="annual-report-cover.jpg" alt="">
  <figcaption>2024 Annual Report cover showing the city skyline at dusk</figcaption>
</figure>
```

### Name-only alt for person portraits — Moderate

```html
<!-- POOR: Name only -->
<img src="j-smith.jpg" alt="J Smith">

<!-- BETTER: Include role and context -->
<img src="j-smith.jpg"
     alt="Dr. Jane Smith, Chief Medical Officer, presenting at the 2024 health summit">
```

---

## CSS Background Images

CSS `background-image` does not support `alt` text. Use only for decorative purposes.

```css
/* OK: Decorative pattern */
.hero { background-image: url('geometric-pattern.svg'); }
```

```html
<!-- NOT OK: Meaningful image as CSS background (invisible to screen readers) -->
<div style="background-image: url('award-badge.png')"></div>

<!-- DO: Use <img> for meaningful images -->
<img src="award-badge.png" alt="Winner: Best Accessibility Tool 2024">
```

---

## Automated vs. Human Testing

| Automated tools can detect | Requires human review |
| --- | --- |
| Missing `alt` attribute | Whether alt text is meaningful |
| Empty alt on functional images | Whether alt text matches context |
| Alt text that equals the file name | Whether a decorative image actually needs alt text |
| Suspicious prefix phrases ("image of") | Whether the description conveys the right meaning |
| Known placeholder values ("TBD", "null") | Whether content-author intent was decorative or informative |
| Alt text identical to adjacent figcaption | Whether the alt or the caption should be kept |

Automated tools such as axe-core detect structural issues. Human review is always required to evaluate quality.

---

## Definition of Done Checklist

- [ ] Every `<img>` element has an `alt` attribute (even decorative images use `alt=""`)
- [ ] Decorative images use `alt=""` and are confirmed to add no meaning
- [ ] Functional images (links, buttons) describe the action or destination
- [ ] Alt text does not begin with "image of", "picture of", or "photo of"
- [ ] Alt text does not repeat the file name or generic label ("image", "photo", "graphic", "chart")
- [ ] Alt text is not a draft placeholder ("TBD", "TODO", "null", "none", "undefined", "placeholder")
- [ ] Alt text is not a machine-generated code or CMS-injected message
- [ ] Complex images (charts, diagrams) have both a short alt and a long description
- [ ] Images of text reproduce the exact text in the `alt` attribute
- [ ] Grouped images convey combined meaning via one image's alt (others are `alt=""`)
- [ ] Linked images with adjacent link text use `alt=""` on the image
- [ ] Figures with a `<figcaption>` do not duplicate the caption verbatim in the `alt`
- [ ] Portrait images include the person's role and context, not just their name
- [ ] CSS background images are decorative (meaningful images use `<img>`)
- [ ] Alt text has been reviewed in context, not just in isolation
- [ ] Alt text has been tested with a screen reader (NVDA + Firefox or VoiceOver + Safari)

---

## Key WCAG Criteria

* 1.1.1 Non-text Content (A) — **Critical if any meaningful image has no text alternative**
* 1.4.5 Images of Text (AA) — prefer real text over images of text
* 1.4.9 Images of Text (No Exception) (AAA)
* 4.1.2 Name, Role, Value (A) — all UI components have accessible names and roles

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/IMAGE_ALT_TEXT_ACCESSIBILITY_BEST_PRACTICES.md)
* [W3C WAI — Images Tutorial and Decision Tree](https://www.w3.org/WAI/tutorials/images/decision-tree/)
* [WCAG 2.2 — 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
* [WebAIM — Writing Effective Alt Text](https://webaim.org/techniques/alttext/)
* [Sa11y](https://sa11y.netlify.app/) — flags suspicious alt text patterns
* [Editoria11y](https://editoria11y.princeton.edu/) — CMS-focused alt text checking
* [axe-core rules: `image-alt`, `image-redundant-alt`, `input-image-alt`, `area-alt`, `object-alt`](https://github.com/dequelabs/axe-core)
