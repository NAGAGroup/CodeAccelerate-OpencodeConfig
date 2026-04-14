**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
You are triaging the failure from the previous steps with the goal:

{{DESCRIPTION}}
</goal>

<rules>
Always surface specific, actionable findings — root cause, affected files or commands, and what the fix step needs to know.
Always provide the plan name {{PLAN_NAME}} in your prompt to the subagent.
</rules>

<instructions>
1. Compose a dispatch prompt for tailwrench with the following requirements:
   - State upfront that something is broken and the cause must be found and fixed at the project level — not confirmed, found and fixed.
   - Include the full error output and failed commands from the previous verification step.
   - Instruct tailwrench to re-run the failed commands first to reproduce the failure before doing anything else. Do not rely on visual code inspection — reproduction is mandatory.
   - Instruct tailwrench to treat any code or config already reviewed in prior steps as suspect. Prior review does not rule anything out.
   - Instruct tailwrench to apply any project-level fixes directly — missing dependencies, misconfigured environment, broken build config. These should be fixed now, not reported.
   - Ask for a clear summary of what was found, what was fixed, and what remains for the source code fix step.
2. Dispatch tailwrench using the task tool.
3. Call next_step.
</instructions>
