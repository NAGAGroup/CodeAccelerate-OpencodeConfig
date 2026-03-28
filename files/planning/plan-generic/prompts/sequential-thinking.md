# Sequential Thinking — Synthesize Scout Findings

The scouts have reported. Before proposing structure to the user, use sequential thinking to consolidate what you learned and reason through the planning implications.

## Todo

1. `sequential-thinking_sequentialthinking` — Reason through the scout findings and arrive at a confident scope assessment. Use as many thought steps as needed.

## What to reason through

Work through these questions in order. Each builds on the previous:

1. **What did the scouts actually find?** Consolidate the key facts: what exists, what's missing, what's ambiguous. Discard noise.

2. **What is the real scope of the user's request?** Given what the codebase actually looks like, what does this task genuinely require? Is it bigger or smaller than it first appeared?

3. **What are the meaningful constraints?** Tech stack, dependencies, existing patterns, things that can't be changed. What do these rule out?

4. **Where are the risks?** What could go wrong? What parts of this task are uncertain, coupled, or likely to surface surprises?

5. **What does a sound structure look like?** Roughly: how many phases? What has to be sequential vs. what can run in parallel? Are there branch points where user decisions are needed?

6. **What am I confident about vs. still unsure of?** Be explicit. If something is genuinely unclear, note it — you'll surface it to the user in `propose-structure`.

## Output

End with a crisp internal summary:
- Scope in one sentence
- Top 2–3 constraints
- Rough shape of the work (phases/branches)
- Any open questions to surface to the user

This summary guides what you say in `propose-structure`. You do not present it to the user here — this is your internal reasoning step.
