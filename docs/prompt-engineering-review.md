# Prompt Engineering Review: CodeAccelerate Framework

## Introduction

CodeAccelerate is a multi-agent DAG-driven planning system that orchestrates six specialized agents (HeadWrench, JuniorDev, Tailwrench, AutonomousAgent, ContextScout, ContextInsurgent, DocumentationExpert) through a structured planning pipeline. The system uses executable task DAGs (Directed Acyclic Graphs) to decompose complex projects into agent-executable work items, with prompts distributed across three indirection layers: direct agent prompts, planning DAG node prompts, and component node library templates.

This review evaluates the entire prompt engineering surface for effectiveness with local 9B–14B parameter models (Qwen3-14B with thinking disabled as the baseline). The framework is currently successful with frontier models (Sonnet-4.6, GPT-4o) but exhibits measurable failure modes when executing on local models, particularly in tool parameter accuracy, branching decision mechanics, and error recovery. This review identifies which patterns are working, which are degrading local model performance, and how to fix them without requiring additional context to implement.

The document is structured by semantic area — each section evaluates current state, identifies strengths, documents weaknesses with specific failure evidence, and provides actionable recommendations. The final prioritized summary orders all recommendations by expected impact on local model reliability, enabling rapid implementation of highest-value changes.

---

## 1. Agent Prompt Design

### Current State

Eight agents are defined in `files/agents/` with system prompts ranging 32–49 lines. All follow an identical structural pattern: YAML frontmatter containing metadata (description, mode, steps, color, permission), followed by a role statement ("You are a [role] agent"), a rules section (4–7 items), an output format specification, and optionally a reasoning task. No agent prompt exceeds 50 lines, and all rules use positively framed imperative verbs ("Use X," "Call Y," "Return Z").

The role statements position agents clearly: HeadWrench as the planning executor, JuniorDev as the implementation agent, Tailwrench as the code cleanup specialist, AutonomousAgent as the project executor, ContextScout as the information gatherer, ContextInsurgent as the constraint auditor, and DocumentationExpert as the documentation writer. No agent defines itself relative to another agent or explains its position in a larger system.

HeadWrench (32 lines, the most minimal agent) depends on the following-plans skill being loaded to understand how to execute task DAGs. The prompt itself does not document this dependency or explain where the behavioral framework comes from—it simply states "You are a planning agent" and lists DAG-mode rules without connecting them to a skill that provides the execution substrate.

Critical constraints are positioned at the end of most prompts (Tailwrench, JuniorDev, AutonomousAgent), using negative framing ("Do not push," "Do not run bash without user approval," "Do not commit"). This end placement is correct per Lost in the Middle research—prompt endings receive highest attention. The contradiction with the positive-framing-only rule is resolved implicitly: these are actions to avoid, not instructions to follow, so negative framing is unavoidable; however, the framing invites what it forbids ("Do not push" plants the thought "push").

No agent prompt contains inline examples of tool usage or expected output. All are instruction-focused with no concrete instantiations.

### Strengths

1. **Consistent structural pattern** — All eight agents follow role→rules→output format, making the pattern recognizable and reliable across the agent surface.

2. **Positively framed rules sections** — Rules use imperative verbs ("Use," "Call," "Return") rather than negative constraints. This aligns with verified research on positive framing reliability for 9B–14B models.

3. **Appropriate brevity** — Agent prompts (32–49 lines) are short enough to avoid Lost in the Middle attention degradation while containing sufficient detail to guide behavior.

4. **Clear role separation** — Each agent has a distinct, stated role that does not overlap with others, reducing decision overhead.

5. **Reasoning task positioning** — Prompts that include reasoning tasks position them at the end, where attention is highest.

---

### Weaknesses

1. **Missing dependency documentation in HeadWrench** — HeadWrench's prompt does not explain that the following-plans skill provides the execution substrate. A 9B model reading only the HeadWrench prompt has no documented way to understand how to interpret "DAG mode" or where behavioral rules come from.

2. **Negative framing at prompt end contradicts positive-framing principle** — End-positioned negative constraints ("Do not push," "Do not run bash") directly contradict the system's commitment to positive framing. Frontier models handle this implicitly, but 9B models may prioritize the end-position negative instruction and attempt to infer the forbidden action as context.

3. **No dependency graph in agent frontmatter** — Agent metadata (description, mode, steps, color, permission) does not include information about required skills. Skills are loaded at execution time by the planning system, but agents cannot document what they need.

4. **Missing success/failure criteria** — Agent prompts define expected outputs (format, structure) but not success criteria. An agent has no way to evaluate whether it has completed its task correctly.

5. **Reasoning task specificity varies** — Some reasoning tasks are open-ended ("Think about what you've learned"), others are narrow ("Why might this fail?"). Consistency would improve predictability for 9B models.

---

### Recommendations

1. **Add explicit skill dependency statements to agent prompts that require loaded skills** — HeadWrench should include a line immediately after the role statement: "You depend on the following-plans skill. This skill provides your execution framework." Position this as the first item before rules. This eliminates the implicit dependency and ensures the model understands where behavioral rules come from, even if the skill is not loaded in the current context.

2. **Move negative-framing end constraints to positive equivalents positioned after rules** — Instead of "Do not push," use a separate constraint block before the output format section: "You may push code only after explicit user approval for commits that affect production. Confirm before pushing." This preserves the end-position emphasis (still high-attention placement) while using positive framing that states what the agent should do rather than what it should avoid.

3. **Replace end-positioned reasoning tasks with constraint-qualified reasoning** — Restructure reasoning tasks to include explicit success criteria: "Reason about: Why this solution works, which requirements it satisfies, and which constraints it respects." This ties reasoning to the system's actual rules rather than leaving it open-ended, improving local model reliability.

4. **Add an explicit "You may not" section at the very end of each agent prompt that lists truly dangerous actions** — Position it after all positive rules and reasoning tasks. Use this section sparingly (2–3 items maximum) for actions that could break the system (e.g., "You may not modify the DAG structure without calling add_node with proper validation"). This preserves the end-position attention for safety-critical constraints while keeping them separate from positive instructions.

5. **Create a brief agent dependency matrix in AGENTS.md that documents which skills each agent requires** — This enables planning agents to verify they are loading the correct skill for each agent and helps debugging when agents fail due to missing dependencies.

---

## 2. Skill File Effectiveness

### Current State

Thirteen skills exist across three categories. **Methodology skills** (following-plans 34 lines, sequential-thinking 79 lines, asking-questions 129 lines) teach agents how to think and act across all domains. **Delegation skills** (7 total: context-scout, context-insurgent, junior-dev, documentation-expert, autonomous-agent, tailwrench, headwrench, each 58–83 lines) teach HeadWrench how to dispatch work to each agent and what to expect in return. **Design skills** (dag-design, dag-review, each 80+ lines) teach HeadWrench how to design executable DAGs and review them.

The following-plans skill (34 lines) contains the only explicitly documented error recovery guidance in the entire system: "Read the error message. The error message will tell you which tool to use next. Call the tool the system expects. Do not retry the rejected tool." This five-sentence block is the most concrete behavioral guidance for handling failures anywhere in the framework.

The sequential-thinking skill (79 lines) stands out by explicitly documenting four anti-patterns with concrete explanations: (1) compressing all reasoning into a single totalThoughts string (should iterate), (2) planning without executing (should call tools to verify), (3) empty filler thoughts (wasted tokens; should be specific), and (4) locking in totalThoughts too early (should update as information changes). These anti-patterns directly address failure modes observed in local model executions.

The asking-questions skill (129 lines) highlights its most critical rule in a dedicated subsection: "Never put proposals, plans, or long content inside the question tool. Ask the user to confirm the direction you're heading, not to make decisions for you." The explanation is concrete and explains why the constraint exists (long content cannot be reliably formatted through the tool).

All seven delegation skills follow an identical structure: (1) tool call syntax with exact parameter names, (2) description of the target agent's capabilities and hard limits, (3) how to write an effective delegation prompt with a numbered template, (4) what the agent will report, (5) good examples (2–3) and bad examples (2–3). The bad examples are particularly instructive—they show failures like vague success criteria, missing context, and ambiguous scoping.

### Strengths

1. **Explicit error recovery guidance in following-plans** — The five-sentence error recovery block is the clearest behavioral guidance for handling tool failures anywhere in the system. It is concrete, actionable, and correctly positioned in a skill that all planning agents load.

2. **Anti-pattern documentation in sequential-thinking** — Documenting four explicit anti-patterns directly addresses failure modes. This is significantly more helpful than generic "think step-by-step" guidance for local models.

3. **Identical delegation skill structure** — All seven delegation skills follow the same pattern (syntax, limits, dispatch instructions, expected results, good/bad examples), making them predictable and enabling consistent skill loading across HeadWrench.

4. **Bad examples in delegation skills** — Showing what NOT to do ("bad dispatch prompt") is often more informative for 9B models than positive examples alone. The bad examples demonstrate cascade failures.

5. **Concrete parameter names** — All delegation skills specify exact tool parameter names (e.g., "subagent_type: 'junior-dev'") rather than describing parameters abstractly. This reduces parameter naming hallucination.

6. **Clear agent capabilities and limits** — Each delegation skill documents what the target agent can do and explicit hard limits (e.g., "ContextInsurgent cannot access external APIs").

---

### Weaknesses

1. **No recovery pattern for incomplete or vague subagent results** — Following-plans teaches recovery from tool rejections, but no skill documents what to do when a subagent returns incomplete, vague, or off-topic results. A model executing plan-session may receive poor scout results and have no documented recovery path.

2. **Delegation skill structure assumes dispatcher perspective** — Skills like dag-design and dag-review are written from the dispatcher's perspective ("How to call the task tool," "What the design agent does"). When HeadWrench loads these skills to execute as the design agent, it reads "Call the task tool to dispatch a design agent" and may attempt to dispatch yet another subagent instead of doing the design work itself. This is a critical dual-use flaw.

3. **No guidance on skill sequencing within single agent execution** — Several agents load multiple skills in sequence (e.g., JuniorDev might load both sequential-thinking and junior-dev delegation skill). The skills do not guide how to weight them if they conflict.

