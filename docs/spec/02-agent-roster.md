# Agent Roster and Permissions

Every agent in the system is defined as an agent file with YAML frontmatter specifying its tool permissions, step limit, and mode. **Permissions are exhaustive — everything not explicitly permitted is denied.** The permission system is enforced by the OpenCode framework independently of the DAG enforcement engine (see doc 03).

`todowrite` is denied to all agents. It is an OpenCode built-in todo list tool that interferes with how subagent responses are presented to the primary agent, and the DAG system handles all task sequencing more effectively than a todo list.

`grepai_grepai_list_projects` and `grepai_grepai_list_workspaces` are denied to all agents. The system operates within a single project; cross-project access is not permitted.

Agents that have `qdrant_qdrant-store` and `qdrant_qdrant-find` in their permission list have persistent access to the current plan's Qdrant collection through their tool permissions. For headwrench executing DAG nodes, these tools are globally exempt from DAG enforcement and can be called at any time. For subagents dispatched via the `task` tool, Qdrant access is available through their agent permissions (DAG enforcement does not apply to subagents). **Agents' system prompts do not instruct them to use Qdrant** — that instruction comes from dispatch prompts written by the dispatching agent (typically headwrench or a planning subagent). The reason: agents can be used in free-form mode outside DAG sessions where Qdrant is irrelevant. Tool availability and usage instruction are separate concerns.

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
- `grepai_grepai_index_status` — index health check
- `sequential-thinking_sequentialthinking`
- `qdrant_qdrant-store`, `qdrant_qdrant-find`
- `skill`

**Skills:** sequential-thinking, qdrant-notes, grepai

**Denied:** `read`, `write`, `edit`, `grep`, `bash`, `task`, `question`, `compress`, all DAG tools, all web tools, all GrepAI trace tools (`grepai_grepai_trace_callees`, `grepai_grepai_trace_callers`, `grepai_grepai_trace_graph`), all GrepAI RPG tools, `grepai_grepai_list_projects`, `grepai_grepai_list_workspaces`, `grepai_grepai_stats`, `todowrite`

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

**Role:** Builds execution DAGs from the component library. Adds nodes one by one using `add_node`, validates structure, and may delegate to scouts or insurgents for codebase investigation during design.

**Tools:**
- `add_node`, `delete_node`, `modify_node` — DAG construction and modification
- `show_dag`, `show_compact_dag` — view the DAG being built
- `validate_dag` — check structural validity
- `get_planning_components_catalogue`, `get_dag_design_guide` — reference materials
- `task` — delegation to context-scout and context-insurgent only
- `grepai_grepai_search` — semantic code search
- `grepai_grepai_index_status` — index health check
- `sequential-thinking_sequentialthinking`
- `qdrant_qdrant-store`, `qdrant_qdrant-find`
- `skill`

**Skills:** context-scout-delegation, context-insurgent-delegation, sequential-thinking, qdrant-notes, grepai

**Denied:** `init_dag`, `present_compact_dag_to_user`, `choose_plan_name`, `plan_session`, `next_step`, `recover_context`, `read`, `write`, `edit`, `glob`, `grep`, `bash`, `question`, `compress`, all web tools, all GrepAI trace tools (`grepai_grepai_trace_callees`, `grepai_grepai_trace_callers`, `grepai_grepai_trace_graph`), all GrepAI RPG tools, `grepai_grepai_list_projects`, `grepai_grepai_list_workspaces`, `grepai_grepai_stats`, `todowrite`

**Step limit:** None. DAG design complexity varies with task scope — a simple plan and a complex multi-phase plan require fundamentally different amounts of work.

---

### dag-reviewer

**Role:** Evaluates execution DAGs against the review criteria. Critiques only — does not revise. Can delegate to context-scout for spot-checking specific areas of the codebase against DAG assumptions.

**Tools:**
- `show_dag`, `show_compact_dag` — view the DAG being reviewed
- `validate_dag` — check structural validity
- `get_planning_components_catalogue`, `get_dag_design_guide` — reference materials (design guide for understanding design intent during spot-checking)
- `task` — delegation to context-scout only
- `grepai_grepai_search` — semantic search for spot-checking
- `sequential-thinking_sequentialthinking`
- `qdrant_qdrant-store`, `qdrant_qdrant-find`
- `skill`

**Skills:** context-scout-delegation, sequential-thinking, qdrant-notes, grepai

**Denied:** `add_node`, `delete_node`, `modify_node`, `init_dag`, `present_compact_dag_to_user`, `choose_plan_name`, `plan_session`, `next_step`, `recover_context`, `read`, `write`, `edit`, `glob`, `grep`, `bash`, `question`, `compress`, all web tools, all GrepAI trace tools, all GrepAI RPG tools, `grepai_grepai_list_projects`, `grepai_grepai_list_workspaces`, `grepai_grepai_stats`, `todowrite`

**Step limit:** None. Review depth scales with plan complexity — a reviewer must be free to trace as many nodes and check as many codebase areas as the plan requires.

---
