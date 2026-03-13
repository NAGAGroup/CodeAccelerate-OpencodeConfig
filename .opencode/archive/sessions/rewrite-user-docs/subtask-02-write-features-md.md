# Subtask 02 — Write New FEATURES.md

## Delegation
- **Agent:** @DocWriter (`subagents/doc-writer`)
- **Model tier:** fast (github-copilot/claude-haiku-4.5) — clear spec, unambiguous content, no judgment calls required
- **Reason:** Straightforward documentation writing from a fully specified component inventory.

---

## Objective

Write a new `FEATURES.md` at the repository root that serves as the authoritative feature inventory for the current HeadWrench-based OpenCode config. This replaces the stale `FEATURES.md` that described the old tech_lead/junior_dev/guardrails system.

The new file must accurately document every component in the current system: agents, commands, protocols, skills, plugins, and MCPs. It is the source of truth that other docs link to for complete component details.

---

## Todolist

### 1. Write FEATURES.md
- [ ] Write the file at `/home/jack/CodeAccelerate-OpencodeConfig/FEATURES.md`
- [ ] Include all required sections (see spec below)
- [ ] Verify all agent names, model IDs, and command names are accurate
- [ ] Do not include any references to the old system (tech_lead, junior_dev, test_runner, explore as agent, librarian, build agent, workflow-* commands, guardrails plugin, reflection prompts)

---

## File Specification

**Path:** `FEATURES.md` (repository root)

**Purpose:** Authoritative feature inventory — source of truth for what the current config includes. Other docs link here for complete component details.

**Audience:** New users who want to understand the full scope of what is included, and contributors who need to keep docs in sync with implementation.

---

### Required Sections

#### 1. Header
- Title: `# OpenCode Configuration — Feature Set`
- 2-3 sentence purpose statement: what this file is and when to use it

#### 2. Architecture Overview
Brief (3-5 bullet) summary of the design approach:
- Plan-as-product: the system is simple; complexity lives in each session plan
- Everything is markdown — agents, protocols, commands, session plans are all plain files
- HeadWrench orchestrates; specialized subagents execute
- Skills encode complex rules HeadWrench loads on demand
- DCP plugin manages context automatically

#### 3. Component Inventory Table
A summary table listing all major component categories:

| Component | Count | Location |
|-----------|-------|----------|

Categories: Agents, Commands, Protocols, Skills, Plugins, MCPs

#### 4. Agents (8 total)
Table with columns: Agent | Role | Model | Notes

Agents to document:
- `headwrench` — Primary orchestrator and coordinator (default agent) — `github-copilot/claude-sonnet-4.6`
- `subagents/context-scout` — Pre-planning situational awareness (read-only) — `github-copilot/claude-haiku-4.5`
- `subagents/deep-researcher` — Web and documentation research — `github-copilot/claude-haiku-4.5`
- `subagents/gates-expert` — Recommends stop gates for session plans — `github-copilot/claude-sonnet-4.6`
- `subagents/subagent-builder` — Generates custom ephemeral agent definitions — `github-copilot/claude-sonnet-4.6`
- `subagents/code-writer` — Fast implementation agent for well-specified code tasks — `opencode/gpt-5.3-codex`
- `subagents/doc-writer` — Documentation, comments, and README updates — `github-copilot/claude-haiku-4.5`
- `subagents/architect` — Deep reasoning for complex architecture and subtle bugs (optional, double-gated) — `opencode/claude-opus-4-6`

Also document:
- `compaction` agent — special model used for context compression: `github-copilot/claude-haiku-4.5`
- `small_model` — used for cheap internal operations: `opencode/gpt-5.1-codex-mini`

#### 5. Commands (7 total)
Table with columns: Command | Purpose

Commands to document:
- `/plan` — Run the full planning workflow: Q&A, session creation, subtask breakdown, delegation assignment
- `/continue` — Resume the current session; execute the next pending subtask
- `/amend` — Apply a quick in-session fix without starting a new session
- `/inbox` — Review accumulated project-level observations in `.opencode/inbox/`
- `/context-add` — Add a file to `.opencode/context/` persistent context
- `/context-list` — List files currently in `.opencode/context/`
- `/context-remove` — Remove a file from `.opencode/context/`

#### 6. Protocols (3 total)
Table with columns: Protocol | Purpose | Location

Protocols to document:
- `checkpoint.md` — Canonical procedure run at the end of every subtask (WIP commit, update index.md, update spec.json, write notes, write inbox, gate check, circuit breaker)
- `plan-workflow.md` — The 8-phase planning workflow triggered by /plan (ContextScout → Q&A → checkpoint approval → research → draft plan → agent routing → present → finalize)
- `session-plan-schema.md` — Machine-readable spec for session directory structure (index.md, spec.json, subtask-NN files, notes/)

#### 7. Skills (1 total)
Table with columns: Skill | Purpose | When Loaded

Skills to document:
- `agent-delegation-expert` — Assigns the right agent and model tier to each subtask during Phase 5 of /plan. Loaded by HeadWrench; provides routing rules (which agent for which task type) and model tier guidance (fast/standard/deep).
- Location: `opencode/skills/agent-delegation-expert/SKILL.md`

#### 8. Plugins (2 total)
Table with columns: Plugin | Purpose

Plugins to document:
- `@tarquinen/opencode-dcp@beta` — Dynamic Context Pruning. Automatically compresses conversations to prevent context overflow. Configured via `opencode/dcp.jsonc`.
- `session-compaction.ts` — Injects session plan, current subtask, notes, and persistent context into the continuation prompt after compaction, so HeadWrench stays oriented.

#### 9. MCPs (3 total)
Table with columns: MCP | Status | Purpose

MCPs to document:
- `context7` — enabled — Fetches up-to-date library documentation and code examples
- `sequential-thinking` — enabled — Structured multi-step reasoning for complex decisions
- `exa` — disabled (requires `EXA_API_KEY`) — Web search, deep research, company/people lookup

#### 10. Maintenance Guidelines
Brief guidance on when and how to update this file:
- Update when adding/removing/modifying agents, commands, protocols, skills, plugins, or MCPs
- Cross-reference checklist: README.md, docs/CONCEPTS.md, docs/USAGE.md, opencode.json

---

## Scope
- **Write:** `FEATURES.md` (repository root)
- **Read:** `opencode/opencode.json` (for accurate model IDs), `opencode/commands/` (for command list verification)
- **Excluded:** Everything else — do not modify any other file

---

## Patterns
```
✅ GOOD — Use tables for structured component data
✅ GOOD — Include exact model IDs from opencode.json (e.g., github-copilot/claude-haiku-4.5)
✅ GOOD — Brief, factual descriptions — this is a reference doc, not a tutorial
❌ BAD  — Describing the old system (tech_lead, junior_dev, guardrails, workflow-* commands)
❌ BAD  — Deep implementation detail (this is an inventory, not a spec)
❌ BAD  — Inventing features or capabilities not actually present
```

---

## Constraints
- Only write `FEATURES.md` — do not touch any other file
- Do NOT document opencode.json or dcp.jsonc config options (these are publicly documented; not specific to this project)
- All agent names must exactly match their paths in `opencode/agents/` (e.g., `subagents/code-writer`, not `code-writer`)
- Model IDs must match exactly what is in `opencode/opencode.json`

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
