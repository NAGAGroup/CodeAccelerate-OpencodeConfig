# Usage Guide

This system is driven by 12 slash commands. Start with `/plan` for any non-trivial work — the rest follow from there.

## /plan — Start a Session

**When to use:** Any non-trivial task: new features, refactors, bug investigations, migrations. If it needs more than 2-3 steps or will touch multiple files, use `/plan`.

**What it does:**
- Triggers the full planning workflow
- HeadWrench delegates to ContextScout for situational awareness
- Runs a Q&A with you to capture goal, scope, done criteria, git workflow, etc.
- Produces a session plan: `index.md`, `spec.json`, and individual `subtask-NN-{name}.md` files in `.opencode/sessions/{name}/`
- Assigns each subtask to the right subagent and model

**Example:**
```
/plan I want to add dark mode to the settings page
```

HeadWrench will Q&A you, gather context, then write a session plan with subtasks like: explore current theming → implement toggle → update styles → run tests.

**Tip:** The Q&A is where clarity happens. Give specific answers — done criteria, what's in/out of scope, the git branch to use. Vague answers produce vague plans.

---

## /plan-deep-research — Research-First Planning

**When to use:** When understanding comes before implementation — you need to evaluate options, explore a technology, or understand an API before committing to an approach. Use this instead of `/plan` when the decision of *what* to build depends on research findings.

**What it does:**
- Runs plan-init orientation — reads the project layout and relevant context
- Asks 1–3 scoping questions to bound the research topic: depth vs. breadth, decision criteria
- Dispatches `@DeepResearcher` with a prompt scoped to your research goal
- Surfaces a findings summary at a gate and asks how to proceed
- Loops deeper on sub-topics, pivots to a new angle, or transitions to `/plan` when you're ready to build
- Produces a `research-brief.md` in `.opencode/sessions/{name}/notes/`

**Example:**
```
/plan-deep-research I want to understand the trade-offs between tRPC and REST+OpenAPI for our API layer before we commit to a direction.
```

HeadWrench will orient on the project, ask a few scoping questions (e.g., "are you evaluating type safety, bundle size, or DX?"), dispatch `@DeepResearcher`, and surface a findings brief for your review. You decide whether to go deeper, pivot, or kick off a `/plan` session to start building.

**Tip:** Use `/plan-deep-research` when the output is a research brief, not a list of subtasks. When you're ready to build, run `/plan` and reference the research brief as context.

---

## /continue — Execute the Next Subtask

**When to use:** After `/plan` completes (or to resume a session after a break). Run it once per subtask — it picks up where the session left off.

**What it does:**
- Reads `spec.json` to find the current subtask
- Loads only that subtask's `subtask-NN-{name}.md` file
- Delegates to the assigned subagent
- Runs the checkpoint protocol when complete (WIP commit, updates session files, writes notes)

**Example:**
```
/continue
```

That's it — no arguments needed. HeadWrench knows where the session is.

**Tip:** If you've edited a subtask file to adjust scope or fix a spec, just run `/continue` — it'll pick up your changes.

---

## /amend — Quick Mid-Session Fixes

**When to use:** Small corrections that don't warrant a new session: fixing a typo in a protocol file, adjusting a prompt, correcting a single-file change.

**What it does:**
- Takes a description of the fix needed
- HeadWrench handles it directly or delegates to the right subagent
- No full planning workflow, no new session

**Example:**
```
/amend The checkpoint protocol has a typo in step 3 — "comppleted" should be "completed"
```

**When NOT to use:** If the fix touches multiple files, changes the scope of work, or reveals a new subtask — start a proper session with `/plan` instead.

---

## /quick-plan — Execute a Small Focused Change

**When to use:** Small, well-understood tasks that don't need full session tracking: a targeted change to one or a few files where the goal is clear and the risk of misalignment is low.

**What it does:**
- Runs a quick orientation pass — globs/greps the project for layout, then dispatches parallel ContextScout agents as needed
- Asks 1–3 focused Q&A questions to confirm goal, scope, and approach — skips anything already clear from your description
- Summarises understanding in 2–4 bullet points and asks for confirmation
- Executes the change immediately upon confirmation
- No session plan written, no subtask files, no checkpoint protocol

**Example:**
```
/quick-plan rename the `UserCard` component to `ProfileCard` across the codebase
```

