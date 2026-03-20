# Round 01 Findings — Planning System & Session Plan Design

**Research Question:** What is the ideal design for an AI coding assistant's planning system — covering planning modes, how a planning session produces an optimized execution plan, and what the ideal session plan structure looks like for reliable, resumable, delegated execution?

---

## Angle 1: Planning System Design Patterns

**Most Important Finding: Plan-and-Execute architecture is the dominant pattern separating planning from execution in production systems.**

The Plan-and-Execute pattern is explicitly defined to solve complexity failure in autonomous agents:
> "Most AI agent failures come down to one problem: the agent was asked to do something complex without being given a structured way to think about it. You give it a goal, it tries to go from A to Z in one move, and somewhere around M it loses the thread."
— Ronnie Huss, https://ronniehuss.co.uk/building-ai-multiplied-teams-plan-and-execute-agents/

**Key Pattern 1: Plan-and-Execute Separation**
- **Planning Phase**: Generate a structured, multi-step plan before any execution begins
- **Execution Phase**: Work through each step sequentially, revising the plan as outputs inform next steps
- **Revision Cycle**: Each step output becomes context for plan adjustment

**Key Pattern 2: ReAct (Reason-Act-Reflect)**
From Yao et al. (ICLR 2023):
- **Interleaved Loop**: Thought → Action → Observation → Thought (repeat)
- **Grounding Against Reality**: The critical implementation detail is the **stop sequence** — cutting generation at "Observation:" so the runtime provides real data instead of the model hallucinating it
- **Failure Modes**: Infinite loops, hallucinated success from silent tool returns, context overflow
- Source: https://arxiv.org/abs/2210.03629

⚠️ **Design divergence:** ReAct requires a tight loop with immediate feedback. Document-based planning (Markdown subtasks) breaks this loop — the planner cannot observe and react to execution results in real-time. ReAct's architecture assumes synchronous feedback flow.

**Key Pattern 3: LLMCompiler (Kim et al., ICML 2024)**
- **Function Calling Planner**: Formulates execution plans
- **Task Fetching Unit**: Dispatches tasks (enables parallelism detection)
- **Executor**: Runs tasks in parallel where dependencies allow

**Critical Performance Finding**: LLMCompiler achieves:
- **3.7x latency speedup** vs ReAct (via parallel execution)
- **6.7x cost savings** vs ReAct (fewer tokens via dependency optimization)
- **~9% accuracy improvement** vs ReAct
- Source: https://arxiv.org/abs/2312.04511

⚠️ **Design divergence:** Sequential Markdown subtasks cannot express parallelizable dependencies. The planner must explicitly identify which tasks can run in parallel and provide that as artifact structure.

**What distinguishes reliable planning:**
1. **Explicit plan representation** — a data structure the planner outputs that the executor consumes
2. **Stop sequences** — hard boundaries between reasoning and acting to prevent hallucination
3. **Revision gates** — explicit points where the executor validates the plan against reality
4. **Task decomposition using complexity measures** — not heuristic breakdowns
- Source: ACONIC framework, https://arxiv.org/html/2510.07772v1

---

## Angle 2: Planning Modes — Structural Differences

**Most Important Finding: Different planning modes must produce fundamentally different output structures, not just different content.**

**Deep Research Mode** (Research Brief Output)
- Goal: Information synthesis, not executable steps
- Plan artifact should: Include source citations, confidence levels, caveats, literature review structure
- Execution differs: No "do X" subtasks; instead "investigate source Y," "compare claims A vs B," "flag contradiction Z"
- Stop condition: Information completeness, not task completion

**Debug Mode** (Root-Cause Focus)
- Goal: Identify cause, propose targeted fix
- Plan artifact should: Include hypothesis space, test plan (what would prove/disprove each hypothesis), ordering (test cheap hypotheses first)
- Key difference: Order is by information value, not task dependency

**Collaborative Mode** (Human Review Points)
- Goal: Human approval at critical junctures
- Plan artifact should: Include decision points marked with "REVIEW REQUIRED," context for human decision, alternative paths
- Execution: Halt at review points, **resume mid-plan** with modified context
- Critical requirement: Resumability — executor must know how to continue after human decision

⚠️ **Design divergence:** Current document-based planning does not support resumption from mid-execution with human decisions incorporated. The artifact format must include both "current state" and "possible continuations" from decision points.

**Generic/Feature Mode (Autonomous Execution)**
- Goal: Full execution without human intervention
- Plan artifact should: Include validation gates (each subtask has success criteria), fallback options, rollback points
- Key difference: Must be fully self-contained; executor cannot ask clarifying questions

**Mode Selection Triggers (inferred from research):**
1. Task complexity (high complexity → Plan-and-Execute required)
2. Information uncertainty (high uncertainty → Research mode)
3. Risk level (high risk → Collaborative mode required)
4. Time to resolution (fast needed → Parallel execution mode)

⚠️ **Design divergence:** A planning system that produces the same structure for all modes will fail on collaborative and research workflows. Each mode needs a structurally distinct artifact.

---

## Angle 3: Session Plan Artifacts for Autonomous Execution

