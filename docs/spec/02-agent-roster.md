# Agent Roster and Permissions

Every agent in the system is defined as an agent file with YAML frontmatter specifying its tool permissions, step limit, and mode. **Permissions are exhaustive — everything not explicitly permitted is denied.** The permission system is enforced by the OpenCode framework independently of the DAG enforcement engine (see doc 03).

---

## Agent YAML Schema

Every agent file contains a YAML frontmatter block with the following fields:

```yaml
name: <string>                          # Human-readable agent name
description: <string>                   # Brief description of the agent's role
mode: <subagent | primary>              # "subagent" for restricted agents, "primary" for headwrench
model: <string>                         # Model identifier (deployment-dependent; not in spec)
temperature: <float>                    # Temperature for model inference (0.0–2.0)
color: <hex-color>                      # Hex color code for UI (e.g., "#818cf8")
permission:
  "*": <allow | deny>                   # Default permission for unlisted tools
  <tool-name>: <allow | deny>           # Explicit grant or denial for specific tools
skills:
  "*": <allow | deny>                   # Default permission for skills
  <skill-name>: <allow | deny>           # Explicit grant or denial for specific skills
  (optional block if no skills needed)
step_limit: <integer | null>            # Max conversation steps (null for unlimited)
```

**Key principles:**
- Permissions use an allowlist model: everything not explicitly permitted is denied.
- The `permission` block controls tool access. Each tool name is an exact callable identifier.
- The `skills` block controls which skills can be loaded. If omitted, the agent cannot load skills.
- `temperature` affects model behavior. See "Temperature Tuning" below.
- `color` is a UI affordance and does not affect system behavior.

---

## Temperature Tuning

Temperature values are calibrated for two distinct agent roles:

**Tool-calling agents (temperature: 0.6):** Agents that make frequent file edits, bash calls, or DAG tool calls benefit from higher determinism of tool-call syntax. These include:
- headwrench (primary agent, orchestrates all tool calls)
- junior-dev (makes file edits constantly)
- documentation-expert (reads and writes files)
- tailwrench (bash and git operations)
- autonomous-agent (full tool access)
- dag-designer (DAG construction tools)
- dag-reviewer (DAG inspection tools)
- external-scout (web research tools with structured parameters)

**Analysis-only agents (temperature: 0.2):** Agents that perform read-only investigation benefit from lower temperature to reduce hallucination and false positives:
- context-scout (semantic search and file discovery)
- context-insurgent (deep analysis and cross-file tracing)

The 0.6 → 0.2 difference reflects research findings from small-model tool-calling: higher temperature improves syntax reliability in structured calls, while lower temperature reduces hallucination in analysis tasks. This is not a general best-practice recommendation — it reflects the specific characteristics of the CodeAccelerate system's tool mix.

---

## Color Assignments

Each agent has a UI color for differentiation in multi-agent contexts:

| Agent | Color | Rationale |
|-------|-------|-----------|
| headwrench | (no specific color — primary agent) | — |
| context-scout | #6366f1 (indigo) | Investigation role |
| context-insurgent | #f59e0b (amber) | Deep analysis role |
| junior-dev | #10b981 (emerald) | Implementation/code changes |
| documentation-expert | #8b5cf6 (violet) | Documentation specialization |
| external-scout | #f43f5e (rose) | External research (distinct from context-scout's indigo) |
| tailwrench | #ec4899 (pink) | Verification and operations |
| autonomous-agent | #6366f1 (indigo, inherited) | Matches junior-dev class |
| dag-designer | #06b6d4 (cyan) | DAG construction specialization |
| dag-reviewer | #06b6d4 (cyan, shared with dag-designer) | DAG review specialization |

Colors were chosen to avoid collisions while grouping related agent types (context-scouts in cool tones, implementers in warm tones, specialists in distinct colors). The system is not color-dependent — colors are UI affordances only.

---

`todowrite` is denied to all agents. It is an OpenCode built-in todo list tool that interferes with how subagent responses are presented to the primary agent, and the DAG system handles all task sequencing more effectively than a todo list.

