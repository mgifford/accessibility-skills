# Sync Metadata

```yaml
canonical_source: examples/TOUCH_POINTER_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: "bb235f3"
last_synced_date: "2026-07-22"
skill_maintainer: ""
notes: >
  Fixed filename mismatch: this file previously pointed to
  TOUCH_POINTER_BEST_PRACTICES.md, but the canonical repo file is
  TOUCH_POINTER_ACCESSIBILITY_BEST_PRACTICES.md (matches sync-check.sh's
  mapping, which was already correct). Full resync performed. CORRECTION: Notable
  correction: canonical explicitly states a keyboard-only alternative does
  NOT by itself satisfy WCAG 2.5.1 (Pointer Gestures) or 2.5.7 (Dragging
  Movements) -- the alternative must work with a single pointer, without a
  path-based gesture or drag. Prior skill version didn't make this distinction
  clearly.

  DIVERGENCE: This skill's format (YAML frontmatter, severity-tagged
  sections, condensed Definition of Done checklist) intentionally differs
  from the canonical file's prose structure. Content substance is synced;
  presentation format is not expected to match verbatim.
```

## How to Update

1. Review diff linked in CI issue
2. Update SKILL.md
3. Set last_synced_commit to current SHA of mgifford/ACCESSIBILITY.md
4. Rebuild: `cd skills && zip -r touch-pointer.skill touch-pointer/`
