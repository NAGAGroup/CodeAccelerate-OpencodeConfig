---
name: agent-writer
description: "Teaches HeadWrench how to create session-local agent .md files in .opencode/agents/ during planning, replacing the deleted SubagentBuilder role."
---

# Agent Writer

Teaches HeadWrench how to create session-local agent `.md` files in `.opencode/agents/` during planning. Load this skill whenever a planning session identifies a subtask that needs a custom agent — write the file directly rather than delegating to SubagentBuilder.

## When to Create Session-Local Agents

Create a session-local agent when a subtask requires:

- **File editing or writing (implementation work)** — use the implementation template
- **Documentation writing** — use the doc template (same as implementation but with a doc-focused system prompt)
- **Specific research tooling** (web search, deep research, library docs) — use the research template

Do **NOT** create session-local agents for read-only subtasks. ContextScout and ContextInsurgent handle information gathering; they already exist and need no new file.

Typically one agent per session covers all implementation subtasks unless subtasks have radically different capability needs (e.g. a session that mixes pure code implementation with external web research).

## Agent File Frontmatter Format

Every agent file begins with YAML frontmatter. **The `permission` block goes inside the frontmatter** — not in the body. The full frontmatter structure is:

```yaml
---
name: agent-name
description: "One-line description of what this agent does"
model: PLACEHOLDER_MODEL_ID
permission:
  # ... (see Permission Block Templates below)
---
```

Field notes:

- **`name`** — kebab-case, descriptive. Examples: `session-implementer`, `doc-writer-{session-name}`, `research-agent`.
- **`description`** — shown to the user when listing agents; keep it to one clear sentence.
- **`model`** — always write `PLACEHOLDER_MODEL_ID` verbatim. HeadWrench must instruct the user to replace this with their preferred model ID before running `start`. Surface the recommended model type explicitly (e.g., "a capable writing/editing model such as `github-copilot/claude-sonnet-4.6` or equivalent").
- **`permission`** — always included in the frontmatter. Use the deny-by-default templates below.

## System Prompt Structure

After the frontmatter, write a system prompt in plain markdown. Include these four elements in order:

1. **Role statement** (1–2 sentences) — what kind of agent this is and what it's for.
2. **What the agent does and doesn't do** — set clear behavioral scope; mention the type of files or tasks it handles.
3. **Commit ownership reminder:**
   > Do NOT commit any files. HeadWrench owns all git commits.
4. **Scope reminder:**
   > Work only on files specified in the subtask you are given.

Keep system prompts concise and direct. Avoid over-explaining — the agent has all the tools it needs; the prompt just sets intent and constraints.

## Permission Block Templates

Every agent uses a deny-by-default policy. Tool access not explicitly allowed is hard-blocked. **Always place the `permission` block inside the frontmatter.**

### Implementation Agent

For agents that read and write files (code, config, markdown):

```yaml
---
name: agent-name
description: "..."
model: PLACEHOLDER_MODEL_ID
permission:
  "*": deny
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
---
```

Bash is read-only inspection only. All writes go through `edit`/`write` file tools. No build, test, or CI commands.

### Read-Only Agent

For agents that inspect but never modify files:

```yaml
---
name: agent-name
description: "..."
model: PLACEHOLDER_MODEL_ID
permission:
  "*": deny
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
---
```

No write tools at all. Bash is inspection-only.

### Research Agent

For agents that use web search or documentation tools only — no filesystem access needed:

```yaml
---
name: agent-name
description: "..."
model: PLACEHOLDER_MODEL_ID
permission:
  "*": deny
  exa_web_search_exa: allow
  exa_deep_search_exa: allow
  exa_deep_researcher_start: allow
  exa_deep_researcher_check: allow
  context7_resolve-library-id: allow
  context7_query-docs: allow
---
```

No bash block at all. When an agent doesn't need bash, omit it entirely. Grant only the specific external tools required.

## File Naming Convention

| Agent type | Filename |
|------------|----------|
| General implementation | `session-implementer.md` |
| Specialized implementation | `{task-type}-implementer.md` |
| Documentation writing | `doc-writer.md` |
| Research / web search | `research-agent.md` |

Always place files in `.opencode/agents/` (project-local). These files persist across sessions and are picked up automatically by opencode from that directory.

## Communicating Model Recommendations to the User

After creating the agent file, HeadWrench must surface the placeholder and tell the user what to do with it. Use this exact message pattern:

> "I've created a session-local agent at `.opencode/agents/{name}.md` with a placeholder model ID. Before running 'start', replace `PLACEHOLDER_MODEL_ID` in that file with your preferred model. For implementation work, I recommend a capable writing/editing model (e.g., `github-copilot/claude-sonnet-4.6` or equivalent). Restart opencode after updating the model."

Adjust the model recommendation to match the agent type — implementation work calls for a strong writing/editing model; research agents may need a model with good reasoning and synthesis capabilities.

## opencode.json — Not Required for Session-Local Agents

Session-local agents in `.opencode/agents/` are picked up automatically by opencode from that directory. **No `opencode.json` entry is required.** The `model:` field in the agent's frontmatter controls model selection directly.

Do not modify `opencode.json` when creating session-local agents.
