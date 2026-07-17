# Keyboard and Motor Access Perspective

## Scope

Examine how interactive elements and workflows are accessed by people who use keyboards, switch devices, voice control, or other non-pointer input methods.

## Common Barriers

- Interactive elements not reachable or activatable by keyboard
- Keyboard traps with no escape mechanism
- Missing or invisible focus indicators
- Focus order that does not follow logical reading and interaction sequence
- Custom key bindings that conflict with assistive technology shortcuts
- Touch-only gestures with no keyboard or single-pointer alternative
- Target sizes below 24x24 CSS pixels (below 44x44 recommended)
- Modals or dialogs that do not trap focus or return focus on close

## Relevant Topic Skills

- `keyboard` — keyboard traps, focus order, focus visibility, roving tabindex
- `touch-pointer` — target size, pointer cancellation, gesture alternatives
- `forms` — keyboard-operable form controls, error navigation
- `navigation` — menu keyboard patterns, skip links
- `tooltips` — keyboard-triggerable tooltips, dismissibility

## Questions to Ask

1. Can every interactive element be reached and activated using only a keyboard?
2. Is there a visible focus indicator on every focusable element?
3. Does tab order follow a logical sequence?
4. Are there any keyboard traps (except intentional modal traps with Escape)?
5. Do composite widgets (tabs, menus, toolbars) use the correct keyboard patterns per APG?
6. Are touch targets at least 24x24 CSS pixels?
7. Do gesture-based interactions have single-pointer or keyboard alternatives?

## Evidence That Can Be Gathered Automatically

- Missing `tabindex` on interactive elements (axe-core `tabindex` rules)
- Focus indicator absence detected via CSS analysis
- Target size violations (axe-core `target-size`)
- `user-scalable=no` in viewport meta

## Evidence That Requires Manual Testing

- Actual tab-through of the entire interface to confirm logical order
- Verification that focus indicators are visible in both light and dark modes
- Confirmation that keyboard patterns match APG expectations for each widget type
- Testing with switch access or voice control to confirm motor accessibility

## When Direct Research with Disabled Users Is Needed

- When custom interaction patterns deviate from APG guidance and it is unclear whether the model is learnable
- When the interface relies on precise timing or rapid interactions that may exclude motor-impaired users
- When multiple input modalities interact (e.g., keyboard + voice) in ways that cannot be predicted

## Common False Assumptions

- "If it works with a mouse, it works with a keyboard." Mouse-hover interactions, drag-and-drop, and hover-revealed content often have no keyboard equivalent.
- "Focus-visible CSS is enough." The indicator must also meet contrast requirements and be visible in forced-colours mode.
- "Keyboard testing means pressing Tab once." Full keyboard testing requires activating every control with the correct key per its widget type.

## Limitations of AI Analysis

- AI can check for the presence of `tabindex` and `role` attributes but cannot confirm that the actual keyboard interaction works as intended.
- AI cannot verify that focus indicators are visually prominent enough for a specific user's needs.
- AI cannot confirm that switch access or voice control workflows are viable.
- AI cannot detect timing-related barriers without simulating interaction speed.

## Escalation Triggers

- Custom widget with no APG pattern and uncertain keyboard model
- Interface requiring simultaneous key presses or precise timing
- Drag-and-drop interaction with no keyboard alternative
- Focus management that depends on JavaScript timing or animation

## ARRM Task Relevance

This perspective informs findings related to:

- INP tasks (input device accessibility)
- NAV tasks (navigation patterns)
- FCS tasks (focus and cursor management)
- UIE tasks (user interface events)

This perspective does not assign ownership. ARRM role assignments determine ownership.
