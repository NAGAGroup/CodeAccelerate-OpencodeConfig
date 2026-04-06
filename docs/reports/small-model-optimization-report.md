# CodeAccelerate Small-Model Optimization Report
## Document 3: Spec Quality for Small-Model Architectures

This report analyzes the CodeAccelerate specification for alignment with small language model capabilities and constraints (9B–14B parameter range, with Qwen3.5-9B as the reference target). It evaluates where the spec's design decisions are validated by small-model behavior, where critical configuration knowledge is missing from the spec entirely, where prompt implementation falls short of the spec's own standards, and whether the spec adequately addresses small models as planning agents. This is the third of three spec audit documents.

---

## SECTION 1 — Validated Architectural Strengths (Well-Aligned)

### Finding 1: Enforcement Sequences as Structural Safety Net

**Status:** Core architectural component, explicitly small-model focused.

**Analysis:** The enforcement engine prevents small models from skipping investigation steps, deferring required tool calls, or abandoning multi-step tasks midway—exactly the failure modes small models exhibit most frequently. The spec explicitly targets this failure pattern: enforcement sequences define a mandatory ordered sequence of tool calls that the engine verifies before advancing. This is not a suggestion or guidance; it is a structural constraint enforced by the plugin. External research on small-model behavior validates this approach: models at 9B-14B scale benefit measurably from pre-computed step ordering rather than being asked to generate correct reasoning steps autonomously. For small models, constraints improve performance relative to frontier models, which "overthink" and introduce errors when given too much freedom.

**Directional recommendation:** Expand doc 03 (DAG Enforcement Mechanics) to explicitly name this small-model optimization. State that enforcement sequences are designed specifically to prevent step abandonment and reasoning failures that affect small models disproportionately. Reference the research principle: "Instruction retrieval beats reasoning generation for small models."

---

### Finding 2: Doc 08 Explicit Small-Model Design Intent

**Status:** Documented design principle, high-value reference.

**Analysis:** Document 08 (Prompt Engineering) is the only spec document that explicitly names small-model failure modes and articulates design principles targeting them. Lines in doc 08 address: instruction following reliability drops at scales below 12B parameters; small models need tighter constraints than frontier models; prompt structure matters more than wording length; skill loading in recent context maximizes attention. The fact that failure modes are named (not just implied) and design decisions are explained (not just asserted) makes doc 08 a high-value reference for developers targeting small-model deployments. However, the other spec documents—which describe architecture, enforcement, agents, and planning—do not cross-reference doc 08 or explain how their design choices support small models.

**Directional recommendation:** Add explicit cross-references in docs 00, 03, 05, and 06 linking architectural decisions to small-model rationale in doc 08. For example, doc 03 should reference doc 08 when explaining enforcement sequences; doc 05 should reference it when explaining the fixed 14-node planning DAG structure.

---

### Finding 3: Skill Loading in Recent Context Position

**Status:** Implicit architectural optimization, well-aligned with research.

**Analysis:** The specification and implementation both load skills on demand immediately before the node that requires them, positioning critical behavioral instructions in the most recent part of the context window—the position small models attend to most strongly. Small models exhibit pronounced "recency bias" where recent tokens receive higher attention than earlier ones. By loading skills at execution time rather than at session start, the system places methodology teaching at the highest-attention position. External research on context engineering for small models confirms this is the correct approach: "Small models suffer severe context rot; optimizing token allocation is more important than optimizing wording."

**Directional recommendation:** Explicitly document this optimization in doc 08 or in a new section of doc 00. Name the small-model recency bias principle and explain why skills are loaded on demand rather than preloaded.

---

### Finding 4: Enforcement-Minimum Plus Optional Enrichment

**Status:** Design pattern, enabling graceful degradation.

**Analysis:** Enforcement sequences define a minimum viable set of required tool calls—what must happen for a node to succeed. Prompt instructions then enable agents to do additional work beyond the minimum (e.g., "You may dispatch additional scouts if the initial findings are insufficient"). This graceful degradation pattern means the system can function with a smaller model that follows the minimum sequence reliably, even if it does not fully exploit optional enrichment opportunities. A frontier model may discover more through enrichment; a small model that completes the minimum is still functional. The spec's component library (doc 07) documents this implicitly through enforcement sequences that are brief (3–6 tools typically) rather than exhaustive.

**Directional recommendation:** Articulate the graceful degradation principle explicitly in doc 07. State that enforcement sequences define the minimum viable path for a component to succeed, and that enrichment is optional. Explain that this pattern supports deployment across model scales.

---

### Finding 5: Globally-Exempt Tools Preserve Flexibility

