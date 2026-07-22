# Sync Metadata

```yaml
canonical_source: examples/PROGRESSIVE_ENHANCEMENT_BEST_PRACTICES.md
last_synced_commit: "bb235f3"
last_synced_date: "2026-07-22"
skill_maintainer: ""
notes: >
  Canonical example file exists in mgifford/ACCESSIBILITY.md.
  This skill was already ~91% content-overlapping with canonical (near
  word-for-word) at sync time, so no content rewrite was needed. Only
  wrapper differences (YAML frontmatter, "Canonical source" note, trailing
  References section additions) distinguish it from the canonical prose.

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
5. Rebuild: `cd skills && zip -r progressive-enhancement.skill progressive-enhancement/`
