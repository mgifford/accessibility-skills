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
4. Confirm there are no keyboard traps

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

* **Forms:** all fields reachable; labels announced; errors appear and are announced; Enter submits
* **Modal dialogs:** focus moves in on open; focus trapped inside; Escape closes; focus returns to trigger on close
* **Custom widgets (tabs, accordions):** follow WAI-ARIA keyboard patterns; arrow keys work as documented

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

**For each interactive element, verify:**

* Element type is announced (button, link, heading…)
* Label/name is clear and descriptive
* Current value is announced (form fields)
* State is announced (checked, selected, expanded…)
* Changes are announced (dynamic updates, live regions)

---

## Serious: Forced Colors Mode Testing

**Why automated tools miss this:** forced colors is triggered by an OS-level
setting; browsers cannot simulate the full color override in a headless context.

**How to enable:**

* **Windows 11:** Settings → Accessibility → Contrast themes → choose a theme → Apply
* **Windows 10:** Settings → Ease of Access → High Contrast → turn on
* **Chrome/Edge DevTools:** F12 → More Tools → Rendering → "Emulate CSS media feature forced-colors" → `active`
* **Firefox:** `about:config` → `ui.forcedColors` → set to `1`

**What to look for:**

* [ ] All text is readable against its background
* [ ] Buttons have a visible boundary
* [ ] Keyboard focus outlines are visible (`outline` is preserved; `box-shadow` may not be)
* [ ] SVG icons are visible (use `currentColor` for `fill`/`stroke`)
* [ ] Custom checkboxes / radio buttons remain visible and distinguishable
* [ ] Error states are identifiable without relying on color alone
* [ ] Background images that convey meaning have a text/ARIA alternative

**Common fixes:**

| Issue | Fix |
|---|---|
| `box-shadow` focus ring disappears | Replace with `outline` |
| SVG icon invisible | Use `currentColor` for `fill`/`stroke` |
| Custom checkbox invisible | Add visible border; use `forced-color-adjust` override |
| Error marked by color only | Add icon, text label, or `aria-invalid` |
| Input invisible (`border: none`) | Add `border: 1px solid ButtonBorder` in `@media (forced-colors: active)` |

**CSS system color keywords for patching:**

```css
@media (forced-colors: active) {
  :focus-visible {
    outline: 3px solid Highlight;
    outline-offset: 2px;
  }
}
```

Relevant keywords: `Canvas`, `CanvasText`, `ButtonFace`, `ButtonText`,
`ButtonBorder`, `Highlight`, `HighlightText`, `LinkText`, `GrayText`.

---

## Moderate: Visual Accessibility Checks

### Color contrast

* Normal text (< 18 pt or < 14 pt bold): 4.5:1 minimum
* Large text (≥ 18 pt or ≥ 14 pt bold): 3:1 minimum
* UI components and graphics: 3:1 minimum
* Focus indicators: 3:1 against adjacent colors

Test with: WebAIM Contrast Checker, browser DevTools.

### Zoom at 200 %

1. Set browser zoom to 200 % (Ctrl/Cmd + +)
2. Verify all content is readable and not cut off
3. Verify no horizontal scrolling on a standard 1280 px viewport

### Focus indicator

* [ ] Focus indicator is visible for every focusable element
* [ ] Contrast meets 3:1 requirement against adjacent colors
* [ ] Focus indicator is not removed or replaced with something less visible

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
* [ ] Zoom at 200 % tested; no content cut off or horizontally scrolling
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
* [Deque: Screen Reader Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/)
* [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

> **Standards horizon:** These rules target WCAG 2.2 AA.
> Monitor: <https://www.w3.org/TR/wcag-3.0/>
