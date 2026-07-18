#!/bin/bash
# Sync check: Compare canonical examples in ACCESSIBILITY.md with accessibility-skills
#
# Usage:
#   ./sync-check.sh                    # check all skills
#   ./sync-check.sh --diff             # show diffs
#   ./sync-check.sh --skill light-dark-mode  # check one skill

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ACCESSIBILITY_SKILLS_DIR="$(dirname "$SCRIPT_DIR")"
ACCESSIBILITY_MD_DIR="$(dirname "$ACCESSIBILITY_SKILLS_DIR")/ACCESSIBILITY.md"

SHOW_DIFF=false
CHECK_SKILL=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --diff) SHOW_DIFF=true; shift ;;
    --skill) CHECK_SKILL="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

echo "=== Accessibility Skills Sync Check ==="
echo "Skills directory: $ACCESSIBILITY_SKILLS_DIR"
echo "Canonical source: $ACCESSIBILITY_MD_DIR"
echo ""

drift_count=0
synced_count=0
divergent=()

check_skill() {
  local skill="$1"
  local canonical_file="$2"

  local skill_file="${ACCESSIBILITY_SKILLS_DIR}/skills/${skill}/SKILL.md"
  local sync_file="${ACCESSIBILITY_SKILLS_DIR}/skills/${skill}/SYNC.md"

  if [[ ! -f "$skill_file" ]]; then
    echo "[MISSING] $skill - no SKILL.md found"
    return 1
  fi

  if [[ ! -f "$ACCESSIBILITY_MD_DIR/examples/$canonical_file" ]]; then
    echo "[ORPHAN]  $skill - canonical source not found: $canonical_file"
    return 1
  fi

  # Check for divergence note in SYNC.md
  local has_divergence=false
  if [[ -f "$sync_file" ]] && grep -qi "divergence\|diverge\|not.*sync\|enhanced" "$sync_file" 2>/dev/null; then
    has_divergence=true
  fi

  # Compare content (ignoring metadata like commit SHAs)
  local canonical_content
  local skill_content
  canonical_content=$(cat "$ACCESSIBILITY_MD_DIR/examples/$canonical_file")
  skill_content=$(cat "$skill_file")

  if diff -q <(echo "$canonical_content") <(echo "$skill_content") >/dev/null 2>&1; then
    echo "[SYNCED]  $skill"
    return 0
  else
    if $has_divergence; then
      echo "[DIVERGED] $skill (documented divergence)"
    else
      echo "[DRIFT]   $skill - content differs but not documented in SYNC.md"
    fi
    divergent+=("$skill")

    if $SHOW_DIFF; then
      diff --color=auto \
        "$ACCESSIBILITY_MD_DIR/examples/$canonical_file" \
        "$skill_file" | head -50
      echo ""
    fi
    return 1
  fi
}

# Skill to canonical file mapping
# Format: skill_name:canonical_file
SKILL_LIST=(
  "anchor-links:ANCHOR_LINKS_ACCESSIBILITY_BEST_PRACTICES.md"
  "aria-live-regions:ARIA_LIVE_REGIONS_ACCESSIBILITY_BEST_PRACTICES.md"
  "audio-video:AUDIO_VIDEO_ACCESSIBILITY_BEST_PRACTICES.md"
  "axe-rules:AXE_RULES_REFERENCE.md"
  "bug-reporting:ACCESSIBILITY_BUG_REPORTING_BEST_PRACTICES.md"
  "charts-graphs:CHARTS_GRAPHS_ACCESSIBILITY_BEST_PRACTICES.md"
  "ci-cd:CI_CD_ACCESSIBILITY_BEST_PRACTICES.md"
  "color-contrast:COLOR_CONTRAST_ACCESSIBILITY_BEST_PRACTICES.md"
  "content-design:CONTENT_DESIGN_ACCESSIBILITY_BEST_PRACTICES.md"
  "forms:FORMS_ACCESSIBILITY_BEST_PRACTICES.md"
  "image-alt-text:IMAGE_ALT_TEXT_ACCESSIBILITY_BEST_PRACTICES.md"
  "keyboard:KEYBOARD_ACCESSIBILITY_BEST_PRACTICES.md"
  "light-dark-mode:LIGHT_DARK_MODE_ACCESSIBILITY_BEST_PRACTICES.md"
  "manual-testing:MANUAL_ACCESSIBILITY_TESTING_GUIDE.md"
  "maps:MAPS_ACCESSIBILITY_BEST_PRACTICES.md"
  "mermaid:MERMAID_ACCESSIBILITY_BEST_PRACTICES.md"
  "navigation:NAVIGATION_ACCESSIBILITY_BEST_PRACTICES.md"
  "opquast-digital-quality:OPQUAST_DIGITAL_QUALITY_BEST_PRACTICES.md"
  "plain-language:PLAIN_LANGUAGE_ACCESSIBILITY_BEST_PRACTICES.md"
  "print:PRINT_ACCESSIBILITY_BEST_PRACTICES.md"
  "progressive-enhancement:PROGRESSIVE_ENHANCEMENT_BEST_PRACTICES.md"
  "svg:SVG_ACCESSIBILITY_BEST_PRACTICES.md"
  "tables:TABLES_ACCESSIBILITY_BEST_PRACTICES.md"
  "tooltips:TOOLTIP_ACCESSIBILITY_BEST_PRACTICES.md"
  "touch-pointer:TOUCH_POINTER_ACCESSIBILITY_BEST_PRACTICES.md"
  "user-personalization:USER_PERSONALIZATION_ACCESSIBILITY_BEST_PRACTICES.md"
)

for entry in "${SKILL_LIST[@]}"; do
  skill="${entry%%:*}"
  canonical_file="${entry##*:}"

  if [[ -n "$CHECK_SKILL" && "$skill" != "$CHECK_SKILL" ]]; then
    continue
  fi

  if check_skill "$skill" "$canonical_file"; then
    ((synced_count++))
  else
    ((drift_count++))
  fi
done

echo ""
echo "=== Summary ==="
echo "Synced: $synced_count"
echo "Drifted/Divergent: $drift_count"

if [[ ${#divergent[@]} -gt 0 ]]; then
  echo ""
  echo "Skills with differences:"
  for s in "${divergent[@]}"; do
    echo "  - $s"
  done
fi

echo ""
echo "To update a skill from canonical source:"
echo "  cp $ACCESSIBILITY_MD_DIR/examples/<SOURCE_FILE> <skill_dir>/SKILL.md"
echo ""
echo "To document intentional divergence:"
echo "  Add 'DIVERGENCE:' note to skills/<skill>/SYNC.md"
