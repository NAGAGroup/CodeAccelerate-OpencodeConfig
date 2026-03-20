# Round 02 Findings: Agent Design & Delegation Strategy

Research conducted: 2026-03-19  
Session: config-reimplementation-research  
Round: 2 of 3

---

## Angle 1: Agent System Prompt Best Practices

### Key Findings

**1. Role-Goal-Backstory Architecture (CrewAI Standard)**

Leading frameworks establish agents through three distinct prompt components:
- **Role**: Defines function and expertise (e.g., "Senior Python Developer")
- **Goal**: Individual objective guiding decision-making
- **Backstory**: Context and personality enriching interactions

These are not decorative — they constitute the agent's behavioral specification. Source: CrewAI Agent documentation (https://docs.crewai.com/concepts/agents/)

**2. Constraint Specification via System Templates**

CrewAI and LangGraph both support custom system templates (`system_template` parameter) that define core agent behavior. These templates can include:
- Output format requirements (structured vs. freeform)
- Tool invocation rules
- Fallback behaviors

**3. Context Window Management for Scope Control**

CrewAI implements `respect_context_window=True` (default) that prevents agent drift through automatic context summarization when conversation history exceeds LLM limits. This is a mechanism, not a prompt instruction.

**4. Operational Parameters for Behavior Delimitation**

Hard limits prevent scope drift more reliably than instructional constraints:
- `max_iter`: Maximum iterations before returning best answer (default: 20)
- `max_execution_time`: Timeout in seconds
- `max_retry_limit`: Retries on error (default: 2)

**5. Reasoning-Enabled Prompts for Complex Tasks**

CrewAI's `reasoning=True` parameter enables agents to "reflect and create a plan before executing a task." This multi-step internal reasoning reduces scope drift by making decision-making explicit. `max_reasoning_attempts` controls planning iterations. Source: CrewAI Agent documentation

⚠️ **Design divergence**: Production frameworks do NOT rely on elaborate negative examples or complex constraint language. They use structural defaults (deny-by-default permissions), hard operational limits (max_iter, timeouts), automatic mechanisms (context summarization), and reasoning steps (planning before execution). Explicit constraint language in prompts is **less effective** than structural safeguards and operational limits.

### Implications for Opencode Config

Current approach: Extensive system prompts with natural-language constraints ("Never do X", "Always do Y").

Research-backed approach:
- Three-field agent specification (role/goal/backstory or equivalent)
- Hard operational limits on iterations and execution time
- Context-window management as default, not optional
- Reasoning mode enabled for complex tasks

---

## Angle 2: Permission and Capability Design

### Key Findings

**1. Deny-by-Default is the Standard**

CrewAI implements deny-by-default explicitly:
- `allow_delegation: False` (default)
- `allow_code_execution: False` (default)
- `code_execution_mode: "safe"` (Docker isolation by default)
- Tool access is an explicit list, not a whitelist applied to a general pool

Source: CrewAI Agent Attributes documentation

**2. Capability-Based Permissions via Tool Lists**

Rather than role-based access control, frameworks use explicit tool binding:
```python
agent = Agent(
    role="Researcher",
    tools=[SerperDevTool(), WikipediaTool()],  # Only these tools available
    allow_delegation=False
)
```

This is simpler and more auditable than complex permission matrices.

**3. Execution Sandboxing for Code Tasks**

CrewAI offers two modes:
- `"safe"`: Docker execution (recommended for production)
- `"unsafe"`: Direct execution (dev only)

This binary choice removes ambiguity about permission scope.

**4. Function-Calling Model Separation**

CrewAI allows `function_calling_llm` separate from main `llm`:
- Main LLM handles reasoning
- Cheaper model handles tool invocation
- Can apply different safety policies to each

This decoupling allows fine-grained permission control.

**5. Rate Limiting as Permission Enforcement**

`max_rpm` (maximum requests per minute) prevents agent from calling out of scope via excessive API usage. This is an enforcement mechanism, not a prompt instruction.

⚠️ **Design divergence**: The research reveals that **least-privilege is implemented through structural defaults and explicit allowlisting, NOT through complex permission matrices**. No production framework implements RBAC for agent capabilities. Implication:
- Avoid RBAC for agents — use explicit tool lists
- Use deny-by-default as architectural default
- Sandbox code execution by default, not on-demand
- Separate tool-calling permissions from reasoning permissions

### Implications for Opencode Config

