# Decision State Model

## Overview

This document defines the decision state model used throughout the role-aware accessibility workflow architecture. The model provides a standardized way to classify accessibility work and determine the appropriate level of human involvement.

## Decision States

### 1. auto-fixable
**Characteristics:**
- Clear technical violation with unambiguous fix
- High rule certainty
- High intent certainty
- Low change risk
- High testability
- Can be fully automated

**Example Triggers:**
- Duplicate IDs
- Invalid ARIA attributes
- Positive tabindex without logical position
- Missing document language
- Decorative images with missing alt=""

**Required Action:** Apply fix and run tests

**Evidence:** Verification of fix and test results

### 2. human-confirmation-needed
**Characteristics:**
- Clear requirement that needs human validation
- High rule certainty
- Low intent ambiguity
- High testability
- Simple human decision

**Example Triggers:**
- Verifying implementation of required feature
- Confirming compliance with established standard

**Required Action:** Human validation of unambiguous requirement

**Evidence:** Human confirmation and implementation details

### 3. cross-role-decision-needed
**Characteristics:**
- Multiple professional roles involved
- Judgement call with multiple valid approaches
- Clear rule requirements with ambiguous implementation
- Medium change risk
- Must balance competing considerations

**Example Triggers:**
- Content accessibility decisions
- Interface design trade-offs
- Implementation pattern selection

**Required Action:** Facilitate cross-role discussion and decision-making

**Evidence:** Role perspectives, discussion outcomes, final decision

### 4. user-research-needed
**Characteristics:**
- Cannot determine requirement without user input
- High impact on user experience
- Uncertain about actual user needs
- Must involve disabled users directly

**Example Triggers:**
- Complex interaction design decisions
- Undefined user workflows
- Accessibility of novel features

**Required Action:** Design and conduct user research

**Evidence:** Research findings and user testing results

### 5. specialist-review-needed
**Characteristics:**
- Requires external expertise
- Domain-specific knowledge needed
- Technical complexity beyond internal capability

**Example Triggers:**
- Legal or compliance review
- Assistive technology specialist consultation
- User experience research expert involvement

**Required Action:** Consult relevant external expert

**Evidence:** Specialist review and recommendations

### 6. governance-decision-needed
**Characteristics:**
- Involves policy, legal, or security considerations
- Cross-team coordination required
- Impact on multiple systems or services
- Requires organizational decision

**Example Triggers:**
- Security-impacted accessibility changes
- Legal compliance questions
- Privacy implications
- Resource allocation decisions

**Required Action:** Escalate to governance review

**Evidence:** Governance decision and rationale

### 7. insufficient-evidence
**Characteristics:**
- Cannot determine due to missing information
- Critical evidence gaps exist
- Cannot make informed decision

**Example Triggers:**
- Missing user research data
- Incomplete testing information
- Unclear requirements

**Required Action:** Document missing evidence and ask targeted questions

**Evidence:** Documentation of gaps and required information

## Automation Decision Model

### Criteria

Each finding is evaluated against four criteria:

1. **Rule Certainty**
   - High: Clear normative, technical, or repository requirement
   - Medium: Partially clear requirement
   - Low: Unclear or conflicting requirements

2. **Intent Certainty**
   - High: Intended meaning or interaction clearly understood
   - Medium: Reasonable understanding but some ambiguity
   - Low: Intent unclear or uncertain

3. **Change Risk**
   - Low: Minimal impact on meaning, workflow, policy, visual hierarchy, content, or user expectations
   - Medium: Moderate impact on one or more areas
   - High: Significant impact on core functionality or user experience

4. **Testability**
   - High: Can be reliably verified with automated tools
   - Medium: Can be partially verified, some manual testing needed
   - Low: Requires extensive manual testing or user research

### Decision Matrix

| Rule Certainty | Intent Certainty | Change Risk | Testability | Decision State |
|----------------|------------------|-------------|-------------|----------------|
| High           | High             | Low         | High        | auto-fixable   |
| High           | High             | Low         | Medium      | human-confirmation-needed |
| High           | High             | Low         | Low         | cross-role-decision-needed |
| High           | Medium          | Low         | High        | cross-role-decision-needed |
| High           | Medium          | Medium     | Medium      | cross-role-decision-needed |
| High           | Medium          | High        | Medium      | user-research-needed |
| High           | Low              | Any         | Any         | insufficient-evidence |
| Medium         | Any              | Any         | Any         | insufficient-evidence |
| Low            | Any              | Any         | Any         | insufficient-evidence |

## Decision State Transitions

### Progressive Refinement

**auto-fixable** → **human-confirmation-needed**
- When implementation verification is needed

**human-confirmation-needed** → **cross-role-decision-needed**
- When multiple roles have conflicting views on verification

**cross-role-decision-needed** → **user-research-needed**
- When role disagreement cannot be resolved without user input

**cross-role-decision-needed** → **governance-decision-needed**
- When decision affects multiple teams or services

**insufficient-evidence** → **Any state**
- Depends on evidence gathered

### Evidence-Based Upgrades

**insufficient-evidence** can transition to:
- **auto-fixable** → When evidence confirms clear path
- **human-confirmation-needed** → When evidence validates requirement
- **cross-role-decision-needed** → When evidence clarifies trade-offs
- **user-research-needed** → When evidence shows need for user input
- **specialist-review-needed** → When evidence shows need for expert input

