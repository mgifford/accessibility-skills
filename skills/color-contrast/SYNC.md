# Sync Metadata

```yaml
canonical_source: examples/COLOR_CONTRAST_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: "bb235f3"
last_synced_date: "2026-07-21"
skill_maintainer: ""
notes: >
  Canonical example file exists in mgifford/ACCESSIBILITY.md.
  Skill content resynced, folding in light-dark() and prefers-contrast,
  color-mix()/contrast-color() caveats, opacity/overlay least-favorable-region
  testing, disabled-control nuance, and full component-state testing
  checklist. CORRECTION: Also removed a prior reference to axe rule IDs `focus-visible`
  and `focus-order-semantics` which do not exist in axe-core — canonical
  source flags these as a common citation error.

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
5. Rebuild: `cd skills && zip -r color-contrast.skill color-contrast/`
