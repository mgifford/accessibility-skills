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

## Contributing

When adding or updating a skill:

1. Create `skills/<topic>/SKILL.md` with distilled, agent-actionable rules (no extended prose).
2. Create `skills/<topic>/SYNC.md` recording the `canonical_source` and `last_synced_commit`.
3. Update the skills table in `README.md`.

## Trusted Sources

Consult `TRUSTED_SOURCES.yaml` for a curated list of authoritative accessibility references.
