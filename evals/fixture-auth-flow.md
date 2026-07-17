# ARRM Task Fixture #3: Authentication flow

## Input Scenario
A login form includes:

1. Skip navigation link that uses generic text ("skip to main content")
2. Password validation that blocks certain common patterns without clear error messages
3. "Remember me" checkbox positioned far from other form elements
4. Form submission that redirects to login page again on failure

## Expected Findings

### ARRM Mapping - Finding 1 (Skip Link)
```yaml
id: AUTH-SKIP-001
title: skip-navigation link with insufficient link text
arrm:
  task_id: LINK-003
  wcag_sc: "2.4.6 Headings and Labels"
  level: AA
  primary: ["Content Authoring"]
  secondary: ["User Experience Design"]
  contributors: ["Front-End Development"]
```

### ARRM Mapping - Finding 2 (Password Policy)
```yaml
id: AUTH-PASS-001
title: password validation with poor error messaging
title: auth-password-policy
arrm:
  task_id: FORM-006
  wcag_sc: "3.3.1 Error Identification"
  level: AA
  primary: ["Front-End Development"]
  secondary: ["Content Authoring"]
  contributors: ["Testing"]
```

### ARRM Mapping - Finding 3 (Checkbox Placement)
```yaml
id: AUTH-CHECK-001
title: form checkbox improperly spaced from related controls
arrm:
  task_id: FORM-004
  wcag_sc: "1.3.1 Info and Relationships"
  level: AA
  primary: ["User Experience Design"]
  secondary: ["Front-End Development"]
  contributors: ["Visual Design"]
```

### ARRM Mapping - Finding 4 (Redirect Loop)
```yaml
id: AUTH-LOOP-001
title: login form redirect loop on failed submission
arrm:
  task_id: LINK-001
  wcag_sc: "2.4.2 Page Titles"
  level: AA
  primary: ["Front-End Development"]
  secondary: ["Testing"]
  contributors: ["User Experience Design"]
```

### Overall Decision State Classification
```yaml
overall_decision:
  state: "governance-decision-needed"
  rule_certainty: "low"
  intent_certainty: "medium"
  change_risk: "high"
  testability: "low"
  confidence: "medium"
```

### Rationale for Governance Decision

This flow requires governance because:

1. **Multiple issues**: Four related findings create compounding complexity
2. **Policy constraints**: Authentication patterns involve security and legal considerations
3. **User impact**: Poor authentication UX affects all users, including disabled users
4. **Evidence gaps**: Missing user research on authentication behavior
5. **Resource implications**: Fixing may require redesign and testing

### Evidence Assessment

**Missing evidence that prevents auto-fix or cross-role decisions:**

1. **User research**: How do disabled users currently approach authentication?
2. **Technical constraints**: What are the redirect limitations?
3. **Legal requirements**: What regulations govern authentication forms?
4. **Business requirements**: What are the success metrics for login flows?
5. **Accessibility standards**: Are there specific guidelines for authentication forms?

### Role-Aware Questions

**Primary Role Questions (Front-End Development):**

- What technical constraints exist for the redirect behavior?
- What security requirements affect the form implementation?
- How will this fix impact user session management?
- What accessibility testing resources are available?

**Secondary Role Questions:**

**Content Authoring:**
- What vocabulary is appropriate for password policy messages?
- How should skip links be contextualized for authentication context?
- What language barriers might users face?

**User Experience Design:**
- What is the optimal checkbox placement for motor accessibility?
- How do authentication flows differ for disabled users?
- What error recovery patterns work best?

**Testing:**
- What testing methodology is appropriate for authentication flows?
- How should we test with real assistive technologies?
- What metrics matter for authentication success?

### Governance Recommendation

```yaml
recommended_governance:
  participants:
    - Security Team (Mandatory)
    - Legal/Compliance (Mandatory)
    - Accessibility Specialist (Required)
    - UX Researcher (Required)
    - Product Manager (Final decision)
  
  reason: "Multiple interacting accessibility issues with policy, security, and legal implications require governance oversight"
  
  evidence_requirements:
    - User research with disabled users on authentication
    - Documentation of security constraints for accessibility changes
    - Legal review of authentication compliance requirements
    - Technical feasibility analysis for proposed fixes
    - Business impact assessment of proposed changes
```

### Escalation Path

**Immediate**: Governance decision needed

