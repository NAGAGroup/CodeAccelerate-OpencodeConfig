---
name: delegation
description: "Load when writing prompts for session plan artifacts during planning sessions."
---
# Delegation Skill

## Purpose

Apply this skill during planning to assign the correct agent and model tier to each subtask. Write the assignment into the subtask's `## Delegation` section before presenting the plan to the user.

---

## Agent Roster

| Agent | Model Tier | Steps | Role |
|---|---|---|---|
| @ContextScout | haiku-like | 12 | Quick codebase/context reads — parallel |
| @ContextInsurgent | sonnet-like | 20 | Deep multi-file reasoning — single task |
| @DeepResearcher | haiku-like | 15 | Web/docs research — parallel |
| @JuniorDev | haiku-like | 10 | Scoped code edits — parallel, no re-use |
| @QuickDoc | haiku-like | 8 | Single-file doc writes/edits — parallel, no re-use |
| @HeadWrench | sonnet | — | Full tool access — test-fix cycles, builds, integration checks |
| HW (direct) | sonnet | — | Shell, builds, tests, complex writes (orchestrator handles inline) |

---

## Routing Table

### @ContextScout
**Use when:** situational awareness before planning, reading project structure, locating relevant files, understanding conventions.

- Dispatch **multiple scouts in parallel** for different areas of the codebase
- Each scout gets a single, scoped read task
- Do **not** re-delegate to the same scout session ID
- Returns a structured 5-section report (Overview, Prior Work, Key Patterns, Concerns, Context Summary)
- Reads codebase files only — does not read `.opencode/` internals

### @ContextInsurgent
**Use when:** deep analysis of many files is needed, complex multi-step reasoning about the codebase, architectural investigation.

- One at a time — **not parallel**
- Re-use the same session ID within a single logical task
- Returns findings inline to HW — does not write files
- The only agent warranting a more powerful model; reading many files is token-expensive

### @DeepResearcher
**Use when:** library docs, API documentation, external research, or any question best answered by web search.

- Exa handles the heavy lifting — haiku model is sufficient
- Dispatch in parallel for multiple research questions
- Do **not** re-delegate
- **Optional during planning** — surface the option to the user before dispatching

### @JuniorDev
**Use when:** scoped code edits across one or more files that are well-defined and don't require complex reasoning.

- Dispatch **multiple JuniorDevs in parallel** for simultaneous file edits
- Each gets a single, scoped edit task
- Do **not** re-delegate
- Does not compile, test, or verify its own output — HW handles that
- **If the task requires complex reasoning or judgment** → HW handles directly. Output tokens are cheap; HW having full context is worth more than the token savings.
- **One node per parallel batch:** When routing multiple independent tasks as parallel (e.g., `@JuniorDev (parallel × 3)`), they must be grouped into a **single subtask node** in the generated `plan.json`. That node's prompt dispatches all agents simultaneously in one response, waits for all to return, then the plugin auto-advances. Do NOT produce one subtask node per parallel agent — the DAG executes nodes sequentially.

### @QuickDoc
**Use when:** writing a single document, updating documentation, making targeted edits to existing docs.

- Dispatch in parallel for multiple doc tasks
- Do **not** re-delegate
- Same model ceiling rule as JuniorDev — complex or judgment-heavy doc work goes to HW directly

### @HeadWrench (subagent)
**Use when:** the node requires full tool access and reasoning — test-fix cycles, build verification, integration checks, or any work needing shell + read + edit in one step.

- Dispatched via `task` like any other agent
- Has access to all tools (`bash`, `read`, `write`, `edit`, etc.)
- Does the work directly — does **not** delegate further
- Use for "check/fix" nodes where the agent must run tests, read output, and fix code in one pass
- Most powerful model — use when the task complexity warrants it

### HW (direct)
**Use when:** the orchestrator should handle inline (not dispatched):
- Shell commands: git, builds, tests, installs, deploys
- Any task that requires analyzing command output and making decisions
- Code or doc writes that require complex reasoning a haiku model can't handle
- Tasks that benefit from HW having full session context and user interactivity

---

## Assignment Format

For each subtask in the plan, write a `## Delegation` section:

```markdown
## Delegation

**Agent:** @JuniorDev (parallel × 2)
**Model:** haiku-like
**Prompt structure:**
- Read: `src/foo.ts`, `src/bar.ts`
- Goal: Add error handling to both files per the pattern in `src/baz.ts`
- Constraints: Do not change function signatures; match existing error type
- Verify: Both files handle the thrown error without crashing the caller
```

For HW-direct subtasks:

```markdown
## Delegation

**Agent:** HW (direct)
**Reason:** Requires running `npm test` and analyzing output to determine fix scope
```

---

## Decision Heuristics

1. **Default to haiku agents in parallel** — always start here
2. **Escalate to ContextInsurgent only** when the task genuinely requires reading many files with complex cross-file reasoning
3. **Escalate to @HeadWrench subagent** for check/fix nodes — test-fix cycles, build verification, or any node needing shell + edit in one pass
4. **Escalate to HW direct** when the orchestrator itself should handle inline (e.g., the task needs user interactivity mid-step)
5. **Never escalate DeepResearcher** — Exa does the work; if research is too complex for haiku, the research question is probably too broad; break it down
6. **Parallel > sequential** — if tasks are independent, run them simultaneously regardless of agent type
