# Decision Gate

Present the following choice to the user using the `question` tool. Their answer determines which branch is followed.

## Decision

{{DECISION_DESCRIPTION}}

*One sentence stating the decision the user is making. Frame as a question or choice. E.g., "Should we refactor the auth module before adding the new feature, or add the feature first?" Bad: "Decide what to do next."*

## Options

The option labels below must exactly match the `when` conditions in this node's `next` array in `plan.json`. The plugin matches the user's selected label against those conditions to pick the branch.

{{OPTION_1_LABEL}} — {{OPTION_1_DESCRIPTION}}
{{OPTION_2_LABEL}} — {{OPTION_2_DESCRIPTION}}

*Option labels must exactly match the `when` conditions in this node's `next` array in plan.json. The plugin matches on these exact strings — any mismatch silently breaks routing. Use short, unambiguous labels. E.g., "Refactor first" not "Option A: Refactor the auth module first (recommended)."*

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

> **Writing the question call:**
> (1) Frame the question as described in `{{DECISION_DESCRIPTION}}`;
> (2) list exactly the option labels defined above — do not paraphrase or abbreviate;
> (3) each label must be a verbatim copy of the corresponding `when` string in plan.json.

## After the question is answered

After the user selects an option, HeadWrench calls `next_step({ next: '<node-id>' })` where `<node-id>` is the id field of the chosen branch node in plan.json.

Do NOT call `next_step()` before the user answers — the `question` tool must complete first.
