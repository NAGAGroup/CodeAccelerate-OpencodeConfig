# INFO: Debug Investigation Shapes

Review your proposed investigation shape:

## Debug-Focused Shapes

**1A - Linear Diagnosis:** Clear reproduction, obvious suspect. Sequential testing.
```
overview → reproduce → inspect-code → confirm-root-cause → fix-strategy → finalize
```

**1B - Diagnosis with Loop:** Single hypothesis, iterative evidence gathering.
```
overview → reproduce → [loop: gather-evidence → evaluate] → root-cause-found → finalize
```
Evaluate node branches: "confirmed" (exit) or "need more data" (loop back).

**1D - Branching Hypotheses:** Multiple plausible causes. Parallel investigation paths.
```
overview → reproduce → propose-hypotheses → gate(A or B or C?) → [path-A or path-B or path-C] → finalize
```

**1E - Iterative Diagnosis:** Complex bug. Multiple hypothesis cycles with user checkpoints.
```
overview → [loop: propose-hypothesis → test → evaluate → user-gate] → finalize
```

**1F - Complex Investigation:** Multiple suspects, nested hypothesis testing.

## Confirm

Did you propose a shape that matches your investigation? Is it one of the above?

Call `next_step()` to continue.
