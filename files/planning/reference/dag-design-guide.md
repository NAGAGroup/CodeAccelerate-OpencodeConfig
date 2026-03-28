# DAG Design Guide

Reference for composing project DAGs. Project DAGs are nested trees of nodes that HeadWrench executes by dispatching specialist agents.

## Schema (v2.0)

```json
{
  "schema_version": "2.0",
  "id": "my-project-dag",
  "entry": {
    "id": "session-overview",
    "prompt": "session-overview.md",
    "todo": [],
    "next": { ... }
  }
}
```

### Node fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique within the tree. Use suffixes for duplicates: `test-<N>`, `fix-<N>` |
| `prompt` | string | yes | Filename of the prompt file (e.g. `"implement-auth.md"`) |
| `todo` | string[] | yes | Strict sequence of OpenCode tool names. Empty `[]` means auto-advance |
| `next` | node, branch[], or omitted | no | What comes after this node |

### Todo items

Todo lists use OpenCode built-in tool names. The most common:

| Tool | Use when |
|------|----------|
| `task` | Dispatching a subagent (scout, junior-dev, etc.) |
| `question` | Asking the user for input or approval |
| `bash` | Running a shell command (tests, builds) |
| `sequential-thinking_sequentialthinking` | HW reasons through a decision directly |

HeadWrench delegates — it does not call `read`, `write`, `edit` directly. Those are for subagents.

### Next field

- **Linear:** `"next": { "id": "step-2", ... }` — single child, auto-advances
- **Branch:** `"next": [{ "when": "...", "node": { ... } }, ...]` — agent picks a path
- **Terminal:** omit `next` — session ends automatically

---

## Structural Primitives

Every DAG is composed from three primitives.

### 1. Sequence

Nodes in a straight line. Use when steps have a clear order with no decisions.

```
setup → implement → test → document
```

```json
{
  "id": "setup", "prompt": "setup.md", "todo": ["task"],
  "next": {
    "id": "implement", "prompt": "implement.md", "todo": ["task", "task"],
    "next": {
      "id": "test", "prompt": "test.md", "todo": ["task"],
      "next": {
        "id": "document", "prompt": "document.md", "todo": ["task"]
      }
    }
  }
}
```

### 2. Branch

A choice point where the path depends on a decision. Each branch carries its own complete subtree — branches do NOT converge. The DAG is a tree, not a graph; nodes cannot be shared across branches.

```
investigate → [decision]
  ├── "option A" → subtree-A
  └── "option B" → subtree-B
```

**User-decided branch** — use a `decision-gate` node (todo: `["question"]`):

```json
{
  "id": "choose-strategy",
  "prompt": "choose-strategy.md",
  "todo": ["question"],
  "next": [
    { "when": "User chose JWT", "node": { "id": "impl-jwt", ... } },
    { "when": "User chose OAuth", "node": { "id": "impl-oauth", ... } }
  ]
}
```

**Condition-decided branch** — use a `conditional-branch` node (todo: `[]`). HW evaluates the condition from prior context and calls `next_step`:

```json
{
  "id": "check-build-result",
  "prompt": "check-build-result.md",
  "todo": [],
  "next": [
    { "when": "Build succeeded", "node": { "id": "deploy", ... } },
    { "when": "Build failed", "node": { "id": "fix", ... } }
  ]
}
```

### 3. Iteration (Unrolled)

A pattern repeated N times with an exit branch after each repetition. No loop-backs — each iteration is an explicit duplicate of the nodes.

```
implement → test → [pass?]
  ├── "fail" → fix → test-2 → [pass?]
  │     ├── "fail" → fix-2 → test-3  ← forced terminal
  │     └── "pass" → output-success-2
  └── "pass" → output-success
```

The unroll depth IS the iteration cap. Ask the user how many iterations to budget during planning.

```json
{
  "id": "test", "prompt": "test.md", "todo": [],
  "next": [
    { "when": "Tests fail", "node": {
      "id": "fix", "prompt": "fix.md", "todo": ["task"],
      "next": {
        "id": "test-2", "prompt": "test.md", "todo": [],
        "next": [
          { "when": "Tests fail", "node": {
            "id": "fix-2", "prompt": "fix.md", "todo": ["task"],
            "next": { "id": "test-3", "prompt": "test.md", "todo": [] }
          }},
          { "when": "Tests pass", "node": {
            "id": "output-success-2", "prompt": "output-success.md", "todo": []
          }}
        ]
      }
    }},
    { "when": "Tests pass", "node": {
      "id": "output-success", "prompt": "output-success.md", "todo": []
    }}
  ]
}
```

---

## Composition

Combine primitives freely. A branch can contain iteration on one path. An iteration step can contain a branch. There are no named "shapes" — just trees built from primitives.

**Example: Branch with iteration on one path**
```
overview → investigate → [branch]
  ├── "auth" → implement-auth → test-auth → [iterate if fail]
  │     ├── "fail" → fix-auth → test-auth-2
  │     └── "pass" → output-success
  └── "payments" → implement-pay → test-pay → output-success-2
```

---

## Validity Rules

1. Every `id` must be unique within the tree (use `-<N>` suffixes for duplicates)
2. Every path must reach a terminal node (no `next` field)
3. Every `prompt` filename must have a corresponding `.md` file in the `prompts/` directory
4. `todo` arrays must only contain valid OpenCode tool names
5. Branch arrays must have at least 2 options
6. Each `when` string must be distinct and clearly describe when to choose that path
7. Nodes cannot be shared across branches — the DAG is a tree

---

## Project DAG Directory Structure

```
.opencode/session-plans/{task-name}/
├── plan.json           ← The executable DAG
└── prompts/            ← One markdown file per node
    ├── session-overview.md
    ├── implement-auth.md
    └── ...
```

Prompt fields in `plan.json` use **bare filenames only** (e.g. `"implement-auth.md"`). The plugin resolves them to the `prompts/` subdirectory automatically. Do NOT include directory paths in the `prompt` field.

---

## Writing Good Node Prompts

Each prompt tells HeadWrench what to do at that node:

- **Goal** — What this node accomplishes
- **Agent(s) to dispatch** — Which specialist and what to tell them
- **Success criteria** — How to know the node is done
- Keep it focused on delegation. HeadWrench dispatches; agents do the work.

### Todo section (required for non-empty todos)

Every prompt whose node has a non-empty `todo` array MUST include a `## Todo` section that mirrors the JSON todo list with explanations. The numbered list must match the JSON array in order and length.

Example for a node with `"todo": ["task", "task", "bash"]`:

```markdown
## Todo

1. `task` — Dispatch @JuniorDev to implement the auth module in `src/auth.ts`
2. `task` — Dispatch @QuickDoc to write API docs for the new endpoints
3. `bash` — Run `npm test` to verify the implementation passes all tests
```

### Question tool instructions

If a node's todo includes `question`, the prompt MUST explicitly instruct HeadWrench to use the `question` tool. Do not assume HW will infer this — state it clearly. The plugin blocks tool calls that don't match the expected todo sequence.

### Node library

For reusable node templates with ready-made prompts and schemas, see `{{SESSION_PATH}}/node-library/CATALOGUE.md`.
