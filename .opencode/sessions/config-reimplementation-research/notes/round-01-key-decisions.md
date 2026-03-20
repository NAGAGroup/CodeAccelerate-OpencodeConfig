# Round 01 — Key Decisions & Design Direction

**Session:** config-reimplementation-research  
**Created:** 2026-03-19

## Core Research Finding

Plan-and-Execute with typed artifacts is the production-validated pattern. Markdown subtask files are a functional approximation but lack critical properties the research prescribes.

## The 5 Principal Design Divergences

1. **Artifact structure**: Markdown lacks parallelization semantics, dependency modeling, and resumption metadata. Research prescribes structured data (JSON/typed artifact) with explicit step IDs, dependency DAG, parallelizable_with fields, and resumption points.

2. **Mode differentiation**: All planning modes currently produce the same flat file structure. Research shows research/debug/collaborative/feature modes must produce structurally different artifacts — especially collaborative mode (needs "possible continuations" from decision points).

3. **Plan production quality**: Current flow is single-pass generation. Multi-step synthesis (generate→evaluate→synthesize) outperforms single-pass by 10-30% in structured reasoning tasks.

4. **Pre-execution validation**: No validation gate in current flow. Research indicates ~15-25% of plans are infeasible before execution begins. A validation gate before execution start would catch these.

5. **Executor routing**: All tasks currently assigned to one executor type (session-local-implementer). LLMCompiler shows 3.7x latency speedup and 6.7x cost savings via explicit parallelization + role-specific routing.

## Key Findings Summary

- **Plan-and-Execute** is the dominant production architecture (Huss, Oracle Developers blog)
- **LLMCompiler** (Kim et al., ICML 2024): parallel execution via explicit dependency DAG — 3.7x latency, 6.7x cost savings vs ReAct sequential
- **ReAct** requires tight synchronous feedback loop; document-based planning breaks this loop
- **ACONIC** systematic decomposition: 10-40 percentage points better than heuristic decomposition
- State management needs global state object: `{ plan_id, step_outputs, completed_steps, failed_steps, last_checkpoint }`

## Decision: Stay Within Opencode Primitives

Per session constraints, designs must stay within opencode primitives (agent files, YAML frontmatter, session files, slash commands). This means:
- Typed artifact structure is desirable but must be represented as structured Markdown or embedded JSON in Markdown (not a standalone API)
- Parallelization modeling must be expressible in subtask file format or spec.json extensions
- Validation gate can be implemented as a mandatory checkpoint step in planning protocol

## Open Questions for Synthesis

- How far can structured data be incorporated into the existing Markdown+JSON hybrid format?
- Which divergences are tractable within opencode primitives vs. requiring a fundamentally different runtime?
- Does the synthesis subtask need to propose a phased migration or a clean-break redesign?
