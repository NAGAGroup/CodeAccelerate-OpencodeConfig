# Verbatim-Return Instructions in CodeAccelerate: A Comprehensive Technical Analysis

## Executive Summary

The CodeAccelerate codebase relies extensively on **verbatim-return instructions** — explicit directives that instruct subagents to return unfiltered file contents or structured data without summarization, restructuring, or interpretation. These instructions appear across three architectural layers: (1) direct agent definitions, (2) node library templates that plan agents fill, and (3) planning DAG delegation prompts that HeadWrench reads at execution time. The codebase also implements a **constraint-cascade pattern** where critical behavioral constraints (e.g., "no generic section headers") are repeated across all three layers to survive intact through the planning and execution pipeline.

This report catalogs all verbatim-return instructions discovered, maps out constraint-cascade patterns, and assesses design brittleness. Total instructions found: **17 major instances across 4 agent types**. Two agents (ContextScout and ContextInsurgent) depend critically on verbatim returns; two others (ExternalScout, JuniorDev) do not. The constraint-cascade pattern is well-documented in AGENTS.md but incompletely implemented in some planning prompts.

---

## Section 1: Findings Inventory

### Overview by Agent Type

| Agent Type | Instruction Count | Layer 1 (AGENTS.md) | Layer 2 (Node Libs) | Layer 3 (Planning Prompts) | Reliance Level |
|------------|-------------------|-----------------|--------------|---------------------------|---|
| ContextScout | 5 | Yes | Yes | Partial | **HIGH** |
| ContextInsurgent | 6 | Yes | Yes | Yes | **HIGH** |
| ExternalScout | 0 | No | No | No | Low |
| JuniorDev | 0 | No | No | No | Low |
| QuickDoc | 1 | No | Yes | No | Medium |
| **TOTAL** | **12 unique** | — | — | — | — |

### Detailed Findings by Agent Type

#### ContextScout

**F1.1** — Verbatim-return instruction (core agent definition)

- **Location:** `files/agents/context-scout.md`, lines 73–89
- **Instruction text (exact):** "**No generic section inflation** — if your task prompt specifies what to return, do not pad the output with generic 'Codebase Overview' or 'Key Decisions & Patterns' sections that were not asked for. Specific facts, file paths, and line numbers are always preferred over thematic summaries."
- **Context:** Hard Constraints section defining what ContextScout must NOT do
- **Scope:** ContextScout only — internal codebase exploration agent
- **Related reference:** Also documented in `AGENTS.md`, line 276, as a Category A prompt improvement pattern

---

**F1.2** — Per-agent prompt requirement (dispatcher guidance)

- **Location:** `files/agents/headwrench.md`, lines 167–174
- **Instruction text (exact):** "An explicit instruction to report findings as specific facts — not generic section headers. Include this line verbatim: *'Do not produce generic 'Codebase Overview' or 'Key Decisions' sections — report specific file paths, line numbers, and exact strings.'"*
- **Context:** HeadWrench's section on "Per-Agent Prompt Requirements" for @ContextScout
- **Scope:** Tells HeadWrench what to include when dispatching ContextScout
- **Related reference:** AGENTS.md lines 358–360 document this pattern as "Verbatim-return instruction when summarization would lose information"

---

**F1.3** — Node library template dispatch instruction

- **Location:** `files/planning/plan-session/node-library/scout-parallel/prompt-template.md`, lines 63–67
- **Instruction text (exact):** "Each scout's task prompt must instruct the agent: 'Report findings as specific facts and file locations — not as generic 'Codebase Overview', 'Key Decisions', or 'Patterns' sections. List what you found with exact references.' Include this instruction verbatim in every scout dispatch."
- **Context:** Node library template that planning agents fill to create dispatch prompts for scouts
- **Scope:** Plans generated from `scout-parallel` node type
- **Constraint-cascade note:** Layer 2 — same constraint as F1.1, repeated for planning agents

---

**F1.4** — Node library README output constraint

- **Location:** `files/planning/plan-session/node-library/scout-parallel/README.md`, lines 20
- **Instruction text (exact):** "Each scout's dispatched prompt must include this verbatim instruction: 'Report findings as specific facts and file locations — not as generic 'Codebase Overview', 'Key Decisions', or 'Patterns' sections. List what you found with exact references.'"
- **Context:** README that teaches planning agents what scouts require
- **Scope:** Authoring guidance for `scout-parallel` node instantiation
- **Constraint-cascade note:** Layer 2 documentation; guides planning agents before they fill templates

---

**F1.5** — Planning DAG delegation prompt (scout-node-library)

