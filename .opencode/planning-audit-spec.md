# Planning DAGs Audit Spec: 11 Improvements

**Authoritative source for all improvements applied during planning-audit session (2026-03-21).**

This document guides updates to all 5 planning DAGs: generic, debug, collaborative, deep-research, deep-review.

---

## Section A: Applicability Matrix

| Improvement | Generic | Debug | Collab | Deep-Res | Deep-Rev | Notes |
|---|---|---|---|---|---|---|
| 1. INFO Phase Optimization | ✓ | ✓ | ✓ | ✓ | ✓ | All 5 DAGs have INFO phases; can be optimized universally |
| 2. Preview Gate Before Approval | ✓ | ✓ | ✓ | ✓ | ✓ | All 5 planning gates benefit from DAG preview before approval |
| 3. Early Branching/Looping Decision | ✓ | ✓ | — | — | — | Debug-specific; generic can have similar "shape decision" clarity |
| 4. Finalize Split (design-plan → preview-gate → write-prompts → finalize) | ✓ | ✓ | ✓ | ✓ | ✓ | All 5 finalize nodes refactored identically |
| 5. Mixed Concerns Decoupling | ✓ | ✓ | ✓ | ✓ | ✓ | Separate education (optional) from decisions (core); all DAGs |
| 6. Intermediate Feedback on Plan Quality | ✓ | ✓ | ✓ | ✓ | ✓ | Preview gates provide this; all 5 DAGs |
| 7. Feedback Loop for Corrections | ✓ | ✓ | ✓ | ✓ | ✓ | Gates allow "reconsider" branches; all 5 DAGs |
| 8. Clearer Branching vs. Looping Explanation | ✓ | ✓ | — | — | — | Debug-specific; clarify upfront what branching/looping means |
| 9. Validation Before Commit | ✓ | ✓ | ✓ | ✓ | ✓ | Finalize node validates plan.json before activation; all 5 |
| 10. Optional Fast-Track Mode | — | ✓ | — | — | — | Debug-specific; high-confidence bugs skip INFO nodes |
| 11. Remove Intake Questions | ✓ | ✓ | ✓ | ✓ | ✓ | All intake steps ask ZERO questions; move to downstream steps |

**Summary:** All 11 improvements apply universally. Improvements 3, 8, 10 have debug-specific flavor; generic/collaborative/deep DAGs apply the universal principle (intake clarity, early shape decision) but not the debug-specific wording.

---

## Section B: Agent & Tool Leverage (Universal)

These four leverage points apply to **all 5 planning DAGs**.

### B1. @ContextScout Parallel Dispatch

**What it is:** Scout tasks explicitly instruct agents to dispatch multiple @ContextScout agents in parallel when exploring multiple codebase areas.

**Why it matters:** Parallel scouts reduce planning time; agent knows this is an available pattern.

**Which DAGs:** All 5

**How to implement:**
- Modify each `scout.md` or equivalent (e.g., context-gather.md in collaborative)
- Add explicit paragraph: "When multiple codebase areas need exploration, use @ContextScout agents in parallel. Each scout handles one area independently, then findings are gathered and consolidated."
- Add example wording: "If this task affects modules A, B, and C, dispatch three @ContextScout agents in parallel to explore each module. Gather findings and use for decomposition."

**Validation criterion:** scout.md explicitly mentions @ContextScout, parallel dispatch, and provides an example.

---

### B2. Sequential Thinking Integration

**What it is:** Planning and generated DAG prompts mention sequential-thinking tool as available for complex reasoning.

**Why it matters:** Agents know they can use structured reasoning for decomposition, branching decisions, and other non-trivial choices.

**Which DAGs:** All 5

**How to implement:**
- Add to: clarify.md, propose-decomposition.md, agent-routing.md (in each DAG)
- Example wording: "For complex decomposition, you may use sequential-thinking to reason through subtask boundaries and dependencies."
- For debug DAG specifically: "If hypothesis formation requires deep reasoning about root causes, use sequential-thinking."
- Generated DAG prompts should show: "For this complex step, consider using sequential-thinking to reason through options before deciding."

