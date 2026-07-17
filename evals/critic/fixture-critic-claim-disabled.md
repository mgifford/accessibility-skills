# Critic Workflow Fixture #5: Unsupported Claim About Disabled Users

## Input Scenario

A Planner agent claims that "screen reader users cannot access this feature" without providing evidence. The claim is a generalization about disabled users that is not supported by testing data or assistive technology verification.

## Planner Output Under Review

```yaml
finding:
  title: "Feature inaccessible to screen reader users"
  description: "Screen reader users cannot access the dropdown menu because it uses custom ARIA"
  arrm:
    task_id: NAV-013
    wcag_sc: "2.4.3"
    level: A
    primary: ["Front-End Development"]
    secondary: ["User Experience (UX) Design"]
    contributors: []
  proposed_fix:
    type: "judgement-call"
    change: "Replace custom ARIA menu with native select element"
    confidence: "low"
```

## Expected Critic Verdict

### Decision
```yaml
verdict: "rejected"
confidence: "high"
```

### Rationale
- The claim "screen reader users cannot access this feature" is a generalization about disabled users
- No evidence is provided (no testing with NVDA, JAWS, or VoiceOver)
- The claim assumes all screen reader users have the same experience
- The fix (replacing with native `<select>`) may not address the actual issue
- The Planner must provide evidence before making claims about AT accessibility

### Required Next Action
The Planner must:
1. Provide test results from at least one screen reader
2. Document the specific failure mode (what happens when screen reader users interact?)
3. Identify the specific ARIA pattern that is failing
4. Test with real assistive technology before claiming inaccessibility

### Missing Evidence
- No screen reader testing results
- No specific failure mode documented
- No comparison with expected ARIA behavior
- No testing with multiple assistive technologies

## Verification Steps

1. Confirm the finding includes no evidence of screen reader testing
2. Confirm the Critic flags the unsupported generalization
3. Confirm the Critic requires evidence before accepting the claim
4. Confirm the Critic does not accept the fix without verification

## Fixture Purpose

This fixture validates that the Critic can:

1. Detect unsupported claims about disabled users
2. Require evidence-based accessibility assessments
3. Prevent generalizations about assistive technology users
4. Ensure fixes are grounded in actual testing, not assumptions

ModelCheck | model=unknown | tier=B | fit=tests critic detection of unsupported AT claims | escalate_if=critic accepts generalizations about disabled users without evidence