4. **Asking-questions skill assumes tool availability** — The skill teaches how to use the question tool, but does not explain when this tool is unavailable (e.g., in planning DAG nodes where question is not in the exempt tools list) or how to adapt the approach.

5. **No documentation of skill side effects** — Sequential-thinking injected into context changes the model's reasoning behavior (it may produce verbose totalThoughts). No skill documents how its presence affects downstream execution or how other skills should adapt.

---

### Recommendations

1. **Create a failure-recovery skill that documents subagent result failure modes and recovery patterns** — Document patterns for: (1) incomplete results (e.g., scout found 2 of 5 expected categories), (2) vague results (e.g., "it's unclear" without specifics), (3) off-topic results (agent answered a different question), and (4) results that conflict with previous knowledge. Each pattern should include a recovery action (retry with more specific prompt, escalate to different agent, decompose into smaller dispatch). This skill should be loaded by any planning agent that depends on subagent results.

2. **Rewrite dag-design and dag-review skills from the executor's perspective** — Replace the dispatcher-centric framing with executor-centric framing: "When HeadWrench executes the dag-design node, it reads this skill to understand how to design a DAG. The skill teaches..." This eliminates the dual-use ambiguity where a model cannot determine whether it should dispatch or execute.

3. **Document skill precedence rules in a methodology skills interaction guide** — Create a brief subsection explaining: when sequential-thinking and asking-questions skills are both loaded, prioritize sequential-thinking's anti-patterns (they are designed to prevent common failures). When context-scout or context-insurgent delegation skills are loaded alongside asking-questions, use context-scout first to gather facts, then use asking-questions only if critical uncertainties remain. This guides skill weighting without requiring the model to infer precedence.

4. **Add a "When This Skill Is Not Available" section to each methodology skill** — Each skill should document how to adapt if the skill's tool is unavailable. For asking-questions: "If the question tool is not in your todo list, use sequential-thinking to reason through uncertainties instead of asking." For sequential-thinking: "If sequential-thinking_sequentialthinking is not available, reason through your steps using numbered todo steps in your response."

5. **Add error detection patterns to delegation skills** — Extend each delegation skill's "What the agent will report" section with a detection checklist: "If the report lacks [expected component], it is incomplete. Ask clarifying questions before proceeding." This enables executing agents to detect subagent failures in real time.

---

## 3. Delegation Prompt Quality

### Current State

Delegation prompts appear in three places with different indirection levels. The **delegation skills** (7 total) teach HeadWrench how to write a dispatch prompt—they include a template with four numbered blockquotes specifying requirements. The **planning node prompts** (11 total) include dispatch instructions in blockquote format that add architectural requirements beyond what the skill teaches. The **node library templates** (19 total) contain dispatch instructions for how agents should call subagents within their execution.

The dag-design skill teaches five core requirements for a good dispatch prompt: (1) explain the context and task clearly, (2) specify what success looks like, (3) specify the exact output format, (4) explain what questions the agent should answer, and (5) include a success checklist. These are compact, teachable, and skill-focused.

The dag-design planning node prompt's blockquote adds four more architectural requirements that the skill does not mention: (1) use add_node with descriptive node IDs, (2) do NOT pass custom prompt or todos parameters to add_node, (3) write a rationale document at a specific path, and (4) call present_dag_to_user before finishing. These four constraints are architectural (they affect system behavior) but are taught only in the dispatch blockquote, not in the skill.

The dag-review skill and dispatch blockquote are tightly consistent—the 7-item review checklist appears item-for-item in both locations, demonstrating that redundancy can work for reinforcement. However, this redundancy exists only because the checklist was explicitly synchronized; most dispatch prompts lack this consistency.

The orientation-scout and external-research planning nodes demonstrate the cleanest examples of skill-prompt coherence. The skill requirements for orientation-scout (gather background, understand constraints, identify risks, map stakeholders) translate directly into node prompt rules that use the same language. A model loading both the skill and the node prompt reads identical requirements twice, which aids attention and retention without requiring the model to synthesize different framings.

The work-item node template creates a structural problem in its delegation instruction: it tells the executing agent to dispatch @context-scout to read notes (step 3) but requires loading a skill BEFORE calling the scout (step 2). The Rules section says "choose the skill based on what the scout describes"—but the todo list has already committed to loading a skill before the scout's input is received. A model following the todo rigidly must load one skill, then discover the scout recommended a different skill, then rely on sequential-thinking to course-correct without any documented mechanism to reload the correct skill.

### Strengths

1. **Consistent four-blockquote template structure in delegation skills** — All delegation skills use the same template structure for teaching dispatch prompts, making the pattern recognizable across all seven delegation contexts.

2. **Tight coherence between dag-review skill and dispatch blockquote** — The 7-item checklist matches exactly between the skill and the dispatch blockquote, providing redundant reinforcement that helps local models retain the pattern.

3. **Explicit bad examples in delegation skills** — Each delegation skill includes 2–3 bad dispatch prompts showing common failures (vague success criteria, missing context, ambiguous scope). These are more instructive for 9B models than positive examples alone.

4. **Parameter specificity** — All delegation prompts specify exact tool parameters (subagent_type, prompt, success_criteria, async) rather than describing them abstractly.

5. **Orientation-scout and external-research as coherence models** — These nodes demonstrate seamless skill-to-node-prompt translation, showing what cross-layer consistency looks like.

---

### Weaknesses

1. **Architectural requirements scattered between skill and node prompt blockquote** — The dag-design skill teaches five requirements, but the planning node prompt blockquote adds four more architectural constraints (add_node usage, parameter restrictions, rationale document path, present_dag_to_user call). A 9B model reading the skill may not absorb the architectural layer, leading to DAG design failures that don't surface until the design is reviewed.

2. **Dual-use ambiguity in dag-design and dag-review skills** — Both skills are written from the dispatcher's perspective ("How to Call the task Tool," "What the DAG Design Agent Does"). When HeadWrench loads these to execute as the design agent, it reads "Call the task tool to dispatch a design agent" and must infer that it should execute instead of dispatch. This inference is not reliable for 9B models.

3. **Work-item todo sequencing flaw** — Step 2 requires loading a skill before step 3 dispatches the scout to read notes. The Rules say "choose based on what the scout describes," but the todo list commits before the scout's input. This forces the model to use sequential-thinking to course-correct, adding reasoning overhead that should not be necessary.

4. **Branch discovery path not documented in work-item** — The work-item node includes a decision-gate that branches based on scout results, but does not document how to discover available branches. The model is told to call next_step({ next: '<branch-id>' }) but has no method to find valid branch IDs.

5. **No dispatch recovery guidance** — None of the delegation skills address what to do if a dispatch fails (tool rejected, agent returned incomplete results, etc.). The following-plans skill covers tool rejection recovery, but not dispatch-specific failures.

6. **Success criteria specification is vague in skill template** — The dag-design skill says "specify what success looks like," but does not provide examples of good vs. bad success criteria. A model must infer what "success" means for a design DAG without concrete guidance.

---

### Recommendations

1. **Move architectural requirements from planning node blockquotes into a separate "Architectural Constraints" section in delegation skills** — The dag-design skill should teach all nine requirements (the current five plus the four architectural ones) in a coherent block. Split the skill into "Core Dispatch Requirements" (what to put in the prompt) and "Architectural Requirements" (add_node parameter rules, output document paths, system calls). This eliminates the scatter and ensures all requirements are learned together, not split between skill and node prompt.

2. **Rewrite dag-design and dag-review skills using executor-centric language** — Replace "How to Call the task Tool" with "When You Execute dag-design, Use This Pattern." Change "What the DAG Design Agent Does" to "What You Will Do as the Design Agent." This eliminates the ambiguity where a loaded skill confuses its reader about whether it is learning how to dispatch or how to execute.

3. **Restructure work-item todo sequencing to gather context before committing to a skill** — Reorder steps to: (1) Call @context-scout to read notes, (2) Based on scout results, load the appropriate skill, (3) Execute the work using that skill. This matches the Rules section guidance ("choose based on what the scout describes") and eliminates the need for sequential-thinking course-correction.

4. **Document branch discovery as an explicit step in work-item and decision-gate** — Add to work-item: "Step 2.5: If you encounter a decision-gate and need to discover branch options, call recover_context and look for 'Pending Branch Choice' in the output. The bold node IDs are your available options." This provides a documented path without requiring the model to infer it.

5. **Add subagent failure recovery to each delegation skill** — Extend the "What the agent will report" section with a failure detection block: "If you receive a response that lacks [expected elements], it is incomplete. Call question_user to clarify what you need, or retry the dispatch with a more specific prompt. Do not proceed with incomplete results."

6. **Add success criteria examples to the dag-design skill** — Include good and bad examples: Bad: "The DAG should be comprehensive." Good: "The DAG should have: one node for each user requirement, explicit branch points for conditional work, and a terminal verification node that confirms all requirements were met."

---

## 4. Planning DAG Structure and Phase Ordering

### Current State

The planning DAG (plan-session) contains 11 nodes in a linear sequence with no branching or failure paths: session-overview → orientation-scout → external-research → user-questions → write-notes → compress → session-overview-refresher → dag-design → dag-review → execution-kickoff → plan-success.

The DAG is organized into five logical phases. The **orientation phase** (session-overview, orientation-scout) establishes context and gathers background information. The **research phase** (external-research, user-questions, write-notes) investigates the problem space and documents findings. The **compression phase** (compress, session-overview-refresher) manages the context window by compressing completed sections and re-establishing context before the most demanding phase. The **planning phase** (dag-design, dag-review) constructs and validates the executable DAG. The **success phase** (execution-kickoff, plan-success) transitions to execution and confirms completion.

This five-phase structure is well-ordered for the dependencies it must satisfy: you cannot design a DAG without understanding the problem (orientation, research, write-notes), and you cannot design a good DAG with a degraded context window (compress, session-overview-refresher). The hand-off between phases uses three primary mechanisms: file-based context (notes files written during research), semantic memory (Qdrant integration for retrieval-augmented generation), and system-level context injection (DAG_EXECUTOR_MODE on every turn).

