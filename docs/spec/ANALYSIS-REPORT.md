# Phase 1: Gap and Conflict Analysis Report

This report covers all 9 source documents:
- `component-library.md`
- `dag-enforcement.md`
- `dag-tooling.md`
- `delegation-pattern.md`
- `execution-architecture.md`
- `mcp-tooling.md`
- `planning-dag-nodes.md`
- `prompt-engineering.md`
- `subagent-roster.md`

---

## Conflicts

### CONFLICT-01: execution-kickoff sequence vs. execution-architecture kickoff steps

**Source A — `component-library.md` (execution-kickoff enforcement):**
```
[skill, qdrant-find, task, show_dag, thinking]
```
The prose explains: skill loads the plan-following skill, qdrant-find retrieves planning context directly, task dispatches a scout that also queries semantic notes and reviews the DAG, then the primary agent calls show_dag itself and uses thinking to orient.

**Source B — `execution-architecture.md` (Execution Kickoff section, steps 1–5):**
```
1. Load the plan-following skill.
2. Query the semantic notes system (qdrant-find).
3. Call show_compact_dag to get a high-level overview.
4. Use sequential-thinking_sequentialthinking to orient.
5. Call next_step.
```

**The conflict:** The component-library enforcement sequence includes `task` (dispatch a scout) as step 3, with `show_dag` (not `show_compact_dag`) as step 4. The execution-architecture description has no scout dispatch and uses `show_compact_dag` rather than `show_dag`. These are materially different sequences. `component-library.md` is the authoritative definition of enforcement sequences per its own schema, so this analysis treats it as primary; the execution-architecture description is an inconsistent summary.

**Resolution:** The enforcement sequence in `component-library.md` (`[skill, qdrant-find, task, show_dag, thinking]`) is authoritative. The execution-architecture prose description must be reconciled to match it. The scout dispatch is real; `show_dag` (not `show_compact_dag`) is what the primary agent calls during kickoff.

---

### CONFLICT-02: Exempt tool shorthands used inconsistently across documents

**Source A — `dag-enforcement.md` (Globally Exempt Tools list):**
Uses exact callable identifiers throughout: `sequential-thinking_sequentialthinking`, `qdrant_qdrant-store`, `qdrant_qdrant-find`.

**Source B — `planning-dag-nodes.md` (Enforcement Model section):**
> "Globally exempt tools are never blocked and can be called at any time in any node: sequential-thinking, question, qdrant-store, qdrant-find, next_step, recover_context."

Uses shorthand names (`sequential-thinking`, `qdrant-store`, `qdrant-find`) instead of the exact callable identifiers.

**Source C — enforcement sequences throughout `planning-dag-nodes.md`:**
Also use shorthands: `[thinking, question]`, `[qdrant-store]`, `[qdrant-find, skill, thinking, task]`, `[compress]`.

**The conflict:** The tool surface document (`mcp-tooling.md`) states these are the "exact callable identifiers used in agent permissions and enforcement sequences." Shorthands are aliases used for readability in the planning-dag-nodes document but are never formally defined as aliases. An implementer needs to know whether the enforcement engine uses the full identifiers or the shorthands.

**Resolution:** The enforcement sequences in both planning DAG nodes and component library use readable shorthands for clarity. These shorthands must be formally defined as aliases in the spec. The mapping is:
- `thinking` → `sequential-thinking_sequentialthinking`
- `qdrant-store` → `qdrant_qdrant-store`
- `qdrant-find` → `qdrant_qdrant-find`
- `skill` → the skill tool (native framework tool, not an MCP tool — see GAP-01)
- `compress` → the compress tool (native framework tool — see GAP-01)
- `task` → the task tool (native framework tool — see GAP-01)

---

### CONFLICT-03: session-overview-refresher enforcement differs between planning and execution contexts

**Source A — `component-library.md` (session-overview-refresher component):**
```
Enforcement: [skill, skill, qdrant-find, thinking]
```
Intent says: "Reload the plan-following and sequential-thinking skills... Retrieve planning context from semantic notes."

