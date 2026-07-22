# Sync Metadata

```yaml
canonical_source: examples/ACCESSIBILITY_BUG_REPORTING_BEST_PRACTICES.md
last_synced_commit: "bb235f3"
last_synced_date: "2026-07-22"
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
```

## How to Update This Skill

When the canonical source changes and CI flags drift:

1. Open both files side-by-side
2. Review the diff linked in the GitHub issue/PR comment
3. Update `SKILL.md` to reflect new requirements, changed patterns, or removed guidance
4. Set `last_synced_commit` to the current commit SHA of `mgifford/ACCESSIBILITY.md`
5. Rebuild: `cd skills && zip -r bug-reporting.skill bug-reporting/`
