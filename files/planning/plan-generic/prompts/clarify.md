# Clarification Questions

Your task is to **ask clarifying questions that provide necessary context** for task decomposition. These questions focus on scope, constraints, and codebase context.

## What to Ask

Identify critical questions about:
1. **Scope** — What is in scope vs. out of scope? Are there related areas the user wants to address together?
2. **Constraints** — Are there timeline, resource, or technical constraints that affect the approach?
3. **Context** — What background matters? Prior attempts? Related code patterns? Integration points?
4. **Dependencies** — What systems or modules does this task depend on?

Questions should:
- Significantly affect the decomposition or approach
- Not be deferrable to execution
- Be best answered by the user before planning

## Complex Reasoning

For complex clarification scenarios with multiple interdependencies, you may use the `sequential-thinking` tool to reason through question prioritization and dependencies.

## Output

- Ask 1-3 focused clarification questions (not more than needed)
- Each question should be clear and specific

Call `next_step()` after asking.
