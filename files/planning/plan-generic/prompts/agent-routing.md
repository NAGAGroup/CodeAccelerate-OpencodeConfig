# Node: agent-routing — /plan-generic

Your role in this node is to assign an agent and model to every subtask in the session plan before files are written.

## Steps

1. **Load the delegation skill** — `delegation`. Internalize the routing table and decision heuristics.
2. **Review the decomposed subtask list** from context. For each subtask, apply the routing rules:
   - Default to `@ContextScout` (haiku) for mechanical reads and quick inspection tasks
   - Use `@ContextInsurgent` (sonnet) only when deep multi-file analysis is genuinely required
   - Use `@JuniorDev` (haiku) for all scoped code edits — prefer parallelism over sequential single-agent work

     > **Parallel = intra-node:** When routing multiple independent @JuniorDev (or @QuickDoc) tasks as parallel, they must be grouped into a **single subtask node** in the generated plan. That node's prompt dispatches all agents simultaneously. Do NOT produce one subtask node per agent — the DAG does not support parallel node execution.
   - Use `@QuickDoc` (haiku) for single-file documentation tasks
   - HeadWrench handles all shell, build, test, and git directly — never delegate these

3. **Produce a routing table** — list each subtask with:
   - Subtask ID and name
   - Assigned agent
   - Model tier (haiku / sonnet)
   - One-sentence rationale

## Constraints

- Every subtask must have an assignment. Do not leave any as TBD.
- Prefer haiku agents in parallel over a single sonnet agent unless complexity justifies escalation.
- Do not write any files in this node — routing decisions only.
- You MUST NOT propose solutions or implementation approaches of any kind.
- Violating these constraints means this node has failed. Stop and re-read the objective.

## Advance

Call `next_step()` NOW. Do this exactly once. Do NOT read session files or DAG state to determine whether to advance. Do NOT take any other action before or after calling `next_step()`.
