# Tooling Reference

This document defines every tool used by the CodeAccelerate system. Tools are grouped by provider. An implementer building this system must implement or configure every tool listed here. Tool names listed here are the exact callable identifiers used in enforcement sequences and agent permission lists.

---

## OpenCode Built-in Tools

These tools are provided by the OpenCode framework. They are assumed to exist. This spec does not define their implementation — only their expected behavior as it pertains to this system.

### skill
Loads a skill file into the agent's context window. Skills are markdown documents that teach methodology. The skill content is injected as a system message visible to the agent.

**Used in:** enforcement sequences (positional requirement), agent permission lists.  
**Not denied to any agent** (all agents may load skills).

### task
Dispatches a subagent. The calling agent provides a `subagent_type` (matching an agent file name) and a prompt string. The subagent runs to completion and returns a single response message.

**Used in:** enforcement sequences (positional requirement), delegation flows.

### question
Asks the user a question and waits for a response. The calling agent provides question text; the user's answer is returned as the tool result.

**Used in:** enforcement sequences (positional requirement), user-facing flows.

---

## DCP Plugin Tool

The DCP plugin is an external plugin not managed by this system. It provides one tool used in enforcement sequences.

### compress
Compresses a range of the conversation context into a dense summary, replacing the original messages with the summary. Used for context window management — not for persistence. Persistence is handled by the semantic notes system (`qdrant_qdrant-store`/`qdrant_qdrant-find`).

**Used in:** enforcement sequences (`compress` component, planning Node 6).  
**Note:** Compress is not globally exempt. It appears as a positional requirement in enforcement sequences.

---

## Planning-Enforcement Plugin Tools

These tools are provided by the planning-enforcement plugin — the plugin this spec describes. Full contracts are listed here.

### plan_session

**Purpose:** Activate the planning DAG. Copies the global planning DAG template from the global config to `.opencode/session-plans/planning-session_{id}/`, substitutes `{{PLANNING_SESSION_ID}}` with `planning-session_{id}` in all node prompts, and sets all prompt path fields in `plan.jsonl` to their correct relative paths from the current working directory. Activates the copied DAG so HeadWrench begins at Node 1.

**Called by:** HeadWrench (the primary agent). This is the entry point for a new planning session.

**Parameters:** None.

**Returns on success:** Confirmation that the planning session was activated and the session path.

**Returns on failure:** Error if the global planning DAG template is not found.

**Side effects:** Creates `.opencode/session-plans/planning-session_{id}/` with `plan.jsonl` and `prompts/`. Activates the DAG.

---

### choose_plan_name

**Purpose:** Set the execution plan name. Handles deduplication and substitutes `{{PLAN_NAME}}` into all remaining planning DAG node prompts immediately.

**Called by:** HeadWrench, during planning Node 1 (Session Overview).

**Parameters:**
- `name` — a descriptive, human-memorable string. This is what the user will type into `/activate-plan`. Must be non-empty and contain only characters valid for a directory name.

**Returns on success:** The confirmed plan name. If the requested name was already taken (a directory with that name exists under `.opencode/session-plans/`), the plugin increments a numeric suffix (e.g., `fix-auth` → `fix-auth-2`) and returns the actual assigned name.

**Returns on failure:** Error if `name` is empty or contains invalid characters.

**Side effects:** Substitutes the confirmed name into `{{PLAN_NAME}}` in all remaining planning DAG node prompts. The agent does not need to remember the name — it appears in every subsequent planning prompt automatically. The Qdrant collection `{plan_name}` is implicitly created when the first `qdrant_qdrant-store` call is made after this point.

---

### init_dag

**Purpose:** Initialize the execution DAG. Creates `.opencode/session-plans/{plan_name}/plan.jsonl` with the execution-kickoff node pre-populated as the root.

**Called by:** HeadWrench, during planning Node 9 (DAG Design). Must be called before dispatching the dag-designer subagent.