**Evidence needed**: All evidence listed above

**Timeline**: 4-6 weeks for required research and review

**Decision points**:

1. **Security review**: Can accessibility improvements be implemented without compromising security?
2. **Legal review**: Are there compliance requirements that affect the approach?
3. **User research**: What do disabled users need for authentication?
4. **Resource assessment**: Can we collect the required evidence?

### Template Output Structure
```json
{
  "id": "AUTH-FLOW-001",
  "title": "authentication-flow-complexity",
  "arrm": {
    "findings": [
      {
        "id": "AUTH-SKIP-001",
        "task_id": "LINK-003",
        "wcag_sc": "2.4.6",
        "level": "AA",
        "primary": ["Content Authoring"],
        "secondary": ["User Experience Design"],
        "contributors": ["Front-End Development"]
      },
      {
        "id": "AUTH-PASS-001", 
        "task_id": "FORM-006",
        "wcag_sc": "3.3.1",
        "level": "AA",
        "primary": ["Front-End Development"],
        "secondary": ["Content Authoring"],
        "contributors": ["Testing"]
      },
      {
        "id": "AUTH-CHECK-001",
        "task_id": "FORM-004", 
        "wcag_sc": "1.3.1",
        "level": "AA",
        "primary": ["User Experience Design"],
        "secondary": ["Front-End Development"],
        "contributors": ["Visual Design"]
      },
      {
        "id": "AUTH-LOOP-001",
        "task_id": "LINK-001",
        "wcag_sc": "2.4.2", 
        "level": "AA",
        "primary": ["Front-End Development"],
        "secondary": ["Testing"],
        "contributors": ["User Experience Design"]
      }
    ]
  },
  
  "decision": {
    "state": "governance-decision-needed",
    "rule_certainty": "low", 
    "intent_certainty": "medium",
    "change_risk": "high",
    "testability": "low",
    "confidence": "medium"
  },
  
  "ai_assistance": {
    "workflows": ["planner", "perspective-auditor"],
    "topic_skills": ["forms"],
    "perspectives": ["keyboard and motor access", "screen-reader and semantic access", "cognitive and neurodivergent access"]
  },
  
  "missing_evidence": {
    "user_research": "How do disabled users approach authentication flows?",
    "technical_constraints": "What are the redirect limitations for security?",
    "legal_requirements": "What regulations govern authentication forms?",
    "business_metrics": "What defines success for login flows?",
    "accessibility_guidelines": "Are there specific authentication accessibility standards?"
  },
  
  "role_perspectives": [
    {
      "role": "Security",
      "concern": "Accessibility changes may introduce security vulnerabilities",
      "recommendation": "Require security review before implementation",
      "evidence": "Authentication forms are high-risk components",
      "uncertainty": "No established accessibility guidelines for authentication"
    },
    {
      "role": "Legal/Compliance",
      "concern": "Authentication changes may violate regulations",
      "recommendation": "Legal review required for any changes",
      "evidence": "Authentication involves PII and regulated data",
      "uncertainty": "Unclear how accessibility standards apply to authentication"
    }
  ],
  
  "recommended_governance": {
    "participants": ["Security Team", "Legal/Compliance", "Accessibility Specialist", "UX Researcher", "Product Manager"],
    "reason": "Multiple interacting accessibility issues with policy, security, and legal implications require governance oversight",
    "evidence_requirements": ["User research evidence", "Security constraints documentation", "Legal compliance review", "Technical feasibility analysis", "Business impact assessment"]
  }
}
```

### Unacceptable Behaviors
* Implementing individual fixes without governance approval
* Declining to document security and legal constraints
* Making accessibility changes without considering security implications
* Proceeding with implementation without required evidence

## Fixture Purpose

This fixture validates that the system can:

1. Identify complex, multi-faceted accessibility issues
2. Recognize when governance is required rather than cross-role decision
3. Document missing evidence needed for decision-making
4. Recommend appropriate governance participants and process
5. Escalate complex issues requiring research, policy, and security review

## Further Research Required

This scenario demonstrates the need for:

1. **Authentication-specific accessibility guidelines**
2. **Security-accessible design patterns**
3. **User research on authentication accessibility**
4. **Policy and regulatory guidance**

ModelCheck | model=openopen/model-name | tier=B | fit=demonstrates governance escalation capability | escalate_if=complexity exceeds governance capacity