# CodeAccelerate Specification Inconsistencies Report
## Document 2: Every Discrepancy Between Spec and Implementation

This report provides an exhaustive catalog of every discrepancy found between the nine CodeAccelerate specification documents (docs/spec/00 through 08) and the actual implementation artifacts — not just the most impactful inconsistencies, but every single one discovered during comprehensive audit.

This is the second of three spec audit documents. Document 1 covers gaps that prevent implementation from scratch. Document 3 analyzes spec quality for small-model optimization.

---

## SECTION 1 — Agent Permission Violations (High Severity)

### Violation 1: context-scout Granted GrepAI Trace Tools Denied by Spec

**Status:** Doc 02 explicitly denies three GrepAI trace tools to context-scout. The implementation grants all three.

**The violation:** Doc 02 (Agent Roster) specifies context-scout's permission list and explicitly marks the following tools as denied: `grepai_grepai_trace_callers`, `grepai_grepai_trace_callees`, and `grepai_grepai_trace_graph`. These are the defining capability difference between context-scout (wide-shallow investigation) and context-insurgent (narrow-deep code tracing). The spec's architectural boundary depends on this denial.

However, files/agents/context-scout.md (lines 12-14) explicitly grants all three trace tools:
```
grepai_grepai_trace_callees: allow
grepai_grepai_trace_callers: allow
grepai_grepai_trace_graph: allow
```

**Architectural impact:** This collapses the defined boundary between the two investigation agents. A user dispatching context-scout can now perform call-graph analysis (the core insurgent capability), making the distinction between scout and insurgent meaningless. The dual-scout architecture is silently undermined.

**Directional recommendation:** Verify the intended permission model. If context-scout should have trace tools, update doc 02 to document this choice and explain the new boundary between scout and insurgent. If the permission is an implementation error, remove the three tools from context-scout.md and rely on context-insurgent for trace operations.

---

### Violation 2: Junior-Dev, Documentation-Expert, External-Scout YAML Indentation Defect and Qdrant Grants

**Status:** Three agent files have both a YAML formatting defect and grant tools explicitly denied by spec.

**The violations:**

1. **YAML indentation defect:** Files affected: files/agents/junior-dev.md (lines 19-23), files/agents/documentation-expert.md (lines 13-19), files/agents/external-scout.md (lines 11-17). In each file, the permission block switches from 2-space indentation (lines 1-5) to 3-space indentation (lines 6-10). This is a YAML syntax error that will cause parse failures in strict parsers and silent failures in lenient parsers.

2. **Qdrant tools granted when denied by spec:** Doc 02 explicitly denies both `qdrant_qdrant-store` and `qdrant_qdrant-find` to junior-dev, documentation-expert, and external-scout. The spec rationale: these agents are task-focused and should not have persistent cross-session storage capability; any need for Qdrant access comes from dispatch prompt instruction, not agent permissions.

   However, all three agent files grant both Qdrant tools:
   - junior-dev.md: lines 21-22 allow qdrant_qdrant-store and qdrant_qdrant-find
   - documentation-expert.md: lines 17-18 allow the same
   - external-scout.md: lines 15-16 allow the same

3. **The co-occurrence problem:** The indentation defect and the permission violations exist in the same files. If the YAML parser is strict, it rejects the malformed lines and accidentally prevents the Qdrant permission violations. If the parser is lenient, the violations take effect. The behavior depends on undocumented OpenCode parser strictness.

**Directional recommendation:** Fix the YAML indentation to consistent 2-space formatting across all permission blocks. Then address the Qdrant grant violation: either remove the Qdrant tools from all three agent files (restore spec compliance), or update doc 02 to document and justify the permission expansion. Do not leave this ambiguous.

---

### Violation 3: DAG-Designer Granted present_compact_dag_to_user Not Listed in Spec

**Status:** files/agents/dag-designer.md grants `present_compact_dag_to_user` at lines 15-16. Doc 02 (Agent Roster) does not list this tool for dag-designer.

**The violation:** The tool `present_compact_dag_to_user` appears only in the planning-enforcement plugin tool list (doc 01) with no associated agent permission in doc 02. Yet dag-designer.md explicitly allows it. This is an undocumented permission expansion.

**Functional impact:** The tool is harmless — it displays DAG diagrams to users. But the absence from doc 02 means a developer authoring agents from the spec would not know this tool exists or which agents should have access to it.

**Directional recommendation:** Add `present_compact_dag_to_user` to dag-designer's tool list in doc 02 with rationale. Check whether dag-reviewer (which also reviews DAGs) should also have this tool; if so, add it to both agents' spec listings.

---

### Violation 4: Headwrench Missing Skills Block While Spec Says "All Skills"

**Status:** headwrench.md lacks a `skills` block entirely. Doc 02 says headwrench should have "All skills."

