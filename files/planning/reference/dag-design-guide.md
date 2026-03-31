# DAG Design Guide

Reference for composing project DAGs. Project DAGs are nested trees of nodes that HeadWrench executes by dispatching specialist agents.

---

## Authoring Tools

DAGs are built with five tools — do not hand-write `plan.json`.

| Tool | When to call |
|------|-------------|
| `init_dag` | Once per DAG — creates the plan directory and entry node |
| `add_node` | Once per subsequent node, in execution order |
| `show_dag` | After each addition to verify structure |
| `modify_node` | To update a node's prompt, todo, or `when` label |
| `delete_node` | To remove a node and its entire subtree |

**`target` is always the plan name** (e.g., `"my-feature-delivery"`), never a file path or directory.

---

## Node Fields

Each node has four fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique within the tree. Suffixes for duplicates: `test`, `test-2`, `test-3` (never `-1`) |
| `prompt` | string | yes | Bare filename of the prompt file (e.g. `"implement-auth.md"`) |
| `todo` | string[] | yes | Strict sequence of OpenCode tool names HW must call at this node |
| `next` | linear, branch, or omitted | no | What comes after this node; omit for terminal nodes |

> ⚠️ **Node ID uniqueness is a breaking constraint.** Every `id` in the entire tree must be unique. The plugin throws on duplicate IDs.

### Todo items

| Tool | Use when |
|------|----------|
| `task` | Dispatching a subagent (scout, junior-dev, etc.) |
| `question` | Asking the user for input or approval |
| `bash` | Running a shell command (tests, builds) |
| `sequential-thinking_sequentialthinking` | HW reasons through a decision directly |
| `validate_dag` | Checking plan.json structure before activation |
| `compress` | Compressing stale context |

HeadWrench delegates — it does not call `read`, `write`, or `edit` directly. Those are for subagents.

---

## Execution

Every non-terminal node requires an explicit `next_step()` call after all todos complete:

- **Linear nodes:** `next_step()` — no argument, advances to the single child
- **Branch nodes:** `next_step({ next: "<node-id>" })` — pass the **node ID** of the chosen branch (not the `when` string)
- **Terminal nodes:** auto-complete — no `next_step()` needed

---

## Structural Primitives

Every DAG is composed from three primitives.

### 1. Sequence

Nodes in a straight line. Use when steps have a clear order with no decisions.

```
setup → implement → test → document
```

Build with `add_node` calls in order: `init_dag` creates `setup`, then `add_node` with `parentId: "setup"` creates `implement`, then `add_node` with `parentId: "implement"` creates `test`, and so on. Each `add_node` call omits `when` (linear add).

### 2. Branch

A choice point where the path depends on a decision. Each branch carries its own complete subtree. Branches do NOT converge — the DAG is a tree, not a graph.

```
investigate → [decision]
  ├── "option A" → subtree-A
  └── "option B" → subtree-B
```

Build by calling `add_node` with `parentId: "investigate"` and a `when` string for each branch. Call it twice (once per branch option) — the first call initializes the branch array, the second appends to it. The plugin requires ≥2 branches before activation (`validate_dag` enforces this).

**User-decided branch** — use a `decision-gate` node (todo: `["question"]`). HW asks the user, then routes via `next_step({ next: "<chosen-node-id>" })`.

**Condition-decided branch** — use a `conditional-branch` node (todo: `[]`). HW reads prior context and routes immediately via `next_step({ next: "<node-id>" })`.

`when` strings must be specific enough that HW can unambiguously map the runtime condition to exactly one branch. Prefer `"Tests pass"` / `"Tests fail"` over `"good"` / `"not good"`.

### 3. Iteration (Unrolled)

A pattern repeated N times. No loop-backs — each iteration is an explicit duplicate of the nodes, with suffixed IDs.

```
implement → test → [pass?]
  ├── "fail" → fix → test-2 → [pass?]
  │     ├── "fail" → fix-2 → test-3  ← forced terminal
  │     └── "pass" → output-success-2
  └── "pass" → output-success
```

The unroll depth IS the iteration cap. Ask the user how many iterations to budget during planning. All paths — including forced exits — must terminate with `output-success` or `output-failure`.

Build by adding `test` as a branch node, then `fix` as its child, then `test-2` (suffixed ID) as `fix`'s child, and so on. Each loop is a separate set of `add_node` calls.

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

