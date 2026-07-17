# ARRM Task Fixture #2: Complex chart alternative

## Input Scenario

A complex data visualisation component (e.g. a multi-series bar chart, line chart, or scatter plot) needs an accessible alternative for users who cannot perceive the rendered graphic. Multiple valid approaches exist, and the choice depends on the chart's purpose, data complexity, user tasks, and update cadence.

Possible alternatives include:

- Text summary of key findings
- Adjacent data table
- Long description (via `<figcaption>`, `aria-describedby`, or dedicated prose)
- Interactive exploration (keyboard-navigable data points with announced values)
- Combinations of the above

Each option involves trade-offs across five dimensions: minimum WCAG conformance, usability, equivalent task support, maintainability, and user preference.

## Expected Findings

### ARRM Task Mappings

No single ARRM task covers "make a complex chart accessible." The requirement decomposes into at least nine tasks across four domains: describing the image, ensuring colour independence, structuring tabular data, and making interactive elements keyboard-reachable. The cross-role decision emerges because no single role owns all nine tasks.

```yaml
fixture_id: CHART-ALT-001
title: Complex chart accessible alternative — cross-role decision
arrm_tasks:
  # ── 1. Describing the chart (1.1.1 Non-text Content) ──────────────
  - task_id: IMG-008
    wcag_sc: "1.1.1"
    level: A
    task_text: >-
      The purpose or function of complex images is accurately
      described in text.
    main_role: Author
    primary: Content Authoring
    secondary: User Experience (UX) Design
    contributor: none
    status: Requirement

  - task_id: IMG-009
    wcag_sc: "1.1.1"
    level: A
    task_text: >-
      The purpose or function of complex images is conveyed using
      a text description, via an alt attribute (or other equivalent means).
    main_role: Development
    primary: Front-End Development
    secondary: Content Authoring
    contributor: User Experience (UX) Design
    status: Best Practice

  - task_id: IMG-010
    wcag_sc: "1.1.1"
    level: A
    task_text: >-
      The full explanation of complex images is accurately
      described in text.
    main_role: Author
    primary: Content Authoring
    secondary: none
    contributor: none
    status: Requirement

  - task_id: IMG-011
    wcag_sc: "1.1.1"
    level: A
    task_text: >-
      A mechanism that conveys the way through which the full
      explanation of complex images is defined.
    main_role: Design
    primary: User Experience (UX) Design
    secondary: none
    contributor: none
    status: Best Practice

  - task_id: IMG-012
    wcag_sc: "1.1.1"
    level: A
    task_text: >-
      The full explanation of complex images is provided through
      the longdesc attribute (or other equivalent means).
    main_role: Development
    primary: Front-End Development
    secondary: none
    contributor: none
    status: Requirement

  # ── 2. Colour independence (1.4.1 Use of Color) ──────────────────
  - task_id: IMG-018
    wcag_sc: "1.4.1"
    level: A
    task_text: >-
      Charts, graphs, infographics and other visual representations
      of information don't rely on color alone to convey information.
    main_role: Design
    primary: Visual Design
    secondary: User Experience (UX) Design
    contributor: none
    status: Requirement

  - task_id: CSS-009
    wcag_sc: "1.4.1"
    level: A
    task_text: >-
      Color is never used as the only way to convey information,
      context, indicate selection or the presence of errors.
    main_role: Design
    primary: Visual Design
    secondary: User Experience (UX) Design
    contributor: Content Authoring
    status: Requirement

  # ── 3. Structuring accessible tabular data (1.3.1) ───────────────
  - task_id: TAB-001
    wcag_sc: "1.3.1"
    level: A
    task_text: >-
      Tables are only to be used to lay out tabular information
      or data.
    main_role: Development
    primary: Front-End Development
    secondary: User Experience (UX) Design
    contributor: none
    status: Requirement

  - task_id: TAB-004
    wcag_sc: "1.3.1"
    level: A
    task_text: >-
      Tabular data and corresponding header cells for that data
      are part of the same table.
    main_role: Development
    primary: Front-End Development
    secondary: User Experience (UX) Design
    contributor: none
    status: Requirement

  - task_id: TAB-005
    wcag_sc: "1.3.1"
    level: A
    task_text: >-
      Header cells for rows are marked up using THEAD elements.
    main_role: Development
    primary: Front-End Development
    secondary: none
    contributor: none
    status: Requirement

  - task_id: TAB-006
    wcag_sc: "1.3.1"
    level: A
    task_text: >-
      Header cells for columns are marked up using TH elements.
    main_role: Development
    primary: Front-End Development
    secondary: none
    contributor: none
    status: Requirement

  - task_id: TAB-007
    wcag_sc: "1.3.1"
    level: A
    task_text: >-
      The relationship between table header rows and table header
      columns with data cells in simple data tables is provided
      through the SCOPE attributes.
    main_role: Development
    primary: Front-End Development
    secondary: User Experience (UX) Design
    contributor: none
    status: Requirement

  - task_id: TAB-015
    wcag_sc: "1.3.1"
    level: A
    task_text: >-
      A meaningful description of the structure of data tables
      is provided.
    main_role: Author
    primary: Content Authoring
    secondary: User Experience (UX) Design
    contributor: none
    status: Requirement

  # ── 4. Keyboard reachability for interactive charts (2.1.1) ──────
  - task_id: INP-004
    wcag_sc: "2.1.1"
    level: A
    task_text: >-
      All actionable elements can be reached, using only the
      keyboard.
    main_role: Development
    primary: Front-End Development
    secondary: User Experience (UX) Design
    contributor: none
    status: Requirement

  - task_id: INP-005
    wcag_sc: "2.1.1"
    level: A
    task_text: >-
      All active elements can be triggered, using only the
      keyboard.
    main_role: Development
    primary: Front-End Development
    secondary: User Experience (UX) Design
    contributor: none
    status: Requirement
```

