# Delegation Pattern and Skills

This document defines how agents dispatch subagents, what skills exist, and how the two systems connect.

---

## Delegation Overview

When HeadWrench or a specialized planning subagent needs to perform work it cannot or should not do inline — investigation, implementation, external research — it dispatches a subagent using the `task` tool. The dispatching agent writes a prompt, chooses a `subagent_type`, and receives a single response when the subagent finishes.

Subagents are competent specialists. They load the relevant delegation skill to understand their capabilities and constraints. They query Qdrant to retrieve accumulated knowledge from the session. They use investigative tools and reasoning to understand context. They decide how to accomplish the goal and report back. The dispatch prompt provides the goal and sufficient context, not a recipe of steps to follow.

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

A well-formed dispatch prompt briefs a competent specialist: here is the goal, here is why it matters, here is the scope, here is the context you need. Subagents are expected to read the delegation skill themselves, query Qdrant for accumulated session knowledge, explore the codebase as needed, and decide how to accomplish the goal. Trust them to figure out implementation details, file locations, search strategies, and sequencing.

Every dispatch prompt must include:

- **The goal** — what the subagent should accomplish or investigate. Specific enough that the subagent can determine when it is done.
- **Relevant context** — what the dispatching agent already knows that the subagent needs. Do not make the subagent re-discover what is already known.
- **Scope boundaries** — what to focus on and what to leave alone.
- **What to report back** — what the dispatching agent needs from the response.

When dispatching within a plan session, the prompt must also include:

- **The Qdrant collection name** — the plan name, so the subagent can retrieve accumulated knowledge from prior work and store findings when done.

**Subagent results are returned as a direct message** to the dispatching agent, not written to files or summary documents. The dispatch prompt should specify what the agent should include in its response message. In plan sessions, the dispatching agent always provides the plan name (the Qdrant collection name) in the dispatch prompt. The subagent uses this to retrieve accumulated session knowledge from the collection using `qdrant_qdrant-find` before starting work, and stores its findings to the collection using `qdrant_qdrant-store` when done. In free-form work outside plan sessions, Qdrant instructions are not included in dispatch prompts.

### Format guidance by subagent type

**For context-scout and context-insurgent:** Ask for prose findings with an uncertainties section. Provide the goal (what should be investigated and why), relevant context about what has been discovered so far, and scope boundaries. The scout should synthesize what it found, why it matters, and what it could not determine. Do not prescribe investigative methods or search queries.

**For junior-dev:** Provide a goal and context, not surgical editing instructions. State what needs to be achieved and why. The subagent investigates and decides how to accomplish the goal. Specifying exact line numbers or diff hunks bypasses the investigation step that gives junior-dev its reliability.

**For documentation-expert:** Provide the goal, the relevant file paths if known, and any style or format constraints. Let the subagent determine how to structure the work.

**For tailwrench:** Provide the goal — what verification needs to happen or what command needs to succeed — along with context about why it matters and any constraints. Tailwrench is step-limited (30 steps), so clear goal framing prevents wasted steps on discovering what success looks like. Let the subagent decide how to verify and what commands to run.

**For external-scout:** Provide the exact research query. The IP approval gate (the `question` call before dispatch, enforced in research component nodes) ensures the user has approved this query before it is sent.

**For dag-designer:** Provide the full planning context: user goal, scope boundaries, investigation findings, user decisions, and any constraints on the DAG structure. The designer has access to the component catalogue, design guide, and direct codebase investigation tools — but does not have access to the planning session's conversation, so everything relevant must be in the dispatch prompt. Also specify the `plan_name` so the designer can call `add_node` with the correct identifier.

**For dag-reviewer:** Provide the `plan_name` to review. The reviewer loads the `dag-review` skill which contains the review criteria. HeadWrench must include the plan name and any context about the intended task that would help the reviewer assess whether the DAG structure is appropriate. The reviewer investigates the codebase directly — no delegation is needed in the dispatch prompt.

---

## The IP Approval Gate

The IP (intellectual property) approval gate is the pattern of presenting a research query to the user before dispatching `external-scout`. It is not a separate technical mechanism — it is enforced structurally by the `question` call that precedes `task` in the `research` component's enforcement sequence (`[skill, sequential-thinking_sequentialthinking, question, task]`).

The agent presents the exact query it intends to send to external-scout. The user can:
- **Approve** — the agent dispatches external-scout with the query as-is.
- **Modify** — the agent adjusts the query and dispatches with the modified version.
- **Skip** — the agent dispatches external-scout with a prompt instructing it to return immediately without doing any work. This satisfies the enforcement sequence (task has been called) without performing actual external research.

