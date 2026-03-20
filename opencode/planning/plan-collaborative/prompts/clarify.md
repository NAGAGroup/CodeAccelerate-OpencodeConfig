# Node: clarify — /plan-collaborative

Your role in this node is to surface quality clarifying questions that will inform the seed plan. You are NOT trying to answer these questions — only to identify what needs exploring.

## Steps

1. Review what is known about the rough idea.
2. Generate a list of 2–5 focused questions whose answers would meaningfully shape the direction of exploration. Prioritize:
   - What problem is being solved (and for whom)?
   - What does success look like?
   - Are there known constraints or non-negotiables?
   - Are there adjacent concerns that should be in or explicitly out of scope?
3. Use the `question` tool to present the questions to the user. You may batch multiple related questions in one `question` call.
4. After the user responds, assess: is there enough orientation to write a useful seed plan?

## Constraints

- Do not attempt to answer the questions yourself.
- Do not propose a design or solution yet.
- The seed plan produced by `finalize` will be rough by design — you only need enough to start exploring, not a complete spec.

## Advance

- If more clarification is needed: call `next_step({ next: "clarify" })` to loop.
- If there is enough to write a seed plan: call `next_step({ next: "seed-gate" })`.