Current approach: YAML permission blocks in agent frontmatter (deny by default, allowlist pattern). This is structurally correct.

Research-backed refinement:
- Current deny-by-default YAML pattern is validated by production practice
- The YAML structure could be expanded: separate `reasoning_llm` from `tool_calling_llm` per agent
- Rate limiting (`max_rpm`) is missing from current design — should be added
- Operational limits (max iterations, execution timeout) are missing — should be added

---

## Angle 3: Delegation Routing Patterns

### Key Findings

**1. Static Delegation with Opt-In**

CrewAI's default is `allow_delegation=False`. When enabled, delegation is static at agent creation time:
- Agents must be declared in crew config before session starts
- Router logic is defined via `Process` parameter (Sequential, Hierarchical, Hybrid)
- Not dynamically routing per task

**2. Process-Based Routing (Not Task-Based)**

- **Sequential**: Tasks run in order; no agent routing
- **Hierarchical**: Manager agent routes tasks to specialist agents
- **Hybrid**: Mix of sequential and hierarchical

**3. LangGraph's Explicit State-Based Routing**

LangGraph offers more granular control via explicit node routing:
- Graph nodes represent agents/functions
- Conditional edges route based on state
- Allows dynamic routing if explicitly programmed

**4. Manager Agent Pattern for Dynamic Routing**

CrewAI with Hierarchical Process implements a manager agent that:
- Receives task description
- Selects appropriate specialist agents
- Routes subtasks accordingly

This is the closest to dynamic per-task routing, but still static at crew definition time.

**5. No Production Evidence of Per-Session Dynamic Routing**

None of the frameworks document per-session dynamic routing based on task characteristics. All examples show pre-defined crew composition and static agent capabilities.

⚠️ **Design divergence**: Current frameworks use mostly static routing (agent composition defined at crew initialization). **Dynamic per-session routing is NOT standard practice** in production frameworks. Instead: manager agent + specialist agents (hierarchical) is the standard pattern. Task-to-agent matching is implicit (semantic matching on role + goal). No explicit capability classification algorithms are documented.

**Opportunity**: Explicit dynamic routing with task complexity classification and capability matching could be a significant improvement over current static routing tables. The research doesn't prescribe this pattern but also doesn't contradict it.

### Implications for Opencode Config

Current approach: Static routing table in `agent-delegation-expert` skill — maps task type to agent.

Research-backed approach:
- Static routing table with explicit task classification is **better** than pure semantic matching
- Hierarchical manager + specialists is more robust than flat delegation
- Adding explicit capability classification (task complexity → agent tier) would improve on current state
- The current routing table is a sound foundation; add complexity scoring per task type

---

## Angle 4: Speed/Cost/Correctness Trade-off

### Key Findings

**1. Model Performance on Coding Tasks (2024-2025 benchmarks)**

- **GPT-4o**: $2.50/$10.00 per 1M tokens (baseline)
- **o1-mini**: $3.00/$12.00 per 1M tokens (33% more expensive, 80% cheaper than o1-preview)
- **o1-preview**: $15.00/$60.00 per 1M tokens (6-10x more expensive, superior reasoning)
- **Claude Sonnet 3.5**: Remains competitive with o1-mini on coding tasks

Source: Composio o1-preview analysis, OpenAI pricing tables

**2. When to Use Cheaper Models**

OpenAI o1-mini is optimized for coding tasks:
- 80% cheaper than o1-preview
- Better cost-performance for debugging and code generation
- Still superior to GPT-4o on reasoning-heavy tasks

**3. Performance on Coding Benchmarks**

- **o1-preview Codeforces percentile**: 62nd percentile (preview), 89th percentile (full o1)
- **Competitive coding 83.3% success** on complex problems
- **Claude Sonnet 3.5** competitive with o1-mini on consistency

Source: Evaluation of OpenAI o1 paper (arxiv:2409.18486)

**4. Model Variance — "o1 is Moody"**

FutureSearch research found o1 has high variance: "sometimes completely aces tasks others struggle with, but often distinctly average." Sonnet 3.5 offers more consistent performance. For production, dual-model strategy recommended: o1 for breakthroughs, Sonnet for reliability.

**5. Task-Specific Model Assignment (Inferred from benchmarks)**

- Math/Science: o1-preview superior
- Coding: o1-mini competitive with Sonnet 3.5
- Creative/NLP: GPT-4o better than o1
- General coding research: Sonnet 3.5 more reliable

**6. Cost-Performance Frontier for Coding**

