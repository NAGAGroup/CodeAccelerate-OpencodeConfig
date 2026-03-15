---
name: agent-delegation-expert
description: "Assigns the right agent to each subtask based on task type, complexity, and skill requirements. Load during Step 4 of /plan after the session plan is drafted to apply routing rules and populate the Delegation section of each subtask file."
---

# Agent Delegation Expert

Assigns the right agent to each subtask based on task type, complexity, and skill requirements.

## When to Invoke

Load during Step 4 of `/plan`, after the session plan is drafted. Apply the rules below to assign an agent to each subtask, then write those assignments into the `## Delegation` section of each `subtask-NN-{name}.md` file.

## Agent Routing Table

| Agent | Type | When to use |
|-------|------|-------------|
| @ContextScout | read-only | Pre-planning situational awareness, quick codebase questions |
| @ContextInsurgent | read-only + deep | Deep multi-file exploration, complex investigation, sequential reasoning |
| @DeepResearcher | research | Web search, documentation lookup, external API research |
| @session-local-implementer | implementation | File edits, code changes, writing new files — created per-session via the agent-writer skill |
| HeadWrench directly | infrastructure | git ops, build/test, small tightly-coupled tasks, session management |

## Session-Local Implementation Agents

For implementation and documentation subtasks, HeadWrench creates session-local agents using the **agent-writer skill** (`~/.config/opencode/skills/agent-writer/SKILL.md`) during plan finalization. Load that skill when you need to assign an implementation or doc subtask — it will guide creation of the appropriate `.opencode/agents/session-local-implementer.md` file.

Do NOT write agent files yourself. Load the agent-writer skill and follow its workflow.

## Permission Patterns

Every agent is assigned tool permissions via a deny-by-default policy. This ensures no agent can access tools beyond what's explicitly allowed, maintaining security and preventing unsupervised off-spec behavior.

### The Deny-by-Default Principle

Every agent frontmatter must use `"*": deny` as the first entry in each tool's permission block (or at root level). This is **required**, not optional. Use `"*": deny` (not `"*": ask`). Here's why:
- `"*": ask` still allows tool use **if the user approves**, which means the agent can request permissions beyond the spec and the human might grant them — this breaks unsupervised execution.
- `"*": deny` is hard-stop: tools not explicitly allowed are unavailable, period.

The actual YAML format used in agent frontmatter:

```yaml
permission:
  tool-name: allow    # explicit allow
  tool-name: deny     # explicit deny
  bash:
    "*": deny         # deny all bash by default
    "cat *": allow    # then explicitly whitelist safe commands
    "ls *": allow
```

### Template: Read-Only Agents

For **ContextScout** and **ContextInsurgent** patterns (information gathering, no modifications):

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

**No write tools. Bash is read-only inspection only.**

### Template: Implementation Agents

For **session-local-implementer** pattern (code generation and modification):

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

**Bash is read-only.** Write operations go through `edit`/`write` file tools only. Bash cannot execute `make`, `npm`, `cargo`, or any build/test/CI command.

### Template: Specialized-Tool Agents

For **DeepResearcher** and similar patterns (access only to specific non-bash tools):

```yaml
permission:
  "*": deny
  exa_web_search_exa: allow
  exa_deep_search_exa: allow
  exa_deep_researcher_start: allow
  exa_deep_researcher_check: allow
```

**No bash block at all.** When an agent doesn't need bash, omit it entirely rather than defining it with `"*": deny`. Only grant the specific non-bash tools needed.

### Common Mistakes

❌ **WRONG: Using `"*": ask` as default**
```yaml
permission:
  bash:
    "*": ask        # BAD — allows tool use with user approval
    "cat *": allow
    "npm test *": allow
```
`ask` allows any tool if the user approves, defeating unsupervised execution.

❌ **WRONG: Allowing build/test commands in bash**
```yaml
permission:
  bash:
    "*": deny
    "npm test *": allow     # BAD — HeadWrench only
    "make *": allow         # BAD — HeadWrench only
    "cargo test *": allow   # BAD — HeadWrench only
```
Build and test are **HeadWrench only**. No subagent should have these.

❌ **WRONG: Formatter/linter permissions in implementation agents**
```yaml
permission:
  bash:
    "*": deny
    "npx prettier *": allow   # BAD — execution capability
    "npx eslint *": allow     # BAD — execution capability
```
Formatters and linters are also execution — HeadWrench runs these if needed.

### HeadWrench: The Only Executor

Only **HeadWrench** should have permissions for:
- `npm install`, `npm test`, `npm run build`
- `make`, `cargo build`, `pytest`, any CI command
- Direct shell execution beyond safe reads

**No subagent should request or receive these permissions.**

## Output Format

Write each subtask's delegation into the `## Delegation` section of its `subtask-NN-{name}.md` file:

```
## Delegation
**Agent:** @AgentName  
**Reason:** one sentence explaining why this agent fits
```

Assignments go in subtask files **only** — never in `spec.json` or `index.md`.
