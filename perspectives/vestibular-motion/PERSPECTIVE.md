# Vestibular and Motion Access Perspective

## Scope

Examine how animation, movement, transitions, and visual motion affect people with vestibular disorders, motion sensitivity, migraine, seizure disorders, or attention differences. This perspective covers `prefers-reduced-motion`, animation controls, and seizure risks.

## Common Barriers

- Auto-playing animations that cannot be paused or reduced
- Parallax scrolling that causes disorientation or nausea
- Flashing content exceeding 3 flashes per second (seizure risk)
- Video with rapid scene changes or strobing effects
- Motion-based interactions with no static alternative
- `prefers-reduced-motion` media query not implemented
- Loading spinners or progress indicators that use continuous rotation
- Full-screen transitions or page animations that obscure content during change

## Relevant Topic Skills

- `user-personalization` — `prefers-reduced-motion`, user motion preferences
- `audio-video` — video autoplay, flashing content
- `progressive-enhancement` — graceful degradation of motion effects
- `content-design` — content that does not depend on motion for meaning
- `touch-pointer` — gesture alternatives

## Questions to Ask

1. Does the interface respect `prefers-reduced-motion: reduce`?
2. Can all auto-playing animations be paused, stopped, or hidden?
3. Does any content flash more than 3 times per second?
4. Are motion-based interactions (swipe, drag, parallax) optional rather than required?
5. Do page transitions or loading animations have reduced-motion alternatives?
6. Is information conveyed by motion alone, or is there a static alternative?
7. Does video content avoid rapid scene changes without warning?

## Evidence That Can Be Gathered Automatically

- Animation detection via CSS analysis for `animation` and `transition` properties
- Missing `prefers-reduced-motion` media query
- `autoplay` attribute on `<video>` elements
- Flashing content detection (limited; axe-core `scrollable-region-focusable` may flag some cases)

## Evidence That Requires Manual Testing

- Verification that `prefers-reduced-motion: reduce` actually disables or simplifies animations
- Confirmation that no content flashes more than 3 times per second
- Testing that motion-based interactions have keyboard or single-pointer alternatives
- Verification that parallax effects are optional and do not cause disorientation

## When Direct Research with Disabled Users Is Needed

- When the interface uses parallax, scroll-triggered animations, or 3D transforms extensively
- When motion is used to convey meaning (e.g., a progress animation that indicates completion state)
- When the content includes video with potentially triggering visual patterns
- When it is uncertain whether `prefers-reduced-motion` behaviour is sufficient for vestibular-sensitive users

## Common False Assumptions

- "Adding `prefers-reduced-motion` is enough." The reduced state must actually remove or substantially reduce the motion, not just slow it slightly.
- "Only people with epilepsy are affected by flashing." People with vestibular disorders, migraine, and ADHD can be significantly affected by unwanted motion.
- "Parallax is fine if it is subtle." Even subtle parallax can cause disorientation for vestibular-sensitive users. The key is that it must be optional.

## Limitations of AI Analysis

- AI can detect the presence of `prefers-reduced-motion` media queries but cannot verify that the reduced state is actually comfortable for sensitive users.
- AI can detect `autoplay` but cannot assess the visual content of video for strobing or rapid scene changes.
- AI cannot determine whether motion-based meaning is adequately conveyed by a static alternative.

## Escalation Triggers

- Extensive use of parallax, scroll-triggered animation, or 3D transforms
- Video content with rapid scene changes or strobing effects
- Motion used as the sole indicator of state change
- Interface where it is unclear whether the reduced-motion alternative is sufficient

## ARRM Task Relevance

This perspective informs findings related to:

- ANI tasks (animation and motion)
- UIE tasks (user interface events, timing)
- VIS tasks (visual presentation)
- MDI tasks (media interaction)

This perspective does not assign ownership. ARRM role assignments determine ownership.
