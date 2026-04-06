# CodeAccelerate: System Overview

This document is the entry point for the CodeAccelerate specification. It describes the system's purpose, its major components, and the order in which the remaining documents should be read.

---

## What This System Is

CodeAccelerate is a multi-agent DAG orchestration framework built on OpenCode. It structures AI-assisted software work into explicit, reviewable plans — directed acyclic graphs of nodes — where each node is a bounded unit of work with an enforced tool sequence. The system prevents common small-model failure modes (skipping investigation, implementing without reasoning, proceeding without confirmation) by making the correct sequence of operations a structural constraint rather than a prompt suggestion.

The system has two phases:

1. **Planning.** The user invokes the `/plan-session` slash command. The command expands to a prose instruction that HeadWrench reads and acts on by calling the `plan_session` tool, which starts the session. HeadWrench then runs a fixed 14-node planning workflow that investigates the project, asks the user questions, and produces an execution DAG tailored to the task. The DAG is reviewed, revised, and approved before planning ends.

2. **Execution.** The user invokes the `/activate-plan <plan_name>` slash command. The command expands to a prose instruction that HeadWrench reads and acts on by calling the `activate_plan` tool, which begins execution. HeadWrench runs the execution DAG node by node. Each node dispatches subagents or performs reasoning steps as defined by its component type. The DAG handles branching, compression, and failure paths.

---

## Minimum Viable Model Target

This system was designed from the ground up to function on small models. The minimum viable target is **Qwen 3.5 9B** (or equivalent capability at that parameter scale). Every design decision in this spec — enforcement sequences, prose-based prompts, explicit tool naming, GrepAI-first search, skill-based methodology teaching, semantic notes for cross-node memory — exists because it measurably improves small model reliability.

This does not mean large models are unwanted. Frontier models run the system better. But the spec does not assume frontier capability, and no design decision requires it. When a choice exists between an approach that works well on large models and one that works well on both large and small models, this spec always chooses the latter.

**Practical implication for prompt authors and implementers:** If a design choice would only work reliably on a frontier model, it is wrong for this system. Prompts must be explicit. Methodology must be taught, not assumed. Structure must be enforced, not trusted. The system's robustness on small models is not a constraint to work around — it is the goal.

**Model assignment is not defined in agent files.** Which model runs each agent is a profile-level configuration choice made outside the spec. Profiles (such as frontier/Sonnet, frontier/Haiku, Ollama, and others) determine model assignment at runtime. The spec is model-agnostic at the agent level; the minimum viable target governs design intent only.

---

## Major Components

### The DAG Enforcement Engine
A plugin that constrains tool access when headwrench is executing DAG nodes. Every node has an enforcement sequence — an ordered list of tools that must be called. The engine blocks non-exempt tools until their prerequisites are satisfied. This is the primary mechanism for ensuring headwrench follows the intended workflow. Subagents dispatched via the `task` tool do not run under DAG enforcement and are governed only by their agent permissions.

### The Planning-Enforcement Plugin
Our plugin. Provides the DAG tooling (`next_step`, `recover_context`, `init_dag`, `add_node`, and others), activates planning and execution sessions, performs template variable substitution in node prompts, and runs the enforcement engine.

### The Component Library
A catalog of reusable node types. Each component has a fixed enforcement sequence and a static prompt template. Execution DAGs are assembled from these components by the dag-designer subagent during planning. Component prompts cannot be customized at design time — customization happens through the goal-based dispatch prompts written by the executing agent at runtime.

### The Semantic Notes System
Qdrant, running locally with FastEmbed. Session notes are stored in a collection named after the plan (`{plan_name}`). Both the planning agent and the executing agent read and write to this same collection. This is the primary communication channel between nodes — each node writes what it learned and reads what prior nodes discovered.

### Subagents
Restricted agent instances with purpose-specific tool sets. The primary agent (HeadWrench) delegates bounded tasks to subagents. Subagents cannot call DAG tools, cannot chain further delegations (except where explicitly permitted), and operate within step limits that force compact, focused work.

---

## File System Layout

The plugin stores all session data under `.opencode/session-plans/`:

```
.opencode/session-plans/
  planning-session_{id}/        ← planning DAG (one per /plan-session invocation)
    plan.jsonl                  ← DAG node definitions
    prompts/
      {node-id}.md              ← one prompt file per node
  {plan_name}/                  ← execution DAG (written by dag-designer during planning)
    plan.jsonl
    prompts/
      {node-id}.md
```

`{id}` is the OpenCode session ID, auto-generated by the framework.  
`{plan_name}` is chosen by HeadWrench during planning Node 1 via `choose_plan_name`.

---

## Template Variables

One template variable appears in planning DAG node prompts and is substituted automatically by the plugin:

**`{{PLAN_NAME}}`**  
Value: the name chosen by the agent via `choose_plan_name` (e.g., `fix-auth-flow`).  
Set: when the agent calls `choose_plan_name` during planning Node 1. All remaining planning DAG prompts are updated immediately. Execution DAG prompts receive this substitution when HeadWrench calls `activate_plan` in response to the `/activate-plan` slash command.  
Use: identifies the execution DAG directory and the Qdrant collection. Agents do not need to track this value — it appears in every subsequent prompt.