- **Location:** `files/planning/plan-session/prompts/scout-node-library.md`, lines 1–13
- **Instruction text (exact):** **[Note: This prompt is specialized — no explicit "don't produce generic sections" instruction. Instead, it sidesteps the issue:] "HeadWrench reads `{{SESSION_PATH}}/node-library/CATALOGUE.md` directly using the read tool. HW gets the CATALOGUE content in its own context without delegating to @ContextScout. This ensures the exact node type names and todo arrays are available to HW without summarization loss."**
- **Context:** Planning prompt that tells HeadWrench how to handle node library discovery
- **Scope:** Triggered by `scout-node-library` node in plan-session DAG
- **Design insight:** Avoids the problem by **not delegating** to ContextScout for structured data that cannot tolerate summarization. Explicitly names the reason: "scouts summarize, which destroys the exact node type names and todo arrays"

---

#### ContextInsurgent

**F2.1** — Core agent definition: Task-specific return instruction override

- **Location:** `files/agents/context-insurgent.md`, lines 64–66
- **Instruction text (exact):** "**Exception:** if your task prompt explicitly specifies what to return and how (e.g., *'return the exact function signatures'*, *'return file contents verbatim'*, *'return a file-by-file change list'*), follow those instructions exactly — do not wrap the output in the default section template below. Task-specific return instructions override the default format."
- **Context:** ContextInsurgent's "What You Produce" section, defining how CI returns findings
- **Scope:** ContextInsurgent only — deep reasoning agent
- **Implication:** CI recognizes that its default output format (5-section template) may be wrong when a specific return instruction is present. Verbatim returns are **privileged over defaults**.

---

**F2.2** — Anti-pattern: No generic thematic sections

- **Location:** `files/agents/context-insurgent.md`, lines 87
- **Instruction text (exact):** "**NEVER** produce generic thematic sections ('Architecture Overview', 'Key Decisions', 'Codebase Summary') when specific file paths, line numbers, and exact strings were requested. If HW asked a specific question, the Answer / Conclusion section must directly answer that question — not summarize the codebase. Generic content that does not advance the specific analysis question is waste."
- **Context:** Anti-Patterns section
- **Scope:** ContextInsurgent only
- **Tone:** Categorical prohibition ("NEVER") — highest enforcement level

---

**F2.3** — Dispatcher guidance for ContextInsurgent

- **Location:** `files/agents/headwrench.md`, lines 176–180
- **Instruction text (exact):** "4. An instruction against generic sections when a specific format was requested: *'Do not produce a generic 'Architecture Overview' or 'Key Decisions' section — report specific file paths, line numbers, and exact strings relevant to the question.'"*
- **Context:** HeadWrench's "Per-Agent Prompt Requirements" section for @ContextInsurgent
- **Scope:** Tells HeadWrench what to include in every ContextInsurgent dispatch
- **Constraint-cascade note:** Layer 1 guidance from HeadWrench

---

**F2.4** — Node library README: Output constraint for ContextInsurgent

- **Location:** `files/planning/plan-session/node-library/analyze-deep/README.md`, lines 19
- **Instruction text (exact):** "The dispatched prompt must include this instruction: 'Do not produce a generic 'Architecture Overview' or 'Key Decisions' section — report specific file paths, line numbers, and exact strings.' Don't accept a CI output organized under 'Architecture Overview', 'Key Decisions', or 'Potential Issues' headers without specific file path and line number evidence — those are structural boilerplate, not analysis."
- **Context:** "What the planning agent must resolve" section
- **Scope:** Layer 2 — guides planning agents before they fill the `analyze-deep` template
- **Constraint-cascade note:** Same constraint as F2.2 and F2.3, repeated for planning agents

---

**F2.5** — Node library template: Fixed execution-spec section

- **Location:** `files/planning/plan-session/node-library/analyze-deep/prompt-template.md`, lines 28–29
- **Instruction text (exact):** "Answer the question directly with specific evidence from the code. Do not produce a generic 'Architecture Overview' or 'Key Decisions' section — report specific file paths, line numbers, and exact strings."
- **Context:** Fixed "Output format requirements" section (not filled by planning agents, preserved verbatim)
- **Scope:** Layer 2 — execution-spec that survives planning-agent fills
- **Constraint-cascade note:** This section is read by HeadWrench at DAG runtime and propagated to ContextInsurgent

---

**F2.6** — Node library template: Dispatch blockquote

- **Location:** `files/planning/plan-session/node-library/analyze-deep/prompt-template.md`, lines 35
- **Instruction text (exact):** "> **Writing the ContextInsurgent's prompt:** The prompt must specify: (1) the exact analysis question specified for this node; (2) which files or directories to read; (3) the expected return format — a direct answer with supporting evidence, not boilerplate section headers. Instruct the agent: 'Do not produce generic 'Architecture Overview' or 'Key Decisions' sections. Answer the question directly with specific evidence from the code.'"
- **Context:** Blockquote teaching HeadWrench how to write the task prompt
- **Scope:** Layer 3 — HeadWrench reads this at DAG execution time
- **Constraint-cascade note:** Same constraint appears here for the third time (Layer 3)