## Writing Good Node Prompts

Each prompt tells HeadWrench what to do at that node:

- **Goal** — What this node accomplishes
- **Agent(s) to dispatch** — Which specialist and what to tell them
- **Success criteria** — How to know the node is done
- Keep it focused on delegation. HeadWrench dispatches; agents do the work.

### Todo section (required for non-empty todos)

Every prompt whose node has a non-empty `todo` array MUST include a `## Todo` section that mirrors the todo list with explanations. The numbered list must match the array in order and length.

Example for a node with `todo: ["task", "task", "bash"]`:

```markdown
## Todo

1. `task` — Dispatch @JuniorDev to implement the auth module in `src/auth.ts`
2. `task` — Dispatch @QuickDoc to write API docs for the new endpoints
3. `bash` — Run `npm test` to verify the implementation passes all tests
```

### Question tool instructions

If a node's todo includes `question`, the prompt MUST explicitly instruct HeadWrench to use the `question` tool with the specific options. The plugin blocks tool calls that don't match the expected todo sequence — HW will not infer this.

### Node library

For reusable node templates with ready-made prompts and schemas, see `{{SESSION_PATH}}/node-library/CATALOGUE.md`.

---

## Validity Rules

1. Every `id` must be unique within the tree (use `-<N>` suffixes for duplicates)
2. Every path must reach a terminal node (a node with no `next`)
3. Every `prompt` filename must have a corresponding `.md` file in the `prompts/` directory
4. `todo` arrays must only contain valid OpenCode tool names
5. Branch arrays must have at least 2 options
6. Each `when` string must be distinct and clearly describe when to choose that path
7. Nodes cannot be shared across branches — the DAG is a tree

Run `validate_dag` before activation. It checks JSON validity, node ID uniqueness, and prompt file accessibility automatically.

---

## Project DAG Directory Structure

```
.opencode/session-plans/{task-name}/
├── plan.json           ← The executable DAG (written by tools, not by hand)
└── prompts/            ← One markdown file per node
    ├── session-overview.md
    ├── implement-auth.md
    └── ...
```

Prompt filenames use the **exact node ID** (e.g., `implement-auth.md` for node `implement-auth`). The `prompt` field in each node is a bare filename — no directory path. The plugin resolves it to the `prompts/` subdirectory automatically.

---

## Anti-patterns

These cause session failures. Each has a tool-level fix.

### ❌ Passing a path instead of a plan name

Calling `add_node(target: ".opencode/session-plans/my-plan", ...)` instead of `add_node(target: "my-plan", ...)`. The `target` parameter for all DAG tools is always the **plan name** — a bare string like `"my-plan"` or `"feature-delivery"`. Paths and directory names are not valid inputs.

### ❌ Adding a branch node with only one branch

Calling `add_node` with `when` only once and then activating. Branch nodes require ≥2 options. `validate_dag` will catch this before activation. Always add both (or all) branches before proceeding.

### ❌ Reusing a node ID

Using `output-success` on both the pass and fail branches of the same DAG. Every node ID must be unique across the entire tree. Use `-<N>` suffixes: `output-success`, `output-success-2`.

### ❌ Path in the prompt field

Setting `prompt` to `"prompts/session-overview.md"` instead of `"session-overview.md"`. The plugin resolves bare filenames automatically. Directory paths break resolution.

### ❌ Prompt file with wrong name

Writing the prompt file as `scout.md` when the node ID is `run-scout`. Prompt filenames must exactly match the node ID. `validate_dag` checks this.

### ❌ Todo array mismatch with prompt

A node has `todo: ["task", "task"]` but its prompt file only has one `## Todo` entry. The plugin enforces todos in order — if the prompt only describes one task, the second `task` todo will never be satisfied and the session will stall.

---

## Before activating the plan

Run `validate_dag` first, then confirm:

- [ ] Every node has a unique ID across the entire tree
- [ ] Every `prompt` is a bare filename (no path prefix)
- [ ] Every non-terminal node has a successor (added via `add_node`)
- [ ] Terminal nodes (`output-success`, `output-failure`) have no successor
- [ ] Every branch node has ≥2 branch options
- [ ] Each branch `when` string is distinct and unambiguous within its branch array
- [ ] Every node with a non-empty todo array has a `## Todo` section in its prompt file that mirrors the todo list in order and length
- [ ] `show_dag` output matches the intended structure
