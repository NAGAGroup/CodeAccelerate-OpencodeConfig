# Prompt Engineering

This document defines the structural requirements and design principles for every prompt surface in the framework: component node prompts, agent system prompts, and skill files. An implementer writing any of these prompt types should read this document in full before writing a single line.

---

## Universal Principles

These apply across all three prompt types.

**Positive framing.** Rules use imperative verbs. "Store findings immediately" not "Do not batch findings." The only place negative framing appears is in good/bad examples, where showing what not to do is more instructive than describing it abstractly.

**Actual tool identifiers in plain text, never in backticks.** Every tool reference uses the exact callable name: "Use the sequential-thinking_sequentialthinking tool to reason through..." Tool names never appear in backticks — backticks degrade small model performance on tool selection. The pattern is: "Use the [tool-name] tool to [action]."

**Reasoning blocks use "consider" framing.** "Consider what the scout found and what it means for your approach" invites exploration. "Address each of the following questions" produces mechanical one-thought-per-question responses. Invite, don't interrogate.

**Dispatch uses @agent-name format.** "Use the task tool to dispatch @context-scout to investigate..." Agent names are written as proper nouns with the @ prefix, used like names not descriptions.

**No numbered checklists.** Prose instructions guide behavior. The enforcement engine handles sequencing invisibly. A well-written prompt results in the agent naturally calling tools in the correct order. The enforcement sequence exists to catch deviations, not to drive behavior.

**The skill tool is non-exempt.** `skill` is not globally exempt. It appears in enforcement sequences and is blocked/required like any other non-exempt tool. This ensures agents load skills at the right point in the flow, not before or instead of the correct starting action.

---

## Node Prompts (Component Library)

Node prompts are static templates — every node of the same component type uses the identical prompt. They are the most constrained prompt type because they must work for any task, any project, and any DAG context.

### Structure

Every component node prompt follows this three-part structure:

**1. Role statement.** One sentence identifying what the agent is doing at this step. It grounds the agent in its current purpose.

> Example: "You are investigating the project to understand what needs to change before any implementation begins."

**2. Prose body.** Natural language instructions describing the flow of work. All tool calls are referenced explicitly using the "Use the [tool-name] tool to [action]" pattern — including exempt tools. The prose guides the agent through a natural sequence where enforced tools are called at the right points and exempt tools are used as needed.

The prose encodes conditional behavior, iteration, and judgment calls that the enforcement sequence cannot express. If the enforcement sequence is `[skill, sequential-thinking_sequentialthinking, task]`, the prose might say: "Load the delegation skill for the agent you need. Use the sequential-thinking_sequentialthinking tool to reason through what context the agent needs and compose your dispatch prompt. Then use the task tool to dispatch the agent." The agent follows the prose and satisfies the enforcement sequence as a side effect.

**3. Constraints.** What must not happen at this step, framed positively where possible.

> Example: "Focus on investigation only — implementation happens at the next step."

---

### Design Guidance for Node Prompts

**Node prompts must be self-contained.** The agent arrives at each node with compressed context and whatever it retrieves from the semantic notes system. The prompt cannot assume the agent remembers anything from previous nodes — it must tell the agent everything it needs to know about how to behave at this step.

**Node prompts must not reference specific tasks, files, or project details.** They describe a category of work, not a specific instance.
- Correct: "Investigate the current state of the area you need to change."
- Incorrect: "Investigate the authentication module."

**Node prompts should guide toward the semantic notes system.** A common opening instruction: "Use the qdrant_qdrant-find tool to retrieve relevant findings from earlier in this session." This anchors the agent's working memory in the notes rather than in compressed context.

**Reasoning blocks invite, not prescribe.** Describe what to consider, not a list of questions to answer.
- Correct: "Consider what the scout found and what it means for the implementation approach."
- Incorrect: "Answer the following questions about the scout's findings: 1. What changed? 2. What did not change? 3..."

