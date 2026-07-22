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

WCAG 2.2 SC 1.1.1 Non-text Content (A): every non-text element must have a text
alternative serving the equivalent purpose. There is no exception for
decorative images — they require an explicit empty `alt=""`. Alternative text
is determined by the image's purpose in its specific context, not by the file
alone: the same asset may need different alt text, or none, in different uses.

Never invent details — do not guess a person's identity, race, ethnicity,
gender, disability, diagnosis, religion, age, or emotion from appearance.
Automated tools detect structural problems (missing `alt`); only human
judgment can determine whether alt text is meaningful, accurate, and
appropriate for the context.

---

## Severity Scale (this skill)

| Level | Meaning |
| --- | --- |
| **Critical** | Image conveying essential meaning has no `alt` attribute, or `alt` is entirely absent |
| **Serious** | Functional image (button/link) has no text alternative, preventing keyboard/screen reader use |
| **Moderate** | Alt text is present but inaccurate, redundant ("image of…"), or missing meaningful context |
| **Minor** | Alt text is slightly verbose or could be improved but does not prevent understanding |

---

## The Alt Text Decision Process

Ask in order, for each use of an image (not the asset generically):

1. **Is the image the only content naming a link, button, or control?** →
   provide a name for the action/destination.
2. **Does the image contain text that matters here?** If the same words are
   already available as nearby real text, use `alt=""`; otherwise include the
   necessary words in the alternative.
3. **Does the image add information, meaning, identity, state, instruction, or
   an intended impression?** Simple image → concise alternative. Complex image
   → short identification plus an accessible detailed equivalent.
4. **Is all the image's relevant information already provided nearby?** → `alt=""`.
5. **Is the image purely decorative or only visual formatting?** → `alt=""`.
6. **Still unclear?** Clarify why the image is present before publishing —
   don't guess.

WCAG does not prescribe a universal character limit — use the shortest
alternative that communicates the necessary purpose, and move substantial or
structured information into visible page content instead of a long `alt`.

**If you are debating whether an image is decorative, it probably is not** —
the cost of unnecessary alt text is low; the cost of missing alt text can be
complete loss of meaning.

---

## Critical: Informative Images

An informative image contributes meaning not already available in nearby text.

```html
<!-- DO: Describe the meaning/content -->
<img src="quarterly-growth.png" alt="Bar chart showing 23% revenue growth in Q3 2024">

<!-- DON'T: Describe visual appearance only, or use filenames/generic labels -->
<img src="quarterly-growth.png" alt="Blue and green bar chart">
<img src="quarterly-growth.png" alt="quarterly-growth.png">
<img src="quarterly-growth.png" alt="image">
```

Context changes the alternative — the same asset can need different alt text:

```html
<!-- Adoption profile: identity and appearance are relevant -->
<img src="buddy.jpg" alt="Buddy, a golden retriever with a red collar">

<!-- Article already states Buddy is a golden retriever with a red collar -->
<img src="buddy.jpg" alt="">

<!-- Training article: the depicted action is relevant -->
<img src="buddy.jpg" alt="Buddy waits beside his handler before crossing the street">
```

A literal visual description is appropriate when appearance itself is the
information (art history, product comparison, design critique).

---

## Moderate: Decorative and Redundant Images

Only truly decorative if purely aesthetic, adds no information beyond
surrounding text, and removing it wouldn't affect understanding.

```html
<!-- DO -->
<img src="decorative-divider.png" alt="">
<svg aria-hidden="true" focusable="false">...</svg>

<!-- DON'T: omit alt entirely (AT may expose the filename) -->
<img src="decorative-divider.png">
<!-- DON'T: describe that it's decorative -->
<img src="decorative-divider.png" alt="decorative">
```

For `<img>`, prefer `alt=""` over `role="presentation"`. Do not use
`aria-hidden="true"` to conceal an image that provides information or a
control name. An unnecessary description is not harmless — it interrupts
reading order and makes navigation more tiring.

