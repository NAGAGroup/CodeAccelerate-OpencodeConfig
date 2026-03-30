# session-overview

## When to use

Always. Every project DAG starts with this node. It auto-advances immediately (empty todo), so its only job is to orient HeadWrench before execution begins.

**Do not** add more than one `session-overview` per DAG — there is exactly one entry node. If a DAG appears to need a second entry, that is a structural error; restructure the DAG instead.

## What it does

Displays the session goal, the plan structure, and what success looks like. HeadWrench reads this prompt and moves to the next node automatically.

## What the planning agent must resolve

- **Session goal** — One clear sentence describing what the DAG accomplishes
- **DAG summary** — Brief description of the overall flow (phases, key decision points)
- **Success definition** — What the user will see or have when the DAG completes

## Node ID

`session-overview` — always this exact ID. It is the entry node and must appear first. Never suffix this node. It must always be `session-overview`. If your DAG appears to need a second entry node, that is a design error.

## Notes

- Empty todo means this node auto-advances the moment it renders — no tool call required
- Keep the prompt short: 3–5 sentences max
- Do not include instructions about what HW should *do* here — that belongs in subsequent nodes
- This is the entry node. Every path through the DAG must terminate with `output-success` or `output-failure`.
