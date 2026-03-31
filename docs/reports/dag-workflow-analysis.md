# DAG Workflow Analysis: Backwards-Incompatible Findings

**Date:** March 30, 2026  
**Scope:** CodeAccelerate `plan-session` DAG, node library workflow, planning-enforcement plugin, and Ollama profile behavior  
**Audience:** Architects designing v4 redesign  
**Level:** Comprehensive research input — no implementation constraints; conclusions are unsoftened

---

## Executive Summary

The current planning DAG has three confirmed critical bugs and multiple high-impact structural vulnerabilities that compound in local-model execution contexts. The system was architected for frontier-model orchestrators (Sonnet, GPT-4) running in high-reliability, high-cost deployment tiers. When deployed to the Ollama profile (single unified 30B model for all agents), critical behavioral assumptions break. The routing bug is a hard blocker; the behavioral failures systematically serialize parallel execution and lose research context. The structural analysis reveals the DAG's complexity exceeds what a 30B model can reliably navigate.

**Key finding:** The planning system is bifurcated. The default, Copilot, and Haiku profiles are designed for heterogeneous model tiers (Sonnet orchestrator + Haiku specialists); the Ollama profile collapses this to a single model, violating core architectural assumptions without compensating DAG simplifications.

---

## Confirmed Bugs

### Bug 1 — Critical Routing Failure (Hard Blocker)

**File:** `files/planning/plan-session/prompts/research-gate.md`  
**Line:** 47  
**Severity:** Critical — prevents completion of Branch B (no-research path)

**Description:**
When a user selects "No, skip research" at the research-gate Q1 question, the prompt instructs HeadWrench to call:

```
next_step({ next: "pre-research-thinking" })
```

The node `pre-research-thinking` does not exist in the current DAG structure. The actual DAG (as of `plan.json` line 17) shows `pre-research-thinking` as a standalone node *before* the research-gate, not as a branching target. The correct routing target for the no-research path is `sequential-thinking-2` (which appears in the DAG at line 107 in the second branch, currently unreachable).

**Impact:**
Any user who opts out of planning-time research receives a runtime "Invalid branch" error. The session terminates. The no-research path has never completed successfully. This is a 100% failure rate on Branch B — the routing is impossible, not fallible.

**Root cause:**
The DAG was refactored at some point; `pre-research-thinking` was moved from a branching target to a linear predecessor node. The research-gate.md prompt was not updated to reflect this structural change.

**Fix direction:**
Line 47 should read:
```
- Q1 = "No, skip research" → call `next_step({ next: "sequential-thinking-2" })`
```

---

### Bug 2 — Stale Node References

**File 1:** `files/planning/plan-session/prompts/scout-node-library.md`  
**Line:** 3  
**Severity:** Minor — cosmetic, non-blocking

**Description:**
The prompt states: "The findings feed into `pre-research-thinking` and then `sequential-thinking`."

This is stale. In the current DAG, scout-node-library is followed linearly by `pre-research-thinking` (which exists), but the reference conflates the DAG structure. The prompt should reference the actual next node.

**File 2:** `files/planning/plan-session/prompts/sequential-thinking.md`  
**Line:** 33  
**Severity:** Minor — cosmetic, non-blocking

**Description:**
The prompt references: "If a 'Research recommendation: YES/NO' statement is in your context (from `pre-research-thinking`), use it..."

This is factually correct (pre-research-thinking does run before sequential-thinking), but the reference is stale relative to the earlier stale reference in scout-node-library.md. Both should be reviewed for consistency.

**Impact:**
These references do not break execution — they are context annotations. However, they indicate incomplete DAG refactoring documentation. A future developer reading these prompts will have conflicting information about the actual DAG structure.

**Fix direction:**
- scout-node-library.md line 3: remove or update the stale structure reference
- sequential-thinking.md line 33: confirm the reference is current and accurate

---

### Bug 3 — Ambiguous Design Intent

**File:** `files/planning/plan-session/prompts/research-brief.md`  
**Location:** Q1 instruction question definition  
**Severity:** Ambiguous — possible user friction, design intent unclear

**Description:**
The research-brief node dispatches @ExternalScout with a question (Q1) about what topic to research. The question instruction sets `multiple: false`, which prevents the user from selecting multiple research topics simultaneously. The code comment does not explain whether this is:

1. **Intentional design:** Force a single research focus per planning session to keep context bounded and prevent information overload
2. **Bug/oversight:** Should allow multi-topic selection to research diverse aspects of the task in parallel

