# Critic Workflow Fixture #1: Safe Deterministic Fix

## Input Scenario

A Planner agent proposes adding `aria-describedby` to reference a description element for a complex image. The description element exists in the DOM with the correct ID. This is a safe, deterministic fix that improves accessibility without requiring human judgment.

## Planner Output Under Review

```yaml
finding:
  title: "Complex image lacks description reference"
  description: "The chart image does not reference its long description via aria-describedby"
  arrm:
    task_id: IMG-009
    wcag_sc: "1.1.1"
    level: A
    primary: ["Front-End Development"]
    secondary: ["Content Authoring"]
    contributors: ["User Experience (UX) Design"]
  proposed_fix:
    type: "auto-fixable"
    change: "Add aria-describedby=\"chart-desc-1\" to the img element"
    confidence: "high"
```

## Expected Critic Verdict

### Decision
```yaml
verdict: "accepted"
confidence: "high"
```

### Rationale
- The fix references a real DOM element (`chart-desc-1` exists)
- The ARRM task IMG-009 is correctly mapped (WCAG 1.1.1, Development role)
- Adding `aria-describedby` is a standard, safe pattern
- No role consultation is required for this type of change
- The change is reversible and carries low risk

### Required Next Action
None. The fix may proceed to implementation.

## Verification Steps

1. Confirm `aria-describedby` references an existing element ID
2. Confirm the referenced element contains meaningful description content
3. Confirm the ARRM task ID exists in `data/arrm/arrm-all-tasks.csv`
4. Confirm no other roles need consultation for this change

## Fixture Purpose

This fixture validates that the Critic can:

1. Accept a safe, deterministic fix without blocking it
2. Verify ARRM task mapping is correct
3. Confirm DOM references are valid
4. Avoid unnecessary escalation to human judgment

ModelCheck | model=unknown | tier=B | fit=tests critic acceptance of safe fix | escalate_if=critic rejects valid fixes or fails to verify DOM references
