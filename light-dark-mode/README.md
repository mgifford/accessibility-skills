# Light/Dark Mode Accessibility Skill

Portable AI agent skill for implementing accessible color theme switching.

Derived from: [`examples/LIGHT_DARK_MODE_ACCESSIBILITY_BEST_PRACTICES.md`](../../examples/LIGHT_DARK_MODE_ACCESSIBILITY_BEST_PRACTICES.md)

## What This Skill Covers

- CSS custom properties pattern for dual-mode theming
- WCAG 2.2 AA contrast requirements for both light and dark modes
- Accessible toggle button: HTML, CSS, JS
- Forced-colors / Windows High Contrast support
- Color independence (non-color cues)
- SVG `currentColor` usage
- Focus indicator requirements across modes
- `prefers-reduced-motion` for transitions
- Data table zebra stripe pattern (relative, not absolute colors)
- Definition of Done checklist

## Installation

### Claude Code (global)
```bash
# Download and install
curl -L https://github.com/mgifford/ACCESSIBILITY.md/raw/main/skills/light-dark-mode.skill -o light-dark-mode.skill
# Then add to your Claude Code global skills directory
```

### AGENTS.md / project-level
Add to your project's `AGENTS.md`:
```markdown
## Skills
- Read and apply: `skills/light-dark-mode/SKILL.md` for all color theme work
```

### Claude.ai Projects
Copy the contents of `SKILL.md` into your Claude Project Instructions.

## Keeping In Sync

See `SYNC.md` for how to update this skill when the canonical source changes.
The `skill-sync-check.yml` GitHub Action will open an issue automatically when drift is detected.