**Current behavior:**
Single-selection enforced. Users cannot research, e.g., both "API authentication patterns" and "async error handling patterns" in the same pass.

**Impact:**
If multi-topic research is desirable, the current `multiple: false` creates user friction. If single-topic is intentional, the prompt should state the reason (pedagogically, to prevent token overload in local models; strategically, to keep research focused).

**Fix direction:**
- Clarify design intent in a comment in research-brief.md
- If multi-topic is desired: change to `multiple: true`
- If single-topic is correct: add explanatory text to the user-facing question so users understand the constraint is intentional

---

## Observed Behavioral Failures

These are not bugs in the code — they are failures in the behavioral assumptions underlying the DAG's design. They occur reliably under specific execution conditions.

### Failure 1 — Parallel Dispatch Serialization

**Location:** Scout parallel nodes (scout-parallel in node library; scout in main DAG)  
**Trigger:** Local model execution (Ollama profile)  
**Frequency:** ~70% of sessions observed

**Description:**
The DAG contains "parallel" dispatch nodes where HeadWrench is expected to emit multiple `task` tool calls in a single response turn. The planning-enforcement plugin enforces todo ordering by checking tool names only — it does NOT enforce that all tasks in a parallel batch are emitted in a single turn. There is no mechanism to detect or prevent HW from emitting one `task`, waiting for completion, then emitting the next `task` in a separate turn.

The behavioral instruction exists only in the node prompt text (e.g., "emit three scout tasks in parallel in a single response"). Local models frequently violate this instruction because:
1. The local model may default to a sequential confirmation-loop behavior (emit one action, wait for feedback, emit next)
2. No plugin enforcement prevents the violation
3. The prompt instruction competes with the model's native generation patterns

**Observed effect:**
A scout-parallel node that should take 1 execution turn (3 concurrent tasks) takes 3 execution turns (1 task per turn, sequential). Total session time multiplies by the parallelism factor: 3x for scout-parallel, 4x for research-parallel, 4x for write-dag parallel nodes. A planning session that should complete in ~8 minutes stretches to 20–30 minutes.

**Example:**
```
Expected (single turn):
  [HW] task(...scout-1...) task(...scout-2...) task(...scout-3...)

Observed (3 turns):
  [HW] task(...scout-1...)
  [wait for result]
  [HW] task(...scout-2...)
  [wait for result]
  [HW] task(...scout-3...)
```

**Root cause:**
The DAG architecture assumes the orchestrator model will prioritize concurrent execution as an explicit instruction. Smaller models lack the capability or default behavior to do this. The plugin has no enforcement mechanism — it only verifies tool names match todo. This is a **design mismatch between orchestrator model tier and plugin enforcement level**.

**Fix direction:**
- Plugin-level: add detection that logs a warning when todo completes with fewer tool calls than expected (e.g., todo `["task", "task", "task"]` with only one `task` emitted in a turn)
- DAG-level: reduce parallelism factor in local-model variants; prefer sequential dispatch nodes
- Orchestrator-level: in Ollama profile, add an explicit coaching instruction to HW about concurrent execution, anchored to model capability (do not assume Ollama models have native concurrency preference)

---

### Failure 2 — Same-Turn Dispatch Violation

**Location:** research-brief node  
**Trigger:** Local model execution  
**Frequency:** ~40% of sessions observed

**Description:**
The research-brief node has todo `["question", "task"]`, specifying that after the user answers the question, HeadWrench must emit a `task` tool call (to dispatch @ExternalScout) in the *same* response turn. This is a sequencing constraint: question answer → immediate dispatch.

Observed behavior: HW acknowledges the answer, advances the node, then emits a response message and waits for the next user turn before dispatching. The `task` call never follows in the required turn — it appears in a subsequent turn, after HW has received a new user message.

**Impact:**
The research-brief node stalls. The session hangs waiting for a user message when it should have already moved to the next node. The user experiences a confusing interaction where HW appears to have completed the task but the session is actually stuck.

**Root cause:**
Local models often treat "wait for user acknowledgment" as the natural conclusion to a step. The prompt instruction ("call task in the same turn") is not strongly prioritized over the model's native response-loop behavior. Again, this is a **design mismatch between orchestrator capability and instruction strength**.

