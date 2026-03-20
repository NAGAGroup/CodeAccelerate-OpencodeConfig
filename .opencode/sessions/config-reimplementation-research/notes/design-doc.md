# Design Document: OpenCode Config Reimplementation

**Session**: config-reimplementation-research  
**Date**: 2026-03-19  
**Status**: Final  
**Companion**: research-brief.md (executive summary)

---

## Overview

This document provides detailed design recommendations for 8 feature areas of the opencode configuration system. Each section contains:
- **Recommended Design** — what to build
- **Rationale** — research evidence supporting the design
- **Divergence from Current Config** — what changes and why
- **How We Do This in OpenCode** — concrete implementation path given platform constraints

---

## Feature Area 1: Planning System & Planning Modes

### Recommended Design

Implement a **Plan-and-Execute architecture with mode-specific typed artifacts**. The planning system has three distinct modes — each producing a structurally different plan artifact:

| Mode | Artifact Type | Key Fields | Execution Model |
|------|--------------|------------|-----------------|
| `plan` | Analytical report | hypotheses, evidence map, unknowns | No execution; surfaces findings to user |
| `build` | DAG execution plan | step graph, dependencies, parallelization hints, success criteria | Full execution with checkpoints |
| `autoaccept` / `yolo` | Compressed action sequence | action list, risk flags, rollback hints | Auto-execute with minimal interruption |

**Plan artifact schema** (for `build` mode):
```json
{
  "plan_id": "uuid",
  "goal": "string",
  "mode": "build | plan | autoaccept",
  "steps": [
    {
      "step_id": "01",
      "description": "string",
      "dependencies": ["step_id"],
      "parallelizable_with": ["step_id"],
      "success_criteria": "string",
      "context_boundary": ["file_path"],
      "review_required": false,
      "agent": "agent_name",
      "model_tier": "mechanical | standard | complex | breakthrough"
    }
  ],
  "parallelization_graph": {},
  "pre_execution_validation": {
    "feasibility_check": true,
    "dependency_resolution": true,
    "context_availability": true
  }
}
```

**Planning pipeline**:
1. Goal intake → mode detection
2. Multi-step synthesis (3 passes: decompose → validate → optimize)
3. Pre-execution validation gate (rejects infeasible plans before any execution)
4. User approval gate
5. Execution with step-level state tracking

### Rationale

- **LLMCompiler** (Kim et al., ICML 2024): parallel decomposition delivers 3.7× latency improvement, 6.7× cost savings, ~9% accuracy improvement over sequential execution
- **Multi-step synthesis** produces plans 10–30% better than single-pass generation
- **Pre-execution validation** rejects 15–25% of infeasible plans before any tokens are spent on execution
- **Mode-specific artifacts** prevent the precision loss of using one structure for all planning contexts — a `plan` mode that produces an execution DAG is wrong; an `autoaccept` mode that requires detailed dependency graphs is unnecessary overhead

### Divergence from Current Config

1. **Markdown plans → typed JSON artifact with DAG**: Current plans are unstructured markdown. Replacing with typed artifacts enables programmatic dependency resolution and resumption.
2. **Mode-agnostic structure → mode-specific artifacts**: All current modes produce the same plan format. Each mode should produce a structurally appropriate artifact.
3. **Single-pass generation → multi-step synthesis**: Current plans are generated in one pass. A 3-pass pipeline (decompose → validate → optimize) yields measurably better plans.
4. **No pre-execution validation → validation gate**: No current mechanism rejects infeasible plans. Adding a validation step before execution prevents wasted work.

### How We Do This in OpenCode

OpenCode has no native plan execution engine. Implementation path:

- **Plan artifacts**: Implement as structured JSON files in `.opencode/sessions/{name}/` — one `plan.json` per session. HeadWrench writes this file during planning.
- **Mode detection**: Implement via YAML frontmatter in slash commands. Each planning mode is a separate `.opencode/commands/` file (`/plan`, `/build`, `/yolo`) that sets the artifact template.
- **Multi-step synthesis**: HeadWrench (as orchestrator) runs 3 internal passes using the `/plan` agent (analysis mode) before writing the final artifact.
- **Pre-execution validation**: Implement as a HeadWrench-direct check step before every `start` command — read `plan.json`, verify all context files exist, all agents are defined, no circular dependencies.
- **Parallelization**: opencode does not support parallel agent execution natively. Model parallelization via grouped subtask files with HW launching multiple Task tool calls in one message (current convention) is the closest approximation.
- **DAG persistence via Plugin**: The Plugin API's `event` hook (lifecycle events) can intercept step transitions and persist DAG state to `plan.json` automatically. This is implementable now as an npm Plugin package enabled in `opencode.json`.

