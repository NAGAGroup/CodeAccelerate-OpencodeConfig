# Task 4: Update Collaborative, Deep-Research, Deep-Review (Parallel)

Your task is to **apply all improvements from the spec to the three remaining planning DAGs** in parallel: plan-collaborative, plan-deep-research, and plan-deep-review.

## Overview

These three DAGs will be updated **in parallel** by separate agents. Each follows the same pattern but adapted for its domain:
- **Collaborative** — Design-focused; emphasizes exploration and refinement
- **Deep-Research** — Knowledge-focused; emphasizes discovery and synthesis
- **Deep-Review** — Quality-focused; emphasizes validation and standards

## Common Files to Modify (All Three)

For each DAG, update:
1. `prompts/scout.md` or `prompts/context-gather.md` — @ContextScout, web tools
2. `prompts/agent-routing.md` — Sequential thinking, @ContextInsurgent routing
3. `prompts/finalize.md` — Refactor into design-plan → preview-gate → write-prompts → finalize
4. `plan.json` — Update nodes

(Optional) clarify/other domain-specific prompts

## Key Improvements (Ref: planning-audit-spec.md)

### Universal (All Three)
1. **Remove Intake Questions** — Intake gathers raw info only; questions moved to dedicated downstream steps with context
2. **@ContextScout Parallel Dispatch** — Explicit instruction for parallel exploration
3. **Sequential Thinking Integration** — Add to clarify, routing, or reasoning steps
4. **@ContextInsurgent Routing** — Route complex decomposition to ContextInsurgent
5. **Web Tools Documentation** — Scout phase dispatch of exa_web_search, context7
6. **Finalize Refactoring** — Same 3-node structure as generic/debug

### Domain-Specific Adaptations

**plan-collaborative:**
- Emphasize web tools for design pattern research (exa_web_search for best practices)
- @ContextInsurgent for design decisions that require deep reasoning about trade-offs
- Suggest sequential-thinking for architecture/design reasoning steps

**plan-deep-research:**
- Emphasize web tools for documentation and academic research (context7 for libraries, exa for sources)
- @ContextInsurgent for synthesizing findings across multiple sources
- Suggest sequential-thinking for research synthesis and gap analysis

**plan-deep-review:**
- Emphasize web tools for standards/best practices research (exa for industry standards)
- @ContextInsurgent for quality baseline assessment and standards alignment reasoning
- Suggest sequential-thinking for evaluation and judgment calls

## Inputs Expected

- planning-audit-spec.md (for common improvements)
- Current state of plan-collaborative/, plan-deep-research/, plan-deep-review/
- Understanding of domain-specific context for each DAG

## Outputs Expected

For each DAG (collaborative, deep-research, deep-review):
1. Updated scout/context-gather.md
2. Updated agent-routing.md (with domain-specific ContextInsurgent guidance)
3. Updated finalize.md (standard 3-node refactor)
4. Updated plan.json
5. Optional: updated clarify.md or other prompts

## How to Proceed

**For Each of Three DAGs:**

1. Read planning-audit-spec.md
2. Read current DAG prompts and plan.json
3. Apply common improvements (scout, web tools, agent-routing, finalize split)
4. Adapt wording for domain context
5. Update plan.json with new nodes
6. Validate syntax
7. Move to next DAG

**Note:** These three can be updated by separate agents in parallel, but the workflow is identical for each.

## Parallel Dispatch Notes

- If this task is dispatched to 3 separate @JuniorDev agents, each gets a copy of this prompt with focus on one DAG
- If executing serially, complete one DAG fully before moving to the next
- All three must be complete before proceeding to cross-dag-validation

## Success Criteria (Each DAG)

- [ ] @ContextScout parallel dispatch documented in scout/context-gather
- [ ] Sequential thinking mentioned in routing/reasoning prompts
- [ ] @ContextInsurgent routed with domain-appropriate justification
- [ ] Web tools documented in scout phase
- [ ] Finalize split into design-plan → preview-gate → write-prompts → finalize
- [ ] plan.json valid, nodes match prompts
- [ ] Domain-specific wording adapted (design patterns vs. research synthesis vs. quality standards)

## Notes

- These DAGs are less complex than generic/debug but follow identical improvement patterns
- The domain adaptation is mainly in prompt **wording**, not **structure**
- All improvements reference planning-audit-spec.md for consistency
- No validation step for these three; cross-dag-validation happens after all are complete
