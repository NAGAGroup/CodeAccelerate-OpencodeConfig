# Node: finalize — /plan-generic

Your role in this node is to write all session plan artifacts to disk and register the session.

## Steps

1. **Load the agent-delegation-expert skill** — Read `~/.config/opencode/skills/agent-delegation-expert/SKILL.md`. Apply its routing rules to assign an agent and model to each subtask. Fill in each subtask's `## Delegation` section before writing files.

2. **Write session files** to `.opencode/sessions/{session-name}/`:
   - `index.md` — session name, goal, status, subtask table, gate locations
   - `spec.json` — full session spec: name, status, goal, currentSubtask: 1, totalSubtasks, circuitBreakerThreshold: 3, completedSteps: [], subtasks array with id/name/description/status for each
   - `subtask-NN-{name}.md` — one file per subtask, each with fully populated `## Objective`, `## Scope`, `## Constraints`, `## Todolist`, and `## Delegation` sections

3. **Call `activate_session`** with the session name to register it as the active session.

4. **Write the execution plan** to `.opencode/session-plans/{session-name}/plan.json` using the DAG schema:
   - One node per subtask (`type: "agent"`)
   - `entry` points to the first subtask node
   - Each node's `prompt` field points to the corresponding `subtask-NN-{name}.md` file
   - Sequential `next` links; include `remaining_visits` on any loop-capable nodes
   - Terminal node (last subtask) has no `next`
   - Set `status: "ready"` on the plan

5. **Commit the session**:
   ```
   git add .opencode/sessions/{session-name}/ .opencode/session-plans/{session-name}/
   git commit -m "plan: add session {session-name}"
   ```

6. **Present the final overview** to the user:
   - Subtask list with delegation assignments
   - Gate locations
   - Next step: "Run '/activate-plan {session-name}' when ready to begin execution."

## Constraints

- All `## Delegation` sections must be filled before writing files. Do not write `TBD`.
- Do not call `next_step()` — this is a terminal node. Call `close_session()` after the overview is presented.
