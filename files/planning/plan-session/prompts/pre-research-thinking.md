# Pre-Research Thinking

HeadWrench uses sequential-thinking to reason across three dimensions before reaching the research gate, producing a structured 3-line output block that the research-gate node consumes.

## Goal

HeadWrench uses sequential-thinking to reason across three dimensions before reaching the research gate, producing a structured 3-line output block that the research-gate node consumes.

## Todo

1. `sequential-thinking_sequentialthinking` — Reason through all 8 questions below. Do NOT wait for user input between thoughts. Call next_step() after the final thought to advance to the research gate.

**Tool note:** `sequential-thinking_sequentialthinking` is exempt from DAG blocking — call it directly.

## What to Reason Through

Work through these eight questions in sequence:

1. **What is the task?** Summarize the session goal in one sentence.

2. **Does the codebase provide sufficient context for planning?** Are all key implementation decisions answerable from internal scouts alone, or are there gaps that require external knowledge to write a complete plan?

3. **Could model knowledge be stale for this task?** Is this a fast-moving domain? Are there recent library releases, API changes, or framework updates that may have occurred after the model's training cutoff? If yes, training data may be incorrect or incomplete.

4. **Planning research verdict:** Based on questions 1–3, determine the planning research level:
   - **NECESSARY** — external information is required to write a good plan; the approach cannot be determined without it.
   - **RECOMMENDED** — would help avoid execution-time scouting or prevent hallucination risk, but a plan could be written without it.
   - **NO** — the task is fully self-contained from codebase context and model knowledge.

5. **Would cursory planning research be insufficient at execution time?** Even if planning research helps establish direction, are there decisions that can only be resolved during implementation — such as exact API behavior, runtime configuration, environment-specific behavior, or version-specific edge cases?

6. **Is deep research implicitly required?** Does the task involve a direction uncertain enough that it requires multi-source synthesis, novel approaches, or academic sources — work that the DAG structure forbids during planning and must defer to execution-time research nodes?

7. **Execution research verdict:** Determine the execution research level:
   - **NECESSARY** — cursory planning search won't suffice for implementation, OR deep research is being deferred from planning to execution.
   - **RECOMMENDED** — would augment planning research with just-in-time lookup; useful but not required.
   - **NO** — deterministic edit or refactor with no external dependencies; planning research (if done) covered everything needed.

8. **Execution research type (if execution research is NECESSARY or RECOMMENDED):** Is the implementation question specific with a known answer to look up (→ `research-basic`), or is the direction itself uncertain and requires multi-source synthesis across many sources (→ `research-deep`)?

## Output Format

End your final thought with this exact 3-line block:

```
Planning research: [NECESSARY|RECOMMENDED|NO] — [one-sentence reason]
Execution research: [NECESSARY|RECOMMENDED|NO] — [one-sentence reason]
Execution research type: [research-basic|research-deep|N/A] — [one-sentence reason]
```

Use `N/A` for execution research type when execution research is NO.

After completing your final thought, call `next_step()` to advance to the research gate.
