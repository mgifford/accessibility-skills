# Sync Metadata

```yaml
canonical_source: examples/MANUAL_ACCESSIBILITY_TESTING_GUIDE.md
last_synced_commit: "c8f7f47"
last_synced_date: "2026-07-25"
skill_maintainer: ""
notes: >
  Canonical example file exists in mgifford/ACCESSIBILITY.md.
  Skill content resynced from canonical source, folding in new sections
  (component workflow tests for forms/modals/SPAs, issue documentation
  template, disability-inclusive testing participation, quick-reference
  checklists) into the existing severity-tagged skill format.

  2026-07-25 (commit c8f7f47): split SC 1.4.10 Reflow testing from SC 1.4.4
  Resize Text testing with the precise two-dimensional-layout exception;
  split SC 2.4.7 Focus Visible / SC 1.4.11 Non-text Contrast / SC 2.4.13
  Focus Appearance into distinct checks; added CWAC screenshot-difference
  testing description and its documented limitations; linked to the new
  skills/behavioral-a11y/SKILL.md for the automated Reflow risk and Focus
  Visible risk indicators referenced by the canonical guide.

  DIVERGENCE: This skill's format (YAML frontmatter, severity-tagged
  sections, condensed Definition of Done checklist) intentionally differs
  from the canonical file's prose structure. Content substance is synced;
  presentation format is not expected to match verbatim.
```

## How to Update This Skill

When the canonical source changes and CI flags drift:

1. Open both files side-by-side
2. Review the diff linked in the GitHub issue/PR comment
3. Update `SKILL.md` to reflect new requirements, changed patterns, or removed guidance
4. Set `last_synced_commit` to the current commit SHA of `mgifford/ACCESSIBILITY.md`
5. Rebuild: `cd skills && zip -r manual-testing.skill manual-testing/`