---

## Serious: Functional Images

Images that are the only content of a link or control must describe the
action/destination, not the icon's shape.

```html
<!-- Image-only link -->
<a href="/"><img src="acme-logo.svg" alt="Acme home"></a>

<!-- Image plus redundant link text: make the image decorative -->
<a href="/reports/annual">
  <img src="report-cover.jpg" alt="">
  <span>2026 annual report</span>
</a>

<!-- Icon-only button: name goes on the control -->
<button type="button" aria-label="Close dialog">
  <img src="close.svg" alt="">
</button>

<!-- Image submit button: alt IS the control name -->
<input type="image" src="submit-order.png" alt="Submit order">
```

If the control has a visible text label, the accessible name must contain
that visible text (supports speech input, required by WCAG 2.5.3 Label in
Name). Prefer a normal `<button>` with real text over `<input type="image">`
when possible.

**Leaving a functional image with empty `alt` and no other accessible name
creates an unlabelled control — Serious.**

---

## Moderate: Complex Images

Charts, diagrams, maps, and infographics need two parts: a short alternative
identifying the image and its purpose/main conclusion, plus a visible detailed
equivalent (description, data table, ordered steps) that preserves values,
labels, units, trends, comparisons, and relationships.

```html
<figure>
  <img src="revenue-trend.png"
       alt="Line chart showing revenue rising each quarter in 2025. Data table follows.">
  <figcaption>
    <p>Revenue increased from $1.2 million in Q1 to $2.1 million in Q4.</p>
    <table>
      <caption>Quarterly revenue for 2025</caption>
      <thead><tr><th scope="col">Quarter</th><th scope="col">Revenue</th></tr></thead>
      <tbody>
        <tr><th scope="row">Q1</th><td>$1.2 million</td></tr>
        <tr><th scope="row">Q4</th><td>$2.1 million</td></tr>
      </tbody>
    </table>
  </figcaption>
</figure>
```

Prefer descriptions visible to everyone over `aria-describedby` alone —
content referenced by `aria-describedby` is commonly exposed as a single
description and can lose headings, tables, and other structure. Do not rely
on the obsolete `longdesc` attribute. See `skills/charts-graphs/SKILL.md` and
`skills/maps/SKILL.md` for domain-specific guidance.

---

## Moderate: Images of Text

Prefer real HTML text over images of text (WCAG 1.4.5) — real text resizes,
reflows, adapts to user colors, and translates more reliably.

```html
<!-- Reproduce the exact important words -->
<img src="sale-banner.png" alt="Summer sale: 50% off through July 31">

<!-- If the same message already appears as real text nearby -->
<img src="sale-banner.png" alt="">
<p><strong>Summer sale:</strong> 50% off through July 31.</p>
```

For a poster or scanned notice with substantial text, put the full text as
visible page content and let `alt` identify the image. Logotypes are
essential images of text under 1.4.5 but still need an alternative — usually
the organization/product name, plus "home" when a logo is the only content of
a home-page link.

---

## Moderate: Figures and Captions

`<figcaption>` does not justify omitting `alt` from an informative `<img>`.
Choose the relationship deliberately: if the caption already gives the full
equivalent, use `alt=""`; if the image adds information beyond the caption,
make `alt` complementary; if the caption is a title/credit/commentary rather
than an equivalent, the image still needs its own alternative. Do not copy the
same sentence into both. Do not put copyright/licensing/photo-credit
information only in `alt` — keep it visible.

---

## Minor: Groups, Responsive Images, and Image Maps

**Groups:** when multiple images express one value (e.g., a star rating),
give the combined value once and mark repeated units `alt=""` or `aria-hidden`:

```html
<img src="star-filled.png" alt="Rating: 4 out of 5 stars">
<img src="star-filled.png" alt="">
<img src="star-empty.png" alt="">
```

