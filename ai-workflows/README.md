# AI Workflows - Intelligent Accessibility Assistance

## Overview

This directory contains **AI assistance functions** that support accessibility work while maintaining human accountability. Each workflow is designed to facilitate professional collaboration, not replace it.

### Core Philosophy

> **Automate rules. Facilitate judgement. Escalate uncertainty.**

- **Deterministic fixes** (clear rules, low risk) → AI can auto-fix
- **Judgement calls** (trade-offs, user needs) → AI facilitates human decision
- **Uncertain work** (insufficient evidence) → AI identifies and escalates

### Guidelines for AI Usage

1. **Auto-fixable work**: Let AI implement clear, technical fixes
2. **Judgement required**: Use AI to identify relevant perspectives and help humans decide
3. **Uncertain work**: Use AI to document gaps and recommend escalation
4. **Human ownership**: AI never replaces professional role responsibility
5. **Evidence preservation**: AI always documents reasoning and recommendations

## Available Workflows

### `planner/` - **Role-Aware Decision Making**

**Purpose**: Identify ARRM tasks and produce role-aware guidance for accessibility decisions

**What It Does:**
- Maps findings to ARRM tasks and professional roles
- Distinguishes deterministic from judgement-call work  
- Identifies likely affected user perspectives
- Generates role-specific questions when human judgement is needed
- Recommends which humans should be involved
- Documents conflicts and uncertainty

**When to Use:**
- Early in the accessibility workflow, before implementation
- For any accessibility finding (automated scans, manual testing, code reviews)
- When you need to understand role ownership and appropriate engagement

**When NOT to Use:**
- Direct technical fixes that are clearly required and unambiguous
- External audits that follow different processes
- Quick accessibility checks where role ownership isn't needed

**Example Output:**
```json
{
  "decision": {
    "state": "cross-role-decision-needed",
    "rule_certainty": "high",
    "intent_certainty": "medium"
  },
  "questions": {
    "primary": ["What information does this image add?"],
    "secondary": ["What role does the image play in the user journey?"],
  },
  "recommended_engagement": {
    "participants": ["Content Authoring", "User Experience Design"],
    "reason": "Primary ownership and secondary impact"
  }
}
```

---

### `critic/` - **Expert Review and Challenge**

**Purpose**: Review plans and implementations, identifying missing professional perspectives and challenging unsupported assumptions

**What It Does:**
- Reviews accessibility decisions from multiple professional perspectives
- Identifies missing role perspectives in proposed solutions
- Challenges assumptions unsupported by evidence
- Distinguishes technical non-conformance from design judgement
- Recommends specific people or roles who should be involved
- Identifies missing user evidence
- Determines whether perspective audits are needed

**When to Use:**
- Reviewing accessibility plans before implementation
- Evaluating completed accessibility implementations
- Need for expert validation of decisions
- Complex accessibility questions requiring multiple viewpoints

**When NOT to Use:**
- Simple technical fixes with clear requirements
- Quick accessibility validation where expert review isn't needed
- Direct implementation work

**Example Output:**
```json
{
  "missing_perspectives": [
    {
      "role": "Testing",
      "concern": "No keyboard testing performed",
      "recommendation": "Test with keyboard-only navigation"
    }
  ],
  "unsupported_assumptions": [
    {
      "assumption": "All screen readers announce this content",
      "challenge": "Need evidence with real assistive technology",
      "evidence_needed": "Screen reader testing results"
    }
  ],
  "recommended_participants": ["Testing", "Manual Testing"]
}
```

---

### `tester/` - **Evidence Collection and Verification**

**Purpose**: Gather reproducible evidence, run automated checks, and verify actual behavior

**What It Does:**
- Collects reproducible evidence for accessibility findings
- Runs deterministic automated accessibility checks where tooling exists
- Verifies keyboard behaviour and focus handling
- Inspects rendered behaviour rather than only source attributes
- Preserves evidence, reproduction steps, and test conditions
- Avoids claiming that automated tests establish full accessibility
- Identifies findings that require human interpretation

**When to Use:**
- After making accessibility changes
- Validating that fixes actually work
- Documenting current accessibility state
- Collecting evidence for bug reports

**When NOT to Use:**
- Claiming automated tests establish full accessibility
- Making accessibility decisions based solely on test results
- Interpreting complex accessibility findings

**Example Output:**
```json
{
  "evidence": {
    "source": "axe-core scan",
    "reproduction_steps": [
      "Open page in screen reader",
      "Navigate with keyboard only",
      "Check focus indicators"
    ],
    "expected": "All controls have visible focus indicators",
    "actual": "Focus indicator removed for custom button",
    "findings": [
      {
        "rule": "2.4.7 Focus Visible",
        "impact": "Serious",
        "location": "custom-button::before"
      }
    ]
  }
}
```

---

### `perspective-auditor/` - **User Impact Analysis**

**Purpose**: Examine likely consequences for specific user groups and recommend direct research when necessary

**What It Does:**
- Runs only when a relevant perspective has been triggered
- Examines likely consequences for users with specific disabilities
- Identifies barriers that professional role review may have missed
- Makes uncertainty explicit in the accessibility assessment
- Recommends direct research with disabled people where necessary
- Avoids simulating or claiming lived experience
- Provides questions for research or specialist review

