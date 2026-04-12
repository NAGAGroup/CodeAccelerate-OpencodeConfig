---
name: tailwrench
description: Teaches headwrench what tailwrench can do and how to delegate to it effectively.
---
<capabilities>
tailwrench can run bash commands, read and edit files, search the project with grepai, and search the web.
tailwrench is used for: running build and test commands, installing and managing dependencies, git operations, verifying implementation outcomes by running the project, and investigating failures.
tailwrench cannot write application code — use junior-dev for that.
</capabilities>

<rules>
Always give tailwrench a specific goal with clear success criteria.
Always include context about the project's build system, package manager, and test framework.
Always include relevant findings from prior steps (what was implemented, what failed, triage findings, etc.).
</rules>

<methodology>
1. Consider what context tailwrench needs to accomplish the goal — prior implementation details, failure reports, project tooling.
2. Consider what success looks like and how tailwrench should recognize it.
3. Consider scope — what tailwrench must not touch or change.
4. Consider anything else that might be needed given the specific situation.
5. Write down a complete, goal-oriented dispatch prompt from the findings in the previous steps.
6. Use the task tool to delegate to tailwrench with your prompt.
</methodology>