The compress → session-overview-refresher pattern is a particularly strong design choice. The compress node reads accumulated notes and creates a summary, reducing context debt before the most cognitively demanding phase. The session-overview-refresher node then re-establishes the full context (user problem statement, constraints, initial findings) before dag-design begins. This pattern explicitly manages attention budget across the full planning DAG.

The linear structure means there is no documented recovery mechanism if any node fails. If orientation-scout fails to find sufficient background, there is no node that retries or branches to an alternative path. If external-research returns incomplete results, there is no node that dispatches additional researchers. This is an acceptable trade-off for a planning DAG—planning-level failures are rare, human intervention is appropriate, and introducing recovery loops would significantly complicate the DAG structure. The planning agent's own resilience (via sequential-thinking and error recovery skills) is the primary failure mitigation.

### Strengths

1. **Five-phase structure matches the logical flow of planning work** — Orientation → Research → Compression → Design → Success is intuitive and reduces decision overhead for the planning agent.

2. **Compress and session-overview-refresher pattern explicitly manages context window** — Placing compression before the most demanding phase (dag-design) is a strong design choice that mitigates the Lost in the Middle effect.

3. **Linear DAG minimizes coordination complexity** — No branching means no state tracking, no missed branches, and simpler planning agent execution. The trade-off (no built-in recovery) is acceptable for planning-level work.

4. **Hand-off mechanisms are explicit** — Files, Qdrant, and system injection are clearly documented. The planning agent knows how information flows between nodes.

5. **Phase ordering respects information dependencies** — You cannot design a DAG until you understand the problem; you cannot review a DAG until you have designed one. The DAG enforces this ordering implicitly.

---

### Weaknesses

1. **No recovery mechanism for scout or research failures** — If orientation-scout returns incomplete background, there is no built-in retry or escalation. The planning agent must use sequential-thinking to decide whether to proceed with incomplete context.

2. **user-questions node creates potential for unbounded user interaction** — The node is designed to ask clarifying questions, but there is no mechanism to limit the number of questions or iterations. A user could provide vague answers indefinitely.

3. **No early exit or validation point before design phase** — If the research phase reveals the problem is unsolvable or outside scope, there is no documented path to exit early. The planning agent must recognize this and use sequential-thinking to decide whether to continue.

4. **DAG does not document what "plan-success" means** — The final node (plan-success) is called when execution-kickoff completes, but the planning DAG never defines what a successful plan looks like. Is it a DAG that the user approves? A DAG with minimum structural properties? The success criteria are implicit.

5. **compress node output is not validated** — The compress node produces a compressed summary, but there is no node that verifies the compression retained all critical information. An over-aggressive compression could silently lose important constraints.

6. **Qdrant integration is implicit, not explicit in DAG structure** — The planning DAG relies on semantic memory for retrieval-augmented generation, but this is not visible in the node structure. If Qdrant fails or returns poor results, the planning agent has no documented recovery.

---

### Recommendations

1. **Add an optional escalation path from orientation-scout if background is insufficient** — Document a recovery pattern where orientation-scout can report "background is incomplete" and the planning agent decides whether to retry, branch to external-research, or proceed. This should be a decision-point in the node prompt rather than a DAG-level branch (keeps the DAG linear).

2. **Add a user-questions iteration limit and early-exit criteria** — Document in the user-questions node: "Ask up to 2 clarifying questions. If the user's answers still leave critical ambiguities, proceed with explicit assumptions documented in notes." This prevents unbounded iteration.

3. **Add an early-exit mechanism before dag-design** — Document in the write-notes or compression node: "If the problem statement reveals the project is infeasible, unscoped, or outside the framework's capabilities, call exit_plan with a summary. Do not continue to design." This enables graceful exits for out-of-scope work.

4. **Document plan-success criteria in the plan-success node prompt** — Add an explicit definition: "You have successfully completed planning when: (1) the DAG has been reviewed and approved, (2) execution-kickoff has generated a valid session plan, and (3) the user has confirmed they are ready to proceed. Report these three confirmations."

5. **Add a compression validation step in session-overview-refresher** — After session-overview-refresher re-establishes context, include a check: "Compare your current context against the compressed summary from the previous node. If any critical constraints or requirements are missing, call sequential-thinking to identify what was lost and update your working context."

6. **Make Qdrant integration explicit in the DAG by adding retrieval instructions to high-level nodes** — Document in external-research and dag-design: "If you need to recall previous findings or constraints, call recover_context to retrieve relevant information from semantic memory." This makes the integration visible and gives the planning agent explicit control.

---

## 5. Planning DAG Node Prompts

### Current State

All 11 planning node prompts follow an identical structural pattern: identical role statement ("You are a planning agent. Your job is to design a plan for another agent to follow."), a todo list (1–7 items), a rules section (positive framing, 3–7 items), optional dispatch instructions in blockquote format, and a reasoning task at the end. This consistency is deliberate and strong.

All role statements are identical, which is technically imprecise—a session-overview agent has a different job than a dag-review agent—but the uniformity provides structural predictability that aids local model navigation. The identical role statement is a conscious trade-off favoring consistency over precision.

The SESSION_PATH placeholder appears in several prompts to reference the session directory (e.g., "write your findings to {{SESSION_PATH}}/findings.md"). The planning-enforcement plugin substitutes `{{SESSION_PATH}}` → `.opencode/session-plans/{name}` at copy-time for files under `files/planning/plan-session/prompts/`. However, no prompt explains to the model what SESSION_PATH is or that it is a substituted value. A local model reading this may not understand that it is a template variable and may attempt to write to a literal "{{SESSION_PATH}}" directory.

The reasoning tasks are open-ended questions positioned at the end of all prompts (e.g., "What did you learn about the problem space?" "Why might this DAG succeed or fail?"). This end positioning is correct—endings receive highest attention. The tasks invite genuine engagement with the work rather than mechanical compliance, which is appropriate for planning-level reasoning.

The dag-design prompt (39 lines) is the most complex planning prompt because it contains dispatch instructions in blockquote format that specify how to call add_node and what architectural constraints to enforce. These instructions add requirements beyond what the dag-design skill teaches. The prompt includes a template showing exact tool call syntax.

The dag-review prompt (45 lines) is the longest planning prompt. It includes a 7-item review checklist that is reproduced identically in the dag-review skill, demonstrating intentional redundancy for reinforcement.

The external-research node (27 lines, 7 todo items) is the most complex in terms of control flow because it includes user approval gating with conditional branching (Approve/Modify/Skip). This is handled through explicit todo sequencing and branch descriptions rather than in-prompt decision logic.

### Strengths

1. **Identical structural pattern across all 11 nodes** — Role statement, todo list, rules, optional blockquote, reasoning task. This consistency aids local model navigation.

2. **Positive framing throughout rules sections** — All rules use imperative verbs. No node uses negative constraints in the rules section.

3. **End-positioned reasoning tasks** — Reasoning is positioned at the end where attention is highest, and tasks are open-ended rather than prescriptive, inviting genuine thinking.

4. **Dispatch blockquote templates show exact syntax** — dag-design and dag-review blockquotes include example tool calls with exact parameter names, reducing parameter hallucination.

5. **Tight coherence between dag-review skill and prompt** — The 7-item checklist appears identically in both places, providing reinforced instruction.

6. **Todo lists are appropriately scoped** — Most nodes have 3–5 todo items; the maximum is 7 (external-research). This is within the range where local models reliably track sequences.

---

### Weaknesses

1. **SESSION_PATH placeholder is never explained** — No prompt documents what SESSION_PATH is or that it is a substituted variable. A model may not understand it is a template token.

2. **Identical role statement across all 11 nodes is imprecise** — The role statement says "design a plan," which is literally true only for dag-design. session-overview agents design a problem statement; external-research agents research constraints. Using identical language obscures the actual node purpose.

3. **Conditional branching in external-research is explained in rules, not in todo structure** — The external-research node includes branch conditions (Approve/Modify/Skip) described in the Rules section, but the actual branching mechanism is not shown in the todo list. A model must infer when to branch and how to call next_step with the correct branch ID.

4. **No dispatch recovery guidance in planning node prompts** — If a planning node dispatches a subagent (e.g., dag-design dispatches headwrench as a subagent), there is no documented what to do if the dispatch fails or returns incomplete results.

5. **Compression validation is implicit, not explicit** — The compress node produces a summary, but the session-overview-refresher node does not explicitly verify that compression retained critical information.

6. **No success criteria for most planning nodes** — Nodes define expected output format (write findings to a file, call next_step, etc.) but not success criteria. A node has no way to evaluate whether it succeeded beyond whether it called the expected tools.

---

### Recommendations

1. **Add a substitution explanation at the beginning of any prompt using {{SESSION_PATH}}** — Include: "Throughout your prompts, you will see `{{SESSION_PATH}}`. This is your current session directory. Write all output files to this path." Include concrete examples: "Write findings to `{{SESSION_PATH}}/findings.md`" so the model sees the substitution is active.

2. **Create node-specific role statements that replace the identical generic statement** — Replace "You are a planning agent" with role-specific statements: "You are the session overview agent. Your job is to establish the problem context and identify constraints." "You are the external researcher. Your job is to investigate the problem space and document what you learned." This preserves the identical structural pattern while improving precision.

3. **Restructure conditional branching in external-research to use explicit branch discovery** — Document in the todo list: "Step 5: If the user approves, call next_step({ next: 'user-questions' }). If the user requests modifications, call next_step({ next: 'external-research' }). If the user wants to skip, call next_step({ next: 'write-notes' })." This makes branch IDs visible and eliminates inference.

4. **Add a dispatch failure recovery section to dag-design and dag-review node prompts** — Include: "If your dispatch to HeadWrench fails or returns incomplete results, call question_user to clarify what you need. Do not proceed with a DAG that has unresolved design issues."

5. **Add explicit compression validation to session-overview-refresher** — Include a todo step: "Compare your current context (from the problem statement and research notes) against the compressed summary from the compress node. If any critical constraints are missing, update your working context before proceeding to dag-design."

