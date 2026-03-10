# Agent File Audit — lockdown-workflows-and-agents

## Summary
The overall health of the agent files is fair, with a few important issues. `DeepResearcher` has a permission-to-responsibility mismatch (instructed to read project files but lacks filesystem permissions), and `SessionPlanDrafter` and `SubagentBuilder` may lack `write` permission in `opencode.json`. The `@explorer` references in `headwrench.md` and `agent-delegation-expert.md` are **correct** — `explore` is a built-in opencode agent type and does not require a custom `.md` definition or `opencode.json` entry.

> **Note (corrected):** `@explorer` is a built-in opencode agent. The prior "missing agent" findings for `@explorer` below are false positives and should be disregarded.

## File-by-File Findings

### `opencode/agents/headwrench.md`
- **Status**: healthy
- **Findings**:
  - Correctly respects the "sacred delegation model" by explicitly disclaiming code writing and deep research.
  - References a non-existent `@explorer` agent for debug loops and codebase searches.
  - Delegation paths for `@DeepResearcher` and `@DocWriter` overlap slightly on "docs" but are generally distinct.
- **Recommended Actions**: None — `@explorer` is a built-in opencode agent; references are correct.

### `opencode/agents/subagents/agent-delegation-expert.md`
- **Status**: has issues
- **Findings**:
  - References a non-existent `@explorer` agent.
  - Model tiering (fast/standard/deep) is conceptual and not explicitly linked to `opencode.json` model configurations, which may lead to confusion.
- **Recommended Actions**: None — `@explorer` is a built-in opencode agent; references are correct.

### `opencode/agents/subagents/architect.md`
- **Status**: healthy
- **Findings**:
  - Correctly enforces a read-only role ("analyze, you don't modify").
  - Clearly defines the double-gate system for invocations.
- **Recommended Actions**: None.

### `opencode/agents/subagents/code-writer.md`
- **Status**: healthy
- **Findings**:
  - Clear identity and rules.
  - Appropriately uses file scope and patterns to guide output.
- **Recommended Actions**: None.

### `opencode/agents/subagents/context-scout.md`
- **Status**: healthy
- **Findings**:
  - Strictly read-only as per session invariants.
  - Clearly defines the output format for situational awareness reports.
- **Recommended Actions**: None.

### `opencode/agents/subagents/deep-researcher.md`
- **Status**: has issues
- **Findings**:
  - Stale/contradictory instruction: It is told to "Read relevant project files for context" but its permissions in `opencode.json` deny all filesystem access except web tools.
- **Recommended Actions**: Grant `read`, `glob`, and basic read-only `bash` permissions in `opencode.json`.

### `opencode/agents/subagents/doc-writer.md`
- **Status**: healthy
- **Findings**:
  - Brief but clear.
  - Follows the leaf agent pattern (no delegation).
- **Recommended Actions**: None.

### `opencode/agents/subagents/gates-expert.md`
- **Status**: healthy
- **Findings**:
  - Correctly identified as read-only.
  - Clear output format for gate recommendations.
- **Recommended Actions**: None.

### `opencode/agents/subagents/session-plan-drafter.md`
- **Status**: has issues
- **Findings**:
  - Likely missing `write` permission in `opencode.json` to create new session directories and files (currently only has `edit: allow`).
  - Clear, detailed instructions on session plan structure.
- **Recommended Actions**: Add `write` permission in `opencode.json`.

### `opencode/agents/subagents/subagent-builder.md`
- **Status**: has issues
- **Findings**:
  - Likely missing `write` permission in `opencode.json` to create new agent files.
- **Recommended Actions**: Add `write` permission in `opencode.json`.

### `opencode/commands/amend.md`
- **Status**: healthy
- **Findings**: Clearly delegates to HeadWrench for planning updates.

### `opencode/commands/context-add.md`
- **Status**: healthy
- **Findings**: Clear logic for project vs global context.

### `opencode/commands/context-list.md`
- **Status**: healthy
- **Findings**: Comprehensive listing instructions.

### `opencode/commands/context-remove.md`
- **Status**: healthy
- **Findings**: Includes safety confirmation step.

### `opencode/commands/continue.md`
- **Status**: healthy
- **Findings**: Good resumption logic and listing for multiple sessions.

### `opencode/commands/inbox.md`
- **Status**: healthy
- **Findings**: Connects session output back to persistent context via user review.

### `opencode/commands/plan.md`
- **Status**: healthy
- **Findings**: Accurately reflects the multi-agent planning workflow.

## Cross-File Issues
- **Permission vs Task Mismatch**: `DeepResearcher`, `SessionPlanDrafter`, and `SubagentBuilder` have instructions that exceed their current `opencode.json` permissions.
- ~~**Missing `@explorer` agent**~~: *Corrected — `@explorer` is a built-in opencode agent type; no custom file or registration needed.*

## Missing Files / Unregistered Agents
- **None confirmed.** `@explorer` was initially flagged as missing but is a built-in opencode agent type — no `.md` file or `opencode.json` entry is required or expected.

## Priority Findings
1. **PERMISSION GAP (DeepResearcher)**: Cannot fulfill its instruction to "Read relevant project files" with current `opencode.json` settings. Fix: grant `read`, `glob`, and read-only `bash` permissions.
2. **PERMISSION GAP (SessionPlanDrafter/SubagentBuilder)**: These agents need to create new files/directories but likely lack explicit `write` permissions in `opencode.json`. Fix: add `write` permission.
3. **STALE CONTENT (DeepResearcher)**: The instruction to read files contradicts the restrictive permissions — one of the two must be corrected.
4. ~~**MISSING AGENT (`@explorer`)**~~: *Corrected — built-in opencode agent, no action needed.*
