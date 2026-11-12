#!/usr/bin/env bash
# Deterministic cross-repository sync check for accessibility-skills.
#
# Canonical source: examples/ (and, for the general skill, AGENTS.md) in
# mgifford/ACCESSIBILITY.md. This repository contains distilled derivatives.
# A skill is not expected to be textually identical to its canonical source.
#
# Usage:
#   ./scripts/sync-check.sh                    # check all skills
#   ./scripts/sync-check.sh --diff             # show canonical diffs for review items
#   ./scripts/sync-check.sh --skill keyboard   # check one skill
#   ./scripts/sync-check.sh --vocab            # check shared vocabulary sources
#   ./scripts/sync-check.sh --help
#
# Exit codes:
#   0  every checked item is synchronized or documented as not applicable
#   1  at least one item needs review (canonical changed, external review due,
#      or vocabulary changed)
#   2  configuration or repository error (missing file, orphan source, bad
#      metadata, non-git canonical checkout)
#
# This script does not call a model, a paid API, or the network.

set -u
set -o pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ACCESSIBILITY_SKILLS_DIR="$(dirname "$SCRIPT_DIR")"
# Override with ACCESSIBILITY_MD_DIR=/path/to/checkout in CI, where the
# canonical repository is not necessarily checked out as a sibling directory.
ACCESSIBILITY_MD_DIR="${ACCESSIBILITY_MD_DIR:-$(dirname "$ACCESSIBILITY_SKILLS_DIR")/ACCESSIBILITY.md}"
SKILLS_DIR="${ACCESSIBILITY_SKILLS_DIR}/skills"

SHOW_DIFF=false
CHECK_SKILL=""
CHECK_VOCAB=false

# Ignore dependency lockfiles when a canonical source is a directory. A
# lockfile-only bump is not a vocabulary or guidance change.
EXCLUDES=(
  ":(exclude,glob)**/package-lock.json"
  ":(exclude,glob)**/npm-shrinkwrap.json"
  ":(exclude,glob)**/yarn.lock"
  ":(exclude,glob)**/pnpm-lock.yaml"
)

usage() {
  cat <<'EOF'
Deterministic cross-repository sync check for accessibility-skills.

Canonical source: examples/ (and, for the general skill, AGENTS.md) in
mgifford/ACCESSIBILITY.md. This repository contains distilled derivatives.
A skill is not expected to be textually identical to its canonical source.

Usage:
  ./scripts/sync-check.sh                    # check all skills
  ./scripts/sync-check.sh --diff             # show canonical diffs for review items
  ./scripts/sync-check.sh --skill keyboard   # check one skill
  ./scripts/sync-check.sh --vocab            # check shared vocabulary sources
  ./scripts/sync-check.sh --help

Exit codes:
  0  every checked item is synchronized or documented as not applicable
  1  at least one item needs review (canonical changed, external review due,
     or vocabulary changed)
  2  configuration or repository error (missing file, orphan source, bad
     metadata, non-git canonical checkout)

This script does not call a model, a paid API, or the network.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --diff) SHOW_DIFF=true; shift ;;
    --skill)
      if [[ $# -lt 2 ]]; then
        echo "error: --skill requires a skill name" >&2
        exit 2
      fi
      CHECK_SKILL="$2"
      shift 2
      ;;
    --vocab) CHECK_VOCAB=true; shift ;;
    --help|-h) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 2 ;;
  esac
done

trim() {
  printf '%s' "$1" | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//'
}

strip_quotes() {
  printf '%s' "$1" | sed -E 's/^"(.*)"$/\1/'
}

get_field() {
  local file="$1"
  local key="$2"
  local line
  line=$(grep -m1 "^${key}:" "$file" 2>/dev/null || true)
  if [[ -z "$line" ]]; then
    return 1
  fi
  line="${line#*:}"
  line=$(trim "$line")
  strip_quotes "$line"
}

is_git_checkout() {
  [[ -d "${ACCESSIBILITY_MD_DIR}/.git" ]] || git -C "$ACCESSIBILITY_MD_DIR" rev-parse --git-dir >/dev/null 2>&1
}