**Status:** Specification feature, enabling small-model escape valves.

**Analysis:** The enforcement engine maintains a globally-exempt tool list (question, sequential-thinking, qdrant_qdrant-find, qdrant_qdrant-store) that remains accessible regardless of node enforcement. These tools are always callable without triggering "next required tool" errors. For small models struggling with rigid sequencing or stuck in unplanned situations, this escape valve prevents deadlocks. A small model can always call sequential-thinking to reason through an impasse, or ask a clarifying question, or retrieve additional context from semantic notes. The spec documents this (doc 03) but does not explicitly frame it as a small-model reliability feature.

**Directional recommendation:** In doc 03, add a subsection explaining the small-model rationale for globally-exempt tools. State that these tools provide flexibility without compromising enforcement—small models can recover from constrained situations without violating DAG structure.

---

## SECTION 2 — Critical Configuration Gaps (Undocumented, High Risk)

### Finding 6: The `reasoningEffort: none` Configuration Is Undocumented

**Status:** Critical operational fact, missing from spec, buried in profile config comment.

**Impact:** This is the single most impactful small-model reliability configuration in the entire system.

**Analysis:** The Ollama profile configuration contains a comment explaining that for reasoning-capable models like Qwen3.5-9B, the `reasoningEffort: "none"` setting in model options is operationally critical. Without this setting, thinking-capable models produce approximately a 60% tool-execution failure rate—because they satisfy tool calls internally (via reasoning) without emitting them to the execution loop. The spec's extensive small-model design discussion (docs 00 and 08) never mentions reasoning mode, `reasoningEffort` configuration, or the 60% failure rate at all. A developer targeting 9B–14B thinking models who does not know to set this will experience systematic, hard-to-diagnose tool execution failures for roughly two-thirds of execution steps.

**Directional recommendation:** Add a critical configuration section to doc 00 (System Overview) under "Deployment Prerequisites." Document that reasoning-capable models (specified via model cards) require `reasoningEffort: "none"` in deployment profiles to prevent internal reasoning from bypassing tool emission. Reference the Ollama profile as an example. Explain the 60% failure rate risk and why this setting is required for tool-use reliability.

---

### Finding 7: Temperature Differentiation Rationale Is Undocumented

**Status:** Undocumented optimization lever, foundational to small-model reliability.

**Analysis:** Agent files show that context-scout runs at temperature 0.2 (more deterministic, appropriate for factual reporting) while most execution agents run at 0.4 (moderate, preserving reasoning flexibility). The spec's small-model design section never addresses temperature as an optimization strategy. For small models, temperature has an outsized effect on output reliability—lower temperatures reduce hallucination in retrieval and factual reporting tasks (context-scout's primary work), while moderate temperatures preserve judgment needed in analysis and decision tasks. The rationale for differentiating by agent role is not documented anywhere in the spec, meaning a developer would not know to apply this optimization.

**Directional recommendation:** Add a temperature tuning subsection to doc 02 (Agent Roster) or doc 08 (Prompt Engineering). Document why context-scout is 0.2 and other agents are typically 0.4. Explain the temperature-hallucination tradeoff and when to vary temperature for small models. Provide guidance on temperature selection for new agents.

---

### Finding 8: DAG_EXECUTOR_MODE Injection Is Undocumented

**Status:** Critical behavioral conditioning, missing from spec.

**Analysis:** The enforcement plugin injects a `DAG_EXECUTOR_MODE` system message before each agent execution, conditioning behavior: agents are instructed to call the next required tool immediately after every tool result and suppress prose generation between tool calls. This injection is a behavioral conditioning mechanism that makes DAG execution reliable for small models—it prevents multi-turn drift and keeps focus on structured tool sequencing. The spec never mentions this injection, its contents, or its design rationale. A developer building a compatible system would not know this mechanism exists.

**Directional recommendation:** Add a system prompt injection subsection to doc 00 (System Overview) or doc 03 (DAG Enforcement Mechanics). Document that the enforcement engine injects a DAG_EXECUTOR_MODE message conditioning agents to prioritize immediate tool calls over prose generation. Explain this as a small-model reliability mechanism. If building compatible tooling, implementers would need this knowledge.

---

### Finding 9: Imperative Error Message Phrasing Is Undocumented

**Status:** Undocumented design principle, affects prompt authoring for extensions.

**Analysis:** The enforcement engine uses imperative phrasing in error messages ("Call X now") rather than descriptive phrasing ("You should call X" or "Consider calling X"). For small models, imperative phrasing significantly improves compliance—it removes ambiguity and decision burden. This is a documented research finding on small-model constraint following: positive, direct framing outperforms suggestive framing. However, this design principle is not documented anywhere in the spec, meaning a developer extending the system with new components or enforcement patterns would not know to apply it.