**Prose and enforcement work together.** Understand which parts of the prompt correspond to enforced tool calls and which are suggested behavior. Enforced calls are non-negotiable structural gates. Suggested behavior is where the agent exercises judgment. The prose should make both natural.

**Investigation instructions should direct agents to GrepAI first.** Agents with file operation tools fall back to them only when GrepAI cannot satisfy the need. Node prompts and dispatch prompts that involve investigation or file discovery should phrase instructions accordingly — for example: "Use the grepai_grepai_search tool to locate relevant code. Read specific files with the read tool only once GrepAI has identified them."

---

### How Prose and Enforcement Work Together: Worked Example

The following example demonstrates how prose encodes complex conditional behavior while the enforcement sequence remains a short list of structural gates.

**Component type:** (hypothetical investigation-and-implementation node)

**Prose prompt:**

> You are investigating and implementing a targeted change.
>
> Use the task tool to dispatch @context-scout to investigate the current state of the area you need to change.
>
> Use the question tool to ask the user about the results. Keep asking until there are no remaining ambiguities about intent or scope. Use the sequential-thinking_sequentialthinking tool to reason between questions as needed.
>
> Once you are satisfied with your understanding, use the sequential-thinking_sequentialthinking tool to reason through what the findings mean for the implementation approach. If you did not need to ask the user any questions, you still must use the sequential-thinking_sequentialthinking tool before continuing.
>
> Use the task tool to dispatch @junior-dev to implement the change with a goal-based task.
>
> Use the question tool to confirm the work was completed as expected.

**Enforcement sequence:** `[task, sequential-thinking_sequentialthinking, task, question]`

**Mapping:**

| Tool | Position | Behavior |
|---|---|---|
| First `task` (dispatch @context-scout) | 1 | Enforced — blocked by nothing, must happen first |
| `question` (ask about results) | — | Suggested — `question` is exempt; calls here do not satisfy position 2 |
| `sequential-thinking_sequentialthinking` | 2 | Enforced (exempt tool as positional requirement) — second `task` blocked until this is satisfied |
| Second `task` (dispatch @junior-dev) | 3 | Enforced — blocked until positions 1 and 2 are satisfied |
| Final `question` (confirmation) | 4 | Enforced — `question` at position 4 is a positional requirement; earlier exempt calls do not satisfy it |

The enforcement sequence encodes only the structural invariants: investigate before implementing, reason before acting, confirm after completing. The prose encodes the full behavioral richness: conditional questioning, interleaved reasoning, flexible iteration. Everything not in the enforcement sequence is the agent's judgment.

---

### Planning Node Prompts

Planning node prompts follow the same three-part structure but are hand-authored for each specific planning phase rather than being generic templates. They differ from component library prompts in three ways:

1. They can reference the planning flow specifically: "You have just completed investigation and are now storing your findings to the semantic notes system."
2. They can reference `{{PLAN_NAME}}` and `{{PLANNING_SESSION_ID}}` template variables. These are resolved at runtime — `{{PLAN_NAME}}` is filled at `choose_plan_name` (Node 1), `{{PLANNING_SESSION_ID}}` is filled when HeadWrench calls `plan_session` in response to the `/plan-session` slash command.
3. They are tuned for a specific position in the planning flow and can be more directive than generic component prompts.

Planning node prompts are stored in `.opencode/session-plans/planning-session_{id}/prompts/`. They are not part of the component library.

---

## Agent System Prompts

Agent system prompts define who the agent is and how it behaves across all contexts. They are loaded once and persist for the agent's entire session.

### Structure

Every **subagent** system prompt follows this five-part structure:

**1. Role statement.** One sentence defining the agent's identity and purpose.

> Example: "You are a goal-oriented implementer. You investigate the codebase to understand context, then make targeted changes to achieve stated goals."

**2. Capabilities.** What the agent can do, described in terms of actions not tools.

