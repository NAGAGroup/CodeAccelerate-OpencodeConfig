# Write Project DAG

Dispatch agents to write the project DAG files to `.opencode/session-plans/{task-name}/`.

## Todo

1. `task` — Dispatch @QuickDoc or @JuniorDev to create `plan.json` and all prompt files under `prompts/`. Provide the full DAG structure, node-by-node content, and directory layout.
2. `validate_dag` — Call the `validate_dag` tool with the plan name to check structural correctness and prompt quality. Review the findings report — it may identify issues for the next step to fix.
3. `task` — Dispatch @HeadWrench (subagent) to verify the written files: read `plan.json`, check that all prompt filenames exist in `prompts/`, validate the DAG structure, and fix any issues reported by `validate_dag`.

## Directory structure

```
.opencode/session-plans/{task-name}/
├── plan.json           ← The executable DAG
└── prompts/            ← One markdown file per node
    ├── session-overview.md
    ├── implement-auth.md
    └── ...
```

## plan.json structure

```json
{
  "schema_version": "2.0",
  "id": "{task-name}",
  "entry": {
    "id": "session-overview",
    "prompt": "session-overview.md",
    "todo": [],
    "next": { ... }
  }
}
```

## Node rules

- `id` — unique within the **entire DAG tree** (use `-<N>` suffixes for repeated nodes: `test-2`, `fix-3`). **Every node id must be unique — duplicate ids corrupt the node map and cause silent terminal behavior.** A loop-back or rethink path must use a fresh id (e.g. `audit-2`), not reuse an existing one.
- `prompt` — **filename only** (e.g. `"implement-auth.md"`). The plugin resolves bare filenames to the `prompts/` subdirectory automatically. Do NOT include paths.
- `todo` — strict sequence of OpenCode tool names HeadWrench must call. The plugin **blocks** tool calls that don't match the expected todo item.
  - `task` for dispatching subagents (including @HeadWrench for check/fix work)
  - `question` for user decisions — prompts MUST instruct HW to use the `question` tool
  - `bash` for running commands
  - `sequential-thinking_sequentialthinking` for HW reasoning steps
- `next` — single node (linear), array of `{ when, node }` (branch), or omitted (terminal)

## Prompt file content

Each prompt should tell HeadWrench:
- What the node's goal is
- Which agent(s) to dispatch and what to tell them
- What success looks like
- A `## Todo` section that mirrors the JSON todo array with explanations (required for non-empty todos)
- If `question` is in the todo: **explicitly instruct** HW to use the `question` tool

Example todo section for a node with `"todo": ["task", "bash"]`:
```markdown
## Todo

1. `task` — Dispatch @JuniorDev to implement the changes in `src/foo.ts`
2. `bash` — Run `npm test` to verify the changes pass
```

Keep prompts focused on delegation. HeadWrench dispatches agents — it doesn't do the work itself (except via @HeadWrench subagent for check/fix nodes).

## Reference

- `node-library/CATALOGUE.md` — node types, structural primitives, and composition patterns
- `reference/dag-design-guide.md` — schema spec, validity rules, and prompt writing guidance

## After this node completes

This is the **terminal node** of the planning session. Once both tasks complete:

1. **Present a summary** to the user: what was written, where the files are, and the DAG structure
2. **Tell the user** they can activate the plan with `/activate-plan {task-name}`
3. **STOP** — do NOT activate the plan yourself, do NOT dispatch more agents, do NOT start executing the project DAG. The planning session is over.
