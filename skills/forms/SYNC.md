# Sync Metadata

```yaml
canonical_source: examples/FORMS_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: "25a354624bc81bb54d0cf80a88d92de24db6b326"
last_synced_date: "2026-11-12"
review_decision: updated
last_reviewed_commit: "25a354624bc81bb54d0cf80a88d92de24db6b326"
skill_maintainer: ""
notes: >
  Canonical example file exists in mgifford/ACCESSIBILITY.md.
  Skill content resynced from canonical source, folding in new sections
  (Redundant Entry 3.3.7, Accessible Authentication 3.3.8 including
  show-password and one-time-code patterns, native <dialog> guidance for
  session timeout, "severity from task not rule" guidance) into the
  existing severity-tagged skill format.

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
5. Rebuild: `cd skills && zip -r forms.skill forms/`

## Review history

- 2026-11-12 reviewed 25a354624bc81bb54d0cf80a88d92de24db6b326: updated - Added a concise matching-field component note with native/server validation and no-JS requirements.
