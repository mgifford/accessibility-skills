# Audio/Video Accessibility Skill

> **Canonical source**: `examples/AUDIO_VIDEO_ACCESSIBILITY_BEST_PRACTICES.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when implementing or reviewing any audio or video content.
**Only load this skill if the project contains audio or video.**

---

## Core Mandate

All users must access the full meaning of multimedia through alternative formats
and accessible controls — including people who are Deaf/hard of hearing,
blind/low vision, DeafBlind, or have cognitive or motor disabilities.

---

## Severity Scale (this skill)

| Level | Meaning |
| --- | --- |
| **Critical** | Media content completely inaccessible to a disability group |
| **Serious** | Access significantly impaired; workaround unreasonable to expect |
| **Moderate** | Access degraded but partially available |
| **Minor** | Best-practice gap; marginal impact on access |

---

## Critical: Never Autoplay Audio

Never use `autoplay` on `<video>` or `<audio>` that plays sound.
**Autoplaying audio that cannot be immediately stopped is Critical** (WCAG 1.4.2,
Level A) — it interferes directly with screen readers, which use audio as their
primary output channel. It can also cause severe distress for users with
sensory processing conditions.

```html
<!-- Never do this -->
<video src="intro.mp4" autoplay></video>
<audio src="ambient.mp3" autoplay></audio>

<!-- If motion/visual autoplay is required (e.g., background video),
     always mute by default, include controls, and respect reduced-motion -->
<video src="background.mp4" autoplay muted loop playsinline
       controls aria-label="Background animation — muted by default">
</video>

@media (prefers-reduced-motion: reduce) {
  video[autoplay] { display: none; }
}
```

If sound autoplays for any reason, a mechanism to stop, pause, or mute it
must be the **first keyboard stop on the page**, reachable before any
other content.

---

## Critical: Captions on Pre-recorded Video with Audio

Synchronised captions are required on all pre-recorded video that contains
a spoken or audio track. **Missing captions are Critical** — Deaf and
hard-of-hearing users cannot access the audio content at all.

Use WebVTT format via the native `<track>` element:

```html
<video controls>
  <source src="video.mp4" type="video/mp4">
  <track kind="captions"
         src="captions-en.vtt"
         srclang="en"
         label="English captions"
         default>
  <track kind="captions"
         src="captions-fr.vtt"
         srclang="fr"
         label="Captions en français">
</video>
```

Caption quality requirements:

* Accurate transcription of all dialogue
* Speaker identification when speakers are not visually apparent
* Relevant non-speech audio: `[door slams]`, `[tense music]`, `[applause]`
* Correct punctuation, capitalisation, and synchronised timing
* **Never publish auto-generated captions without human review.**
  Unreviewed auto-captions are at best **Serious** — errors in captions
  can actively mislead. Review and correct before publishing.

---

## Critical: Transcript for Audio-Only Content

A text transcript is required for all audio-only content (podcasts, recordings,
narrated slideshows). **Missing transcript is Critical** — Deaf users have no
access to the content at all, and DeafBlind users who use braille displays
need a text transcript, not captions.

```html
<figure>
  <audio controls>
    <source src="episode.mp3" type="audio/mpeg">
    Your browser does not support audio playback.
    <a href="episode.mp3">Download the audio file</a>
  </audio>
  <figcaption>
    Episode 12: Accessible Web Forms
    <a href="#transcript-ep12">Read the transcript</a>
  </figcaption>
</figure>

<!-- Transcript: directly linked, not only inside a <details> collapse,
     so it is discoverable by search engines and directly shareable -->
<section id="transcript-ep12" aria-labelledby="transcript-heading">
  <h2 id="transcript-heading">Transcript: Episode 12</h2>
  <p><strong>Host:</strong> Welcome to the accessibility podcast.</p>
  <p><em>[Intro music fades]</em></p>
  <!-- … -->
