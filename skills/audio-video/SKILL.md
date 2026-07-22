---
name: audio-video
description: >
  Load this skill whenever the project contains audio or video content,
  media players, podcasts, video embeds, or any <audio>/<video> elements.
  Under no circumstances publish audio or video without captions, transcripts,
  and audio descriptions where required. Absolutely always apply WCAG 1.2
  criteria for time-based media.
---

# Audio/Video Accessibility Skill

> **Canonical source**: `examples/AUDIO_VIDEO_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when implementing or reviewing any audio or video content.
**Only load this skill if the project contains audio or video.**

---

## Core Mandate

Accessible media provides equivalent access to speech, sound, visual
information, and playback controls. The required alternatives depend on
whether the media is audio-only, video-only, synchronized, prerecorded, or live.

Plan captions, description, transcripts, and sign-language access **before
production begins**. Use qualified human review — unreviewed automatic output
is not an accessible final deliverable. Keep alternatives easy to find next
to the media, and preserve them when media is embedded, translated, archived,
or moved to another platform.

---

## Severity Scale (this skill)

| Level | Meaning |
| --- | --- |
| **Critical** | Media content completely inaccessible to a disability group |
| **Serious** | Access significantly impaired; workaround unreasonable to expect |
| **Moderate** | Access degraded but partially available |
| **Minor** | Best-practice gap; marginal impact on access |

---

## What the Media Requires (WCAG Level Matrix)

The time-based media criteria are cumulative — Level AA includes applicable
Level A requirements.

| Media type | Level A | Level AA | Level AAA / additional practice |
|---|---|---|---|
| Prerecorded audio-only | Transcript (alternative for time-based media) | — | Enhanced presentation |
| Prerecorded video-only | Alternative or equivalent audio track | — | Media alternative (1.2.8) |
| Prerecorded synchronized audio+video | Captions; audio description OR full media alternative | Audio description | Sign-language, extended audio description, media alternative |
| Live synchronized audio+video | No caption criterion | Live captions | Additional language/description services |
| Live audio-only | No criterion | No criterion | Equivalent live alternative (1.2.9) |

**No meaningful audio/visual information:** video with no meaningful audio
(silence, decorative music) doesn't need captions. Audio with no speech can
still need a transcript if meaningful sound communicates information.
Decorative video conveys no information, but continuous motion can still
require pause controls. If all important visual information is already
spoken, no additional audio description is needed. Document these decisions
per-file rather than assuming every video has identical requirements — and do
not label primary media "an alternative for text" merely to avoid captions/
description/transcript.

---

## Critical: Never Autoplay Audible Media

```html
<!-- Never do this -->
<video src="intro.mp4" autoplay></video>

<!-- Muted autoplay still needs reduced-motion handling and a pause control -->
<video src="background.mp4" autoplay muted loop playsinline
       controls aria-label="Background animation — muted by default"></video>
@media (prefers-reduced-motion: reduce) {
  video[autoplay] { display: none; }
}
```

WCAG 1.4.2 does not literally ban every autoplay instance — it requires a
mechanism to pause/stop audio playing automatically for more than 3 seconds,
or independent volume control. **This project's stricter rule: do not
autoplay audible media at all**, to avoid interfering with screen reader
speech. If sound autoplays for any reason, the stop/pause/mute control must
be the first keyboard stop on the page.

**Muted autoplay does not resolve every issue:** meaningful audio is
unavailable while muted; moving content can distract or cause physical
symptoms; motion for 5+ seconds alongside other content can need pause/stop/
hide (WCAG 2.2.2); users who request reduced motion should not get automatic
decorative motion regardless of a caption track existing.

---

## Critical: Captions on Pre-recorded Video with Audio

```html
<video controls preload="metadata" playsinline poster="training-poster.jpg">
  <source src="training.mp4" type="video/mp4">
  <track kind="captions" src="training.en.vtt" srclang="en" label="English captions" default>
  <track kind="subtitles" src="training.fr.vtt" srclang="fr" label="Sous-titres français">
  <p>Your browser cannot play this video. <a href="training.mp4">Download the video</a>.</p>