**Directional recommendation:** Add error message design guidance to doc 08 (Prompt Engineering) or create a new enforcement authoring subsection. Document that enforcement error messages must use imperative phrasing and name the exact next tool. Explain this as a small-model optimization and provide examples.

---

## SECTION 3 — Prompt Content Gaps (Spec Guidelines Exceed Implementation)

### Finding 10: Agent Prompt Length Falls Below Spec Minimum

**Status:** Universal implementation gap, spec guidance correct but not followed.

**Analysis:** Doc 08 specifies a minimum of 30–50 lines for agent system prompts, stating: "Keep them short — 30 to 50 lines. Agent prompts are in the system prompt position, which receives lower attention than recent content." The rationale is that system prompts receive lower attention, so they must provide sufficient behavioral scaffolding. Actual agent files deliver 14–16 lines of system prompt—roughly half the specified minimum. For small models, which lack the implicit knowledge and inference capabilities of frontier models, shorter prompts mean less behavioral scaffolding at exactly the position where they need it most. The spec has it right; the implementation falls short.

**Directional recommendation:** Expand all nine subagent system prompts (context-scout, context-insurgent, junior-dev, documentation-expert, external-scout, tailwrench, autonomous-agent, dag-designer, dag-reviewer) to meet the 30–50 line minimum. Add behavioral detail that will ground small-model execution. Do not add checklist items (doc 08 forbids these), but add more explicit methodology description, more detailed constraint statements, and more examples of correct behavior.

---

### Finding 11: Skill File Length Falls Below Spec Minimum

**Status:** Universal implementation gap, spec guidance correct but not followed.

**Analysis:** Doc 08 specifies a minimum of 50–100 lines for skill files, the rationale being that skills are loaded on demand immediately before use—they are the primary behavioral instruction for the current node's work. Actual skill files deliver 34–44 lines. Skills are loaded at the highest-attention position in the context window; undersizing them reduces the quality of task-specific grounding at exactly the moment it matters most for small models. For a 9B model relying on external instructions rather than internal reasoning, a 50-line skill file has roughly 50% more scaffolding than a 34-line file. The spec has it right; the implementation falls short.

**Directional recommendation:** Expand all skill files (approximately 14 total across files/skills/) to meet the 50–100 line minimum. Add structure: more explicit step definitions, more detailed methodology explanation, more examples of correct execution, more explicit failure modes to avoid. Prioritize skills that are called most frequently (e.g., grepai, sequential-thinking, qdrant-notes).

---

## SECTION 4 — Planning Phase Suitability (Frontier-Optimized, Limited Small-Model Guidance)

### Finding 12: The Planning DAG Is Frontier-Optimized

**Status:** Design choice, implications not documented.

**Analysis:** The 14-node planning DAG (doc 05) requires the planner to make complex architectural judgments: assess investigation findings across multiple sources, synthesize findings into a DAG design, select appropriate component types for each node, write concise rationale to semantic notes. These are high-complexity synthesis and design tasks where frontier models excel and small models struggle without substantial scaffolding. The specification does not acknowledge this distinction or provide guidance on what a small-model planner would need differently. The planning prompts (14 node prompt files) are not themselves specified in the spec, only their intents are described. A 9B model planner lacks the design judgment and synthesis capability needed to reliably produce valid DAGs without more explicit guidance.

**Directional recommendation:** Add a planning-for-small-models section to doc 05 (Planning DAG). Acknowledge that the 14-node DAG requires design judgment; document what small-model planners need differently (more structured investigation templates, more explicit decision criteria, potentially fewer branching decisions, simpler component selection heuristics). Consider whether a simplified variant planning DAG is needed for small models, or whether additional scaffolding in planning prompts can make the full DAG accessible.

---

### Finding 13: Ollama Profile Implies Small-Model Planning Is Possible Without Guidance

**Status:** Configuration exists, operational implications undocumented.

**Analysis:** The Ollama profile is configured as a functional deployment option and is used in actual small-model planning scenarios, implying that small models can serve as planners. However, the spec never documents the operational implications: What kinds of plans can a small model reliably produce? What DAG structures exceed its capability? How do small-model plans differ from frontier-model plans? At what complexity threshold does small-model planning become unreliable? The gap between "technically possible" (the profile works) and "reliably executable" (small models produce good plans consistently) is not addressed.

