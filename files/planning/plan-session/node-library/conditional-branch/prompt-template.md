# {{NODE_TITLE}}

*Descriptive title matching the condition being evaluated. E.g., "Build Result Check", "File Exists Verification", "Test Output Evaluation". Avoid generic titles like "Branch Node".*

---

## ZONE 1: Fixed Framing (HW Evaluates Condition — No Tool Call Needed)

This node branches on a condition that is already available in prior context. No new tool calls are needed. HeadWrench will evaluate the condition from the prior context and call `next_step()` to route to the appropriate branch.

**The condition being evaluated:**
{{CONDITION}}

*What specific value, file state, or output property is being checked? E.g., "Exit code from the build-and-test task (0 = success, non-zero = failure)". Do NOT describe a feature or goal — describe the exact machine-readable result.*

**Where HW finds the condition result:**
{{CONDITION_SOURCE}}

*Describe the exact location in prior context: which node produced it, which section or field contains it, what it looks like. E.g., "In the prior 'run-tests' node's task[1] output, under the '## Test Results' section, the 'Exit code:' field shows either 0 or a non-zero number." Do NOT say "HW will figure it out" — provide the exact location.*

---

## ZONE 2: Branch Definitions (Planning Agent Fills These)

### Branch A: {{BRANCH_A_CONDITION}}

**When this condition occurs:** {{BRANCH_A_CONDITION}}

*Describe what the condition outcome means in plain language. E.g., "Exit code is 0, indicating all tests passed successfully."*

**Route to node:** `{{BRANCH_A_NODE_ID}}`

*The exact node id where HW should route when Branch A is true. E.g., "deploy-staging". This must be the `id` field from the DAG branch object — NOT the `when` string.*

### Branch B: {{BRANCH_B_CONDITION}}

**When this condition occurs:** {{BRANCH_B_CONDITION}}

*Describe what the condition outcome means in plain language. E.g., "Exit code is non-zero, indicating test failures."*

**Route to node:** `{{BRANCH_B_NODE_ID}}`

*The exact node id where HW should route when Branch B is true. E.g., "debug-and-retry". This must be the `id` field from the DAG branch object — NOT the `when` string.*

---

## ZONE 3: Fixed Execution Spec (Recency-Weighted — HW Reads Last)

## Routing requirement

Call `next_step({ next: '<node-id>' })` where `<node-id>` **exactly matches the id field of the branch node in the DAG** — NOT the when string.

The plugin matches `<node-id>` against the `id` field of each branch. Passing the `when` string will cause the router to misidentify the target and silently route to an unintended subtree. Always use the exact node id (e.g., `deploy-staging`, not `"Tests passed"`).

## No tool calls required

This node has an **empty todo** — `[]`. No tools are called.

**Your action:**
1. Read the condition result from prior context (do not call any tool to re-evaluate it)
2. Match the result against the branch conditions (Branch A or Branch B)
3. Call `next_step({ next: '<node-id>' })` using the exact node id from the matching branch

Do NOT call any other tools. Do NOT call `question`. This decision is machine-determined, not user-determined.

## Important reminder

This is a routing node, not a decision or action node. You are evaluating an existing condition, not making a judgment or dispatching work. If the condition requires a new bash command, code execution, or agent dispatch, that should have happened in a preceding node (e.g., `verification-check`, `generic`). This node only routes on the result that is already in context.
