# Critic Workflow Fixture #3: Invented ARRM Assignment

## Input Scenario

A Planner agent claims that ARRM task "NAV-099" supports heading hierarchy for screen readers. This task ID does not exist in the ARRM dataset. The Planner invented the assignment rather than using a real task.

## Planner Output Under Review

```yaml
finding:
  title: "Page headings do not follow hierarchy"
  description: "The page skips from h1 to h3, missing h2"
  arrm:
    task_id: NAV-099
    wcag_sc: "1.3.1"
    level: A
    primary: ["Content Authoring"]
    secondary: ["User Experience (UX) Design"]
    contributors: ["Front-End Development"]
  proposed_fix:
    type: "judgement-call"
    change: "Restructure headings to follow logical hierarchy"
    confidence: "medium"
```

## Expected Critic Verdict

### Decision
```yaml
verdict: "rejected"
confidence: "high"
```

### Rationale
- ARRM task ID "NAV-099" does not exist in `data/arrm/arrm-all-tasks.csv`
- The Planner fabricated an ARRM assignment instead of using verified data
- This undermines the integrity of the role-based workflow
- The finding may be valid, but the ARRM mapping is unsupported

### Required Next Action
The Planner must re-map the finding to a real ARRM task. Valid candidates include:
- `SEM-011` — Elements that act as headings are marked up as such
- `SEM-012` — Headings follow a hierarchical sequence without skipping levels
- `SCT-007` — The headings used in a page provide a logical outline

### Missing ARRM Tasks
None found — the issue is the invented ID, not missing tasks.

## Verification Steps

1. Confirm task ID "NAV-099" does not exist in `data/arrm/arrm-all-tasks.csv`
2. Confirm the Critic flags the invented ARRM assignment
3. Confirm the Critic does not accept the fix with an invalid task ID
4. Confirm the Critic suggests real ARRM tasks as alternatives

## Fixture Purpose

This fixture validates that the Critic can:

1. Detect invented or fabricated ARRM task IDs
2. Reject findings with unsupported ARRM mappings
3. Maintain data integrity of the role-based workflow
4. Suggest valid alternatives when the original mapping is wrong

ModelCheck | model=unknown | tier=B | fit=tests critic detection of invented ARRM IDs | escalate_if=critic accepts fabricated task IDs or fails to verify against CSV data
