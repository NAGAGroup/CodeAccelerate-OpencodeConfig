# Execution Architecture

Execution DAGs are shapes, not scripts. The planning agent determines work-type patterns and dependency constraints. The executing agent decides what fills each slot by querying the semantic notes system and reasoning through accumulated context.

---

## Activation

The user activates a plan by invoking the `/activate-plan <plan_name>` slash command. The command expands to a prose instruction that HeadWrench reads and acts on by calling the `activate_plan` tool. The framework reads `plan.jsonl` from `.opencode/session-plans/{{PLAN_NAME}}/` and begins execution at the root node, which is always the `execution-kickoff` node placed by `init_dag`.

The Qdrant collection name is `{{PLAN_NAME}}` — the same name used throughout the planning session. Everything the planning agent stored — findings, decisions, constraints, scope boundaries, and the rationale for the DAG's structure — is available to the executing agent through the same collection without any metadata resolution.

---

## Execution Kickoff

Every execution DAG begins with the automatic `execution-kickoff` node. This is the only component placed by `init_dag` rather than by the dag-designer. The design agent does not add it and cannot remove it.

### Resolved Enforcement Sequence

```
[skill, show_compact_dag, show_dag, qdrant_qdrant-find, sequential-thinking_sequentialthinking, qdrant_qdrant-store]
```

Using the token reference table from doc 03, this expands to:

| Position | Readable name | Callable identifier |
|---|---|---|
| 1 | skill | `skill` |
| 2 | show_compact_dag | `show_compact_dag` |
| 3 | show_dag | `show_dag` |
| 4 | qdrant-find | `qdrant_qdrant-find` |
| 5 | thinking | `sequential-thinking_sequentialthinking` |
| 6 | qdrant-store | `qdrant_qdrant-store` |

### Kickoff Flow

1. The agent loads the `following-plans` skill. This establishes how to follow DAG step sequences and how to recover from enforcement errors.
2. The agent calls `show_compact_dag` to see a high-level overview of the execution DAG's branching structure — what the plan's phases are and how many nodes it contains.
3. The agent calls `show_dag` to see the full `plan.jsonl` — the exact node IDs, component types, and enforcement sequences that the executing agent will navigate.
4. The agent calls `qdrant_qdrant-find` to retrieve planning context from the semantic notes system: the user's goal, scope boundaries, investigation findings, and the rationale for why the DAG was structured the way it was.
5. The agent calls `sequential-thinking_sequentialthinking` to reason through its orientation. The reasoning addresses: what does this plan intend to accomplish, what does the DAG structure suggest about the phases of work, what constraints must carry forward from planning, and what does the first step after kickoff require.
6. The agent calls `qdrant_qdrant-store` to write executor-framed orientation notes — restating the goal, constraints, and execution strategy in terms relevant to the execution phase. These notes differ from the planning notes in that they are written from the executor's perspective and capture the executor's understanding of what needs to happen.

The kickoff node is the bridge between planning and execution. The agent emerges from it with full understanding of the goal, the plan's structure, and the planning rationale — gathered fresh from semantic notes rather than inherited from any prior context.

**Design rationale for this sequence:** The DAG structure is revealed before the semantic notes are queried (positions 2 and 3 precede position 4). This matters because the agent needs the DAG structure in mind when reading the planning rationale — the planning agent's notes about specific node IDs and branch conditions are only meaningful when the agent already knows what those IDs refer to. Reading the notes first and the DAG second produces disorientation; reading the DAG first produces comprehension.

---

## Node Execution Pattern

At each node after kickoff, the executing agent follows the node's prose prompt. The prompt guides the agent through the work for that step, and the enforcement engine silently ensures structural invariants are met.

The general pattern across most nodes:

1. **Retrieve context.** The agent retrieves relevant context from the semantic notes system. Whether this is mandatory or advisory depends on the component type — the node's prose prompt specifies when and how to retrieve context. Investigation nodes retrieve context to understand what to investigate. Work nodes retrieve context to understand what to implement. Decision nodes retrieve context to inform the branching choice.

2. **Reason.** The agent reasons through what needs to happen at this step, informed by retrieved context and the accumulated conversation from prior nodes in the current session.

3. **Act.** The agent acts — dispatching a subagent, asking the user a question, storing findings, compressing context, or advancing through a decision gate.