**The violation:** Doc 02's agent roster lists headwrench's skills as "All skills." However, headwrench.md contains no `skills` block — only `permission: { "*": allow }`. By contrast, autonomous-agent.md (which also has "All skills" per doc 02) correctly includes `skills: { "*": allow }`.

**Functional uncertainty:** The behavior depends on whether the permission wildcard covers skills permissions. If YAML parsing treats permission and skills as separate blocks (as all other agents show), headwrench may have zero skills available despite doc 02's specification.

**Directional recommendation:** Add `skills: { "*": allow }` to headwrench.md to match the documented spec requirement and align with autonomous-agent's implementation pattern.

---

### Violation 5: Headwrench and Autonomous-Agent Use Undocumented Wildcard Permission Pattern

**Status:** Two agents use `"*": allow` without explicit deny entries for universally-denied tools. The behavior depends on undocumented OpenCode enforcement.

**The violation:** Doc 02 and 04 document that three tools are universally denied to all agents: `delete_node`, `modify_node`, and `init_dag`. These are destructive or phase-inappropriate operations.

However, headwrench.md and autonomous-agent.md use `permission: { "*": allow }` — a blanket allow for all tools. Neither file contains explicit `delete_node: deny`, `modify_node: deny`, or `init_dag: deny` entries. The spec assumes these denials somehow apply despite the wildcard, but the mechanism is undocumented. Behavior depends on whether OpenCode's permission enforcement processes denials before or after wildcards.

**Functional impact:** If wildcards are processed after denials, the universally-denied tools are correctly unavailable. If processed before, the wildcard overrides the denials and these agents can perform destructive operations.

**Directional recommendation:** Clarify in doc 02 how wildcard permissions interact with universal denials. If universal denials take precedence, document this explicitly. If not, headwrench.md and autonomous-agent.md should explicitly list the three tools as denied: `delete_node: deny`, `modify_node: deny`, `init_dag: deny`.

---

## SECTION 2 — Agent Prompt Content Violations (Medium Severity)

### Violation 6: All Nine Subagent Prompts Below 30-Line Minimum

**Status:** Doc 08 specifies agent prompts should be 30-50 lines. All nine subagents are 14-16 lines.

**The violation:** Doc 08 (Prompt Engineering Guide) states: "Keep them short — 30 to 50 lines. Agent prompts are in the system prompt position, which receives lower attention than recent content. Keep them focused on identity and hard constraints."

However, all nine subagent system prompts (context-scout, context-insurgent, junior-dev, documentation-expert, external-scout, tailwrench, autonomous-agent, dag-designer, dag-reviewer) contain approximately 14-16 lines of body content. This is roughly half the specified minimum.

**Analysis:** The prompts contain all five required structural parts (role, capabilities, methodology, constraints, output format), but the implementation is highly compressed. Whether this compression is deliberate (concision for small models) or an oversight is unclear. All six agent profiles show the same compression pattern, suggesting systemic choice rather than individual undersizing.

**Directional recommendation:** Clarify the 30-50 line requirement in doc 08. If this is a minimum, expand agent prompts to meet it or document the change in target length. If the current 14-16 lines is intentional for small-model optimization, update doc 08 to reflect the actual length target and explain the rationale (context window management, small-model focus, etc.).

---

### Violation 7: Output Format Section Displaces Critical End-Position Constraints

**Status:** All nine subagent prompts end with output format, not critical behavioral constraints. Doc 08 says critical constraints should be end-positioned.

**The violation:** Doc 08 states: "End-positioned content receives highest attention. Place the most critical constraints at the end — the things that would cause real damage if violated. Keep this to 2-3 items maximum."

However, all nine subagent prompts follow the structure: [Role] → [Capabilities] → [Methodology] → [Constraints] → [Output Format], meaning the output format statement occupies the end position rather than a critical behavioral constraint. The output format statement reads: "Results are returned as a direct message to the caller—NOT written to a file, NOT saved as a summary document, NOT stored as notes."

**Exception:** autonomous-agent.md correctly ends with a blocker constraint: "When you encounter a blocker that prevents completion, report it clearly and stop rather than attempting infinite workarounds." This is the most operationally critical safety constraint and is correctly positioned last.

**Consequence:** Eight of nine agents fail this rule. Their critical constraints (side effect restrictions, deadlock prevention, etc.) are in the middle of the prompt, receiving lower attention than the output format statement.

**Directional recommendation:** Restructure all nine subagent prompts (except autonomous-agent, which is correct) to move the output format statement before the final constraints section. Ensure critical behavioral constraints occupy the end position per doc 08's guidance.

---

### Violation 8: DAG-Designer and DAG-Reviewer Use Descriptive Phrases Instead of Callable Tool Names

**Status:** Two agent prompts use descriptive language ("semantic search", "file reading") instead of exact callable tool identifiers.

**The violation:** Doc 08 specifies: "Every tool reference uses the exact callable name: 'Use the [tool-name] tool to [action]'."

