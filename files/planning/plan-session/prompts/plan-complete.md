# Planning Session Complete

The planning session is complete. The project DAG has been written and validated.

## What was accomplished

- The project plan was designed and written to `.opencode/session-plans/{task-name}/`
- The DAG was written and validation was run — review any reported warnings before activating.

## Next steps

Activate the plan whenever you are ready. Replace `{task-name}` in the command below with the actual plan name before presenting it to the user:

```
/activate-plan {task-name}
```

Or tell HeadWrench "activate the plan" and it will look up the most recently written plan — if multiple plans exist, specify the name: `/activate-plan {task-name}` where `{task-name}` is the directory name under `.opencode/session-plans/`.

Briefly restate the plan name, its location under `.opencode/session-plans/`, and top-level structure (e.g., '8 nodes across 3 phases') so the user has a quick reference.
