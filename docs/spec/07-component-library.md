# Component Library

The component library provides static prompt templates for execution DAGs. Every node of the same component type uses the identical prompt. The planner's intent is expressed through DAG shape and semantic notes, never through per-node prompt customization.

---

## Representative Content Examples

### Component Node Structure

A typical component in the library contains:

**`prompt.md` (Static Template):**
Starts with a one-sentence role statement ("You are investigating the project to understand what needs to change"), followed by prose instructions that reference tools explicitly ("Use the task tool to dispatch @context-scout to investigate..."), and ends with constraints ("Focus on investigation only — implementation happens at the next step").

**`node-spec.json` (Enforcement Sequence):**
A single JSON object with an `enforcement` field containing an ordered array of exact tool identifiers, e.g.:
```json
{
  "enforcement": ["skill", "sequential-thinking_sequentialthinking", "task"]
}
```

### Planning Node Example

Planning node prompts follow the same three-part structure but are hand-authored for their specific position. Example: Node 3 (External Research) begins with a role statement, includes prose that explains the research flow, references the external-scout-delegation skill and the question tool, and ends with constraints about scope and query formulation.

### Skill File Example

Skills teach methodology in 50–100 lines. A delegation skill like `juniordev-delegation` explains: what junior-dev is (goal-oriented implementer, makes code changes), what it can do (investigate and edit), what it cannot do (shell operations, verification), and includes good/bad dispatch prompt examples showing what information to provide and what information to omit.

---

## How the Component Library Works

Each component type is a directory in the global component library containing two files:

- **`prompt.md`** — the static prose prompt for that component type
- **`node-spec.json`** — a JSON file with a single field, `enforcement`, containing the ordered enforcement sequence as an array of exact callable tool identifiers

When `add_node` places a node in `plan.jsonl`, it:
1. Reads the component's `node-spec.json` and copies the `enforcement` array into the new `plan.jsonl` entry
2. Copies the component's `prompt.md` to `.opencode/session-plans/{{PLAN_NAME}}/prompts/<node-id>.md`
3. Writes the relative path to that copied prompt file into the `prompt` field of the `plan.jsonl` entry

Agents never read `node-spec.json` or the component library's `prompt.md` files directly. The enforcement sequence is embedded in `plan.jsonl`; the prompt is delivered to the agent at each node by the framework.

---

## Plan.jsonl Node Entry Schema

A fully written node in `plan.jsonl` contains:

**Provided by the dag-designer:**
- `id` — a descriptive node ID reflecting the node's purpose (e.g., `work-fix-build`, `investigate-auth-flow`). Must be unique within the DAG.
- `parent` — the node ID of the parent node.
- `type` — the component type name from the library (e.g., `work-item`, `verify`).

**Filled automatically by the plugin:**
- `prompt` — relative path from the working directory to the copied prompt file (e.g., `.opencode/session-plans/my-plan/prompts/work-fix-build.md`)
- `enforcement` — the enforcement sequence array, copied from the component's `node-spec.json`
- `children` — array of child node IDs. Populated incrementally as subsequent nodes declare this node as their parent.

**File format:** JSONL (JSON lines) — one complete node entry per line. Each line is a valid JSON object containing all fields above plus the `enforcement` and `children` arrays.

---

## Automatic Component

The following component is placed by `init_dag` at the root of every execution DAG. The dag-designer does not add it — it exists before the designer begins work.

### execution-kickoff

**Intent:** Entry point for every execution DAG. The agent loads the plan-following skill, views the DAG structure (compact then full), retrieves all planning context from the semantic notes system, reasons through its execution strategy, and stores executor-framed orientation notes.

**Enforcement:** `[skill, show_compact_dag, show_dag, qdrant_qdrant-find, sequential-thinking_sequentialthinking, qdrant_qdrant-store]`

