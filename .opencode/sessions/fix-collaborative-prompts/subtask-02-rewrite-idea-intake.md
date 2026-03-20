# Subtask 02: rewrite-idea-intake

## Objective

Rewrite `opencode/planning/plan-collaborative/prompts/idea-intake.md` with a prominent role-boundary statement at the top: the planning agent is a **session designer**, not a session participant. Its job in this node is to confirm the topic it will design a session around — not to begin exploring that topic.

## Scope

**File:** `opencode/planning/plan-collaborative/prompts/idea-intake.md`

**Current problem:** The opening line reads "The goal is to turn a rough idea into a fully specced plan or artifact through iterative exploration with the user." This invites the agent to begin the collaborative work immediately. No role boundary is stated.

**Required changes:**
1. Open with an explicit role statement: you are the **session designer**. Your job is to create a session plan artifact. You are NOT here to explore the topic, answer questions about it, or produce design output.
2. The "rough idea" is the **topic** of the session to be designed — not a problem for you to solve
3. Intake confirms: what is the topic, what kind of session should be designed, and what does the user want to walk away with after the session
4. Do not begin exploration or analysis of the topic content

## Constraints

- Role-boundary statement must appear at the very top, before any steps
- Language must be unambiguous — no phrases that could be read as "explore this topic with the user"
- Keep the node brief — its only job is topic confirmation

## Todolist

- [ ] Read current `idea-intake.md`
- [ ] Add explicit role-boundary statement at top
- [ ] Reframe steps around session design confirmation, not topic exploration
- [ ] Verify no language invites topic exploration

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/planning/plan-collaborative/prompts/idea-intake.md`
- Goal: Rewrite the file. Open with a prominent role-boundary statement: "You are the session designer. Your job is to create a session plan artifact. You are NOT here to explore the topic, answer questions about it, or produce design proposals." Reframe all steps around confirming the session topic and desired session output format — not exploring the topic itself.
- Constraints: Role boundary must be the first thing in the file. Do not add steps that involve reading code, analyzing the topic, or proposing solutions.
- Verify: Someone reading only this file could not justify reading codebases or generating design proposals
