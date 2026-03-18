---
description: "Activate an existing session plan by selecting from available sessions."
agent: headwrench
---

Activate an existing session plan. If a session name was provided, it is: `$ARGUMENTS`

## Step 1 — List Available Sessions

Scan `.opencode/sessions/` for all directories. Each directory is a saved session plan.

For each session found, read its `spec.json` and extract:
- `status` — current state of the session
- `goal` — the goal or purpose of the session

## Step 2 — Present to User

Display all available sessions with their status and goal. Ask the user which session they want to activate.

## Step 3 — Call activate_session Tool

Once the user selects a session, call the `activate_session` tool with:

```
{ sessionName: "<chosen-session-name>" }
```

Do not attempt to write files or resolve session IDs yourself. The tool handles all that. Simply pass the chosen session name.

## Step 4 — Surface Response

Display the tool's response to the user, confirming which session is now active.
