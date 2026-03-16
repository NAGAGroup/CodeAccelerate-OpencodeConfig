---
created: 2026-03-15
subtask: 01-fix-features-md
---

# FEATURES.md Corrections Applied

## Summary
FEATURES.md was severely out of date. All tables were corrected to match actual framework state.

## Changes Made

### Component Inventory Table
- Agents: 8 → 4
- Commands: 9 → 11
- Protocols: 3 → 9
- Skills: 1 → 2
- Plugin version: @beta → @3.0.0

### Agents Table
- Removed 5 deleted agents: gates-expert, subagent-builder, code-writer, doc-writer, architect
- Added context-insurgent (deep multi-file codebase exploration with sequential thinking)
- Removed fictional model references (gpt-5.3-codex, claude-opus-4-6)
- Remaining agents: headwrench, context-scout, context-insurgent, deep-researcher

### Commands Table
- Removed /inbox (no corresponding file on disk)
- Added /context-audit, /quick-plan, /session-status
- Final count: 11 commands

### Protocols Table
- Replaced 3-row table with all 9 actual protocol files
- Removed non-existent plan-workflow.md
- All 9 files verified on disk: checkpoint.md, context-management.md, plan-init.md, plan-shared.md, plan-generic.md, plan-collaborative.md, plan-debug.md, plan-end.md, session-plan-schema.md

### Skills Table
- Added agent-writer skill entry

### Plugins Table
- @tarquinen/opencode-dcp@beta → @tarquinen/opencode-dcp@3.0.0

### MCPs Table
- exa status: disabled → enabled (requires EXA_API_KEY env var)
