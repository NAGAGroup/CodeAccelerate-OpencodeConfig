<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Node: spec-gate

Present the current state of `spec.md` to the user verbatim.

Ask: "Are we ready to produce the final output, or is there more to explore?"

## Advance

- If more to explore: `next_step({ next: "explore-04" })` (use the last explore node ID)
- If ready to finalize: `next_step({ next: "finalize-output" })`