latest_commit_for() {
  local path="$1"
  if [[ -d "${ACCESSIBILITY_MD_DIR}/${path}" ]]; then
    git -C "$ACCESSIBILITY_MD_DIR" log -1 --format=%H -- "$path" "${EXCLUDES[@]}" 2>/dev/null
  else
    git -C "$ACCESSIBILITY_MD_DIR" log -1 --format=%H -- "$path" 2>/dev/null
  fi
}

has_content_change() {
  local recorded="$1"
  local latest="$2"
  local path="$3"
  local changed
  if [[ -d "${ACCESSIBILITY_MD_DIR}/${path}" ]]; then
    changed=$(git -C "$ACCESSIBILITY_MD_DIR" diff --name-only "$recorded" "$latest" -- "$path" "${EXCLUDES[@]}" 2>/dev/null)
  else
    changed=$(git -C "$ACCESSIBILITY_MD_DIR" diff --name-only "$recorded" "$latest" -- "$path" 2>/dev/null)
  fi
  [[ -n "$changed" ]]
}

short_sha() {
  printf '%s' "$1" | cut -c1-12
}

# Print the "Consumed by" cell for a source in VOCABULARY_SYNC.md.
vocab_consumers() {
  local vocab_file="$1"
  local path="$2"
  local row
  row=$(grep -F "| \`${path}\`" "$vocab_file" | head -1 || true)
  if [[ -z "$row" ]]; then
    return 0
  fi
  printf '%s\n' "$row" | awk -F'|' '{print $4}' | grep -o '`[^`]*`' | tr -d '`' | tr ',' '\n' | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//' | grep -v '^$'
}