**Source B — `planning-dag-nodes.md` (Node 7: Session Overview Refresher):**
```
Enforcement: [skill, skill, thinking]
```
Intent says: "Reload the plan-following and sequential-thinking skills... re-establish understanding of role, methodology, and skills." No qdrant-find mentioned.

**The conflict:** The execution DAG component includes a `qdrant-find` positional requirement; the planning DAG node does not. These are genuinely different sequences. This may be intentional (the planning refresher only re-loads skills because notes are retrieved at Node 8; the execution refresher also re-retrieves notes because there is no dedicated retrieve-notes step after it). However, the difference is undocumented.

**Resolution:** The difference is intentional and correct. In the planning DAG, Node 7 (Session Overview Refresher) is immediately followed by Node 8 (Retrieve Notes) which performs the qdrant-find. In the execution DAG, no such dedicated retrieve-notes node follows the refresher, so the refresher itself must include the qdrant-find. The spec must document this distinction explicitly.

---

### CONFLICT-04: "thinking" token in enforcement sequences used for two different tools

**Source A — `dag-enforcement.md`:** Lists `sequential-thinking_sequentialthinking` as the globally exempt tool.

**Source B — Planning-dag-nodes.md** and **component-library.md:** Use `thinking` as shorthand in enforcement sequences.

**The deeper issue:** The planning-dag-nodes Enforcement Model section says globally exempt tools include "sequential-thinking" but the enforcement sequences use "thinking". Two different shorthands for the same tool. Not an internal inconsistency within one document, but unnecessary variation. Reconciled under CONFLICT-02.

---

## Gaps

### GAP-01: Native framework tools are not defined anywhere

The following tools appear in enforcement sequences and agent permission lists but are not defined in either `dag-tooling.md` (which covers planning-enforcement plugin tools) or `mcp-tooling.md` (which covers MCP servers):

- **`skill`** — loads a skill file into context. Non-exempt (appears in sequences and is explicitly called "non-exempt" in `prompt-engineering.md`: "The skill tool is not globally exempt"). No definition of its parameters, return value, or failure behavior.
- **`compress`** — compresses conversation context. Non-exempt. No definition of parameters, return value, or failure behavior.
- **`task`** — dispatches a subagent. Parameters are described in `delegation-pattern.md` but it has no entry in either tooling document.
- **`question`** — asks the user. Globally exempt. No definition of parameters or return behavior.
- **`read`, `write`, `edit`, `glob`, `grep`, `bash`** — file operation and shell tools. Listed in subagent permissions but defined nowhere.
- **`todowrite`** — appears in agent Denied lists but never defined or explained.
- **`next_step`** — covered in `dag-enforcement.md` for its blocking behavior, but its parameter (`next`/branch) is mentioned in `execution-architecture.md` without a formal contract.
- **`recover_context`** — listed as globally exempt but never defined.

**UNRESOLVED: GAP-01-A** — The spec should include a section covering native framework tool contracts (skill, compress, task, question, next_step, recover_context). These are OpenCode built-in tools that the framework assumes exist. Their absence from the tooling documents means an implementer cannot know if they are framework-defined, plugin-defined, or something else.

**UNRESOLVED: GAP-01-B** — `todowrite` appears in every agent's Denied list but is never mentioned in any positive context. It is unclear whether this is a deprecated tool, a third-party tool being explicitly excluded, or something else. An implementer would not know what `todowrite` is or why it needs to be denied.

---

### GAP-02: "notes-recovery skill" referenced in planning DAG but not in skill lists

**Source:** `planning-dag-nodes.md`, Node 8 (Retrieve Notes): "Load the notes-recovery skill, reason through its guidance..."

**Problem:** Neither `prompt-engineering.md`'s skill categories section nor `delegation-pattern.md`'s mapping table mentions a `notes-recovery` skill. It is not in the methodology skills list and not in the delegation skills list. Its existence is implied but never confirmed.