`grepai_grepai_list_projects` and `grepai_grepai_list_workspaces` are denied to all agents. The system operates within a single project; cross-project access is not permitted.

**Qdrant grants are intentional.** Agents listed in the tool reference below with `qdrant_qdrant-store` and `qdrant_qdrant-find` in their permission list have persistent access to the current plan's Qdrant collection. For headwrench executing DAG nodes, these tools are globally exempt from DAG enforcement and can be called at any time. For subagents dispatched via the `task` tool, Qdrant access is available through their agent permissions (DAG enforcement does not apply to subagents). **Agents' system prompts do not instruct them to use Qdrant** — that instruction comes from dispatch prompts written by the dispatching agent (typically headwrench or a planning subagent). The reason: agents can be used in free-form mode outside DAG sessions where Qdrant is irrelevant. Tool availability and usage instruction are separate concerns.

Agents that have access to both GrepAI tools and file operation tools (`read`, `glob`, `grep`) must use GrepAI tools first for any project search or file discovery. File operation tools are a fallback for cases where GrepAI cannot satisfy the need — for example, reading a specific file at a known path after GrepAI has identified it, or writing and editing files. This applies to headwrench, junior-dev, documentation-expert, and tailwrench. Context-scout has GrepAI search plus `glob` for file discovery. Context-insurgent has GrepAI search, GrepAI trace tools, plus `read`, `glob`, and `grep` for direct file access when needed.

---

## Primary Agent

### headwrench

**Role:** The primary agent. Runs all planning and execution DAG flows. Enters DAG mode when the `/plan-session` slash command is invoked (which calls the `plan_session` tool) or when the `/activate-plan` slash command is invoked (which calls the `activate_plan` tool).

**Tools:** All framework tools, all MCP tools, all file operation tools (`read`, `write`, `edit`, `glob`, `grep`, `bash`). Except: `grepai_grepai_list_projects`, `grepai_grepai_list_workspaces`, `todowrite`.

**Skills:** All skills.

**Step limit:** None.

---

## Restricted Subagents

These agents are dispatched via the `task` tool. Each has a purpose-specific, minimal tool set.

---

### context-scout

**Role:** Wide-shallow project exploration. Surveys what exists, how parts relate, and what is unclear. Returns prose briefings with uncertainties sections. Does not make changes.

**Tools:**
- `glob` — file discovery
- `grepai_grepai_search` — semantic code search
- `grepai_grepai_trace_callees`, `grepai_grepai_trace_callers`, `grepai_grepai_trace_graph` — high-level call tracing to understand cross-module relationships
- `grepai_grepai_index_status` — index health check
- `sequential-thinking_sequentialthinking`
- `qdrant_qdrant-store`, `qdrant_qdrant-find`
- `skill`

**Skills:** sequential-thinking, qdrant-notes, grepai

**Denied:** `read`, `write`, `edit`, `grep`, `bash`, `task`, `question`, `compress`, all DAG tools, all web tools, all GrepAI RPG tools (`grepai_grepai_rpg_explore`, `grepai_grepai_rpg_search`, `grepai_grepai_rpg_fetch`), `grepai_grepai_list_projects`, `grepai_grepai_list_workspaces`, `grepai_grepai_stats`, `todowrite`

**Note on GrepAI trace tools:** Context-scout has access to the call-tracing tools (`grepai_grepai_trace_callees`, `grepai_grepai_trace_callers`, `grepai_grepai_trace_graph`) as a deliberate grant — these are different from the deep structural analysis tools (RPG tools) which remain denied. The trace tools help the scout understand which functions call which others across modules, which is valuable for wide-shallow "what relates to what" investigation. This grant is intentional and supports the scout's role.

**Step limit:** 20. Context-scout must stay quick and shallow — it surveys, it does not investigate.

---

### context-insurgent

**Role:** Narrow-deep analysis. Traces cross-file logic, audits constraints, synthesizes findings across many sources. Returns detailed analytical reports. Does not make changes.