> Example: "You investigate code using semantic search, trace call chains to understand dependencies, and make targeted edits to achieve goals."

This grounds the agent's self-model without listing tool names. Tool instruction belongs in skills.

**3. Methodology.** How the agent should approach its work.

> Example: "Read the goal and context from your dispatch prompt. Investigate before changing. Flag issues you find but do not fix problems outside the scope of the stated goal."

**4. Constraints.** Hard limits on the agent's behavior, framed positively.

> Example: "Focus on achieving the stated goal. Changes outside the goal's scope are handled by the caller. Shell operations are handled by @tailwrench, not by you."

**5. Output format.** What the agent should return to its caller.

> Example: "Report what you changed, what you found during investigation that may be relevant, and any issues you encountered."

**Note:** The primary agent (headwrench) does not have an output format section because it runs DAG nodes and does not return results to a caller in the same way subagents do.

---

### Design Guidance for Agent System Prompts

**Keep them short — 30 to 50 lines.** Agent prompts are in the system prompt position, which receives lower attention than recent content. Keep them focused on identity and hard constraints. Behavioral nuance belongs in skills, which are loaded recently and receive higher attention.

**Do not teach tool usage in agent prompts.** That belongs in skills. "You investigate the codebase" is an identity statement. The skill teaches which tools to use and how.

**Do not reference the DAG, planning system, or framework architecture.** Subagents do not need to know they are part of a DAG. They receive a dispatch prompt, do work, and return results. The framework is invisible to them.

**Reference other agents only to clarify boundaries.** "Shell operations are handled by @tailwrench" is a boundary clarification that prevents scope violations. "You work alongside @context-scout in a multi-agent system" is unnecessary architecture exposition.

**End-positioned content receives highest attention.** Place the most critical constraints at the end — the things that would cause real damage if violated. Keep this to 2–3 items maximum. Do not bury critical constraints in the middle.

---

## Skill Files

Skills teach methodology — how to perform a specific type of work or how to use a specific tool effectively. They are loaded at runtime via the `skill` tool and appear in the agent's context as recent content, receiving high attention.

### Structure

Every skill file follows this four-part structure:

**1. Purpose.** One paragraph explaining what this skill teaches and when to use it.

**2. How to call the tool / How to dispatch the agent.** Exact tool syntax with parameter names and example calls.
- For delegation skills: the `subagent_type` string, required parameters, and what the agent will report back.
- For methodology skills: the tool's parameters and example invocations.

**3. Rules.** Behavioral constraints specific to this skill.

> Example (asking-questions skill): "Never put long content inside the question tool. Ask one question at a time."

**4. Examples.** Good and bad examples demonstrating correct and incorrect usage. Bad examples are often more instructive than good examples for small models — they show the specific failure mode to avoid.

---

### Design Guidance for Skill Files

**Keep them 50 to 100 lines.** Skills are loaded into recent context where attention is high, but excessive length dilutes the critical instructions. If a skill exceeds 100 lines, it is probably teaching too many things and should be split into two skills.

**Include concrete examples with exact tool syntax.** Small models need to see the exact parameter names and values, not abstract descriptions. Show the tool call, not a description of the tool call.

**Delegation skills must document what the target agent can and cannot do.** The dispatching agent needs to know the subagent's limits to write a good dispatch prompt.

> Example: "context-scout is read-only — it cannot make changes. Do not ask it to fix things. Ask it to investigate and report."

**Delegation skills must include bad examples.** The most instructive bad examples show the specific failure modes that small models hit:
- Vague scope: "Investigate the project" (what part? what question?)
- Missing context: dispatch prompt that doesn't tell the subagent what changed in prior nodes
- Out-of-scope requests: asking a read-only agent to edit files

**Document failure modes with the anti-pattern format.** Name the anti-pattern, explain what it looks like, and explain why it fails. This is more effective than generic guidance.

