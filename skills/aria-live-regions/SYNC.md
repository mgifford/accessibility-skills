# Sync Metadata

```yaml
canonical_source: examples/ARIA_LIVE_REGIONS_BEST_PRACTICES.md
last_synced_commit: "bb235f3"
last_synced_date: "2026-07-22"
skill_maintainer: ""
notes: >
  Canonical example file exists in mgifford/ACCESSIBILITY.md.
  CRITICAL CORRECTION: canonical explicitly states "No standard defines a
  reliable 50 millisecond, 100 millisecond, or other fixed delay for live
  regions" and lists the clear-and-reinsert-after-timeout pattern as a common
  failure. The prior skill version used exactly this 50ms clear-and-reinsert
  pattern as its core recommended technique throughout (the `announce()`
  helper function). Replaced with canonical's actual guidance: mount a stable
  announcer first, update it after the component has mounted, render from
  framework state, and cancel stale async responses instead. Also corrected
  aria-relevant's default (canonical: "additions text", not just "additions"
  as the prior skill stated), and added role="log", aria-busy, and alert
  dialog guidance that didn't exist before.

  DIVERGENCE: This skill's format (YAML frontmatter, severity-tagged
  sections, condensed Definition of Done checklist) intentionally differs
  from the canonical file's prose structure. Content substance is synced;
  presentation format is not expected to match verbatim.
```

## How to Update

1. Review diff linked in CI issue
2. Update SKILL.md
3. Set last_synced_commit to current SHA of mgifford/ACCESSIBILITY.md
4. Rebuild: `cd skills && zip -r aria-live-regions.skill aria-live-regions/`
