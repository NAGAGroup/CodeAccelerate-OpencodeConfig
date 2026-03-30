# Research Gate

**You MUST call the question tool TWICE in sequence — do not skip either step, do not proceed without calling both.**

The scouts have completed their codebase exploration AND the node library is now available. Before proceeding to plan design, assess two **independent** questions. **Q1 (planning-time):** Should ExternalScout be dispatched NOW during this planning session to gather external information? **Q2 (DAG-design):** Should the project DAG you generate include execution-time research nodes for the task executor to use later? These questions are orthogonal — Q2 must be answered independently of Q1.

## How to assess

Review the task description and scout findings:

- **Planning-time research (Q1):** Would dispatching @ExternalScout *right now* yield information that meaningfully changes your plan structure? Say YES if external APIs, new frameworks, or documentation gaps exist that would affect which nodes you include or how you sequence them. Say NO for tasks that are self-contained in the codebase with no external dependencies.

- **Execution-time research (Q2):** Should the generated project DAG include `research-basic` or `research-deep` nodes? Say YES if the task involves implementation decisions that benefit from looking up external docs at execution time (e.g., integrating a library, using an API, following a framework pattern). Say NO for straightforward refactors, edits, or tasks where the codebase provides all needed context.

Form a recommendation for each question before calling the question tool.

## Todo

1. `question` — Ask whether cursory planning-time research is needed. Mark your recommendation in the option label.

   **Q1 — Planning-time research (independent decision):** Should ExternalScout be dispatched NOW?

   **Option A:** "User wants web research" or "User wants web research (HW recommends)" — description: "Dispatch ExternalScout for a targeted cursory pass before designing the plan"

   **Option B:** "User skips web research" or "User skips web research (HW recommends)" — description: "Proceed directly to sequential thinking"

   Append "(HW recommends)" to whichever option you recommend based on your assessment.

   **CRITICAL:** Use these exact label prefixes in your `question` call: 'User wants web research' or 'User skips web research'. After Q1 is answered, call `next_step` with the correct node ID — `next_step({ next: 'research-brief' })` for 'User wants web research', or `next_step({ next: 'sequential-thinking-2' })` for 'User skips web research'. The `when` field in plan.json is a human-readable label; routing is performed by your explicit `next_step` call, not by the plugin matching strings.

2. `question` — Ask whether the generated project DAG should include execution-time research nodes. Mark your recommendation.

   **Q2 — DAG execution-time research (independent decision):** Should the plan you generate include research nodes? Note: answer this independently — Q2 is NOT determined by Q1.

   **Option A:** "Include execution research nodes" or "Include execution research nodes (HW recommends)" — description: "Add research-basic or research-deep nodes in the generated project DAG"

   **Option B:** "No execution research" or "No execution research (HW recommends)" — description: "Proceed without dedicated research nodes in the project DAG"

   Append "(HW recommends)" to whichever option you recommend.

After both questions are answered, write a one-sentence summary of your two decisions (e.g., "Q1: dispatch ExternalScout; Q2: include research nodes in DAG"). Then route based on Q1:
- Q1 = "User wants web research" → call `next_step({ next: "research-brief" })`
- Q1 = "User skips web research" → call `next_step({ next: "sequential-thinking-2" })`

Carry the Q2 answer in your context for use in sequential-thinking.