**Tools:** Same as context-scout, plus:
- `read`, `glob`, `grep` — direct file access
- `grepai_grepai_trace_callees`, `grepai_grepai_trace_callers`, `grepai_grepai_trace_graph` — call chain and dependency tracing

**Skills:** sequential-thinking, qdrant-notes, grepai

**Denied:** `write`, `edit`, `bash`, `task`, `question`, `compress`, all DAG tools, all web tools, all GrepAI RPG tools, `grepai_grepai_list_projects`, `grepai_grepai_list_workspaces`, `grepai_grepai_stats`, `todowrite`

**Step limit:** None. Insurgent work involves tracing cross-file logic chains and synthesizing findings across many sources — depth cannot be bounded arbitrarily.

---

### junior-dev

**Role:** Goal-oriented implementer. Investigates the codebase to understand context, then makes targeted changes to achieve the stated goal.

**Tools:**
- `read`, `write`, `edit`, `glob`, `grep` — file operations
- `grepai_grepai_search` — semantic code search
- `grepai_grepai_trace_callees`, `grepai_grepai_trace_callers`, `grepai_grepai_trace_graph` — understanding code before changing it
- `grepai_grepai_index_status` — index health check
- `sequential-thinking_sequentialthinking`
- `skill`

**Skills:** sequential-thinking, grepai

**Denied:** `bash`, `task`, `question`, `compress`, `qdrant_qdrant-store`, `qdrant_qdrant-find`, all DAG tools, all web tools, GrepAI RPG tools (`grepai_grepai_rpg_explore`, `grepai_grepai_rpg_search`, `grepai_grepai_rpg_fetch`), `grepai_grepai_list_projects`, `grepai_grepai_list_workspaces`, `grepai_grepai_stats`, `todowrite`

**Step limit:** 50. Junior-dev edits code — bounding it prevents autonomous drift beyond the stated task.

---

### documentation-expert

**Role:** Writes and modifies documentation, config files, and prompt files.

**Tools:**
- `read`, `write`, `edit`, `glob`, `grep` — file operations
- `grepai_grepai_search` — semantic search for finding relevant docs
- `grepai_grepai_index_status` — index health check
- `sequential-thinking_sequentialthinking`
- `skill`

**Skills:** sequential-thinking, grepai

**Denied:** `bash`, `task`, `question`, `compress`, `qdrant_qdrant-store`, `qdrant_qdrant-find`, all DAG tools, all web tools, all GrepAI trace tools, all GrepAI RPG tools, `grepai_grepai_list_projects`, `grepai_grepai_list_workspaces`, `grepai_grepai_stats`, `todowrite`

**Step limit:** None. Documentation tasks require reading broadly across a project before writing — depth cannot be bounded without risking incomplete output.

---

### external-scout

**Role:** External research agent. Searches public sources and reads web content. No access to project files.

**Tools:**
- `searxng_searxng_web_search` — web search
- `searxng_web_url_read` — read and parse content from a URL
- `context7_resolve-library-id`, `context7_query-docs` — documentation research
- `sequential-thinking_sequentialthinking`
- `skill`

**Skills:** sequential-thinking

**Denied:** All file operation tools, `bash`, `task`, `question`, `compress`, `qdrant_qdrant-store`, `qdrant_qdrant-find`, all DAG tools, all GrepAI tools, `todowrite`

**Step limit:** None. External-scout is sometimes tasked with deep multi-source research — the depth of the task determines how long it runs.

---

## Powerful Subagent

### tailwrench

**Role:** Powerful operator for verification, shell operations, and git. Used for `verify`, `run-project-commands`, and `commit` component nodes. Step-limited to force compact, focused work — dispatch prompts must be specific.

**Tools:**
- `bash` — shell access
- `read`, `write`, `edit`, `glob`, `grep` — file operations
- `grepai_grepai_search` — semantic search
- `grepai_grepai_trace_callees`, `grepai_grepai_trace_callers`, `grepai_grepai_trace_graph` — code understanding for verification
- `grepai_grepai_index_status` — index health check
- `sequential-thinking_sequentialthinking`
- `qdrant_qdrant-store`, `qdrant_qdrant-find`
- `skill`

