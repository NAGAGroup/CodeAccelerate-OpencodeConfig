# activate-now

## STOP — Do not work ahead

Your only job in this node is to call `activate_plan` with the plan name. Do NOT call `next_step()` — the planning session auto-completes once `activate_plan` returns. Do NOT ask the user anything.

## Todo

1. `activate_plan` — Call activate_plan with the plan name from write-dag context

---

Activate and begin executing the project DAG immediately.

## Action

The user has chosen to activate the plan now. Call the `activate_plan` tool immediately with the plan name established during this session.

```
activate_plan({ plan_name: "<plan-name>" })
```

Use the plan name that was written in the write-dag node (the directory name under `.opencode/session-plans/`). You should have this from prior context in this session. If the plan name is not in your immediate context, call `recover_context` to retrieve it, or infer it from the most recently written session plan directory.

The `activate_plan` tool initializes the project DAG session, injects the first node's prompt, and begins execution.

**After `activate_plan` returns:** Do NOT call `next_step()` — the planning session auto-completes once the tool returns. The project DAG execution takes over from here.

If `activate_plan` returns an error, report the error to the user and suggest running `/activate-plan {plan-name}` manually as a fallback.