### Why This Is a Cross-Role Decision

The nine ARRM tasks above distribute ownership across four roles:

| Role | Tasks owned | Scope |
|---|---|---|
| **Content Authoring** | IMG-008, IMG-010, TAB-015 | Writing the text description, full explanation, and table structure description |
| **Front-End Development** | IMG-009, IMG-012, TAB-001, TAB-004–TAB-007, INP-004, INP-005 | Implementing alt/longdesc, building the data table, wiring keyboard interaction |
| **User Experience (UX) Design** | IMG-011 | Designing the mechanism that links the chart to its explanation |
| **Visual Design** | IMG-018, CSS-009 | Ensuring colour is not the sole encoding |

No single role can resolve this independently. Content Authoring decides *what* the chart means; Front-End Development decides *how* to expose it programmatically; Visual Design decides *how* to encode data non-colouristically; and UX Design decides *where* the alternative lives in the interface. A change in any one role's output may require rework by another.

### Decision State Classification

```yaml
decision:
  state: cross-role-decision-needed
  rule_certainty: medium
  intent_certainty: low
  change_risk: medium
  testability: medium
  confidence: low
```

**Rationale:**

- **Rule certainty (medium):** WCAG 1.1.1, 1.3.1, 1.4.1, and 2.1.1 are normative, but the *form* the alternative takes (table vs. long description vs. interactive) is not prescribed.
- **Intent certainty (low):** The chart's purpose (reporting vs. exploration vs. monitoring), audience, and update cadence are unknown.
- **Change risk (medium):** The chosen alternative affects markup, styling, scripting, and content authoring workflow.
- **Testability (medium):** Automated tools can verify alt text and table structure, but meaningfulness requires human and AT testing.
- **Confidence (low):** Multiple valid approaches exist; the "best" choice depends on context.

### Valid Approaches (Preserving Disagreement)

Each approach satisfies WCAG 1.1.1 but differs in scope, maintenance cost, and user experience:

1. **Text summary only** — Satisfies minimum conformance. Low maintenance. May not support users who need individual data points (e.g. comparing Q3 vs. Q4 values). Good for monitoring dashboards where the trend matters more than exact figures.

2. **Adjacent data table** — Satisfies 1.1.1 and supports granular data interrogation. Moderate maintenance (must stay synchronised with chart). Preferred when users need to look up specific values. Per charts-graphs skill: "A complex chart with no data table is Serious."

3. **Long description via `<figcaption>` or `aria-describedby`** — Satisfies 1.1.1 with richer narrative. Low-to-moderate maintenance. Preferred when the chart communicates a narrative (e.g. "adoption grew steadily, driven by procurement requirements"). Per image-alt-text skill: complex images need both a short alt and a long description.

4. **Interactive exploration (keyboard-navigable data points)** — Exceeds minimum conformance. High implementation and maintenance cost. Preferred when users need to drill into specific data points. Per charts-graphs skill: interactive charts must have keyboard operability with announced focus.

5. **Combinations** — A short alt + long description + data table is the most robust pattern. Recommended when the chart is the primary content of the page.

### Conflict Documentation

```yaml
role_perspectives:
  - role: Content Authoring
    arrm_basis: IMG-008, IMG-010, TAB-015
    concern: Narrative accuracy and completeness of the text alternative
    recommendation: >-
      Provide a long description that tells the story the chart
      is meant to convey, plus a table for data lookup.
    uncertainty: >-
      Length may overwhelm users who only need a quick trend
      summary. Writing quality varies across authors.

  - role: Front-End Development
    arrm_basis: IMG-009, IMG-012, TAB-001, TAB-004–TAB-007, INP-004, INP-005
    concern: Implementation complexity, maintenance burden, and markup correctness
    recommendation: >-
      Adjacent data table with proper TH/THEAD/SCOPE markup;
      aria-describedby linking the chart image to a <figcaption>.
    uncertainty: >-
      Library-generated tables may lack <caption> or scope
      attributes. Interactive chart libraries may not expose
      keyboard navigation hooks.

  - role: User Experience (UX) Design
    arrm_basis: IMG-011
    concern: Interface placement, discoverability, and cognitive load
    recommendation: >-
      Place the data table toggle immediately below the chart
      with a visible "Show data table" control.
    uncertainty: >-
      Toggle pattern adds interaction cost. Users may not
      discover it. Placement depends on page layout.

  - role: Visual Design
    arrm_basis: IMG-018, CSS-009
    concern: Colour independence and visual encoding of data
    recommendation: >-
      Add patterns, shapes, or direct value labels as secondary
      encodings alongside colour. Use colourblind-safe palette
      (Okabe-Ito or ColorBrewer).
    uncertainty: >-
      Patterns can add visual clutter. Value labels may overlap
      in dense charts. Palette constraints limit design freedom.
```