**Validation criterion:** Sequential thinking mentioned 10+ times across all 5 DAGs (clarify, decompose, routing); specific examples in generated DAG prompts.

---

### B3. @ContextInsurgent Routing

**What it is:** Agent-routing prompts explicitly recommend @ContextInsurgent for deep reasoning tasks (multi-file codebase understanding, architecture decisions, complex decomposition).

**Why it matters:** Agents know when to route to a more capable model for reasoning-heavy work.

**Which DAGs:** All 5

**How to implement:**
- Modify agent-routing.md in each DAG
- Generic: "For subtasks requiring deep understanding across multiple files or architecture changes, route to @ContextInsurgent."
- Debug (emphasis): "Complex hypothesis formation and root cause identification across multiple code layers → route to @ContextInsurgent. This is the primary case for ContextInsurgent in debug."
- Collaborative: "Design decisions requiring trade-off reasoning → @ContextInsurgent."
- Deep-Research: "Synthesis of findings across multiple sources → @ContextInsurgent."
- Deep-Review: "Quality assessment and standards alignment reasoning → @ContextInsurgent."

**Validation criterion:** @ContextInsurgent mentioned in agent-routing.md of all 5 DAGs with domain-specific reasoning examples.

---

### B4. Web Tools Integration

**What it is:** Scout phases document and route web research tools (exa_web_search, context7_query-docs, exa_get_code_context) with clear dispatch criteria.

**Why it matters:** Planning agents know when and how to use external research tools to inform task decomposition.

**Which DAGs:** All 5

**How to implement:**
- Modify scout.md / context-gather.md in each DAG
- Document tools:
  - `exa_web_search` — General documentation, best practices, patterns
  - `context7_query-docs` — Official API/framework documentation
  - `exa_get_code_context` — Working code examples
- Dispatch criteria: "Use exa_web_search when task involves external APIs, libraries, frameworks. Use context7 for official docs. Use exa_get_code_context for implementation examples."
- Generated DAG execution prompts should show: "If this step involves external libraries, consider using exa_web_search or context7 to gather documentation before implementation."

**Validation criterion:** All 5 scout phases document all 3 tools with decision criteria; generated DAG prompts show 1-2 examples.

---

## Section C: The 11 Flow Improvements

### Improvement 1: Remove Intake Questions

**What it is:** Intake steps gather raw information only; **zero questions asked**. All clarifying questions move to dedicated downstream steps (clarify, evaluate-understanding, etc.) where context exists.

**Why it matters:** Agents have zero context at intake. Questions at intake stall progress and confuse; dedicated question steps downstream use accumulated context.

**Which DAGs:** All 5 (task-intake, bug-intake, idea-intake, research-intake, review-intake)

**How to implement:**
- Remove all `?` characters from intake prompts (except in code examples/headers)
- Reframe as: "Gather information about the task" (not "Ask clarifying questions")
- Move all questions to clarify.md or evaluate-understanding.md
- Example: "task-intake.md" should say "Gather task description, goal, acceptance criteria, constraints" (no questions)

**Validation criterion:** Intake prompts contain zero questions; clarify/evaluate steps contain all context-dependent questions.

---

### Improvement 2: INFO Phase Optimization

**What it is:** Collapse 7 INFO nodes into optional preload; auto-advance pure-context nodes instead of requiring explicit `next_step()`.

**Why it matters:** Procedural ceremony (INFO nodes) blocks planning flow; make it optional and auto-advance.

**Which DAGs:** All 5

**How to implement:**
- (Future work; may require plugin changes) Make INFO phase optional: "Do you need a briefing on planning principles? Yes/No"
- Auto-advance pure-context nodes without requiring user `next_step()` calls
- For now, keep INFO phase but note in planning-gate: "You've reviewed planning principles; INFO phase can be made optional in future"

**Validation criterion:** INFO phase exists and is clearly structured; readiness for future optimization.

---

### Improvement 3: Preview Gate Before Approval

