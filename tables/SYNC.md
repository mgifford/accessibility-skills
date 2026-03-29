# Sync Metadata

Links this skill to its canonical source. Read by `.github/workflows/skill-sync-check.yml`.

## Source

```yaml
canonical_source: examples/TABLES_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: ""
last_synced_date: "2026-03-29"
skill_maintainer: ""
notes: >
  Canonical example file does not yet exist in mgifford/ACCESSIBILITY.md.
  This skill was authored first; the example file should be created to match
  the structure and patterns in SKILL.md, then last_synced_commit updated.
```

## How to Update This Skill

When the canonical source changes and CI flags drift:

1. Open both files side-by-side
2. Review the diff linked in the GitHub issue/PR comment
3. Update `SKILL.md` to reflect new requirements, changed patterns, or removed guidance
4. Set `last_synced_commit` to the current commit SHA of `mgifford/ACCESSIBILITY.md`
5. Rebuild: `cd skills && zip -r tables.skill tables/`
