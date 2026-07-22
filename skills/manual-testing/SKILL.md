---
name: manual-testing
description: >
  Load this skill whenever you are planning, executing, or reviewing manual
  accessibility testing. Manual testing with real assistive technologies is
  essential — automated tools catch only ~30–40 % of WCAG issues. Absolutely
  always include keyboard-only testing and at least one screen reader test
  before marking a feature accessible. Under no circumstances skip forced
  colors mode testing for UI components.
---

# Manual Accessibility Testing Skill

> **Canonical source**: `examples/MANUAL_ACCESSIBILITY_TESTING_GUIDE.md` in `mgifford/ACCESSIBILITY.md`
> This skill is derived from that file. When in doubt, the example is authoritative.

Apply these rules when planning or reviewing manual accessibility testing.

---

## Severity Scale (this skill)

| Level | Meaning |
|---|---|
| **Critical** | Issue completely blocks a core task for one or more disability groups |
| **Serious** | Significantly impairs access; workaround unreasonable to expect |
| **Moderate** | Creates friction; workaround exists and is not too burdensome |
| **Minor** | Best-practice gap; marginal impact on access |

---

## Core Principle

**Manual testing reveals issues that automated tools cannot detect**, including:

* Screen reader announcement quality and user experience
* Keyboard navigation flow and logical sequence
* Focus management in dynamic interfaces
* Context and orientation for assistive technology users
* Forced colors mode (Windows High Contrast) — automated tools cannot simulate OS-level color overrides
* Real-world usability barriers

---

## Critical: When Manual Testing Is Required

Perform manual testing:

* **Before each release** — test critical user flows end to end
* **After UI changes** — test all affected components
* **For new features** — test complete user workflows
* **When automated tests pass** — validate actual user experience
* **When accessibility bugs are reported** — reproduce and verify fixes

**Getting started:** test keyboard-only first (easiest entry point), then learn
basic screen reader commands for your platform. Practice on familiar websites
before testing your own. Focus on one component or flow at a time.

---

## Critical: Keyboard-Only Testing

**Every interactive element must be reachable and operable by keyboard alone.**

Steps:
1. Click in the browser address bar, then press Tab to start from page top
2. Tab through entire page; check each focusable element:
   - Is focus visible (clear outline or highlight)?
   - Is focus order logical (follows visual/reading order)?
   - Can you activate it? (Enter for links/buttons, Space for buttons/checkboxes)
3. Press Shift+Tab to reverse through elements
4. Confirm there are no keyboard traps (can you Tab away from every element?)

Key shortcuts to verify:

| Key | Expected behaviour |
|---|---|
| Tab | Move focus forward |
| Shift+Tab | Move focus backward |
| Enter | Activate links, buttons, submit forms |
| Space | Activate buttons, toggle checkboxes |
| Arrow keys | Navigate within components (menus, tabs, radio groups) |
| Escape | Close dialogs, cancel operations |
| Home / End | Jump to start/end of component |

**Component-specific checks:**

* **Forms:** all fields reachable; labels and required state announced; errors
  appear and are announced; Enter submits; can cancel/reset if applicable
* **Buttons:** Enter and Space both activate; visual feedback on activation;
  focus moves appropriately after activation
* **Links:** Enter activates; destination clear from link text; skip links work
* **Dropdowns/select menus:** arrow keys navigate options; Escape closes;
  selected value announced
* **Modal dialogs:** focus moves in on open; focus trapped inside; Escape
  closes (unless critical); focus returns to trigger on close
* **Custom widgets (tabs, accordions, carousels):** follow WAI-ARIA keyboard
  patterns; arrow keys and Home/End work as documented; state changes are clear

---

## Critical: Screen Reader Testing

**Recommended platform pairings:**

* NVDA + Firefox or Chrome (Windows)
* JAWS + Chrome or Firefox (Windows)
* VoiceOver + Safari (macOS / iOS)
* TalkBack + Chrome (Android)

**Basic test procedure:**

1. Start screen reader (NVDA: Ctrl+Alt+N; VoiceOver macOS: Cmd+F5)
2. Navigate by headings (NVDA/JAWS: H / Shift+H) — do they form a logical outline?
3. Navigate by landmarks (NVDA/JAWS: D / Shift+D) — are `<nav>`, `<main>`, `<header>` identified?
4. Navigate by form controls (NVDA/JAWS: F / Shift+F) — are labels announced?
5. Read all content — is order logical? Any missing or confusing announcements?

**Component-specific screen reader checks:**

* **Images:** decorative images ignored (empty alt/`aria-hidden`); informative
  images have descriptive alt text; complex images have longer descriptions
* **Links:** purpose clear from announcement alone; text meaningful (not
  "click here"); external links/new windows indicated
* **Buttons:** label describes the action; pressed/toggle state announced;
  disabled state announced