</section>
```

Transcript must include: speaker identification, all dialogue, relevant
non-speech sounds, and description of important visual content (for video).

**Make transcripts directly linkable and searchable** — a stable anchor URL
(`#transcript-ep12`) allows users to share the transcript directly, and
exposes it to search engines. Collapsing the transcript in a `<details>`
element is acceptable for visual space, but the section heading and anchor
must still be present in the DOM.

---

## Serious: Audio Descriptions for Pre-recorded Video

Audio descriptions or a text alternative are required for all pre-recorded
video. **Missing audio description is Serious** — blind users cannot access
information conveyed only visually (actions, on-screen text, scene changes,
facial expressions).

```html
<video controls>
  <source src="video.mp4" type="video/mp4">
  <track kind="captions"
         src="captions-en.vtt"
         srclang="en"
         label="English captions">
  <track kind="descriptions"
         src="audio-descriptions-en.vtt"
         srclang="en"
         label="Audio descriptions">
</video>
```

Audio description content must cover: actions and movement, characters and
their expressions, scene changes, on-screen text not spoken aloud, and visual
cues essential to understanding the content.

When the pauses in the main audio track are insufficient for audio description,
provide an extended audio description version or a full text alternative.

---

## Serious: Accessible Media Player

The media player must be fully keyboard operable with visible focus indicators.
**An inaccessible media player is Serious** — keyboard and AT users cannot
control playback at all.

### Recommended: Able Player

