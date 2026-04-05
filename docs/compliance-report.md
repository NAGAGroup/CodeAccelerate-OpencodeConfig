# CodeAccelerate-OpencodeConfig Specification Compliance Report

**Date:** April 4, 2026

**Purpose:** This report documents how the CodeAccelerate-OpencodeConfig implementation compares to its design specification (`/docs/design-specification.md`), the authoritative source for all requirements.

---

## Executive Summary

The CodeAccelerate-OpencodeConfig implementation demonstrates substantial conformance to the design specification in foundational areas: the DAG enforcement engine is functional, 11 of 12 planning phases are implemented, all 18 component types are present, the specialized agent roster is defined, and core enforcement mechanisms (tool blocking, step instruction delivery, system prompt injection) work as designed.

However, **three critical gaps threaten production readiness**: the Session Naming phase is entirely absent, preventing the Qdrant collection name from being established; the execution write-notes component inverts the semantic notes hierarchy, writing to markdown files as the primary storage mechanism instead of Qdrant; and both the DAG Design and DAG Review subagents are dispatched with full HeadWrench permissions rather than the constrained, read-only permissions specified. Additionally, Qdrant is configured in server mode rather than local embedded mode, and an unauthorized MCP server (context7) has been added to all profiles.

Strong matching areas include the planning DAG structure (despite the naming phase gap), all component types and their static prompt templates, the Context Scout and JuniorDev agent permissions, tool blocking and enforcement delivery mechanisms, and adherence to the one review-revision cycle constraint. The memory-is-forbidden principle is observed by design, and IP approval gates are correctly placed.

The most impactful remediation priorities are: (1) implementing the Session Naming phase with init_dag integration, (2) creating dedicated constrained agent files for DAG Design and DAG Review subagents, (3) fixing the execution write-notes component to use Qdrant as primary storage, and (4) resolving the Qdrant architecture decision (embedded vs. server mode).

---

## Audit Methodology

This compliance audit examined five investigation nodes: (1) the planning DAG structure and all 13 planning nodes in sequence, (2) the component library (all 18 component types, static prompt principle, CATALOGUE.md accuracy), (3) the semantic notes system (Qdrant as sole persistent record, markdown file restrictions, collection naming, embedding configuration), (4) the subagent roster (eight specialized agents plus one autonomous agent, permission definitions, enforcement), and (5) locked constraints and the enforcement layer (tool blocking, init_dag restrictions, library access controls, session compacting recovery).

Three verdict categories are used throughout this report: **MATCHES** indicates the implementation conforms to the specification; **DOES NOT MATCH** indicates a divergence from the specification; **UNDETERMINED** indicates insufficient audit scope to reach a verdict (primarily applicable to Prompt Engineering Principles, which require subjective evaluation across all prompt files and is deferred to future audit).

---

## Section 1: Planning DAG

The specification defines 12 planning phases in strict order. The implementation contains 13 nodes — the 12 specified phases plus `plan-success`, a required DAG terminal node representing a structural necessity rather than a specification violation.

### Phase Verdicts

**Session Overview:** **MATCHES** — The `session-overview` node exists in the planning DAG, loads three skills (`sequential-thinking`, `probe-request-summary`, `probe-agent-help`), and performs sequential-thinking reasoning over a knowledge base summary.

**Session Naming:** **DOES NOT MATCH** (CRITICAL) — This phase is entirely absent from the implementation. No session-naming node exists in the planning DAG. The phase is critical because: (1) the specification mandates it calls `init_dag` before any `qdrant-store` operations to establish the Qdrant collection name; (2) the `{{SESSION_NAME}}` placeholder is used in multiple execution nodes (write-notes, session-overview-refresher) but is never resolved by the plugin (dag-lifecycle.ts only substitutes `{{SESSION_PATH}}`); (3) this breaks the semantic notes system's requirement that all notes be stored in a Qdrant collection named after the session.

