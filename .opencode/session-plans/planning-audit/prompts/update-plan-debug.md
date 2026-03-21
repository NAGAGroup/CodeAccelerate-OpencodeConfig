# Task 3: Update plan-debug

Your task is to **apply all improvements from the spec to the debug planning DAG**, with specific emphasis on @ContextInsurgent leverage.

## Files to Modify

Location: `/home/jack/.config/opencode/profiles/*/planning/plan-debug/`

Files to update:
1. `prompts/scout.md` — Add @ContextScout parallel dispatch
2. `prompts/agent-routing.md` — Add @ContextInsurgent routing + sequential thinking
3. `prompts/finalize.md` — Refactor into design-plan → preview-gate → write-prompts → finalize (same as generic)
4. `plan.json` — Update nodes to include new finalize nodes + gate
5. `prompts/propose-hypothesis.md` — Add sequential thinking encouragement for hypothesis reasoning
6. `prompts/propose-investigation-shape.md` — Add guidance on ContextInsurgent use for complex investigations

(Optional) Debug-specific prompts: clarify.md

## Key Improvements to Apply (Ref: planning-audit-spec.md)

### 1. Remove Intake Questions (NEW — Improvement #11)
- Modify `bug-intake.md` to **remove all questions**
- Intake should only gather raw information: "Describe the bug, symptoms, reproduction steps"
- All clarifying questions move to `clarify.md` and `evaluate-understanding.md` steps
- Rationale: Agent has zero context at intake; questions block progress; dedicated question steps exist downstream

### 2. Scout Parallel Dispatch
- Same as generic: explicit @ContextScout parallel instruction
- Adapt for debug: "When bug has multiple potential causes, use parallel scouts to explore different code areas"

### 2. Sequential Thinking Integration
- Add to propose-hypothesis.md: "For complex root cause reasoning, consider using sequential-thinking"
- Add to propose-investigation-shape.md: "If investigation is branching (multiple hypotheses), use sequential-thinking to reason through the shape"

### 3. @ContextInsurgent Routing (Emphasis Here)
- This is the **primary focus** for debug DAG
- Modify agent-routing.md to **strongly recommend @ContextInsurgent** for:
  - Complex hypothesis formation (deep codebase reasoning)
  - Investigation shape decisions (architecture understanding)
  - Root cause identification (reasoning across multiple code layers)
- Example: "If hypothesis requires understanding interactions across 3+ code layers, route to @ContextInsurgent for deep reasoning"
- Emphasize in generated prompts that project DAG hypothesis-form nodes should route complex reasoning to @ContextInsurgent

### 4. Web Tools Documentation
- Same as generic: explicit exa_web_search, context7_query-docs for bug-related research

### 5. Finalize Refactoring
- Same structure as generic: design-plan → preview-gate → write-prompts → finalize
- Adapt preview-gate prompt for debug: "Review investigation shape (branching, looping, hypothesis tests)"

### 6. Debug-Specific Optimizations (From Original Review)
- Ensure propose-investigation-shape prompt clearly asks: "Will this investigation branch (multiple hypotheses), loop (refine one), or both?"
- This is the **early branching clarity** improvement from the debug review
- Include explicit guidance: "Branch when multiple root causes are equally likely; loop when refining one hypothesis"

## Inputs Expected

- planning-audit-spec.md (for all 11 improvements)
- Current state of plan-debug/ prompts and plan.json
- Understanding of debug-specific ContextInsurgent routing patterns

## Outputs Expected

Modified files in `/home/jack/.config/opencode/profiles/*/planning/plan-debug/`:
1. scout.md (with @ContextScout, web tools)
2. agent-routing.md (with **strong @ContextInsurgent emphasis**, sequential thinking)
3. propose-hypothesis.md (with sequential thinking, ContextInsurgent mention)
4. propose-investigation-shape.md (with early branching clarity, ContextInsurgent routing)
5. finalize.md → redesigned (same as generic)
6. plan.json (updated with new nodes)

## How to Proceed

1. Read planning-audit-spec.md (general improvements)
2. Read current debug DAG prompts
3. Apply general improvements (scout, web tools, finalize split)
4. **Focus on @ContextInsurgent routing** — emphasize more heavily than in generic
5. Ensure early branching clarity (looping vs. branching decision is explicit early)
6. Update plan.json
7. Call `next_step()` when complete

## Notes

- Debug DAG is the **source** of the 10 improvements; apply them here first, then export to other DAGs
- @ContextInsurgent leverage is critical here — debug requires deep reasoning about complex systems
- The "early branching clarity" improvement is unique to debug; ensure propose-investigation-shape asks this explicitly
- All improvements must reference planning-audit-spec.md

## Success Criteria

- All general improvements applied (scout, web tools, finalize split, sequential thinking)
- @ContextInsurgent routed explicitly in agent-routing and hypothesis/shape prompts
- Investigation shape prompt asks early: "Branch, loop, or both?"
- plan.json is syntactically valid with new nodes
- Ready to proceed to parallel updates of other 3 DAGs
