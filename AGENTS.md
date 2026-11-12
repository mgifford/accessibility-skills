# AGENTS.md — AI Agent Instructions

This file provides guidance for AI coding assistants (GitHub Copilot, Claude, Cursor, and others) working on this repository.

## About This Repository

This repository contains **AI agent skills** for web accessibility work — distilled, agent-actionable rules derived from accessibility best-practice guides. Each skill in `skills/` covers a specific topic (forms, keyboard navigation, color contrast, etc.).

## General Accessibility Principles

When contributing to or using this repository, always follow these principles:

- **Follow WCAG 2.2 AA** as the baseline standard for all accessibility guidance.
- **Prefer semantic HTML** over ARIA engineering. Native elements (`<button>`, `<dialog>`, `<details>`) carry built-in accessibility semantics.
- **ARIA supplements HTML** — it does not replace it. Only use ARIA when a native element cannot meet the need.
- **Test with real assistive technologies** — screen readers, keyboard-only navigation, and zoom at 200 %.
- **Plain language** — write content at the lowest reading level appropriate for the audience.

## Skills in This Repository

Before working on a topic area, read the relevant skill file:

- General accessibility work: read `skills/ACCESSIBILITY-general/SKILL.md`
- Anchor links: read `skills/anchor-links/SKILL.md`
- ARIA live regions: read `skills/aria-live-regions/SKILL.md`
- Audio / video: read `skills/audio-video/SKILL.md`
- Axe-core rules: read `skills/axe-rules/SKILL.md`
- Accessibility bug reporting: read `skills/bug-reporting/SKILL.md`
- CI/CD pipelines: read `skills/ci-cd/SKILL.md`
- Charts and graphs: read `skills/charts-graphs/SKILL.md`
- Color contrast: read `skills/color-contrast/SKILL.md`
- Content design: read `skills/content-design/SKILL.md`
- Forms: read `skills/forms/SKILL.md`
- Image alt text: read `skills/image-alt-text/SKILL.md`
- Keyboard navigation: read `skills/keyboard/SKILL.md`
- Light / dark mode: read `skills/light-dark-mode/SKILL.md`
- Manual accessibility testing: read `skills/manual-testing/SKILL.md`
- Maps: read `skills/maps/SKILL.md`
- Mermaid diagrams: read `skills/mermaid/SKILL.md`
- Navigation: read `skills/navigation/SKILL.md`
- Digital quality (Opquast): read `skills/opquast-digital-quality/SKILL.md`
- Plain language: read `skills/plain-language/SKILL.md`
- Print styles: read `skills/print/SKILL.md`
- Progressive enhancement: read `skills/progressive-enhancement/SKILL.md`
- SVG: read `skills/svg/SKILL.md`
- Tables: read `skills/tables/SKILL.md`
- Tooltips: read `skills/tooltips/SKILL.md`
- Touch and pointer: read `skills/touch-pointer/SKILL.md`
- User personalization: read `skills/user-personalization/SKILL.md`

## Local Synchronization

Before changing a skill that mirrors `ACCESSIBILITY.md`:

1. Run `npm run sync:status`.
2. Inspect the upstream change with `npm run sync:diff -- --skill <name>`.
3. Update only the necessary `SKILL.md` content; keep it a distillation.
4. Record the decision with `npm run sync:review -- --skill <name> --decision <update|no-update|divergence|defer> --note "..."`.
5. Run `npm run sync:validate`.

Do not edit `SYNC.md` metadata by hand to make a check pass. Do not edit the
canonical guide merely to match the skill. Do not commit, push, or merge
without authorization. See [SYNC_WORKFLOW.md](./SYNC_WORKFLOW.md).

Optional AI assistance is bounded by
[prompts/UPDATE_SKILL_FROM_CANONICAL.md](./prompts/UPDATE_SKILL_FROM_CANONICAL.md);
the maintainer records the review decision.

## Contributing

When adding or updating a skill:

1. Create `skills/<topic>/SKILL.md` with distilled, agent-actionable rules (no extended prose).
2. Create `skills/<topic>/SYNC.md` recording the `canonical_source` and `last_synced_commit`.
3. Run `npm run sync:validate`.
4. Update the skills table in `README.md`.

## Trusted Sources

The canonical registry is
[`examples/TRUSTED_SOURCES.yaml`](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/TRUSTED_SOURCES.yaml)
in the ACCESSIBILITY.md repository. Use the
[human-readable guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/TRUSTED_SOURCES.md)
for authority, licensing, AI-use, and task-based discovery. This repository
does not maintain a second copy. Inclusion is not an endorsement, and registry
metadata does not grant reuse or training rights.
