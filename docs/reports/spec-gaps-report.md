# CodeAccelerate Specification Gaps Report
## Document 1: Implementation Blockers and Directional Guidance

This report catalogs gaps in the nine CodeAccelerate specification documents (docs/spec/00 through 08) that would prevent a developer from implementing the system from scratch based on the spec alone. It provides directional recommendations for each gap, framed as scope expansion and clarity improvements rather than error corrections.

This is the first of three spec audit documents. It focuses on gaps that block implementation. Document 2 covers inconsistencies between the spec and implementation artifacts. Document 3 analyzes spec quality for small-model optimization.

---

## Critical Gaps: Implementation Blocked Entirely

### Gap 1: The `activate_plan` Tool Has No Documented Contract

**Status:** Referenced across docs 00, 06, and 08 and in the `/activate-plan` command file. Entirely absent from doc 01 (Tooling Reference).

**Impact:** The tool that triggers all execution is undocumented. No parameters, return values, side effects, or failure modes exist anywhere in the 9 spec documents. Doc 01 lists 14 planning-enforcement plugin tools and omits the one tool that is arguably the most critical to the entire system.

**What a developer would experience:** Reading doc 01 for the tools available during execution, they would find 14 tools listed. Searching for activation mechanics, they would find references to `activate_plan` in docs 00 and 06 with only behavioral description ("begins execution"), not a contract. The slash command file contains the only operational guidance: "handles DAG state initialization and prompt injection." An implementer cannot build this tool's interface from the spec alone.

**Recommendation:** Expand doc 01 to include the `activate_plan` tool with complete specification: accepted parameters (plan name, optional session recovery), return value format, behavioral side effects (DAG state initialization, prompt injection, enforcement cursor reset), and failure modes (plan not found, corrupted plan.jsonl, session state unrecoverable). Add a note clarifying that this tool is the structural inverse of `plan_session` — one starts planning, one starts execution.

---

### Gap 2: Agent YAML Frontmatter Schema Never Defined

**Status:** Doc 02 describes agent capabilities, tools, and constraints extensively. The YAML file format that encodes those agents is entirely unspecified.

**Impact:** A developer authoring a new agent (or implementing the 10 existing agents) has no schema definition. Every field must be reverse-engineered from existing agent files or assumed from OpenCode platform knowledge.

**Fields never documented:** The complete schema includes:
- `name`: string identifier
- `description`: string for OpenCode UI display
- `mode`: enum value `subagent` (present on all dispatched agents; absent on headwrench)
- `steps`: integer step limit (absent means unlimited)
- `color`: hex string for UI display (e.g., `#22c55e`)
- `temperature`: float model temperature (0.2 to 0.4 across agents)
- `permission`: nested permission model with tool names and optional pattern-level rules (only visible in autonomous-agent YAML)
- `skills`: nested skills permission model with wildcard and individual skill names

**What a developer would experience:** They would find agents are implemented as YAML frontmatter files plus prose system prompts. The frontmatter syntax appears nowhere in the spec. The permission model is explained in prose ("everything not explicitly permitted is denied") but the YAML syntax for expressing permissions is never shown. The `skills` key, `temperature` field, `color` field, and `mode` field are entirely invisible. An implementer would need to examine the autonomous-agent.md file to discover the nested bash permission pattern syntax.

**Recommendation:** Doc 02 should include a complete agent YAML schema definition with canonical example. Show all fields, document the permission block syntax with examples (wildcard, individual tool, nested bash patterns), and explain the `skills` key with examples. Specify the semantics of `mode: subagent` and its relationship to the `task` tool dispatch mechanism. Document why `temperature` is set to 0.2 for context-scout (enforces deterministic reporting) and 0.4 for most others (balances creativity and consistency).

---

### Gap 3: Plugin Loading Mechanism Entirely Undocumented

**Status:** Doc 00 says "our plugin" is loaded via the `plugin` key in `opencode.jsonc`. The package identifier, DCP plugin vs. planning-enforcement.js distinction, and tool registration process are never documented.

**Impact:** A developer cannot get the plugin running. They would know it exists, know it should be loaded, but not know what to install or how OpenCode loads it.

**What's missing:** The plugin key in profiles specifies `@tarquinen/opencode-dcp@latest` — an external package identifier never mentioned in the spec. The planning-enforcement.js file exists as compiled plugin output but its relationship to the DCP package is never explained. The tool registration process — how the plugin exports its 15 tools to OpenCode — is entirely absent.

