# Agent Routing

Your task is to **assign agents and model tiers to each diagnosis step**.

## Primary Agent: @ContextInsurgent for Deep Debug Reasoning

**@ContextInsurgent is the primary agent for debug planning.** Use it for:

1. **Complex Hypothesis Formation** — Root cause identification requiring multi-layer codebase understanding
   - Example: Hypothesis requires understanding how Module A (auth) → Module B (payment) → Module C (database) interact
   - Use @ContextInsurgent when: Requires reasoning across 3+ code layers or understanding system-wide impact

2. **Investigation Shape Decisions** — Deciding branch vs. loop strategy when architecture is complex
   - Example: "Will we test hypotheses in sequence (branch) or refine one (loop)? This affects the entire investigation structure."
   - Use @ContextInsurgent when: Shape decision has architecture implications; complex codebase patterns need understanding

3. **Root Cause Reasoning Across Multiple Layers** — Tracing execution paths through interconnected modules
   - Example: "Memory leak in event handlers → cleanup implications in database pooling → cascade effects in notification service"
   - Use @ContextInsurgent when: Bug involves interactions between 3+ code components; causality crosses module boundaries

## General Routing

For each diagnosis step, decide:
1. **Which agent type?** (e.g., code-investigator, profiler, tester, reviewer)
2. **What model tier?** (e.g., haiku-like for focused investigations, sonnet-like for complex reasoning)
3. **Why?** Brief justification

Consider:
- Step complexity (investigation depth vs. focused execution)
- Specialization needed
- Cost and speed trade-offs
- Dependencies with other diagnosis steps

## Sequential Thinking for Complex Reasoning

For diagnosis steps involving complex reasoning about code interactions or causality chains, mention to the agent: "You may use `sequential-thinking` to reason through potential causes, execution paths, and evidence systematically."

## Output

- Diagnosis Step → Agent Type → Model Tier
- One-line justification per assignment
- (If applicable) @ContextInsurgent routing rationale with architecture reasoning

Call `next_step()` to enter the info phase.
