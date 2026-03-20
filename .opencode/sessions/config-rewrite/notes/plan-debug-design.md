# /plan-debug Design — LOCKED

## Planning DAG (`~/.config/opencode/planning/plan-debug/plan.json`)

```json
{
  "schema_version": "1.0",
  "id": "plan-debug",
  "session_type": "plan-debug",
  "description": "Debug planning session — produces hypotheses only",
  "entry": "bug-intake",
  "nodes": {
    "bug-intake": {
      "id": "bug-intake",
      "type": "agent",
      "prompt": "~/.config/opencode/planning/plan-debug/prompts/bug-intake.md",
      "next": "context-gather"
    },
    "context-gather": {
      "id": "context-gather",
      "type": "agent",
      "prompt": "~/.config/opencode/planning/plan-debug/prompts/context-gather.md",
      "next": "hypothesis-form"
    },
    "hypothesis-form": {
      "id": "hypothesis-form",
      "type": "agent",
      "prompt": "~/.config/opencode/planning/plan-debug/prompts/hypothesis-form.md",
      "next": ["hypothesis-form", "hypothesis-gate"]
    },
    "hypothesis-gate": {
      "id": "hypothesis-gate",
      "type": "gate",
      "prompt": "~/.config/opencode/planning/plan-debug/prompts/hypothesis-gate.md",
      "next": ["finalize", "hypothesis-form"]
    },
    "finalize": {
      "id": "finalize",
      "type": "agent",
      "prompt": "~/.config/opencode/planning/plan-debug/prompts/finalize.md"
    }
  }
}
```

### Node Descriptions
- **bug-intake**: Read user's bug description + OMEGA query for related error patterns. Extract: error message, reproduction steps, affected component, severity.
- **context-gather**: Dispatch ContextScout subagents to reconnoitre relevant code paths. Collect stack traces, recent changes, test failures. → next: hypothesis-form
- **hypothesis-form**: Synthesize context into ranked hypotheses (most likely first). Can loop to gather more context if needed. → next: ["hypothesis-form", "hypothesis-gate"]
- **hypothesis-gate**: Gate — present hypotheses to user, confirm ranking and completeness. → next: ["finalize", "hypothesis-form"]
- **finalize**: Write debug session plan artifacts (plan.json + prompts/). Bakes hypothesis list into diagnose.md. fix.md starts as placeholder. → terminal

## Debug Session Plan Output

Written by `finalize` to `.opencode/session-plans/<name>/plan.json`:

```json
{
  "schema_version": "1.0",
  "id": "<bug-name>",
  "session_type": "plan-debug",
  "goal": "Fix: <description>",
  "created": "...",
  "status": "ready",
  "entry": "diagnose",
  "nodes": {
    "diagnose": {
      "id": "diagnose",
      "type": "agent",
      "prompt": ".opencode/session-plans/<name>/prompts/diagnose.md",
      "next": ["fix", "diagnose"],
      "remaining_visits": 5
    },
    "fix": {
      "id": "fix",
      "type": "agent",
      "prompt": ".opencode/session-plans/<name>/prompts/fix.md",
      "next": "verify"
    },
    "verify": {
      "id": "verify",
      "type": "agent",
      "prompt": ".opencode/session-plans/<name>/prompts/verify.md",
      "next": ["diagnose"]
    }
  }
}
```

## Key Design Principles

### The Debug Session IS the Implementation
Unlike plan-generic where the generated plan is a static execution script, the debug session plan is a **LIVE, self-editing artifact**. The planning phase produces hypotheses ONLY. The actual fix is discovered and implemented within the running session itself.

### Self-Editing Mechanism
- `diagnose.md` = hypothesis list baked in by finalize (populated at planning time)
- `fix.md` = starts as placeholder; agent WRITES/REWRITES it during diagnose node execution, accumulating "tried: X, result: Y" history + current best fix
- During diagnose node execution:
  - Agent tries the current top hypothesis (compile, run targeted tests, inspect)
  - If fix found: agent writes confirmed fix to `fix.md`, calls `next_step({ next: "fix" })`
  - If not found: agent writes attempt notes to `fix.md`, calls `next_step({ next: "diagnose" })` → plugin decrements `remaining_visits`
- `fix` node: re-reads `fix.md` fresh, applies the confirmed fix
- `verify` node: runs full test suite; pass → `close_session()`; fail → `next_step({ next: "diagnose" })` (back to diagnose loop)

### Loop Control
- `diagnose.remaining_visits: 5` — hard limit on hypothesis attempts
- When remaining_visits reaches 0, plugin sets `status: "failed"` — escalate to user

### Why `close_session()` Tool
The verify node needs to terminate cleanly after success. `close_session()` is more expressive than bare `next_step()` for terminal success paths. Both are plugin-registered built-in tools.

## Comparison with /plan-generic

| Aspect | /plan-generic | /plan-debug |
|--------|--------------|-------------|
| Planning output | Hypotheses + task list | Hypotheses only |
| Execution | Static DAG — subtasks executed in sequence | Live self-editing — diagnose loops until fix found |
| Fix origin | Determined at planning time | Discovered during session execution |
| Session plan mutability | Immutable after planning | `fix.md` actively rewritten during session |
| Success path | `finalize` node terminates | `verify` → `close_session()` |
| Failure mode | `remaining_visits` → `status: "failed"` | Same |
