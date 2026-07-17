# Accessibility Roles

Different perspectives create better accessibility outcomes. This directory defines role-based lenses for evaluating, implementing, and critiquing web accessibility.

Each role brings distinct responsibilities, synonyms, and blind spots. When these perspectives collaborate — rather than work in isolation — they catch barriers that no single role would find alone.

## Why Roles Matter for Accessibility

Accessibility is not a single person's job. The [W3C WAI ARRM](https://www.w3.org/WAI/planning/arrm/) (Accessibility Roles and Responsibilities Mapping) documents how dozens of tasks across the development lifecycle require accessibility attention. No one role owns it all.

When a content author writes alt text without consulting the designer, the meaning may not match the visual intent. When a developer builds a form without the content author, error messages may be technically correct but incomprehensible. When procurement evaluates a vendor without input from operations, accessibility metrics may be missing entirely.

**Best accessibility outcomes happen when multiple roles examine the same problem.**

## Available Roles

| Role | Also known as | Primary focus |
|------|--------------|---------------|
| [Business Analysis](./business-analysis/) | Business analyst, Data analyst, Digital performance analyst | Requirements, metrics, evaluation |
| [Content Authoring](./content-authoring/) | Content designer, Content strategist, Technical writer | Text, media, structure, plain language |
| [Front-End Development](./front-end-development/) | Front-end engineer, Full-stack developer, Accessibility specialist | HTML, CSS, JavaScript, ARIA |
| [Testing](./testing/) | QA engineer, Accessibility tester, Quality assurance | Verification, validation, assistive technology |
| [User Experience Design](./user-experience-design/) | UX designer, Interaction designer, User researcher, Product designer | Interaction patterns, research, information architecture |
| [Visual Design](./visual-design/) | Visual designer, UI designer, Graphic designer | Layout, color, typography, iconography |

## How to Use These Roles

### For AI Agent Personas

Each role includes a **persona prompt** you can use when asking an AI to review, critique, or test a website from that perspective. This is useful for:

- **Accessibility audits** — Run the same page through multiple role personas to catch different categories of issues
- **Design reviews** — Get perspective-specific feedback before implementation
- **Retrospectives** — Understand why a particular accessibility decision was made and who it affects

Example usage:

> "Review this page as a [Content Author](./content-authoring/#ai-persona-prompt). What accessibility issues would you flag?"

### For Human Collaboration

Each role includes a **perspective** section describing what that role sees, what they often miss, and when to bring them into the conversation. Use this to:

- **Identify coverage gaps** — Which roles have not yet reviewed this change?
- **Improve handoffs** — What does each role need from the others?
- **Resolve conflicts** — When roles disagree on an approach, the perspective section explains each side's reasoning

### For Cross-Role Problem Solving

The most complex accessibility challenges — CAPTCHA, time limits, error recovery, keyboard traps — sit at the intersection of multiple roles. Each role's README includes guidance on when to escalate and which roles to involve.

## Shared Data

Each role directory contains a `generated/` folder with task mappings derived from the [W3C WAI ARRM data](https://github.com/w3c/wai-arrm/blob/draft/_data/arrm/arrm-all-tasks.csv). These CSV files and summaries are generated automatically — do not edit them manually.

The task data includes:
- **Primary ownership** — Tasks this role leads
- **Secondary ownership** — Tasks this role supports
- **Contributor** — Tasks this role advises on

## How Perspectives Combine

```
Business Analysis     "Does this meet the requirements? What does the data show?"
         |
Content Authoring     "Is this clear? Can everyone understand it?"
         |
  Visual Design       "Does this work visually for all users?"
         |
   UX Design          "Does the interaction work for everyone?"
         |
Front-End Dev         "Is this implemented correctly in code?"
         |
     Testing          "Does this actually work with real tools?"
```

When all six perspectives align, the result is robust accessibility. When any perspective is missing, a category of barriers goes undetected.

## Related Resources

- [W3C WAI ARRM](https://www.w3.org/WAI/planning/arrm/) — Accessibility Roles and Responsibilities Mapping
- [CivicActions: Add accessibility to every role](https://accessibility.civicactions.com/playbook/roles)
- [Digital.gov: Accessibility for teams](https://digital.gov/guides/accessibility-for-teams/)
