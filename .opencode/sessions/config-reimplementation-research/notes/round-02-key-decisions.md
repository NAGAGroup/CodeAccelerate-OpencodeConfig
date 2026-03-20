# Round 02 Key Decisions — Agent Design & Delegation Strategy

**Session:** config-reimplementation-research  
**Date:** 2026-03-19  
**Subtask:** 02 — Research Round 2: Agent Design & Delegation Strategy

---

## 5 Principal Design Divergences Found

### 1. Operational Limits > Prompt Constraints
Production frameworks (CrewAI) use hard structural limits — `max_iter=20`, `max_execution_time`, `max_rpm`, `respect_context_window=True` — to prevent scope drift and infinite loops. Elaborate natural-language constraint instructions in system prompts are demonstrably LESS effective than these structural safeguards. Current config relies heavily on instructional constraints.

### 2. Multi-Specialist Crew > Single Generalist
All production frameworks (CrewAI, AutoGen, LangGraph) use specialist crews of 3-6 agents. Single generalist agent = anti-pattern. For coding: Generator, Reviewer, Debugger, Architect, Tester, Documenter. Current `session-local-implementer` pattern (one agent for all implementation) is the anti-pattern.

### 3. Global Templates + Runtime Parameterization > Per-Session Agent Files
Production standard is global YAML templates instantiated with session parameters, not new agent files per session. Per-session files are not documented in any production framework. Current per-session agent file creation pattern is an analog that works for YAML-config systems, but capabilities must be globally templated; only context is session-specific.

### 4. Deny-by-Default is Architecturally Correct (Validated)
Current YAML deny-by-default pattern matches the production standard (`allow_delegation=False`, `allow_code_execution=False` by default). Missing element: operational rate limits (`max_rpm`, timeout) as additional enforcement layer.

### 5. Dynamic Per-Task Model Selection is an Open Opportunity
No production framework does per-task model selection — they use static model per agent. Research shows: mechanical→haiku, standard→sonnet, complex→o1-mini, breakthrough→o1-preview. Task complexity classification during planning + dynamic model routing = unrealized opportunity. o1-mini is 80% cheaper than o1-preview with competitive coding performance. o1 has high variance; Sonnet 3.5 more reliable for production.

---

## Key Research Sources for This Round
- CrewAI Agent documentation: https://docs.crewai.com/concepts/agents/
- OpenAI o1 evaluation paper: arxiv:2409.18486
- FutureSearch LLM Agent Evaluation (o1 variance finding)
- Composio o1-preview analysis (cost/performance frontier)
- LLMCompiler (Kim et al., ICML 2024) — parallelization with specialist agents

---

## Open Questions for Synthesis
1. At what granularity should specialists be defined globally vs. selected per session?
2. How does per-task model selection interact with the current plan artifact structure?
3. Should operational limits (max_iter, timeout) be added to YAML agent frontmatter?
4. What is the right routing signal for model tier — task type, token budget, complexity score, or a combination?
