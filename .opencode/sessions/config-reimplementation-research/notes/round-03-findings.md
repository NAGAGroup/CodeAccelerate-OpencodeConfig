# Round 3 Research Findings: Supporting Infrastructure

*Research conducted by @DeepResearcher. Written by HeadWrench from returned research brief.*

---

## Angle 1: Context Lifecycle Management for Multi-Session AI Assistants

**Key Finding**: Production AI coding assistants use **tiered memory architectures** (working memory in context window, episodic memory in Redis/session stores, semantic memory in vector DBs) combined with **intelligent context injection** (selective retrieval via vector + reranking, multi-stage filtering) and **decay-based refresh strategies** to manage staleness — NOT just age-based timestamps.

### 1. Three-Tier Memory Architecture is Standard

- Tier 1 (Working Memory): Context window (200K tokens max for Claude Sonnet, 128K for GPT-4o). LLM's only native working memory. Fast (<1ms) but volatile.
- Tier 2 (Episodic/Session Memory): Recent history in Redis-like stores (sub-second retrieval). Holds full message history, tool calls, results for current session.
- Tier 3 (Semantic/Long-Term): Vector DBs (Pinecone, Weaviate) with 50-200ms retrieval. Infinite capacity, searchable by topic/entity.

**Source**: OrbitalAI memory management guide (2025), Google ADK architecture documentation

### 2. Context Injection Uses Multi-Stage Retrieval, Not Raw Vectors

- Stage 1: Vector search (semantic similarity) + keyword/BM25 filtering
- Stage 2: Reranking (cross-encoder models to re-score for actual relevance, not just similarity)
- Stage 3: Relevance scoring, intent-matching via STITCH (entity/topic type awareness), agentic curation via ACE playbooks
- Typical assembly: 2K-10K tokens of retrieved context injected per model call (respects token budget while maximizing signal)

**Source**: Elixir Data context rot research, OneReach.ai context engineering lifecycle

### 3. Staleness Detection is Multi-Faceted (NOT just timestamp-based)

- **Temporal rot**: Freshness SLAs per context type (real-time data via CDC/webhooks = sub-minute; near-time = hours)
- **Volatility indicators**: Flag context that changes frequently (price data, status fields, etc.)
- **Confidence decay**: Age at decision time; older context = lower confidence
- **Anomaly detection**: Alert if current context contradicts recent patterns
- **Validation at decision time**: Pre-execution freshness check on critical paths (e.g., before making database changes)

**Source**: Navdeep Singh (LinkedIn), Elixir Data "Context Rot" concept

### 4. Supersession Pattern: Incremental + Conflict Resolution

- Latest input overrides session/global defaults (explicit precedence rules prevent poisoning)
- Reflection-driven updates (ARC framework: agent reflects on prior decisions, consolidates context)
- Deduplication + LLM-driven merging when conflicts occur (consolidation thresholds trigger post-session)

**Source**: Context Lifecycle Medium article by Chier Hu

### 5. Archival & Compaction Patterns

- Periodic LLM summarization of old turns (converts 10 turns → 1 summary at ~70% token savings, ~90% information retention)
- Tiered storage: Current session in-memory, recent history in fast DB, old sessions in file storage/cold storage
- Decay-based refresh: Sunset obsolete info, refreshing only on user action or schedule
- Fork sessions for branching; purge low-relevance via trust scoring + recency

**Source**: OpenAI Agents SDK documentation, Google ADK

### 6. Production System Patterns

**Cursor**:
- Dynamic context discovery: Only loads MCP tools when needed (not upfront)
- Subagents with isolated context: Long research/exploration tasks don't bloat main conversation window
- Auto-memory via .cursor/rules + semantic indexing; @mentions for explicit context injection
- **Source**: Cursor blog "Dynamic Context Discovery" (Jan 2026), Cursor docs on subagents