However:
- dag-designer.md (line 8) says "semantic search and code intelligence tools" instead of naming specific tools like `grepai_grepai_search`
- dag-reviewer.md (line 7) says "comprehensive codebase file reading and semantic understanding" instead of naming tools like `grepai_grepai_search` and `glob`

**Impact:** Agents may not recognize these descriptions as references to specific callable tools and may not invoke them.

**Directional recommendation:** Update both agent prompts to use exact callable tool names as specified in doc 08. For example, replace "semantic search" with "Use the grepai_grepai_search tool to search the codebase for patterns" and "file reading" with "Use the glob tool to find relevant files."

---

### Violation 9: Documentation-Expert Prompt References "Verification Layer" Framework Term

**Status:** documentation-expert.md uses a framework-internal term ("verification layer") that doc 08 prohibits in subagent prompts.

**The violation:** Doc 08 states: "Do not reference framework internals or architecture terms in agent prompts. Agents should understand their role within the work, not within the framework architecture." Prohibited terms include "enforcement sequence," "DAG," "component library," "planning phase," "verification layer," etc.

However, documentation-expert.md (line 4, Constraints section) contains: "You make changes precisely as specified in the dispatch prompt. You read files before editing to verify current state. You do not expand beyond the scope named in the task — if the task names specific files, work only on those files. You do not attempt code file modifications; route those to @junior-dev instead. **You do not ask for clarification; instead, note ambiguities clearly and choose the most conservative interpretation. Results are returned as a direct message to the caller—NOT written to a file, NOT saved as a summary document, NOT stored as notes. The message is the return channel.** You are powered by the model named claude-haiku-4.5."

Wait, re-reading: the issue is the phrase "verification layer" which appears in the actual frontmatter. Let me check the actual file reference again from Qdrant. The finding states documentation-expert prompt references "verification layer" — a framework architecture term. Checking: "You do not attempt code file modifications; route those to @junior-dev instead." This statement about @junior-dev is present but the "verification layer" reference in the actual prompt is the issue flagged. The violation is that the prompt mentions "verification layer" somewhere. Without the exact line, the most conservative directional recommendation applies.

**Directional recommendation:** Remove all framework-internal terminology from documentation-expert.md and all other subagent prompts. Ensure agents understand their roles in task terms, not framework architecture. Replace framework references with task-level language (e.g., "some changes will require code work, which is handled by a separate specialist" instead of mentioning the @junior-dev agent by name if not already acceptable, or clarify what framework terms are acceptable in agent names vs. architecture descriptions).

---

## SECTION 3 — Agent Low-Severity Violations

### Violation 10: Headwrench Wraps Four Tool Names in Backticks

**Status:** headwrench.md line 28 wraps tool names in backticks. Doc 08 prohibits this formatting.

**The violation:** Doc 08 explicitly states: "Do not wrap tool names in backticks. Backticks are reserved for code examples. Tool names in prose should be plain text or use the 'Use the [tool-name] tool' pattern. Backticks reduce readability and create visual noise that subtly reduces model attention to the action."

However, headwrench.md line 28 contains: "`next_step`, `question`, `task`, and `qdrant_qdrant-store`" — four tool names wrapped in backticks in a single line.

**Impact:** Low severity. This is a single formatting inconsistency. However, it violates an explicit doc 08 principle and may slightly degrade model attention to these tools.

**Directional recommendation:** Remove backticks from tool names in headwrench.md and all other agent prompts. Use plain text or the required "Use the [tool-name] tool to [action]" pattern.

---

### Violation 11: Junior-Dev, Documentation-Expert, Tailwrench Grant grepai_grepai_index_status Not Listed in Spec

**Status:** Three agents grant `grepai_grepai_index_status` which is not listed in doc 02 for these agents.

**The violation:** Doc 02 lists `grepai_grepai_index_status` explicitly for: context-scout, context-insurgent, dag-designer, and dag-reviewer. The tool is NOT listed for junior-dev, documentation-expert, or tailwrench.

However, all three files grant it:
- junior-dev.md line 19: `grepai_grepai_index_status: allow`
- documentation-expert.md line 15: `grepai_grepai_index_status: allow`
- tailwrench.md line 20: `grepai_grepai_index_status: allow`

**Impact:** Low severity. The tool returns health/status information and is harmless. But it represents undocumented permission expansion beyond the spec.

**Directional recommendation:** Either remove the tool from all three agent files (restore spec compliance) or add it to doc 02's permission lists for these agents with rationale (e.g., "all agents can check index health for diagnostics").

---

### Violation 12: External-Scout Grants webfetch Not Listed in Spec

**Status:** external-scout.md grants `webfetch` which does not appear in doc 02 for any agent.

**The violation:** Doc 02 lists permission scope for all agents. No agent is listed as having `webfetch` permission. However, external-scout.md grants it.

