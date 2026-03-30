# Research Gate

**You MUST call the question tool TWICE in sequence — do not skip either step, do not proceed without calling both.**

The scouts have completed their codebase exploration AND the node library is now available. Before proceeding to plan design, assess two things: (1) whether a cursory planning-time research pass would help, and (2) whether the generated project DAG should include execution-time research nodes.

## How to assess

Review the task description and scout findings:

- **Planning-time research (Q1):** Would dispatching @ExternalScout *right now* yield information that meaningfully changes your plan structure? Say YES if external APIs, new frameworks, or documentation gaps exist that would affect which nodes you include or how you sequence them. Say NO for tasks that are self-contained in the codebase with no external dependencies.

- **Execution-time research (Q2):** Should the generated project DAG include `research-basic` or `research-deep` nodes? Say YES if the task involves implementation decisions that benefit from looking up external docs at execution time (e.g., integrating a library, using an API, following a framework pattern). Say NO for straightforward refactors, edits, or tasks where the codebase provides all needed context.

Form a recommendation for each question before calling the question tool.

## Todo

1. `question` — Ask whether cursory planning-time research is needed. Mark your recommendation in the option label.

   **Option A:** "Do planning research" or "Do planning research (HW recommends)" — description: "Dispatch ExternalScout for a targeted cursory pass before designing the plan"

   **Option B:** "Skip planning research" or "Skip planning research (HW recommends)" — description: "Proceed directly to sequential thinking"

   Append "(HW recommends)" to whichever option you recommend based on your assessment.

2. `question` — Ask whether the generated project DAG should include execution-time research nodes. Mark your recommendation.

   **Option A:** "Include execution research nodes" or "Include execution research nodes (HW recommends)" — description: "Add research-basic or research-deep nodes in the generated project DAG"

   **Option B:** "No execution research" or "No execution research (HW recommends)" — description: "Proceed without dedicated research nodes in the project DAG"

   Append "(HW recommends)" to whichever option you recommend.

After both questions are answered, branching instructions will follow:
- If Q1 = "Do planning research" → proceed to `research-brief`
- If Q1 = "Skip planning research" → proceed to `sequential-thinking-2`

Carry the Q2 answer in context — sequential-thinking will use it when deciding whether to include research nodes in the generated plan.