**What a developer would experience:** They would read doc 00's description of "our plugin" and assume it's described somewhere in the implementation section. Reading the tooling reference and architecture docs, they would find tool definitions but no explanation of how the plugin itself is installed or initialized. They would examine registry.jsonc and see `@tarquinen/opencode-dcp@latest` referenced but would have no documentation of what that package is or why it's the plugin. They could not implement the system without external documentation of OpenCode's plugin system.

**Recommendation:** Doc 00 should add a subsection under "Major Components" explaining the plugin loading mechanism. Document that the planning-enforcement plugin is distributed as an OpenCode DCP package (@tarquinen/opencode-dcp@latest), that it registers 15 tools with OpenCode at load time, and that profiles specify it via the `plugin` key. Link to (or inline minimal guidance for) OpenCode's plugin loading mechanism. Alternatively, add this information to a new doc 09 (Implementation Guidance) rather than expanding doc 00.

---

### Gap 4: All Content-Level Artifacts Are Structurally Described But Never Authored

**Status:** The spec describes how planning prompts, component prompts, and skill files work. None of them are actually written in or specified by the spec.

**Impact:** A developer has a complete architecture for using these artifacts but no specification of what the artifacts should contain. This is the widest category of implementation gap.

**Specific unspecified artifacts:**
- All 14 planning node prompt files: described by intent and enforcement sequence; actual content never given
- All 18 component prompt.md files: described by intent; actual prompt text never given
- All ~14 skill files: structure requirements documented; content never given
- The DAG design guide: explicitly called "a runtime document, not a spec document" in doc 00; no substitute guidance provided

**What a developer would experience:** They would read doc 05 describing each planning node's intent ("User Questions investigates requirements"), doc 07 describing each component's intent ("autonomous-work is a bounded unit of work approved by the user"), and the delegation pattern (doc 04) describing how to write dispatch prompts. They would then need to write 14 + 18 = 32 prompt files from scratch with only intent-level guidance. They would have architectural knowledge but no content templates.

**Recommendation:** This gap cannot be closed entirely by the spec — the spec is not a prompt engineering tutorial. However, the spec should include representative examples: one complete planning node prompt with explanation of design choices, one complete component prompt with explanation of how it implements the enforcement sequence, and one complete skill file with explanation of the methodology it teaches. These examples would not be authoritative (since content cannot be spec-governed and will evolve), but they would provide templates and rationale. Alternatively, create a separate doc 09 (Content Authoring Guide) that covers prompt engineering principles specific to this system.

---

## High-Severity Gaps: Development Significantly Impeded

### Gap 5: Registry System and OCX Distribution Entirely Undocumented

**Status:** The system's deployment artifact manifest exists (registry.jsonc) but has no spec coverage. The OCX distribution system is never mentioned.

**Impact:** A developer knows what to implement but cannot package it for distribution or understand how it gets installed into users' projects.

**What's undocumented:** The registry.jsonc schema has two structural variants:
- Flat string arrays for tool and bundle components (`files: ["path/to/file.js"]`)
- Path-object arrays with `target` field for profiles (`files: [{path: "src/opencode.jsonc", target: "opencode.jsonc"}]`)

The `target` field is the mechanism by which profiles override the user's local opencode.jsonc. The entire OCX deployment layer — how `ocx install` distributes files, how registries reference external packages, how profiles get placed into user projects — is invisible to the spec. Root-level metadata fields (version constraints like `opencode: "1.27.0"`) are never documented.

**What a developer would experience:** They would read doc 00's description of "components" and artifacts but would not find where registry.jsonc is documented. They would see a registry.jsonc file in the project but would have no spec guidance on its format or validation rules. They could not build a registry from the spec alone.

**Recommendation:** Either add a new doc 09 (Deployment and Distribution) that documents registry.jsonc schema, OCX distribution mechanisms, and deployment workflows, or expand doc 00's "File System Layout" section to include project structure above the code level (registry.jsonc, profiles directory, plugin source). Document both the flat-array and path-object variants of the `files` field with examples. Explain the `target` field's role in profile installation.

---

### Gap 6: Profile System and Configuration Completely Undocumented