6. **Add success criteria to each planning node prompt** — Define at the beginning what success looks like for that specific node: "You will have succeeded when: [specific, checkable criteria]." Example for dag-design: "You will have succeeded when: (1) the DAG has one node for each user requirement, (2) all branches are explicitly defined, and (3) present_dag_to_user has been called."

---

## 6. Component Node Library Prompts

### Current State

Nineteen node types exist in the node library, each providing a template for how executing agents should behave within a project DAG. Every node template begins with "You are executing a plan" and follows a consistent structural pattern: role statement, todo list (5–7 items), rules section (positive framing), optional dispatch blockquotes, and a reasoning task at the end.

The most important enforcement pattern in the node library—"Step 3 is always @context-scout reading notes. Do not skip it."—appears in work-item, project-search-and-analysis, verify, commit, and research nodes. This pattern ensures that any executing agent always has current context before acting. This is a strong architectural constraint that prevents action-without-understanding.

The work-item node template contains a critical structural flaw: Todo step 2 requires loading an implementation skill (JuniorDev or DocumentationExpert) BEFORE step 3 dispatches @context-scout to read notes. The Rules section says "choose the skill based on what the scout describes"—but the todo list has already committed to loading a skill before the scout's input is received. A model following the todo strictly loads one skill (e.g., JuniorDev), then receives the scout's summary (which might recommend DocumentationExpert), then must use sequential-thinking to course-correct. If the scout reveals the wrong skill was loaded, there is no mechanism within the todo structure to reload the correct skill or backtrack.

The decision-gate node template instructs: "Call next_step({ next: '<branch-id>' }) with the exact node ID of the chosen branch." However, the template does not explain how to discover available branch IDs. The Rules section says "Read notes if you need context," but the read tool is blocked by the DAG enforcer—it is not in the exempt tools list and is not in the decision-gate's todo list. This creates a catch-22: the model is told to choose a branch but has no documented mechanism to discover the available options.

Two reliable branch discovery paths exist but are not documented in any node template:
1. Call recover_context (exempt tool) — produces output with a "## Pending Branch Choice" section that lists available node IDs in bold.
2. Call next_step() without a branch parameter — produces an error message that lists valid options. The following-plans skill covers this pattern for tool rejection, but not for branch discovery specifically.

The show_dag tool is documented in the following-plans skill as a recovery mechanism for learning the DAG structure, but is only accessible if the execution-kickoff output survives compression. If the full DAG was compressed into the session-overview-refresher summary, show_dag output may not be retrievable from context.

### Strengths

1. **Consistent structural pattern across 19 node templates** — Role statement, todo list, rules, optional blockquote, reasoning task. This uniformity aids local model navigation.

2. **"Step 3 is always @context-scout reading notes" enforcement** — This constraint appears in multiple high-consequence nodes and prevents action-without-understanding. It is one of the strongest behavioral invariants in the system.

3. **Positive framing throughout rules sections** — All node template rules use imperative verbs. No node uses negative constraints.

4. **Exact parameter names in dispatch blockquotes** — Node templates specify exact tool parameters (e.g., subagent_type: 'context-scout') rather than describing them abstractly.

5. **Reasoning tasks positioned at end** — End positioning ensures highest attention for the primary reasoning objective.

6. **Todo lists are appropriately scoped** — Most templates have 5–7 items, which is within the reliable range for local models.

---

### Weaknesses

1. **Work-item node requires skill loading before scout input** — Todo step 2 requires loading a skill before step 3 dispatches the scout. This forces the model to choose without information, then use sequential-thinking to course-correct. The structural order contradicts the Rules section.

2. **Decision-gate has no documented branch discovery mechanism** — Models are told to call next_step with a branch ID but have no explicit method to discover available branches. Three discovery paths exist (recover_context, show_dag, error message fallback) but only the error-message fallback is documented in any generic skill.

3. **No recovery path if subagent returns bad results** — Nodes dispatch subagents but do not document what to do if a dispatch fails or returns incomplete/vague results. The following-plans skill covers tool rejection recovery, but not dispatch-specific recovery.

4. **Role statements are generic and imprecise** — All node templates use "You are executing a plan," which is literally true but does not distinguish between a work node (which executes a specific task) and a branching node (which makes decisions). Precision would improve local model understanding.

5. **Todo step sequencing is not validated** — No node template explains whether todo steps must be executed in order, or whether steps can be reordered if a model realizes it needs information in a different sequence.

6. **No explicit success criteria in most node templates** — Nodes define expected tool calls but not what constitutes successful completion. A node has no checkable success criteria beyond "called the expected tools."

---

### Recommendations

1. **Restructure work-item to gather context before committing to a skill** — Reorder todo steps to: (1) Call @context-scout to read notes, (2) Based on scout summary, load the appropriate skill (JuniorDev or DocumentationExpert), (3) Execute the work. This aligns todo ordering with the Rules section guidance ("choose based on what the scout describes").

2. **Add explicit branch discovery to decision-gate node template** — Include a mandatory todo step: "Call recover_context and look for the 'Pending Branch Choice' section. The branch node IDs are listed in bold. These are your available options." This documents the most reliable discovery path without requiring the model to infer it.

3. **Create a "Subagent Failure Detection and Recovery" section in every node template that dispatches subagents** — Template: "If the subagent returns: (1) incomplete results (missing expected components), call question_user to clarify and retry. (2) vague results, call sequential-thinking to reason about what is missing, then retry or escalate. (3) off-topic results, the dispatch prompt may have been unclear—revise it and retry."

4. **Replace generic role statements with node-specific statements** — Instead of "You are executing a plan," use node-type-specific statements: "You are executing a work task. Implement the specific requirement described in your work item." "You are making a branching decision. Choose the next node based on the decision criteria." This preserves structural consistency while improving precision.

5. **Add explicit sequencing guidance to node templates** — Include: "Execute todo steps in order. Do not reorder steps. If you discover you need information from a later step, use sequential-thinking to reason through what you need and adapt within your current step—do not skip ahead."

6. **Add success criteria to every node template** — Define at the node template beginning what successful execution looks like: For work nodes: "You will have succeeded when: the work is complete, the output matches the specification, and you have called the next verification or commit step." For branching nodes: "You will have succeeded when: you have identified the correct branch and called next_step with the exact branch node ID."

---

## 7. Error Recovery and Failure Mode Resilience

### Current State

Error recovery guidance is sparse across the entire prompt surface. The only explicitly documented error recovery pattern is in the following-plans skill (34 lines), which contains a five-sentence block: "Read the error message. The error message will tell you which tool to use next. Call the tool the system expects. Do not retry the rejected tool." This block is concrete, actionable, and correctly positions error recovery as a skill all planning agents load.

Beyond this single skill, no node template, agent prompt, or delegation skill documents what to do when: a subagent returns incomplete results, a tool call succeeds but produces unexpected output, a file operation fails silently, or a dispatch returns off-topic content. The planning system has no layered failure recovery strategy; agents are expected to use sequential-thinking to reason through failures, but the reasoning process is not guided.

Five observed failure modes from testing local models (Qwen3-14B with thinking disabled) are particularly instructive:

1. **Tool parameter naming errors (6 consecutive failures)** — Models used 'command' instead of 'prompt', 'path' instead of 'filePath', 'input' instead of 'content'. Exact parameter names are specified in delegation skills and node templates, but models still hallucinate variations. This is the most frequent failure mode.

2. **File I/O confusion** — Models attempted to use file-write tools to "write a message to the user" instead of calling the question tool. This suggests confusion about what each tool is for, despite explicit descriptions.

3. **Multi-attempt recovery chains** — One tool rejection cascades into a 3–6 attempt recovery chain where each retry introduces a different error. The following-plans skill's recovery pattern ("Call the tool the system expects") terminates some chains but not all.

4. **Branching mechanics gap** — At decision-gates, models lack a documented method to discover branch options. They attempt show_dag (not in exempt tools list), ask the user (wrong tool), or retry the previous step instead of using recover_context or error-message fallback.

5. **Plan name uniqueness** — The execution-kickoff node requires calling activate_plan with a unique plan name. This requirement is not explicit in the node prompt. Models reuse plan names from previous sessions, causing activation failures. This failure affects both local and frontier models.

The DAG_EXECUTOR_MODE system injection is the strongest behavioral enforcement in the entire system. Injected as a system prompt addition on every turn, it ensures the most critical constraint ("Keep executing the DAG without pausing; do not ask the user what to do unless necessary") is in the highest-attention position. This system-level injection is significantly more reliable than end-positioned constraints in agent prompts.

The cascading failure mode (one error → 3–6 retries) suggests that the error recovery pattern in following-plans is necessary but not sufficient. Models recover from the first error, but if the recovery itself is wrong, they spiral into repeated failures. A more robust pattern would include an early-exit criterion: "After 2 failed retries, call sequential-thinking to reason about whether you are using the wrong approach entirely."

### Strengths

1. **Following-plans skill provides explicit error recovery guidance** — The five-sentence block is concrete and actionable. This is the clearest failure recovery guidance anywhere in the framework.

2. **DAG_EXECUTOR_MODE system injection enforces the most critical behavioral constraint at highest attention level** — This system-level injection is significantly more reliable than end-positioned rules in agent prompts.

3. **Error messages are designed to guide recovery** — The DAG enforcer produces detailed error messages that recommend the next tool ("Call next_step({ next: '<node-id>' })"). This follows the following-plans pattern of "read the error message to learn what to do next."

4. **Sequential-thinking skill provides reasoning scaffolding for difficult decisions** — While not explicitly a failure recovery mechanism, sequential-thinking anti-patterns (don't compress reasoning, don't lock in totalThoughts early) implicitly support error recovery by improving reasoning quality.

5. **Tool descriptions in delegation skills are concrete** — Each delegation skill specifies what the target agent can and cannot do, helping prevent wrong-agent dispatch failures.

---

### Weaknesses

1. **No documented recovery for incomplete or vague subagent results** — The following-plans skill handles tool rejection but not the case where a dispatch succeeds but returns incomplete content. No prompt documents: "If the scout only found 2 of 5 expected categories, retry with a more specific prompt or escalate to a different agent."

