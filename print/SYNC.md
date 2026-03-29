# Sync Metadata

Links this skill to its canonical source in the repository.
Read by `.github/workflows/skill-sync-check.yml` to detect drift.

## Source

```yaml
canonical_source: examples/PRINT_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: ""
last_synced_date: ""
skill_maintainer: ""
```

## How to Update This Skill

When the canonical source changes and CI flags drift:

1. Open both files side-by-side
2. Review the diff linked in the GitHub issue/PR comment
3. Update `SKILL.md` to reflect new requirements, changed patterns, or removed guidance
4. Set `last_synced_commit` to the current commit SHA
5. Rebuild: `cd skills && zip -r print.skill print/`

## What Stays in Sync

- All Definition of Done checklist items
- Required patterns (HTML/CSS/JS structure, ARIA usage)
- New WCAG criteria or browser behavior changes
- Removal of previously recommended patterns

## What Does NOT Need to Mirror the Source

- Extended prose rationale
- Background context
- Full code examples already covered in condensed form in SKILL.md
- Links to external articles