**Responsive images:** place `alt` on the fallback `<img>` inside `<picture>`,
never on `<source>`. Every responsive source must communicate substantially
the same information — if art direction changes the image's meaning, one
shared alternative may no longer be accurate.

**Image maps:** give the `<img>` an alt describing overall context, and give
each `<area>` its own `alt` describing its destination/action.

```html
<img src="campus-map.png" alt="Campus buildings" usemap="#campus-buildings">
<map name="campus-buildings">
  <area shape="rect" coords="20,30,120,100" href="/library" alt="Central Library">
</map>
```

For inline SVG, see `skills/svg/SKILL.md`. For `<canvas>`, provide equivalent
fallback content and keyboard-operable alternatives — `aria-label` alone
cannot replace complex canvas content.

---

## Writing Quality Alt Text

1. Be concise but complete — aim for ~125 characters for simple images; use
   long descriptions for complex ones
2. Describe content and purpose, not appearance — but include the medium
   (photo/painting/screenshot) when it changes meaning, source, or interpretation
3. Context is everything — the same image can need different alt text
   depending on use; author per-context, not once per asset
4. Do not start with "Image of", "Picture of", or "Photo of" *unless the
   medium itself matters* — there is no universal wording ban
5. Avoid keyword stuffing, filenames, and SEO/marketing phrases — alt text
   serves users, not search engines
6. Include important text that appears within the image
7. Use a person's name only when identity is known, relevant, and appropriate
   to publish; describe a visible characteristic only when it serves the
   purpose — do not infer race, disability, emotion, or other sensitive attributes
8. Write in the page's language with normal capitalization/punctuation so
   synthesized speech and Braille are understandable

---

## Common Bad Alt Text Patterns

| Pattern | Severity | Fix |
| --- | --- | --- |
| Missing `alt` on an informative `<img>` | Critical | Provide an equivalent alternative |
| Missing `alt` on a decorative `<img>` | Serious | Use `alt=""` |
| Filename or CMS-injected text as `alt` | Serious | Replace with contextual author-written text |
| Generic placeholders (`"image"`, `"photo"`, `"chart"`, `"alt"`) | Serious | Describe the relevant content or purpose |
| `alt="decorative"` / `alt="spacer"` | Serious | Use `alt=""` |
| Draft placeholders (`"TBD"`, `"TODO"`, `"null"`, `"undefined"`) | Serious | Block publication until a real decision is made |
| "Type" prefix phrases ("Image of…", "Photo of…") when medium doesn't matter | Moderate | Describe the content directly |
| Alt text duplicates an adjacent `<figcaption>` verbatim | Moderate | Use `alt=""` or make it complementary |
| Name-only alt for person portraits | Moderate | Include role/context when relevant and known |
| `title` used instead of `alt` | Serious | Use `alt`; don't rely on hover-only text |
| `aria-label` added to `<img>` instead of `alt` | Moderate | Use the native `alt` attribute |
| Full chart data forced into one long `alt` | Moderate | Short alt + visible structured data |
| One asset-level alternative reused in every context | Moderate | Author an alternative per use |
| AI-generated text published without review | Serious | Require contextual human approval |

---

## CSS Background Images

CSS `background-image` has no `alt` support — use only for decoration or when
equivalent information is already present as real content.

```css
/* OK: decorative */
.hero { background-image: url('geometric-pattern.svg'); }
```

```html
<!-- NOT OK: meaningful image invisible to screen readers -->
<div class="award-badge"></div>

<!-- DO: put the information in HTML -->
<p class="award-badge">Winner, 2026 Inclusive Design Award</p>
```

Background images can disappear under user styles, forced colors, print, or
content blockers — the page must not depend on them for essential content or function.

---

## CMS and Authoring Requirements

A content system should support the *decision*, not just require a non-empty
field. Provide authors a required choice (Informative / Functional /
Decorative or redundant / Needs detailed description), an alt field that
permits a deliberately empty value, and context about where the image is
used. Do not auto-fill empty alt fields with filenames, captions, or asset
titles — a caption, credit, and alt text serve different purposes.

