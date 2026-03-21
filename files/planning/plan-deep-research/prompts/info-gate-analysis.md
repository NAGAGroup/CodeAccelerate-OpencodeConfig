# INFO: Research Angle Gates

Gates in research DAGs are **discovery decision points** where research directions are confirmed or changed.

## When Gates Appear in Research DAGs

- **Between research angles** — Which angle to explore next based on preliminary findings
- **After evidence gathering** — Decide if findings are sufficient or if more angles need investigation
- **At synthesis points** — Choose how to integrate findings from multiple angles
- **Iterative discovery** — Gate deciding: is research conclusive or do findings suggest new directions?

## Gate Mechanics

An angle gate node has:
- Type: `"gate"`
- Multiple `next` options with descriptions like "investigate-angle-A" vs "investigate-angle-B" vs "sufficient-evidence"
- Prompt explaining what preliminary findings suggest

Example:
```json
"evidence-evaluation-gate": {
  "type": "gate",
  "prompt": "planning/prompts/evidence-evaluation.md",
  "next": {
    "angle-A": { "desc": "Evidence points to angle-A; investigate further", "choose_when": "..." },
    "angle-B": { "desc": "Evidence suggests angle-B is more productive", "choose_when": "..." }
  }
}
```

## Your Task

Review your research shape. **Identify where angle gates should go:**
- Between which research steps should decisions be made about which angles to pursue?
- How do preliminary findings redirect investigation?

Call `next_step()` to continue.