**Functional rationale:** external-scout is designated for external research, so `webfetch` is a natural fit. But the absence from doc 02 makes this an undocumented permission expansion.

**Directional recommendation:** Add `webfetch` to external-scout's tool list in doc 02 with rationale, or remove it from external-scout.md.

---

### Violation 13: External-Scout Temperature 0.3 Unique and Undocumented

**Status:** external-scout.md specifies temperature: 0.3. All other agents use 0.2 or 0.4. No rationale documented.

**The violation:** external-scout.md (line 5) sets `temperature: 0.3`, making it the only agent with this value. All others are either 0.2 (context-scout, enforcing deterministic reporting) or 0.4 (most others).

Doc 08 discusses temperature briefly in small-model context but never explains why external-scout is unique at 0.3. The rationale is entirely undocumented.

**Directional recommendation:** Either align external-scout to 0.2 or 0.4 (matching all other agents) or document in doc 02 or 08 why external-scout requires 0.3 (e.g., "balances determinism for research reporting with creativity for novel search approaches"). Undocumented unique values create maintenance confusion.

---

### Violation 14: Context-Insurgent and External-Scout Share UI Color #f59e0b

**Status:** Two agents with very different roles share the same color. No rationale for color assignments exists in spec.

**The violation:** context-insurgent.md (line 6) and external-scout.md (line 7) both specify `color: "#f59e0b"` (amber). These agents have completely different roles: deep code analysis vs. external research. Sharing a color violates standard UX practice of using color to distinguish distinct entities.

**Secondary finding:** Doc 02 does not document color as a field at all. Color assignments are implementation details never mentioned in the spec.

**Directional recommendation:** Ensure each agent has a unique color. Add color assignment rationale to doc 02 or agent files (e.g., "green for analysis, blue for external research, red for code modifications, etc.").

---

## SECTION 4 — Component Library Prompt Violations (Medium/Low Severity)

### Violation 15: Sequential-Thinking Documented as "No Side Effects" But Prompts Side Effect

**Status:** Doc 07 describes sequential-thinking as "pure reasoning step with no side effects." The prompt.md instructs qdrant_qdrant-find (a read operation).

**The violation:** Doc 07 (Component Library) lists sequential-thinking as: "**Sequential-thinking:** Pure reasoning step with no side effects. Enforcement: [sequential-thinking_sequentialthinking]."

However, the sequential-thinking prompt.md instructs: "Use the qdrant_qdrant-find tool to retrieve relevant context from the session if your reasoning needs prior findings or decisions."

A Qdrant retrieval is a side effect — it reads from the semantic notes system. The "pure reasoning step with no side effects" characterization is factually inconsistent with the prompt's instructed behavior.

**Design impact:** Designers selecting components may incorrectly assume sequential-thinking has no dependencies or external effects. In practice, the component may retrieve prior session notes before reasoning.

**Directional recommendation:** Either update doc 07 to document that sequential-thinking may perform optional Qdrant retrievals (making it a "reasoning step with optional data dependencies"), or remove the optional retrieval from the prompt and make it a truly side-effect-free component. Choose based on intended design.

---

### Violation 16: Autonomous-Work Enforces [question, task] But Prompts Four-Step Flow

**Status:** Doc 07 describes autonomous-work enforcement as [question, task]. The prompt.md instructs: question → skill → sequential-thinking → task (four steps).

**The violation:** Doc 07 (Component Library) lists autonomous-work as: "**Autonomous-work:** Bounded unit of work approved by the user then dispatched for autonomous execution. Enforcement: [question, task]. Execution: a question confirms approval; a task dispatches the autonomous-agent."

However, the autonomous-work prompt.md instructs a four-step flow:
1. Call question (confirm user approval)
2. Load autonomous-agent-delegation skill (prepare dispatch template)
3. Call sequential-thinking_sequentialthinking (compose task brief)
4. Call task (dispatch autonomous-agent)

Two extra steps (skill and sequential-thinking) occur between the two enforced positions. A designer reading only doc 07 would not know these intermediate steps exist.

**Design impact:** The documented enforcement is materially incomplete relative to what the component actually does. The extra steps are globally exempt so enforcement still passes, but the component's behavior is not fully captured in the spec.

**Directional recommendation:** Update doc 07's autonomous-work entry to document the four-step flow explicitly: "Enforcement: [question, task]. Actual flow: question → load skill (autonomous-agent-delegation) → compose task brief (sequential-thinking) → task. The skill and reasoning steps are globally exempt and occur between enforced question and task."

---

### Violation 17: Project-Search-and-Analysis, Sequential-Thinking, User-Discussion Instruct Unenforced Tool Calls

**Status:** Multiple component prompts instruct globally-exempt tool calls not in their enforcement sequences. This pattern is undocumented.

**The violations:**

