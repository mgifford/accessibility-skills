# Role-Aware Accessibility Workflow Architecture

## Overview

This document describes the role-aware accessibility workflow architecture for `mgifford/accessibility-skills`.

The system provides a framework for making accessibility decisions that respect professional roles, minimize unnecessary AI intervention, and ensure human accountability.

## Core Concept

**W3C WAI ARRM (Accessibility Roles and Responsibilities Mapping)** provides the authoritative source for which professional roles own different accessibility tasks. This system incorporates that mapping to guide AI assistance.

## Structure

```
accessibility-skills/
├── skills/                 # Existing topic-specific accessibility knowledge
├── roles/                  # Human professional roles derived from ARRM
│   ├── content-authoring/  # Role definition and task mapping
│   ├── front-end-development/
│   ├── user-experience-design/
│   ├── visual-design/
│   └── testing/
├── ai-workflows/           # AI assistance functions
│   ├── planner/            # Identifies tasks and role-specific questions
│   ├── critic/             # Reviews decisions and identifies missing perspectives
│   ├── tester/             # Runs tests and collects evidence
│   ├── perspective-auditor/ # Examines impacts for specific user groups
│   └── bug-reporter/       # Converts findings to structured reports
├── perspectives/           # Disability and situational access perspectives
├── tasks/                  # ARRM task data and generated indexes
├── workflows/              # End-to-end process documentation
└── evals/                  # Evaluation fixtures and expectations
```

## Roles Directory

Each role directory contains:

1. **ROLE.md** - Role definition, ownership, and considerations
2. **primary-tasks.csv** - Tasks where this role has Primary ownership
3. **secondary-tasks.csv** - Tasks where this role has Secondary ownership  
4. **contributor-tasks.csv** - Tasks where this role is a Contributor

## ARRM Task Mapping

ARRM task data is available in the W3C WAI ARRM project:

- **Source**: https://github.com/w3c/wai-arrm/blob/draft/_data/arrm/arrm-all-tasks.csv
- **Format**: CSV with task-level role ownership information

This repository provides role-specific indexes derived from that data. Generated files are prefixed with `derived-from-arrm-` to indicate they are not meant for manual editing.

## Decision States

The system supports seven decision states for classifying accessibility work:

1. **auto-fixable** - Clear technical violation, low risk, can be automated
2. **human-confirmation-needed** - Requires human validation of unambiguous requirement
3. **cross-role-decision-needed** - Multiple roles involved, requires consensus
4. **user-research-needed** - Requires direct input from disabled users
5. **specialist-review-needed** - Requires external expertise
6. **governance-decision-needed** - Requires policy, legal, or security review
7. **insufficient-evidence** - Cannot determine due to missing information

## AI Workflows

Each AI workflow has specific purposes:

### Planner
- Maps findings to ARRM tasks and professional roles
- Distinguishes deterministic from judgement-call work
- Generates role-specific questions when needed
- Recommends human participants and escalation paths

### Critic
- Reviews plans and implementations
- Identifies missing professional perspectives
- Challenges unsupported assumptions
- Determines if perspective audits are needed

### Tester
- Collects reproducible evidence
- Runs automated accessibility checks
- Verifies keyboard behaviour and focus handling
- Documents test conditions and limitations

### Perspective Auditor
- Examines impacts for specific user groups
- Makes uncertainty explicit
- Recommends disabled-user research
- Provides questions for specialist review

### Bug Reporter
- Converts evidence to structured findings
- Preserves ARRM ownership assignments
- Distinguishes automatic fixes from cross-role decisions

## Perspectives

Each perspective represents a disability-related or situational access lens:

- **screen-reader and semantic access**
- **keyboard and motor access**
- **magnification and reflow**
- **cognitive and neurodivergent access**
- **auditory access**
- **environmental contrast**
- **vestibular and motion access**

### Implemented: Perspective Definitions

The `perspectives/` directory contains compact, agent-actionable definitions for each of the seven perspectives. These definitions provide:

- Scope and common barriers
- Relevant topic skills to load
- Questions to ask during review
- Evidence that can be gathered automatically vs. manually
- When direct research with disabled users is needed
- Common false assumptions
- Limitations of AI analysis
- Escalation triggers

**These definitions are inputs.** They are structured checklists that humans and the future Perspective Auditor will use. They are not the auditor itself.

### Not Yet Implemented: Perspective Auditor Workflow

The Perspective Auditor AI workflow (described in `ai-workflows/README.md`) will apply these perspective definitions to examine impacts for specific user groups. Today, humans use the perspective definitions directly. The workflow is designed but not yet built.

Key distinction: the perspective definitions (inputs) exist; the automated auditor (workflow) does not.

## Evidence Requirements

The system requires structured evidence for all findings:

1. **Core finding information** (ID, title, ARRM mapping)
2. **Decision state and confidence assessment**
3. **Role perspectives and recommendations**
4. **Evidence and reproduction steps**
5. **Required human actions and escalation paths**

## Integration with Existing Skills

This architecture integrates with the existing skills/ directory:

- Each AI workflow knows which topic skills are relevant
- Topic skills provide detailed guidance for specific accessibility domains
- AI workflows respect topic skill guidance while maintaining role ownership

## Automation Decision Model

For each finding, the system evaluates:

1. **Rule certainty** - Is there a clear normative, technical, or repository-specific requirement?
2. **Intent certainty** - Is the intended meaning or interaction understood?
3. **Change risk** - Could the change alter meaning, workflow, policy, visual hierarchy, content, or user expectations?
4. **Testability** - Can the result be reliably verified?

**Rule**: High rule certainty + high intent certainty + low change risk + high testability = eligible for automation

## Accountability Principles

1. **Human roles retain accountability** for accessibility decisions
2. **AI assists but does not own** accessibility responsibilities
3. **Conflicts between roles** are documented and visible
4. **Uncertain work** is escalated appropriately
5. **Evidence** is preserved for human interpretation

## Next Steps

1. ~~Reference ARRM CSV data source~~ — Done (data in `data/arrm/`)
2. ~~Implement task-to-role indexing mechanism~~ — Done (generated role indexes)
3. ~~Create evaluation framework~~ — Done (fixtures in `evals/`)
4. ~~Test with the three fixtures~~ — Done (positive tabindex, chart alternative, auth flow)
5. ~~Ensure existing validation passes~~ — Done (`npm run validate:evals`)
6. Build Perspective Auditor workflow using the existing perspective definitions
7. Integrate perspective auditor output with Bug Reporter
8. Add perspective-specific evaluation fixtures beyond rejection tests

## References

- [W3C WAI ARRM Project](https://github.com/w3c/wai-arrm)
- [zivtech/accessibility-skills](https://github.com/zivtech/accessibility-skills) - Planner, Critic, Tester, Perspective Audit, Bug Reporting workflow model inspiration