---

## Feature Area 2: Session Plan Structure & Execution Design

### Recommended Design

Session plans should be **resumable, dependency-aware execution artifacts** — not flat ordered lists. Key structural requirements:

**Session plan schema**:
```
index.md           → human-readable overview (not execution source of truth)
spec.json          → execution state machine (currentSubtask, status, circuit breaker)
plan.json          → DAG artifact (step graph, dependencies, parallelization)
subtask-NN-{name}.md → isolated execution context per step
notes/             → persistent findings (survive compaction)
```

**State management artifact** (`spec.json` enhancement):
```json
{
  "plan_id": "uuid",
  "execution_id": "uuid",
  "current_subtask": 3,
  "status": "in_progress",
  "step_outputs": { "01": "path/to/output" },
  "completed_steps": ["01", "02"],
  "failed_steps": [],
  "last_checkpoint": "2026-03-19T10:00:00Z",
  "circuit_breaker": {
    "consecutive_failures": 0,
    "threshold": 3,
    "state": "CLOSED"
  }
}
```

**Subtask file requirements**: Each subtask file must be a self-contained execution context:
- `## Objective` — 1–2 sentence goal
- `## Scope` — explicit Edit/Read/Write/Excluded lists
- `## Constraints` — hard limits
- `## Todolist` — step-level checklist
- `## Delegation` — assigned agent + model
- `## Success Criteria` — verifiable completion condition
- `## Context Files` — explicit list of files the agent needs

### Rationale

- **Resumability at any step** requires state that tracks outputs, not just current position. This enables recovery from compaction events without restarting.
- **Explicit context boundaries** per subtask prevent context bleed between steps — a top source of cascading errors in long sessions.
- **Self-contained subtask files** are the key insight from Plan-and-Execute research: subagents should receive an isolated, fully-specified prompt rather than inheriting ambient context.
- **DAG structure** enables identifying parallelizable steps before execution begins — a prerequisite for the LLMCompiler-style efficiency gains.

### Divergence from Current Config

5. **Flat step lists → DAG with dependencies**: Current subtask ordering is implicit (NN prefix). Explicit dependency declarations enable both resumption and parallelization.
6. **No step-level context boundaries → explicit `## Context Files` per subtask**: Current agents inherit broad context. Scoped context prevents cascading errors.
7. **No formal success criteria → verifiable criteria per subtask**: Current subtasks complete when the agent decides they're done. Explicit success criteria enable automated verification.

### How We Do This in OpenCode

- **Current convention is 80% of the way there**: The existing `subtask-NN-{name}.md` + `spec.json` + `index.md` structure already implements the core pattern. The gaps are:
  - Add `## Context Files` section to subtask file schema
  - Add `## Success Criteria` section to subtask file schema
  - Extend `spec.json` with `step_outputs` and `circuit_breaker` state fields
  - Add `plan.json` as a DAG artifact written during planning
- **Resumption**: Already implemented via `spec.json` + compaction recovery protocol — this is a strength of the current design.
- **Parallelization**: Implement via `## Delegation — Parallel Group` header in subtask files (current convention for parallel slots).

---

## Feature Area 3: Context Management Lifecycle, Tiers, Staleness & Archival

### Recommended Design

Implement **3-tier memory with SLA-based staleness and proactive compaction**:

**Tier structure**:
| Tier | Type | Storage | Staleness SLA | Eviction |
|------|------|---------|--------------|---------|
| Working | Active context (current session) | In-context | Session duration | Auto-compact at 60% |
| Episodic | Session notes, decisions | `.opencode/sessions/*/notes/` | 30 days | LLM summarization archival |
| Semantic | Conventions, patterns, permanent knowledge | `~/.config/opencode/context/` + `.opencode/context/` | Until superseded | Version-tagged replacement |

**Staleness metadata schema** (for context files):
```yaml
---
active: true
created: "2026-01-01"
freshness_sla: "30d"    # how long this is valid
superseded_by: null      # filename of replacement if stale
context_type: episodic   # working | episodic | semantic
---
```

