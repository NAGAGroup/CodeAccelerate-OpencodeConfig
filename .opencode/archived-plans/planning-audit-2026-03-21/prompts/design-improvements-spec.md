# Task 1: Design Improvements Spec

Your task is to **write the authoritative specification document** for all improvements that will be applied to the 5 planning DAGs.

## What You're Writing

Create `.opencode/planning-audit-spec.md` — a single-source-of-truth document that will guide all downstream DAG updates. This spec must be:
- **Clear and actionable** — Each improvement has concrete implementation guidance
- **Applicable across all 5 DAGs** — Identify which improvements apply universally vs. flow-specific
- **Referenceable** — Each downstream subtask (update-plan-generic, update-plan-debug, etc.) will cite specific sections
- **Validated checklist** — Include a checklist for validating that all improvements are applied

## Source Material

You have two sources:

### 1. The 11 Improvements (10 from Debug-Review + 1 User Addition)

From the user's initial message and follow-up, these improvements were proposed:
1. **INFO Phase Optimization** — Collapse 7 INFO nodes into optional preload; auto-advance pure-context nodes
2. **Preview Gate Before Approval** — Show ASCII DAG diagram, node count, branching points, decision criteria before user approval
3. **Early Branching/Looping Decision** — After hypothesis proposal, ask explicitly: "Will this branch, loop, or both?"
4. **Finalize Split** — Break into design-plan → preview-gate → write-prompts → finalize
5. **Mixed Concerns Decoupling** — Separate education (optional) from decision-making (core flow)
6. **Intermediate Feedback on Plan Quality** — Write → Preview → Approve sequence before full commit
7. **Feedback Loop for Corrections** — Add "Confirm?" gates after major decisions; allow looping without DAG backtracking
8. **Clearer Branching vs. Looping Explanation** — Define terms upfront in prompts
9. **Validation Before Commit** — Validate plan.json syntax and node references before activation
10. **Optional Fast-Track Mode** — High-confidence bugs can skip INFO nodes and go straight to shape → decompose → finalize
11. **Remove Intake Questions** — Intake steps must gather raw information only; questions belong in dedicated clarify/evaluation steps downstream where context exists

### 2. Agent & Tool Leverage Issues

From the user's audit scope:
- **Scout parallel dispatch** — Scout tasks must explicitly instruct @ContextScout agents to work in parallel
- **Sequential thinking integration** — Prompts must encourage use of sequential-thinking tool in both planning and generated DAGs
- **@ContextInsurgent leverage** — Agent-routing must explicitly route complex decomposition to @ContextInsurgent
- **Web tools integration** — Scout nodes must route exa_web_search and context7_query-docs; project DAG execution prompts must show examples

## Spec Structure

Write the spec with these sections:

### Section A: Applicability Matrix
Table showing which improvements apply to which DAG types:
- Generic (all 9 improvements apply? or subset?)
- Debug (all 9 + debug-specific optimizations?)
- Collaborative (all 9 + design-specific adaptations?)
- Deep-Research (all 9 + research-specific?)
- Deep-Review (all 9 + quality-specific?)

### Section B: Agent & Tool Leverage (Universal)
Subsections for:
1. **@ContextScout Parallel Dispatch** — What scout tasks must do; example wording
2. **Sequential Thinking Integration** — Where and how to mention sequential-thinking tool; example prompts
3. **@ContextInsurgent Routing** — When decompose phase routes to ContextInsurgent; reasoning
4. **Web Tools Integration** — Scout phase dispatch of exa_web_search/context7; project DAG examples

### Section C: The 11 Flow Improvements
For each improvement (1-11 above), provide:
- **What it is** — Brief description
- **Why it matters** — Impact on user experience / planning efficiency
- **Which DAGs** — Applies to generic, debug, all, etc.
- **How to implement** — Concrete steps with code examples
- **Validation criterion** — How to check it was applied

### Section D: Implementation Checklist
A checklist for validating that all improvements are applied to a given DAG:
```
- [ ] Scout tasks instruct @ContextScout parallel dispatch
- [ ] Sequential thinking mentioned in clarify/decompose/agent-routing prompts
- [ ] @ContextInsurgent routed in agent-routing
- [ ] Web tools documented in scout phase
- [ ] Intake steps have NO questions (info gathering only)
- [ ] Clarify/evaluate steps contain all questions (context-aware)
- [ ] Improvement #1 applied: [details]
- [ ] Improvement #2 applied: [details]
- ... (one per improvement)
- [ ] All prompts updated; plan.json valid
- [ ] Build passes
```

### Section E: DAG-Specific Guidance
Subsections for generic, debug, collaborative, deep-research, deep-review:
- Which improvements apply
- Any flow-specific adaptations needed
- Examples of how agents will reference this spec during updates

## Output Format

Write in **Markdown**. Use tables, code examples, and clear subsections. The spec should be readable but comprehensive — ~500-800 words total, organized for quick reference.

## Inputs Expected

- User's initial message describing the 10 improvements (provided in session-overview)
- Your understanding of each planning DAG's structure (from memory/codebase knowledge)

## Outputs Expected

Write `.opencode/planning-audit-spec.md` with:
- Full spec document (sections A-E above)
- Ready to be cited by downstream update subtasks

## How to Advance

Once you've written the spec:
1. Review it for clarity and completeness
2. Call `next_step()` to proceed to the spec-approval-gate where user will review

**Note:** You will not see the user's approval here; the gate is handled separately. Simply write the spec, review it for sense-checking, and call `next_step()` when ready.
