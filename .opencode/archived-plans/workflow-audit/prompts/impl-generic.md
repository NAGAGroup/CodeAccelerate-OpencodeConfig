# Node: impl-generic — Generic Planning Workflow Restructure

This node restructures the Generic planning workflow DAG and rewrites/creates all affected prompt files.

## Target DAG

```
session-overview → load-guidelines → task-intake → clarify (loop) → scout → synthesize → decompose → agent-routing → review-gate → finalize
```

## Step 1 — Rewrite opencode/planning/plan-generic/plan.json

Write a new plan.json reflecting the target DAG above. Key fields:
- `entry`: `"session-overview"`
- All prompt paths: `~/.config/opencode/planning/plan-generic/prompts/{node-id}.md`
- `clarify`: loop node with `next: ["clarify", "scout"]`, `remaining_visits: 3`
- `review-gate`: gate node with `next: ["finalize", "decompose", "clarify"]`
- `finalize`: terminal node (no `next`)
- No `load-schema` node (replaced by `load-guidelines`, which points to `plan-design-guidelines.md`)

New nodes being added: `session-overview`, `load-guidelines`, `scout`, `synthesize`
Removed nodes: `load-schema` (renamed), the old `decompose`→`review-gate`→`load-schema`→`agent-routing`→`finalize` chain is restructured

## Step 2 — Write session-overview.md

File: `opencode/planning/plan-generic/prompts/session-overview.md`

This is the generic planning session-overview shown to the planning agent at the start of every generic planning session. It orients the agent on its role and the session structure.

Content should cover:
- What a generic planning session is (produce a session plan DAG for a feature, refactor, or migration)
- The agent's role (plan architect — ask, listen, decompose, delegate, then produce)
- The session structure (brief node-by-node: session-overview → load-guidelines → task-intake → clarify → scout → synthesize → decompose → agent-routing → review-gate → finalize)
- Do NOT start exploring or asking questions yet — just orient and call `next_step()`

## Step 3 — Write load-guidelines.md

File: `opencode/planning/plan-generic/prompts/load-guidelines.md`

This node loads the plan design guidelines into context. The file is already available at `~/.config/opencode/planning/plan-design-guidelines.md` (the DAG injects it automatically via the `prompt` field pointing to that path — so this prompt file itself is minimal).

Content: A brief instruction telling the agent that the design guidelines have been loaded into context, that it should internalize the schema and best-practices before proceeding, and then call `next_step()`.

## Step 4 — Update task-intake.md

File: `opencode/planning/plan-generic/prompts/task-intake.md`

Current content is already correct in spirit. Review and make minimal updates:
- Remove any hardcoded node IDs from the ADVANCE section — call `next_step()` with no args
- Ensure it does NOT instruct the agent to decompose yet

## Step 5 — Update clarify.md

File: `opencode/planning/plan-generic/prompts/clarify.md`

Review and update:
- Remove any hardcoded node IDs from the ADVANCE section
- Loop instruction: "to ask another question, call `next_step()` and select `clarify`" — but do NOT hardcode it as `next_step({ next: "clarify" })`
- Advance instruction: "when scope is clear, call `next_step()` and select `scout`" — same, no hardcoding

## Step 6 — Write scout.md (new)

File: `opencode/planning/plan-generic/prompts/scout.md`

This node dispatches ContextScouts in parallel to gather codebase context relevant to the task.

Content:
- Dispatch 2–4 @ContextScout agents in parallel, each targeting a different relevant area (entry points, affected files, test patterns, existing conventions)
- Provide each scout with specific file paths or glob patterns based on the task description from context
- Wait for all scouts to return before calling `next_step()`
- Do NOT synthesize findings here — that's synthesize.md's job

## Step 7 — Write synthesize.md (new)

File: `opencode/planning/plan-generic/prompts/synthesize.md`

This node reads the scout findings and forms a coherent understanding of the codebase relevant to the task.

Content:
- Read all scout findings from the prior node
- Synthesize into a structured summary: affected areas, conventions to follow, risks, open questions
- Do NOT decompose into subtasks yet — that's decompose.md's job
- Present the synthesis to the user as a brief codebase context summary, then call `next_step()`

## Step 8 — Update decompose.md

File: `opencode/planning/plan-generic/prompts/decompose.md`

Remove the scout dispatch steps (moved to scout.md) and the synthesis steps (moved to synthesize.md). Keep only the decomposition responsibility:

- Read the synthesis from context
- Decompose into 3–9 subtasks, each with: Objective, Scope, Constraints, Todolist
- Ask the user about `remaining_visits` for any loop nodes
- Present the draft subtask list to the user
- Call `next_step()` (no hardcoded node ID)

## Step 9 — Write agent-routing.md (if not already present)

File: `opencode/planning/plan-generic/prompts/agent-routing.md`

This file already exists. Review and update:
- Remove any hardcoded node IDs from the ADVANCE section
- Confirm it loads the delegation skill and produces a routing table before calling `next_step()`

## Step 10 — Update review-gate.md

File: `opencode/planning/plan-generic/prompts/review-gate.md`

Review and update:
- Remove hardcoded node IDs — do NOT call `next_step({ next: "finalize" })` (the current bug)
- Present: full plan, subtask list, agent routing table
- Ask user for explicit approval
- On approval, call `next_step()` — the plugin will present branch options (`finalize`, `decompose`, `clarify`)

## Step 11 — Update finalize.md

File: `opencode/planning/plan-generic/prompts/finalize.md`

Key update — generate a session-specific `session-overview.md` for the created session (CC-2):
- Do NOT copy a static verbatim template
- Generate dynamically using: session goal (from task-intake conversation), output artifact path, workflow-specific operating instructions (e.g. "subtask prompts are agent-internal — execute them in order"), session-specific context
- All other steps (write plan.json, write subtask prompts, git commit) remain as-is
- Remove any reference to "previous node (load-schema)" — rephrase to reference "agent-routing node"
- Terminal node: call `close_session()`, not `next_step()`

## Step 12 — Verify

- `cat opencode/planning/plan-generic/plan.json` — confirm new DAG structure
- `ls opencode/planning/plan-generic/prompts/` — confirm scout.md and synthesize.md exist
- Check that task-intake.md, clarify.md, decompose.md, review-gate.md, finalize.md have no hardcoded node IDs in their ADVANCE sections

## Advance

Call `next_step()` when all steps are complete and verified.