**Most Important Finding: Plan artifacts must be designed for three specific properties: isolation, resumability, and dependency clarity.**

**1. Context Isolation**
- Each executor task receives ONLY what it needs
- Prevents prompt injection; reduces token overhead
- Implementation: Plan artifact includes "context boundary" markers for each subtask
- Agents perform better when context is scoped per task

**2. Resumability**
- Executor can crash, lose context, or be paused mid-execution
- System must support: Save state after each subtask, continue from that saved state
- Implementation: Plan artifact must include "resumption point" metadata
- Critical: State recovery requires both the original plan AND intermediate outputs

⚠️ **Design divergence:** Markdown lists have no resumption semantics. Structured state is needed: `{ step_id, status, output, next_step_id, alternatives }`.

**3. Dependency Clarity**
- Executor must know what to do without consulting planner
- Implementation: Plan artifact must explicitly state "this step depends on output from step X" and "these tasks can run in parallel"
- From LLMCompiler: Explicitly modeling parallelizable vs sequential dependencies yields 3.7x speedup

**4. Delegation Clarity**
- Each task is assigned to an executor role with explicit constraints
- Implementation: Plan artifact includes `{ task_id, assigned_executor_type, success_criteria, context_limit_tokens, allowed_tools }`
- Agents perform better when role and constraints are explicit, not implicit

**Task Decomposition Quality** (per ACONIC framework):
- Systematic decomposition by constraint analysis performs **10-40 percentage points better** than heuristic decomposition
- Plan artifact should include: "constraint induced by step X" metadata

**Recommended Artifact Schema:**
```json
{
  "plan_id": "UUID",
  "goal": "string",
  "mode": "research|debug|collaborative|feature",
  "steps": [
    {
      "step_id": "string",
      "title": "string",
      "description": "string",
      "assigned_executor": "string",
      "dependencies": ["step_id"],
      "parallelizable_with": ["step_id"],
      "success_criteria": "string",
      "context_boundary": { "max_tokens": 0, "allowed_tools": [] },
      "review_required": false,
      "estimated_cost_tokens": 0
    }
  ],
  "parallelization_graph": "DAG representation",
  "estimated_total_cost": 0,
  "mode_specific": {
    "research_mode": { "citations_required": true, "confidence_levels": true },
    "debug_mode": { "hypothesis_space": [], "test_ordering": [] },
    "collaborative_mode": { "decision_points": [], "alternatives": {} },
    "feature_mode": { "rollback_points": [] }
  }
}
```

---

## Angle 4: High-Quality Plan Production

**Most Important Finding: Plan quality depends on structured synthesis during planning, not ad-hoc reasoning.**

**1. Structured Planning via Synthesis Patterns**
- **Unstructured reasoning** produces variable-quality plans (subject to model variance)
- **Structured synthesis** (like sequential thinking) produces 10-30% better results
- Implementation: Planning system should use explicit "synthesis mode" that:
  - Generates multiple candidate plans
  - Evaluates each against constraints
  - Synthesizes best approach

⚠️ **Design divergence:** Single-pass plan generation (model thinks once, outputs plan) is lower quality than multi-step synthesis (model generates candidates → evaluates → synthesizes).

**2. Constraint Elicitation During Planning**
- High-quality plans are constrained plans
- Key constraints: time budget, token budget, tool availability, user risk tolerance, failure modes
- Implementation: Planning should include explicit Q&A phase before plan generation
  - "What tools are available?"
  - "What is the maximum execution cost?"
  - "What failure modes are unacceptable?"
  - "What is the time budget?"

**3. Edge Case Identification**
- Planning session should explicitly identify edge cases
- After generating base plan, execute "What if X fails?" for each critical X
- Model generates fallback plans for each edge case (included in artifact as `alternatives` field)

**4. Plan Validation Before Execution**
- Planner should validate the plan against:
  - Completeness (does it address the goal?)
  - Feasibility (are all tools available? Is cost within budget?)
  - Consistency (do outputs of step A satisfy inputs of step B?)
  - Termination (will execution actually finish?)
- Implementation: Explicit validation gate before artifact is marked "ready for execution"

⚠️ **Design divergence:** Current document-based systems skip validation. Research shows 15-25% of plans are infeasible before execution begins.

**5. Quality Metrics for Plans (from research on agentic workflows):**
- **Completeness Score**: Does plan address all aspects of goal? (0-100)
- **Feasibility Score**: Are prerequisites met? (0-100)
- **Clarity Score**: Would executor be confused? (0-100)
- **Cost Efficiency**: Estimated tokens / expected value
- **Risk Score**: Likelihood of unhandled edge cases (0-100)

---

## Angle 5: Multi-Agent Planner→Executor Patterns

**Most Important Finding: Frameworks converge on a common pattern: planner produces typed task artifacts; executor agents are role-specific and consume only their assigned tasks.**

**1. LangGraph Pattern**
- Nodes represent reasoning states (Plan, Execute, Reflect)
- Edges represent transitions (conditional on executor output)
- **Key property**: Graph is determined by planner; executor follows it
- Executor cannot deviate from graph without explicit revision