* **Form fields:** label announced before field type; required state,
  instructions/hints, error messages, and success messages all announced
* **Dynamic content:** new/deleted content announced via live regions; loading
  states and progress communicated
* **Tables:** navigate by rows/cells (Ctrl+Alt+Arrow in NVDA/JAWS); column and
  row headers announced with each cell; table purpose clear (caption or `aria-label`)
* **Custom widgets:** role announced (e.g., "tab", "menu", "dialog"); state
  announced (e.g., "selected", "expanded"); instructions provided for complex widgets

**For each interactive element, verify:**

* Element type is announced (button, link, heading…)
* Label/name is clear and descriptive
* Current value is announced (form fields)
* State is announced (checked, selected, expanded…)
* Changes are announced (dynamic updates, live regions)

---

## Serious: Forced Colors Mode Testing

**Why automated tools miss this:** forced colors is triggered by an OS-level
setting that replaces all author-defined colors with a constrained system
palette. Automated tools cannot simulate the OS-level override, detect which
elements become invisible when custom colors are stripped, or assess whether
focus indicators/icons/custom controls survive the substitution.

**How to enable:**

* **Windows 11:** Settings → Accessibility → Contrast themes → choose a theme → Apply
* **Windows 10:** Settings → Ease of Access → High Contrast → turn on (or `Alt+Left Shift+Print Screen`)
* **Chrome/Edge DevTools:** F12 → More Tools → Rendering → "Emulate CSS media feature forced-colors" → `active`
* **Firefox:** `about:config` → `ui.forcedColors` → set to `1` (`-1` to reset)
* **Polypane** includes a forced-colors emulation panel

Always verify with real OS settings before release — DevTools emulation is
convenient but not fully equivalent.

**What to look for:**

* [ ] All text is readable against its background (`CanvasText` on `Canvas`)
* [ ] Buttons have a visible boundary; links distinguishable from body text;
      form fields have visible borders
* [ ] Keyboard focus outlines are visible (`outline` is preserved; `box-shadow` may not be)
* [ ] SVG icons are visible (use `currentColor` for `fill`/`stroke`)
* [ ] Custom checkboxes / radio buttons remain visible and distinguishable;
      toggle state shown via text/ARIA/outline, not color alone
* [ ] Error states are identifiable without relying on color alone; required
      fields marked with text or icons, not only color
* [ ] Background images that convey meaning have a text/ARIA alternative
* [ ] Charts/data visualizations use pattern/texture/label alternatives

**Common fixes:**

| Issue | Fix |
|---|---|
| `box-shadow` focus ring disappears | Replace with `outline` |
| SVG icon invisible | Use `currentColor` for `fill`/`stroke` |
| Custom checkbox invisible | Add visible border; use `forced-color-adjust` override |
| Error marked by color only | Add icon, text label, or `aria-invalid` |
| Input invisible (`border: none`) | Add `border: 1px solid ButtonBorder` in `@media (forced-colors: active)` |
| Background image removed | Add visible text, caption, or `aria-label` |

**CSS system color keywords for patching:**

```css
@media (forced-colors: active) {
  :focus-visible {
    outline: 3px solid Highlight;
    outline-offset: 2px;
  }
  .custom-checkbox::before {
    forced-color-adjust: none;
    border: 2px solid ButtonBorder;
    background-color: ButtonFace;
  }
  .custom-checkbox[aria-checked="true"]::before {
    background-color: Highlight;
  }
}
```

Relevant keywords: `Canvas`, `CanvasText`, `ButtonFace`, `ButtonText`,
`ButtonBorder`, `Highlight`, `HighlightText`, `LinkText`, `VisitedText`, `GrayText`.

Use `forced-color-adjust: none` only as a last resort — it opts the element out
of forced colors entirely and can negate the user's accessibility settings.

---

## Moderate: Visual Accessibility Checks

### Color contrast

* Normal text (< 18 pt or < 14 pt bold): 4.5:1 minimum
* Large text (≥ 18 pt or ≥ 14 pt bold): 3:1 minimum
* UI components and graphics: 3:1 minimum
* Focus indicators: 3:1 against adjacent colors

Test with: WebAIM Contrast Checker, browser DevTools. Test light and dark
color modes separately.

### Zoom at 200%

1. Set browser zoom to 200% (Ctrl/Cmd + +)
2. Verify all content is readable and not cut off
3. Verify no horizontal scrolling on a standard 1280px viewport
4. Also test with OS-level screen magnification (Windows Magnifier, macOS Zoom)

### Focus indicator

* [ ] Focus indicator is visible for every focusable element
* [ ] Contrast meets 3:1 requirement against adjacent colors
* [ ] Focus indicator is not removed or replaced with something less visible
* [ ] Focus indicator doesn't obscure content

