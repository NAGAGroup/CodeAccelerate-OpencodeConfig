# User Decisions — Implementation Review Session

**Date:** 2026-04-06  
**Session:** Post-spec-audit review of all 47 recommendations across Documents 1, 2, and 3, plus new findings from Qwen3.5 tool-calling research.

---

## New Items (from Qwen3.5 research session)

| ID | Decision | Notes |
|----|----------|-------|
| NEW-1 | ✅ Add `temperature: 0.6` to Ollama profile model options | Verified improvement for tool-call syntax determinism |
| NEW-2 | ✅ Add `num_predict: 4096` to Ollama profile model options | Prevents token starvation; Gemma 4 threshold verified at 2048 |
| NEW-3 | ✅ Add `presence_penalty: 0.0` to Ollama profile model options | Default 1.5 corrupts tool-call JSON syntax |
| NEW-4 | ✅ Add positive-framing tool-call instructions to all agent prompts | "Call tools in your responses" — academically verified to outperform negative framing for reasoning models |
| NEW-5 | ✅ Reassess all agent temperature values; update agent files and spec | Use same logic as headwrench research: 0.6 for tool-calling reliability. Assess each agent role individually |
| NEW-6 | ✅ Inject `{{PLAN_NAME}}` into all planning node prompts and component library prompts wherever Qdrant is called | Purpose: agents always know which collection_name to use. Current implementation misses this. Affects both planning prompts and node-library prompts |

---

## Document 1: Spec Gaps

| ID | Decision | Notes |
|----|----------|-------|
| G1 | ✅ Approved | Document `activate_plan` tool fully in doc 01 (parameters, return values, failure modes) |
| G2 | ✅ Approved | Add complete agent YAML schema to doc 02 (mode, steps, color, temperature, permissions, skills) |
| G3 | ✅ Approved | Document plugin loading mechanism in spec (package ID, tool registration) |
| G4 | ✅ Approved | Add representative content examples to spec (one planning prompt, one component, one skill) |
| G5 | ✅ Approved | Document registry.jsonc schema and OCX distribution mechanism |
| G6 | ✅ Approved | Create profiles/configuration doc; document `reasoningEffort: none` prominently |
| G7 | ✅ Approved | Clarify in doc 00 that DAG design principles live in the runtime dag-design-guide |
| G8 | ✅ Approved | Document CATALOGUE.md format and co-occurrence constraints |
| G9 | ✅ Approved | Document full infrastructure stack (Qdrant config, MCP servers, component library paths) |
| G10 | ✅ Approved | Add "enforcement minimum + optional enrichment" pattern to doc 03 |
| G11 | ✅ Approved | Document plan.jsonl header schema in doc 07 |
| G12 | ✅ Approved | Specify next_step terminal node behavior in doc 01 |
| G13 | ✅ Approved | Specify cursor state persistence through recover_context in doc 03 |
| G14 | ✅ Approved | Expand delegation patterns in doc 04 to cover all subagents uniformly |
| C1 | ✅ Approved | Resolve next_step exempt status contradiction between docs 03 and 05 |
| C2 | ✅ → Implementation fix | `{{PLAN_NAME}}` should be injected into planning prompts AND component library prompts. Qdrant instructions in all such prompts should use `{{PLAN_NAME}}` as `collection_name`. This is captured as NEW-6 above |
| C3 | ✅ Approved | Remove `{{PLANNING_SESSION_ID}}` from spec docs 00 and 08 (appears in no actual prompts) |

---

## Document 2: Spec vs. Implementation Inconsistencies

