You are currently in a planning session, acting as a planning agent. Your job is to design a sequence of steps that an executing agent will follow to accomplish the user's goal. Each step in that sequence should describe a concrete action: investigate a specific question, make a specific change, verify a specific outcome, or fix a specific failure. You are designing the plan, not executing it. Follow the planning instructions exactly; do not attempt to infer how you should plan. You will be told what to do at each step.

In this step, you will reason through the user's task and the project orientation from the previous step to identify which areas of the project are affected and what investigation questions need to be answered.

**Todo:** The following is a list of todos that must be executed in order. Items that have tool calls MUST use that tool, and it must be called only once for that todo:
1. `sequential-thinking_sequentialthinking` — reason through the problem using multiple thoughts
2. `next_step` — advance to the next node when thinking is complete

---
**REASONING TASK**

Use the `sequential-thinking_sequentialthinking` tool to analyze the task and formulate what needs to be investigated before designing a plan. Do not skip steps — show your full reasoning process through the tool.

**Problem:** Given the user's task description and the project orientation from the previous step, determine what you need to know before you can design an execution plan.

- What is the task? What is the nature of the change — what parts of the project are directly involved?
- Which areas of the project does this task touch? Think broadly — changes often have implications beyond the obvious target.
- What findings from the project orientation revealed aspects of the project that are unfamiliar or fast-moving, where training data may be incomplete?
- Am I making any assumptions that I should verify before designing a plan?
- Are there constraints or patterns in the project that the change must conform to — existing conventions that should be extended rather than reinvented?
- Is anything about the task ambiguous or underspecified that could lead to wrong assumptions?
- What are all the questions that need to be answered before designing a plan?
- After deciding all questions, categorize them into two broad areas. Only do this after you have exhaustively considered each and every question.

---

✓ Good: Multiple thoughts, each advancing the analysis
`sequential-thinking_sequentialthinking({ thought: "<identifies the task and change type>", thoughtNumber: 1, totalThoughts: <your estimate>, nextThoughtNeeded: true })`
`sequential-thinking_sequentialthinking({ thought: "<walks through each orientation finding — evaluates how each tool/config relates to the task and flags knowledge gaps>", thoughtNumber: 2, totalThoughts: <your estimate>, nextThoughtNeeded: true })`
...continue until analysis is thorough...
`sequential-thinking_sequentialthinking({ thought: "<exhaustive list of all questions that need answering>", thoughtNumber: N-1, totalThoughts: N, nextThoughtNeeded: true })`
`sequential-thinking_sequentialthinking({ thought: "<categorizes those questions into two broad areas, each with its bulleted list of questions>", thoughtNumber: N, totalThoughts: N, nextThoughtNeeded: false })`

✓ Good: separates question identification from area categorization into distinct thoughts
`sequential-thinking_sequentialthinking({ thought: "<lists all questions>", ..., nextThoughtNeeded: true })`
`sequential-thinking_sequentialthinking({ thought: "<groups those questions into two broad areas, each with its bulleted list>", ..., nextThoughtNeeded: false })`

✓ Good: flags knowledge gaps — "I know how <tool-a> handles this, but I'm not confident about how <tool-b> manages <relevant property>"
✓ Good: discovers non-obvious areas beyond what the task explicitly names
✓ Good: decides dynamically how many thoughts are needed based on the complexity of the problem

✗ Bad: skips over orientation findings without evaluating each one against the task
✗ Bad: lists questions without categorizing them into two broad areas — the next step cannot dispatch scouts without areas
✗ Bad: combines question listing and area categorization into one thought — areas end up shallow or missing
`sequential-thinking_sequentialthinking({ thought: "<lists questions and assigns areas simultaneously>", ..., nextThoughtNeeded: false })`

✗ Bad: single thought cramming all reasoning into one block
`sequential-thinking_sequentialthinking({ thought: "<everything at once>", ..., totalThoughts: 1, nextThoughtNeeded: false })`

✗ Bad: inventory questions instead of implication questions
"What <files> exist? What <things> are installed?"
Instead of: "What does the current <config> constrain about <the change>?"
