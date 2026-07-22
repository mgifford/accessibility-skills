# Sync Metadata

```yaml
canonical_source: examples/CHARTS_GRAPHS_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: "bb235f3"
last_synced_date: "2026-07-21"
skill_maintainer: ""
notes: >
  Canonical example file exists in mgifford/ACCESSIBILITY.md.
  Substantial resync: added layered information model, per-chart-type
  guidance, sonification, export/download requirements. CORRECTION: Notable correction:
  canonical clarifies role="list"/role="listitem" on descendants of an SVG
  root with role="img" is not just inconsistently supported across screen
  readers (as the prior skill version said) but architecturally wrong —
  role="img" descendants are presentational by definition. Choose atomic
  role="img" OR a tested structured graphics model, not both.

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
5. Rebuild: `cd skills && zip -r charts-graphs.skill charts-graphs/`
