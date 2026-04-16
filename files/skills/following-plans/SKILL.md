---
name: following-plans
description: Teaches how to execute DAG step sequences exactly as specified, handling enforcement errors and context recovery.
---
# Following Plans

This skill governs how to execute a plan DAG — one node at a time, in order, with full context from prior work.

# Hard rules (violating any = task failure)
1. Never ask the user questions unless the current node explicitly allows it.
2. Never do work outside what is instructed at the current node.
3. Never delegate to a different agent than the one specified.
4. Always call `next_step` immediately after completing a node's instructions.

# The DAG environment

A plan is a directed acyclic graph. Every node delivers exactly one instruction block. The DAG was designed by a planning agent that understood the full task and shaped the work sequence accordingly. Trust it. Execute the current node's instructions completely and precisely. Do not work ahead, fill in perceived gaps, or extend scope beyond what the current node asks. The next node will contain the next instruction. If scope seems incomplete, that is intentional — the DAG's structure addresses it.

You are mid-session. Prior nodes have already executed. The current node is a continuation of accumulated work, not a fresh start.

# Before acting at each node

Before executing any node's instructions, output a brief preflight:

```toml
[preflight]
node_goal = <restate the goal of this node in your own words>
prior_context_retrieved = <what you found in Qdrant that is relevant to this node>
approach = <what you intend to do and in what order>
```

This applies to every node. It forces orientation before action and makes your reasoning auditable. If the node prompt includes its own preflight or checklist, use that instead — do not duplicate.

# Qdrant memory

The conversation window is not reliable memory. Context compresses and attention degrades between nodes. Qdrant is the durable layer. Everything the planning phase discovered is already stored in the collection named for the plan (the Plan Name field in every node prompt). Everything discovered during execution should be captured there too.

**Collection name:** Always the plan name. Use it for all `qdrant_qdrant-find` and `qdrant_qdrant-store` calls.

**Before dispatching:** Call `qdrant_qdrant-find` with queries targeting what prior nodes found. The subagent must arrive context-aware — not re-discovering known constraints or contradicting earlier decisions.

**Storing findings:** Call `qdrant_qdrant-store` after significant discoveries, decisions, or delegation outcomes. One call per finding. Write each as self-contained prose — another agent with no session history must understand it fully.

# Enforcement errors

When a tool is called before it has been unlocked, you receive a `[BLOCKED]` message naming the required tool. Read it. Call the named tool. Continue. Do not apologise, explain the error, or retry the blocked call — just execute the required tool immediately and proceed.

# Context loss recovery

If context is lost mid-execution or you lose position in the DAG, call `recover_context` immediately. It returns the current node ID, completed nodes, and session state. Then use `qdrant_qdrant-find` with targeted queries to re-establish working understanding. Do not reconstruct position from conversation history alone.

# Anti-patterns

**Dispatching without retrieval:** Composing a subagent prompt without calling `qdrant_qdrant-find` first means the subagent arrives without prior findings — it re-discovers known constraints, contradicts earlier decisions, or duplicates work. Correct pattern: retrieve → read results → compose informed dispatch → call task.

**Storing only at the end:** Batching all discoveries into a single store call at node completion makes intermediate findings unavailable to downstream nodes. Correct pattern: store immediately after each discovery.

**Assuming context persists:** Relying on conversation history to carry context across node boundaries assumes attention and compression will preserve detail. They will not. Retrieve from Qdrant explicitly before acting.