**What it is:** Before user approves plan, show ASCII DAG diagram, node count, branching logic, decision criteria.

**Why it matters:** User can validate DAG structure before finalize writes all artifacts.

**Which DAGs:** All 5

**How to implement:**
- Add `preview-gate` node (gate type) between planning-gate and finalize
- Preview-gate prompt displays:
  - ASCII diagram of planned DAG (simplified)
  - Node count and branching points
  - Decision criteria for gates/loops
  - `remaining_visits` values for loops
- Example ASCII:
  ```
  overview → subtask-1 → subtask-2 → {gate} → path-A / path-B → finalize
  ```

**Validation criterion:** All 5 DAGs have preview-gate node in plan.json; gate displays DAG diagram before approval.

---

### Improvement 4: Finalize Split

**What it is:** Refactor finalize node into: design-plan → preview-gate → write-prompts → finalize (terminal).

**Why it matters:** Separate planning (design DAG structure) from artifact writing; catch structural issues early.

**Which DAGs:** All 5

**How to implement:**
- **design-plan** node: Draft plan.json structure (DAG shape, nodes, branching, loops)
- **preview-gate** node (gate): Show ASCII diagram, ask user to confirm structure
- **write-prompts** node: Write all prompt files
- **finalize** node (terminal): Validate JSON syntax, close session
- plan.json updated with these 3 nodes instead of single finalize

**Validation criterion:** All 5 DAGs have design-plan, preview-gate, write-prompts, finalize in plan.json in correct order.

---

### Improvement 5: Mixed Concerns Decoupling

**What it is:** Separate education (optional) from decision-making (core flow).

**Why it matters:** Users can skip education if they have context; core planning flow is streamlined.

**Which DAGs:** All 5

**How to implement:**
- At planning entry, ask: "Do you need a briefing on planning principles?" (optional)
- If no: skip INFO phase, go straight to task-intake
- If yes: include INFO phase preload
- Document in planning-gate prompt: "Plan structure follows clear decision flow; INFO phase is optional context"

**Validation criterion:** Planning-gate and session-overview mention optional INFO phase; fast-track path available.

---

### Improvement 6: Intermediate Feedback on Plan Quality

**What it is:** Write → Preview → Approve sequence allows user to validate plan before full commitment.

**Why it matters:** Catches DAG structure issues early; user sees actual plan, not just summary.

**Which DAGs:** All 5

**How to implement:**
- (Already covered by Improvement 4: Finalize Split)
- design-plan writes structure → preview-gate shows it → user approves → write-prompts executes

**Validation criterion:** Preview-gate exists and displays DAG before prompts are written.

---

### Improvement 7: Feedback Loop for Corrections

**What it is:** Gates allow "reconsider" branching without feeling like DAG failure.

**Why it matters:** User can refine planning decisions mid-flow without awkward backtracking.

**Which DAGs:** All 5

**How to implement:**
- Planning-gate should have options: "Approve & finalize", "Clarify more", "Reconsider shape", "Refine decomposition"
- Each "reconsider" branches back to appropriate node naturally
- Prompt wording: "Do you want to revisit any planning decisions?" (not "You failed")

**Validation criterion:** Planning-gate has 3+ branching options for refinement; wording is positive ("reconsider", not "failed").

---

### Improvement 8: Clearer Branching vs. Looping Explanation

**What it is:** Prompts define branching and looping upfront; debug DAG asks early "Will investigation branch, loop, or both?"

**Why it matters:** Agents and users know shape implications early; avoid mid-flow corrections.

**Which DAGs:** Debug (primary); Generic can have similar clarity

**How to implement:**
- Debug: propose-investigation-shape prompt defines:
  - **Looping:** Testing ONE hypothesis multiple times with refinement
  - **Branching:** Testing MULTIPLE hypotheses sequentially or in parallel
  - **Both:** Loop on one, then branch to alternatives
- Prompt asks explicitly: "Will this investigation branch (multiple hypotheses), loop (refine one), or both?"
- Generic: propose-shape can similarly define shape implications upfront

