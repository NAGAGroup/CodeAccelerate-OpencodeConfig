# Subtask 05: rewrite-finalize

## Objective

Rewrite `opencode/planning/plan-collaborative/prompts/finalize.md` with forceful, explicit constraints that prevent the agent from writing any design content into the session artifact. The agent's role is **file writer only** — it transcribes the session structure decided during planning into the correct files. It does not generate, synthesize, or add any content about the topic.

## Scope

**File:** `opencode/planning/plan-collaborative/prompts/finalize.md`

**Current problems (two distinct failure modes demonstrated):**

1. **Role confusion failure:** Agent reads codebase, generates design proposals (6 pillars), and writes them as content into `spec.md` or other files
2. **Structure failure:** Output was `context.md` + `plan.md` (wrong files entirely) instead of `plan.json` + `prompts/` + `spec.md`

**Required changes:**

1. Open with an explicit role statement: you are a **file writer**. You transcribe decisions made during this planning session into the correct file structure. You do not generate, analyze, research, or design anything about the topic.

2. Forbid explicitly:
   - Reading any codebase files
   - Writing design proposals, architecture recommendations, or analysis into any output file
   - Generating "pillars," "phases," "principles," or any structured topic content
   - Creating files other than the specified ones (`plan.json`, `prompts/explore-01.md`, `prompts/spec-gate.md`, `prompts/finalize-output.md`, `spec.md`)

3. The `spec.md` stub must contain ONLY:
   - The goal statement provided/confirmed by the user
   - The open questions listed verbatim from the clarify node — as questions, not answers
   - A "Findings:" section header (empty — populated during the session)
   - Nothing else. No analysis. No proposals. No background context.

4. The `explore-01.md` prompt must contain:
   - The topic/first exploration area (from session context)
   - The open questions (copied from spec.md)
   - Instructions for the explore agent to work through questions WITH the user and update spec.md
   - Delegation instructions from agent-routing
   - Nothing the agent generated about the topic's content

5. File structure must be strictly enforced with the exact paths listed. No extra files.

## Constraints

- HW writes this file directly — this is too judgment-heavy for a haiku agent given the demonstrated failure modes
- The role-boundary statement must appear at the very top, before any steps
- Every "do not" constraint should be stated explicitly — do not rely on implication
- The correct output file structure must be enumerated clearly with no ambiguity

## Todolist

- [ ] Read current `finalize.md`
- [ ] Draft rewrite with explicit role-boundary + forbidden actions at top
- [ ] Enumerate exact output file structure with path and content rules per file
- [ ] Add explicit "spec.md contains ONLY" constraint with examples of what does NOT belong
- [ ] Add explicit "do not read codebase files" constraint
- [ ] Verify: someone who just read the failure mode transcript would find every loophole closed

## Delegation

**Agent:** HW (direct)
**Reason:** Most complex rewrite — requires judgment about which specific constraints close which loopholes from the demonstrated failure modes. Haiku model output quality insufficient for this level of precision.
