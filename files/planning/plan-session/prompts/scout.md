# Scout 1 — Project Map

Call `task` to dispatch @ContextScout to build a zero-assumption project map of the repository.

**Todo:** `["task"]`

> (1) Dispatch @ContextScout subagent.
> (2) Use this prompt template verbatim as the `prompt` field.
> (3) After task returns, call `next_step()`.

```
Read the repository structure starting from the root:
1. Call `read .` to get the top-level directory listing — return this verbatim.
2. Read 3–5 core files: prioritize build/manifest files (CMakeLists.txt, package.json, pixi.toml, Cargo.toml, pyproject.toml, Makefile) and any top-level config files present.
3. From those reads, write a short summary (3–6 bullet points) covering: build system, language/runtime, key directories and their purpose, and entry points.

Do NOT read .opencode/ directory.

Return:
- The verbatim top-level directory listing from `read .`
- A 3–6 bullet summary of what the project is and how it is structured
```
