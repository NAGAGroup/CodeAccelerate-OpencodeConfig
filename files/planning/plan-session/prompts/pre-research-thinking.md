# Pre-Research Thinking

Before the research gate asks the user, reason through whether planning-time external research would materially improve the plan for this specific task.

## Goal

Form a clear YES or NO recommendation: would external research (documentation, APIs, specs, frameworks) materially improve the plan? This recommendation will inform the research gate questions.

## Todo

1. `sequential-thinking_sequentialthinking` — Reason through the five questions below, one thought per item. State your final YES/NO recommendation in the last thought.

**Tool note:** `sequential-thinking_sequentialthinking` is exempt from DAG blocking — call it directly. Do NOT wait for user input between thoughts — continue calling until the final recommendation is complete.

## What to Reason Through

Work through these five questions in sequence:

1. **What is the task?** Summarize it in one sentence. What is the user trying to accomplish?

2. **Does the codebase provide sufficient context?** Based on scout findings: are all implementation decisions answerable from the code alone? Or are there gaps where the codebase doesn't tell you which approach, library, or pattern to use?

3. **Could model knowledge be stale?** Is this in a fast-moving domain — recent library releases, new framework features, updated APIs, recent ecosystem shifts? If yes, training data may be out of date and external sources prevent hallucination.

4. **Would external research prevent hallucination?** Are there unfamiliar APIs, patterns, or third-party systems where consulting documentation would reduce guessing? Even for internal tasks, if implementation requires external APIs or libraries the codebase barely touches, research prevents errors.

5. **Recommendation:** Based on thoughts 1–4, state a clear YES or NO: would dispatching ExternalScout during planning materially improve the plan — either by filling a knowledge gap, preventing hallucination, or providing context the codebase lacks? Write one sentence reasoning.

## Output Format

End your final thought with a single line in this format:

```
Research recommendation: YES — [one-sentence reason]
```

or

```
Research recommendation: NO — [one-sentence reason]
```

This recommendation carries into the research gate, where it will tag the matching Q1 option with "(HW recommends)".

After completing your final thought, call `next_step()` to advance to the research gate.
