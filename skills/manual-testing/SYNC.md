# Sync Metadata

```yaml
canonical_source: examples/MANUAL_ACCESSIBILITY_TESTING_GUIDE.md
last_synced_commit: ""
last_synced_date: "2026-05-04"
skill_maintainer: ""
notes: >
  Canonical example file exists in mgifford/ACCESSIBILITY.md.
  Skill was authored from that file. Set last_synced_commit to the
  current commit SHA of mgifford/ACCESSIBILITY.md after verifying sync.
```

## How to Update This Skill

When the canonical source changes and CI flags drift:

1. Open both files side-by-side
2. Review the diff linked in the GitHub issue/PR comment
3. Update `SKILL.md` to reflect new requirements, changed patterns, or removed guidance
4. Set `last_synced_commit` to the current commit SHA of `mgifford/ACCESSIBILITY.md`
5. Rebuild: `cd skills && zip -r manual-testing.skill manual-testing/`