### Evidence-Based Downgrades

High-certainty findings can sometimes be downgraded with strong evidence:
- **cross-role-decision-needed** → **auto-fixable** (when evidence strongly supports single approach)
- **user-research-needed** → **auto-fixable** (when existing evidence is conclusive)
- **governance-decision-needed** → **cross-role-decision-needed** (when scope is clarified)

## Decision State Properties

### auto-fixable
- **Automation**: Fully automated
- **Risk**: Low
- **Scalability**: High
- **Human Overhead**: Minimal
- **Verification**: Automated testing
- **Fallback**: May require manual review for edge cases

### human-confirmation-needed
- **Automation**: Requires human trigger
- **Risk**: Low
- **Scalability**: Medium
- **Human Overhead**: Low
- **Verification**: Human confirmation
- **Fallback**: Can proceed with documentation if confirmation unavailable

### cross-role-decision-needed
- **Automation**: Structured facilitation
- **Risk**: Medium
- **Scalability**: Low
- **Human Overhead**: High
- **Verification**: Cross-role consensus
- **Fallback**: Can escalate to governance or research

### user-research-needed
- **Automation**: Research design assistance
- **Risk**: High (without research)
- **Scalability**: Very Low
- **Human Overhead**: Very High
- **Verification**: User testing results
- **Fallback**: Can use specialist input instead

### specialist-review-needed
- **Automation**: Specialist coordination
- **Risk**: Medium
- **Scalability**: Low
- **Human Overhead**: High
- **Verification**: Expert validation
- **Fallback**: Can use governance if specialist unavailable

### governance-decision-needed
- **Automation**: Governance facilitation
- **Risk**: High
- **Scalability**: Low
- **Human Overhead**: Very High
- **Verification**: Policy compliance
- **Fallback**: Can use specialist input for technical aspects

### insufficient-evidence
- **Automation**: Evidence gathering assistance
- **Risk**: High (cannot decide)
- **Scalability**: Medium (depends on evidence gathering)
- **Human Overhead**: Variable
- **Verification**: Not applicable until evidence gathered
- **Fallback**: Must gather evidence before proceeding

## Decision State Documentation

Each finding must document:

1. **Selected state**
2. **Justification** (why this state, not others)
3. **Next steps** (required actions)
4. **Dependencies** (what is needed to change state)
5. **Escalation path** (what happens if progress stalls)

## Common Patterns

### Template for Each Decision State

```yaml
decision:
  state: "[state-name]"
  rule_certainty: "[high/medium/low]"
  intent_certainty: "[high/medium/low]"
  change_risk: "[low/medium/high]"
  testability: "[high/medium/low]"
  confidence: "[high/medium/low]"
  
  # State-specific fields
  human_confirmation:
    required: ["list", "of", "confirmations"]
    
  cross_role:
    participants: ["list", "of", "roles"]
    questions: ["list", "of", "targeted", "questions"]
    
  user_research:
    needed: ["research", "questions"]
    
  specialist_review:
    expertise: ["list", "of", "expertise"]
    
  governance:
    scope: ["policy", "legal", "security"]
    approval_required: true
    
  insufficient_evidence:
    gaps: ["list", "of", "missing", "evidence"]
    questions: ["targeted", "questions"]
```

## Quality Gates

### State Validation

1. **auto-fixable**: Verify fix works and doesn't break existing functionality
2. **human-confirmation-needed**: Verify human validation was performed
3. **cross-role-decision-needed**: Verify all relevant roles were consulted
4. **user-research-needed**: Verify research was conducted with disabled users
5. **specialist-review-needed**: Verify expert review was conducted
6. **governance-decision-needed**: Verify governance approval was obtained
7. **insufficient-evidence**: Verify evidence gaps are documented and being addressed

### Escalation Criteria

**Immediate Escalation Required:**
- Security-impacted decisions
- Legal compliance questions
- Privacy implications
- Resource allocation >$10,000

**Escalation Protocol:**
1. Document current decision state
2. Identify required evidence
3. Recommend appropriate escalation path
4. Schedule escalation meeting
5. Track progress

## Evolution Path

### Maturity Levels

1. **Level 1**: Auto-fixable only (deterministic fixes)
2. **Level 2**: Add human-confirmation-needed (simple validations)
3. **Level 3**: Add cross-role-decision-needed (collaborative decisions)
4. **Level 4**: Add user-research-needed (requires disabled-user testing)
5. **Level 5**: Add specialist-review-needed (external expertise)
6. **Level 6**: Add governance-decision-needed (policy/legal review)

### Improvement Areas

1. **Reduce auto-fixable rate**: Add more deterministic rules
2. **Reduce cross-role decisions**: Improve clarity of requirements
3. **Reduce user-research needed**: Build existing user research evidence
4. **Reduce specialist reviews**: Build internal expertise
5. **Reduce governance escalations**: Standardize common decisions

## References

- [W3C WAI ARRM Project](https://github.com/w3c/wai-arrm) - Source of role ownership
- [zivtech/accessibility-skills](https://github.com/zivtech/accessibility-skills) - Workflow model inspiration
- [wcag-3.0](https://www.w3.org/TR/wcag-3.0/) - Standards horizon
- [wai-yaml-ld](https://github.com/mgifford/wai-yaml-ld) - Machine-readable WCAG