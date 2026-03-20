# Node: spec-gate

Present the current state of `spec.md` to the user verbatim.

Ask: "Are we ready to produce the final output, or is there more to explore?"

- If more to explore: `next_step({ next: "explore-05" })` (use the last explore node ID)
- If ready to finalize: `next_step({ next: "finalize-output" })`
