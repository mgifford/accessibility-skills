# Content Authoring

## What This Role Does

Content authoring ensures that text, media, structure, and language are accessible to all users. This role owns alt text, headings, transcripts, captions, plain language, and the semantic structure that makes content navigable and understandable.

## Also Known As

- Content designer
- Content strategist
- Technical writer
- Editor
- Information architect
- Communications specialist

Content work touches nearly every accessibility success criterion. The content author determines what meaning is conveyed, while developers determine how it is coded.

## Perspective

### What This Role Sees

- Whether images have meaningful alt text
- Whether headings form a logical hierarchy
- Whether link text makes sense out of context
- Whether transcripts and captions exist for media
- Whether plain language is used throughout
- Whether error messages explain what went wrong and how to fix it

### What This Role Often Misses

- Whether the HTML implementation matches the content intent (ask Front-End Development)
- Whether the interaction pattern is keyboard-accessible (ask UX Design)
- Whether color contrast meets minimums (ask Visual Design)
- Whether the page actually works with assistive technology (ask Testing)

### When to Bring This Role In

- At the start of any project that involves text, images, or media
- When writing alt text, error messages, or form instructions
- When headings, page titles, or link text need review
- When media needs transcripts, captions, or audio descriptions
- During content migration or CMS configuration

## AI Persona Prompt

Use this prompt to get an AI agent to evaluate a website from this perspective:

```
You are a content accessibility specialist reviewing this website.
Your focus is on text clarity, structure, media alternatives, and language.

Review the page and identify:
1. Missing or inadequate alt text on images
2. Heading hierarchy issues (skipped levels, missing h1, non-descriptive headings)
3. Ambiguous link text ("click here", "read more", "learn more")
4. Missing transcripts, captions, or audio descriptions for media
5. Complex language that should be simplified
6. Error messages that don't explain the problem or the fix
7. Missing form labels or instructions
8. Inconsistent terminology

For each issue, explain what a user with a disability would experience
and reference the relevant WCAG success criterion.
```

## ARRM Task Summary

This is the largest role in the ARRM data with **42 primary ownership** tasks, reflecting the breadth of content's responsibility for accessibility.

### Primary Ownership (42)

Key areas include:
- **Images** — Alt text, decorative images, complex images (IMG-001 through IMG-017)
- **Structure** — Headings, page titles, semantic organization (SEM-007 through SEM-023)
- **Forms** — Labels, instructions, error messages (FRM-006, FRM-016, FRM-030, FRM-033)
- **Navigation** — Link text, consistency (NAV-018 through NAV-028)
- **Media** — Transcripts, captions, audio descriptions, sign language (ANM-001 through ANM-028)
- **Tables** — Descriptions, structure (TAB-015)
- **Language** — Plain language, locale, glossary (SCT-019 through SCT-024)

### Secondary Ownership (33)

Supports tasks primarily owned by Front-End Development and UX Design, including semantic markup, decorative elements, and multimedia alternatives.

### Contributor (10)

Advises on visual-only information conveyance (color, shape, size, location) and dynamic content updates.

See [task-summary.md](./generated/task-summary.md) for full details.

## Collaboration Points

| Role | What to share | What to ask |
|------|---------------|-------------|
| Business Analysis | Plain language requirements | "Is this writing clear enough?" |
| Front-End Dev | HTML/CSS implementation | "Is this alt text properly coded?" |
| Testing | Content review results | "Does this content work with a screen reader?" |
| UX Design | Interaction copy and labels | "Does this error message help the user?" |
| Visual Design | Visual content alternatives | "Is there meaning in the design that needs text?" |

## Key WCAG Criteria

- **1.1.1** — Non-text content (A)
- **1.2.1** — Audio-only and video-only alternatives (A)
- **1.2.2** — Captions (A)
- **1.2.5** — Audio description (AA)
- **2.4.2** — Page titled (A)
- **2.4.4** — Link purpose in context (A)
- **2.4.6** — Headings and labels (AA)
- **3.1.1** — Language of page (A)
- **3.1.5** — Reading level (AAA)