| ID | Decision | Notes |
|----|----------|-------|
| V1 | ✅ Keep + document | context-scout retains grepai trace tools; update spec to document the expanded grant |
| V2 | ✅ Partial fix | Fix 3-space YAML indentation defect in junior-dev, doc-expert, external-scout. Qdrant grants are intentional — update spec to match instead of removing |
| V3 | ✅ Approved | Add `present_compact_dag_to_user` to dag-designer's doc 02 entry |
| V4 | ❌ Denied | Skills are enabled by default; no skills block needed in headwrench.md |
| V5 | ❌ Denied | Wildcard permissions stay as-is on headwrench and autonomous-agent |
| V6 | ✅ Approved | Expand all 9 subagent prompts to 30–50 lines with better behavioral grounding |
| V7 | ✅ Approved | Move output format before final constraints in 8 of 9 subagent prompts |
| V8 | ✅ Approved | Replace vague "semantic search" / "file reading" with exact callable tool names in dag-designer and dag-reviewer |
| V9 | ✅ Approved | Remove "verification layer" (internal framework term) from documentation-expert prompt |
| V10 | ✅ Approved | Remove backtick-wrapped tool names from headwrench.md |
| V11 | ✅ Approved | Add `grepai_grepai_index_status` to doc 02 for junior-dev, documentation-expert, and tailwrench |
| V12 | ✅ Approved | Remove `webfetch` from external-scout's agent file |
| V13 | ✅ → Superseded by NEW-5 | Subsumed into full agent temperature reassessment (NEW-5) |
| V14 | ✅ Approved | Give context-insurgent or external-scout a unique color; document color rationale in doc 02 |
| V15 | ✅ Approved | Update doc 07: sequential-thinking may do optional Qdrant retrieval before reasoning — it is not "pure reasoning with no side effects" |
| V16 | ✅ Approved | Update doc 07 to document the full 4-step autonomous-work flow (question → skill → sequential-thinking → task) |
| V17 | ✅ Approved | Document "enforcement minimum + optional enrichment" pattern in doc 07. Key framing: globally-exempt tools (thinking, questions, Qdrant notes) are free at any time for all model sizes — not a small-model accommodation. Prompts may instruct their use; language should imply it is not required, without using the word "optional" |
| V18 | ✅ Approved | Add `qdrant_qdrant-store` to plan-success enforcement to match plan-fail |
| V19 | ✅ Approved | Fix external-research.md skip path: dispatch a no-op external-scout call to satisfy enforcement before calling next_step |
| V20 | ✅ Approved | Fix user-review.md: change `step_id=` to `next=` |
| V21 | ✅ Approved | Remove `{{PLANNING_SESSION_ID}}` from docs 00 and 08 |
| V22 | ✅ Approved | Rename "Store Notes" to "Write Notes" (or vice versa) to resolve node name mismatch |
| V23 | ✅ Approved | Fix session-overview.md skill load phrasing to "Use the skill tool to load…" |
| V24 | ✅ Approved | Clarify code-block prohibition scope; rewrite affected planning prompt examples as prose if prohibition extends to planning prompts |
| V25 | ✅ Approved | Fix all three grepai skill issues: remove stale "(to be created)" annotation, clean Vue/Pinia domain drift in examples, remove RPG tool docs for tools denied to the agents loading this skill |
| V26 | ✅ Approved | Expand all ~14 skill files to 50–100 lines minimum |

---

## Document 3: Small-Model Optimization

| ID | Decision | Notes |
|----|----------|-------|
| F1 | ✅ Approved | Add explicit small-model rationale to doc 03 for enforcement sequences |
| F2 | ✅ Approved | Add cross-references from docs 00, 03, 05, 06 to doc 08's small-model guidance |
| F3 | ✅ Approved | Document skill-loading recency principle in doc 08 or doc 00 |
| F4 | ✅ Approved | Articulate graceful degradation principle explicitly in doc 07 |
| F5 | ✅ Approved | Add small-model rationale for globally-exempt tools to doc 03 |
| F6 | ✅ Approved | Document `reasoningEffort: none` in doc 00 as a deployment prerequisite |
| F7 | ✅ Approved | Add temperature tuning subsection to doc 02 or doc 08 |
| F8 | ✅ Approved | Document DAG_EXECUTOR_MODE injection in doc 00 or doc 03 |
| F9 | ✅ Approved | Document imperative error message phrasing principle in doc 08 |
| F10 | ✅ → Superseded by V6 | Subsumed into V6 (expand all 9 subagent prompts to 30–50 lines) |
| F11 | ✅ → Superseded by V26 | Subsumed into V26 (expand all ~14 skill files to 50–100 lines) |
| F12 | ✅ Approved | Add planning-for-small-models section to doc 05 |
| F13 | ✅ Approved | Document small-model planning characteristics and limits in profiles doc or doc 05 |
| F14 | ✅ Approved | Create planning notes quality standards in doc 05 or doc 06 |
| F15 | ✅ Approved | Add Qdrant query construction guidance to doc 06 or doc 07 |
| F16 | ✅ Approved | Remove stale "(to be created)" GrepAI annotations from external-scout skill |

---

---

## Implementation Session Decisions

### Temperatures (NEW-5 / V13)

| Agent | Current | New | Rationale |
|-------|---------|-----|-----------|
| headwrench | 0.4 | 0.6 | Most tool-call-heavy agent; orchestrates all DAG and delegation calls |
| context-scout | 0.2 | 0.2 (keep) | Read-only analysis; lower temp reduces hallucination, tool-call risk low |
| context-insurgent | 0.2 | 0.2 (keep) | Same as context-scout |
| junior-dev | 0.4 | 0.6 | Makes edit/write/glob calls constantly; benefits from syntax determinism |
| documentation-expert | 0.4 | 0.6 | Same as junior-dev |
| tailwrench | 0.4 | 0.6 | Bash + git tool calls; structured syntax must be reliable |
| autonomous-agent | 0.4 | 0.6 | Full tool access; all categories benefit |
| dag-designer | 0.4 | 0.6 | DAG construction tools require precise structured syntax |
| dag-reviewer | 0.4 | 0.6 | Same class of tools as dag-designer |
| external-scout | 0.3 | 0.6 | Heavy tool caller (searxng, url_read, context7); raised to match implementation agents |

### Color (V14)

| Agent | Current | New |
|-------|---------|-----|
| external-scout | #f59e0b (amber — collision with context-insurgent) | #f43f5e (rose) |
| context-insurgent | #f59e0b | #f59e0b (keep — original owner) |

### Bug Fixes