**GitHub Copilot**:
- Copilot Spaces organize context (repos, PRs, issues, web, ephemeral dev env)
- Autonomous agent sessions tracked via agents panel/CLI; per-agent context isolation
- Mentions (#mentions) for file/codebase/web context; session logs for inspection
- **Source**: GitHub Copilot docs on Spaces and agent management

**Claude Code**:
- Session persistence via disk-backed JSONL histories; `--continue` resumes last session, `--resume` picks from list
- Session Memory: Auto-generated summaries across sessions
- /compact command for manual context compression; CLAUDE.md for persistent project context
- **Source**: Claude Code documentation, Developer Toolkit

⚠️ **Design divergence**: Current YAML config + Markdown plan files have **no explicit tiered context architecture**. Plans lack session state, memory tiers, or staleness metadata. Current context injection is **flat** (all relevant context into one prompt) vs. **multi-stage selective retrieval**. No decay or volatility flags.

### Synthesis

Context lifecycle is not a storage problem — it's a **decision problem**. What to carry forward, what to compress, when to refresh. Production systems decouple context _storage_ (multi-tier) from context _presentation_ (working context assembled per call). Staleness is detected per-context-type with freshness SLAs, not globally. Supersession happens via explicit rules + reflection, not overwriting.

---

## Angle 2: Protocol and Skill System Design

**Key Finding**: Skills (SKILL.md specification) are the production-standard extensibility mechanism. They use **progressive disclosure** (metadata preloaded, full instructions on-demand, resources lazy-loaded) to avoid context bloat while supporting large libraries. **Dynamic loading outperforms static** (8 meta-tools vs. native integration). **Granularity balance**: finer skills aid routing but increase library size.

### 1. SKILL.md Specification & Progressive Disclosure

- Core: Directory with SKILL.md (YAML frontmatter: name, description, triggers) + optional code/docs
- Preload: Only metadata (~50 tokens per skill) into system prompt at startup → supports 50-100+ skills without bloat
- On-select: Full skill instructions load when agent chooses to use it (e.g., via tool call)
- On-demand: Scripts, documentation, examples loaded only if needed
- **Result**: Large skill libraries manageable in context window; token reduction 95% vs. static upfront loading

**Source**: SoK "Agentic Skills" paper (arXiv 2602.20867), Agent Skills for LLMs survey (arXiv 2602.12430)

### 2. Skills vs. MCP vs. Tools: Architectural Distinctions

- **Tools**: Atomic primitives (API calls). Stateless, one-shot invocation. ~500-2K tokens per tool definition.
- **Skills**: Callable modules with state, applicability conditions, execution policies, termination criteria. Composable. ~100 tokens metadata, variable full size.
- **MCP**: Standardized protocol for tool/skill servers. Enables third-party distribution with auth/permissions. Can be exposed as skills.
- **Best for skills**: Reusable workflows (e.g., "debug_race_condition", "refactor_module", "write_test_suite")
- **Best for MCP**: Access to secured external systems (Postgres, GitHub, Slack via OAuth)

**Source**: Armin Ronacher blog "Skills vs Dynamic MCP Loadouts" (Dec 2025), Skills Protocol documentation

### 3. Dynamic vs. Static Loading

- **Static (old pattern)**: All tool/MCP definitions injected into system prompt upfront. Works until you exceed context window.
- **Dynamic loading (Cursor, Claude Code)**: Metadata summary preloaded; full definition retrieved on-demand via tools like grep/semantic search.
- **Skills Protocol (new pattern)**: 8 meta-tools enable discovery/execution. Agent calls `list_skills()` → `describe_skill()` → `execute_skill()` on demand. Fundamentally different: no upfront tool declaration, pure dynamic.
- **Benchmarks**: Dynamic loading reduced MCP context footprint by 95% in A/B tests (Cursor blog, Jan 2026)

**Source**: arXiv 2602.17046 "Dynamic System Instructions and Tool Exposure for Efficient Agentic LLMs", Cursor blog, Skills Protocol docs

### 4. Versioning & Compatibility

- Skills as immutable snapshots with branches (e.g., git-like: `debug_v1.0` vs. `debug_v1.1`)
- Metadata includes: version, dependencies, min/max model versions, compatibility matrix
- CI/evals per version: regression tests run on new models to flag breaking changes
- Composition: Skills invoke sub-skills (hierarchical execution graphs). Dependency tracking prevents circular calls.

**Source**: Agent Skills survey (arXiv 2602.12430), SkillMD.ai predictive skill loading

### 5. Skill Granularity: Taxonomy & Trade-offs

- **Scope dimension**: Narrow (single task: "format_code", "run_tests") vs. broad (multi-step: "implement_feature", "debug_system")
- **Trade-off**: Finer granularity aids routing and independent reuse; coarser reduces library size and composition overhead
- **Optimal**: Hierarchical composition (high-level skills invoke lower-level ones). ~6-8 core skills per domain, each with 2-3 sub-skills.

**Source**: SoK paper, SkillMD.ai examples

### 6. Skill Loading: Explicit vs. Implicit

- **Explicit (current)**: User types `/run-tests` or adds skill via command. Deterministic.
- **Implicit (emerging)**: Agent detects task type, pre-loads relevant skills automatically.
- **Predictive loading**: ML model predicts which skills needed based on task fingerprint (language, framework, task type). Reduces load latency 3-5s → 100-200ms.
- **Confidence scoring**: Skills ranked by (task_match_confidence, historical_success_rate). Top-N loaded in parallel.

**Source**: SkillMD.ai "Predictive Skill Loading", ITR paper (arXiv 2602.17046)

⚠️ **Design divergence**: Current YAML config files are **static, global, not versioned**. No progressive disclosure (all instructions in YAML upfront). No skill library/registry pattern. No dynamic loading. No composition/dependency tracking. Markdown protocol files in `.claude/commands/` are closer to skills but lack metadata, versioning, and predictive loading.

### Synthesis

Skills are not just "fancy tools" — they're **encapsulated procedures with metadata, versions, and dependency graphs**. Progressive disclosure keeps context small while supporting large libraries. Dynamic loading makes skills practical at scale. Composition (hierarchical invocation) keeps granularity fine without explosion.

---

## Angle 3: Slash Command UX

**Key Finding**: Slash command UX in production AI assistants emphasizes **discovery via typing "/"** (triggers filtered autocomplete popup), **scope via narrow task-specific Markdown files** (not monolithic instructions), and **error handling via checkpoints** (Esc-Esc undo, /compact context resets, git integration).

### 1. Discoverability: The "/" Trigger Pattern

- **Implementation**: User types "/" → system shows autocomplete popup listing all available commands with short descriptions
- **Filtering**: As user types letters after "/", popup filters in real-time
- **Progressive disclosure**: Don't show all flags/options upfront; reveal on hover or in help modal
- **Visual cues**: Icons for command categories (session, tools, review), color coding for danger (e.g., `/clear` in red)
- **Help system**: `/help COMMAND` expands full documentation; `/help` alone shows grouped command reference
- **Production examples**: Claude Code has 40+ built-in slash commands; Cursor integrates in chat and agent mode; Codex filters dynamically

**Source**: Developer Toolkit slash commands mastery guide, Cursor docs, Codex CLI guide

### 2. Scope: Task-Specific Commands in Markdown Files

- **File structure**: `.claude/commands/startup.md`, `.cursor/commands/code-review.md` (one file per command)
- **YAML frontmatter**: name, description, model (e.g., "claude-opus-4-6"), allowed tools, arguments
- **Scope levels**: Global (system-wide) vs. Project (local to codebase, loaded from `.claude/commands/` or `.cursor/commands/`)
- **Problem with monolithic**: If all custom commands live in one file, agent wastes context parsing irrelevant instructions
- **Solution**: One file = one command, scoped to its domain

**Source**: Developer Toolkit context engineering guide, howibuild.ai custom slash commands

### 3. Error Handling & Checkpoints

- **Esc-Esc undo**: Two quick Escape key presses = revert last command (prevents accidental destructive ops)
- **/compact**: Summarizes conversation to free context mid-session (useful before hitting token limit)
- **/clear**: Wipes history, starts fresh (used between unrelated tasks)
- **/resume**: Resume previous session by ID or name (enables long-running projects)
- **Git integration**: Checkpoints are git commits; agent can roll back to prior commit if it goes off-rails
- **Error reporting**: Structured error context (what failed, why, suggested next step) — not stack traces

**Source**: Developer Toolkit error recovery guide, Claude Code documentation

### 4. CLI vs. GUI Discoverability Research

- **CLI advantages** (for experts): Pure text → AI-composable, automatable. Composability: Chain commands, pipe results.
- **GUI advantages** (for novices): Visual menu browsing (60% of sysadmins prefer GUI per USENIX research). Immediate feedback, exploration without memorization.
- **Hybrid pattern** (emerging): CLI backbone (AI-friendly) + visual dashboard (human-friendly). Natural language → commands translation. Intelligent error recovery.

**Source**: Medium "Why CLI Outshines GUI in Age of AI", USENIX usability research

### 5. Slash Command vs. Inline Instruction vs. Tool Call: Scope Decisions

- **Slash commands**: Session control, mode switching, high-level directives. Don't consume tokens in context (out-of-band), instant feedback, deterministic.
- **Inline instructions**: Narrative prompts within a turn, scoped to current query. Context-aware, conversational, flexible.
- **Tool calls**: Deterministic operations (read file, run test, call API). Precise, trackable, parametric.
- **Common mistake**: Over-using slash commands (every action becomes `/action`); should be rare. Most work via inline or tool calls.

**Source**: Jason Liu's "Slash Commands vs. Subagents", howibuild.ai

### 6. Production System Patterns

**Claude Code** built-in slash commands:
- /compact (compress conversation), /clear (start fresh), /resume (continue session)
- /cost (show token spending), /context (show context window contents)
- /mcp (show MCP server status), /hooks (display hook config), /agents (manage subagents)

**Codex** documented slash commands:
- `/permissions`, `/fast`, `/sandbox-add-read-dir`, `/review`, `/statusline`
- Scope: Per-session configuration, not project-persistent

⚠️ **Design divergence**: Current YAML/Markdown approach treats custom commands as **static files** with no native "/" discovery, no error handling checkpoints, no session control commands. Routing is implicit (filename = command name), not explicit in YAML.

### Synthesis

Slash commands are **session control + discovery**, not just shortcuts. "/" popup + filtering makes discoverability work for novices. Task-specific Markdown keeps scope tight. Checkpoints (Esc-Esc, /compact, git) prevent runaway execution far better than prompt language.

---

## Angle 4: Autonomy vs. Checkpoint Balance

**Key Finding**: Production agentic systems use **"earned autonomy"** (trust scores via Beta distributions tracking success/failure per task category) + **Value of Information gating** (stakes × (1-trust) × uncertainty) to decide auto-execute vs. approval vs. restriction, NOT binary on/off switches. Circuit breakers use **graduated recovery** (5 traffic levels, success-based promotion) to contain degradation.

### 1. Earned Autonomy Model (vs. Binary Autonomy)

- **Old pattern (broken)**: Binary "can do this" or "can't". Results in approval fatigue or unchecked failure.
- **New pattern**: Autonomy earned via repeated successful interactions, per task category
- **Implementation**:
  - Track Beta distribution (α = successes, β = failures) per agent per task type
  - Task types: code_formatting, test_generation, refactoring, database_migration, etc.
  - Trust score = E[p] from Beta (expected success probability)
  - Uncertainty = variance; high variance = low confidence even if E[p] is high
- **Gate decision**:
  - Auto-execute (trust ≥ 0.85, uncertainty ≤ 0.15): Agent acts immediately, logged, user sees result later
  - Soft-execute (0.60 ≤ trust < 0.85): Agent drafts first, user approves
  - Restricted (trust < 0.60): Agent observes/reports only, cannot propose actions
- **Learning loop**: Agent completes task → outcome tracked → Alpha or Beta incremented → trust updates
- **Refinement**: Distinguish between "approved" and "rewritten before approval" (rewrite = partial credit)

**Source**: Ken Schachter Substack "Earned Autonomy", Agentik {OS} blog

### 2. Value of Information (VoI) as Secondary Gate

- **Formula**: VoI = stakes × (1 - trust) × uncertainty
- **Interpretation**: High stakes + low trust + high uncertainty → escalate. Low stakes + high trust + low uncertainty → auto-execute.
- **Three gates in series**:
  1. Scope check (deterministic): Is this task within agent's domain?
  2. Trust gate: Does Beta distribution support this autonomy level?
  3. VoI gate: Even if trust is high, is information value too high to skip review?
- **Result**: Actions that pass all three gates execute autonomously; others escalate

**Source**: Ken Schachter Substack, Vahe Sahakyan Medium "Where LLMs Belong in Agentic Systems"

### 3. Circuit Breaker Design for Agents

- **Classic pattern** (microservices): CLOSED (traffic flows) → OPEN (reject all) → HALF-OPEN (test recovery)
- **Agent extension**: Add DEGRADED state for partial capability
- **Failure taxonomy**:
  - Hard failures (explicit error): Timeout, 500 error, network down
  - Semantic failures (silent hallucinations): Status 200, valid JSON, confidently wrong answer. **Most dangerous.**
  - Emergent drift (decision velocity): Agent makes 1000 decisions/hour, each slightly wrong; accumulates
  - Loop detection (infinite retrieval): Agent keeps retrieving, making no progress
- **Detection methods**:
  - Hard: Exception handling (standard)
  - Semantic: Cross-validation (agent's answer contradicts retrieval results), contradiction detection
  - Drift: Slope detection on success rate over time
  - Loops: Step count limits, repeated action detection
- **Graduated re-enablement** (5 levels, success-based promotion):
  - Level 1: 5% traffic, 10 successes needed, 0 failures allowed
  - Level 2: 25% traffic, 5 successes needed, 1 failure allowed
  - Level 3: 50% traffic, 3 successes, 2 failures allowed
  - → Level 5: 100% traffic, fully open

**Source**: Michael Hannecke Medium "Resilience Circuit Breakers for Agentic AI", Arion Research "Algorithmic Circuit Breakers"

### 4. Gate Patterns: Deterministic Routing Before LLM

- **Anti-pattern**: Let LLM decide if it should act (probabilistic reasoning leaks into control flow)
- **Correct pattern**: Deterministic routing first (scope checks, permission checks, policy checks), then invoke LLM as worker
- **Concrete example**:
  ```
  if (scope_check(request) && permission_check(user) && policy_check(action)):
      invoke_llm(task)   # LLM generates content
  else:
      escalate_to_human()  # No LLM, deterministic deny
  ```
- **Key insight**: LLMs are generators (generate content when invoked), NOT judges (decide whether to invoke). System design decides invocation.

**Source**: Vahe Sahakyan "Where LLMs Belong in Agentic Systems", Artyom Mukhopad "Designing Safe Agentic AI"

### 5. User Trust Dynamics

- **Trust erosion from**: Over-autonomy (automation bias), under-autonomy (approval fatigue), opacity, inconsistency
- **Trust building from**: Transparency (show reasoning, cite sources), predictability, reliability, warmth (agent enables meaningful human contribution)
- **Research**: Low "perceived warmth" of AI agents reduces trust (Nature Scientific Reports, 2026). Warmth = agent doesn't just override human.
- **Optimal frequency**: Not too many interruptions (fatigue), not too few (complacency). Start conservative, expand gradually as evidence builds.

**Source**: Research papers on human-AI trust (Daronnat et al., Nature Scientific Reports, McKee et al.)

### 6. Production System: Devin (Cognition AI)

- **Planning**: High-reasoning Planner model constructs multi-step plans, dynamically re-plans on failures
- **Criticism**: Separate Critic model reviews candidate changes for logic/security before execution
- **Execution**: Sandboxed environment (shell + IDE + browser). Full autonomy, but traceable.
- **Autonomy mechanisms**:
  - Tests run automatically, failures surface to Planner for re-planning
  - PR-first workflow: Agent writes PR with rationale, human reviews, agent responds to comments
  - Human takeover: Can jump into shell/IDE/browser anytime
  - Confidence ratings (🟢 green / 🟡 yellow / 🔴 red) on proposed changes
- **Result**: 67% PR merge rate (production data), bounded execution (sandboxed), iterative refinement

**Source**: Cognition AI product documentation, Devin product update blogs

⚠️ **Design divergence**: Current system lacks **autonomy levels or trust tracking**. No VoI-style gating. No circuit breaker detection for semantic failures. No earned autonomy model. All decisions treated as binary (allowed or not). Gate patterns are implicit in prompts, not in architecture.

### Synthesis

Autonomy is earned, not granted. Beta distributions + VoI gates make trust quantifiable. Circuit breakers catch semantic failures (the silent ones that break systems). Deterministic routing before LLM invocation keeps responsibility in architecture. Production systems (Devin, Copilot) keep humans in the loop via PR reviews, not via removing autonomy.

---

## Angle 5: LLM Working Memory and Context Focus for Long Sessions

**Key Finding**: Context degradation happens at ~60-70% utilization (not capacity), via three mechanisms: **"lost-in-middle" effect** (30%+ accuracy drop for mid-context info), **attention dilution** (quadratic scaling), and **context rot** (noise accumulation). Compression strategies (LLMlingua, ACON, verbatim compaction) reduce tokens 26-95% while preserving 70-95% accuracy. **Graph RAG + multi-query retrieval** outperforms vector-only for multi-hop reasoning.

### 1. Context Degradation Mechanisms (NOT Capacity Limits)

- **"Lost-in-Middle" Effect** (Liu et al., Stanford/TACL): U-shaped accuracy curve: ~90% accuracy on Q&A in first/last 1K tokens, ~60% accuracy in middle. Putting critical instructions in middle of prompt reduces reliability by 30%+. Chroma tested 18 frontier models → all exhibit this at ALL context sizes.
- **Attention Dilution**: Transformer attention is O(n²). At 100K tokens: 10 billion attention weight computations per forward pass. Each new token dilutes attention distribution across all previous tokens.
- **Context Rot**: Tool outputs, intermediate reasoning, exploration dead-ends pile up. Models default to statistical patterns rather than reasoning. Performance cliff at **60-70% utilization** of model's stated window, not at limit.

**Source**: Chroma "Context Rot" research (July 2025), Liu et al. "Lost-in-Middle" (Stanford/TACL), LocalLLaMA experimentation (847 agent runs), Zylos Research context management (Jan 2026)

### 2. Compression Strategies with Benchmarks

- **LLMlingua (Token Pruning)**: Removes redundant tokens. Result: 2-20x token reduction, 70-90% accuracy retention. Use case: Long documents, RAG chunks with noise.
- **ACON (Adaptive Context Optimization)** (arXiv 2510.00615): LLM-guided compression of agent history. Learns task-specific compression guidelines. Result: 26-54% token savings (peak), 95% accuracy on distilled tasks.
- **Verbatim Compaction**: Hard deletion of low-signal turns. Token savings: 50-70%. Hallucination risk: Zero (no LLM inference, deterministic). Tradeoff: Need selective rules.
- **Summarization (Traditional)**: LLM summarizes N turns → 1 summary message. Token savings: 70-90%. Accuracy: 70-90%. Drift risk: Each pass loses something; after K passes, summary is "sanitized generic version".
- **Rolling Windows**: Keep only last N turns + summary of earlier turns. Good for: Conversation coherence. Bad for: Multi-hop reasoning (needs old context).

**Source**: Field Guide to AI context management, ACON paper (arXiv 2510.00615), Morph LLM guides

### 3. Prioritization & Position-Aware Placement

- **Relevance scoring**: Semantic similarity + structural importance (headers, function signatures rank higher) + recency bias (exponential decay)
- **Attention basin concept** (arXiv 2508.05128): Place high-signal info at start & end (attention hot spots). Move middle content to artifact storage.
- **Example**: If you have 10K tokens, put 2K at start (critical facts), 5K in middle (examples), 2K at end (current task)

**Source**: Databricks long-context RAG research, arXiv 2508.05128 "Attention Basin", arXiv 2503.23306 "Focus Directions"

### 4. RAG Patterns for Long Sessions

- **Vector Search Limitations**: Top-k retrieval optimizes for similarity, not reasoning. Doesn't handle multi-hop queries ("A → B → C"). Struggles with interconnected knowledge.
- **Graph RAG Pattern** (Neo4j, Databricks): Extract entities/relationships → build knowledge graph. Retrieve via graph traversal + community summaries. Outperforms vector search for relational reasoning.
- **Multi-Query Retrieval**: Decompose complex question into sub-questions. Retrieve for each sub-query in parallel. Fuse results (e.g., Reciprocal Rank Fusion). Handles ambiguous queries better than single vector search.
- **Adaptive Chunking**: Use document structure (headings, paragraphs, semantic shifts) to identify chunk boundaries. Parent-child relationships: Summary chunks link to detail chunks.

**Source**: Databricks long-context RAG, DecryptCode agentic RAG patterns, PRISM paper (arXiv 2510.14278), Neo4j GraphRAG blog

### 5. Long-Context LLM Behavior

- **Effective context length ≠ stated context window**: Claude 3.5 Sonnet: 200K stated, but effective ~50-100K. GPT-4: 128K stated, effective ~30-50K for complex reasoning. Larger windows delay the cliff; they don't fix lost-in-middle or attention dilution.
- **Peak performance**: 32-64K tokens of curated context outperforms 200K tokens of raw documents.

**Source**: Databricks long-context RAG blog, Chroma context rot research

### 6. Preservation Patterns for Long Sessions

- **Hierarchical Memory (MemGPT pattern)**: Tier 1: Working memory (<4K tokens). Tier 2: Nearby memory (10-20K tokens). Tier 3: Archive (vector DB). OS-like page faults → retrieve from lower tiers on demand.
- **KV Cache Swapping**: Modern LLMs cache key-value attention values between generations. Offload cache to disk (10x faster than recomputing). Enables very long effective context with minimal latency penalty.
- **State Snapshots**: Before destructive operations (refactoring, database changes), save context snapshot. Rollback to snapshot if agent goes wrong. Snapshots are cheap (JSON dumps); can fork contexts.
- **Threshold Compaction**: Trigger compaction at **60% utilization** (before cliff). Inline compaction: Agent calls `/compact` mid-session proactively, not reactively.
- **Decay-Based Refresh**: Age-based sunset for outdated info. Anomaly detection: If current facts contradict archived context, flag as stale. Volatile indicators: Mark rapidly-changing data with high refresh priority.

**Source**: MemGPT, LocalLLaMA experimentation, Field Guide to AI

⚠️ **Design divergence**: Current system has **no compression strategies** (no LLMlingua, ACON, or compaction rules). No hierarchical memory or KV cache management. Context rot is **not detected** (60-70% cliff is silent). No RAG for long sessions — all context injected flat. No position-aware placement or attention steering. /compact exists but lacks tuning (when to compress, how aggressive).

### Synthesis

Context degradation is not a capacity problem — it's a **quality problem**. Performance cliffs at 60-70% utilization, not at stated limits. Compression (26-95% token savings) buys runway. Graph RAG handles multi-hop reasoning. Hierarchical memory + snapshots enable long sessions. Position matters more than quantity: place critical info at start/end, relegate middle to artifact storage.

---

## Top 7 Synthesis Findings

### 1. Tiered Context is Universal — Current Config Is Flat
Production systems (Cursor, Claude Code, Copilot) all use working/episodic/semantic tiers. Current YAML/Markdown approach has no tier abstraction; context is flat. **Implication**: Redesign config to declare memory tiers explicitly (Tier 1: working window, Tier 2: session store, Tier 3: semantic DB). Enable per-tier refresh policies.

### 2. Skills + Progressive Disclosure Outperforms Static Tools by 95%
SKILL.md (metadata preload, instruction on-demand, resources lazy-load) reduces context bloat vs. all-at-once tool definitions. Dynamic loading (Cursor's MCP context footprint reduction) proves scaling: 8 meta-tools outperform 50+ native tools. **Implication**: Migrate from YAML protocols to Skills Protocol. Adopt SKILL.md specification. Support dynamic loading via meta-tools.

### 3. Slash Commands Are Session Control, Not Just Shortcuts
"/" discovery pattern works for discoverability. Task-specific Markdown files scope commands. Checkpoints (Esc-Esc, /compact, git) prevent runaway execution far better than prompt language. **Implication**: Build native "/" autocomplete. Implement checkpoints (undo, context compression, git integration). Make slash commands first-class session primitives.

### 4. Earned Autonomy (Beta Distributions + VoI Gates) Replaces Binary Switches
Ken Schachter's model: Track trust per task category via Beta(α=successes, β=failures). Gate via stakes × (1-trust) × uncertainty. Binary on/off leads to approval fatigue or unchecked errors. Graduated gates (auto-execute / soft-execute / restricted) scale. **Implication**: Add trust tracking to session state. Implement Value of Information gating before invoking LLM. Graduate autonomy based on demonstrated reliability per task type.

### 5. Context Degradation Is Silent (60-70% Cliff, Not Capacity Limit)
Chroma, LocalLLaMA, Databricks research converge: Performance cliffs at 60-70% utilization, not at stated context window limits. Larger context windows don't fix lost-in-middle or attention dilution; they delay the cliff. **Implication**: Trigger compaction proactively at 60% utilization, not reactively at limit. Implement position-aware placement (critical info at start/end). Monitor for context rot via anomaly detection.

### 6. Graph RAG + Multi-Query Retrieval > Vector Search for Agents
Vector search optimizes for similarity, not reasoning. Graph RAG handles "A → B → C" multi-hop queries via entity traversal + community summaries. Multi-query decomposition retrieves sub-answers in parallel, fuses results → higher recall on ambiguous queries. **Implication**: For long-running coding agents, offer RAG with both vector + graph indices. Implement query decomposition. Add reranking and verification.

### 7. Deterministic Routing Before LLM Invocation Keeps Control in Architecture
Anti-pattern: Let LLM decide if it should act (probabilistic leaks into control flow). Correct: Deterministic scope/permission/policy checks → then invoke LLM as worker. **Implication**: Enforce gate patterns in system design, not prompt design. Separate decision (deterministic) from generation (probabilistic). Make responsibility explicit in architecture.

---

## Caveats and Uncertainties

1. **Context Rot Cliff (60-70%) is Empirical, Not Theoretical**: LocalLLaMA experimentation (847 runs) observed cliff at 60-70%. Chroma tested 18 models → all degrade, but no single universal threshold. Future models with better long-context training may change the math.

2. **Earned Autonomy Beta Model Works in Simulation; Production Validation Pending**: Ken Schachter's framework is theoretically sound. No published production system has publicly reported using Beta distributions for autonomy gating. Does it scale to 100+ task categories?

3. **Graph RAG Production Cost Is High**: Requires LLM-driven entity extraction, graph construction, community detection, hierarchical summarization. More expensive than vector RAG during ingestion. Whether cost benefits justify overhead at scale is unverified.

4. **Skills Protocol Adoption Status**: SKILL.md specification exists and is referenced in multiple papers. However, Skills Protocol competes with MCP (Anthropic's Model Context Protocol); unclear which will dominate. Standardization still emerging.

5. **Slash Command vs. Skill Boundary Is Fuzzy**: Should `/run-tests` be a slash command (session control) or a skill (reusable procedure)? No consensus. Actual practice mixes both; no clean separation in production systems.

6. **YAML/Markdown vs. Skills Trade-offs Not Fully Quantified**: YAML/Markdown is simpler (text files, git-friendly). Skills are more powerful (metadata, versioning, dynamic loading) but add complexity. At what scale does Skills complexity pay off?

---

## Sources Cited

**Angle 1 (Context Lifecycle)**:
- OrbitalAI: Memory Management in AI Agents (2025) — https://orbitalai.in/Orbitalai-memory-management.html
- Chier Hu (Medium): Context Lifecycle Demo of Agent Memory Patterns (Dec 2025)
- OneReach.ai: Context Engineering 101 (Sep 2025) — https://onereach.ai/blog/smarter-context-engineering-multi-agent-systems/
- OpenAI Agents SDK: Session Memory & Context Engineering Cookbook (2025)
- Google ADK: Architecting Efficient Context-Aware Multi-Agent Framework (Dec 2025)
- Elixir Data: Context Rot — Why Stale Context Breaks AI Decisions
- Navdeep Singh Gill (LinkedIn): The Freshness Problem — When Context Goes Stale (Feb 2026)
- Cursor: Dynamic Context Discovery (Jan 2026) — https://cursor.com/blog/dynamic-context-discovery
- GitHub Copilot: Spaces Documentation — https://docs.github.com/en/copilot/concepts/context/spaces
- Developer Toolkit: Long-Term Context Retention Patterns (Feb 2026)

**Angle 2 (Protocol/Skills)**:
- SoK: Agentic Skills — Beyond Tool Use in LLM Agents (arXiv 2602.20867, Feb 2026)
- Agent Skills for LLMs: Architecture, Acquisition, Security (arXiv 2602.12430, Feb 2026)
- arXiv 2602.17046: Dynamic System Instructions and Tool Exposure for Efficient Agentic LLMs
- Skills Protocol Documentation — https://skillsprotocol.com/
- Armin Ronacher: Skills vs Dynamic MCP Loadouts (Dec 2025) — https://lucumr.pocoo.org/2025/12/13/skills-vs-mcp/
- SkillMD.ai: How to Build Predictive Skill Loading (Feb 2026)

**Angle 3 (Slash Command UX)**:
- Developer Toolkit: Slash Commands Mastery (Feb 2026)
- arXiv 2603.05344: Building Effective AI Coding Agents for the Terminal (Mar 2026)
- Jason Liu: Slash Commands vs Subagents (Aug 2025) — https://jxnl.co/writing/2025/08/29/context-engineering-slash-commands-subagents/
- howibuild.ai: Context Engineering with Custom Slash Commands (Feb 2026)
- Codex CLI: Slash Commands Guide

**Angle 4 (Autonomy vs. Checkpoint)**:
- Ken Schachter (Substack): Earned Autonomy (Feb 2026) — https://kenschachter.substack.com/p/earned-autonomy
- Michael Hannecke (Medium): Resilience Circuit Breakers for Agentic AI (Feb 2026)
- Vahe Sahakyan (Towards AI): Where LLMs Belong in Agentic Systems (Feb 2026)
- Arion Research: Algorithmic Circuit Breakers (Mar 2026)
- Cognition AI: Devin Product Documentation and Updates (2024-2025) — https://cognition.ai/blog/
- GitHub Copilot: Responsible Use Documentation
- Nature Scientific Reports: Low Perceived Warmth of AI Agents Reduces Trust (2026)

**Angle 5 (Working Memory & Context Focus)**:
- Chroma Research: Context Rot — How Increasing Input Tokens Impacts LLM Performance (July 2025) — https://research.trychroma.com/context-rot
- Liu et al.: "Lost in the Middle" (Stanford, TACL 2024) — https://arxiv.org/abs/2307.03172
- ACON paper (arXiv 2510.00615): Adaptive Context Optimization for LLM Agents
- arXiv 2508.05128: Attention Basin analysis
- Databricks: Long-Context RAG research and blog posts
- MemGPT: Hierarchical Memory for LLMs — https://memgpt.ai/
- LocalLLaMA: 847-run agent experimentation (Reddit thread)
- PRISM paper (arXiv 2510.14278): Multi-query retrieval patterns
