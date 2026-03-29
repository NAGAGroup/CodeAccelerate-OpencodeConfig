# Sequential Thinking — Design the Complete Plan

The scouts have reported on the codebase, the node library is now available, and (if applicable) web research has been conducted. Use sequential thinking to consolidate findings and design the **complete project plan** — both structure and node-by-node decomposition — before presenting it to the user at the propose-plan gate.

## Todo

1. `sequential-thinking_sequentialthinking` — Reason through the full plan design. Use as many thought steps as needed.

## What to reason through

Work through these questions in order. Each builds on the previous:

1. **What did the scouts actually find?** Consolidate the key facts: what exists, what's missing, what's ambiguous. Discard noise.

2. **What is the real scope of the user's request?** Given what the codebase actually looks like, what does this task genuinely require? Is it bigger or smaller than it first appeared?

3. **What are the meaningful constraints?** Tech stack, dependencies, existing patterns, things that can't be changed. What do these rule out?

4. **Where are the risks?** What could go wrong? What parts of this task are uncertain, coupled, or likely to surface surprises?

5. **What does a sound structure look like?** Compose from primitives: sequence, branch, iteration (unrolled). Roughly: how many phases? What has to be sequential vs. what can run in parallel? Are there branch points where user decisions are needed?

6. **What node types fit best?** Using the node library context from `scout-node-library`, select the right node type for each step. Assign agents (haiku in parallel, sonnet for deep reasoning). Draft the decomposition: Node ID | Node type | Agent | What it does | Branch conditions.

   **Compression nodes for long DAGs:** For long, multi-phase DAGs — especially those with extensive scout or analysis phases — include compression nodes between major phases. Multiple compression nodes in a single DAG is appropriate and encouraged; don't limit to one. Place them after phases where context has accumulated (e.g., after 3 scouts, after a deep analysis) and before phases that need a clean context window.

7. **What am I confident about vs. still unsure of?** Be explicit. If something is genuinely unclear, note it — you'll surface it to the user at `propose-plan`.

## Output

End with a complete plan ready to present:
- **Scope** — one sentence
- **Constraints** — top 2–3
- **ASCII diagram** — the full node tree
- **Node decomposition table** — Node ID, node type, agent, what it does, branch conditions
- **Open questions** — any remaining uncertainties to surface to the user

This complete plan is what you will present in `propose-plan`. You do not show it to the user here — this is your internal reasoning step.