2. **No early-exit criteria after repeated failures** — Models spiral into 3–6 failure chains without an explicit criterion for when to stop retrying. The following-plans skill says "call the tool the system expects" but does not define "wrong approach entirely."

3. **Parameter naming errors are frequent despite specification** — Exact parameter names are documented in skills and node templates, but models still hallucinate variations (subagent_type → agent_type, filePath → path). The specification is necessary but not sufficient.

4. **File I/O confusion suggests inadequate tool separation** — Models attempt to use write-file tools for user communication, suggesting that tool descriptions do not clearly distinguish "write to project file" from "communicate with user."

5. **Branch discovery path is not documented at the point of need** — The decision-gate node does not explain how to discover branch options. The following-plans skill mentions recover_context for learning the DAG, but this is not specific to branch discovery.

6. **Plan name uniqueness is implicit, not explicit** — The execution-kickoff node does not document that plan names must be unique or how to ensure uniqueness. This causes failures that could be prevented by explicit guidance.

7. **No cascading failure prevention mechanism** — If recovery from the first error introduces a new error, there is no circuit-breaker. Models attempt recovery indefinitely without checking whether they are using the wrong approach.

---

### Recommendations

1. **Extend following-plans skill with subagent failure recovery patterns** — Add a new section after tool-rejection recovery: "When a subagent returns incomplete or vague results: (1) Read what they returned and identify what is missing. (2) Call question_user to clarify what you need, or retry the dispatch with a more specific prompt. (3) If retry fails twice, escalate to sequential-thinking to reason whether you need a different agent entirely."

2. **Add early-exit criteria to error recovery guidance** — Document in following-plans: "After 2 failed retries of the same tool or dispatch, call sequential-thinking to reason about whether your approach is wrong. If sequential-thinking suggests you need a different strategy, change your approach. If it suggests your approach is correct, try once more. If it fails a third time, call question_user for guidance."

3. **Create a "Tool Description Precision Guideline" for delegation skills and node templates** — Specify that every tool dispatch must include its exact purpose and parameter names side-by-side: "The task tool expects: subagent_type: 'junior-dev', prompt: '<your-dispatch-prompt>', success_criteria: '<checklist>', async: false. Do not use 'agent_type', 'agent', 'command', 'input', 'message', or 'async_mode'—these names are incorrect."

4. **Clarify tool separation in delegation skills by adding a "Which Tool Should I Use?" decision tree** — Before tool syntax sections, include: "Use task to dispatch an agent. Use question_user to ask the human. Use read to access files. Do not use file-write to communicate with users; use question_user instead."

5. **Add branch discovery as a mandatory todo step in decision-gate node template** — Include: "Step 1: Call recover_context and look for 'Pending Branch Choice'. The node IDs listed there are your branch options. Step 2: [Decision logic]. Step 3: Call next_step({ next: '<branch-node-id>' }) with one of the node IDs from Step 1."

6. **Document plan name uniqueness explicitly in execution-kickoff node prompt** — Add to the node's rules: "When calling activate_plan, use a plan name that has not been used before. Include a timestamp or session ID in the name to ensure uniqueness. Example: 'project-plan-' + current_date + '-' + session_id."

7. **Add a circuit-breaker mechanism to sequential-thinking anti-patterns** — Extend the sequential-thinking skill: "Do not attempt the same tool call more than twice in succession with different parameters. After 2 identical-tool failures with varied parameters, reason about whether your approach is wrong and choose a different strategy."

---

## 8. Token Budget and Attention Management

### Current State

Individual prompts are short enough that the Lost in the Middle effect—where LLM accuracy degrades >30% for content in the middle of long contexts—is not a concern in isolation. Planning node prompts (13–31 lines, approximately 130–300 tokens) and component node library templates (43–47 lines, approximately 400–450 tokens) are well within safe bounds for 14B models. Individual agent prompts (32–49 lines, approximately 250–400 tokens) are similarly modest.

However, the combined context at a dispatch node is more substantial. When HeadWrench executes a planning node, it reads: (1) HeadWrench's system prompt (~200 tokens), (2) DAG_EXECUTOR_MODE injection (~100 tokens), (3) loaded skill (~400–600 tokens for delegation skills), (4) the node prompt (~200–300 tokens). This totals approximately 1,000–1,200 tokens of instruction content. For 14B models, this is manageable but dense. For 9B models, this approaches the edge of reliable attention tracking.

The token distribution favors recent content. The sequence is: system prompt (earliest) → DAG_EXECUTOR_MODE (still early but before skills) → loaded skill (recent) → node prompt (most recent). The loaded skill (400–600 tokens) is in the high-attention tail position, making it the most influential instruction in the combined context. This is correct ordering if the skill teaches critical execution behavior.

The compress → session-overview-refresher pattern is a strong token budget mitigation. The compress node reduces accumulated research notes to a summary, preventing context bloat before the most demanding phase (dag-design). Session-overview-refresher then re-establishes the full context (user problem, constraints, initial findings) as fresh information, resetting the attention baseline before the planning phase.

Within individual planning nodes, reasoning tasks are correctly positioned at the end (end position = highest attention). This ensures the primary reasoning objective receives highest attention, even if earlier content (rules, constraints) is degraded by Lost in the Middle effect.

The work-item node template has a structural ordering issue: the skill-loading step (step 2) is positioned before the scout-reading step (step 3). This means the model commits to a skill choice before receiving the scout's input, forcing downstream sequential-thinking course-correction. This is inefficient in terms of token usage—it wastes reasoning tokens on correction that could have been prevented by reordering.

The execution-kickoff node produces a potentially large output (the full initialized DAG, all node prompts, environment setup). This output is then summarized by the compress node for the plan-success phase. If the output is very large, the summary may lose detail. This is an acceptable trade-off (plan-success is a lightweight phase), but it means the original full DAG is not guaranteed to survive to execution context without being compressed.

### Strengths

1. **Individual prompts are appropriately brief** — 32–49 lines for agents, 13–31 lines for planning nodes, 43–47 lines for component templates. Short enough to avoid Lost in the Middle effect within single prompts.

2. **DAG_EXECUTOR_MODE system injection receives highest attention by virtue of system prompt layer** — This ensures the most critical behavioral constraint is in the highest-attention position, not competing with other instructions.

3. **Token distribution favors recent content (loaded skill + node prompt)** — The model reads system instructions early (low attention) and execution-specific instructions recently (high attention), which is correct prioritization.

4. **Compress → session-overview-refresher manages context window explicitly** — Compression before the most demanding phase (dag-design) is a strong mitigation. The refresher resets context before planning.

5. **End-positioned reasoning tasks ensure primary objectives receive highest attention** — All prompts position reasoning tasks at the end, which is correct for attention management.

6. **Exact parameter names reduce hallucination** — Parameter specifications in delegation skills and node templates are positioned early in those sections, giving them attention that reduces naming errors.

---

### Weaknesses

1. **Combined dispatch context (1,000–1,200 tokens) is approaching the edge of local model reliable attention** — For 14B models this is manageable; for 9B models, this is pushing the boundary where some instruction content may be degraded by Lost in the Middle effect even within a 1,200 token window.

2. **Work-item todo sequencing wastes tokens on downstream correction** — Requiring skill choice before scout input forces sequential-thinking course-correction, wasting reasoning tokens that could have been prevented by reordering.

3. **Execution-kickoff output compression loses detail** — If the full DAG initialization is large, compress may lose granular detail that would help during execution. There is no validation that compression retained all critical information.

4. **No token budget guidance in prompts** — No node template or skill documents how to manage token usage or what to do if context is running low. Models have no guidance for token-constrained situations.

5. **Skill loading adds 400–600 tokens per dispatch** — This is necessary for behavioral guidance but is substantial. No mechanism exists to load smaller skills or skill subsets for less complex dispatches.

6. **Show_dag output may not survive compression** — The execution-kickoff output (which includes full DAG structure with node IDs) is compressed by the compress node. If execution agents need to use show_dag for branch discovery, the output must survive compression. There is no guarantee it does.

---

### Recommendations

1. **Add token budget awareness guidance to planning node prompts** — Include: "If your context is approaching capacity (you have read >8,000 tokens of notes or dispatches), prioritize the most critical information in your output. Compress non-essential details and focus on requirements and constraints." This gives models explicit permission to prioritize when context is tight.

2. **Add a "Lightweight Variant" to delegation skills for simple dispatches** — Create abbreviated versions of delegation skills that specify only the three essential requirements (tool syntax, agent limits, what to ask for) without examples or detailed explanation. Include guidance: "Use the lightweight variant for simple, well-scoped dispatches. Use the full skill for complex dispatches or when the agent has failed before."

3. **Restructure work-item todo to gather context before skill choice** — Reorder steps to: (1) Call scout, (2) Choose skill based on scout output, (3) Execute. This prevents the wasted downstream correction and improves token efficiency.

4. **Add explicit compression validation to session-overview-refresher** — Include: "Compare your current understanding of the problem (from notes and problem statement) with the compressed summary. If the summary lacks critical constraints or requirements, your compressed context is insufficient. Use sequential-thinking to reason about what is missing and update your working context before proceeding."

5. **Document show_dag retention requirements in execute-plan-session guidance** — Specify: "The execution-kickoff node's full DAG output must survive the compress phase. If the full DAG is compressed away, executing agents cannot use show_dag to discover branch options. If you are the compress agent, preserve all node IDs and branch definitions in your summary."

6. **Add a "Check Token Budget" step to the most complex planning nodes** — For dag-design and dag-review, include a step: "Before you begin detailed work, estimate your remaining token budget. If you have <2,000 tokens remaining, prioritize the review checklist over detailed explanation. If you have ≥2,000 tokens, provide full detailed feedback."

---

## 9. Consistency Across the Prompt Surface

### Current State

Terminology consistency is critical for local models, which must unify different framings of the same concept. A single concept referred to by multiple names (e.g., "dispatch prompt," "delegation prompt," "task prompt") creates decision overhead that 9B models often resolve by guessing, leading to incorrect behavior.

