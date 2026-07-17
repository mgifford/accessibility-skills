# Critic Workflow

The Critic reviews accessibility decisions to ensure they meet professional standards and evidence requirements.

## Purpose

The Critic's role is to:

1. **Validate ARRM grounding** - Verify that findings use real ARRM tasks with correct role assignments
2. **Assess automation safety** - Determine if deterministic fixes are appropriate
3. **Check role engagement** - Ensure appropriate professional perspectives are consulted
4. **Evaluate evidence quality** - Verify claims are supported and evidence types are distinguished
5. **Handle perspectives responsibly** - Identify user impacts and avoid simulating lived experience
6. **Maintain decision quality** - Ensure disagreements and unresolved risks are visible

## When to Use

Use the Critic for any accessibility finding:

* After Planner assessment of a finding
* For manual review of implementation proposals
* When validating accessibility test results
* When cross-role decisions are being considered

The Critic works best after initial planning but before implementation begins.

## When Not to Use

The Critic is not appropriate for:

* Simple technical fixes with clear requirements
* Quick accessibility checks where expert review isn't needed
* Routine validation without professional judgment concerns

## Integration with Topic Skills

The Critic checks that AI workflow decisions respect relevant topic skills:

* forms → forms, content-design, keyboard
* keyboard → keyboard, touch-pointer, manual-testing
* color-contrast → color-contrast, light-dark-mode, visual-design
* charts-graphs → charts-graphs, image-alt-text, tables
* And other topic skills as appropriate

## ARRM Task Validation

### Grounding Requirements

For each accessibility finding, the Critic verifies:

1. **Real ARRM Task Usage**
   - Task IDs must exist in the ARRM CSV
   - Must use real ARRM task IDs, not placeholders like "IMG-001"
   - Must match actual W3C WAI ARRM dataset

2. **Role Assignment Accuracy**
   - Primary Ownership must match ARRM data
   - Secondary Ownership must match ARRM data
   - Contributor assignments must match ARRM data
   - No invented or made-up role assignments

3. **Completeness**
   - All relevant ARRM tasks should be identified
   - No critical ARRM tasks should be omitted
   - All role responsibilities should be assigned appropriately

### Example Valid ARRM Usage:
```json
{
  "arrm": {
    "task_id": "CSS-010",  // Real ARRM task ID
    "wcag_sc": "1.4.1",
    "level": "A",
    "primary": ["Visual Design"],
    "secondary": ["Content Authoring"],
    "contributors": []
  }
}
```

### Example Invalid ARRM Usage:
```json
{
  "arrm": {
    "task_id": "IMG-001",  // Placeholder ID
    "wcag_sc": "1.1.1",
    "primary": ["Content Authoring"],
    "secondary": ["UX Design"],  // Made-up role
    "contributors": ["Developer"]  // Not in ARRM
  }
}
```

## Automation Safety Assessment

### Safety Criteria

The Critic assesses whether an automated fix is appropriate based on:

1. **Rule Certainty**
   - High rule certainty: Clear technical requirements with authoritative source
   - Medium rule certainty: Partially clear requirements
   - Low rule certainty: Unclear or conflicting requirements

2. **Intent Certainty**
   - High intent certainty: Intended meaning and interaction clearly understood
   - Medium intent certainty: Reasonable understanding with some ambiguity
   - Low intent certainty: Intent unclear or uncertain

3. **Change Risk**
   - Low change risk: No impact on meaning, workflow, policy, visual hierarchy
   - Medium change risk: Moderate impact on one or more areas
   - High change risk: Significant impact on functionality or user experience

4. **Testability**
   - High testability: Can be reliably verified with automated tools
   - Medium testability: Requires some manual verification
   - Low testability: Requires extensive manual testing

### Safety Decision Matrix

| Rule Certainty | Intent Certainty | Change Risk | Testability | Recommendation |
|---------------|------------------|-------------|-------------|----------------|
| High          | High             | Low         | High        | Safe for automation |
| High          | High             | Medium      | Medium      | Human confirmation needed |
| High          | Medium          | Low         | High        | Cross-role decision |
| High          | Medium          | Medium      | Medium      | Cross-role decision |
| High          | Low              | Any         | Any         | Need more information |
| Medium        | Any              | Any         | Any         | Insufficient evidence |
| Low           | Any              | Any         | Any         | Insufficient evidence |

