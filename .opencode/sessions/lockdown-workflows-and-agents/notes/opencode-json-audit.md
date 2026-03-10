# opencode.json Agent Spec Audit — lockdown-workflows-and-agents

## Summary
The audit of `opencode/opencode.json` against the agent `.md` definitions reveals several critical tool/permission mismatches that prevent agents from fulfilling their documented instructions. Most notably, agents tasked with creating or updating files (`SessionPlanDrafter`, `SubagentBuilder`, `AgentDelegationExpert`) are denied the necessary `write` or `edit` permissions. Additionally, all agents are missing `description` fields in the global configuration.

## Global Config Findings
- **Missing Descriptions**: No agent entry in `opencode.json` includes the `description` field. This reduces system transparency during agent selection and logging.
- **Exa MCP Disabled**: The `exa` MCP is set to `enabled: false`, yet `subagents/deep-researcher` is configured with `exa*` permissions. The URL also contains an unpopulated `${EXA_API_KEY}` placeholder.
- **Implicit Deny**: The configuration style uses an explicit "deny" for `*` in some agents, which has inadvertently stripped necessary local file access (e.g., `DeepResearcher` cannot read project files).

## Per-Agent Findings

### `headwrench`
- **Model**: `github-copilot/claude-sonnet-4.6` — Appropriate (Standard tier for orchestration).
- **Description**: Missing in JSON.
- **Permissions/Tools**: `"*": "allow"`. Appropriate for the primary orchestrator.
- **Issues**: None.
- **Recommended Actions**: Add description: "Primary orchestrator. Plans, delegates, and drives sessions to completion."

### `subagents/context-scout`
- **Model**: `opencode/gemini-3-flash` — Appropriate (Fast tier for read-only exploration).
- **Description**: Missing in JSON.
- **Permissions/Tools**: `edit: deny`, `write: deny`, `read/glob/grep/list/skill: allow`. Bash restricted to read-only.
- **Issues**: None. Consistent with `.md` instructions.
- **Recommended Actions**: Add description: "Situational awareness agent. Provides codebase context and prior session history."

### `subagents/deep-researcher`
- **Model**: `opencode/gemini-3-flash` — Appropriate for research tasks.
- **Description**: Missing in JSON.
- **Permissions/Tools**: `webfetch`, `websearch`, `exa*` allowed. `*`: `deny`.
- **Issues**:
  - ~~**Read Lockout**~~: *Corrected — DeepResearcher is intentionally web-only. The `*: deny` + web-only tools is correct. The `.md` instruction to "read project files" is stale and must be removed from the `.md` file.*
  - **Tool Dependency**: Relies on `exa` MCP which is currently disabled / has unpopulated `${EXA_API_KEY}`.
- **Recommended Actions**: Remove "read project files" instruction from `deep-researcher.md`. Fix Exa MCP config. Add description.

### `subagents/session-plan-drafter`
- **Model**: `github-copilot/claude-sonnet-4.6` — N/A.
- **Status**: **RETIRED** — HeadWrench will write plans directly. This agent and its `opencode.json` entry are to be deleted.
- **Recommended Actions**: Delete `session-plan-drafter.md`, remove from `opencode.json`, update `headwrench.md` and `commands/plan.md`.

### `subagents/agent-delegation-expert`
- **Model**: `github-copilot/claude-sonnet-4.6` — Appropriate (Standard tier for judgment).
- **Description**: Missing in JSON.
- **Permissions/Tools**: `edit: deny`, `write: deny`, `read/glob/list: allow`.
- **Issues**:
  - ~~**Edit Lockout**~~: *Corrected — AgentDelegationExpert is intentionally read-only. It only reads the plan and returns recommendations to HeadWrench. HW incorporates the delegation rules. `edit: deny` and `write: deny` are correct.*
- **Recommended Actions**: Remove any write/edit instructions from `agent-delegation-expert.md`. Add description: "Reads session plans and recommends agent routing and model tiers. Output only — does not write files."

### `subagents/gates-expert`
- **Model**: `github-copilot/claude-sonnet-4.6` — Appropriate.
- **Description**: Missing in JSON.
- **Permissions/Tools**: Read-only, consistent with `.md`.
- **Issues**: None.
- **Recommended Actions**: Add description: "Identifies risk boundaries and recommends stop gates for session plans."

### `subagents/subagent-builder`
- **Model**: `opencode/gemini-3-flash` — **Too weak?** Generating system prompts is a sensitive task; consider upgrading to `standard` tier.
- **Description**: Missing in JSON.
- **Permissions/Tools**: `edit`, `read`, `glob`, `list` allowed.
- **Issues**:
  - **Write Lockout**: Instructed to "Produce a markdown agent definition file", but lacks `write` permission.
- **Recommended Actions**: Add `write: allow`. Consider model upgrade to `github-copilot/claude-sonnet-4.6`. Add description: "Generates custom ephemeral agent definitions for specialized tasks."

### `subagents/code-writer`
- **Model**: `opencode/gpt-5.3-codex` — Appropriate (Specialized coding model).
- **Description**: Missing in JSON.
- **Permissions/Tools**: `edit` and various coding tools allowed.
- **Issues**: None, though it may occasionally need `write` for new files (currently has `edit`).
- **Recommended Actions**: Add description: "Implementation agent. Produces code based on detailed subtask specifications."

### `subagents/doc-writer`
- **Model**: `opencode/gemini-3-flash` — Appropriate.
- **Description**: Missing in JSON.
- **Permissions/Tools**: `edit` allowed.
- **Issues**: None.
- **Recommended Actions**: Add description: "Documentation agent. Writes READMEs, comments, and technical guides."

### `subagents/architect`
- **Model**: `opencode/claude-opus-4-6` — Appropriate (Deep tier/Heavy reasoner).
- **Description**: Missing in JSON.
- **Permissions/Tools**: Read-only, consistent with `.md`.
- **Issues**: None.
- **Recommended Actions**: Add description: "Deep reasoning specialist. Analyzes complex architecture and subtle bugs."

## Registration Gaps
- **Missing .md File**: `compaction` is defined in `opencode.json` (line 185) but has no corresponding `.md` file in `opencode/agents/`. It appears to be a system-level configuration rather than a delegatable agent.
- **Missing JSON Entry**: None. All `.md` files in `opencode/agents/subagents/` are registered.

## Priority Findings
1. **Critical Permission Gaps**: `DeepResearcher` (no file read), `SessionPlanDrafter` (no file write), `SubagentBuilder` (no file write), and `AgentDelegationExpert` (no file edit) are unable to perform their primary duties.
2. **Global Transparency**: Missing `description` fields across all agents in `opencode.json`.
3. **MCP Tooling**: `DeepResearcher` tools are gated by a disabled `exa` MCP.
4. **Model Tiering**: `SubagentBuilder` may be under-powered using a `flash` model for generating system prompts.
