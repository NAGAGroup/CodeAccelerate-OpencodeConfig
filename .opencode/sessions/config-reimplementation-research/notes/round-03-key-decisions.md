# Round 3 Key Decisions: Supporting Infrastructure

*Written at checkpoint following Subtask 03 completion.*

---

## Decision 1: Context Management — Use SLA-Based Staleness, Not Timestamps

**What**: Replace age-based timestamp staleness detection with per-type freshness SLAs (protocol files = long TTL, session notes = medium, working notes = short).

**Rationale**: Research shows temporal rot is multi-faceted. Different context types degrade at different rates. Timestamp-only approaches miss volatility signals and confidence decay.

**Divergence from current config**: Current system has no formal staleness model — files are either "active" or "superseded_by". No per-type SLAs, no decay scoring, no pre-execution validation.

**Recommended approach**: Define SLA tiers per context type. Add `stale_after:` metadata field to context files. Check staleness at load time, not just at write time.

---

## Decision 2: Context Archival — LLM Summarization, Not Raw Retention

**What**: Implement periodic LLM summarization of session notes and old context, converting N turns/notes into 1 summary at ~70% token savings with ~90% information retention.

**Rationale**: Production systems (MemGPT, Letta, Claude's compress tool) all use summarization-based archival. Raw retention hits token limits; deletion loses signal.

**Divergence from current config**: Current system uses the `compress` tool for conversation compaction but has no equivalent for session notes or historical context files.

**Recommended approach**: Post-session summarization pass. Archive files get an `archived: true` flag and a `summary_file:` pointer.

---

## Decision 3: Skills System — Progressive Disclosure via SKILL.md

**What**: Skills should use progressive disclosure: SKILL.md contains activation instructions + overview only. Full content loads only when skill is invoked.

**Rationale**: Research shows this achieves ~95% token reduction vs. preloading all skill content. Dynamic loading on-demand is the production pattern.

**Divergence from current config**: Current SKILL.md files are partially structured but there's no formal progressive disclosure protocol. Some skills load full content eagerly.

**Recommended approach**: Standardize SKILL.md format: `## Activation`, `## Overview`, `## Steps` (brief), with full content in referenced files loaded only on invocation.

---

## Decision 4: Slash Commands — Checkpoint Primitives Are Essential

**What**: Slash commands need checkpoint primitives built in — session state save/restore, progress capture, and resume from known-good state.

**Rationale**: Research on AI coding assistant UX shows that session continuity failures (lost context, partial work) are the #1 user frustration. Checkpoint primitives in commands prevent this.

**Divergence from current config**: `/plan` has a structured workflow but lacks explicit checkpoint primitives. No `/save`, `/resume`, or `/status` commands defined.

**Recommended approach**: Every multi-step slash command should emit a checkpoint artifact. Add `/status` for session state visibility.

---

## Decision 5: Autonomy — Earned Autonomy via Beta(α,β) + VoI Gating

**What**: Agent autonomy should scale based on task success history (Beta distribution: α successes, β failures) and Value of Information (VoI) gating — only interrupt when information gain exceeds interruption cost.

**Rationale**: Binary autonomous/supervised modes are too coarse. Research shows earned autonomy with measurable gates is the production standard for reducing user interruptions while maintaining safety.

**Divergence from current config**: Current system uses static GATE markers in subtask files. No earned autonomy model, no VoI-based interrupt decisions.

**Recommended approach**: Introduce autonomy score per session. Gates become VoI checks — interrupt only if P(failure) × cost_of_failure > interruption_cost.

---

## Decision 6: Graph RAG Over Vector-Only Retrieval

**What**: Use Graph RAG (entity/relationship graph + vector search) with multi-query expansion for context retrieval, not pure vector similarity.

**Rationale**: Graph RAG captures cross-file relationships and entity references that vector search misses. Multi-query expansion compensates for vocabulary mismatch. Practical gain: 2-5x precision on code/architecture retrieval tasks.

**Divergence from current config**: Current system uses manual file reading (no semantic retrieval at all). This is a significant capability gap.

**Recommended approach**: Implement hybrid retrieval: keyword BM25 + vector similarity + entity graph traversal. Minimum viable: add multi-query expansion to context loading.

---

## Summary of Round 3 Divergences

| Area | Current State | Recommended State |
|------|---------------|-------------------|
| Context staleness | Binary active/superseded | SLA-based per type |
| Context archival | None | LLM summarization |
| Skills loading | Partially eager | Progressive disclosure |
| Slash commands | No checkpoint primitives | Checkpoint-first design |
| Autonomy model | Static GATE markers | Earned autonomy + VoI |
| Context retrieval | Manual file reads | Graph RAG + multi-query |