check_vocab() {
  local vocab_file="${ACCESSIBILITY_SKILLS_DIR}/VOCABULARY_SYNC.md"
  local vocab_review=0
  local vocab_synced=0
  local vocab_errors=0

  if [[ ! -f "$vocab_file" ]]; then
    echo "[MISSING] VOCABULARY_SYNC.md not found at $vocab_file"
    return 2
  fi

  if ! is_git_checkout; then
    echo "[UNKNOWN] $ACCESSIBILITY_MD_DIR is not a git checkout; cannot compare commits"
    return 2
  fi

  echo "=== Shared Vocabulary Sync Check ==="
  echo "See VOCABULARY_SYNC.md for the consumer mapping."
  echo ""

  while IFS=: read -r raw_path raw_sha; do
    vocab_path=$(trim "$raw_path")
    recorded_sha=$(strip_quotes "$(trim "$raw_sha")")
    recorded_sha=$(printf '%s' "$recorded_sha" | tr -d '",' | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//')

    [[ -z "$vocab_path" || -z "$recorded_sha" ]] && continue

    if [[ ! -e "${ACCESSIBILITY_MD_DIR}/${vocab_path}" ]]; then
      echo "[VOCAB ORPHAN] $vocab_path - not found in $ACCESSIBILITY_MD_DIR"
      vocab_errors=$((vocab_errors + 1))
      continue
    fi

    latest_sha=$(latest_commit_for "$vocab_path")
    if [[ -z "$latest_sha" ]]; then
      echo "[VOCAB UNKNOWN] $vocab_path - could not determine the latest commit"
      vocab_errors=$((vocab_errors + 1))
      continue
    fi

    if [[ "$latest_sha" == "$recorded_sha" ]] || { git -C "$ACCESSIBILITY_MD_DIR" cat-file -e "${recorded_sha}^{commit}" 2>/dev/null && ! has_content_change "$recorded_sha" "$latest_sha" "$vocab_path"; }; then
      echo "[VOCAB SYNCED]  $vocab_path (unchanged since $(short_sha "$recorded_sha"))"
      vocab_synced=$((vocab_synced + 1))
      continue
    fi

    echo "[VOCAB REVIEW REQUIRED] $vocab_path changed: recorded=$(short_sha "$recorded_sha") latest=$(short_sha "$latest_sha")"
    consumers=$(vocab_consumers "$vocab_file" "$vocab_path")
    if [[ -n "$consumers" ]]; then
      echo "               Review every listed consumer:"
      while IFS= read -r consumer; do
        if [[ -e "${ACCESSIBILITY_SKILLS_DIR}/${consumer}" ]]; then
          echo "               - $consumer"
        else
          echo "               - $consumer [MISSING CONSUMER PATH]"
          vocab_errors=$((vocab_errors + 1))
        fi
      done <<< "$consumers"
    else
      echo "               No consumer row found in VOCABULARY_SYNC.md."
      vocab_errors=$((vocab_errors + 1))
    fi
    vocab_review=$((vocab_review + 1))
  done < <(sed -n '/^vocab_sync:/,/^```/p' "$vocab_file" | grep -E '^[[:space:]]+examples/')

  echo ""
  echo "=== Vocabulary Summary ==="
  echo "Synced: $vocab_synced"
  echo "Review required: $vocab_review"
  echo "Configuration errors: $vocab_errors"

  if [[ $vocab_errors -gt 0 ]]; then
    return 2
  fi
  if [[ $vocab_review -gt 0 ]]; then
    return 1
  fi
  return 0
}

print_diff() {
  local recorded="$1"
  local latest="$2"
  local path="$3"
  local label="$4"
  echo ""
  echo "--- $label diff: $(short_sha "$recorded")..$(short_sha "$latest") ($path) ---"
  if [[ -d "${ACCESSIBILITY_MD_DIR}/${path}" ]]; then
    git -C "$ACCESSIBILITY_MD_DIR" diff --stat "$recorded" "$latest" -- "$path" "${EXCLUDES[@]}" 2>/dev/null
    if $SHOW_DIFF; then
      git -C "$ACCESSIBILITY_MD_DIR" diff "$recorded" "$latest" -- "$path" "${EXCLUDES[@]}" 2>/dev/null | head -200
    fi
  else
    git -C "$ACCESSIBILITY_MD_DIR" diff --stat "$recorded" "$latest" -- "$path" 2>/dev/null
    if $SHOW_DIFF; then
      git -C "$ACCESSIBILITY_MD_DIR" diff "$recorded" "$latest" -- "$path" 2>/dev/null | head -200
    fi
  fi
  echo ""
}

check_skill() {
  local sync_file="$1"
  local skill
  skill=$(basename "$(dirname "$sync_file")")
  local skill_dir="${SKILLS_DIR}/${skill}"
  local skill_file="${skill_dir}/SKILL.md"

  local canonical_source
  local last_synced_commit
  local last_synced_date
  local last_reviewed_commit
  local review_decision
  local sync_mode
  local review_after

  canonical_source=$(get_field "$sync_file" "canonical_source" || true)
  last_synced_commit=$(get_field "$sync_file" "last_synced_commit" || true)
  last_synced_date=$(get_field "$sync_file" "last_synced_date" || true)
  last_reviewed_commit=$(get_field "$sync_file" "last_reviewed_commit" || true)
  review_decision=$(get_field "$sync_file" "review_decision" || true)
  sync_mode=$(get_field "$sync_file" "sync_mode" || true)
  review_after=$(get_field "$sync_file" "review_after" || true)

  sync_mode="${sync_mode:-canonical}"

  if [[ ! -f "$skill_file" ]]; then
    echo "[MISSING SKILL] $skill - no SKILL.md found at $skill_file"
    return 2
  fi

  if [[ -z "$last_synced_date" ]] || ! [[ "$last_synced_date" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
    echo "[STALE METADATA] $skill - last_synced_date must be present and use YYYY-MM-DD (got '${last_synced_date:-missing}')"
    return 2
  fi

  if [[ "$sync_mode" == "not-applicable" ]]; then
    local reason
    reason=$(get_field "$sync_file" "not_applicable_reason" || true)
    if [[ -z "$reason" ]]; then
      echo "[MISMATCH] $skill - sync_mode is not-applicable but no not_applicable_reason is recorded"
      return 2
    fi
    echo "[N/A]     $skill - no canonical prose source; $reason"
    return 0
  fi

  if [[ "$sync_mode" == "external" ]]; then
    local external_url
    external_url=$(get_field "$sync_file" "external_url" || true)
    if [[ -z "$external_url" ]]; then
      echo "[MISMATCH] $skill - sync_mode is external but no external_url is recorded"
      return 2
    fi
    if [[ -n "$review_after" ]]; then
      local today
      today=$(date -u +%Y-%m-%d)
      if [[ "$today" > "$review_after" || "$today" == "$review_after" ]]; then
        echo "[EXTERNAL REVIEW DUE] $skill - external source review was due $review_after ($external_url)"
        return 1
      fi
    fi
    echo "[EXTERNAL] $skill - external source; not compared to a local checkout ($external_url)"
    return 0
  fi

  if [[ -z "$canonical_source" ]]; then
    echo "[MISSING] $skill - SYNC.md has no canonical_source"
    return 2
  fi

  if [[ ! -e "${ACCESSIBILITY_MD_DIR}/${canonical_source}" ]]; then
    echo "[ORPHAN]  $skill - canonical source not found: $canonical_source"
    return 2
  fi

  if ! is_git_checkout; then
    echo "[UNKNOWN] $skill - $ACCESSIBILITY_MD_DIR is not a git checkout; cannot compare commits"
    return 2
  fi

  local latest_commit
  latest_commit=$(latest_commit_for "$canonical_source")
  if [[ -z "$latest_commit" ]]; then
    echo "[UNKNOWN] $skill - could not determine the latest commit touching $canonical_source"
    return 2
  fi

  # A recorded review of the current canonical commit is the strongest signal.
  if [[ -n "$last_reviewed_commit" && "$last_reviewed_commit" == "$latest_commit" ]]; then
    case "$review_decision" in
      updated)
        if [[ "$last_synced_commit" != "$latest_commit" ]]; then
          echo "[INCONSISTENT] $skill - review_decision is 'updated' but last_synced_commit ($(short_sha "$last_synced_commit")) is not the reviewed commit ($(short_sha "$latest_commit"))"
          return 2
        fi
        echo "[SYNCED]  $skill - content updated and reviewed at $(short_sha "$latest_commit")"
        return 0
        ;;
      no-update-needed)
        echo "[SYNCED]  $skill - reviewed at $(short_sha "$latest_commit"); no skill update needed"
        return 0
        ;;
      further-review-required)
        echo "[REVIEW REQUIRED] $skill - reviewer recorded that further review is required at $(short_sha "$latest_commit")"
        print_diff "$last_synced_commit" "$latest_commit" "$canonical_source" "$skill"
        return 1
        ;;
      *)
        echo "[REVIEW REQUIRED] $skill - latest canonical commit was reviewed but review_decision is missing or invalid"
        return 1
        ;;
    esac
  fi

  if [[ -z "$last_synced_commit" ]]; then
    echo "[MISSING] $skill - SYNC.md has no last_synced_commit"
    return 2
  fi

  if [[ "$last_synced_commit" == "$latest_commit" ]]; then
    echo "[SYNCED]  $skill - canonical source unchanged since $(short_sha "$latest_commit")"
    return 0
  fi

  if git -C "$ACCESSIBILITY_MD_DIR" cat-file -e "${last_synced_commit}^{commit}" 2>/dev/null; then
    if ! has_content_change "$last_synced_commit" "$latest_commit" "$canonical_source"; then
      echo "[SYNCED]  $skill - no content change to $canonical_source between $(short_sha "$last_synced_commit") and $(short_sha "$latest_commit")"
      return 0
    fi
    echo "[REVIEW REQUIRED] $skill - canonical source changed: last_synced_commit=$(short_sha "$last_synced_commit") latest=$(short_sha "$latest_commit") ($canonical_source)"
    echo "               Record a review decision in SYNC.md: update the skill, document no-update-needed, or mark further-review-required. Do not copy the full canonical guide over the distilled skill."
    print_diff "$last_synced_commit" "$latest_commit" "$canonical_source" "$skill"
    return 1
  fi

  echo "[REVIEW REQUIRED] $skill - last_synced_commit $(short_sha "$last_synced_commit") is not present in this checkout; fetch full history and review $canonical_source at $(short_sha "$latest_commit")"
  return 2
}

