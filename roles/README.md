# Role-Aware Accessibility - Roles Directory

## Overview

This directory contains the **professional role definitions** based on the **W3C WAI ARRM (Accessibility Roles and Responsibilities Mapping)** project. These roles represent the human expertise and responsibilities required to make accessibility decisions.

### Core Philosophy

- **ARRM as source of truth**: All role assignments are derived from the authoritative ARRM CSV
- **Human ownership retained**: AI workflows assist but never replace professional roles
- **Clear separation**: Each professional role has distinct responsibilities and accountabilities
- **Task-based ownership**: Roles own specific accessibility tasks (primary, secondary, contributor)

## About ARRM

The **W3C WAI ARRM project** maps WCAG requirements to professional roles, defining:

- **Primary Ownership**: The role primarily accountable for the task
- **Secondary Ownership**: Roles that must be consulted and have veto power
- **Contributor Roles**: Roles that provide technical implementation or validation

Source: https://github.com/w3c/wai-arrm/blob/draft/_data/arrm/arrm-all-tasks.csv

**266 accessibility tasks** mapped to 6 professional roles, 9,999 role-task relationships

## Role Overview

Each role directory contains:

### 🔍 **ROLE.md**
- Role definition, purpose, and considerations
- ARRM task mapping summary
- Associated accessibility topics and perspectives

### 📊 **primary-tasks.csv** 
- Tasks where this role has **Primary Ownership**
- Clear accountability for decision-making

### 📋 **secondary-tasks.csv**
- Tasks where this role has **Secondary Ownership** 
- Role must be consulted and can challenge Primary decisions

### 📝 **contributor-tasks.csv**
- Tasks where this role has **Contributor responsibilities**
- Provides technical implementation or validation

## The Roles

### `content-authoring/` - **Role 1**

**Primary Ownership:** Content Authoring

**Purpose:** Content creation, documentation, and accessibility information presentation

**Why this role exists:** Content determines accessibility information, semantic structure, and user understanding

**Key Responsibilities:**
- Writing accessible documentation and instructions
- Content structure and semantic markup
- Error messaging and user guidance
- Plain language and readability

**Example Primary Tasks:**
- IMG-001: Informative alternate text for images
- SEM-020: Unique, descriptive page titles
- FRM-016: Clear form control purpose descriptions

**Associated Topics:**
- forms, content-design, navigation

**ARRM Integration:** 42 primary, 33 secondary, 10 contributor tasks

---

### `front-end-development/` - **Role 2**

**Primary Ownership:** Front-End Development

**Purpose:** HTML structure, JavaScript interactivity, CSS styling, ARIA implementation

**Why this role exists:** Technical implementation determines whether accessibility features work correctly

**Key Responsibilities:**
- Semantic HTML markup
- Keyboard navigation and focus management
- ARIA implementation and verification
- Progressive enhancement

**Example Primary Tasks:**
- SEM-008: Semantic HTML usage
- INP-004: Keyboard accessibility for all elements
- FRM-002: Programmatic form label association

**Associated Topics:**
- forms, keyboard, svg, tables, touch-pointer, tooltips

**ARRM Integration:** 97 primary, 31 secondary, 5 contributor tasks

---

### `visual-design/` - **Role 3**

**Primary Ownership:** Visual Design

**Purpose:** Color contrast, visual hierarchy, layout and spacing

**Why this role exists:** Visual presentation affects accessibility for many disability groups

**Key Responsibilities:**
- Color contrast verification (light/dark mode)
- Focus indicator design
- Visual hierarchy and information architecture
- Motion and animation considerations

**Example Primary Tasks:**
- CSS-001: Sufficient contrast ratios
- IMG-018: Charts graphs without color alone
- INP-017: Visible focus indicators

**Associated Topics:**
- color-contrast, light-dark-mode, charts-graphs

**ARRM Integration:** 30 primary, 29 secondary, 7 contributor tasks

---

### `user-experience-design/` - **Role 4**

**Primary Ownership:** User Experience Design

**Purpose:** User research, interaction patterns, accessibility feature planning

**Why this role exists:** UX determines how accessible the user journey truly is

**Key Responsibilities:**
- User research and testing coordination
- Accessibility feature planning and prioritization
- Cross-functional collaboration with disabled users
- Task flow analysis for accessibility impact