**Validation criterion:** Debug propose-investigation-shape prompt defines branching/looping clearly and asks early; generic propose-shape does same for DAG shapes.

---

### Improvement 9: Validation Before Commit

**What it is:** Finalize node validates plan.json syntax, node references, prompt file existence before activation.

**Why it matters:** Prevents broken DAGs from being committed; users discover errors before executing.

**Which DAGs:** All 5

**How to implement:**
- finalize node runs JSON validation: `jq . plan.json`
- Checks all node references in `next` fields exist in `nodes`
- Checks all prompt files exist
- Reports validation result; if failed, loops back to fix

**Validation criterion:** finalize.md includes validation steps; build step (task 6) validates JSON syntax.

---

### Improvement 10: Optional Fast-Track Mode

**What it is:** Debug DAG allows skipping INFO phase for high-confidence bugs; go straight to shape → decompose → finalize.

**Why it matters:** Simple bugs don't need full INFO phase ceremony; fast-track saves time.

**Which DAGs:** Debug (specific)

**How to implement:**
- Debug session-overview asks: "Is this a high-confidence diagnosis?" Yes/No
- If yes: skip INFO nodes, proceed directly to propose-investigation-shape
- If no: full flow with INFO phase
- (May require plugin changes to implement fully; for now, note as future enhancement)

**Validation criterion:** Debug session-overview mentions optional fast-track mode; readiness for future plugin support.

---

### Improvement 11: Early Branching/Looping Decision (Debug-Specific)

**What it is:** After hypothesis proposal, add explicit gate asking: "Will this investigation branch, loop, or both?" (Already covered by Improvement 8.)

**Why it matters:** Prevents mid-planning corrections; surfaces shape implications early.

**Which DAGs:** Debug

**How to implement:**
- (Covered by Improvement 8)

---

## Section D: Implementation Checklist

For each planning DAG update, verify:

```markdown
### Agent & Tool Leverage Checklist
- [ ] Scout tasks mention @ContextScout parallel dispatch explicitly
- [ ] At least 2 prompts mention sequential-thinking tool (clarify, decompose, routing)
- [ ] Agent-routing explicitly routes @ContextInsurgent with domain-appropriate reasoning
- [ ] Scout phase documents exa_web_search, context7_query-docs with dispatch criteria
- [ ] Intake steps contain ZERO questions; all questions in clarify/evaluate steps
- [ ] Generated DAG prompts show 1-2 examples of sequential thinking or web tool use

### Flow Improvements Checklist
- [ ] Improvement 1: Intake questions removed (zero in intake, all in clarify)
- [ ] Improvement 2: INFO phase exists and is structured (readiness for optimization)
- [ ] Improvement 3: Preview gate exists; displays DAG diagram
- [ ] Improvement 4: Finalize split into design-plan → preview-gate → write-prompts → finalize
- [ ] Improvement 5: Planning-gate mentions optional INFO phase
- [ ] Improvement 6: Preview-gate allows user to see plan before write-prompts
- [ ] Improvement 7: Planning-gate has "reconsider" branches with positive wording
- [ ] Improvement 8: Early shape/branching decision asked (generic: propose-shape clarity; debug: investigate-shape clarity)
- [ ] Improvement 9: Finalize validates plan.json syntax
- [ ] Improvement 10: Debug session-overview mentions optional fast-track mode
- [ ] Improvement 11: (Debug-specific) Investigate-shape prompt defines branching/looping upfront

### Final Checks
- [ ] All prompts reference planning-audit-spec.md where applicable
- [ ] plan.json is valid JSON (checked with jq)
- [ ] All prompt files exist and paths in plan.json are correct
- [ ] Domain-specific wording adapted (design patterns vs. research synthesis vs. quality standards)
- [ ] Build passes; dist/ output valid
```

---

## Section E: DAG-Specific Guidance

### E1. plan-generic

**Improvements applied:** All 11 (adapted for generic context)

