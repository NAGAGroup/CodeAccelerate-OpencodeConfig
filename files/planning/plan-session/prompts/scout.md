# Codebase Exploration

Dispatch three context-scouts to explore the codebase. Each scout should target a different area relevant to the task:

1. **Affected code** — Files, modules, and components the task touches directly
2. **Patterns and architecture** — How the codebase is organized, conventions to follow
3. **Dependencies and boundaries** — What other systems or modules are involved, integration points

Provide each scout with specific file paths or search patterns. Let them report back before moving on.

## Todo

> **Mandatory:** Provide each scout with specific file paths or glob patterns — not just a thematic description. Scouts dispatched without concrete paths will fail to orient on less-capable models. If the project structure is unknown, include broad glob patterns (e.g., `**/*`, `src/**/*.ts`) alongside the thematic goal.

1. `task` — Dispatch @ContextScout to explore the affected code (files, modules, components the task touches directly)
2. `task` — Dispatch @ContextScout to explore patterns and architecture (codebase organization, conventions to follow)
3. `task` — Dispatch @ContextScout to explore dependencies and boundaries (other systems, integration points)
4. `task` — Dispatch @HeadWrench (subagent) to run cursory git commands for planning context. Check if in a git repo first with `git rev-parse --git-dir 2>/dev/null`. If not a git repo, report that and stop. If in a git repo, run: `git branch --show-current`, `git status --short`, `git log --oneline -10`, `git diff --stat HEAD`. Report back: current branch name, working tree status (modified/staged/untracked files), last 10 commits (oneline), and a file-level diff stat vs HEAD. This context helps the planning agent understand what work is in progress and what was recently committed.