The skip path is intentional: it avoids requiring a branch in the DAG for what is a common user preference.

---

## Delegation Guidance by Subagent Type

### Wide-Shallow Investigation: context-scout

**What it does:** Fast, broad investigation across many areas. Surveys the codebase, identifies relationships, returns prose briefings with uncertainties sections.

**When to dispatch:** When you need a quick understanding of what exists and how it relates. Before detailed problem analysis. When you need to know what's unclear before asking the user. Use this early and often in investigations.

**What makes a good dispatch prompt:**
- Clear scope: "Investigate the authentication module and its dependencies" not "Investigate the project"
- Specific question: "How does the session token flow through the request lifecycle?" not just "Look at the session module"
- Relevant context: "The user reports login failures on Safari. The team suspects a cookie-domain issue."
- What to report: "Return findings about the auth flow, any cross-browser issues you spot, and uncertainties we need to clarify with the user"

**What scout cannot do:** Read files directly, trace deep call chains, edit files. Scout is read-only and fast — it trades depth for speed.

---

### Narrow-Deep Analysis: context-insurgent

**What it does:** Traces cross-file dependencies, audits constraints, synthesizes complex findings across many sources. Returns detailed analytical reports.

**When to dispatch:** When you need thorough understanding of a complex area before implementing. When scout's breadth isn't enough. When you need specific dependency chains or cross-module logic traced. Use this when investigation directly blocks the implementation.

**What makes a good dispatch prompt:**
- Specific investigation goal: "Understand all callers of the `handleRequest` function to ensure our change won't break them" not "Trace all the dependencies"
- Context from prior findings: "Scout found three modules that call the auth flow. Investigate their specific use cases."
- Scope boundaries: "Focus on the request lifecycle in these three modules. Don't investigate logging or monitoring."
- What to report: "For each caller, explain what request types it sends and what token formats it expects. Flag any edge cases."

**What insurgent cannot do:** Edit files, create changes. Insurgent is pure analysis — depth without mutation.

---

### Goal-Oriented Implementation: junior-dev

**What it does:** Investigates to understand context, then makes targeted code edits to achieve the goal. Returns a summary of what changed and what was found.

**When to dispatch:** When you have a clear implementation goal. When investigation is complete and direction is decided. When the goal is narrowly scoped (affects 1–3 files, 1–2 functions, or a small feature area).

**What makes a good dispatch prompt:**
- Clear goal: "Add a new field `requestId` to the request context object and ensure it persists through the request lifecycle" not "Update the auth flow"
- Relevant context: "Scout found that request context is passed through these three modules. Here's what the current structure looks like."
- Scope: "Focus on the request object definition and the three modules that pass it. Don't modify logging or monitoring."
- What to report: "What files you changed, what you changed in each, any issues you encountered, and any follow-up work this created"

**What junior-dev cannot do:** Shell operations, git commits, verification. Junior-dev writes code; other agents verify and integrate.

---

### Documentation and Config: documentation-expert

**What it does:** Writes and edits documentation, configuration files, prompt files, and structured text. Returns confirmation of what was changed.

**When to dispatch:** When you need to document changes, update configuration, or write new documentation. When content is primarily prose or structured configuration.

**What makes a good dispatch prompt:**
- Clear goal: "Document the new requestId field in the API contract documentation and add an example to the request-handling guide" not "Update the docs"
- File paths if known: "The API contract is in `docs/api-contract.md`. The request-handling guide is in `docs/guides/request-handling.md`."
- Style or format constraints: "Keep examples concise (3–4 lines). Follow the existing parameter documentation format."
- What to report: "What files you edited, what you added or changed, and whether anything needs follow-up."

**What documentation-expert cannot do:** Edit code files (in the implementation sense), run shell commands, verify changes. Expert handles documentation and configuration only.

---

### External Research: external-scout

**What it does:** Searches public web sources and reads documentation. Returns research findings with links and citations.

**When to dispatch:** When you need external information not in the codebase. Library documentation, framework best practices, SDK specifications, third-party APIs, dependency compatibility information.

**What makes a good dispatch prompt:**
- Exact research query: "Find the Node.js cookie RFC specifications for SameSite attribute restrictions" not "Look up cookie information"
- Context: "We're implementing custom cookie handling and need to understand SameSite constraints for Safari"
- Scope: "Return the relevant RFC sections, browser compatibility matrix, and at least two examples of correct implementation"
- What to report: "The key findings, relevant links, and implementation examples"

**What external-scout cannot do:** Access project files, examine codebase, make changes. Scout is external-only — it cannot see your code.

---

### Verification and Operations: tailwrench

