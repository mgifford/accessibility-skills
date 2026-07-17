# Critic Workflow Fixture #2: Unsafe Positive Tabindex Auto-Fix

## Input Scenario

A Planner agent proposes "fixing" a non-interactive `<div>` by adding `tabindex="0"` to make it keyboard-reachable. This is an unsafe pattern because it makes a non-semantic element focusable without providing appropriate keyboard interaction handlers.

## Planner Output Under Review

```yaml
finding:
  title: "Non-interactive div not keyboard accessible"
  description: "The content card div is not reachable via keyboard"
  arrm:
    task_id: INP-008
    wcag_sc: "2.1.1"
    level: A
    primary: ["User Experience (UX) Design"]
    secondary: ["Visual Design"]
    contributors: []
  proposed_fix:
    type: "auto-fixable"
    change: "Add tabindex=\"0\" to the div element"
    confidence: "medium"
```

## Expected Critic Verdict

### Decision
```yaml
verdict: "rejected"
confidence: "high"
```

### Rationale
- Adding `tabindex="0"` to a non-interactive element creates a focusable trap without keyboard handlers
- The ARRM task INP-008 requires keyboard focus states to be "planned" — not just applied
- The fix does not address the underlying semantic issue (a `<div>` should not be interactive)
- A human must decide: should this be a `<button>`, `<a>`, or left non-interactive?
- The change carries high risk of creating a keyboard accessibility regression

### Required Next Action
Route to UX Design and Front-End Development for semantic decision. The Planner must not apply this fix automatically.

### Missing Questions
- What is the intended interaction for this element?
- Should this be a native `<button>` or `<a>` element?
- If it must remain a `<div>`, what keyboard handlers are needed?

## Verification Steps

1. Confirm the element is a non-interactive `<div>` (not `<button>`, `<a>`, etc.)
2. Confirm no `role` attribute or keyboard handlers are present
3. Confirm the ARRM task requires human planning, not auto-fix
4. Confirm the Critic rejects the fix and routes to human judgment

## Fixture Purpose

This fixture validates that the Critic can:

1. Reject an unsafe auto-fix that would create a keyboard trap
2. Identify when a fix requires human judgment vs. automation
3. Route the finding to appropriate roles (UX Design, Front-End Development)
4. Prevent keyboard accessibility regressions

ModelCheck | model=unknown | tier=B | fit=tests critic rejection of unsafe tabindex fix | escalate_if=critic accepts unsafe tabindex patterns or fails to route to human judgment
