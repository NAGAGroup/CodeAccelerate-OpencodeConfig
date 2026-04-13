**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
{{DESCRIPTION}}
</goal>

<rules>
Always provide the plan name {{PLAN_NAME}} in your prompt to the subagent.
Never ask tailwrench to make edits to source code or documentation. The tailwrench subagent can only edit config files and build system config files.
Always skip this step if only file edits are needed. To skip, dispatch tailwrench with instructions to immediately return.
</rules>

<instructions>
1. Compose a dispatch prompt for the required shell operations.
2. Dispatch tailwrench using the task tool.
3. Call next_step.
</instructions>
