# Sync Metadata

Links this skill to its canonical source. Read by `.github/workflows/skill-sync-check.yml`.

## Source

```yaml
canonical_source: examples/CI_CD_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: "a5967b3"
last_synced_date: "2026-07-25"
skill_maintainer: ""
notes: >
  Canonical example file exists in mgifford/ACCESSIBILITY.md; that guide
  explicitly states sync with this skill is NOT automatic.
  Substantial resync. CORRECTIONS: Key corrections carried over: Lighthouse/axe scores are
  not conformance percentages; tool severity labels are triage inputs, not
  project severity (mapped via task-impact table, not 1:1 axe severity);
  hardened workflow security (persist-credentials: false, avoid
  pull_request_target for untrusted PRs, full commit SHA pinning); reworked
  AI remediation section to explicitly treat all scan/issue input as
  untrusted, require manual-trigger-only workflows with read-only token scope
  and shell/URL/memory tool denial, and never let the agent commit/push/merge
  itself. Removed the prior "Zero-Debt / 100% Lighthouse" framing which
  canonical no longer uses.

  2026-07-25 (commit a5967b3, via BEHAVIORAL_ACCESSIBILITY_AUTOMATION.md):
  added "Risk Indicators and Build Gates" section — behavioral checks
  (Reflow risk, Focus Visible risk) produce indicators, not conformance
  verdicts; added the default CI treatment table and fleet-scan
  requirements (root-cause clustering, reviewed baselines, exception
  expiry, periodic clean-result sampling). Cross-references new
  skills/behavioral-a11y/SKILL.md.

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
5. Rebuild: `cd skills && zip -r ci-cd.skill ci-cd/`
