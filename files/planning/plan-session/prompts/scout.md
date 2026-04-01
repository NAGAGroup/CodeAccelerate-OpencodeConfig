# Scout 1 — Project Map

Call `task` to dispatch @ContextScout to build a zero-assumption project map of the repository.

**Todo:** `["task"]`

> (1) Dispatch @ContextScout subagent.
> (2) Use this prompt template verbatim as the `prompt` field.
> (3) After task returns, call `next_step()`.

```
Call `read .` to get the top-level directory listing — return it verbatim.

From the directory listing alone, write a summarized overview of the project: what it appears to be, inferred language/runtime, key directories and their purpose, and notable config or manifest files present.

Do NOT read .opencode/ directory. Do NOT read any files — the directory listing is sufficient.

Return:
- The verbatim top-level directory listing from `read .`
- A summarized project overview inferred from directory structure only
```
