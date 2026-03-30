# Activate Plan Now

The planning session is complete and the user has chosen to activate and begin executing the plan immediately.

> ⚠️ **MANDATORY — Call `activate_plan` immediately**

Call `activate_plan({ plan_name: "<name>" })` right now. Use the plan name that was written during this session (the directory name under `.opencode/session-plans/`). You should know this from context — it was established in the write-dag node earlier in this session. If the plan name is not in your immediate context, call `recover_context` before proceeding, or infer it from the most recently written session plan directory.

The tool will initialize the project DAG session and inject the first node's prompt, beginning execution.

After calling `activate_plan`, do NOT call `next_step` — the planning session will auto-complete once the tool returns.

If `activate_plan` returns an error, report the error to the user and suggest running `/activate-plan {name}` manually as an alternative.