**Parameters:**
- `plan_name` — the confirmed plan name from `choose_plan_name`. The `{{PLAN_NAME}}` placeholder in the prompt is already substituted, so the agent reads this value from its current prompt.

**Returns on success:** Confirmation that `plan.jsonl` was created at `.opencode/session-plans/{plan_name}/`, with the execution-kickoff node as root.

**Returns on failure:** Error if `plan.jsonl` already exists at that path.

**Side effects:** Creates the session plan directory and writes the initial `plan.jsonl`. The execution-kickoff node is the only node present; the dag-designer adds all subsequent nodes.

---

### add_node

**Purpose:** Add a node to the execution DAG. Reads the component's `node-spec.json` for the enforcement sequence, copies the component's `prompt.md` to `.opencode/session-plans/{plan_name}/prompts/{node_id}.md`, and writes the complete node entry to `plan.jsonl`.

**Called by:** The dag-designer subagent only. HeadWrench does not call this directly.

**Parameters:**
- `plan_name` — the `{{PLAN_NAME}}`.
- `node_id` — a descriptive string reflecting the node's purpose (e.g., `work-fix-build`, `verify-auth-module`). Must not be a generic placeholder like `node-1`. Node IDs must be unique within the DAG.
- `parent_id` — the node ID of the parent node. Must already exist in the DAG.
- `component_name` — the component type from the library (e.g., `work-item`, `verify`, `decision-gate`).

**Returns on success:** Confirmation including the node ID, component type, and parent node ID.

**Returns on failure:** Error if the parent node does not exist, or if the component type is not found in the library.

**Side effects:** Writes the node entry to `plan.jsonl` with the enforcement sequence and prompt path filled in. Copies `prompt.md` to the session prompts folder. Updates the parent node's children list in `plan.jsonl`.

**Constraint:** Does not accept custom prompt text, custom enforcement sequences, or any per-node overrides. Enforcement sequences and prompts come from the component library exclusively.

---

### delete_node

**Purpose:** Remove a node and its entire subtree from the execution DAG.

**Called by:** The dag-designer subagent.

**Parameters:**
- `plan_name` — the `{{PLAN_NAME}}`.
- `node_id` — the node to delete.

**Returns on success:** Confirmation listing all removed node IDs.

**Returns on failure:** Error if the node does not exist. Error if attempting to delete the execution-kickoff root node.

**Side effects:** Removes the specified node and all descendant nodes from `plan.jsonl`. Removes the corresponding prompt files from `.opencode/session-plans/{plan_name}/prompts/`. Updates the deleted node's parent to remove the child reference.

---

### modify_node

**Purpose:** Change the parent of a node. Used to restructure the DAG without deleting surviving children.

**Called by:** The dag-designer subagent.

**Parameters:**
- `plan_name` — the `{{PLAN_NAME}}`.
- `node_id` — the node to modify.
- `new_parent_id` — the new parent node. Must already exist in the DAG.

**Returns on success:** Confirmation of the reparenting.

**Returns on failure:** Error if either `node_id` or `new_parent_id` does not exist. Error if the reparenting would create a cycle.

**Side effects:** Updates the `parent_id` field of the specified node in `plan.jsonl`. Updates the old parent's children list to remove the node. Updates the new parent's children list to add the node.

**Constraint:** Prompt content is immutable. `modify_node` cannot change a node's prompt, enforcement sequence, or component type. To change those, delete the node and add a new one.

---

### validate_dag

**Purpose:** Check the structural validity of an execution DAG.

**Called by:** The dag-designer and dag-reviewer subagents.

**Parameters:**
- `plan_name` — the `{{PLAN_NAME}}`.

**Returns on success:** A validation report. If valid: confirmation with node count. If invalid: a list of structural problems found.

**Checks performed:**
- All `parent_id` references resolve to existing nodes.
- No orphaned nodes (every node except the root has a parent).
- No cycles.
- All `component_name` values match a type in the component library.
- The root node is `execution-kickoff`.

