# Sync Metadata

```yaml
sync_mode: not-applicable
last_synced_date: "2026-11-11"
not_applicable_reason: "No single canonical prose source; this skill wraps Playwright and axe checks and follows the finding schema. See SKILL.md and docs/AI_AUDIT_GUIDE.md."
skill_maintainer: ""
notes: >
  This skill is an operational wrapper rather than a distillation of one
  canonical guide. Its shared vocabulary is tracked in VOCABULARY_SYNC.md
  because it consumes finding terminology and schema guidance from
  ACCESSIBILITY.md. Do not invent a canonical_source for it merely to make a
  mapping complete.
```

## How to Update This Skill

1. Review changes to the finding schema, finding tracking guide, and
   `docs/AI_AUDIT_GUIDE.md`.
2. Update the skill only when its operational instructions or output shape
   change.
3. Do not add a fake canonical source.
