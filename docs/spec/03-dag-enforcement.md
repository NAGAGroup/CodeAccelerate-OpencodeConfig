# DAG Enforcement Engine

The DAG enforcement engine is a component of the planning-enforcement plugin. It constrains tool access during DAG execution by tracking which tools have been called in the current node and blocking calls that arrive out of order.

**DAG enforcement applies to headwrench only.** The enforcement engine blocks non-exempt tools when headwrench is executing DAG nodes (in planning or execution mode). Subagents dispatched via the `task` tool do not run under DAG enforcement — they operate under their own agent permission constraints and have no enforcement sequences. The globally exempt tools are available to headwrench during DAG execution; subagents are available the tools defined in their agent files.

The enforcement engine operates independently of agent permissions. Both systems must allow a tool call for headwrench to succeed during DAG execution:

1. **Agent permissions** — defined in the agent file's YAML frontmatter. Static. Does not change during execution. If an agent's permissions deny a tool, the call fails regardless of what the enforcement engine would allow.
2. **DAG enforcement** — defined by the enforcement sequence of the current node. Dynamic. Changes at each node transition. If the engine blocks a tool because a prerequisite has not been met, the call fails regardless of what agent permissions would allow.

An agent with permission to use `task` can still be blocked from calling it if the enforcement sequence has unsatisfied prerequisites ahead of it. An agent without permission to use `bash` will always fail on `bash` calls even if the enforcement sequence would allow it.

---

## Globally Exempt Tools

These tools are never blocked by the enforcement engine. They can be called at any time, in any node, any number of times, regardless of the current enforcement sequence state.

- `sequential-thinking_sequentialthinking` — step-by-step reasoning
- `question` — ask the user
- `qdrant_qdrant-store` — store to semantic notes
- `qdrant_qdrant-find` — retrieve from semantic notes
- `recover_context` — recover DAG session context

**Rationale for global exemption:** These tools enable agents to think, communicate, remember, and recover — fundamental capabilities that should never be constrained by enforcement sequences. This is not a small-model accommodation (though small models do benefit). It is a universal design principle: the enforcement engine constrains tool *sequences* to ensure structural invariants, not the *use* of metadata, reasoning, and communication tools. An agent that needs to think through a problem should never be blocked from calling the thinking tool by an enforcement sequence. An agent that needs to store findings should never be blocked from calling the store tool. Exempting these globally keeps them always available as agent judgment warrants.

**Note on Qdrant availability:** The Qdrant tools (`qdrant_qdrant-store` and `qdrant_qdrant-find`) are available to all agents and subagents that include them in their permission list. For headwrench executing DAG nodes, these tools are globally exempt and never blocked by DAG enforcement. For subagents dispatched via the `task` tool, Qdrant access is governed only by their agent permissions — DAG enforcement does not apply to subagents.

Exempt tools can also appear in enforcement sequences as **positional requirements** (see below). When they do, calling them is never blocked — but a call made before that position in the sequence does not satisfy the positional requirement.

### Special case: next_step

`next_step` is treated as implicitly required at the end of every node. It does not appear in enforcement sequences and is not part of the enforcement sequence. Its blocking behavior is unique: `next_step` is blocked until every position in the current node's enforcement sequence has been satisfied. Once the sequence is fully satisfied, `next_step` is the only valid DAG-advancing action — calling other non-exempt tools after the sequence is complete will result in a `[DAG BLOCKED]` error directing the agent to call `next_step`.

**Clarity on enforcement status:** `next_step` is not part of enforcement sequences. It is implicit and always available for calling once prerequisites are met. This ensures that agents can always advance the DAG after completing their work, while preventing premature advancement before all required work is done. The enforcement engine blocks `next_step` only while the sequence is incomplete — never due to something being "required" in the sequence itself.

---

## Enforcement Pattern: Minimum + Optional Enrichment

The enforcement sequence specifies the **minimum required work** for a node to be considered complete. Calling `next_step` is possible only after every position in the enforcement sequence has been satisfied. However, the enforcement sequence does not prohibit additional work.

**Key principle:** Enforcement is a floor, not a ceiling. An agent may call additional exempt tools, may dispatch subagents beyond what is enforced, or may perform other reasoning steps that the enforcement sequence does not require. The enforcement sequence ensures essential work occurs; optional enrichment remains the agent's choice.

For example, a `work-item` node's enforcement sequence is `[task, skill, sequential-thinking_sequentialthinking, task]` — scout first, then implement. An agent satisfies this by calling these four tools in order. The agent may also:
- Call `question` multiple times (exempt tool, can be called anytime)
- Call `qdrant_qdrant-find` to retrieve context (exempt tool)
- Call `sequential-thinking_sequentialthinking` additional times beyond the one enforced position (exempt tool)
- Dispatch additional subagents after the second `task` but before calling `next_step` (not prohibited by enforcement)

The enforcement engine is a structural gate, not a behavioral ceiling. It ensures essential invariants are met without constraining optional work beyond those invariants.

---

## Small-Model Motivation for Enforcement Sequences

