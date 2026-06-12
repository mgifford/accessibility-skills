# Eval Report

Generated: 2026-06-12T14:59:14.802Z

## Overall

- Total eval manifests: 13
- Failed eval manifests: 0
- Passed checks: 128/128
- Score: 100%

## Manifests

### evals/aria-live-regions/evals.json

- Skill: aria-live-regions
- Status: PASS

#### Eval 1

- Status: PASS
- Score: 100%
- Response: responses/aria-live-regions/all.md

- PASS must_contain_any: matched "role=\"status\"", "aria-live=\"polite\"", "announce"
- PASS must_not_contain: no forbidden tokens found

#### Eval 2

- Status: PASS
- Score: 100%
- Response: responses/aria-live-regions/all.md

- PASS must_contain_any: matched "aria-atomic=\"true\"", "results found", "search-status"
- PASS must_not_contain: no forbidden tokens found

#### Eval 3

- Status: PASS
- Score: 100%
- Response: responses/aria-live-regions/all.md

- PASS must_contain_any: matched "role=\"alert\"", "aria-live=\"assertive\"", "session warning"
- PASS must_not_contain: no forbidden tokens found

#### Eval 4

- Status: PASS
- Score: 100%
- Response: responses/aria-live-regions/all.md

- PASS must_contain_any: matched "aria-atomic=\"false\"", "aria-live=\"polite\"", "chat-log"
- PASS must_not_contain: no forbidden tokens found

#### Eval 5

- Status: PASS
- Score: 100%
- Response: responses/aria-live-regions/all.md

- PASS must_contain_any: matched "visually-hidden", "clip:", "overflow: hidden"
- PASS must_not_contain: no forbidden tokens found

### evals/color-contrast/evals.json

- Skill: color-contrast
- Status: PASS

#### Eval 1

- Status: PASS
- Score: 100%
- Response: responses/color-contrast/all.md

- PASS must_contain_any: matched "--color-text", "prefers-color-scheme: dark"
- PASS must_not_contain: no forbidden tokens found

#### Eval 2

- Status: PASS
- Score: 100%
- Response: responses/color-contrast/all.md

- PASS must_contain_any: matched "border", "currentColor"
- PASS must_not_contain: no forbidden tokens found

#### Eval 3

- Status: PASS
- Score: 100%
- Response: responses/color-contrast/all.md

- PASS must_contain_any: matched ":focus-visible", "forced-colors: active", "outline"
- PASS must_not_contain: no forbidden tokens found

#### Eval 4

- Status: PASS
- Score: 100%
- Response: responses/color-contrast/all.md

- PASS must_contain_any: matched "aria-invalid", "required"
- PASS must_not_contain: no forbidden tokens found

#### Eval 5

- Status: PASS
- Score: 100%
- Response: responses/color-contrast/all.md

- PASS must_contain_any: matched "contrast", "prefers-color-scheme", "focus ring"
- PASS must_not_contain: no forbidden tokens found

### evals/forms/evals.json

- Skill: forms
- Status: PASS

#### Eval 1

- Status: PASS
- Score: 100%
- Response: responses/forms/all.md

- PASS must_contain_any: matched "<label", "type=\"email\"", "required"
- PASS must_not_contain: no forbidden tokens found

#### Eval 2

- Status: PASS
- Score: 100%
- Response: responses/forms/all.md

- PASS must_contain_any: matched "aria-invalid=\"true\"", "aria-describedby", "role=\"alert\""
- PASS must_not_contain: no forbidden tokens found

#### Eval 3

- Status: PASS
- Score: 100%
- Response: responses/forms/all.md

- PASS must_contain_any: matched "<fieldset", "<legend", "type=\"radio\""

#### Eval 4

- Status: PASS
- Score: 100%
- Response: responses/forms/all.md

- PASS must_contain_any: matched "autocomplete=\"bday-day\"", "autocomplete=\"bday-month\"", "autocomplete=\"bday-year\""
- PASS must_not_contain: no forbidden tokens found

#### Eval 5

- Status: PASS
- Score: 100%
- Response: responses/forms/all.md

- PASS must_contain_any: matched "inputmode=\"numeric\"", "pattern=", "type=\"text\""
- PASS must_not_contain: no forbidden tokens found

