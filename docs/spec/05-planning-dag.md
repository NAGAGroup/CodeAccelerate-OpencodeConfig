# Planning DAG

The planning DAG is a fixed, hand-authored 14-node workflow. It is not assembled from the component library — every node has an enforcement sequence tuned specifically for its position in the planning flow. The planning DAG is stored as a global template in the system config and copied to `.opencode/session-plans/planning-session_{id}/` when HeadWrench calls the `plan_session` tool in response to the `/plan-session` slash command.

---

## Enforcement Model

The planning DAG uses the same enforcement engine as execution DAGs (see doc 03). The following notes are specific to the planning DAG context.

**Globally exempt tools** are never blocked and can be called at any time in any node: `sequential-thinking_sequentialthinking`, `question`, `qdrant_qdrant-store`, `qdrant_qdrant-find`, `next_step`, `recover_context`.

**Non-exempt tools** are blocked until all prior positions in the enforcement sequence have been satisfied.

A node is complete when every position in its enforcement sequence has been satisfied and `next_step` has been called.

---

## Node 1: Session Overview

**Intent:** Load the plan-following and sequential-thinking skills, engage with their content through reasoning, and choose the execution plan name based on the user's stated goal.

**Enforcement:** `[skill, skill, sequential-thinking_sequentialthinking, choose_plan_name]`

The first `skill` call loads the `following-plans` skill. The second loads the `sequential-thinking` skill. After reasoning through both skills, the agent calls `choose_plan_name` with a descriptive name reflecting the user's goal. All remaining planning prompts are immediately updated with `{{PLAN_NAME}}`.

---

## Node 2: Orientation Scout

**Intent:** Delegate to context-scout to build broad understanding of the project and the user's goal. The scout returns a prose briefing with findings, relationships, and uncertainties.

**Enforcement:** `[skill, sequential-thinking_sequentialthinking, task]`

The `skill` call loads the `context-scout-delegation` skill. Thinking reasons through what the scout needs to know and what it should return. `task` dispatches context-scout.

---

## Node 3: External Research

**Intent:** Delegate to external-scout to gather information from external sources. Present the exact research query to the user for IP approval before dispatching.

**Enforcement:** `[skill, skill, sequential-thinking_sequentialthinking, question, task]`

The first `skill` loads the `asking-questions` skill (this is the first node where `question` is enforced — the skill teaches how to use it well). The second `skill` loads the `external-scout-delegation` skill. Thinking composes the research query. `question` presents the exact query to the user for IP approval. `task` dispatches external-scout.

If the user chooses to skip external research, the agent dispatches external-scout with a prompt instructing it to return immediately without doing any work. This satisfies the enforcement sequence without requiring a branch.

---

## Node 4: User Questions

**Intent:** Surface unknowns that only the user can answer — intent, priorities, constraints, scope boundaries. The mandatory minimum is confirming the agent's understanding of the task scope. Must not ask implementation questions (those are for the DAG design agent to handle).

**Enforcement:** `[sequential-thinking_sequentialthinking, question]`

Thinking reasons through what is still unknown. `question` surfaces those unknowns to the user.

---

## Node 5: Store Notes

**Intent:** Store all significant findings, decisions, and constraints from the investigation phases to the semantic notes system before compression erases them from the context window.

**Enforcement:** `[qdrant_qdrant-store]`

One `qdrant_qdrant-store` call satisfies this position, but the agent should make as many calls as needed — one per significant finding, decision, or constraint. The enforcement sequence ensures at least one store call occurs; the agent's judgment determines the total.

---

## Node 6: Compress

**Intent:** Compress closed conversation sections to free context window space before DAG design. The semantic notes system handles persistence — everything worth keeping has been stored. Compression is purely about context window management.

**Enforcement:** `[compress]`

---

## Node 7: Session Overview Refresher

**Intent:** Realign the agent after context compression. Reload the plan-following and sequential-thinking skills and re-engage with their content. The planning context was stored to semantic notes in Node 5 and will be retrieved in Node 8 — this node's job is to restore the agent's methodology skills only.

**Enforcement:** `[skill, skill, sequential-thinking_sequentialthinking]`

The first `skill` loads `following-plans`. The second loads `sequential-thinking`. Thinking re-engages with the skills' content and re-establishes the agent's understanding of its role and methodology.

