# AI Workflows

The AI workflow module provides AI assistant functions that support accessibility work while maintaining human accountability. Each workflow is designed to facilitate professional collaboration, not replace it.

## Core Principles

1. **Automate where possible**: For clear, deterministic accessibility issues with low risk, AI can implement fixes automatically
2. **Facilitate judgement**: For ambiguous or complex issues, AI should identify relevant perspectives and help humans make decisions
3. **Escalate uncertainty**: When AI cannot confidently resolve an issue, it should involve relevant experts and escalate to research or governance

## Available Workflows

### Planner
Identifies ARRM tasks and produces role-aware guidance for accessibility decisions

### Critic  
Reviews plans and implementations; identifies missing professional perspectives and challenges unsupported assumptions

### Tester
Runs automated checks and verifies behavior; preserves evidence for human interpretation

### Perspective Auditor
Examines likely consequences for users; makes uncertainty explicit; recommends direct research with disabled people where necessary

### Bug Reporter
Converts evidence into reproducible findings; preserves ARRM ownership assignments; identifies the accountable human role

## Workflow Integration

AI workflows integrate with:

* **Topic skills**: Each workflow knows which topic skills may be relevant to the finding
* **ARRM tasks**: Workflows identify and reference relevant ARRM tasks by ID
* **Professional roles**: Workflows respect primary, secondary, and contributor role assignments
* **User perspectives**: Workflows consider impacts on different disability and situational access groups

## Decision States

1. **auto-fixable**: Deterministic fix with high certainty, low risk
2. **human-confirmation-needed**: Requires human validation of unambiguous requirement
3. **cross-role-decision-needed**: Multiple roles involved, requires consensus
4. **user-research-needed**: Requires direct input from disabled users
5. **specialist-review-needed**: Requires external expertise
6. **governance-decision-needed**: Requires policy or legal review
7. **insufficient-evidence**: Cannot determine due to missing information

## Output Structure

Each finding produces a structured output containing:

* Core finding information (ID, title, ARRM mapping)
* Decision state and confidence assessment
* Role perspectives and recommendations
* Evidence and reproduction steps
* Required human actions and escalation paths

The structure ensures clear communication between AI tools and human professionals while maintaining accountability.