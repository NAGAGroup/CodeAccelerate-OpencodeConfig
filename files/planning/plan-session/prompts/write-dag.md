# Write Project DAG

Dispatch agents to write the project DAG files to `.opencode/session-plans/{task-name}/`.

## Todo

1. `task` — Dispatch @QuickDoc or @JuniorDev to create `plan.json` and all prompt files under `prompts/`. Provide the full DAG structure, node-by-node content, and directory layout.

**CRITICAL: Embed the complete `plan.json` as a JSON code block in the subagent task.** Do not describe the structure in prose or pass only a table. The subagent (@JuniorDev or @QuickDoc) has no DAG schema knowledge — they will write what you show them. If you give them JSON, they write JSON. If you give them a table, they may invent their own format.

The JSON you embed must follow the nested tree schema exactly:
- `next` is ALWAYS a full node object `{ "id": "...", "prompt": "...", "todo": [...], "next": ... }` — NEVER a string ID like `"next": "node-id"`
- Branch `next` is an array of `{ "when": "label", "node": { ... } }` — the `node` field is a full object, not a string
- Terminal nodes omit `next` entirely
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
- `next` — single node (linear), array of `{ when, node }` (branch), or omitted (terminal). **Every non-terminal node must have a `next` field** — omit only for true terminal nodes (`output-success`, `output-failure`).

### Node type → todo quick reference

Use these standard `todo` arrays when writing `plan.json`. Do not invent todo values — use only valid OpenCode tool names from this table:

| Node type | Standard `todo` array |
|---|---|
| `session-overview` | `[]` |
| `scout-parallel` (3 scouts) | `["task", "task", "task"]` |
| `analyze-deep` | `["task"]` |
| `sequential-thinking` | `["sequential-thinking_sequentialthinking"]` |
| `decision-gate` | `["question"]` |
| `parallel-tasks` (3 agents) | `["task", "task", "task"]` |
| `parallel-tasks` (4 agents) | `["task", "task", "task", "task"]` |
| `verification-check` | `["task"]` |
| `conditional-branch` | `[]` |
| `compression-node` | `["compress"]` |
| `output-success` | `[]` |
| `output-failure` | `[]` |

Adjust `parallel-tasks` todo length to match the actual number of parallel agent dispatches. All other types use the arrays above exactly.

## ❌ Wrong — do not produce this

```json
{
  "entry": {
    "id": "session-overview",
    "next": "implement-changes"
  },
  "nodes": {
    "implement-changes": { "id": "implement-changes", "next": "verify" }
  }
}
```

The above uses string IDs for `next` and a flat `nodes` map. The plugin cannot parse this — when `next` is a string, `node.next.id` is `undefined`, the node appears terminal, and the session auto-completes on activation.

## ✅ Correct — always produce this

```json
{
  "schema_version": "2.0",
  "id": "my-plan",
  "entry": {
    "id": "session-overview",
    "prompt": "session-overview.md",
    "todo": [],
    "next": {
      "id": "implement-changes",
      "prompt": "implement-changes.md",
      "todo": ["task", "task"],
      "next": {
        "id": "verify",
        "prompt": "verify.md",
        "todo": ["task"]
      }
    }
  }
}
```

Each node is a full object embedded inside its parent's `next` field. No string IDs. No separate `nodes` map.

## Prompt file content

> **Important:** Prompts describe steps in the USER's project task — they tell HeadWrench what to do to accomplish the user's goal. Do NOT write prompts that describe or reference the planning system, the DAG infrastructure, or how the planning flow works. Every prompt should address the actual task the user requested.

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

- `{{SESSION_PATH}}/node-library/CATALOGUE.md` — node types, structural primitives, and composition patterns
- `{{SESSION_PATH}}/reference/dag-design-guide.md` — schema spec, validity rules, and prompt writing guidance

## After this node completes

Once both tasks complete:

1. **Present a summary** to the user: what was written, where the files are, and the DAG structure
2. **STOP dispatching agents** — the write phase is complete
3. **Call `next_step()`** to advance to the activation gate, which will ask the user if they want to activate and execute immediately