</video>
```

Use `kind="captions"` for tracks including dialogue AND meaningful non-speech
audio; use `kind="subtitles"` for translated dialogue only — subtitles
containing only dialogue are **not** a replacement for captions in the
original language. Use only one `default` track per kind. Serve WebVTT as
UTF-8 with the correct `text/vtt` media type.

**Caption content must include:** complete spoken dialogue/narration; speaker
identification when not otherwise clear; meaningful sound effects/music cues
(`[door slams]`); correct punctuation/capitalization preserving meaning;
synchronized timing; readable cue duration/line breaks; placement avoiding
important visual content. Do not remove words, simplify technical language,
or censor in a way that changes meaning.

**Never publish auto-generated captions without human review** — a qualified
person must review the complete file against the audio and correct
substitutions/omissions/invented words, names/technical terms/numbers,
missing negation, speaker changes, punctuation, and synchronization.
Unreviewed auto-captions are at best **Serious**.

**Open vs. closed captions:** prefer closed captions (toggleable,
customizable) when the platform supports them reliably. Open captions
(permanently rendered) are a recognized WCAG technique and acceptable when
closed captions aren't available — don't categorically reject them, but note
users can't turn them off or resize them independently.

---

## Critical: Transcript for Audio-Only Content

```html
<figure>
  <figcaption>Episode 12: Testing with screen magnification, 34 minutes</figcaption>
  <audio controls preload="metadata" aria-label="Episode 12: Testing with screen magnification">
    <source src="episode-12.mp3" type="audio/mpeg">
    <p>Your browser cannot play this audio. <a href="episode-12.mp3">Download the episode</a>.</p>
  </audio>
</figure>
<p><a href="episode-12-transcript.html">Read the Episode 12 transcript</a>.</p>
```

**Transcript content** (in the same sequence as the media): title/metadata;
speaker names; all dialogue and narration; meaningful sound/music
information; important on-screen text; for a *descriptive* transcript,
visual actions/expressions/demonstrations/charts/scene changes; equivalent
instructions/links for any interaction in the media.

Publish as accessible HTML with a clearly named link immediately before/after
the player — **not only as a download or inaccessible PDF/image**, and never
only inside `aria-label`, a tooltip, or a visually-hidden element. A stable
anchor URL (`#transcript-ep12`) makes it directly shareable and discoverable
by search engines; collapsing in `<details>` for visual space is fine as long
as the heading/anchor stay in the DOM. Keep transcript corrections
synchronized with caption and media revisions.

**Interactive transcripts** (highlighting current passage, seek-by-timestamp)
are enhancements, not substitutes for a complete linear transcript — use
buttons for seek actions, give each an understandable time/topic, don't move
keyboard focus as playback advances, don't force unpausable auto-scroll,
respect reduced-motion, and preserve reading/copying when JS is unavailable.

---

## Serious: Audio Descriptions for Pre-recorded Video

At Level A, WCAG 1.2.3 permits either audio description OR a complete media
alternative. **At Level AA, WCAG 1.2.5 requires audio description** for
prerecorded video content — a Level A transcript choice does not remove this
AA requirement. If the main audio already communicates all important visual
information, no additional description is necessary.

```html
<track kind="descriptions" src="training.descriptions.en.vtt" srclang="en" label="English descriptions">
```

This `<track kind="descriptions">` technique is advisory in current WCAG
techniques and depends on browser/player/AT support — **do not rely on it
without testing**; provide a supported selectable track or described version
when the player can't present descriptions audibly.

**Plan description during production** — integrated description (speakers
naturally stating names, reading on-screen text, explaining charts) is often
clearest and can reduce separately-recorded description needed. Description
should be objective, concise, timed around important dialogue, written by
people with appropriate expertise, and reviewed with blind/low-vision users.
Extended audio description (1.2.7, pausing video for more time) is **Level
AAA** — needed only when pauses in the main audio are insufficient.

---

## Critical: Accessible Media Player

**Do not designate one player library as universally accessible** — evaluate
and test the specific version and configuration against the requirements
below; pin dependency versions and review updates.

Start with native `<audio controls>`/`<video controls>` when they provide
what's needed — native controls reduce custom code but vary by browser; test
rather than assume sufficiency. **A row of visually styled custom buttons is
not an accessible player** unless the complete behavior, state, timing,
captions, description, seeking, and full-screen interaction are implemented
and tested.

