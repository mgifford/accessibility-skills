# Sync Metadata

```yaml
canonical_source: examples/NAVIGATION_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: "bb235f3"
last_synced_date: "2026-07-21"
skill_maintainer: ""
notes: >
  Canonical example file exists in mgifford/ACCESSIBILITY.md.
  Skill content resynced. CORRECTION: Notable correction: responsive/mobile nav should be
  a non-modal disclosure by default (no inert on the rest of the page) unless
  it's genuinely a modal drawer with full modal implementation — prior skill
  version instructed applying inert to background for any mobile nav. Also
  corrected aria-current guidance (page/step/location/date/time vs blanket
  "true"), and added Multiple Ways (2.4.5) and Consistent Navigation (3.2.3).
  Retained skill-specific AT-context table and CMS notes (Drupal/WordPress)
  not present in canonical source as added value.

  DIVERGENCE: This skill's format (YAML frontmatter, severity-tagged
  sections, condensed Definition of Done checklist) intentionally differs
  from the canonical file's prose structure. Content substance is synced;
  presentation format is not expected to match verbatim.
```

## How to Update

1. Review diff linked in CI issue
2. Update SKILL.md
3. Set last_synced_commit to current SHA of mgifford/ACCESSIBILITY.md
4. Rebuild: `cd skills && zip -r navigation.skill navigation/`
