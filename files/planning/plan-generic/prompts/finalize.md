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
     - For the terminal subtask: "Call `next_step()` when this subtask is complete — the DAG will detect it is terminal and prompt you to call `close_session()`."

4. **Write the execution plan** to `.opencode/session-plans/{session-name}/plan.json` — use the schema and best-practices loaded in the load-guidelines node.

> **Critical:** The final node in the generated `plan.json` MUST NOT have a `next` field. Omit it entirely. If `next` is present on the terminal node, executing agents cannot call `close_session()` and the session will be stuck.

5. **Commit the session**:
    ```
    git add .opencode/session-plans/{session-name}/
    git commit -m "plan: add session {session-name}"
    ```

6. **Present the final overview** to the user:
   - Subtask list with delegation assignments
   - Gate locations
   - Next step: "Run '/activate-plan {session-name}' when ready to begin execution."

## Constraints

- All `## Delegation` sections must be filled before writing files. Do not write `TBD`.
- You MUST NOT propose solutions or implementation approaches of any kind.
- Violating these constraints means this node has failed. Stop and re-read the objective.

## Advance

Call `close_session()` exactly once. Do this exactly once. Do NOT call `next_step()` — this is a terminal node. Do NOT read session files or DAG state. Do NOT take any other action before or after calling `close_session()`.
