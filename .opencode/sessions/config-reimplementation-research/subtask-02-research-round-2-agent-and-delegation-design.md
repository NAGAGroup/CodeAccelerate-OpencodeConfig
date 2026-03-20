# Subtask 02 — Research Round 2: Agent Design & Delegation Strategy

## Delegation
- **Agent:** @DeepResearcher
- **Reason:** This is a research task requiring web search and documentation synthesis across multi-agent system design, LLM agent architecture, and delegation pattern best practices.

---

## Objective

Answer the following focused research question:

**What is the ideal design for writing session-specific subagents and for building a delegation strategy that dynamically balances speed, cost, and correctness per session — covering agent composition, permission design, routing logic, and how to match task characteristics to the right agent capability level?**

The output should cover: best practices for writing agent system prompts that produce reliable, in-scope behavior; how to design permission systems for agents (deny-by-default vs. other patterns); how to structure delegation routing (static rules vs. dynamic per-session assignment); how to reason about the speed/cost/correctness trade-off when choosing models and agents per task; and whether session-specific agent creation (per-session agent files) is a better pattern than global shared agents.

Findings should be unconstrained by the current config's implementation — if the research points to a fundamentally better design, document it.

> **Audience note:** This subtask file is read by HeadWrench. The operational content — file list, constraints, and todolist — is then passed to the assigned subagent as a self-contained task. The subagent has no awareness of session context beyond what is written here.

---

## Todolist

### 1. Construct scoped research prompt
- [ ] Review subtask Objective, Scope, and any prior round notes (`notes/round-01-findings.md`) to build a focused @DeepResearcher prompt

### 2. Dispatch @DeepResearcher
- [ ] Dispatch @DeepResearcher with the constructed prompt covering:
  - Best practices for writing agent system prompts that produce reliable, scoped, non-drifting behavior
  - Permission/capability design for LLM agents (deny-by-default, least-privilege, allow-listing)
  - Multi-agent delegation routing patterns — static routing tables vs. dynamic per-session assignment
  - How to structure the speed/cost/correctness trade-off: what factors should drive model selection per task type?
  - Session-specific vs. global agent design — tradeoffs of creating purpose-built agents per session vs. reusing global agents
  - Any research on agent specialization vs. generalization for coding assistant use cases

### 3. Write round findings
- [ ] Write findings to `notes/round-02-findings.md` — cover all six angles above; note design recommendations that diverge from current config approach

### 4. Gate — surface findings to user
- [ ] [🚫 GATE] Surface a findings summary to the user covering: key design recommendations, significant divergences from current approach, and suggested angles for Round 3. Wait for user direction before proceeding.

---

## Scope

- **Read:** This subtask file; `notes/round-01-findings.md` (for context on prior round)
- **Write:** `notes/round-02-findings.md`
- **Excluded:** All session subtask files, config files, implementation files; do not read or modify anything outside the notes directory

---

## Constraints

- Research must cover multiple angles and cite sources for key claims
- Findings must be concrete and actionable — not just high-level observations
- If research surfaces a design that is fundamentally different from the current config's approach, document it clearly and explain why it is better
- Output format for `notes/round-02-findings.md`: use clear section headers per research angle; cite sources inline; flag significant design divergences with a `⚠️ Design divergence:` callout
- Do not assume the current implementation is correct — evaluate independently

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
