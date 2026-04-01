# Sequential Thinking

Call `sequential-thinking_sequentialthinking` repeatedly to design the complete project execution plan using scout findings, research (if available), and node library context.

**Todo:** `["sequential-thinking_sequentialthinking"]`

> (1) Consolidate scout findings and codebase structure: what exists, what's missing, what matches the user's actual request?
> (2) Identify constraints and risks: tech stack dependencies, existing patterns, coupled components, uncertain areas.
> (3) Compose plan structure from primitives: phases, sequencing, branch points, parallel work. Does this need 3 phases or 8?
> (4) Select node types and agents from CATALOGUE.md context: assign the right node type per task, use haiku for parallel work and sonnet for reasoning.
> (5) Validate todo arrays for each node against CATALOGUE.md — ensure all tool names are valid and match node types. Omit compression nodes unless context accumulates across many tasks.
> (6) Return a complete plan ready to present: Scope (one sentence), Constraints (2–3 top items), ASCII diagram, Node decomposition table (Node ID | type | agent | todo | what it does | branch conditions), Open questions.

Call this tool repeatedly until the complete plan is clear, then call `next_step()`.
