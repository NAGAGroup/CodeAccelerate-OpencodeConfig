**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Execute the following pre-work setup operations:

{{DESCRIPTION}}
</goal>

<rules>
Always provide the plan name {{PLAN_NAME}} in your prompt to the subagent.
Never ask tailwrench to make edits to source code or documentation. The tailwrench subagent can only edit config files and build system config files.
</rules>

<instructions>
1. Compose a structured dispatch prompt based on the goal above and your delegation guidelines.
2. Dispatch tailwrench using the task tool.
3. Call next_step.
</instructions>
