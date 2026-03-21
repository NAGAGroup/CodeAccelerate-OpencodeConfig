# workflow-audit

**Goal:** Produce a flat list of concrete proposed changes to all four planning workflows (Generic, Debug, Collaborative, Deep Research), organized by workflow, ready to hand off to /plan-generic.

**Open Questions:**
- What improvements and bugs exist in the Generic planning workflow?
- What improvements and bugs exist in the Debug planning workflow?
- What improvements and bugs exist in the Collaborative planning workflow?
- What improvements and bugs exist in the Deep Research planning workflow?

**Findings:**

### Cross-Cutting

**CC-1 — Prompt ADVANCE sections must not reference specific node IDs**
Any hardcoded node IDs in prompt ADVANCE sections go stale whenever the DAG is restructured. Fix: remove all node ID references from ADVANCE sections across all prompt files in all four workflows. They should simply say "call `next_step()`" (no args) — the DAG plugin will present the correct branching options at runtime.

---

### Generic Workflow

**Generic-1 — `review-gate.md` ADVANCE section references wrong node ID**
The prompt instructs HW to call `next_step({ next: "finalize" })` on approval, but the `plan.json` `review-gate` node's `next` array is `["load-schema", "decompose", "clarify"]`. Calling `next_step({ next: "finalize" })` would be rejected by the DAG — `load-schema` and `agent-routing` get skipped. The approved path should advance to `"load-schema"`. (Also subsumed by CC-1.)

**Generic-2 — DAG node order: `load-schema` runs too late**
`load-schema` currently runs after `review-gate` (i.e. after the user has already approved the plan). The schema and planning guidelines should be in context from the very start — before the agent begins scoping, clarifying, or decomposing — so they inform everything the agent produces. Fix: move `load-schema` to be the second node in the DAG, immediately after `session-overview`, for all workflows. Rename to `load-guidelines` (see Generic-4).

**Generic-3 — `decompose` bundles too many cognitive steps**
The `decompose` node currently asks the agent to: (a) dispatch ContextScouts in parallel, (b) synthesize scout findings, (c) decompose into subtasks, and (d) ask about `remaining_visits` for loop nodes. These are four distinct cognitive steps that should be separate nodes. Fix: split into three nodes — `scout` (dispatch and wait), `synthesize` (read findings, form task understanding), `decompose` (write subtasks with agent assignments).

**Generic-4 — `agent-routing` runs after `review-gate`**
The user approves the plan before seeing routing assignments. Routing should be part of what the user reviews, not a post-approval step. Fix: move `agent-routing` before `review-gate` so the user sees and approves the complete plan including delegation assignments.

**Generic-5 — `plan-json-schema.md` should become `plan-design-guidelines.md`**
The shared schema file currently contains only JSON field specs and path resolution rules. Now that `load-guidelines` (formerly `load-schema`) will be a universal early node for all workflows, the file should be expanded to include planning best-practices: one cognitive step per node, prefer smaller nodes, what makes a good subtask prompt, etc. The file should be renamed from `plan-json-schema.md` to `plan-design-guidelines.md`. The `load-schema` node in all four workflow `plan.json` files should be renamed to `load-guidelines` and its `prompt` path updated accordingly.

**References affected by Generic-4 and Generic-5:**
- `opencode/planning/plan-generic/plan.json` — `load-schema` node prompt path
- `opencode/planning/plan-debug/plan.json` — `load-schema` node prompt path
- `opencode/planning/plan-collaborative/plan.json` — `load-schema` node prompt path
- `opencode/planning/plan-deep-research/plan.json` — `load-schema` node prompt path
- `.opencode/session-plans/plan-progress-tracking/prompts/subtask-05-schema-docs.md` — references old filename
- `.opencode/archived-plans/plan-deep-research/prompts/subtask-01-planning-dag.md` — references old filename (archived, low priority)

**Proposed Generic DAG (after all fixes):**
```
session-overview → load-guidelines → task-intake → clarify (loop) → scout → synthesize → decompose → agent-routing → review-gate → finalize
```

---

### Debug Workflow

**Debug-1 — Remove hypothesis loop from planning; validate hypotheses through execution**
The planning session's hypothesis loop adds overhead without value — hypotheses can only be meaningfully validated by running code, reading logs, and executing tests. Planning should produce one well-reasoned initial hypothesis from the gathered context, then hand off to the execution session. Fix: remove `hypothesis-gate` (and its loop back to `hypothesis-form`) from the planning DAG. Replace with a linear flow: `hypothesis-form` produces one best-guess hypothesis, then the DAG advances to `confirm-mode`.

**Debug-2 — Add `confirm-mode` question node to planning DAG**
Before generating the execution session plan, ask the user: *"Should the debugging loop get user confirmation on the diagnosis and hypothesis for each loop?"*
- **Yes** → `finalize` generates an execution session with a `hypothesis-gate` node inside the loop
- **No** → `finalize` generates a fully automatic execution loop (`diagnose → fix → verify`), with `remaining_visits` as the only safety net

