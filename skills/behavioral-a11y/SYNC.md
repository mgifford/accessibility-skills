# Sync Metadata

```yaml
canonical_source: examples/BEHAVIORAL_ACCESSIBILITY_AUTOMATION.md
last_synced_commit: "69b2ee89eb860eef791107f92f13c61cca6c7fd9"
last_synced_date: "2026-07-26"
skill_maintainer: ""
notes: >
  New skill created to close a gap the canonical file itself documents:
  BEHAVIORAL_ACCESSIBILITY_AUTOMATION.md was added to mgifford/ACCESSIBILITY.md
  in commits 7e27347 and a5967b3, and explicitly states this repo did not yet
  have a corresponding skill. This skill distills sections 1-6 (why behavioral
  checks exist, result vocabulary, false positives at scale, Reflow risk detail,
  Focus Visible risk detail, fleet-scale operating model). Sections 7-9
  (tool comparison matrix, CWAC attribution/license detail, automation coverage
  matrix) are referenced but not duplicated here — see the canonical guide.

  DIVERGENCE: This skill's format (YAML frontmatter, severity-tagged sections,
  condensed Definition of Done checklist) intentionally differs from the
  canonical file's prose structure, matching this repo's existing skill
  conventions. Content substance is synced; presentation format is not
  expected to match verbatim.

  2026-07-26 sync pass (a5967b3 -> 69b2ee8, merge of PR #138): canonical guide
  added explicit "— shipped and tested" / "— documented gap, not implemented" /
  "— shipped, evidence only (no verdict)" markers to each Section 2 subsection
  heading, plus a new §2.9 "Implementation status at a glance" summary table.
  Reviewed SKILL.md against this and found no drift: the "Moderate: Documented
  Gaps (Not Yet Automated)" section and the "Key WCAG Criteria" list already
  called out focus obscuration (2.3), text resizing/zoom (2.5), text spacing
  (2.6), and content on hover/focus (2.7) as not-yet-automated, and the "Focus
  order evidence" callout under Focus Visible already treated the `stops`
  array as evidence for human review rather than a verdict — matching 2.4's
  new "shipped, evidence only" status. No SKILL.md content changes were
  needed this pass. Also reviewed commit 7993abd (broken relative link fix in
  ACCESSIBILITY-template.md) — not relevant to this skill's content.
```

## How to Update This Skill

When the canonical source changes and CI flags drift:

1. Open both files side-by-side
2. Review the diff linked in the GitHub issue/PR comment
3. Update `SKILL.md` to reflect new requirements, changed patterns, or removed guidance
4. Set `last_synced_commit` to the current commit SHA of `mgifford/ACCESSIBILITY.md`
5. Rebuild: `cd skills && zip -r behavioral-a11y.skill behavioral-a11y/`
