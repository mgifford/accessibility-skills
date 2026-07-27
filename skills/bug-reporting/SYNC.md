# Sync Metadata

```yaml
canonical_source: examples/ACCESSIBILITY_BUG_REPORTING_BEST_PRACTICES.md
last_synced_commit: "e53501b793bff844b2c7b056f9b4e70b4374085e"
last_synced_date: "2026-07-27"
skill_maintainer: ""
notes: >
  Canonical example file exists in mgifford/ACCESSIBILITY.md. Complete
  philosophical rewrite: canonical moved from a rigid "8 required fields
  always" tool-output-centric model to a human-centered, evidence-based
  reporting model. CORRECTIONS: Key corrections from the prior skill version:
  (1) a full absolute DOM XPath should NOT be mandatory -- it's brittle and
  canonical explicitly lists requiring it as a common failure; (2) URLs with
  tokens/personal data must be redacted before inclusion, not just noted;
  (3) never guess or infer a disability diagnosis or population-wide impact
  from a WCAG criterion/tool rule -- canonical is emphatic on this; (4)
  severity must NOT be automatically escalated by frequency/occurrence count
  -- this directly contradicts the prior skill's "frequency amplifies
  effective severity" escalation table, which has been removed; frequency/
  reach are priority signals, kept separate from severity. Added: testing-
  with-disabled-people as a first-class evidence category distinct from
  manual evaluation, a finding lifecycle, and stronger privacy/redaction
  guidance throughout.

  DIVERGENCE: This skill's format (YAML frontmatter, severity-tagged
  sections, condensed Definition of Done checklist) intentionally differs
  from the canonical file's prose structure. Content substance is synced;
  presentation format is not expected to match verbatim.

  2026-07-27 sync pass (bb235f3 -> e53501b, Stages 1-4A of the finding
  tracking/fingerprint work, currently on branch docs/finding-tracking-stage1
  pending merge to main): replaced the stale "Deduplication" paragraph with
  the full tracker-ID/scan-request-ID/occurrence-fingerprint/pattern-
  fingerprint/display-ID distinction now defined in
  examples/ACCESSIBILITY_FINDING_TRACKING.md, including the not_observed-vs-
  resolved requirement. Replaced the "Machine-Readable Finding Schema"
  section's stale schema_version "1.1" example with a concise excerpt using
  the canonical schema_version "2.0" (examples/schemas/), linking to the
  complete/minimal examples rather than duplicating the full schema. Added
  References entries for Accessibility Finding Tracking, Fingerprint
  Profiles, and Accessibility Finding Schema. Did not change this skill's
  own severity scale, terminology table, or reporting workflow sections --
  those were not affected by the canonical changes in Stages 1-4A.

  NOTE: the linked mgifford.github.io/ACCESSIBILITY.md URLs added in this
  pass will 404 until docs/finding-tracking-stage1 is merged into
  ACCESSIBILITY.md's main branch and republished. This mirrors the same
  not-yet-live linking already present in drupal-core's and open-scans'
  Stage 4B/4C updates.
```

## How to Update This Skill

When the canonical source changes and CI flags drift:

1. Open both files side-by-side
2. Review the diff linked in the GitHub issue/PR comment
3. Update `SKILL.md` to reflect new requirements, changed patterns, or removed guidance
4. Set `last_synced_commit` to the current commit SHA of `mgifford/ACCESSIBILITY.md`
5. Rebuild: `cd skills && zip -r bug-reporting.skill bug-reporting/`