**Status:** Six profiles exist (default, haiku, copilot, haiku-copilot, free, ollama). Each contains operational configuration the spec never documents.

**Impact:** A developer cannot configure the system for different model deployments and does not understand what profiles do.

**Critical missing information:**

- **Small-model key misleading:** The opencode.jsonc `small_model` key sets OpenCode's built-in compaction agent model (all profiles use `opencode/big-pickle`). The name is misleading given the spec's extensive "small model" design discussion. A developer reading the small-model section might incorrectly assume this key controls the primary agent model.

- **Three disabled OpenCode built-in agents:** Every profile sets `disable: true` on agents named `plan`, `general`, and `explore`. The spec never mentions these built-ins exist or that they must be disabled. A developer not knowing about these built-in agents could have conflicting agents active.

- **Plugin loading in profiles:** Each profile's opencode.jsonc specifies `plugin: ["@tarquinen/opencode-dcp@latest"]`. The spec never documents this.

- **OCX.jsonc schema:** Each profile includes an ocx.jsonc with `registries` block mapping registry names to URLs, `renameWindow: true`, and include/exclude arrays. Never documented.

- **Critical reasoning mode configuration:** The Ollama profile contains a configuration comment explaining that reasoning mode must be disabled via `reasoningEffort: "none"` in model options, or there is approximately a 60% tool-execution failure rate with thinking-capable models like Qwen 3. This is the single most impactful small-model optimization fact in the entire implementation and lives in a JSONC comment rather than in spec documentation.

- **Profile naming differs from spec:** The spec says "frontier/Sonnet, frontier/Haiku, Ollama, free, copilot" but actual profiles are named "default, haiku, copilot, haiku-copilot, free, ollama."

**What a developer would experience:** They would understand the system architecture but could not configure it for different environments. They would read the small-model design discussion and not understand why there is a `small_model` key that does not control small model selection. They would set up the system on Ollama and experience ~60% tool execution failures without knowing to disable reasoning mode. They would find profile configuration files in the codebase but have no spec documentation of the schema.

**Recommendation:** Create a new doc 09 (Profiles and Configuration) or expand doc 00 with a substantial "Configuration and Profiles" section. Document each profile's purpose, the opencode.jsonc and ocx.jsonc schema with annotated examples, and the critical `reasoningEffort` configuration for small-model optimization. Clarify that `small_model` sets the compaction agent, not the primary agent model. Document what the three disabled OpenCode built-in agents are and why they must be disabled.

---

### Gap 7: DAG Design Guide Content Is Operationally Essential But Explicitly Out-of-Scope

**Status:** The dag-design-guide.md file (151 lines) contains spec-level design knowledge. Doc 00 explicitly calls it "a runtime document, not a spec document" and disclaims responsibility for it.

**Impact:** A planner using the dag-designer component has no guidance on good DAG design. The component selection criteria, structural patterns, and anti-patterns that distinguish correct DAGs from broken ones exist only in the runtime document. Doc 07's component library provides architectural knowledge but not design guidance.

**What's in the runtime document but not in the spec:**
- Seven design principles (investigation-before-implementation, verify-after-every-change, compression-at-context-boundaries with the rule "kickoff-refresher must immediately follow compress", branching-for-genuine-alternatives with "branches must not share nodes", plan-fail-as-default-failure-terminal, err-toward-more-nodes)
- Four component selection criteria (project-search-and-analysis vs. sequential-thinking, write-notes vs. decision-gate, user-discussion vs. user-decision-gate, autonomous-work usage gate)
- Six canonical structural patterns with ASCII diagrams
- Rationale-writing guidance including the critical rule "decision-gate and user-decision-gate nodes require explicit rationale notes stored by exact node ID" — without this, executing agents have no basis for making branching decisions
- Six named anti-patterns (investigation-free work, verification batching, compress-without-kickoff-refresher, per-node-prescription-in-rationale, ending-failure-branches-in-plan-success, autonomous-work-without-user-approval)

**What a developer would experience:** They would read doc 07's component catalog and understand what each component does. They would then dispatch the dag-designer subagent to build a DAG but would have no guidance on good design. The dag-reviewer component uses the seven design principles as its review criteria (get_dag_design_guide returns the guide), but a reviewer working from spec alone would have no criteria to apply. The system would function but users would produce poor-quality DAGs.

