# CodeAccelerate-OpencodeConfig Design Specification

This is the authoritative design document for the CodeAccelerate multi-agent orchestration framework. All implementation, prompts, skills, agent files, and tooling must conform to this specification. If any other document contradicts this one, this document is correct.

---

## Core Design Philosophy

**Constraints on actions, freedom on reasoning.** The DAG constrains tool access, step ordering, verification gates, and delegation permissions. Nothing constrains what agents decide to investigate, discover, or how they solve problems. Agents are steered by what they're allowed to do, not told how to think.

---

## System Overview

A planning agent investigates a user's request, designs an execution DAG from a component library, and hands that DAG to an executing agent who works through it step by step. The framework targets local 9B-14B parameter models as the minimum viable capability tier.

The system has three layers:

1. **Planning** — a fixed planning DAG that investigates, researches, asks questions, and produces an execution DAG.
2. **Execution** — the produced DAG, composed of static component templates, executed by the primary agent with delegation to specialist subagents.
3. **Enforcement** — the DAG engine plugin that blocks unauthorized tool calls, manages step advancement, and injects step instructions as user messages.

---

## The Semantic Notes System

The semantic notes system (Qdrant MCP server running in local embedded mode with FastEmbed for local embeddings) is the sole persistent record for all session knowledge. There are no markdown notes files. Agents store findings via qdrant-store and retrieve them via qdrant-find.

**Session naming:** The planning agent must decide the session name before the first qdrant-store call in the planning session. This name is used as the Qdrant collection name for both planning and execution — the same collection is shared across both phases. This same session name is also used for `init_dag` and `add_node` calls. The session name is the single identifier that ties planning notes, execution notes, and the DAG together.

**Store immediately, not in batches.** Each significant finding, decision, or constraint gets its own store call at the moment it's discovered. Do not accumulate findings and store them all at once.

**Query by meaning, not by file.** When an agent needs context from earlier steps, it queries the semantic notes system with a natural language description of what it's looking for. One semantic search call replaces reading multiple files.

**Session-scoped, not persistent.** Each session uses a distinct collection name. Notes from different sessions do not bleed into each other. Notes are communication between agents within a session, not persistent memory across sessions.

**Memory is forbidden.** Agents regather context fresh every time via the semantic notes system. Re-reading takes one semantic search call; acting on stale cached understanding is the real cost.

---

## Planning DAG Flow

The planning agent runs through a fixed planning DAG with these phases:

### 1. Session Overview

The agent loads its core skills (plan-following, step-by-step reasoning, question-asking) and internalizes its role as a planner. The reasoning questions at this step must force genuine engagement with each skill's content — not just "am I ready to proceed." Questions should be specific enough that the agent cannot answer them without demonstrating it understood the skill.

### 2. Session Naming

The agent decides the session name. This name is used as the Qdrant collection name for all semantic notes (shared across planning and execution) and as the plan name for `init_dag` and `add_node`. The agent calls `init_dag` with this session name to initialize the DAG structure. This must happen before any qdrant-store calls and before delegating to any DAG writing subagents.

### 3. Orientation Scout

The agent delegates to a read-only project explorer to build broad understanding. The scout returns a prose briefing covering what exists, how parts relate, and what is unclear. The uncertainties section is the most valuable part — it shows what needs deeper investigation.

### 4. External Research

The agent delegates to a research subagent that searches external sources via SearXNG. Before dispatching, the agent must present the exact research query to the user for IP approval. The user can approve, modify, or skip. If the user requests modification, the agent must be able to revise the prompt and re-present it — the step must support looping back through reasoning and the approval gate.

### 5. User Questions

The agent surfaces unknowns that only the user can answer: intent, priorities, constraints, scope boundaries. The agent must always confirm its understanding of the task scope (mandatory minimum). It must not ask implementation questions — those are the executor's job. Questions should be about things that affect the plan's shape.

### 6. Store Notes

