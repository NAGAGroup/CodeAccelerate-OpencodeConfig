# Preview Gate: Review Investigation DAG Structure

Your task is to **display the investigation DAG and allow the user to validate the structure** before prompt files are written.

## What You Do

Display the drafted plan.json in human-readable form:

1. **ASCII Diagram** — Show the investigation flow:
   ```
   session-overview → diagnose-step-1 → evaluate → [branch: path-A / path-B] → finalize
   ```
   Or if looping:
   ```
   session-overview → diagnose → evaluate ⟲ (refine) → next-step → finalize
   ```

2. **Node Summary**
   - Total node count
   - Branching points and their decision criteria
   - Looping points and iteration limits (`remaining_visits`)
   
3. **Investigation Strategy**
   - Branch decision: How many competing hypotheses will be tested?
   - Loop decision: Which steps are refined iteratively?
   - Sequence: Are tests sequential or parallel?

4. **Success Criteria** (Brief)
   - What evidence confirms the primary hypothesis?
   - How are alternative hypotheses ruled out?

## What to Ask

Prompt the user:
- "Does this DAG structure match your investigation strategy?"
- "Are branching points clear? (Testing hypotheses A, then B if A fails?)"
- "Are loops set up correctly? (Refined test-refine-test cycles?)"
- "Is the sequence sound for gathering evidence?"

## Output

Display:
- ASCII diagram of investigation DAG
- Node list with types and purposes
- Branching logic and decision criteria
- Looping details if applicable
- Hypothesis confirmation logic

Provide two options:
1. **Approve** → Proceed to write-prompts
2. **Reconsider** → Return to design-plan for refinement

Call `next_step()` after user choice.