- High-reliability critical code: o1-mini or Sonnet 3.5
- Fast turnaround refactoring: GPT-4o-mini (cheapest, adequate for simpler tasks)
- Breakthrough research/debugging: o1-preview (high cost, high payoff)

⚠️ **Design divergence**: Current frameworks do NOT dynamically select models per task. They support a single LLM per agent. **Per-task model selection based on complexity is not implemented** in frameworks. Implementation would require: task classifier → model selector → agent routing. Current workaround: use `function_calling_llm` for cheaper tool calls, main `llm` for reasoning.

### Implications for Opencode Config

Current approach: User manually sets model in agent frontmatter. No dynamic model selection.

Research-backed approach:
- Current model-per-agent approach is architecturally correct
- To improve: add a task complexity classification step during planning
- Complexity classes: mechanical (haiku-tier) → standard (sonnet-tier) → complex reasoning (opus/o1-tier)
- The planner should explicitly classify each subtask and recommend the appropriate model tier
- User should confirm model assignment before session starts (current pattern of user filling in PLACEHOLDER_MODEL_ID is sound)

---

## Angle 5: Session-Specific vs. Global Agent Design

### Key Findings

**1. CrewAI's YAML Template Approach (Reusable Global with Parameterization)**

CrewAI recommends YAML configuration for agents with runtime parameter substitution:
```yaml
researcher:
  role: "{topic} Senior Data Researcher"
  goal: "Uncover cutting-edge developments in {topic}"
  backstory: "You're a seasoned researcher..."
```
Instantiated per session with `crew.kickoff(inputs={'topic': 'AI Agents'})`.

**2. Specialization via Parameterization**

Templates include variables like `{topic}`, `{focus_area}` that are replaced at runtime. This allows:
- Single agent definition for multiple sessions
- Context-specific behavior without duplicating agent files
- Easier configuration management

**3. No Evidence of Per-Session Agent Files in Production**

All production frameworks use:
- Global agent templates
- Runtime parameterization
- Session-level state (not agent-level file creation)

None show examples of creating new agent definitions per session.

⚠️ **Design divergence**: The evidence suggests **per-session agent files are an anti-pattern** (not used in production). **Global reusable templates + runtime parameterization is standard.** Specialization is achieved via crew composition, not per-session agents. Session-specific configuration should be **parameters to global agents**, not separate agent definitions.

**However**, there is an important nuance: the research is about software frameworks where the codebase creates agents programmatically. In a config-file-based system (opencode), per-session YAML files may be a reasonable analog to runtime parameterization — the key property to preserve is that agent _capabilities_ (tools, permissions) remain globally defined, while _task context_ is session-specific.

### Implications for Opencode Config

Current approach: Per-session agent files in `.opencode/agents/` with PLACEHOLDER_MODEL_ID.

