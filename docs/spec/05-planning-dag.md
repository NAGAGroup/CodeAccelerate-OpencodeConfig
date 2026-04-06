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

**Intent:** Delegate to external-scout to gather information from external sources. Formulate a concrete external research plan and present it to the user for approval.

**Enforcement:** `[skill, skill, sequential-thinking_sequentialthinking, question, task]`

The first `skill` loads the `asking-questions` skill (this is the first node where `question` is enforced — the skill teaches how to use it well). The second `skill` loads the `external-scout-delegation` skill. Thinking composes the research query and formulates a concrete plan for what will be researched and why. `question` presents the exact research plan to the user with three explicit options: **Approve** (execute the plan as formulated), **Modify** (user specifies changes to the plan), or **Deny** (skip external research entirely). `task` dispatches external-scout.

**Mandatory formulation principle:** The agent must always produce a research plan at this node — formulation is not optional. The user retains control through the Approve/Modify/Deny options. If the user chooses Deny, the agent dispatches external-scout with a prompt instructing it to return immediately without doing any work. This satisfies the enforcement sequence without requiring a branch. This mandatory-formulation pattern prevents small models from silently assuming they know enough and skipping research unilaterally.

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

The `skill` loads `qdrant-notes`. The first thinking step reasons through what needs to be retrieved and how to query for it. `qdrant_qdrant-find` retrieves the stored findings (multiple calls may be made if needed to gather all relevant context). The second thinking step synthesizes the retrieved context into a coherent understanding ready for DAG design.

**Note:** This node performs the mandatory retrieval for planning. Additional optional Qdrant calls may be made during DAG design (Node 9) or later nodes to refine understanding — those optional calls do not appear in the enforcement sequence.

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

---

## Skill-Loading Architecture

Skill loading has been restructured with a new foundational principle: **every library node (execution DAG component) and every planning prompt is responsible for loading its own relevant skill(s) at the start of its enforcement sequence**. This ensures domain-specific methodology is always fresh in context, regardless of what prior nodes established.

**Planning nodes skill loads:**

| Node | Skill loads | Rationale |
|---|---|---|
| Node 1: Session Overview | `following-plans`, `sequential-thinking` | Establish plan-following and reasoning methodology for the entire planning session |
| Node 2: Orientation Scout | `context-scout-delegation` | Load delegation methodology before dispatching the scout |
| Node 3: External Research | `asking-questions`, `external-scout-delegation` | Load question-formulation and delegation methodology before asking the user and dispatching |
| Node 4: User Questions | None | User questions do not require new methodology; both `question` and `sequential-thinking_sequentialthinking` tools are already established by prior nodes |
| Node 5: Store Notes | None | Note storage does not require new methodology |
| Node 6: Compress | None | Compression is a structural operation without methodology requirements |
| Node 7: Session Overview Refresher | `following-plans`, `sequential-thinking` | Re-establish methodology after context compression for the remaining planning nodes |
| Node 8: Retrieve Notes | `qdrant-notes` | Load notes-retrieval methodology before querying the semantic notes system |
| Node 9: DAG Design | `dag-design` | Load design-specific criteria before dispatching the designer |
| Node 10: DAG Review | `dag-review` | Load review-specific criteria before dispatching the reviewer |
| Node 11: DAG Revision | `dag-design` | Load design criteria again for the revision dispatch |
| Node 12: User Review | None | User review does not require new methodology |
| Node 13: Final Revision | `dag-design` | Load design criteria for the final revision dispatch |
| Node 14: Plan Success | None | Terminal node with no methodology requirements |

**Execution nodes skill loads:**

| Node type | Skill loads | Rationale |
|---|---|---|
| `execution-kickoff` | `following-plans` | Establish execution-phase plan-following methodology |
| `work-item` | `context-scout-delegation` then `juniordev-delegation` or `documentation-expert-delegation` | Load scout methodology, then load the appropriate implementation methodology based on investigation results |
| `project-search-and-analysis` | `context-scout-delegation` or `context-insurgent-delegation` | Load the appropriate investigation methodology based on session context |
| `research` | `external-scout-delegation` | Load research methodology before composing and presenting the research query |
| `deep-research` | `external-scout-delegation` | Load research methodology for extended investigation |
| All other execution nodes | Relevant skill per node (e.g., `qdrant-notes` for retrieval, `tailwrench-delegation` for verification/operations) | Each node loads its required methodology at the start |

**Why this pattern changed:** Library nodes execute in arbitrary order — execution is not guaranteed to follow any fixed sequence. The prior architecture assumed methodology established at kickoff would carry through. This works for foundational methodology (`following-plans`, `sequential-thinking`), but domain-specific skills (delegation skills, `qdrant-notes`, operations skills) must be fresh at the node where they are needed. Making each node load its own skill ensures no gaps and works regardless of DAG shape.

