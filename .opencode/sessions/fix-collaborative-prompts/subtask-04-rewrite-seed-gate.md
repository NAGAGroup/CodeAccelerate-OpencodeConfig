# Subtask 04: rewrite-seed-gate

## Objective

Rewrite `opencode/planning/plan-collaborative/prompts/seed-gate.md` to make explicit that the gate is presenting a **session design artifact** for approval — not a design proposal about the topic. The gate question is "is this a good session design?" not "is this a good answer to the topic?"

## Scope

**File:** `opencode/planning/plan-collaborative/prompts/seed-gate.md`

**Current problem:** The gate asks the agent to propose "open questions" and a "proposed first exploration area" — which the failing agent treated as license to generate design proposals and architecture pillars. The gate doesn't distinguish between "session structure choices" and "topic content."

**Required changes:**
1. Open with role restatement: this gate presents a session design for approval, not topic analysis
2. The proposal items should be explicitly session-structural:
   - Session goal statement (what the session will produce)
   - Proposed session structure (how many explore nodes, rough agenda)
   - Open questions *the session will explore* (listed as placeholders — NOT answered by the agent)
   - Proposed output format
3. Explicit constraint: the "open questions" listed here are topics FOR the session to address — the agent must not answer or analyze them
4. The approval question should be "Does this look like a well-structured session for this topic?" — not anything that could be read as approving a design proposal

## Constraints

- Role statement must be prominent at the top
- "Open questions" framing must be clear: these are session agenda items, not the agent's analysis
- No content the agent generates should constitute design work on the topic

## Todolist

- [ ] Read current `seed-gate.md`
- [ ] Add role-boundary statement at top
- [ ] Reframe proposal items as session structure, not topic analysis
- [ ] Reframe "open questions" as session agenda items explicitly
- [ ] Rewrite the approval question to be about session design quality

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/planning/plan-collaborative/prompts/seed-gate.md`
- Goal: Rewrite the file. This gate presents a session structure design for user approval — not topic analysis. The "open questions" listed are items the session WILL explore, not things the agent has analyzed. The agent must not produce any content that constitutes design work on the topic itself.
- Constraints: Reframe all proposal items as structural/organizational session choices. Add explicit: "The open questions listed here are session agenda items — do not analyze or answer them."
- Verify: An agent reading this file could not justify writing architecture pillars, design trade-offs, or any topic-level content
