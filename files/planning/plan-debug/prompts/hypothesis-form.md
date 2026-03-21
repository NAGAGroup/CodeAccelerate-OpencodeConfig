# Node: hypothesis-form — /plan-debug

Your role in this node is to produce one best-guess hypothesis about the root cause of the bug.

## Steps

1. Using the context gathered so far, identify the single most likely root cause. Format it as:
   - **Statement** — One sentence: what is the suspected root cause?
   - **Evidence** — What in the codebase or context supports this hypothesis?
   - **Proposed test/fix approach** — What targeted check or change would confirm or resolve it?
   - **Confidence** — High / Medium / Low

2. Present the hypothesis to the user.

## Debug Session Loop Design

After forming the hypothesis, explicitly design the execution loop for the fix-verify cycle.

**For the canonical debug execution loop, identify:**
1. **Loop head** — The node that will repeat (typically the "fix" or "diagnose" node)
2. **Exit condition** — What verified passing means: specific test names, output patterns, or behavioral criteria
3. **Back-loop target** — Where execution goes on failure (typically back to the fix or diagnose node)
4. **`remaining_visits`** — Default is 3; ask the user if they want a different count

**If multiple loops exist** (e.g., a diagnose loop plus a fix loop), identify each one separately with its own head, exit condition, back-loop target, and remaining_visits.

**Reflect loop design in the hypothesis summary:**
- Include the loop head node name
- State the exit condition clearly
- Note the confirmed `remaining_visits` count

This ensures the loop design carries forward into the session execution and is visible to the user before agent-routing.

**Example loop design annotation:**
> **Execution Loop:** Head: `fix` → Exit: "all tests pass" → Back to: `diagnose` → `remaining_visits: 3`

## Constraints

- You MUST produce exactly one hypothesis — the single best-guess based on current evidence.
- Hypotheses must be grounded in evidence from the codebase — no speculation without backing.
- You MUST NOT propose fixes. Diagnose only — fixes belong in the fix node.
- Violating these constraints means this node has failed. Stop and re-read the objective.

## Advance

Call `next_step()` NOW. Do this exactly once. Do NOT read session files or DAG state to determine whether to advance. Do NOT take any other action before or after calling `next_step()`.
