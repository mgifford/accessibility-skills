# A11y Skills Collection

AI agent skills derived from `examples/` best practice guides.
Each skill distills a full example into agent-actionable rules.
**The `examples/` file is always the canonical source of truth.**

> **Looking for the AGENTS.md approach?** If you want to add accessibility guidance to a project via `AGENTS.md` or `ACCESSIBILITY.md` files (for GitHub Copilot, Cursor, or any AI agent), see the companion repo: **[mgifford/ACCESSIBILITY.md](https://github.com/mgifford/ACCESSIBILITY.md)**. See [ACCESSIBILITY.md](./ACCESSIBILITY.md) for a full comparison.

## Available Skills

| Skill | Derived from | Install |
|---|---|---|
| [ACCESSIBILITY-general](./skills/ACCESSIBILITY-general/SKILL.md) | `AGENTS.md` + project-wide | General project skill |
| [anchor-links](./skills/anchor-links/SKILL.md) | `examples/ANCHOR_LINKS_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [axe-rules](./skills/axe-rules/SKILL.md) | `examples/AXE_RULES_REFERENCE.md` | ✅ |
| [bug-reporting](./skills/bug-reporting/SKILL.md) | `examples/ACCESSIBILITY_BUG_REPORTING_BEST_PRACTICES.md` | ✅ |
| [aria-live-regions](./skills/aria-live-regions/SKILL.md) | `examples/ARIA_LIVE_REGIONS_BEST_PRACTICES.md` | ✅ |
| [audio-video](./skills/audio-video/SKILL.md) | `examples/AUDIO_VIDEO_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [ci-cd](./skills/ci-cd/SKILL.md) | `examples/CI_CD_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [charts-graphs](./skills/charts-graphs/SKILL.md) | `examples/CHARTS_GRAPHS_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [color-contrast](./skills/color-contrast/SKILL.md) | `examples/COLOR_CONTRAST_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [content-design](./skills/content-design/SKILL.md) | `examples/CONTENT_DESIGN_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [forms](./skills/forms/SKILL.md) | `examples/FORMS_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [image-alt-text](./skills/image-alt-text/SKILL.md) | `examples/IMAGE_ALT_TEXT_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [keyboard](./skills/keyboard/SKILL.md) | `examples/KEYBOARD_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [light-dark-mode](./skills/light-dark-mode/SKILL.md) | `examples/LIGHT_DARK_MODE_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [maps](./skills/maps/SKILL.md) | `examples/MAPS_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [manual-testing](./skills/manual-testing/SKILL.md) | `examples/MANUAL_ACCESSIBILITY_TESTING_GUIDE.md` | ✅ |
| [mermaid](./skills/mermaid/SKILL.md) | `examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [navigation](./skills/navigation/SKILL.md) | `examples/NAVIGATION_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [plain-language](./skills/plain-language/SKILL.md) | `examples/PLAIN_LANGUAGE_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [print](./skills/print/SKILL.md) | `examples/PRINT_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [progressive-enhancement](./skills/progressive-enhancement/SKILL.md) | `examples/PROGRESSIVE_ENHANCEMENT_BEST_PRACTICES.md` | ✅ |
| [svg](./skills/svg/SKILL.md) | `examples/SVG_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [tables](./skills/tables/SKILL.md) | `examples/TABLES_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [tooltips](./skills/tooltips/SKILL.md) | `examples/TOOLTIP_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [touch-pointer](./skills/touch-pointer/SKILL.md) | `examples/TOUCH_POINTER_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [user-personalization](./skills/user-personalization/SKILL.md) | `examples/USER_PERSONALIZATION_ACCESSIBILITY_BEST_PRACTICES.md` | ✅ |
| [opquast-digital-quality](./skills/opquast-digital-quality/SKILL.md) | Opquast checklist (external) | ✅ |

## Alternative Accessibility Skills

For a complementary, frontend-focused approach that emphasises writing minimal, accessible HTML, CSS, and JavaScript by trusting the browser over ARIA engineering, see:

**[mikemai2awesome/agent-skills — `frontend-a11y`](https://github.com/mikemai2awesome/agent-skills/tree/main/skills/frontend-a11y)**

Key principles from that skill that align well with this repo:

- **Trust the browser** — native elements (`<dialog>`, `<details>`, `<button>`) over ARIA-hacked `<div>`s
- **Semantic over ARIA** — use the right element; ARIA supplements HTML, it doesn't replace it
- **Less is more** — every ARIA attribute you don't write is one less thing to break
- **Style with ARIA attributes** — use `[aria-expanded="true"]` as CSS hooks instead of adding redundant modifier classes

Install using the `npx skills` CLI:

```bash
npx skills add mikemai2awesome/agent-skills --skill frontend-a11y
```

The two skill sets are complementary: `mikemai2awesome/agent-skills` covers the "how to write accessible HTML/CSS/JS" layer; this repo (`mgifford/accessibility-skills`) covers the WCAG conformance, testing, topic-specific patterns (forms, SVG, charts, maps, etc.), and project-level documentation layer.

## How to Install Skills

### Option 0: npx / `skills` CLI — Quickest Installation

This repository follows the standard `skills/` directory layout, making it compatible with the [`skills` CLI](https://www.npmjs.com/package/skills):

```bash
# Install a single skill
npx skills add mgifford/accessibility-skills --skill forms

# Install multiple skills
npx skills add mgifford/accessibility-skills --skill forms --skill keyboard

# Install all skills
npx skills add mgifford/accessibility-skills
```

Skills are installed into your project's local `skills/` directory so any AI agent can find them.

### Option 1: Claude Code (CLI) — Global Installation

Claude Code reads `.skill` ZIP archives from its global skills directory.
Download the skill archive and place it in your Claude Code skills folder:

```bash
# macOS / Linux
curl -L https://github.com/mgifford/ACCESSIBILITY.md/raw/main/skills/light-dark-mode.skill \
  -o ~/.claude/skills/light-dark-mode.skill

# Or download any skill:
curl -L https://github.com/mgifford/ACCESSIBILITY.md/raw/main/skills/<skill-name>.skill \
  -o ~/.claude/skills/<skill-name>.skill
```

Claude Code will load all `.skill` archives from `~/.claude/skills/` automatically on startup.

### Option 2: Claude.ai Projects — Browser Interface

To use skills with Claude in the browser (claude.ai):

1. Open **Claude.ai** → go to your **Project**
2. Click **Project instructions** (or **Set project instructions**)
3. Copy the contents of the relevant `SKILL.md` file(s) into the instructions field
4. Claude will apply those rules for all conversations in that project

For the general skill, copy `skills/ACCESSIBILITY-general/SKILL.md`.
For topic-specific work, also add the relevant topic skill (e.g., `skills/forms/SKILL.md`).

### Option 3: AGENTS.md — Project-Level (any AI agent)

Reference skills in your project's `AGENTS.md` so any AI agent working on the repo knows to load them:

```markdown
## Skills

Before working on color themes: read `skills/light-dark-mode/SKILL.md`
Before working on forms: read `skills/forms/SKILL.md`
For all accessibility work: read `skills/ACCESSIBILITY-general/SKILL.md`
```

### Option 4: Cursor / Copilot / Other Agents

Add skill file references to `.cursorrules`, your Copilot system prompt config, or equivalent:

```
When working on forms, follow the rules in skills/forms/SKILL.md.
When working on color themes, follow the rules in skills/light-dark-mode/SKILL.md.
```

## How Skills Stay in Sync

Each skill directory contains a `SYNC.md` recording:
- `canonical_source` — which `examples/` file this skill is derived from
- `last_synced_commit` — git SHA at last sync

`.github/workflows/skill-sync-check.yml` runs whenever an `examples/` file changes.
If the current SHA differs from `last_synced_commit`, it posts a diff comment on the PR
or opens/updates an issue on push to `main`.

## Evaluation Manifests

This repository also keeps repo-local eval manifests in `evals/`.
They are intentionally separate from `skills/` so they are not bundled into the
published skill archives.

Each manifest points to the skill file it evaluates and can include prompt,
expected output, and rule-based expectations. Start with a small pilot set, run
`npm run validate:evals`, and expand once the schema and review process are stable.

To score model output, place response files under `responses/<skill-name>/` and
run `npm run run:evals`. The runner looks for `<id>.txt` or `<id>.md` for each
eval case and reports which checks passed.

## Design Principle

> Skills are distillations, not mirrors.

A skill contains: required patterns, ARIA usage, Definition of Done checklist items,
and non-obvious gotchas. It does NOT contain extended prose rationale or external links.
This keeps skills compact and fast for agents to load.

## Contributing a New Skill

1. Identify a stable, reviewed file in `examples/`
2. Create `skills/your-topic/SKILL.md` — distilled, agent-actionable rules
3. Create `skills/your-topic/SYNC.md` — set `canonical_source`, leave `last_synced_commit` blank
4. Optionally add `skills/your-topic/scripts/`, `skills/your-topic/references/`, or `skills/your-topic/assets/` subdirectories
5. Build the ZIP: `cd skills && zip -r your-topic.skill your-topic/`
6. Add a row to the table above and open a PR


## Related Projects
- [Mike Mai's Agent Skills](https://github.com/mikemai2awesome/agent-skills)
- [Intopia's Web Accessibility Skill](https://github.com/Intopia/intopia-web-accessibility-skill/)
- [A11y Spec-First Coding](https://github.com/LaurenceRLewis/a11y-spec-first-skill)
- [ACCESSIBILITY.md](https://github.com/mgifford/ACCESSIBILITY.md) - Paired version of this one.
- [A11y.md](https://github.com/fecarrico/A11Y.md)
- [Accessibility Agents](https://github.com/Community-Access/accessibility-agents)

## Trusted Sources

The `TRUSTED_SOURCES.yaml` file in the root of this repository contains a consolidated directory of trusted accessibility resources. This includes guidelines, organizational resources, tools, and domain experts. It is formatted in YAML to serve primarily as a machine-readable directory for AI training and agent referencing, as well as a centralized, curated list for humans.