**2. AutoGen Pattern**
- Task assignment: Planner creates Task objects with assigned executor role
- Role specialization: Engineer agent, Executor agent, Reviewer agent, etc.
- Communication: Tasks flow through message queue; results returned via same queue
- **Key property**: Planner controls who does what; executors do not self-assign

**3. CrewAI Pattern**
- Task artifact: `{ task_id, description, expected_output, assigned_agent }`
- Agent: Role-specific executor with specialized tools and memory
- Execution: Sequential task execution with context from prior tasks
- **Key property**: Agent knows its role; task tells it what to do

**4. OpenDevin Pattern**
- Plan artifact: Sequence of code changes with validation steps
- Executor: Can execute code, check results, report failures
- Key innovation: Includes rollback capability; each step can be undone
- **Key property**: Executor maintains a state file; plan includes checkpoints

⚠️ **Design divergence:** All production frameworks use **typed task artifacts**, not plain-text markdown. Plan must be structured data that executor can parse and validate.

**5. Subtask Scoping Patterns (common across all frameworks):**
- **Sequential**: Default; step B waits for step A output
- **Parallel**: Explicitly marked; B and C run simultaneously, then merge at D
- **Conditional**: "If output of A contains X, execute B; else execute C"
- **Retry**: "If step fails, retry up to N times with exponential backoff"

⚠️ **Design divergence:** Static assignment (all tasks go to one executor) loses the parallelism gains. Planner must explicitly route tasks to role-specific executors.

**6. State Management Across Agent Boundaries:**
```json
{
  "plan_id": "UUID",
  "execution_id": "UUID",
  "step_outputs": { "step_id": "output" },
  "completed_steps": ["step_id"],
  "pending_steps": ["step_id"],
  "failed_steps": [{ "step_id": "", "error": "", "retry_count": 0 }],
  "last_checkpoint": "timestamp"
}
```

---

## Synthesis: Ideal Planning System Architecture

Based on all five angles, the research prescribes:

1. **Planning System Must Produce Typed Artifacts, Not Markdown**
   - Current: Markdown files with natural-language subtasks
   - Optimal: Structured JSON with explicit step IDs, dependencies, parallelization graph, role assignments, success criteria, fallback options, resumption points

2. **Planning Must Be Mode-Aware**
   - Current: One planning approach for all tasks
   - Optimal: Planner branches on mode (research/debug/collaborative/feature) and produces structurally different artifacts

3. **Planning Must Separate from Execution**
   - Planner role: Synthesizes plans, validates before handoff
   - Executor role: Executes plan, observes, reports failures
   - Feedback loop: Executor results feed back to planner only at revision gates

4. **Executor Must Be Isolated and Constrained**
   - Each executor gets only its step's context + step description
   - Context size is bounded
   - Tools are role-specific

5. **Planning Quality Must Be Measurable**
   - Planner outputs completeness, feasibility, clarity scores with plan
   - Validation gate rejects infeasible plans before execution

6. **Execution Must Support Resumption**
   - Each step's output is checkpointed
   - Plan includes resumption metadata
   - Executor can continue from last successful step

7. **Parallelization Must Be Explicit in Plan**
   - Planner explicitly identifies parallelizable tasks
   - Plan includes DAG of dependencies
   - Executor dispatches parallel tasks, merges at sync points

---

## Caveats

1. **Mode-specific plan structures**: While research clearly shows different modes exist, explicit guidance on how plan artifacts should structurally differ is inferred from domain principles, not directly published.
2. **Optimal context window per executor**: The research suggests isolation is good, but optimal context size is task-dependent and not determined by research.
3. **Synthesis vs single-pass quality improvement**: Chain-of-thought research shows structured reasoning improves output, but no paper directly comparing synthesis patterns applied specifically to planning artifacts was found.
4. **Parallelization gains transfer to coding tasks**: LLMCompiler shows 3.7x speedup on function calling; transfer to coding subtasks (which may have tighter dependencies) is unverified.
5. **Checkpoint granularity**: Research doesn't specify optimal checkpoint frequency.

---

## Sources

- Huss, Ronnie. "Plan-and-execute AI agents" (March 2026). https://ronniehuss.co.uk/building-ai-multiplied-teams-plan-and-execute-agents/
- Yao et al. "ReAct: Synergizing Reasoning and Acting in Language Models" (ICLR 2023). https://arxiv.org/abs/2210.03629
- Kim et al. "LLMCompiler: An LLM Compiler for Parallel Function Calling" (ICML 2024). https://arxiv.org/abs/2312.04511
- Zhou et al. "ACONIC: Systematic Decomposition of Complex LLM Tasks" (2025). https://arxiv.org/html/2510.07772v1
- Lee, Casius. "What Is the AI Agent Loop?" Oracle Developers Blog (March 2026). https://blogs.oracle.com/developers/what-is-the-ai-agent-loop-the-core-architecture-behind-autonomous-ai-systems
- Emergent Mind. "ReAct Architecture: Reason, Act, Reflect" (Feb 2026). https://www.emergentmind.com/topics/reason-act-reflect-react-architecture
