# Sync Metadata

```yaml
canonical_source: examples/SVG_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: "c4ecd7549aedb3fe7897a859f3390ad1ae008419"
last_synced_date: "2026-11-11"
last_reviewed_commit: "c4ecd7549aedb3fe7897a859f3390ad1ae008419"
review_decision: no-update-needed
skill_maintainer: ""
notes: >
  Canonical example file exists in mgifford/ACCESSIBILITY.md.
  CORRECTION: canonical replaced the prior "Carie Fisher pattern testing"
  framing with a purpose-driven decision model.
  GAP FOUND: canonical added an entirely new Security, Sanitization, and
  Build Processing section (trust classification, SVG-aware sanitization vs.
  DOMPurify, secure XML parsing / XXE prevention, resource limits, safe
  optimization pipeline) that was previously absent from this skill
  entirely. This is safety-critical for any project accepting untrusted or
  user-uploaded SVG.

  DIVERGENCE: retained some of the prior skill's concrete pattern examples
  (icon-in-button, sprite reuse) since they still match canonical's current
  recommendations, but restructured section order and emphasis around
  canonical's purpose-first model. This skill's format (YAML frontmatter,
  severity-tagged sections, condensed Definition of Done checklist) also
  intentionally differs from the canonical file's prose structure.
```

## Review history

- 2026-11-11 review (bb235f3 -> c4ecd75): the only canonical change was an updated SVGO documentation URL. The skill does not restate that reference. No SKILL.md content change was needed. Metadata advanced after review.

## How to Update This Skill

When the canonical source changes and CI flags drift:

1. Open both files side-by-side
2. Review the diff linked in the GitHub issue/PR comment
3. Update `SKILL.md` to reflect new requirements, changed patterns, or removed guidance
4. Set `last_synced_commit` to the current commit SHA of `mgifford/ACCESSIBILITY.md`
5. Rebuild: `cd skills && zip -r svg.skill svg/`
