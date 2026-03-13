# Subtask 04 — Write New docs/USAGE.md

## Delegation
- **Agent:** @DocWriter (`subagents/doc-writer`)
- **Model tier:** fast (github-copilot/claude-haiku-4.5) — clear spec with defined command list and example patterns, no ambiguous judgment
- **Reason:** Straightforward documentation writing with a fully specified structure and examples.

---

## Objective

Write a new `docs/USAGE.md` that shows new users how to use the 5 core user-facing commands: `/plan`, `/continue`, `/amend`, `/inbox`, and the 3 context commands. Each command should have a brief explanation, a concrete example or two, and guidance on when to use it. This is a practical "how to use the system" guide, not a conceptual overview (that's CONCEPTS.md).

---

## Todolist

### 1. Write docs/USAGE.md
- [ ] Write the file at `/home/jack/CodeAccelerate-OpencodeConfig/docs/USAGE.md`
- [ ] Cover all 7 commands with examples
- [ ] Include a quick-reference summary table
- [ ] Do not reference any old system names

---

## File Specification

**Path:** `docs/USAGE.md`

**Purpose:** Practical usage guide for the 7 slash commands. Shows how and when to use each command, with concrete examples.

**Audience:** New users who want to know what to actually type and when.

**Tone:** Practical, direct, example-first. Not a spec, not a tutorial — more like a quick-start guide for each command.

---

### Required Sections

#### 1. Opening
1-2 sentences: The system is driven by 7 slash commands. This guide covers the core ones — start with `/plan`.

#### 2. /plan — Start a Session

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

#### 3. /continue — Execute the Next Subtask

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

#### 4. /amend — Quick Mid-Session Fixes

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

#### 5. /inbox — Review Project Observations

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

#### 6. Context Commands

The three context commands manage `.opencode/context/` — a set of persistent files that ContextScout reads at the start of every `/plan` session to give HeadWrench background knowledge about the project.

##### /context-add

Add a file to persistent context.

```
/context-add path/to/file.md
```

Use this for files that contain standing context every planning session should know about: architecture decisions, coding conventions, team preferences, known constraints.

##### /context-list

List what's currently in context.

```
/context-list
```

##### /context-remove

Remove a file from context.

```
/context-remove path/to/file.md
```

Use this when context is stale or no longer relevant.

**Tip:** Keep context lean. 2-4 targeted files are more effective than 20 loosely related ones.

#### 7. Quick Reference

| Command | When to use |
|---------|-------------|
| `/plan` | Start a new session for any non-trivial task |
| `/continue` | Execute the next subtask in the current session |
| `/amend` | Quick fix — one file, no new session needed |
| `/inbox` | Review accumulated project observations |
| `/context-add <path>` | Add file to persistent planning context |
| `/context-list` | See what's in persistent context |
| `/context-remove <path>` | Remove file from persistent context |

#### 8. Typical Session Flow

```
1. /plan         → Q&A + session plan written
2. /continue     → Subtask 01 executed + checkpoint
3. /continue     → Subtask 02 executed + checkpoint
   ...
4. [GATE]        → HeadWrench surfaces findings, you approve
5. /continue     → Final subtask + session close commit
```

---

## Scope
- **Write:** `docs/USAGE.md`
- **Read:** nothing required (all content is spec'd above)
- **Excluded:** Everything else — do not modify any other file

---

## Patterns
```
✅ GOOD — Lead each command section with "when to use"
✅ GOOD — Show concrete command examples in code blocks
✅ GOOD — Include "when NOT to use" where helpful
✅ GOOD — End with a quick-reference table
❌ BAD  — Deep conceptual explanations — link to CONCEPTS.md instead
❌ BAD  — Old system references (tech_lead, junior_dev, workflow-* commands)
❌ BAD  — Exhaustive edge cases — keep it practical for new users
```

---

## Constraints
- Only write `docs/USAGE.md` — do not touch any other file
- Cover all 7 commands: /plan, /continue, /amend, /inbox, /context-add, /context-list, /context-remove
- Keep examples realistic and concrete
- Do NOT document opencode.json or dcp.jsonc config options

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
