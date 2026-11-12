# Project Learnings

A short record of what maintaining this repository taught us. It is not a
standard and not a statement that any skill is validated.

## Skills are distillations, not mirrors

The most durable design decision is that a skill carries only the instructions
an agent needs for a task. It does not reproduce the canonical guide's
reasoning, examples, or references. A shorter skill is not automatically stale,
and a large diff is not automatically drift.

The useful question is: **did the canonical change alter the agent's required
behaviour?** If not, record `no-update-needed`; if it did, make a minimal edit.

## Review decisions need to be explicit

The four outcomes that worked were:

- update the skill;
- no update needed;
- intentional divergence;
- deferred review.

A recorded commit is an acknowledgement that a source revision was reviewed.
It is not proof that the skill was regenerated or tested. Deferred reviews must
not advance the synchronization state. Intentional divergence should remain
visible as its own status, not be folded into "synced".

## One engine, local-first

The reliable workflow was:

```bash
npm run sync:status
npm run sync:diff -- --skill keyboard
npm run sync:review -- --skill keyboard --decision no-update --note "..."
npm run sync:validate
npm run sync:report -- --output sync-report.md
```

It works without a monorepo, GitHub API, paid AI service, or network when the
checkouts and commits are available. Repository discovery, Git-root validation,
and full history matter. A shallow checkout or a guessed upstream path produces
misleading results.

## Metadata is not certification

`SYNC.md` and `VOCABULARY_SYNC.md` are maintenance records. Passing the sync
engine means the records are internally consistent; it does not mean the skill
is accurate, complete, or tested. Evaluations are guardrails, not proof of
agent behaviour. Manual and assistive-technology testing remain separate.

## Shared vocabulary is the hidden dependency

Some changes affect several skills without being any one skill's canonical
source. Finding terminology, lifecycle states, schemas, and fingerprints are the
obvious examples. A vocabulary change must be reviewed across every listed
consumer, and directory checks should ignore dependency lockfiles so package
maintenance does not create false review work.

## Coordination and cleanup

- Keep the two repositories independent.
- Record a canonical commit that will remain reachable after merge; prefer a
  merge commit, or update the record after a squash.
- Do not open duplicate issues in both repositories. One repository owns the
  actionable issue.
- Keep the root for installation, policy, and skills; put architecture,
  operating-model, and workflow documentation in `docs/`.
- Delete merged branches. A long-lived branch list hides the real work and makes
  retirement harder.

## What to preserve if this work is retired

- `skills/*/SYNC.md` as the source-to-skill record.
- `VOCABULARY_SYNC.md` as the shared-dependency map.
- `scripts/sync-check.sh` and `scripts/sync.mjs` as the deterministic checks.
- The rule that no skill is rewritten automatically and no metadata advances
  without a review decision.
- The distinction between structural validation and accessibility evaluation.