**Example Tasks:** (ARRM assigns these to other roles)
- UX Design: Strategy and planning
- Front-End Development: Implementation validation
- Visual Design: Accessibility testing coordination

**ARRM Integration:** 0 primary, 0 secondary, 0 contributor tasks (assigned elsewhere)

---

### `business-analysis/` - **Role 5**

**Primary Ownership:** Business Analysis

**Purpose:** Requirements analysis, accessibility standards review, compliance planning

**Why this role exists:** Accessibility intersects with legal, security, and business requirements

**Key Responsibilities:**
- Regulatory and compliance requirements
- Legal risk assessment for accessibility changes
- Security implications of accessibility features
- Business impact analysis of accessibility decisions

**Example Primary Tasks:**
- FORM-036: Error prevention for legal/financial forms
- Research on accessibility regulations and requirements
- Planning for accessibility feature implementation

**ARRM Integration:** 1 primary, 5 secondary, 3 contributor tasks

---

### `testing/` - **Role 6**

**Primary Ownership:** Testing

**Purpose:** Test design, accessibility validation, evidence collection

**Why this role exists:** Technical requirements need verification against real assistive technologies

**Key Responsibilities:**
- Keyboard-only navigation testing
- Screen reader compatibility verification
- Focus and ARIA testing
- Cross-browser and cross-device validation
- Manual accessibility testing coordination

**ARRM Integration:** 0 primary, 0 secondary, 0 contributor tasks (assigned elsewhere)

## Role Relationships

### Primary Roles
These roles **own decision-making authority** for their assigned tasks:
- Can make binding decisions
- Must justify their choices
- Are accountable for outcomes

### Secondary Roles  
These roles **have veto power** and must be consulted:
- Can challenge Primary role decisions
- Provide essential expertise and context
- Ensure multiple perspectives are considered

### Contributor Roles
These roles **provide technical implementation**:
- Must implement Primary/Secondary role decisions
- Validate that solutions work correctly
- Provide technical feasibility analysis

## AI Workflow Integration

The **Planner AI workflow** uses this structure to:

1. **Identify relevant roles** for any accessibility finding
2. **Generate role-specific questions** for ambiguous cases
3. **Recommend engagement** according to role ownership
4. **Document conflicts** and resolve uncertainty
5. **Escalate appropriately** when needed

Example: Image with missing alt text
- **Primary:** Content Authoring (owns the decision)
- **Secondary:** User Experience Design (reviews impact)
- **Contributors:** Front-End Development (implements solution)

## Evidence and Validation

The role system ensures:

### ✅ **Complete Evidence Trail**
- Each finding maps to specific ARRM tasks
- Role ownership is clearly documented
- Questions are targeted to appropriate experts
- Evidence is preserved for human interpretation

### ✅ **Accountability Maintained**
- AI assists but never replaces professional roles
- Primary roles own final decisions
- Secondary roles can challenge decisions
- All changes have clear ownership

### ✅ **Transparency**
- Conflicts between roles remain visible
- Decision rationale is documented
- Escalation paths are clear
- Evidence gaps are identified

## Usage Guidelines

### For AI Developers
1. **Always identify roles** before making decisions
2. **Generate role-specific questions** for judgement calls
3. **Respect role ownership** - don't override without consent
4. **Document conflicts** and uncertainties
5. **Recommend appropriate escalation** paths

### For Human Professionals
1. **Review role assignments** for your area of expertise
2. **Ensure your concerns** are represented in the system
3. **Challenge Primary role decisions** when appropriate
4. **Provide evidence** to support Secondary or Contributor roles
5. **Escalate when necessary** to appropriate levels

## Next Steps

1. **Familiarize yourself** with the specific tasks in your role
2. **Understand the integration** with other roles
3. **Implement the role-aware workflow** in your development process
4. **Train team members** on the role system
5. **Iterate and improve** based on real-world usage

## Files Generated

This directory is **auto-generated** from:
- `data/arrm/arrm-all-tasks.csv` (ARRM source data)
- Generated by: `scripts/generate-role-indexes.js`

Do not manually edit the generated CSV files. All changes should be made to the ARRM source data, then regenerated.

## References

- [W3C WAI ARRM Project](https://github.com/w3c/wai-arrm)
- [Accessibility Skills Repository](https://github.com/mgifford/accessibility-skills)
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/) - Standards referenced by ARRM tasks