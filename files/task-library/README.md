# Modular Node Library

The modular node library is a reusable registry of DAG node types that compose planning and project workflows in CodeAccelerate. Instead of writing monolithic DAGs from scratch, you define nodes once and reuse them across multiple DAGs through templates and type registries.

## Overview

**What is it?**  
A collection of node definitions, templates, and schemas that enable DAG composition through modular, reusable components. Each node type encapsulates a single logical step in a planning or execution workflow.

**Purpose:**  
- Reduce duplication across planning and project DAGs
- Standardize node structure and naming conventions
- Enable rapid DAG generation by combining well-tested node types
- Maintain consistency across agent dispatch patterns

**Goals:**
1. **Composability** — Build complex DAGs by combining simple, tested node types
2. **Consistency** — All nodes follow the same schema and conventions
3. **Reusability** — Share nodes across multiple DAGs without copying
4. **Maintainability** — Update a node type once; changes propagate to all users

---

## Quick Start

### Using Existing Node Types

To compose a DAG using existing node types:

1. **Identify needed nodes** — Choose from the 13 core node types (see section below)
2. **Link them in sequence** — Use `next` to chain nodes in execution order
3. **Add branching** — Use `next` as an array for conditional paths
4. **Write prompts** — Create one `.md` file per node, matching the `prompt` field in the node definition
5. **Test** — Run validation and test with the planning-enforcement plugin

### Simple Example: Linear Task Execution

```json
{
  "schema_version": "2.0",
  "id": "my-task-dag",
  "entry": {
    "id": "setup",
    "prompt": "setup.md",
    "todo": ["task"],
    "next": {
      "id": "execute",
      "prompt": "execute.md",
      "todo": ["task", "bash"],
      "next": {
        "id": "verify",
        "prompt": "verify.md",
        "todo": ["bash"]
      }
    }
  }
}
```

### Branching Example: Decision Gate

```json
{
  "id": "evaluate",
  "prompt": "evaluate.md",
  "todo": ["task", "question"],
  "next": [
    {
      "when": "Ready to proceed",
      "node": {
        "id": "proceed",
        "prompt": "proceed.md",
        "todo": ["task"]
      }
    },
    {
      "when": "Need to revise",
      "node": {
        "id": "revise",
        "prompt": "revise.md",
        "todo": ["task"],
        "next": { "id": "evaluate-2", "prompt": "evaluate.md", "todo": ["task", "question"] }
      }
    }
  ]
}
```

---

## Directory Structure

```
.opencode/task-library/
├── config.jsonc              # Metadata and configuration (schema version, paths)
├── README.md                 # This file
├── nodes/                    # Core node type definitions
│   ├── intake.json           # Node definition for intake
│   ├── scout.json            # Node definition for scouting
│   └── ...                   # (13 core nodes total)
├── templates/                # Node templates for duplication
│   ├── task-dispatch.json    # Template for task-based nodes
│   ├── question-gate.json    # Template for decision gates
│   └── bash-execution.json   # Template for shell execution
├── schemas/                  # JSON schemas for validation
│   ├── node-v2.0.json        # Node schema (todo array format, field types)
│   └── dag-v2.0.json         # DAG schema (entry, branching structure)
└── manifest.jsonc            # Registry of all node types (names, IDs, descriptions)
```

### nodes/ Directory
Stores individual node type definitions. Each file is named `{node-id}.json` and contains:
- Unique node ID
- Todo sequence array
- Prompt filename reference
- Metadata (agent assignment, step budget)

### templates/ Directory
Reusable node templates for common patterns:
- **task-dispatch.json** — Basic agent dispatch (todo: ["task"])
- **question-gate.json** — User decision point (todo: ["question"])
- **bash-execution.json** — Shell command execution (todo: ["bash"])
- **compress-tool.json** — Artifact compression node (todo: ["task"])

### schemas/ Directory
Validation schemas in JSON Schema format:
- **node-v2.0.json** — Validates individual node structure
- **dag-v2.0.json** — Validates complete DAG structure (entry, branching, terminal paths)

### manifest.jsonc
Central registry listing all node types with:
- ID (unique key)
- Name (human-readable label)
- Description (purpose and when to use)
- Template reference
- Assigned agent (headwrench, context-scout, junior-dev, etc.)
- Step budget (12, 10, 20, etc.)

---

## The 13 Core Node Types

