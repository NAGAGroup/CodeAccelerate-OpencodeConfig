# {{NODE_PURPOSE}}

*A descriptive name for this node, not the generic type. Good: "Verify file exists before branching". Bad: "Generic node".*

## STOP — Do not work ahead

Your only job in this node is to execute the todo sequence below in exact order, then call `next_step()`. Do NOT skip steps, reorder them, or deviate from the sequence. If a step fails, consult the failure handling in the step instructions — do not invent recovery steps not listed.

### Todo sequence

{{TODO_SEQUENCE}}

*List tools in order. Valid items:*
- *`task` — dispatch a subagent*
- *`bash` — run a shell command*
- *`question` — ask the user*
- *`compress` — compress context*
- *`sequential-thinking_sequentialthinking` — HW reasons step-by-step (exact tool name, underscore not hyphen)*
- *`validate_dag` — validate a project DAG*
- *Any MCP tool name (e.g., `context7_query-docs`, `exa_search`)*

Example:
```
1. bash — Run 'cmake --build build/' to verify compilation
2. task — Dispatch @JuniorDev to fix compile errors if any
3. question — Ask: "Ready to deploy?"
```

---

## Escape hatch node

This node type allows custom tool sequencing when standard templates don't fit. You define the exact todo array and instructions for each step. HW follows your sequence exactly.

## Node purpose and rationale

{{RATIONALE}}

*Why doesn't a standard template fit? Be specific. Examples:*
- *"Needs to run bash check, ask a confirmation question, then run another bash command — no standard template chains bash-question-bash."*
- *"Must dispatch two different agents in sequence with custom MCP tool in between."*
- *"Calls a custom MCP server method not covered by research-basic or research-deep."*

## Goal

{{GOAL}}

*State the observable outcome. E.g., "Verify the build artifacts exist in build/ and no linking errors remain before proceeding." Not: "Check things."*

---

## Zone 2: Step instructions

### Step instructions

{{STEP_INSTRUCTIONS}}

*For each todo item above, describe exactly what HW does and what success looks like. Format:*

**Step [N] — [tool name]:** [specific action] — success when [observable outcome].

*Examples:*
- *For `bash`: "Step 1 — bash: Run `npm run test` — success when exit code is 0."*
- *For `task`: "Step 2 — task: Dispatch @JuniorDev to fix…[see blockquote below]…— success when return specifies which files changed."*
- *For `question`: "Step 3 — question: Ask 'Proceed to production?' — success when user picks yes or no; advance based on answer."*

---

## Zone 3: Fixed execution specs and requirements

### Todo sequence execution

Execute the tools specified above in the exact order listed. Do not skip steps, reorder them, or deviate from the sequence. If a step fails (e.g., bash exits non-zero), decide: retry, escalate, or advance to an error-handling step (if one exists in your todo).

### If dispatching agents (task items)

For each `task` item in the todo sequence above, include a numbered blockquote here specifying the agent and what they must deliver. The blockquote is embedded in the step instructions and propagated to the subagent's task prompt at execution time.

**Format:**
> **Dispatch [agent name]:** When executing this step, dispatch the named agent with:
> (1) In your dispatch prompt, tell [agent] the exact file paths or patterns to read/edit (e.g., `src/kernels/*.cpp`, `CMakeLists.txt`, not "the kernel module")
> (2) In your dispatch prompt, state the specific change, question, or goal — not a vague theme
> (3) In your dispatch prompt, specify the expected return format — e.g., "a file-by-file list of changes with line numbers"
> (4) In your dispatch prompt, specify the scope note: files the agent must NOT touch — e.g., "Do NOT modify .opencode/ or test files"
> (5) termination instruction — "Return a brief confirmation of the observable outcome. Do not request further user input."

Example:
> **Dispatch @JuniorDev:** When executing step 2, dispatch @JuniorDev to fix compile errors in src/:
> (1) target files: `src/kernels/*.cpp` (read errors from prior bash output)
> (2) goal: resolve all compilation errors from step 1
> (3) return format: a list of files modified + line-by-line changes
> (4) scope: do NOT modify test files or .opencode/

### Rename requirement

**The node ID in the DAG must NOT be `generic`.** Rename it to a descriptive kebab-case identifier that captures the node's purpose. Examples: `verify-build-succeeds`, `confirm-and-deploy`, `check-env-vars`, `custom-mcp-lookup`.

A node with `"id": "generic"` in a project DAG will be confusing to future readers and can collide silently with other generic nodes if IDs are not unique. Always rename before saving the DAG.

### Scope reminder

Keep this node's todo sequence short — ideally 3–4 items max. Longer sequences should be split into multiple nodes connected by explicit branching. This keeps each node's purpose clear and failure recovery straightforward.

### Completion

After completing the last todo item in the sequence, MUST call `next_step()`. Do NOT add commentary, summarize results for the user, or start work from the next phase — `next_step()` transfers control to the next node.