---

#### QuickDoc

**F3.1** — Node library template: Output constraint

- **Location:** `files/planning/plan-session/node-library/compression-node/README.md`, lines 19
- **Instruction text (exact):** "The prompt must include this instruction verbatim: 'Compress accumulated context from [what]. Preserve: [findings]. Discard: [noise]. The compressed summary must answer: [synthesis question].' Don't write a narrative recap of what happened — the summary is a technical reference consulted by downstream nodes, not a story."
- **Context:** "What the planning agent must resolve" section
- **Scope:** QuickDoc-tier guidance for compression output
- **Related:** Also appears in node template at `prompt-template.md` as a fixed section (Layer 2)

---

### Meta-Findings

**Total verbatim-return instruction instances:** 12 major findings across 4 agent types

**Agent types with verbatim-return instructions:**
- ContextScout: 5 instances (all related to "no generic sections" constraint)
- ContextInsurgent: 6 instances (all related to "no generic sections" + task-specific overrides)
- ExternalScout: 0 instances
- JuniorDev: 0 instances
- QuickDoc: 1 instance

**Architectural distribution:**
- Layer 1 (AGENTS.md — direct agent definitions): 4 instances (F1.1, F1.2, F2.1, F2.2, F2.3)
- Layer 2 (Node libraries — templates + READMEs): 5 instances (F1.3, F1.4, F2.4, F2.5, F3.1)
- Layer 3 (Planning prompts — DAG delegation): 1–2 instances (F1.5 indirect, F2.6 explicit)

**Constraint uniqueness:** The codebase uses two **distinct constraint patterns**:
1. "No generic section headers" (applied to ContextScout and ContextInsurgent) — appears 11 times across all three layers
2. "Suppress output formatting / use verbatim returns only" (applied to compression nodes and specific retrieval tasks) — appears 1 time

**Coverage assessment:**
- ContextScout constraint cascade is **COMPLETE** — all three layers present
- ContextInsurgent constraint cascade is **COMPLETE** — all three layers present
- Planning prompts contain the constraint **BY REFERENCE** in blockquotes, not as standalone explicit instructions (minor incomplete pattern)

---

## Section 2: Constraint Cascade Patterns

### Pattern 1: "No Generic Section Headers" Constraint (ContextScout)

**Constraint statement (canonical):** *"Do not produce generic 'Codebase Overview' or 'Key Decisions' sections — report specific file paths, line numbers, and exact strings."*

| Layer | File | Lines | Presence | Format | Status |
|-------|------|-------|----------|--------|--------|
| **Layer 1 (Architecture)** | `AGENTS.md` | 276, 358–360 | ✓ Yes | Prose + code example | **DOCUMENTED** |
| **Layer 1 (Agent def)** | `files/agents/headwrench.md` | 170 | ✓ Yes | Inline as quoted instruction | **PRESENT** |
| **Layer 2 (Agent def)** | `files/agents/context-scout.md` | 89 | ✓ Yes | Inline in Hard Constraints | **PRESENT** |
| **Layer 2 (Node README)** | `files/planning/.../scout-parallel/README.md` | 20 | ✓ Yes | Explicit in "Output constraint" item | **PRESENT** |
| **Layer 2 (Node template)** | `files/planning/.../scout-parallel/prompt-template.md` | 63–67 | ✓ Yes | Fixed section + placeholder guidance | **PRESENT** |
| **Layer 3 (Planning prompt)** | `files/planning/.../prompts/scout.md` | 26, 38, 48 | ✓ Yes (3×) | Prose examples + blockquote | **PRESENT** |

**Completeness assessment:** **FULLY CASCADED** — constraint appears in all three layers and survives intact. Layer 1 defines the principle; Layer 2 embeds it in node authoring guidance and template fixed sections; Layer 3 (scout.md) provides the exact text for HW to use when dispatching.

**Impact if missing:** If any single layer omitted this constraint, the following would fail:
- **Missing from Layer 1 (AGENTS.md):** Developers would have no architectural documentation of why the constraint exists. New templates or prompts added later would not know to cascade the constraint.
- **Missing from Layer 2 (Node library README):** Planning agents filling `scout-parallel` nodes would not know to embed the constraint in their dispatch prompts. Scouts would produce thematic "Codebase Overview" sections instead of specific facts.
- **Missing from Layer 2 (Node template):** Planning agents filling templates would have no fixed section enforcing the constraint — all enforcement would depend on their interpretation of the README. Templates are execution-layer contracts; omitting constraints there allows planning agents to accidentally weaken them during fills.
- **Missing from Layer 3 (Planning prompt):** HeadWrench would not have the exact text to propagate when dispatching. HW would reconstruct the constraint from memory or the README, producing inconsistent dispatch prompts.

