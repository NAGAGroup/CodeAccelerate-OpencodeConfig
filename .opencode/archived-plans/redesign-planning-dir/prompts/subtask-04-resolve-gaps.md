<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask ST04: Resolve Clarity Gaps — Synthesize Node, Dynamic Session-Overview, Plan-Restructuring Authority

## Objective

Address three specific clarity gaps in the planning scaffolds:
1. Add explicit `synthesize.md` node to plan-generic (guideline teaches three-node pattern, but no prompt file exists)
2. Clarify "dynamic session-overview generation" instructions with explicit static vs. dynamic breakdown
3. Propagate plan-restructuring authority into generated session-overview.md files

## Scope

**Issue 0: Update Slash Commands with New Terminology**

- Current state: Slash command files in `files/commands/` use old terminology (unclear planning/execution distinction)
- New terminology: Planning Scaffold (bootstrap infrastructure), Planning Session (temporary execution), Project DAG (generated plan.json), Project Session (user execution)
- Fix:
  1. Audit all `.md` files in `files/commands/`
  2. Replace terminology:
     - "planning workflow" → "Planning Scaffold"
     - "planning execution" → "Planning Session"
     - "session plan" → "Project DAG"
     - "session" (user execution context) → "Project Session"
  3. Update command descriptions to clarify Planning vs. Project scope
  4. Update any examples that reference old node/DAG terminology

**Issue 1: Missing Synthesize Node in plan-generic**

- Current state: Guidelines teach scout → synthesize → decompose pattern (line 16 of plan-design-guidelines.md)
- Reality: Plan-generic has `scout.md` and `decompose.md`, but no `synthesize.md`
- Fix:
  1. Create `plan-generic/prompts/synthesize.md` (new file, ~20 lines)
  2. Update `plan-generic/plan.json`: insert `synthesize` node between `scout` and `decompose`
  3. Update `scout.md` advance to point to synthesize
  4. Update `synthesize.md` advance to point to decompose
  5. Update `decompose.md` constraints: assume findings are already synthesized; focus only on subtask writing

**Issue 2: Clarify Dynamic vs. Static in Session-Overview Generation**

- Current state: Lines 28–29 in plan-debug/finalize.md say "Do NOT copy a static template. Generate it dynamically." — vague
- Fix:
  1. Update `plan-generic/finalize.md` and `plan-debug/finalize.md` (and all DAG finalizes):
     - Add explicit list of **static sections** (must be same in every generated session-overview):
       - First line: `<!-- DO NOT COMPACT... -->`
       - Session goal (from planning conversation)
       - Artifact path (`.opencode/session-plans/{name}/`)
       - Operating instructions (subtask prompts are agent-internal, execute in order)
       - Advance section (call next_step())
     - Add explicit list of **dynamic sections** (generated from planning conversation):
       - Subtask list with names and brief descriptions
       - Gate locations and branches
       - Loop patterns if any
       - Key decisions made during planning
  2. Rewrite the finalize guidance to say: "Static sections below; fill in dynamic content from the planning conversation."

**Issue 3: Propagate Plan-Restructuring Authority to Generated Session-Overview**

- Current state: Plan-design-guidelines.md line 253 says executing agents have authority to restructure, but this is NOT in generated session-overview.md files
- Fix:
  1. Update finalize.md prompts (generic, debug, collaborative, deep-research) to include this authority statement in the generated session-overview.md
  2. Add a new section to generated session-overview.md:
     ```markdown
     ## You Have Restructuring Authority
     
     During execution, you may add nodes, rename nodes, or reorder nodes in `plan.json` 
     (e.g., to split a subtask, fix a gate, or consolidate work). You must call `next_step()` 
     to advance between nodes — you cannot skip the `next_step()` workflow even when restructuring.
     ```

## Constraints

- You MUST NOT change the core planning logic in existing nodes
- You MUST preserve all existing prompts' objective/constraints/delegation sections
- For the synthesize node: keep it lightweight (read findings, form understanding, point to next node)
- The static vs. dynamic breakdown must match the guidelines document; don't invent new static sections
- You MUST update ALL finalize.md files consistently (generic, debug, collaborative, deep-research, and deep-review if in scope)

## Delegation

**Agent:** @JuniorDev (parallel × 7)

**Task 1:** Create `plan-generic/prompts/synthesize.md` — 20-line node that reads scout findings and forms understanding for decompose.

**Task 2:** Update `plan-generic/plan.json` — insert synthesize node between scout and decompose; update all next pointers.

**Task 3:** Update `plan-generic/prompts/scout.md` — change advance to point to synthesize.

**Task 4:** Update `plan-generic/prompts/decompose.md` — add constraint that findings are pre-synthesized; focus on subtask writing.

**Task 5:** Update all finalize.md files (generic, debug, collaborative, deep-research) — add static vs. dynamic breakdown and restructuring authority statement to the session-overview.md generation instructions.

**Task 6:** Update `plan-debug/plan.json` if necessary to match the synthesize pattern (debug may not have this node; verify against discovery notes).

**Task 7:** Audit and update all `.md` files in `files/commands/` to use new terminology: "Planning Scaffold" (bootstrap infrastructure), "Planning Session" (temporary execution), "Project DAG" (generated plan.json), "Project Session" (user execution). Update command descriptions to clarify Planning vs. Project scope.

**Goal:** Add missing synthesize node, clarify dynamic generation, and propagate restructuring authority.

**Verify:** All finalize.md files contain the restructuring authority statement; session-overview generation instructions list static and dynamic sections explicitly.

## Advance

Call `next_step()` when this subtask is complete.