**Compaction policy**:
- Trigger compaction at **60% context utilization** (not 100%) — the 60–70% cliff is silent
- Use verbatim compaction for deterministic content (zero hallucination risk)
- Use LLM summarization for exploratory/research content (70% savings, 90% retention)
- Position-aware placement: critical information at context start/end, not middle

**Multi-stage injection**:
1. Load all candidate context files
2. Score relevance (semantic similarity to current task)
3. Rerank by recency + relevance
4. Inject top-N, respecting position-aware placement rules

**Archival trigger**: When episodic content exceeds freshness SLA or session closes, produce a summarized archival note with `superseded_by` pointer.

### Rationale

- **"Lost-in-the-middle"** (Liu et al.): 30%+ accuracy drop for information placed in middle of context. Position matters.
- **60–70% utilization cliff** (empirical): Performance degrades well before stated context limit. Proactive compaction at 60% prevents cliff.
- **Effective context ≠ stated context**: Claude 3.5 Sonnet's effective window is ~50–100K tokens despite 200K stated limit — planning must account for this.
- **SLA-based freshness** outperforms timestamp-based freshness because different content types have different natural lifespans (session notes: 30 days; conventions: indefinite; WIP notes: session duration).
- **LLM summarization archival**: 70% token savings, 90% information retention (validated in production systems).

### Divergence from Current Config

8. **Flat context injection → 3-tier memory**: Current config loads context files without relevance scoring or tier awareness.
9. **No staleness metadata → per-file SLA metadata**: Current files have no freshness tracking — files are either active or deleted.
10. **No proactive compaction triggers → 60% threshold**: Current compaction is manual or reactive. Proactive triggers prevent the performance cliff.

### How We Do This in OpenCode

- **Tier 1–3 structure**: Already partially implemented via `~/.config/opencode/context/` (semantic) and `.opencode/sessions/*/notes/` (episodic). The gap is metadata and active enforcement.
- **Staleness metadata**: Add YAML frontmatter to all context files with `active`, `freshness_sla`, `superseded_by`, `context_type` fields. HeadWrench checks `active: false` and `superseded_by` before loading.
- **60% threshold**: HeadWrench monitors context usage (estimated token count of loaded files) and triggers the compress tool when approaching 60% of effective window (~50K tokens for Sonnet).
- **Multi-stage injection**: Implement as a HeadWrench-direct step during session bootstrap — score files by relevance to current subtask goal before loading.
- **Position-aware placement**: HeadWrench places critical context (current subtask file, key constraints) at start of context; background notes at end.
- **LLM summarization archival**: Implement as part of checkpoint step 5 (session notes) — produce a summarized version of exploratory content when archiving.

---

## Feature Area 4: Writing Session-Specific Subagents

### Recommended Design

Implement **Role-Goal-Backstory agents with hard operational limits and explicit tool manifests**:

**Agent definition schema**:
```json
{
  "name": "context-scout",
  "role": "Project context specialist",
  "goal": "Provide precise, evidence-backed situational awareness of the codebase",
  "backstory": "You are a read-only reconnaissance agent...",
  "model": "anthropic/claude-haiku-4",
  "tools": ["read", "glob", "grep"],
  "allow_delegation": false,
  "allow_code_execution": false,
  "max_iter": 15,
  "max_execution_time": 120,
  "max_rpm": 10,
  "temperature": 0.3,
  "maxTokens": 8192,
  "context_window_strategy": "summarize"
}
```

**Agent type taxonomy** (per session):
| Agent Type | Complexity | Model Tier | Tools |
|-----------|-----------|-----------|-------|
| Context Scout | Mechanical | haiku | read, glob, grep |
| Context Insurgent | Standard | sonnet | read, glob, grep, sequential-thinking |
| Deep Researcher | Standard | sonnet | web search tools |
| Implementer | Standard → Complex | sonnet → o1-mini | read, write, edit, bash |
| Reviewer | Standard | sonnet | read, glob, grep |
| Architect | Complex | o1-mini | read, sequential-thinking |

**Session-local agent creation**: During plan finalization, HeadWrench creates agent `.md` files in `.opencode/agents/` using the agent-writer skill. Each session's needs are different; agents are parameterized from global templates.

**Operational limits enforcement**:
- `max_iter`: Maximum tool calls per invocation (prevents runaway agents)
- `max_execution_time`: Wall-clock timeout in seconds
- `max_rpm`: Rate limit to prevent API burst costs

