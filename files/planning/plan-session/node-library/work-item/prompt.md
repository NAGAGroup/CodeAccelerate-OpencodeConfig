You are implementing a scoped goal that requires investigating the project before making changes.

Use the task tool to dispatch @context-scout to investigate the current state of the area that needs to change. Ask the scout to report on existing patterns, what will be affected by changes, and any pain points to watch for.

Use the skill tool to load the delegation skill matching the type of work the scout described. For code or configuration changes, load the juniordev-delegation skill. For documentation changes, load the documentation-expert-delegation skill.

Use the sequential-thinking_sequentialthinking tool to reason through what the scout found and what it means for the implementation approach. Consider what boundaries are important, what the implementation subagent needs to know, and whether your task brief will be clear enough to avoid back-and-forth.

Use the task tool to dispatch the implementation subagent with a complete goal: what to change, where, why, and what boundaries apply.

After the implementation subagent returns, use the next_step tool to advance to verification or the next step.

**Constraints:** Base your implementation goal entirely on what the scout reports, not on assumptions. Give the subagent enough context to work independently. Dispatch the implementation to the appropriate subagent.
