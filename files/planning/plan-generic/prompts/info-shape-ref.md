# INFO: Shape Reference

Review your chosen shape (1A-1F) against the definitions:

## Generic Shapes

**1A - Linear:** No loops, no gates. Clear sequence of steps.
```
overview → step1 → step2 → step3 → finalize
```

**1B - Linear with Loop:** Implementation iteration (build-test cycles).
```
overview → design → [loop: implement → test → verify] → document → finalize
```
Verify node branches: "pass" (exit) or "fail" (loop back).

**1C - Linear with Decision Gate:** Early uncertainty about direction.
```
overview → explore → gate(A or B?) → [path-A or path-B] → merge → finalize
```

**1D - Branching:** Multiple valid approaches explored in parallel.
```
overview → research → gate(which approach?) → [path-A or path-B] → finalize
```

**1E - Loop with User Gate:** Iterative refinement with checkpoints.
```
overview → [loop: propose → evaluate → user-gate] → finalize
```
User gate branches: "good" (exit) or "refine" (loop back).

**1F - Complex DAG:** Multiple gates and loops combined.

## Confirm

Did you propose the right shape for this task? Is it one of 1A-1F?

Call `next_step()` to continue.
