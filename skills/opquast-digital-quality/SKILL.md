---
name: opquast-digital-quality
description: Apply the Opquast Digital Quality Framework (245 rules, 14 categories) when building, reviewing, or auditing websites and web applications. Use for web development quality assurance, accessibility compliance, security hardening, privacy implementation, e-commerce best practices, and holistic digital quality checks.
---

# Opquast Digital Quality Best Practices

Apply the [Opquast Digital Quality Checklist](https://checklists.opquast.com/en/digital-quality/)
(Version 5, 2025-2030) when building or reviewing web projects. The framework
contains 245 rules across 14 categories covering content, privacy, e-commerce,
forms, accessibility, security, performance, and more.

> Rules are published under [Creative Commons BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
> Agents may reference and cite rule text; attribute Opquast and respect the
> ShareAlike licence — derivatives must use the same licence.
> See [opquast.com](https://www.opquast.com/) for the authoritative source.

---

## Severity Scale (this skill)

Opquast covers 245 rules across 14 categories. Use this scale when reporting
issues found during review:

| Level | Meaning |
|---|---|
| **Critical** | Completely blocks access, purchase, or task completion for a user group |
| **Serious** | Significantly impairs access or usability; workaround unreasonable to expect |
| **Moderate** | Creates friction; workaround available but burdensome |
| **Minor** | Best-practice gap; marginal impact |

Category-level severity guidance:
- **Security** failures (HTTPS, headers, passwords): Critical to Serious
- **Forms** failures (labels, error handling): Critical to Serious
- **Navigation** failures (keyboard, focus): Critical to Serious
- **Images/Media** missing alt/captions: Critical
- **Privacy** policy missing: Serious
- **Presentation** contrast: Serious; zoom blocked: Serious
- **Content, Links, Identification**: Moderate to Minor in most cases
- **Server/Performance, Newsletter, Internationalisation**: Minor in most cases

---

## When to Use This Skill

- Building a new website or web application
- Reviewing or auditing an existing site for quality
- Implementing accessibility, security, or privacy features
- Creating e-commerce flows, forms, or navigation systems
- Generating HTML/CSS code that must meet quality standards

---

## Quick Reference: AI-Enforceable Requirements

| Category | Key Requirements |
|---|---|
| Content | `<meta name="description">` + OG tags, explicit dates, `<abbr>` for acronyms, data tables for charts |
| Privacy | Privacy link in footer, generic auth-failure messages, HTTPS for sensitive data, no sensitive data in URLs |
| E-Commerce | No pre-checked opt-ins, availability before checkout, explicit pricing, two+ payment methods |
| Forms | `<label for="...">`, `required` attribute (not `aria-required` alone), `aria-invalid`, `aria-describedby`, correct `input type`, `autocomplete` |
| Identification | Unique page titles (`Page \| Site`), `lang` attribute, favicon, two+ contact methods |
| Images/Media | Meaningful `alt`, empty `alt=""` for decorative, captions + transcripts for AV, no autoplay |
| Internationalisation | `lang` on `<html>`, `hreflang` for translations, international dialling codes |
| Links | Descriptive anchor text (no "click here"), `tel:` protocol, file type + size for downloads |
| Navigation | Skip links, visible `:focus-visible`, logical tab order, consistent nav placement, breadcrumbs |
| Presentation | Contrast 4.5:1 normal / 3:1 large text, no colour-only info, no blocked zoom, responsive, print styles |
| Security | HTTPS everywhere, HSTS, CSP, SRI, no plain-text passwords, security headers |
| Server/Performance | `robots.txt`, `sitemap.xml`, gzip/Brotli, cache headers, minified CSS/JS |
| Structure/Code | UTF-8, unique IDs, no `meta refresh`, tagged PDFs, heading hierarchy `h1>h2>h3` |
| Newsletter | Confirmed opt-in, unsubscribe link, archives online, state frequency |

---

## Workflow

### 1. Identify Applicable Categories

Not all 14 categories apply to every project:

- **All web projects**: Content, Forms, Identification, Images/Media, Links,
  Navigation, Presentation, Security, Server/Performance, Structure/Code
- **Add if applicable**: E-Commerce (online sales), Newsletter (email marketing),
  Internationalisation (multi-language), Privacy (user accounts/data collection)

### 2. Load Detailed Rules

Read the relevant reference file for the full rules with code examples:

- **Rules 1-172** (Content, Privacy, E-Commerce, Forms, Identification,
  Images/Media, Internationalisation, Links, Navigation):
  See `references/rules-part1.md`
- **Rules 173-244** (Newsletter, Presentation, Security, Server/Performance,
  Structure/Code): See `references/rules-part2.md`

### 3. Apply During Development

When generating or reviewing code, apply rules as implementation requirements:

- **HTML generation**: Include metadata, semantic structure, accessible forms,
  proper alt text
- **CSS generation**: Ensure contrast ratios, focus styles, responsive layout,
  print styles
- **Server configuration**: Set security headers, enable compression, configure
  caching
- **Content review**: Check date formats, link text, abbreviation expansion

### 4. Validate

After implementation, verify against applicable rules. Common automated checks:

- HTML validation and heading hierarchy
- Colour contrast ratios (4.5:1 normal text, 3:1 large text)
- Missing `alt` attributes
- Missing form labels
- Security headers present
- Broken internal links

---

## Essential Code Patterns

### Page Template Minimum

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="Page description here." />
  <meta property="og:title" content="Page Title | Site Name" />
  <meta property="og:description" content="Page description for sharing." />
  <title>Page Title | Site Name</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</head>
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  <nav aria-label="Main navigation"><!-- ... --></nav>
  <main id="main"><!-- ... --></main>
  <footer>
    <a href="/privacy">Privacy Policy</a>
    <a href="/terms">Terms of Use</a>
  </footer>
</body>
</html>
```

### Accessible Form Field

Use native `required` on native inputs. `aria-required` is redundant when
`required` is present and should be omitted to avoid accessibility tree noise.
Use `aria-required` only on custom widgets (`role="combobox"` etc.).

```html
<label for="email">
  Email address <span aria-hidden="true">*</span>
  <span class="hint" id="email-hint">Required. Example: user@example.com</span>
</label>
<input id="email" type="email" autocomplete="email"
  required aria-describedby="email-hint" />
```

### Security Headers (Server Config)

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: default-src 'self';
Referrer-Policy: strict-origin-when-cross-origin
```

### Focus and Contrast Styles

```css
:focus-visible {
  outline: 3px solid #005fcc;
  outline-offset: 2px;
}
body {
  color: #1a1a1a; /* ~16:1 contrast on white */
  background: #ffffff;
}
```

### Print Styles

```css
@media print {
  nav, header, footer, .sidebar, .no-print { display: none; }
  body { font-size: 12pt; color: #000; }
  a[href]::after { content: " (" attr(href) ")"; }
}
```

---

## WCAG Relationship

Opquast complements WCAG 2.2 rather than replacing it. Key mappings:

| Opquast Rules | WCAG Criteria |
|---|---|
| 116 (decorative images `alt=""`) | 1.1.1 Non-text Content (A) |
| 117-118 (meaningful alt text) | 1.1.1 Non-text Content (A) |
| 121-122 (transcripts, captions) | 1.2.2, 1.2.3, 1.2.5 |
| 124-127 (no autoplay, pausable) | 1.4.2, 2.2.2 |
| 131-132 (lang attribute) | 3.1.1, 3.1.2 |
| 164 (skip links) | 2.4.1 Bypass Blocks (A) |
| 165 (focus visible) | 2.4.7, 2.4.11 Focus Visible/Appearance |
| 166 (keyboard operable) | 2.1.1 Keyboard (A) |
| 167 (logical tab order) | 2.4.3 Focus Order (A) |
| 181 (not colour alone) | 1.4.1 Use of Color (A) |
| 182 (contrast) | 1.4.3, 1.4.11 Contrast (AA) |
| 186 (touch targets 24×24px min) | 2.5.8 Target Size Minimum (AA, WCAG 2.2) |
| 193 (no zoom block) | 1.4.4 Resize Text (AA) |
| 69-70 (labels, instructions) | 1.3.1, 3.3.2 |
| 79-80 (error identification) | 3.3.1, 3.3.3 |

Use Opquast as a holistic quality baseline and layer WCAG testing for full
accessibility compliance.

---

## Sustainability Connection

Several Opquast categories directly align with
[SUSTAINABILITY.md](https://github.com/mgifford/SUSTAINABILITY.md) and the
[Web Sustainability Guidelines](https://www.w3.org/TR/web-sustainability-guidelines/):

- **Server/Performance** (rules 226-230): compression, caching, minification —
  directly reduce data transfer and energy per page view
- **Presentation** (rule 193): not blocking zoom; (rule 194): responsive layout —
  reduce need for separate mobile sites
- **Structure/Code** (rule 239): no meta refresh — avoids unnecessary page reloads

When applying Opquast Server/Performance rules, cross-reference with
`SUSTAINABILITY.md` for additional guidance on carbon-aware delivery and
asset optimisation.

---

## Definition of Done Checklist

Apply to every project; skip categories not in scope:

**Content & Identification**
* [ ] `<meta name="description">` and OG tags on every page
* [ ] Unique `<title>` in `Page | Site` format
* [ ] `<html lang="...">` present and correct
* [ ] `<link rel="icon">` present
* [ ] Privacy policy linked from footer
* [ ] At least two contact methods available

**Forms**
* [ ] Every field has programmatically associated `<label>`
* [ ] Native `required` used; `aria-required` omitted on native inputs
* [ ] `aria-invalid="true"` set on invalid fields
* [ ] Error messages associated via `aria-describedby`
* [ ] Correct `input type` and `autocomplete` values
* [ ] Paste not blocked

**Images & Media**
* [ ] Decorative images have `alt=""`
* [ ] Informative images have descriptive `alt`
* [ ] All video has synchronised captions
* [ ] All audio has text transcript
* [ ] No autoplay (audio or video)
* [ ] All media pausable

**Navigation & Keyboard**
* [ ] Skip link present and functional
* [ ] `:focus-visible` styles defined; `outline: none` not used without replacement
* [ ] All content keyboard operable
* [ ] Logical tab order

**Presentation**
* [ ] Contrast ≥ 4.5:1 for normal text; ≥ 3:1 for large text and UI components
* [ ] Information not conveyed by colour alone
* [ ] `user-scalable=no` and `maximum-scale` not used
* [ ] Print styles hide navigation; reveal link URLs

**Security**
* [ ] HTTPS on all pages; HTTP redirects to HTTPS
* [ ] HSTS header present
* [ ] `X-Content-Type-Options: nosniff` present
* [ ] `X-Frame-Options` or CSP `frame-ancestors` present
* [ ] CSP header present
* [ ] SRI on all third-party scripts/stylesheets

**Server/Performance**
* [ ] `robots.txt` present
* [ ] `sitemap.xml` present
* [ ] Compression enabled (gzip or Brotli)
* [ ] Cache-control headers on static assets
* [ ] CSS and JS minified

**Structure/Code**
* [ ] `<meta charset="UTF-8">` in every `<head>`
* [ ] No duplicate `id` attributes within a page
* [ ] No `<meta http-equiv="refresh">`
* [ ] Heading hierarchy correct (`h1` > `h2` > `h3`, no skips)
* [ ] Data tables have `<caption>` and `<th scope="...">`

---

## Key WCAG Criteria

See WCAG relationship table above. Opquast covers all of WCAG 2.2 AA and
extends well beyond it into security, privacy, e-commerce, and performance.

---

## References

* [Opquast Digital Quality Checklist](https://checklists.opquast.com/en/digital-quality/) — CC-BY-SA 4.0; rule text may be cited with attribution
* [opquast.com](https://www.opquast.com/) — authoritative source, training, certification
* [TRUSTED_SOURCES.yaml](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/TRUSTED_SOURCES.yaml) — `id: opquast`, `id: opquast-checklist`
* [SUSTAINABILITY.md](https://github.com/mgifford/SUSTAINABILITY.md) — Server/Performance rules align with WSG

> **Standards horizon:** These rules target WCAG 2.2 AA alongside Opquast v5
> (2025-2030). WCAG 3.0 is in development.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