4. **Advance.** The agent calls `next_step` to advance to the next node. At branching nodes, `next_step` takes a `next` parameter specifying which child node ID to advance to.

Context re-gathering at each node is the intentional cost of the memory-is-forbidden principle. Each query to the semantic notes system catches updates from previous nodes that a cached understanding would miss. The redundancy is the reliability.

---

## How Semantic Notes Accumulate During Execution

The same Qdrant collection used during planning continues to accumulate notes during execution. As the executing agent works through the DAG:

- **Kickoff node** stores executor-framed orientation notes restating the goal and execution strategy.
- **Investigation nodes** store what was discovered about the codebase — file paths, function signatures, dependencies, relevant patterns.
- **Work nodes** store what changes were made and why — the goal, the approach taken, and anything notable about the implementation.
- **Verification nodes** store whether changes passed or failed and what was checked.
- **Decision nodes** store which branch was taken and the reasoning.
- **Plan-fail nodes** store a failure summary: what was attempted, what failed, and what was learned.

Later nodes query this accumulated context. A verification node can retrieve what the preceding work node changed. A decision gate can retrieve what verification found. The semantic notes system is the communication channel between nodes — each node writes what it learned and reads what prior nodes discovered.

---

## Branching and Convergence

At `decision-gate` and `user-decision-gate` nodes, the agent must choose which child node to advance to. The `next` parameter to `next_step` is the child node's ID as it appears in `plan.jsonl`.

During planning, the dag-designer stores notes about each conditional node by its exact node ID and its exact children IDs, including what each branch represents and when it should be taken. The executing agent at a decision node retrieves these notes from the semantic notes system to understand its options and make an informed choice.

If the agent calls `next_step` without a `next` parameter at a branching node, the enforcement engine returns:

```
[BRANCH REQUIRED] Node "<node_id>" has multiple children.
Call next_step with the next parameter. Valid options: [<child_id_1>, <child_id_2>, ...].
```

The `following-plans` skill teaches the agent to read these error messages and call `next_step` again with the correct parameter.

### Multiple Parents (Convergence)

Nodes can have multiple parents. When multiple branches point to the same node, that node is a convergence point. The node executes when any parent path reaches it — whichever branch was taken, the convergent node is the next step.

**Example:** After a decision gate, both success and retry paths might converge to a shared commit node:
```
verify → decision-gate
  ├─ (pass) → commit-changes
  └─ (fail) → fix-work → verify-fix → commit-changes
```

The `commit-changes` node has two parents. It executes once, when either path reaches it. The execution state tracks which path was taken (via the decision log), but the convergent node itself doesn't distinguish between parents — it performs the same work regardless of which path arrived.

Convergence reduces node duplication and makes DAG structure clearer. Use it when different paths genuinely need the same next step.

---

## Infrastructure Stack

The CodeAccelerate system depends on a configured infrastructure stack:

**Qdrant (Local Instance)**
- Running locally with FastEmbed embeddings (no external embeddings service)
- Collections named by plan name (`{{PLAN_NAME}}`)
- Session-scoped persistence — collections created at first `qdrant_qdrant-store` call, remain for full planning + execution lifecycle
- Accessed via `qdrant_qdrant-store` and `qdrant_qdrant-find` tools
- Contains planning notes, execution findings, decision context, failure information (if execution fails)

**MCP Servers Configured**
- Sequential Thinking (builtin) — provides `sequential-thinking_sequentialthinking`
- GrepAI — provides semantic code search and RPG graph traversal
- SearXNG — provides external web search and URL reading (for external-scout)
- Context7 — provides library documentation queries (for external-scout)

**Component Library**
- Located at `.opencode/config/planning/plan-session/node-library/` (global, shared across projects)
- Each component has `prompt.md` (static template) and `node-spec.json` (enforcement sequence)
- Referenced by dag-designer during planning; never directly read by executing agents

**Session Storage**
- Planning DAGs: `.opencode/session-plans/planning-session_{id}/plan.jsonl` and prompts
- Execution DAGs: `.opencode/session-plans/{{PLAN_NAME}}/plan.jsonl` and prompts
- Qdrant collections: persisted locally, retrieved via `qdrant_qdrant-find` calls

