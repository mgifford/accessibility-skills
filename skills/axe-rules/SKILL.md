---
name: axe-rules
description: >
  Load this skill when configuring axe-core scans, reviewing automated
  accessibility test results, or writing tests that use @axe-core/playwright,
  @axe-core/react, or similar integrations. Provides a quick reference to
  axe 4.x rule IDs, their WCAG mapping, and default severity levels.
---

# Axe-Core Rules Reference Skill

> **Canonical source**: `examples/AXE_RULES_REFERENCE.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when writing, reviewing, or debugging axe-core scans.

---

## Core Principle

Axe-core catches ~30–40 % of WCAG issues automatically. It is the baseline,
not the ceiling. Always pair automated scanning with manual keyboard and screen
reader testing.

**Key tags to include in scans:**

```typescript
.withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
```

---

## Severity Scale (axe-core)

| axe severity | Meaning |
|---|---|
| **critical** | Blocks access for one or more disability groups |
| **serious** | Significantly impairs access |
| **moderate** | Creates friction; workaround exists |
| **minor** | Best-practice gap; marginal impact |

---

## Critical Rules — must never appear in production

| Rule ID | Category | Description |
|---|---|---|
| `image-alt` | Text alternatives | `<img>` missing `alt` attribute |
| `input-image-alt` | Text alternatives | `<input type="image">` missing alt |
| `video-caption` | Text alternatives | `<video>` without captions |
| `aria-allowed-attr` | ARIA | Element has unsupported ARIA attributes for its role |
| `aria-hidden-body` | ARIA | `aria-hidden` applied to `<body>` |
| `aria-required-attr` | ARIA | Required ARIA attribute missing |
| `aria-required-children` | ARIA | Required child ARIA roles missing |
| `aria-required-parent` | ARIA | Required parent ARIA role missing |
| `aria-roles` | ARIA | Invalid ARIA role value |
| `aria-valid-attr` | ARIA | Invalid ARIA attribute name |
| `aria-valid-attr-value` | ARIA | ARIA attribute has invalid value |
| `label` | Forms | Form input without associated `<label>` |
| `select-name` | Forms | `<select>` without accessible name |
| `button-name` | Buttons/Links | Button without discernible text |
| `input-button-name` | Buttons/Links | `<input type="button">` without text |
| `duplicate-id-aria` | Structure | Duplicate `id` values referenced by ARIA |
| `meta-refresh` | Meta | `<meta http-equiv="refresh">` causes timed redirect |

---

## Serious Rules — fix before release

| Rule ID | Category | Description |
|---|---|---|
| `object-alt` | Text alternatives | `<object>` without accessible text |
| `svg-img-alt` | Text alternatives | SVG with `role="img"` and no accessible name |
| `aria-braille-equivalent` | ARIA | Braille label without non-braille equivalent |
| `aria-command-name` | ARIA | Button or link without accessible name |
| `aria-hidden-focus` | ARIA | `aria-hidden` element contains focusable content |
| `aria-input-field-name` | ARIA | ARIA input field without accessible name |
| `aria-prohibited-attr` | ARIA | Prohibited ARIA attribute used |
| `color-contrast` | Color | Text contrast below 4.5:1 (normal) or 3:1 (large) |
| `frame-title` | Frames | `<iframe>` without accessible name |
| `html-has-lang` | Language | `<html>` missing `lang` attribute |
| `html-lang-valid` | Language | `lang` attribute has invalid BCP 47 value |
| `valid-lang` | Language | Inline `lang` value is invalid |
| `document-title` | Language | `<title>` element missing |
| `list` | Structure | `<ul>`/`<ol>` contains elements other than `<li>` |
| `listitem` | Structure | `<li>` outside `<ul>` or `<ol>` |
| `definition-list` | Structure | `<dl>` contains elements other than `<dt>`/`<dd>` |
| `dlitem` | Structure | `<dt>`/`<dd>` outside `<dl>` |
| `bypass` | Keyboard | No skip navigation mechanism present |
| `scrollable-region-focusable` | Keyboard | Scrollable region not keyboard accessible |
| `link-name` | Buttons/Links | Link without discernible text |
| `link-in-text-block` | Buttons/Links | Link not distinguishable from surrounding text |
| `avoid-inline-spacing` | Content sizing | Text spacing overrides not adjustable |
| `autocomplete-valid` | Forms | `autocomplete` attribute invalid or missing |
| `tabindex` | Best practices | `tabindex` value > 0 used |
| `label-title-only` | Best practices | Form field labeled only via `title` attribute |

---

## Moderate Rules — fix in near-term backlog

| Rule ID | Category | Description |
|---|---|---|
| `heading-order` | Headings | Heading levels skipped (e.g., h1 → h3) |
| `th-has-data-cells` | Tables | Table headers have no associated data cells |
| `td-headers-attr` | Tables | Table cells reference invalid header IDs |
| `table-duplicate-name` | Tables | `<caption>` text duplicates `summary` attribute |
| `meta-viewport` | Meta | Viewport `user-scalable=no` disables zoom |
| `html-xml-lang-mismatch` | Language | `lang` and `xml:lang` attributes disagree |
| `form-field-multiple-labels` | Forms | Form field has multiple conflicting labels |
| `landmark-one-main` | Best practices | Page has no `<main>` landmark |
| `region` | Best practices | Content exists outside landmark regions |
| `page-has-heading-one` | Best practices | Page has no `<h1>` |
| `scope-attr-valid` | Best practices | `scope` attribute has invalid value |

---

## Running axe-core in CI (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('No WCAG 2.x AA violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

**Common configuration options:**

```typescript
// Exclude a specific element (use sparingly — document the reason)
.exclude('#known-false-positive')

// Include only a specific element
.include('#component-under-test')

// Disable a specific rule (document the reason and JIRA/issue link)
.disableRules(['color-contrast'])
```

---

## Definition of Done Checklist

* [ ] axe-core scans run on every PR with `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa` tags
* [ ] Zero critical violations in production code
* [ ] Zero serious violations in production code (or explicit waiver with issue link)
* [ ] All rule exclusions documented with reason and associated issue
* [ ] Light and dark colour schemes both tested
* [ ] Mobile viewport tested
* [ ] axe results published as CI artifact for reference

---

## Key WCAG Criteria (automation coverage)

* 1.1.1 Non-text Content (A)
* 1.3.1 Info and Relationships (A)
* 1.4.3 Contrast Minimum (AA)
* 2.4.2 Page Titled (A)
* 3.1.1 Language of Page (A)
* 4.1.2 Name, Role, Value (A)
* 4.1.3 Status Messages (AA) — partial coverage

> Automation covers ~30–40 % of WCAG issues. Always pair with manual testing.

---

## References

* [Full axe rules reference](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/AXE_RULES_REFERENCE.md)
* [axe-core rule descriptions](https://dequeuniversity.com/rules/axe/)
* [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)
* [axe-core GitHub](https://github.com/dequelabs/axe-core)

> **Standards horizon:** These rules target WCAG 2.2 AA.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
