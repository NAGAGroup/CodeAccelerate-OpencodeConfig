# Codebase Exploration

Dispatch three context-scouts AND one HeadWrench subagent to gather planning context. Each scout targets a different codebase area, and the subagent gathers git history. 

1. **Affected code** — Files, modules, and components the task touches directly
2. **Patterns and architecture** — How the codebase is organized, conventions to follow
3. **Dependencies and boundaries** — What other systems or modules are involved, integration points

Provide each scout with specific file paths or search patterns. Let them report back before moving on.

**Call the `task` tool four times in sequence** — one per todo item below. Do not combine or skip.

> **Writing scout prompts:** When writing each scout's task prompt, include: (1) specific file paths or glob patterns to read — not just thematic descriptions; (2) a clear statement of what the scout should return; (3) an explicit instruction that the scout must report findings as specific facts, not as generic "Codebase Overview" or "Key Decisions" sections. Scouts dispatched without concrete paths will fail to orient on less-capable models.

## Todo

> **Task tool:** Required params: `subagent_type` (one of: `context-scout`, `context-insurgent`, `junior-dev`, `quick-doc`, `external-scout`, `headwrench`), `description` (3–5 words), `prompt` (full instructions). **`task_id` is optional — omit it for new tasks.** Only include `task_id` if resuming a prior session; it must start with `ses_`. Do not fabricate a `task_id`.

1. `task` — Dispatch @ContextScout to explore the affected code (files, modules, components the task touches directly)
2. `task` — Dispatch @ContextScout to explore patterns and architecture (codebase organization, conventions to follow)
3. `task` — Dispatch @ContextScout to explore dependencies and boundaries (other systems, integration points)
4. `task` — Dispatch @HeadWrench (subagent) to run cursory git commands for planning context. Check if in a git repo first with `git rev-parse --git-dir 2>/dev/null`. If not a git repo, report that and stop — treat this as a fresh project with no history, and the planning agent should continue normally. If in a git repo, run: `git branch --show-current`, `git status --short`, `git log --oneline -10`, `git diff --stat HEAD`. Report back: current branch name, working tree status (modified/staged/untracked files), last 10 commits (oneline), and a file-level diff stat vs HEAD. This context helps the planning agent understand what work is in progress and what was recently committed.

After all four tasks return results, call `next_step()` to advance.