The agent stores key findings, decisions, and constraints to the semantic notes system. Each significant finding gets its own store call. There are no files written — the semantic notes system is the sole persistent record.

### 7. Compress

The agent compresses closed conversation sections to free context. This happens after the investigation phases and before the most cognitively demanding phase (DAG design).

### 8. Session Overview Refresher

The agent retrieves stored findings from the semantic notes system to re-establish context after compression. It queries by meaning and reasons through the recovered context before continuing.

### 9. DAG Design

The agent dispatches a specialized DAG design subagent. This subagent has constrained permissions — it cannot access the filesystem directly. It builds the DAG using `add_node`, which handles all file creation (writing the node entry to plan.jsonl and copying the static prompt from the component library). The design subagent retrieves planning context via semantic notes, reasons through the mapping of scope to DAG concepts, and builds the DAG node by node. It can delegate scouts and insurgents to investigate questions about the codebase that arise during design.

### 10. DAG Review

The agent dispatches a separate DAG reviewer subagent. The reviewer never saw the designer's reasoning process — only the output. It evaluates the DAG against a structured checklist: completeness, dependency correctness, component fit, verification coverage, scope creep, failure handling, and efficiency. The reviewer can delegate scouts to spot-check claims. The reviewer critiques only — it does not revise.

### 11. DAG Revision

The agent dispatches the design subagent again with the reviewer's critique. The designer must explicitly address every critique point with accept or reject plus reasoning. One revision round only — research shows additional rounds degrade quality at 9B-14B scale.

### 12. User Review

The agent presents a prose summary of the DAG to the user as a message, then asks for approval via the question tool (short question only — no long content in the question tool). If the user disapproves, the planner formulates structured questions to understand what needs changing, then sends feedback to the designer for final edits.

---

## Component Library

The library has 17 component types plus one hardcoded type. Component prompts are completely static. Every node of the same component type uses the identical prompt text, regardless of what the planner intended that node to accomplish.

**The planner's intent is expressed through the DAG's shape and the rationale stored in the semantic notes system, never through per-node prompt customization.**

### Core Components (8)

- **work-item** — any project mutation. The executor chooses the appropriate subagent (implementation or documentation) at runtime. The executor gives subagents goal-based tasks — "here's what needs to change and why" — not surgical editing instructions.
- **project-search-and-analysis** — any investigation. The executor chooses between wide-shallow (scout) or narrow-deep (insurgent) at runtime.
- **research** — external research via the research subagent behind the IP approval gate.
- **deep-research** — extended domain exploration. Usually explicitly user-requested. For broad exploration, not a single targeted query.
- **write-notes** — store accumulated findings to the semantic notes system.
- **compress** — reduce context via compression.
- **session-overview-refresher** — re-establish context after compression by querying the semantic notes system.
- **sequential-thinking** — pure reasoning step.

### Logic Components (5)

- **agentic-loop** — fully autonomous escape hatch. Delegates to a dedicated fully autonomous subagent with all tools. Must be explicitly user-approved. Never the default fallback.
- **decision-gate** — the executor assesses accumulated evidence from semantic notes and chooses a path. The DAG structure defines available paths.
- **user-decision-gate** — the user chooses a path.
- **plan-fail** — terminal failure. Preserves semantic notes for the next planning session. The default when a plan's capacity is exhausted.
- **plan-success** — terminal success.

### Verification and Operations (3)

- **verify** — delegates to the powerful step-limited subagent. The executor decides what verification means at each step.
- **run-project-commands** — delegates to the same powerful step-limited subagent. For shell operations, adding dependencies, running build scripts, configuring tools.
- **commit** — git checkpoint. Separate because it's a meaningful save point.

### General (1)

- **user-discussion** — free-form conversation with the user mid-execution.

### Hardcoded (1)

- **execution-kickoff** — hardcoded at the start of every execution DAG. See the Execution Architecture section for details.

---

## DAG Design Principles