---

## Testing Workflows by Component Type

**Forms:** navigate to form with keyboard only → fill all fields (check Tab
order) → trigger validation errors → verify errors appear and are announced →
correct and revalidate → submit with Enter/Space → verify success message is
announced. With a screen reader, also confirm field labels/instructions/types
are announced and errors are in logical reading order.

**Modal dialogs:** activate trigger → verify focus moves into modal → Tab
through all elements → verify Tab doesn't leave modal (focus trap) → Escape or
close button dismisses → verify focus returns to trigger. With a screen
reader, confirm the modal is announced (`role="dialog"`, `aria-labelledby`)
and content is in logical reading order.

**Single Page Applications:** click a navigation link → verify content changes
→ verify focus moves to main heading/content → verify page title changes →
verify the route change is announced or focus provides context. Confirm the
back button works and new page structure (landmarks, headings) is clear.

---

## Documenting Test Results

For each issue found, record: component/page tested (URL or name), issue
description, expected behavior, numbered steps to reproduce, assistive
technology name/version, browser name/version, OS name/version, and severity.
Optionally include a screenshot/recording and the WCAG success criterion violated.

```markdown
## Accessibility Issue: [Brief Description]

**Component:** [URL or component name]
**Issue:** [Description of what doesn't work]
**Expected:** [What should happen]
**Severity:** [Critical/High/Medium/Low]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]

**Testing Environment:**
- **Screen Reader:** [Name and version]
- **Browser:** [Name and version]
- **OS:** [Operating system and version]

**WCAG Criterion:** [If applicable]
**Suggested Fix:** [If you have one]
```

(For structured findings, use `skills/bug-reporting/SKILL.md`.)

---

## Encouraging Participation from People with Disabilities

People with disabilities are the experts in identifying barriers and
validating solutions — their lived experience surfaces issues automated tools
and non-disabled testers miss, and validates that fixes actually work.

* Remove barriers to participation: clear jargon-free instructions, flexible
  timeframes, asynchronous feedback, compensation for testing time, accessible
  issue-reporting formats
* Invite diverse testers: screen reader users, keyboard-only users, voice
  control users, users with cognitive disabilities, users with multiple disabilities
* Credit and compensate testers fairly; create opportunities for ongoing involvement

---

## Quick Reference Checklists

**30-minute keyboard-only test:** Tab start to end; focus visible everywhere;
activate all buttons (Enter/Space) and links (Enter); fill and submit a form;
open/close a modal; use custom widgets; navigate menus; check for keyboard traps.

**30-minute screen reader test:** navigate by headings, landmarks, and form
fields; read full page content; activate buttons/links; fill and submit a
form; test a custom widget; verify images have alt text; verify dynamic
content updates are announced.

**Visual accessibility quick check:** 200% zoom; focus indicator visibility;
color contrast (text and UI components); content readable without color
alone; light and dark modes; forced colors mode.

---

## Definition of Done Checklist

* [ ] Keyboard-only test completed; all interactions reachable and operable
* [ ] No keyboard traps found
* [ ] Focus order is logical
* [ ] Screen reader test completed with at least one platform combination
* [ ] All images, icons, and charts have correct text alternatives
* [ ] Dynamic content changes are announced by screen reader
* [ ] Color contrast verified for text and UI components
* [ ] Forced colors mode tested for all custom UI components
* [ ] Zoom at 200% tested; no content cut off or horizontally scrolling
* [ ] Component workflow tests run for forms, modals, and SPA navigation where applicable
* [ ] Findings documented with URL, element, WCAG SC, severity, and steps to reproduce

---

## Key WCAG Criteria

* 1.1.1 Non-text Content (A)
* 1.3.1 Info and Relationships (A)
* 1.4.1 Use of Color (A)
* 1.4.3 Contrast Minimum (AA)
* 1.4.11 Non-text Contrast (AA)
* 2.1.1 Keyboard (A)
* 2.1.2 No Keyboard Trap (A)
* 2.4.3 Focus Order (A)
* 2.4.7 Focus Visible (AA)
* 2.4.11 Focus Appearance (AA — WCAG 2.2)
* 4.1.2 Name, Role, Value (A)
* 4.1.3 Status Messages (AA)

---

## References

* [Full guide](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/MANUAL_ACCESSIBILITY_TESTING_GUIDE.md)
* [WebAIM: Testing with NVDA](https://webaim.org/articles/nvda/)
* [WebAIM: Using VoiceOver](https://webaim.org/articles/voiceover/)
* [WebAIM: Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
* [Deque: Screen Reader Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/)
* [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
* [W3C: Easy Checks - First Review](https://www.w3.org/WAI/test-evaluate/preliminary/)
* [MDN: forced-colors media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors)

> **Standards horizon:** These rules target WCAG 2.2 AA.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
