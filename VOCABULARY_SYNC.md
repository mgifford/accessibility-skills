# Canonical Vocabulary Sync

Most skills in this repository sync 1:1 against a single canonical prose
guide in `mgifford/ACCESSIBILITY.md` — see each skill's own `SYNC.md` and
`scripts/sync-check.sh`, which tracks exactly that mapping.

A smaller set of canonical sources define **shared vocabulary and
machine-readable structure** — terminology, lifecycle states, fingerprint
identity, and (since schema `2.1`) policy classification (`obligation`,
`handling`, `evidence_status`) — that several skills reference even when
that source is not their primary canonical file. A change to one of these
sources can require review across multiple skills at once, which a
single-skill-to-single-file mapping does not catch. This file documents
that mapping; `scripts/sync-check.sh --vocab` checks it.

## Shared vocabulary sources

| Canonical source | Defines | Consumed by |
| --- | --- | --- |
| `examples/ACCESSIBILITY_FINDING_TRACKING.md` (`mgifford/ACCESSIBILITY.md`) | Finding/occurrence/pattern terminology, lifecycle states, actionability stages, **Policy Classification** (`obligation`, `handling`, `evidence_status`, suppression requirements), and (since 2026-07-31) **Local and upstream trackers** — `tracking.tracker_ids` as an array supporting independent local/upstream relationships, and the rule that a closed or merged upstream tracker is not evidence of resolution | `skills/bug-reporting/SKILL.md`, `skills/axe-rules/SKILL.md`, `skills/ci-cd/SKILL.md`, `skills/cli-audit/SKILL.md`, `skills/upstream-first/SKILL.md`, `workflows/decision-states.md`, `workflows/end-to-end.md` |
| `examples/schemas/` (`accessibility-finding-v2.schema.json`, `README.md`, and the `accessibility-finding-v2*.json` examples) | The versioned `schema_version` record shape, including the `2.1` `policy` object | `skills/bug-reporting/SKILL.md` (machine-readable finding example), `skills/axe-rules/SKILL.md`, `skills/ci-cd/SKILL.md`, `skills/cli-audit/SKILL.md` |
| `examples/fingerprints/` (`README.md`, `a11y-pattern-v1.json`, `a11y-occurrence-v1.json`) | Fingerprint profile identity and computation | `skills/bug-reporting/SKILL.md` (deduplication section) |

`skills/axe-rules/SKILL.md`, `skills/ci-cd/SKILL.md`, and
`skills/cli-audit/SKILL.md` do not have `ACCESSIBILITY_FINDING_TRACKING.md`
or `examples/schemas/` as their primary `canonical_source` in their own
`SYNC.md` (`cli-audit` has no single canonical prose source at all — see its
`SKILL.md` header). `scripts/sync-check.sh`'s per-skill check therefore
cannot detect drift in the shared vocabulary those skills reference. The
`--vocab` check below closes that gap.

## What `--vocab` checks

```bash
./scripts/sync-check.sh --vocab
```

For each shared vocabulary source above, this compares the source's latest
commit in the `ACCESSIBILITY.md` checkout against a `last_synced_commit`
recorded once per source in this file (below), independent of any single
skill's own `SYNC.md`. If the source has moved since that recorded commit,
every skill listed as a consumer is reported `[VOCAB REVIEW]` — even skills
whose own primary-canonical-source check reports `[SYNCED]`.

This does not replace each skill's own `SYNC.md`/`sync-check.sh` entry; it
adds a second, cross-cutting check for sources that are consumed by more
than one skill's operational guidance without being anyone's single
canonical source.

```yaml
# Recorded sync points for shared vocabulary sources.
# Update after reviewing every listed consumer skill, not just one.
vocab_sync:
  examples/ACCESSIBILITY_FINDING_TRACKING.md: "123c1f66d764d6ee4b5b44bb8656abf549727a82"
  examples/schemas/: "6d9d2967daee194658265bc2f57373fa126ae7f5"
  examples/fingerprints/: "b87a2994aba52de491340490fb969df954180e18"
```

Directory sources ignore dependency lockfiles (`package-lock.json`,
`npm-shrinkwrap.json`, `yarn.lock`, `pnpm-lock.yaml`). A lockfile-only bump is
not a vocabulary change. This prevents dependency maintenance from creating a
false review item.

## Review log

### 2026-11-11: `ACCESSIBILITY_FINDING_TRACKING.md` (f2c89d7 -> 123c1f6)

The canonical guide added an evidence-artifact reference and a tool/session
node reference, and stated that Playwright MCP refs and Chrome CDP `AXNodeId`
or DOM node IDs are evidence metadata rather than tracker IDs, durable
locators, or fingerprint inputs.

Consumer decisions:

| Consumer | Decision |
| --- | --- |
| `skills/bug-reporting/SKILL.md` | Updated: added the session-identifier boundary and the observed/potential/verified/assumption evidence states. |
| `skills/axe-rules/SKILL.md` | Reviewed; no change needed. It classifies automated results but does not define identity fields. |
| `skills/ci-cd/SKILL.md` | Reviewed; no vocabulary change needed. Its separate canonical update is recorded in its own `SYNC.md`. |
| `skills/cli-audit/SKILL.md` | Updated: reporting requirements now state that MCP refs and browser node IDs are session metadata. |
| `skills/upstream-first/SKILL.md` | Reviewed; no change needed. It does not assign finding identity. |
| `workflows/decision-states.md` | Reviewed; no change needed. The new vocabulary does not alter its decision states. |
| `workflows/end-to-end.md` | Reviewed; no change needed. The new vocabulary does not alter its workflow order or ownership. |

### 2026-11-11: `examples/schemas/` (6d9d296 -> 037a1d2)

The only intervening change was a `package-lock.json` dependency bump. No
schema, example, or README change. No consumer review was required; the
directory-source check now ignores lockfiles and reports this source synced.

## How to update

When `ACCESSIBILITY_FINDING_TRACKING.md`, `examples/schemas/`, or
`examples/fingerprints/` changes in `mgifford/ACCESSIBILITY.md`:

1. Run `./scripts/sync-check.sh --vocab` (or wait for CI to flag it).
2. Review the diff for every consumer skill listed above, not only the one
   that prompted the change.
3. Update each affected `SKILL.md` and its own `SYNC.md`.
4. Update the relevant `vocab_sync` commit in this file only after every
   listed consumer has been reviewed.