---

## The Qdrant Collection Lifecycle

The Qdrant collection is named `{plan_name}`. It is created implicitly on the first `qdrant_qdrant-store` call during planning. The same collection is used throughout execution. There is no separate cross-session mechanism — planning and execution share a single collection because both phases use the same plan name.

This means executing agents have direct access to all planning findings, decisions, and rationale. Planning agents write findings as they discover them. The execution-kickoff node retrieves this context as its first substantive action.

---

## Deployment Prerequisites

### reasoningEffort: none

The system requires OpenCode's `reasoningEffort` setting to be configured as `none` at deployment time. This setting disables the framework's internal extended-reasoning features (such as Claude's thinking blocks or o1-style reasoning). 

**Why this is required:** The CodeAccelerate system implements its own reasoning layer using the `sequential-thinking_sequentialthinking` tool. When OpenCode's extended reasoning is active, it can interfere with DAG enforcement and produces redundant reasoning paths that conflict with the framework's structured sequential-thinking model. Disabling it ensures that reasoning happens only through the framework's tools where it can be enforced and integrated into the DAG structure.

**What happens if this is not set:** The system degrades unpredictably. The framework's tool enforcement may be bypassed, reasoning may occur outside the DAG structure where it cannot be captured to semantic notes, and execution traces become difficult to follow and audit.

### DAG_EXECUTOR_MODE

During execution (when HeadWrench calls `activate_plan`), the plugin injects `DAG_EXECUTOR_MODE` into the execution environment. This flag is set to `true` during DAG execution and `false` (or unset) otherwise. It serves as a signal to agents that they are currently operating within a DAG-enforced context where tool sequences are structural constraints, not suggestions.

**When it is set:** At the moment `activate_plan` is called and remains set until `next_step` reaches a terminal node and execution completes.

**Purpose:** Some agents (particularly headwrench in certain contexts) may need to distinguish between DAG-constrained execution and free-form work. This flag allows conditional behavior — for example, loading the `following-plans` skill automatically in DAG mode but not in free-form mode.

---

## Skill Loading and Recency Principle

Skills are loaded into the agent's recent context, where attention is highest on small models. This means that skill content — detailed tool-call guidance, methodology, examples, anti-patterns — receives more attention than system prompt content. 

For details on how skill-loading is distributed across planning and execution DAGs (which nodes load which skills explicitly), see the "Skill-Loading Architecture" section in **doc 05**. For prompt engineering guidance on skill structure and content, see **doc 08**.

---

## Design Principles and Runtime Documentation

The DAG design principles and patterns for building effective execution DAGs live in a runtime document, the **dag-design-guide**. This guide is not part of the specification — it is returned by the `get_dag_design_guide` tool at runtime and can evolve as design patterns emerge.

The specification documents the structure, components, and enforcement mechanisms of the system. The design guide documents principles for *using* those mechanisms effectively. Implementers should read both: the spec to understand what the system does, the guide to understand how to build good DAGs with it.

---

## Reading Order

An implementer encountering this system for the first time should read documents in this order:

| # | Document | Why read it here |
|---|---|---|
| 00 | **System Overview** (this document) | Orient to the whole system |
| 01 | **Tooling Reference** | Understand what tools exist before anything else references them |
| 02 | **Agent Roster and Permissions** | Understand who the agents are and what they can do |
| 03 | **DAG Enforcement Engine** | Understand how tool sequences are enforced |
| 04 | **Delegation Pattern and Skills** | Understand how agents dispatch subagents |
| 05 | **Planning DAG** | Understand the planning workflow end-to-end |
| 06 | **Execution Architecture** | Understand how execution DAGs run |
| 07 | **Component Library** | Understand the building blocks of execution DAGs |
| 08 | **Prompt Engineering** | Understand how node prompts and agent prompts are written |

Documents 01 and 02 are reference documents — they are dense with definitions. Documents 03–08 are architectural documents — they describe how the pieces work together. It is normal to read 03–08 first for conceptual orientation and then return to 01–02 for implementation detail.

---

## What This Spec Does Not Cover

- The OpenCode framework itself (agent files, YAML frontmatter, session management). The spec assumes OpenCode is understood.
- The DCP plugin (`compress` tool). DCP is an external plugin not managed by this system. The spec notes where `compress` appears in enforcement sequences but does not define it.
- The content of the DAG design guide (returned by `get_dag_design_guide` at runtime). This is a runtime document, not a spec document. See the "Design Principles and Runtime Documentation" section above for why.
- The content of skill files. Skills are described by category and purpose; their internal content is outside spec scope. See **doc 08** for skill structure and design principles.
- Cross-project Qdrant access. `grepai_grepai_list_projects` and `grepai_grepai_list_workspaces` are denied to all agents. The system operates within a single project.
- Small-model optimization strategies beyond their role in design decisions. For comprehensive guidance on small-model prompt engineering, tool-sequencing design, and optimization principles that shaped this spec, see **doc 08: Prompt Engineering**.
