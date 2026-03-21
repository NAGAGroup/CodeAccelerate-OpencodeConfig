<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 01: Update plan-design-guidelines.md — Terminal Nodes Rule

## Objective

Extend the "Terminal Nodes" section of `plan-design-guidelines.md` so it explicitly instructs planning agents that the **final node of any generated session plan** must omit the `next` field. The current text covers terminal nodes in the context of the planning workflow DAG itself, but does not address generated plans. This gap causes executing agents to be unable to close out sessions.

## Scope

**File:** `planning/plan-design-guidelines.md`

Read the current "Terminal Nodes" section before editing. The existing text is:

> A node with no `next` field is terminal. When `next_step()` is called on a terminal node, the DAG transitions to `complete` and instructs the agent to call `close_session()`.

Extend this section to include an explicit rule that applies to generated session plans. The addition should:

1. State clearly that the **last node in every generated session plan must have NO `next` field**
2. Explain the consequence of omitting the rule: executing agents cannot call `close_session()` and the session cannot close
3. Call out that this applies regardless of what the final subtask is named
4. Add a **Bad/Good example** showing a terminal node with `next` (bad) and without (good)

Place the addition immediately after the existing terminal node paragraph, before the "### Loop Nodes" section.

## Constraints

- You MUST NOT modify any content outside the "Terminal Nodes" section
- You MUST NOT change the existing paragraph — only add after it
- Match the existing documentation style and heading depth
- Do not add emojis

## Todolist

- [ ] Read `planning/plan-design-guidelines.md` — locate the "Terminal Nodes" section
- [ ] Write the addition after the existing terminal node paragraph
- [ ] Verify the "Loop Nodes" section immediately follows (no content was displaced)

## Delegation

**Agent:** @QuickDoc
**Model:** haiku-like
**Prompt structure:**
- Read: `planning/plan-design-guidelines.md` (Terminal Nodes section and surrounding context)
- Goal: Add an explicit rule that terminal nodes in generated session plans must omit `next`, with a Bad/Good example
- Constraints: Additive only; do not change existing text; match doc style
- Verify: "Terminal Nodes" section now covers both planning DAG nodes and generated session plan nodes

## Advance

Call `next_step()` when this subtask is complete. Do this exactly once. Do NOT read session files or DAG state to determine whether to advance. Do NOT take any other action before or after calling `next_step()`.
