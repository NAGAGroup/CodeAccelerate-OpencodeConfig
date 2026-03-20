# Subtask 03 — Research Round 3: Supporting Infrastructure

## Delegation
- **Agent:** @DeepResearcher
- **Reason:** This is a research task requiring web search and documentation synthesis across context management systems, protocol/skill architectures, CLI UX patterns, and AI assistant configuration design.

---

## Objective

Answer the following focused research question:

**What are the ideal designs for: context management in a multi-session AI coding assistant, a protocol/skill system that dynamically extends agent behavior, slash command UX, and general UX patterns that make an AI coding assistant productive and trustworthy for long-running autonomous sessions?**

The output should cover: how to manage context lifecycle (injection, staleness, supersession, archival) for a multi-session agent system; what makes a protocol or skill system extensible and maintainable vs. brittle; how slash commands should be designed for discoverability and reliability; and what UX research says about the right balance of autonomy vs. human checkpoints in long-running AI assistant sessions.

Findings should be unconstrained by the current config's implementation — if the research points to a fundamentally better design, document it.

> **Audience note:** This subtask file is read by HeadWrench. The operational content — file list, constraints, and todolist — is then passed to the assigned subagent as a self-contained task. The subagent has no awareness of session context beyond what is written here.

---

## Todolist

### 1. Construct scoped research prompt
- [ ] Review subtask Objective, Scope, and prior round notes (`notes/round-01-findings.md`, `notes/round-02-findings.md`) to build a focused @DeepResearcher prompt

### 2. Dispatch @DeepResearcher
- [ ] Dispatch @DeepResearcher with the constructed prompt covering:
  - Context lifecycle management for multi-session AI assistants: injection tiers, staleness detection, supersession patterns, archival strategies
  - Protocol and skill system design: how to structure reusable, composable behavioral extensions for LLM agents; static vs. dynamic loading; versioning
  - Slash command UX: discoverability, consistency, error handling, progressive disclosure
  - Autonomy vs. checkpoint balance: what does UX research say about when to surface decisions to humans vs. executing autonomously? Gate patterns, circuit breakers, approval flows
  - Any research on "working memory" for LLM agents — how to keep context focused and avoid degradation over long sessions

### 3. Write round findings
- [ ] Write findings to `notes/round-03-findings.md` — cover all five angles above; note design recommendations that diverge from current config approach

### 4. Gate — surface findings to user
- [ ] [🚫 GATE] Surface a findings summary to the user covering: key design recommendations, significant divergences, and whether any additional rounds are warranted before synthesis. Wait for user direction before proceeding to synthesis.

---

## Scope

- **Read:** This subtask file; `notes/round-01-findings.md`, `notes/round-02-findings.md` (for context integration)
- **Write:** `notes/round-03-findings.md`
- **Excluded:** All session subtask files, config files, implementation files; do not read or modify anything outside the notes directory

---

## Constraints

- Research must cover multiple angles and cite sources for key claims
- Findings must be concrete and actionable — not just high-level observations
- If research surfaces a design that is fundamentally different from the current config's approach, document it clearly and explain why it is better
- Output format for `notes/round-03-findings.md`: use clear section headers per research angle; cite sources inline; flag significant design divergences with a `⚠️ Design divergence:` callout
- Do not assume the current implementation is correct — evaluate independently

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