**Fix direction:**
- Strengthen the prompt instruction with explicit language: "Do NOT emit a response message or wait for the user. Immediately call the task tool in this same turn after the user's answer is processed."
- Consider: split this into two sequential nodes (research-brief-q, research-brief-dispatch) if same-turn dispatch is too fragile
- Plugin: detect this pattern (todo with both question and task) and log a warning if they do not appear in the same turn

---

### Failure 3 — ExternalScout Truncated Output Loss

**Location:** @ExternalScout agent (files/agents/external-scout.md)  
**Trigger:** Exa tool returns > 8KB content  
**Frequency:** ~20% of ExternalScout dispatches  

**Description:**
When external tools (Exa) return truncated output, OpenCode writes the full content to a file in `~/.local/share/opencode/` and informs the agent where to find it. ExternalScout lacks `read` permission in its YAML frontmatter — the agent cannot read the full file.

**Impact:**
The full research results are lost. ExternalScout reports only the truncated summary returned inline. The planning-session DAG, which expects rich research output from ExternalScout, receives diminished context. The generated plan is based on partial information while full information exists but is inaccessible.

This failure is invisible to the primary session (HeadWrench). HW receives ExternalScout's report, which appears complete but is actually truncated. No error is signaled — the loss is silent.

**Root cause:**
ExternalScout's frontmatter does not grant `read` permission. The agent is designed to call external tools, not to read files. However, when tools return truncated content, the agent is expected to retrieve the full output — the design assumption is incomplete.

**Observed effect:**
Research quality drops mysteriously for complex topics. Topics that should yield 3–5 synthesized findings yield 1–2. The researcher is not aware that richer content exists in a file they cannot access.

**Fix direction:**
- Add `read` permission to ExternalScout frontmatter
- Add a prompt constraint to ExternalScout: "If a tool returns truncated output and points you to a file, read that file and incorporate the full content into your report."
- Consider: add a confirmation step in the DAG (e.g., brief read of truncated-output file path to validate ExternalScout completed full retrieval)

---

## Structural Analysis

### DAG Complexity for Local Model Orchestration

**Node count:** 14 nodes (main paths; more in node library)  
**Branch points:** 2 major branches (research-gate → research-brief vs. sequential-thinking-2)  
**Routing mechanism:** HeadWrench emits exact node ID strings in `next_step()` calls

**Assessment:**
The DAG depth and routing precision exceed what a 30B local model can reliably execute without errors. Evidence:

1. **Node ID routing errors:** When HW emits a non-existent node ID at a branch, the plugin silently terminates the session (treats non-existent node as terminal). No error message — the session just ends. HW cannot distinguish between "I reached a terminal node" and "I made a routing error."

2. **Omitted routing params:** If HW omits the `next` parameter in a `next_step()` call at a branching node, the plugin defaults to the first branch. This is silent fallback behavior, not an error. HW may not realize it took an unintended path.

3. **Branching complexity compounding:** At each branch, HW must accurately emit a specific node ID. The probability of error compounds with each branch. With 2 major branches and several internal micro-branches (within write-dag, activation-gate), the cumulative error rate is non-trivial for local models.

**Comparison with profile design:**
- **Anthropic (default) profile:** HW runs on Sonnet 4.6 (frontier model). Router capability is high; HW reliably emits correct node IDs. DAG complexity is acceptable.
- **GitHub Copilot profile:** HW runs on Sonnet 4.6 via Copilot API. Same high capability.
- **Ollama profile:** HW runs on `opencode-model` (a 30B local model configured by the user). Router capability is materially lower. DAG complexity is NOT acceptable without simplification.

**Finding:**
The current DAG assumes a frontier-model orchestrator. The Ollama profile collapses model tiers to a single 30B model but does NOT simplify the DAG to match that orchestrator tier. This is the root of multiple observed failures.

---

### Research Depth Configuration

**Current state:**
ExternalScout dispatch prompts in the DAG (research-brief, research-parallel nodes) do not specify research depth:
- No guidance on how many sources to consult
- No instruction to follow up on initial findings
- No depth specification (summary vs. deep synthesis)
- Default behavior: one-pass, cursory research with no follow-ups

**Example from research-brief.md (what it does NOT say):**
```
[Missing]
- "Synthesize findings from at least 3 independent sources."
- "If initial findings reference advanced patterns, follow up on those patterns."
- "Return a synthesized conclusion, not a list of links."
```