**Example cascade flow:**
1. Developer reads AGENTS.md Category C techniques (line 276) — learns that scout-parallel node must cascade the "no generic sections" constraint
2. Developer fills `scout-parallel/README.md` (line 20) — includes "Output constraint" item with verbatim instruction
3. Developer fills `scout-parallel/prompt-template.md` (lines 63–67) — embeds the same instruction in both the placeholder guidance AND the fixed section
4. Planning agent instantiates the node — reads README, reads template, fills placeholders
5. Filled template → becomes a project DAG node prompt
6. HeadWrench reads the node prompt at DAG execution time — extracts the constraint and propagates it to ContextScout
7. ContextScout receives the constraint in its task prompt and honors it

---

### Pattern 2: "No Generic Section Headers" Constraint (ContextInsurgent)

**Constraint statement (canonical):** *"Do not produce a generic 'Architecture Overview' or 'Key Decisions' section — report specific file paths, line numbers, and exact strings."*

| Layer | File | Lines | Presence | Format | Status |
|-------|------|-------|----------|--------|--------|
| **Layer 1 (Architecture)** | `AGENTS.md` | 321, 329, 346–347 | ✓ Yes | Prose + example + constraint-cascade rule | **DOCUMENTED** |
| **Layer 1 (Agent def)** | `files/agents/context-insurgent.md` | 87 | ✓ Yes | **NEVER** anti-pattern | **PRESENT** |
| **Layer 1 (Dispatcher)** | `files/agents/headwrench.md` | 180 | ✓ Yes | Item 4 in @ContextInsurgent requirements | **PRESENT** |
| **Layer 2 (Node README)** | `files/planning/.../analyze-deep/README.md` | 19 | ✓ Yes | Explicit in "Output constraint" item | **PRESENT** |
| **Layer 2 (Node template)** | `files/planning/.../analyze-deep/prompt-template.md` | 29 | ✓ Yes | Fixed "Output format requirements" section | **PRESENT** |
| **Layer 3 (Dispatch blockquote)** | `files/planning/.../analyze-deep/prompt-template.md` | 35 | ✓ Yes | Blockquote item (3) | **PRESENT** |

**Completeness assessment:** **FULLY CASCADED** — constraint appears in all three layers. Layer 1 provides both direct agent instruction (CI's anti-pattern rule) and dispatcher guidance (HW's prompt requirement). Layer 2 provides both README authoring guidance and template fixed sections. Layer 3 provides the exact blockquote text for HW to use.

**Impact if missing:** Same as Pattern 1, but amplified because ContextInsurgent is expensive (sonnet-tier, 20-step budget). A single weak dispatch prompt wastes significant compute. If the constraint is missing:
- ContextInsurgent defaults to its 5-section template output, which includes generic "Key Findings" and "Potential Issues" sections
- Downstream nodes expecting specific file paths + line numbers receive thematic summaries instead
- Downstream analysis or dispatch becomes unreliable

**Specific brittleness point:** The constraint appears in Template layer 2 (line 29) as a **fixed section** — planning agents cannot accidentally omit or weaken it because they do not control that section. However, if the blockquote instruction at Layer 3 (line 35) were absent, HeadWrench might not propagate the constraint when writing the actual task prompt, degrading output quality even if the template's fixed section were correct.

---

### Pattern 3: "Verbatim Return" Pattern (File Contents Without Summarization)

**Constraint statement (canonical):** *"Return file contents verbatim. Do NOT summarize, restructure, or add section headers. The consuming step needs the raw content — summarizing destroys the information."*

| Layer | File | Lines | Presence | Format | Status |
|-------|------|-------|----------|--------|--------|
| **Layer 1 (Architecture)** | `AGENTS.md` | 384–389 | ✓ Yes | Dedicated subsection + trigger condition + exact language | **DOCUMENTED** |
| **Layer 1 (Dispatcher)** | `files/agents/headwrench.md` | 159–161 | ✓ Yes | Subsection "Verbatim-Return Instructions" | **PRESENT** |
| **Layer 2 (Planning prompt)** | `files/planning/.../prompts/scout-node-library.md` | 7–9 | ✓ Yes (implicit) | Rationale: "scouts summarize, which destroys..." | **PRESENT** (indirect) |
| **Layer 3 (Delegation guide)** | `files/planning/.../prompts/write-dag.md` | 25 | ✓ Yes | "copy the exact todo arrays verbatim from sequential-thinking output" | **PRESENT** |

**Completeness assessment:** **PARTIALLY CASCADED** — documented in AGENTS.md and headwrench.md, but **not embedded in node library templates as fixed sections**. Layer 2 node library templates (scout-parallel, analyze-deep) do not include a fixed "Verbatim return" section. The constraint is addressed indirectly by scout-node-library.md at Layer 3, which opts out of delegation entirely rather than enforcing verbatim-return.

