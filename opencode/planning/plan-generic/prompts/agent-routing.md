# Node: agent-routing — /plan-generic

Your role in this node is to assign an agent and model to every subtask in the session plan before files are written.

## Steps

1. **Load the delegation skill** — `delegation`. Internalize the routing table and decision heuristics.
2. **Review the decomposed subtask list** from context. For each subtask, apply the routing rules:
   - Default to `@ContextScout` (haiku) for mechanical reads and quick inspection tasks
   - Use `@ContextInsurgent` (sonnet) only when deep multi-file analysis is genuinely required
   - Use `@JuniorDev` (haiku) for all scoped code edits — prefer parallelism over sequential single-agent work
   - Use `@QuickDoc` (haiku) for single-file documentation tasks
   - HeadWrench handles all shell, build, test, and git directly — never delegate these

3. **Produce a routing table** — list each subtask with:
   - Subtask ID and name
   - Assigned agent
   - Model tier (haiku / sonnet)
   - One-sentence rationale

4. **Call `next_step()`** to advance. The routing table in context will be used by review-gate and finalize.

## Constraints

- Every subtask must have an assignment. Do not leave any as TBD.
- Prefer haiku agents in parallel over a single sonnet agent unless complexity justifies escalation.
- Do not write any files in this node — routing decisions only.