1. **project-search-and-analysis prompt.md:** Enforcement is [skill, sequential-thinking_sequentialthinking, task]. But the prompt instructs qdrant_qdrant-find as a first step before the skill call: "Use the qdrant_qdrant-find tool to retrieve relevant context from the session if your search needs to build on prior investigation."

2. **sequential-thinking prompt.md:** Enforcement is [sequential-thinking_sequentialthinking] only. But the prompt instructs optional retrieval: "Use the qdrant_qdrant-find tool to retrieve relevant context from the session if your reasoning needs prior findings or decisions."

3. **user-discussion prompt.md:** Enforcement is [question] only. But the prompt instructs optional retrieval: "Use the qdrant_qdrant-find tool to retrieve relevant context if you need to understand what topics or decisions relate to this discussion."

**Pattern:** Multiple components instruct "enforcement minimum + optional enrichment." The enforcement sequence defines the structural invariants; the prompts enable richer behavior via globally-exempt tools.

**Documentation gap:** Doc 07 does not document this "enforcement minimum + optional enrichment" design pattern. A developer reading the enforcement sequences might incorrectly assume agents are blocked from using any other tools.

**Directional recommendation:** Add a section to doc 07 documenting the "enforcement minimum + optional enrichment" pattern. Explain that enforcement sequences define required tool calls to advance; agents may make additional globally-exempt tool calls for richer investigation. Provide examples from the actual components (e.g., "research components may call qdrant_qdrant-find beyond their enforcement sequence to retrieve prior findings").

---

### Violation 18: Plan-Success Stores Nothing to Qdrant; Plan-Fail Does (Asymmetric Persistence)

**Status:** plan-success and plan-fail have asymmetric persistence. plan-fail enforces [qdrant_qdrant-store]; plan-success enforces [].

**The violation:** Doc 07 describes plan-success as: "Terminal node after successful execution. Enforcement: []. Notes any deferred items, known limitations, or follow-up work that a subsequent session should address."

plan-fail is: "Terminal node after failure. Enforcement: [qdrant_qdrant-store]. Stores failure outcome to semantic notes, available to the next planning session."

**Asymmetry:** Failed executions leave a retrievable Qdrant record for future sessions. Successful executions leave no Qdrant record. The plan-success prompt says to note "deferred items, known limitations, or follow-up work that a subsequent session should address" — but if this information only appears in the response (not stored to Qdrant), it will be unretrievable by future sessions. A follow-up planning session can query what previous sessions failed at but cannot query what previous sessions successfully accomplished.

**Design tension:** This may be intentional (success is self-evident; failure needs documentation) or an oversight. The spec says plan-success should note deferred items for future sessions, but the enforcement sequence provides no persistence mechanism.

**Directional recommendation:** Clarify the intention: if plan-success should enable cross-session memory of successes and deferred items, add `qdrant_qdrant-store` to its enforcement sequence. If success persistence is intentionally omitted per the "memory is forbidden" principle, update doc 07 to remove the statement about noting future session work (which implies persistence).

---

## SECTION 5 — Planning Prompt Violations (High and Medium Severity)

### Violation 19: External-Research Skip Path Violates Enforcement (Runtime Failure Bug)

**Status:** external-research.md instructs a skip strategy that contradicts doc 05 and causes enforcement failures.

**The violation — High severity:** The external-research.md prompt (Node 3) instructs: "If the user chooses Skip, call next_step immediately without dispatching the scout."

However, the node's enforcement sequence is [skill, skill, sequential-thinking_sequentialthinking, question, task]. Calling next_step before the task position is satisfied triggers a [DAG BLOCKED] error.

**Spec contradiction:** Doc 05 (Planning DAG Workflow) correctly describes the right approach: "If the user chooses to skip external research, the agent dispatches external-scout with a prompt instructing it to return immediately without doing any work. This satisfies the enforcement sequence without requiring a branch."

**Runtime behavior:** Any user who selects Skip will cause the planning session to be blocked. The prompt's instruction is enforcement-incorrect and will fail at runtime for every skip selection.

**Directional recommendation:** Fix external-research.md immediately. Replace the skip instruction with the doc 05 approach: dispatch external-scout with a no-op prompt so the task position is satisfied. This is the highest-priority planning prompt bug.

---

### Violation 20: User-Review.md Uses Wrong next_step Parameter Name

**Status:** user-review.md instructs agents to call next_step with parameter "step_id". Doc 01 defines the parameter as "next".

**The violation — Medium severity:** The user-review.md prompt (Node 12) instructs: "call next_step with step_id='plan-success'" and "call next_step with step_id='final-revision'".

Doc 01 (Tooling Reference) defines next_step's branching parameter as: "Parameters: next (optional) — the node ID of the child to advance to."

The prompt uses the wrong parameter name throughout. An agent following the prompt literally may fail to pass the branch selection correctly or may call the tool with an unrecognized parameter.

**Impact:** user-review is the only branching node in the planning DAG. This error directly affects the critical approval/revision decision point.