**Note:** `prompt-engineering.md` does list `qdrant-notes` as a methodology skill: "qdrant-notes — how to store and retrieve session knowledge." This may be what the planning-dag-nodes doc calls `notes-recovery`, but this is not stated explicitly anywhere.

**UNRESOLVED: GAP-02** — Is `notes-recovery` the same skill as `qdrant-notes`? If yes, the planning-dag-nodes document uses the wrong name. If no, `notes-recovery` is a missing skill definition.

---

### GAP-03: "grepai" skill referenced throughout but marked "(when created)"

**Source:** `subagent-roster.md` (multiple agents), `prompt-engineering.md` (methodology skills list).

Every agent that uses GrepAI tools lists `grepai (when created)` in its skills. This skill is referenced as future work across every roster entry.

**Impact:** Since the skill does not exist yet, prompts for agents that use GrepAI (context-scout, context-insurgent, junior-dev, documentation-expert, tailwrench, dag-designer, dag-reviewer) cannot be complete. Every one of these agents relies on a methodology skill that has yet to be written.

**This is not a contradiction but a known incomplete item.** The spec must preserve this and flag it clearly.

---

### GAP-04: "following-plans" skill referenced but not in skill lists

**Source:** `dag-enforcement.md`: "The following-plans skill teaches agents to read error messages and call the tool the system expects."

`execution-architecture.md`: "The following-plans skill teaches the agent to read error messages for recovery guidance."

`component-library.md` (execution-kickoff): "The skill load is the plan-following skill."

`execution-architecture.md` (kickoff step 1): "The agent loads the plan-following skill."

**Problem:** `prompt-engineering.md`'s methodology skills list includes `following-plans` — but the execution-kickoff and architecture docs call it "plan-following skill" in prose. These appear to be the same skill named two different ways.

**Resolution:** This is a naming inconsistency. The skill file is `following-plans` (the file name, as listed in prompt-engineering.md). The prose in execution-architecture.md and component-library.md describe it as "the plan-following skill." The spec must standardize to `following-plans` as the canonical name (matching the skill file name convention).

---

### GAP-05: DAG tools validate_dag, delete_node, modify_node not defined in dag-tooling.md

**Source:** `subagent-roster.md` lists these in dag-designer's tools:
- `add_node, delete_node, modify_node — DAG construction and modification`
- `validate_dag — check DAG structural validity`

**Source:** `dag-tooling.md` defines: `choose_plan_name`, `init_dag`, `add_node`, `show_dag`, `show_compact_dag`, `present_compact_dag_to_user`, `get_planning_components_catalogue`, `get_dag_design_guide`.

**The gap:** `validate_dag`, `delete_node`, and `modify_node` are listed in the subagent roster as permitted tools but have no contract definition in `dag-tooling.md`. An implementer cannot implement these without knowing their parameters, return values, and failure behavior.

**UNRESOLVED: GAP-05** — `validate_dag`, `delete_node`, and `modify_node` need full tool contracts added to the tooling specification.

---

### GAP-06: 7-item DAG review checklist never defined

**Source:** `subagent-roster.md`, dag-reviewer role: "Evaluates execution DAGs against the 7-item review checklist."

`planning-dag-nodes.md`, Node 10: "Dispatch the specialized DAG reviewer subagent to evaluate the DAG against the 7-item review checklist."

**The gap:** The checklist itself is never listed anywhere in any of the 9 source documents. The reviewer is told a 7-item checklist exists and is given access to `get_dag_design_guide`, but the checklist content is nowhere defined.

**UNRESOLVED: GAP-06** — The 7-item review checklist must either be defined in the spec or explicitly deferred to the DAG design guide document (which is accessed via `get_dag_design_guide` at runtime). If it lives in the design guide, that must be stated explicitly.

---

### GAP-07: {{PLANNING_SESSION_ID}} template variable referenced but never defined

**Source:** `prompt-engineering.md` (Planning Node Prompts): "They can reference {{PLAN_NAME}} and {{PLANNING_SESSION_ID}} template variables."