if $CHECK_VOCAB; then
  check_vocab
  exit $?
fi

if [[ ! -d "$SKILLS_DIR" ]]; then
  echo "[MISSING] skills directory not found: $SKILLS_DIR" >&2
  exit 2
fi

if ! is_git_checkout; then
  echo "[UNKNOWN] $ACCESSIBILITY_MD_DIR is not a git checkout; cannot compare commits" >&2
  exit 2
fi

echo "=== Accessibility Skills Sync Check ==="
echo "Skills directory: $ACCESSIBILITY_SKILLS_DIR"
echo "Canonical source: $ACCESSIBILITY_MD_DIR"
echo ""

synced_count=0
review_count=0
na_count=0
external_count=0
error_count=0
review_items=()
error_items=()

found_any=false
for sync_file in "$SKILLS_DIR"/*/SYNC.md; do
  [[ -e "$sync_file" ]] || continue
  skill=$(basename "$(dirname "$sync_file")")
  if [[ -n "$CHECK_SKILL" && "$skill" != "$CHECK_SKILL" ]]; then
    continue
  fi
  found_any=true

  check_skill "$sync_file"
  status=$?
  case $status in
    0)
      # Distinguish N/A and external in the counters for the summary.
      if grep -q '^sync_mode: not-applicable' "$sync_file"; then
        na_count=$((na_count + 1))
      elif grep -q '^sync_mode: external' "$sync_file"; then
        external_count=$((external_count + 1))
      else
        synced_count=$((synced_count + 1))
      fi
      ;;
    1) review_count=$((review_count + 1)); review_items+=("$skill") ;;
    2) error_count=$((error_count + 1)); error_items+=("$skill") ;;
  esac
done

if ! $found_any; then
  if [[ -n "$CHECK_SKILL" ]]; then
    echo "[MISSING] no SYNC.md found for skill '$CHECK_SKILL'"
  else
    echo "[MISSING] no skills/*/SYNC.md files found"
  fi
  exit 2