The `skill` call loads the `following-plans` skill. `show_compact_dag` gives a high-level view of the plan's phases and branching structure. `show_dag` reveals the full `plan.jsonl` — exact node IDs, types, and sequences. `qdrant_qdrant-find` retrieves planning context (goal, scope, findings, DAG rationale). `sequential-thinking_sequentialthinking` orients around the plan. `qdrant_qdrant-store` writes executor-framed notes that restate the goal and execution strategy from the executor's perspective.

For the full rationale behind this sequence, including why DAG structure is revealed before notes are queried, see doc 06.

---

## Core Components

### work-item

**Intent:** Any project mutation — code changes, file edits, refactors, documentation updates. The agent dispatches a scout to understand current state and what needs to change, loads the appropriate delegation skill based on what the scout found, then dispatches the chosen implementation subagent with a goal-based task.

**Enforcement:** `[task, skill, sequential-thinking_sequentialthinking, task]`

The first `task` dispatches a context-scout (wide-shallow investigation). The `skill` load is chosen based on scout results — either the `juniordev-delegation` skill (code changes) or the `documentation-expert-delegation` skill (documentation). `sequential-thinking_sequentialthinking` reasons through the delegation prompt and what context the implementation agent needs. The second `task` dispatches the implementation subagent.

---

### project-search-and-analysis

**Intent:** Investigation without mutation. The agent dispatches a scout for wide-shallow understanding or an insurgent for narrow-deep analysis. The agent decides which at runtime based on accumulated session context and what the semantic notes indicate needs investigating.

**Enforcement:** `[skill, sequential-thinking_sequentialthinking, task]`

The `skill` load is either `context-scout-delegation` or `context-insurgent-delegation` based on the agent's judgment. `sequential-thinking_sequentialthinking` composes the dispatch prompt. `task` dispatches the chosen investigator.

---

### research

**Intent:** External research via the external-scout subagent behind the IP approval gate. The agent presents the exact research query to the user for approval before dispatching. If the user declines, the agent dispatches external-scout with a prompt instructing it to return immediately — this satisfies the enforcement sequence without requiring a branch.

**Enforcement:** `[skill, sequential-thinking_sequentialthinking, question, task]`

The `skill` loads the `external-scout-delegation` skill. `sequential-thinking_sequentialthinking` composes the research query. `question` presents the exact query to the user for IP approval. `task` dispatches external-scout.

---

### deep-research

**Intent:** Extended domain exploration, usually explicitly user-requested. For broad investigation across multiple sources rather than a single targeted query. The agent may dispatch multiple research calls or a single extended session.

**Enforcement:** `[skill, sequential-thinking_sequentialthinking, task]`

The `skill` loads the `external-scout-delegation` skill. `sequential-thinking_sequentialthinking` plans the research scope. `task` dispatches external-scout.

---

### write-notes

**Intent:** Store accumulated findings, decisions, and constraints to the semantic notes system. Each significant finding gets its own store call. This component is placed explicitly when a step's primary purpose is note storage — other components also store notes as part of their flow.

**Enforcement:** `[qdrant_qdrant-store]`

One `qdrant_qdrant-store` call satisfies the enforcement position, but the agent should make as many calls as needed. The enforcement sequence ensures at least one store call occurs; the agent's judgment determines the total.

---

### compress

**Intent:** Compress closed conversation sections to free context window space. The `compress` tool is destructive — it mutates OpenCode's underlying SQL session files. The semantic notes system handles persistence; compression is purely about context window management. Always followed by a `kickoff-refresher` node.

**Enforcement:** `[compress]`

**Design constraint:** Keep instructions in this prompt minimal and positioned carefully. Any instructions that appear *before* the compress call risk being compressed away — they are lost in the same operation they were meant to govern. Instructions placed *after* the compress call (such as calling next_step) are safe because they execute after the compression is complete. Always include the next_step call at the end.

---

### kickoff-refresher