"Todo list" is perfectly consistent across the entire framework. Every agent prompt, planning node prompt, node template, and skill uses this exact term. There is no ambiguity.

"Dispatch prompt" vs. "delegation prompt" is a genuine split without explicit unification. Delegation skills use "delegation prompt" as the formal section heading and teach "How to write a delegation prompt." DAG-design, dag-review, and work-item node templates use "dispatch prompt" (e.g., "Call next_step with your dispatch prompt"). These terms are never equated as synonyms anywhere in the system. A 9B model loading a delegation skill (which teaches "delegation prompt") and then hitting "dispatch prompt" in a node prompt must silently unify them, inferring they refer to the same concept.

"Subagent" vs. "agent" splits predictably: node library prompts (work-item, decision-gate, commit) use "subagent" to describe dispatched agents, suggesting subordinate relationship. Planning prompts (dag-design, dag-review) use "design agent" and "review agent," suggesting peer headwrench instances. The split makes architectural sense (design/review agents are peers, not subordinates) but is never explained. A 9B model may treat "subagent" and "agent" as different concepts rather than context-dependent references to the same agents.

"Checklist" appears only in the dag-review skill and prompt (the review uses a "7-item review checklist"). Everywhere else, numbered action items are called "Todo List." A 9B model reading the review checklist may treat it as a parallel structure for its own execution rather than as instructions to pass to the reviewer.

"Branch ID" and "node ID" are used in the same sentence in both decision-gate node templates and error messages without explicit definition. The decision-gate template says: "Call next_step({ next: '<branch-id>' }) with the exact node ID of the chosen branch." The plugin error message says: "Valid options: [node-a, node-b]" with no type label. The recover_context output shows pending choices under "## Pending Branch Choice" with no explicit label. Four surfaces present the same concept with four different framings.

"SESSION_PATH" appears in planning node prompts as `{{SESSION_PATH}}/filename.md` but is never defined. Models may not recognize it as a template variable. The plugin substitutes it, but the model is not informed of the substitution. This is similar to the branch-ID/node-ID confusion but more severe because it affects tool parameter correctness.

"Skill" and "delegation skill" are not consistently separated. Some contexts refer to "load the junior-dev skill" (imprecise—is this the delegation skill for dispatching JuniorDev, or a skill that teaches how to do junior dev work?). Others say "load the junior-dev delegation skill" (precise but verbose). The terminology is ambiguous enough that a 9B model may load the wrong skill.

### Strengths

1. **"Todo list" is perfectly consistent across the entire framework** — All contexts use this exact term with no ambiguity.

2. **Structural patterns are consistent enough to be recognizable** — All agent prompts follow role→rules→output; all planning nodes follow role→todo→rules→blockquote→reasoning. This structural consistency compensates for some terminology inconsistencies.

3. **"Subagent" vs. "agent" split is logical** — When explained, the distinction (peers vs. subordinates) makes sense and is not ambiguous once understood.

4. **Parameter names are consistent in syntax blocks** — All delegation skills and node templates use the same parameter names (subagent_type, prompt, success_criteria, async). This consistency is strong.

5. **Tool names are consistent across all contexts** — The task, question, read, write, recover_context, show_dag, next_step names are never aliased or varied.

---

### Weaknesses

1. **"Dispatch prompt" and "delegation prompt" are used interchangeably without explicit unification** — Delegation skills teach "delegation prompt"; node templates use "dispatch prompt." Models must infer they are the same concept.

2. **"Subagent" and "agent" are context-dependent without explicit guidance** — Planning prompts use "agent," node templates use "subagent." The distinction (peer vs. subordinate) is never explained.

3. **"Checklist" appears only in one context without clear relationship to "todo list"** — The dag-review checklist may be confused with a todo list or treated as a parallel structure.

4. **"Branch ID" and "node ID" are used inconsistently without explicit equivalence** — Error messages, decision-gate templates, and recover_context output present the same concept with different labels.

5. **SESSION_PATH is used as a template variable but never explained as such** — Models read `{{SESSION_PATH}}/filename.md` with no explicit guidance that this is a substitution token.

6. **"Skill" and "delegation skill" are imprecisely separated** — It is ambiguous whether "the junior-dev skill" refers to a delegation skill (how to dispatch JuniorDev) or a capability skill (how to do junior dev work).

7. **"Execute" vs. "dispatch" are context-dependent without guidance** — Planning agents "dispatch" subagents; component agents "execute" work. The distinction is not explained.

---

### Recommendations

1. **Create a terminology matrix in a new file `docs/terminology.md` that defines every key term and its usage contexts** — Define: "dispatch prompt" = "delegation prompt" (synonym; both refer to the prompt passed to the task tool), "subagent" = context-dependent reference to any agent called via the task tool (in planning nodes: design/review agents; in component nodes: implementation/context agents), "checklist" = structured list of evaluation criteria (specifically used in dag-review; equivalent to a todo list in purpose), "branch ID" = "node ID" (synonym; both refer to the string identifier of a DAG node), SESSION_PATH = template variable substituted by the planning-enforcement plugin at copy-time (substitute with actual session path before use). Include example usages for each term so models (and humans) can unify different framings.

2. **Standardize on "dispatch prompt" throughout all delegation skills and node templates** — Replace "delegation prompt" with "dispatch prompt" everywhere for consistency. Update delegation skill section headings and all references.

3. **Add explicit guidance to planning node prompts that define "subagent" and "agent" distinction** — Include in dag-design and dag-review prompts: "In planning prompts, 'agent' refers to specialized agents (ContextScout, JuniorDev, etc.). These agents are peers of HeadWrench, not subordinates. You are designing a DAG that HeadWrench (another planning instance) will execute. Agents dispatched in the DAG are called 'subagents' from the executing agent's perspective."

4. **Rename dag-review's "checklist" to "Review Todo List" to align with system terminology** — Update the dag-review skill and prompt to use "Review Todo List" instead of "Review Checklist." This eliminates the term "checklist" and unifies with the system-wide "todo list" terminology.

5. **Add a "Branch IDs are Node IDs" clarification to decision-gate node template and following-plans skill** — Include: "When the system shows you 'Pending Branch Choice: [node-a, node-b, node-c]', these are branch identifiers. They are the exact values to pass to next_step({ next: '<node-id>' })."

6. **Add SESSION_PATH explanation to the beginning of any prompt using the variable** — Include: "Throughout these prompts, you will see `{{SESSION_PATH}}`. This is a template variable that the planning system substitutes with your current session directory path (e.g., `.opencode/session-plans/plan-session-ses_abc123/`). When you write to a file, use the substituted path."

7. **Standardize delegation skill terminology to "dispatch <agent>" instead of "load the <agent> skill"** — Reframe as: "To dispatch JuniorDev, use the task tool with subagent_type: 'junior-dev'." This clarifies the distinction between the delegation skill (how to dispatch) and the target agent (what gets dispatched).

---

## 10. Interaction Between Agent Prompts, Skills, and Node Prompts

### Current State

The multi-layer instruction stack creates powerful coherence when layers align but cascading confusion when they diverge. When HeadWrench executes a planning node, it reads three layers of instruction: (1) the HeadWrench agent prompt (how to be a planning agent), (2) an optional loaded skill (how to perform a specific task like dispatch or DAG design), (3) the node prompt (specific work for this node).

The combined content is coherent in its shared goal. HeadWrench's agent prompt says "Execute the DAG according to its rules, following your todo list." A loaded skill (e.g., dag-design) teaches "How to design a DAG using the task tool." The node prompt says "Design a DAG by following this todo list and using this dispatch instruction." All three layers reinforce executing a todo list and dispatching as needed.

However, the tension is between the skill's compact example and the node prompt's detailed blockquote. Both describe what to put in a dispatch prompt, and they are positioned differently (skill teaches the principle, node prompt shows the implementation). A weak model must synthesize them without explicit guidance on how to weight them. If they contradict slightly (skill says "ask what the agent cannot do," node blockquote says "ask what the agent will report"), the model must choose which to prioritize.

The orientation-scout and external-research nodes are the strongest examples of cross-layer consistency. The delegation skills teach five requirements for an orientation-scout dispatch. The planning node prompts include rules that enforce the same five requirements using identical language. A model reading both the skill and the node prompt reads identical constraints twice, which aids attention and retention without requiring synthesis.

The dag-design and dag-review skills are the weakest examples of cross-layer coherence. They are written from the dispatcher's perspective ("How to call the task tool," "What the DAG Design Agent Does"). When HeadWrench loads these to execute as the design agent, it reads "call the task tool to dispatch a design agent" and must infer that it should execute instead of dispatch. This inference is unreliable for 9B models. The skill's statement "Call the task tool with subagent_type='headwrench'" invites a 9B model to dispatch yet another headwrench subagent rather than execute as headwrench itself.

The combined instruction token load at a dispatch node (~1,000–1,200 tokens) is manageable for 14B models. For 9B models, the skill content (400–600 tokens) is loaded as the most recent instruction before the node prompt, positioning it in the high-attention tail. This is correct—the most recently loaded content is the most relevant for immediate execution. However, if the skill is poorly aligned with the node (as with dag-design), the high-attention positioning makes the misalignment more harmful, not less.

The work-item node demonstrates weak interaction between skill and prompt. The node's Rules section says "Choose the skill based on what the scout describes," implying the skill choice is data-driven. But the node's todo list (step 2) requires choosing and loading a skill BEFORE the scout's input (step 3) arrives. A model reading the node prompt must either (a) ignore the Rules guidance and proceed without a skill, or (b) guess which skill to load and be wrong. This directly conflicts with the skill-loading interaction pattern across the rest of the system.

The following-plans skill is the most omnipresent layer of instruction—it is loaded by default and appears in every planning context. However, it is never explicitly mentioned in planning node prompts or agent prompts. Models know to load it because the system loads it automatically, but the prompts do not reference it or reinforce its rules. This is a missed opportunity for attention and retention.

### Strengths

1. **Orientation-scout and external-research show strong cross-layer coherence** — Skill, node prompt, and agent definition all enforce the same constraints using identical language. This reinforces critical patterns.

