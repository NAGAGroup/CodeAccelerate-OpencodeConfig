# Task 5: Cross-DAG Validation

Your task is to **audit all 5 updated planning DAGs for consistency** and ensure all improvements are applied uniformly.

## Agent: @ContextScout

This is a **read-only codebase exploration task** — ideal for @ContextScout. You will survey all 5 planning DAGs and report findings.

## What to Validate

### 1. Intake Questions Removed (Improvement #11)
- [ ] All intake steps (task-intake, bug-intake, idea-intake, research-intake, review-intake) have **NO questions**
- [ ] Intake prompts only gather raw information: task/bug/idea description, goal, constraints
- [ ] All clarifying questions moved to dedicated downstream steps (clarify, evaluate-understanding, etc.)
- [ ] Cross-check: count question marks in intake prompts; should be 0 (or only in examples/headers)

### 2. Agent Dispatch Consistency
- [ ] All 5 DAGs have scout tasks that mention @ContextScout (explicitly)
- [ ] All 5 mention parallel dispatch pattern ("use @ContextScout agents in parallel when...")
- [ ] No variation in guidance (all consistent)

### 3. Sequential Thinking Mentions
- [ ] Generic DAG prompts mention sequential-thinking tool (clarify, decompose, routing)
- [ ] Debug DAG prompts mention sequential-thinking (hypothesis, shape, routing)
- [ ] Collaborative DAG mentions sequential-thinking for design reasoning
- [ ] Deep-Research DAG mentions sequential-thinking for synthesis
- [ ] Deep-Review DAG mentions sequential-thinking for evaluation
- [ ] Count total mentions across 5 DAGs (should be 10+)

### 4. @ContextInsurgent Routing
- [ ] Generic: agent-routing.md mentions @ContextInsurgent for deep reasoning
- [ ] Debug: agent-routing.md **emphasizes** @ContextInsurgent (stronger language expected)
- [ ] Collaborative: agent-routing.md routes to @ContextInsurgent for design decisions
- [ ] Deep-Research: agent-routing.md routes to @ContextInsurgent for synthesis
- [ ] Deep-Review: agent-routing.md routes to @ContextInsurgent for quality assessment
- [ ] Count total mentions and routing justifications

### 5. Web Tools Documentation
- [ ] All 5 DAGs mention exa_web_search or context7 in scout phase
- [ ] Dispatch criteria documented (when to use each tool)
- [ ] No orphaned tool references (tools mentioned actually exist)

### 6. Finalize Refactoring
- [ ] All 5 have updated plan.json with design-plan node
- [ ] All 5 have preview-gate node (gate type with branching)
- [ ] All 5 have write-prompts node (or merged into finalize)
- [ ] All 5 have terminal finalize node
- [ ] plan.json syntax valid (valid JSON, no trailing commas)
- [ ] Node references in prompts/ match plan.json nodes

### 7. The 11 Improvements Coverage
From planning-audit-spec.md, check that each improvement is applied:
- [ ] Improvement 1: Remove intake questions (checked above)
- [ ] Improvement 2: INFO phase optimization (if applicable)
- [ ] Improvement 3: Preview gate (checked above)
- [ ] Improvement 4: Early branching/looping clarity (debug specifically)
- [ ] Improvement 5: Finalize split (checked above)
- [ ] Improvement 6: Mixed concerns decoupling (education vs. decision)
- [ ] Improvement 7: Intermediate feedback (preview gate)
- [ ] Improvement 8: Feedback loops (gates allowing "reconsider")
- [ ] Improvement 9: Branching vs. looping clarity (debug specifically)
- [ ] Improvement 10: Validation before commit (will check at build step)
- [ ] Improvement 11: Fast-track mode (if applicable)

## Output Expected

Write a **validation report** with:

1. **Summary Table** — 5 rows (one per DAG), columns for each validation category (agent consistency, sequential thinking, @ContextInsurgent, web tools, finalize, improvements coverage)
2. **Detailed Findings** — For each DAG:
   - What's working well
   - Any inconsistencies or missing items
   - Recommendations (if any)
3. **Cross-DAG Consistency Score** — Percentage of all checks passed
4. **Blockers** — Any critical issues that would prevent build/activation

Format: Markdown with tables and bullet points. Aim for ~300-500 words.

## If Validation Passes

All 5 DAGs are consistent and ready for build. Call `next_step()` to proceed to build-verify.

## If Validation Finds Issues

Document them in the report. The fix-rebuild loop will address issues found during build. If issues are critical (e.g., broken plan.json syntax), note them for immediate fixing.

## Notes

- You are reading configuration and prompt files, not executing code
- Focus on consistency across DAGs, not perfection (minor wording differences are OK)
- This is a **before-build** validation; the actual build will catch syntax errors
- Report findings clearly so the fix-rebuild step can address issues efficiently

## Inputs Available

- All 5 planning DAG directories: `/home/jack/.config/opencode/profiles/*/planning/plan-{generic,debug,collaborative,deep-research,deep-review}/`
- planning-audit-spec.md (for reference on what improvements should be present)
- Memory of the 10 improvements from the user's initial message

## Success Criteria

- Validation report written and clear
- All consistency checks documented
- No critical blockers identified (or clearly noted if found)
- Ready to proceed to build-verify
