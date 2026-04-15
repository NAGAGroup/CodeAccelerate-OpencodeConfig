# Plan Creation Successful!

## What to do next

1. Before summarizing the planning session, what was created and why, call `qdrant_qdrant-store` using `collection_name={{PLAN_NAME}}` to store core planning decisions and reasoning. Make the calls count, this provides context to the executing agent!
2. Now, summarize the planning session to the user, what was created and why. Call `present_plan_diagram` with `plan_name={{PLAN_NAME}}` to give the user a visual understanding of plan flow.
3. Use the `question` tool to present two options: activate now or defer to later.
4. If the user wants to activate now, call `activate_plan` for `{{PLAN_NAME}}`. This will immediately enter the execution of the DAG you just created! Otherwise call `next_step`, which will exit the planning session and allow the user to proceed as they wish.