### Rationale

- **Role-Goal-Backstory** (CrewAI validation): This 3-field structure produces more consistent behavior than system prompts alone because Role grounds the agent's identity, Goal focuses its actions, and Backstory provides operational context.
- **Hard operational limits > prompt constraints**: Instruction-based constraints ("don't run more than 10 tool calls") are routinely violated under pressure. Hard limits enforced at the invocation layer are not.
- **Deny-by-default tool permission**: Explicitly listing allowed tools is more reliable than listing denied tools. Agents only access what they need.
- **Model tier assignment**: Matching model capability to task complexity captures 80% of the efficiency gains from using cheaper models — the key is complexity classification, not intuition.

### Divergence from Current Config

11. **Prompt constraints → operational limits**: Current agents rely on prompt-based behavioral constraints. Replace with `max_iter`, `max_execution_time`, `max_rpm`.
12. **Single generalist → role-specific specialists**: Single `session-local-implementer` is the anti-pattern. Define at minimum: Scout (haiku), Implementer (sonnet), Architect (o1-mini) per complex session.

### How We Do This in OpenCode

- **Agent JSON files**: OpenCode's native agent system (`~/.opencode/agents/*.json`) supports `model`, `tools`, `temperature`, `maxTokens`, `systemPrompt`. This maps directly to Role-Goal-Backstory via systemPrompt.
- **Operational limits via Plugin**: OpenCode does not natively support `max_iter` or `max_rpm`, but the Plugin API's `chat.params` hook can intercept each call and enforce these limits — counting tool calls, tracking elapsed time, enforcing RPM. This is implementable now as an npm Plugin. Interim (pre-Plugin): document limits in system prompt as best-effort enforcement.
- **Session-local agents**: Create in `.opencode/agents/` during plan finalization using the agent-writer skill. Remove after session close (or retain as templates).
- **Model tier assignment**: opencode agents support per-agent model field. Set `model` based on agent type: `anthropic/claude-haiku-4` for scouts, `anthropic/claude-sonnet-4-5` for implementers, `anthropic/claude-opus-4` or o1-equivalent for architects.
- **Deny-by-default**: opencode agents support `tools` array — list only permitted tools. Leave absent tools unlisted.

---

## Feature Area 5: Delegation Design & Routing Strategy

### Recommended Design

Implement **hierarchical manager+specialist routing with static routing table and complexity classification**:

**Routing table** (HeadWrench as manager):
```
Task Type              → Agent          → Model Tier
─────────────────────────────────────────────────────
Quick file lookup      → ContextScout   → mechanical (haiku)
Codebase exploration   → ContextInsurgent → standard (sonnet)
Web/docs research      → DeepResearcher → standard (sonnet)
Implementation         → Implementer    → standard→complex (sonnet/o1)
Architecture analysis  → Architect      → complex (o1-mini)
Review / validation    → Reviewer       → standard (sonnet)
```

**Complexity classification** (applied at subtask definition time):
- **Mechanical**: Single file, deterministic, no reasoning required → haiku
- **Standard**: Multi-file, some reasoning, clear success criteria → sonnet
- **Complex**: Ambiguous requirements, multi-step reasoning, novel synthesis → o1-mini
- **Breakthrough**: Open-ended research, no known solution path → o1-preview

**Routing rules**:
1. Classify task complexity before assigning agent
2. Match agent type to task category (not just complexity)
3. Assign model tier based on classification
4. Write assignment into subtask `## Delegation` section before execution begins
5. HeadWrench does NOT perform the work — only delegates and validates outputs

**Delegation prompt structure**:
- What to read (explicit file paths)
- Goal in 1–2 sentences
- Hard constraints (what NOT to do)
- How to verify completion
- Do NOT include: step-by-step micro-instructions

### Rationale

- **Hierarchical manager+specialist** is the production standard — no production system runs a single generalist for all tasks. The manager role (HeadWrench) is pure orchestration; specialist roles are pure execution.
- **Static routing table** is more reliable than dynamic LLM-based routing for most tasks. Dynamic routing adds latency and failure modes for predictable task categories.
- **Complexity classification before assignment** captures 80% of cost savings from model tier matching — the key is systematizing what is currently done by intuition.
- **Delegation prompt philosophy**: Provide the "what", not the "how". Over-specified prompts remove agent reasoning and produce brittle outputs that fail when conditions differ slightly from the specification.

### Divergence from Current Config

