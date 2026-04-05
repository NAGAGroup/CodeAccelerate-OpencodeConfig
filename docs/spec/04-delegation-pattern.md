# Delegation Pattern and Skills

This document defines how agents dispatch subagents, what skills exist, and how the two systems connect.

---

## Delegation Overview

When HeadWrench or a specialized planning subagent needs to perform work it cannot or should not do inline — investigation, implementation, external research — it dispatches a subagent using the `task` tool. The dispatching agent writes a prompt, chooses a `subagent_type`, and receives a single response when the subagent finishes.

Delegation is mediated by **delegation skills**. Before dispatching, the agent loads the appropriate delegation skill via the `skill` tool. The skill teaches the agent what the target subagent can and cannot do, what a good dispatch prompt looks like, and what to expect back. The agent then reasons through its dispatch prompt using `sequential-thinking_sequentialthinking` before calling `task`.

This pattern produces tailored delegations without encoding all context into a template. The skill teaches methodology; the agent's reasoning fills in specifics at runtime.

---

## Skill Categories

### Methodology Skills

Teach how to use a tool or follow a workflow correctly. Loaded by agents when they need structured guidance on a recurring task.

| Skill | Purpose |
|---|---|
| `following-plans` | How to operate in DAG mode: read enforcement errors, call the expected tool, use `next_step`, recover from context loss. The primary plan-following methodology skill. |
| `sequential-thinking` | How to use `sequential-thinking_sequentialthinking` effectively: when to revise thoughts, how to adjust total estimates, common anti-patterns. |
| `asking-questions` | How to use the `question` tool without overloading it: what belongs in a question vs. what can be inferred, how to batch related questions. |
| `qdrant-notes` | How to store and retrieve session knowledge: what to store, how to phrase queries for good retrieval, collection naming. |
| `grepai` | How to use the GrepAI semantic search and code intelligence tools: when to use semantic search vs. RPG graph exploration vs. call tracing, how to interpret results, and how to combine tools for thorough investigation. |

### Delegation Skills

Teach how to dispatch a specific subagent. Each delegation skill maps to exactly one `subagent_type`. An agent loads the delegation skill for the subagent it intends to dispatch, then uses that knowledge to write the dispatch prompt.

| Skill | subagent_type | Target agent |
|---|---|---|
| `context-scout-delegation` | `context-scout` | context-scout |
| `context-insurgent-delegation` | `context-insurgent` | context-insurgent |
| `juniordev-delegation` | `junior-dev` | junior-dev |
| `documentation-expert-delegation` | `documentation-expert` | documentation-expert |
| `external-scout-delegation` | `external-scout` | external-scout |
| `tailwrench-delegation` | `tailwrench` | tailwrench |
| `autonomous-agent-delegation` | `autonomous-agent` | autonomous-agent |
| `dag-design` | `dag-designer` | dag-designer |
| `dag-review` | `dag-reviewer` | dag-reviewer |

---

## Delegation Flow

The standard delegation sequence, used in all `work-item`, `project-search-and-analysis`, `research`, and similar component nodes:

1. Load the delegation skill for the target subagent using the `skill` tool.
2. Use `sequential-thinking_sequentialthinking` to reason through: what context the subagent needs, what it should investigate or accomplish, what a good prompt looks like based on the skill's guidance.
3. Write the dispatch prompt.
4. Call `task` with the appropriate `subagent_type` and the written prompt.

The enforcement sequence for such nodes encodes this flow structurally. For example, `[skill, sequential-thinking_sequentialthinking, task]` enforces that the skill is loaded before reasoning, and reasoning occurs before dispatch.

---

## Dispatch Prompt Requirements

Every dispatch prompt must include:

- **The goal** — what the subagent should accomplish or investigate. Specific enough that the subagent can determine when it is done.
- **Relevant context** — what the dispatching agent already knows that the subagent needs. Do not make the subagent re-discover what is already known.
- **Scope boundaries** — what to focus on and what to leave alone.
- **What to report back** — what the dispatching agent needs from the response.

### Format guidance by subagent type

**For context-scout and context-insurgent:** Ask for prose findings with an uncertainties section. No file trees, no raw grep output, no lists of file names. The scout should synthesize what it found, why it matters, and what it could not determine.

**For junior-dev:** Provide a goal and context, not surgical editing instructions. The subagent investigates and decides how to accomplish the goal. Specifying exact line numbers or diff hunks bypasses the investigation step that gives junior-dev its reliability.

**For documentation-expert:** Provide the goal, the relevant file paths if known, and any style or format constraints.

**For tailwrench:** Provide specific verification criteria or commands to run. Tailwrench is step-limited (30 steps), so clarity prevents wasted steps on self-directed investigation.

**For external-scout:** Provide the exact research query. The IP approval gate (the `question` call before dispatch, enforced in research component nodes) ensures the user has approved this query before it is sent.

**For dag-designer:** Provide the full planning context: user goal, scope boundaries, investigation findings, user decisions, and any constraints on the DAG structure. The designer has access to the component catalogue and design guide but does not have access to the planning session's conversation — everything relevant must be in the dispatch prompt. Also specify the `plan_name` so the designer can call `add_node` with the correct identifier.

**For dag-reviewer:** Provide the `plan_name` to review. The reviewer loads the `dag-review` skill which contains the review criteria. HeadWrench must include the plan name and any context about the intended task that would help the reviewer assess whether the DAG structure is appropriate.

---

## The IP Approval Gate

The IP (intellectual property) approval gate is the pattern of presenting a research query to the user before dispatching `external-scout`. It is not a separate technical mechanism — it is enforced structurally by the `question` call that precedes `task` in the `research` component's enforcement sequence (`[skill, sequential-thinking_sequentialthinking, question, task]`).

The agent presents the exact query it intends to send to external-scout. The user can:
- **Approve** — the agent dispatches external-scout with the query as-is.
- **Modify** — the agent adjusts the query and dispatches with the modified version.
- **Skip** — the agent dispatches external-scout with a prompt instructing it to return immediately without doing any work. This satisfies the enforcement sequence (task has been called) without performing actual external research.

The skip path is intentional: it avoids requiring a branch in the DAG for what is a common user preference.

---

## Skill Design Requirements

These requirements govern the authorship of new skills.

**Length:** 50–100 lines. Skills are loaded into recent context where attention is high. Excessive length dilutes the critical instructions. A skill exceeding 100 lines is probably teaching too many things and should be split.

**Concrete examples required:** Skills must include examples with exact tool syntax. Small models need to see exact parameter names and values, not abstract descriptions.

**Delegation skills must document limits:** What the target agent can do, what it cannot do. The dispatching agent needs the subagent's limits to write a sound prompt. "context-scout is read-only — it cannot make changes" prevents dispatch prompts that ask the scout to fix things.

**Delegation skills must include bad examples:** Show "Bad — too vague: 'Investigate the project'" alongside the good version. Bad examples teach the specific failure modes that small models hit: vague scope, missing context, asking the agent to do something outside its permissions.

**Methodology skills should document anti-patterns:** Name the pattern, describe what it looks like, explain why it fails. Generic "do it well" guidance is significantly less effective.

**No duplication with agent prompts:** Agent prompts define identity and hard constraints. Skills teach methodology. If both say the same thing, one is redundant. The agent prompt should state the constraint; the skill should teach how to operate effectively within it.
