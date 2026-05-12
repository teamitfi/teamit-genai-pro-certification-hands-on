#!/usr/bin/env bash
# Blocks repository operations from touching sensitive local/runtime files.

set -euo pipefail

usage() {
  cat >&2 <<'USAGE'
usage:
  scripts/sensitive-file-guard.sh --staged
  scripts/sensitive-file-guard.sh --range BASE..HEAD
  scripts/sensitive-file-guard.sh --ref REF
  scripts/sensitive-file-guard.sh --path PATH [PATH...]

Checks paths against the repo's sensitive-file block list:
  .env, .env.*, secrets/, production config files, and SQLite database files.
USAGE
}

blocked_reason() {
  local path="${1#./}"

  case "$path" in
    .env|.env.*|*/.env|*/.env.*)
      printf '%s\n' '.env file'
      return 0
      ;;
    secrets|secrets/*|*/secrets|*/secrets/*)
      printf '%s\n' 'secrets directory'
      return 0
      ;;
    *.prod.*|production.*|*/production.*|config/production.*|*/config/production.*)
      printf '%s\n' 'production config'
      return 0
      ;;
    *.db|*.sqlite|*.sqlite3)
      printf '%s\n' 'SQLite database file'
      return 0
      ;;
  esac

  return 1
}

check_path() {
  local path="$1"
  local reason

  [ -n "$path" ] || return 0

  if reason="$(blocked_reason "$path")"; then
    printf 'sensitive-file guard: blocked %s (%s)\n' "$path" "$reason" >&2
    return 1
  fi

  return 0
}

check_staged_paths() {
  local blocked=0
  local path

  while IFS= read -r -d '' path; do
    if ! check_path "$path"; then
      blocked=1
    fi
  done < <(git diff --cached --name-only -z --diff-filter=ACMR)

  if [ "$blocked" -ne 0 ]; then
    cat >&2 <<'MESSAGE'
sensitive-file guard: refusing commit. Use a non-sensitive fixture, a redacted
copy, or repo instructions that avoid blocked files.
MESSAGE
    return 1
  fi
}

check_diff_range() {
  local range="$1"
  local blocked=0
  local path

  while IFS= read -r -d '' path; do
    if ! check_path "$path"; then
      blocked=1
    fi
  done < <(git diff --name-only -z --diff-filter=ACMR "$range")

  if [ "$blocked" -ne 0 ]; then
    printf 'sensitive-file guard: refusing range %s.\n' "$range" >&2
    return 1
  fi
}

check_ref_tree() {
  local ref="$1"
  local blocked=0
  local path

  while IFS= read -r -d '' path; do
    if ! check_path "$path"; then
      blocked=1
    fi
  done < <(git ls-tree -r -z --name-only "$ref")

  if [ "$blocked" -ne 0 ]; then
    printf 'sensitive-file guard: refusing ref %s.\n' "$ref" >&2
    return 1
  fi
}

case "${1:-}" in
  --staged)
    shift
    [ "$#" -eq 0 ] || {
      usage
      exit 2
    }
    check_staged_paths
    ;;
  --range)
    shift
    [ "$#" -eq 1 ] || {
      usage
      exit 2
    }
    check_diff_range "$1"
    ;;
  --ref)
    shift
    [ "$#" -eq 1 ] || {
      usage
      exit 2
    }
    check_ref_tree "$1"
    ;;
  --path)
    shift
    [ "$#" -gt 0 ] || {
      usage
      exit 2
    }
    blocked=0
    for path in "$@"; do
      if ! check_path "$path"; then
        blocked=1
      fi
    done
    exit "$blocked"
    ;;
  *)
    usage
    exit 2
    ;;
esac
