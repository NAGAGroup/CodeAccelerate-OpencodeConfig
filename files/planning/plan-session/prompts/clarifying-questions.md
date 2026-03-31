# Clarifying Questions

Before presenting the full plan for approval, take a moment to surface any clarifying questions you have for the user — and to share your current understanding of the problem.

## STOP — Do not work ahead

Your only jobs in this node are: (1) write a brief understanding summary, (2) ask clarifying questions, (3) optionally run sequential thinking if answers change the plan, (4) call `next_step()`. Do NOT design the full plan, write DAG nodes, or perform any implementation work here.

**Note:** Both the `question` tool and `sequential-thinking_sequentialthinking` are exempt from DAG blocking in this node. You may call `question` as many times as needed. You may also call `sequential-thinking_sequentialthinking` once if user answers introduce new information that materially affects the plan.

## Todo

### 1. Summarize your understanding

Before asking any questions, write a brief summary (2–4 short paragraphs) covering:
- What the user is asking for — the goal and problem being solved
- The planning design space as you currently see it: key decisions you've made, tradeoffs considered, approach chosen
- Any constraints or assumptions you're working with

This is NOT a full plan presentation — it is your current understanding as context so the user can see if you're on the right track before you ask questions.

### 2. Ask clarifying questions

Call the `question` tool for each question you have. You may call it multiple times — it is exempt from DAG blocking. Stop when you have no more genuine questions.

**If you have no clarifying questions:** Still call `question` at least once. Ask something like: "Does my understanding of the task and approach look correct?" with options "Yes, proceed" and "Needs adjustment" (and let the user type a custom answer if needed).

### 3. Reflect on the answers

After the user answers your questions: if any answers introduce new information that materially affects your plan design, run a sequential-thinking pass now to update your thinking. Sequential-thinking is also exempt from DAG blocking — call `sequential-thinking_sequentialthinking` directly if needed. This step is optional — only do it if the answers genuinely change something.

To trigger: call the `sequential-thinking_sequentialthinking` tool directly — it is exempt from DAG blocking in this node and can be called without a matching todo item. Limit to one sequential-thinking pass; do not loop.

### 4. Advance

MUST call `next_step()` when done with questions and any follow-up reasoning. Do NOT present the plan here — that happens at the propose-plan node.
