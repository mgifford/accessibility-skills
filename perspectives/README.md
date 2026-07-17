# Accessibility Perspectives

## What This Directory Contains

Compact, agent-actionable definitions for seven accessibility perspectives. Each perspective represents a lens through which to examine the likely consequences of a design decision, code change, or content choice for people with specific access needs.

**These definitions are inputs to a future Perspective Auditor workflow.** They are not the auditor itself. The Perspective Auditor will apply these definitions; today, humans use them as structured checklists.

## Important Limitations

- **Perspectives do not simulate lived experience.** No AI or checklist can reproduce what it is like to use assistive technology daily. These definitions identify *probable* barriers based on published guidance; they do not replace testing with real users.
- **People within a disability category have diverse needs.** A screen reader user who is also a developer has different expectations from a screen reader user who is a casual reader. Do not treat any perspective as a monolith.
- **Perspectives identify probable barriers, not confirmed ones.** A finding flagged by a perspective requires evidence to confirm it is a real barrier in this specific context.

## When to Trigger a Perspective

Apply a perspective when a finding, proposal, or design decision involves:

| Trigger | Relevant Perspectives |
|---------|----------------------|
| Dynamic content updates (status, alerts, toasts) | screen-reader-semantic |
| Interactive elements (buttons, forms, custom widgets) | keyboard-motor, screen-reader-semantic |
| Text or images with small font size or thin strokes | magnification-reflow |
| Long-form content, instructions, or error messages | cognitive-neurodivergent |
| Audio or video content | auditory-access |
| Colour-dependent information or low-contrast UI | environmental-contrast |
| Animation, transitions, or parallax | vestibular-motion |
| Form validation and error recovery | cognitive-neurodivergent, keyboard-motor |
| Navigation and orientation | keyboard-motor, screen-reader-semantic, cognitive-neurodivergent |
| Media controls and player UI | keyboard-motor, auditory-access |

## Barrier Evidence Levels

Each perspective uses three evidence levels:

- **Probable barrier:** AI analysis or heuristic review suggests a likely issue. Requires confirmation.
- **Confirmed barrier:** Reproducible with real assistive technology or manual testing. Ready for a decision state.
- **Hypothesis requiring research:** Cannot be confirmed without input from disabled users. Escalate to `user-research-needed`.

## How Perspectives Connect to the Workflow

1. **Planner** maps a finding to ARRM tasks and identifies relevant perspectives.
2. **Critic** checks whether the identified perspectives were adequately considered.
3. **Perspective Auditor** (future) applies the perspective definition to examine impacts.
4. **Bug Reporter** preserves perspective references in structured findings.

Perspectives do not assign ARRM ownership. They inform the conversation; they do not make decisions.

## Sources

These definitions synthesise guidance from:

- [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG 2.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/)
- [WebAIM](https://webaim.org/)
- [Deque University](https://dequeuniversity.com/)
- [GOV.UK Accessibility Requirements](https://www.gov.uk/service-manual/helping-people-to-use-your-service/accessibility)
- [BBC Accessibility Guidelines](https://www.bbc.co.uk/accessibility/forproducts/guides/)
- [Able Player documentation](https://ableplayer.github.io/ableplayer/)
- [Inclusive Design Research Centre](https://idrc.ocadu.ca/)
- [Autistic Self Advocacy Network](https://autisticadvocacy.org/)
- [W3C WAI Perspectives](https://www.w3.org/WAI/people-use-web/)

Do not treat these definitions as exhaustive. Consult the linked sources for deeper guidance.

## Creating or Updating Perspectives

When updating a perspective:

1. Keep the file compact and agent-actionable.
2. Cite sources already recognised by the repository (see `TRUSTED_SOURCES.yaml`).
3. Distinguish probable barriers from confirmed barriers.
4. Do not claim AI can simulate lived experience.
5. Do not describe all users within a category as having identical needs.
6. Run `npm run validate:evals` to check evaluation fixtures still pass.
