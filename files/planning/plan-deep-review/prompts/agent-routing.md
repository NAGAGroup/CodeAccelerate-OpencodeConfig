# Node: agent-routing — /plan-deep-review

Your role in this node is to route each finding group from synthesis to the appropriate agent for fixing, based on the type and complexity of the work required.

## Steps

1. **Load the delegation skill** — `skill({name: "delegation"})`. Internalize the routing heuristics and agent capabilities.
2. **Review the finding groups** from session context (produced by synthesize). For each group, apply the routing rules:
   - `@JuniorDev` (haiku): scoped code edits — most bugs, quality fixes, performance optimizations within a single module or file
   - `@QuickDoc` (haiku): documentation fixes, comment updates, docstring improvements
   - **HeadWrench directly**: shell operations, build system changes, complex multi-file refactors, security fixes requiring architectural judgment
3. **Produce a routing table** with these columns:
   - Subtask
   - Finding Group
   - Agent
   - Model Tier
   - Rationale
4. **Flag risky or ambiguous routing decisions** with `[🚫 GATE]` notation. Include a brief explanation of the risk (e.g., "unclear scope boundary", "potential side effects", "security concern").

## Constraints

- Every finding group must have an explicit agent assignment. Do not leave any as TBD.
- Prefer delegating to `@JuniorDev` and `@QuickDoc` (haiku parallel agents) for bounded tasks.
- Escalate to HeadWrench only for work requiring shell access, build modifications, cross-project impact, or security judgment.
- Do not write or execute any fixes in this node — routing decisions only.
- Do not call the delegation skill to perform fixes; use it only to guide routing decisions.

## Advance

**Call `next_step()`** to advance.
