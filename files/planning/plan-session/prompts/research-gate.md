# Research Gate

**You MUST call the question tool TWICE in sequence — do not skip either step, do not proceed without calling both.**

The scouts have completed their codebase exploration AND the node library is now available. Before proceeding to plan design, assess two **independent** questions. **Q1 (planning-time):** Should ExternalScout be dispatched NOW during this planning session to gather external information? **Q2 (DAG-design):** Should the project DAG you generate include execution-time research nodes for the task executor to use later? These questions are orthogonal — Q2 must be answered independently of Q1.

## How to assess

Review the task description and scout findings:

- **Planning-time research (Q1):** Would dispatching @ExternalScout *right now* yield information that meaningfully improves the plan? Say YES if ANY of these apply: (a) the task involves external APIs, new frameworks, or library integrations where documentation gaps exist; (b) model knowledge may be stale for this topic (recent library releases, new language features, ecosystem shifts); (c) external technique literature or community patterns would prevent hallucination on unfamiliar implementation approaches; (d) the codebase alone does not provide sufficient context for key implementation decisions. Say NO only for tasks that are fully self-contained in the codebase with no external dependencies and no knowledge-staleness risk.

- **Execution-time research (Q2):** Should the generated project DAG include `research-basic` or `research-deep` nodes? Say YES if the task involves implementation decisions that benefit from looking up external docs at execution time (e.g., integrating a library, using an API, following a framework pattern). Say NO for straightforward refactors, edits, or tasks where the codebase provides all needed context.

Form a recommendation for each question before calling the question tool.

## Todo

1. `question` — Ask whether cursory planning-time research is needed. Mark your recommendation in the option label.

   **Q1 — Planning-time research:** Present your reasoning from `pre-research-thinking` (YES/NO recommendation + one-sentence reason), then ask the user to confirm or override.

   **question text:** "Would a cursory external research pass improve the plan for this task?"

   **Option A:** "Yes, research would help" or "Yes, research would help (HW recommends)" — description: "Dispatch ExternalScout for a targeted cursory pass before designing the plan"

   **Option B:** "No, skip research" or "No, skip research (HW recommends)" — description: "Proceed directly to plan design"

   Append "(HW recommends)" to whichever option matches your `pre-research-thinking` recommendation.

    **CRITICAL:** Use these exact label prefixes in your `question` call: 'Yes, research would help' or 'No, skip research'. Routing instructions appear after both questions are answered — do NOT call `next_step` until Q2 is also complete.

2. `question` — Ask whether the generated project DAG should include execution-time research nodes. Mark your recommendation.

   **Q2 — DAG execution-time research (independent decision):** Should the plan you generate include research nodes? Note: answer this independently — Q2 is NOT determined by Q1.

   **Option A:** "Include execution research nodes" or "Include execution research nodes (HW recommends)" — description: "Add research-basic or research-deep nodes in the generated project DAG"

   **Option B:** "No execution research" or "No execution research (HW recommends)" — description: "Proceed without dedicated research nodes in the project DAG"

    Append "(HW recommends)" to whichever option you recommend.

**CRITICAL:** Use these exact label prefixes in your Q2 `question` call: 'Include execution research nodes' or 'No execution research'.

After both questions are answered, write a one-sentence summary of your two decisions (e.g., "Q1: dispatch ExternalScout; Q2: include research nodes in DAG"). **You MUST then immediately call `next_step` — do not emit another response before routing:**
- Q1 = "Yes, research would help" → call `next_step({ next: "research-brief" })`
- Q1 = "No, skip research" → call `next_step({ next: "pre-research-thinking" })`

Carry the Q2 answer in your context for use in sequential-thinking.
