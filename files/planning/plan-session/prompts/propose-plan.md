# Propose Plan

Output the full plan as raw prose, then call `question` to ask for approval.

**Todo:** `["question"]`

> (1) Output the complete plan as raw text — no tools, no JSON, just structured prose with these sections in order: Scope (one sentence), Constraints (2–3 bullets), ASCII diagram, Node decomposition table (Node ID | type | agent | todo | what it does | branch conditions), Open questions.
> (2) After the prose output, call `question` with only "Does this plan look right?" — do NOT embed plan content in the question field.
> (3) Option 1: "Approve — write the DAG"
> (4) Option 2: "Rethink — revise before writing"
> (5) Output constraint: return the user's choice

Route by node ID (not when-string): approval → `next_step({ next: "write-dag" })`; rethink → `next_step({ next: "propose-plan-2" })`.
