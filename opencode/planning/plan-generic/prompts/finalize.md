# Node: finalize — /plan-generic

Your role in this node is to write all session plan artifacts to disk and register the session.

## Steps

1. **Apply delegation assignments** — Agent routing was completed in the previous node. Use the routing table established in context to populate each subtask's `## Delegation` section. Do not re-load the skill or re-derive assignments.

2. **Write session files** to `.opencode/sessions/{session-name}/`:
   - `index.md` — session name, goal, status, subtask table, gate locations
   - `spec.json` — full session spec: name, status, goal, currentSubtask: 1, totalSubtasks, circuitBreakerThreshold: 3, completedSteps: [], subtasks array with id/name/description/status for each
   - `prompts/session-overview.md` — content is decided per session (not a fixed template), but must include:
     - `<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->` as the first line
     - A brief "what this session is" summary: goal, subtask count, any gates or loop nodes
     - `## Advance`: "Read this overview once, internalize it, then call `next_step()` immediately."
   - `subtask-NN-{name}.md` — one file per subtask, each with:
     - `<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->` as the first line
     - Fully populated `## Objective`, `## Scope`, `## Constraints`, `## Todolist`, and `## Delegation` sections
     - An `## Advance` section at the end: "Call `next_step()` when this subtask is complete." For the terminal subtask: "Call `next_step()` when this subtask is complete — the DAG will detect it is terminal and prompt you to call `close_session()`."

3. **Call `activate_session`** with the session name to register it as the active session.

4. **Write the execution plan** to `.opencode/session-plans/{session-name}/plan.json` using the DAG schema:
   - `entry` must be `"session-overview"`
   - First node is `session-overview` (`type: "agent"`, prompt: `session-overview.md`, `next`: first subtask node ID)
   - One node per subtask (`type: "agent"`)
   - Each subtask node's `prompt` field points to the corresponding `subtask-NN-{name}.md` file
   - Sequential `next` links; include `remaining_visits` on any loop-capable nodes
   - Terminal node (last subtask) has no `next`
   - Set `status: "ready"` on the plan

5. **Commit the session**:
   ```
   git add .opencode/sessions/{session-name}/ .opencode/session-plans/{session-name}/
   git commit -m "plan: add session {session-name}"
   ```

   Note: `session-overview.md` lives under `.opencode/sessions/{session-name}/prompts/` and is covered by the first `git add`.

6. **Present the final overview** to the user:
   - Subtask list with delegation assignments
   - Gate locations
   - Next step: "Run '/activate-plan {session-name}' when ready to begin execution."

## Constraints

- All `## Delegation` sections must be filled before writing files. Do not write `TBD`.
- Do not call `next_step()` — this is a terminal node. Call `close_session()` after the overview is presented.