### evals/image-alt-text/evals.json

- Skill: image-alt-text
- Status: PASS

#### Eval 1

- Status: PASS
- Score: 100%
- Response: responses/image-alt-text/all.md

- PASS must_contain_any: matched "alt=\"\"", "decorative"
- PASS must_not_contain: no forbidden tokens found

#### Eval 2

- Status: PASS
- Score: 100%
- Response: responses/image-alt-text/all.md

- PASS must_contain_any: matched "Go to homepage", "Search", "alt=\""
- PASS must_not_contain: no forbidden tokens found

#### Eval 3

- Status: PASS
- Score: 100%
- Response: responses/image-alt-text/all.md

- PASS must_contain_any: matched "figcaption", "aria-describedby", "Bar chart"
- PASS must_not_contain: no forbidden tokens found

#### Eval 4

- Status: PASS
- Score: 100%
- Response: responses/image-alt-text/all.md

- PASS must_contain_any: matched "50% off", "Summer Sale", "alt=\""
- PASS must_not_contain: no forbidden tokens found

#### Eval 5

- Status: PASS
- Score: 100%
- Response: responses/image-alt-text/all.md

- PASS must_contain_any: matched "Rating:", "out of 5 stars", "alt=\"\""
- PASS must_not_contain: no forbidden tokens found

### evals/keyboard/evals.json

- Skill: keyboard
- Status: PASS

#### Eval 1

- Status: PASS
- Score: 100%
- Response: responses/keyboard/all.md

- PASS must_contain_any: matched "<button", "<a href=", "type=\"button\""
- PASS must_not_contain: no forbidden tokens found

#### Eval 2

- Status: PASS
- Score: 100%
- Response: responses/keyboard/all.md

- PASS must_contain_any: matched "Enter", "Space", "tabindex=\"0\""
- PASS must_not_contain: no forbidden tokens found

#### Eval 3

- Status: PASS
- Score: 100%
- Response: responses/keyboard/all.md

- PASS must_contain_any: matched ":focus-visible", "outline"
- PASS must_not_contain: no forbidden tokens found

#### Eval 4

- Status: PASS
- Score: 100%
- Response: responses/keyboard/all.md

- PASS must_contain_any: matched "Escape", "focus"
- PASS must_not_contain: no forbidden tokens found

#### Eval 5

- Status: PASS
- Score: 100%
- Response: responses/keyboard/all.md

- PASS must_contain_any: matched "tabindex=\"0\"", "tabindex=\"-1\"", "Arrow"
- PASS must_not_contain: no forbidden tokens found

### evals/light-dark-mode/evals.json

- Skill: light-dark-mode
- Status: PASS

#### Eval 1

- Status: PASS
- Score: 100%
- Response: responses/light-dark-mode/all.md

- PASS must_contain_any: matched ":root", "prefers-color-scheme: dark", "--color-text"
- PASS must_not_contain: no forbidden tokens found

#### Eval 2

- Status: PASS
- Score: 100%
- Response: responses/light-dark-mode/all.md

- PASS must_contain_any: matched "localStorage", "try", "Switch to dark mode"
- PASS must_not_contain: no forbidden tokens found

#### Eval 3

- Status: PASS
- Score: 100%
- Response: responses/light-dark-mode/all.md

- PASS must_contain_any: matched "forced-colors: active", "CanvasText", "outline"
- PASS must_not_contain: no forbidden tokens found

#### Eval 4

- Status: PASS
- Score: 100%
- Response: responses/light-dark-mode/all.md

- PASS must_contain_any: matched "var(--", "--color-"
- PASS must_not_contain: no forbidden tokens found

#### Eval 5

- Status: PASS
- Score: 100%
- Response: responses/light-dark-mode/all.md

- PASS must_contain_any: matched "data-theme", "color-scheme"
- PASS must_not_contain: no forbidden tokens found

### evals/maps/evals.json

- Skill: maps
- Status: PASS

#### Eval 1

- Status: PASS
- Score: 100%
- Response: responses/maps/all.md

- PASS must_contain_any: matched "alt=\"Campus map", "main entrance", "library"
- PASS must_not_contain: no forbidden tokens found

#### Eval 2

- Status: PASS
- Score: 100%
- Response: responses/maps/all.md

