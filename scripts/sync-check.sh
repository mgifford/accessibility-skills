#!/bin/bash
# Sync check: Compare canonical examples in ACCESSIBILITY.md with accessibility-skills
#
# Usage:
#   ./sync-check.sh                    # check all skills
#   ./sync-check.sh --diff             # show diffs
#   ./sync-check.sh --skill light-dark-mode  # check one skill
#   ./sync-check.sh --vocab            # check shared vocabulary sources (see VOCABULARY_SYNC.md)

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ACCESSIBILITY_SKILLS_DIR="$(dirname "$SCRIPT_DIR")"
# Override with ACCESSIBILITY_MD_DIR=/path/to/checkout for CI, where the
# canonical repo is not necessarily checked out as a sibling directory.
ACCESSIBILITY_MD_DIR="${ACCESSIBILITY_MD_DIR:-$(dirname "$ACCESSIBILITY_SKILLS_DIR")/ACCESSIBILITY.md}"

SHOW_DIFF=false
CHECK_SKILL=""
CHECK_VOCAB=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --diff) SHOW_DIFF=true; shift ;;
    --skill) CHECK_SKILL="$2"; shift 2 ;;
    --vocab) CHECK_VOCAB=true; shift ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# --vocab: check shared vocabulary sources (terminology, lifecycle states,
# the finding schema, and policy classification) that several skills
# reference without being any one skill's primary canonical_source. See
# VOCABULARY_SYNC.md for the full mapping and rationale. This is additive
# to, and independent of, the per-skill checks below.
if $CHECK_VOCAB; then
  VOCAB_FILE="${ACCESSIBILITY_SKILLS_DIR}/VOCABULARY_SYNC.md"

  if [[ ! -f "$VOCAB_FILE" ]]; then
    echo "[MISSING] VOCABULARY_SYNC.md not found at $VOCAB_FILE"
    exit 1
  fi

  if [[ ! -d "$ACCESSIBILITY_MD_DIR/.git" ]]; then
    echo "[UNKNOWN] $ACCESSIBILITY_MD_DIR is not a git checkout; cannot compare commits"
    exit 1
  fi

  echo "=== Shared Vocabulary Sync Check ==="
  echo "See VOCABULARY_SYNC.md for the consumer mapping."
  echo ""

  vocab_drift=0

  # Parse "  <path>: \"<sha>\"" lines from the vocab_sync YAML block in
  # VOCABULARY_SYNC.md. This is a simple line-oriented parse, not a full
  # YAML parser, matching this repo's existing SYNC.md parsing approach.
  while IFS=: read -r raw_path raw_sha; do
    vocab_path=$(echo "$raw_path" | xargs)
    recorded_sha=$(echo "$raw_sha" | tr -d '",' | xargs)

    [[ -z "$vocab_path" || -z "$recorded_sha" ]] && continue

    if [[ ! -e "$ACCESSIBILITY_MD_DIR/$vocab_path" ]]; then
      echo "[ORPHAN]  $vocab_path - not found in $ACCESSIBILITY_MD_DIR"
      ((vocab_drift++))
      continue
    fi

    latest_sha=$(git -C "$ACCESSIBILITY_MD_DIR" log -1 --format=%H -- "$vocab_path" 2>/dev/null)

    if [[ -z "$latest_sha" ]]; then
      echo "[UNKNOWN] $vocab_path - could not determine latest commit"
      ((vocab_drift++))
      continue
    fi

    if [[ "$latest_sha" == "$recorded_sha" ]]; then
      echo "[SYNCED]  $vocab_path (unchanged since $recorded_sha)"
      continue
    fi

    if git -C "$ACCESSIBILITY_MD_DIR" cat-file -e "${recorded_sha}^{commit}" 2>/dev/null; then
      changed=$(git -C "$ACCESSIBILITY_MD_DIR" diff --name-only "$recorded_sha" "$latest_sha" -- "$vocab_path" 2>/dev/null)
      if [[ -z "$changed" ]]; then
        echo "[SYNCED]  $vocab_path (no content change between $recorded_sha and $latest_sha)"
        continue
      fi
    fi

    echo "[VOCAB REVIEW] $vocab_path changed: recorded=$recorded_sha latest=$latest_sha"
    echo "               Review every consumer skill listed for this source in VOCABULARY_SYNC.md,"
    echo "               not only the skill that prompted the change."
    ((vocab_drift++))
  done < <(sed -n '/^vocab_sync:/,/^```/p' "$VOCAB_FILE" | grep -E '^\s+examples/')

  echo ""
  echo "=== Vocabulary Summary ==="
  if [[ $vocab_drift -eq 0 ]]; then
    echo "All shared vocabulary sources unchanged since their recorded sync point."
  else
    echo "$vocab_drift shared vocabulary source(s) need review. See VOCABULARY_SYNC.md."
  fi

  exit $((vocab_drift > 0 ? 1 : 0))
fi

echo "=== Accessibility Skills Sync Check ==="
echo "Skills directory: $ACCESSIBILITY_SKILLS_DIR"
echo "Canonical source: $ACCESSIBILITY_MD_DIR"
echo ""

drift_count=0
synced_count=0
divergent=()