Research-backed refinement:
- The per-session agent file pattern can be preserved **if** it's implemented as parameterization of global templates
- Better pattern: global agent templates with session-specific context injection (like CrewAI's `{topic}` substitution)
- What must be global: permission model, tool access, operational limits
- What can be session-specific: role/goal/task context, model selection

---

## Angle 6: Agent Specialization vs. Generalization

### Key Findings

**1. Specialist Crew Pattern is Standard**

CrewAI's recommended architecture uses specialist agents — not a single generalist agent. All production examples show 2-4 agents with distinct roles.

**2. Specialization Granularity for Coding**

Optimal specialization for a coding assistant:
- **Code Generator**: Writes new code from specifications
- **Code Reviewer**: Analyzes code for bugs/style
- **Debugger**: Diagnoses and fixes errors
- **Architect**: Designs system structure
- **Tester**: Writes and validates tests
- **Documenter**: Generates docs

This suggests 4-6 specialists, not 1 generalist.

**3. Specialist + Manager Pattern**

Neither AutoGen nor CrewAI show single generalist agent examples. All use:
- 2-3 specialist agents with distinct roles
- Manager/hierarchy pattern for task delegation

**4. Parallel Execution Advantage**

LLMCompiler's 3.7x speedup (Round 1 findings) works best with specialist agents that can run in parallel (code generator + code reviewer simultaneously). A single generalist cannot parallelize.

**5. o1 Model Variance Argument for Specialization**

o1's "moody" behavior (high variance) is better managed when tasks are narrow and well-defined. Specialist agents scope this variance through tight role/goal definitions.

**6. Emerging: Swarm Framework (OpenAI)**

OpenAI Swarm (early access) suggests dynamic agent selection within a session — each agent is specialized, router function determines which agent handles next task. Industry trend toward specialist agents.

⚠️ **Design divergence**: Research suggests **generalist agents are an anti-pattern** for both quality and performance. **Specialist crew of 3-5 agents outperforms single generalist**. Optimal granularity for coding: 4-6 specialists. Too narrow (one agent per subtask) = overhead; too broad (one agent) = poor performance.

### Implications for Opencode Config

Current approach: One global generalist-ish agent per role (ContextScout, ContextInsurgent, DeepResearcher) + one implementation agent per session.

Research-backed approach:
- The 4-agent global roster (Scout, Insurgent, Researcher, Implementer) is architecturally sound
- The weakness is the single "session-local-implementer" — one agent for all implementation
- Better: Define a small set of specialist implementation roles (generator, reviewer, debugger, documenter) as global templates
- During planning, select which specialists are needed for the session rather than creating one monolithic implementer

---

## Synthesis: Top 7 Design Implications

### 1. Deny-by-Default via Structural Architecture (Validated)

Deny-by-default is the correct pattern. Current YAML permission blocks are architecturally validated by production frameworks. Gap: missing operational limits (max_iter, execution timeout, max_rpm). These should be added to agent definitions.

### 2. Multi-Specialist Over Generalist (Strong Signal)

Don't build one "session-local-implementer" agent. Define a small set of specialists — generation, review, debugging, documentation — as global templates. During planning, select which specialists apply to the session. This enables parallelization and tighter scope control.

### 3. Global Templates + Session Parameterization (Not Per-Session Files)

The per-session agent file pattern should evolve toward: global role templates + session-specific context injection. The model field (PLACEHOLDER_MODEL_ID) is correct in principle; the deeper refactoring is making the `role`/`goal`/`task context` parameterizable rather than hard-coded per session.

### 4. Operational Limits Over Prompt Constraints

Stop relying on natural-language constraints in system prompts ("Never do X"). Use hard structural limits:
- Max iterations
- Execution timeouts
- Rate limits (max_rpm)
- Context window enforcement (automatic)

### 5. Task Complexity Classification During Planning

Add explicit task complexity classification to the planning phase. Each subtask should be scored: mechanical → standard → complex reasoning. The planner assigns a model tier based on complexity class. This is currently missing entirely.

### 6. Explicit Routing Table is Valid, But Enhance With Complexity Scoring

The current static routing table is sound. Enhancement: add complexity scoring to the routing decision so the planner doesn't just pick an agent type but also picks the appropriate model tier for that agent.

### 7. Hierarchical Manager + Specialists > Flat Routing

The current flat delegation model (HW routes to one of 4 global agents) would benefit from a hierarchical pattern: HW as orchestrator → planning manager → specialist execution agents. This isn't a requirement to restructure everything, but it's the direction the research points.

---

## Caveats

1. **Framework evidence is predominantly CrewAI-based**: AutoGen, LangGraph, and Swarm data was more limited. CrewAI patterns may not generalize universally.

2. **"o1 is moody" caveat**: Model variance data is from limited testing (FutureSearch) and may not hold across all task types. Sonnet 3.5 reliability advantage may narrow as models improve.

3. **Per-session agent files in config systems vs. code frameworks**: The "anti-pattern" finding applies to programmatic frameworks. In YAML-based config systems like opencode, per-session files may be an acceptable analog to runtime parameterization — the key invariant to preserve is that capabilities are globally defined.

4. **Dynamic per-session routing is an opportunity, not a validated pattern**: The absence of this in production frameworks means it's untested at scale, not that it's wrong.

5. **Specialization granularity is inferred**: "4-6 specialists" is based on framework examples, not a formal study on optimal granularity.

---

## Sources Cited

- CrewAI Agent Documentation: https://docs.crewai.com/concepts/agents/
- Kim et al. "LLMCompiler" (ICML 2024): https://arxiv.org/abs/2312.04511 [Round 1]
- Yao et al. "ReAct" (ICLR 2023): https://arxiv.org/abs/2210.03629 [Round 1]
- Evaluation of OpenAI o1 (arxiv:2409.18486): https://arxiv.org/abs/2409.18486
- Composio o1-preview analysis: https://composio.dev/blog/openai-o1-preview-analysis/
- FutureSearch LLM Agent Evaluation: https://futuresearch.ai/llm-evaluation
- OpenAI pricing tables: https://openai.com/pricing