2. **Combined instruction coherence is strong** — When all three layers (agent prompt, skill, node prompt) push toward the same goal, the reinforcement is powerful and improves local model reliability.

3. **Recent-content advantage is used correctly** — Skill content is loaded recently (high attention) and is the most relevant for immediate execution. Positioning is correct.

4. **Skill loading pattern is consistent across all delegations** — All seven delegation skills follow the same pattern (tool syntax, agent limits, dispatch instruction template, expected report, good/bad examples), making skill-prompt interaction predictable.

5. **Parameter name consistency across layers reduces hallucination** — All three layers (agent prompt examples if any, skill tool syntax, node prompt blockquote) use identical parameter names, which aids model accuracy.

---

### Weaknesses

1. **Dag-design and dag-review skills confuse executor about whether to dispatch or execute** — Dispatcher-centric framing ("How to call the task tool," "What the design agent does") misleads a loaded design agent about its own role. This is a critical interaction failure.

2. **Work-item requires skill choice before scout input, contradicting the Rules section** — The Rules say "choose based on what the scout describes," but the todo list requires loading a skill before the scout's input arrives. Model must resolve this contradiction.

3. **Skill and node prompt may contradict subtly on dispatch requirements** — If the skill teaches "ask the agent what it cannot do" and the node prompt says "ask what it will report," the model must choose without explicit guidance.

4. **Following-plans skill is omnipresent but never explicitly reinforced** — The skill is loaded automatically but never mentioned in planning node prompts. Missing opportunity for attention and retention of critical error-recovery patterns.

5. **No guidance on skill precedence when multiple skills are loaded** — Some agents load multiple skills (JuniorDev might load both sequential-thinking and junior-dev delegation skill). Prompts do not explain which to prioritize if they conflict.

6. **Skill side effects are not documented in agent or node prompts** — Sequential-thinking changes reasoning behavior (verbose thoughts). Loaded skills may affect context length or reasoning style. No prompt documents how to adapt to a skill's side effects.

7. **Node prompt blockquotes add architectural requirements not taught in skills** — Dag-design blockquote requires add_node parameters and rationale document path. These architectural layers are not in the delegation skill.

---

### Recommendations

1. **Rewrite dag-design and dag-review skills from executor perspective** — Replace dispatcher-centric framing with executor-centric framing: "When you execute the dag-design node, you use the task tool to dispatch a HeadWrench subagent to do detailed design. Here is how to write that dispatch prompt..." This clarifies that the loaded skill is teaching how to dispatch, not how to execute.

2. **Reorder work-item todo to gather scout input before skill choice** — Restructure todo: (1) Call scout, (2) Based on scout results, load appropriate skill, (3) Execute work. This aligns todo with Rules section guidance and eliminates the contradiction.

3. **Document skill precedence explicitly in HeadWrench agent prompt** — Add: "If multiple skills are loaded (e.g., sequential-thinking and a delegation skill), prioritize sequential-thinking for reasoning quality and use the delegation skill for tool syntax and structure."

4. **Add explicit cross-skill coherence statements to node prompts** — For orientation-scout node, add: "Notice that your rules match the delegation skill requirements exactly. This redundancy is intentional—it ensures you focus on the right constraints."

5. **Reinforce following-plans skill in planning node prompts that depend on error recovery** — For complex nodes like external-research that may encounter user rejections, add: "If the user rejects your proposed work, read the error message (documented in the following-plans skill) to learn what to do next."

6. **Add a "Skill Side Effects" section to any node that loads a skill** — Document: "You will load the [skill-name] skill. This skill emphasizes [constraint]. This may make your responses more verbose or more structured. This is expected and helpful—do not try to bypass the skill's guidance."

7. **Move architectural requirements from node blockquotes into delegation skills** — For dag-design, move add_node parameter rules and rationale document requirements from the blockquote into a new "Architectural Layer" section in the delegation skill. This ensures architectural requirements are taught at skill-level, not scattered across node prompts.

---

## 11. Branching Decision Mechanics

### Current State

Branching decisions are points in the DAG where execution can follow multiple paths based on conditions. The decision-gate node template exists specifically to handle branching, and multiple work-node templates include conditional logic (e.g., external-research branches on user approval, commit branches on success/failure).

The decision-gate prompt states: "The branch options are shown in the DAG" but provides no mechanism to see the DAG from within execution context. The show_dag tool is exempt (available), but the decision-gate prompt does not include it in its todo list or mention it in the Rules. The "Read notes if you need context" instruction is also present but the read tool is not in the exempt tools list—blocked by the DAG enforcer.

The exempt tools are exactly: plan_session, activate_plan, next_step, recover_context, question, exit_plan, todowrite, sequential-thinking_sequentialthinking. Neither show_dag nor read is in this list, though show_dag is in the exempt list (it IS available). The decision-gate prompt does not mention show_dag by name, so a model must know to use it or discover it through trying.

Two reliable branch discovery paths exist, neither fully documented at the point of need:

1. **Call recover_context (explicitly exempt)** — Produces output with a "## Pending Branch Choice" section that lists available node IDs in bold. This is the clearest presentation of branch options in the system. However, the decision-gate prompt does not mention recover_context or explain what it returns.

2. **Call next_step() without a branch parameter** — Produces an error: "Branch choice required. Valid options: [node-a, node-b, ...]. Call next_step({ next: '<node-id>' }) to choose." The following-plans skill covers this error-message recovery pattern ("read the error message to learn what to do"), but frames it for tool-sequencing failures, not branch discovery. A model must apply the pattern to a new context.

A third theoretical path exists but requires preconditions:

3. **Call show_dag (exempt but not mentioned)** — Returns the full DAG as ASCII Mermaid diagram with node IDs visible. However, this output can only be accessed if the execution-kickoff's full DAG definition survives the compress phase. If execution-kickoff output was compressed, show_dag output may not be in context.

A fourth path exists but is fragile:

4. **Recall branch options from Qdrant semantic memory** — The planning system uses semantic memory to store planning context, but branch IDs are never explicitly stored during planning. This path is theoretical and unreliable.

No mechanism guarantees the executing agent knows its branch options before calling next_step at a decision-gate. All four discovery paths require unreinforced action: recover_context is not mentioned in the decision-gate prompt, show_dag is not mentioned, error-message fallback requires using the following-plans recovery pattern in a new context, and Qdrant retrieval is not documented.

The work-item node includes an implicit decision-gate that branches based on scout results. The Rules section says "you may decide to branch" but does not explain when or how to branch, and the todo list does not include an explicit branch step. This makes the branching implicit rather than explicit, which is less reliable for 9B models.

The external-research node includes explicit conditional logic ("If approved → next, If modify → retry, If skip → branch") in the Rules section, but the actual branch node IDs are not specified in the prompt. The model is told "if approved, proceed to the next node" but does not know which node ID to pass to next_step.

### Strengths

1. **recover_context explicitly lists pending branch choices** — This is the clearest presentation of branch options in the system. The output format ("## Pending Branch Choice" with bold node IDs) is unambiguous.

2. **Error message fallback follows established pattern from following-plans skill** — The error-message format ("Valid options: [node-a, node-b]") is consistent with other tool rejection messages, making it discoverable by models that know the following-plans recovery pattern.

3. **Decision-gate node template exists specifically for branching** — Dedicating a node type to branching decisions makes the pattern explicit rather than implicit.

4. **Branch options are deterministic in DAG** — Unlike runtime decisions that depend on unexpected conditions, branch options are fixed at DAG definition time, making them discoverable rather than invented.

---

### Weaknesses

1. **Decision-gate prompt does not mention recover_context or show_dag** — The prompt says branch options "are shown in the DAG" but does not tell the model how to view the DAG or access branch options. Models must infer the discovery path.

2. **Multiple branch discovery paths exist without hierarchy or guidance** — Four possible paths (recover_context, show_dag, error-message fallback, Qdrant) create decision overhead. No guidance on which to try first or when each is reliable.

3. **recover_context is exempt but not documented in decision-gate or following-plans** — The decision-gate prompt does not mention recover_context at all. The following-plans skill mentions recover_context for "learning the DAG structure" but not for branch discovery specifically.

4. **Show_dag is exempt and potentially helpful but not mentioned** — The decision-gate prompt does not mention show_dag, so a model must independently discover it or never use it.

5. **Error-message fallback requires applying following-plans pattern to new context** — The pattern is taught for tool-sequencing failures but not documented for branch discovery. Models must transfer the pattern.

6. **Work-item node has implicit branching without explicit steps** — The Rules say the model "may decide to branch" but do not explain when or how. The todo list does not include a branch step.

7. **External-research node specifies conditions but not branch node IDs** — The Rules say "if approved, proceed to next node" but the node ID is not specified. The model must infer or discover the ID.

8. **Branch options do not survive compression reliably** — If execution-kickoff DAG output is compressed, the full node structure (needed for show_dag discovery) may be lost.

---

### Recommendations

1. **Add recover_context to the mandatory todo list in decision-gate node template** — Restructure decision-gate todo: "Step 1: Call recover_context. Step 2: Look for the 'Pending Branch Choice' section. The node IDs listed in bold are your available options. Step 3: [Decision logic]. Step 4: Call next_step({ next: '<node-id>' }) with one of the node IDs from Step 2."

2. **Document branch discovery path hierarchy in following-plans skill** — Extend the skill with a "Branch Discovery" section: "At a branching decision, use this order: (1) Call recover_context first—it is explicitly designed for branch discovery. (2) If recover_context is unavailable, try calling show_dag. (3) If both fail, call next_step() without a branch parameter—the error message will list valid options."

3. **Add explicit branch node IDs to all prompts with conditional logic** — For external-research, replace "if approved, proceed to next node" with "if approved, call next_step({ next: 'user-questions' })." For work-item, include: "If you decide to branch (e.g., work is complete and requires verification), call next_step({ next: 'verify' })."

4. **Remove implicit branching from work-item; make it explicit** — Replace "you may decide to branch" with a conditional todo step: "Step 5: If the work is complete and requires verification, call next_step({ next: 'verify' }). Otherwise, call next_step({ next: 'plan-success' })." This makes branching explicit and visible.

