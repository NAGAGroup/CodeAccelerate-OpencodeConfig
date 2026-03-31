# CodeAccelerate: Current Configuration and Workflow Understanding

**Document Purpose:** Mechanistic reference. No recommendations, no opinions. Pure description of how the system actually works. Read this to understand every component from first principles.

---

## System Overview

**CodeAccelerate-OpencodeConfig** is an OCX (OpenCode Components) registry that distributes a multi-agent development system for the [OpenCode](https://opencode.ai/) platform. Users install components via `bunx ocx install`. The registry is built into static JSON assets and deployed to Cloudflare Workers, Vercel, or Netlify.

### The 8 Shipped Components

All 8 components are defined in `registry.jsonc`:

| Component | Type | Purpose | Dependencies |
|-----------|------|---------|---|
| `ocx-tools` | tool | Planning scaffolds + node library + planning-enforcement plugin | none |
| `ocx-bundle` | bundle | All agents, commands, and skills | ocx-tools |
| `ocx-default` | profile | Anthropic API (Claude Sonnet 4-6 + Haiku 4-5) | ocx-bundle |
| `ocx-copilot` | profile | GitHub Copilot | ocx-bundle |
| `ocx-haiku` | profile | All-Haiku Anthropic | ocx-bundle |
| `ocx-haiku-copilot` | profile | All-Haiku GitHub Copilot | ocx-bundle |
| `ocx-free` | profile | OpenCode Zen free tier | ocx-bundle |
| `ocx-ollama` | profile | Local Ollama (single model for all agents) | ocx-bundle |

**Dependency flow:** All profiles depend on `ocx-bundle`, which depends on `ocx-tools`.

---

## Agent System

Six agents. One orchestrator dispatches to five specialists. Every agent has a step budget and execution constraints.

### Agent Roster

| Agent | Model Tier | Step Budget | Parallel? | Shell Access? | Reasoning |
|---|---|---|---|---|---|
| **headwrench** | sonnet | unlimited | N/A | Yes | Primary orchestrator; plans, delegates, runs git/bash operations |
| **context-scout** | haiku | 12 | Yes | No | Internal codebase reads only; read-only file access |
| **context-insurgent** | sonnet | 20 | No | No | Deep multi-file reasoning; uses sequential-thinking MCP |
| **junior-dev** | haiku | 10 | Yes | No | Targeted code edits only; no bash, no multi-file reasoning |
| **external-scout** | haiku | 15 | Yes | No | Web and documentation research via Context7 and Exa MCPs |
| **quick-doc** | haiku | 8 | Yes | No | Single-file document writes and targeted edits |

### Agent Descriptions

**headwrench**
- Primary orchestrator and planner for the system
- Plans complex tasks and delegates to specialists via `task` tool
- Only agent with direct shell access (bash commands via HeadWrench)
- Navigates DAG nodes using `next_step` tool
- Does NOT write large code blocks or deep codebase exploration — delegates those tasks to specialists
- Runs with unlimited step budget

**context-scout**
- Quick, read-only internal codebase explorer
- Dispatched in parallel groups (typically 2-3 scouts in a single turn)
- Can read files and run `glob` and `grep` operations
- Does NOT access external URLs or perform web searches
- 12-step budget per dispatch
- Parallel-safe (multiple scouts run simultaneously)

**context-insurgent**
- Deep, multi-file reasoning engine
- Dispatched serially (one at a time, never in parallel)
- Uses sequential-thinking MCP for step-by-step reasoning
- Suitable for root cause analysis, cross-cutting architecture understanding, and complex dependency tracing
- 20-step budget per dispatch
- Not parallel-safe; blocks other agents during execution

**junior-dev**
- Targeted code editor for small, focused changes
- Edits specific files via surgical changes (not rewrites)
- Does NOT run bash commands, test code, or reason across more than ~3 files
- 10-step budget per dispatch
- Parallel-safe

**external-scout**
- Designated agent for all external research
- Accesses web documentation and APIs via Context7 MCP and Exa MCP
- Uses tool priority: Context7 first (library/framework documentation), Exa second (recency-sensitive content)
- Does NOT read internal codebase files
- 15-step budget per dispatch
- Parallel-safe

**quick-doc**
- Single-file document writer and editor
- Handles Markdown files, config files, and prompt files
- Does NOT write code
- 8-step budget per dispatch
- Parallel-safe

### Dispatch Isolation

When HeadWrench calls the `task` tool to dispatch a subagent, the subagent receives:
- The string in the `prompt` parameter only
- NO access to the parent session's conversation history
- NO access to prior tool outputs or DAG state
- NO access to the planning system itself

All context the subagent needs must be explicitly embedded in the prompt string.

---

## Planning Plugin: Enforcement Mechanics

### Source and Compilation

- **Source:** `files/plugins/planning-enforcement.ts` (TypeScript)
- **Runtime:** `files/plugins/planning-enforcement.js` (compiled during `bun run build`)
- **Editing rule:** Never manually edit the `.js` file. All changes go in `.ts` source.

### Activation

1. User runs `/plan-session` command
2. Plugin copies the planning DAG from `files/planning/plan-session/` to `.opencode/session-plans/{session-id}/`
3. Plugin rewrites prompt file paths to absolute paths
4. Plugin initializes a `DagSessionState` object and writes it to `.opencode/dag-state/{session-id}.json`
5. Session begins execution

### Session State Structure

State file location: `.opencode/dag-state/{session-id}.json`

```json
{
  "dag_id": "plan-session",
  "plan_path": "/absolute/path/to/.opencode/session-plans/plan-session-{session-id}/plan.json",
  "status": "running",
  "current_node": "session-overview",
  "todo_index": 0,
  "started_at": "2026-03-30T12:34:56.789Z",
  "updated_at": "2026-03-30T12:34:56.789Z",
  "decisions": [
    {
      "node_id": "research-gate",
      "timestamp": "2026-03-30T12:35:00.000Z",
      "summary": "User chose: yes, conduct planning-time research"
    }
  ],
  "node_map": {
    "session-overview": {
      "id": "session-overview",
      "prompt": "/path/to/prompts/session-overview.md",
      "todo": [],
      "nextLinear": "scout"
    },
    "scout": {
      "id": "scout",
      "prompt": "/path/to/prompts/scout.md",
      "todo": ["task", "task", "task", "task"],
      "nextLinear": "scout-node-library"
    }
  }
}
```

**Fields:**
- `dag_id`: Fixed identifier of the planning DAG (always "plan-session" for the shipped planning mode)
- `plan_path`: Absolute path to the local plan.json file
- `status`: One of `"running"`, `"waiting_step"`, `"complete"`, `"abandoned"`
- `current_node`: ID of the currently active node
- `todo_index`: How many todo items have been completed for the current node (increments from 0)
- `started_at`: ISO timestamp when the session began
- `updated_at`: ISO timestamp of the last state change
- `decisions`: Array of user branch decisions and their timestamps
- `node_map`: Flattened representation of the entire DAG tree (O(1) lookup by node ID)

### Tool Blocking Rules

Before executing any tool call, the plugin checks:

1. **Is the tool exempt?** Check against: `plan_session`, `activate_plan`, `next_step`, `recover_context`, `question`, `exit_plan`, `validate_dag`, `todowrite`, `sequential-thinking_sequentialthinking`
   - If exempt: allow the call, skip todo enforcement
2. **Does the tool match the current todo?** Check if tool name equals `currentNode.todo[todo_index]`
   - If match: allow the call, increment `todo_index`
   - If no match: block with error message stating the expected tool
3. **Otherwise:** block with error

**Critical note:** The tool `sequential-thinking_sequentialthinking` uses an **underscore** between the two name parts. Any variant (e.g., `sequential-thinking-sequentialthinking` with a hyphen) will not match and causes a permanent block — the expected tool call is never allowed. Copy the exact tool name from the exempt tools list.

### Todo Advancement and Auto-Advance

**After a tool call is allowed (non-exempt):**
1. The plugin increments `todo_index`
2. If `todo_index >= todo.length` (all todos completed):
   - Call `autoAdvance()`
   - Set `status = "waiting_step"`
   - Session waits for HeadWrench to call `next_step()` to explicitly advance to the next node

**Auto-advance means:** The node's todos are complete; the session is waiting for the orchestrator to decide what to do next (linear advance, branch selection, or exit).

### next_step() Tool

The `next_step()` tool is how the orchestrator advances the DAG. It only works when `status === "waiting_step"`.

**Linear advance (no branch selection):**
```
next_step()
```
- Sets `current_node = currentNode.nextLinear`
- Sets `todo_index = 0` (reset for new node)
- Sets `status = "running"`

**Branch advance (select a branch):**
```
next_step({ next: "write-dag" })
```
- Takes a `next` parameter with the **node ID** of the chosen branch
- Plugin looks for a branch where `branch.nodeId === "write-dag"`
- Sets `current_node` to the matched branch's node
- Sets `todo_index = 0`
- Sets `status = "running"`

**Important:** The `next` parameter must be the exact node ID, not the human-readable `when` string. The `when` field is display-only (shown in the branch-choice prompt and `recover_context()` output). Branch routing uses node-ID matching.

**Unmatched branch ID:**
If the `next` value doesn't match any branch's `nodeId`, the plugin **silently terminates the session** — it treats the call as if targeting a terminal node.

### Terminal Node Detection

When `autoAdvance()` is called for a node:
- Check: does the node have a `nextLinear` field? → No, not terminal
- Check: does the node have a `branches` array? → No, not terminal
- If neither exists: set `status = "complete"` (terminal node reached)

Terminal nodes (no next path) are entry/exit points in the DAG.

### Compaction Hook

When OpenCode compacts the conversation context:
1. The plugin fires a compaction hook
2. Injects the current `DagSessionState` into the compacted context
3. Allows `recover_context()` to reconstruct the session state after compaction
4. Session resumes at the same DAG node with the same todo progress

---

## Planning Session Flow (plan-session DAG)

The planning DAG lives in `files/planning/plan-session/plan.json` and contains 14 executable nodes.

### Node Execution Order and Details

**1. `session-overview`**
- **Todo:** `[]` (empty — no actions)
- **Action:** Displays a user-facing overview of what the planning session will accomplish
- **Advance:** No todos, so auto-advances immediately. HeadWrench calls `next_step()` to advance to `scout`

**2. `scout`**
- **Todo:** `["task","task","task","task"]` (4 task tool calls)
- **Action:** 
  - Task 1: HeadWrench dispatches ContextScout to read agent files + Ollama profile
  - Task 2: HeadWrench dispatches ContextScout to read one set of reference files
  - Task 3: HeadWrench dispatches ContextScout to read another set of reference files
  - Task 4: HeadWrench dispatches itself (subagent mode) to gather git context (runs bash commands)
  - All 4 tasks can be made in the same turn
- **Advance:** After 4th task, auto-advances to `waiting_step`. HeadWrench calls `next_step()` to advance to `scout-node-library`

**3. `scout-node-library`**
- **Todo:** `["task"]` (misleading name — actually a read operation)
- **Action:** HeadWrench directly reads `files/planning/plan-session/node-library/CATALOGUE.md` (no subagent dispatch). This is pure information-gathering before the research gate decision.
- **Advance:** After read, auto-advances to `waiting_step`. HeadWrench calls `next_step()` to advance to `pre-research-thinking`

**4. `pre-research-thinking`**
- **Todo:** `["sequential-thinking_sequentialthinking"]` (MCP tool call)
- **Action:** HeadWrench uses the sequential-thinking MCP to privately reason about whether planning-time research is needed. Outputs a recommendation: "Research recommendation: YES" or "Research recommendation: NO"
- **Advance:** After sequential thinking completes, auto-advances to `waiting_step`. HeadWrench calls `next_step()` to advance to `research-gate`

**5. `research-gate`**
- **Todo:** `["question","question"]` (2 user questions)
- **Action:**
  - Q1: "Do you want to conduct planning-time research?" (e.g., quick API lookup)
  - Q2: "Should the generated project DAG include execution-time research nodes?" (e.g., embedded research steps in the plan)
- **Branching:** 
  - If user wants research → HeadWrench calls `next_step({ next: "research-brief" })`
  - If no research → HeadWrench calls `next_step({ next: "sequential-thinking-2" })`
- **Advance:** Branch routing by node ID

**6. `research-brief` (Branch A only)**
- **Todo:** `["question","task"]` (ask user, then dispatch)
- **Action:**
  - Question: What should ExternalScout research?
  - Same turn: HeadWrench dispatches ExternalScout with the user's research topic
- **Advance:** After task, auto-advances to `waiting_step`. HeadWrench calls `next_step()` to advance to `sequential-thinking`

**7. `sequential-thinking` (Branch A) or `sequential-thinking-2` (Branch B)**
- **Todo:** `["sequential-thinking_sequentialthinking"]` (MCP tool call)
- **Action:** HeadWrench uses sequential thinking to design the complete project plan privately. Outputs nothing to the user. All reasoning happens internally.
- **Advance:** After reasoning, auto-advances to `waiting_step`. HeadWrench calls `next_step()` to advance to the next node

**8. `clarifying-questions` (Branch A) or `clarifying-questions-2` (Branch B)**
- **Todo:** `["question"]` (ask questions)
- **Action:** HeadWrench summarizes its understanding and asks any final clarifying questions before presenting the plan
- **Tool exemption:** The `question` tool is exempt, so HeadWrench can call it multiple times within this node if needed
- **Advance:** Via `next_step()` to advance to the proposal node

**9. `propose-plan` (or `-2`, `-3`, `-4` for rethink iterations)**
- **Todo:** `["question"]` (ask for approval)
- **Action:** HeadWrench presents the complete plan structure and decomposition. User chooses:
  - "Approve — write the DAG"
  - "Rethink"
- **Branching:**
  - If approved → HeadWrench calls `next_step({ next: "write-dag" })`
  - If rethink → HeadWrench calls `next_step({ next: "propose-plan-2" })` (loops back to another `sequential-thinking-<N>` node)
- **Note:** Multiple rethink iterations are supported via node ID suffixes (`propose-plan`, `propose-plan-2`, `propose-plan-3`, `propose-plan-4`)

**10. `write-dag`**
- **Todo:** `["task","validate_dag","task"]` (3 steps)
- **Action:**
  - Task 1: HeadWrench dispatches a subagent to write all plan files (plan.json + all prompt files). The subagent reads the node library documentation first.
  - `validate_dag`: HeadWrench calls the OpenCode `validate_dag` tool to validate the written plan
  - Task 2: HeadWrench dispatches another subagent to verify the written files are correct
- **Advance:** After all 3 steps, auto-advances to `waiting_step`. HeadWrench calls `next_step()` to advance to `activation-gate`

**11. `activation-gate`**
- **Todo:** `["question"]` (ask user)
- **Action:** HeadWrench asks: "Activate the plan now, or activate it later?"
- **Branching:**
  - If "activate now" → HeadWrench calls `next_step({ next: "activate-now" })`
  - If "activate later" → HeadWrench calls `next_step({ next: "plan-complete" })`

**12. `activate-now`**
- **Todo:** `["activate_plan"]` (execute tool)
- **Action:** HeadWrench calls the `activate_plan` tool, which converts the written plan.json into an active OpenCode session DAG
- **Terminal:** This is a terminal node (no `nextLinear`, no `branches`). Session status changes to `"complete"` after this node

**13. `plan-complete` (terminal node)**
- **Todo:** `[]` (no actions)
- **Action:** Terminal endpoint. Informs the user that the plan is written and how to activate it manually if they chose the "later" path

---

## Node Library: 14 Node Types

Location: `files/planning/plan-session/node-library/`

Reference file: `files/planning/plan-session/node-library/CATALOGUE.md`

### What is the Node Library?

Reusable node type templates that planning agents (or HeadWrench) select from when composing project DAGs. Each node type consists of three files:

- **`plan.json`** — Fixed node structure: id, prompt filename, todo array
- **`README.md`** — Authoring guidance: when to use this node type, what the planning agent must resolve before filling the template
- **`prompt-template.md`** — Scaffold with `{{PLACEHOLDER}}` slots the planning agent fills in, plus fixed execution-spec sections

### The 14 Node Types

| Node Type | Todo Array | Agents Involved | Purpose |
|-----------|------------|---|---|
| `session-overview` | `[]` | none | Entry node, auto-advance. Displays context for the planning session. |
| `scout-parallel` | `["task","task","task"]` | 3x ContextScout | Dispatch three scouts in parallel for independent codebase exploration. |
| `analyze-deep` | `["task"]` | 1x ContextInsurgent | Deep, serial multi-file reasoning and root cause analysis. |
| `sequential-thinking` | `["sequential-thinking_sequentialthinking"]` | HeadWrench (MCP) | HeadWrench reasons privately using sequential thinking. |
| `decision-gate` | `["question"]` | HeadWrench | Ask user to choose a branch. Routes to different paths based on answer. |
| `parallel-tasks` | `["task","task","task"]` | 3x haiku agents | Dispatch three agents in parallel (mix of scouts, editors, writers). |
| `verification-check` | `["task"]` | HeadWrench subagent | HeadWrench dispatches itself with shell access to verify build/test results. |
| `conditional-branch` | `[]` | none | HeadWrench calls `next_step()` from prior context. No actions, purely structural. |
| `compression-node` | `["compress"]` | HeadWrench (native tool) | HeadWrench calls the native `compress` tool to summarize session context. |
| `output-success` | `[]` | none | Terminal node for successful execution path. |
| `output-failure` | `[]` | none | Terminal node for failure path. |
| `research-basic` | `["task"]` | 1x ExternalScout | Targeted, one-shot external research (API docs, library reference). |
| `research-deep` | `["task"]` | 1x ExternalScout | Intensive, multi-step external research (deep investigation across sources). |
| `generic` | flexible | varies | Escape hatch for custom node types not covered by the standard library. |

### Node ID Conventions

- **Repeated nodes:** Use `-<N>` suffix for repeated instances of the same node type (e.g., `test-2`, `fix-3`, `analyze-deep-2`)
- **Uniqueness:** Every node ID must be globally unique within the DAG tree
- **No loops/sharing:** DAGs are trees — nodes cannot be reused or shared across branches. Each branch needs its own terminal instance.
- **Validation:** The plugin now throws a validation error if duplicate node IDs are detected. Before this validation was added, duplicate IDs silently overwrote the node_map entry and caused nodes to behave as terminals, ending the session prematurely.

### Node Structure in JSON

Each node in the DAG has this structure:

```json
{
  "id": "unique-node-id",
  "prompt": "/path/to/prompt.md",
  "todo": ["task", "question", ...],
  "next": {
    "id": "next-node-id",
    "prompt": "...",
    "todo": [...],
    "next": ...
  }
}
```

Or with branching:

```json
{
  "id": "decision-node",
  "prompt": "/path/to/prompt.md",
  "todo": ["question"],
  "next": [
    {
      "when": "yes, proceed with research",
      "node": {
        "id": "research-node",
        "prompt": "...",
        "todo": [...],
        "next": ...
      }
    },
    {
      "when": "no, skip research",
      "node": {
        "id": "skip-research-node",
        "prompt": "...",
        "todo": [...],
        "next": ...
      }
    }
  ]
}
```

**The `when` field:**
- Display-only. Shows in branch-choice prompts and `recover_context()` output.
- Branch routing uses `node.id`, not `when` strings. When HeadWrench calls `next_step({ next: "research-node" })`, the plugin matches the `next` value against each branch's `node.id`.

---

## Ollama Profile

File: `files/profiles/ollama/opencode.jsonc`

### Model Routing

Unlike the default Anthropic profile, which uses Claude Sonnet for orchestrator/deep-reasoning tasks and Haiku for specialist tasks, the Ollama profile uses a **single model for all agents and tasks:**

- **All 6 agents** → `ollama/opencode-model`
- **Compaction** → `ollama/opencode-model`
- **Small model** → `ollama/opencode-model`

### Native Agent Disabling

Three native OpenCode agents are disabled (removed from the available agent list):
- `plan`
- `general`
- `explore`

These are replaced by the CodeAccelerate agent system (headwrench + 5 specialists).

### MCP Configuration

Three MCP servers are configured:

| Server | Purpose | API Key Required | Notes |
|--------|---------|---|---|
| `context7` | Library and framework documentation lookup | No | Built-in context system; no auth required |
| `sequential-thinking` | Step-by-step reasoning | No | Built-in thinking system; no auth required |
| `exa` | Web search | Yes: `EXA_API_KEY` env var | Network access required; not fully offline |

**Offline capability:** The Ollama profile is not fully offline because Exa requires network access and an API key. To use the Ollama profile, you must:
1. Have a local Ollama instance running
2. Set the `EXA_API_KEY` environment variable (if using ExternalScout)

### Setting the Model

The Ollama profile routes all inference to `opencode-model`. Set this model with:

```bash
ollama cp <model> opencode-model
```

Example:

```bash
ollama cp llama2 opencode-model
ollama cp mistral opencode-model
ollama cp neural-chat opencode-model
```

### Single-Model Implications

Unlike the Anthropic profile (Sonnet for HW/CI, Haiku for specialists), the Ollama profile uses one model for all roles:

- **Orchestrator tasks** (HeadWrench planning, ContextInsurgent deep analysis) demand high reasoning capacity
- **Specialist tasks** (quick reads, targeted edits) are lower-complexity
- **No cost differentiation:** All agent calls consume the same local inference resources
- **Model selection matters:** Choose a model capable of both orchestration and rapid execution

Suitable models:
- **Mistral** — Good balance of reasoning and speed
- **Neural-Chat** — Optimized for dialogue; reasonable for planning
- **Llama2** — General-purpose; works but slower for reasoning tasks
- Avoid very small models (< 7B parameters) for orchestration tasks

---

## Implementation Details: Plugin Initialization

When `/plan-session` is triggered:

1. **Copy DAG:** Plugin copies `files/planning/plan-session/` contents to `.opencode/session-plans/plan-session-{session-id}/`
2. **Rewrite paths:** Any bare filenames in prompt fields (e.g., `"scout.md"`) are rewritten to absolute paths (e.g., `/home/user/.opencode/session-plans/plan-session-{id}/prompts/scout.md`)
3. **Flatten tree:** Plugin converts the nested DAG tree into a flat node map for O(1) lookup by ID during execution
4. **Initialize state:** Plugin creates `DagSessionState` with `status = "running"`, `current_node = "session-overview"`, `todo_index = 0`
5. **Write state file:** State is persisted to `.opencode/dag-state/{session-id}.json`
6. **Begin execution:** First node's prompt is loaded and the session begins

---

## Error Cases and Recovery

### Blocked Tool Call

When a tool call violates todo ordering:

```
ERROR: Tool [tool-name] is not allowed at this step.
Expected tool at index [n]: [expected-tool]
Current node: [node-id]
```

The agent cannot proceed. HeadWrench must either:
- Call the correct tool next
- Call an exempt tool (`question`, `recover_context`, etc.)
- Exit the session with `exit_plan`

### Duplicate Node ID

If the DAG contains duplicate node IDs:

```
DAG validation error: duplicate node id "[id]".
Each node must have a unique id.
Use "-2", "-3" suffixes for repeated nodes (e.g. "audit-agents-2" instead of reusing "audit-agents").
```

The session fails to initialize. Fix `plan.json` and retry.

### Unmatched Branch ID

If HeadWrench calls `next_step({ next: "nonexistent-id" })`:

- Plugin silently treats it as a terminal node
- Session transitions to `status = "complete"`
- No error message is raised

This is a silent failure — use exact node IDs when routing branches.

---

## Key Configuration Files

| File | Purpose | Editing Rules |
|------|---------|---|
| `registry.jsonc` | Component definitions (names, types, dependencies, file lists) | Edit to add/remove/modify components |
| `files/agents/*.md` | Agent prompt definitions (YAML frontmatter + Markdown body) | Edit to change agent behavior |
| `files/plugins/planning-enforcement.ts` | Plugin source code (TypeScript) | Edit for enforcement logic changes; compiles to `.js` during build |
| `files/plugins/planning-enforcement.js` | Compiled plugin (do not edit) | Generated during `bun run build` |
| `files/planning/plan-session/plan.json` | Executable planning DAG (JSON) | Edit to change planning flow structure |
| `files/planning/plan-session/prompts/*.md` | Planning node prompts (Markdown) | Edit to change what each node does |
| `files/planning/plan-session/node-library/CATALOGUE.md` | Node type reference | Reference only; generated during documentation updates |
| `files/planning/plan-session/node-library/{node-name}/plan.json` | Node type definition | Edit to change node structure |
| `files/planning/plan-session/node-library/{node-name}/README.md` | Node authoring guide | Edit to clarify when/how to use the node |
| `files/planning/plan-session/node-library/{node-name}/prompt-template.md` | Node prompt scaffold | Edit to change the template structure agents fill |
| `files/profiles/{name}/opencode.jsonc` | Profile: model assignments, agent routing, MCP setup | Edit to change agent-to-model mapping |
| `files/profiles/{name}/ocx.jsonc` | Profile: OCX-specific configuration | Edit for registry-level profile settings |

---

## Runtime Version Information

- **Registry version:** 3.6.0 (from `registry.jsonc`)
- **Min OpenCode compatibility:** 1.27.0
- **Min OCX CLI compatibility:** 1.0.16
- **Required runtime:** Bun v1.3.5+
- **Build command:** `bun run build` (runs `bunx ocx build . --out dist`)

---

## Summary

This reference document describes:
1. **System architecture:** 8 components, 6 agents, 1 orchestrator
2. **Agent system:** Each agent's role, budget, parallelism, and constraints
3. **Planning enforcement:** How the plugin tracks DAG state, enforces todo ordering, and advances nodes
4. **Planning DAG:** All 14 nodes and their execution flow
5. **Node library:** 14 reusable node types for composing new DAGs
6. **Ollama profile:** Single-model routing and configuration
7. **Key files:** What exists, where, and how to edit it

Read this document to understand how the system works at the mechanical level — no interpretation required.