**Critical distinction:** This per-node loading rule is **distinct from** the kickoff-establishes-session-wide-methodology principle. Session-wide methodology (`following-plans`, `sequential-thinking` in planning; `following-plans` in execution) is established once at the start and carries forward. Domain-specific methodologies (delegation, notes-handling, operations) are loaded fresh at every node that needs them. `skill` appears first in all enforcement sequences for nodes that use a skill, ensuring methodology is in context before any task is dispatched.

---

## Planning for Small Models

The planning DAG is structured specifically to work with small models (9B–14B), addressing their strengths and accommodating their common limitations.

### Small-Model Planning Characteristics

**What small models do well in planning:**
- Follow explicit sequences and structural constraints (the enforcement sequences)
- Investigate systematically when given a clear goal and scope
- Synthesize findings from multiple sources when context is compressed and well-organized
- Generate reasonable task-level decisions when the decision criteria are explicit

**Where small models struggle in planning:**
- Maintaining complex context across many conversation turns without compression (solved by Node 6 compress + Node 7/8 refresher pattern)
- Inferring implicit decision criteria (solved by forcing explicit user questions in Node 4)
- Balancing architectural concerns with implementation details (solved by separating dag-designer's planning context from execution — designer never sees implementation details)
- Recovering coherent state after context loss (solved by Qdrant notes + recover_context mechanism)

### Planning Limitations

These are design boundaries, not bugs. The planning DAG does not:
- Generate completely autonomous DAGs without user input. Node 4 requires explicit user questions, forcing the agent to surface unknowns before dag-designer builds structure.
- Support unlimited scope breadth. Node 3 limits external research to one approved query. Node 2's scout is intentionally shallow (step-limited). If scope is truly broad, it will be surfaced in Node 4 for user clarification.
- Handle revisions beyond one round. Node 11 is the final revision round — if changes are needed after that, it's a signal that planning was insufficient and a new session should start.

These limitations are not small-model accommodations — they apply regardless of model size. They reflect design intent: planning should be thorough and bounded, not endless.

---

## Planning Notes Quality Standards

Notes stored to the Qdrant collection during planning determine the quality of execution. Well-formed planning notes:

**Capture explicit decision context, not just findings.** Good note: "During investigation, we found three modules that handle requests. Scout was uncertain whether module C's request handling is still used. User clarified: Module C is deprecated and can be ignored. This matters for DAG structure: don't include verification for Module C." Bad note: "Found three modules, scout wasn't sure about one, user clarified."

**Use specific references when decision-critical.** Good note: "DAG decision point: If verify-auth passes, advance to verify-integration. If verify-auth fails, advance to plan-fail. See plan.jsonl for node IDs." Bad note: "Verification depends on auth passing."

**Distinguish investigation findings from scope decisions.** Good note: "Investigation: The codebase has logging in three places (app.js, auth.js, utils.js). Scope decision: Don't modify logging during implementation." Bad note: "Logging is in three places."

**Phrase notes for retrieval by later queries.** Good note: "Breaking change risk: If we modify the request context object, all three modules that depend on it need verification. This is why the DAG includes separate verify nodes for each module." Bad note: "Modules depend on request context."

**Store notes per discovery, not per session recap.** Good: Multiple individual notes, one per finding. Bad: A single giant note with all findings in it. The Qdrant search system retrieves notes by semantic similarity — multiple specific notes retrieve better than one combined note.

---

## Full 4-Step Autonomous-Work Flow

When `autonomous-work` component nodes are executed (only with explicit user approval):

1. **question** — The agent confirms explicit user approval for autonomous execution. This is a structural gate — autonomous work cannot proceed without this confirmation.
2. **skill** — The `autonomous-agent-delegation` skill is loaded, which explains the autonomous agent's capabilities, constraints, and expected behavior.
3. **sequential-thinking_sequentialthinking** — The executing agent reasons through the dispatch prompt: what context does autonomous-agent need, what are success criteria, what constraints apply.
4. **task** — The autonomous agent is dispatched.

This 4-step flow mirrors the standard delegation flow (`skill` → `thinking` → `task`) but adds an explicit user-approval gate before autonomous work begins. The `question` call serves as a structural requirement that no dispatch of autonomous-agent can occur without returning to the user for approval.

---

## Cursor State Persistence Through recover_context

If HeadWrench experiences context loss after `activate_plan` is called (e.g., due to autocompaction), calling `recover_context` returns:
- The current node ID (the agent's position in the DAG)
- The list of completed nodes
- Session state including the plan name

The DAG position is restored. The agent resumes at the current node with its enforcement sequence reset, allowing completion of any partial work and subsequent advancement. This is why `recover_context` is globally exempt — it can be called at any time to restore session state without triggering enforcement errors.