| ID | Name | Purpose | Todo Sequence | Primary Agent | When to Use |
|----|------|---------|---------------|---------------|------------|
| `intake` | Intake | Gather initial requirements, goals, constraints | `["question"]` | headwrench | Start of any planning or discovery session |
| `scout` | Scout | Explore codebase for context, patterns, dependencies | `["task", "task", "task"]` | context-scout | Understand existing code before planning |
| `propose-structure` | Propose Structure | Suggest DAG execution shape (linear, branch, loop) | `["question"]` | headwrench | After context gathering, choose execution pattern |
| `propose-decomposition` | Propose Decomposition | Break task into subtasks and route to agents | `["task"]` | headwrench | Structure work after execution shape decided |
| `planning-gate` | Planning Gate | User validates plan structure before execution | `["question"]` | headwrench | Gate before finalizing project DAG |
| `write-dag` | Write DAG | Generate project DAG from plan structure | `["task", "task"]` | headwrench | Produce executable DAG after planning approved |
| `execute-task` | Execute Task | Dispatch agent to implement a task | `["task"]` | junior-dev | Execute work units during project DAG |
| `run-tests` | Run Tests | Execute test suite and verify quality | `["bash"]` | junior-dev | Validate implementation after code changes |
| `compress-synthesis` | Compress Synthesis | Synthesize large outputs before decision gates | `["task"]` | context-insurgent | Reduce token load before critical decisions |
| `decision-gate` | Decision Gate | User chooses direction based on agent findings | `["question"]` | headwrench | Branch point requiring user input |
| `iterate-fix` | Iterate Fix | Fix implementation based on test failures | `["task"]` | junior-dev | Retry loop in test-fix-retry patterns |
| `document-output` | Document Output | Generate user-facing documentation | `["task"]` | quick-doc | Produce documentation after execution complete |
| `research-angle` | Research Angle | Investigate one research question aspect | `["task", "task"]` | deep-researcher | Deep-research DAGs: investigate multiple angles |

---

## How to Add a New Node Type

Follow these steps to create and register a new node type:

### Step 1: Copy Template
Start with the most relevant template from `templates/`:
```bash
cp templates/task-dispatch.json nodes/my-new-node.json
```

### Step 2: Customize node.json
Edit the new node file with:

```json
{
  "id": "my-new-node",
  "prompt": "my-new-node.md",
  "todo": ["task"],
  "next": {}
}
```

**DAG v2.0 node fields (only these 4 allowed):**
- `id` — Unique identifier within the DAG (lowercase, kebab-case)
- `prompt` — Bare filename (no paths) matching the prompt file
- `todo` — Array of OpenCode tool names: `["task"]`, `["bash"]`, `["question"]`, or `[]` for auto-advance
- `next` — Child node, array of branches, or omitted for terminal nodes

**Do NOT include metadata like `node_id`, `name`, `assigned_agent`, `step_budget`, `tags` in DAG node definitions.** These belong in separate node definition files, not in the DAG structure itself.

### Step 3: Write prompt.md
Create `{prompts-dir}/my-new-node.md` with required sections:

```markdown
# My New Node

**Goal:** What this node accomplishes (1-2 sentences)

## What to do

Detailed instructions for the agent. Include:
- What information to gather
- What tools to use
- Expected output format

## Delegation

**Agent:** @AgentName
**Step budget:** 10

1. First step in the sequence
2. Second step
3. ...

## Todo

1. `task` — Dispatch @AgentName to [specific instruction]
2. `bash` — Run [command] to [verify/test/etc]
```

**Important:** The `## Todo` section must list each item in the JSON `todo` array with explanations. Item order and count must match the JSON exactly.

### Step 4: Register in manifest.jsonc
Add an entry to `.opencode/task-library/manifest.jsonc`:

```jsonc
{
  "nodes": {
    // ... existing nodes ...
    "my-new-node": {
      "id": "my-new-node",
      "name": "My New Node",
      "description": "Describes what this node does",
      "template": "templates/task-dispatch.json",
      "agent": "junior-dev",
      "step_budget": 10,
      "enabled": true
    }
  }
}
```

### Step 5: Test Validation
Run schema validation:

```bash
# Validate node against schema
bunx ocx validate .opencode/task-library/nodes/my-new-node.json

# Validate DAG using the new node
bunx ocx validate .opencode/session-plans/my-dag/plan.json
```

Test with planning-enforcement plugin by creating a test DAG that uses your node and verifying it executes correctly.

---

## Node Type Conventions

Follow these rules to maintain consistency:

### Filenames
- **Node definitions:** `nodes/{node-id}.json` (lowercase, kebab-case)
- **Prompts:** Use bare filenames in `prompt` field (e.g., `"my-node.md"`, not `"prompts/my-node.md"`)
- **No paths in prompt references** — The plugin resolves them to the `prompts/` subdirectory automatically

### Node IDs
- **Unique within DAG** — No duplicate IDs in any single DAG tree
- **Iterations use numeric suffixes** — Reuse the same prompt with `-2`, `-3` suffixes:
  ```json
  { "id": "test", "prompt": "test.md", ... }
  { "id": "test-2", "prompt": "test.md", ... }
  { "id": "fix-2", "prompt": "fix.md", ... }
  ```

### Todo Arrays (v2.0 Schema)
- **Match JSON schema v2.0** — Only valid OpenCode tool names: `task`, `question`, `bash`
- **Empty array `[]` means auto-advance** — Node completes with no user/agent interaction
- **Non-empty `todo` requires `## Todo` section** — Prompt must document each todo item
- **Only 4 fields allowed in nodes:** `id`, `prompt`, `todo`, `next`
- **No custom metadata** — Remove any extra fields not in v2.0 spec

### Prompts
- **Include `## Todo` section** — Mirror the JSON todo array with explanations
- **One prompt file per unique prompt reference** — Multiple nodes can share the same prompt (via `-2` suffixes)
- **Keep focused** — One node = one logical step in the DAG

### Agent Step Budgets
Respect agent limits when assigning todo sequences:

| Agent | Budget | Best for |
|-------|--------|----------|
| headwrench | N/A | Orchestration, planning, delegation |
| context-scout | 12 | Quick codebase exploration |
| context-insurgent | 20 | Deep analysis, compression |
| junior-dev | 10 | Targeted code edits, implementation |
| deep-researcher | 15 | Web/docs research via MCP tools |
| quick-doc | 8 | Document generation |

If a node requires more steps than the agent's budget allows, split it into multiple nodes or assign to a different agent with higher budget.

---

## Best Practices

### DO:
- **Reuse node types via templates** — Don't create a new node type for every DAG; extend existing ones
- **Use numeric suffixes for iterations** — When repeating steps, use `-2`, `-3` to clarify sequence (same prompt file)
- **Keep todo arrays small** — 1-3 items per node. If more, split into multiple nodes
- **Document step budget reasoning** — In manifest, note why each agent assignment fits its budget
- **Test validation before deploying** — Run schema validation on all new nodes and DAGs

### DON'T:
- **Mix planning and project DAG node types** — Planning modes have their own scaffolds; don't reuse planning nodes in project DAGs
- **Exceed agent step budgets** — If your node requires more steps, choose a different agent or refactor into smaller nodes
- **Use paths in prompt fields** — Write `"my-node.md"`, not `"prompts/my-node.md"` or `"../prompts/my-node.md"`
- **Create single-use node types** — If a pattern only appears once, use a template instead
- **Leave prompts without `## Todo` sections** — Every prompt with a non-empty todo array must document each step

---

## Integration with Planning

The node library connects to CodeAccelerate's planning system:

### Planning-Enforcement Plugin
The plugin (`files/plugins/planning-enforcement.ts`) manages DAG execution:
- Loads node definitions from the node library
- Validates node types against schemas
- Dispatches agents based on `assigned_agent` field
- Enforces step budgets from `step_budget` field
- Tracks todo completion and advances nodes

When you register a new node in `manifest.jsonc`, the plugin automatically recognizes it for DAG composition.

### Existing Planning Modes
Five planning scaffolds use the node library:

| Mode | Purpose | Example Nodes |
|------|---------|---------------|
| `plan-generic` | Task decomposition | intake, scout, propose-structure, propose-decomposition, write-dag |
| `plan-debug` | Bug investigation | intake, scout, propose-structure, planning-gate, write-dag |
| `plan-collaborative` | Design collaboration | intake, propose-structure, decision-gate, write-dag |
| `plan-deep-research` | Research planning | intake, research-angle, compress-synthesis, planning-gate |
| `plan-deep-review` | Code review | intake, propose-structure, planning-gate |

When you add a new node type, it's immediately available in DAG designs targeting any planning mode.

### Delegation and Agent Routing
The delegation skill (`files/skills/delegation/SKILL.md`) routes tasks to agents. Nodes with `assigned_agent` field automatically route to the correct specialist:

```json
{ "assigned_agent": "context-scout", ... }  // Routed to context-scout
{ "assigned_agent": "junior-dev", ... }     // Routed to junior-dev
```

HeadWrench reads the `assigned_agent` field and delegates accordingly.

---

## Validation

Ensure new nodes and DAGs conform to the library standards:

### JSON Schema Validation
Validate individual node against the node schema:
```bash
bunx ocx validate .opencode/task-library/nodes/my-node.json
```

Validate complete DAG against the DAG schema:
```bash
bunx ocx validate .opencode/session-plans/my-dag/plan.json
```

### Prompt File Existence Checks
Verify all referenced prompt files exist:
```bash
# Check that every node's prompt field references an existing file
for file in .opencode/session-plans/plan-*/prompts/*.md; do
  echo "Prompt file exists: $file"
done
```

### Todo Array Matching Prompt Content
Verify that the `## Todo` section in each prompt matches the JSON todo array:

1. Count items in JSON `todo` array
2. Count numbered items in `## Todo` section of prompt
3. Verify item order and tool names match exactly

Example:
```json
// node.json
"todo": ["task", "bash", "question"]
```

```markdown
// node.md
## Todo

1. `task` — Dispatch @Agent to do X
2. `bash` — Run command to verify
3. `question` — Ask user for input
```

✓ Correct: 3 items, order matches, tools match

---

## Examples

### Example 1: Simple Test → Fix Loop

Compose a test-retry loop using existing nodes:

```json
{
  "id": "test-loop",
  "prompt": "test-loop.md",
  "todo": ["bash"],
  "next": [
    {
      "when": "Tests pass",
      "node": {
        "id": "done",
        "prompt": "done.md",
        "todo": []
      }
    },
    {
      "when": "Tests fail",
      "node": {
        "id": "fix",
        "prompt": "fix.md",
        "todo": ["task"],
        "next": {
          "id": "test-loop-2",
          "prompt": "test-loop.md",
          "todo": ["bash"],
          "next": [
            {
              "when": "Tests pass",
              "node": { "id": "done", "prompt": "done.md", "todo": [] }
            },
            {
              "when": "Tests fail again",
              "node": {
                "id": "investigate",
                "prompt": "investigate.md",
                "todo": ["task"]
              }
            }
          ]
        }
      }
    }
  ]
}
```

### Example 2: Research with Compression Before Decision

Use compression node before a user decision:

```json
{
  "id": "research-a",
  "prompt": "research-angle.md",
  "todo": ["task", "task"],
  "next": {
    "id": "research-b",
    "prompt": "research-angle.md",
    "todo": ["task", "task"],
    "next": {
      "id": "compress",
      "prompt": "compress-synthesis.md",
      "todo": ["task"],
      "next": {
        "id": "decide",
        "prompt": "decide.md",
        "todo": ["question"],
        "next": [
          {
            "when": "Proceed with approach A",
            "node": { "id": "impl-a", "prompt": "impl-a.md", "todo": ["task"] }
          },
          {
            "when": "Proceed with approach B",
            "node": { "id": "impl-b", "prompt": "impl-b.md", "todo": ["task"] }
          }
        ]
      }
    }
  }
}
```

### Example 3: Parallel Scouts Before Decision

Compose multiple scouts followed by user decision:

```json
{
  "id": "scout-architecture",
  "prompt": "scout-angle.md",
  "todo": ["task", "task"],
  "next": {
    "id": "scout-dependencies",
    "prompt": "scout-angle.md",
    "todo": ["task", "task"],
    "next": {
      "id": "decide-approach",
      "prompt": "decide-approach.md",
      "todo": ["question"],
      "next": [
        {
          "when": "Proceed with refactor",
          "node": {
            "id": "implement-refactor",
            "prompt": "implement-refactor.md",
            "todo": ["task"]
          }
        },
        {
          "when": "Keep current approach",
          "node": {
            "id": "optimize-current",
            "prompt": "optimize-current.md",
            "todo": ["task"]
          }
        }
      ]
    }
  }
}
```

---

## See Also

- **DAG Design Guide** — `files/planning/reference/dag-design-guide.md` — Complete schema reference and structural patterns
- **Planning System** — `files/planning/README.md` — Five planning modes and their scaffolds
- **Planning Enforcement Plugin** — `files/plugins/planning-enforcement.ts` — Runtime DAG validation and dispatch
- **Delegation Skill** — `files/skills/delegation/SKILL.md` — Agent routing and assignment