**Returns on failure:** Error if `plan.jsonl` is not found.

---

### show_dag

**Purpose:** Return the full contents of `plan.jsonl` to the agent. Provides every node's ID, component type, parent, children, enforcement sequence, and prompt path.

**Called by:** The dag-designer and dag-reviewer subagents during DAG construction and review. HeadWrench during execution-kickoff orientation.

**Parameters:**
- `plan_name` — the `{{PLAN_NAME}}`.

**Returns on success:** The complete `plan.jsonl` content. Format is the raw JSONL — one JSON object per line, one line per node. The plugin handles finding the correct file; agents do not need to know the path.

**Returns on failure:** Error if the plan does not exist.

**Note:** For DAGs with more than approximately 20 nodes, `show_dag` output can be large. Use `show_compact_dag` first for structural orientation, then `show_dag` for detailed node inspection.

---

### show_compact_dag

**Purpose:** Display a Mermaid diagram of the DAG in which in-series nodes are collapsed into single blocks. Shows branching structure and overall process flow without listing every individual node.

**Called by:** HeadWrench during execution-kickoff (first DAG view, before `show_dag`). The dag-designer and dag-reviewer during review when a high-level structural overview is needed.

**Parameters:**
- `plan_name` — the `{{PLAN_NAME}}`.

**Returns on success:** A Mermaid diagram. In-series sequences of nodes are collapsed into single labeled blocks. Branch points and merge points are visible. Gives the agent the shape of the plan — what the phases are and where the decision points fall.

**Returns on failure:** Error if the plan does not exist.

**Note:** `show_compact_dag` is the preferred first view for any agent orienting to a DAG. `show_dag` follows when the agent needs to inspect individual nodes.

---

### present_compact_dag_to_user

**Purpose:** Present the compact DAG to the user for review. Unlike `show_compact_dag` (which returns tool output only the agent sees), this tool injects the compact diagram as visible conversation content that both the user and the agent can see.

**Called by:** HeadWrench, during planning Node 12 (User Review).

**Parameters:**
- `plan_name` — the `{{PLAN_NAME}}`.

**Returns:** The compact DAG rendered as visible conversation content.

**Returns on failure:** Error if the plan does not exist.

---

### get_planning_components_catalogue

**Purpose:** Return the component catalogue so the dag-designer knows what component types are available, what each does, and when to use each.

**Called by:** The dag-designer and dag-reviewer subagents.

**Parameters:** None.

**Returns on success:** The content of `CATALOGUE.md` — descriptions of all available component types, their enforcement sequences, and usage guidance.

**Returns on failure:** Error if `CATALOGUE.md` is not found.

---

### get_dag_design_guide

**Purpose:** Return the DAG design guide so the dag-designer and dag-reviewer understand design principles, structural patterns, and anti-patterns.

**Called by:** The dag-designer and dag-reviewer subagents.

**Parameters:** None.

**Returns on success:** The content of the design guide — principles for structuring DAGs, common patterns, good and bad examples.

**Returns on failure:** Error if the guide is not found.

---

### next_step

**Purpose:** Advance the DAG to the next node. The enforcement engine blocks this call until all positions in the current node's enforcement sequence have been satisfied.

**Called by:** HeadWrench (and subagents that run DAG nodes, though in the current design only HeadWrench runs DAG nodes).

**Parameters:**
- `next` (optional) — the node ID of the child to advance to. Required when the current node has more than one child (branching node). Omit for linear nodes.

**Behavior:**
- If the enforcement sequence is not fully satisfied: returns a `[DAG BLOCKED]` error (see doc 03).
- If the current node has multiple children and `next` is omitted: returns a `[BRANCH REQUIRED]` error listing valid child IDs.
- If `next` is provided but does not match any child of the current node: returns an error.
- On success: loads the next node's prompt and activates its enforcement sequence.

