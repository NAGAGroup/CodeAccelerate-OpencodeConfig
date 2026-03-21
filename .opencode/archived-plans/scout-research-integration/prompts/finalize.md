# Finalize: Scout Research Integration Complete

**Agent:** HW (direct)

## Goal

Verify success and summarize what was accomplished in this planning session.

## What to Do

1. **Verify final state:**
   - The build-verify step reported success (build passes, dist/ is clean)
   - All scout.md files have been updated across the planning DAGs
   - No errors remain in the DAG

2. **Create a summary report** of changes made:

   Save to: `.opencode/session-plans/scout-research-integration/COMPLETION_SUMMARY.md`

   ```markdown
   # Scout Research Integration — Completion Summary

   ## Task Completed
   [Summary of what was done]

   ## Changes Made

   ### Scout Node Updates
   - **plan-generic/prompts/scout.md** — Updated with external research section
   - **plan-debug/prompts/scout.md** — Updated with external research section
   - **plan-collaborative/prompts/scout.md** — Updated with external research section
   - **plan-deep-research/prompts/scout.md** — Updated with external research section

   ### Design Artifacts
   - **scout-research-spec.md** — Specification for research tool integration

   ### Build Verification
   - Build completed successfully
   - dist/ contains all updated components
   - No errors or warnings

   ## What Success Looks Like

   Planning orchestrator (HeadWrench) can now:
   1. Recognize when a planning task targets external resources (APIs, libraries, frameworks)
   2. Dispatch web/context7 searches during the scout phase
   3. Gather external context (documentation, examples, patterns)
   4. Pass findings to the clarify loop and decompose node
   5. Inform task breakdown and agent routing based on external context

   ## Example: Planning Session with Research

   **Scenario:** User starts planning session for "Integrate Stripe payment processing"

   **During planning:**
   1. Task intake: user describes goal
   2. Scout phase: HeadWrench dispatches research
      - Search: "Stripe API integration patterns Node.js"
      - Result: Finds Stripe SDK, webhook examples, payment flow docs
   3. Clarify: user Q&A (informed by research)
   4. Decompose: task broken down using research findings
      - Subtasks: Set up Stripe SDK, implement payment form, handle webhooks, etc.
      - Agent routing: Assign DeepResearcher or ContextInsurgent for Stripe-specific implementation

   **Generated project DAG:** Includes research-aware subtasks and appropriate agent routing

   ## Testing Recommendations

   To verify this works in practice, the user can:
   1. Trigger a planning session with a task mentioning external resources
   2. Observe scout node in action (research dispatch)
   3. Confirm findings are used to inform decomposition
   4. Build and run the generated project DAG

   ## Next Steps

   This planning session is complete. The updated planning DAGs are ready for use.

   Future improvements could include:
   - Add caching for research results (avoid re-searching same topics)
   - Extend research to support more tool types
   - Add research quality metrics (relevance score, result freshness)
   ```

3. **Git commit (if applicable):**
   If working in a git repo, create a commit summarizing the session:
   ```bash
   git add files/planning/*/prompts/scout.md \
           .opencode/session-plans/scout-research-integration/ && \
   git commit -m "feat: add external research to planning DAG scouts

   - Updated scout nodes in plan-generic, plan-debug, plan-collaborative, plan-deep-research
   - Scout now dispatches web/context7 searches for external resources (APIs, frameworks, libraries)
   - Findings inform decompose node for research-aware task breakdown
   - All builds pass; dist/ verified clean
   - Design spec documented in scout-research-spec.md"
   ```

4. **Report completion:**
   - List all files modified
   - Confirm build passed
   - State the session is complete
   - Note any next steps or recommendations

## Success Criteria

- ✅ All scout.md files updated with research integration
- ✅ Build passes without errors
- ✅ dist/ contains correct structure and updated content
- ✅ Design specification documented
- ✅ Completion summary written
- ✅ (Optional) Changes committed to git

## Session Complete

This planning session successfully integrated external research tools into planning DAG scout nodes. The planning orchestrator can now gather context about external resources during planning, enabling more informed task decomposition and agent routing.

**No further action needed.** The session is complete.
