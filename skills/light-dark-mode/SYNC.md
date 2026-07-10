# Sync Metadata

```yaml
canonical_source: examples/LIGHT_DARK_MODE_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: "0bfe3b9"
last_synced_date: "2026-07-10"
skill_maintainer: ""
notes: >
  Canonical example file exists in mgifford/ACCESSIBILITY.md.
  Skill is maintained to match that source. Set last_synced_commit to the
  current commit SHA of mgifford/ACCESSIBILITY.md after verifying sync.
```

## How to Update This Skill

When the canonical source changes and CI flags drift:

1. Open both files side-by-side
2. Review the diff linked in the GitHub issue/PR comment
3. Update `SKILL.md` to reflect new requirements, changed patterns, or removed guidance
4. Set `last_synced_commit` to the current commit SHA of `mgifford/ACCESSIBILITY.md`
5. Rebuild: `cd skills && zip -r light-dark-mode.skill light-dark-mode/`