- PASS must_contain_any: matched "Skip map", "title=\"Interactive map", "map-skip-target"
- PASS must_not_contain: no forbidden tokens found

#### Eval 3

- Status: PASS
- Score: 100%
- Response: responses/maps/all.md

- PASS must_contain_any: matched "Zoom in", "Zoom out", "Escape"
- PASS must_not_contain: no forbidden tokens found

#### Eval 4

- Status: PASS
- Score: 100%
- Response: responses/maps/all.md

- PASS must_contain_any: matched "<table", "<ul", "Accessible library branches"
- PASS must_not_contain: no forbidden tokens found

#### Eval 5

- Status: PASS
- Score: 100%
- Response: responses/maps/all.md

- PASS must_contain_any: matched "text labels"
- PASS must_not_contain: no forbidden tokens found

### evals/navigation/evals.json

- Skill: navigation
- Status: PASS

#### Eval 1

- Status: PASS
- Score: 100%
- Response: responses/navigation/all.md

- PASS must_contain_any: matched "<nav", "aria-current=\"page\"", "tabindex=\"-1\""
- PASS must_not_contain: no forbidden tokens found

#### Eval 2

- Status: PASS
- Score: 100%
- Response: responses/navigation/all.md

- PASS must_contain_any: matched "<nav", "<ul", "<a"
- PASS must_not_contain: no forbidden tokens found

#### Eval 3

- Status: PASS
- Score: 100%
- Response: responses/navigation/all.md

- PASS must_contain_any: matched "aria-label=\"Breadcrumb\"", "<ol", "aria-current=\"page\""
- PASS must_not_contain: no forbidden tokens found

#### Eval 4

- Status: PASS
- Score: 100%
- Response: responses/navigation/all.md

- PASS must_contain_any: matched "aria-expanded", "aria-controls", "hidden"
- PASS must_not_contain: no forbidden tokens found

#### Eval 5

- Status: PASS
- Score: 100%
- Response: responses/navigation/all.md

- PASS must_contain_any: matched "<nav", "aria-label=\"Footer\""

### evals/progressive-enhancement/evals.json

- Skill: progressive-enhancement
- Status: PASS

#### Eval 1

- Status: PASS
- Score: 100%
- Response: responses/progressive-enhancement/all.md

- PASS must_contain_any: matched "<form", "action=", "method=\"get\""
- PASS must_not_contain: no forbidden tokens found

#### Eval 2

- Status: PASS
- Score: 100%
- Response: responses/progressive-enhancement/all.md

- PASS must_contain_any: matched "<nav", "<a href=", "JavaScript"
- PASS must_not_contain: no forbidden tokens found

#### Eval 3

- Status: PASS
- Score: 100%
- Response: responses/progressive-enhancement/all.md

- PASS must_contain_any: matched "'fetch' in window", "querySelector", "feature detection"
- PASS must_not_contain: no forbidden tokens found

#### Eval 4

- Status: PASS
- Score: 100%
- Response: responses/progressive-enhancement/all.md

- PASS must_contain_any: matched "serviceWorker", "register", "catch"
- PASS must_not_contain: no forbidden tokens found

#### Eval 5

- Status: PASS
- Score: 100%
- Response: responses/progressive-enhancement/all.md

- PASS must_contain_any: matched "prefers-reduced-motion", "forced-colors"
- PASS must_not_contain: no forbidden tokens found

### evals/svg/evals.json

- Skill: svg
- Status: PASS

#### Eval 1

- Status: PASS
- Score: 100%
- Response: responses/svg/all.md

- PASS must_contain_any: matched "aria-hidden=\"true\"", "focusable=\"false\""
- PASS must_not_contain: no forbidden tokens found

#### Eval 2

- Status: PASS
- Score: 100%
- Response: responses/svg/all.md

- PASS must_contain_any: matched "role=\"img\"", "aria-labelledby", "<title"
- PASS must_not_contain: no forbidden tokens found

#### Eval 3

- Status: PASS
- Score: 100%
- Response: responses/svg/all.md

- PASS must_contain_any: matched "aria-labelledby", "role=\"img\""
- PASS must_not_contain: no forbidden tokens found

#### Eval 4

- Status: PASS
- Score: 100%
- Response: responses/svg/all.md

