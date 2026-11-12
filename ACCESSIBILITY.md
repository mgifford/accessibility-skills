# Accessibility Commitment

This repository contains **AI agent skills** for accessibility work — designed for use with Claude Code and the skills format.

## Related Repository

If you are using the **AGENTS.md** approach (GitHub Copilot, Cursor, or other AI agents that read project-level instruction files), see the companion repository:

**[mgifford/ACCESSIBILITY.md](https://github.com/mgifford/ACCESSIBILITY.md)**

That repo contains:
- `ACCESSIBILITY.md` — the open standard for project accessibility transparency
- `AGENTS.md` — AI agent instructions for any coding assistant
- `examples/` — component-specific best practice guides
- Templates and CI/CD workflows for accessibility enforcement

## Which repo is right for me?

| I want to… | Go to… |
|---|---|
| Install accessibility skills globally for Claude Code | **This repo** ([mgifford/accessibility-skills](https://github.com/mgifford/accessibility-skills)) |
| Add an `AGENTS.md` or `ACCESSIBILITY.md` to my project | [mgifford/ACCESSIBILITY.md](https://github.com/mgifford/ACCESSIBILITY.md) |
| Copy best-practice example files into my project | [mgifford/ACCESSIBILITY.md](https://github.com/mgifford/ACCESSIBILITY.md) |
| Use skills with Claude.ai Projects or Cursor | **This repo** ([mgifford/accessibility-skills](https://github.com/mgifford/accessibility-skills)) |
| Write minimal accessible HTML/CSS/JS using native browser elements (frontend-focused) | [mikemai2awesome/agent-skills — `frontend-a11y`](https://github.com/mikemai2awesome/agent-skills/tree/main/skills/frontend-a11y) |

## How the two repos stay in sync

`examples/` in `mgifford/ACCESSIBILITY.md` is the canonical source. Skills in
this repository are concise derivatives, not copies. Each skill records its
canonical source and review status in `SYNC.md`; shared finding terminology,
schemas, and fingerprints are tracked in `VOCABULARY_SYNC.md`.

The deterministic check is `scripts/sync-check.sh`. A canonical change requires
a documented review decision: update the skill, record that no update is
needed, or mark further review as required. CI reports drift; it does not
rewrite skill content. See the
[README sync section](README.md#how-skills-stay-in-sync) for the workflow and
issue ownership model.
