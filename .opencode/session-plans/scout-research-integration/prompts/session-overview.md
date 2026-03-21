# Session: Scout Research Integration

## Task Goal

Integrate minimal external research tools (websearch, context7) into planning DAG scout nodes so that the planning orchestrator (HeadWrench) can gather context about external resources (APIs, frameworks, code patterns) during the scout phase, before task decomposition. Research findings will inform task breakdown and agent routing.

## Acceptance Criteria

1. Scout nodes in planning DAGs (focus: plan-generic, extend to others) include instructions for HeadWrench to dispatch web/context7 searches when tasks mention external resources
2. Research findings are captured and passed to the decompose node for informed task breakdown
3. All applicable planning DAGs receive updates (generic, debug, collaborative, deep-research minimum)
4. Build passes cleanly; dist/ reflects all changes
5. Existing planning workflows remain functional (no breaking changes)

## DAG Shape: 1B (Linear with Loop)

This is a **linear sequence with a bounded build-test-fix loop**:

```
session-overview 
  ↓
audit-scout-nodes 
  ↓
design-research-spec 
  ↓
update-generic-scout 
  ↓
update-other-scouts 
  ↓
build-verify ←─── (loops on failure, remaining_visits: 5)
  ├─ success → finalize
  └─ failure → fix-rebuild → (back to build-verify)
```

**The loop handles:**
- Build failures (fix the root cause and retry)
- Scope discovery (if all DAGs need updates or a subset)

## High-Level Workflow

1. **Audit:** Read all planning DAG files to understand current scout node implementation
2. **Design:** Write a specification for how to integrate research tools (which tools, when, output format)
3. **Update Generic:** Rewrite plan-generic/scout.md to include HeadWrench research instructions
4. **Update Others:** Apply the same pattern to debug, collaborative, deep-research scouts
5. **Build & Verify:** Run `bun run build` and validate dist/ output
6. **Fix Loop:** If build fails, analyze the error, fix, and rebuild (up to 5 attempts)
7. **Finalize:** Verify success and summarize changes

## Key Context

- **Research dispatch:** HeadWrench (planning orchestrator) will call web/context7 tools **directly during planning**, not delegating to @DeepResearcher
- **Scope:** External resources mean APIs, libraries, frameworks, third-party systems
- **Minimal:** Scout gathers context only; it does NOT solve the task—that's what the generated project DAG does
- **Integration point:** Findings flow from scout → clarify loop (if user Q&A needed) → decompose (for informed subtask routing)

## What Success Looks Like

- All planning DAG scout.md files updated with research capability
- Build completes without errors
- dist/ contains updated scout prompts with research tool references
- No existing planning workflows are broken
- User can trigger research during planning for external-resource tasks

## Notes

- The loop will attempt up to 5 build-test cycles before surfacing decision to user
- If build issues persist after 5 attempts, the DAG enters "failed" state and prompts for reset
- All prompts are worktree-relative paths in `.opencode/session-plans/scout-research-integration/prompts/`

Now advance to the first task: auditing current scout nodes.

Call `next_step()` when ready to begin.