**When to Use:**
- When specific user perspectives are relevant to a finding
- Need to understand impacts on different disability groups
- Determining whether user research is required
- Complex accessibility questions with user experience implications

**When NOT to Use:**
- Without a clearly identified user perspective
- Claiming to understand lived experience of disabilities
- Making decisions about user needs without actual research

**Example Output:**
```json
{
  "perspective": "screen-reader and semantic access",
  "consequences": [
    "Screen reader users may not understand image purpose",
    "Lack of proper landmarks affects navigation"
  ],
  "recommended_research": {
    "study_type": "screen reader testing",
    "participants": "5-8 screen reader users",
    "tasks": ["Complete form", "Navigate documentation"],
    "research_questions": ["Did you understand the image content?"]
  }
}
```

---

### `bug-reporter/` - **Structured Findings and Routing**

**Purpose**: Convert evidence into reproducible findings, preserving ARRM ownership and accountability

**What It Does:**
- Converts evidence into structured, reproducible findings
- Includes relevant ARRM task IDs where possible
- Preserves ARRM ownership assignments
- Identifies the accountable human role
- Identifies supporting and contributing roles
- Includes expected and actual behavior
- Includes reproduction steps and evidence
- Distinguishes an automatic fix from a cross-role decision
- Avoids assigning organizational responsibility to AI

**When to Use:**
- Creating formal accessibility bug reports
- Converting findings into documentation for stakeholders
- Need to preserve evidence for audit purposes
- Sharing accessibility findings with development teams

**When NOT to Use:**
- Assigning blame or organizational responsibility
- Claiming to be the final authority on accessibility
- Making decisions without human review

**Example Output:**
```json
{
  "finding": {
    "id": "BUG-001",
    "title": "Missing alt text on meaningful image",
    "arrm": {
      "task_id": "IMG-001",
      "wcag_sc": "1.1.1",
      "primary": ["Content Authoring"],
      "secondary": ["User Experience Design"]
    },
    "ai_assistance": {
      "workflows": ["planner", "perspective-auditor"],
      "perspectives": ["screen-reader and semantic access"]
    }
  },
  "decision": {
    "state": "cross-role-decision-needed",
    "ai_recommendation": "Content Authoring should decide on alt text"
  }
}
```

## Integration and Workflow

### Topic Skills Integration
Each AI workflow knows which topic skills are relevant:

| AI Workflow | Relevant Topic Skills |
|-------------|----------------------|
| Planner | forms, keyboard, color-contrast, content-design |
| Critic | bug-reporting, manual-testing |
| Tester | manual-testing, axe-rules |
| Perspective Auditor | forms, keyboard, visual-design |
| Bug Reporter | bug-reporting |

### Role Integration
The AI workflows respect role ownership:

1. **Primary Roles** - Make final decisions, own accountability
2. **Secondary Roles** - Can challenge Primary decisions, provide advisory input
3. **Contributor Roles** - Provide technical implementation and validation

### Evidence Requirements
Each finding must document:
1. **Core finding information** (ID, title, ARRM mapping)
2. **Decision state and confidence assessment**
3. **Role perspectives and recommendations**
4. **Evidence and reproduction steps**
5. **Required human actions and escalation paths**

## Decision States

| State | Meaning | AI Role |
|-------|---------|---------|
| auto-fixable | Deterministic fix with high certainty | AI implements |
| human-confirmation-needed | Human validation of unambiguous requirement | AI coordinates |
| cross-role-decision-needed | Multiple roles involved | AI facilitates |
| user-research-needed | Requires disabled-user input | AI designs research |
| specialist-review-needed | Requires external expertise | AI coordinates |
| governance-decision-needed | Policy/legal/security review | AI escalates |
| insufficient-evidence | Cannot determine due to missing info | AI documents gaps |

## Technology Stack

### Prerequisites:
- Node.js 18+

### Installation:
```bash
# Navigate to the AI workflows directory
```

### Running:
```bash
# The evaluation system tests all workflows automatically
node scripts/validate:evals
```

### Configuration:
Each workflow can be configured through environment variables:
- `AI_WORKFLOW_MODE` - Controls AI behavior (development, testing, production)
- `MAX_TOKENS` - Token limits for AI responses
- `TEMPERATURE` - Response consistency control

## Architecture Integration

### With Topic Skills:
Each AI workflow integrates with topic skills to provide detailed guidance:
- **Planner**: Uses forms, keyboard, color-contrast skills for decision context
- **Tester**: Uses axe-rules, manual-testing skills for verification criteria
- **Critic**: Uses bug-reporting skills for structured review

### With ARRM Tasks:
The AI workflows identify and reference relevant ARRM tasks:

**Workflow Integration:**
1. Input finding → Workflow analyzes → ARRM tasks identified
2. Role assignments extracted (Primary, Secondary, Contributor)
3. Appropriate workflows triggered based on task requirements
4. AI generates role-specific questions and recommendations
5. Evidence collected and documented for human decision

