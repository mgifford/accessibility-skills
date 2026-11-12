# Local Development and Synchronization Workflow

This document describes the local-first workflow for maintaining this
repository together with
[mgifford/ACCESSIBILITY.md](https://github.com/mgifford/ACCESSIBILITY.md).
The repositories remain independent checkouts and Git histories.

## Ownership model

| Repository | Canonical for | Local role |
| --- | --- | --- |
| `ACCESSIBILITY.md` | Policy, governance, best-practice guides in `examples/`, testing guidance, trusted resources, finding terminology and schemas, comparisons | Canonical source and registry owner |
| `accessibility-skills` | Portable agent skills, role-aware guidance, evaluation fixtures, tests, concise derivatives | Distillations and synchronization engine |

**Skills are distillations, not copies.** A canonical guide can change without
requiring a skill change. It always requires a reviewed decision.

The canonical registry is
`ACCESSIBILITY.md/examples/TRUSTED_SOURCES.yaml`. This repository does not
maintain a second copy.

## What already existed, and what changed

The audit found that the repositories already had a useful foundation:

- `skills/*/SYNC.md` recorded a canonical source and a reviewed commit.
- `VOCABULARY_SYNC.md` mapped shared finding terminology, schemas, and
  fingerprints to multiple consumers.
- `scripts/sync-check.sh` already compared recorded commits and detected
  vocabulary drift.
- Both repositories already had scheduled synchronization workflows.

The confirmed defects were:

- the ACCESSIBILITY.md workflow fetched the wrong upstream path and used a
  line-count comparison between full guides and distilled skills;
- the skills engine used raw content diffs for most skills, so intentional
  summarization looked like drift while real canonical changes could be hidden;
- the workflow checkout was shallow, so recorded commits were often unavailable;
- both repositories could open separate issues for the same finding;
- a lockfile-only change under `examples/schemas/` looked like vocabulary drift;
- review decisions were recorded only by hand-editing YAML, with no command to
  show the diff or advance the review safely.

The current workflow keeps the existing `SYNC.md` and `VOCABULARY_SYNC.md`
records and adds a local CLI around the same shell engine. No second mapping
table, database, service, or LLM dependency was introduced.

## Repository discovery

Both repositories can be anywhere. Discovery uses this precedence:

1. `--canonical PATH` and `--skills PATH`
2. `ACCESSIBILITY_MD_DIR` and `ACCESSIBILITY_SKILLS_DIR`
3. `sync.config.yaml` or `.accessibility-sync.local.yaml`
4. Sibling directories (`../ACCESSIBILITY.md`, `../accessibility-skills`)
5. A clear error explaining how to provide the path

The tool resolves each path with `git rev-parse --show-toplevel`, checks the
expected repository markers, and rejects an unrelated checkout. An explicit
path that is not a Git checkout is an error; it is never silently replaced by
a sibling.

Copy [`sync.config.example.yaml`](./sync.config.example.yaml) to
`sync.config.yaml` for a committed relationship, or to
`.accessibility-sync.local.yaml` for a machine-specific override. The local
override is ignored by Git. Relative paths resolve from the config file.

```yaml
repositories:
  canonical:
    path: ../ACCESSIBILITY.md
    remote: https://github.com/mgifford/ACCESSIBILITY.md
  skills:
    path: .
    remote: https://github.com/mgifford/accessibility-skills

sync:
  base_ref: last_synced
  mode: review
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run sync:status` | Branch, HEAD, dirty state, per-skill status, vocabulary status, missing mappings |
| `npm run sync:list` | Explicit source-to-skill and vocabulary-consumer map |
| `npm run sync:diff -- --skill forms` | Canonical path, recorded/current commits, upstream diff, related vocabulary |
| `npm run sync:review` | List decisions that need to be made |
| `npm run sync:review -- --skill forms --decision no-update --note "No material change"` | Record a review decision without editing `SKILL.md` |
| `npm run sync:validate` | Engine, vocabulary, sync tests, repository invariants, eval-manifest validation |
| `npm run sync:report -- --output sync-report.md` | Markdown report for a PR or issue |
| `npm run sync:report -- --format json` | Machine-readable report for CI or tooling |

Useful options:

- `--canonical PATH`, `--skills PATH`, `--config PATH`
- `--all` for `diff`/`review`
- `--dry-run` to inspect a metadata change
- `--show-skill` to print the current `SKILL.md` with the diff
- `--interactive` for a terminal prompt (optional; never required)
- `--allow-remote-mismatch` for intentional forks
- `--no-tests` to validate only the synchronization state

## Statuses

| Status | Meaning |
| --- | --- |
| `SYNCED` | Reviewed against the recorded canonical source, or no content changed |
| `DEFERRED` | Review is unresolved; the deferred source revision did not advance |
| `REVIEW_REQUIRED` | Canonical source changed, or an external review is due |
| `INTENTIONAL_DIVERGENCE` | Reviewed, and the difference is deliberately retained |
| `MISSING_SOURCE` | Canonical file cannot be located |
| `MISSING_SKILL` | Expected skill file cannot be located |
| `INVALID_METADATA` | Missing, stale, or inconsistent `SYNC.md` metadata |
| `UNVERIFIED` | Reliable status could not be established |
| `NOT_APPLICABLE` | The skill has no single canonical prose source, with a recorded reason |
| `EXTERNAL` | Externally maintained source, not compared to a local checkout |

A small text diff is not evidence of synchronization. Status comes from the
recorded commit and the canonical history.

## Review decisions

`SYNC.md` keeps its existing fields and gains review fields only when a
maintainer records a decision:

```yaml
canonical_source: examples/FORMS_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: "<source sha>"
last_synced_date: "2026-11-12"
last_reviewed_commit: "<source sha>"
review_decision: no-update-needed
intentional_divergence_note: "<only for intentional-divergence>"
# Deferred reviews add these without advancing the fields above:
# review_decision: deferred
# deferred_source_commit: "<source sha>"
# deferred_date: "<ISO date>"
```

Supported decisions:

| Decision | Metadata effect |
| --- | --- |
| `update` | Advance `last_synced_commit`, `last_reviewed_commit`, date; `review_decision: updated` |
| `no-update` | Advance the same fields; `review_decision: no-update-needed` |
| `divergence` | Advance the reviewed revision and record `review_decision: intentional-divergence` plus a note; status is `INTENTIONAL_DIVERGENCE`, not `SYNCED` |
| `defer` | Record `review_decision: deferred`, `deferred_source_commit`, and `deferred_date`; append a review-history note; do **not** advance `last_synced_commit` or `last_reviewed_commit` |

Recording a decision is an acknowledgement of review. It is not evidence that
the skill was regenerated, tested, or certified.

`sync:review` never edits `SKILL.md`. Edit the skill first when the decision is
`update`, then record the decision.

## Typical local cycle

```bash
# 1. Inspect both checkouts
npm run sync:status

# 2. See the exact upstream change
npm run sync:diff -- --skill keyboard

# 3. Update only the affected skill, if needed
#    (optionally use prompts/UPDATE_SKILL_FROM_CANONICAL.md)

# 4. Record the decision
npm run sync:review -- --skill keyboard --decision update --note "Adds focus-visible guidance"

# 5. Validate
npm run sync:validate

# 6. Commit in each repository independently and open coordinated PRs
npm run sync:report -- --output sync-report.md
```

If the canonical guide needs a correction, edit it in `ACCESSIBILITY.md` and
follow that repository's tests. Do not change the skill to compensate for a
canonical error. Do not edit both repositories during a read-only check.

## Pull request order

A skills change that depends on an unmerged canonical commit should record the
canonical branch commit only for local review. For a PR:

1. Open the canonical documentation PR first.
2. Open the skills PR with its `SYNC.md` entries pointing at a commit that will
   remain reachable.
3. Prefer a merge commit in the canonical repository. If it is squash-merged,
   advance the skills metadata to the resulting commit and rerun
   `npm run sync:validate`.

CI must report a source revision that is unavailable instead of silently
comparing against the latest unrelated commit.

## GitHub Actions

- `ci.yml` runs the deterministic Node tests, including the sync CLI tests.
- `skill-sync-check.yml` checks out both repositories with full history and
  runs the same `scripts/sync-check.sh` engine. It opens or updates one issue
  per finding; an unchanged report is a no-op.
- The ACCESSIBILITY.md workflow runs the same engine and links to the skills
  issue instead of creating a duplicate.

Ordinary local checks need no GitHub credentials, network access, AI service,
or paid API. The scheduled workflow needs GitHub's issue permission only when
it records a finding.

## Optional AI assistance

[`prompts/UPDATE_SKILL_FROM_CANONICAL.md`](./prompts/UPDATE_SKILL_FROM_CANONICAL.md)
provides a bounded drafting task. AI may propose a minimal edit; it may not
certify accessibility, invent requirements, change canonical guidance, or
advance synchronization metadata. The maintainer records the decision and runs
the deterministic checks.

## Limits

- The tool verifies recorded commits and structural metadata, not the semantic
  quality of a skill.
- Evals are guardrails. They do not replace testing with assistive technology
  or disabled users.
- External resources are not fetched by the sync CLI. Review dates and
  provenance are recorded in the canonical registry.
- Legacy `SYNC.md` records with a short commit are accepted while the commit is
  present in the canonical checkout. Full history is required for reliable
  comparison.
