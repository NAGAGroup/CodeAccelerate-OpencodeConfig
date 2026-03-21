# Node: confirm-mode — /plan-debug

Your role in this node is to ask the user how they want the debugging execution loop to behave.

## Steps

1. Briefly restate the hypothesis from context (one sentence).

2. Use the `question` tool to ask:

   **"Should the debugging execution loop pause for your confirmation on each hypothesis before attempting a fix?"**

   - **Yes** — the execution session will include a `hypothesis-gate` node in the loop. You will review the diagnosis and approve before each fix attempt.
   - **No** — the loop runs automatically (`diagnose → fix → verify`). The `remaining_visits` counter acts as the only safety net.

3. Record the user's answer in context.

## Advance

Call `next_step()`.
