# Planner Workflow

The Planner identifies and categorizes accessibility findings, making them actionable for human professionals while maximizing automation where possible.

## Purpose

The Planner's role is to:

1. **Map findings to ARRM tasks**: Identify which ARRM professional roles own responsibility for the finding
2. **Distinguish automation**: Separate clear-rule issues from judgement calls
3. **Identify perspectives**: Consider impacts on different user groups
4. **Generate questions**: Ask role-specific questions when human judgement is needed
5. **Recommend engagement**: Suggest which humans should be involved
6. **Document uncertainty**: Make missing evidence and conflicts explicit

## When to Use

Use the Planner for any accessibility finding, including:

* Automated scan results
* Manual testing observations
* Code reviews for accessibility
* Feature design reviews

The Planner works best early in the accessibility workflow, before implementation or testing occurs.

## When Not to Use

Do not use the Planner for:

* Direct technical fixes that are clearly required and have no ambiguity
* External accessibility audits that follow different processes
* Quick accessibility compliance checks where no role ownership analysis is needed

## Integration with Topic Skills

The Planner knows which topic skills may be relevant:

* forms → forms, content-design, keyboard
* keyboard → keyboard, touch-pointer, manual-testing
* color-contrast → color-contrast, light-dark-mode, visual-design
* etc.

## ARRM Task Identification

For a finding, the Planner:

1. Maps to relevant WCAG criteria (or ARRM task ID if available)
2. Identifies Primary, Secondary, and Contributor professional roles
3. Preserves role ownership assignments from the ARRM data source
4. Documents any missing or inconsistent role assignments

## Decision State Classification

The Planner uses a criteria-based approach to classify decision states:

**Deterministic** (auto-fixable):
- Clear normative requirement
- High rule certainty
- Low intent ambiguity
- Low change risk
- High testability
- Meets automation eligibility threshold

** Judgement Required**:
- Multiple valid approaches exist
- Trade-offs between accessibility and other requirements
- Need human expertise or user research
- High risk of unintended consequences

## Sample Output Structure

```json
{
  "id": "PLANNER-001",
  "title": "Missing alt text on meaningful image",
  
  "arrm": {
    "task_id": "IMG-001",
    "wcag_sc": "1.1.1",
    "level": "A",
    "primary": ["Content Authoring"],
    "secondary": ["User Experience Design"],
    "contributors": []
  },
  
  "decision": {
    "state": "cross-role-decision-needed",
    "rule_certainty": "high",
    "intent_certainty": "medium",
    "change_risk": "low",
    "testability": "high",
    "confidence": "high"
  },
  
  "ai_assistance": {
    "workflows": ["planner", "perspective-auditor"],
    "topic_skills": ["image-alt-text"],
    "perspectives": ["screen-reader and semantic access"]
  },
  
  "questions": {
    "primary": ["What information does this image add that is not already present in nearby text?"],
    "secondary": ["What role does the image play in the user journey?"],
    "contributors": []
  },
  
  "recommended_engagement": {
    "participants": ["Content Authoring", "User Experience Design"],
    "reason": "Primary ownership and secondary impact",
    "evidence_needed": ["User research on image comprehension", "Business justification for image presence"]
  },
  
  "escalation": "user-research-needed"
}
```

## Role-Aware Questions

The Planner generates questions targeted to specific ARRM roles:

**Primary Role Questions:**
- Address the core responsibility ownership
- Focus on implementation choices within their domain
- Ask for justification of their preferred approach

**Secondary Role Questions:**
- Consider broader impact of Primary's decision
- Evaluate interaction with their area of expertise
- Identify potential conflicts with their responsibilities

**Contributor Role Questions:**
- Ensure the solution works across all relevant technical areas
- Validate implementation feasibility

## Conflict Documentation

When different roles suggest conflicting approaches, the Planner:

1. Records each role's concern and recommendation
2. Documents the evidence supporting each position
3. Identifies the trade-off being made
4. Clearly identifies who should make the final decision
5. Recommends who should be consulted
6. Notes what evidence would reduce uncertainty

## Example Conflict Documentation

```json
"role_perspectives": [
  {
    "role": "User Experience Design",
    "concern": "Increasing spacing may improve precision",
    "recommendation": "Add more hit area",
    "evidence": "Studies show larger targets reduce errors",
    "uncertainty": "Impact on visual grouping not assessed"
  },
  {
    "role": "Visual Design", 
    "concern": "Additional spacing may weaken visual grouping",
    "recommendation": "Maintain current spacing",
    "evidence": "Visual hierarchy depends on proximity",
    "uncertainty": "Trade-off between accessibility and aesthetics"
  }
],

"next_step": "Front-End Development should prototype the implementation",
"consultation": ["Visual Design should review affordance", "UX should validate task clarity"]
```

## Integration with Other Workflows

The Planner works with:

* **Critic**: The Planner can inform the Critic's review of decisions
* **Tester**: The Planner identifies which tests should be run for each finding
* **Perspective Auditor**: The Planner identifies which user perspectives to examine
* **Bug Reporter**: The Planner ensures Bug Reports preserve ARRM ownership

## Decision State Escalation Paths

| State | Recommended Action |
|-------|-------------------|
| auto-fixable | Apply fix, run tests, document |
| human-confirmation-needed | Human validation, record response |
| cross-role-decision-needed | Facilitate cross-role discussion |
| user-research-needed | Arrange disabled-user testing |
| specialist-review-needed | Consult relevant external expert |
| governance-decision-needed | Escalate to policy/legal review |
| insufficient-evidence | Document missing evidence, ask targeted questions |

The Planner ensures that ambiguous or complex accessibility work is routed appropriately, with clear visibility into who owns what decisions and why.