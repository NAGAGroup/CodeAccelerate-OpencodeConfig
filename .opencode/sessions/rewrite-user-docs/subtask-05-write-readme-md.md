# Subtask 05 — Write New README.md

## Delegation
- **Agent:** @DocWriter (`subagents/doc-writer`)
- **Model tier:** fast (github-copilot/claude-haiku-4.5) — clear spec, no ambiguous decisions, content largely defined
- **Reason:** Straightforward documentation writing with fully specified structure. README is written last so it can accurately link to FEATURES.md, CONCEPTS.md, and USAGE.md.

---

## Objective

Write a new `README.md` at the repository root. This is the first thing a new user sees. It should clearly explain what this config is, why it exists, how to install it, and how to get started in under 2 minutes of reading. It links to the other docs for depth.

The tone should reflect the design philosophy: this system is simple by intent. The plan is the product, not the execution engine. Everything is inspectable markdown files.

---

## Todolist

### 1. Write README.md
- [ ] Write the file at `/home/jack/CodeAccelerate-OpencodeConfig/README.md`
- [ ] Cover all required sections (see spec below)
- [ ] Verify all links to other docs are correct relative paths
- [ ] Do not reference any old system names

---

## File Specification

**Path:** `README.md` (repository root)

**Purpose:** First-contact document. Answers: what is this, why does it exist, how do I install it, how do I start using it, where do I learn more.

**Audience:** Someone who just found or cloned this repository.

**Tone:** Direct and confident. Not salesy. Reflect the "dead simple system" philosophy — don't oversell it.

---

### Required Sections

#### 1. Title and Tagline
- Title: `# OpenCode Configuration`
- Tagline (1 sentence): Captures the core idea — e.g., "A HeadWrench-based OpenCode config where the plan is the product, not the execution engine."

#### 2. What This Is (3-5 sentences)
Explain what this config is and the core design insight:
- An OpenCode configuration that provides structured, session-based AI-assisted development
- The system itself is intentionally simple: `/plan` triggers Q&A, Q&A produces markdown session files, agents read and follow the markdown
- Complexity lives in each session plan — designed for the specific problem, discarded when done
- Everything is plain markdown files: session plans, protocols, agent definitions. Inspectable and editable mid-session without understanding any plugin API.

#### 3. What You Get
A compact feature highlights list (not a full inventory — link to FEATURES.md for that):
- **HeadWrench** — orchestrator that runs planning workflows, delegates to subagents, and checkpoints progress
- **7 specialized subagents** — context-scout, deep-researcher, gates-expert, code-writer, doc-writer, subagent-builder, architect
- **Session-based workflow** — /plan creates a structured plan; /continue executes it subtask by subtask
- **1 skill** — agent-delegation-expert for routing subtasks to the right agent and model
- **DCP plugin** — automatic context compression to prevent overflow
- **3 MCPs** — context7 (library docs), sequential-thinking (structured reasoning), exa (web search, disabled by default)

> See [FEATURES.md](FEATURES.md) for the complete component inventory.

#### 4. Installation

```bash
# Copy the config to your OpenCode directory
cp -r opencode ~/.config/opencode
```

That's it. No build step needed — OpenCode handles dependency installation on first run.

Then start OpenCode in your project:

```bash
opencode
```

HeadWrench is the default agent. You're ready to start a session.

#### 5. Quick Start

Show the minimal path to getting something done:

```
/plan add dark mode to the settings page
```

HeadWrench will:
1. Run ContextScout to understand your codebase
2. Ask you Q&A questions (goal, scope, done criteria, git branch, etc.)
3. Write a session plan with subtasks in `.opencode/sessions/`
4. Wait for you to say "start"

Then:
```
/continue
```
Executes the first subtask. Run again for each subsequent subtask.

#### 6. Learn More

- **[docs/CONCEPTS.md](docs/CONCEPTS.md)** — The design philosophy and key concepts: why this config works the way it does, what HeadWrench is, what sessions are, what skills are
- **[docs/USAGE.md](docs/USAGE.md)** — How to use the 7 commands: /plan, /continue, /amend, /inbox, and context commands — with examples
- **[FEATURES.md](FEATURES.md)** — Complete component inventory: all agents, commands, protocols, skills, plugins, MCPs

---

## Scope
- **Write:** `README.md` (repository root)
- **Read:** nothing required (all content is spec'd above; FEATURES.md, CONCEPTS.md, and USAGE.md now exist from prior subtasks)
- **Excluded:** Everything else — do not modify any other file

---

## Patterns
```
✅ GOOD — Lead with the design philosophy, not a feature list
✅ GOOD — Installation should be 1-2 commands maximum
✅ GOOD — Quick start shows the minimal path to value
✅ GOOD — Link to other docs rather than duplicating their content
❌ BAD  — Long feature lists in the README (that's FEATURES.md)
❌ BAD  — Old system references (tech_lead, junior_dev, workflow-* commands)
❌ BAD  — Marketing language or overselling
❌ BAD  — Missing links to the other 3 doc files
```

---

## Constraints
- Only write `README.md` — do not touch any other file
- Links to other docs must use correct relative paths: `FEATURES.md`, `docs/CONCEPTS.md`, `docs/USAGE.md`
- Install instruction: `cp -r opencode ~/.config/opencode` — no `bun install` needed
- Keep it short — if something is already in FEATURES.md, CONCEPTS.md, or USAGE.md, link there instead of duplicating

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