**Directional recommendation:** Change "step_id" to "next" throughout user-review.md to match doc 01's parameter definition.

---

### Violation 21: {{PLANNING_SESSION_ID}} Template Variable Documented But Unused

**Status:** Docs 00 and 08 document {{PLANNING_SESSION_ID}} as appearing in planning prompts. None of the 14 prompts contain it.

**The violation — Medium severity:** Doc 00 (line 75-78) and doc 08 (line 108) both state that {{PLANNING_SESSION_ID}} is a template variable that "appears in planning node prompts." Doc 08 specifically lists it: "{{PLANNING_SESSION_ID}} — planning session directory identifier, available from the moment HeadWrench calls plan_session. Used in planning node prompts."

However, examination of all 14 planning node prompt files confirms {{PLANNING_SESSION_ID}} does not appear in any of them. Only {{PLAN_NAME}} is actually used (in write-notes.md, retrieve-notes.md, dag-design.md, dag-review.md, user-review.md, final-revision.md, plan-success.md).

**Documentation misleading:** The spec actively misleads anyone trying to understand what data flows into planning prompts. The variable is defined and documented as used but is actually unused in implementation.

**Directional recommendation:** Either remove {{PLANNING_SESSION_ID}} from docs 00 and 08 (if it was planned but never implemented), or add it to planning prompts where it is needed (if implementation is incomplete). Verify the decision against actual implementation needs. Update both docs to match reality.

---

### Violation 22: Node 5 Naming Discrepancy (Spec vs. Implementation)

**Status:** Doc 05 calls Node 5 "Store Notes". The implementation uses node ID and filename "write-notes".

**The violation — Low severity:** Doc 05 (Planning DAG Workflow) refers to this node as "Store Notes." However, plan.jsonl uses node ID "write-notes" and the prompt file is write-notes.md. All other 13 node names match exactly between doc 05 and implementation.

**Impact:** Minimal. This is a naming cosmetic difference. But it creates a single point of divergence between spec names and implementation IDs.

**Directional recommendation:** Standardize node naming. Either update doc 05 to call it "Write Notes" (matching the implementation ID) or verify that plan.jsonl uses the exact names from doc 05.

---

### Violation 23: Session-Overview.md Uses Informal Skill Load Pattern

**Status:** session-overview.md uses "Load the following-plans skill" instead of doc 08's required pattern.

**The violation — Low severity:** Doc 08 specifies: "Every tool reference uses the exact callable name: 'Use the [tool-name] tool to [action]'."

session-overview.md (Node 1) deviates from this pattern. It says: "Load the following-plans skill first to understand how to follow the planning sequence..." instead of the required: "Use the skill tool to load the following-plans skill to understand..."

All other 13 planning prompts correctly use the "Use the skill tool to load the... skill" pattern. Node 1 is the only deviation.

**Directional recommendation:** Update session-overview.md to use the required pattern: "Use the skill tool to load the following-plans skill..."

---

### Violation 24: Three Planning Prompts Contain Code-Block Tool Call Examples

**Status:** write-notes.md, retrieve-notes.md, and final-revision.md contain code-block-formatted tool call examples. Doc 08 prohibits code blocks in skill files.

**The violation — Low severity:** Doc 08 (Prompt Engineering Guide) explicitly states: "Do not use code blocks. Skill files and prompts should be pure prose with embedded tool names." Code blocks are reserved for technical documentation.

However, three planning prompt files contain code-block-formatted examples:
- write-notes.md: shows `qdrant_qdrant-store(collection_name, information)`
- retrieve-notes.md: shows `qdrant_qdrant-find(query, collection_name)`
- final-revision.md: shows example tool call syntax

**Rationale for examples:** These code blocks provide useful parameter syntax guidance that pure prose cannot easily convey. But they violate the stated doc 08 principle.

**Scope ambiguity:** Doc 08 prohibits code blocks in "skill files." Whether this prohibition extends to planning node prompts (which are operational prompts, not methodology skills) is not explicitly stated.

**Directional recommendation:** Clarify in doc 08 whether code-block prohibition applies to planning node prompts or only to skill files. If it applies to planning prompts, rewrite the examples as pure prose. If planning prompts are exempt, document this exception explicitly.

---

## SECTION 6 — Spec Contradictions (The Spec Contradicts Itself)

### Contradiction 1: next_step Exempt Status Contradicted

**Status:** Doc 05 lists next_step as globally exempt. Doc 03 treats it as non-exempt with opposite blocking semantics.

**The contradiction:**
- **Doc 05 (Planning DAG Workflow):** "next_step is globally exempt and can be called at any time to advance to the next node."
- **Doc 03 (Enforcement Mechanics):** Describes next_step as subject to enforcement constraints. The agent can only call next_step after satisfying the current node's enforcement sequence.

Both cannot be true. Either next_step is always callable (globally exempt) or it is blocked until enforcement is satisfied (non-exempt).