**[Able Player](https://ableplayer.github.io/ableplayer/)** is the recommended
open-source accessible media player. It provides captions, audio descriptions,
keyboard access, and screen reader announcements out of the box.

**Hosting requirement:** Able Player requires self-hosting its JavaScript and
CSS assets. It cannot be loaded from a CDN without first downloading the files
from the [Able Player repository](https://github.com/ableplayer/ableplayer).
Copy `/build/ableplayer.min.js` and `/build/ableplayer.min.css` into your
project's asset directory.

```html
<link rel="stylesheet" href="/assets/ableplayer.min.css">
<script src="/assets/ableplayer.min.js"></script>

<video id="video1" data-able-player preload="auto">
  <source type="video/mp4" src="video.mp4">
  <track kind="captions"
         src="captions-en.vtt"
         srclang="en"
         label="English captions">
  <track kind="descriptions"
         src="descriptions-en.vtt"
         srclang="en"
         label="Audio descriptions">
</video>
```

### Minimum requirements for any media player

Any player — native `<video controls>` or custom — must provide:

* Full keyboard access for all controls (play, pause, seek, volume, fullscreen, captions toggle)
* Visible focus indicators on all interactive elements
* Accessible names for all icon-only buttons
* Play/pause/volume/seek/fullscreen state announced to screen readers
* Caption enable/disable and customisation (size, colour, background)
* Transcript link or inline transcript display

### Custom controls pattern

If implementing custom controls:

```html
<div class="media-controls" role="group" aria-label="Video controls">

  <button id="play-pause" aria-label="Play" type="button">
    <svg aria-hidden="true" focusable="false"><!-- play icon --></svg>
  </button>

  <!-- Update aria-label to "Pause" when playing, "Play" when paused -->

  <label for="seek" class="visually-hidden">Seek</label>
  <input type="range" id="seek"
         min="0" max="100" value="0" step="1"
         aria-label="Seek"
         aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"
         aria-valuetext="0 seconds">

  <label for="volume" class="visually-hidden">Volume</label>
  <input type="range" id="volume"
         min="0" max="100" value="100" step="5"
         aria-label="Volume"
         aria-valuemin="0" aria-valuemax="100" aria-valuenow="100">

  <button id="captions-toggle" aria-label="Enable captions"
          aria-pressed="false" type="button">CC</button>

  <button id="fullscreen" aria-label="Enter fullscreen" type="button">
    <svg aria-hidden="true" focusable="false"><!-- fullscreen icon --></svg>
  </button>

</div>
```

Always update `aria-valuenow` and `aria-valuetext` on seek and volume inputs
as values change. Update `aria-label` on play/pause when state changes.
Update `aria-pressed` and `aria-label` on captions toggle when state changes.

---

## Moderate: Live Captions (WCAG 1.2.4 AA)

Live video must provide captions where technically feasible. This is **Moderate**
rather than Critical because "technically feasible" provides legitimate scope
for live content — a truly live, unscripted broadcast has different constraints
from a scripted livestream. Document your reasoning if captions are not provided.

For planned live events: prepare and use scripted captions or CART
(Communication Access Realtime Translation) captioning services.

---

## Moderate: WCAG 1.4.2 Audio Control

If any audio plays automatically for more than 3 seconds, the user must be able
to pause or stop it, or control the volume independently of the system volume.
This is distinct from the autoplay prohibition: it applies even when the user
has initiated playback.

```html
<!-- Volume control must be available independently -->
<button type="button" id="mute-toggle"
        aria-label="Mute background audio"
        aria-pressed="false">
  <svg aria-hidden="true" focusable="false"><!-- speaker icon --></svg>
</button>
```

---

## Minor: Sign Language (WCAG 1.2.6 — Level AAA)

WCAG 1.2.6 requires sign language interpretation for all pre-recorded audio
content. This is **Level AAA** and therefore not required for AA conformance,
but it is the highest-quality accommodation for Deaf users who use sign language
as their primary language. Consider providing sign language videos for high-
priority content (safety information, onboarding, key announcements).

Sign language interpretation is a **separate track or video**, not a caption
overlay. If provided, it should be available as a toggleable picture-in-picture
panel or a separate video stream.

---

## Definition of Done Checklist

* [ ] No autoplaying audio (with or without sound)
* [ ] If video autoplays (muted), `prefers-reduced-motion` disables it
* [ ] WCAG 1.4.2: audio that continues playing has accessible stop/pause/mute control
* [ ] Synchronised captions on all pre-recorded video with audio
* [ ] Auto-generated captions reviewed and corrected by a human before publishing
* [ ] Text transcript for all audio-only content
* [ ] Transcript directly linkable via stable anchor URL
* [ ] Transcript discoverable by search (not `display:none` or JS-only render)
* [ ] Audio descriptions for all pre-recorded video
* [ ] Able Player assets self-hosted (not loaded from external CDN)
* [ ] All media player controls keyboard operable with visible focus indicators
* [ ] Play/pause/volume/captions state announced to screen readers
* [ ] Captions can be enabled/disabled and customised

---

## Key WCAG Criteria

* 1.2.1 Audio-only and Video-only Pre-recorded (A) — **Critical if absent**
* 1.2.2 Captions Pre-recorded (A) — **Critical if absent**
* 1.2.3 Audio Description or Media Alternative Pre-recorded (A)
* 1.2.4 Captions Live (AA)
* 1.2.5 Audio Description Pre-recorded (AA) — **Serious if absent**
* 1.2.6 Sign Language Pre-recorded (AAA) — not required for AA; recommended for high-priority content
* 1.4.2 Audio Control (A) — **Critical if autoplaying audio cannot be stopped**

---

## References

* [Full best practices guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/AUDIO_VIDEO_ACCESSIBILITY_BEST_PRACTICES.md)
* [Able Player](https://ableplayer.github.io/ableplayer/) — self-host assets from the [Able Player repo](https://github.com/ableplayer/ableplayer)
* [WebVTT specification (W3C)](https://www.w3.org/TR/webvtt1/)
* [WCAG 2.2 Understanding 1.2 Time-based Media overview](https://www.w3.org/WAI/WCAG22/Understanding/time-based-media)
* [WCAG 2.2 Understanding 1.4.2 Audio Control](https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html)

> **Standards horizon:** WCAG 3.0 is expected to preserve the substance of
> 1.2.x time-based media requirements. No breaking changes to captions or
> audio description requirements are currently proposed.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