### Safe Automated Fix Example
```json
{
  "decision": {
    "state": "auto-fixable",
    "rule_certainty": "high",
    "intent_certainty": "high", 
    "change_risk": "low",
    "testability": "high"
  }
}
```

### Unsafe Automated Fix Example
```json
{
  "decision": {
    "state": "human-confirmation-needed",
    "rule_certainty": "high",
    "intent_certainty": "medium",  // Unclear what the tabindex should be
    "change_risk": "low",
    "testability": "high"
  }
}
```

## Role Engagement Review

### Question Quality Checks

The Critic verifies that questions are properly directed:

1. **Primary Role Questions**
   - Address core responsibility ownership
   - Focus on implementation choices within their domain
   - Ask for justification of their preferred approach

2. **Secondary Role Questions**
   - Consider broader impact of Primary's decision
   - Evaluate interaction with their area of expertise
   - Identify potential conflicts with their responsibilities

3. **Contributor Role Questions**
   - Ensure the solution works across all relevant technical areas
   - Validate implementation feasibility
   - Check for integration with existing systems

### Missing Professional Perspectives

The Critic identifies roles that should be involved but aren't:

```json
{
  "missing_perspectives": [
    {
      "role": "Testing",
      "concern": "No keyboard testing planned",
      "recommendation": "Test with keyboard-only navigation",
      "urgency": "high"
    },
    {
      "role": "User Experience Design", 
      "concern": "Impact on cognitive load unclear",
      "recommendation": "User research needed for complexity assessment",
      "urgency": "medium"
    }
  ]
}
```

### Role Conflict Documentation

When different roles suggest conflicting approaches:

1. **Record Each Role's Position**
2. **Document Evidence Supporting Each View**
3. **Identify the Trade-off Being Made**
4. **Specify Who Should Make the Final Decision**
5. **Recommend Who Should Be Consulted**
6. **Note What Evidence Would Reduce Uncertainty**

## Evidence Assessment

### Evidence Types and Quality

The Critic evaluates the quality and completeness of evidence:

1. **Automated Evidence**
   - Axe-core scan results
   - Automated testing tools output
   - Static code analysis

2. **Manual Evidence**
   - Keyboard testing results
   - Screen reader testing notes
   - Visual inspection findings

3. **User Research Evidence**
   - Disabled user testing results
   - User interviews and feedback
   - Survey data

### Evidence Quality Criteria

1. **Sufficient Evidence**
   - Coverage of all relevant scenarios
   - Adequate sample size for user testing
   - Diverse testing conditions

2. **Current vs. Historical**
   - Up-to-date testing methodology
   - Current assistive technology versions
   - Relevant for the target user population

3. **Documented Process**
   - Clear reproduction steps
   - Test conditions clearly stated
   - Results recorded systematically

## Perspective Handling

### User Impact Analysis

The Critic examines likely impacts for specific user groups:

1. **Screen-Reader Users**
   - Does the change affect information announcement?
   - Are semantic landmarks preserved?
   - Are navigation patterns disrupted?

2. **Motor/Ergonomic Users**
   - Does the change affect target size or spacing?
   - Are keyboard interactions maintained?
   - Are gesture-based interactions accessible?

3. **Visual Users**
   - Does the change affect color contrast?
   - Are focus indicators preserved?
   - Are visual relationships maintained?

4. **Cognitive Users**
   - Does the change affect complexity or clarity?
   - Are instructions clear and concise?
   - Are error messages helpful?

### Appropriate User Research Recommendation

User research should be recommended only when:

- **Essential for decision**: Cannot resolve uncertainty without direct user input
- **High impact**: Will significantly affect multiple user groups
- **Insufficient internal evidence**: Current evidence cannot determine the best approach

### Simulating Lived Experience Detection

The Critic ensures it does not:

- **Claim first-hand experience**: Should not state "I tested with screen readers"
- **Make universal claims**: Should not say "People with visual impairments can't..."
- **Generalize from single anecdote**: Should not base conclusions on limited testing

### Evidence Gathering Requirements

| Evidence Type | When Required | How Gathered |
|---------------|---------------|--------------|
| Automated | Deterministic, clear rules | Axe-core, static analysis |
| Manual | Requires human interpretation | Keyboard testing, manual checks |
| User Research | Cannot determine best approach | Usability studies, interviews |