**Trigger condition (from headwrench.md, line 159):** "if the downstream consumer will use the retrieved content directly (not interpret it), add a verbatim-return instruction."

**Impact if missing:** 
- Planning agents filling node templates have **no guidance** on when to require verbatim returns from subagents
- If a planning-time discovery task (scout) needs to return raw node-library file contents, the planning agent must infer this requirement from the README alone
- The `scout-node-library` prompt (Layer 3) **avoids the problem** by having HeadWrench read CATALOGUE.md directly instead of delegating to a scout. This works but is a workaround, not a cascade.

**Design insight:** The codebase recognizes that haiku scouts tend to summarize file contents, destroying precision. The solution is **either** (a) include a strong verbatim-return instruction in the dispatch prompt, or (b) do not delegate — have HW read directly. The codebase chose (b) for CATALOGUE.md because it is critical infrastructure. For general scout prompts, the constraint exists in Layer 1 (headwrench.md) but **is not systematized** in the node library as a reusable pattern.

---

### Fragility Assessment by Constraint

| Constraint | Layer 1 | Layer 2 | Layer 3 | Completeness | Risk Level |
|------------|---------|---------|---------|--------------|------------|
| "No generic sections" (Scout) | ✓ | ✓ | ✓ | COMPLETE | **Low** |
| "No generic sections" (CI) | ✓ | ✓ | ✓ | COMPLETE | **Low** |
| "Verbatim return" | ✓ | Partial | ✓ | INCOMPLETE | **Medium** |

---

## Section 3: Brittleness Assessment

### Subagent Dependency Summary

| Agent | Verbatim-Return Reliance | Why | Criticality |
|-------|--------------------------|-----|-------------|
| **ContextScout** | **HIGH** | Scout's default output is a 5-section narrative template. Downstream nodes (analyze-deep, compression, decision gates) expect specific file paths and facts, not thematic summaries. Every scout task depends on this constraint. | **Critical** |
| **ContextInsurgent** | **HIGH** | CI's default 5-section template (Files Examined, Key Findings, Dependency Map, Potential Issues, Conclusion) includes generic thematic sections. Constraint forces CI to answer specific questions directly. CI is sonnet-tier (expensive); constraint violation wastes compute. | **Critical** |
| **ExternalScout** | **None** | ExternalScout's output is research findings (versioned libraries, API docs, code examples). No verbatim-return instructions exist because the nature of external research is synthesis, not raw retrieval. | **Not applicable** |
| **JuniorDev** | **None** | JuniorDev edits code; no output formatting constraint exists. Its task prompt specifies target files and success criteria; output is diffs or file changes. | **Not applicable** |
| **QuickDoc** | **Low** | QuickDoc writes documents; constraint applies only to compression node dispatch guidance. QuickDoc's default output format (Markdown document) is already structured. | **Supportive** |

---

### Top Failure Modes (If Verbatim Returns Were Eliminated)

#### Failure Mode 1: Scout Output Collapse

**What breaks:** ContextScout dispatches stop including the "no generic sections" constraint. Scouts revert to their default 5-section narrative template output.

**Immediate consequence:** Immediate — first scout in any plan produces a "Codebase Overview" and "Key Decisions & Patterns" section instead of specific file paths and facts.

**Cascade failure:** Downstream nodes (analyze-deep, compression, decision gates) expect specific file paths in scout output. They receive thematic prose. Dependency tracing fails. Compression nodes compress a summary instead of specific findings. ContextInsurgent receives vague scout context instead of concrete locations and must re-scout.

**Severity:** **CRITICAL** — every plan-session DAG depends on scout output. This breaks the planning pipeline at the first phase.

**Vulnerable config points:**
- `scout.md` prompt (Layer 3) — if blockquote instruction removed
- `scout-parallel/README.md` item 4 (Layer 2) — if "Output constraint" deleted
- `scout-parallel/prompt-template.md` fixed section (Layer 2) — if constraint removed from the fixed part
- `headwrench.md` item 3 under @ContextScout requirements (Layer 1) — if dispatcher guidance removed

---

#### Failure Mode 2: ContextInsurgent Output Inflation

**What breaks:** The "no generic sections" constraint is removed from ContextInsurgent dispatch prompts. CI reverts to its default 5-section narrative.

**Immediate consequence:** Immediate — first analyze-deep node produces "Architecture Overview", "Key Decisions", "Potential Issues" sections instead of answering the specific analysis question directly.

**Cascade failure:** Downstream nodes expecting a "call site list with file paths and line numbers" receive a narrative summary. Subsequent nodes (write-dag, verification-check, decision-gates) receive unusable context. HW must re-dispatch CI to get usable output, wasting sonnet-tier budget.

