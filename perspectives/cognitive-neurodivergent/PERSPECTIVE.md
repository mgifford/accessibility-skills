# Cognitive and Neurodivergent Access Perspective

## Scope

Examine how content, navigation, and interactions affect people with cognitive disabilities, learning differences, attention differences, and memory impairments. This includes dyslexia, ADHD, autism spectrum, intellectual disabilities, and acquired brain injury.

## Common Barriers

- Dense text with no headings, lists, or visual breaks
- Inconsistent navigation or interaction patterns across pages
- Time-limited interactions with no way to extend or disable
- Complex language, jargon, or unexplained abbreviations
- Missing or unclear error messages that do not explain how to fix the problem
- Multiple simultaneous tasks or information streams
- Auto-advancing content that cannot be paused
- Inconsistent labelling of identical functions across the interface
- CAPTCHAs or multi-step verification without accessible alternatives

## Relevant Topic Skills

- `content-design` — plain language, heading hierarchy, reading order
- `plain-language` — reading level, sentence structure, abbreviation handling
- `forms` — error identification, instructions, input purpose
- `aria-live-regions` — announcement frequency and politeness
- `navigation` — consistent navigation, wayfinding
- `user-personalization` — user preferences, reduced motion, content customisation

## Questions to Ask

1. Is content written in plain language appropriate for the audience?
2. Are headings, lists, and whitespace used to break up dense content?
3. Are instructions and labels consistent across similar controls?
4. Do error messages clearly identify the problem and explain how to fix it?
5. Is there sufficient time to complete tasks, or can time limits be extended?
6. Are abbreviations and jargon expanded on first use or linked to definitions?
7. Is navigation consistent across pages and predictable in behaviour?
8. Does auto-playing or auto-advancing content have a way to pause or stop?

## Evidence That Can Be Gathered Automatically

- Missing page language declaration (axe-core `html-lang`)
- Missing document title (axe-core `document-title`)
- Inconsistent link text patterns
- Forms without autocomplete attributes (axe-core `autocomplete-valid`)
- Missing `label` or `aria-label` on form controls

## Evidence That Requires Manual Testing

- Reading level analysis of actual content
- Verification that error messages are clear and actionable
- Confirmation that navigation patterns are consistent across the application
- Testing that time limits can be extended or disabled
- Verification that content is chunked and structured for scanning

## When Direct Research with Disabled Users Is Needed

- When the interface involves complex workflows (multi-step forms, dashboards) and it is unclear whether cognitive load is manageable
- When the content is technical or domain-specific and reading level may be a barrier
- When timing constraints exist and it is uncertain whether they are flexible enough
- When the interface uses non-standard interaction patterns that may confuse users with learning differences

## Common False Assumptions

- "Clear content is accessible content." Clear writing helps, but structural accessibility (headings, landmarks, consistent navigation) is equally important.
- "Cognitive accessibility is only about reading level." It also encompasses predictability, error recovery, memory load, attention demands, and sensory overwhelm.
- "Auto-advancing carousels are fine if there is a pause button." The pause button must be obvious, keyboard-accessible, and persistent.

## Limitations of AI Analysis

- AI can estimate reading level but cannot judge whether content is genuinely understandable for a specific audience.
- AI can detect structural issues (missing headings, inconsistent labels) but cannot assess cognitive load in context.
- AI cannot determine whether timing constraints are reasonable for users with cognitive disabilities.
- AI cannot predict how a user with ADHD or memory impairments will experience a multi-step workflow.

## Escalation Triggers

- Complex multi-step workflows where cognitive load is uncertain
- Time-limited interactions that may exclude users who need more time
- Content with domain-specific language and no glossary or definitions
- Interface with many simultaneous interactive elements or notifications
- Finding that requires understanding user intent beyond what code reveals

## ARRM Task Relevance

This perspective informs findings related to:

- SCT tasks (content structure, reading order)
- INP tasks (input assistance, error identification)
- UIE tasks (user interface events, timing)
- NAV tasks (navigation consistency)

This perspective does not assign ownership. ARRM role assignments determine ownership.
