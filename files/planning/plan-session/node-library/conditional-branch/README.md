# conditional-branch Node Type

## When to use

Use `conditional-branch` when the path forward is determined by a **machine-evaluable condition** whose result is already present in the current context. The branching decision must be objective and derivable without requiring HeadWrench to make a judgment call.

**Triggering conditions:**
- Exit code from a prior bash task (success vs. failure)
- File existence or absence (config file present, build artifact exists)
- Value extracted from prior agent output (version number, feature flag, count of errors)
- Semantic classification of prior output (success/failure pattern, compliance vs. non-compliance)

**Do NOT use when:**
- The decision requires human judgment (e.g., "which design pattern should we use?") → use `decision-gate`
- The condition result is buried many turns back in context (older than 2 nodes) → place a `compression-node` before this node to crystallize the condition for HW
- A user question already determined the path (e.g., user answered "yes" or "no" to a prior gate) → the prior `decision-gate` node's branch already routed you; do not add a second branching point
- The condition requires a new shell command or external lookup → put the bash task or agent dispatch in a preceding `verification-check` or `generic` node first, then use `conditional-branch` to route on its output

## What the planning agent must resolve

The planning agent must determine and document the following **before** writing the node's prompt:

1. **Condition to evaluate** — What specific value, file state, or output property is being checked? Be precise. Good: `"Exit code from build-and-test task (0 = success, non-zero = failure)"`. Bad: `"Whether the build worked."` (too vague).

2. **How HW will find the result** — Where in prior context (which preceding node, which output section, which field) will HW locate the condition's value? If the result came from >2 nodes ago, add a `compression-node` before this node. Good: `"In the prior 'run-tests' node's todo[1] task output, under '## Test Results' section, look for the 'Exit code:' field."` Bad: `"Somewhere in the session context."` (no location).

3. **Branch A interpretation and routing** — What does condition outcome A mean, and where should HW route? Good: `"If exit code is 0 (tests passed), route to node 'deploy-staging' for immediate staging deployment."` Bad: `"Go to the next step."` (target undefined).

4. **Branch B interpretation and routing** — What does condition outcome B mean, and where should HW route? Good: `"If exit code is non-zero (tests failed), route to node 'debug-and-retry' to investigate and re-run failing tests."` Bad: `"Handle the failure."` (no specific node).

5. **Routing constraint (verbatim — do NOT paraphrase):**
   > Call `next_step({ next: '<node-id>' })` where `<node-id>` exactly matches the id field of the branch node in plan.json — NOT the when string. Using the `when` string as the `next` argument will cause the router to misidentify the target branch and silently advance to an unintended subtree.

## Notes

### when-string vs. node-ID routing failure

**Mechanism:** In plan.json, each branch has two fields: `id` and `when`. The `id` is a unique node identifier (e.g., `"debug-and-retry"`). The `when` is a human-readable description (e.g., `"Tests failed"`). HeadWrench must call `next_step({ next: '<node-id>' })` — passing the `id`, not the `when` string. The planning-enforcement plugin does exact string matching on the `next` argument against child node ids. If HW passes the `when` string instead, the plugin cannot match it, and the node does not advance; if the `when` string happens to match a different node's id, the session silently routes to the wrong subtree.

**Fix:** In the prompt template's routing requirement section, repeat the constraint verbatim with a concrete example. In your must-resolve checklist for the planning agent, emphasize that both Branch A and Branch B descriptions must include the **exact node id** HW will use in `next_step()`. Provide the structure they must fill:
```
Branch A: When {{BRANCH_A_CONDITION}}, route to node id '{{BRANCH_A_NODE_ID}}'
Branch B: When {{BRANCH_B_CONDITION}}, route to node id '{{BRANCH_B_NODE_ID}}'
```

### Stale condition result — compression-node prevention

**Mechanism:** If the condition result came from a node 3+ steps back, it has likely been pushed out of HW's immediate context by subsequent outputs. HW may misread the result, invert it, or guess. The fix is to place a `compression-node` before the `conditional-branch` to crystallize the condition and bring it to the top of context.

**Fix:** When reviewing the planning agent's must-resolve checklist, if the condition source is more than 2 nodes old, require the planning agent to insert a `compression-node` before this node. The compression node should produce an output like: `"Condition: Tests passed (exit code 0). Route to: deploy-staging."` HW then reads this fresh compressed output instead of searching backward through stale context.

### Empty todo — no dispatch blockquote

**Mechanism:** This node type has an empty `todo` array. No tools are called. HW evaluates the condition directly from context and calls `next_step()`. Do not include a dispatch blockquote in the prompt — instead, include a reminder note at the end that no tool calls are required.

**Fix:** In the prompt template, do not embed a "Writing a dispatch prompt" blockquote. Instead, include a final `## Important` or `## Reminder` section that states: `"This node has an empty todo. Do not call any tools. Evaluate the condition from prior context and call next_step({ next: '<node-id>' }). No dispatch prompts or agent task calls are needed."` This prevents HW from attempting to dispatch a subagent.

---

## Example: Correct conditional-branch node in a plan

```json
{
  "id": "test-and-branch",
  "type": "conditional-branch",
  "nodeId": "test-and-branch",
  "prompt": "files/planning/plan-session/prompts/test-and-branch.md",
  "branches": [
    {
      "when": "Tests passed",
      "id": "deploy-staging",
      "nodeId": "deploy-staging"
    },
    {
      "when": "Tests failed",
      "id": "debug-and-retry",
      "nodeId": "debug-and-retry"
    }
  ]
}
```

In the prompt, the planning agent fills:
- `{{CONDITION}}` = "Exit code from 'run-tests' node"
- `{{CONDITION_SOURCE}}` = "Prior task output, 'Test Results' section, 'Exit code:' field"
- `{{BRANCH_A_CONDITION}}` = "Exit code 0"
- `{{BRANCH_A_NODE_ID}}` = "deploy-staging"
- `{{BRANCH_B_CONDITION}}` = "Exit code non-zero"
- `{{BRANCH_B_NODE_ID}}` = "debug-and-retry"

HW then evaluates: exit code is 0 → call `next_step({ next: "deploy-staging" })`.
