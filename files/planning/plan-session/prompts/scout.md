# Scout 1 — Project Map

Call `task` to dispatch @ContextScout to build a zero-assumption project map of the repository.

**Todo:** `["task"]`

> (1) Dispatch @ContextScout subagent.
> (2) Use this prompt template verbatim as the `prompt` field.
> (3) After task returns, call `next_step()`.

```
Call `read .` on the repository root. Do NOT read .opencode/.

Return the full output of `read .` verbatim, followed by a complete project overview covering what the project is, its language/runtime, key directories and their purpose, and notable config or manifest files.
```
