# Sync Metadata

```yaml
canonical_source: examples/PLAIN_LANGUAGE_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: "bb235f3"
last_synced_date: "2026-07-22"
skill_maintainer: ""
notes: >
  Fixed stale metadata: this file previously referenced a nonexistent
  PLAIN_LANGUAGE_BEST_PRACTICES.md and said the canonical file "does not yet
  exist" -- the canonical file exists at
  examples/PLAIN_LANGUAGE_ACCESSIBILITY_BEST_PRACTICES.md (matching
  sync-check.sh's already-correct mapping). Content overlap was already ~90%
  at sync time (content-only, ignoring frontmatter/blank lines), so no
  rewrite was needed beyond correcting this metadata.

  DIVERGENCE: This skill's format (YAML frontmatter, severity-tagged
  sections, condensed Definition of Done checklist) intentionally differs
  from the canonical file's prose structure. Content substance is synced;
  presentation format is not expected to match verbatim.
```

## How to Update

1. Review diff linked in CI issue
2. Update SKILL.md
3. Set last_synced_commit to current SHA of mgifford/ACCESSIBILITY.md
4. Rebuild: `cd skills && zip -r plain-language.skill plain-language/`
