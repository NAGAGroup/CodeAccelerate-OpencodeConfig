# Scout Node Library

Read the node library CATALOGUE.md directly into your context window. This is pure information gathering — exact node type names and todo arrays are needed for planning.

## Todo

1. `read` — Call `read` with `filePath: "{{SESSION_PATH}}/node-library/CATALOGUE.md"`. Read the file directly — do NOT list the directory first. One `read` call only.

## STOP — Do not act on what you just read

The CATALOGUE is context for later planning nodes — not a trigger to plan now. **Do not propose a plan, do not outline steps, do not present anything to the user.** Your only action after the `read` call is to call `next_step()` immediately.