## Decision Quality Review

### Disagreement Documentation

When professional roles disagree:

1. **Record Each Role's Position**
2. **Document the Evidence** supporting each position
3. **Identify the Core Trade-off**
4. **Specify Decision Authority**
5. **Recommend Consultation Process**
6. **Document What Evidence Would Reduce Uncertainty**

### Decision Owner Identification

The Critic determines who has ultimate decision authority:

**Primary Role**: Has final decision authority for tasks where they have Primary Ownership

**Secondary Role**: Can challenge Primary role decisions, especially when their expertise is relevant

**Contributor Role**: Provides technical implementation but defers to Primary/Secondary decisions

### Rationale Documentation

Quality decisions include clear documentation of:

1. **Decision Basis**: What evidence and analysis supported the decision
2. **Stakeholder Input**: Which professionals were consulted and their recommendations
3.
4. 
5. **Trade-offs Considered**: What alternatives were evaluated and why they were rejected
6. **Risk Assessment**: What are the known risks and mitigation strategies

### Unclear Risk Documentation

Transparency about uncertainty:

1. **Known Limitations**: What the decision cannot fully address
2. **Monitoring Requirements**: What should be tracked post-implementation
3. **Revisit Triggers**: Under what conditions the decision should be reviewed
4. **Evidence Gaps**: What information is still needed but unavailable

## Structured Critic Output

The Critic produces structured output with the following sections:

```json
{
  "accepted_claims": [
    {
      "claim": "Brief statement of accepted finding",
      "evidence": ["Supporting evidence references"],
      "confidence_level": "high|medium|low"
    }
  ],
  
  "challenged_claims": [
    {
      "claim": "Brief statement of challenged finding",
      "issue": "What about this claim is questionable",
      "evidence_needed": ["What additional evidence is required"],
      "stakeholder": "Which role should investigate"
    }
  ],
  
  "missing_arrm_tasks": [
    "List of ARRM tasks that should have been identified but weren't"
  ],
  
  "responsibility_mismatches": [
    {
      "task_id": "ARMM task ID",
      "issue": "What assignment is incorrect",
      "correct_assignment": "What the correct assignment should be"
    }
  ],
  
  "unsafe_automation": [
    {
      "issue": "What makes this automation unsafe",
      "recommendation": "Why it should not be auto-fixed",
      "instead_recommend": "What should be done instead"
    }
  ],
  
  "missing_questions": [
    "Questions that should be asked but aren't"
  ],
  
  "missing_evidence": [
    "Types of evidence that are missing but needed"
  ],
  
  "required_consultation": [
    {
      "role": "Which professional should be consulted",
      "reason": "Why consultation is needed",
      "urgency": "high|medium|low"
    }
  ],
  
  "recommended_decision_state": "human-confirmation-needed|cross-role-decision-needed|user-research-needed|specialist-review-needed|governance-decision-needed|insufficient-evidence",
  
  "required_next_action": "Specific action needed"
}
```

## Integration with Other Workflows

### With Planner

The Critic reviews Planner's initial assessments and:

1. **Validates ARRM Task Identification**: Confirms that Planner correctly identified relevant tasks
2. **Assesses Automation Appropriateness**: Reviews whether Planner correctly classified work as auto-fixable
3. **Checks Role Engagement**: Verifies that Planner asked appropriate questions to the right roles
4. **Documents Uncertainty**: Identifies areas where Planner was uncertain and needs human input

### With Perspective Auditor

The Critic coordinates with Perspective Auditor on:

1. **User Impact Analysis**: Ensures that user perspective impacts are properly documented
2. **Research Recommendations**: Aligns research recommendations across workflows
3. **Evidence Sharing**: Ensures that manual testing evidence is shared appropriately

### With Bug Reporter

The Critic reviews Bug Reporter findings for:

1. **Professional grounding**: Ensures findings properly reference ARRM tasks and roles
2. **Evidence completeness**: Verifies that findings include all required evidence types
3. **Decision routing**: Confirms that findings are routed to appropriate human decision makers

## Examples of Critic Reviews

### Example 1: Safe Deterministic Fix

**Input:** Finding about duplicate IDs

**Critic Review:**

