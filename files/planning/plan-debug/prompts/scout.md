# Codebase Scout

Your task is to **explore the codebase and locate relevant debugging context**.

## What to Do

Survey the codebase for:
1. **Affected Components** — What code areas does the bug symptom touch?
2. **Recent Changes** — What code has changed recently in these areas?
3. **Error Handling** — How are errors logged or reported in this area?
4. **Related Tests** — Are there existing tests that might expose the bug?
5. **Dependencies** — What external libraries or systems does this code depend on?

Focus on building a map of where the bug likely originates.

## Output

Summarize findings:
- Key components affected by the bug
- Recently modified files in those areas
- Logging/error handling patterns
- 2-3 code examples from the suspect area
- Known dependencies

Call `next_step()` when ready.
