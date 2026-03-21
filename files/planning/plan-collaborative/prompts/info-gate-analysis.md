# INFO: User Gates

Gates in collaborative DAGs are **user-facing decision points** where design direction is confirmed or redirected.

## When Gates Appear in Collaborative DAGs

- **After design proposals** — User approves, requests refinement, or redirects
- **Between turns** — User decides: continue to next phase or iterate on current phase
- **At decision points** — User chooses between design options (approach A vs B)
- **Iterative refinement** — User gate in a loop controlling feedback rounds

## Gate Mechanics

A user gate node has:
- Type: `"gate"`
- Multiple `next` options with clear user choices like "approved" vs "needs refinement" vs "redirect"
- Prompt explaining what the user is deciding

Example:
```json
"design-review-gate": {
  "type": "gate",
  "prompt": "planning/prompts/design-review.md",
  "next": {
    "approved": { "desc": "Design is ready; proceed to implementation", "choose_when": "..." },
    "refine": { "desc": "Design needs revision; return to proposal", "choose_when": "..." }
  }
}
```

## Your Task

Review your collaboration shape. **Identify where user gates should go:**
- After which design steps should the user review and decide?
- What are the possible outcomes at each gate?

Call `next_step()` to continue.
