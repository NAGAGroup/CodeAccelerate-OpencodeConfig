# Scouts 2 + 3 — Targeted Exploration

Call `task` twice in a single response to dispatch Scout 2 and Scout 3 in parallel.

**Todo:** `["task", "task"]`

**Scout 2 — Code Patterns**

> (1) Fill `{{USER_TASK}}` from the user's original task description.
> (2) Fill `{{SCOUT_1_OUTPUT}}` from Scout 1's task result — paste verbatim, all lines.
> (3) Use this prompt template verbatim as the `prompt` field.

```
Task: {{USER_TASK}}

Project map (Scout 1 findings):
{{SCOUT_1_OUTPUT}}

Your job: identify naming conventions, structural patterns, and coding style in source files relevant to the task above.

From the project map above, derive a concrete list of source files to read (pick the files most relevant to the task — typically 3–6 files). Call `read` on each file directly. Do NOT use grep. Do NOT read .opencode/.

Glob syntax if needed: ✓ glob("**/*.cmake") ✗ glob("a.cmake,b.cmake")

Return: specific patterns and file:line citations. State "Nothing found" if nothing is relevant.
```

**Scout 3 — Dependencies & Integration**

> (1) Fill `{{USER_TASK}}` from the user's original task description.
> (2) Fill `{{SCOUT_1_OUTPUT}}` from Scout 1's task result — paste verbatim, all lines.
> (3) Use this prompt template verbatim as the `prompt` field.

```
Task: {{USER_TASK}}

Project map (Scout 1 findings):
{{SCOUT_1_OUTPUT}}

Your job: identify build dependencies, external libraries, public interfaces, and integration boundaries relevant to the task above.

From the project map above, derive a concrete list of build config and dependency manifest files to read (e.g. CMakeLists.txt, pixi.toml, Cargo.toml, package.json, Makefile — whichever are present). Call `read` on each file directly. Do NOT use grep. Do NOT read .opencode/.

Return: dependency names, versions, and exact file:line references. State "No relevant boundaries found" if nothing applies.
```

Call `next_step()` after both tasks complete.