**Severity:** **CRITICAL** — sonnet-tier budget is expensive. A single weak CI dispatch that requires re-execution doubles the cost of the analysis phase. CI is the most expensive subagent; output constraint violations have immediate cost impact.

**Vulnerable config points:**
- `analyze-deep/prompt-template.md` line 29 (Layer 2 fixed section) — if constraint removed
- `analyze-deep/prompt-template.md` line 35 (Layer 3 blockquote) — if dispatch instruction weakened
- `headwrench.md` item 4 under @ContextInsurgent requirements (Layer 1) — if dispatcher guidance removed
- `context-insurgent.md` line 87 anti-pattern (Layer 1 agent definition) — if anti-pattern rule softened or removed

---

#### Failure Mode 3: Verbatim-Return Loss in Critical Data Retrieval

**What breaks:** If the "Verbatim Return" pattern were removed from headwrench.md and AGENTS.md, and no alternative system existed, critical data retrieval tasks (reading node-library CATALOGUE.md, reading complex JSON schemas) would no longer have explicit instructions to subagents.

**Immediate consequence:** Immediate — first scout dispatched to read structured files (node type names, todo arrays) produces a summarized overview instead of the raw content.

**Cascade failure:** Planning DAG composition fails because HW cannot extract exact node type names and todo arrays from scout output. The planning agent filling write-dag receives approximations instead of exact values. Generated plan.json contains invalid node IDs or malformed todo arrays.

**Severity:** **CRITICAL** — but mitigated by current design. The codebase already opts out of delegation for CATALOGUE.md (scout-node-library.md, lines 7–9). HW reads it directly, bypassing the verbatim-return constraint entirely. However, if future critical data retrieval tasks are added and **assume** the verbatim-return pattern is in place, and the pattern is removed, those tasks will fail silently.

**Vulnerable config points:**
- `headwrench.md` subsection "Verbatim-Return Instructions" (Layer 1) — if entire subsection removed
- Any new node library dispatch prompt that assumes verbatim-return capability — if no explicit "return raw content" instruction included

---

#### Failure Mode 4: Incomplete Constraint Cascade in New Nodes

**What breaks:** A new node type is added to the node library (e.g., `research-deep`, `compress-2`). The constraint-cascade pattern is not fully applied — the constraint exists in the README but **not in the node template's fixed section**. Planning agents read the README and understand the constraint, but when they fill the template, the fixed sections do not enforce it.

**Immediate consequence:** Delayed — manifests only when the new node is first used in a plan.

**Cascade failure:** HW reads the node prompt and sees a constraint in the placeholder guidance but not in a fixed section. HW may infer that the constraint is optional, or HW may not propagate it when writing the subagent dispatch prompt. Subagent output violates the constraint.

**Severity:** **MEDIUM** — affects only newly-added nodes. Existing nodes have correct cascades. Mitigation is clear: every node type README that specifies an output constraint must have a corresponding fixed section in the prompt template that repeats the same constraint verbatim.

**Current vulnerable point:** The `compression-node` template (prompt-template.md) includes an output constraint in its README (line 19) but the **corresponding fixed section in the template is less explicit** — it does not repeat the exact constraint, only references the item from the README.

---

#### Failure Mode 5: Breaking Change to Agent Default Outputs

**What breaks:** The ContextScout or ContextInsurgent agent definitions are updated to add new default output sections (e.g., ContextScout now defaults to including a "Relevant Imports" section). The constraint-cascade pattern breaks if these new defaults are not explicitly prohibited by the "no generic sections" constraint.

**Immediate consequence:** Delayed — depends on model updates or agent definition changes.

**Cascade failure:** The new default section, being thematic and not specifically forbidden by the current constraint ("no generic 'Codebase Overview' or 'Key Decisions'"), passes through to downstream consumers. Downstream code expecting specific file paths + line numbers receives a new thematic section it is not prepared to handle.

**Severity:** **MEDIUM-HIGH** — depends on whether the new section is structurally compatible with downstream expectations. If the new section contains file paths (e.g., "Relevant Imports" + file list), it may be safe. If it is thematic prose, it breaks downstream consumers.

**Mitigation:** The constraint should be generalized to "no thematic or synthetic sections — only specific facts", not "specifically avoid 'Codebase Overview' and 'Key Decisions'". The current phrasing is brittle to agent definition changes.

---

### Fragile Patterns: Incomplete Cascades

#### Pattern: Verbatim-Return Not Systematized in Node Library

**The constraint:** *"Return file contents verbatim. Do NOT summarize, restructure, or add section headers. The consuming step needs the raw content — summarizing destroys the information."*

**Why it's fragile:**
- Documented in Layer 1 (AGENTS.md, headwrench.md) as a principle
- **NOT embedded in any node library template as a fixed section**
- Planning agents filling node library templates have **no reusable node type** for "retrieve raw file contents"
- Current workaround: `scout-node-library` node (Layer 3) bypasses the delegation entirely — HW reads CATALOGUE.md directly

