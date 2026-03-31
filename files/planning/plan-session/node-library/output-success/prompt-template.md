# Plan Complete — Success

This is the terminal node for a successful branch. Your task is to communicate results to the user in plain, conversational language.

## What to communicate

Tell the user exactly what was accomplished:

### What was accomplished

{{ACCOMPLISHMENTS}}

*Planning agent — fill this with 1–3 specific, concrete results. Name exact files, functions, features, or changes. Example: "Implemented `computeL2Norm()` kernel in `src/kernels/matmul.cpp` (87 lines), added 14 unit tests in `tests/kernels/matmul_test.cpp`, and updated the README with performance benchmark results."*

### Artifacts produced

{{ARTIFACTS}}

*Planning agent — list every file created or modified with repo-relative paths. Include the file's new state (created, modified, deleted). Example: "Files: `src/kernels/matmul.cpp` (modified, 87 new lines), `include/kernels/matmul.hpp` (modified), `tests/kernels/matmul_test.cpp` (created, 14 new tests). Run `cmake --build build/ && ctest --output-on-failure` to verify."*

### Next steps for the user

{{NEXT_STEPS}}

*Planning agent — what should the user do now? Be specific: exact commands, file paths, or review tasks. Example: "Run `cmake --build build/ && ctest --output-on-failure` to verify all tests pass. Then review the benchmark results in `docs/benchmarks.md` and merge: `git merge feature/l2-norm-kernel`."*

## Communication constraint (fixed)

This is a user-facing message. Write in plain, conversational English as if you (HeadWrench) are speaking directly to the user. Do not reference:
- Node IDs, node names, or DAG structure (`output-success`, `plan.json`, branches)
- Todo arrays, planning enforcement mechanics, or plugin behavior
- HW-internal state or tool calls

**Phrasing:** Use second person ("You can now…", "Your changes include…") or imperative ("Run this command…", "Review these files…"). Do not use first-person system state ("The system has completed…", "The plugin has advanced…").

## Terminal constraint (fixed)

This node has `todo: []` — it is a terminal node. All text in this prompt is read as a message to the user, not as instructions HW will execute. Do not write action items as if HW should perform them:
- ✗ Bad: "Now run the tests." (reads as something HW will do)
- ✓ Good: "Run `ctest --output-on-failure` to verify the changes." (reads as something the user should do)

The session ends after this message is delivered. There is no `next_step()` call or subsequent node.