**Orientation Scout:** **MATCHES** — The `orientation-scout` node is present and correctly positioned after session overview.

**External Research:** **MATCHES** — The `external-research` node exists and includes the IP approval gate (question tool in todo array before searxng can be called).

**User Questions:** **MATCHES** — The `user-questions` node exists and enforces the mandatory understanding check, correctly prohibiting implementation questions per specification.

**Store Notes:** **MATCHES** — The `store-notes` node calls `write-notes` using Qdrant storage only (the planning DAG write-notes component intentionally diverges from the execution write-notes component by not writing markdown files).

**Compress:** **MATCHES** — The `compress` node is functionally correct and contains the correct compress tool call. Note: compress.md contains a stale reference to "notes file as permanent record," a documentation artifact from pre-Qdrant migration (minor).

**Session Overview Refresher:** **MATCHES** — The `session-overview-refresher` node correctly uses `qdrant_qdrant-find` to query Qdrant (not markdown files).

**DAG Design:** **MATCHES** — The `dag-design` node dispatches the DAG Design subagent and is correctly positioned in the sequence.

**DAG Review:** **MATCHES** — The `dag-review` node dispatches the DAG Review subagent after DAG design completes.

**DAG Revision:** **MATCHES** — The `dag-revision` node enforces the one-cycle constraint both structurally (no loop back to dag-review) and textually (dag-revision.md: "This is one revision round only. Do not loop back to review again.").

**User Review:** **DOES NOT MATCH** (MEDIUM) — The specification states this phase "presents a prose summary of the DAG to the user as a message." The implementation calls `present_dag_to_user` which injects a machine-generated ASCII Mermaid diagram instead of prose. Additionally, the specification says disapproval "loops back to the designer for in-session edits"; the implementation ends the session and defers review revisions to a future planning session.

**plan-success (13th node):** **MATCHES** — This terminal node is a structural necessity for DAG completion. Minor note: plan.jsonl specifies an empty todo `[]`, while the node-library specifies `["write"]` — no functional impact since an empty todo prevents any blocking.

---

## Section 2: Component Library

**All 18 component types present:** **MATCHES** — The implementation includes all 17 specification-defined component types plus 1 hardcoded component (execution-kickoff, embedded in the node-library), totaling 18 types across planning and execution component libraries.

**Static prompts principle:** **MATCHES** — All component prompts are genuinely static templates. The template variables `{{SESSION_PATH}}` and `{{SESSION_NAME}}` are session-level constants substituted at node-copy time in add_node, not per-node customizations. Each component's prompt.md file contains no node-specific logic.

**write-notes component (execution):** **DOES NOT MATCH** (HIGH) — The execution component library's write-notes component (in execution-components/) writes a markdown file as the PRIMARY step and stores to Qdrant as a secondary "after writing" action. The specification states: "Qdrant is the sole persistent record in the system." The node-spec.json todo array is `["write"]` only; the `qdrant_qdrant-store` call is absent from the todo array, meaning it would not be enforced by the enforcement layer if called. This inverts the specification's hierarchy.

**session-overview-refresher:** **MATCHES** — The component correctly uses `qdrant_qdrant-find` to query Qdrant for notes, not markdown files. (Note: CATALOGUE.md incorrectly describes this component as "reads all notes files" — see CATALOGUE.md accuracy below.)

**user-discussion todo:** **DOES NOT MATCH** (LOW) — The user-discussion prompt instructs the agent to write decisions to notes after the user responds, but the node-spec.json todo is `["question"]` only, with no `write` action. The enforcement layer would block a write call after the question step completes.

**CATALOGUE.md accuracy:** **DOES NOT MATCH** (LOW) — Four inaccuracies found in the component catalogue:
1. session-overview-refresher is described as "reads all notes files" — the actual implementation uses Qdrant
2. execution-kickoff description omits the `show_dag` step from its actual behavior
3. write-notes description omits the Qdrant storage step from its actual behavior
4. agentic-loop is categorized under "General" — the specification places it in "Logic"

