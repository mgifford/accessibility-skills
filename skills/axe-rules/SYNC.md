# Sync Metadata

```yaml
canonical_source: examples/AXE_RULES_REFERENCE.md
last_synced_commit: "bb235f3"
last_synced_date: "2026-07-21"
skill_maintainer: ""
notes: >
  DIVERGENCE: The canonical AXE_RULES_REFERENCE.md and AXE_RULES_COVERAGE.md
  files are now organized around a specific test-fixture scanner project
  (numbered test pages: page1.html-page6.html, auth/login.html, etc.) rather
  than a general-purpose rule reference. This skill preserves the prior
  general-purpose table format (rule ID -> category -> description, grouped by
  severity) and merges in the updated/expanded rule list from both canonical
  files. When re-syncing, keep the general-purpose framing as authoritative
  and pull only the rule list/severity updates from canonical.
```

## How to Update This Skill

When the canonical source changes and CI flags drift:

1. Open both files side-by-side
2. Review the diff linked in the GitHub issue/PR comment
3. Update `SKILL.md` to reflect new requirements, changed patterns, or removed guidance
4. Set `last_synced_commit` to the current commit SHA of `mgifford/ACCESSIBILITY.md`
5. Rebuild: `cd skills && zip -r axe-rules.skill axe-rules/`
