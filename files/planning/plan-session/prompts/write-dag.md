# write-dag

Write the complete project DAG (plan.json) and all node prompt files. Three-step cycle: write plan files → validate JSON → verify structure and content.

## Todo

1. **task** — Dispatch @HeadWrench subagent to write plan.json and prompt files
2. **validate_dag** — Call validate_dag tool to check JSON structure and node ID uniqueness
3. **task** — Dispatch @HeadWrench subagent to verify DAG structure, prompt content, and logical flow; fix any issues

---

## Step 1: Write Plan Files

When the planning agent (or sequential-thinking node) has finalized the DAG structure and content, you must write the executable plan files. Dispatch @HeadWrench as a subagent with this task.

> **Writing the plan write subagent's prompt:** When dispatching this subagent, include:
> 
> 1. **Plan name** — The directory name the plan will use under `.opencode/session-plans/` (e.g., `"my-feature-delivery"`). Use lowercase, hyphens only, no spaces.
> 2. **Complete node decomposition table** — Include a table with these columns: Node ID | Node Type | Agent | Todo Array | What it does | Branch conditions (if any). Each todo array must be quoted as JSON and must match exactly what will appear in the final plan.json. This table is the reference spec for what the subagent will write.
> 3. **ASCII diagram** — A top-to-bottom or left-to-right ASCII flowchart showing node connections, branch points, and terminal nodes. Format: node IDs in boxes, arrows between nodes, labeled branch conditions (e.g., `[yes] → activate-now`, `[no] → plan-complete`).
> 4. **List of node types used** — A bullet list of every distinct node type used in the DAG (e.g., `session-overview`, `sequential-thinking`, `decision-gate`, `research-basic`, etc.). This helps the subagent verify it has all required node library files to reference.
> 5. **Instructions for the subagent:**
>    - (a) Read `files/planning/plan-session/node-library/CATALOGUE.md` — the node type reference.
>    - (b) Read `files/planning/reference/dag-design-guide.md` — the schema spec and authoring rules.
>    - (c) Read each node's README and template in `files/planning/plan-session/node-library/{node-type}/` for every node type listed above.
>    - (d) Write `plan.json` in `.opencode/session-plans/{plan-name}/` using the nested tree schema. **Critical:** In all `next` fields, embed the full node object, NOT a string ID. Every `next` value must be `{ id, nodeType, ... }`, never `"node-id-string"`. Branch arrays use this format: `"branches": [{ when: "condition text", next: { id, nodeType, ... } }, ...]`.
>    - (e) Write all prompt files in `.opencode/session-plans/{plan-name}/prompts/`, one file per node ID (e.g., `prompts/session-overview.md`, `prompts/scout.md`). Prompt filenames must use the exact node ID, not the node type.
> 6. **Subagent return format** — Report back: (a) list of all files written with their paths, (b) any JSON syntax errors encountered and how they were fixed, (c) confirmation that every prompt filename exists and matches its node ID.

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
> 1. **Plan name** — The same directory name from Step 1.
> 2. **Verification checklist** — The subagent must check:
>    - (a) **File discoverability:** All prompt files referenced in plan.json exist under `.opencode/session-plans/{plan-name}/prompts/` with filenames matching node IDs exactly.
>    - (b) **DAG structure validity:** Verify (i) every node has a unique ID; (ii) all branch conditions point to valid next nodes by ID; (iii) entry node exists and is the root; (iv) all terminal nodes (nodes with `next: null` or no `next` field) are marked as terminals in the node definition.
>    - (c) **Prompt file content quality:** For each prompt file: (i) if the node's todo array is non-empty, the prompt must have a `## Todo` section listing each todo in order; (ii) if the node's todo includes `"question"`, the prompt must instruct HW to call the `question` tool with options; (iii) if the node's todo includes `"task"`, the prompt must dispatch a subagent with a numbered blockquote template; (iv) no unresolved `{{PLACEHOLDER}}` text remains; (v) the prompt states a clear purpose at the top.
>    - (d) **Logical flow validation:** Check (i) branches make semantic sense (e.g., decision-gate branches to two different nodes, not the same node twice); (ii) nodes that depend on prior findings from scout nodes are positioned after those scouts in the execution path; (iii) no orphaned nodes exist that cannot be reached from the entry node.
> 3. **Fix instruction** — Any issues found must be fixed in place. For JSON errors, correct the plan.json syntax. For missing prompt files, create them with a minimal scaffold. For malformed branches, rewrite them to point to valid nodes. For content gaps, add the missing sections.
> 4. **Subagent return format** — Report: (a) what was verified and the status of each check; (b) specific issues found (cite file paths and line numbers); (c) fixes applied; (d) final confirmation: "DAG is ready for activation."

---

## Completion

When Step 3 reports "DAG is ready for activation," the plan.json and all prompt files are written, validated, and verified. The DAG is ready to proceed to the activation-gate node.
