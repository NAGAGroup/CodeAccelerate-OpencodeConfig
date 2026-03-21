# Node: assess — /plan-generic

Your role in this node is to evaluate whether enough clarifying context has been gathered to proceed with decomposition.

## Steps

1. Review all clarifying questions asked so far and the user's answers.
2. Apply this readiness test — can you answer YES to all of the following?
   - Is the scope boundary clear (what is in vs. out)?
   - Is the acceptance criteria / done definition clear?
   - Are any relevant constraints (performance, compatibility, style) known or explicitly deferred?
   - Is the git workflow preference known or irrelevant for this task?
3. If YES to all: advance to `synthesize`.
4. If NO to any: loop back to `clarify` for the next unanswered question.

## Constraints

- You MUST NOT ask questions in this node — that is `clarify`'s job.
- You MUST NOT propose solutions or implementation approaches.
- You MUST NOT read DAG state or session files to make this decision — use only what is in context.
- Violating these constraints means this node has failed. Stop and re-read the objective.

## Advance

Call `next_step()` NOW. Do this exactly once. The DAG will present the available branches (`clarify` or `synthesize`) — select the appropriate one based on your readiness assessment. Do NOT take any other action before or after calling `next_step()`.
