# Conditional Branch

Route to one of two branch nodes based on a condition already available in prior context.

**Todo:** `[]`

**Zone 1 — Fixed execution spec**:

> (1) Read the condition from prior context — do not call any tool
> (2) Match the condition result against {{BRANCH_A_CONDITION}} or {{BRANCH_B_CONDITION}}
> (3) Route to the correct branch using the exact node ID (not the when-string)
> (4) Output: call `next_step({ next: "<node-id>" })` with the matching branch's ID

**Zone 2 — Planning agent fills**:

{{CONDITION}}
The specific value, file state, or output property being checked.
✓ Good: "Exit code from the build task (0 = success, non-zero = failure)"
✗ Bad: "Check if it worked"

{{CONDITION_SOURCE}}
Exact location in prior context where this value appears.
✓ Good: "In the prior 'run-tests' node output, under '## Test Results', the 'Exit code:' field"
✗ Bad: "HW will figure it out"

{{BRANCH_A_CONDITION}}
What this condition outcome means.
✓ Good: "Exit code is 0 — all tests passed"
✗ Bad: "success case"

{{BRANCH_A_NODE_ID}}
Exact node id to route to (not a when-string).
✓ Good: `deploy-staging`
✗ Bad: `"Tests passed"`

{{BRANCH_B_CONDITION}}
What the alternate outcome means.
✓ Good: "Exit code is non-zero — test failures detected"
✗ Bad: "failure case"

{{BRANCH_B_NODE_ID}}
Exact node id for the alternate branch.
✓ Good: `debug-and-retry`
✗ Bad: `"Tests failed"`

**Zone 3 — Fixed constraints**:

Routing uses node IDs, not when-strings. ✓ `next_step({ next: "deploy-staging" })` ✗ `next_step({ next: "Tests passed" })`

Call `next_step({ next: "{{BRANCH_A_NODE_ID}}" })` or `next_step({ next: "{{BRANCH_B_NODE_ID}}" })` with the exact matching branch's ID.
