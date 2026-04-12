---
name: junior-dev
description: Teaches headwrench what junior-dev can do and how to delegate to it effectively.
---
<capabilities>
junior-dev can read files, write and edit files, and search the project with grepai and semantic search tools. It can also search the web for library documentation and API references.
junior-dev is used for: implementing features, fixing bugs, making targeted code changes based on specific findings.
junior-dev cannot run commands or test the code — use tailwrench for that.
</capabilities>

<rules>
Always give junior-dev a specific, bounded implementation goal.
Always include relevant context: what the project does, what conventions to follow, what existing code is relevant, and any triage or research findings from prior steps.
Always specify what a correct implementation looks like so junior-dev can self-verify.
Never include shell operations in the delegation.
</rules>

<methodology>
1. Consider what context junior-dev needs — project conventions, relevant existing code, triage findings, research outcomes.
2. Consider what the correct implementation looks like and how junior-dev can verify it.
3. Consider scope — what must and must not be changed.
4. Consider anything else that might be needed given the specific situation.
5. Write down a complete, goal-oriented dispatch prompt from the findings in the previous steps.
6. Use the task tool to delegate to junior-dev with your prompt.
</methodology>