**The gap:** `{{PLAN_NAME}}` is thoroughly defined — it is set by `choose_plan_name` and substituted into all remaining planning DAG prompts. `{{PLANNING_SESSION_ID}}` appears once in passing and is never defined: what it contains, when it is set, or how it is substituted.

**UNRESOLVED: GAP-07** — `{{PLANNING_SESSION_ID}}` needs a definition equivalent to the one for `{{PLAN_NAME}}`.

---

### GAP-08: Context-scout's access to show_dag during execution-kickoff is implied but not granted

**Source:** `component-library.md` (execution-kickoff): "The task dispatches a scout that has access to semantic notes and show_dag — the scout produces a prose summary including planning context and its assessed task decomposition."

**Problem:** `subagent-roster.md` grants context-scout these tools:
`grepai_grepai_search`, RPG tools, `grepai_grepai_index_status`, `sequential-thinking_sequentialthinking`, `qdrant_qdrant-store`, `qdrant_qdrant-find`, `skill`

`show_dag` is explicitly listed in context-scout's **Denied** list: "all DAG tools."

**The conflict/gap:** The execution-kickoff description says the scout uses `show_dag`, but context-scout's permission set denies all DAG tools including `show_dag`.

**UNRESOLVED: GAP-08** — Either context-scout needs `show_dag` added to its permissions for use during execution-kickoff, or the execution-kickoff description is wrong about the scout accessing `show_dag`. This requires a human decision.

---

### GAP-09: IP approval gate mechanics not fully specified

**Source:** `mcp-tooling.md`: "Used by the external-scout subagent behind the IP approval gate."

`planning-dag-nodes.md` Node 3 and `component-library.md` (research component): Both describe presenting the research query to the user before dispatching external-scout, but frame this as a workflow concern (question before task), not as a separate gate mechanism.

**The gap:** "IP approval gate" is used as a term in mcp-tooling.md but never defined as a system mechanism. Whether it is a naming convention for the question-before-task pattern, a separate enforcement mechanism, or something else is not specified.

**Resolution (resolvable from sources):** The "IP approval gate" is the workflow pattern (question before task) enforced by the enforcement sequence. It is not a separate technical mechanism. This can be made explicit in the spec.

---

### GAP-10: Qdrant collection lifecycle and cross-session access not fully specified

**Source:** `execution-architecture.md`: "The Qdrant collection name is the {{PLAN_NAME}} itself... If the user runs a new planning session and the planning agent queries the same collection (or the framework connects the new session to the prior collection), the planning agent has access to real execution experience."

**The gap:** The mechanism for a new planning session accessing a prior execution session's notes is described with "or" — either the user queries the same collection, or the framework connects them. How this actually works (does the user specify the prior plan name? does the framework auto-detect?) is not defined.

**UNRESOLVED: GAP-10** — The mechanism for cross-session note access needs specification: how does a new planning session query a prior execution session's Qdrant collection?

---

## Dangling References

### DANGLING-01: "Probe" (probelabs/probe) mentioned in mcp-tooling.md Removed section

`mcp-tooling.md` documents Probe as a removed tool. Its mention is intentional (explaining why it was replaced), not a dangling reference. However, implementers should know this is historical documentation only — Probe tools must not appear in any permission list.

### DANGLING-02: grepai_grepai_stats tool listed in mcp-tooling.md but not granted to any agent

`mcp-tooling.md` lists `grepai_grepai_stats` as a GrepAI tool. No agent in `subagent-roster.md` includes it in their allowed tools. It is not in headwrench's listed exceptions (only `grepai_grepai_list_projects` and `grepai_grepai_list_workspaces` are excepted). Since headwrench's permissions say "All framework tools, all MCP tools, all file operations" except the two listed, `grepai_grepai_stats` is implicitly allowed for headwrench.

For other agents, its absence from allowed lists means it is denied by default. This is likely intentional (it is a diagnostic tool, not needed by subagents) but it is never explicitly stated.