**Err toward more nodes.** Extra capacity costs time but doesn't cause harm. Missing capacity causes failures that require replanning. When unsure whether a step is needed, include it.

**Investigation precedes implementation.** Place project-search-and-analysis nodes before work-item nodes.

**Verification follows implementation.** Every significant change should be followed by a verify node. Don't batch multiple changes before verification.

**Commit at meaningful checkpoints.** After a verified change is a natural commit point.

**Compression at context boundaries.** After investigation phases that produced substantial notes, compress before moving to implementation. The pattern is: write-notes → compress → session-overview-refresher.

**Branching for genuine alternatives.** Use decision-gate when the executor might need different paths based on what it discovers. Each branch must have enough nodes to handle its scenario independently.

**plan-fail as the default terminal.** If a branch represents failure, end it in plan-fail. Only include agentic-loop if the user explicitly approved fully autonomous work.

**The DAG is capacity, not prescription.** The planner provides enough structure for the work to succeed, not a script to follow. The executing agent may use nodes differently than the planner imagined, and that's fine — as long as the shape supports the work.

---

## DAG Tooling

### init_dag

Called by the planning agent as a required step during session naming, before delegating to DAG writing subagents. Creates the plan.jsonl file and initializes the DAG structure with the hardcoded execution-kickoff node. Takes the session name as the plan name.

The planning agent is the only agent that calls init_dag. DAG writing subagents never call it.

### add_node

Called by the DAG design subagent to add nodes to the DAG. Takes the plan name, node ID, parent node ID, and component type. The tool handles all file creation — it writes the node entry to plan.jsonl AND copies the static prompt template from the component library to the correct location. The design agent never touches the filesystem directly and never reads library prompts or node-spec files.

Node IDs must be descriptive strings that reflect the node's purpose (e.g., `work-fix-build`, `verify-auth-module`, `reason-approach`). Do not use generic IDs like `node-1` or `step-3`.

No custom prompt or todo parameters are passed to add_node. The tool copies static templates from the component library automatically. This is what enforces the static-prompt constraint.

### show_dag

Displays the DAG structure. Used by the execution-kickoff scout to understand the DAG, by the primary agent during kickoff to see what the scout is referring to, and by the DAG reviewer to see the structure being reviewed.

### Compact DAG

A simplified view of the DAG with a maximum node count, showing the overall process flow rather than every individual step. The compact DAG is what the user sees at review time and what the kickoff scout references for high-level orientation. The full DAG is what the executor actually follows.

### What agents must NOT do

Agents must never read library prompts, node-spec.json files, or the raw plan.jsonl directly. Since they do no filling in of the written prompts, they have no reason to read them. DAG interaction is entirely through the structured tools: init_dag, add_node, and show_dag.

---

## Execution Architecture

DAGs are shapes, not scripts. The planning agent determines work-type patterns with dependency constraints. The executing agent decides what fills each slot by querying the semantic notes system.

### Execution Kickoff

Every execution DAG begins with a hardcoded kickoff sequence:

1. The executor dispatches a scout that has access to the semantic notes system and show_dag. The scout retrieves everything from the planning session — findings, problem decomposition, user goal, scope boundaries, constraints, and the rationale for why the DAG was structured the way it was. The scout also calls show_dag to see the DAG structure.

2. From all of this, the scout produces a prose summary that includes both the planning context and its assessed task decomposition: what work it expects at each DAG node, mapped to the DAG's shape. This is task decomposition, not plan decomposition — the scout is figuring out what needs to be done at each step, not re-explaining the plan's structure.

3. After the scout returns, the primary agent calls show_dag itself so it can see the DAG the scout is referring to.

4. The agent reasons through the scout's task decomposition, stores its initial strategy to the semantic notes system, and begins execution.

### Node Execution Pattern

At each subsequent node, the executor retrieves relevant session knowledge from the semantic notes system to understand what has been accomplished and what work is needed at that step. The executor then reasons through what to do and delegates to the appropriate specialist subagent.