**Intent:** Realign the agent after context compression. Reload methodology skills, re-engage with their content, and retrieve accumulated session context from semantic notes. The agent re-establishes its understanding of its role, methodology, and the session's accumulated knowledge before continuing. Mirrors the function of the planning DAG's hand-authored Session Overview and Session Overview Refresher nodes, but as a single execution component.

**Enforcement:** `[skill, skill, qdrant_qdrant-find, sequential-thinking_sequentialthinking]`

The first `skill` loads `following-plans`. The second loads `sequential-thinking`. `qdrant_qdrant-find` retrieves context from the semantic notes system. `sequential-thinking_sequentialthinking` synthesizes the retrieved context and re-establishes working understanding.

**Note:** The planning DAG's Node 7 (Session Overview Refresher) performs a similar role but is a hand-authored planning node, not this component. Node 7 omits the `qdrant_qdrant-find` because planning Node 8 (Retrieve Notes) handles retrieval as a dedicated step. In execution DAGs there is no separate retrieve-notes step after the refresher, so `kickoff-refresher` includes the `qdrant_qdrant-find` itself.

---

### sequential-thinking

**Intent:** Pure reasoning step with no side effects. The agent uses the thinking tool to reason through a problem, decision, or assessment without dispatching subagents or making changes.

**Enforcement:** `[sequential-thinking_sequentialthinking]`

---

## Logic Components

**Note for dag-designers:** During planning, use `qdrant_qdrant-store` to store notes about each conditional node by its exact node ID and its exact children IDs, including what each branch means and when it should be taken. Executing agents at `decision-gate` and `user-decision-gate` nodes retrieve these notes to make informed branching decisions. Without these notes, the executing agent has no basis for choosing a branch other than the child node IDs themselves.

---

### decision-gate

**Intent:** The executor assesses accumulated evidence from semantic notes and chooses which branch to take. The DAG structure defines the available paths. The agent retrieves context, reasons through the decision criteria, and advances to the chosen branch.

**Enforcement:** `[qdrant_qdrant-find, sequential-thinking_sequentialthinking]`

`qdrant_qdrant-find` retrieves what prior nodes discovered and the planning notes about this decision point's branch conditions. `sequential-thinking_sequentialthinking` reasons through the evidence and selects a branch. The agent calls `next_step` with the `next` parameter set to the chosen child node ID.

---

### user-decision-gate

**Intent:** The user chooses which branch to take. The agent presents the options and the reasoning, and the user decides.

**Enforcement:** `[question]`

`question` presents the options. The agent calls `next_step` with the `next` parameter matching the user's choice.

---

### plan-fail

**Intent:** Terminal failure. The agent stores a failure summary to the semantic notes system capturing what was attempted, what failed, and what was learned. These notes are available to the next planning session via the shared `{{PLAN_NAME}}` collection.

**Enforcement:** `[qdrant_qdrant-store]`

Terminal node. After `qdrant_qdrant-store` is called and `next_step` is called, execution stops.

---

### plan-success

**Intent:** Terminal success. The agent confirms what was accomplished and notes any deferred items, known limitations, or follow-up work that a subsequent session should address.

**Enforcement:** `[]`

Terminal node. No required tool calls. The agent provides a summary in its response. Execution stops after `next_step` is called.

---

## Verification and Operations Components

### verify

**Intent:** Verification of the most recent change. The agent dispatches the step-limited `tailwrench` subagent with specific verification criteria derived from accumulated session context. The criteria are not encoded in the prompt — the executor reads them from the semantic notes of what was just implemented.

**Enforcement:** `[skill, sequential-thinking_sequentialthinking, task]`

The `skill` loads the `tailwrench-delegation` skill. `sequential-thinking_sequentialthinking` reasons through what verification means for this specific change (retrieved from semantic notes). `task` dispatches tailwrench.

---

### run-project-commands

**Intent:** Shell operations — adding dependencies, running build scripts, configuring tools, running tests. The agent dispatches the step-limited tailwrench subagent with the specific commands or goals to execute.