**Returns on success:** Confirmation that the DAG advanced to the next node.

---

### recover_context

**Purpose:** Recover DAG session context after autocompaction or context loss. Returns the current node, completed work summary, and decisions made so far in the session.

**Called by:** HeadWrench, when the agent detects it has lost session context (e.g., after autocompaction).

**Parameters:** None.

**Returns on success:** Current node ID, list of completed nodes, and any recorded session state.

**Returns on failure:** Error if no active DAG session is found.

**Note:** `recover_context` is globally exempt — it can be called at any time without triggering enforcement errors.

---

## MCP Server Tools

These tools are provided by MCP servers configured for the system. Tool names are the exact callable identifiers.

---

### GrepAI

**Why:** Semantic code search using local Ollama embeddings. Searches source code, markdown, YAML, TOML, and config files. The RPG (Repository Program Graph) provides structural codebase exploration without AST parsing. Replaces the previous Probe tool, which could not index non-code files.

**Tools:**

- `grepai_grepai_search` — semantic search across all indexed files. Primary search tool.
- `grepai_grepai_rpg_explore` — BFS traversal of the repository program graph from a starting node.
- `grepai_grepai_rpg_search` — search RPG nodes semantically.
- `grepai_grepai_rpg_fetch` — fetch details of a specific RPG node.
- `grepai_grepai_trace_callees` — find all functions called by a symbol.
- `grepai_grepai_trace_callers` — find all functions that call a symbol.
- `grepai_grepai_trace_graph` — build a complete call graph around a symbol.
- `grepai_grepai_index_status` — check index health and statistics.
- `grepai_grepai_stats` — show token savings statistics.
- `grepai_grepai_list_projects` — list projects in a workspace. **Denied to all agents** — no cross-project access.
- `grepai_grepai_list_workspaces` — list available workspaces. **Denied to all agents** — no cross-project access.

---

### SearXNG

**Why:** Self-hosted web search. No API keys required; no data leaves the local network. Used by the external-scout subagent for external research.

**Tools:**

- `searxng_searxng_web_search` — web search.
- `searxng_web_url_read` — fetch and parse content from a URL.

---

### Qdrant

**Why:** Semantic session notes with local embeddings via FastEmbed. Runs in-process (no external server). Session-scoped collections by plan name prevent cross-plan bleed. Semantic search by meaning retrieves relevant findings regardless of when they were stored, which is fundamentally more useful than sequential file reading.

**Tools:**

- `qdrant_qdrant-store` — store a finding, decision, or constraint to the current plan's collection.
- `qdrant_qdrant-find` — retrieve relevant findings from the current plan's collection by semantic similarity.

**Collection naming:** The collection is named `{plan_name}`. This name is embedded in node prompts via `{{PLAN_NAME}}` substitution and is used for both planning and execution phases.

---

### Sequential Thinking

**Why:** Externalizes reasoning into a structured, iterative format. Each thought is a separate tool call with explicit thought numbering and total-thought estimation. Prevents the "dump everything into one response" anti-pattern that small models default to. Reasoning steps are individually revisable and trackable.

**Tools:**

- `sequential-thinking_sequentialthinking` — record one step of a reasoning chain. Parameters include thought content, thought number, total thoughts estimate, whether this thought revises a prior one, and whether more thoughts are needed.

---

### Context7

**Why:** Documentation research for external libraries and frameworks. Resolves package names to structured documentation sources. Used by external-scout during research phases.

**Tools:**

- `context7_resolve-library-id` — resolve a package name to a Context7 library ID.
- `context7_query-docs` — query documentation for a resolved library ID.

---

## Removed Tools

### Probe (probelabs/probe)
Previously used for semantic code search. Replaced by GrepAI because Probe's tree-sitter-based approach could not index non-code files (markdown, YAML, TOML, config). These file types make up the majority of this framework's configuration surface. All Probe tool names must not appear in any agent permission list.