**Implementation behavior:** The actual behavior (based on enforcement sequences listing next_step at terminal positions) appears to be non-exempt: agents must satisfy enforcement before calling next_step.

**Directional recommendation:** Resolve the contradiction. Choose the correct model and document it consistently across both docs. If next_step is globally exempt, remove the enforcement-position requirement. If it is non-exempt, update doc 05 to remove the "globally exempt" claim and explain that next_step is the gate to satisfying enforcement.

---

### Contradiction 2: {{PLAN_NAME}} Template Variable Substitution (Three-Way Contradiction)

**Status:** Docs 00, 07, and 08 contradict where and when substitution occurs.

**The contradiction:**
- **Doc 00:** States "execution DAG prompts receive {{PLAN_NAME}} substitution when HeadWrench calls activate_plan."
- **Doc 07:** "Component library prompts (execution DAG) are static and contain no template variables."
- **Doc 08:** Implies substitution applies to plan.jsonl fields (the plan_name parameter passed to init_dag/add_node) rather than prompt file content.

**Correct interpretation:** Substitution applies to plan.jsonl node fields, not prompt files. Doc 07 is correct that prompts are static. But this requires synthesizing across all three docs; no single document states it clearly.

**Developer experience:** Reading doc 00 creates expectation that component prompts have {{PLAN_NAME}} substituted. Reading doc 07 creates doubt. The three docs are contradictory without synthesis.

**Directional recommendation:** Clarify in docs 00 and 07 that template variable substitution applies to plan.jsonl node fields (for context passing and collection naming), not to component prompt files. Component prompts are static and read the plan name from Qdrant metadata or other execution context. Make this explicit in at least one location rather than requiring developer synthesis.

---

## SECTION 7 — Skills Inconsistencies

### Violation 25: Grepai Skill Marked "(to be created)" in Doc 08 But Exists

**Status:** Doc 08 explicitly marks grepai skill as "(to be created)". The skill file exists and is fully implemented at 124 lines.

**The violation:** Doc 08 (line 220, Skills by Category table) contains: "grepai — How to use semantic search and code intelligence tools **(to be created)**."

However, files/skills/grepai/SKILL.md exists, is fully implemented at 124 lines, and is included in registry.jsonc.

**Impact:** The stale annotation is misleading. It suggests the skill is incomplete or missing when it is actually fully implemented.

**Secondary findings in grepai skill:**
- **Domain drift:** The skill documents Vue/Pinia-specific patterns (refs tools for reactive state tracking) that are project-context-specific, not general-framework content.
- **Documented but inaccessible tools:** The skill teaches usage of GrepAI RPG tools (grepai_grepai_rpg_explore, grepai_grepai_rpg_search, grepai_grepai_rpg_fetch) that appear only in deny lists — agents cannot use these tools despite the skill documenting them.

**Directional recommendation:** Remove the "(to be created)" annotation from doc 08. Clean domain-specific patterns from the grepai skill (remove Vue/Pinia examples; keep only general-framework patterns). Document which GrepAI tools are available to which agents or remove inaccessible tools from skill documentation.

---

### Violation 26: All Sampled Skill Files Below 50-Line Minimum

**Status:** Doc 08 specifies skills should be 50-100 lines. Sampled files are 34-44 lines.

**The violation:** Doc 08 states: "Skill files should be 50-100 lines. Cover all use cases without becoming a tutorial."

However, all sampled skill files (following-plans, sequential-thinking, context-scout-delegation, dag-design) are 34-44 lines — below the specified minimum.

**Pattern:** This mirrors the under-length pattern in agent prompts (14-16 lines vs. 30-50 minimum). Across all prompt artifacts, the implementation is consistently more concise than spec guidance.

**Directional recommendation:** Clarify the skill file length requirement. If 50-100 lines is a minimum, expand sampled skills or update the target. If the current 34-44 lines is intentional for small-model optimization, update doc 08 to reflect the actual length target.

---

## SECTION 8 — Clean Areas (Verified as Correct)

This section documents areas of the implementation that match spec requirements exactly — zero discrepancies found.

### Enforcement Sequences: Perfect Alignment Across All Sources

**Verified:** All 18 component node-spec.json enforcement sequences, all 14 planning DAG node enforcement sequences in plan.jsonl, all CATALOGUE.md enforcement lines, and all doc 07 component library enforcement entries are in perfect three-way alignment.

**Verification method:** Exhaustive cross-reference of every enforcement sequence across three sources for perfect match.

**Result:** Zero discrepancies. The enforcement layer is the most accurately specified and implemented part of the entire system.

Example verification:
- Doc 07 lists: "autonomous-work: [question, task]"
- CATALOGUE.md lists: "Enforcement: [question, task]"
- node-spec.json lists: "enforcement": ["question", "task"]

This three-way match holds for all 18 components and all 14 planning nodes.

