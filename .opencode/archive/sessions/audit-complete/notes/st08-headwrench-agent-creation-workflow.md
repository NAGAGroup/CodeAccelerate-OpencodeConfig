# ST08 — headwrench.md: Agent Creation Workflow

## Changes Made

### /plan Workflow step 7
- Removed `@SubagentBuilder` delegation reference
- Added agent-writer skill workflow: load skill → write agent file → write `PLACEHOLDER_MODEL_ID` → instruct user to fill in model and restart opencode

### Session Bootstrap
- Added check for `.opencode/agents/` session-local agents after Tier 4 context load
- If `PLACEHOLDER_MODEL_ID` still present in any agent file, HW warns the user before proceeding

### Delegation Rules
- Added "Session-local agents" entry pointing to `.opencode/agents/`
- Marked `@SubagentBuilder` as "no longer exists"
- Removed `@CodeWriter` reference in Build & Test section (was stale)

## Key Pattern
Session-local agents are created by HW during plan finalization (step 7 of /plan), not by a dedicated SubagentBuilder. The agent-writer skill (`~/.config/opencode/skills/agent-writer/SKILL.md`) provides the template and guidance.
