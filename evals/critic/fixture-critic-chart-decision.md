# Critic Workflow Fixture #4: Cross-Role Chart Decision

## Input Scenario

A Planner agent recommends a fix for a color-only chart without consulting the Visual Design role. The chart uses color alone to convey data (violating WCAG 1.4.1), but the proposed fix only involves Front-End Development without design review.

## Planner Output Under Review

```yaml
finding:
  title: "Chart relies on color alone"
  description: "The status dashboard chart uses only color to distinguish categories"
  arrm:
    task_id: IMG-018
    wcag_sc: "1.4.1"
    level: A
    primary: ["Visual Design"]
    secondary: ["User Experience (UX) Design"]
    contributors: []
  proposed_fix:
    type: "judgement-call"
    change: "Add pattern fills to chart segments"
    confidence: "medium"
```

## Expected Critic Verdict

### Decision
```yaml
verdict: "weak_accept"
confidence: "medium"
```

### Rationale
- The fix addresses the WCAG violation (color-only information)
- However, ARRM task IMG-018 lists Visual Design as primary ownership
- The Planner did not include Visual Design in the consultation
- Pattern fills may conflict with brand guidelines or visual design system
- The fix is directionally correct but incomplete without design review

### Required Next Action
Route to Visual Design for review before implementation. The Planner must consult:
- Visual Design — primary owner of IMG-018
- User Experience (UX) Design — secondary owner

### Missing Questions
- Do the proposed patterns align with the design system?
- Are there existing pattern libraries or accessible chart components?
- Should this be a design system update rather than a one-off fix?

## Verification Steps

1. Confirm the ARRM task IMG-018 lists Visual Design as primary ownership
2. Confirm the Critic identifies the missing cross-role consultation
3. Confirm the Critic does not fully accept the fix without design review
4. Confirm the Critic routes the finding to the correct roles

## Fixture Purpose

This fixture validates that the Critic can:

1. Identify when cross-role consultation is required
2. Respect ARRM role ownership assignments
3. Prevent fixes that bypass primary stakeholders
4. Balance technical correctness with organizational process

ModelCheck | model=unknown | tier=B | fit=tests critic cross-role consultation detection | escalate_if=critic ignores role ownership or accepts fixes without required consultations
