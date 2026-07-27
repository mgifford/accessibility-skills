# Sync Metadata

```yaml
canonical_source: examples/ACCESSIBILITY_BUG_REPORTING_BEST_PRACTICES.md
last_synced_commit: "a4ccf278924692a3fa0e911ed6ef928676c248fa"
last_synced_date: "2026-07-27"
skill_maintainer: ""
notes: >
  2026-07-27 sync pass (ce9aa2a -> a4ccf27, mgifford/ACCESSIBILITY.md,
  "Release finding schema 2.1: add policy classification"): added the
  "Obligation and handling" note to "Serious: Standards, Rules, and Test
  Results" (obligation: required/aspirational/advisory/unmapped/not-applicable,
  assigned per standards mapping; AAA under an AA baseline target is
  aspirational, not advisory, unless locally elevated; handling:
  report/review/suppress, with suppression requiring scope, reason,
  evidence, owner, and a review/expiry date). Updated "Machine-Readable
  Finding Schema" to note schema_version "2.1"'s optional top-level
  `policy` object and link the new policy-classification examples file.
  Added guardrail item 16 to "Automation and AI Guardrails": an unreviewed
  automated result is evidence_status "automated-indicator" with handling
  "review", never straight to a confirmed/suppressed classification. Did
  not change this skill's severity scale, WCAG table, deduplication
  section, or reporting workflow -- those were not affected. See
  VOCABULARY_SYNC.md for the shared-vocabulary consumer mapping this pass
  is part of.

  PRIOR notes, retained for history:

  2026-07-27 sync pass (e53501b -> ce9aa2a, mgifford/ACCESSIBILITY.md draft
  PR #141, "Define actionable finding and repeatability policy"): added the
  actionability policy distinguishing a valid intake report from a
  remediation-ready finding. Updated the "Critical: Minimum Information"
  section to separate valid-intake fields from evaluation/remediation
  fields collected by triage, not the reporter. Added a note to "Serious:
  Add Technical Evidence" that triage -- not the reporter -- collects
  HTML/DOM/accessibility-tree evidence, and that source HTML may not match
  the live DOM. Added a new "Actionable Findings and Repeatability" section
  covering the three destinations (active remediation queue / investigation
  queue / observation history), the automated-finding actionability gate,
  comparable-run rules for not_observed vs. not_tested, and the
  aggressive-filtering exceptions for credible/high-consequence reports.
  Extended the "Automation and AI Guardrails" numbered list (items 14-15)
  and clarified the existing fingerprint-provenance sentence in
  "Deduplication and tracking" per the canonical wording (tool/rule version
  is provenance, not fingerprint identity, unless a frozen profile requires
  it). Did not change this skill's severity scale, WCAG table, or reporting
  workflow sections -- those were not affected by this canonical change.

  NOTE: last_synced_commit (ce9aa2a) is the head of
  mgifford/ACCESSIBILITY.md draft PR #141, not yet merged to main at the
  time of this sync pass. The linked mgifford.github.io/ACCESSIBILITY.md
  URLs in this file's References section will not reflect this commit's
  content until #141 merges and the site republishes.

  Also in this pass: replaced evals/bug-reporting/evals.json's three
  stale evals (which required URL/XPath/HTML/WCAG/severity/frequency as
  universal report fields, contradicting the canonical "don't reject an
  incomplete report" guidance) with 14 scenario-based evals using a new
  grouped required_concepts/prohibited_concepts format. Updated
  scripts/validate-evals.mjs and scripts/run-evals.mjs to validate and
  execute the grouped format (case-insensitive, per-alternative matching)
  while preserving the legacy must_contain_any/must_not_contain path used
  by the other 27 skills' manifests. Reworded run-evals.mjs's reports to
  describe themselves accurately as deterministic response-assertion
  checks, not AI model evaluation. Added an exact-commit sync check to
  scripts/sync-check.sh, used only for bug-reporting (see "Sync-check
  methodology" below).

  PRIOR notes, retained for history:
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

## Sync-check methodology

Unlike most skills, `bug-reporting`'s drift check
(`scripts/sync-check.sh`) does **not** rely on a raw content diff against
the canonical file — this skill's presentation (YAML frontmatter,
severity-tagged sections, condensed checklists) intentionally never
matches the canonical prose verbatim, so a raw diff always reports
"different" and cannot detect real drift.

Instead, `sync-check.sh` compares this file's `last_synced_commit` against
the most recent commit that actually touched
`examples/ACCESSIBILITY_BUG_REPORTING_BEST_PRACTICES.md` in the
`ACCESSIBILITY.md` checkout (`git log -1 -- <file>`). If they differ, the
skill is reported `[NEEDS REVIEW]` — the canonical file changed since this
skill was last reviewed, and a maintainer should read the diff and update
`SKILL.md` deliberately rather than copy the canonical file over it.

## How to Update This Skill

When the canonical source changes and CI flags drift:

1. Open both files side-by-side
2. Review the diff linked in the GitHub issue/PR comment
3. Update `SKILL.md` to reflect new requirements, changed patterns, or removed guidance
4. Set `last_synced_commit` to the current commit SHA of `mgifford/ACCESSIBILITY.md`
5. Rebuild: `cd skills && zip -r bug-reporting.skill bug-reporting/`