**Recommendation:** The spec's exclusion of dag-design-guide content is intentional boundary-setting. Rather than move the content into the spec, clarify this boundary in doc 00: explicitly state that DAG design principles are taught through the dag-design-guide runtime resource, which is loaded by the dag-designer and dag-reviewer components at execution time. Reference the guide as the source of truth for design principles and anti-patterns. Alternatively, if the spec should cover DAG design, move the guide's principles and patterns into doc 07 (Component Library) with explicit ownership rather than treating them as runtime-only.

---

### Gap 8: CATALOGUE.md Format and Usage Constraints Undocumented

**Status:** The CATALOGUE.md file documents all 18 components but its format and design constraints are never specified.

**Impact:** A developer cannot understand what format get_planning_components_catalogue should return or what constraints govern component composition.

**What's undocumented:**
- **File format:** Markdown with H3 component headings, usage paragraph, and "Enforcement: [...]" line. Never defined in the spec.
- **Usage guidance beyond doc 07:** CATALOGUE.md contains placement rules not in the component library spec. Examples: "compress always followed by kickoff-refresher" (design rule, not architectural requirement), "project-search-and-analysis: use before work-item when current state needs understanding."
- **Co-occurrence constraints:** These exist only in CATALOGUE.md and are operationally critical but spectrally absent.

**What a developer would experience:** They would implement get_planning_components_catalogue knowing it should return a catalog of components but with no format specification. They would read doc 07 for component definitions but would not find the CATALOGUE.md's contextual usage guidance. They could produce a valid catalog that lacks the operational guidance the dag-designer component expects.

**Recommendation:** Doc 07 should specify the CATALOGUE.md format with canonical example. Document that the file is returned by get_planning_components_catalogue and includes usage-in-context guidance beyond the component definitions in the spec. List the section taxonomy (Automatic, Core, Logic, Verification and Operations, General). Document known co-occurrence constraints (compress → kickoff-refresher, autonomous-work requires user approval) as design rules in doc 07 rather than treating them as runtime-only knowledge.

---

### Gap 9: Infrastructure and Runtime Dependencies Are Assumed But Never Configured

**Status:** The system assumes multiple services exist and are configured but provides no configuration guidance for any of them.

**Impact:** A developer cannot set up the development environment from the spec alone. They would not know what services to run locally or how to configure them.

**Undocumented infrastructure:**
- Qdrant with implicit collection creation and FastEmbed configured (the embedding model is never named)
- Sequential Thinking MCP server, locally hosted
- SearXNG, locally hosted
- GrepAI index properly configured for the project
- Component library location in the global config (the path where add_node reads component definitions)
- Planning DAG template location (the path where plan_session copies the template)
- OpenCode plugin API registration mechanism

**What a developer would experience:** They would understand that Qdrant is used for semantic notes and read doc 00's description of the collection lifecycle. But they would have no guidance on installing Qdrant, configuring FastEmbed, or enabling implicit collection creation. They would see tool calls to external MCPs (Sequential Thinking, SearXNG, GrepAI) but would have no OpenCode configuration guidance. They could not deploy the system without external OpenCode documentation.

**Recommendation:** Create a new doc 09 (Implementation Guide) or add substantial content to doc 00 documenting the infrastructure stack: Qdrant installation and configuration (FastEmbed, implicit collections, embedding model), MCP server setup (Sequential Thinking, SearXNG, GrepAI), component library path configuration, planning DAG template path configuration, and OpenCode plugin registration. This information can be concise (configuration examples, not tutorials) but must be spec-owned rather than delegated to external documentation.

---

## Medium-Severity Gaps: Correctness Degraded or Design Intent Unclear

### Gap 10: Enforcement Minimum + Optional Enrichment Pattern Is Undocumented

**Status:** Multiple component prompt.md files instruct globally-exempt tool calls beyond their enforcement sequences. This is a valid design pattern but never documented.

**Impact:** A developer reading doc 07 might incorrectly assume enforcement sequences are exhaustive and that agents are blocked from using any other tools.

**What's undocumented:** Doc 03 and 07 document enforcement sequences as the minimum required tools. Multiple components' prose instructions then ask agents to perform additional (globally-exempt) tool calls: qdrant_qdrant-find in many components, grepai_grepai_search in research components, sequential-thinking calls in reasoning nodes. This is intentional — the enforcement sequence defines the minimal path, and agents are empowered to use globally-exempt tools for richer investigation. But the spec never documents this as a design principle.

