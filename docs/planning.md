# Planning

CodeAccelerate uses a DAG-driven planning system to break down complex tasks into structured, executable work. When you start a planning session, the system guides you through a series of approvals, then writes a persistent **project plan** to `.opencode/session-plans/{name}/`. Once created, you can resume and advance the plan anytime with `/activate-plan`.

---

## Starting a Plan: `/plan-session`

Run `/plan-session` followed by a brief description of your task:

```
/plan-session Implement user authentication with OAuth 2.0
```

The planner walks you through:

1. **Scope gathering** — Questions to clarify what you're building, what success looks like, and key constraints
2. **Proposed structure** — The planner suggests how to break down the work and asks for your approval
3. **Decomposition** — The planner selects from a library of 12 reusable node types and builds your project DAG, asking for approval before writing anything to disk
4. **Approval gate** — You review the full plan and either approve it or send it back for rethinking

Once approved, the plan is written to disk and ready to execute.

---

## Understanding Your Project Plan

A project plan is a persistent DAG (directed acyclic graph) stored in two parts:

### `plan.json`

The DAG structure: node IDs, types, dependencies, and todo items that track progress. This is what the system reads to know which node is next, which has completed, and what to do when you run `/activate-plan`.

### `prompts/` directory

One Markdown file per node, containing the instructions for that node's work. When a node is active, its prompt is injected into the agent's context.

For example:

```
.opencode/session-plans/auth-oauth/
├── plan.json
└── prompts/
    ├── scout-parallel-1.md
    ├── analyze-deep-2.md
    ├── parallel-tasks-3.md
    └── write-dag.md
```

---

## The DAG Flow

Every plan follows this flow:

```
session-overview
    ↓
scout (3 scouts in parallel)
    ↓
sequential-thinking (planner synthesizes findings)
    ↓
propose-structure (you approve the high-level decomposition)
    ↓
propose-decomposition (planner builds the DAG from node library)
    ↓
planning-gate (you approve the full DAG)
    ├─→ [approved] write-dag (writes plan.json and prompts/)
    └─→ [rethink] propose-structure-2 → propose-decomposition-2 → write-dag-2
```

If you ask for changes at the planning gate, the system loops back to restructure before writing.

---

## The Node Library: 12 Reusable Node Types

When the planner decomposes your task, it selects from these 12 node types:

| Node Type | Purpose | What it does |
|-----------|---------|-------------|
| `session-overview` | Entry point | Auto-advances; no user input needed |
| `scout-parallel` | Initial scouting | Runs 3 scouts in parallel to read code, docs, or other context |
| `analyze-deep` | Deep reasoning | One sonnet agent analyzes a specific complex problem |
| `sequential-thinking` | Synthesis | The planner reasons step-by-step through findings |
| `decision-gate` | User approval | Blocks until you answer a question; branches based on your choice |
| `parallel-tasks` | Parallel work | Runs 3 haiku agents on independent tasks simultaneously |
| `verification-check` | Quality gate | Runs a check (often with shell access) to verify work |
| `conditional-branch` | Logic | Routes to the next node based on prior context (no user input) |
| `compression-node` | Summarization | Condenses long context into a summary for the next phase |
| `output-success` | Success terminal | Marks the plan as complete (happy path) |
| `output-failure` | Failure terminal | Marks the plan as failed or blocked |
| `generic` | Custom work | Escape hatch for work that doesn't fit other types |

The planner selects which nodes you need, connects them in the right order, and handles the todo items and dependencies.

---

## Activating a Plan: `/activate-plan`

Resume an existing plan with:

```
/activate-plan auth-oauth
```

The system:

1. Loads your `plan.json` and checks which nodes have completed
2. Finds the next pending node
3. Injects its prompt into the current session
4. Advances the node as work completes

**Tip:** Run `/activate-plan` with no arguments to see a list of all saved plans and their status.

---

## Plan Persistence

Once a plan is created, it's permanent in `.opencode/session-plans/`. You can:

- Resume it anytime with `/activate-plan`
- Let it accumulate context and state across multiple sessions
- Reference it for future work or documentation
- Review it to understand the exact steps your system took

The DAG state is managed by the planning enforcement plugin — it ensures nodes execute in the correct order and prevents tools from being called out of sequence.

See [getting-started.md](getting-started.md) for recommended `.gitignore` setup.
