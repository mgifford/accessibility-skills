# Sync Metadata

```yaml
canonical_source: examples/MERMAID_ACCESSIBILITY_BEST_PRACTICES.md
last_synced_commit: "bb235f3"
last_synced_date: "2026-07-22"
skill_maintainer: ""
notes: >
  Canonical example file exists in mgifford/ACCESSIBILITY.md.
  CRITICAL CORRECTION: the prior skill version used `%%accTitle` and
  `%%accDescr` syntax throughout (with the %% comment prefix). `%%` is the
  Mermaid comment marker, so those lines were silently ignored as comments --
  they produced NO accessibility metadata despite looking correct. Correct
  syntax is `accTitle:` and `accDescr:` (or `accDescr { ... }` for multi-line)
  with no %% prefix. This was the single most important fix in this sync
  pass; any diagrams authored using the old skill guidance should be
  re-checked and fixed. Also corrected: Mermaid's generated SVG uses
  aria-labelledby (title) and aria-describedby (description) as SEPARATE
  relationships, not combined into one aria-labelledby referencing both IDs
  as the prior skill's "Pattern 11" guidance assumed. Removed unverifiable
  100-char/500-char limits (canonical says Mermaid defines no such limits).
  Added platform-managed-renderer guidance (GitHub.com vs Pages vs Enterprise
  Server are separate rendering surfaces) and a security section.

  DIVERGENCE: This skill's format (YAML frontmatter, severity-tagged
  sections, condensed Definition of Done checklist) intentionally differs
  from the canonical file's prose structure. Content substance is synced;
  presentation format is not expected to match verbatim.
```

## How to Update This Skill

When the canonical source changes and CI flags drift:

1. Open both files side-by-side
2. Review the diff linked in the GitHub issue/PR comment
3. Update `SKILL.md` to reflect new requirements, changed patterns, or removed guidance
4. Set `last_synced_commit` to the current commit SHA of `mgifford/ACCESSIBILITY.md`
5. Rebuild: `cd skills && zip -r mermaid.skill mermaid/`