**Block publication when:** no alt decision has been made; an informative
image has no alternative or equivalent visible text; a functional image
doesn't name its control; a complex image lacks its detailed equivalent; a
placeholder/filename was inserted as the alternative. Do not block a
deliberate `alt=""` solely because the field is empty — require the author to
confirm the image is decorative in that use.

---

## AI-Assisted Alt Text

AI can suggest a draft description but cannot reliably know editorial
purpose, audience, or redundancy. An AI-assisted workflow should: ask for
purpose-equivalent text, not a visual inventory; distinguish informative/
functional/decorative/complex uses; flag uncertainty rather than fabricate
details; avoid inferring sensitive attributes or identifying unknown people;
avoid sending private images/metadata to an unapproved service; require a
responsible person to review the suggestion in the rendered context; and send
complex images for a detailed human-authored equivalent. **Do not let
AI-generated confidence replace editorial accountability** — a fluent
description can still be inaccurate, biased, or unsafe.

---

## Automated vs. Human Testing

| Automated tools can detect | Requires human review |
| --- | --- |
| Missing `alt` attribute | Whether alt text is meaningful |
| Empty alt on functional images | Whether alt text matches context |
| Alt text equal to the file name | Whether a decorative image actually needs alt |
| Suspicious prefix phrases, known placeholders | Whether the description conveys the right meaning |
| Alt text identical to adjacent figcaption | Whether the alt or the caption should be kept |
| Missing names on image buttons/image-map areas | Whether a complex description preserves relationships |

Automated tools such as axe-core detect structural issues; human review is
always required to evaluate quality. Store the tool/rule version with
results, and route confirmed issues through `skills/bug-reporting/SKILL.md`.

---

## Definition of Done Checklist

* [ ] Every image use has an explicit purpose and alt decision
* [ ] Every meaningful `<img>` has an accurate, contextual `alt`
* [ ] Every decorative or fully redundant `<img>` has `alt=""`
* [ ] No filename, placeholder, keyword list, or unrelated metadata used as `alt`
* [ ] Functional images provide useful link or control names; visible labels
      are included in accessible names
* [ ] Important words shown only in an image are also available as text
* [ ] Complex images have a short identification and an accessible detailed equivalent
* [ ] Captions and alternatives complement rather than duplicate each other
* [ ] Responsive `<picture>` sources convey the same essential meaning; `alt`
      is on the fallback `<img>`
* [ ] CSS background images are not the only source of information or function
* [ ] Alternatives use the page language and are included in translation workflows
* [ ] Descriptions do not invent identity, emotion, or sensitive attributes
* [ ] AI-generated suggestions received contextual human review
* [ ] Tested with a screen reader (NVDA + Firefox or VoiceOver + Safari)

---

## Key WCAG Criteria

* 1.1.1 Non-text Content (A) — **Critical if any meaningful image has no text alternative**
* 1.4.5 Images of Text (AA) — prefer real text over images of text
* 1.4.9 Images of Text No Exception (AAA)
* 2.4.4 Link Purpose in Context (A) — image-only and combined links must communicate purpose
* 2.5.3 Label in Name (A) — visible control text must be in the accessible name
* 4.1.2 Name, Role, Value (A)

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/IMAGE_ALT_TEXT_ACCESSIBILITY_BEST_PRACTICES.md)
* [W3C WAI — Images Tutorial and Decision Tree](https://www.w3.org/WAI/tutorials/images/decision-tree/)
* [WCAG 2.2 — 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
* [WebAIM — Writing Effective Alt Text](https://webaim.org/techniques/alttext/)
* [Sa11y](https://sa11y.netlify.app/) — flags suspicious alt text patterns
* [axe-core rules: `image-alt`, `image-redundant-alt`, `input-image-alt`, `area-alt`, `object-alt`](https://github.com/dequelabs/axe-core)
