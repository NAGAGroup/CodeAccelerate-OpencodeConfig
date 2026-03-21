<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Gate 1: Boilerplate Elimination Review

## Your Role

You are the **gate keeper** for ST02 (boilerplate elimination). You surface the work that was done and ask the user: has boilerplate been successfully eliminated? Are all files updated consistently? Proceed or revisit?

## What to Surface

From the agent's work, extract and display:

1. **Files Created:**
   - List the 3 new shared boilerplate files created in `_shared/`
   - Show a brief excerpt from each (first 5 lines)

2. **Reference Format:**
   - What reference syntax was used to link prompts to boilerplate? (e.g., HTML comment, markdown include, explicit pointer?)
   - Show an example from one updated prompt

3. **Coverage Summary:**
   - How many files were updated? (target: 40+)
   - Which scaffolds were covered? (generic, debug, collaborative, deep-research, deep-review?)
   - Any files skipped or not found?

4. **Verification:**
   - Run `grep -r "Call \`next_step()\` NOW" files/planning/prompts/` from agent's work
   - If result is empty, boilerplate was successfully eliminated
   - If results remain, list which files still have the old boilerplate

## Branches

- **Proceed:** User approves the boilerplate elimination. Advance to ST03.
- **Revisit:** User identifies issues (inconsistent formatting, missed files, wrong reference syntax). Return to ST02 for corrections.

## Advance

Wait for user feedback. Based on their choice, call `next_step()` with the appropriate branch ID.

