---
name: mermaid
description: >
  Load this skill whenever the project uses Mermaid diagrams — flowcharts,
  sequence diagrams, class diagrams, Gantt charts, or any Mermaid-rendered
  visualization. Under no circumstances render a Mermaid diagram without an
  accessible title, description, and text-based alternative. Absolutely always
  add accTitle and accDescr to every diagram.
---

# Mermaid Diagrams Accessibility Skill

> **Canonical source**: `examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when authoring, generating, or reviewing Mermaid diagrams.
**Only load this skill if the project uses Mermaid diagrams.**

---

## Core Mandate

Every Mermaid diagram must include accessibility metadata and produce SVG output
conforming to Pattern 11 — the most reliable pattern across screen reader/browser
combinations, per Carie Fisher's testing at <https://cariefisher.com/a11y-svg-updated/>.

---

## Severity Scale (this skill)

| Level | Meaning |
|---|---|
| **Critical** | Diagram conveys essential information with no accessible title or alternative |
| **Serious** | Title present but no description on a complex diagram; contrast fails |
| **Moderate** | SVG output does not implement Pattern 11; named edges lack context |
| **Minor** | Title over 100 chars; duplicate IDs; missing version check |

---

## Critical: Metadata in Every Diagram

**Missing `%%accTitle` on any meaningful diagram is Critical.**

```
%%accTitle Brief title (max 100 characters)
%%accDescr Detailed description of what the diagram shows and why
```

**Title requirements:**
* Concise and descriptive — identifies diagram type and subject
* Max 100 characters
* Unique within the page
* Never just "Diagram" or "Flowchart"

**Description requirements:**
* Complete explanation of purpose, key elements, and relationships
* Written as if explaining to someone who cannot see it
* For flowcharts: mention critical decision points and their outcomes
* Aim for 50–500 characters; longer descriptions → use a text alternative below the diagram

### Example

```
graph TD
    A[User Login] --> B{Valid Credentials?}
    B -->|Yes| C[Grant Access]
    B -->|No| D[Show Error]
    C --> E[Load Dashboard]
    D --> F[Retry Login]

%%accTitle User Authentication Flowchart
%%accDescr Login process: credentials validated against database.
  If valid, access granted and dashboard loads.
  If invalid, error shown and user can retry login.
```

### Version requirement

`%%accTitle` and `%%accDescr` were introduced in **Mermaid v9.4**. Verify
the Mermaid version in use before relying on these directives. Earlier versions
silently ignore them — use a manual SVG wrapper or a text alternative instead.

Check version: `import mermaid from 'mermaid'; console.log(mermaid.version);`

---

## Serious: SVG Output — Verify Pattern 11

Mermaid does not always produce Pattern 11-compliant SVG automatically, even
when directives are set. The `aria-labelledby` referencing both title and
description IDs may require post-processing or verification.

Expected Pattern 11 output:

```html
<svg role="img"
     aria-labelledby="chart-title chart-desc"
     xmlns="http://www.w3.org/2000/svg">
  <title id="chart-title">User Authentication Flowchart</title>
  <desc id="chart-desc">Login process: credentials validated…</desc>
  <!-- diagram content -->
</svg>
```

Required attributes:
* `role="img"` on root `<svg>`
* `xmlns="http://www.w3.org/2000/svg"`
* `aria-labelledby` referencing **both** title and desc IDs
* IDs unique per diagram — never reused across multiple diagrams on the same page

**Inspect the rendered SVG** in browser DevTools after render. If `aria-labelledby`
is missing or references only one ID, post-process the SVG or add a text alternative.

### GitHub rendering limitation

GitHub renders Mermaid in fenced code blocks (` ```mermaid `) but the SVG
output and accessibility attributes may not survive GitHub's sanitisation pipeline.
**Do not rely on Mermaid accessibility metadata for diagrams rendered in GitHub
Markdown** — provide an explicit text alternative below the code block:

````markdown
```mermaid
graph TD …
```
**Diagram description:** Login flowchart. Valid credentials grant access and
load the dashboard. Invalid credentials show an error and allow retry.
````

---

## Moderate: Semantic Flowchart Structure

Following Léonie Watson's accessible SVG flowchart pattern
(<https://tink.uk/accessible-svg-flowcharts/>):

```html
<svg role="img" aria-labelledby="flow-title flow-desc">
  <title id="flow-title">…</title>
  <desc id="flow-desc">…</desc>
  <g role="list">
    <g role="listitem">
      <title>Node label</title>
      <!-- node shapes -->
    </g>
  </g>
</svg>
```

* Each node: single accessible name via `<title>`
* Decorative shapes: `aria-hidden="true"` or `role="presentation"`
* Arrows/connectors: `aria-hidden="true"` by default
* Named edges must include context: "Yes, proceed to processing" not just "Yes"

---

## Moderate: Contrast

Test diagram colours in both light and dark modes:
* Text labels: 4.5:1 against background
* Non-text elements (lines, shapes, arrows): 3:1 against adjacent colours

Mermaid's default themes may not meet contrast in dark mode — verify and
override theme variables as needed.

---

## Minor: Pre-Export Validation Checklist

Before exporting or committing any diagram, verify:

* [ ] Both `%%accTitle` and `%%accDescr` present
* [ ] Title ≤ 100 characters; description ≥ 10 characters
* [ ] Mermaid version ≥ 9.4 (or manual SVG alternative provided)
* [ ] No duplicate IDs within SVG
* [ ] `role="img"` on root SVG in rendered output
* [ ] `aria-labelledby` references both title and desc IDs in rendered output
* [ ] Named edges include contextual labels ("Yes, proceed to X" not "Yes")
* [ ] Contrast verified in light and dark modes
* [ ] GitHub rendering: text alternative provided below code block

---

## Definition of Done Checklist

* [ ] `%%accTitle` present, ≤100 chars, unique, meaningful
* [ ] `%%accDescr` present, explains purpose and key relationships
* [ ] Mermaid version confirmed ≥ 9.4
* [ ] SVG output verified: Pattern 11 — `role="img"`, `<title>`, `<desc>`, `aria-labelledby` both IDs
* [ ] All IDs unique within page
* [ ] Decorative elements hidden from accessibility tree
* [ ] Named edges include contextual label
* [ ] Contrast verified in light and dark modes
* [ ] GitHub diagrams have a text alternative below the code block
* [ ] Tested with screen reader

---

## Key WCAG Criteria

* 1.1.1 Non-text Content (A) — **Critical if no title/alternative**
* 1.4.3 Contrast Minimum (AA)
* 1.4.11 Non-text Contrast (AA)
* 4.1.2 Name, Role, Value (A)

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md)
* [Accessible SVG flowcharts — Léonie Watson (tink.uk)](https://tink.uk/accessible-svg-flowcharts/) — do not scrape; link to it
* [Accessible SVGs: Perfect Patterns — Carie Fisher](https://cariefisher.com/a11y-svg-updated/) — do not scrape; link to it
* [Mermaid accessibility documentation](https://mermaid.js.org/config/accessibility.html)
* [Mermaid changelog — v9.4 release notes](https://github.com/mermaid-js/mermaid/releases/tag/v9.4.0)

> **Standards horizon:** These rules target WCAG 2.2 AA.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