### DANGLING-03: "asking-questions" skill in planning Node 3 but not in planning skill context

`planning-dag-nodes.md` Node 3 says "The first skill loads the asking-questions skill." The `asking-questions` skill is listed in `prompt-engineering.md`'s methodology skills section. This is consistent. Not a dangling reference — confirmed.

---

## Cross-Reference Validation

### Tool name coverage in enforcement sequences

Every tool in every enforcement sequence checked against `dag-tooling.md` and `mcp-tooling.md`:

| Shorthand | Full name | Defined? |
|---|---|---|
| `skill` | skill tool | NOT in either tooling doc (GAP-01) |
| `thinking` | sequential-thinking_sequentialthinking | mcp-tooling.md ✓ |
| `task` | task tool | NOT in either tooling doc (GAP-01) |
| `question` | question tool | NOT in either tooling doc (GAP-01) |
| `qdrant-store` | qdrant_qdrant-store | mcp-tooling.md ✓ |
| `qdrant-find` | qdrant_qdrant-find | mcp-tooling.md ✓ |
| `compress` | compress tool | NOT in either tooling doc (GAP-01) |
| `choose_plan_name` | choose_plan_name | dag-tooling.md ✓ |
| `init_dag` | init_dag | dag-tooling.md ✓ |
| `task` | task | NOT in tooling docs (GAP-01) |
| `show_dag` | show_dag | dag-tooling.md ✓ |
| `present_compact_dag_to_user` | present_compact_dag_to_user | dag-tooling.md ✓ |

### Agent-to-delegation mapping coverage

Every agent in subagent-roster.md checked against delegation-pattern.md mapping table:

| Agent | In roster? | In mapping? |
|---|---|---|
| headwrench | ✓ | Not applicable (primary agent) |
| context-scout | ✓ | ✓ (context-scout-delegation → context-scout) |
| context-insurgent | ✓ | ✓ (context-insurgent-delegation → context-insurgent) |
| junior-dev | ✓ | ✓ (juniordev-delegation → junior-dev) |
| documentation-expert | ✓ | ✓ (documentation-expert-delegation → documentation-expert) |
| external-scout | ✓ | ✓ (external-scout-delegation → external-scout) |
| tailwrench | ✓ | ✓ (tailwrench-delegation → tailwrench) |
| autonomous-agent | ✓ | ✓ (autonomous-agent-delegation → autonomous-agent) |
| dag-designer | ✓ | ✓ (dag-design → dag-designer) |
| dag-reviewer | ✓ | ✓ (dag-review → dag-reviewer) |

All agents covered. ✓

### Component type coverage in design guide

Every component type in component-library.md checked (design guide content is runtime-only via `get_dag_design_guide`, so this validation is limited to what is specified):

Components defined: `execution-kickoff`, `work-item`, `project-search-and-analysis`, `research`, `deep-research`, `write-notes`, `compress`, `session-overview-refresher`, `sequential-thinking`, `decision-gate`, `user-decision-gate`, `plan-fail`, `plan-success`, `verify`, `run-project-commands`, `commit`, `user-discussion`, `autonomous-work`.

All components have enforcement sequences defined. ✓

### Skill file coverage

Every skill listed in any agent's skill set checked against `prompt-engineering.md`'s skill categories:

