# Subtask 4: Update Other Planning DAG Scouts (Parallel)

**Agent:** @QuickDoc (parallel × 3)

## Goal

Apply the same research integration pattern to the remaining planning DAG scout nodes. This subtask dispatches three independent rewrites in parallel:
1. **plan-debug/prompts/scout.md** (debug scout)
2. **plan-collaborative/prompts/scout.md** (collaborative scout)
3. **plan-deep-research/prompts/scout.md** (deep-research scout)

## Coordination

All three updates follow the **same pattern** established in subtask 3 (plan-generic). Use subtask 3's rewritten scout.md as a template for consistency.

Key alignment:
- Same external research trigger rules
- Same tool selection (exa_web_search, context7, exa_get_code_context)
- Same findings format
- Same examples structure

## What Each Agent Does

### Agent 1: Update plan-debug Scout
**File:** `files/planning/plan-debug/prompts/scout.md`

**Adaptation:** Debug DAGs scout for root causes in existing code. Adjust external research section to apply to debugging scenarios:
- Example: "If task is 'Node.js memory leak', research patterns for memory profiling in Node"
- Focus research on debugging tools, error patterns, and diagnosis approaches

**Rewrite:** Follow the pattern from subtask 3, but include debug-specific research scenarios.

### Agent 2: Update plan-collaborative Scout
**File:** `files/planning/plan-collaborative/prompts/scout.md`

**Adaptation:** Collaborative DAGs scout for design patterns and precedents. Adjust external research to focus on:
- Architecture patterns and design precedents
- Best practices from industry
- Tool ecosystem and library comparisons

**Rewrite:** Follow the pattern from subtask 3, but include collaborative/design-specific research scenarios.

### Agent 3: Update plan-deep-research Scout
**File:** `files/planning/plan-deep-research/prompts/scout.md`

**Adaptation:** Deep-research DAGs already scout for research context. Integrate external research tools explicitly:
- Existing scout mentions "knowledge gaps and research precedents"
- Add specific tool dispatch instructions (Exa, Context7)
- Clarify how research findings flow to the research-execute loop

**Rewrite:** Follow the pattern from subtask 3, but emphasize deep-research-specific scenarios (literature review, API exploration, etc.).

## Parallel Execution

All three agents work simultaneously. Each:
1. Reads `scout-research-spec.md`
2. Reads the **original** scout.md for their target DAG
3. Reads subtask 3's rewritten plan-generic scout as a template
4. Rewrites their scout.md following the same structure
5. Saves to their respective files
6. Calls `next_step()` when done

**Expected completion:** All three files updated in parallel.

## Success Criteria

- All three scout.md files are updated
- Each follows the design spec and template pattern
- Each is appropriately adapted for its DAG type (debug, collaborative, deep-research)
- No syntax errors or inconsistencies
- All files saved to correct locations

## Troubleshooting

If you're uncertain about adaptation for your specific DAG type:
- Reference the original scout.md purpose
- Adjust external research examples to match that purpose
- Keep the structure and pattern consistent with plan-generic's rewrite

Call `next_step()` when all three updates are complete.