**How pieces connect:**
- Agent calls `qdrant_qdrant-find` with a collection name (always `{{PLAN_NAME}}`) and a semantic query
- FastEmbed embeddings are computed locally for both the query and all stored notes
- Relevant notes are returned by semantic similarity
- Agent calls `qdrant_qdrant-store` to write new findings to the same collection
- Execution agents query the same collection used by planning agents — no separate cross-session mechanism

---

## Qdrant Query Construction

Agents retrieve session knowledge using `qdrant_qdrant-find` with semantic queries. The quality of retrieval depends on query phrasing.

**Good query characteristics:**
- **Specific enough to distinguish from unrelated findings.** Bad: "implementation" (matches every work node). Good: "authentication token validation implementation details"
- **Use domain terms from the codebase.** Bad: "the thing that breaks." Good: "request timeout error in database queries"
- **Include context about what you're trying to do.** Bad: "decision." Good: "verification results from authentication changes to decide next steps"
- **One semantic concept per query.** Multiple queries beat one complex query. Bad: "all findings about implementation, verification, and deployment." Good: Make three calls: (1) "implementation of auth changes", (2) "verification results for auth", (3) "deployment considerations"

**What works well:**
- Queries that reference actual findings/decisions stored in notes ("What did the scout find about request handling?")
- Queries that use task-relevant language ("What constraints did the user set for the API changes?")
- Multiple focused queries ("What was implemented?", "Were there any issues?") rather than one broad query

**What doesn't work well:**
- Vague queries ("tell me about the project", "any issues?")
- Queries that assume note structure ("get note ID 5")
- Queries phrased as questions to humans ("Why didn't the scout find X?") rather than semantic search ("scout findings about X")

**For implementers writing dispatch prompts:** Include guidance like: "Retrieve what prior findings exist about this area from the semantic notes system. Use queries like: 'What did investigation find about X module?' and 'What verification challenges emerged?'"

---

## Compression During Execution

Long execution DAGs accumulate conversation context that can exceed the model's effective attention window. `compress` nodes exist in the execution DAG specifically to manage this — they reduce closed conversation sections without losing session knowledge, because the semantic notes system has already captured everything important.

The `compress` tool is destructive. It mutates OpenCode's underlying SQL session files — the conversation history is permanently altered, not just summarized in memory. This is why the `compress` node contains only the compress call and nothing else. Any instructions placed alongside the compress call in the same node risk being compressed away by weaker models before they are executed.

The pattern:
- A `compress` node reduces closed conversation sections. Context window management only — the semantic notes system handles persistence.
- A `kickoff-refresher` node immediately follows every `compress` node. It reloads methodology skills and retrieves context from semantic notes so the agent re-establishes its working understanding from a clean state.

DAG designers should place `compress` → `kickoff-refresher` pairs at natural phase boundaries — after investigation phases, after large implementation phases, or whenever the accumulated conversation is likely to exceed effective attention.

---

## Plan Fail

When the executing agent reaches a `plan-fail` terminal node, execution stops. The agent stores a failure summary to the semantic notes system capturing what was attempted, what failed, and what was learned.

These notes survive in the Qdrant collection under `{{PLAN_NAME}}`. If the user runs a new planning session and the planning agent queries the same collection, it has access to real execution experience from the failed attempt. The next plan starts from knowledge, not from scratch.

`plan-fail` is the default terminal for unresolved paths. If a decision gate determines that the current approach cannot work, the branch ends in `plan-fail` rather than attempting unbounded autonomous recovery. The failure node's enforcement sequence is `[qdrant_qdrant-store]` — the agent must store a failure summary before the session can close.

---

## Plan Success

When the executing agent reaches a `plan-success` terminal node, execution is complete. The agent confirms what was accomplished and notes any deferred items, known limitations, or follow-up work that a subsequent session should address.

`plan-success` has an empty enforcement sequence (`[]`) — no required tool calls. The agent provides a summary in its response. The semantic notes from the session remain in the Qdrant collection and can be referenced by future sessions.

---

## Execution DAG File Layout

The execution DAG lives in:

```
.opencode/session-plans/{{PLAN_NAME}}/
    plan.jsonl
    prompts/
        execution-kickoff.md
        <node-id>.md
        ...
```

Each node's prompt file is a copy of the component library's `prompt.md`, renamed to the node's ID. This is done by `add_node` at design time — the executing agent never reads from the component library directly.

For the full file layout including planning DAG paths, see doc 00.