- ✅ **ARRM Grounding**: Uses real ARRM task SEM-026 (ID attribute requirements)
- ✅ **Automation Safety**: High rule certainty, high intent certainty, low change risk
- ✅ **Role Engagement**: Questions directed to Front-End Development (primary)
- ✅ **Evidence**: Clear automated detection with automated testing verification
- ✅ **Perspective**: Minimal user impact, no user research needed
- ✅ **Decision Quality**: Clear, documented rationale

**Output:** Accepts as auto-fixable, no challenges

### Example 2: Unsafe Positive Tabindex Fix

**Input:** Finding about positive tabindex

**Critic Review:**

- ✅ **ARRM Grounding**: Uses real ARRM task SEM-021 (focus order)
- ❌ **Automation Safety**: Intent certainty is medium - unclear what tabindex should be
- ❌ **Role Engagement**: No questions to User Experience Design (secondary role)
- ⚠️ **Evidence**: No manual keyboard testing to understand intent
- ⚠️ **Perspective**: Could affect keyboard navigation
- ❌ **Decision Quality**: Incomplete information to make decision

**Output:** Flags as needing human confirmation or cross-role decision

### Example 3: Invented ARRM Assignment

**Input:** Finding with placeholder ARRM task

**Critic Review:**

- ❌ **ARRM Grounding**: Uses invented task ID "MY-TASK-001"
- ❌ **Role Assignment**: Roles "UX Engineer", "Frontend Developer" not in ARRM
- ❌ **Evidence**: No support for claims
- ❌ **Decision Quality**: No real professional grounding

**Output:** Lists all issues and recommends complete reassessment

### Example 4: Cross-Role Chart Decision

**Input:** Finding about image alternative text for charts

**Critic Review:**

- ✅ **ARRM Grounding**: Uses real ARRM tasks IMG-018, SEM-012, CSS-020
- ✅ **Role Engagement**: Questions for Content Authoring (primary), Visual Design (secondary)
- ✅ **Evidence**: Both automated and manual evidence available
- ⚠️ **Perspective**: Screen-reader, cognitive, motor impacts identified
- ⚠️ **Decision Quality**: Requires cross-role consensus

**Output**: Recognizes the complexity and recommends cross-role decision with appropriate questions

### Example 5: Unsupported Claim About Disabled Users

**Input:** Finding making claims about screen reader users without evidence

**Critic Review:**

- ❌ **ARRM Grounding**: Claims to be based on real evidence but lacks citations
- ❌ **Evidence**: No user research evidence cited
- ❌ **Perspective**: Makes claims about user experience without validation
- ❌ **Decision Quality**: Claims lack professional support

**Output:** Flags unsupported claims, recommends user research or specialist review

## Summary

The Critic ensures that accessibility decisions meet professional standards by:

1. **Verifying ARRM compliance**: Using real data and correct role assignments
2. **Assessing automation appropriateness**: Determining when AI can safely fix
3. **Ensuring proper role engagement**: Consulting the right professionals
4. **Evaluating evidence quality**: Verifying claims are well-supported
5. **Maintaining decision quality**: Documenting disagreements and uncertainties
6. **Protecting against bias**: Ensuring perspectives are appropriately represented

The Critic does not make final decisions but provides the professional review necessary for high-quality accessibility work that respects both technical requirements and human needs.

## Integration with Other Workflows

The Critic integrates with:

1. **Planner**: Reviews Planner's initial assessments
2. **Perspective Auditor**: Ensures user impacts are considered
3. **Bug Reporter**: Validates bug findings have professional grounding
4. **Manual Testing**: Ensures manual evidence is properly documented

## Quality Gates

The Critic enforces quality standards:

1. **ARRM Compliance**: Must use real ARRM tasks and roles
2. **Evidence Requirements**: Must distinguish automated, manual, and user research evidence
3. **Professional Perspective**: Must engage appropriate roles
4. **Decision Transparency**: Must document uncertainties and disagreements
5. **User Impact Awareness**: Must identify potential user impacts

## Future Work

The Critic will evolve to:

1. **Enhanced ARRM Integration**: Better mapping to new ARRM releases
2. **Role-Specific Expertise**: Deeper understanding of each professional role
3. **AI-Generated Evidence**: Integration with AI-generated test results
4. **Continuous Learning**: Improve assessment criteria based on experience

The Critic workflow is essential for ensuring that AI-assisted accessibility work meets professional standards while maintaining human accountability and evidence-based decision making.