# /plan Workflow

## Overview
The `/plan` command is the canonical coordination mechanism for complex tasks within OpenCode. It ensures that before any code is written, a structured roadmap is established, agent roles are properly assigned, and the user has reviewed and approved the intended approach. This workflow prioritizes clarity, situational awareness, and expert delegation over immediate execution.

## When to Use /plan
HeadWrench (HW) should invoke the `/plan` workflow in the following scenarios:
- **Multi-step tasks**: Any task requiring more than 3 distinct subtasks.
- **New Feature Development**: Implementing entire modules or services.
- **Complex Refactors**: Changes that impact multiple files or architectural patterns.
- **Ambiguous Requests**: When the path from the current state to the goal is not immediately obvious.

## Workflow Steps

### Step 1 — Context Gathering (ContextScout)
HeadWrench dispatches **ContextScout** to read the existing codebase context, session notes, and inbox items relevant to the task. 
- **ContextScout** is strictly read-only.
- It returns a comprehensive situational report to HW.
- **Optional (DeepResearcher)**: If the situational report indicates missing technical knowledge or complex research is required, a **DeepResearcher** may be dispatched at this point, but *only* with explicit user opt-in.

### Step 2 — Q&A
HeadWrench analyzes the situational report and runs a focused Q&A session with the user.
- HW asks clarifying questions to resolve any remaining ambiguities or contradictions.
- This step ensures HW has a full understanding of the user's constraints and preferences before drafting.

### Step 2.5 — Checkpoint Protocol Approval
HeadWrench presents the default checkpoint protocol to the user for approval.
- HW displays the contents of `~/.config/opencode/protocols/checkpoint.md`.
- User either approves as-is or requests customizations.
- If customizations are requested: HW records them and writes a session-local `protocols/checkpoint.md` override during Step 7 (Finalization).
- If approved as-is: no session-local file is written; subtask footers reference the global protocol.
- **This approval is mandatory** — the checkpoint protocol governs how progress is tracked and communicated between subtasks.

### Step 3 — Plan Drafting (HeadWrench)
HeadWrench writes the session plan draft directly. 
- **HW is the sole author** of the plan; it does not delegate this drafting step.
- The plan must follow the session plan format schema defined in `~/.config/opencode/protocols/session-plan-schema.md`.
- HW writes: (a) `index.md` (living human-readable plan), (b) `spec.json` (machine-readable orchestrator state), and (c) one `subtask-NN-{name}.md` file per subtask.
- No files are executed or modified beyond the plan files themselves.

### Step 4 — Delegation Review (Agent-Delegation-Expert Skill)
HeadWrench loads the **agent-delegation-expert** skill and applies its delegation rules to the drafted plan.
- **HW applies the rules directly** to each subtask, determining:
    - Recommended agent routing for each subtask
    - Recommended model tier per subtask
    - Recommendations for new project-local custom agents if existing agents are insufficient
- **HW writes the assignments** into the `## Delegation` section of each subtask file (`subtask-NN-{name}.md`), never into `spec.json` or `index.md`.

### Step 5 — Presentation to User
HeadWrench presents the full proposal to the user, including:
- **Plan Overview**: Goals, subtasks, and success gates.
- **Delegation Recommendations**: Which agents and models will handle which parts.
- **Proposed Agents**: Rationale for any new custom agents recommended by ADE.

### Step 6 — User Approval Loop
The user reviews the proposal and either approves it or requests changes.
- If changes are requested, HW loops back to **Step 3** (Drafting) or **Step 4** (Delegation) as needed.
- This loop continues until the user provides explicit approval.

### Step 7 — Finalization & Parallel Builds
Once approved, HeadWrench finalizes and completes setup.
- HW has already written delegation assignments into each subtask's `## Delegation` section during Step 4.
- If the user requested customizations to the checkpoint protocol in Step 2.5, HW writes the session-local override at `.opencode/sessions/{session-name}/protocols/checkpoint.md`.
- HW creates the **session summary todo** containing: session name, goal, path to `index.md`, first subtask number, and first subtask description.
- If new custom agents were approved, HW delegates their creation to the **SubagentBuilder** to run **in parallel** with finalization.

### Step 8 — Final Overview
HeadWrench provides a brief, final summary of the plan and state of the environment.
- HW explicitly states that it is ready to begin.
- **HW does not begin executing subtasks** until the user gives the explicit command to start.

## Invariants
- **HW as Author**: HeadWrench is the only agent permitted to write or edit the session plan. The "SessionPlanDrafter" agent is retired and must not be used.
- **HW as Delegation Applier**: HeadWrench loads the agent-delegation-expert skill and applies its rules to assign agents and models to each subtask. Assignments are written into subtask `## Delegation` sections only — never into `spec.json` or `index.md`.
- **ContextScout is Read-Only**: ContextScout never makes changes to the codebase or documentation.
- **Blocked Execution**: No subtask execution may occur until the user has approved the plan and given the "start" command.
- **Gated Research**: DeepResearcher is never dispatched automatically; it always requires user confirmation.
- **Subtask Files**: Plan drafting (Step 3) produces individual subtask files (`subtask-NN-{name}.md`), one per subtask, following the session plan schema.
- **Checkpoint Approval**: Approval of the checkpoint protocol (Step 2.5) is mandatory before plan drafting. Users cannot request changes after subtask files have already been written.
- **Session Summary Todo**: Created during finalization (Step 7) by HeadWrench after user approval. Used for HW orientation only — subagents have no awareness of it.

## Agent Roles in /plan

| Agent | Role | Writes? |
|---|---|---|
| **HeadWrench (HW)** | Orchestrator, Plan Author, Delegation Applier, & Finalizer | Yes |
| **ContextScout** | Situation Reporter & Context Collector | No |
| **agent-delegation-expert** skill | Delegation Rules (applied by HW) | No |
| **SubagentBuilder** | Custom Agent Constructor (if needed) | Yes |
| **DeepResearcher** | Specialized Technical Research (optional) | No |

## Recovery
- **Empty Context**: If ContextScout returns no relevant information, HW must rely more heavily on Step 2 (Q&A) to gather requirements from the user.
- **User Rejection**: If the user rejects the plan, HW must identify the specific points of friction and return to Step 3.
- **ADE Conflict**: If HW disagrees with an ADE recommendation, HW should explain the reasoning to the user in Step 5 and let the user decide.
- **Agent Build Failure**: If SubagentBuilder fails to create a new agent, HW must inform the user and suggest an alternative (e.g., using a standard agent or manual intervention).
