# Subtask 03: rewrite-clarify

## Objective

Rewrite `opencode/planning/plan-collaborative/prompts/clarify.md` to reframe the clarification purpose: questions serve the **session designer's** need to structure an effective session — not the session's own exploratory questions. The agent gathers context to design well, not to begin answering the topic.

## Scope

**File:** `opencode/planning/plan-collaborative/prompts/clarify.md`

**Current problem:** The clarify node currently says "surface quality clarifying questions that will inform the seed plan" and lists topic-level questions (what problem is being solved, what does success look like). These are questions for a session participant to explore — not questions a session designer needs to structure a session. The framing invites the agent to engage with the topic's substance.

**Required changes:**
1. Re-state the role at the top: you are gathering design-time context to structure a good session — not asking the topic's research questions
2. Questions should be about session design needs, not topic substance:
   - How long/deep should this session go?
   - What does the user want to walk away with (decision made, spec written, list of options)?
   - Are there parts of the topic that are already settled (no need to explore)?
   - Who else is involved / what constraints exist on the output format?
3. The agent should NOT generate questions about the topic's design trade-offs, architecture decisions, or implementation details — those are for the session itself

## Constraints

- Role restatement must appear prominently, before the steps
- Question categories must be session-design-oriented, not topic-oriented
- The "do not attempt to answer the questions yourself" constraint should be strengthened: do not engage with the topic content at all

## Todolist

- [ ] Read current `clarify.md`
- [ ] Reframe opening to session-designer role
- [ ] Replace topic-oriented question categories with session-design-oriented ones
- [ ] Strengthen the "don't engage with topic" constraint

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/planning/plan-collaborative/prompts/clarify.md`
- Goal: Rewrite the file. The clarify node gathers context to help the designer structure an effective session — not to begin exploring the topic. Questions should be about session shape (depth, desired output, settled vs. open areas, constraints on format) — not about the topic's substance or design trade-offs.
- Constraints: Do not retain question categories that ask about the topic's problem, success criteria, or design constraints — those belong in the session itself. Add an explicit constraint: do not engage with the topic content in this node.
- Verify: The rewritten questions could be asked about ANY topic without knowing anything about the topic's content
