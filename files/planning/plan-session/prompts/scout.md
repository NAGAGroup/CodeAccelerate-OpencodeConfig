# Codebase Exploration

Gather planning context in two phases. **Do not batch all four task calls upfront — read the sequencing rules below.**

## Core rule: subagent context isolation

**Subagents see nothing except what you write in their task prompt.** They cannot see your conversation, the user's request, or any prior context. A prompt that says "find Windows platform code" fails on a scout that has never seen this codebase — it has no idea where to look. Every scout prompt must provide all context necessary to locate the target files, with no assumptions of prior understanding.

**This means: file paths and glob patterns are not optional.** Thematic descriptions ("find auth-related files", "look at the build system") are instructions for a human who knows the codebase — they are useless to a subagent starting from zero.

## Phase 1 — Generic codebase orientation (Scout 1, run FIRST)

**Call `task` once and wait for the result before proceeding.**

Scout 1 is a generic, task-agnostic orientation scan. Its job is to give you the project structure, file layout, and conventions — so you can write informed, path-specific prompts for scouts 2 and 3.

> **Writing Scout 1's prompt:** This scout receives NO task-specific information — its scope is always the same generic orientation:
> (1) Read the root directory listing and any top-level config files (e.g., `package.json`, `bun.lockb`, `registry.jsonc`, `tsconfig.json`, `*.toml`, `*.jsonc`)
> (2) Run a broad glob: `**/*.{md,ts,js,json,jsonc,toml}` — list the top-level paths returned (do not read every file, just the listing)
> (3) Read the README or primary documentation file if one exists
> (4) Return format: "Report the directory structure, key config files found, and any README content. List file paths — do not produce a thematic summary."
> (5) Termination: "Return when you have the structure. Do not dig into source files."

**After Scout 1 returns:** Read its findings. Use the file paths and structure it reports to write targeted prompts for scouts 2 and 3. You now have the codebase map — you no longer need to guess.

✓ **Correct Scout 1 prompt:** "Read the root directory and list all top-level files. Run glob `**/*.{md,ts,json,jsonc,toml}` and return the paths found. Read `package.json` and `README.md` if they exist. Report the directory structure and key files. Do not produce a Codebase Overview — list paths."

✗ **Incorrect Scout 1 prompt:** "Find files that are relevant to adding Windows platform support. Look for build configurations and platform-specific code." — The scout has no codebase context and cannot evaluate relevance. It will either return empty or hallucinate.

## Phase 2 — Targeted scouts + git context (Scouts 2, 3, and git, run AFTER Scout 1)

**Call `task` three more times in sequence** — scouts 2 and 3 targeting areas informed by Scout 1's output, plus the git subagent.

Use Scout 1's findings to write specific, path-anchored prompts. If Scout 1 found that the project is a TypeScript monorepo with source under `src/` and config under `config/`, your Scout 2 prompt should reference `src/` and `config/` — not generic patterns.

> **Writing Scout 2's prompt ("Patterns and architecture"):** Use file paths from Scout 1. Include: (1) specific paths to config files, top-level source directories, and convention-bearing files Scout 1 found; (2) instruction: "Report specific file paths, naming patterns, and code conventions found — not a thematic summary"; (3) termination: "State 'Nothing found for [area]' explicitly if an area has no files."

> **Writing Scout 3's prompt ("Affected code"):** Use file paths from Scout 1. Include: (1) paths to the files and modules most likely touched by the task — derived from Scout 1's structure report; (2) instruction: "Return findings as a bulleted list of specific file paths and what each contains — do NOT produce a 'Codebase Overview' section"; (3) termination: "State 'No relevant files found for affected code' explicitly if nothing is found."

✓ **Correct Scout 3 prompt (after Scout 1 found `src/`, `files/`, `registry.jsonc`):** "Read `registry.jsonc`, `files/agents/`, and `files/planning/`. Return the exact contents of `registry.jsonc` and list all files in `files/agents/`. Report file paths and what each contains."

✗ **Incorrect Scout 3 prompt:** "Find files related to agent configuration and planning." — The scout cannot evaluate 'related to' without knowing the codebase. Paths from Scout 1 must be used.

> **Writing the HeadWrench git subagent's prompt:** Include:
> (1) tool-use sequence: first call bash with `git rev-parse --git-dir 2>/dev/null` — if exit code non-zero, stop and report "Not a git repo"; then run in order: `git branch --show-current`, `git status --short`, `git log --oneline -10`, `git diff --stat HEAD`;
> (2) input spec: none required — all commands are fully specified;
> (3) return format: report each command's output under labeled headings: Branch, Working Tree Status, Recent Commits (last 10), Diff Stat vs HEAD; if a command produces no output, say "[empty]" under that heading;
> (4) constraints: run only the listed commands; do not read source files; do not summarize or interpret output — return verbatim.

## Todo

> **Task tool:** Required params: `subagent_type` (one of: `context-scout`, `context-insurgent`, `junior-dev`, `quick-doc`, `external-scout`, `headwrench`), `description` (3–5 words), `prompt` (full instructions). **`task_id` is optional — omit it for new tasks.** Only include `task_id` if resuming a prior session; it must start with `ses_`. Do not fabricate a `task_id`.

1. `task` — Dispatch @ContextScout for generic codebase orientation (Scout 1). **Wait for this result before calling task again.**

2. `task` — Dispatch @ContextScout for patterns and architecture (Scout 2, using Scout 1's findings).

3. `task` — Dispatch @ContextScout for affected code (Scout 3, using Scout 1's findings).

4. `task` — Dispatch @HeadWrench (subagent) to run cursory git commands for planning context.

After all four tasks return results, call `next_step()` to advance.
