<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask ST03: Fix Debug DAG Sequencing Violations

## Objective

Fix the debug planning DAG to comply with the design guideline that `agent-routing` must precede all user-facing gate nodes. Currently, `confirm-mode` gate runs before `agent-routing`, violating this rule. Restructure the DAG and update affected prompts.

## Scope

**Current debug DAG violation:**
```
hypothesis-form → confirm-mode (GATE) → agent-routing → [info phase] → finalize
```

**Correct structure:**
```
hypothesis-form → agent-routing → confirm-mode (GATE — now called "hypothesis-gate") → [info phase] → finalize
```

**Changes required:**

1. **Update `plan-debug/plan.json`:**
   - Reorder nodes: `hypothesis-form` → `agent-routing` → `hypothesis-gate` (renamed from `confirm-mode`)
   - Update `next` pointers for: `hypothesis-form.next`, `agent-routing.next`, `hypothesis-gate.next`
   - Verify all `next` pointers are correct

2. **Rename & update prompt file:**
   - Rename `plan-debug/prompts/confirm-mode.md` → `plan-debug/prompts/hypothesis-gate.md`
   - Update content:
     - Old line 2: "You are a **hypothesis confirmation gate**..."
     - New line 2: "You are a **hypothesis validation gate**. User has seen the hypothesis and routing. Your role is to surface findings and wait for explicit user approval."
     - Update the gate prompt to assume user has already seen the routing table (from agent-routing node)
     - Keep branch structure: approve → finalize; revisit → hypothesis-form

3. **Update `hypothesis-form.md`:**
   - Update advance section to point to `agent-routing` instead of `confirm-mode`
   - (Or, remove hardcoded next and rely on plan.json — preferred)

4. **Update `agent-routing.md`:**
   - Add explicit context that this node runs **before the user-facing gate**
   - Clarify that routing output will be shown to user at hypothesis-gate
   - Keep routing logic unchanged

## Constraints

- You MUST update plan.json first (structure change)
- You MUST NOT change the core hypothesis-form logic or decomposition
- You MUST preserve all agent-routing content; only update context
- The gate branches must remain: approve → finalize; revisit → hypothesis-form
- You MUST verify that all node IDs in plan.json are consistent with file names

## Delegation

**Agent:** @JuniorDev (parallel × 2)

**Task 1:** Update `plan-debug/plan.json` — reorder nodes, update `next` pointers, rename `confirm-mode` → `hypothesis-gate`. Verify structure is acyclic.

**Task 2:** Update prompt files:
   - Rename `prompts/confirm-mode.md` → `prompts/hypothesis-gate.md` and update content to reflect new position after agent-routing
   - Update `prompts/hypothesis-form.md` to point to agent-routing in advance
   - Update `prompts/agent-routing.md` to add context about gate coming next

**Goal:** Fix debug DAG to place `agent-routing` before the gate node, complying with design guidelines.

**Verify:** DAG is acyclic; all node IDs match file names; no hardcoded node references conflict with plan.json structure.

## Advance

Call `next_step()` when this subtask is complete.

