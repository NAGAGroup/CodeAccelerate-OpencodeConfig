# scout-parallel

## When to use

When you need broad codebase coverage before acting. Use near the start of a DAG to give HW situational awareness. Three scouts run in parallel across different areas.

**Do not** use `scout-parallel` when the target files are already known and the task scope is clear — go directly to `parallel-tasks` or `analyze-deep`. Scouts are for discovery, not confirmation.

## What it does

Dispatches three `@ContextScout` agents via three sequential `task` calls. The plugin enforces sequential calls; OpenCode dispatches them concurrently. Each scout covers a different area and reports back.

## What the planning agent must resolve

For each of the three scouts, specify:

1. **Scout 1 — Affected code**: Which specific files, modules, or components the task touches directly. Provide file paths or glob patterns if known. Good: "src/auth/token.ts, src/auth/session.ts — trace where refreshToken is called." Bad: "Look at auth code."
2. **Scout 2 — Patterns and architecture**: Where to look for conventions, existing patterns, and structural rules the task must follow. Good: "src/auth/ — find the pattern for how new functions are exported from the module index." Bad: "Check the patterns."
3. **Scout 3 — Dependencies and boundaries**: Which other systems, modules, or integration points are involved. What external contracts must be respected. Good: "src/api/routes.ts, src/middleware/ — identify all places that call auth.verifyToken()." Bad: "Find dependencies."
4. **Output constraint** — Each scout's dispatched prompt must include this verbatim instruction: "Report findings as specific facts and file locations — not as generic 'Codebase Overview', 'Key Decisions', or 'Patterns' sections. List what you found with exact references." Don't accept a scout output organized under 'Codebase Overview', 'Key Decisions', or 'Patterns' section headers — those are generic thematic summaries, not specific facts.
5. **Todo sync** — The number of `task` entries in the todo array must equal the number of scout sections written in the prompt. Adjust both together.
6. **Downstream consumer** — Which node receives these scout findings? Name it. Good: 'Findings feed `analyze-deep`, so scouts must return exact file paths and constraint values.' Bad: (unspecified — HW compresses generically).

If three scouts are too many (simple task with one area), use fewer `task` calls and adjust the todo array accordingly. Three is the default maximum. Reduce both the prompt instructions AND the `todo` array length — e.g., `"todo": ["task","task"]` for two scouts. The prompt and todo array must stay in sync.

## Node ID

Default: `scout-parallel`. If you need additional scouting phases, suffix: `scout-parallel-<N>`. First instance: `scout-parallel` (no suffix). Second instance: `scout-parallel-2`. Never use `-1` as a suffix.

## Notes

- Scouts are haiku-tier — fast and cheap. Prefer them over deep analysis for initial exploration.
- Give each scout a focused question.
- Give each scout specific paths or glob patterns.
- Step budget for `@ContextScout` is 12. Keep scout tasks within that budget.
- If any single scout question requires more than 12 steps to answer, move it to an `analyze-deep` node instead.
- Do not include `.opencode/` session directories in scout paths — they contain stale plan artifacts that may conflict with the actual codebase. Exception: planning infra files (e.g., the node-library) are permitted.
- **Failure mode:** Writing a thematic scout goal ("look at the auth system") without a path anchor.
- **Consequence:** ContextScout hits its 12-step budget reading the wrong files.
- **Fix:** Always provide specific file paths or glob patterns.
- **Failure mode:** Keeping the todo array at `["task","task","task"]` when only one or two areas need coverage. The 3rd task call is undirected. Adjust the todo array length to match the number of scout sections written in the prompt.
