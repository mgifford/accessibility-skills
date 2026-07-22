# Sync Metadata

```yaml
canonical_source: examples/USER_PERSONALIZATION_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: "bb235f3"
last_synced_date: "2026-07-22"
skill_maintainer: ""
notes: >
  Canonical example file exists in mgifford/ACCESSIBILITY.md.
  Substantial resync. CORRECTION: Notable correction: canonical explicitly flags "force
  all animations to 0.01ms !important" as a common failure (it can break
  state-change logic depending on transitionend/animationend) -- prior skill
  version used exactly this blanket pattern as its recommended approach.
  Also corrected prefers-contrast handling to cover more/less/custom (prior
  version only handled "more"), and added the System -> explicit override ->
  Reset precedence model, validated-allowlist persistence pattern, and
  privacy/fingerprinting guidance.

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
5. Rebuild: `cd skills && zip -r user-personalization.skill user-personalization/`
