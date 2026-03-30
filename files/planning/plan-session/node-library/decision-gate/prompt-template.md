# Decision Gate

Present the following choice to the user using the `question` tool. Their answer determines which branch is followed.

## Decision

{{DECISION_DESCRIPTION}}

## Options

The option labels below must exactly match the `when` conditions in this node's `next` array in `plan.json`. The plugin matches the user's selected label against those conditions to pick the branch.

{{OPTION_1_LABEL}} — {{OPTION_1_DESCRIPTION}}
{{OPTION_2_LABEL}} — {{OPTION_2_DESCRIPTION}}

> **Extensibility:** Add `{{OPTION_3_LABEL}} — {{OPTION_3_DESCRIPTION}}` etc. for each additional branch; each must have a matching `when` entry in plan.json.

Example `plan.json` branch structure for this node:
```json
"next": [
  { "when": "Refactor first", "node": { "id": "refactor-auth", "prompt": "prompts/refactor-auth.md", "todo": ["task", "task"] } },
  { "when": "Add feature first", "node": { "id": "add-refresh", "prompt": "prompts/add-refresh.md", "todo": ["task"] } }
]
```

## Todo

1. `question` — Ask the user: {{DECISION_DESCRIPTION}}. Offer options: {{OPTION_1_LABEL}}, {{OPTION_2_LABEL}}. (Add more options if needed — ensure each label has a matching `when` entry in plan.json.)

You MUST call the `question` tool — do not present the choice as plain text.

## After the question is answered

The plugin branches automatically based on the user's selected option. No additional action needed — `next_step()` is called by the plugin.
