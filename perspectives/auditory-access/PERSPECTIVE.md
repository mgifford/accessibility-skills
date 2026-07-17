# Auditory Access Perspective

## Scope

Examine how audio and video content, notifications, and sound-based cues affect people who are Deaf, hard of hearing, DeafBlind, or who have auditory processing differences.

## Common Barriers

- Video without synchronised captions
- Audio-only content without transcripts
- Video without audio descriptions for visual-only information
- Auto-playing audio that cannot be stopped or muted
- Sound-only alerts or notifications with no visual alternative
- Captions that are auto-generated without human review
- Transcripts that omit non-speech audio (music, sound effects, speaker changes)
- Media players without caption controls or transcript access
- Live audio content without CART or live captions

## Relevant Topic Skills

- `audio-video` — captions, transcripts, audio descriptions, media player accessibility
- `content-design` — clear labelling, content structure
- `aria-live-regions` — visual alternatives to auditory alerts
- `navigation` — media navigation, controls

## Questions to Ask

1. Does every video with audio have synchronised captions?
2. Does every audio-only resource have a transcript?
3. Are auto-generated captions reviewed and corrected by a human?
4. Do captions include speaker identification and relevant non-speech audio?
5. Is there a visual alternative to every auditory alert or notification?
6. Can media playback be controlled by keyboard?
7. Are transcripts directly linkable and searchable?
8. Does the media player support caption customisation (size, colour, background)?

## Evidence That Can Be Gathered Automatically

- Missing `<track kind="captions">` on `<video>` elements
- Missing transcript links for `<audio>` elements
- Auto-playing media without `muted` attribute
- Missing `controls` attribute on media elements

## Evidence That Requires Manual Testing

- Caption accuracy and completeness (automated tools cannot judge transcription quality)
- Whether non-speech audio (music, sound effects) is included in captions
- Whether speaker identification is present when speakers are not visually apparent
- Whether transcripts include descriptions of important visual content

## When Direct Research with Disabled Users Is Needed

- When caption quality requirements are ambiguous (e.g., how much non-speech audio to include)
- When the content is complex (technical presentations, musical performances) and it is uncertain whether captions or transcripts adequately convey meaning
- When live content needs captioning and it is unclear what is technically feasible

## Common False Assumptions

- "Auto-generated captions are good enough." Unreviewed auto-captions frequently mishear technical terms, proper nouns, and accented speech. They are at best a starting point.
- "Captions are only for Deaf users." Captions also benefit people in noisy environments, people with auditory processing differences, and people learning the language.
- "Transcripts are just captions without timing." Transcripts should include speaker identification, non-speech audio descriptions, and descriptions of relevant visual content.

## Limitations of AI Analysis

- AI can detect missing caption tracks but cannot judge caption quality or accuracy.
- AI cannot determine whether non-speech audio is adequately described in captions.
- AI cannot assess whether transcripts are complete or merely automated summaries.
- AI cannot evaluate whether audio descriptions convey the same meaning as visual content.

## Escalation Triggers

- Live content that needs real-time captioning
- Complex audio content (multiple speakers, technical terminology, musical elements)
- Content where the visual component is essential and audio descriptions may be insufficient
- Finding that auto-generated captions contain errors that change meaning

## ARRM Task Relevance

This perspective informs findings related to:

- AUD tasks (audio content, captions, transcripts)
- VID tasks (video content, audio descriptions)
- MDI tasks (media interaction, player controls)

This perspective does not assign ownership. ARRM role assignments determine ownership.