fi

# Detect a skill directory that has no SYNC.md. Without this check, a new skill
# could silently escape review because the loop only visits existing SYNC.md
# files.
for skill_file in "$SKILLS_DIR"/*/SKILL.md; do
  [[ -e "$skill_file" ]] || continue
  skill=$(basename "$(dirname "$skill_file")")
  if [[ -n "$CHECK_SKILL" && "$skill" != "$CHECK_SKILL" ]]; then
    continue
  fi
  if [[ ! -f "${SKILLS_DIR}/${skill}/SYNC.md" ]]; then
    echo "[MISSING SYNC] $skill - SKILL.md exists but no SYNC.md records its canonical source"
    error_count=$((error_count + 1))
    error_items+=("$skill")
  fi
done

echo ""
echo "=== Summary ==="
echo "Synced: $synced_count"
echo "Not applicable: $na_count"
echo "External (not compared): $external_count"
echo "Review required: $review_count"
echo "Configuration errors: $error_count"

if [[ ${#review_items[@]} -gt 0 ]]; then
  echo ""
  echo "Skills needing a documented decision:"
  for s in "${review_items[@]}"; do
    echo "  - $s"
  done
fi

if [[ ${#error_items[@]} -gt 0 ]]; then
  echo ""
  echo "Skills with configuration or source errors:"
  for s in "${error_items[@]}"; do
    echo "  - $s"
  done
fi

echo ""
echo "To record a review decision:"
echo "  1. Review the canonical diff and update skills/<name>/SKILL.md only where needed."
echo "  2. Add or update last_reviewed_commit, review_decision, and last_synced_commit in skills/<name>/SYNC.md."
echo "     review_decision: updated | no-update-needed | further-review-required"
echo "  3. Keep the skill concise; never copy the full canonical guide over the distillation."
echo ""

if [[ $error_count -gt 0 ]]; then
  exit 2
fi
if [[ $review_count -gt 0 ]]; then
  exit 1
fi
exit 0
