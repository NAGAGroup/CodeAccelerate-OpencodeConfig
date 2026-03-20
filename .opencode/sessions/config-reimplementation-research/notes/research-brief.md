# Research Brief: OpenCode Config Reimplementation

**Session**: config-reimplementation-research  
**Date**: 2026-03-19  
**Status**: Final

---

## Executive Summary

This brief synthesizes findings from three rounds of research into a set of design recommendations for reimplementing the opencode configuration featureset. The research covered planning system design, agent architecture and delegation, context management, protocol/skills systems, slash commands, and autonomy/gate models.

The core finding is consistent across all research areas: **the current implementation makes correct high-level choices but under-implements the engineering discipline that makes those choices reliable at scale.** Each area has a known, production-validated improvement path. None of the recommended changes require wholesale replacement — they are precision upgrades to existing structures.

---

## Key Findings by Area

### 1. Planning System & Planning Modes
The Plan-and-Execute paradigm with typed execution artifacts is the dominant production pattern. Current markdown-based plans lack the parallelization semantics, dependency tracking, and pre-execution validation that research shows improves plan quality by 10–30% and rejects 15–25% of infeasible plans before they run. LLMCompiler-style parallel decomposition delivers 3.7× latency improvement and 6.7× cost savings.

**Critical gap**: All planning modes produce the same artifact structure, which eliminates the precision benefit of having modes at all.

### 2. Session Plan Structure & Execution Design
Production systems use structured DAG artifacts rather than flat ordered lists. Each step needs explicit dependency declarations, parallelization hints, context boundaries, and success criteria. State management must support resumption at any step — not just restart from beginning. Checkpoint semantics should be first-class citizens of the plan schema, not bolt-on conventions.

**Critical gap**: Current plans have no formal dependency graph, no step-level context boundaries, and no resumption-safe state artifact.

### 3. Context Management Lifecycle
Three-tier memory (working/episodic/semantic) is universal in production AI systems. The current flat injection model ignores staleness, relevance scoring, and context degradation. Research shows a silent performance cliff at 60–70% context utilization — well before the stated limit — causing 30%+ accuracy drops for mid-context content. Triggering compaction at 60% (not 100%) prevents this cliff. LLM summarization archival achieves 70% token savings with 90% information retention.

**Critical gap**: No tiered context architecture, no staleness metadata, no relevance scoring, and no proactive compaction triggers.

### 4. Session-Specific Subagent Design
Role-Goal-Backstory architecture (validated by CrewAI and industry production) produces more consistent subagent behavior than prompt-constraint approaches. Hard operational limits (max_iter, execution_timeout, max_rpm) are categorically more reliable than instruction-based constraints. Specialist crews of 3–6 outperform single generalist agents for parallelizable work. Dynamic per-task model selection (matching complexity to model tier) provides 80% cost savings versus using the most capable model for everything.

**Critical gap**: Single `session-local-implementer` agent is the exact anti-pattern that research flags. No operational limits. No model tier assignment.

### 5. Delegation Design & Routing Strategy
Hierarchical manager+specialist routing with static routing tables is the production standard. Per-task dynamic routing (using complexity scoring to select agents) is an unrealized enhancement opportunity. The current deny-by-default tool permission model is correctly validated by research, but is missing rate limiting enforcement (`max_rpm`) which is the primary production mechanism for preventing runaway agents.

**Critical gap**: No rate limiting, no complexity classification, no routing table — routing is ad-hoc in agent prompts.

### 6. Speed/Cost/Correctness Trade-off Framework
Model tier mapping is a solved problem: mechanical tasks (haiku), standard tasks (sonnet), complex tasks (o1-mini), breakthrough tasks (o1-preview). Dual-model strategy (separate reasoning and function-calling models) provides further efficiency. The key insight is that model selection should be determined by task complexity classification, not by human intuition per session.

**Critical gap**: No formal complexity classification. Model selection is implicit and inconsistent across sessions.

### 7. Protocol & Skills System Design
Progressive disclosure in skill files achieves ~95% token reduction versus loading full skill content upfront. Dynamic skill loading reduces MCP footprint by 95%. Versioning skills via git-like immutable snapshots prevents silent regressions. Hierarchical skill composition (6–8 core skills, each with 2–3 sub-skills) is the production pattern. Predictive loading reduces skill invocation latency from 3–5s to 100–200ms.

**Critical gap**: Current YAML-based skill config is static, global, unversioned, and not progressively disclosed. No dynamic loading.