**What it does:** Runs shell commands, verifies implementations, manages git operations. Returns success/failure confirmation and operation logs.

**When to dispatch:** For verification after implementation, running tests, adding dependencies, running build scripts, committing changes, checking system state.

**What makes a good dispatch prompt:**
- Clear goal: "Verify that the new requestId field is correctly populated in all three modules by running the test suite with verbose output" not "Run tests"
- What success looks like: "All tests pass. No new warnings or errors compared to the baseline."
- Specific commands if needed: "Run `npm test -- --verbose` first, then `npm run lint` to check for any new linting issues"
- Scope: "30 steps max — if tests take longer than that, summarize and report what's blocking"

**What tailwrench cannot do:** Design changes, make editorial decisions. Tailwrench executes specific commands and reports results — it doesn't decide what to do next.

---

### Fully Autonomous Work: autonomous-agent

**What it does:** Takes any action with no tool restrictions or step limits. Use only with explicit user approval during planning.

**When to dispatch:** Only when the user has explicitly requested autonomous work during planning. This is an escape hatch for complex multi-phase work that doesn't fit standard components. Use very sparingly.

**What makes a good dispatch prompt:**
- Full context: The autonomous agent doesn't have the planning context that dag-designer has. Include goal, scope, constraints, investigation findings, and user decisions.
- Clear success criteria: What does "done" look like? When should the agent stop?
- What to report: "What was accomplished, what failed, what follow-up work exists"

**What autonomous-agent is:** Powerful but unrestricted. Use only when you need unrestricted capability and the user has approved it.

---

### DAG Design: dag-designer

**What it does:** Builds execution DAGs from the component library, adding nodes one by one, validating structure, investigating the codebase to inform decisions.

**When to dispatch:** During planning Node 9, after all investigation and user questions are complete. Never dispatch multiple times in the same planning session — dag-designer runs once during planning to build the initial DAG, then dag-reviewer evaluates it, then optional dag-revision requests modifications.

**What makes a good dispatch prompt:**
- Full planning context: The designer has no access to the conversation or planning discoveries. Include: user goal, scope boundaries, investigation findings, user decisions, any constraints (e.g., "must support easy deployment in Docker").
- Design constraints: "If the authentication module needs updates, include a separate verification node after the implementation node for the auth changes."
- What to report: "A summary of the DAG structure created, the reasoning for the node sequence, and any deferred decisions or future work identified"

**What dag-designer cannot do:** Modify planning context, ask questions, commit code. Designer designs — execution agents implement.

---

### DAG Review: dag-reviewer

**What it does:** Evaluates execution DAGs against review criteria. Critiques structure, identifies risks, suggests improvements. Does not revise — only critique.

**When to dispatch:** During planning Node 10, after dag-designer completes the initial DAG.

**What makes a good dispatch prompt:**
- Plan name: Include the `{{PLAN_NAME}}` so the reviewer can load and analyze the DAG
- Task context: "The user goal is to fix the authentication flow. The investigation found that the flow crosses three modules. Watch for structural issues that might make verification difficult."
- What to report: "Critique of the DAG structure, specific risk areas, any nodes that seem out of order or missing, and suggestions for improvement"

**What dag-reviewer cannot do:** Modify the DAG, make design decisions. Reviewer critiques — dag-designer revises based on feedback.

These requirements govern the authorship of new skills.

**Length:** 50–100 lines. Skills are loaded into recent context where attention is high. Excessive length dilutes the critical instructions. A skill exceeding 100 lines is probably teaching too many things and should be split.

**Concrete examples required:** Skills must include examples that demonstrate correct and incorrect usage with enough specificity to distinguish good from bad dispatch prompts. Do not use code blocks or exact tool call syntax in examples — prose examples with inline parameter values work better for small models than structured syntax blocks.

**Delegation skills must document limits:** What the target agent can do, what it cannot do. The dispatching agent needs the subagent's limits to write a sound prompt. "context-scout is read-only — it cannot make changes" prevents dispatch prompts that ask the scout to fix things.

**Delegation skills must include bad examples:** Show "Bad — too vague: 'Investigate the project'" alongside the good version. Bad examples teach the specific failure modes that small models hit: vague scope, missing context, asking the agent to do something outside its permissions.

**Methodology skills should document anti-patterns:** Name the pattern, describe what it looks like, explain why it fails. Generic "do it well" guidance is significantly less effective.

**No duplication with agent prompts:** Agent prompts define identity and hard constraints. Skills teach methodology. If both say the same thing, one is redundant. The agent prompt should state the constraint; the skill should teach how to operate effectively within it.
