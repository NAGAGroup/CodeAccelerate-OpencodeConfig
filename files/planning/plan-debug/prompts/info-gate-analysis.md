# INFO: Hypothesis Gates

Gates in debug DAGs are **investigation decision points** where evidence-based choices are made.

## When Gates Appear in Debug DAGs

- **After evidence gathering** — Evaluate the evidence and decide which hypothesis is most likely
- **Between diagnosis steps** — Choose which hypothesis to test next
- **At loop boundaries** — Decide whether to continue testing or move to the next hypothesis
- **Complex investigations** — Multiple gates at different decision points

## Gate Mechanics

A hypothesis gate node has:
- Type: `"gate"`
- Multiple `next` options with descriptions like "hypothesis-A (evidence suggests...)" vs "hypothesis-B (evidence suggests...)"
- Prompt explaining what evidence was gathered and which path to take

Example:
```json
"evaluate-root-cause": {
  "type": "gate",
  "prompt": "planning/prompts/evaluate-root-cause.md",
  "next": {
    "memory-leak": { "desc": "Memory leak detected; proceed to profiling", "choose_when": "..." },
    "database-slow": { "desc": "Database query slow; proceed to optimization", "choose_when": "..." }
  }
}
```

## Your Task

Review your investigation shape. **Identify where hypothesis gates should go:**
- After evidence gathering, which hypotheses might be in play?
- How does the investigator decide which to pursue next?

Call `next_step()` to continue.