**Directional recommendation:** Document small-model planning operational characteristics in either the planning DAG section or the Ollama profile configuration guide (or both). Specify plan complexity thresholds, branching limits, investigation scope limits, and component selection constraints that are appropriate for small models. Provide heuristics for when a planning task should be escalated to a frontier model or split into simpler substeps.

---

## SECTION 5 — Planning-to-Execution Handoff Quality (Notes-Dependent, Underdocumented)

### Finding 14: Notes Quality Dependency Is Undocumented

**Status:** Critical path dependency, no quality standards documented.

**Analysis:** The planning-to-execution handoff depends entirely on the quality of notes stored to Qdrant by the planner. A frontier execution model can fill gaps through inference; a small execution model cannot. If planning notes are sparse, poorly structured, or missing critical constraints, a small execution model has less to work from—effectively less context for decision-making. The spec does not document: minimum required content for planning notes, structural standards for note organization, how to verify sufficient context was captured, or the implications of low-quality notes on small-model execution. Execution agents retrieve planning notes via qdrant_qdrant-find during kickoff-refresher, but they do not validate note quality; they proceed with whatever they retrieve.

**Directional recommendation:** Create a planning notes quality standard section in either doc 05 (Planning DAG) or doc 06 (Execution Architecture). Specify: minimum information that planning nodes must store (findings, decisions, constraints, deferred items), structural format for notes (e.g., decision node must store: decision topic, options considered, rationale, chosen option), verification that notes were actually stored (check Qdrant retrieval at kickoff-refresher), and recovery procedures if critical notes are missing.

---

### Finding 15: No Qdrant Query Construction Guidance

**Status:** Implicit dependency, no guidance for agents.

**Analysis:** Execution agents retrieve planning notes via qdrant_qdrant-find during kickoff-refresher and at various work nodes. The quality of retrieval depends entirely on query construction—how well the query semantics match the semantics of stored notes. The spec provides no guidance on: how to construct effective queries, what to query for at each execution phase, how to verify sufficient context was retrieved, or how to handle cases where queries return no relevant notes. For small models, which may not generate effective queries independently, this gap could result in execution proceeding with insufficient context. A frontier model might infer missing context; a small model will not.

**Directional recommendation:** Add query construction guidance to doc 06 (Execution Architecture) or the execution components in doc 07. Provide: examples of effective planning note queries at each phase (investigation phase, planning phase, work execution phase), criteria for query quality, and fallback behavior if queries return insufficient results. Specify what recovery action agents should take if critical context is not retrievable.

---

### Finding 16: GrepAI Skill Stale Annotation

**Status:** Minor but confusing, affects small-model understanding.

**Analysis:** The external-scout delegation skill (files/skills/external-scout/SKILL.md) contains a stale "(to be created)" annotation for the GrepAI skill, despite the skill existing and being fully implemented at files/skills/grepai/SKILL.md. For small models executing the external-scout workflow, this stale annotation may cause confusion: Is GrepAI actually available? Is the implementation incomplete? Should I attempt to use it? For frontier models this ambiguity is harmless; for small models that may struggle with undocumented tools or missing assumptions, clarity is important.

**Directional recommendation:** Remove the "(to be created)" annotation from the external-scout skill and confirm that GrepAI skill is accurately listed as available. Update any other skills or documentation that reference GrepAI with stale markers.

---

## Conclusion

The CodeAccelerate specification is architecturally sound for small-model deployment—the enforcement engine, skill loading patterns, and doc 08's explicit small-model design intent are genuine strengths validated by external research on 9B–14B model behavior. However, the most critical small-model reliability facts are absent from the specification: the `reasoningEffort: none` configuration alone accounts for the difference between a 60% tool failure rate and reliable execution. Without this single configuration detail, small-model deployments will fail systematically.

Additionally, the spec's own prompt engineering guidelines exceed what the implementation delivers. A developer following doc 08's minimum standards for agent prompts (30–50 lines) and skills (50–100 lines) would produce significantly more robust small-model behavioral grounding than currently exists. The specification is actually *better* than the implementation for prompt content.

The path to small-model optimization is primarily documentation work, not architectural change. Four of the five major gaps (reasoningEffort documentation, temperature tuning guidance, DAG_EXECUTOR_MODE explanation, imperative error message principle) require spec additions that would take a developer 1–2 days to draft. Prompt content expansion to meet existing spec guidelines would take 2–3 days. Planning phase guidance for small models would require investigation into small-model planning characteristics but is more substantive. The underlying system design is correct; the spec and implementation need to be brought into alignment, and critical configuration knowledge needs to move from profile comments into the specification itself.