**Enforcement:** `[skill, sequential-thinking_sequentialthinking, task]`

The `skill` loads the `tailwrench-delegation` skill. `sequential-thinking_sequentialthinking` plans the command sequence and what success looks like. `task` dispatches tailwrench.

---

### commit

**Intent:** Git checkpoint at a meaningful save point. The agent dispatches the step-limited tailwrench subagent to stage and commit changes with an appropriate message.

**Enforcement:** `[skill, sequential-thinking_sequentialthinking, task]`

The `skill` loads the `tailwrench-delegation` skill. `sequential-thinking_sequentialthinking` composes the commit message based on what was changed. `task` dispatches tailwrench.

---

## General Components

### user-discussion

**Intent:** Free-form conversation with the user mid-execution. For situations where the executor needs to discuss something that doesn't fit the structured question format — presenting findings, discussing tradeoffs, or getting open-ended feedback.

**Enforcement:** `[question]`

---

### autonomous-work

**Intent:** Escape hatch that delegates to a fully autonomous agent with no tool restrictions or step limits. The agent must only be included in a DAG if the user explicitly approved autonomous work during planning. DAG designers must never recommend this component unless the user explicitly requested it — it bypasses all the safety constraints the framework provides.

**Enforcement:** `[question, task]`

`question` confirms the user's explicit approval before the autonomous agent is dispatched. `task` dispatches `autonomous-agent`.

---

## Component Summary Table

| Component | Category | Enforcement | Terminal? |
|---|---|---|---|
| `execution-kickoff` | Automatic | `[skill, show_compact_dag, show_dag, qdrant_qdrant-find, sequential-thinking_sequentialthinking, qdrant_qdrant-store]` | No |
| `work-item` | Core | `[task, skill, sequential-thinking_sequentialthinking, task]` | No |
| `project-search-and-analysis` | Core | `[skill, sequential-thinking_sequentialthinking, task]` | No |
| `research` | Core | `[skill, sequential-thinking_sequentialthinking, question, task]` | No |
| `deep-research` | Core | `[skill, sequential-thinking_sequentialthinking, task]` | No |
| `write-notes` | Core | `[qdrant_qdrant-store]` | No |
| `compress` | Core | `[compress]` | No |
| `kickoff-refresher` | Core | `[skill, skill, qdrant_qdrant-find, sequential-thinking_sequentialthinking]` | No |
| `sequential-thinking` | Core | `[sequential-thinking_sequentialthinking]` | No |
| `decision-gate` | Logic | `[qdrant_qdrant-find, sequential-thinking_sequentialthinking]` | No |
| `user-decision-gate` | Logic | `[question]` | No |
| `plan-fail` | Logic | `[qdrant_qdrant-store]` | Yes |
| `plan-success` | Logic | `[]` | Yes |
| `verify` | Ops | `[skill, sequential-thinking_sequentialthinking, task]` | No |
| `run-project-commands` | Ops | `[skill, sequential-thinking_sequentialthinking, task]` | No |
| `commit` | Ops | `[skill, sequential-thinking_sequentialthinking, task]` | No |
| `user-discussion` | General | `[question]` | No |
| `autonomous-work` | General | `[question, task]` | No |

---

## Graceful Degradation Principle

When a small model does not follow every instruction in a prompt or misses a detail in the enforcement sequence, the system degrades gracefully rather than failing catastrophically.

**Examples of graceful degradation:**
- Agent forgets to call a non-exempt tool in the sequence → enforcement engine blocks further progress and returns an error naming the expected tool. Agent reads the error and corrects course.
- Agent over-investigates and calls dispatch more times than prompted → enforcement engine allows it (optional enrichment pattern). Extra work doesn't break anything.
- Agent misunderstands a constraint → semantic notes + refusal by other agents catches the issue; it doesn't propagate silently.

**What this is not:** The system does not assume agents will make mistakes and provide elaborate error recovery. It means the system is designed so that when deviations happen, they are caught early with actionable messages rather than silently producing wrong results.