# Exact-commit sync check: reads canonical_source/last_synced_commit from
# the skill's own SYNC.md, finds the most recent commit that actually
# touched that canonical file in the ACCESSIBILITY.md checkout, and reports
# whether the skill's recorded sync point is still current. This detects
# semantic drift the plain content diff below cannot: this skill's SKILL.md
# intentionally differs in format/presentation from the canonical prose
# (see its SYNC.md DIVERGENCE note), so a raw diff is expected to always
# show "different" and is not a meaningful drift signal for this skill.
check_skill_exact_commit() {
  local skill="$1"
  local canonical_file="$2"

  local skill_file="${ACCESSIBILITY_SKILLS_DIR}/skills/${skill}/SKILL.md"
  local sync_file="${ACCESSIBILITY_SKILLS_DIR}/skills/${skill}/SYNC.md"
  local canonical_path="examples/${canonical_file}"

  if [[ ! -f "$skill_file" ]]; then
    echo "[MISSING] $skill - no SKILL.md found"
    return 1
  fi

  if [[ ! -f "$sync_file" ]]; then
    echo "[MISSING] $skill - no SYNC.md found; cannot determine last_synced_commit"
    return 1
  fi

  if [[ ! -d "$ACCESSIBILITY_MD_DIR/.git" ]]; then
    echo "[UNKNOWN] $skill - $ACCESSIBILITY_MD_DIR is not a git checkout; cannot compare commits"
    return 1
  fi

  if [[ ! -f "$ACCESSIBILITY_MD_DIR/$canonical_path" ]]; then
    echo "[ORPHAN]  $skill - canonical source not found: $canonical_path"
    return 1
  fi

  local recorded_source
  local recorded_commit
  recorded_source=$(grep -m1 '^canonical_source:' "$sync_file" | sed -E 's/^canonical_source:\s*//' | tr -d '"' | xargs)
  recorded_commit=$(grep -m1 '^last_synced_commit:' "$sync_file" | sed -E 's/^last_synced_commit:\s*//' | tr -d '"' | xargs)

  if [[ -z "$recorded_commit" ]]; then
    echo "[MISSING] $skill - SYNC.md has no last_synced_commit"
    return 1
  fi

  if [[ -n "$recorded_source" && "$recorded_source" != "$canonical_path" ]]; then
    echo "[MISMATCH] $skill - SYNC.md canonical_source ($recorded_source) does not match expected ($canonical_path)"
  fi

  local latest_commit
  latest_commit=$(git -C "$ACCESSIBILITY_MD_DIR" log -1 --format=%H -- "$canonical_path" 2>/dev/null)

  if [[ -z "$latest_commit" ]]; then
    echo "[UNKNOWN] $skill - could not determine the latest commit touching $canonical_path"
    return 1
  fi

  if [[ "$latest_commit" == "$recorded_commit" ]]; then
    echo "[SYNCED]  $skill (canonical source unchanged since $recorded_commit)"
    return 0
  fi

  # Not equal is only meaningful if recorded_commit is actually an ancestor
  # of (or equal to) latest_commit in this checkout; if it isn't found at
  # all, still report needs-review rather than silently passing.
  if git -C "$ACCESSIBILITY_MD_DIR" cat-file -e "${recorded_commit}^{commit}" 2>/dev/null; then
    local changed_files
    changed_files=$(git -C "$ACCESSIBILITY_MD_DIR" diff --name-only "$recorded_commit" "$latest_commit" -- "$canonical_path" 2>/dev/null)
    if [[ -z "$changed_files" ]]; then
      echo "[SYNCED]  $skill (no content change to $canonical_path between $recorded_commit and $latest_commit)"
      return 0
    fi
  fi

  echo "[NEEDS REVIEW] $skill - canonical source changed: last_synced_commit=$recorded_commit, latest=$latest_commit ($canonical_path)"
  echo "               Review the canonical diff and update SKILL.md deliberately; do not copy the full canonical guide over the distilled skill."
  return 1
}

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
  "aria-live-regions:ARIA_LIVE_REGIONS_BEST_PRACTICES.md"
  "audio-video:AUDIO_VIDEO_ACCESSIBILITY_BEST_PRACTICES.md"
  "axe-rules:AXE_RULES_REFERENCE.md"
  "behavioral-a11y:BEHAVIORAL_ACCESSIBILITY_AUTOMATION.md"
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
  "speech-recognition:SPEECH_RECOGNITION_ACCESSIBILITY_BEST_PRACTICES.md"
  "svg:SVG_ACCESSIBILITY_BEST_PRACTICES.md"
  "tables:TABLES_ACCESSIBILITY_BEST_PRACTICES.md"
  "tooltips:TOOLTIP_ACCESSIBILITY_BEST_PRACTICES.md"
  "touch-pointer:TOUCH_POINTER_ACCESSIBILITY_BEST_PRACTICES.md"
  "user-personalization:USER_PERSONALIZATION_ACCESSIBILITY_BEST_PRACTICES.md"
)

# Skills using the exact-commit check instead of the raw content diff.
# Add a skill here once its SYNC.md documents a stable, intentional
# presentation divergence, so a content diff would only ever report noise.
EXACT_COMMIT_SKILLS=(
  "bug-reporting"
)

uses_exact_commit_check() {
  local skill="$1"
  for candidate in "${EXACT_COMMIT_SKILLS[@]}"; do
    if [[ "$candidate" == "$skill" ]]; then
      return 0
    fi
  done
  return 1
}

for entry in "${SKILL_LIST[@]}"; do
  skill="${entry%%:*}"
  canonical_file="${entry##*:}"

  if [[ -n "$CHECK_SKILL" && "$skill" != "$CHECK_SKILL" ]]; then
    continue
  fi

  if uses_exact_commit_check "$skill"; then
    if check_skill_exact_commit "$skill" "$canonical_file"; then
      ((synced_count++))
    else
      ((drift_count++))
      divergent+=("$skill")
    fi
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