**Example ARRM Mapping:**
```json
{
  "workflow": "planner",
  "arrm_tasks": [
    {
      "id": "IMG-001",
      "wcag_sc": "1.1.1",
      "primary": ["Content Authoring"],
      "secondary": ["User Experience Design"]
    }
  ],
  "ai_output": {
    "state": "cross-role-decision-needed",
    "questions": {
      "primary": ["What information does this image add?"],
      "secondary": ["What role does this image play?"]
    }
  }
}
```

### With Professional Roles:
The AI workflows respect and facilitate role-based collaboration:

1. **Role Identification**: Each finding is mapped to appropriate ARRM roles
2. **Role-Specific Questions**: AI generates questions targeted to each role
3. **Conflict Documentation**: AI makes disagreement between roles visible
4. **Escalation Pathways**: AI recommends when roles should engage
5. **Accountability Maintenance**: AI never replaces role ownership

## Quality Gates

### Evidence Quality
- **Reproducible**: Steps to reproduce are clearly documented
- **Verifiable**: Conditions under which evidence was collected
- **Contextual**: Relevant to the specific implementation  
- **Complete**: Includes expected and actual behavior

### Decision Quality
- **Role-aware**: Questions targeted to appropriate professional roles
- **Evidence-based**: Decisions supported by documented evidence
- **Transparent**: Conflicts and uncertainty are visible
- **Accountable**: Human decision-makers are identified

## Monitoring and Observability

### Metrics
- **Automation rate**: Percentage of findings auto-fixed
- **Escalation rate**: Percentage requiring human or governance decisions
- **Role conflict rate**: Frequency of role disagreements
- **Evidence completeness**: Percentage of findings with complete evidence

### Logging and Tracing
Each AI workflow logs:
- Input findings and context
- Decisions and reasoning
- Questions generated
- Human responses and outcomes
- Evidence collected and analyzed

## Security and Privacy

### Data Handling
- **No sensitive user data**: AI only works with publicly available information
- **No internal systems**: AI operates on provided inputs, not internal codebases
- **No authentication**: All operations are role-based, not user-based

### Role-Based Access
AI workflows respect role boundaries:
- Access only to information relevant to identified roles
- Cannot bypass human decision processes
- Cannot override role ownership

## Ethical Guidelines

1. **Avoid simulating lived experience**: AI does not claim to be a disabled user
2. **Maintain human agency**: AI facilitates but never replaces human decision-making
3. **Preserve transparency**: Conflicts and uncertainties are always visible
4. **Respect professional expertise**: AI acknowledges and relies on human roles

## Sample Integration

### Basic Usage:
```bash
# Initialize AI workflow
a11y-workflow planner \
  --input "image missing alt text" \
  --arrm-tasks data/arrm/primary-tasks.csv \
  --roles roles/content-authoring/ROLE.md
```

### Example Output:
```json
{
  "arrm_mapping": {
    "task_id": "IMG-001",
    "wcag_sc": "1.1.1",
    "severity": "Critical"
  },
  "ai_assessment": {
    "state": "cross-role-decision-needed",
    "confidence": "high",
    "recommendations": [
      "Engage Content Authoring for imagery decisions",
      "Consult User Experience Design for user journey impact",
      "Consider screen-reader user testing"
    ]
  },
  "next_steps": [
    "Generate role-specific questions",
    "Schedule cross-role meeting",
    "Prepare user research plan"
  ]
}
```

## Maintenance

### Updating Workflows:
1. **Planner**: Update topic skill references and role mappings
2. **Critic**: Add new perspectives and conflict detection
3. **Tester**: Add automated checks and verification criteria
4. **Perspective Auditor**: Add new disability perspectives
5. **Bug Reporter**: Update structured output format

### Performance Optimization:
1. **Caching**: Cache role mappings and topic skill references
2. **Batch processing**: Process similar findings in groups
3. **Error handling**: Graceful degradation for malformed inputs
4. **Rate limiting**: Prevent API abuse in testing environments

### Testing:
Each workflow is tested through the evaluation system:
```bash
# Run validation tests
npm run validate:evals

# Run AI workflow tests  
npm run test:ai-workflows

# Generate workflow documentation
npm run docs:ai-workflows
```

## References

- [ARRM Documentation](https://github.com/w3c/wai-arrm) - Source of role mappings
- [Accessibility Skills](https://github.com/mgifford/accessibility-skills) - Topic skill integration
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/) - Accessibility standards framework
- [Automated Testing Guidelines](https://www.w3.org/WAI/ER/tests/) - Test development best practices

## Contributing

### Adding New Workflows:
1. Create new directory in `ai-workflows/`
2. Implement `SKILL.md` with workflow definition
3. Add integration test in `evals/`
4. Update documentation in this README
5. Submit pull request

### Workflow Changes:
1. Update `SKILL.md` with new logic
2. Add tests in `evals/` 
3. Run validation to ensure no regressions
4. Document changes in changelog

## License

```markdown
MIT License

Copyright (c) 2026 Mike Gifford

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
```

---

The AI workflows are designed to support and enhance human accessibility work while maintaining professional accountability and clear role boundaries.
