# Synthesize — Scout Findings Aggregation

Read all scout findings from the prior `scout` node and aggregate them into structured finding groups that organize fixes by scope or type.

## Group Findings

Analyze all scout discoveries and organize them into logical fix groups. Group by:
- **Fix scope** — files, modules, or layers that can be fixed together, OR
- **Finding type** — bugs, quality issues, architecture concerns, performance problems, security vulnerabilities, documentation gaps

Choose grouping strategy based on what produces actionable fix subtasks.

## Produce a Structured Summary

For each group, provide:
- **Group name** — descriptive label (e.g., "Auth Module Bugs", "API Layer Quality", "Database Performance")
- **Severity** — high / medium / low
- **Finding count** — number of distinct findings in this group
- **Description** — 1–2 sentences explaining what needs fixing

Then present a brief overview:
- Total groups identified
- Severity distribution
- Example: "Found 3 groups: Auth Module Bugs [high, 4 findings], Middleware Quality [medium, 2 findings], Config Documentation [low, 1 finding]"

## Constraints

- Do NOT execute any fixes — structure and summarize only
- Do NOT ask clarifying questions — surface open questions or ambiguities in the summary text, then advance immediately
- Groups must be concrete and independently fixable

## Advance

Call `next_step()` to proceed to `agent-routing`.
