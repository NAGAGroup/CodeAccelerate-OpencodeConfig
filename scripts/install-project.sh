#!/usr/bin/env bash
# install-project.sh — Install OAC project-specific components into .opencode/
#
# Run this in any project where you want to use OpenCode.
# Safe to re-run: existing project files are preserved via backup/restore.
#
# What this does:
#   1. Backs up existing .opencode/ to .opencode.tmp/
#   2. Installs the full OAC developer profile into ./.opencode/
#   3. Removes files tracked in the global config (~/.config/opencode) —
#      those are provided at runtime via symlink, not stored per-project
#   4. Restores your original .opencode/ files on top (preserving your work)
#   5. Cleans up the backup
#
# Usage (from your project root):
#   bash /path/to/CodeAccelerate-OpencodeConfig/scripts/install-project.sh
#
# Or via curl (no clone needed):
#   curl -fsSL https://raw.githubusercontent.com/YOUR_USER/CodeAccelerate-OpencodeConfig/main/scripts/install-project.sh | bash

set -euo pipefail

OAC_INSTALL_URL="https://raw.githubusercontent.com/darrenhinde/OpenAgentsControl/main/install.sh"
LOCAL_DIR="./.opencode"
BACKUP_DIR="./.opencode.tmp"
GLOBAL_CONFIG_DIR="$HOME/.config/opencode"

# ── Backup existing .opencode/ ─────────────────────────────────────────────────

mkdir -p "$LOCAL_DIR"

echo "→ Backing up existing $LOCAL_DIR to $BACKUP_DIR..."
cp -r "$LOCAL_DIR" "$BACKUP_DIR"
mkdir -p "$LOCAL_DIR"

# ── Install ────────────────────────────────────────────────────────────────────

echo "→ Installing OAC developer profile to $LOCAL_DIR..."
curl -fsSL "$OAC_INSTALL_URL" | bash -s developer --install-dir "$LOCAL_DIR"

# ── Remove globally-tracked files ─────────────────────────────────────────────
# Use git ls-files on the global config repo — git has already resolved all
# .gitignore semantics for us, giving an exact list of tracked files to remove.

echo ""
echo "→ Removing globally-tracked files from $LOCAL_DIR..."

if git -C "$GLOBAL_CONFIG_DIR" rev-parse --is-inside-work-tree &>/dev/null; then
  git -C "$GLOBAL_CONFIG_DIR" ls-files | while IFS= read -r rel_path; do
    target="$LOCAL_DIR/$rel_path"
    if [ -e "$target" ] || [ -L "$target" ]; then
      echo "  removing: $rel_path"
      rm -rf "$target"
    fi
  done
else
  echo "  WARNING: ~/.config/opencode is not a git repo."
  echo "  Make sure your global config is set up first (see scripts/install-global.sh)."
  echo "  Skipping global file removal."
fi

# Clean up empty directories left behind
find "$LOCAL_DIR" -type d -empty -delete 2>/dev/null || true

# ── Restore original files ─────────────────────────────────────────────────────

echo ""
echo "→ Restoring original $LOCAL_DIR files from backup..."
if [ -d "$BACKUP_DIR" ] && [ "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]; then
  cp -r "$BACKUP_DIR/." "$LOCAL_DIR/"
fi

rm -rf "$BACKUP_DIR"

echo ""
echo "✓ Project install complete."
echo "  Global config (~/.config/opencode) provides the rest."
echo "  Re-run this script any time to pull in new OAC components."
