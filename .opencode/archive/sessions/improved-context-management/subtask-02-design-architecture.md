# Subtask 02 — Design Tiered Context Architecture

## Delegation
- **Agent:** HeadWrench direct
- **Model tier:** standard
- **Reason:** This is a design synthesis task — HeadWrench uses the audit report from subtask 01 to produce the architectural design. No subagent involvement; this is reasoning and writing a design doc, not code or protocol implementation.

---

## Objective

Using the audit report from subtask 01, design the complete tiered context architecture. The output is a design document written by HeadWrench that will be presented to the user at the G1 gate. The design must specify: the context tiers, staleness rules for each tier, conflict/supersession rules for inbox items, what agents receive at runtime, and the exact behavior of each new slash command.

---

## Todolist

### 1. Synthesize audit findings
- [ ] Read the subtask 01 audit report (from notes or subagent output)
- [ ] Identify the top competing/stale problems to solve
- [ ] Identify any patterns in what survives as "still useful" vs. what is clearly stale

### 2. Design tiered context model
- [ ] Define the tiers (e.g., config → inbox → session notes → active subtask)
- [ ] For each tier: specify what it contains, who writes to it, who reads it, and when it becomes stale
- [ ] Define the visibility rule: what does HW pass to ContextScout at planning time? What does HW include in subagent prompts?

### 3. Design staleness rules
- [ ] Define when session notes expire (e.g., session completion triggers archival)
- [ ] Define when inbox items expire (e.g., superseded_by header, or time-based, or manual)
- [ ] Define the archival destination (e.g., `.opencode/archive/` directory)

### 4. Design inbox metadata standard
- [ ] Define required metadata header for all inbox items (e.g., topic, created, session, supersedes)
- [ ] Define the conflict resolution rule (newer supersedes older on same topic)

### 5. Design slash command specifications
- [ ] `/context-audit` — specify: trigger behavior, what it analyzes, what it shows user, what it changes, Q&A it asks
- [ ] `/prune-session-notes` (or equivalent) — specify: what gets archived, criteria, user approval step
- [ ] Consider whether one master command covers both or separate commands are better

### 6. Write design document
- [ ] Write `.opencode/sessions/improved-context-management/notes/architecture-design.md` covering all of the above
- [ ] This document is the G1 gate artifact — it must be complete and presentable to the user

### 7. [🚫 GATE] — Present design to user
- [ ] Surface the architecture-design.md to the user
- [ ] Wait for explicit approval before proceeding

---

## Scope
- **Edit:** Nothing
- **Read:** Subtask 01 audit output (notes), `.opencode/inbox/` as reference
- **Write:** `.opencode/sessions/improved-context-management/notes/architecture-design.md`
- **Excluded:** Any protocol files, slash command files — those come after gate approval

---

## Patterns
```
✅ GOOD — Design is specific: named tiers, concrete staleness thresholds, exact slash command UX flow
❌ BAD  — Design is vague: "use tiers somehow" without specifying rules and thresholds
```

---

## Constraints
- The design must be self-contained and reviewable by the user without context from this session
- Include a section showing "before vs. after" for how context flows to agents
- Slash command specs must describe: trigger, analysis phase, output shown to user, Q&A asked (if any), permanent file changes made
- Do not begin writing any protocol files or slash command files in this subtask

## [🚫 GATE] G1 — Architecture Review

Present `notes/architecture-design.md` to the user. The user must explicitly approve before proceeding to subtasks 03–07. Ask specifically:

1. Does the tiered model make sense?
2. Are the staleness rules appropriate?
3. Are the slash commands the right shape?
4. Any changes before writing begins?

---

*At the end of this subtask, follow the checkpoint protocol in `protocols/checkpoint.md` if present in this session directory, otherwise `~/.config/opencode/protocols/checkpoint.md`.*
