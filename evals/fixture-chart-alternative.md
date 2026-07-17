# ARRM Task Fixture #2: Complex chart alternative

## Input Scenario
A data visualization component needs an accessible alternative for screen reader users. Multiple valid approaches exist:

- Text summary
- Data table
- Long description
- Interactive alternative with drill-down capabilities

Each option involves different trade-offs between:

1. Development effort and maintenance
2. User experience for different disability groups
3. Content breadth and accuracy
4. Technical complexity

## Expected Findings

### ARRM Mapping
```yaml
id: CHART-ALT-001
title: Determine appropriate alternative for complex chart
title: chart-a11y-challenge
arrm:
  task_id: TXT-008  # TODO: Map to appropriate ARRM task
  wcag_sc: "1.1.1 Non-text Content"
  level: A
  primary: ["Content Authoring"]
  secondary: ["User Experience Design", "Visual Design"]
  contributors: ["Front-End Development", "Testing"]
```

### Decision State Classification
```yaml
decision:
  state: "cross-role-decision-needed"
  rule_certainty: "low"
  intent_certainty: "low"
  change_risk: "medium"
  testability: "low"
  confidence: "low"
```

### Rationale for Judgement Call

This finding requires human judgement because:

1. **Rule uncertainty**: No single "correct" alternative exists; all options meet WCAG 1.1.1
2. **Intent ambiguity**: The chart's purpose (data reporting vs. exploration) is unclear
3. **Change risk**: Different alternatives affect development timeline and user experience significantly
4. **Testability**: Each option requires user research to validate

### Conflict Documentation
```yaml
role_perspectives:
  - role: "Content Authoring"
    concern: "Content accuracy and completeness"
    recommendation: "Provide long description with detailed analysis"
    evidence: "Ensures no information loss for screen readers"
    uncertainty: "Length may overwhelm users"
    
  - role: "User Experience Design"
    concern: "User cognitive load and navigation"
    recommendation: "Start with data table for scanning behavior"
    evidence: "Tables are familiar and scannable"
    uncertainty: "May not support complex relationships"
    
  - role: "Visual Design"
    concern: "Visual information preservation"
    recommendation: "Provide interactive alternative with focus management"
    evidence: "Allows deep interaction for power users"
    uncertainty: "Complex implementation may introduce bugs"
    
  - role: "Front-End Development"
    concern: "Implementation complexity and maintenance"
    recommendation: "Simple data table with sort capabilities"
    evidence: "Well-tested patterns with lower risk"
    uncertainty: "May not convey visual insights effectively"
    
  - role: "Testing"
    concern: "Verification and validation effort"
    recommendation: "Prototype with all options for user testing"
    evidence: "Requires empirical evidence for decision"
    uncertainty: "Resource constraints may limit testing"
```

### Role-Aware Questions
```yaml
questions:
  primary:
    - What information does the chart need to convey to users?
    - What are the primary use cases for this chart (monitoring, analysis, decision-making)?
    - How frequently will users need to interact with this data?
    
  secondary:
    - What is the expected audience expertise level?
    - How complex is the data relationship structure?
    - What are the accessibility priorities for this use case?
    
  contributors:
    - What technical constraints exist for implementation?
    - What testing resources are available?
    - What is the timeline for this component?
```

### Recommended Engagement
```yaml
recommended_engagement:
  participants:
    - Content Authoring (Lead)
    - User Experience Design (Reviewer)
    - Visual Design (Advisor)
    - Front-End Development (Implementer)
    - Testing (Validator)
  
  reason: "Multiple valid approaches require cross-disciplinary expertise"
  
  evidence_needed:
    - User research with screen reader users
    - At-proposal technical feasibility analysis
    - Documentation of actual data relationships
    - Resource assessment for prototyping and testing
```

### Escalation Path
Based on information gathered:

1. **If intent unclear**: Escalate to user research (disabled-user testing)
2. **If technical constraints unclear**: Escalate to specialist review (accessibility consultant)
3. **If resources insufficient**: Escalate to governance (project prioritization)
4. **If evidence complete**: Allow cross-role decision

### Template Output for Development
```json
{
  "id": "CHART-ALT-001",
  "title": "chart-alternative",
  "arrm": {
    "task_id": "TXT-008",
    "wcag_sc": "1.1.1",
    "level": "A",
    "primary": ["Content Authoring"],
    "secondary": ["User Experience Design", "Visual Design"],
    "contributors": ["Front-End Development", "Testing"]
  },
  
  "decision": {
    "state": "cross-role-decision-needed",
    "rule_certainty": "low",
    "intent_certainty": "low",
    "change_risk": "medium",
    "testability": "low",
    "confidence": "low"
  },
  
  "ai_assistance": {
    "workflows": ["planner", "perspective-auditor"],
    "topic_skills": ["charts-graphs"],
    "perspectives": ["screen-reader and semantic access", "cognitive and neurodivergent access"]
  },
  
  "role_perspectives": [
    /* as documented above */
  ],
  
  "questions": {
    "primary": [/* questions above */],
    "secondary": [/* questions above */],
    "contributors": [/* questions above */]
  },
  
  "recommended_engagement": {
    /* as documented above */
  },
  
  "escalation": "user-research-needed"
}
```

### Unacceptable Behaviors
* Proposing a single approach without consulting relevant roles
* Declining to document conflicting perspectives
* Making a recommendation without evidence gathering
* Skipping to implementation without role input

## Fixture Purpose

This fixture validates that the system can:

1. Identify and document conflicting expert opinions
2. Generate targeted questions for each role
3. Recommend appropriate human engagement
4. Record uncertainty and missing evidence
5. Support escalation paths for unresolved decisions

ModelCheck | model=openopen/model-name | tier=B | fit=demonstrates conflict documentation capability | escalate_if=role conflicts are oversimplified