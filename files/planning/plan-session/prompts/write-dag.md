# write-dag

Write the complete project DAG (plan.json) and all node prompt files. Three-step cycle: write plan files → validate JSON → verify structure and content.

## Todo

1. **task** — Dispatch @HeadWrench subagent to write plan.json and prompt files
2. **validate_dag** — Call validate_dag tool to check JSON structure and node ID uniqueness
3. **task** — Dispatch @HeadWrench subagent to verify DAG structure, prompt content, and logical flow; fix any issues

---

## Step 1: Write Plan Files

When the planning agent (or sequential-thinking node) has finalized the DAG structure and content, you must write the executable plan files. Dispatch @HeadWrench as a subagent with this task. The subagent builds the DAG using `init_dag` and `add_node` — not by hand-writing `plan.json`.

> **Writing the plan write subagent's prompt:** When dispatching this subagent, include:
> 
> 1. **Plan name** — The directory name the plan will use under `.opencode/session-plans/` (e.g., `"my-feature-delivery"`). Use lowercase, hyphens only, no spaces.
> 2. **Complete node decomposition table** — Include a table with these columns: Node ID | Node Type | Agent | Todo Array | What it does | Branch conditions (if any). Each todo array must be quoted as JSON and must match exactly what will appear in the final plan.json. This table is the reference spec for what the subagent will write.
> 3. **ASCII diagram** — A top-to-bottom or left-to-right ASCII flowchart showing node connections, branch points, and terminal nodes. Format: node IDs in boxes, arrows between nodes, labeled branch conditions (e.g., `[yes] → activate-now`, `[no] → plan-complete`).
> 4. **List of node types used** — A bullet list of every distinct node type used in the DAG (e.g., `session-overview`, `sequential-thinking`, `decision-gate`, `research-basic`, etc.). This helps the subagent verify it has all required node library files to reference.
 > 5. **Instructions for the subagent:**
>    - (a) Read `{{SESSION_PATH}}/node-library/CATALOGUE.md` — the node type reference. Use this exact path; do not glob or list directories.
>    - (b) For each node type listed above, read the README and prompt-template in `{{SESSION_PATH}}/node-library/{node-type}/`.
 >    - (c) Call `init_dag` first to create the plan directory and entry node (`session-overview`). Pass: `plan_name` (the plan name from above), `dag_id` (same value), `entry_node_id: "session-overview"`, `entry_prompt_file: "session-overview.md"`, `entry_todo: []`.
>    - (d) Then call `add_node` for each subsequent node in execution order. For all DAG tool calls (`add_node`, `show_dag`, `modify_node`, `delete_node`), the `target` parameter is always the **plan name** (e.g., `"my-feature-delivery"`) — never a file path or directory path. Use `show_dag` to review the current structure after each addition. Use `modify_node` to update a node's prompt, todo, or `when` labels if needed. Use `delete_node` only if a node must be removed and replaced (it deletes the entire subtree).
>    - (e) Write all prompt files in `.opencode/session-plans/{plan-name}/prompts/`, one file per node ID (e.g., `prompts/session-overview.md`, `prompts/scout.md`). Prompt filenames must use the exact node ID, not the node type. Write prompt files alongside DAG authoring — do not wait until all nodes are added.
> 6. **Subagent return format** — Report back: (a) list of all files written with their paths, (b) the final `show_dag` ASCII diagram confirming the full structure, (c) confirmation that every prompt filename exists and matches its node ID.

---

## Step 2: Validate JSON Structure

After the subagent reports files written, call the built-in `validate_dag` tool to check the plan's JSON integrity, node ID uniqueness, and prompt file accessibility.

```
validate_dag {
  plan_name: "<plan-name>"
}
```

The tool checks:
- JSON syntax validity in plan.json
- All node IDs are globally unique (no duplicates across the tree)
- All prompt file references are resolvable
- No malformed node structures

If validation fails, note the error and proceed to Step 3 to fix it.

---

## Step 3: Verify DAG Structure and Prompt Content

After validate_dag completes (successfully or with errors), dispatch @HeadWrench as a subagent again to perform deep structural and content verification, then fix any issues found.

> **Writing the verify+fix subagent's prompt:** When dispatching this subagent, include:
> 
> 1. **Provide the plan name** — Use the same directory name from Step 1.
> 2. **Perform a verification checklist** — Check:
>    - (a) **File discoverability:** All prompt files referenced in plan.json exist under `.opencode/session-plans/{plan-name}/prompts/` with filenames matching node IDs exactly.
>    - (b) **DAG structure validity:** Verify (i) every node has a unique ID; (ii) all branch conditions point to valid next nodes by ID; (iii) entry node exists and is the root; (iv) all terminal nodes (nodes with `next: null` or no `next` field) are marked as terminals in the node definition.
>    - (c) **Prompt file content quality:** For each prompt file: (i) if the node's todo array is non-empty, the prompt must have a `## Todo` section listing each todo in order; (ii) if the node's todo includes `"question"`, the prompt must instruct HW to call the `question` tool with options; (iii) if the node's todo includes `"task"`, the prompt must dispatch a subagent with a numbered blockquote template; (iv) no unresolved `{{PLACEHOLDER}}` text remains; (v) the prompt states a clear purpose at the top.
>    - (d) **Logical flow validation:** Check (i) branches make semantic sense (e.g., decision-gate branches to two different nodes, not the same node twice); (ii) nodes that depend on prior findings from scout nodes are positioned after those scouts in the execution path; (iii) no orphaned nodes exist that cannot be reached from the entry node.
> 3. **Fix instruction** — Any issues found must be fixed in place. For JSON errors, correct the plan.json syntax. For missing prompt files, create them with a minimal scaffold. For malformed branches, rewrite them to point to valid nodes. For content gaps, add the missing sections.
> 4. **Subagent return format** — Report: (a) what was verified and the status of each check; (b) specific issues found (cite file paths and line numbers); (c) fixes applied; (d) final confirmation: "DAG is ready for activation."

---

## Completion

When Step 3 reports "DAG is ready for activation," the plan.json and all prompt files are written, validated, and verified. MUST call `next_step()` immediately — do NOT ask the user anything or present the DAG here. The activation-gate node handles the next user interaction.