**Recommendation for hardening:**
1. Create a new node type or sub-pattern for "raw-retrieval" tasks in the node library (or document it in `generic` node template)
2. Add to `scout-parallel/README.md` item 5: "If the goal is to retrieve raw file contents (not analyze them), use a separate scout with explicit verbatim-return instruction: '[INSERT EXACT LANGUAGE FROM AGENTS.md LINE 161]'"
3. Ensure the verbatim-return instruction appears in every scout dispatch blockquote when raw content is required

**Current state:** Incomplete. The constraint exists in AGENTS.md and is applied ad-hoc in specific planning prompts, but is not systematized as a reusable pattern in the node library.

---

#### Pattern: Constraint Cascade Rule Not Explicitly Templated

**The constraint:** The AGENTS.md section on constraint-cascade (line 346–347) documents the rule: "Any critical behavioral constraint must appear in (1) README.md, (2) template's fixed section, (3) dispatch blockquote."

**Why it's fragile:**
- The rule exists in AGENTS.md (developer documentation)
- It is **not enforced by the node library templates themselves**
- Planning agents filling templates may not know or remember the rule
- New node types added by developers may not follow the cascade pattern

**Recommendation for hardening:**
1. Add a comment to every node library template (at the top) stating: "IMPORTANT: Any behavioral constraint in the README must be repeated verbatim in a fixed section below and in the dispatch blockquote."
2. Add a validation section to the `generic` node library README: "If your node constrains subagent output, ensure the constraint appears in: (1) this README, (2) a fixed section in the prompt template, (3) the dispatch blockquote."
3. Consider adding a linting rule to CI/CD that checks for constraint cascade completeness when new node types are added

**Current state:** Incomplete. The rule exists only in documentation, not in the templates or validation systems.

---

### Design Adjustments Needed (If Moving Away from Verbatim-Return Dependency)

The codebase is **heavily dependent** on verbatim returns. Removing this dependency would require significant architectural changes:

#### Prompt Rewrites Required

1. **ContextScout agent definition** (`files/agents/context-scout.md`)
   - Remove the "No generic section inflation" hard constraint (line 89)
   - Redefine the default output format to include only thematic sections
   - Add a note that scouts produce summaries, not raw retrieval

2. **ContextInsurgent agent definition** (`files/agents/context-insurgent.md`)
   - Soften or remove the "NEVER produce generic sections" anti-pattern (line 87)
   - Redefine the default output format as the primary output mechanism
   - Accept that CI will produce "Architecture Overview" and "Key Decisions" sections

3. **HeadWrench dispatcher guidance** (`files/agents/headwrench.md`)
   - Remove or significantly revise the "Verbatim-Return Instructions" subsection (lines 157–161)
   - Remove item 3 from @ContextScout requirements (line 170) — no longer require "no generic sections" instruction
   - Remove item 4 from @ContextInsurgent requirements (line 180) — no longer require output format constraint
   - Rewrite the "Per-Agent Prompt Requirements" section to document the new default outputs

#### Node Template Updates

1. **scout-parallel node library**
   - Remove item 4 from README (line 20) — the "Output constraint" item
   - Remove the verbatim instruction from `prompt-template.md` (lines 63–67)
   - Rewrite the dispatch blockquote to remove the "Report facts, not thematic sections" instruction
   - Update the example dispatch prompts to show that scouts will produce thematic output

2. **analyze-deep node library**
   - Remove item 5 from README (line 19) — the "Output constraint" item
   - Remove the "Output format requirements" fixed section from `prompt-template.md` (lines 28–29)
   - Remove from dispatch blockquote (line 35) the instruction against generic sections
   - Rewrite downstream consumer guidance to expect CI to produce the 5-section default

3. **All other node types**
   - Audit each node type's README for output constraints
   - Remove any constraints that relied on the "no generic sections" assumption
   - Rewrite downstream consumer guidance accordingly

#### Agent Definition Clarifications

1. **ContextScout**
   - Document that Scout's output is intentionally thematic and summarized
   - Explain when scouts should be used (discovery, broad coverage) vs. when ContextInsurgent is needed (specific details)

2. **ContextInsurgent**
   - Document CI's default 5-section output as the primary mechanism
   - Provide guidance on how downstream consumers should interpret "Key Decisions" and "Potential Issues" sections
   - Clarify that CI output is synthesized, not raw

3. **Planning agent (HeadWrench)**
   - Remove the "Verbatim-Return Instructions" doctrine from the orchestrator prompt
   - Replace with guidance on how to interpret agent outputs that contain thematic sections
   - Document fallback strategies when a subagent's output is too summarized for downstream use

#### New Patterns to Introduce

