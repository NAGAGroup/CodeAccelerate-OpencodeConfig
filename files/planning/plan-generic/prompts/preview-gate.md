# Preview Gate: Validate DAG Structure

Your task is to **display the planned DAG structure to the user for approval** before writing any prompt files.

## What to Show

Present the planned DAG structure:
1. **ASCII Diagram** — Simplified visual representation of the DAG flow
   - Example:
     ```
     session-overview → overview
                     ↓
                     scout
                     ↓
                     clarify
                     ↓
              {evaluate-understanding}
                ↙        ↘
              scout    propose-shape
                     ...
                     ↓
              {planning-gate}
            ↙ ↓ ↓ ↘
          design-plan / clarify / propose-shape / propose-decomposition
                     ↓
              preview-gate (you are here)
                     ↓
              write-prompts
                     ↓
                  finalize (terminal)
     ```

2. **Node Summary**
   - Total node count
   - Agent nodes: {count}
   - Gate nodes: {count}
   - Entry node: {node-id}
   - Terminal node: {node-id}

3. **Branching Logic**
   - List all decision/gate nodes and their branch options
   - Example:
     - `evaluate-understanding`: branches to scout | propose-shape
     - `planning-gate`: branches to design-plan | clarify | propose-shape | propose-decomposition

4. **Remaining Visits** (if applicable)
   - Any loop nodes and their max iterations

## User Approval

Present options:
1. **Approve & Continue** — DAG structure is solid; proceed to write prompts
2. **Reconsider** — DAG structure needs adjustment; loop back to design-plan

## Output

If **approved:** Call `next_step({ next: "write-prompts" })`

If **reconsider:** Call `next_step({ next: "design-plan" })`
