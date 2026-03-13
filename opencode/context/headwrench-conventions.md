---
scope: global
tags: [headwrench, conventions, gates, session-plan]
last_reviewed: 2026-03-13
source_session: todolist-enforcement (2026-03-10)
---

# HeadWrench Conventions

Accumulated conventions and patterns for the HeadWrench orchestration system.

---

## Gates: Embedded in Subtask Todolists, Not Standalone Rows

**Source:** `todolist-enforcement` session (2026-03-10)

Gates should be defined as `[🚫 GATE]` todo items inside the **preceding subtask's `## Todolist`** section (Layer 2), **not** as standalone subtask rows in `index.md` subtask tables.

**Why:** Standalone gate rows were redundant with Layer 3 step 7 (Gate check). Embedding the gate as a Layer 2 todo in the preceding subtask keeps all work for a phase together and avoids an awkward "nothing to execute" phantom subtask.

**Pattern:**
- In `index.md`: no standalone `G1`, `G2`, etc. rows
- In subtask files: add a `### Gate` section at the end of `## Todolist` with the `[🚫 GATE]` item and its approval condition
- `headwrench.md ## Gates` section describes and enforces this convention
