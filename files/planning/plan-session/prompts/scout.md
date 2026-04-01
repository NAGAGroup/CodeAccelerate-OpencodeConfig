# Scout 1 — Project Map

Call `task` to dispatch @ContextScout to build a zero-assumption project map of the repository.

**Todo:** `["task"]`

> (1) Dispatch @ContextScout subagent.
> (2) Use this prompt template verbatim as the `prompt` field.
> (3) After task returns, call `next_step()`.

```
Read the repository structure starting from the root. Use `read .` to get the top-level directory listing, then read key files (CMakeLists.txt, package.json, pixi.toml, Cargo.toml, pyproject.toml, Makefile, or any build/manifest file present). Identify entry points, build configs, and directory purposes.

Do NOT read .opencode/ directory.

Return a flat bulleted list of file paths verbatim. No interpretation, no section headers, no prose.
```