---

## Section 3: Semantic Notes System

**Qdrant as sole persistent record:** **DOES NOT MATCH** (HIGH) — The planning DAG's write-notes component correctly uses Qdrant only, but the execution component library's write-notes inverts this hierarchy, writing markdown files as the primary action. This breaks the specification's core principle that "Qdrant is the sole persistent record in the system."

**No markdown notes files:** **DOES NOT MATCH** (HIGH) — Two structural violations exist:
1. The execution write-notes component writes markdown files as its primary action (files/{session_path}/notes/{timestamp}.md)
2. The dag-design workflow structurally requires `{{SESSION_PATH}}/notes/rationale.md` — the dag-design SKILL.md instructs callers to tell the design subagent to produce "a rationale document at `{{SESSION_PATH}}/notes/rationale.md`"; the dag-design.md prompt calls it "the primary communication channel from the planner to the executor"; the dag-review.md prompt instructs the review subagent to read this file before evaluating. This is not optional — the review phase depends on it.

**Session naming as Qdrant collection name:** **DOES NOT MATCH** (CRITICAL) — The session naming phase is entirely absent (see Planning DAG findings), so the `{{SESSION_NAME}}` placeholder is never resolved by the plugin. This breaks the architectural assumption that each session's notes are isolated in a Qdrant collection named after the session.

**Notes stored immediately upon discovery:** **MATCHES** — The write-notes node is dedicated and correctly positioned in the planning DAG to capture notes as soon as they are identified.

**Agents query by meaning (not by file):** **MATCHES** — The implementation correctly uses `qdrant_qdrant-find` with semantic queries in components that read notes (session-overview-refresher, compress). When Qdrant is used, agents query by meaning, not by filename.

**Qdrant local embedded mode with FastEmbed:** **DOES NOT MATCH** (HIGH) — All six profiles (in deployment/) configure Qdrant as a networked server: `QDRANT_URL: "http://localhost:6333"` with a Docker container. The specification states: "Qdrant operates in local embedded mode." The embedding model is `sentence-transformers/all-MiniLM-L6-v2` (Hugging Face Sentence Transformers), not FastEmbed as the specification requires.

---

## Section 4: Subagent Roster

**Context Scout:** **MATCHES** — The agent definition includes default-deny permissions, allows `probe*`, `read`, `glob`, `list`, `skill`, and `sequential-thinking*`. Steps limit: 20. The agent is genuinely read-only and constrained to scouting work.

**Context Insurgent:** **MATCHES** — The agent definition includes default-deny permissions, allows `probe*`, `read`, `glob`, `list`, `skill`, `sequential-thinking*`, and `todowrite`. No step limit (appropriate for narrow-deep investigative work). Read-only for project files.

**JuniorDev:** **MATCHES** — The agent definition includes default-deny permissions, allows `read`, `glob`, `grep`, `list`, `edit`, `write`, and `todowrite`. No bash permission (structurally enforced in the permission definition, not merely instructed).

**Documentation Expert:** **MATCHES** — A dedicated agent file is present with appropriate permissions for documentation and configuration file work (read, write, edit, list, glob, todowrite).

**Tailwrench:** **MATCHES** — The agent has `steps: 30` hard limit, allows `permission: "*": allow` with four destructive bash command denials (rm -rf \*, rm -r \*, git push --force\*, git reset --hard\*). The step limit and command denials are structurally enforced.

**External Scout:** **MATCHES** for capabilities — default-deny permissions, allows `sequential-thinking*`, `searxng*`, `webfetch`, and `skill`. No internal file access. **DOES NOT MATCH** for MCP tooling — the agent also has `context7*` permission, which is not in the specification's locked MCP server list (see Locked Constraints).

