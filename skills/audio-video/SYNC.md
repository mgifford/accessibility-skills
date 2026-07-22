# Sync Metadata

```yaml
canonical_source: examples/AUDIO_VIDEO_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: "bb235f3"
last_synced_date: "2026-07-22"
skill_maintainer: ""
notes: >
  Canonical example file exists in mgifford/ACCESSIBILITY.md.
  Substantial resync. Notable changes: canonical dropped the specific "Able
  Player" recommendation the prior skill version had, replacing it with
  "do not designate one player library as universally accessible -- evaluate
  and test the selected version." CORRECTION: Corrected live-caption framing: WCAG 1.2.4
  is NOT qualified by a general "technically feasible" exception at AA (prior
  skill version implied more flexibility here). Added embedded/third-party
  player guidance, decorative background video pattern (with the
  animation-play-state-does-not-pause-video correction), and a full
  production workflow section (before/during/after recording).

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
5. Rebuild: `cd skills && zip -r audio-video.skill audio-video/`