This allows lightweight debugging to be fully automatic while complex investigations retain user oversight.

**Debug-3 — Restructure generated execution session loop**
Current generated session (`diagnose.md`, `fix.md`, `verify.md`) has no clear loop structure. The execution session plan should be a proper DAG with a loop:
- **With confirmation:** `session-overview → diagnose → hypothesis-gate → fix → verify → [loop back to diagnose or close]`
- **Without confirmation:** `session-overview → diagnose → fix → verify → [loop back to diagnose or close]`

`verify` decides whether to loop back to `diagnose` (if tests fail) or close the session (if tests pass).

**Proposed Debug planning DAG (after all fixes):**
```
session-overview → load-guidelines → bug-intake → context-gather → hypothesis-form → confirm-mode → agent-routing → finalize
```

---

### Deep Research Workflow

**DeepRes-1 — Add `session-overview` as entry node**
Same as all other workflows (CC-2/CC-3). The planning session entry point should be `session-overview` for consistency and orientation.

**DeepRes-2 — Move `load-guidelines` to second node**
Same as Generic-2. The agent should have schema + best-practices in context before scoping, clarifying, or designing anything.

**DeepRes-3 — Move `agent-routing` before `research-gate`**
Currently `agent-routing` runs after the user approves the session at `research-gate`. Because `research-gate` is the user's last meaningful steer before a 5-iteration automated execution run, the user should see the complete picture — including delegation assignments — before approving. Fix: move `agent-routing` before `research-gate`. Unlike Debug, there is no hypothesis loop concern here — no risk of routing running wastefully inside a loop.

**DeepRes-4 — Remove `load-schema` as a separate post-gate node**
With `load-guidelines` moved to position 2 (DeepRes-2), the late `load-schema` node is redundant. Remove it.

**DeepRes-5 — `research-execute.md` prompt contradicts the unsupervised execution design**
The `research-execute.md` prompt generated by `finalize.md` instructs the agent to surface findings and wait for user direction after each iteration. This directly contradicts the intended behavior: the `research-execute` loop is fully unsupervised — the agent dispatches multiple DeepResearchers in parallel each iteration, accumulates findings into `research-brief.md`, and loops up to N times automatically, without surfacing anything to the user until `synthesis-gate`. Fix: rewrite the generated `research-execute.md` to reflect the actual unsupervised design. The prompt should instruct the agent to dispatch multiple DeepResearchers in parallel, accumulate findings to `research-brief.md`, and loop automatically — no user interaction until the loop counter is exhausted and `synthesis-gate` is reached.

**Proposed Deep Research planning DAG (after all fixes):**
```
session-overview → load-guidelines → research-intake → clarify (loop) → agent-routing → research-gate → finalize
```

---

### Collaborative Workflow

**Collab-1 — Add `session-overview` as entry node**
Same as all other workflows (CC-2/CC-3). The planning session entry point should be `session-overview` for consistency and orientation.

**Collab-2 — Move `load-guidelines` to second node**
Same as Generic-2. The agent should have schema + best-practices in context before scoping, clarifying, or designing anything. Fix: insert `load-guidelines` immediately after `session-overview`.

**Collab-3 — Move `agent-routing` before `seed-gate`**
Currently `agent-routing` runs after the user approves the session structure at `seed-gate`. The user should see and approve the complete picture — including delegation assignments — at the gate. Unlike Debug (where routing after the gate avoids running inside a hypothesis loop), Collaborative has no loop after the gate. No reason to defer routing. Fix: move `agent-routing` before `seed-gate`.

**Collab-4 — Remove `load-schema` as a separate post-gate node**
With `load-guidelines` moved to position 2 (Collab-2), the late `load-schema` node is redundant. Remove it.

**Proposed Collaborative planning DAG (after all fixes):**
```
session-overview → load-guidelines → idea-intake → clarify (loop) → agent-routing → seed-gate → finalize
```

---

### Cross-Cutting (continued)

**CC-2 — `session-overview` prompt must be generated dynamically per session, not shared across all sessions of a workflow type**
Currently every session of a given workflow type (Generic, Debug, Collaborative, Deep Research) loads the same static `session-overview` prompt. This means the agent enters the session with no knowledge of the actual goal, spec file location, or session-specific context. Fix: during `finalize`, generate a `session-overview.md` file specific to each session plan that includes: the session goal, the path to `spec.md` (or other output artifact), workflow-specific operating instructions, and any other session-specific context. This applies to all four workflows.

**CC-3 — Lack of dynamic session-overview causes agent disorientation in generated sessions**
A direct consequence of CC-2: in any generated session (Collaborative, Generic execution, Debug execution, Deep Research execution), the agent does not know what artifact it is writing to or what its role is in that specific session. Protected tool-call returns (prompt content) stay in context and are never compressed, so the agent can read its own node instructions — but only if those instructions contain the right session-specific context. Generating a per-session `session-overview.md` with explicit output artifact paths and role reminders (e.g. "write findings to spec.md — do not implement") would prevent this class of confusion across all generated sessions of all workflow types.