5. **Add branch preservation to compress node guidance** — Document: "When compressing execution-kickoff output, preserve all node IDs and branch definitions. Do not compress away DAG structure information that executing agents need for branch discovery."

6. **Create a "Branch Discovery Decision Tree" in decision-gate template** — Add a visual decision aid: "How to find your branch options: Does recover_context run successfully? (Yes → Use 'Pending Branch Choice' section) → No → Try show_dag → Still no? → Call next_step() and read error message."

7. **Document show_dag explicitly as an optional tool for branch discovery** — Add to decision-gate Rules: "If you need to understand the full DAG structure to make your branching decision, call show_dag. The output shows all available nodes and branches."

---

## Prioritized Summary

The following recommendations are ordered by expected impact on local model reliability (highest impact first). This ranking reflects which changes are most likely to reduce observed failure rates based on the five documented failure modes and the structural flaws identified in the investigation.

### 1. Add explicit branch discovery to decision-gate and recover_context documentation

**Change:** Modify the decision-gate node template to include recover_context as a mandatory first step, with explicit guidance to look for the "Pending Branch Choice" section. Update the following-plans skill to document branch discovery as a specific use case of the error-recovery pattern.

**Rationale:** Branching mechanics failures (failure mode #4) are partially caused by models lacking a documented discovery path. This recommendation provides an explicit, reliable path without requiring inference or exploration. The recover_context tool already works correctly; the gap is documentation. This change has high impact because it eliminates a failure mode that cascades through the DAG (a missed branch leads to wrong execution path, which may lead to 3–6 additional errors).

**Semantic area:** 11 (Branching Decision Mechanics)

---

### 2. Restructure work-item todo to gather context before skill loading

**Change:** Reorder the work-item node template's todo list to call @context-scout first (step 1), load the appropriate skill based on scout results (step 2), then execute the work (step 3). This aligns the todo structure with the Rules section guidance ("choose the skill based on what the scout describes").

**Rationale:** This flaw causes the model to commit to a skill choice without the information it needs, forcing downstream sequential-thinking course-correction. This wastes reasoning tokens and increases the likelihood of using the wrong skill. The fix is a simple reordering that aligns todo with rules. This has high impact because work-item is the most frequently executed node in component DAGs, and this flaw affects every execution.

**Semantic area:** 3 (Delegation Prompt Quality) and 6 (Component Node Library Prompts)

---

### 3. Create explicit parameter naming specification with forbidden variations listed

**Change:** Add a new section to all delegation skills and node templates that lists exact parameter names alongside forbidden variations. Example: "The task tool requires: subagent_type: (correct) / agent_type, agent, agent_name, type (forbidden). Use only subagent_type."

**Rationale:** Tool parameter naming errors are the most frequent failure mode (failure mode #1: 6 consecutive failures). Current documentation specifies correct names but does not explicitly call out common variations models hallucinate. This change targets the root cause by making incorrect variations visible and explicitly forbidden. High impact because this failure mode occurs on nearly every dispatch.

**Semantic area:** 3 (Delegation Prompt Quality) and 7 (Error Recovery and Failure Mode Resilience)

---

### 4. Add subagent failure detection and recovery patterns to all dispatch instructions

**Change:** Create a standard recovery section for all node templates and skills that dispatch subagents. Document: (1) how to detect incomplete results, (2) how to retry with clarification, (3) when to escalate or use sequential-thinking to reason about whether the approach is wrong.

**Rationale:** No mechanism currently exists to recover from incomplete or off-topic subagent results (failure mode #2 and #3). The following-plans skill covers tool rejection recovery but not dispatch-specific failures. This creates cascading failures where one bad dispatch result propagates downstream. Adding explicit recovery patterns gives models a documented path instead of forcing them to infer recovery strategies.

**Semantic area:** 7 (Error Recovery and Failure Mode Resilience)

---

### 5. Rewrite dag-design and dag-review skills from executor perspective

**Change:** Reframe both skills to use executor-centric language. Replace "How to call the task tool" with "When you execute dag-design, you use the task tool to dispatch a subagent. Here is how to write that dispatch prompt..." This eliminates the ambiguity where a loaded design skill confuses the design agent about whether it should dispatch or execute.

**Rationale:** This dual-use flaw (failure mode of interaction between layers) causes models executing as the design agent to attempt dispatching yet another subagent rather than doing the design work. This creates infinite recursion or cascading failures. The fix is a perspective reframe that clarifies the skill is teaching how to delegate, not how to execute. This has high impact because dag-design is the most complex planning node, and this confusion there propagates throughout the system.

**Semantic area:** 2 (Skill File Effectiveness) and 10 (Interaction Between Agent Prompts, Skills, and Node Prompts)

---

### 6. Document plan name uniqueness requirement explicitly in execution-kickoff

**Change:** Add to the execution-kickoff node prompt: "When calling activate_plan, use a unique plan name. Include a timestamp or session ID to ensure uniqueness (e.g., 'project-plan-2026-04-04-xyz')."

**Rationale:** Plan name collisions cause activation failures that block execution-kickoff (failure mode #5). This requirement is implicit in the activate_plan tool but not documented in the execution-kickoff node that uses it. This is a simple documentation fix with direct impact—it prevents a specific, repeatable failure.

**Semantic area:** 5 (Planning DAG Node Prompts)

---

### 7. Add SESSION_PATH substitution explanation to all planning node prompts using the variable

**Change:** Add a paragraph at the beginning of any planning node prompt using {{SESSION_PATH}}: "Throughout this prompt, you will see `{{SESSION_PATH}}`. This is a template variable that the planning system substitutes with your actual session directory before you see it. When you write to files, use the substituted path."

**Rationale:** Models may not recognize {{SESSION_PATH}} as a template variable and may attempt to write to literal "{{SESSION_PATH}}" paths or become confused about file locations. This is a clarity issue that affects file I/O operations. While not as frequent as parameter naming errors, it does cause file operation failures and context loss.

**Semantic area:** 5 (Planning DAG Node Prompts)

---

### 8. Create a terminology unification matrix documenting all multi-name concepts

**Change:** Create `docs/terminology.md` that explicitly defines every key term (dispatch prompt = delegation prompt, subagent = context-dependent agent reference, branch ID = node ID, checklist = evaluation todo list, etc.) with usage examples. Reference this from AGENTS.md and link to it from the beginning of planning node prompts.

**Rationale:** Terminology inconsistencies create decision overhead for local models, which must infer whether "dispatch prompt" and "delegation prompt" are the same concept. This overhead is not a primary failure mode but contributes to cascading confusion when models are already stressed. Unifying terminology reduces friction and improves model confidence. Moderate impact because this affects reasoning quality across the system rather than causing outright failures.

**Semantic area:** 9 (Consistency Across the Prompt Surface)

---

### 9. Add architectural requirement layer to delegation skills for dag-design and dag-review

**Change:** Create a new "Architectural Layer" section in dag-design and dag-review skills that documents add_node parameter rules, output document path requirements, and system call sequencing. Move these requirements from planning node blockquotes into the skill.

**Rationale:** Architectural requirements are scattered between delegation skills and planning node blockquotes. A model reading the skill may not absorb the architectural layer, leading to failures that surface only during review. Moving these into the skill ensures they are learned together with core dispatch requirements. Moderate impact because these failures are caught by the review phase, but preventing them earlier improves efficiency.

**Semantic area:** 3 (Delegation Prompt Quality)

---

### 10. Add explicit cross-layer coherence statements to nodes with strong skill alignment

**Change:** For orientation-scout and external-research nodes (which have strong skill-prompt coherence), add a statement: "Notice that your rules match the delegation skill requirements exactly. This redundancy is intentional and ensures you focus on the right constraints."

**Rationale:** These nodes are examples of what cross-layer coherence should look like, but models do not recognize the intentional redundancy. Calling it out explicitly reinforces the pattern and helps models trust the constraint structure. Low to moderate impact because these nodes already work well; this improves understanding rather than fixing failures.

**Semantic area:** 10 (Interaction Between Agent Prompts, Skills, and Node Prompts)

---

### 11. Extend following-plans skill with explicit cascading failure early-exit criteria

**Change:** Add to the following-plans skill: "After 2 failed retries of the same tool or dispatch, call sequential-thinking to reason about whether your approach is wrong. If sequential-thinking suggests you need a different strategy, change your approach. If it suggests the approach is correct, try once more. If it fails a third time, call question_user for guidance."

**Rationale:** Cascading failures (failure mode #3: 3–6 consecutive retries) spiral because models repeat the same approach indefinitely. Adding explicit early-exit criteria after 2 failures gives models a documented decision point. This prevents some spiral failures and is a low-cost change (just guidance, no structural changes). Moderate impact because it doesn't prevent the first failure but prevents downstream cascades.

**Semantic area:** 7 (Error Recovery and Failure Mode Resilience)

---

### 12. Add token budget awareness guidance to planning node prompts

**Change:** Add to complex planning nodes (external-research, dag-design, dag-review): "If your context is approaching capacity (you have read >8,000 tokens of notes or dispatches), prioritize critical information in your output. Compress non-essential details."

**Rationale:** This is a low-cost change that gives models explicit permission to prioritize when context is tight, rather than forcing them to choose implicitly. Moderate impact because it affects response quality and efficiency but is not a primary failure mode. Becomes more important as sessions grow longer.

**Semantic area:** 8 (Token Budget and Attention Management)

---

### 13. Document skill side effects and precedence in HeadWrench agent prompt

**Change:** Add to the HeadWrench agent prompt: "When multiple skills are loaded (e.g., sequential-thinking and a delegation skill), prioritize sequential-thinking for reasoning quality. Side effects: Sequential-thinking may make your reasoning verbose. This is expected and helpful."

**Rationale:** This clarifies skill interaction and prevents models from attempting to suppress skill behavior. Low to moderate impact because it improves reasoning quality and model confidence rather than preventing failures.

**Semantic area:** 10 (Interaction Between Agent Prompts, Skills, and Node Prompts)