**What a developer would experience:** They would read that enforcement sequences are mandatory, then encounter prompts that ask for additional tool calls not in the sequence. They might incorrectly conclude the prompts are over-specified or that the enforcement mechanism is not working as described.

**Recommendation:** Doc 03 (Enforcement Mechanics) should add a section explaining the enforcement minimum vs. optional enrichment pattern. State explicitly that enforcement sequences define the minimum path and that agents are empowered to make additional globally-exempt tool calls within the scope of their permissions. Give examples from the actual component prompts (e.g., research components call qdrant_qdrant-find beyond their enforcement sequence).

---

### Gap 11: Plan.jsonl Header Schema Undocumented

**Status:** The plan.jsonl files begin with a JSON header line containing schema metadata. The schema is never documented anywhere.

**Impact:** A developer cannot understand the plan.jsonl format completely. They would know nodes are defined in JSONL format but would not understand the header line's structure.

**What's in the header:** `{"schema_version":"3.0","id":"plan-session","entry_node_id":"session-overview"}` — three fields that define the DAG schema version, the DAG's identifier, and the entry point node ID. These are operationally critical but unspecified.

**What a developer would experience:** They would read doc 07 describing node schema (id, parent, children, enforcement, prompt_path) but would not see documentation of the header line. They could reverse-engineer it from plan.jsonl but this is infrastructure knowledge that should be explicit.

**Recommendation:** Doc 07 (Component Library and DAG Schema) should include a section on plan.jsonl format. Document the header line schema and explain each field. Show canonical example of a complete plan.jsonl with header and two-three sample nodes.

---

### Gap 12: Terminal Node Behavior When `next_step` Is Called Is Unspecified

**Status:** Doc 06 and 07 describe terminal nodes (plan-success, plan-fail) that call next_step but never define what the plugin returns when next_step has no children.

**Impact:** A developer cannot implement plan success/failure path handling. The behavioral contract is incomplete.

**What's unspecified:** When next_step is called on a terminal node (no children in the DAG), what does the plugin return? An error? A success message? A special "session complete" response? Doc 07 says "After qdrant_qdrant-store is called and next_step is called, execution stops" for plan-fail, but next_step is not listed in plan-fail's enforcement sequence. The statement implies next_step must still be called but contradicts the enforcement specification.

**What a developer would experience:** They would read the planning DAG structure and see that plan-success is terminal (no children) and that its prose says to call next_step. They would then look for the contract in doc 01 but would find that next_step's return value is not specified for the terminal case. They could not implement reliable session termination.

**Recommendation:** Doc 01 (Tooling Reference) should extend next_step's specification to document the terminal node case. What does the tool return when called on a node with no children? Is this an error case or a success case? Update doc 07's plan-fail description to clarify whether next_step is implied by "execution stops" or is actually required.

---

### Gap 13: Enforcement Cursor State Persistence Through Context Loss Is Unspecified

**Status:** Doc 03 defines cursor mechanics precisely but never states whether cursor state is persisted and restored during recover_context.

**Impact:** An implementer cannot guarantee enforcement reliability. If the cursor is lost during autocompaction, the agent may restart an enforcement sequence partially completed, causing duplicate tool calls and broken state.

**What's unspecified:** Does the enforcement cursor persist in the plugin's storage? If context is lost and recovered, does the cursor resume from where it left off or reset to the beginning? Doc 01 says recover_context returns "current node ID, list of completed nodes, and any recorded session state" but "recorded session state" is undefined and may or may not include cursor position.

**What a developer would experience:** They would read doc 03's detailed cursor mechanics and understand how enforcement works within a single node execution. They would then wonder what happens if autocompaction occurs mid-node. They could not implement cursor persistence without making implementation choices unsupported by the spec.

**Recommendation:** Doc 03 should add a section on cursor state persistence. Specify that cursor position is persisted in the node's session storage and restored by recover_context, ensuring no duplicate enforcement sequences. Document recover_context's "recorded session state" to include cursor position explicitly.

---

### Gap 14: Delegation Pattern Coverage Is Uneven Across Subagents

**Status:** Context-scout and junior-dev get thorough format guidance in doc 04. External-scout, tailwrench, autonomous-agent, and others receive less detailed format guidance.