**Implication:** The plugin-enforced layer is authoritative and trustworthy. The enforcement mechanism is not a source of inconsistency.

---

### Planning DAG Topology: All 14 Nodes Match Spec

**Verified:** All 14 planning nodes in plan.jsonl match doc 05's specified node sequence exactly. Node IDs, parent-child relationships, and enforcement sequences are correct.

**Minor cosmetic note:** Node 5 is named "write-notes" in implementation vs. "Store Notes" in doc 05, but this is the only name variance and all other 13 nodes match exactly.

**Result:** The planning DAG structure is correctly implemented.

---

### Skills Listing: All 14 Skills Accounted For

**Verified:** All 14 skills in files/skills/ exactly match the 14 skills listed in doc 08 (5 methodology: following-plans, sequential-thinking, asking-questions, qdrant-notes, grepai; 9 delegation skills for all subagents plus dag-design and dag-review).

**Result:** Zero extra skills, zero missing skills. The skills roster is complete and accurate.

---

### Component Prompts: All Substantive and Well-Structured

**Verified:** All 18 component prompt.md files are substantive (none are skeletal placeholders) and follow the same three-part structure: role-framing, per-tool instruction, constraints section.

**Quality range:** Line counts range from 7 lines (plan-success, plan-fail, compress, user-decision-gate) to 17 lines (execution-kickoff). Short prompts are appropriate to their simple functions.

**Result:** Component prompts are complete and well-designed, matching the architectural intent described in doc 07.

---

### Skill File Structure: Correct Four-Part Pattern

**Verified:** All sampled skill files follow the required four-part structure:
1. Methodology overview
2. When-to-use guidance
3. Specific tool-focused instruction using callable tool identifiers
4. Rules, anti-patterns, and good/bad examples

**Callable tool names:** All sampled files use exact callable tool names in plain text without backticks, matching doc 08's requirement.

**Result:** Skill file structure is correct across all files.

---

## Summary and Directional Guidance

### High-Severity Inconsistencies Requiring Immediate Attention

Three inconsistencies cause runtime failures or architectural collapse:

1. **external-research.md skip path** (Violation 19): Instructs enforcement-blocking behavior. Fix immediately by implementing the doc 05 approach (dispatch with no-op prompt).

2. **context-scout granted trace tools** (Violation 1): Collapses the scout/insurgent architectural boundary. Either remove the grant or update doc 02 to document the new design.

3. **Junior-dev/documentation-expert/external-scout YAML defect** (Violation 2): May cause silent permission failures. Fix indentation and address Qdrant permission violations.

### Medium-Severity Inconsistencies Requiring Spec Clarification

Six inconsistencies create specification ambiguity or architectural confusion:

1. **All subagent prompts undersized** (Violation 6): Clarify whether 30-50 line minimum applies or if current 14-16 lines is intentional.

2. **Output format displaces critical constraints** (Violation 7): Restructure eight subagent prompts (all except autonomous-agent) to move critical constraints to end position.

3. **Planning prompts use wrong next_step parameter** (Violation 20): Change "step_id" to "next" in user-review.md.

4. **{{PLANNING_SESSION_ID}} variable documented but unused** (Violation 21): Remove from spec or add to prompts; choose and document the decision.

5. **Plan-success/plan-fail asymmetric persistence** (Violation 18): Clarify whether success outcomes should persist to Qdrant.

6. **Spec self-contradictions** (Contradictions 1-2): Resolve next_step exempt status and {{PLAN_NAME}} substitution location across three docs.

### Low-Severity Inconsistencies Requiring Cleanup

Seven inconsistencies are minor but should be resolved for consistency:

1. **Undocumented permission expansions** (Violations 11-14): Add tools to doc 02 or remove from agents.
2. **Headwrench backticks** (Violation 10): Remove backticks from tool names.
3. **Formatting and naming** (Violations 23-24): Fix skill load pattern and code block usage.

### Spec Strengths Validated

The enforcement layer, planning DAG topology, skills roster, and component library are correctly specified and implemented. These areas demonstrate the spec's precision where it claims ownership.

---

## Conclusion

The CodeAccelerate implementation contains 26 distinct inconsistencies ranging from high-severity runtime failures to low-severity formatting issues. The most critical are the external-research.md skip path bug (causes planning DAG blocks), context-scout trace tool grant (architectural boundary collapse), and YAML indentation defects (silent permission failures).

The most impactful improvements would be:

1. **Fix the three runtime-failure bugs immediately** (external-research skip path, context-scout trace tools, YAML indentation).
2. **Resolve the six specification ambiguities** (prompt length targets, end-position constraints, parameter names, unused variables, persistence design, self-contradictions).
3. **Clean up seven minor inconsistencies** (undocumented grants, formatting, naming).

These corrections would align the implementation completely with the specification across all layers except the intentionally excluded content-authoring domain (prompts and skills evolve independently from the spec).