| ID | Decision | Detail |
|----|----------|--------|
| V19 | ✅ No-op scout dispatch | When user picks Skip on external-research, dispatch @external-scout with a minimal no-op prompt to satisfy task enforcement, then call next_step |
| V20 | ✅ Fix both branches | Change `step_id=` to `next=` in both the Approve and Request Changes branches of user-review.md |
| V18 | ✅ Add to enforcement | Add `qdrant_qdrant-store` to plan-success node-spec.json enforcement sequence |
| V22 | ✅ Use 'Store Notes' | Rename write-notes node to 'Store Notes' everywhere spec and implementation disagree |

### Planning Prompts

| ID | Decision | Detail |
|----|----------|--------|
| V24 | ✅ Convert to prose | Remove code blocks from write-notes, retrieve-notes, final-revision; replace with prose descriptions of parameter values |
| NEW-6/C2 | ✅ Add everywhere missing | Sweep all planning prompts and node-library prompts; add `{{PLAN_NAME}}` as collection_name wherever Qdrant calls are instructed but the variable is absent |

### Agent Prompt Architecture (NEW-4 / V6 / F10 / F11)

**New skill files to create:**

| Skill | Tools covered | Agents that get access |
|-------|--------------|------------------------|
| `file-operations` | read, edit, write, glob, grep | junior-dev, documentation-expert, tailwrench, autonomous-agent |
| `shell-operations` | bash | tailwrench, autonomous-agent |
| `web-research` | searxng_searxng_web_search, searxng_web_url_read, context7_resolve-library-id, context7_query-docs | external-scout |
| `dag-tools` | add_node, delete_node, modify_node, show_dag, show_compact_dag, validate_dag, present_compact_dag_to_user, get_planning_components_catalogue, get_dag_design_guide | dag-designer, dag-reviewer |

**Skill content approach:**
- New skills: 50-100 lines, include positive-framing tool-call guidance ("Use the X tool to do Y")
- Existing skills (grepai, qdrant-notes, sequential-thinking, all delegation skills): expand to 50-100 lines AND add positive-framing tool-call guidance

**System prompt approach:**
- Expand all 9 subagent prompts to 30-50 lines by expanding existing sections in place (Capabilities, Methodology, Constraints)
- Methodology section gets explicit skill-load triggers: one line per skill category — "When performing file operations, load the file-operations skill first"
- No verbose tool-call instructions in system prompts — detailed guidance lives in skill files

### Agent Prompt Structure (V7 / V8 / V9 / V10)

| ID | Decision | Detail |
|----|----------|--------|
| V7 | ✅ Reorder | Output format line moves to second-to-last; most critical behavioral constraint for each agent becomes the last line |
| V8 | ✅ Fix inline | Replace 'semantic search' / 'file reading' in dag-designer and dag-reviewer with exact callable tool names (grepai_grepai_search, read) |
| V9 | ✅ Remove | Remove 'verification layer' from documentation-expert prompt |
| V10 | ✅ Remove | Remove backtick-wrapped tool names from headwrench.md |

### Permissions / Tool Grants (V2 / V12)

| ID | Decision | Detail |
|----|----------|--------|
| V2 | ✅ Fix indentation only | Correct 3-space → 2-space YAML indentation in junior-dev, documentation-expert, external-scout. Qdrant grants are intentional — spec updated to match |
| V12 | ✅ Remove webfetch | Remove from external-scout's permission block; searxng_web_url_read covers the same use case |

### Skill Loading Architecture (NEW — supersedes per-node skill load approach)

**Rule:** Explicit skill loading stays only at foundational nodes and specialized design nodes. All other per-node skill loads are removed.

| Location | Skill loads | Decision |
|----------|-------------|----------|
| session-overview + session-overview-refresher | following-plans, sequential-thinking (existing) | Keep |
| execution-kickoff + kickoff-refresher | following-plans equivalent (existing) | Keep |
| dag-design planning node | dag-design skill | Keep |
| dag-review planning node | dag-review skill | Keep |
| All other planning prompts (retrieve-notes, write-notes, external-research, etc.) | Various | **Remove** |
| All node-library prompts (work-item, research, autonomous-work, etc.) | Various | **Remove** |

**Headwrench system prompt:** Add skill-triggering instructions so headwrench knows when to load skills contextually during free-form work outside DAG mode. Same explicit-trigger-per-skill pattern as subagents.

**Rationale:** session-overview and execution-kickoff establish methodology for the entire session. Specialized design/review skills (dag-design, dag-review) contain criteria that must be present at exactly those nodes. All other per-node loads are redundant once kickoff methodology is established.

**Spec update required:** Document this skill-loading rule in the spec (doc 05 or doc 07) — which nodes load skills explicitly, why kickoff establishes session-wide methodology, and how headwrench's skill-triggering instructions cover free-form work outside DAG sessions.

---

## Summary Counts

| Category | Approved | Denied | Superseded/Merged |
|----------|----------|--------|-------------------|
| New (research) | 6 | 0 | 0 |
| Doc 1 gaps (G+C) | 17 | 0 | 0 |
| Doc 2 inconsistencies (V) | 24 | 2 | 1 |
| Doc 3 small-model (F) | 13 | 0 | 2 |
| **Total** | **60** | **2** | **3** |