Small language models (9B–14B) excel at following explicit structural constraints but struggle with implicit expectations. A prompt saying "investigate before implementing" is guidance. An enforcement sequence that blocks implementation calls until investigation is complete is a structural guarantee.

This is not a limitation accommodation — it is a design principle that improves reliability across all model sizes. Large models can infer the intended sequence from prose. Small models need the sequence made explicit. By encoding the sequence as an enforcement gate, both large and small models benefit:
- Small models: guaranteed correctness through structure, not inference
- Large models: freed from the overhead of reasoning about which step comes next — they can focus on what to do at the current step

**For implementers:** Enforcement sequences exist to catch deviations early and provide actionable error messages. They are not present to distrust agents — they are present to make correct behavior the path of least resistance.

---

## Enforcement Sequences (Detailed)

Each node has an enforcement sequence — an ordered list of tool identifiers that must be called to complete the node. Sequences are stored in `plan.jsonl` as arrays of exact callable tool identifiers (not shorthands).

**Non-exempt tools** in the sequence are blocked until all prior positions have been satisfied. Calling a blocked non-exempt tool returns a `[DAG BLOCKED]` error.

**Exempt tools** in the sequence act as soft gates. They are never blocked, but a non-exempt tool that follows an exempt tool's position in the sequence cannot proceed until the exempt tool has been called at least once at that position. An early call to an exempt tool — before its position in the sequence — does not satisfy the positional requirement.

The enforcement engine maintains a cursor through the sequence. Each position is satisfied when its tool is called while all prior positions are already satisfied. The node is complete when every position has been satisfied.

### Example

Sequence: `[skill, sequential-thinking_sequentialthinking, task]`

- Position 1: `skill` (non-exempt). Blocked by nothing — it is the first position. Must be called first.
- Position 2: `sequential-thinking_sequentialthinking` (exempt). Never blocked. But `task` at position 3 cannot be called until position 2 is satisfied.
- Position 3: `task` (non-exempt). Blocked until positions 1 and 2 are satisfied.
- `next_step` cannot be called until all three positions are satisfied.

If the agent calls `sequential-thinking_sequentialthinking` before calling `skill`, that early call does not satisfy position 2. When `skill` is called (satisfying position 1), the agent still needs to call `sequential-thinking_sequentialthinking` again to satisfy position 2.

---

## Error Message Format

When a blocked non-exempt tool is called:

```
[DAG BLOCKED] Cannot call <tool_name> — prerequisite not met.
Call <expected_tool> first to continue.
```

When the sequence is fully satisfied and the agent calls a non-exempt tool other than `next_step`:

```
[DAG BLOCKED] All required calls for node "<node_id>" are complete.
Call next_step to advance to the next node.
```

When `next_step` is called at a branching node without specifying the `next` parameter:

```
[BRANCH REQUIRED] Node "<node_id>" has multiple children.
Call next_step with the next parameter. Valid options: [<child_id_1>, <child_id_2>, ...].
```

These error messages are the primary recovery mechanism. The `following-plans` skill teaches agents to read error messages and call the tool the system expects next. Error messages are designed to be actionable — they name the exact tool to call.

---

## What the Enforcement Engine Does NOT Do

- It does not interpret or execute prompts. Prompts are text delivered to the agent.
- It does not enforce prompt content. The agent can reason however it wants within a node.
- It does not track exempt tool call counts beyond positional requirements. If an exempt tool appears once in the sequence, one call at the correct position satisfies it. Additional calls elsewhere are untracked.
- It does not prevent the agent from calling exempt tools at any time for any reason.
- It does not manage agent permissions. That is the OpenCode framework's responsibility.
- It does not block `next_step` after the sequence is satisfied — only before.

---

## Enforcement Sequence Token Reference

Enforcement sequences in this spec and in `plan.jsonl` use exact callable identifiers. The following table maps the readable names used in this document's prose to those identifiers.

| Readable name | Callable identifier | Provider | Globally Exempt |
|---|---|---|---|
| question | `question` | OpenCode built-in | Yes |
| thinking | `sequential-thinking_sequentialthinking` | MCP: Sequential Thinking | Yes |
| qdrant-store | `qdrant_qdrant-store` | MCP: Qdrant | Yes |
| qdrant-find | `qdrant_qdrant-find` | MCP: Qdrant | Yes |
| recover-context | `recover_context` | Planning-enforcement plugin | Yes |
| skill | `skill` | OpenCode built-in | No |
| task | `task` | OpenCode built-in | No |
| compress | `compress` | DCP plugin | No |
| choose_plan_name | `choose_plan_name` | Planning-enforcement plugin | No |
| init_dag | `init_dag` | Planning-enforcement plugin | No |
| show_dag | `show_dag` | Planning-enforcement plugin | No |
| show_compact_dag | `show_compact_dag` | Planning-enforcement plugin | No |
| present_compact_dag_to_user | `present_compact_dag_to_user` | Planning-enforcement plugin | No |

All other tool identifiers (e.g., `grepai_grepai_search`, `validate_dag`) are used as-is in enforcement sequences.

Readable names in prose are for human comprehension only. They must never appear in `plan.jsonl` or in tool call parameters.
