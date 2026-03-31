# Communicating Task Failure

This is a terminal node with an empty todo array. HeadWrench reads this prompt and communicates to the user what was attempted, where the plan failed, and what recovery options are available.

The output is user-facing — write in plain language that explains the situation honestly and provides actionable next steps.

---

## Zone 1: Fixed Framing (Terminal Failure)

This session has ended without completing the requested task. The following sections describe what was attempted, why it failed, and what the user can try next.

---

## Zone 2: Placeholders (Planning Agent Fills These)

### What Was Attempted

{{WHAT_WAS_ATTEMPTED}}

*Planning note: Describe all major phases the DAG completed before stopping — not just the final step. Example: "Scout phase completed (3 ContextScout agents read the codebase and reported findings). Implementation phase attempted (2 JuniorDev edits to src/kernels/matmul.cpp, 2 build verification attempts, both failed)."*

### Failure Point

{{FAILURE_POINT}}

*Planning note: Name the exact phase or step where the plan stopped, including the root cause. Example: "Build verification failed after 2 fix attempts. Linker errors in src/kernels/matmul.cpp line 47–52 remain unresolved. Root cause: missing USM device allocation before kernel dispatch."*

### Recovery Options

{{RECOVERY_OPTIONS}}

*Planning note: List 1–3 specific, executable actions. Each must be command-level (copy-paste ready, e.g. `npm install`, `git clone <url>`) or file-specific (e.g., "edit src/config.json line 12"). Do NOT write vague suggestions like "try again" or "restart." Include expected outcomes so the user knows when an option succeeds. Example:*

*"1. Run \`cmake --build build/ 2>&1 | head -50\` to see the exact linker errors. This will show which symbols are missing.*
*2. Open src/kernels/matmul.cpp and review lines 47–52. The error will indicate which allocation call is needed.*
*3. If errors persist after manual fixes, run \`cmake --build build/\` again to verify. If still failing, check that SYCL device selectors are configured correctly in your CMake toolchain."*

---

## Zone 3: Fixed Execution Specifications (Recency Anchoring)

### Communication Constraint

Write in plain user-facing language. Do NOT reference:
- DAG node IDs, node names, or todo arrays
- Planning system mechanics (e.g., "the planning plugin," "the enforce tool," "validation gates")
- HeadWrench internal state, reasoning, or orchestration
- Generic phrases like "retry," "try again," or "contact support" without a specific action

Recovery options MUST be specific — include at least one command the user can run manually, or an exact file path and line number to edit. Users should be able to read your output and immediately know what to do next.

### Terminal Constraint

This node has `todo: []` — empty. Do NOT include instructions for HeadWrench to execute, call tools, or advance to a next node. Those instructions will be read as part of the message to the user. Everything you write here is user-facing communication only. The session terminates after this node.

---

## Usage Note

This template produces no tool calls. HeadWrench reads the completed template and outputs its content to the user as-is. The session ends immediately. Ensure all placeholders are filled with specific, actionable content — this is the user's last message from the planning system, and it must be honest and helpful.
