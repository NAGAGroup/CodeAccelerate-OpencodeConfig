# Pre-Research Thinking

Before the research gate asks the user, reason through whether planning-time external research would materially improve the plan for this specific task.

**Call `sequential-thinking_sequentialthinking` and work through the five thoughts below — keep calling the tool until all five are addressed. Do NOT wait for user input between thoughts.**

## Todo

> **Tool note:** `sequential-thinking_sequentialthinking` is exempt from DAG blocking — call it directly.

1. `sequential-thinking_sequentialthinking` — Reason through the following five questions, one thought per item. State your final YES/NO recommendation in the last thought.

## What to reason through

Work through these five questions in sequence:

1. **What is the task?** Name it in one sentence. What is the user trying to accomplish?

2. **Does the codebase provide sufficient context?** Based on what the scouts found: are all implementation decisions answerable from the code alone? Or are there gaps where the codebase doesn't tell you which approach, library, or pattern to use?

3. **Could model knowledge be stale?** Is this task in a fast-moving domain — recent library releases, new framework features, updated APIs, recent ecosystem shifts? If yes, model training data may be out of date and external sources would help prevent hallucination.

4. **Would external research prevent hallucination?** Are there unfamiliar APIs, patterns, or third-party systems involved where consulting documentation would reduce guessing? Even for tasks that seem internal, if implementation requires calling an external API or using a library the codebase barely touches, research prevents errors.

5. **Recommendation:** Based on thoughts 1–4, state a clear YES or NO: would dispatching ExternalScout during planning materially improve the plan — either by filling a knowledge gap, preventing a hallucination risk, or providing context the codebase doesn't supply? Write one sentence explaining the reasoning.

## Output

End your final thought with a single line in this format:

```
Research recommendation: YES — [one-sentence reason]
```

or

```
Research recommendation: NO — [one-sentence reason]
```

This recommendation carries forward into the research gate, where it will inform the "(HW recommends)" label on Q1.

After completing your final thought, call `next_step()` to advance to the research gate.
