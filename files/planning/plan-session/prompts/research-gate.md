# research-gate

Assess whether planning-time external research would improve the project plan, and decide whether the generated DAG should include execution-time research nodes.

## Todo

1. `question` — Ask: "Would a cursory external research pass improve the plan for this task?"
2. `question` — Ask: "Should the generated project DAG include execution-time research nodes?"

## Your Role

You are HeadWrench at the research-gate decision point. The scouts have completed codebase exploration and the node library is available. Before proceeding to plan design, assess two **independent** questions:

1. **Planning-time research (Q1):** Would dispatching @ExternalScout *right now* yield information that meaningfully improves the plan?
2. **Execution-time research (Q2):** Should the generated project DAG include `research-basic` or `research-deep` nodes for the task executor to use?

These questions are orthogonal — answer Q2 independently of Q1.

## Assessment Criteria

### Q1: Planning-Time Research Need

Review the task description and scout findings. Ask yourself: would 15 minutes of external documentation lookup (Context7 or Exa) meaningfully improve the plan?

**Say YES if ANY apply:**
- The task involves external APIs, new frameworks, or library integrations where documentation gaps exist
- Model knowledge may be stale (recent library releases, new language features, ecosystem shifts)
- External technique literature or community patterns would prevent hallucination on unfamiliar approaches
- The codebase alone does not provide sufficient context for key implementation decisions

**Say NO only if:**
- The task is fully self-contained in the codebase with no external dependencies
- Knowledge staleness poses no risk
- Scout findings establish clear technical direction

### Q2: Execution-Time Research Nodes

Independently, assess whether the *generated* DAG should include research nodes.

**Say YES if:**
- Implementation decisions benefit from looking up external docs at execution time (integrating a library, using an API, following a framework pattern)
- The task scope suggests benefit from just-in-time information retrieval

**Say NO if:**
- The task is straightforward refactoring or editing where the codebase provides all needed context
- The plan is deterministic and does not depend on external state at execution time
- All external context needed for implementation is known at planning time

## Step 1: Call Question for Planning-Time Research

Form your recommendation (YES or NO based on the criteria above), then call `question`:

**Question text:** "Would a cursory external research pass improve the plan for this task?"

**Options:**
- "Yes, research would help (HW recommends)" ← if you lean toward research
- "Yes, research would help" ← if you're unsure
- "No, skip research (HW recommends)" ← if you lean against research
- "No, skip research" ← if you're unsure

**Description for both:** Describe the consequence — e.g., "Dispatch @ExternalScout for a quick pass on [topic]" for YES; "Proceed directly to plan design" for NO.

After the user answers, **do not route yet** — proceed to Step 2.

## Step 2: Call Question for Execution-Time Research Nodes

Form your independent recommendation (YES or NO based on the criteria above), then call `question`:

**Question text:** "Should the generated project DAG include execution-time research nodes?"

**Options:**
- "Include execution research nodes (HW recommends)" ← if you lean toward including them
- "Include execution research nodes" ← if you're unsure
- "No execution research (HW recommends)" ← if you lean against including them
- "No execution research" ← if you're unsure

**Description for both:** Describe the consequence — e.g., "Include `research-basic` or `research-deep` nodes in the plan" for YES; "Proceed without research nodes" for NO.

## Step 3: Route Based on Q1 Answer

After both questions are answered, write a one-sentence summary of your two decisions (e.g., "Q1: dispatch ExternalScout; Q2: include research nodes in DAG").

**Then immediately call `next_step` with this routing logic:**
- Q1 = "Yes, research would help" → call `next_step({ next: "research-brief" })`
- Q1 = "No, skip research" → call `next_step({ next: "sequential-thinking-2" })`

**Carry the Q2 answer forward** in your context so sequential-thinking knows whether to author research nodes in the DAG.

## Notes

- Both decisions are independent. "Yes" to planning-time research and "No" to execution research is valid.
- Append "(HW recommends)" only to the option that your honest assessment supports — do not hedge or recommend research just because it is available.
- The Q1 answer determines routing; the Q2 answer informs the planning phase.
