# Scouts 2 + 3 — Targeted Exploration

Call `task` twice in a single response to dispatch Scout 2 and Scout 3 in parallel.

**Todo:** `["task", "task"]`

## Scout 2 — Code Patterns

> (1) Fill `{{USER_TASK}}` from the user's original task description.
> (2) Fill `{{SCOUT_1_OUTPUT}}` from Scout 1's task result — paste verbatim, all lines.
> (3) Use this prompt template verbatim as the `prompt` field.

```
Task: {{USER_TASK}}

Project map (Scout 1 findings):
{{SCOUT_1_OUTPUT}}

Your job: identify naming conventions, structural patterns, and coding style in source files relevant to the task above. Read the files listed in the project map. Extract patterns with file:line citations.

Do NOT read .opencode/ directory. Use glob("src/**/*.ts") not glob("a.ts,b.ts").

Return: specific patterns and file:line references only. State "Nothing found" if nothing is relevant.
```

## Scout 3 — Dependencies & Integration

> (1) Fill `{{USER_TASK}}` from the user's original task description.
> (2) Fill `{{SCOUT_1_OUTPUT}}` from Scout 1's task result — paste verbatim, all lines.
> (3) Use this prompt template verbatim as the `prompt` field.

```
Task: {{USER_TASK}}

Project map (Scout 1 findings):
{{SCOUT_1_OUTPUT}}

Your job: identify build dependencies, external libraries, public interfaces, and integration boundaries relevant to the task above. Read build config files and dependency manifests listed in the project map.

Do NOT read .opencode/ directory.

Return: dependency names, versions, and exact file references only. State "No relevant boundaries found" if nothing applies.
```

Call `next_step()` after both tasks complete.