> Anti-pattern: "Asking the scout to fix things."
> What it looks like: "Use the task tool to dispatch @context-scout to fix the broken authentication flow."
> Why it fails: context-scout is read-only. The dispatch will either fail or produce incorrect results as the scout attempts work outside its permissions.

**Skills must not duplicate agent prompt content.** The agent prompt defines identity and hard constraints. The skill teaches methodology. If both say the same thing, one is redundant. Identity belongs in the agent prompt; methodology belongs in the skill.

---

### Skill Categories

**Methodology skills** teach how to think and act. Loaded by multiple agents across different contexts.

| Skill | Purpose |
|---|---|
| `following-plans` | How to follow DAG step sequences and recover from enforcement errors |
| `sequential-thinking` | How to use the reasoning tool effectively, including anti-patterns to avoid |
| `asking-questions` | How to use the `question` tool without overloading it |
| `qdrant-notes` | How to store and retrieve session knowledge effectively |
| `grepai` | How to use semantic search and code intelligence tools (to be created) |

**Delegation skills** teach how to dispatch a specific subagent. Each maps to exactly one `subagent_type`.

| Skill | Subagent type dispatched |
|---|---|
| `context-scout-delegation` | `context-scout` |
| `context-insurgent-delegation` | `context-insurgent` |
| `juniordev-delegation` | `junior-dev` |
| `documentation-expert-delegation` | `documentation-expert` |
| `external-scout-delegation` | `external-scout` |
| `tailwrench-delegation` | `tailwrench` |
| `autonomous-agent-delegation` | `autonomous-agent` |
| `dag-design` | `dag-designer` |
| `dag-review` | `dag-reviewer` |

---

## Template Variable Substitution

Two template variables appear in planning node prompts. They are substituted by the framework at the times described below.

| Variable | Value | When resolved |
|---|---|---|
| `{{PLAN_NAME}}` | The human-chosen execution plan name | At `choose_plan_name` (Node 1 of planning DAG) |
| `{{PLANNING_SESSION_ID}}` | `planning-session_{opencode-session-id}` | When HeadWrench calls `plan_session` in response to `/plan-session` |

`{{PLAN_NAME}}` fills all remaining planning node prompts immediately when `choose_plan_name` is called. It also fills the execution DAG's prompts when HeadWrench calls `activate_plan` in response to the `/activate-plan` slash command — the execution prompts already contain the correct name from the `add_node` calls made during planning (when the planning agent passed `{{PLAN_NAME}}` as the `plan_name` parameter to `init_dag`).

`{{PLANNING_SESSION_ID}}` is available from the moment HeadWrench calls `plan_session`. It identifies the planning session's directory and is used for disambiguation when multiple planning sessions for the same plan exist.

Template variables appear only in planning node prompts. Component library prompts (execution DAG) are static and contain no template variables.

---

## Prompt Quality Checklist

Use this checklist when reviewing any prompt before finalizing it.

**For node prompts:**
- [ ] Begins with a one-sentence role statement
- [ ] Every enforced tool call is referenced explicitly in prose with the "Use the [tool-name] tool to [action]" pattern
- [ ] Exempt tool calls that are positionally required also appear in prose
- [ ] No task-specific or project-specific content
- [ ] No numbered checklists
- [ ] No tool names in backticks
- [ ] Reasoning blocks use "consider" framing
- [ ] Constraints section frames rules positively

**For subagent system prompts:**
- [ ] 30–50 lines total
- [ ] Role statement in first sentence
- [ ] No tool usage instructions (those belong in skills)
- [ ] No DAG or framework references
- [ ] Most critical constraints appear last
- [ ] No more than 2–3 items in the critical end-position constraints

**For skill files:**
- [ ] 50–100 lines total
- [ ] Purpose paragraph explains when to use the skill
- [ ] Exact tool syntax shown, not described abstractly
- [ ] Bad examples present for delegation skills
- [ ] Anti-pattern format used for failure modes
- [ ] No duplication of agent prompt content