- PASS must_contain_any: matched "prefers-reduced-motion", "animation"
- PASS must_not_contain: no forbidden tokens found

#### Eval 5

- Status: PASS
- Score: 100%
- Response: responses/svg/all.md

- PASS must_contain_any: matched "<img", "role=\"img\"", "alt=\""
- PASS must_not_contain: no forbidden tokens found

### evals/tables/evals.json

- Skill: tables
- Status: PASS

#### Eval 1

- Status: PASS
- Score: 100%
- Response: responses/tables/all.md

- PASS must_contain_any: matched "<caption>", "scope=\"col\"", "scope=\"row\""
- PASS must_not_contain: no forbidden tokens found

#### Eval 2

- Status: PASS
- Score: 100%
- Response: responses/tables/all.md

- PASS must_contain_any: matched "scope=\"colgroup\"", "colspan=", "<thead>"
- PASS must_not_contain: no forbidden tokens found

#### Eval 3

- Status: PASS
- Score: 100%
- Response: responses/tables/all.md

- PASS must_contain_any: matched "headers=", "id=", "<caption>"
- PASS must_not_contain: no forbidden tokens found

#### Eval 4

- Status: PASS
- Score: 100%
- Response: responses/tables/all.md

- PASS must_contain_any: matched "grid", "<section"
- PASS must_not_contain: no forbidden tokens found

#### Eval 5

- Status: PASS
- Score: 100%
- Response: responses/tables/all.md

- PASS must_contain_any: matched "<caption>", "<thead>", "<tbody>"
- PASS must_not_contain: no forbidden tokens found

### evals/tooltips/evals.json

- Skill: tooltips
- Status: PASS

#### Eval 1

- Status: PASS
- Score: 100%
- Response: responses/tooltips/all.md

- PASS must_contain_any: matched "aria-describedby", "role=\"tooltip\"", "hidden"
- PASS must_not_contain: no forbidden tokens found

#### Eval 2

- Status: PASS
- Score: 100%
- Response: responses/tooltips/all.md

- PASS must_contain_any: matched "Escape", "hideTooltip", "hidden"
- PASS must_not_contain: no forbidden tokens found

#### Eval 3

- Status: PASS
- Score: 100%
- Response: responses/tooltips/all.md

- PASS must_contain_any: matched "aria-expanded", "aria-controls", "button"
- PASS must_not_contain: no forbidden tokens found

#### Eval 4

- Status: PASS
- Score: 100%
- Response: responses/tooltips/all.md

- PASS must_contain_any: matched "aria-label=\"Delete item\"", "aria-describedby", "aria-hidden=\"true\""
- PASS must_not_contain: no forbidden tokens found

#### Eval 5

- Status: PASS
- Score: 100%
- Response: responses/tooltips/all.md

- PASS must_contain_any: matched "prefers-reduced-motion", "transition", "role=\"tooltip\""
- PASS must_not_contain: no forbidden tokens found

### evals/touch-pointer/evals.json

- Skill: touch-pointer
- Status: PASS

#### Eval 1

- Status: PASS
- Score: 100%
- Response: responses/touch-pointer/all.md

- PASS must_contain_any: matched "<meta name=\"viewport\"", "width=device-width", "initial-scale=1"
- PASS must_not_contain: no forbidden tokens found

#### Eval 2

- Status: PASS
- Score: 100%
- Response: responses/touch-pointer/all.md

- PASS must_contain_any: matched "Zoom in", "Zoom out", "aria-label=\"Zoom in\""
- PASS must_not_contain: no forbidden tokens found

#### Eval 3

- Status: PASS
- Score: 100%
- Response: responses/touch-pointer/all.md

- PASS must_contain_any: matched "Move", "up", "down"
- PASS must_not_contain: no forbidden tokens found

#### Eval 4

- Status: PASS
- Score: 100%
- Response: responses/touch-pointer/all.md

- PASS must_contain_any: matched "44px", "min-width", "min-height"
- PASS must_not_contain: no forbidden tokens found

#### Eval 5

- Status: PASS
- Score: 100%
- Response: responses/touch-pointer/all.md

- PASS must_contain_any: matched "click", "mouseup", "touchend"
- PASS must_not_contain: no forbidden tokens found
