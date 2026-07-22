# Sync Metadata

```yaml
canonical_source: examples/SPEECH_RECOGNITION_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: "bb235f3"
last_synced_date: "2026-07-22"
skill_maintainer: ""
notes: >
  GAP FOUND AND FIXED: this skill did not exist at all prior to 2026-07-22.
  The canonical file examples/SPEECH_RECOGNITION_ACCESSIBILITY_BEST_PRACTICES.md
  (594 lines, covering speech input/voice control accessibility) had no
  corresponding skill in this repo. It was missed during the initial 24-skill
  sync pass because that pass worked from scripts/sync-check.sh's SKILL_LIST
  array rather than the full examples/ directory listing, and speech
  recognition was never added to that array. Authored from scratch following
  the same condensed severity-tagged format as the other skills. Added to
  sync-check.sh's SKILL_LIST.

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
5. Rebuild: `cd skills && zip -r speech-recognition.skill speech-recognition/`
