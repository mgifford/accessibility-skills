# Shared Cross-Repo Policy Fixtures

`color-contrast-unreviewed.json` is a local copy of the canonical fixture maintained in [`mgifford/ACCESSIBILITY.md`](https://github.com/mgifford/ACCESSIBILITY.md), `examples/shared-fixtures/`. See that directory's `README.md` for the full rationale: this exact finding must classify identically wherever `obligation`/`handling`/`evidence_status` are computed or documented, across `ACCESSIBILITY.md`, `accessibility-skills`, and [`vital-core`](https://github.com/mgifford/vital-core).

This repository has no policy-classification engine of its own — it documents agent-facing guidance. `tests/validate-shared-fixture.js` checks that `skills/axe-rules/SKILL.md` and `skills/bug-reporting/SKILL.md` both document the same classification this fixture declares (`required` + `review`, `evidence_status: automated-indicator`) for an unreviewed automated WCAG AA result, rather than checking a computed value.

**This file must stay byte-identical to its canonical source.** If it changes in `ACCESSIBILITY.md`, copy it here again in the same change that updates the affected `SKILL.md` guidance.
