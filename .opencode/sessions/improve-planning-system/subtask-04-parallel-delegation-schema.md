# Subtask 03 — Parallel Delegation Schema

## Delegation
**Agent:** @CodeWriter
**Model:** standard (claude-sonnet) — introducing new schema syntax that must be coherent, self-consistent, and integrated into existing conventions

---

## Objective

Define a parallel group delegation syntax for subtask files so that a single subtask can specify multiple agents working simultaneously on separate scopes. Add this to `session-plan-schema.md` as a first-class feature. Also document in `headwrench.md` how HW launches parallel groups (all Task tool calls in one message) and collects results before proceeding.

---

## Todolist

### 1. Read current state
- [ ] Read `~/.config/opencode/protocols/session-plan-schema.md` — focus on `## Delegation` section and `## Todolist` section of the subtask spec
- [ ] Read `~/.config/opencode/agents/headwrench.md` — focus on current delegation rules and During Sessions section

### 2. Define parallel group syntax in session-plan-schema.md
- [ ] Add a new subsection under the subtask spec: "### Parallel Delegation (Optional)"
- [ ] Define the syntax for a `## Delegation` section that declares a parallel group:
  ```
  ## Delegation — Parallel Group
  This subtask uses parallel delegation. HeadWrench launches all slots simultaneously in a single message.

  ### Slot A — [short description]
  - **Agent:** @CodeWriter
  - **Model tier:** fast
  - **Scope:** [specific files/scope slice for this slot]

  ### Slot B — [short description]
  - **Agent:** @CodeWriter
  - **Model tier:** fast
  - **Scope:** [specific files/scope slice for this slot]
  ```
- [ ] Define the corresponding `## Todolist` structure for parallel subtasks (per-slot sections):
  ```
  ## Todolist

  ### Slot A — [description]
  - [ ] Task for slot A

  ### Slot B — [description]  
  - [ ] Task for slot B
  ```
- [ ] Add a rule: slots must have non-overlapping file scopes (no two slots may edit the same file)
- [ ] Add a rule: parallel group subtasks should use a `## Scope` section with clearly delineated per-slot file lists
- [ ] Add a note: the standard single-agent `## Delegation` format remains valid; parallel groups are opt-in

### 3. Document HW launch mechanics in headwrench.md
- [ ] In `headwrench.md`, add to the delegation section: how to identify a parallel group subtask (check for "## Delegation — Parallel Group" header)
- [ ] Document the launch pattern: all Task tool calls in ONE message, await all results, then proceed to checkpoint
- [ ] Add rule: if any parallel slot fails, treat the whole subtask as failed for circuit breaker purposes

### 4. Commit all changes
- [ ] Stage and commit: `git add -A && git commit -m "feat: add parallel group delegation syntax to schema and HW mechanics"`

---

## Scope
- **Edit:** `~/.config/opencode/protocols/session-plan-schema.md` (subtask spec section — add parallel delegation subsection)
- **Edit:** `~/.config/opencode/agents/headwrench.md` (delegation section — add parallel launch mechanics)
- **Read:** same two files above
- **Write:** nothing new
- **Excluded:** All other files. Do not touch checkpoint.md, plan.md, or subagent definitions.

---

## Patterns

```
✅ GOOD — Parallel group syntax is clearly distinguished from single-agent delegation by header name
✅ GOOD — Slots have named scopes that are explicitly non-overlapping
✅ GOOD — Standard single-agent format remains valid and unchanged
❌ BAD  — Slots that share the same file (race condition on writes)
❌ BAD  — Parallel syntax that requires HW to parse complex YAML or JSON — keep it readable Markdown
❌ BAD  — Making parallel groups the default or required format
```

---

## Constraints
- The syntax must be valid Markdown — no special markup beyond headers and lists.
- The parallel group feature is opt-in: do not change or deprecate the existing single-agent delegation format.
- Slot scopes must be explicitly stated in the delegation section, not just implied.
- The `## Todolist` section remains the source for HW Layer 2 todos regardless of delegation type.

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
