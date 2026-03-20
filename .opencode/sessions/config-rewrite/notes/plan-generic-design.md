# Plan-Generic Design

## Planning DAG

**File:** `~/.config/opencode/planning/plan-generic/plan.json`

```json
{
  "schema_version": "1.0",
  "id": "plan-generic",
  "session_type": "plan-generic",
  "description": "Standard planning session for well-understood tasks",
  "entry": "task-intake",
  "nodes": {
    "task-intake": {
      "id": "task-intake",
      "type": "agent",
      "prompt": "~/.config/opencode/planning/plan-generic/prompts/task-intake.md",
      "next": "clarify"
    },
    "clarify": {
      "id": "clarify",
      "type": "agent",
      "prompt": "~/.config/opencode/planning/plan-generic/prompts/clarify.md",
      "next": ["clarify", "decompose"]
    },
    "decompose": {
      "id": "decompose",
      "type": "agent",
      "prompt": "~/.config/opencode/planning/plan-generic/prompts/decompose.md",
      "next": "review-gate"
    },
    "review-gate": {
      "id": "review-gate",
      "type": "gate",
      "prompt": "~/.config/opencode/planning/plan-generic/prompts/review-gate.md",
      "next": ["finalize", "decompose", "clarify"]
    },
    "finalize": {
      "id": "finalize",
      "type": "agent",
      "prompt": "~/.config/opencode/planning/plan-generic/prompts/finalize.md"
    }
  }
}
```

### Node Descriptions

- **task-intake** — Read OMEGA Memory for project context; record the user's goal and any initial constraints. No user interaction. Single next: `clarify`.
- **clarify** — Ask clarifying questions. May loop back to itself (`next: ["clarify", "decompose"]`). Agent decides when enough clarity exists to advance to `decompose`.
- **decompose** — Dispatch focused subagents (ContextScout / ContextInsurgent) to reconnoitre the codebase. Break goal into subtasks. Write draft subtask list. Single next: `review-gate`.
- **review-gate** — Gate node. Present decomposed plan to user for approval. Agent picks from `["finalize", "decompose", "clarify"]` based on user response.
- **finalize** — Write the execution plan artifacts: `.opencode/session-plans/<name>/plan.json` + `prompts/subtask-NN.md` files. Terminal node (no `next`). `/activate-plan` picks up output.

### Slash Command Trigger

The `/plan-generic` slash command is a thin trigger:

```
The user has requested a planning session for the following: $ARGUMENTS.
If no arguments provided, note this — guide clarifying questions accordingly.
Call plan_generic() to begin.
```

The `plan_generic()` tool is plugin-registered. It creates `.opencode/dag-state/<session-id>.json` and injects the `task-intake` prompt.

---

## Execution Plan JSON Structure

**Written by:** `finalize` node  
**Location:** `.opencode/session-plans/<name>/plan.json`

```json
{
  "schema_version": "1.0",
  "id": "<task-name>",
  "session_type": "plan-generic",
  "goal": "<user's stated goal>",
  "created": "<ISO date>",
  "status": "ready",
  "entry": "subtask-01",
  "nodes": {
    "subtask-01": {
      "id": "subtask-01",
      "type": "agent",
      "prompt": ".opencode/session-plans/<task-name>/prompts/subtask-01.md",
      "next": "subtask-02"
    },
    "subtask-NN": {
      "id": "subtask-NN",
      "type": "agent",
      "prompt": ".opencode/session-plans/<task-name>/prompts/subtask-NN.md",
      "next": ["subtask-X", "subtask-Y"],
      "remaining_visits": 3
    }
  }
}
```

### Execution Plan Rules

- Same `PlanDag` schema as planning DAGs — no two-tier design
- `status: "ready"` = planning complete, awaiting `/activate-plan`
- `/activate-plan` creates `.opencode/dag-state/<session-id>.json` and kicks off execution
- `remaining_visits` (optional) — plugin decrements on each node entry; 0 → hard fail (`status: "failed"`)
- No `reject_next` field — use `next: ["option1", "option2"]`; prompt instructs agent how to choose
- No `agent` field — delegation lives entirely in prompt `.md` files
- No `model_tier` field — never

### Subtask Prompt Files

Each `.opencode/session-plans/<name>/prompts/subtask-NN.md` contains:
- Objective for the subtask
- Delegation instructions (which subagent(s) to dispatch, how many, granularity)
- Where to write notes / findings
- Success criteria
- Call `next_step()` when done

Delegation principle: **many small focused parallel delegations to haiku-class agents** rather than single monolithic tasks.

---

## Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Two-tier design (planning DAG vs execution plan schema) | **No** | Same schema; simpler, less surface area |
| Reusable node templates | **No** | Forces a single workflow; plan-generic may not be a code task |
| `reject_next` field | **Removed** | `next: [...]` + prompt instructions are sufficient |
| `remaining_visits` | **Yes** | Only loop-control field; state lives in plan.json on disk |
| `agent` field in DagNode | **No** | Delegation instructions belong in prompt files |
| `model_tier` field | **Never** | Primary agent cannot control model; removed from design |
| `circuit_breaker` | **Dead** | Never use this concept again |
| Context loading | **OMEGA query before plan_generic() call** | No separate `context-load` node needed |
| Clarify loop | **next: ["clarify", "decompose"]** | Agent decides when to advance |
| Review gate choices | **["finalize", "decompose", "clarify"]** | Agent picks based on user response |