**Impact:** A developer would have clear patterns for some delegations but would need to infer patterns for others.

**What's documented thoroughly:** Context-scout (step limit 20, deterministic reporting format with emphasis and confidence), junior-dev (investigation-driven approach, step limit 50, goal-oriented code changes).

**What lacks format guidance:** External-scout, tailwrench, autonomous-agent, dag-designer, dag-reviewer, documentation-expert. These are described at higher level or by reference to their agent system prompts, but the dispatch prompt format patterns are less explicit.

**What a developer would experience:** They would read doc 04 and have clear templates for context-scout and junior-dev dispatch prompts. For other subagents, they would need to reason from first principles or examine existing dispatch prompts in the planning DAG.

**Recommendation:** Doc 04 should expand delegation pattern documentation to cover all subagents uniformly. For each subagent, show a canonical dispatch prompt example and explain the dispatch pattern's rationale. This need not be verbose — brief examples with annotation are sufficient.

---

## Spec Contradictions Creating Ambiguity

### Contradiction 1: `next_step` Exempt Status Contradicted Across Docs

**Status:** Doc 05 lists next_step as globally exempt. Doc 03 explicitly treats it as non-exempt with opposite blocking semantics.

**Impact:** An implementer cannot determine whether next_step is subject to enforcement constraints or not. This affects how enforcement interacts with terminal nodes and branching.

**What's contradictory:** Doc 05 (Planning DAG Workflow) says "next_step is globally exempt and can be called at any time." Doc 03 (Enforcement Mechanics) describes next_step's behavior as subject to enforcement: the agent can only call next_step after satisfying the current node's enforcement sequence. Both cannot be true.

**What a developer would experience:** They would read both docs and find contradictory requirements. They could not implement the tool's enforcement treatment without making a choice not supported by the spec.

**Recommendation:** Clarify the contradiction in the spec. If next_step is globally exempt, state this explicitly in doc 03's globally-exempt tools list. If it is non-exempt, remove the statement from doc 05. Provide rationale for the choice: global exemption makes sense because next_step is the gate to enforcement satisfaction, but non-exemption makes sense because premature advancement could skip enforcement. Choose the correct model and document it consistently.

---

### Contradiction 2: `{{PLAN_NAME}}` Template Variable Substitution Contradicted Across Three Docs

**Status:** Three-way contradiction about where substitution occurs and when it becomes available.

**Impact:** A developer cannot determine whether execution DAG component prompts receive substitution or whether it applies only to plan.jsonl fields.

**What's contradictory:**
- Doc 00 states execution DAG prompts receive {{PLAN_NAME}} substitution when HeadWrench calls activate_plan.
- Doc 07 explicitly states "Component library prompts (execution DAG) are static and contain no template variables."
- Doc 08 implies substitution applies to plan.jsonl fields (the plan_name parameter passed to init_dag/add_node) rather than prompt file content.

The correct interpretation — that substitution applies to plan.jsonl fields and not prompt content, making doc 07 correct — requires synthesizing across all three docs. No single document states this clearly.

**What a developer would experience:** They would read doc 00 and expect component prompts to have {{PLAN_NAME}} substituted. They would read doc 07 and find it says component prompts are static. They would be confused about which is true.

**Recommendation:** Clarify in doc 00 and 07 that template variable substitution applies to plan.jsonl node fields (plan_name, planning_session_id), not to component prompt files. Component prompts are static and read the plan name from the Qdrant collection or from metadata passed by the execution system. Update doc 00 to remove ambiguity about "execution DAG prompts receive substitution."

---

### Contradiction 3: `{{PLANNING_SESSION_ID}}` Variable Documented But Never Used

**Status:** Docs 00 and 08 document {{PLANNING_SESSION_ID}} as a template variable that "appears in planning node prompts." None of the 14 actual planning prompts contain it.

**Impact:** The spec actively misleads anyone trying to understand what data flows into planning prompts. The variable is documented but unused, creating confusion about whether implementation is incomplete or documentation is stale.

**What's contradictory:** Doc 00 (line 75-78) and doc 08 (line 108) both state this variable "appears in planning node prompts." Examination of all 14 planning node prompt files confirms that {{PLANNING_SESSION_ID}} does not appear in any of them. Only {{PLAN_NAME}} is actually used (in write-notes.md, retrieve-notes.md, dag-design.md, dag-review.md, user-review.md, final-revision.md, plan-success.md).

