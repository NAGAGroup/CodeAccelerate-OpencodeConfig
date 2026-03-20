# Subtask 01 — Context Management Changes

**Session**: config-reimplementation  
**Date**: 2026-03-19  
**File modified**: `opencode/protocols/context-management.md` (347 → 362 lines)

## Changes Applied

### 1. New YAML metadata fields
- `freshness_sla`: duration string (`"7d"`, `"30d"`, `"90d"`, `"never"`, `~`) — checked by `/context-audit` for `[CONTEXT-REVIEW]` flagging
- `context_type`: one of `pattern`, `decision`, `convention`, `reference`, `finding`, or `~`
- Added to both Inbox Item Header and Context File Header YAML examples
- Added to Field Definitions table

### 2. 60% utilization cliff callout
- Liu et al. (2023) "Lost in the Middle" — 18 frontier models show 30%+ performance drop for mid-context info
- Practical guidance: trigger compaction before ~60% utilization; place critical context at start/end
- Added after Context Files staleness subsection

### 3. ContextScout skip rule
- Skip files where `active: false` or `superseded_by:` is set to non-null, non-tilde value
- Added to In Scope section of ContextScout Reading Scope

### 4. Pruning policy for superseded items
- **Superseded inbox items**: deleted during next `/context-audit` run (no retention value)
- **Superseded context files (Tier 2/3)**: archived to `.opencode/archive/context/` (or `~/.config/opencode/archive/context/` for global)
- Updated Conflict Resolution point 4, `[SUPERSEDED]` audit flag, Step 6 Execution list
- Also updated "What Is NOT Archived" to exclude superseded context files from "permanent" designation