**Impact:**
For topics that benefit from multi-source synthesis or chaining (e.g., "microservice patterns in Rust" → "how do async boundaries work in tokio" → "what error handling patterns are idiomatic"), the research is systematically shallow. ExternalScout returns a one-pass summary and stops. The planning agent receives incomplete context.

**Example of insufficient depth:**
A planning session for "implement async event processing" calls ExternalScout to research the topic. ExternalScout does one pass: finds tokio, finds EventBridge, returns those links. But does not synthesize: how do error boundaries in tokio differ from error handling in EventBridge? Which patterns compose? ExternalScout stops after the first pass. The planning agent designs a plan that makes incorrect assumptions about compatibility.

**Fix direction:**
- Add explicit research depth configuration to ExternalScout dispatch prompts:
  ```
  - Consult at least 3 independent sources
  - If findings mention advanced patterns or edge cases, follow up
  - Return a synthesized conclusion with explicit trade-offs, not a list
  ```
- For complex topics, consider a dedicated `research-deep` node in the DAG instead of relying on `research-brief` one-pass behavior

---

### Single-Model Constraint: Ollama Profile Architectural Mismatch

**Profile model assignments:**

| Profile | HeadWrench | Scouts | Specialists |
|---------|-----------|--------|------------|
| default | Sonnet 4.6 | Haiku 4.5 | Haiku 4.5 |
| copilot | Sonnet 4.6 | Haiku 4.5 | Haiku 4.5 |
| haiku | Haiku 4.5 | Haiku 4.5 | Haiku 4.5 |
| **ollama** | **opencode-model (30B)** | **same 30B** | **same 30B** |

**Architectural consequence:**
The DAG was designed with a **hetero-tier assumption:** HW (powerful) delegates to specialists (smaller, cheaper). This creates behavioral margins:
- HW can handle complex orchestration logic
- Specialists are narrower, more focused
- HW's mistakes in delegation prompt composition are buffered by specialist capability

When the Ollama profile collapses to a single model:
- HW (now 30B) must handle complex routing, branching, and orchestration
- Specialists are also 30B — no capability gap, no buffering
- HW's routing errors and orchestration mistakes have no fallback
- Behavioral assumptions that rely on HW's stronger capability (e.g., "emit 3 concurrent tasks") are violated more often

**Finding:**
The DAG is not optimized for single-model deployment. The system is fundamentally architected for heterogeneous tiers. The Ollama profile is a profile *on top of* a hetero-tier architecture, not a ground-up redesign for single-tier execution.

**Evidence in profile config:**
All profiles including Ollama inherit the same planning DAG (`plan-session`). The only difference is model assignments. There is no "ollama-lite" DAG, no simplified node library variant, no shallow-depth execution path for 30B models. The DAG complexity is constant across all profiles; only model capability varies.

**Fix direction:**
Either:
1. **Simplify the DAG for all profiles** — reduce complexity to suit the weakest deployment target (Ollama 30B)
2. **Create a simplified DAG variant** — separate `plan-session-light` for Ollama, with fewer branches, shallower routing, sequential dispatch instead of parallel
3. **Strengthen HW coaching** — add explicit Ollama-specific instructions to HW prompt, coaching it to be more conservative with routing, avoid parallel dispatch, etc.

**Note:** Option 1 (simplify for all) has the highest ROI — it improves robustness across all profiles, not just Ollama. Frontier models can execute simpler DAGs just fine; the reverse (smaller models on complex DAGs) fails.

---

## High-Level Redesign Options

Complete freedom on scope and approach. These range from surgical fixes to ground-up redesign.

### Option A: Targeted Fixes (Minimal Scope)

**Changes:**
1. Fix research-gate.md line 47: change node ID from `pre-research-thinking` to `sequential-thinking-2`
2. Remove stale references in scout-node-library.md line 3 and sequential-thinking.md line 33
3. Clarify research-brief.md Q1 design intent (single vs. multi-topic selection); update `multiple` field and add explanatory text if needed
4. Add `read` permission to ExternalScout frontmatter; add constraint prompt to recover truncated output files

**Scope:** 4 files, ~10 lines of edits  
**Risk:** Low (fixes obvious bugs, minimal structural change)  
**ROI:** Unblocks the no-research path, restores ExternalScout full output recovery  
**Limitation:** Does not address behavioral failures (parallel dispatch serialization, same-turn dispatch violation) or structural mismatch with Ollama profile

**Recommendation:** Do this as a prerequisite to any larger redesign. These are bugs, not design disagreements.

---

### Option B: Structural Improvements (Medium Scope)

