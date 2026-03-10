# Subtask 03 — Write New docs/CONCEPTS.md

## Delegation
- **Agent:** @DocWriter (`subagents/doc-writer`)
- **Model tier:** fast (github-copilot/claude-haiku-4.5) — clear spec, well-defined mental model to convey, no ambiguous judgment calls
- **Reason:** Straightforward documentation writing with a fully specified structure and content.

---

## Objective

Write a new `docs/CONCEPTS.md` that gives new users a high-level mental model of the HeadWrench-based OpenCode config. This is a conceptual overview — not a tutorial, not an implementation reference. The goal is for a new user to read this and understand *what the system is and why it works the way it does* in under 10 minutes.

The central insight to anchor the document: **the plan is the product**. The system itself is intentionally simple — a slash command triggers Q&A, Q&A produces markdown files, agents read and follow the markdown. The complexity lives in each session plan, designed fresh for the specific problem at hand. Everything is inspectable and editable plain files.

---

## Todolist

### 1. Write docs/CONCEPTS.md
- [ ] Write the file at `/home/jack/CodeAccelerate-OpencodeConfig/docs/CONCEPTS.md`
- [ ] Open with the "plan is the product" design philosophy
- [ ] Cover all required concepts (see spec below)
- [ ] Keep it high-level — no implementation details, no schema specifics
- [ ] Verify the file does not reference any old system names

---

## File Specification

**Path:** `docs/CONCEPTS.md`

**Purpose:** High-level mental model for new users. Explains what the system is and why it works the way it does — not how to use it (that's USAGE.md) and not what components exist (that's FEATURES.md).

**Audience:** New users who want to understand the design philosophy and key concepts before diving into usage.

**Tone:** Clear, direct, practical. No marketing language. No deep technical detail.

---

### Required Sections

#### 1. Opening: The Plan Is the Product
The core design insight that makes this config different. Key points to convey:
- Most agent configs try to build a universal execution engine: agent hierarchies, routing logic, pattern enforcement frameworks. You spend more time configuring the engine than doing actual work.
- This config flips it. The system itself is dead simple: `/plan` triggers Q&A → Q&A produces markdown files → agents read and follow the markdown.
- The complexity lives in each session plan — designed fresh for that specific problem, then discarded when done.
- Everything is inspectable and editable. Session plans are markdown files. Protocols are markdown. Agent definitions are markdown. If something isn't working mid-session, you edit the file. No plugin API to understand, no routing heuristic to debug.
- The mental model: "there are files in a directory, and agents read them."

#### 2. HeadWrench — The Orchestrator
What HeadWrench is and what it does:
- HeadWrench is your primary interface and the session orchestrator
- It handles planning (running /plan, Q&A, writing session files), delegation (assigning subagents to subtasks), build/test execution, and checkpointing between subtasks
- It does NOT write large code blocks, do deep exploration, or research topics itself — it delegates those to subagents
- HeadWrench is the default agent when you open OpenCode

#### 3. Subagents — Specialized Workers
What subagents are and how they're used:
- Subagents are isolated, single-purpose workers. Each has a focused role and is given a fully-specified task prompt by HeadWrench.
- Subagents have no awareness of the broader session — they receive a task, complete it, and report back.
- List the 7 subagents and their one-line roles:
  - `context-scout` — reads the codebase and prior sessions to build situational awareness before planning
  - `deep-researcher` — web and documentation research
  - `gates-expert` — recommends where to put approval gates in session plans
  - `subagent-builder` — generates custom ephemeral agents when no default fits
  - `code-writer` — implements code from detailed specs
  - `doc-writer` — writes documentation, comments, READMEs
  - `architect` — deep reasoning for hard architectural problems (optional, double-gated)

#### 4. Sessions — The Unit of Work
How sessions work:
- A session is a named, bounded piece of work with a goal and a set of subtasks
- Sessions live in `.opencode/sessions/{name}/` as plain markdown and JSON files
- Key files: `index.md` (human-readable plan), `spec.json` (machine-readable state), `subtask-NN-{name}.md` (one file per subtask — only the current one is loaded at runtime)
- Session lifecycle: `/plan` creates it → `/continue` executes each subtask → checkpoint protocol runs between subtasks → session closes with a final commit
- Sessions accumulate `notes/` (session-specific findings) and feed observations to `.opencode/inbox/` (project-level patterns for future sessions)

#### 5. Skills — Loadable Knowledge Packages
What skills are:
- Skills are markdown files that encode complex rules or decision frameworks that HeadWrench loads on demand
- Currently one skill: `agent-delegation-expert` — loaded during Phase 5 of /plan to assign the right agent and model to each subtask
- Skills are not auto-loaded; HeadWrench explicitly loads them when needed using the `skill` tool
- Think of skills as "expertise HeadWrench reaches for when it needs it" — not hardcoded behavior, but on-demand guidance

#### 6. Commands — Entry Points
The 7 slash commands and what they're for (high-level, not detailed usage — that's in USAGE.md):
- `/plan` — start a new session: triggers Q&A, ContextScout, and plan generation
- `/continue` — resume the current session's next subtask
- `/amend` — apply a quick fix mid-session without starting a new plan
- `/inbox` — review accumulated project-level observations
- `/context-add`, `/context-list`, `/context-remove` — manage persistent context files that ContextScout reads on every planning session

#### 7. The Leverage Points
Where to focus tuning (paraphrased from the design note):
- The Q&A prompts in `/plan` and the session plan output format are where small improvements compound across every session
- ContextScout feeds persistent context (`.opencode/context/`) into every planning session automatically — keep notes there on what works and what doesn't
- If something isn't working, the files are right there to edit

#### 8. Next Steps
Links:
- **[USAGE.md](USAGE.md)** — How to use the commands: /plan, /continue, /amend, /inbox, context commands
- **[FEATURES.md](../FEATURES.md)** — Complete component inventory: all agents, commands, protocols, skills, plugins, MCPs

---

## Scope
- **Write:** `docs/CONCEPTS.md`
- **Read:** nothing required (all content is spec'd above)
- **Excluded:** Everything else — do not modify any other file

---

## Patterns
```
✅ GOOD — Lead with the design philosophy (plan-as-product, everything-is-files)
✅ GOOD — High-level descriptions only — this is a mental model doc, not a spec
✅ GOOD — Use the exact subagent names as listed (context-scout, code-writer, etc.)
✅ GOOD — Link to USAGE.md and FEATURES.md for details
❌ BAD  — Implementation details (schema fields, plugin architecture, model IDs)
❌ BAD  — Usage instructions (what commands to type) — that's USAGE.md
❌ BAD  — Referencing old system names (tech_lead, junior_dev, guardrails, etc.)
❌ BAD  — Over-explaining; keep it scannable
```

---

## Constraints
- Only write `docs/CONCEPTS.md` — do not touch any other file
- Keep it high-level — resist the urge to explain implementation details
- The "plan is the product" insight must be prominent, not buried
- Subagent names must match exactly: `context-scout`, `deep-researcher`, `gates-expert`, `subagent-builder`, `code-writer`, `doc-writer`, `architect`

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