The executor re-gathers context fresh at every node. This is the intentional cost of the memory-is-forbidden principle — each re-gathering catches changes from previous nodes that a cached understanding would miss. The redundancy is the reliability.

### Fail Early, Plan Again

The default when a plan's capacity is exhausted is plan-fail, not agentic-loop. Failed sessions preserve their semantic notes. The next planning session starts from real execution experience because the notes from the failed session are available via the shared collection name.

---

## Subagent Roster

### Four Restricted Subagents (limited tool access)

**Context Scout** — wide-shallow explorer. Read-only. Uses Probe MCP for structural code intelligence. Returns prose briefings with uncertainty sections. No file trees, no line-number inventories — tables that explain relationships are fine, tables that list inventory are not. No bash access.

**Context Insurgent** — narrow-deep analyst. Read-only. Uses Probe MCP. Traces cross-file logic and synthesizes findings across many sources. No bash access.

**JuniorDev (Implementation Subagent)** — makes project changes based on goal-based tasks. Receives a goal and context, investigates what needs to change using Probe, and implements. Does not run tests or shell commands. Needs Probe access to understand the codebase when working on goal-based tasks.

**Documentation Expert** — writes and modifies documentation, config files, and prompt files. No bash access.

### One Powerful Subagent (step-limited, nearly full tool access)

**Tailwrench** — shared by verify and run-project-commands nodes. Hard step count enforced in the agent configuration. This is the agent most likely to go off the rails without a step limit because it has the most capabilities.

### One Fully Autonomous Subagent (all tools, user-gated)

For the agentic-loop component only. Must be explicitly user-approved. Not the default.

### Two Specialized Planning Subagents

**DAG Design Subagent** — access to `add_node`, the component catalogue tool, the design guide tool, semantic notes, step-by-step reasoning, and delegation to scouts and insurgents. No general file access. No init_dag (only the planning agent calls that). No access to library prompts or node-spec files. The node-writing tool handles all file output.

**DAG Review Subagent** — access to show_dag, the component catalogue tool, the design guide tool, semantic notes, step-by-step reasoning, and delegation to scouts. No write access of any kind. Reads and critiques only.

---

## The Delegation Pattern

Agents do not receive template prompts with pre-filled placeholders. Instead:

1. The agent loads a delegation skill for the target subagent type.
2. The agent reasons through the delegation using step-by-step thinking, considering what context the subagent needs and what a good prompt looks like.
3. The agent writes its own delegation prompt informed by the skill.
4. The agent dispatches the subagent with what it wrote.

Skills and agent prompts are written once and never change. The delegation skill teaches methodology; the agent's reasoning fills in specifics at runtime. This eliminates token waste from massive template prompts and produces tailored delegations.

---

## DAG Design Semi-Council

The DAG design process uses a structured semi-council pattern, not a multi-agent debate:

1. **Designer** — a specialized subagent with constrained permissions builds the DAG using add_node. Operates in an unstructured session with investigation powers (can delegate to scouts and insurgents). Retrieves planning context from semantic notes.

2. **Reviewer** — a separate specialized subagent evaluates the DAG against a structured 7-item checklist. Never saw the designer's reasoning process — only the output via show_dag. Can delegate scouts to spot-check claims. Critiques only, does not revise.

3. **Revision** — the designer is dispatched again with the reviewer's critique. Must address every critique point explicitly. One round only.

4. **User approval** — the planning agent presents the DAG summary as a message, then asks for approval via the question tool.

**The reviewer never communicates directly with the designer.** The planning agent mediates. This prevents the lazy agent problem where one agent dominates and the other defers.

**One review-revision cycle only.** Research shows additional rounds degrade quality at 9B-14B scale.

---

## Review Checklist

The DAG reviewer evaluates against these seven items:

1. **Completeness** — does the DAG cover all work required to achieve the stated goal?
2. **Dependency correctness** — are nodes ordered sensibly? Does each node have the inputs it needs from prior nodes?
3. **Component fit** — does each node use the right component type for its purpose?
4. **Verification coverage** — is every significant change followed by verification?
5. **Scope creep** — does the DAG stay within the stated scope?
6. **Failure handling** — do unresolved paths end in plan-fail, not autonomous loops?
7. **Efficiency** — are there unnecessary nodes or steps that could be combined?

---

## Prompt Engineering Principles

**Positive framing except in good/bad examples.** Rules use imperative verbs. Good/bad examples are the only place negative framing appears, and they encode structure and concepts, not domain content.

**Reasoning blocks use "consider" framing.** Questions that invite exploration, not "address each question as a separate thought" which produces mechanical one-thought-per-question responses.

**Constrain what agents can do, not how they think.** Tool permissions and DAG blocking handle constraints. Prompts handle reasoning guidance.

**Node prompts describe tool actions in plain English.** Say "Call the step-by-step reasoning tool" not just a tool identifier.

**Skill loading is a required action.** Not exempt from DAG blocking. The agent must explicitly call the skill tool as part of its todo list.

**Step instructions are injected as user messages, not tool returns.** This eliminates the problem of agents stopping after tool calls and needing a nudge to continue.

**Todo lists use plain English with tool names in backticks where needed.**

**The sequential-thinking skill must include anti-patterns:** single thoughts covering everything, planning investigation without doing it, empty filler thoughts, and locking in the total thought count too early.

**The question tool never contains long content.** Present proposals and summaries as a message first, then call the question tool with a short question only.

**Prose-only scout outputs.** Tables that explain relationships are fine. Tables that list inventory are not. No file trees, no line-number inventories, no raw data dumps.

---

## MCP Tooling

The following MCP servers are configured and locked. No additions or removals without explicit decision.

**Probe** (probelabs/probe) — structural code intelligence. Ripgrep + tree-sitter. Zero setup, no indexing. Used by scouts, insurgents, and the implementation subagent for codebase investigation.

**SearXNG** (mcp-searxng) — self-hosted web search. Requires a running SearXNG instance. Used by the external research subagent. Behind the IP approval gate.

**Qdrant** (mcp-server-qdrant) — semantic session notes. Local embedded mode, local embeddings via FastEmbed. Used by all agents for storing and retrieving session knowledge. Session-scoped via collection names.

**Sequential Thinking** (@modelcontextprotocol/server-sequential-thinking) — step-by-step reasoning tool. Used by all agents that need to reason through problems incrementally.

---

## Locked Constraints

These constraints are not subject to change:

- **The DAG enforcement engine** — plugin logic, tool blocking behavior, and the enforcement mechanism itself.
- **The agent roster** — which agents exist and their roles. Their prompts, permissions, and step limits can change, but the set of agents is fixed.
- **MCP server configuration** — the set of MCP servers listed above.
- **Static component prompts** — every node of the same type uses the identical prompt. No per-node customization. The planner's intent is expressed through DAG shape and rationale, never through prompt content.
- **Semantic notes as sole persistent record** — no markdown notes files. Qdrant is the only persistence mechanism.
- **Memory is forbidden** — agents regather fresh context every time. Notes are session-scoped communication, not cross-session memory.
- **One review-revision cycle** — no additional rounds.
- **Plan-fail as default terminal** — not agentic-loop.
- **Goal-based work-item tasks** — not surgical editing instructions.
- **IP approval gate for external research** — user must approve before dispatch.
- **init_dag called only by planning agent** — DAG writing subagents only use add_node.
- **Agents never read library prompts or node-spec files** — all DAG interaction is through structured tools.

---

## What Can Change

- Planning DAG structure (phase ordering, adding/removing phases)
- Agent prompts, permissions, and step limits
- Skill file content
- Component library node prompts (the static templates)
- DAG design guide content
- Component catalogue content
- Delegation skill content
- Prompt engineering patterns and framing
