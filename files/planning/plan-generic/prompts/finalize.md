# Node: finalize — /plan-generic

Your role in this node is to write all session plan artifacts to disk and register the session.

## Steps

1. **Apply delegation assignments** — Agent routing was completed in the agent-routing node. Use the routing table established in context to populate each subtask's `## Delegation` section. Do not re-load the skill or re-derive assignments.

2. **Generate a session-specific `session-overview.md`** — Do NOT copy a static template. Generate it dynamically using what you learned during this planning session. It must include:
   - `<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->` as the first line
   - The session goal (from task-intake — what the user wants built or changed)
   - A brief "what this session is" summary: subtask count, any gate or loop nodes
   - The output artifact path (where session files live: `.opencode/session-plans/{session-name}/`)
   - Operating instructions: subtask prompts are agent-internal — execute them in order, do not skip
   - `## Advance`: "Read this overview once, internalize it, then call `next_step()` immediately."

3. **Write session files** to `.opencode/session-plans/{session-name}/`:
   - `prompts/session-overview.md` — generated in Step 2
   - `prompts/subtask-NN-{name}.md` — one file per subtask, each with:
     - `<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->` as the first line
     - Fully populated `## Objective`, `## Scope`, `## Constraints`, `## Todolist`, and `## Delegation` sections
     - An `## Advance` section at the end: "Call `next_step()` when this subtask is complete."
   - A prompt file for every node in `plan.json` — including terminal nodes, gate nodes, and any `close`/`complete`/`finalize` nodes.

4. **Validate the DAG before writing** — Apply these two invariants to every node in `plan.json`:

   **Invariant 1 — Every loop node has a non-looping exit.**
   For each node whose `next` includes a back-edge (pointing to a prior node in the flow): does it also have at least one branch that does NOT loop back? If any loop node has only looping branches, the plan is broken. Add the missing exit branch.

   **Invariant 2 — Every path through the DAG eventually reaches a terminal node.**
   A terminal node is one with no `next` field. Starting from `session-overview`, trace every possible branch sequence. Does every possible path eventually land on a terminal node? If any path cycles forever with no way out, the plan is broken. There may be multiple terminal nodes — that is fine. But every reachable branch must lead to one.

   > Do this mentally as a graph traversal before writing any files. If either invariant fails, fix the DAG structure first.

5. **Write the execution plan** to `.opencode/session-plans/{session-name}/plan.json` — use the schema and best-practices loaded in the load-guidelines node.

6. **Commit the session**:
    ```
    git add .opencode/session-plans/{session-name}/
    git commit -m "plan: add session {session-name}"
    ```

7. **Present the final overview** to the user:
   - Subtask list with delegation assignments
   - Gate locations
   - Next step: "Run '/activate-plan {session-name}' when ready to begin execution."

## Constraints

- All `## Delegation` sections must be filled before writing files. Do not write `TBD`.
- You MUST NOT propose solutions or implementation approaches of any kind.
- Violating these constraints means this node has failed. Stop and re-read the objective.

## Advance

Call `close_session()` exactly once. Do this exactly once. Do NOT call `next_step()` — this is a terminal node. Do NOT read session files or DAG state. Do NOT take any other action before or after calling `close_session()`.
