# Codebase Exploration

Dispatch three context-scouts AND one HeadWrench subagent to gather planning context — **call the task tool four times in sequence, one per todo item**. Each scout targets a different codebase area; the subagent gathers git history. 

1. **Affected code** — Files, modules, and components the task touches directly
2. **Patterns and architecture** — How the codebase is organized, conventions to follow
3. **Dependencies and boundaries** — What other systems or modules are involved, integration points

Provide each scout with specific file paths or search patterns. Let them report back before moving on.

**Call the `task` tool four times in sequence** — one per todo item below. Do not combine or skip.

> **Writing scout prompts:** When writing each scout's task prompt, include: (1) specific file paths or glob patterns to read — not just thematic descriptions; (2) a clear statement of what the scout should return, including what to do when nothing is found: state 'No relevant files found for [area]' explicitly — do not substitute a generic description or omit the section; (3) an explicit instruction that the scout must report findings as specific facts, not as generic "Codebase Overview" or "Key Decisions" sections; (4) agent-specific constraints: @ContextScout must not perform web searches or external lookups — if a thematic area has no discoverable files, report 'nothing found for [area]' rather than producing generic descriptions. Scouts dispatched without concrete paths will fail to orient on less-capable models.

> **New feature / cross-cutting task — breadth-first orientation:** If the task is a new feature or cross-cutting change with no obvious target files, orient the **first scout** with a broad glob (e.g., `**/*.{md,ts,json,jsonc,toml}`) to map the project structure first, then narrow the second and third scouts based on what's found. Do NOT write all three scout prompts targeting task-specific patterns that don't exist yet — on less-capable models, scouts dispatched to find nonexistent files return empty results and provide no planning value.

> **@HeadWrench subagent (git task) — Do NOT:** Read source files or explore the codebase — run only the four listed git commands. Do NOT fabricate git output if the working tree is clean or the command produces empty output — report the raw output even if empty.

## Todo

> **Task tool:** Required params: `subagent_type` (one of: `context-scout`, `context-insurgent`, `junior-dev`, `quick-doc`, `external-scout`, `headwrench`), `description` (3–5 words), `prompt` (full instructions). **`task_id` is optional — omit it for new tasks.** Only include `task_id` if resuming a prior session; it must start with `ses_`. Do not fabricate a `task_id`.

1. `task` — Dispatch @ContextScout to explore the affected code (files, modules, components the task touches directly)

   > **Writing scout #1 prompt ("Affected code"):** Include: (1) specific file paths or glob patterns targeting the files the task touches — if these cannot be predicted, use `**/*.{md,ts,json,jsonc,toml}` as a breadth-first orientation glob; (2) instruction: "Return findings as a bulleted list of specific file paths and what each contains — do NOT produce a 'Codebase Overview' section"; (3) termination: "If no relevant files found, state 'No relevant files found for affected code' explicitly."

2. `task` — Dispatch @ContextScout to explore patterns and architecture (codebase organization, conventions to follow)

   > **Writing scout #2 prompt ("Patterns and architecture"):** Include: (1) glob patterns or paths covering config files, top-level source directories, and any convention-bearing files (e.g., `**/*.{jsonc,toml}`, `src/**/*.ts`); (2) instruction: "Report specific file paths, naming patterns, and code conventions found — not a thematic summary"; (3) termination: "If nothing found for an area, state 'Nothing found for [area]' explicitly."

3. `task` — Dispatch @ContextScout to explore dependencies and boundaries (other systems, integration points)

   > **Writing scout #3 prompt ("Dependencies and boundaries"):** Include: (1) paths to package manifests, lock files, integration modules, and boundary files (e.g., `package.json`, `bun.lockb`, `registry.jsonc`, import graphs); (2) instruction: "Report specific dependency names, versions, and integration points — not thematic descriptions"; (3) termination: "If no integration boundaries are found, state 'No dependency boundaries found' explicitly."

4. `task` — Dispatch @HeadWrench (subagent) to run cursory git commands for planning context.
> **Writing the HeadWrench git subagent's prompt:** Include:
> (1) tool-use sequence: first call bash with `git rev-parse --git-dir 2>/dev/null` — if exit code non-zero, stop and report "Not a git repo"; then run in order: `git branch --show-current`, `git status --short`, `git log --oneline -10`, `git diff --stat HEAD`;
> (2) input spec: none required — all commands are fully specified;
> (3) return format: report each command's output under labeled headings: Branch, Working Tree Status, Recent Commits (last 10), Diff Stat vs HEAD; if a command produces no output, say "[empty]" under that heading;
> (4) constraints: run only the listed commands; do not read source files; do not summarize or interpret output — return verbatim.

After all four tasks return results, call `next_step()` to advance.
