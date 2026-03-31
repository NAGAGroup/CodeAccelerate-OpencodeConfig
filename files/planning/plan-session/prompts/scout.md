# Scout Codebase

Gather planning context in three sequential phases. Follow the ordering exactly — each phase depends on the previous.

## Phase 1: Project Map (Scout 1, BLOCKING)

Scout 1 has **zero knowledge of the user's task**. Its only job is to discover what exists so you can write informed prompts for the next phase.

**Dispatch Scout 1 and wait for its result before proceeding.**

> **Writing Scout 1's prompt:**
> (1) Check if `.gitignore` exists. If it does, read it and note the ignored patterns.
> (2) Run a full glob: `**/*` — return the complete file list (paths only, not contents). Exclude any paths matching the `.gitignore` patterns from step (1). If no `.gitignore` exists, return all paths.
> (3) From the filtered file list, identify 3–5 files that look like the most important orientation anchors (README, build config, project manifest, top-level entry point — whatever the project structure suggests). Read those files.
> (4) Return: the depth-1 entries from the filtered file list (top-level files and directories only) **verbatim as-is**. Then append a high-level summary covering: what the full glob revealed about the project's deeper structure, plus a brief description of each key file you read and what it reveals about the project's purpose and entry points.
> (5) Do NOT interpret the task or filter for relevance — return everything non-ignored. HW will determine relevance.
> (6) Termination: return when you have the filtered file list and key file summaries. Do not explore further.

✓ Good: Returns depth-1 paths verbatim, then a high-level summary of deeper structure and the 3–5 key files read.

✗ Bad: "Find files related to the task." — Scout 1 gets no task context and must not filter by it.

**After Scout 1 returns:** Use the file list and summaries to write task-targeted prompts for Scouts 2 and 3.

## Phase 2: Task-Targeted Scouts (Scouts 2 + 3, PARALLEL, BLOCKING)

Both scouts receive the user's task description and Scout 1's file map. Write both prompts using that context, then **emit both `task` calls in a single response turn**.

> **Writing Scout 2's prompt ("Conventions and patterns in the affected area"):**
> (1) Provide: the user's task description and Scout 1's file list
> (2) Ask the scout to identify and read the files most relevant to the task, then extract: naming conventions, structural patterns, coding style, and any existing implementations the task will need to fit alongside
> (3) Return format: file paths read + specific patterns found (naming, structure, style) with file:line citations — not thematic summaries
> (4) Termination: State 'Nothing found' if an area has no content

> **Writing Scout 3's prompt ("Dependencies and integration boundaries"):**
> (1) Provide: the user's task description and Scout 1's file list
> (2) Ask the scout to identify files that define build dependencies, external libraries, public interfaces, or integration points relevant to the task — then read and summarize them
> (3) Return format: dependency names and versions, public API surfaces, build system constraints — with exact file references
> (4) Termination: State 'No relevant boundaries found' if nothing applies

**Wait for both Scout 2 and Scout 3 to return before proceeding to Phase 3.**

## Phase 3: Git Context (HeadWrench subagent, LAST)

Run after all three scouts have reported. The git subagent uses scout findings to run targeted history queries in addition to standard status.

> **Writing the HeadWrench git subagent's prompt:**
> (1) Run standard git commands in order: `git rev-parse --git-dir 2>/dev/null` (stop if error); `git branch --show-current`; `git status --short`; `git log --oneline -10`; `git diff --stat HEAD`
> (2) Using file paths identified by the scouts as relevant to the task, run: `git log --oneline -10 -- <relevant-file-paths>` for the most task-relevant files (up to 5 files)
> (3) Run: `git log --oneline -20 --all --grep="<task-keywords>"` using 2–3 keywords from the task description to find semantically related prior commits
> (4) Return format: report each section under labeled headings — Branch, Working Tree Status, Recent Commits (last 10), Diff Stat vs HEAD, File History (per relevant file), Related Commits (keyword search). Use "[empty]" if a command produces no output.
> (5) Constraints: Run only the listed commands. Do not read source files. Return output verbatim — no summarization.

## Todo

1. `task` — Dispatch @ContextScout for full project map, gitignore-filtered (Scout 1). **Wait for result before proceeding.**

2. `task` — Dispatch @ContextScout for conventions and patterns in affected area (Scout 2, task-targeted using Scout 1's map). **Emit in same response as task 3.**

3. `task` — Dispatch @ContextScout for dependencies and integration boundaries (Scout 3, task-targeted using Scout 1's map). **Emit in same response as task 2.**

4. `task` — Dispatch @HeadWrench (subagent) for git context. **Run after all three scouts have returned — uses their file findings for targeted history queries.**

After all four tasks return, call `next_step()` to advance.