This principle applies to all model sizes. Enforcement sequences exist to make correct behavior the path of least resistance, so even when agents deviate, the deviation is visible and correctable.

---

## Imperative Error Message Phrasing

Error messages use imperative language to redirect behavior immediately. Rather than explaining a violation, they tell the agent what to do next.

**Patterns:**
- `[DAG BLOCKED] Cannot call X — prerequisite not met. Call Y first to continue.` (tells agent exactly what to call)
- `[BRANCH REQUIRED] Node "node-id" has multiple children. Call next_step with the next parameter. Valid options: [child-1, child-2].` (names valid options)

Error messages are part of the enforcement mechanism's pedagogical design. They don't scold — they redirect. An agent reading `[DAG BLOCKED]` should immediately understand what to call and why. The `following-plans` skill teaches agents to read these messages and act on them.

---

## Skill-Loading Architecture

Every library node (execution DAG component) is responsible for loading its own relevant skill(s) at the start of its enforcement sequence. This ensures domain-specific methodology is always fresh in context, regardless of prior nodes or DAG shape.

| Node type | Skill loads | When | Rationale |
|---|---|---|---|
| `execution-kickoff` | `following-plans` | At node start | Establish execution-phase plan-following methodology for the entire execution phase |
| `work-item` | `context-scout-delegation`, then `juniordev-delegation` or `documentation-expert-delegation` | Scout at node start, then implementation after investigation | Load investigation and appropriate implementation methodology |
| `project-search-and-analysis` | `context-scout-delegation` or `context-insurgent-delegation` | At node start | Load the appropriate investigation methodology (wide-shallow or narrow-deep) |
| `research` | `external-scout-delegation` | At node start | Load research methodology before composing and presenting the query |
| `deep-research` | `external-scout-delegation` | At node start | Load research methodology for extended investigation |
| `verify` | `tailwrench-delegation` | At node start | Load verification and operations methodology |
| `run-project-commands` | `tailwrench-delegation` | At node start | Load operations methodology |
| `commit` | `tailwrench-delegation` | At node start | Load git/operations methodology |
| `kickoff-refresher` | `following-plans`, `sequential-thinking` | At node start | Re-establish methodology after context compression |
| `decision-gate` | None | N/A | Logic node without methodology requirements |
| `user-decision-gate` | None | N/A | Logic node without methodology requirements |

**Why this pattern:** Library nodes execute in arbitrary order within a DAG — the shape of the graph is determined by the planner, not by a fixed sequence. Because execution order is not fixed, nodes cannot assume that methodology established at kickoff will be fresh in context by the time they execute. Each node that needs domain-specific methodology (delegation skills, operations skills, notes-handling skills) must load it fresh. This ensures correct behavior regardless of DAG topology.

**Skill position in enforcement sequences:** Every component that loads a skill places `skill` first in its enforcement sequence. This ensures methodology is in context before any task dispatch, semantic notes retrieval, or complex reasoning occurs.

**Relationship to kickoff methodology:** This per-node loading is **distinct from** the session-wide methodology established at `execution-kickoff`. The `following-plans` skill loaded at kickoff establishes how the executor reads and follows the DAG structure. That methodology persists across all nodes. Domain-specific skills (delegation, operations, notes-handling) are loaded additionally as needed at specific nodes. Both types of skill load can coexist: a node might have already absorbed the `following-plans` skill from kickoff but still needs to load `tailwrench-delegation` for the work it's about to dispatch.

---

## Catalogue Consistency Requirements

The component catalogue (`CATALOGUE.md`) is generated from or must exactly match these definitions. Specifically:

- `write-notes` must describe storing to the semantic notes system, not writing to files.
- All component descriptions must reference the correct tool surface for that component.
- No component description may reference tools that are not in its enforcement sequence or the globally exempt list.
- The `execution-kickoff` component must be listed separately from the design-agent-placed components and described as automatic.
