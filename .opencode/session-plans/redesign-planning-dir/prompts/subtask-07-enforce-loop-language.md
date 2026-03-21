<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask ST07: Enforce Strict Loop Language Across All Loop Nodes

## Objective

Enforce the strict loop node instruction language prescribed in `plan-design-guidelines.md` (lines 305–306) across all loop nodes in all planning scaffolds. This ensures agents executing loop nodes understand the control flow: one action per call, then `next_step()` immediately, DAG decides whether to loop.

## Scope

**Current state:**
- Guidelines prescribe strict boilerplate for loop nodes (lines 305–306)
- Prescribed language: "You are in a loop node. You have ONE action: [do X], then call `next_step()` immediately. Do NOT [do Y, Z, W]. After calling `next_step()`, stop — the DAG determines whether to loop again or advance. You MUST NOT make that determination yourself."
- Reality: Many loop nodes use casual language instead of strict language

**Changes required:**

Audit and update ALL loop nodes across all planning scaffolds:

1. **plan-generic loop nodes:**
   - `clarify.md` (lines 15–20): Replace casual "MUST ask exactly ONE question" with strict language
   - `assess.md` (loop decision): Already strict or needs tightening?

2. **plan-debug loop nodes:**
   - `diagnose.md` (if exists): Ensure strict language
   - Check for any other loop patterns

3. **plan-collaborative loop nodes:**
   - `clarify.md`: Replace with strict language
   - `assess.md`: Tighten if needed

4. **plan-deep-research loop nodes:**
   - `clarify.md`: Replace with strict language
   - `assess.md`: Tighten if needed

5. **plan-deep-review loop nodes (if in scope):**
   - Audit all loop nodes

**Strict language template:**

```markdown
## Loop Node Discipline

You are in a loop node. You have ONE action:

1. [Specific action: ask a question / verify a finding / run a test / etc.]

Then call `next_step()` immediately. Do NOT:
- Try to make progress on multiple topics in one call
- Attempt to loop or advance yourself — let the DAG decide
- Change the loop counter or skip the next_step() workflow

After calling `next_step()`, stop. The DAG will determine whether to loop back or advance. 
You MUST NOT make that determination yourself.
```

## Constraints

- You MUST use the exact template language prescribed in the guidelines
- You MUST audit every loop node in the planning scaffolds
- You MUST NOT change the node's core logic or action — only tighten the language
- Loop nodes are decision nodes (clarify, assess, diagnose, verify, etc.) — identify all of them
- You MUST NOT introduce new variations of loop language; all loop nodes should be consistent

## Delegation

**Agent:** @JuniorDev (parallel × 8)

Create 8 parallel subtasks to cover all loop nodes across all scaffolds:

**Task 1:** Audit & tighten `plan-generic/prompts/clarify.md` and `plan-generic/prompts/assess.md` with strict loop language.

**Task 2:** Audit & tighten `plan-debug/prompts/diagnose.md` (if exists) and any other loop nodes in plan-debug.

**Task 3:** Audit & tighten `plan-collaborative/prompts/clarify.md` and `plan-collaborative/prompts/assess.md`.

**Task 4:** Audit & tighten `plan-deep-research/prompts/clarify.md` and `plan-deep-research/prompts/assess.md`.

**Task 5:** Audit `plan-deep-review/prompts/` for all loop nodes and apply strict language (if plan-deep-review is in scope).

**Task 6:** Verify all loop nodes have exactly ONE action per call (no multi-step actions buried in prose).

**Task 7:** Check for edge cases: any agent nodes with conditional branches (not gates) that might have implicit loop-like behavior.

**Task 8:** Run grep to find any remaining instances of casual loop language ("exactly one question", "don't batch", "one action") and flag for review.

**Goal:** Enforce strict loop node discipline across all planning scaffolds; ensure consistent language.

**Verify:** All loop nodes use the prescribed strict language; no casual variations remain; each loop node has exactly one action.

## Advance

Call `next_step()` when this subtask is complete.