**Skills:** sequential-thinking, qdrant-notes, grepai

**Denied:** `task`, `question`, `compress`, all DAG tools, all web tools, all GrepAI RPG tools, `grepai_grepai_list_projects`, `grepai_grepai_list_workspaces`, `grepai_grepai_stats`, `todowrite`

**Step limit:** 30

---

## Fully Autonomous Subagent

### autonomous-agent

**Role:** Fully autonomous execution with no tool restrictions or step limits. Used only by the `autonomous-work` component. This component may only appear in a DAG if the user explicitly approved autonomous work during planning. DAG designers must never include this component without explicit user approval — it bypasses all the safety constraints the framework provides.

**Tools:** All tools allowed.

**Skills:** All skills.

**Step limit:** None.

---

## Specialized Planning Subagents

These are distinct agent files with their own permissions. They are not constrained modes of HeadWrench — they are separate agents dispatched during planning phases.

---

### dag-designer

**Role:** Builds execution DAGs from the component library. Adds nodes one by one using `add_node`, validates structure, and investigates the codebase directly to inform design decisions.

**Tools:**
- `add_node`, `delete_node`, `modify_node` — DAG construction and modification
- `show_dag`, `show_compact_dag`, `present_compact_dag_to_user` — view and present the DAG being built
- `validate_dag` — check structural validity
- `get_planning_components_catalogue`, `get_dag_design_guide` — reference materials
- `read`, `glob`, `grep` — direct file access for codebase investigation
- `grepai_grepai_search` — semantic code search
- `grepai_grepai_trace_callees`, `grepai_grepai_trace_callers`, `grepai_grepai_trace_graph` — call chain and dependency tracing
- `grepai_grepai_index_status` — index health check
- `sequential-thinking_sequentialthinking`
- `qdrant_qdrant-store`, `qdrant_qdrant-find`
- `skill`

**Skills:** sequential-thinking, qdrant-notes, grepai, dag-design

**Denied:** `init_dag`, `choose_plan_name`, `plan_session`, `next_step`, `recover_context`, `task`, `write`, `edit`, `bash`, `question`, `compress`, all web tools, all GrepAI RPG tools, `grepai_grepai_list_projects`, `grepai_grepai_list_workspaces`, `grepai_grepai_stats`, `todowrite`

**Step limit:** None. DAG design complexity varies with task scope — a simple plan and a complex multi-phase plan require fundamentally different amounts of work.

---

### dag-reviewer

**Role:** Evaluates execution DAGs against the review criteria. Critiques only — does not revise. Investigates the codebase directly to spot-check design assumptions.

**Tools:**
- `show_dag`, `show_compact_dag` — view the DAG being reviewed
- `validate_dag` — check structural validity
- `get_planning_components_catalogue`, `get_dag_design_guide` — reference materials
- `read`, `glob`, `grep` — direct file access for spot-checking codebase assumptions
- `grepai_grepai_search` — semantic search for spot-checking
- `grepai_grepai_trace_callees`, `grepai_grepai_trace_callers`, `grepai_grepai_trace_graph` — call chain and dependency tracing
- `grepai_grepai_index_status` — index health check
- `sequential-thinking_sequentialthinking`
- `qdrant_qdrant-store`, `qdrant_qdrant-find`
- `skill`

**Skills:** sequential-thinking, qdrant-notes, grepai, dag-review

**Denied:** `add_node`, `delete_node`, `modify_node`, `init_dag`, `present_compact_dag_to_user`, `choose_plan_name`, `plan_session`, `next_step`, `recover_context`, `task`, `write`, `edit`, `bash`, `question`, `compress`, all web tools, all GrepAI RPG tools, `grepai_grepai_list_projects`, `grepai_grepai_list_workspaces`, `grepai_grepai_stats`, `todowrite`

**Step limit:** None. Review depth scales with plan complexity — a reviewer must be free to trace as many nodes and check as many codebase areas as the plan requires.

---
