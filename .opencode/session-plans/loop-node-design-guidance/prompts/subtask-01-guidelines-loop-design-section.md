<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 01: Add Loop Node Design Section to plan-design-guidelines.md

## Objective

Extend `files/planning/plan-design-guidelines.md` with a new dedicated section titled **"Loop Node Design"** that gives planning agents explicit, actionable guidance on how to recognize when a step should be a loop node and how to design one correctly. This section will live in the Planning Best-Practices part of the document, after the existing "Loop Nodes" paragraph (which covers schema-level mechanics) but before "Gate Placement". 

The existing "Loop Nodes" paragraph under Planning Best-Practices covers only the `remaining_visits` counter mechanic. This new section must cover the *decision layer*: when to create a loop node and how to structure it.

## Scope

- **Edit:** `files/planning/plan-design-guidelines.md`
- **No other files**

## Constraints

- Insert the new section *after* the existing "### Loop Nodes" paragraph and *before* "### Gate Placement" in the Planning Best-Practices section
- Do not remove or alter the existing "### Loop Nodes" paragraph — it covers schema mechanics; the new section covers design intent
- Match the existing document style: `###` headers, bold terms, fenced code examples, "Bad:" / "Good:" contrast blocks
- The section must be practical and scannable — a planning agent reading it during decompose should be able to apply it immediately
- Do not introduce new schema fields or runtime behaviors — guidance only

## Todolist

- [ ] Read `files/planning/plan-design-guidelines.md` fully to confirm insertion point and style
- [ ] Draft the "### Loop Node Design" section with the following subsections:
  - **When to Use a Loop Node** — recognition criteria: a step that (a) may need to repeat, (b) has a clear exit condition, (c) is bounded in attempts. Examples: clarify (exit when enough context), diagnose+fix (exit when verified passing), research-execute (exit when coverage sufficient)
  - **Structural Patterns** — the three valid patterns with JSON examples:
    1. Self-loop: node routes to itself or to next; exit is DAG-determined
    2. Back-loop to prior node: e.g., diagnose → fix → verify → (fail) → diagnose
    3. Gate-escape: gate node that routes back to an earlier loop node on rejection
  - **Design Checklist** — before finalizing a loop node, confirm: (1) `remaining_visits` is set, (2) exit condition is explicit in `choose_when`, (3) the loop has exactly one non-loop `next` branch (the exit), (4) the prompt file uses the canonical loop node preamble
  - **Anti-patterns** — what NOT to do: bundling two steps into one loop node, forgetting `remaining_visits`, designing a loop with no exit branch, hardcoding the loop in the prompt rather than letting the DAG govern it
  - **Asking the User About `remaining_visits`** — during decompose, for each identified loop node: state the default (3), ask the user if they want a different count, ask one node at a time if there are multiple
- [ ] Insert the drafted section at the correct location in the file
- [ ] Verify the document structure is intact and no existing content was altered

## Delegation

**Agent:** @QuickDoc
**Model:** haiku-like
**Prompt structure:**
- Read: `files/planning/plan-design-guidelines.md`
- Goal: Insert a new "### Loop Node Design" section after "### Loop Nodes" and before "### Gate Placement" in the Planning Best-Practices section, covering recognition criteria, structural patterns, design checklist, anti-patterns, and the `remaining_visits` question protocol
- Constraints: Match existing doc style; do not alter any existing content; section must be immediately actionable for a planning agent during decompose
- Verify: Document structure is intact; new section is at the correct location; all five subsections are present

## Advance

Call `next_step()` when this subtask is complete.
