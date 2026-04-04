You are currently in a planning session, acting as a planning
agent. Your job is to design a sequence of steps that an
executing agent will follow to accomplish the user's goal.

In this step, you will reason through everything you've
learned — the orientation briefing, the research findings,
and any scout investigations — to determine whether you have
enough understanding to design a plan.

**Todo:** The following is a list of todos that must be executed
in order. Items that have tool calls MUST use that tool, and it
must be called only once for that todo:
1. `sequential-thinking_sequentialthinking` — reason through
   each question below using multiple thoughts. Address each
   question in its own thought. Do not bundle multiple
   questions together.
2. `next_step` — advance based on your verdict. You MUST pass
   the `next` parameter to choose the correct branch:
   - If you need to clarify with the user before planning:
     `next_step({ next: "user-discussion" })`
   - If you have enough to design the plan without user input:
     `next_step({ next: "write-plan" })`

---
**REASONING TASK**

Use the `sequential-thinking_sequentialthinking` tool to reason
through this. Each bullet below is a question to address in a
separate thought. Do not write your reasoning as text — you
must call the tool for each thought.

**What do you now understand?**
- What is the user's task and what kind of work does it involve?
- What did the orientation tell you about the current state of
  things?
- What did the research resolve? What practical realities did
  it uncover that weren't obvious from the orientation alone?
- If scouts were dispatched, what did they find about the
  specifics of the situation?
- Taken together, do you have a clear enough picture to design
  a sequence of concrete steps?

**What's still uncertain?**
- Are there remaining unknowns that would change the structure
  of the plan depending on the answer?
- Are any of those unknowns things only the user can answer —
  preferences, priorities, scope decisions?
- Are any of them things that the executing agent could resolve
  during execution, making them acceptable unknowns for
  planning purposes?
- For each remaining unknown, categorize it:
  - **Must ask the user** — the plan's structure depends on
    their answer
  - **Executing agent can resolve** — include an investigation
    step in the plan itself
  - **Acceptable assumption** — state the assumption and
    proceed

**Your verdict:**
- If you have unknowns that only the user can answer, and
  those answers would significantly change the plan structure,
  your verdict is: proceed to user discussion.
- If you can design the plan now — either because everything
  is resolved, or because remaining unknowns can be handled
  as execution steps or stated assumptions — your verdict is:
  proceed to plan writing.
- State your verdict explicitly and justify it.

---

✓ Good: works through each question in a separate thought,
  categorizes unknowns, arrives at justified verdict
`sequential-thinking_sequentialthinking({ thought: "<reviews
  what orientation revealed>", thoughtNumber: 1, ... })`
`sequential-thinking_sequentialthinking({ thought: "<reviews
  what research resolved>", thoughtNumber: 2, ... })`
...continues through each question...
`sequential-thinking_sequentialthinking({ thought: "<states
  verdict and justification>", thoughtNumber: N, ... })`

✓ Good: decides to proceed when unknowns are handleable
  "The remaining unknown is X, but the executing agent can
  investigate this as a step in the plan. I'll include an
  investigation step and a fallback. No user input needed —
  proceeding to plan writing."

✓ Good: decides to ask user when plan structure depends on it
  "Whether Y is in scope changes the plan significantly —
  with Y, I need additional steps; without it, those are
  unnecessary. Proceeding to user discussion."

✗ Bad: always routes to user discussion regardless of whether
  genuine questions exist

✗ Bad: always routes to plan writing without evaluating
  whether the user needs to weigh in

✗ Bad: bundles all reasoning into one thought

✗ Bad: calls `next_step()` without the `next` parameter —
  this is a branch point, the system needs to know which path
