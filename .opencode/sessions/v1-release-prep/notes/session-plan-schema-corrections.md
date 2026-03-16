# session-plan-schema corrections

**Date:** 2026-03-15  
**Subtask:** 05 — fix-session-plan-schema

## Changes made

Three stale agent references removed from `opencode/protocols/session-plan-schema.md`:

1. **Line ~155 (DocWriter anti-pattern example):** "Asking DocWriter to produce a 5000-word document" → "Asking any single agent to handle oversized scope (e.g., a 5000-word document or a full-codebase refactor)"

2. **Parallel group template Slot A (~line 175):** `- **Agent:** @CodeWriter` → `- **Agent:** [session-local agent name]`

3. **Parallel group template Slot B (~line 180):** `- **Agent:** @CodeWriter` → `- **Agent:** [session-local agent name]`

4. **Line 276 (Build & Test rule):** "never assigned to CodeWriter or any subagent" → "never assigned to any subagent or session-local agent" (HW direct fix after agent scan flagged it)

## Key finding
The staleness scan revealed that while the primary targets were DocWriter and @CodeWriter template references, the governing constraint on line 276 also used "CodeWriter" as a generic role label. Always scan for both specific named-agent refs AND role-label uses of deleted agent names.