---

## Node 8: Retrieve Notes

**Intent:** Re-establish all planning context from the investigation phases. The agent loads the `qdrant-notes` skill, reasons through its guidance, then queries the semantic notes system to retrieve the goal, scope boundaries, investigation findings, and user decisions. The agent should emerge with a clear picture of everything relevant before entering DAG design.

**Enforcement:** `[skill, sequential-thinking_sequentialthinking, qdrant_qdrant-find, sequential-thinking_sequentialthinking]`

The `skill` loads `qdrant-notes`. The first thinking step reasons through what needs to be retrieved and how to query for it. `qdrant_qdrant-find` retrieves the stored findings. The second thinking step synthesizes the retrieved context into a coherent understanding ready for DAG design.

---

## Node 9: DAG Design

**Intent:** Initialize the execution DAG and dispatch the dag-designer subagent to build it node by node.

**Enforcement:** `[skill, init_dag, sequential-thinking_sequentialthinking, task]`

The `skill` loads the `dag-design` delegation skill. `init_dag` creates `plan.jsonl` with the execution-kickoff root node — this must happen before dispatching the designer, who will begin adding nodes immediately. Thinking reasons through the dispatch prompt: what context the designer needs, what the goal is, what constraints apply, what components are likely appropriate. `task` dispatches dag-designer.

---

## Node 10: DAG Review

**Intent:** Dispatch dag-reviewer to evaluate the completed DAG against the review criteria. The reviewer never saw the designer's reasoning — only the output. This independence is intentional.

**Enforcement:** `[skill, sequential-thinking_sequentialthinking, task]`

The `skill` loads the `dag-review` delegation skill. Thinking composes the dispatch prompt, including the `plan_name` and any task context that helps the reviewer assess structural appropriateness. `task` dispatches dag-reviewer.

---

## Node 11: DAG Revision

**Intent:** Dispatch dag-designer again with the reviewer's critique. The designer must address every critique point explicitly. One revision round only.

**Enforcement:** `[skill, sequential-thinking_sequentialthinking, task]`

The `skill` loads the `dag-design` delegation skill. Thinking composes the dispatch prompt incorporating the reviewer's critique. `task` dispatches dag-designer.

---

## Node 12: User Review

**Intent:** Present the completed DAG to the user for approval. Branch to plan-success if approved, or to final-revision if the user requests changes.

**Enforcement:** `[present_compact_dag_to_user, question]`

`present_compact_dag_to_user` renders the compact DAG as visible conversation content (both user and agent can see it). `question` asks the user whether the plan is approved or requires changes. If disapproved, the agent asks what needs to change and stores the feedback using `qdrant_qdrant-store` before calling `next_step`.

**Branching node.** Children: `plan-success` (approved) and `final-revision` (changes requested). The node's prompt encodes the branch parameters explicitly so the agent knows which `next_step` value corresponds to each outcome.

---

## Node 13: Final Revision

**Intent:** Retrieve the user's feedback and dispatch dag-designer one final time. The result is accepted unconditionally — there is no further review cycle.

**Enforcement:** `[qdrant_qdrant-find, skill, sequential-thinking_sequentialthinking, task]`

`qdrant_qdrant-find` retrieves the user's feedback stored at Node 12. The `skill` loads the `dag-design` delegation skill. Thinking incorporates the user's specific requests into the dispatch prompt. `task` dispatches dag-designer.

---

## Node 14: Plan Success

**Intent:** Confirm what was accomplished, provide the plan name for use with `/activate-plan`, and note any deferred items or known limitations.

**Enforcement:** `[]`

Terminal node. No required tool calls. The agent provides a summary in its response.

---

## Planning DAG Structure

```
Node 1: Session Overview
Node 2: Orientation Scout
Node 3: External Research
Node 4: User Questions
Node 5: Store Notes
Node 6: Compress
Node 7: Session Overview Refresher
Node 8: Retrieve Notes
Node 9: DAG Design
Node 10: DAG Review
Node 11: DAG Revision
Node 12: User Review  [branch]
    ├── Node 14: Plan Success   (approved)
    └── Node 13: Final Revision (changes requested)
            └── Node 14: Plan Success
```

Nodes 1–11 are linear. Node 12 branches. Node 14 is the terminal for both paths.
