# Decision Gate

Present the following choice to the user using the `question` tool. Their answer determines which branch is followed.

## Decision

{{DECISION_DESCRIPTION}}

## Options

The option labels below must exactly match the `when` conditions in this node's `next` array in `plan.json`. The plugin matches the user's selected label against those conditions to pick the branch.

{{OPTION_1_LABEL}} — {{OPTION_1_DESCRIPTION}}
{{OPTION_2_LABEL}} — {{OPTION_2_DESCRIPTION}}

Example `plan.json` branch structure for this node:
```json
"next": [
  { "when": "{{OPTION_1_LABEL}}", "node": { "id": "...", "prompt": "...", "todo": [...] } },
  { "when": "{{OPTION_2_LABEL}}", "node": { "id": "...", "prompt": "...", "todo": [...] } }
]
```

## Todo

1. `question` — Ask the user: {{DECISION_DESCRIPTION}}. Offer options: {{OPTION_1_LABEL}}, {{OPTION_2_LABEL}}. (Add more options if needed — ensure each label has a matching `when` entry in plan.json.)

You MUST call the `question` tool — do not present the choice as plain text.
