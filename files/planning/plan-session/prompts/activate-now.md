# activate-now

Call `activate_plan` with the plan name from write-dag context.

**Todo:** `["activate_plan"]`

> (1) Call `activate_plan({ plan_name: "<plan-name>" })` — use the plan name established during write-dag (the directory name under `.opencode/session-plans/`). ✓ Plan name is in your active context from the write-dag node. ✗ Do not invent a plan name.
> (2) If the plan name is not in context, call `recover_context` to retrieve it before calling `activate_plan`.
> (3) If `activate_plan` returns an error, report the error to the user and suggest running `/activate-plan {plan-name}` manually as a fallback.
> (4) Do NOT call `next_step()` — the planning session auto-completes once `activate_plan` returns.
