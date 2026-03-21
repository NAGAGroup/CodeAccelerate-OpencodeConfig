<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask ST02: Eliminate Boilerplate Redundancy Across 40+ Prompt Files

## Objective

Create 3 new shared boilerplate files in `files/planning/_shared/` and update 40+ existing prompt files to reference them instead of duplicating content. This eliminates maintenance liability and ensures consistent language across all planning scaffolds.

## Scope

**Files to create:**

1. **`_shared/boilerplate-advance.md`** (~8 lines)
   - Standard "Advance" section used by 25+ non-terminal, non-gate nodes
   - Content: "Call `next_step()` NOW. Do this exactly once. Do NOT read session files or DAG state. Do NOT take any other action before or after calling `next_step()`."
   - Usage: Nodes will include this via markdown include or reference (e.g., `<!-- include: ../_shared/boilerplate-advance.md -->`)

2. **`_shared/boilerplate-advance-terminal.md`** (~6 lines)
   - Standard "Advance" section for terminal nodes
   - Content: "Call `close_session()` exactly once. Do this exactly once. Do NOT call `next_step()`..."
   - Usage: Terminal nodes (finalize, close, complete) will reference this

3. **`_shared/boilerplate-deliverables.md`** (~12 lines)
   - Standard "Critical Deliverables" list used in session-overview nodes
   - Content: Exact list from plan-generic/session-overview.md lines 13–19, cleaned up
   - Usage: All session-overview.md files will reference this instead of duplicating

**Files to update:**

Update the following 40+ files to **remove boilerplate and insert references**:

- **plan-generic/** (8 prompts):
  - `session-overview.md`: remove lines 13–19, add reference to boilerplate-deliverables; remove lines 22–24, add reference to boilerplate-advance
  - `clarify.md`: remove lines 22–24, add reference
  - `scout.md`: remove lines 27–29, add reference
  - `assess.md`: remove advance section, add reference (if terminal) or boilerplate-advance
  - `synthesize.md`: remove advance section, add reference
  - `decompose.md`: remove advance section, add reference
  - `agent-routing.md`: remove advance section, add reference
  - `finalize.md`: remove lines 55+, add reference to boilerplate-advance-terminal

- **plan-debug/** (8 prompts):
  - `session-overview.md`: remove deliverables duplicates, add reference
  - `bug-intake.md`: remove lines 24–26, add reference
  - `hypothesis-form.md`: remove advance section, add reference
  - `confirm-mode.md`: remove advance section, add reference
  - `diagnose.md`: remove advance section, add reference (if loop) or standard
  - `agent-routing.md`: remove advance section, add reference
  - `finalize.md`: remove lines 55+, add reference to boilerplate-advance-terminal
  - All other prompts: audit for advance sections and add references

- **plan-collaborative/** (7 prompts):
  - `session-overview.md`: update to use boilerplate-deliverables reference
  - `idea-intake.md`, `clarify.md`, `assess.md`, `seed-gate.md`, `agent-routing.md`, `finalize.md`: all remove standard boilerplate, add references

- **plan-deep-research/** (9 prompts):
  - Same audit and update pattern as above

- **plan-deep-review/** (11 prompts, if in scope):
  - Same pattern — audit, remove boilerplate, add references

## Constraints

- You MUST create the 3 new boilerplate files first in `_shared/`
- You MUST NOT change the actual instructions or content of any node — only extract boilerplate and add references
- You MUST use a consistent reference format (e.g., HTML comment include syntax or explicit "See `_shared/boilerplate-X.md`" pointer)
- You MUST audit every prompt file to ensure no duplicates are missed
- After all updates, no prompt file should contain the duplicated advance/deliverables text verbatim

## Delegation

**Agent:** @JuniorDev (parallel × 4)

**Batch 1 (Create boilerplate files):**
- Create `/home/jack/CodeAccelerate-OpencodeConfig/files/planning/_shared/boilerplate-advance.md`
- Create `/home/jack/CodeAccelerate-OpencodeConfig/files/planning/_shared/boilerplate-advance-terminal.md`
- Create `/home/jack/CodeAccelerate-OpencodeConfig/files/planning/_shared/boilerplate-deliverables.md`

**Batch 2–4 (Update prompt files - run in parallel):**
- Batch 2: Update all plan-generic prompts (8 files)
- Batch 3: Update all plan-debug prompts (8 files)
- Batch 4: Update plan-collaborative + plan-deep-research prompts (16 files)

**Goal:** Extract duplicated boilerplate into shared files and insert references into all 40+ prompt files.

**Constraints:**
- Do not change node instructions or logic
- Use consistent reference format
- Audit every file in the target directory
- Verify no duplicate text remains after updates

**Verify:** Run `grep -r "Call \`next_step()\` NOW" files/planning/` — should return zero results (all instances replaced with references).

## Advance

Call `next_step()` when this subtask is complete. Gate 1: Before you advance, surface a summary of which files were updated and the reference format used.