**DAG Design Subagent:** **DOES NOT MATCH** (HIGH) — No dedicated agent definition file exists. The subagent is dispatched as a full HeadWrench instance (`subagent_type: "headwrench"` confirmed in dag-design/SKILL.md). HeadWrench has `permission: "*": allow` and no step limit. The specification requires "constrained permissions," "no general file access," "no access to library prompts or node-spec files," and "no init_dag." All constraints are instructional only (in dag-design-guide.md delegation prompt), not enforced at the agent permission level. This means any agent configuration could bypass these constraints.

**DAG Review Subagent:** **DOES NOT MATCH** (HIGH) — No dedicated agent definition file exists. The subagent is dispatched as a full HeadWrench instance (confirmed in dag-review/SKILL.md). The specification requires "no write access of any kind." HeadWrench has full write access; the read-only constraint is instructional only (in dag-review-guide.md delegation prompt), not enforced at the permission level.

**Autonomous Agent:** **DOES NOT MATCH** (MEDIUM) — The specification states that user approval gate and agentic-loop restriction are locked constraints. The implementation enforces both only at the skill/prompt level (autonomous-agent-delegation/SKILL.md instructs callers to get approval first). The agent definition file itself has no approval gate mechanism, no agentic-loop restriction, and no technical enforcement. Any agent that skips or ignores the delegation skill can dispatch autonomous-agent directly without user approval.

---

## Section 5: Locked Constraints

1. **DAG enforcement engine:** **MATCHES** — The plugin is implemented in dag-lifecycle.ts and functional, enforcing todo-based tool blocking and step instruction delivery.

2. **Agent roster:** **MATCHES** — Eight specialized agents (Context Scout, Context Insurgent, JuniorDev, Documentation Expert, Tailwrench, External Scout, and two unnamed subagents) plus one Autonomous Agent are defined.

3. **MCP server configuration:** **DOES NOT MATCH** (HIGH) — The specification lists exactly 4 MCP servers with "no additions or removals without explicit decision": (1) Probe, (2) SearXNG, (3) Qdrant, (4) Sequential Thinking. The implementation configures 5 servers in all profiles: these 4 plus `context7` (`npx -y @upstash/context7-mcp`, a library documentation server from Upstash). Additionally, the Qdrant server is configured in server mode rather than the specification's local embedded mode.

4. **Static component prompts:** **MATCHES** — All component prompts are static templates without node-specific customization.

5. **Semantic notes as sole persistent record:** **DOES NOT MATCH** — See Section 3 findings.

6. **Memory-is-forbidden principle:** **MATCHES** (intent; soft enforcement) — No agent has cross-session memory tools. Session isolation is enforced by convention (Qdrant collection names per session), though the session naming phase absence undermines this.

7. **One review-revision cycle:** **MATCHES** — Enforced both structurally (DAG shape: dag-design → dag-review → dag-revision, no loop) and textually (dag-revision.md: "This is one revision round only").

8. **Plan-fail as default terminal:** **MATCHES** (guidance) — dag-design-guide.md mirrors specification wording; not structurally validated by validate_dag.

9. **Goal-based work-item tasks:** **MATCHES** — The work-item todo enforces scout-first pattern; JuniorDev receives a goal, not surgical instructions.

10. **IP approval gate for external research:** **MATCHES** — The external-research planning node has question tool in todo; delegation skill instructs IP review before dispatch.

11. **init_dag called only by planning agent:** **DOES NOT MATCH** (MEDIUM) — No mechanical enforcement exists in the plugin. The planning DAG does not call init_dag at all (session naming phase is absent), and no restriction prevents other agents from calling it. Purely instructional, not technically enforced.

12. **Agents never reading library prompts directly:** **DOES NOT MATCH** (MEDIUM) — No path-level enforcement prevents agents from reading library prompts, node-spec.json files, or plan.jsonl directly. Constrained only by instructional guidance, not by filesystem permissions.

---

## Section 6: Enforcement Layer

**Tool blocking (tool.execute.before):** **MATCHES** — The enforcement layer blocks tools by matching the tool name to the current todo item in DAG mode. Implementation is correct and matches specification.

