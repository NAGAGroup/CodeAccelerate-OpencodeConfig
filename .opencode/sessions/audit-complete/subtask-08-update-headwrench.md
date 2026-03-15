# Subtask 08 — update-headwrench

## Objective
Update `headwrench.md` to: remove CodeWriter/DocWriter from delegation rules, add the new session-local agent creation workflow (load agent-writer skill, create agents, add placeholder model, instruct user), add opencode restart instruction after agent creation, and add a check for `.opencode/agents/` session-local agents during session bootstrap.

## Scope

### Edit
- `opencode/agents/headwrench.md`

### Excluded
- No changes to any other file (checkpoint.md and context-management.md references were handled in subtasks 02 and 05)

## Constraints

### Remove from Delegation Rules
Remove `@CodeWriter` and `@DocWriter` lines from the Delegation Rules section. These agents no longer exist as global agents.

### Add: Agent Creation Workflow
Add a new section or subsection under Delegation Rules (or Planning):

**When to Create Session-Local Agents**
During planning (plan finalization step), if any subtask requires implementation or documentation work:
1. Load the **agent-writer skill** (`~/.config/opencode/skills/agent-writer/SKILL.md`)
2. Use it to write a session-local agent `.md` file to `.opencode/agents/`
3. Write `PLACEHOLDER_MODEL_ID` in the agent's model field
4. Tell the user: "Before running 'start', update `PLACEHOLDER_MODEL_ID` in `.opencode/agents/{name}.md` with your preferred model. Restart opencode after updating."
5. Add a note in the session plan pointing subtasks to the session-local agent

**Session Bootstrap: Check for Session-Local Agents**
Add to Session Bootstrap section: "After loading Tier 4 context (session notes), check `.opencode/agents/` for any session-local agents. If found, note their names — these are the agents to delegate implementation subtasks to. If `PLACEHOLDER_MODEL_ID` is still present in any agent file, warn the user before proceeding."

### Update Delegation Rules section
The Delegation Rules should now read:

- **@ContextScout** — pre-planning situational awareness
- **@ContextInsurgent** — complex, multi-file project exploration requiring deep analysis or sequential reasoning
- **@DeepResearcher** — web and docs research (optional, user-gated)
- **Session-local agents** (from `.opencode/agents/`) — all implementation and documentation work; created by HW using the agent-writer skill during planning
- **agent-delegation-expert skill** — apply delegation rules to assign agent to each subtask, write assignments into `## Delegation` sections
- **@SubagentBuilder** — DELETED. HW now creates agents directly using the agent-writer skill.

Remove the SubagentBuilder line from everywhere. Add: "HW creates session-local agents directly using the agent-writer skill — SubagentBuilder no longer exists."

### Prompting Philosophy section
Keep as-is. The principle (what not how) applies to all agents including session-local ones.

## Todolist
- [ ] Read current headwrench.md Delegation Rules section
- [ ] Remove CodeWriter/DocWriter from Delegation Rules
- [ ] Remove SubagentBuilder delegation reference, note it's deleted
- [ ] Add session-local agent creation workflow (load skill, write file, placeholder model, user instruction)
- [ ] Add opencode restart instruction after agent creation
- [ ] Update Session Bootstrap: add check for .opencode/agents/ session-local agents

## Delegation
**Agent:** @session-local-implementer
**Model:** TBD by user — targeted edits to primary orchestrator agent
