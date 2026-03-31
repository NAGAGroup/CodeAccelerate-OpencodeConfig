# sequential-thinking Node Type

## When to use

Use `sequential-thinking` when HeadWrench must reason through a decision and form an explicit conclusion before advancing. This node is appropriate when:

- Prior data collection or analysis is complete, and a decision must be synthesized from findings
- Multiple plausible approaches exist and one must be selected or ranked
- A major action or branch point requires documented reasoning before committing
- A contradiction or ambiguity in collected context needs resolution through structured reasoning
- A plan outline has been proposed and HW must assess feasibility or prioritization before proceeding

Do NOT use this node for data gathering — use `scout-parallel` or `analyze-deep` instead. Do NOT use for trivial decisions where the conclusion is obvious from prior context. Do NOT use to avoid making a decision yourself — every sequential-thinking node must produce a stated conclusion.

## What the planning agent must resolve

Before writing a `sequential-thinking` node, determine and document each of these:

1. **Decision question** — State the exact question HW should reason through. The question must be bounded and specific. Good: "Should we refactor the auth module before or after writing tests?" / "Is the call chain in request/response.ts circular?" Bad: "What should we do about the auth system?" (too broad, no frame). Example: "Given the scout findings on token.ts structure and the refresh endpoint requirements, should we refactor the module first or add refresh logic to the current structure?"

2. **Context available** — Name what HW already has (prior scout findings, prior analysis results, project constraints, acceptance criteria). Good: "Scout reports from scouts-1 and scouts-2 covering auth service and test structure. Insurgent analysis of coupling metrics." Bad: "Various context" or "all prior findings." Example: "File list from scouts: src/auth/token.ts (310 lines, 3 tightly coupled functions), src/auth/helpers.ts (142 lines). Prior analyze-deep findings: 'Adding refresh logic to current token.ts requires duplicating 2 functions.'"

3. **Expected conclusion format** — Describe what form the conclusion should take. Must be concrete. Good: "A binary choice (Refactor-first or Add-first) plus 2–3 sentences of rationale, citing specific complexity findings." Bad: "A summary" or "a decision." Example: "Recommended approach (Refactor-first or Add-first) with estimated effort impact and one key reason from the analysis findings."

4. **What uses the conclusion** — State which downstream node(s) will read this conclusion and how they will act on it. Good: "The decision-gate node `refactor-choice` will branch to `write-refactor-plan` (if Refactor-first) or `write-add-first-plan` (if Add-first)." Bad: "Later nodes" or "the next phase." This prevents reasoning that is sound but unusable for the next step.

5. **Output constraint** — The conclusion MUST be explicitly stated in HW's text response before calling `next_step()`. HW cannot advance without a stated conclusion visible in the message. This is non-negotiable — embed this expectation in the dispatch prompt so HW understands the requirement.

6. **Thought count estimate** — Provide an estimated range of thoughts this reasoning will likely require, based on decision complexity. Good: "5–8 thoughts (binary pros/cons weighing)" / "15–20 thoughts (three-way comparison with tradeoff analysis and feasibility check)." Bad: "5 thoughts exactly" or "use 10 thoughts" (see Notes). Example: "Estimate 8–12 thoughts to weigh refactoring cost against refresh-logic complexity, then form a recommendation."

## What this node produces

The `sequential-thinking` node calls the `sequential-thinking_sequentialthinking` MCP tool directly — no agent dispatch. HeadWrench reasons iteratively, calling the tool repeatedly until a conclusion is reached, then states that conclusion explicitly in its response text before calling `next_step()`. That conclusion feeds the next node (typically a gate or downstream planner).

## Notes

### Tool name is critical — exact string match required

The tool name in the `todo` array **must be exactly `sequential-thinking_sequentialthinking`** (underscore between the two parts, not hyphen or any other variation). The planning-enforcement plugin does exact string matching. A typo such as `sequential-thinking-sequentialthinking` or `sequential_thinking_sequentialthinking` causes a permanent block — the expected tool is never called and the DAG stalls. Double-check the name before publishing any node.

### Thought-count estimate vs. fixed-count target — failure mode

A **bad input** to this node is a fixed thought-count requirement: "Reason through exactly 5 thoughts" or "use 10 thoughts." This causes HW to stop at the fixed count regardless of whether the decision is actually resolved, producing incomplete reasoning that loops back. A **good input** is a range: "Estimate 5–8 thoughts for a binary pros/cons weighing" or "Plan for 10–15 thoughts to trace dependencies and identify solutions." The range gives HW guidance without forcing a premature halt. **Fix:** Always provide a range, and instruct HW: "Stop when the conclusion is clear, not when a count is reached."

### Broad topics produce loops without convergence — failure mode

A **bad decision question** is: "How should we approach the auth system?" or "What's the best architecture?" or "How should we organize this?" These are open-ended and lead to circular reasoning without a clear yes/no or ranked-choice endpoint. A **good decision question** is narrowly scoped: "Should we use JWT or session-based auth?" or "Is the request/response cycle in middleware.ts blocking or non-blocking?" or "Given the coupling metrics, should we refactor before or after adding the refresh endpoint?" Broad topics loop; specific questions converge. **Fix:** Reframe the question as a yes/no, a ranked choice, or a bounded either/or.

### One node per decision point — not multi-decision nodes

Do NOT try to resolve multiple independent decisions in one `sequential-thinking` node. Each decision point gets its own node. Example: if the plan needs to decide (1) whether to refactor the API, and (2) which database to migrate to, write two sequential-thinking nodes — one for each decision. Multi-decision nodes become unfocused and produce weak conclusions on both fronts. **Fix:** Split into separate nodes, one per decision.

### Sequential thinking does not replace agent dispatch

If the reasoning requires reading files or analyzing code that HW does not have context for, use `analyze-deep` (ContextInsurgent) before this node — do not try to have HW reason through code it has not read. This node reasons about *conclusions from existing context*, not about gathering new evidence.
