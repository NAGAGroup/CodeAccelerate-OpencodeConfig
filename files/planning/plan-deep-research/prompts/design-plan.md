# Design Plan: Research DAG Structure

## Objective

Draft the **plan.json structure** for the research project DAG. This step separates planning (DAG design) from artifact writing.

---

## What to Design

Based on all research decisions (question, angles, sources, shape), design:

1. **DAG Entry Point** — Session overview or direct entry
2. **Node Sequence** — In what order should research happen?
3. **Branching Logic** — Are there conditional paths? When?
4. **Loop Design** — Do any investigation cycles need iteration? How many?
5. **Gate Criteria** — What questions trigger refinement vs. advancement?
6. **Terminal Node** — How do we finalize and synthesize findings?

## Design Steps

### 1. Map Research Workflow

From your research shape (4A, 4B, 4C, or 4D):

- **4A (Linear):** Single sequence: explore → synthesize → finalize
- **4B (Parallel):** Multi-branch: angle-1 || angle-2 || angle-3 → consolidate → finalize
- **4C (Loop):** Iterative: propose → test → refine → [loop or advance]
- **4D (Complex):** Mix of branches + loops; gates decide advancement

### 2. Define Nodes

For each major research step, plan a node:

- **Name** (e.g., `investigate-angle-1`, `synthesize-findings`)
- **Type** (agent, gate, loop)
- **Branching** (next is direct, or next branches/loops)
- **Prompt file** (e.g., `investigate-angle-1.md`)

### 3. Identify Gates

Where do refinement decisions happen? (Gates allow "reconsider" branches)

Example gates:
- **Preliminary findings gate** — "Do we have enough evidence to advance, or loop for more investigation?"
- **Synthesis gate** — "Is our integrated understanding sound, or do we need to revisit angles?"

### 4. Plan Remaining Visits (for Loops)

For loop nodes, specify `remaining_visits` (how many iterations before forced advancement).

Example: Iterative research with max 3 refine cycles → `remaining_visits: 3`

## Output

Provide a **draft plan.json** structure showing:

```json
{
  "id": "research-project-[name]",
  "entry": "session-overview",
  "nodes": {
    "session-overview": { ... },
    "angle-1-investigation": { ... },
    "angle-2-investigation": { ... },
    "synthesis-gate": { ... },
    "finalize": { ... }
  }
}
```

**Annotations:**
- Document branching logic: "angles investigate in parallel, then converge"
- Document looping: "Each investigation can refine up to 3 times"
- Document gates: "Synthesis gate checks if findings are integrated; if not, loop back"

## Next Step

This design moves to **preview-gate** where the user confirms the structure before prompts are written.

---

**Note:** Sequential-thinking may help reason through complex shapes and interdependencies. Focus on clarity and correctness; prompts are written in the next step.

Ref: planning-audit-spec.md § Improvement 4 (Finalize Split)