**Key focus:**
- Remove intake questions; clarify asks scope/context
- Scout parallel dispatch (generic exploration pattern)
- Agent-routing emphasizes @ContextInsurgent for architecture decisions
- Finalize split into design-plan → preview-gate → write-prompts
- Propose-shape clarity: "What unknowns does this shape handle?"

**Files updated:**
- task-intake.md (remove questions)
- scout.md (@ContextScout, web tools, sequential thinking)
- clarify.md (add questions with context)
- agent-routing.md (@ContextInsurgent, sequential thinking for generated DAGs)
- propose-shape.md (early shape clarity)
- finalize.md → design-plan, preview-gate, write-prompts, finalize (in plan.json)

---

### E2. plan-debug

**Improvements applied:** All 11 (with debug emphasis)

**Key focus:**
- Remove intake questions from bug-intake
- Scout parallel dispatch (multiple bug areas)
- @ContextInsurgent strongly emphasized (hypothesis formation, architecture reasoning)
- Propose-investigation-shape: "Branch, loop, or both?" (early clarity)
- Fast-track option: high-confidence bugs skip INFO phase
- Finalize split (same as generic)

**Files updated:**
- bug-intake.md (remove questions)
- scout.md (@ContextScout, web tools)
- clarify.md (add context-aware questions)
- propose-hypothesis.md (add sequential thinking)
- propose-investigation-shape.md (define branching/looping, ask early)
- agent-routing.md (strong @ContextInsurgent emphasis)
- finalize.md → design-plan, preview-gate, write-prompts, finalize

---

### E3. plan-collaborative

**Improvements applied:** All 11 (adapted for design context)

**Key focus:**
- Remove intake questions from idea-intake
- Scout parallel dispatch (explore multiple design areas)
- @ContextInsurgent routed for design trade-off reasoning
- Web tools for design pattern research (exa_web_search)
- Sequential thinking for architecture/design reasoning
- Finalize split (same structure)

**Files updated:**
- idea-intake.md (remove questions)
- context-gather.md (renamed from scout; @ContextScout, web tools)
- clarify.md (add questions with design context)
- agent-routing.md (design-focused @ContextInsurgent routing)
- finalize.md → design-plan, preview-gate, write-prompts, finalize

---

### E4. plan-deep-research

**Improvements applied:** All 11 (adapted for research context)

**Key focus:**
- Remove intake questions from research-intake
- Scout parallel dispatch (explore multiple research areas)
- @ContextInsurgent routed for synthesis across sources
- Web tools heavily used (context7 for docs, exa for sources)
- Sequential thinking for research synthesis and gap analysis
- Finalize split (same structure)

**Files updated:**
- research-intake.md (remove questions)
- context-gather.md (@ContextScout, web tools for research)
- clarify.md (add research-specific questions)
- agent-routing.md (synthesis reasoning → @ContextInsurgent)
- finalize.md → design-plan, preview-gate, write-prompts, finalize

---

### E5. plan-deep-review

**Improvements applied:** All 11 (adapted for review context)

**Key focus:**
- Remove intake questions from review-intake
- Scout parallel dispatch (explore multiple review areas)
- @ContextInsurgent routed for quality assessment and standards reasoning
- Web tools for industry standards research (exa_web_search)
- Sequential thinking for evaluation and judgment calls
- Finalize split (same structure)

**Files updated:**
- review-intake.md (remove questions)
- context-gather.md (@ContextScout, web tools for standards)
- clarify.md (add review-specific questions)
- agent-routing.md (quality assessment → @ContextInsurgent)
- finalize.md → design-plan, preview-gate, write-prompts, finalize

---

## Summary

**11 total improvements:** 4 agent/tool leverage patterns + 7 flow optimizations (plus removal of intake questions as #11).

**All 5 DAGs:** Universal improvements applied; domain-specific wording adapted.

**Build validation:** Task 6 (build-verify) will validate all plan.json files and dist/ output. Task 7 (fix-rebuild) handles issues.

**Commit message:** Will summarize all 11 improvements + 4 leverage patterns.

---

**Written by:** HeadWrench planning orchestrator
**Date:** 2026-03-21
**Session:** planning-audit