| Skill | In agents? | Defined in prompt-engineering.md? |
|---|---|---|
| following-plans | Yes (headwrench, loaded at execution kickoff) | ✓ (methodology) |
| sequential-thinking | Yes (most agents) | ✓ (methodology) |
| asking-questions | Yes (loaded in planning Node 3) | ✓ (methodology) |
| qdrant-notes | Yes (several agents) | ✓ (methodology) |
| grepai | Yes (several agents, "(when created)") | ✓ (methodology, "(to be created)") |
| context-scout-delegation | Yes (headwrench, dag-designer, dag-reviewer) | ✓ (delegation) |
| context-insurgent-delegation | Yes (headwrench, dag-designer) | ✓ (delegation) |
| juniordev-delegation | Yes (headwrench) | ✓ (delegation) |
| documentation-expert-delegation | Yes (headwrench) | ✓ (delegation) |
| external-scout-delegation | Yes (headwrench) | ✓ (delegation) |
| tailwrench-delegation | Yes (headwrench) | ✓ (delegation) |
| autonomous-agent-delegation | Yes (headwrench) | ✓ (delegation) |
| dag-design | Yes (headwrench) | ✓ (delegation) |
| dag-review | Yes (headwrench) | ✓ (delegation) |
| notes-recovery | Implied in planning Node 8 | NOT DEFINED — see GAP-02 |

### Delegation skill to subagent_type mapping (one-to-one check)

| Skill | subagent_type | Unique? |
|---|---|---|
| context-scout-delegation | context-scout | ✓ |
| context-insurgent-delegation | context-insurgent | ✓ |
| juniordev-delegation | junior-dev | ✓ |
| documentation-expert-delegation | documentation-expert | ✓ |
| external-scout-delegation | external-scout | ✓ |
| tailwrench-delegation | tailwrench | ✓ |
| autonomous-agent-delegation | autonomous-agent | ✓ |
| dag-design | dag-designer | ✓ |
| dag-review | dag-reviewer | ✓ |

All mappings one-to-one. ✓

---

## Terminology Consistency

### "semantic notes system" vs "Qdrant" vs "semantic notes"

Multiple terms are used for the same concept:
- "semantic notes system" (execution-architecture.md, component-library.md)
- "semantic notes" (dag-enforcement.md globally exempt list)
- "Qdrant collection" (execution-architecture.md)
- "session notes" (not used but implied)

These are all the same thing. The spec should pick one primary term. **Recommended: "semantic notes system"** (most descriptive) with "Qdrant collection" as the implementation term when referring to the underlying storage.

### "plan-following skill" vs "following-plans"

- "plan-following skill" — used in execution-architecture.md and component-library.md (execution-kickoff intent)
- "following-plans" — used in dag-enforcement.md and prompt-engineering.md's skill list

Both refer to the same skill. The canonical name is `following-plans` (the file name). The spec uses this name everywhere, noting that prose descriptions may say "plan-following skill" as a natural language description.

### "sequential-thinking" vs "thinking"

- `sequential-thinking_sequentialthinking` — MCP tool identifier in mcp-tooling.md and dag-enforcement.md
- `sequential-thinking` — shorthand used in planning-dag-nodes.md exempt list
- `thinking` — shorthand used in enforcement sequences throughout planning-dag-nodes.md and component-library.md

Three representations of one tool. Resolution: `thinking` is the shorthand token used in enforcement sequences (defined in spec); `sequential-thinking_sequentialthinking` is the callable identifier (what the agent actually calls); the `sequential-thinking` skill teaches use of this tool.

### "IP approval gate" vs "question before task"

`mcp-tooling.md` uses the term "IP approval gate." No other document uses this term. It describes the pattern of presenting a research query to the user for approval before dispatching external-scout. The spec retains this term as a named pattern and defines it explicitly.

---

## Summary of Items Requiring Human Decision

| ID | Description |
|---|---|
| GAP-01-A | Native framework tools (skill, compress, task, question, next_step, recover_context) need formal contracts |
| GAP-01-B | todowrite: what it is and why it is denied needs a definition |
| GAP-02 | Is `notes-recovery` the same skill as `qdrant-notes`? |
| GAP-05 | validate_dag, delete_node, modify_node need tool contracts |
| GAP-06 | 7-item DAG review checklist: defined here or deferred to design guide? |
| GAP-07 | {{PLANNING_SESSION_ID}} template variable needs definition |
| GAP-08 | Does context-scout need show_dag permission? Or does execution-kickoff not use show_dag via scout? |
| GAP-10 | Cross-session Qdrant collection access mechanism needs specification |
