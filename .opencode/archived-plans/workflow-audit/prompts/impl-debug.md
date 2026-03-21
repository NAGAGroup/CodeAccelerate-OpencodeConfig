# Node: impl-debug — Debug Planning Workflow Restructure

This node restructures the Debug planning workflow DAG and rewrites/creates all affected prompt files.

## Target DAG

```
session-overview → load-guidelines → bug-intake → context-gather → hypothesis-form → confirm-mode → agent-routing → finalize
```

Key changes from current:
- Add `session-overview` as entry node
- Move `load-guidelines` to second node
- Remove hypothesis loop from planning DAG (`hypothesis-form` is now linear)
- Remove `hypothesis-gate` from planning DAG entirely
- Add `confirm-mode` node after `hypothesis-form`
- Move `agent-routing` after `confirm-mode` (was after gate)
- `finalize` is terminal

## Step 1 — Rewrite opencode/planning/plan-debug/plan.json

Write a new plan.json reflecting the target DAG above. Key fields:
- `entry`: `"session-overview"`
- All prompt paths: `~/.config/opencode/planning/plan-debug/prompts/{node-id}.md`
- No loop nodes in the planning DAG (hypothesis-form is now a single-pass node)
- `finalize`: terminal node (no `next`)
- Remove: `hypothesis-gate`, `load-schema` nodes

## Step 2 — Write session-overview.md

File: `opencode/planning/plan-debug/prompts/session-overview.md`

Orients the planning agent on its role for a debug planning session.

Content:
- What a debug planning session is (produce an execution session plan for a specific bug)
- The agent's role (bug analyst — gather context, form a best-guess hypothesis, confirm execution mode, then produce)
- The session structure (node-by-node: session-overview → load-guidelines → bug-intake → context-gather → hypothesis-form → confirm-mode → agent-routing → finalize)
- Do NOT start diagnosing or asking questions — just orient and call `next_step()`

## Step 3 — Write load-guidelines.md

File: `opencode/planning/plan-debug/prompts/load-guidelines.md`

Same pattern as generic: brief instruction that guidelines are loaded, internalize before proceeding, call `next_step()`.

## Step 4 — Update bug-intake.md

File: `opencode/planning/plan-debug/prompts/bug-intake.md`

Review and update:
- Remove any hardcoded node IDs from ADVANCE section
- Ensure it captures: symptom, expected behavior, repro steps, acceptance criteria
- One clarifying question at a time
- No diagnosis yet

## Step 5 — Update context-gather.md

File: `opencode/planning/plan-debug/prompts/context-gather.md`

Review and update:
- Remove any hardcoded node IDs from ADVANCE section
- Dispatch ContextScouts in parallel: code path, git log, tests, errors
- Synthesize into 3–6 bullet context summary
- No hypotheses here

## Step 6 — Update hypothesis-form.md

File: `opencode/planning/plan-debug/prompts/hypothesis-form.md`

Key change: this is now a **single-pass node** — no loop. Remove the loop instruction entirely.

Content:
- Read context-gather findings from context
- Produce one best-guess hypothesis (most likely root cause based on evidence)
- Format: Statement, Evidence, Proposed test/fix approach, Confidence level
- Present to user
- Call `next_step()` (no loop option — advances to confirm-mode)

Do NOT generate 2–4 ranked hypotheses anymore. One best-guess only.

## Step 7 — Write confirm-mode.md (new)

File: `opencode/planning/plan-debug/prompts/confirm-mode.md`

This node asks the user one question: whether they want per-loop confirmation during the execution session.

Content:
- Present the proposed hypothesis from context briefly (1 sentence)
- Ask: "Should the debugging execution loop pause for your confirmation on each hypothesis before attempting a fix?"
  - **Yes** → the generated execution session will include a `hypothesis-gate` node in the loop
  - **No** → the loop runs automatically (`diagnose → fix → verify`); `remaining_visits` acts as the safety net
- Use the `question` tool to ask this as a structured choice
- Record the user's answer in context
- Call `next_step()`

## Step 8 — Update agent-routing.md

File: `opencode/planning/plan-debug/prompts/agent-routing.md`

Review and update:
- Remove any hardcoded node IDs from ADVANCE section
- Routing assignments should cover: `diagnose.md` (ContextScout or ContextInsurgent), `fix.md` (JuniorDev), `verify.md` (HW direct)
- If `confirm-mode` selected "Yes", also route `hypothesis-gate.md` (HW direct — no delegation)

## Step 9 — Rewrite finalize.md

File: `opencode/planning/plan-debug/prompts/finalize.md`

Major changes:

**Generated execution session shape depends on confirm-mode answer:**

With confirmation (`confirm-mode: yes`):
- DAG: `session-overview → diagnose (loop: ["diagnose", "hypothesis-gate"]) → hypothesis-gate (gate: ["fix", "diagnose"]) → fix → verify (loop: ["verify", "diagnose"] or terminal) → finalize-output`
- Write: `session-overview.md`, `diagnose.md`, `hypothesis-gate.md`, `fix.md`, `verify.md`, `finalize-output.md`

Without confirmation (`confirm-mode: no`):
- DAG: `session-overview → diagnose (loop: ["diagnose", "fix"]) → fix → verify (loop: ["verify", "diagnose"] or terminal) → finalize-output`
- Write: `session-overview.md`, `diagnose.md`, `fix.md`, `verify.md`, `finalize-output.md`

**CC-2 compliance:** Generate a session-specific `session-overview.md` dynamically:
- Include: the bug description (from bug-intake), the approved hypothesis (from hypothesis-form), execution mode (confirmation on/off), output artifacts
- Do NOT copy a static verbatim template

**diagnose.md** should include the approved hypothesis as the starting point — agents know where to begin.

Terminal node: call `close_session()`, not `next_step()`.

## Step 10 — Verify

- `cat opencode/planning/plan-debug/plan.json` — confirm new DAG structure (no hypothesis loop, no hypothesis-gate in planning)
- `ls opencode/planning/plan-debug/prompts/` — confirm session-overview.md, load-guidelines.md, confirm-mode.md exist
- Check hypothesis-form.md has no loop instruction

## Advance

Call `next_step()` when all steps are complete and verified.