**Exempt tools:** **MATCHES** — Tools `compress`, `qdrant_*`, `recover_context`, and `next_step` are always allowed regardless of current todo. These exemptions match the specification exactly.

**Step instruction delivery:** **MATCHES** — Uses `client.session.prompt` with `noReply: true` to inject step instructions as user messages, exactly as the specification requires. Agents receive plain-English actionable instructions at each step transition.

**System prompt injection (experimental.chat.system.transform):** **MATCHES** — The plugin injects DAG executor mode instructions into the system prompt when a DAG is active. This ensures agents operate within DAG constraints even if they receive conflicting instructions.

**init_dag enforcement:** **DOES NOT MATCH** — No mechanical restriction prevents init_dag from being called by non-planning agents. The plugin does not validate the caller's role before allowing init_dag execution.

**add_node template copying:** **UNDETERMINED** — The specification states add_node "copies static templates from the component library." The implementation references library paths in place rather than performing a file copy operation. This works correctly at runtime (templates are substituted with session variables) but diverges from the specification's description of the mechanism. Verification requires determining whether the specification intended actual file copying or in-place template substitution.

**Library access prevention:** **DOES NOT MATCH** — No path-level enforcement prevents agents from reading library prompts, node-spec.json files, or raw plan.jsonl directly. All constraints are behavioral/instructional only.

**Session compacting recovery (experimental.session.compacting):** **MATCHES** — The plugin injects DAG state into the compaction context for recovery. The recover_context() tool works correctly to restore DAG state after session compacting.

---

## Section 7: Prompt Engineering Principles

**UNDETERMINED** — This specification section was not audited within the five investigation nodes. The specification defines principles including: positive framing except in good/bad examples, "consider" framing for reasoning blocks, constraining actions not thoughts, plain English descriptions of tool actions, skill loading as required action, step instructions injected as user messages, plain English todo lists, anti-patterns in sequential-thinking skill, short questions only in question tool, and prose-only scout outputs. Verifying compliance with these principles requires subjective judgment and careful reading of all prompt files across the system (planning nodes, execution nodes, skill definitions, subagent guidelines, and delegation guides). This area is deferred to a future dedicated audit.

---

## Summary Verdict Table

| Requirement | Verdict | Severity |
|---|---|---|
| Session Naming phase | **DOES NOT MATCH** | CRITICAL |
| Qdrant local embedded mode | **DOES NOT MATCH** | HIGH |
| No markdown notes files (rationale.md) | **DOES NOT MATCH** | HIGH |
| write-notes execution component | **DOES NOT MATCH** | HIGH |
| DAG Design Subagent permissions | **DOES NOT MATCH** | HIGH |
| DAG Review Subagent permissions | **DOES NOT MATCH** | HIGH |
| MCP server config (context7) | **DOES NOT MATCH** | HIGH |
| Autonomous Agent gating | **DOES NOT MATCH** | MEDIUM |
| User Review phase | **DOES NOT MATCH** | MEDIUM |
| init_dag enforcement | **DOES NOT MATCH** | MEDIUM |
| Library access prevention | **DOES NOT MATCH** | MEDIUM |
| user-discussion todo | **DOES NOT MATCH** | LOW |
| CATALOGUE.md accuracy (4 items) | **DOES NOT MATCH** | LOW |
| All 18 component types present | **MATCHES** | N/A |
| Static prompts principle | **MATCHES** | N/A |
| session-overview-refresher | **MATCHES** | N/A |
| Context Scout permissions | **MATCHES** | N/A |
| Context Insurgent permissions | **MATCHES** | N/A |
| JuniorDev permissions | **MATCHES** | N/A |
| Documentation Expert permissions | **MATCHES** | N/A |
| Tailwrench step limit | **MATCHES** | N/A |
| Tool blocking | **MATCHES** | N/A |
| Exempt tools | **MATCHES** | N/A |
| Step instruction delivery | **MATCHES** | N/A |
| System prompt injection | **MATCHES** | N/A |
| Session compacting recovery | **MATCHES** | N/A |
| Memory-is-forbidden | **MATCHES** | N/A |
| One review-revision cycle | **MATCHES** | N/A |
| Plan-fail as default terminal | **MATCHES** | N/A |
| Goal-based work-item tasks | **MATCHES** | N/A |
| IP approval gate | **MATCHES** | N/A |
| 11 present planning phases (order) | **MATCHES** | N/A |
| add_node template copying | **UNDETERMINED** | LOW |
| Prompt Engineering Principles | **UNDETERMINED** | N/A |

