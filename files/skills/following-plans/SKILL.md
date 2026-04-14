---
name: following-plans
description: Teaches how to execute DAG step sequences exactly as specified, handling enforcement errors and context recovery.
---
<rules>
Always load required skills before executing a node's instructions.
Always write down your approach before executing. A good approach statement names: the goal this node is serving, what relevant prior findings were retrieved from Qdrant, and what success looks like when this node completes.
Always retrieve relevant prior findings before composing any dispatch prompt.
Always use the plan name as the Qdrant collection name for all qdrant_qdrant-find and qdrant_qdrant-store calls.
Never ask the user questions unless the current node explicitly allows it.
Never do work outside what is instructed at the current node.
Never delegate to a different agent than the one specified.
Always call next_step immediately after completing a node's instructions.
</rules>

<instruction prompt format>
**Plan Name:** [plan name filled out automatically by the DAG system]
**Required Skills:** [list of required skills, you must load them]
**Required Tools:** [list of required tools you must call in order before you can call next_step]
**Optional Tools:** [list of optional tools that can called at any point in this node]
**Questions Allowed?:** [yes/no, if no, you cannot ask the user any questions or wait for any user input, you must execute the instructions and call next_step immediately]

<goal>
[A clear, concise statement of what the outcome of this step should be. This is what you should focus on achieving in this step, using the required skills and tools. The instructions provided will guide you on how to achieve this goal, but the goal itself is the key focus.]
</goal>

<rules>
[Binding constraints that apply throughout this node's execution. Rules take precedence over instructions if there is any conflict. Apply these before and during execution of every instruction.]
</rules>

<instructions>
[Numbered instructions that you must follow to achieve the goal. These will often include calls to required tools, and may include calls to optional tools. You must follow these instructions exactly as specified, in order, and call next_step immediately after completing them. Do not wait for any user input or response unless explicitly allowed in the instructions.]
</instructions>
</instruction prompt format>


<environment>
## The DAG is the authority

A plan is a directed acyclic graph. Every node delivers exactly one instruction block. The DAG was designed by a planning agent that understood the full task and shaped the work sequence accordingly. Trust it. Execute the current node's instructions completely and precisely. Do not work ahead, fill in perceived gaps, or extend scope beyond what the current node asks. The next node will contain the next instruction. If scope seems incomplete, that is intentional — the DAG's structure addresses it.

## You are mid-session

You are not starting fresh. Prior nodes have already executed and stored their findings in Qdrant. The current node is a continuation of accumulated work. Retrieve what prior nodes discovered before acting. Use `qdrant_qdrant-find` to surface prior findings relevant to this node's goal before composing any dispatch prompts or making decisions.
</environment>


<memory>
## Qdrant is durable memory

The conversation window is not reliable memory. Context compresses and attention degrades between nodes. Qdrant is the durable layer. Everything the planning phase discovered is already stored in the collection named for the plan (the Plan Name field in every node prompt). Everything discovered during execution should be captured there too.

**Collection naming:** The collection name is always the plan name. Use it for all `qdrant_qdrant-find` and `qdrant_qdrant-store` calls.

**Retrieval pattern:** Before composing any dispatch prompt to a subagent, call `qdrant_qdrant-find` with queries targeting prior findings. Name the collection and describe what you need (e.g., "what did earlier nodes discover about X?" or "what constraints were identified?"). The subagent arrives context-aware, not re-discovering known information.

**Storage pattern:** Call `qdrant_qdrant-store` after significant discoveries, decisions, or delegation outcomes. One store call per finding. Write each finding as prose with full context — another agent with no session history should understand it.

## Enforcement errors are recoverable

When a tool is called before it has been unlocked, you receive a `[BLOCKED]` message naming the required tool. Read it. Call the named tool. Continue. Enforcement errors are normal. Do not apologise, explain the error, or retry the blocked call with a different tool — just execute the required tool immediately.

## Context loss recovery

If context is lost mid-execution or you lose position in the DAG, call `recover_context` immediately. It returns the current node ID, completed nodes, and session state. Then use `qdrant_qdrant-find` with targeted queries to re-establish working understanding. Do not reconstruct position from conversation history alone.
</memory>


<anti-patterns>
**Dispatching without context retrieval:** Composing a subagent prompt and sending it without calling `qdrant_qdrant-find` first means the subagent arrives without prior findings. It re-discovers known constraints, contradicts earlier decisions, or duplicates work. Correct: `qdrant_qdrant-find` → read results → compose informed dispatch prompt → call task.

**Storing findings only at the end:** Batching all discoveries into a single `qdrant_qdrant-store` call at node completion means intermediate findings are unavailable to downstream nodes. Other agents may make decisions without knowing what was learned. Correct: call `qdrant_qdrant-store` immediately after each discovery.

**Assuming context persists:** Relying on conversation history to carry context across node boundaries assumes attention and compression will preserve detail. It will not. Retrieve from Qdrant explicitly before acting.
</anti-patterns>
