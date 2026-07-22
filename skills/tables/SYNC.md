# Sync Metadata

Links this skill to its canonical source. Read by `.github/workflows/skill-sync-check.yml`.

## Source

```yaml
canonical_source: examples/TABLES_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: "bb235f3"
last_synced_date: "2026-07-22"
skill_maintainer: ""
notes: >
  Canonical example file now exists in mgifford/ACCESSIBILITY.md. Full resync
  performed.
  CORRECTIONS: canonical clarifies <caption> is not an absolute requirement
  for conformance in every case (prior skill framed it as universal);
  responsive CSS should NOT default to display:block card layout (prior
  skill recommended a data-label card pattern as the default small-screen
  fix) -- canonical prefers a real alternate list/definition-list view over
  destroying table display semantics. Added sticky headers/columns, row
  selection/actions, expandable rows, forms/editing in tables, and
  virtualization guidance, none of which existed in the prior skill version.

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
5. Rebuild: `cd skills && zip -r tables.skill tables/`
