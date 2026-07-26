# Sync Metadata

```yaml
canonical_source: examples/BEHAVIORAL_ACCESSIBILITY_AUTOMATION.md
last_synced_commit: "a5967b3"
last_synced_date: "2026-07-25"
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
```

## How to Update This Skill

When the canonical source changes and CI flags drift:

1. Open both files side-by-side
2. Review the diff linked in the GitHub issue/PR comment
3. Update `SKILL.md` to reflect new requirements, changed patterns, or removed guidance
4. Set `last_synced_commit` to the current commit SHA of `mgifford/ACCESSIBILITY.md`
5. Rebuild: `cd skills && zip -r behavioral-a11y.skill behavioral-a11y/`
