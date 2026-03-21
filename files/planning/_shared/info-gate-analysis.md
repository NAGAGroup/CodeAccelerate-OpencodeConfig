# Info: Gate Analysis — {{DAG_TYPE}}

Identify areas where user gates could be inserted. Present options to the user.

## Gate Nodes

A gate node (`type: "gate"`) pauses execution and waits for explicit user approval. Gates are appropriate when:

- The user should review and approve before irreversible actions
- Decision branches have significant consequences
- The plan needs user steering at key points

## Gate Anti-Patterns

- Gates that appear after every minor step (creates friction)
- Gates that ask the same question as a prior loop
- Gates for purely informational decisions

## For {{DAG_TYPE}} Sessions

**Standard gates:**
- `review-gate`: Present the final plan for approval before writing files

**Optional gates (ask user):**
- After decomposition, if scope is unclear
- After agent-routing, if delegation is complex

**No gates:**
- Informational nodes (this phase)
- Research accumulation nodes (too granular)

## Your Task

1. Identify candidate gate positions
2. For each candidate, ask: "Should this be a gate? (yes/no/skip)"
3. Present a table of recommendations

## Constraints

- Collaborative/creative sessions typically skip extra gates — the exploratory nature is the point
- Generic and debug sessions benefit from gates at key decision points

## If User Wants Full Auto

Accept their choice. Some users prefer autonomous planning with only the final gate.

## Advance

Call `next_step()` to proceed to flow-specific information.