**Controls and state:** play/pause, stop, elapsed time/duration, seek,
volume/mute, caption/language selection, audio-description selection,
playback speed, chapters, full screen, picture-in-picture, transcript
display as applicable. Every control needs an accessible name/role/state/
value — a play button can change its name to "Pause" while playing; a
caption toggle can use `aria-pressed` when truly two-state; a timeline needs
name/min/max/current-value and a useful text value (elapsed time). **Do not
announce every `timeupdate` event through a live region.** Keep visible
labels in accessible names for speech input; don't communicate selected
tracks or muted state through color alone.

```html
<div class="media-controls" role="group" aria-label="Video controls">
  <button id="play-pause" aria-label="Play" type="button">…</button>
  <label for="seek" class="visually-hidden">Seek</label>
  <input type="range" id="seek" min="0" max="100" value="0" aria-label="Seek"
         aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-valuetext="0 seconds">
  <button id="captions-toggle" aria-label="Enable captions" aria-pressed="false" type="button">CC</button>
</div>
```

**Keyboard:** every control reachable in logical tab order; Enter/Space
operate buttons natively; arrow keys operate ranges and documented composite
widgets; focus never trapped in player or full-screen; focus stays visible
and unobscured by auto-hiding controls; entering/leaving full screen
preserves a logical focus location; controls don't disappear while they or
their descendants have focus. Single-character shortcuts must meet WCAG 2.1.4
(off/remap/scoped-to-focus) and must not intercept keys while typing in a field.

**Visual/touch:** text/icons meet contrast requirements; controls reflow at
400% zoom; touch targets meet WCAG 2.5.8; labels/icons remain understandable
in forced-colors mode; pointer hover is never required to reveal the only
path to controls; auto-hiding controls meet Content on Hover/Focus (1.4.13)
and never hide the focused control.

**Captions/description controls:** easy to find without starting playback;
current language and on/off state programmatically determinable; changing a
track doesn't unexpectedly reset playback; preferences persist when promised.

---

## Serious: Embedded and Third-Party Players

The content owner remains responsible for the experience delivered through
an embed.

```html
<iframe src="https://media.example.org/embed/accessibility-training"
        title="Video: Accessibility testing training" allowfullscreen></iframe>
<p><a href="accessibility-training-transcript.html">Read the descriptive transcript</a>.</p>
```

Check: the iframe has a concise, content-identifying title; keyboard users
can enter/operate/leave the player; controls have correct names/states/focus
indicators; captions are published, accurate, and selectable; audio
description is available; autoplay/ads/consent prompts/full-screen remain
accessible; transcript and described-version links remain available **outside**
the iframe; privacy/cookie overlays don't block media controls. Do not trust
a vendor's accessibility claim without testing the actual configured player
and current version.

---

## Moderate: Decorative Background Video

Avoid background video when a static image communicates the same design. If retained, it must:

* convey no information (keep `aria-hidden="true"` only if genuinely decorative)
* be muted with a static poster/fallback
* not autoplay when the user requests reduced motion
* have an always-available play/pause control
* meet flashing requirements

```html
<video id="background-video" muted loop playsinline preload="metadata"
       poster="background-still.jpg" aria-hidden="true">
  <source src="background-video.mp4" type="video/mp4">
</video>
<button type="button" id="background-video-toggle" aria-controls="background-video">
  Play background video
</button>
```

```js
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
reduceMotion.addEventListener('change', (event) => {
  if (event.matches) { backgroundVideo.pause(); updateBackgroundVideoButton(); }
});
if (!reduceMotion.matches) backgroundVideo.play().then(updateBackgroundVideoButton);
```

**CSS `animation-play-state` does not pause an HTML `<video>`** — control
playback through the media element API. Do not automatically restart motion
after a user changes preferences or manually pauses. If the video communicates
information, remove `aria-hidden="true"` and provide all applicable
alternatives — a decorative label does not make informative content decorative.

---

## Serious: Live Captions (WCAG 1.2.4 AA)

**Live synchronized media requires captions at Level AA — this is not
qualified by a general "technically feasible" exception.** WCAG 1.2.4 targets
live synchronized broadcasts; it isn't a blanket requirement to caption every
private two-way call, but hosts/content providers must still provide the
access their event and audience require.

Plan before the event: contract and schedule captioning services (CART);
give captioners names/terminology/scripts/slides/run-of-show materials; test
caption display in the actual player/platform; verify language and speaker
identification; provide a backup path for caption failure; ensure chat/polls/
controls are keyboard and screen-reader accessible; rehearse with
interpreters. Monitor caption quality throughout — a caption badge or vendor
setting is not proof attendees are receiving usable captions.