---

## Recommendations

### Critical (fix before production use)

1. **Implement the Session Naming phase** — Add a session-naming node between session-overview and orientation-scout that calls `init_dag` to establish the session name as the Qdrant collection name. This is a prerequisite for the semantic notes system to function as designed.

2. **Migrate Qdrant to local embedded mode with FastEmbed** — Either update all profile configurations from server mode (`QDRANT_URL: "http://localhost:6333"`) to embedded mode with FastEmbed as the embedding model, or update the specification to reflect the server-mode architectural decision and its implications for deployment and dependency management.

### High Priority

3. **Create dedicated agent definition files for DAG Design and DAG Review subagents** — Define these agents with constrained permissions that deny write access (for review), deny init_dag, deny file access to library paths, and deny execution of arbitrary tools. This prevents architectural bypasses.

4. **Fix the execution write-notes component to use Qdrant as primary storage** — Either (a) remove markdown file writing and use Qdrant exclusively, adding `qdrant_qdrant-store` to the todo array for enforcement, or (b) update the specification to permit markdown files as primary storage and clarify the rationale-file workflow.

5. **Resolve the rationale.md contradiction** — The dag-design and dag-review workflows structurally depend on `rationale.md` at `{{SESSION_PATH}}/notes/rationale.md`. Either (a) update the specification to explicitly permit this specific markdown file as a planner-executor communication channel, or (b) implement a Qdrant-based mechanism for planner-executor communication and remove all references to rationale.md.

6. **Remove context7 from MCP server profiles or add it to the spec's locked server list** — Either remove `context7` permissions from all six deployment profiles, or add it to the specification's locked MCP server list with explicit justification.

7. **Add technical enforcement for the autonomous agent approval gate** — Implement a middleware or agent-level check that validates user approval before dispatching the autonomous agent, rather than relying on instructional guidance.

### Medium Priority

8. **Add mechanical enforcement for init_dag restriction** — Add a plugin check that validates init_dag is only callable during planning sessions (when DAG mode is active), or restrict it by agent role.

9. **Add path-level enforcement to prevent agents from reading library prompts and node-spec files** — Use filesystem permissions or a tool-level blocker to prevent read access to `node-library/`, `planning-components/`, and `execution-components/` directories.

10. **Fix user-review to present prose summary and implement in-session revision** — Update the user-review node to call a subagent that generates a prose summary (rather than the Mermaid diagram) and implement in-session revision branching on disapproval instead of deferred revision.

11. **Align review checklist items 4, 6, 7 with spec wording** — Update the dag-review checklist to match the specification's exact wording for these items.

### Low Priority

12. **Fix CATALOGUE.md inaccuracies** — Correct the four documented inaccuracies (session-overview-refresher, execution-kickoff, write-notes descriptions; agentic-loop categorization).

13. **Fix user-discussion todo** — Add `write` to the user-discussion node-spec.json todo array if agents should be able to write notes after user discussion.

14. **Resolve plan-success todo mismatch** — Align plan.jsonl's empty todo `[]` with node-library's `["write"]` specification or remove write from the node-library if it is not intended.

15. **Remove stale documentation artifact** — Remove the reference to "notes file as permanent record" from compress.md, as this contradicts the post-Qdrant migration architecture.
