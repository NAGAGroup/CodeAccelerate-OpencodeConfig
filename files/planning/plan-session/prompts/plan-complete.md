# plan-complete

Planning session complete. The project DAG has been written, validated, and is ready for manual activation.

---

## Summary

The project plan has been written and validated. The DAG files are located at:

```
.opencode/session-plans/{plan-name}/
├── plan.json           (the executable DAG)
└── prompts/            (node prompts)
```

**Plan name:** {plan-name}
**Location:** `.opencode/session-plans/{plan-name}/`
**Structure:** [restate node count and phases, e.g., "8 nodes across 3 phases"]

---

## Activation

Activate the plan whenever you are ready:

```
/activate-plan {plan-name}
```

Replace `{plan-name}` with the actual directory name. If you have multiple plans in `.opencode/session-plans/`, specify the name explicitly so HeadWrench activates the correct one. Once activated, execution of the project DAG will begin automatically.