When publishing an archive afterward: correct live captions; add/revise
description; publish the transcript; remove inaccessible temporary chat/
polling artifacts; retest the recording as prerecorded media.

---

## Moderate: WCAG 1.4.2 Audio Control (Distinct from Autoplay)

Applies even when the user initiated playback: if audio continues playing
automatically for more than 3 seconds, provide a way to pause/stop it or
control its volume independently of system volume.

```html
<button type="button" id="mute-toggle" aria-label="Mute background audio" aria-pressed="false">…</button>
```

---

## Minor: Sign Language (WCAG 1.2.6 — Level AAA)

Not required for AA conformance, but the highest-quality accommodation for
Deaf sign-language-primary users — consider for high-priority content
(safety information, onboarding, key announcements). Sign language is not
universal — identify the specific language (ASL, BSL, LSQ, etc.). It's a
separate track/video, not a caption overlay — keep the signer's face/hands/
body/signing space visible with adequate resolution/contrast/lighting/frame
rate; synchronize with the program; keep captions from obscuring the signer;
let users select/resize/reposition where the player supports it; review with
Deaf sign-language users. Supplements rather than replaces captions.

---

## Metadata and Languages

Before the player, provide visible info to help users decide whether/how to
use the media: descriptive title, short purpose/summary, duration, spoken
and sign languages, caption availability/languages, audio-description/
transcript availability, content warnings, and a date/version indicating
staleness risk. Set page and language-of-parts markup correctly — caption/
description/media-alternative language normally matches the original; label
translated subtitles/transcripts accurately. Do not use flags as the only
language labels — name languages in text.

---

## Production Workflow

**Before recording:** classify the planned media type and WCAG requirements;
budget for captioning/description/transcripts/interpretation/QA; include
important visual info in the script where natural; avoid unnecessary
background audio/flashing visuals; choose a platform supporting required
tracks; identify terminology/names/pronunciation for captioners.

**During production:** record clean speech with adequate volume; state
important names/titles/URLs/chart conclusions aloud; leave pauses for
standard audio description; keep essential text visible long enough to
perceive; frame signers/demonstrations clearly; avoid placing visuals where
captions/controls will cover them.

**Before publication:** review captions against the final audio; review
transcript/description against the final edit; verify every language/track
label; test the final encoded media, not just production files; test
third-party embeds without an authenticated editor session; confirm
alternatives remain available if the player fails; record reviewer/date/
version/follow-up issues.

---

## Testing

* **Captions:** watch the complete media with captions enabled and audio
  available for comparison; verify every spoken word, names/numbers/technical
  terms/negation, speaker/sound identification, synchronization, cue
  order/line breaks/duration; confirm captions don't obscure visual content;
  test every language and full-screen presentation
* **Transcript/description:** read the transcript without playing the media
  and confirm equivalent meaning; confirm visual info is included when a
  descriptive transcript is required; listen to the described version
  without watching the screen; verify description doesn't cover important
  dialogue; include Deaf, hard-of-hearing, DeafBlind, blind, low-vision, and
  sign-language users in quality review
* **Keyboard/screen reader:** reach every control by keyboard; operate
  buttons/ranges/menus/captions/description/speed/full-screen; confirm
  names/roles/states/values; confirm focus stays visible and logical as
  controls appear/hide; enter/exit embedded and full-screen players without
  a trap; confirm progress updates aren't announced continuously
* **Visual/motion/touch:** 200%/400% zoom; narrow viewports, both
  orientations; forced-colors/high-contrast; enable reduced motion before
  page load and confirm autoplay motion is suppressed; touch-operable pause
  controls; target sizes; flashing-content analysis if media might approach the threshold
* **Live-event:** full rehearsal with caption/interpretation feeds; test
  attendee access without presenter privileges; simulate caption-service/
  network failure; verify support-contact availability during the event

**Automated checks** can detect missing accessible names on custom controls,
invalid ARIA, keyboard focus-order problems, missing/malformed `<track>`
attributes, WebVTT syntax errors, duplicate IDs, contrast issues, and
audible-autoplay configuration — cannot establish caption accuracy,
transcript equivalence, description quality, sign-language quality, or live
delivery quality. Manual content and interaction review is required.

---

## Common Failures