### 8. Slash Commands & General UX
Slash command design converges on: "/" autocomplete popup with filtering, one-file-per-command, YAML frontmatter (name, description, model, tools, arguments), and checkpoint primitives (/compact, /clear, /resume, save/restore) as first-class session control. CLI+GUI hybrid patterns are emerging. The model field in opencode's current slash command YAML is bugged (ignored as of v0.6.4), which means model routing via slash commands is currently non-functional.

**Critical gap**: No session discovery via "/" prefix, no error-recovery checkpoint commands, no structured argument passing, model field bug.

---

## Design Priority Matrix

| Area | Research Confidence | Implementation Complexity | Impact | Priority |
|------|--------------------|-----------------------------|--------|----------|
| Context management (cliff prevention) | Very High | Medium | High | P1 |
| Planning modes (differentiated artifacts) | High | Medium | High | P1 |
| Agent model tier mapping | High | Low | High | P1 |
| Rate limiting / operational limits | Very High | Low | Medium | P2 |
| DAG-based session plan structure | High | High | High | P2 |
| Skills progressive disclosure | Very High | Medium | Medium | P2 |
| Specialist agent crew (anti-generalist) | High | High | High | P2 |
| Slash command checkpoint primitives | Medium | Low | Medium | P3 |
| Earned autonomy / VoI gating | Medium | High | Medium | P3 |
| Complexity classification for routing | Medium | Medium | Medium | P3 |

---

## Divergences from Current Config (Summary)

A total of **15 divergences** were identified across the three research rounds:

**Round 01 (5)**:
1. Markdown plans → typed JSON artifact with DAG
2. Mode-agnostic plan structure → mode-specific artifacts
3. Single-pass plan generation → multi-step synthesis
4. No pre-execution validation → gate rejects 15–25% of infeasible plans
5. Single executor → parallelization + role-specific routing

**Round 02 (5)**:
6. Prompt constraints → operational limits (max_iter, timeout, max_rpm)
7. Single generalist → multi-specialist crew (3–6)
8. Per-session capability files → global templates + runtime parameterization
9. Deny-by-default correct but missing rate limits
10. No per-task model selection → complexity classification → model tier

**Round 03 (5)**:
11. Flat context injection → 3-tier memory with relevance scoring
12. Timestamp staleness → per-type SLA freshness model
13. Full skill loading → progressive disclosure + dynamic loading
14. No slash command checkpoint primitives → session control commands
15. Binary autonomy switches → earned autonomy via Beta(α,β) + VoI gating

---

## OpenCode Implementation Constraints

OpenCode's extensibility system has three tiers: Skills (prompt templates, `.md` files), Agents (JSON persona files), Plugins (TypeScript npm packages). The relevant constraints per design recommendation:

- **Skills system** supports Handlebars templating, YAML frontmatter, `extends:` inheritance. Progressive disclosure must be implemented via content structure within `.md` files — there is no native lazy-loading. Dynamic loading is achievable via `--skill` flag invocation patterns.
- **Agents system** supports per-agent model selection (enabling model tier mapping), per-agent tool lists (enabling deny-by-default enforcement), and per-agent temperature/maxTokens (enabling operational limits). Rate limiting (`max_rpm` equivalent) requires a Plugin hook.
- **Slash commands** support YAML frontmatter with `description`, `agent`, `model` fields. The `model` field is currently bugged (v0.6.4). Checkpoint primitives require Plugin-level implementation to save/restore session state.
- **Per-session agent switching** is currently unsupported mid-prompt (Issue #5963). Agent selection must occur before starting a conversation. This constrains dynamic routing to session-start, not mid-task.
- **DAG plan artifacts** would need to be implemented as a convention (structured JSON files in `.opencode/sessions/`) rather than a native platform feature. Opencode has no built-in plan execution engine.

---

## Recommended Next Steps

1. **Implement tiered context architecture** — add staleness metadata to context files, trigger /compact at 60% utilization, use position-aware placement (critical info at start/end).
2. **Differentiate planning mode artifacts** — each mode (plan/build/autoaccept) produces a structurally different session plan with mode-appropriate fields.
3. **Implement model tier assignment** — classify task complexity at subtask definition time; assign haiku/sonnet/o1-mini accordingly in agent delegation.
4. **Add rate limiting via Plugin** — implement `max_rpm` enforcement in a chat.params Plugin hook.
5. **Refactor skills to progressive disclosure** — restructure SKILL.md files so the summary is in YAML frontmatter and full content loads on explicit invocation.
6. **Add slash command checkpoint primitives** — implement /save, /restore, /resume as project-level `.opencode/commands/` files backed by Plugin state hooks.
7. **Move toward multi-specialist agent design** — define at least 3 specialist agent types per session (e.g., Context Scout, Implementer, Reviewer) rather than a single generalist.
