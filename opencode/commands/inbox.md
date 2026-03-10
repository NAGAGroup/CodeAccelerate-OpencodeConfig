---
description: "Review agent-generated pattern and convention suggestions accumulated in .opencode/inbox/."
agent: headwrench
---

Read all files in `.opencode/inbox/`. Present each suggestion to the user with:
- The suggestion content
- Which session/subtask generated it
- Options: **promote to project context**, **promote to global context**, **discard**

For each item the user wants to promote, use `/context-add` to move it to the appropriate location.

After processing all items, report how many were promoted vs discarded, and confirm the inbox is clear.