| Failure | Correction |
|---|---|
| Treating live captions as optional when technically difficult | Plan and provide captions for live synchronized media at AA — not qualified by feasibility |
| Publishing unreviewed automatic captions | Review and correct the complete caption file |
| Captioning only dialogue | Include meaningful non-speech audio and speaker identification |
| Rejecting all open captions | Evaluate as a valid technique when closed captions are unsupported |
| Hiding an audio-only transcript behind only a download link | Provide an easy-to-find accessible HTML transcript |
| Treating a transcript as a replacement for AA audio description | Provide audio description under 1.2.5 when visual info requires it |
| Classifying extended audio description as AA | It's Level AAA (1.2.7) |
| Depending only on `track kind="descriptions"` without testing | Test support; provide a supported described track or version |
| Recommending one player as universally accessible | Evaluate and test the selected version and configuration |
| Publishing decorative custom controls without complete behavior | Use native controls or implement and test the full player interface |
| Announcing every playback-time update via live region | Expose the timeline value without a continuous live region |
| Claiming WCAG 1.4.2 literally bans all audible autoplay | Apply the criterion accurately; adopt the stricter project rule separately |
| Assuming muted autoplay is automatically acceptable | Provide motion control and honor reduced-motion preferences |
| Pausing video with CSS `animation-play-state` | Use the media element API |
| Providing sign language without identifying the language | Use the language required by the audience and label it |
| Trusting a third-party accessibility statement without testing | Test the configured current player; keep alternatives outside the embed |

---

## Definition of Done Checklist

* [ ] Media classified as audio-only/video-only/synchronized/live/prerecorded; applicable A/AA alternatives documented
* [ ] No autoplaying audible media
* [ ] If video autoplays (muted), `prefers-reduced-motion` disables it; pause control always available
* [ ] WCAG 1.4.2: audio continuing 3+ seconds has accessible stop/pause/mute
* [ ] Synchronised captions on all pre-recorded video with audio
* [ ] Auto-generated captions reviewed and corrected by a human before publishing
* [ ] Text transcript for all audio-only content; discoverable HTML, not PDF/download-only
* [ ] Transcript directly linkable via stable anchor URL
* [ ] Audio descriptions for all pre-recorded video with important unspoken visuals (AA)
* [ ] Live synchronized media has a tested real-time caption service
* [ ] Media player evaluated/tested for this project — not assumed accessible from a library's reputation
* [ ] All media player controls keyboard operable with visible focus indicators
* [ ] Play/pause/volume/captions state announced correctly; no continuous `timeupdate` announcements
* [ ] Embedded/third-party players have concise iframe titles; transcript/description links live outside the iframe
* [ ] Media metadata states duration, language(s), and available alternatives

---

## Key WCAG Criteria

* 1.2.1 Audio-only and Video-only Prerecorded (A)
* 1.2.2 Captions Prerecorded (A) — **Critical if absent**
* 1.2.3 Audio Description or Media Alternative Prerecorded (A)
* 1.2.4 Captions Live (AA) — **Serious if absent, not excused by general feasibility**
* 1.2.5 Audio Description Prerecorded (AA) — **Serious if absent**
* 1.2.6 Sign Language Prerecorded (AAA)
* 1.2.7 Extended Audio Description Prerecorded (AAA)
* 1.4.2 Audio Control (A) — **Critical if autoplaying audio cannot be stopped**
* 2.1.4 Character Key Shortcuts (A)
* 2.2.2 Pause, Stop, Hide (A)
* 2.3.1 Three Flashes or Below Threshold (A)

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/AUDIO_VIDEO_ACCESSIBILITY_BEST_PRACTICES.md)
* [W3C WAI: Making Audio and Video Media Accessible](https://www.w3.org/WAI/media/av/)
* [WebVTT specification (W3C)](https://www.w3.org/TR/webvtt1/)
* [Technique H95: Using `track` to Provide Captions](https://www.w3.org/WAI/WCAG22/Techniques/html/H95)
* [Technique G9: Creating Captions for Live Synchronized Media](https://www.w3.org/WAI/WCAG22/Techniques/general/G9)
* [WCAG 2.2 Understanding 1.2 Time-based Media overview](https://www.w3.org/WAI/WCAG22/Understanding/time-based-media)
* [WCAG 2.2 Understanding 1.4.2 Audio Control](https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html)

> **Standards horizon:** WCAG 3.0 is expected to preserve the substance of
> 1.2.x time-based media requirements.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
