# Planning

CodeAccelerate uses a DAG-driven planning system to break down complex tasks into structured, executable work. When you start a planning session, the system scouts your codebase, optionally researches external documentation, reasons through your task, asks clarifying questions, then produces a structured **project plan** — a DAG written to `.opencode/session-plans/{name}/`. Once created, you can resume and advance the plan anytime with `/activate-plan`.

---

## Starting a Plan: `/plan-session`

Run `/plan-session` followed by a brief description of your task:

```
/plan-session Implement user authentication with OAuth 2.0
```

The planner walks you through:

1. **Codebase scouting** — Parallel scouts map your project structure, files, and recent git history
2. **Optional research** — You decide whether the plan needs external web research (API docs, library comparisons, etc.)
3. **Deep reasoning** — The planner synthesizes all findings via sequential thinking
4. **Clarifying questions** — The planner asks any remaining questions before committing to a structure
5. **Proposed plan** — The planner presents a node decomposition for your approval
6. **DAG authoring** — On approval, the plan is written using dedicated tools (never hand-written JSON), validated, and visualized as an ASCII diagram directly in your terminal
7. **Activation gate** — You can activate immediately or save it for later

---

## The DAG Flow

Every planning session follows this flow:

```
session-overview
    ↓
scout (3 parallel scouts: structure, files, git history)
    ↓
research-gate ──[User wants web research]──► research-brief → scout-node-library
    │                                                               ↓
    └──[User skips research]──────────────► scout-node-library-2 ──┘
                                                               ↓
                                                    sequential-thinking
                                                               ↓
                                                    clarifying-questions
                                                               ↓
                                                    propose-plan
                                                    ├─[Approve] → write-dag → present-dag → activation-gate
                                                    │                             ├─[Yes, activate now] → activate-now
                                                    │                             └─[No, activate later] → plan-complete
                                                    └─[Rethink] → propose-plan-2 → ... (up to 4 attempts)
```

The plan is visualized as an ASCII diagram in your terminal after writing — you see the exact DAG structure before deciding whether to activate.

---

## Understanding Your Project Plan

A project plan is a persistent DAG (directed acyclic graph) stored in two parts:

### `plan.json`

The DAG structure: node IDs, dependencies, and todo items that track progress. This is what the system reads to know which node is next and what to do when you run `/activate-plan`.

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
    └── output-success.md
```

---

## The Node Library: 14 Reusable Node Types

When the planner decomposes your task, it selects from 14 node types:

| Node Type | Purpose | What it does |
|-----------|---------|-------------|
| `session-overview` | Entry point | Auto-advances; orients the agent to the session goal |
| `scout-parallel` | Initial scouting | Runs parallel scouts to read code, docs, or other context |
| `analyze-deep` | Deep reasoning | One agent analyzes a specific complex problem in depth |
| `sequential-thinking` | Synthesis | The planner reasons step-by-step through findings |
| `clarifying-questions` | User input | Asks remaining questions before locking in a structure |
| `decision-gate` | User approval | Blocks until you answer a question; branches based on your choice |
| `parallel-tasks` | Parallel work | Runs independent tasks simultaneously |
| `verification-check` | Quality gate | Runs a check (often with shell access) to verify work |
| `conditional-branch` | Logic | Routes to the next node based on prior context (no user input) |
| `compression-node` | Summarization | Condenses long context into a summary for the next phase |
| `research-basic` | Cursory research | Quick external lookup for a specific fact or API |
| `research-deep` | Deep research | Full investigative research via web and documentation tools |
| `output-success` | Success terminal | Marks the plan as complete (happy path) |
| `output-failure` | Failure terminal | Marks the plan as failed or blocked |
| `generic` | Custom work | Escape hatch for work that doesn't fit other types |

The planner selects which nodes you need, connects them in the right order, and uses `init_dag`, `add_node`, and related tools to write a validated, structurally correct plan — never raw JSON.

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

Plans persist across sessions — close OpenCode, come back later, and continue exactly where you left off.

---

## Plan Persistence

Once a plan is created, it lives in `.opencode/session-plans/`. You can:

- Resume it anytime with `/activate-plan`
- Let it accumulate context and state across multiple sessions
- Review `plan.json` to understand the exact structure of your execution plan

The DAG state is managed by the planning enforcement plugin — it ensures nodes execute in the correct order and prevents tools from being called out of sequence.

See [getting-started.md](getting-started.md) for recommended `.gitignore` setup.
