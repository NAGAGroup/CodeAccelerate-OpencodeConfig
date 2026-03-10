#!/usr/bin/env bash
# install-global.sh — Install OAC developer profile into global opencode config
#
# Run this once on a new machine, and re-run any time to pull in new OAC components.
# Safe to re-run: existing files are skipped (non-interactive mode).
#
# Prerequisites:
#   ~/.config/opencode must be symlinked to this repo's opencode/ directory.
#   Example: ln -sf /path/to/CodeAccelerate-OpencodeConfig/opencode ~/.config/opencode
#
# Usage:
#   bash scripts/install-global.sh

set -euo pipefail

GLOBAL_DIR="$HOME/.config/opencode"
OAC_INSTALL_URL="https://raw.githubusercontent.com/darrenhinde/OpenAgentsControl/main/install.sh"

# ── Install ────────────────────────────────────────────────────────────────────

echo "→ Installing OAC developer profile to $GLOBAL_DIR (skip-existing)..."
curl -fsSL "$OAC_INSTALL_URL" | bash -s developer --install-dir "$GLOBAL_DIR"

echo "Removing project context directories..."
rm -rf ~/.config/opencode/context/project/
rm -rf ~/.config/opencode/context/project-intelligence/

echo ""
echo "✓ Global install complete."
echo "  Your tracked overrides in opencode/ are preserved via .gitignore."
echo "  Re-run this script any time to pull in new OAC components."
