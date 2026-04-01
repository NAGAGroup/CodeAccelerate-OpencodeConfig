# Write DAG

Dispatch @HeadWrench to write plan.json and prompt files, then validate, then verify.

**Todo:** `["task", "validate_dag", "task"]`

> (1) Dispatch @HeadWrench: write `.opencode/session-plans/{name}/plan.json` and all prompt files
> (2) Subagent must read `node-library/CATALOGUE.md` and each node type's README + prompt-template
> (3) Subagent calls `init_dag` (entry node), then `add_node` for each subsequent node
> (4) Write prompts to `.opencode/session-plans/{name}/prompts/{node-id}.md` — filename must match node ID
> (5) Return: paths written, final `show_dag` output, confirmation that all prompt filenames exist
> (6) Output constraint: confirm all files written successfully

> (1) Call `validate_dag` with the plan name
> (2) Report validation result: pass or specific errors (JSON syntax, duplicate node IDs, missing prompts)
> (3) Do not proceed past this blockquote until validation passes
> (4) If errors occur, include them in return so the next subagent can fix them
> (5) Output constraint: validation result (pass/fail + errors if any)

> (1) Dispatch @HeadWrench: verify all prompt files exist, all node IDs are unique, all branches point to valid nodes
> (2) Check: terminal nodes have no `next` field; every node has matching prompt file
> (3) Fix any issues found in place (correct JSON, create missing prompts, fix branch routing)
> (4) Verify: no unresolved `{{PLACEHOLDER}}` text in any prompt file
> (5) Return: checklist status, issues found + fixed, confirmation "DAG is ready for activation"
> (6) Output constraint: PASS or FAIL with specific issues if failed

Call `next_step()` after all three todos complete.
