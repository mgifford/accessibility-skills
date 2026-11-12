# Accessibility Guidance and Skills: Operating Model

**Status:** Implemented operating model, with documented follow-ups
**Scope:** `mgifford/ACCESSIBILITY.md` and `mgifford/accessibility-skills`  
**Principle:** Maintain authoritative guidance once, derive useful skills, and verify changes through evidence and review.

## 1. Purpose

This operating model describes how two independent open source repositories work together to maintain accessible software development guidance.

- [ACCESSIBILITY.md](https://github.com/mgifford/ACCESSIBILITY.md) maintains comprehensive accessibility guidance, governance, policies, and reusable examples.
- [accessibility-skills](https://github.com/mgifford/accessibility-skills) provides concise, actionable skills that AI coding agents and developers can apply during software development.

The repositories have different responsibilities but share a common commitment to accurate, maintainable, evidence-based accessibility guidance.

The operating model aims to:

1. Reduce duplicated maintenance.
2. Preserve clear ownership of guidance.
3. Make changes to canonical sources visible to downstream consumers.
4. Keep skills useful without reproducing entire documents.
5. Support independent Git repositories and local development.
6. Enable optional AI assistance without requiring it.
7. Preserve human accountability and review.
8. Promote authoritative external resources rather than duplicating them.

This is a maintenance and collaboration model, not a new accessibility standard.

## 2. Core principles

### One canonical source for shared guidance

Every shared requirement, definition, or reference should have a clearly identified canonical source.

Other files may summarize, reference, or operationalize that material, but should not become competing sources of authority.

### Skills are distillations, not copies

A skill extracts the instructions needed to complete a specific task.

It does not need to include the full reasoning, background, or reference material of its canonical source.

A shorter skill is not necessarily an outdated skill.

### Synchronization means reviewed alignment

Synchronization does not mean identical files.

It means the skill has been reviewed against a specific revision of its canonical source and any relevant changes have been incorporated or consciously excluded.

Each review decision must be traceable.

### External expertise remains external

W3C standards, Microsoft ACT, community accessibility guides, testing tools, and other resources should generally be linked rather than copied.

External resources retain their own governance, licenses, release cycles, and authority.

### Deterministic checks first

Git, validation scripts, schema checks, and reproducible tests should handle routine maintenance.

AI may assist with analysis and drafting, but should not be necessary to determine which files changed or whether review metadata is valid.

### Human responsibility remains explicit

AI agents may propose changes, identify inconsistencies, and execute authorized tests.

Maintainers remain responsible for accepting changes, resolving ambiguous guidance, and determining whether evidence supports accessibility claims.

## 3. Repository responsibilities

| Responsibility | Canonical location |
|---|---|
| Accessibility commitments and policies | `ACCESSIBILITY.md` |
| Comprehensive implementation guidance | `ACCESSIBILITY.md/examples/` |
| Finding terminology and schemas | `ACCESSIBILITY.md/examples/` |
| Curated external resources | `ACCESSIBILITY.md` |
| Comparisons with complementary projects | `ACCESSIBILITY.md/COMPARISONS.md` |
| Topic-specific agent skills | `accessibility-skills/skills/` |
| Skill synchronization metadata | `accessibility-skills/skills/*/SYNC.md` |
| Shared skill vocabulary dependencies | `accessibility-skills/VOCABULARY_SYNC.md` |
| Role-aware agent workflows | `accessibility-skills/` |
| Skill evaluations | `accessibility-skills/evals/` |
| Cross-repository sync review | Primarily `accessibility-skills` |

Ownership is based on the responsibility of the material, not on which repository receives a proposed change first.

A useful improvement discovered while updating a skill may need to be contributed to the canonical guide before being reflected in the skill.

## 4. Operating architecture

```text
                   External knowledge
            W3C | Microsoft ACT | Others
                            |
                       References
                            |
                            v
                  ACCESSIBILITY.md
                 Canonical guidance
                 Policies and schemas
                 Trusted resources
                            |
                     Git source diffs
                     Dependency mapping
                            |
                            v
                    Maintainer review
                +-----------------------+
                | Relevant change?      |
                | Update required?      |
                | Tests required?       |
                +-----------------------+
                            |
                    Reviewed decisions
                            |
                            v
                  accessibility-skills
                    SKILL.md files
                    SYNC.md records
                    Shared vocabulary
                    Evaluation fixtures
                            |
                 +----------+----------+
                 |                     |
                 v                     v
          Local validation       GitHub Actions
          Offline checks         PR verification
          Optional AI evals      Scheduled checks
                 |                     |
                 +----------+----------+
                            |
                            v
                    Maintainer approval
                            |
                    Independent releases
                    and pull requests
```

The synchronization direction is primarily from canonical guidance to derived skills.

However, improvements discovered in skills can flow back into `ACCESSIBILITY.md` through an explicit contribution and review process.

Neither repository automatically overwrites the other.

## 5. Local development model

The repositories remain independent Git repositories.

A typical layout is:

```text
~/git/
├── ACCESSIBILITY.md/
└── accessibility-skills/
```

Other layouts must be supported through configuration or command-line arguments.

A local synchronization tool should discover the canonical repository in this order:

1. Explicit command-line path.
2. `ACCESSIBILITY_MD_DIR` environment variable.
3. Repository-local configuration.
4. Sibling-directory discovery.
5. Clear error requesting the location.

Local paths must not be embedded into version-controlled configuration.

### Day-to-day commands

The CLI interface is implemented in `scripts/sync.mjs` and wraps the existing `scripts/sync-check.sh` engine.

```bash
# Show synchronization status
npm run sync:status

# Show canonical source changes affecting a skill
npm run sync:diff -- --skill forms

# Review changes and record a decision
npm run sync:review -- --skill forms --decision no-update --note "No material change"

# Validate synchronization records and skill files
npm run sync:validate

# Produce a Markdown maintenance report
npm run sync:report
```

The local workflow should function without GitHub credentials or external network access when both repositories and the required Git objects are available.

Checks must be safe to run against working directories containing uncommitted changes.

Read-only commands must never modify source files, metadata, or Git history.

## 6. Synchronization lifecycle

### Step 1: Identify a source change

The synchronization system compares the current canonical source revision with the last reviewed revision recorded for the relevant skill.

For example:

```text
Canonical source:
  examples/FORMS_ACCESSIBILITY_BEST_PRACTICES.md

Consuming skill:
  skills/forms/SKILL.md

Review record:
  skills/forms/SYNC.md
```

The Git history identifies changes since the recorded source commit.

The system must distinguish committed changes from uncommitted working-tree changes.

A working-tree modification can be reviewed provisionally but cannot be represented by a commit SHA until committed.

### Step 2: Identify affected consumers

Use the existing `SYNC.md` mappings and `VOCABULARY_SYNC.md`.

One canonical guide may affect one skill. Shared definitions or schemas may affect several.

The review report should show every known consumer.

### Step 3: Review the actual changes

Compare:

- Previous canonical source revision.
- Current canonical source revision.
- Existing skill content.
- Relevant shared dependencies.
- Any documented intentional divergence.

Do not compare the full documents using line-count thresholds as the primary drift detection mechanism.

A skill may contain 40 lines derived from a 400-line reference and still be fully aligned.

### Step 4: Record a review decision

Each affected skill receives one of four review outcomes:

**Update required**

The canonical change materially affects the skill. Update the skill and validate it.

**No change required**

The source changed, but the skill remains accurate and appropriately scoped. Record the reason.

**Intentional divergence**

The skill deliberately differs from its canonical source. Document the distinction and why it is appropriate.

**Deferred**

The impact is uncertain or requires additional review. Preserve the existing synchronization state and track the unresolved work.

### Step 5: Validate

Run:

- Structural validation.
- Link and reference checks.
- Synchronization metadata validation.
- Relevant skill tests.
- Shared vocabulary checks.
- Applicable evaluation fixtures.

Optional model evaluations should be separately identified.

### Step 6: Advance the review record

Only after an explicit review decision and required validation may the recorded source revision advance.

The metadata should record:

- Canonical source.
- Reviewed commit.
- Review date.
- Review outcome.
- Intentional divergence, if relevant.
- Relevant validation evidence, where available.

Updating the source commit is a review acknowledgement. It must not be presented as proof of accessibility conformance.

### Step 7: Submit changes

Changes to the two repositories are committed independently.

If both require changes, prepare coordinated pull requests.

Each PR should identify:

- The relevant canonical revision.
- The associated PR in the other repository.
- Whether one PR depends on the other.
- Tests completed.
- Outstanding limitations.

No automatic merge is required.

## 7. Synchronization states

| State | Meaning | Required response |
|---|---|---|
| `SYNCED` | Reviewed against the declared source revision | None |
| `REVIEW_REQUIRED` | Canonical source has changed | Examine changes |
| `INTENTIONAL_DIVERGENCE` | Reviewed difference is documented | Preserve and recheck when affected |
| `DEFERRED` | Review is unresolved | Track and revisit |
| `MISSING_SOURCE` | Canonical source cannot be located | Repair reference or investigate |
| `MISSING_SKILL` | Expected skill is absent | Repair mapping or recover file |
| `INVALID_METADATA` | Review record is inconsistent | Correct metadata |
| `UNVERIFIED` | Source history or required evidence is unavailable | Do not claim synchronization |

These states describe maintenance status, not accessibility quality.

A synchronized skill can still contain incorrect or incomplete guidance. That requires separate testing and review.

## 8. Shared vocabulary and cross-cutting changes

Some canonical documents affect multiple skills without being the primary source of any individual skill.

Examples include:

- Accessibility finding terminology.
- Finding lifecycle states.
- Policy classifications.
- Issue fingerprints.
- Shared reporting schemas.
- Upstream and downstream issue relationships.

`VOCABULARY_SYNC.md` documents those dependencies.

When a shared source changes, review all recorded consumers, even when their primary canonical guide has not changed.

Retain the existing `--vocab` checks and improve them where necessary.

Do not update a shared synchronization record until all affected consumers have been reviewed.

## 9. Working in both directions

Although canonical guidance normally flows into skills, useful improvements may originate in either repository.

### Canonical-first change

1. Update the best-practice guide.
2. Validate the guide.
3. Review affected skills.
4. Update skills where needed.
5. Record synchronization decisions.
6. Validate and submit changes.

### Skill-originated improvement

1. Identify a missing or incorrect implementation rule.
2. Determine whether it belongs in canonical guidance.
3. Verify the rule against authoritative references.
4. Propose the change to `ACCESSIBILITY.md`.
5. Update the consuming skill when appropriate.
6. Preserve independent review and testing.

A skill-specific instruction that does not belong in general guidance may remain local to the skill.

Document intentional differences when they affect synchronization expectations.

## 10. External resource governance

Use external resources to extend understanding, not to create redundant local documentation.

Examples include:

- W3C WAI standards and guidance.
- Microsoft Accessibility Considerations Toolkit.
- Established accessibility testing tools.
- Research on assistive technologies.
- Specialist implementation resources.
- Community-maintained accessibility skills.

`ACCESSIBILITY.md` should provide the canonical resource registry.

`accessibility-skills` may use a generated, versioned snapshot when required for offline operation.

External changes should trigger review when they materially affect referenced guidance.

Examples include:

- A broken or relocated resource.
- A superseded standard.
- Changed licensing terms.
- Material changes in a referenced methodology.
- Verified contradictions with local guidance.

Do not automatically rewrite skills merely because an external repository changed.

Preserve attribution, licensing requirements, and source provenance.

## 11. AI assistance boundaries

AI assistance is optional.

AI agents may:

- Summarize source changes.
- Identify affected skill instructions.
- Propose concise updates.
- Check references.
- Generate test fixtures.
- Identify inconsistencies.
- Draft review reports.

AI agents must not:

- Treat their own assessment as accessibility conformance evidence.
- Infer disabilities from observed behaviour.
- Invent requirements or validation results.
- Silently update synchronization metadata.
- Override canonical sources.
- Replace manual accessibility testing.
- Commit, push, or merge without authorization.

When assessing a potential accessibility barrier, distinguish observed evidence, likely impact, and unresolved assumptions.

Prefer deterministic validation whenever it can establish the required result.

## 12. Testing model

Three kinds of validation serve different purposes.

### Structural and synchronization tests

Verify that files, references, dependency mappings, and recorded revisions are internally consistent.

These should be deterministic and mandatory.

### Accessibility implementation tests

Evaluate actual examples or generated code.

Use suitable automated tools and manual testing procedures.

An automated test that reports no violations does not establish accessibility conformance.

### Agent behaviour evaluations

Test whether skills help agents produce accurate, useful guidance and implementations.

Use reproducible fixtures, explicit expectations, and controlled model configurations.

Model-based evaluations are optional and should disclose their limitations, model versions, and test conditions.

A successful skill evaluation does not establish that every subsequent agent output will be accessible.

## 13. GitHub Actions responsibilities

Local tools and CI should use the same core validation logic.

### ACCESSIBILITY.md CI

Primarily verifies:

- Canonical documentation quality.
- Schema validity.
- Internal links and resource metadata.
- Potentially affected downstream skills.

It may notify maintainers that downstream review is needed.

### accessibility-skills CI

Primarily verifies:

- Skill structure and metadata.
- Source revision references.
- Shared vocabulary synchronization.
- Reproducible evaluation fixtures.
- Undocumented drift.

Scheduled checks may detect changes that were not part of a coordinated PR.

CI should report problems rather than automatically changing content.

Avoid duplicated GitHub issues and repeated comments when the underlying state has not changed.

## 14. Maintenance and review cadence

Use event-driven checks where possible.

| Trigger | Action |
|---|---|
| Canonical guide changes | Identify affected skills |
| Shared vocabulary changes | Review all recorded consumers |
| Skill changes | Validate structure and applicable tests |
| Pull request | Run deterministic checks |
| Weekly scheduled check | Identify missed synchronization reviews |
| Periodic resource review | Verify external resource status and metadata |
| Significant standards update | Review relevant guidance and skills |

The scheduled checks are a safety net, not a substitute for reviewing changes during development.

Avoid expensive recurring scans or mandatory model calls unless there is demonstrated value.

## 15. Maintenance success measures

Evaluate the operating model using practical signals:

- Number of skills with unreviewed canonical changes.
- Age of unresolved synchronization reviews.
- Missing or invalid source references.
- Time required to review a change.
- Number of duplicated maintenance records.
- Rate of false-positive drift reports.
- Percentage of mapped skills with valid evaluation fixtures.
- Number of external resource references requiring repair.

Do not combine these into an unsupported overall accessibility score.

These are maintenance indicators, not evidence of conformance.

## 16. Implementation status and next steps

This document describes the intended operating model.

Existing functionality includes:

- Canonical guides in `ACCESSIBILITY.md`.
- Derived skills in `accessibility-skills`.
- Per-skill `SYNC.md` files.
- Shared vocabulary tracking.
- Local synchronization scripts.
- Scheduled GitHub Actions.
- Skill evaluation infrastructure.

Implemented and verified in this repository:

1. Reliable discovery of independent local repositories (`sync:status`, configuration, environment, siblings).
2. A consistent local command interface (`sync:status`, `diff`, `review`, `validate`, `report`, `list`).
3. Git-based source change review with exact commits and full history.
4. Explicit review outcomes (`updated`, `no-update-needed`, `intentional-divergence`, `deferred`).
5. Safe handling of uncommitted changes: status reports them, and a review decision refuses an uncommitted canonical revision.
6. Consistent synchronization status reporting, including `DEFERRED` and `INVALID_METADATA`.
7. Rationalized CI checks: one engine, full-history checkouts, deduplicated issues, machine-readable reports.
8. Verified workflow source paths and removed the raw-path/line-count comparison.
9. Canonical resource registry owned by `ACCESSIBILITY.md`; the duplicate skills copy was removed.
10. End-to-end tests for the maintenance lifecycle, including discovery, review decisions, metadata validation, deferred work, and report generation.

Remaining follow-up:

- Optional model-based evaluations remain outside mandatory CI and require explicit model configuration.
- A generated offline resource snapshot is not needed today; document and validate one only if a real offline consumer appears.
- The scheduled GitHub Actions behavior is verified locally and by workflow wiring tests; the next scheduled run provides live evidence.

## 17. Definition of done

The operating model is functioning when:

- A maintainer can work entirely from local clones.
- The repositories retain independent Git histories.
- Changed canonical sources reliably identify affected skills.
- Review decisions are explicit and traceable.
- Intentional skill summarization does not generate false drift.
- Shared vocabulary changes reach all recorded consumers.
- Validation works without an AI service.
- CI verifies the same underlying rules as local development.
- External resources are referenced with proper attribution.
- Maintainers can prepare coordinated PRs without manual bookkeeping across multiple unrelated tools.

**The outcome is less duplicated work, more reliable guidance, and clearer accountability for accessibility decisions.**