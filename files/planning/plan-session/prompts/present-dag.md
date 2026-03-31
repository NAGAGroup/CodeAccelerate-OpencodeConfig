# Present DAG to User

## Your Role

Your job in this node: call `present_dag_to_user`, then call `next_step()` immediately.

## Todo

1. `present_dag_to_user` — Call `present_dag_to_user` with the current session plan name.

---

Display the current DAG diagram to the user.

## Action

Call the `present_dag_to_user` tool with the current session plan name established during this session. The plan name is the directory name under `.opencode/session-plans/` (the same name used in the write-dag node).

MUST call `next_step()` immediately after `present_dag_to_user` returns. Do NOT add commentary, summaries, or ask the user anything — the diagram speaks for itself.
