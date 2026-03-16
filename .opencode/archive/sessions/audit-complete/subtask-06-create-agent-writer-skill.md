# Subtask 06 — create-agent-writer-skill

## Objective
Create a new skill at `opencode/skills/agent-writer/SKILL.md` that teaches HeadWrench how to write session-local agent `.md` files directly into `.opencode/agents/` during planning, replacing the SubagentBuilder role.

## Scope

### Write (new file)
- `opencode/skills/agent-writer/SKILL.md`

### Excluded
- No edits to existing agent files
- No changes to opencode.json (model stubs are handled by HW at plan finalization, not by this skill)
- No changes to headwrench.md (that's subtask 08)

## Constraints

The skill must teach HW everything needed to create a working session-local agent. Include all of the following sections:

### 1. When to Create Session-Local Agents
- Create when a subtask requires file editing/writing (implementation work) — use the implementation template
- Create when a subtask requires documentation writing — use the doc template (same as implementation but with doc-focused system prompt)
- Create when a task requires specific research tooling — use the research template
- Do NOT create session-local agents for read-only subtasks (ContextScout/ContextInsurgent handle those)
- Typically one agent per session covers all implementation subtasks unless subtasks have radically different capability needs

### 2. Agent File Frontmatter Format
```yaml
---
name: agent-name
description: "One-line description of what this agent does"
model: PLACEHOLDER_MODEL_ID
---
```
- `name`: kebab-case, descriptive (e.g., `session-implementer`, `doc-writer-{session-name}`)
- `description`: shown to user when listing agents
- `model`: always write `PLACEHOLDER_MODEL_ID` — HW will instruct the user to replace this with their preferred model ID before running 'start'. HW should surface the recommended model type (e.g., "a capable writing/editing model such as claude-sonnet or equivalent")

### 3. System Prompt Structure
After the frontmatter, write a system prompt with:
- Role statement (1-2 sentences)
- What the agent does and doesn't do
- Commit ownership reminder: "Do NOT commit any files. HeadWrench owns all git commits."
- Scope reminder: "Work only on files specified in the subtask you are given."

### 4. Permission Block Templates

**Implementation agent** (read + write + edit + glob + grep + bash read-only):
```yaml
permission:
  edit: allow
  write: allow
  read: allow
  glob: allow
  grep: allow
  list: allow
  task: deny
  bash:
    "*": deny
    "cat *": allow
    "ls *": allow
    "find *": allow
    "grep *": allow
    "rg *": allow
```

**Read-only agent** (no edits, bash read-only):
```yaml
permission:
  edit: deny
  write: deny
  read: allow
  glob: allow
  grep: allow
  list: allow
  task: deny
  bash:
    "*": deny
    "cat *": allow
    "ls *": allow
    "find *": allow
    "grep *": allow
    "rg *": allow
```

**Research agent** (no bash, exa tools only):
```yaml
permission:
  "*": deny
  exa_web_search_exa: allow
  exa_deep_search_exa: allow
  exa_deep_researcher_start: allow
  exa_deep_researcher_check: allow
  context7_resolve-library-id: allow
  context7_query-docs: allow
```

### 5. File Naming Convention
- Implementation: `session-implementer.md` (or `{task-type}-implementer.md` for specialized work)
- Doc: `doc-writer.md`
- Research: `research-agent.md`
- Always place in `.opencode/agents/` (project-local, persists across sessions)

### 6. Communicating Model Recommendations to User
After creating the agent file, HW must tell the user:
> "I've created a session-local agent at `.opencode/agents/{name}.md` with a placeholder model ID. Before running 'start', replace `PLACEHOLDER_MODEL_ID` in that file with your preferred model. For implementation work, I recommend a capable writing/editing model (e.g., `github-copilot/claude-sonnet-4.6` or equivalent). Restart opencode after updating the model."

### 7. opencode.json — NOT Required for Session-Local Agents
Session-local agents in `.opencode/agents/` are picked up automatically by opencode from that directory. No opencode.json entry is required. The `model:` field in the agent's frontmatter controls model selection directly.

## Todolist
- [ ] Create opencode/skills/agent-writer/ directory
- [ ] Write opencode/skills/agent-writer/SKILL.md with all 7 sections above

## Delegation
**Agent:** @session-local-implementer
**Model:** TBD by user — new file creation with detailed spec
