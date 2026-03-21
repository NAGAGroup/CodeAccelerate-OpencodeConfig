# Preview Gate: Validate Research DAG Structure

## Objective

Review and approve the **planned research DAG structure** before prompt files are written. This gates catches structural issues early.

---

## What to Display

Show the user:

### 1. ASCII DAG Diagram

A simplified visual of the planned DAG:

```
session-overview
  ↓
intake-and-scout
  ↓
angle-1-investigation ║ angle-2-investigation ║ angle-3-investigation
       ↓                      ↓                       ↓
   findings-1          findings-2              findings-3
       ↓                      ↓                       ↓
       └──────────── synthesis-gate ────────────┘
                              ↓
                    [reconsider?] ─→ [loop back to investigation]
                              ↓
                        finalize-findings
```

Keep ASCII diagrams concise; focus on branching and gating.

### 2. Node Count & Structure Summary

- **Total nodes:** X (entry + investigation + gates + finalize)
- **Branching points:** X (which gates allow "reconsider"?)
- **Loop nodes:** X (which nodes iterate?)
- **Max visits per loop:** X

Example:
```
Total nodes: 7
Branching gates: 2 (synthesis-gate, quality-gate)
Investigation parallelism: 3 angles (parallel)
Max loop iterations: 3 per investigation
```

### 3. Decision Criteria for Gates

For each gate, explain what triggers each branch:

```
Synthesis Gate Options:
  ✓ "Findings are integrated" → finalize
  ↻ "Need to revisit one angle" → return to investigation-loop
```

### 4. Remaining Visits (for Loops)

If any loops exist, confirm the iteration strategy:

```
Each angle investigation can loop (refine evidence) up to 3 times.
After 3 refinements, forced advancement to synthesis.
```

## Validation Questions

Ask the user:

1. **"Does this DAG structure match your research plan?"**
2. **"Are the branching points and gates clear?"**
3. **"Are you comfortable with the max iterations per loop?"**
4. **"Do you see any missing steps or unnecessary nodes?"**

## User Options

- **✓ Approve & Write Prompts** → Advance to `write-prompts`
- **↻ Reconsider Structure** → Return to `design-plan` for refinement

## Next Step

If approved, advance to `write-prompts` to write all prompt files.

If reconsideration needed, return to `design-plan` with feedback (e.g., "Add a quality review gate before finalize" or "Separate exploratory phase from synthesis").

---

**Note:** This gate ensures the DAG is sound before investing in prompt file creation. Structural changes are easier at this stage.

Ref: planning-audit-spec.md § Improvement 3 (Preview Gate Before Approval)