**What a developer would experience:** They would read doc 00 and expect to find {{PLANNING_SESSION_ID}} in planning prompts. They would examine the prompts and not find it, leading them to question whether the implementation is incomplete or the documentation is wrong.

**Recommendation:** Either remove {{PLANNING_SESSION_ID}} from docs 00 and 08 (if it was planned but never implemented), or add it to the planning prompts where it is needed (if the implementation is incomplete). Verify the decision against the implementation's actual usage patterns. Update both docs to match reality.

---

## Summary and Cross-Cutting Observations

### The Nature of These Gaps

The spec's gaps are **structural** rather than accidental oversights. A GrepAI scan of all 9 spec documents found exactly one explicit incompleteness marker (the grepai skill annotation, now resolved). The spec is internally consistent within its declared scope. The gaps arise from three causes:

1. **Intentional out-of-scope exclusions:** The spec deliberately excludes OCX distribution, OpenCode configuration schema, YAML frontmatter format, command file format, and runtime documents (dag-design-guide). These are scope boundaries, not oversights.

2. **Assumption of external knowledge:** The spec assumes platform expertise in OpenCode, which is reasonable for internal implementation but prevents external developers from understanding the system without additional documentation.

3. **Content artifacts not specifiable:** The spec cannot authoritatively specify the prose content of 32+ prompt and skill files. Architectural guidance is possible; content specification is not.

### Recommendations for Scope Resolution

**Option A: Expand the spec scope.** Create doc 09 (Implementation Guide) covering plugin loading, infrastructure setup, registry and deployment, profiles and configuration, content authoring patterns. Keep the existing 9 docs as architectural spec; doc 09 becomes implementation guidance.

**Option B: Accept gaps as feature.** Acknowledge that the spec defines architecture but not implementation details. Publish the 9 docs as "system architecture specification" and provide separate implementation documentation (as external repo or wiki). This is appropriate if the spec is meant for architectural understanding rather than implementation from scratch.

**Option C: Hybrid approach.** Expand docs 00, 02, and 07 to include schema definitions (YAML, plan.jsonl, CATALOGUE.md). Create doc 09 for infrastructure and deployment guidance. Leave content artifacts (prompts, skills) to implementation documentation external to the spec.

**Recommended approach:** Option C (hybrid). The spec should define all schemas and infrastructure dependencies it introduces. Content artifacts can be guided by examples without being fully specified. This preserves the spec's architectural focus while making it sufficient for implementation.

### Verification of Clean Areas

The investigation also identified areas that are correctly specified and need no expansion:

- **Agent roster (doc 02):** Complete tool lists, step limits with rationale, permission model clearly stated.
- **Enforcement layer (docs 03, 05, 07):** Enforcement sequences perfectly aligned across implementation artifacts, spec documentation, and CATALOGUE.md.
- **Planning DAG topology (doc 05):** Correctly documented; DAG structure in plan.jsonl matches spec exactly.
- **Component library inventory (doc 07):** All 18 components accounted for and aligned with implementation.

These areas demonstrate that the spec is precise and accurate where it claims ownership. Gaps are concentrated in areas explicitly out-of-scope (deployment, configuration, content) or at system boundaries (plugin integration, infrastructure).

---

## Conclusion

The CodeAccelerate specification is architecturally sound and comprehensive within its declared scope. The gaps documented here are not flaws in the existing spec but rather areas where the spec's scope boundary creates implementation blockers for developers approaching the system from scratch.

The most impactful improvements would be:

1. **Add activate_plan tool contract to doc 01.** This single omission blocks implementation of the entire execution phase.
2. **Document all YAML schemas (agent frontmatter, plan.jsonl header, CATALOGUE.md format).** These are infrastructural artifacts the spec introduces but never specifies.
3. **Create implementation guidance (doc 09) covering plugin loading, infrastructure setup, and deployment.** This would make the spec practically actionable.
4. **Clarify scope boundaries explicitly.** Doc 00 should state what the spec covers and what is delegated to implementation, external documentation, or runtime guidance.

These changes would transform the specification from "architecturally sufficient for understanding the system" to "sufficient for implementation from scratch."
