# Output Failure

Report to the user that the session ended prematurely with a specific failure.

**Todo:** `[]`

The session has ended without completing the requested task. You are communicating the outcome to the user in plain, honest language.

**Zone 1 — User-facing failure summary:**

- {{FAILURE_SUMMARY}}: one sentence describing what failed and why. ✓ "The build phase failed at src/kernels/matmul.cpp line 47 with a linker error: missing USM device allocation." ✗ "Something went wrong."
- {{WHAT_WAS_ACCOMPLISHED}}: brief description of completed work before the failure. ✓ "Scout phase completed successfully; 3 codebase agents mapped the architecture; implementation phase began but stalled." ✗ "Not much."
- {{RECOVERY_ACTIONS}}: 1–3 specific, executable steps the user can take manually. ✓ "Run `cmake --build build/ 2>&1 | head -50` to see the exact linker errors. Then review src/kernels/matmul.cpp lines 47–52." ✗ "Try again later."

**Zone 2 — What users read:**

This is a terminal node with `todo: []`. Everything you write here is delivered to the user as a final message from the planning system. Write conversationally, name exact file paths and line numbers, and include at least one command the user can run immediately. Do not reference DAG nodes, todo arrays, planning mechanics, or system internals.

**Zone 3 — No actions beyond messaging:**

No tool calls. No `next_step()`. The session terminates after this message is sent. This is the user's last communication from the planning system — ensure it is specific and actionable.
