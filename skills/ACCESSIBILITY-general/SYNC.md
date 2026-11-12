# Sync Metadata

```yaml
canonical_source: AGENTS.md
last_synced_commit: "45d6b464fadc4986a74d78244df9526a1a27ad9d"
last_synced_date: "2026-11-11"
last_reviewed_commit: "45d6b464fadc4986a74d78244df9526a1a27ad9d"
review_decision: no-update-needed
skill_maintainer: ""
notes: >
  This is a general entry-point skill for projects that contain an
  ACCESSIBILITY.md file. It intentionally does not mirror the full root
  AGENTS.md or ACCESSIBILITY.md documents. Reviewed 2026-11-11: the skill
  still routes agents to the project commitment, topic skills, and trusted
  sources; no content change was needed for the current canonical revision.

  DIVERGENCE: The skill is a routing and priority layer, not a copy of
  AGENTS.md. Presentation and length are expected to differ.
```

## Review history

- 2026-11-11 review (5d85cc1 -> 45d6b46): `AGENTS.md` added the canonical-registry ownership note and resource-discovery links. The skill already routes agents to the registry and now links the canonical copy directly; no routing change was needed. Metadata advanced after review.

## How to Update This Skill

When `AGENTS.md` changes and this check flags it:

1. Review the canonical diff and decide whether the routing or priority guidance changed.
2. Update `SKILL.md` only where the agent-facing decision changes.
3. Record `last_reviewed_commit`, `review_decision`, and `last_synced_commit` here.
4. Do not copy the full `AGENTS.md` into the skill.