### Role-Specific Questions

```yaml
questions:
  content_authoring:
    - What is the chart's primary message or finding?
    - Which data points are essential for the user to understand?
    - Is the chart's purpose reporting (passive consumption) or analysis (active exploration)?
    - How frequently does the underlying data change?
    - Who is the intended audience and what is their familiarity with the data domain?

  front_end_development:
    - Is the chart rendered as <canvas>, SVG, or an <img> element?
    - Does the charting library expose accessibility hooks (aria-label, role="img")?
    - Is there an existing data table in the data source that can be surfaced?
    - Can the library be configured to generate a fallback table?
    - What is the maintenance cost of keeping the table synchronised with the chart?

  ux_design:
    - Should the alternative be visible by default or behind a toggle?
    - Where should the alternative be placed relative to the chart?
    - Is the chart the primary content of the page or supplementary?
    - Do users need to compare individual data points or only see trends?
    - What interaction model do users expect (scan, drill-down, filter)?

  visual_design:
    - Are there more than two or three data series (requiring secondary encodings)?
    - What is the chart's role on the page — hero content or supporting widget?
    - Can the design accommodate pattern fills without excessive visual noise?
    - Are there accessibility constraints on the colour palette (e.g. brand colours)?
    - Should value labels be rendered directly on data points?
```

### Distinction: Conformance vs. Usability vs. Task Support

| Dimension | What it means | Example |
|---|---|---|
| **Minimum conformance** | Passes WCAG 2.2 AA automated checks | Alt text present, table has `<th>` with `scope`, no colour-only encoding |
| **Usability** | A real user can actually complete their task | Data table is findable, readable, and doesn't require horizontal scrolling |
| **Equivalent task support** | The alternative supports the same tasks as the visual chart | A user can look up Q3 revenue from the table as easily as from the chart |
| **Maintainability** | The solution stays correct as data changes | Table is generated from the same data source as the chart, not hand-edited |
| **User preference** | Different users prefer different modalities | Some prefer scanning a table; others prefer a narrated summary |

A solution that passes automated checks but is hidden behind an undiscoverable toggle fails usability. A solution that is discoverable but out of sync with the chart data fails maintainability. The cross-role decision must balance all five dimensions.

### Escalation Triggers for User Testing

The following scenarios require testing with real users before the team can converge on a solution:

| Trigger | User group | Why |
|---|---|---|
| Chart is the primary page content and users must extract specific values | Screen-reader users | Validate that the data table or long description supports the same lookup tasks as the visual chart |
| Chart uses more than three colours to encode data series | Users with low vision / colour vision deficiency | Confirm that secondary encodings (patterns, labels) are perceivable |
| Chart has interactive elements (tooltips, drill-down, filtering) | Keyboard-only users | Verify all interactions are reachable and operable without a pointer |
| Chart communicates a complex narrative (trends, correlations, anomalies) | Users with cognitive and learning disabilities | Confirm that the long description is comprehensible without the visual |
| Chart updates dynamically (live dashboard) | All of the above | Verify that dynamic updates are announced and that the alternative stays synchronised |

### Unacceptable Behaviours

* Proposing a single approach without consulting all four roles identified in the ARRM mappings
* Declining to document conflicting role perspectives
* Making a recommendation without gathering evidence (user research, AT testing, or prototype evaluation)
* Skipping to implementation without resolving the cross-role decision
* Claiming the issue is resolved based solely on automated checks (alt text present, table markup valid)
* Removing colour from the chart without providing a non-colour encoding

### Fixture Purpose

This fixture validates that the system can:

1. Decompose a complex accessibility challenge into its constituent ARRM tasks
2. Ground every role assignment in a real ARRM task with verified ownership
3. Identify and document conflicting expert perspectives rooted in ARRM ownership
4. Distinguish minimum conformance from usability and equivalent task support
5. Generate targeted questions for each role based on ARRM scope
6. Define explicit escalation triggers for user testing with specific disability groups
7. Recommend appropriate cross-role engagement without premature convergence

ModelCheck | model=openopen/model-name | tier=B | fit=demonstrates cross-role ARRM grounding capability | escalate_if=role assignments are not backed by real ARRM task data