HeadWrench will orient itself, confirm the scope with you, then execute the rename directly.

**Tip:** Use `/quick-plan` when a task is genuinely small and self-contained. If during Q&A it becomes clear the scope is larger than expected, switch to `/plan` for proper session tracking.

---

## /inbox — Review Project Observations

**When to use:** Periodically, to review patterns and observations that accumulated during past sessions.

**What it does:**
- Reads files from `.opencode/inbox/`
- Each file is a single observation written by HeadWrench during a session checkpoint (e.g., "Tool X always requires flag Y", "This project uses kebab-case for file names")
- Summarizes what's there and asks if you want to promote any to persistent context (`.opencode/context/`)

**Example:**
```
/inbox
```

**Tip:** The inbox is how the system learns project-level patterns over time. Reading it occasionally and promoting good observations to context makes future `/plan` sessions smarter.

---

## Context Commands

The context commands manage `.opencode/context/` — a set of persistent files that ContextScout reads at the start of every `/plan` session to give HeadWrench background knowledge about the project.

### /context-add

Add a file to persistent context.

```
/context-add path/to/file.md
```

Use this for files that contain standing context every planning session should know about: architecture decisions, coding conventions, team preferences, known constraints.

### /context-list

List what's currently in context.

```
/context-list
```

### /context-remove

Remove a file from context.

```
/context-remove path/to/file.md
```

Use this when context is stale or no longer relevant.

### /context-audit

Run a unified interactive audit of the full context system.

```
/context-audit
```

This is the authoritative command for periodic context hygiene. It goes beyond simple inbox review — in one interactive session it handles inbox promotion, session note archival, metadata retrofits, and staleness checks on context files. It gathers all your decisions first, then executes only after a single final approval.

What it covers:
- **Inbox promotion** — reviews pending inbox items and asks whether to promote each to global or local context, discard, or skip
- **Session archival** — identifies completed sessions with unarchived notes and proposes archiving them
- **Inbox retrofits** — flags inbox items missing required YAML front-matter and adds it
- **Context staleness** — flags context files not reviewed in over 90 days

**Tip:** Run `/context-audit` periodically instead of `/inbox` — it does everything `/inbox` did and more, in one pass with one approval step.

**Tip:** Keep context lean. 2-4 targeted files are more effective than 20 loosely related ones.

---

## Session Activation

### /activate-session

Set a session plan as active for the current OpenCode session. Once active, HeadWrench automatically injects that session's state into its context on every message — no manual loading needed.

```
/activate-session
```

Run this after `/plan` generates a new session, or when resuming a previously created session plan.

### /deactivate-session

Unset the currently active session plan.

```
/deactivate-session
```

Use this when you're done with a session and want to free-run without session context injected.

### /session-status

Display the current session plan status as a quick summary.

```
/session-status
```

Use this to get a fast at-a-glance view of where the active session stands — which subtask is current, what's complete, and what remains — without triggering any execution.

---

## Quick Reference

| Command | When to use |
|---------|-------------|
| `/plan` | Start a new session for any non-trivial task |
| `/plan-deep-research` | Research-first planning: orient, dispatch @DeepResearcher, gate on findings |
| `/continue` | Execute the next subtask in the current session |
| `/amend` | Quick fix — one file, no new session needed |
| `/quick-plan` | Lightweight alignment check + immediate execution for small tasks |
| `/inbox` | Review accumulated project observations |
| `/context-add <path>` | Add file to persistent planning context |
| `/context-list` | See what's in persistent context |
| `/context-remove <path>` | Remove file from persistent context |
| `/context-audit` | Unified audit: inbox promotion, archival, retrofits, staleness review |
| `/activate-session` | Set active session plan for this OpenCode session |
| `/deactivate-session` | Unset the active session plan |
| `/session-status` | Display current session plan status and progress |

---

## Typical Session Flow

```
1. /plan         → Q&A + session plan written
2. /continue     → Subtask 01 executed + checkpoint
3. /continue     → Subtask 02 executed + checkpoint
   ...
4. [GATE]        → HeadWrench surfaces findings, you approve
5. /continue     → Final subtask + session close commit
```

For conceptual depth on how sessions, subtasks, and the planning process work, see [CONCEPTS.md](./CONCEPTS.md).
