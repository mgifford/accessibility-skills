---
name: upstream-first
description: >
  Load this skill before implementing a fix for a barrier that may originate
  in a shared component, design system, renderer, or external dependency
  rather than this project's own code. Decide whether the responsible fix is
  local, an existing installed capability, or an upstream contribution before
  writing a workaround. Absolutely always record any temporary local
  divergence with an owner and removal condition. Under no circumstances open,
  comment on, or submit anything in an external project without explicit
  human approval.
---

# Upstream First Skill

This skill is a pointer to
[mgifford/upstream-first](https://github.com/mgifford/upstream-first), a
separate, standalone set of agent skills for deciding where an accessibility
(or any other) fix belongs and preparing it for the receiving project. It
does not restate that project's decision hierarchy, classification steps, or
contribution workflow — those stay owned there so this skill does not drift
out of sync with a project that is still a pre-release review draft.

## When to Use This

Before implementing a fix for an accessibility barrier, check whether the
affected code is actually owned by this project:

- a shared component or design system used across multiple projects;
- a renderer, framework, or platform dependency;
- an npm/PyPI/Packagist/Composer package rather than first-party code;
- a pattern that would benefit other consumers of the same dependency, not
  only this project.

If the barrier may originate outside this project's own code, load
[`upstream-first`](https://github.com/mgifford/upstream-first/blob/main/skills/upstream-first/SKILL.md)
to decide whether the responsible fix is:

1. an existing installed capability;
2. an existing public API or extension point;
3. a suitable maintained open-source package;
4. a focused contribution to an existing project;
5. a new reusable open-source package with credible ownership; or
6. a local implementation, with a written justification for why every
   higher option is unsuitable.

Do not default to a local patch without going through this decision. A local
fix for a shared-component barrier repeats the same maintenance burden for
every other consumer of that component, and this project's users are not the
only people affected by the barrier.

## Preparing a Contribution

If the decision favors an upstream contribution, use
[`maintainer-ready-contribution`](https://github.com/mgifford/upstream-first/blob/main/skills/maintainer-ready-contribution/SKILL.md)
to prepare an issue, proposal, patch, or pull request the receiving
project's maintainers can actually review and accept.

If the issue may be a security vulnerability, do not open a public issue,
reproduction, branch, fork, or pull request. Use
[`responsible-security-disclosure`](https://github.com/mgifford/upstream-first/blob/main/skills/responsible-security-disclosure/SKILL.md)
instead.

If AI materially assisted a known contribution, run
[`ai-contribution-review`](https://github.com/mgifford/upstream-first/blob/main/skills/ai-contribution-review/SKILL.md)
before submission, when the receiving project's policy permits that use.

## Human Approval Is Required

Never open, comment on, assign, label, fork, branch, or submit anything in
an external project without a human explicitly approving that specific
action. Deciding that a change belongs upstream is not the same as being
authorized to act on that decision in someone else's project.

## Tracking Temporary Local Divergence

An urgent local patch, override, fork, pin, or workaround may be necessary
while an upstream correction is pending — accessibility barriers should not
wait on a release the project does not control. When this happens, do not
treat it as resolved. Record it as debt with:

- a downstream owner;
- an upstream reference or a documented exception if none exists;
- a risk-based review date;
- the supported versions the patch applies to;
- a removal condition (a supported upstream release adopted and verified);
  and
- a rollback plan.

If this project uses the
[ACCESSIBILITY.md](https://github.com/mgifford/ACCESSIBILITY.md) template,
use the
[downstream divergence record](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/ACCESSIBILITY-template.md#temporary-downstream-divergence-record).
Otherwise use the
[`upstream-debt` record shape](https://github.com/mgifford/upstream-first/blob/main/examples/upstream-debt.example.json)
directly.

**A merged or closed upstream tracker item is not resolution.** Closure
requires the supported release to be adopted downstream and the original
user-facing behavior to be retested — see
[Accessibility Finding Tracking, "Local and upstream trackers"](https://mgifford.github.io/ACCESSIBILITY.md/examples/ACCESSIBILITY_FINDING_TRACKING.html#local-and-upstream-trackers)
if this project tracks findings with that schema.

## Relationship to Other Skills

- [`ACCESSIBILITY-general`](../ACCESSIBILITY-general/SKILL.md) governs when
  and how all skills in this repository are loaded; this skill is one of
  the things it points to when a fix's ownership is unclear.
- [`bug-reporting`](../bug-reporting/SKILL.md) records scope, likely
  source, and (when applicable) local and upstream tracker relationships
  for a filed finding — this skill decides what to do about that source
  before a fix is written, not after.
- Per-topic skills (`forms`, `keyboard`, `color-contrast`, and so on) define
  *how* to fix a barrier once ownership is decided. This skill decides
  *where* the fix belongs.

## References

- [Upstream First](https://github.com/mgifford/upstream-first)
- [Why Upstream-First Matters in the Age of AI](https://github.com/mgifford/upstream-first/blob/main/WHY_UPSTREAM_FIRST.md)
- [`upstream-first` skill](https://github.com/mgifford/upstream-first/blob/main/skills/upstream-first/SKILL.md)
- [`maintainer-ready-contribution` skill](https://github.com/mgifford/upstream-first/blob/main/skills/maintainer-ready-contribution/SKILL.md)
- [`ai-contribution-review` skill](https://github.com/mgifford/upstream-first/blob/main/skills/ai-contribution-review/SKILL.md)
- [`responsible-security-disclosure` skill](https://github.com/mgifford/upstream-first/blob/main/skills/responsible-security-disclosure/SKILL.md)
- [ACCESSIBILITY.md: downstream divergence record](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/ACCESSIBILITY-template.md#temporary-downstream-divergence-record)
