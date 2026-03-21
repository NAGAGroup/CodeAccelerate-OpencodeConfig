# INFO: Gate Placement

Gates in your project DAG are **execution-time decision points**, not planning approvals.

## When Gates Appear in Generic DAGs

- **Shape 1C (Decision Gate):** After initial exploration, before branching into path A or B
- **Shape 1D (Branching):** Agent researches options and proposes one; user validates choice
- **Shape 1E (Loop with User Gate):** Inside the loop; user decides: continue iterating or move on
- **Shape 1F (Complex DAG):** Multiple gates at decision points

## Gate Mechanics

A gate node has:
- Type: `"gate"` (not `"agent"`)
- Multiple `next` options with descriptions and decision criteria
- Prompt explaining the decision to the user

Example:
```json
"auth-approach-gate": {
  "type": "gate",
  "prompt": "planning/prompts/auth-approach-gate.md",
  "next": {
    "jwt-path": { "desc": "Use JWT for stateless auth", "choose_when": "..." },
    "oauth-path": { "desc": "Use OAuth for third-party", "choose_when": "..." }
  }
}
```

## Your Task

Review your chosen shape. **If it includes gates (shapes 1C, 1D, 1E, 1F):**
- Identify where each gate goes
- What decision does it gate?
- What should the prompt explain to the user?

Call `next_step()` to continue.
