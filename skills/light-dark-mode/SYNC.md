# Sync Metadata

```yaml
canonical_source: examples/LIGHT_DARK_MODE_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: "f7e3c24a222a787180d554fd1df4793bc05b39e2"
last_synced_date: "2026-11-11"
last_reviewed_commit: "f7e3c24a222a787180d554fd1df4793bc05b39e2"
review_decision: updated
skill_maintainer: ""
notes: >
  Canonical example file exists in mgifford/ACCESSIBILITY.md.
  DIVERGENCE: Canonical source uses two-option binary toggle with radiogroup.
  This skill uses three-option (System/Light/Dark) with native buttons and
  aria-pressed. The enhanced pattern was adopted to better support user
  personalization (WCAG 1.3.11) and to avoid radiogroup anti-patterns in
  this context. When re-syncing with canonical source, preserve the
  three-option pattern as the authoritative approach.

  2026-07-22: added a reference to examples/MODERN_CSS_THEME_ARCHITECTURE.md,
  a canonical file with no other skill link anywhere in this repo. It covers
  semantic design tokens and theme architecture that complements this
  skill's content; not folded into the skill body itself, just linked.
```

## Review history

- 2026-11-11 sync (1374d8f -> f7e3c24): canonical was restructured around required outcomes, System/Light/Dark selection, forced-colours, and the separation of `prefers-contrast` from `prefers-color-scheme`. The skill already covered the three-option selector, storage, anti-flash, forced-colours, and reduced-motion requirements; added a concise "Increased and Reduced Contrast Preferences" section so the skill no longer omits that distinct preference. No wholesale copy of the rewritten canonical guide.

## How to Update This Skill

When the canonical source changes and CI flags drift:

1. Open both files side-by-side
2. Review the diff linked in the GitHub issue/PR comment
3. Update `SKILL.md` to reflect new requirements, changed patterns, or removed guidance
4. Set `last_synced_commit` to the current commit SHA of `mgifford/ACCESSIBILITY.md`
5. Rebuild: `cd skills && zip -r light-dark-mode.skill light-dark-mode/`