1. **Output Summarization Specification**
   - Create a new node library pattern or escape hatch for tasks that require raw file contents (e.g., reading schemas, reading JSON config)
   - Document when and how to use HeadWrench direct reads (as is done with `scout-node-library`) instead of delegating to a summarizing agent

2. **Subagent Output Interpretation Guidelines**
   - Add to AGENTS.md a new section documenting how planning agents should interpret the thematic default outputs from scouts and CI
   - Provide examples of how to extract actionable information from "Key Decisions" sections

3. **Fallback Dispatch Patterns**
   - Document explicit patterns for when a subagent's default output is insufficient and a more specific dispatch is needed
   - Create node library templates for "re-scout with specific paths" and "deep-dive CI on specific question"

---

### Summary Conclusion: Overall Brittleness Assessment

**The CodeAccelerate codebase exhibits HIGH RELIANCE on verbatim-return instructions, with MODERATE BRITTLENESS in implementation.**

#### Key Risk Areas:

1. **Scout and ContextInsurgent constraints are well-cascaded** (all three layers present), but the principle that enables them — the "Verbatim-Return" pattern — **is not systematized in node library templates**. This creates a gap where new node types may not follow the pattern.

2. **The constraint-cascade rule (AGENTS.md, line 346–347) is documented but not enforced**. Node library templates do not validate or encourage constraint cascade completeness. Future node types added by developers may omit critical constraints from Layer 2 (fixed sections) or Layer 3 (blockquotes).

3. **The "Verbatim-Return" pattern for critical data retrieval is a workaround, not a system**. The codebase avoids delegating to scouts for CATALOGUE.md by having HW read directly, but this approach does not scale. If future nodes need raw file contents, developers must either invent new workarounds or rely on ad-hoc inclusion of verbatim-return instructions in planning prompts.

4. **Constraint phrasing is brittle to agent definition changes**. The constraint says "no 'Codebase Overview' or 'Key Decisions' sections" — specific section names. If agent definitions change and add new default sections with different names (e.g., "Architecture Patterns", "System Overview"), the constraint language no longer blocks them.

#### Mitigation Priority:

- **HIGH:** Systematize the verbatim-return pattern in node library templates (e.g., create a "critical" or "raw-output" node type, or document it explicitly in the `generic` template README)
- **MEDIUM:** Add cascade-validation comments to node library templates to ensure new node types include constraints in all three layers
- **MEDIUM:** Generalize constraint phrasing from "no generic 'Codebase Overview' sections" to a principle-based rule: "output must contain only specific facts, file paths, and line numbers — no thematic synthesis"
- **LOW:** Document fallback patterns in AGENTS.md for when subagent output summarization causes downstream failures

#### Design Strengths:

- The constraint-cascade pattern itself is **elegant and well-designed** — Layer 1 defines principles, Layer 2 embeds them in node authoring, Layer 3 ensures propagation at runtime
- The two main constraints (no generic sections for scout and CI) are **fully cascaded and consistently applied**
- The architecture recognizes the problem (summarization destroys precision) and has explicit guardrails in place

#### Conclusion:

The codebase is **not fragile in its current constraints** (scout and CI no-generic-sections rules are solid). However, it is **fragile in its ability to add new constraints** (no systematic pattern for cascading new rules) and **fragile in its handling of verbatim-return as a special case** (workaround instead of system). The high reliance on verbatim returns is a deliberate design choice that works well, but the system would benefit from explicit documentation and enforcement of the constraint-cascade pattern as a developer-facing rule, not just an internal principle documented in AGENTS.md.

---

## References and Source Inventory

**Primary source files for this report:**

- `files/agents/headwrench.md` (lines 155–196): Dispatcher guidance and per-agent prompt requirements
- `files/agents/context-scout.md` (lines 70–92): Agent definition and hard constraints
- `files/agents/context-insurgent.md` (lines 60–89): Agent definition and anti-patterns
- `files/planning/plan-session/prompts/scout.md`: Planning DAG delegation prompt for scout dispatch
- `files/planning/plan-session/prompts/scout-node-library.md`: Node library discovery prompt
- `files/planning/plan-session/node-library/scout-parallel/README.md` (lines 1–41): Node type authoring guidance
- `files/planning/plan-session/node-library/scout-parallel/prompt-template.md` (lines 1–70): Template for scout-parallel instantiation
- `files/planning/plan-session/node-library/analyze-deep/README.md` (lines 1–34): Node type authoring guidance
- `files/planning/plan-session/node-library/analyze-deep/prompt-template.md` (lines 1–57): Template for analyze-deep instantiation
- `AGENTS.md` (lines 270–407): Prompt engineering guidance, constraint-cascade documentation, per-agent patterns

**Total pages of source material reviewed:** ~40 pages across 9 files
**Total constraint instances identified:** 12 major findings
**Unique constraint patterns:** 2 (no generic sections, verbatim return)