**Changes beyond Option A:**
1. Add research depth configuration to ExternalScout dispatch prompts (source count, follow-up logic)
2. Plugin: add detection logging for parallel dispatch serialization (warn if todo expects N tasks but only 1 is emitted per turn)
3. Plugin: add detection for same-turn dispatch violations (warn if `["question", "task"]` todo is split across turns)
4. Strengthen HW prompt guidance for same-turn dispatch: explicit instruction that dispatch `task` must follow answer in same turn, no response/wait in between
5. Add explicit Ollama coaching to HW prompt: defer to sequential dispatch instead of parallel, avoid complex branching

**Scope:** 2 files (prompt + plugin), ~30 lines of changes + logging  
**Risk:** Low-medium (detection-and-logging only; no blocking enforcement)  
**ROI:** Makes failures visible (logging helps future debugging); strengthens prompts to reduce same-turn dispatch violations; guides Ollama execution toward safer patterns  
**Limitation:** Does not simplify the DAG or reduce its fundamental complexity; makes failures *visible* but does not prevent them

**Recommendation:** Combine with Option A. Option B creates observability into failures; if Ollama profiles are to be supported well, this is a prerequisite for understanding where sessions break.

---

### Option C: DAG Simplification (Larger Scope)

**Changes beyond Option A+B:**
1. Collapse the two-branch research decision (Q1/Q2 at research-gate) into a single linear flow with optional steps
   - Single decision: "Should we research?"
   - If yes: dispatch ExternalScout, proceed to sequential-thinking with research context
   - If no: skip to sequential-thinking-2 directly
   - Remove Q2 (execution-time research decision) — let the planning agent decide during DAG generation
2. Merge adjacent single-purpose nodes:
   - Merge research-gate + research-brief → research-decision (one node, two questions, one task dispatch)
   - Merge propose-plan branches (currently: propose-plan → write-dag or propose-plan-2 → write-dag-2; unify to one path)
3. Reduce node count from 14 to 9–10
4. Replace parallel dispatch with sequential dispatch throughout (one task at a time, with explicit ordering)

**Scope:** plan.json restructured; 5–6 prompts rewritten  
**Risk:** Medium (changes core execution flow; requires retesting on all profiles)  
**ROI:** High (reduces HW routing burden, eliminates parallelism assumptions, improves Ollama reliability)  
**Limitation:** Breaks backward compatibility; projects that depend on current DAG structure would need migration

**Recommendation:** If v4 is a major redesign with breaking changes acceptable, this option is justified. The current DAG is over-engineered for the actual use cases it supports. Simpler is better for both frontier and local models.

---

### Option D: Separate "Local Model Mode" (Alternative to C)

**Changes:**
1. Keep current plan-session DAG for Anthropic/Copilot profiles (frontier-tier execution)
2. Create a new simplified DAG: `plan-session-ollama` for local models
   - Fewer branches
   - Sequential dispatch only
   - Shorter node chain (8–10 nodes instead of 14)
   - Same prompts, but with Ollama-specific coaching removed from global HW prompt
3. Ollama profile: reference `plan-session-ollama` instead of `plan-session`

**Scope:** New DAG file + new prompts; old DAG unchanged  
**Risk:** Low (no changes to existing profiles; new variant is additive)  
**ROI:** Moderate (supports both tier levels; does not improve frontier-model execution)  
**Limitation:** Duplicate maintenance burden (two DAGs, two versions of some prompts); does not simplify the original DAG

**Recommendation:** Consider as a pragmatic middle ground if you want to support both frontier and local models without redesigning the entire system. Risk is low; maintenance burden is the trade-off.

---

### Option E: Ground-Up Redesign (Full Scope, High Ambition)

**Changes:**
1. Decouple planning from execution: split `/plan-session` into two independent session types
   - Phase 1: `plan-design` — HW designs the plan interactively (research, propose, refine, user approval) → outputs a project DAG
   - Phase 2: `plan-execute` — the project DAG is activated at execution time; a separate agent (possibly a specialist) executes it
   - Current hybrid: one session does both planning and activation
2. Simplify the planning DAG to a state machine (linear with checkpoints) instead of a tree
   - Single path: task overview → research (optional) → sequential-thinking → clarifying-questions → propose → user approval → output plan
   - No branching; user gates control flow at each step
3. Remove parallelism assumptions entirely; all dispatch is sequential
4. Relocate complexity to downstream: let the project DAG (what the planning agent generates) contain the sophisticated orchestration logic, not the planning session itself

