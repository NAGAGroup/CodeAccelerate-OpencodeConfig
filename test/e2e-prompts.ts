// test/e2e-prompts.ts
// Planning session E2E test prompt pool.
// Each prompt is the expansion of /plan-session — the slash command replaces $ARGUMENTS
// with the user's goal and prepends the plan_session call instruction.
// Headwrench receives this as the first message and must call plan_session immediately.

export interface E2ETest {
  id: string;
  // The full prompt as it would arrive after slash command expansion
  prompt: string;
  // What a successful E2E run looks like — used for qualitative analysis
  successDescription: string;
}

function expandPlanSession(goal: string): string {
  return `Immediately call the plan_session tool to begin the planning workflow.

You are HeadWrench, starting a planning session to explore, design, and decompose the user's request into a structured execution DAG. The user's topic or description is:

"${goal}"

Constraints:

Load all required skills and call plan_session immediately to start the planning workflow. Do not attempt to manually parse or execute plan files yourself. The plan_session tool will handle the entire planning process.`;
}

export const E2E_TESTS: E2ETest[] = [
  {
    id: "add-math-function",
    prompt: expandPlanSession(
      "Add a greatest common divisor (gcd) function to the math library in this C++ project. It should follow the same patterns as existing functions, be added to the source and header, have a test, and the build must pass."
    ),
    successDescription: [
      "Calls plan_session immediately on first message.",
      "Loads following-plans skill at session-overview node.",
      "Chooses a descriptive hyphenated plan name.",
      "At orientation-scout: loads context-scout-delegation + sequential-thinking, dispatches @context-scout with a goal-based prose prompt asking for landscape findings and uncertainties.",
      "At external-research: loads external-scout-delegation + sequential-thinking, dispatches @external-scout with a public-terms research goal.",
      "At store-notes: loads qdrant-notes, makes multiple qdrant_qdrant-store calls with prose findings.",
      "At compress: calls compress tool on investigation content.",
      "At session-overview-refresher: loads following-plans skill.",
      "At retrieve-notes: runs multiple qdrant_qdrant-find queries, synthesizes with sequential-thinking.",
      "At dag-design: calls init_dag, uses sequential-thinking, dispatches @dag-designer with plan name + context describing phases and decision gates (not file names).",
      "At dag-review: uses sequential-thinking, dispatches @dag-reviewer with plan name + user goal + all review dimensions.",
      "At dag-revision: uses sequential-thinking, dispatches @dag-designer with reviewer critique.",
      "Reaches plan-success and outputs plan name + /activate-plan instruction.",
      "Runs to completion without stalling or needing user nudging.",
    ].join(" "),
  },

  {
    id: "add-header-only-lib",
    prompt: expandPlanSession(
      "Add a new header-only string utilities library to this C++ project alongside the existing header-lib. It should include at least one utility function, follow existing patterns, be wired into the build system, and compile cleanly."
    ),
    successDescription: [
      "Calls plan_session immediately on first message.",
      "Follows all 11 DAG nodes in sequence without skipping or reordering.",
      "Loads correct skills at each node (following-plans, context-scout-delegation, external-scout-delegation, qdrant-notes, dag-design, dag-review).",
      "Dispatch prompts to subagents are goal-based — describe what to understand or accomplish, not which files to read.",
      "DAG design describes phases and decision gates, not specific file edits.",
      "Reaches plan-success with a valid plan name and /activate-plan instruction.",
      "No stalling, no user nudging required.",
    ].join(" "),
  },

  {
    id: "improve-test-coverage",
    prompt: expandPlanSession(
      "Improve test coverage in this C++ project by adding missing edge case tests. The existing test suite doesn't cover negative inputs or boundary values. Only modify the existing test file — no new files. Existing tests must continue to pass."
    ),
    successDescription: [
      "Calls plan_session immediately on first message.",
      "Follows all 11 DAG nodes in sequence.",
      "At orientation-scout: scout prompt focuses on understanding existing test patterns and what's missing.",
      "At external-research: research is relevant to the goal (e.g. C++ testing patterns, edge case strategies).",
      "Store-notes captures scope constraint (existing test file only, no new files).",
      "DAG design reflects the constraint — no new-file creation nodes.",
      "Reaches plan-success with valid plan name.",
      "No stalling or nudging required.",
    ].join(" "),
  },

  {
    id: "add-doxygen-docs",
    prompt: expandPlanSession(
      "Add Doxygen documentation comments to the header-only library in this C++ project. The source-lib already has documentation style to follow. The output should be a Doxygen-compatible header file with all public APIs documented."
    ),
    successDescription: [
      "Calls plan_session immediately on first message.",
      "Follows all 11 DAG nodes in sequence.",
      "Scout prompt asks about existing documentation conventions and the header-only library structure.",
      "External research covers Doxygen comment syntax and conventions.",
      "DAG design includes a verification phase (e.g. doxygen runs without warnings).",
      "Reaches plan-success with valid plan name and /activate-plan instruction.",
      "No stalling or nudging required.",
    ].join(" "),
  },
];