13. **Ad-hoc routing → static routing table**: Current agent selection is implicit in HW's judgment. Explicit routing table makes this systematic and auditable.
14. **No rate limiting → max_rpm enforcement**: Critical missing safety mechanism. Agent runaway is currently unconstrained at the platform level.

### How We Do This in OpenCode

- **Routing table**: Document in `~/.config/opencode/context/routing-table.md` as a permanent semantic context file. HW loads it during session bootstrap.
- **Complexity classification**: Implement as part of planning — during subtask definition, HW assigns `model_tier` field to each subtask. Document the classification criteria in the routing table.
- **Delegation section enforcement**: The `## Delegation` section in subtask files (current convention) is the right pattern. Extend it to include `model_tier` and `complexity_class` fields.
- **Rate limiting**: Requires Plugin implementation. Interim: document rate limit guidance in agent system prompts.
- **Dynamic routing gap**: opencode does not support mid-session agent switching (Issue #5963). All delegation must be resolved at plan time. This constrains the system to static routing — which is actually the research-validated approach anyway.

---

## Feature Area 6: Speed/Cost/Correctness Trade-off Framework

### Recommended Design

Implement a **formal model tier framework with dual-model strategy**:

**Model tier definitions**:
| Tier | Task Profile | Model (Anthropic) | Model (OpenAI) | Cost Index |
|------|-------------|-------------------|-----------------|------------|
| Mechanical | Single-step, deterministic | claude-haiku-4 | gpt-4o-mini | 1× |
| Standard | Multi-step, clear requirements | claude-sonnet-4-5 | gpt-4o | 5× |
| Complex | Ambiguous, multi-hop reasoning | claude-opus-4 | o1-mini | 20× |
| Breakthrough | Novel, open-ended | claude-opus-4 (extended thinking) | o1-preview | 80× |

**Dual-model strategy**:
- Assign a **reasoning model** (handles synthesis, architecture, ambiguity resolution)
- Assign a **function-calling model** (handles tool use, file operations, deterministic tasks)
- For most sessions: reasoning = sonnet, function-calling = haiku

**Session-level trade-off configuration**:
```json
{
  "session_profile": "standard | research | quick",
  "default_model_tier": "standard",
  "max_tier_allowed": "complex",
  "escalation_policy": "ask | auto | never"
}
```

**Escalation policy**: When a task exceeds its assigned tier's capabilities:
- `ask`: surface to user before escalating
- `auto`: escalate to next tier automatically
- `never`: fail and surface error

**Cost governance**:
- Track estimated token spend per subtask
- Alert when session exceeds threshold
- Default cap: 500K tokens per session (configurable)

### Rationale

- **80% cost savings** (o1-mini vs o1-preview): Using the minimum sufficient model is the largest lever on session cost.
- **Dual-model strategy**: Separating reasoning from function-calling prevents using expensive reasoning models for deterministic file operations — a common source of unnecessary cost.
- **Sonnet 3.5 consistency advantage**: Research note — o1 models show high variance ("moody"), Sonnet 3.5 is more consistent. Sonnet is better for standard sessions; o1 for genuinely novel problems.
- **Session profiles**: Pre-configuring trade-off profiles per session type (quick bugfix vs. architecture research vs. standard feature) removes per-session decision overhead.

### Divergence from Current Config

15. **Implicit model selection → formal complexity classification**: Current model selection is manual and inconsistent. Formal tier assignment at subtask definition time makes this systematic.

### How We Do This in OpenCode

- **Model tier assignment**: opencode supports per-agent `model` field. The framework is implemented by: (a) classifying complexity at subtask definition, (b) writing the model ID into the subtask `## Delegation` section, (c) using that model ID when creating the session-local agent file.
- **Dual-model via Plugin**: opencode's Plugin API supports a `function_calling_llm` pattern via the `chat.params` hook — intercept each call, inspect whether it's a tool-use step or reasoning step, and route accordingly. This is implementable now as an npm Plugin package.
- **Session profiles**: Implement as YAML config in `.opencode/sessions/{name}/spec.json` — add `session_profile` and `max_tier_allowed` fields. HeadWrench reads this during bootstrap.
- **Cost tracking via Plugin**: No native cost tracking in opencode, but the Plugin's `chat.message` hook fires on every conversation event and can intercept token usage metadata. A Plugin can accumulate spend per subtask and log to session notes or expose via `/cost` command. This is implementable now. Interim: HW-direct estimation (model tier × complexity) logged to notes.

---

## Feature Area 7: Protocol & Skills System Design

### Recommended Design

Implement **progressive disclosure skills with dynamic loading and version management**:

**Skill file structure** (progressive disclosure pattern):
```markdown
---
name: "skill-name"
version: "1.0.0"
description: "One-line summary loaded in all contexts"
tags: [category, subcategory]
parameters:
  - name: param1
    description: "Description"
    required: true
triggers: ["keyword1", "keyword2"]
---

## TL;DR
2-3 sentence summary. Loaded when skill is listed.

## Full Instructions
Full content. Loaded ONLY when skill is explicitly invoked.

## Examples
...
```

**Loading levels**:
1. **Discovery level**: Only YAML frontmatter loaded (name, description, tags) — ~50 tokens per skill
2. **Summary level**: TL;DR loaded when skill appears in routing decision — ~200 tokens
3. **Full level**: Complete content loaded on explicit invocation — 1000–5000 tokens

**Dynamic loading protocol**:
- At session start: load discovery level for all skills
- At planning stage: load summary level for relevant skills
- At execution: load full level for active skill

**Version management**:
- Each skill file tagged with `version:` in frontmatter
- Breaking changes increment major version
- Skill references include version: `skill-name@1.0.0`
- Previous versions retained until all active sessions are closed

**Hierarchical composition**:
- 6–8 core skills (planning, delegation, context, protocols, etc.)
- Each core skill declares 2–3 sub-skills in `sub_skills:` frontmatter field
- Sub-skills loaded only when parent skill is active

**Protocol system** (separate from skills):
```
~/.config/opencode/protocols/
  checkpoint.md         → fixed 8-step checkpoint procedure
  context-management.md → 5-tier context loading rules
  session-plan-schema.md → plan artifact structure
  compaction-recovery.md → recovery from context loss
```

Protocols are imperative procedures — loaded fully when invoked, not progressively disclosed. Skills are capability definitions — progressively disclosed.

### Rationale

- **~95% token reduction** from progressive disclosure: Skills loaded at discovery level cost ~50 tokens vs 2000–5000 for full content. For a system with 20 skills, this is the difference between ~1K tokens (discovery) and ~60K tokens (full load).
- **95% MCP footprint reduction**: 8 meta-tools (skills) vs 50 native tools — the pattern of composing capabilities into skills rather than exposing raw tools dramatically reduces tool selection overhead.
- **Predictive loading**: Loading skill summaries 3–5 steps ahead reduces invocation latency from 3–5s to 100–200ms.
- **Versioning prevents silent regressions**: Unversioned skills that change behavior silently are a primary source of session inconsistency.
- **Architectural separation** (Skills vs Protocols vs Tools): Skills are capability definitions; Protocols are imperative procedures; Tools are atomic actions. Mixing these creates confusion about loading rules and update patterns.

### Divergence from Current Config

16. **Static global YAML config → SKILL.md progressive disclosure**: Current skill system loads full content statically. Restructuring to progressive disclosure eliminates ~95% of skill token overhead.
17. **No versioning → version-tagged skills**: Current skills have no version tracking. Silent regressions are undetectable.
18. **No dynamic loading → trigger-based loading**: Current skills are always-loaded or never-loaded. Trigger-based loading optimizes for the common case (most skills are unused in any given session).

### How We Do This in OpenCode

- **opencode Skills system** natively supports `.md` files in `~/.opencode/skills/` with YAML frontmatter. This is the right container for the progressive disclosure pattern.
- **Progressive disclosure**: Restructure SKILL.md files to put `## TL;DR` before `## Full Instructions`. HeadWrench convention: read only frontmatter+TL;DR at planning; read full file at execution.
- **Dynamic loading**: opencode invokes skills via `--skill` flag. HeadWrench implements dynamic loading by reading only the frontmatter+TL;DR section (via offset/limit in Read tool) during discovery, then loading the full file only when the skill is needed.
- **Versioning**: Add `version:` field to all SKILL.md frontmatter. HeadWrench checks version at load; logs mismatch to session notes.
- **Hierarchical composition**: opencode Skills support `extends:` array in frontmatter — use this for sub-skill composition.
- **Protocol separation**: Keep protocols in `~/.config/opencode/protocols/` as flat procedure files (not skills). Load fully when invoked by name.

---

## Feature Area 8: Slash Commands & General UX

### Recommended Design

Implement **slash commands as first-class session control with checkpoint primitives**:

**Slash command categories**:
| Category | Commands | Purpose |
|---------|---------|---------|
| Session control | `/save`, `/restore`, `/resume`, `/status` | Checkpoint management |
| Context control | `/compact`, `/clear`, `/context` | Context window management |
| Planning | `/plan`, `/build`, `/yolo` | Mode selection + plan generation |
| Navigation | `/skills`, `/agents`, `/sessions` | Discovery and listing |
| Diagnostic | `/debug`, `/cost`, `/tokens` | Session health |

**Command file structure** (per command, in `.opencode/commands/`):
```markdown
---
name: save
description: "Save current session state to a checkpoint"
agent: headwrench
model: anthropic/claude-sonnet-4-5
allowed_tools: [bash, write]
arguments:
  - name: label
    description: "Checkpoint label (optional)"
    required: false
---

Save the current session state...
```

**"/" discovery UX**:
- Typing "/" should trigger autocomplete popup showing all available commands
- Commands grouped by category
- Description shown in autocomplete
- Argument hints shown when command is selected

**Checkpoint primitives** (critical missing feature):
- `/save [label]` — commit current state + write checkpoint metadata
- `/restore [label]` — restore to named checkpoint
- `/resume` — resume from last checkpoint after interruption
- `/compact` — trigger context compaction
- `/status` — show current session state (subtask, progress, context utilization)

**Error recovery UX**:
- All commands should be idempotent where possible
- Failed commands should produce actionable error messages
- `/resume` should work from any state including post-crash

### Rationale

- **Session control commands are table stakes** for long-running AI sessions. Without `/save`+`/restore`, any interruption (crash, compaction, user error) risks losing session state.
- **"/" autocomplete** is the primary discovery mechanism for commands in all major AI coding tools (GitHub Copilot, Cursor, Claude Code). The pattern is established and expected by users.
- **Checkpoint primitives** are the core mechanism for earned autonomy: users grant more autonomy when they know they can reliably save and restore state.
- **Idempotency**: AI assistant commands that have side effects and cannot be undone create user anxiety. Making commands idempotent (or providing undo) enables more confident interaction.
- **CLI+GUI hybrid**: The emerging pattern (Cursor, Copilot) is CLI commands that also surface in a GUI panel. Commands defined as files are portable across both surfaces.

### Divergence from Current Config

19. **No session discovery via "/" → "/" autocomplete**: Current slash commands are undiscoverable without reading documentation.
20. **No checkpoint commands → /save, /restore, /resume**: No mechanism to save/restore session state. Interruption recovery is entirely manual.
21. **Model field bug**: The `model` field in slash command YAML is currently ignored (v0.6.4). Model routing via slash commands is non-functional until this is fixed.
22. **No structured argument passing → YAML arguments schema**: Commands currently have no formal argument definition. Arguments are free-form text in the command body.

### How We Do This in OpenCode

- **Command files**: opencode supports `.opencode/commands/` for project-level and `~/.opencode/commands/` for user-level slash commands. Use both.
- **"/\" discovery**: opencode's built-in "/" autocomplete is the platform feature here — it reads from the commands directories automatically. The gap is that project-level commands in `.opencode/commands/` may not surface in the autocomplete. Verify this behavior.
- **Checkpoint commands**: Implement `/save`, `/restore`, `/resume` as command files. The command body instructs HeadWrench to run specific checkpoint procedures. Implementation requires:
  - `/save`: `git add -A && git commit -m "checkpoint: {label}"` (HeadWrench-direct)
  - `/restore`: `git checkout {checkpoint-commit}` (HeadWrench-direct with user confirmation)
  - `/resume`: Read `spec.json`, determine current subtask, load context, continue
- **Model field bug**: Until v0.6.4+ fixes the model field, specify model in the command body as an instruction to HeadWrench: "Use model: anthropic/claude-sonnet-4-5 for this task."
- **Structured arguments**: Implement via YAML `arguments:` frontmatter schema. HeadWrench parses arguments from the command invocation text.
- **Cost/token commands**: Implement `/cost` as a command that reads session notes for token estimates and produces a summary. For accurate real-time tracking, implement the `chat.message` Plugin hook — this is available now, not future-state.

---

## Cross-Cutting Concerns

### Earned Autonomy Framework

The autonomy model should be **graduated and verifiable**, not binary:

| Trust Level | Score Range | Execution Mode | Gate Behavior |
|------------|-------------|---------------|--------------|
| Restricted | < 0.60 | Manual approval required | Hard gate: stop and ask |
| Soft-execute | 0.60–0.85 | Auto-execute with notification | Soft gate: proceed, notify |
| Auto-execute | ≥ 0.85 | Full auto | No gate |

**VoI gate formula**: `VoI = stakes × (1 - trust) × uncertainty`
- If VoI > threshold: surface gate to user
- If VoI ≤ threshold: auto-proceed

**Trust score**: Beta(α,β) distribution per task category. Alpha increments on success, Beta on failure. Trust = α/(α+β).

**Circuit breaker states**: CLOSED (normal) → OPEN (N consecutive failures) → HALF-OPEN (testing) → DEGRADED (reduced capacity)

**Implementation in opencode**: Trust score tracking requires session notes. HeadWrench maintains a `trust-scores.md` note file per session, updating after each subtask. Gate decisions logged to session notes.

### Context Degradation Prevention

Three rules to prevent the 60–70% context cliff:
1. **Trigger compaction at 60%** estimated utilization (not 100%)
2. **Position-aware placement**: critical context at start/end, not middle
3. **Effective window planning**: plan for ~50–100K effective tokens (not 200K stated) for Sonnet models

### Graph RAG Enhancement (Future)

Current context retrieval is flat (load all active files). Optimal approach is Graph RAG:
- Build relationship graph between context files (file A informs file B)
- Use graph traversal for multi-hop context retrieval
- Multi-query expansion (3–5 variations of the retrieval query) before scoring
- **Implementation**: Requires Plugin to maintain graph index. Tag context files with `related_to:` frontmatter field as a manual approximation.

---

## Implementation Roadmap

### Phase 1 — Quick Wins (Low complexity, High impact)
1. Add staleness metadata to all context files (`active`, `freshness_sla`, `context_type`)
2. Restructure SKILL.md files for progressive disclosure (TL;DR before full content)
3. Add `version:` to all skill frontmatter
4. Add `## Context Files` and `## Success Criteria` to subtask file schema
5. Extend `spec.json` with `circuit_breaker` state fields
6. Define formal routing table in `~/.config/opencode/context/routing-table.md`
7. Implement 60% compaction trigger convention

### Phase 2 — Medium Effort (Medium complexity, High impact)
1. Differentiate planning mode artifacts (plan/build/autoaccept produce different schemas)
2. Implement multi-step planning pipeline (3 passes)
3. Add pre-execution validation gate to session bootstrap
4. Define specialist agent crew templates (Scout/Implementer/Architect)
5. Implement model tier assignment in subtask Delegation sections
6. Add `/save`, `/restore`, `/resume` slash commands

### Phase 3 — Plugin Implementations (Available Now)

OpenCode's Plugin API (full npm TypeScript packages, enabled in `opencode.json`) unlocks these capabilities **today** — they are not future-state. Each uses specific Plugin hooks:

| Item | Plugin Hook | Capability |
|------|------------|-----------|
| Operational limits (max_iter, max_rpm, max_execution_time) | `chat.params` | Intercept calls, count iterations, enforce rate + time limits |
| Dual-model routing (reasoning vs function-calling) | `chat.params` | Route tool-use steps to haiku, reasoning steps to sonnet/o1 |
| Cost tracking + session token budget | `chat.message` | Accumulate token spend per subtask, alert on threshold |
| Context utilization monitoring + 60% compaction trigger | `chat.message` | Track context size, trigger `/compact` when approaching cliff |
| DAG execution state persistence | `event` (lifecycle hooks) | Write step outputs to `plan.json` on each step transition |
| Graph RAG context retrieval | `tool` (custom tool) | Maintain graph index, serve multi-hop context queries |

**Recommended first Plugin**: operational limits (max_iter + max_rpm via `chat.params`) — highest safety impact, most straightforward to implement.

### Phase 4 — Advanced Autonomy (Research-validated, Complex)
1. Earned autonomy trust score tracking system (Beta(α,β) per task category, VoI gating)
2. Full complexity classification pipeline (automated complexity scoring at plan time)
3. Predictive skill loading (pre-load summaries 3-5 steps ahead)
4. Full Graph RAG with multi-query expansion (builds on Phase 3 Plugin foundation)
