# Agents

CodeAccelerate ships a team of specialized agents. You talk to one — **HeadWrench** — and it handles the rest automatically.

## HeadWrench

The primary orchestrator. This is the agent OpenCode puts you in conversation with directly.

HeadWrench plans, delegates, runs shell commands, and drives the session from start to finish. When a task calls for exploration, research, code edits, or document writes, HeadWrench dispatches the appropriate specialist and synthesizes the results. You don't pick which agents run — HeadWrench routes based on what the task actually requires.

Model: sonnet (more capable, used for planning and orchestration).

---

## Specialist Agents

You don't invoke these directly. HeadWrench dispatches them.

### @ContextScout

Quick codebase exploration. When HeadWrench needs to map structure, locate files, or gather surface-level context, it dispatches ContextScout — often several in parallel across different parts of the codebase.

Read-only. Fast. Used early in most sessions.

Model: haiku (lighter, cheap to run in parallel).

---

### @ContextInsurgent

Deep multi-file reasoning. When understanding a problem requires reading many files together and reasoning across them, HeadWrench brings in ContextInsurgent.

Unlike ContextScout, ContextInsurgent runs one at a time — it's used when the task genuinely requires sustained, connected analysis rather than broad parallel sweeps.

Model: sonnet (more capable, used when depth matters).

---

### @DeepResearcher

Web and documentation research. When the task requires looking something up — a library's API, an unfamiliar tool, external documentation — HeadWrench dispatches DeepResearcher. It has access to Exa and Context7 MCP servers.

Model: haiku (lighter, suitable for targeted lookup tasks).

---

### @JuniorDev

Scoped code edits. When HeadWrench has a clear implementation plan and needs changes applied across files, it dispatches JuniorDev — often multiple instances in parallel, each handling a specific file or change.

JuniorDev works from precise instructions. It doesn't plan; it executes.

Model: haiku (lighter, cheap to run in parallel).

---

### @QuickDoc

Single-file document writes and edits. When the session produces something that needs to be written up — a doc page, a config file, a prompt — HeadWrench dispatches QuickDoc to handle it. Like JuniorDev, multiple QuickDocs can run in parallel on different files.

Model: haiku (lighter, suitable for focused writing tasks).

---

## How routing works

HeadWrench decides which agents to use based on the task:

- **Broad exploration** → ContextScout (parallel)
- **Deep cross-file reasoning** → ContextInsurgent (sequential)
- **External lookup** → DeepResearcher
- **Code changes** → JuniorDev (parallel)
- **Document writes** → QuickDoc (parallel)

Haiku agents are inexpensive and run in parallel where possible. Sonnet agents are reserved for tasks that genuinely require more reasoning power. This keeps sessions fast and cost-efficient without sacrificing quality where it counts.
