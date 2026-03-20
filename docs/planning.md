# Planning

CodeAccelerate provides three planning modes, each backed by a DAG-driven execution engine. Every planning session produces a `plan.json` and a set of prompt files written to `.opencode/session-plans/{name}/`. Once created, a plan is persistent — you resume it with `/activate-plan` and the system picks up exactly where it left off.

---

## Generic Planning

Use this for features, refactors, and migrations. Run `/plan-generic <description>` with a brief description of your task. The system walks you through a guided Q&A to gather scope and constraints, then decomposes the work into numbered subtasks and assigns each to the appropriate agent. You get a structured execution plan with clearly defined deliverables and a task dependency chain ready to execute.

**Output:** `plan.json` + one `subtask-NN-{name}.md` prompt file per subtask.

---

## Debug Planning

Use this for bug investigations. Run `/plan-debug <description>` with a description of the bug. The system gathers context, then forms a ranked hypothesis list and presents it to you for approval before writing anything to disk. Only after you confirm the hypotheses does it produce a session plan — a `diagnose → fix → verify` loop with your approved hypotheses baked into the diagnose node.

The debug session is self-modifying by design: `fix.md` accumulates attempted fixes across iterations, and the agent can re-enter `diagnose` as many times as needed until the bug is confirmed and the fix verifies.

**Output:** `plan.json` + `prompts/diagnose.md`, `fix.md`, `verify.md`.

---

## Collaborative Planning

Use this for open-ended exploration — early-stage ideas, design decisions, or anything where the shape of the work isn't clear yet. Run `/plan-collaborative <rough idea>`. The system asks clarifying questions to sharpen the idea into a well-scoped goal, surfaces the open questions that need to be worked through, and gets your sign-off on the session seed before producing any files.

The resulting plan is intentionally flexible: one exploration node per open question, with the agent authorized to restructure the plan, add nodes, and update `spec.md` as the session evolves.

**Output:** `plan.json` + `spec.md` (living spec) + one `prompts/explore-NN.md` per open question.

---

## Activating a Plan

Run `/activate-plan <name>` to resume any saved plan. If you omit the name, the system lists all plans in `.opencode/session-plans/` with their goal and status so you can pick one.

The activation tool initializes DAG state and injects the first (or next pending) node's prompt. You don't need to track progress manually — the system knows which nodes have completed and resumes from the correct point.

To see all available plans at any time, just run `/activate-plan` with no arguments.
