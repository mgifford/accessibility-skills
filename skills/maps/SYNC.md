# Sync Metadata

```yaml
canonical_source: examples/MAPS_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: "bb235f3"
last_synced_date: "2026-07-22"
skill_maintainer: ""
notes: >
  Canonical example file exists in mgifford/ACCESSIBILITY.md. Complete
  restructure around a purpose-classification framework (locator, directory,
  route/wayfinding, thematic, boundary, indoor, exploratory) that didn't
  exist in the prior skill version. Added indoor wayfinding, geocoding/search
  combobox guidance, and data-quality/source documentation. CORRECTION: Canonical
  explicitly flags confusing WCAG 2.4.11 (Focus Not Obscured Minimum) with
  2.4.13 (Focus Appearance, AAA) as a common failure -- added this
  distinction. Also clarified 2.5.8 Target Size Minimum is 24x24 at AA, and
  44x44 is the 2.5.5 AAA / inclusive-practice threshold, not a universal AA
  requirement, matching the canonical's explicit "common failures" callout.

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
5. Rebuild: `cd skills && zip -r maps.skill maps/`
