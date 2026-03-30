# Write Project DAG

Dispatch agents to write the project DAG files to `.opencode/session-plans/{task-name}/`.

> **Writing the @HeadWrench subagent's write prompt:** In your dispatch prompt, provide:
> (1) tool-use sequence: instruct the subagent to read CATALOGUE.md first, then dag-design-guide.md, then relevant node READMEs; then write plan.json; then write all prompt files in prompts/;
> (2) input spec: the plan name, the complete node decomposition table (Node ID | node type | agent | todo | what it does | branch conditions), the ASCII diagram, and the list of node types used in this plan;
> (3) return format: after writing all files, report: the plan name, list of all files written with their paths, any schema issues encountered, and confirmation that all prompt filenames in plan.json exist in prompts/;
> (4) see the Do NOT block below for agent-specific constraints.

 > **@HeadWrench subagent — Do NOT:**
> - Write prompts that describe or reference the planning system/DAG infrastructure (prompts address the user's actual task only)
> - Use string IDs for `next` field values — `next` must always be a full embedded node object
> - Reuse node IDs across branches — every node ID must be globally unique in the DAG tree
> - Include file paths in `prompt` field values — use bare filenames only (e.g., `"prompt": "scout.md"` not `"prompt": "prompts/scout.md"`)
> - Invent todo values — use only valid OpenCode tool names from the todo reference table
> - Continue dispatching further agents after writing is complete — write files, validate locally, then return the report

## Todo

> **Task tool:** Required params: `subagent_type` (one of: `context-scout`, `context-insurgent`, `junior-dev`, `quick-doc`, `external-scout`, `headwrench`), `description` (3–5 words), `prompt` (full instructions). **`task_id` is optional — omit it for new tasks.** Only include `task_id` if resuming a prior session; it must start with `ses_`. Do not fabricate a `task_id`.

1. `task` — Dispatch @HeadWrench (subagent) to write the project DAG files. In your dispatch prompt, provide:
   - The plan name (directory name under `.opencode/session-plans/`)
    - The complete node decomposition table: Node ID | node type | agent | todo | what it does | branch conditions — **copy the exact todo arrays verbatim from sequential-thinking output; do NOT reconstruct them**
   - The ASCII diagram of the full DAG
   - The list of node types used in this plan (so the subagent knows which READMEs to read)

   Instruct the subagent to do the following **in order**:
    1. Read `{{SESSION_PATH}}/node-library/CATALOGUE.md` — for the full node type reference and todo arrays
    2. Read `{{SESSION_PATH}}/reference/dag-design-guide.md` — for the schema spec and validity rules
    3. For each node type used in this plan, read `{{SESSION_PATH}}/node-library/{node-type}/README.md` — to understand what each node's prompt should contain
   4. Write `plan.json` using the nested tree schema (see schema rules and examples below)
   5. Write all prompt files in `prompts/` — one per node, based on the decomposition table and node README guidance

    The subagent has full tool access (read, write, edit). It constructs the JSON from the schema docs — you do NOT need to embed a pre-serialized JSON blob.

    Report back: plan name, complete list of files written with their paths, any schema errors or warnings encountered, and confirmation that all prompt filenames exist in prompts/.

    Key schema reminders to include in the dispatch prompt:
   - `next` is ALWAYS a full node object — NEVER a string ID like `"next": "node-id"`
   - Branch `next` is an array of `{ "when": "label", "node": { ... } }` — the `node` field is a full object
   - Terminal nodes omit `next` entirely
   - `prompt` is filename only (e.g. `"implement-auth.md"`) — do NOT include paths
2. `validate_dag` — Call the `validate_dag` tool with the plan name to check structural correctness and prompt quality. Review the findings report — it may identify issues for the next step to fix.
3. `task` — Dispatch @HeadWrench (subagent) to verify the written files: read `plan.json`, check that all prompt filenames exist in `prompts/`, validate the DAG structure, and fix any issues reported by `validate_dag`. Even if `validate_dag` reports no structural issues, the subagent should confirm all prompt filenames listed in `plan.json` exist in the `prompts/` directory.

    Report back: what was verified, any issues found and fixed, final status ('all files present and valid' or specific remaining issues).

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
  - `compress` — HeadWrench calls the compress tool directly; valid **only** in `compression-node` types. Do not use in other node types.
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

`activate_plan` is also a valid todo value in terminal nodes that immediately activate a plan (used in `activate-now` style nodes).

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