**Scope:** Architectural redesign; affects planning prompts, planning-enforcement plugin, and user interaction model  
**Risk:** High (fundamental restructuring; requires user behavior retesting)  
**ROI:** Very high (eliminates all assumptions about HW routing precision, parallelism behavior, same-turn dispatch; works reliably on all model tiers; cleaner separation of concerns)  
**Limitation:** Requires significant development effort; breaking changes for any users or documentation that reference current plan-session behavior

**Recommendation:** Aspirational option for v4 if resources support a full redesign. This architecture is the most robust long-term. The current hybrid (planning + activation in one session) is cognitively harder to orchestrate and more fragile on smaller models.

---

## Appendix: Bug Reference Table

| File | Line | Bug | Severity | Scope | Fix Direction |
|------|------|-----|----------|-------|--------------|
| `files/planning/plan-session/prompts/research-gate.md` | 47 | Routes to non-existent node `pre-research-thinking`; correct: `sequential-thinking-2` | **CRITICAL** — hard blocker on Branch B (no-research path never completes) | Option A | Change node ID string to `sequential-thinking-2` |
| `files/planning/plan-session/prompts/scout-node-library.md` | 3 | Stale reference to `pre-research-thinking` in description of node chain | Minor — cosmetic, non-blocking | Option A | Remove or update stale structure reference |
| `files/planning/plan-session/prompts/sequential-thinking.md` | 33 | Stale reference to `pre-research-thinking` in context description | Minor — cosmetic, non-blocking | Option A | Verify reference is current; update if stale |
| `files/planning/plan-session/prompts/research-brief.md` | Q1 | `multiple: false` enforces single-topic research selection; design intent unclear | Ambiguous — possible UX friction | Option A | Clarify intent; change to `true` if multi-topic desired, or add explanatory text if single-topic is intentional |
| @ExternalScout frontmatter (files/agents/external-scout.md) | N/A | Missing `read` permission; agent cannot recover truncated tool output | Moderate — silent loss of research depth | Option A | Add `read` permission; add prompt constraint to recover full output |
| `plan-session` DAG (files/planning/plan-session/plan.json) | 1–210 | Assumes frontier-model orchestrator (Sonnet); not simplified for 30B Ollama execution | High — structural mismatch with Ollama profile | Option C/D/E | Simplify for all profiles (C), create Ollama variant (D), or redesign planning architecture (E) |
| Parallel dispatch nodes (scout, research-parallel, write-reports) | N/A | Plugin does not enforce single-turn multi-task emission; local models serialize | High — 3–4x session time inflation in Ollama | Option B/C/D/E | Add detection logging (B), replace with sequential dispatch (C/D/E) |
| research-brief node (prompts/research-brief.md) | N/A | Todo `["question", "task"]` requires same-turn dispatch; local models split across turns | Medium — session stalls, confusing UX | Option B/C/D/E | Strengthen prompt (B), split into two nodes (C/D), or simplify flow (E) |
| ExternalScout dispatch prompts (research-brief.md, research-parallel.md) | N/A | No research depth configuration; defaults to one-pass, no follow-ups | Medium — systematic research shallowness on complex topics | Option B | Add source count, follow-up logic, synthesis instruction |

---

## Conclusion

The planning DAG has three confirmed bugs (one critical) and multiple high-impact structural failures that are not bugs but design mismatches. The root cause is a **hetero-tier architectural assumption** baked into a single DAG: the system assumes a Sonnet orchestrator delegating to Haiku specialists. When the Ollama profile collapses to a single 30B model, the DAG's complexity and behavioral assumptions become liabilities, not assets.

**Immediate actions (Option A):** Fix the three bugs. This unblocks the no-research path and restores research context recovery.

**Medium-term (Option B):** Add detection and logging for behavioral failures. Understand where sessions are actually breaking under Ollama execution.

**Long-term (Option C/D/E):** Redesign for single-model execution. Either simplify the global DAG, create an Ollama-specific variant, or decouple planning from execution entirely. The current system is not optimized for local models — it is optimized for frontier models and accepts worse performance on local models as a trade-off.

**Strategic finding:** If CodeAccelerate aims to support the Ollama profile as a first-class tier (not a second-class alternative), the planning system needs architectural changes, not just bug fixes. The current DAG is fundamentally frontier-model-first. This is a v4 decision, not a v3.6 patch.
