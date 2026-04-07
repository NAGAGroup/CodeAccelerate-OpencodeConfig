// test/agent-prompts.ts
// Per-agent test prompt pools — what headwrench would actually send to each subagent.
// Prompts are goal-oriented: they state what needs to be achieved and why,
// not which files to read or what specific steps to take. Agents figure out the how.
// Each agent has 4 prompt variants covering different task scenarios.

export interface AgentTest {
  agentId: string;
  // Pool of varied prompts for this agent. Autonomous agent selects 3 per iteration.
  prompts: string[];
  // Description of what correct behavior looks like — used for qualitative analysis.
  successDescription: string;
}

export const AGENT_TESTS: AgentTest[] = [
  {
    agentId: "context-scout",
    successDescription: "Loads grepai/sequential-thinking/qdrant-notes skills first. Uses grepai_search with multiple varied queries. Returns narrative prose with explicit uncertainties. Covers breadth not depth. Calls qdrant_store before returning. Does NOT use read, glob, grep, or trace tools.",
    prompts: [
      `I need a broad orientation of this codebase before planning a change. Give me a landscape overview: what does this project do, how is it structured, what are the main components and how do they relate to each other? I need enough context to make informed planning decisions. Store your findings before returning.`,

      `We're about to add a new math utility function to this project. Before planning the work, I need to understand how the existing library code is organized — what patterns it follows, how tests are structured, and what conventions I should follow. Give me a broad survey. Store your findings before returning.`,

      `I need to understand the build system and dependency structure of this project before making changes. What build tool is used, how are targets organized, and what would be affected if I added a new source file? Give me a landscape overview. Store your findings before returning.`,

      `Before planning a documentation improvement, I need to understand the current state of documentation in this project — what's documented, what isn't, and what conventions are used. Give me a broad survey. Store your findings before returning.`,
    ],
  },

  {
    agentId: "context-insurgent",
    successDescription: "Loads grepai/sequential-thinking/qdrant-notes skills first. Reasons through tool calling strategy before acting. Uses trace tools to follow logic across files. Every claim tied to specific code evidence with file paths and line numbers. Explicitly states what could not be determined. Calls qdrant_store before returning.",
    prompts: [
      `I need a precise technical analysis of how the math library handles error conditions. Trace exactly what happens when invalid input is passed — which functions validate input, what exceptions are thrown, and whether the test suite covers these paths. I need file paths and line numbers for every claim. Store your findings before returning.`,

      `I need to understand exactly how the template library function is implemented and what its constraints are. Trace the implementation: what does it actually do, what are the type requirements, and are there any edge cases the implementation doesn't handle? I need file paths and line numbers. Store your findings before returning.`,

      `I need a precise analysis of the test coverage in this project. Which functions are tested, which are not, and what edge cases are missing? Trace from the test file to the implementation for each tested function. I need file paths and line numbers. Store your findings before returning.`,

      `I need to understand exactly how the project's namespace structure works. Trace which namespaces exist, what lives in each, and whether there are any inconsistencies between headers and implementations. I need file paths and line numbers for every claim. Store your findings before returning.`,
    ],
  },

  {
    agentId: "dag-designer",
    successDescription: "Loads dag-tools/sequential-thinking/qdrant-notes skills first. Calls get_planning_components_catalogue and get_dag_design_guide before designing. Calls qdrant_find for planning context. Adds nodes incrementally with descriptive IDs. No parallel branches — all branches are decision-gate. Every work-item followed by verify. Verification failure paths end in plan-fail. Calls validate_dag. Stores rationale to Qdrant.",
    prompts: [
      `Build an execution DAG for plan "add-gcd-function".

Planning context:
- Goal: Add a greatest common divisor (gcd) function to the math library
- The project has an existing source library with math functions and a test file
- The new function should follow the same patterns as existing functions
- Scope: add to the library source and header, add a test, verify it builds and tests pass

Store your design rationale to Qdrant when done.`,

      `Build an execution DAG for plan "add-string-utils-lib".

Planning context:
- Goal: Add a new header-only string utilities library alongside the existing header-lib
- The project already has a header-only library as a pattern to follow
- Scope: create the new library directory structure, implement one utility function, wire it into the build system, verify it compiles

Store your design rationale to Qdrant when done.`,

      `Build an execution DAG for plan "improve-test-coverage".

Planning context:
- Goal: Add missing edge case tests to the existing test suite
- Investigation found the test file exists but doesn't cover negative inputs or boundary values
- Scope: modify the existing test file only, no new files
- Constraint: must not break existing passing tests

Store your design rationale to Qdrant when done.`,

      `Build an execution DAG for plan "add-doxygen-docs".

Planning context:
- Goal: Add Doxygen documentation comments to the header-only library (currently undocumented relative to source-lib)
- The source library already has well-formatted Doxygen comments as a reference
- Scope: modify the header-only library's header file only
- Verify: doxygen build must succeed without warnings

Store your design rationale to Qdrant when done.`,
    ],
  },

  {
    agentId: "dag-reviewer",
    successDescription: "Loads dag-tools/sequential-thinking/qdrant-notes skills first. Calls show_compact_dag and show_dag. Calls get_planning_components_catalogue and get_dag_design_guide. Calls validate_dag. Covers all review dimensions. Critiques only — no proposed fixes. Flags parallelism. Checks convergence. Each critique points to specific nodes with evidence. Stores findings to Qdrant.",
    prompts: [
      `Review the execution DAG for plan "add-gcd-function".

User goal: Add a gcd function to the math library, following existing patterns, with tests.

Review all dimensions: completeness, dependency ordering, component fit, verification coverage, scope discipline, failure handling, branching correctness, convergence correctness.

Store your critique to Qdrant when done. Critiques only — no proposed fixes.`,

      `Review the execution DAG for plan "add-string-utils-lib".

User goal: Add a new header-only string utilities library to the project, with one utility function, wired into the build system.

Review all dimensions: completeness, dependency ordering, component fit, verification coverage, scope discipline, failure handling, branching correctness, convergence correctness.

Store your critique to Qdrant when done. Critiques only — no proposed fixes.`,

      `Review the execution DAG for plan "improve-test-coverage".

User goal: Add missing edge case tests to the existing test suite without breaking existing tests.

Review all dimensions: completeness, dependency ordering, component fit, verification coverage, scope discipline, failure handling, branching correctness, convergence correctness.

Store your critique to Qdrant when done. Critiques only — no proposed fixes.`,

      `Review the execution DAG for plan "add-doxygen-docs".

User goal: Add Doxygen comments to the header-only library, matching the style of the source library.

Review all dimensions: completeness, dependency ordering, component fit, verification coverage, scope discipline, failure handling, branching correctness, convergence correctness.

Store your critique to Qdrant when done. Critiques only — no proposed fixes.`,
    ],
  },

  {
    agentId: "junior-dev",
    successDescription: "Loads grepai/sequential-thinking/qdrant-notes/file-operations skills first. Investigates codebase before modifying. Every edit preceded by read on same file. Changes limited to stated goal — no adjacent refactoring. Does NOT use bash or shell operations. Conservative on ambiguity. Clear statement of what changed and why.",
    prompts: [
      `There's a math utility function in this project that performs integer division. It currently doesn't handle the case where the divisor is zero. Find it, understand how other functions in the same library handle error conditions, and add appropriate error handling consistent with the existing patterns. Do not modify anything outside the function itself.`,

      `The project has a demo application that exercises the math library. It's missing a demonstration of at least one library function that exists in the library but isn't shown in the demo. Find which function is missing from the demo, understand the demo's existing style and conventions, and add a demonstration of that function. Do not add more than one new demonstration.`,

      `There is a function in this codebase whose documentation comment in the header file does not accurately describe its current behavior — the implementation has changed but the comment wasn't updated. Find it, verify the discrepancy by reading both the comment and the implementation, and update the comment to match the actual behavior. Do not modify the implementation or any other file.`,

      `The test suite in this project is missing coverage for at least one function that exists in the math library. Find which function has no test, understand the existing test patterns and conventions, and add a minimal test for that function following the same style. Do not modify any existing tests or any file other than the test file.`,
    ],
  },

  {
    agentId: "documentation-expert",
    successDescription: "Loads file-operations/sequential-thinking/grepai/qdrant-notes skills first. Reads target file before editing to understand structure and tone. Changes limited to named scope. Does NOT modify source code. Edits match existing formatting conventions. Uses grepai for reference materials when relevant.",
    prompts: [
      `The project's README is missing documentation about the project structure. Investigate the project to understand what directories and components exist, then add a section to the README explaining how the project is organized. Match the existing README's tone and formatting exactly. Do not modify any source files.`,

      `One of the libraries in this project has header documentation that is inconsistent with the other library's documentation style. Find which one is less documented, investigate the better-documented library's style as a reference, and bring the underdocumented one up to the same standard. Do not modify any implementation files.`,

      `The project is missing a section in its README explaining how to build and run it. Investigate the build system to understand what commands are needed, then add accurate build and run instructions to the README. Do not modify any CMake files or source code.`,

      `A developer wants to contribute a new function to this project's math library. Write a contributing guide section in the README that explains exactly how to do this — where files go, what conventions to follow, how to add a test. Investigate the existing code to make the instructions accurate. Do not modify any source files.`,
    ],
  },

  {
    agentId: "external-scout",
    successDescription: "Loads web-research/sequential-thinking/qdrant-notes skills first. Uses searxng_web_search (not training knowledge). Uses searxng_web_url_read to read actual pages. Findings tagged verified/inferred/uncertain. Contradictions documented. States what couldn't be confirmed. Does NOT use file read, GrepAI, or project tools. Uses context7 for library docs when relevant.",
    prompts: [
      `Research best practices for structuring a CMake project with multiple libraries and an application target. Specifically: what are the recommended patterns for target_link_libraries, how should include directories be managed, and what does modern CMake say about PUBLIC vs PRIVATE vs INTERFACE? Tag all findings as verified/inferred/uncertain and include sources. Store findings to Qdrant before returning.`,

      `Research the Catch2 testing framework for C++: what version is current, how do you write a basic test case, and what are the recommended CMake integration patterns? Tag all findings as verified/inferred/uncertain and include sources. Store findings to Qdrant before returning.`,

      `Research Doxygen documentation generation for C++ projects: what comment syntax does it use, how do you configure it with CMake, and what are the most commonly used tags for documenting functions? Tag all findings as verified/inferred/uncertain and include sources. Store findings to Qdrant before returning.`,

      `Research C++ integer overflow detection: what are the standard library tools available, what compiler flags help detect overflow, and what are the idiomatic ways to guard against it in a library function? Tag all findings as verified/inferred/uncertain and include sources. Store findings to Qdrant before returning.`,
    ],
  },

  {
    agentId: "tailwrench",
    successDescription: "Runs shell commands precisely as instructed. Reports output clearly. Stores results to Qdrant when asked. Does not investigate, design, or troubleshoot beyond the stated task.",
    prompts: [
      `Check that the project builds without errors. Run the build using whatever build system is configured. Report PASS if it succeeds, FAIL with the full error output if it doesn't. Store results to Qdrant collection "prompt-engineering-test-harness" with key "tailwrench-build-check".`,

      `Run the project's test suite and report the results. Report how many tests passed and failed. Store the full output to Qdrant collection "prompt-engineering-test-harness" with key "tailwrench-test-check".`,

      `List the top-level directory structure of the project and report the line counts of all source files (.cpp and .hpp). Store results to Qdrant collection "prompt-engineering-test-harness" with key "tailwrench-structure-check".`,

      `Check git status and the last 5 commits. Report any uncommitted changes and the commit history. Store results to Qdrant collection "prompt-engineering-test-harness" with key "tailwrench-git-check".`,
    ],
  },

  {
    agentId: "autonomous-agent",
    successDescription: "Loads appropriate skills first. Reasons through strategy before acting. Makes targeted changes without over-reaching. Verifies work after completing it.",
    prompts: [
      `Add a \`subtract\` function to the math library and a corresponding test. The function should follow all existing conventions in the codebase. Verify the build passes after your changes.`,

      `The project's README is missing a badge showing the build status. Add a placeholder badge at the top of the README in the standard markdown badge format. Verify the file looks correct after editing.`,

      `Add a \`square\` function (returns n*n as long long) to the math library following existing patterns, then verify the project still builds cleanly.`,

      `Count the total lines of source code in the project (all .cpp and .hpp files) and write the result as a comment at the top of the README. Verify the README looks correct after editing.`,
    ],
  },
];
