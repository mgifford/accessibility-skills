# ARRM Task Fixture #1: Positive tabindex

## Input Scenario
An accessibility scan identifies a UI component with `positive tabindex` but no logical tab order position.

## Expected Findings

### ARRM Mapping
```yaml
id: POS-TAB-001
title: Positive tabindex without logical position
arrm:
  task_id: TBA-001  # TODO: Map to appropriate ARRM task
  wcag_sc: "2.4.3 Focus Order"
  level: AA
  primary: ["Front-End Development"]
  secondary: ["User Experience Design"]
  contributors: []
```

### Decision State Classification
```yaml
decision:
  state: "auto-fixable"
  rule_certainty: "high"
  intent_certainty: "medium"
  change_risk: "low"
  testability: "high"
  confidence: "high"
```

### Automation Eligibility
This finding is eligible for automation because:

1. **Rule certainty**: HTML5 specification (or ARIA rules) clearly defines how tabindex should be used
2. **Intent certainty**: The issue is that tabindex should either be negative, 0, or have a logical positive value for proper tab order
3. **Change risk**: Removing or correcting an arbitrary positive tabindex does not alter the intended user experience
4. **Testability**: Browser tools can easily detect and validate tabindex usage

### Proposed Fix (Auto-applicable)
```html
<!-- Before (auto-fixable) -->
<div tabindex="+5" class="custom-focus-target">Content</div>

<!-- After -->
<div class="custom-focus-target">Content</div>
```

### Required Questions
No role-specific questions needed. This is a straightforward technical fix.

### AI Assistance
```yaml
ai_assistance:
  workflows: ["planner", "tester"]
  topic_skills: ["keyboard"]
  perspectives: ["keyboard and motor access"]
```

### Evidence Requirements
1. Test tab order before and after fix
2. Verify component receives focus at expected position
3. Document fix in change log

### Unacceptable Behaviors
* Manual review without fix
* Component-dependent fix (fix should be consistent)
* Incomplete testing of tab order

## Verification Steps

1. Identify the element with positive tabindex
2. Check if it has a value that's not -1, 0, or positive consecutive integer after all focusable elements
3. Remove the tabindex (auto-fixable)
4. Verify the element is not focusable (as intended)
5. Verify logical tab order is preserved

## Fixture Purpose

This fixture validates that the system can:

1. Correctly identify a clear technical violation
2. Map it to the appropriate ARRM task
3. Classify it as auto-fixable
4. Apply the minimal safe fix
5. Verify the fix without requiring human judgement

ModelCheck | model=openopen/model-name | tier=B | fit=demonstrates deterministic fix capability | escalate_if=automation rules are misunderstood