# Debug Session: Planning Agent DAG Schema Validation

## Bug Overview

Planning agents are generating project DAGs with **invalid `next` object structures**. Instead of using actual node IDs as keys in branching objects, agents are using generic labels like `"pass"` and `"fail"`.

### Example of the Bug

```json
"next": {
  "pass": { "next": "finalize" },      ❌ "pass" is not a valid node ID
  "fail": { "next": "remove-legacy-code" }  ❌ "fail" is not a valid node ID
}
```

### Correct Format

```json
"next": {
  "clarify": { "desc": "...", "choose_when": "..." },
  "finalize": { "desc": "...", "choose_when": "..." }
}
```

The keys in the `next` object **must be actual node IDs from the DAG**, not outcome labels.

## Symptoms & Impact

- **Symptoms:** Planning modes (generic confirmed, others suspected) generate invalid DAGs
- **Impact:** Invalid DAGs cannot be executed; users encounter errors when running `next_step()`
- **Scope:** Affects all planning modes (generic, debug, collaborative, deep-research)
- **Severity:** High — blocks DAG execution; requires manual remediation

## Root Cause Hypothesis

**Primary Hypothesis:** Planning agent prompts **lack explicit JSON schema specification** for the `next` object structure. Without clear examples showing node IDs as keys and a constraint stating "keys must be actual node IDs," agents default to generic outcome labels.

**Alternative Hypotheses:**
1. Agents ignore schema guidance due to prompt ambiguity
2. `next_step()` validation is too permissive and accepts invalid keys
3. Mode-specific code paths or older agent implementations are causing the issue

## Investigation Structure

This investigation uses **linear diagnosis** (1A shape) with a final decision gate:

```
1. Audit planning prompts for schema guidance
   ↓
2. Check gate prompts for branching examples
   ↓
3. Validate next_step() logic strictness
   ↓
4. Search historical DAGs for invalid examples
   ↓
5. Reproduce the issue with a test planning session
   ↓
6. Gate: Evaluate root cause
   ├─ If prompt-issue → Fix planning prompts
   │  └─ Verify fix with new planning session
   │     └─ Finalize
   │
   └─ If validation-issue → Escalate to code audit
      └─ Finalize
```

## How to Proceed

Each diagnosis step will:
- Gather specific evidence about the bug
- Confirm or falsify one or two hypotheses
- Guide the next step's investigation

The **gate after reproduction** will determine whether the root cause is in planning prompts (missing schema) or in validation logic (too permissive). This decision will drive the fix strategy.

## Key Questions This Investigation Will Answer

1. Do planning prompts include explicit JSON schema for `next` objects?
2. Do planning gate prompts use semantic node IDs in their branching examples?
3. Is `next_step()` validation logic strict enough to reject invalid keys?
4. Can we reproduce the bug reliably?
5. If prompts are the issue, will adding explicit schema guidance fix the bug?

## Context for Investigators

- **Schema Definition:** See `files/plugins/planning-enforcement.ts` lines 15–26 for the `DagNode` interface and lines 395–428 for validation logic
- **Planning Prompts:** Located in `files/planning/{mode}/prompts/` (e.g., `planning-gate.md`, etc.)
- **Correct Examples:** All checked-in DAGs follow the schema correctly; no invalid examples found yet
- **Bug Discovery:** Reported by user as occurring during generic planning mode; may affect all modes

This investigation may reveal the root cause early (Step 1-2) or require deeper diagnosis (Steps 3-5). Each step produces evidence that guides the next.
