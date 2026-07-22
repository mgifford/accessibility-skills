# Sync Metadata

```yaml
canonical_source: examples/TOOLTIP_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: "bb235f3"
last_synced_date: "2026-07-21"
skill_maintainer: ""
notes: >
  Canonical example file exists in mgifford/ACCESSIBILITY.md.
  Canonical guide was substantially expanded (pattern-choice table, disabled
  controls, aria-details, non-text contrast nuance, extensive testing
  sections, common failures table) and removed its own severity scale in
  favor of deferring to the bug-reporting guide. This skill retains a
  skill-local severity scale for usability but content is otherwise fully
  resynced.

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
5. Rebuild: `cd skills && zip -r tooltips.skill tooltips/`
