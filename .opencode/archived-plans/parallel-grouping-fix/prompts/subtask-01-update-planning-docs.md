<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 01: Update Core Planning Docs — Parallel Grouping Rule

## Objective

Add explicit guidance about parallel subagent grouping to three core planning prompt files. The root problem: planning agents currently produce session plans where parallel work is split across multiple separate DAG subtask nodes — but the DAG plugin only supports sequential node execution. All parallel subagent dispatches must happen **within a single node**, not across multiple nodes.

These three files each contribute to this misunderstanding from a different angle. All three edits are independent and must be dispatched in parallel (one @QuickDoc agent per file, all three launched in a single response).

## Scope

**Edit (3 files):**
- `opencode/planning/plan-design-guidelines.md`
- `opencode/planning/plan-generic/decompose.md`
- `opencode/planning/plan-generic/agent-routing.md`

**Excluded:** All other files. Do not touch finalize prompts, other workflow files, or any plan.json files.

## Constraints

- You MUST dispatch all three @QuickDoc agents **simultaneously in a single response** — this is the correct pattern this session is enforcing.
- Do NOT dispatch them sequentially.
- Each @QuickDoc agent gets exactly one file to edit. Do not combine files into one agent.
- Wait for all three agents to return before calling `next_step()`.
- Do NOT write to any file yourself — delegate all edits to @QuickDoc agents.
- The content of each edit is specified below. Agents should follow these instructions closely.

## Todolist

1. Read the current contents of all three files before dispatching agents (to give each agent accurate context about where to insert content)
2. Dispatch three @QuickDoc agents in parallel, one per file, with the instructions below
3. Wait for all three agents to return
4. Verify each agent completed its assigned edit (no skipped sections, no hallucinated content)
5. Call `next_step()` once all three are confirmed complete

## Edit Instructions Per File

### File A: `opencode/planning/plan-design-guidelines.md`

Add a new subsection titled **"Parallel Work Grouping"** to the **"Planning Best-Practices"** section. Place it after the existing "Gate Placement" subsection (or after "Terminal Nodes" if Gate Placement does not exist). Content:

```
### Parallel Work Grouping

Parallel subagent dispatches must happen **within a single subtask node**, not across multiple DAG nodes. The DAG plugin executes nodes sequentially — there is no mechanism for two nodes to run simultaneously.

**The rule:** When multiple agents will be dispatched in parallel (e.g., three @JuniorDev agents editing three files), group all of them into a single subtask node. That node's prompt instructs the agent to dispatch all agents in one response, wait for all to return, then call `next_step()`.

**Bad — separate nodes per parallel task:**
```json
"subtask-01-edit-foo": { ... "next": { "subtask-02-edit-bar": { ... } } },
"subtask-02-edit-bar": { ... "next": { "subtask-03-edit-baz": { ... } } }
```
(This runs sequentially — each file edit waits for the previous one to finish.)

**Good — one node for all parallel work:**
```json
"subtask-01-parallel-edits": {
  "id": "subtask-01-parallel-edits",
  "type": "agent",
  "prompt": "prompts/subtask-01-parallel-edits.md"
}
```
(The prompt instructs: dispatch @JuniorDev for foo.ts, @JuniorDev for bar.ts, and @JuniorDev for baz.ts simultaneously. Wait for all three. Then `next_step()`.)

The distinction: **parallelism is intra-node** (one agent dispatches N subagents in one response). It is never inter-node (N nodes running at the same time).
```

### File B: `opencode/planning/plan-generic/decompose.md`

In **Step 1**, after the sizing/ordering notes, add a new paragraph:

```
**Parallel work grouping** — When multiple independent tasks will be delegated to the same agent type simultaneously (e.g., three @JuniorDev edits to three different files), group them into a **single subtask node**. The prompt for that node instructs the executing agent to dispatch all subagents in one response and wait for all to return. Do NOT create one subtask node per parallel agent — the DAG is sequential; "parallel subtask nodes" is not a valid concept.

Self-check before finalizing the subtask list:
- Does any set of subtasks represent work that should run simultaneously? → Collapse them into one node.
- Does any subtask say "dispatch @JuniorDev for X" and the next subtask says "dispatch @JuniorDev for Y" where X and Y are independent? → These belong in one node.
```

### File C: `opencode/planning/plan-generic/agent-routing.md`

In **Step 2**, after the `@JuniorDev` bullet (the one that says "prefer parallelism over sequential single-agent work"), add:

```
  > **Parallel = intra-node:** When routing multiple independent @JuniorDev (or @QuickDoc) tasks as parallel, they must be grouped into a **single subtask node** in the generated plan. That node's prompt dispatches all agents simultaneously. Do NOT produce one subtask node per agent — the DAG does not support parallel node execution.
```

## Delegation

**Agent:** @QuickDoc × 3 (parallel)
**Model:** haiku-like
**Prompt structure per agent:**
- Read: the target file
- Goal: insert the specified content at the correct location
- Constraints: match existing formatting style; do not remove or rewrite existing content; insert only where specified
- Verify: the new content is present and coherent in context

## Advance

Call `next_step()` NOW after all three @QuickDoc agents have returned and edits are confirmed. Do this exactly once. Do NOT take any other action before or after calling `next_step()`.
