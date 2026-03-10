# Subtask 01 — Create ContextInsurgent Agent + Register in opencode.json

## Delegation
- **Agent:** @DocWriter
- **Model tier:** fast (github-copilot/claude-haiku-4.5)
- **Reason:** Clear spec with known patterns — create a new agent `.md` file following the existing subagent frontmatter format, then add one JSON entry to `opencode.json`. No code, no complex judgment, unambiguous output.

---

## Objective

Create the `ContextInsurgent` subagent — a more powerful project exploration agent than ContextScout. ContextInsurgent uses a standard-tier model and has access to Sequential Thinking MCP for complex multi-step exploration tasks. It is read-only (like ContextScout) but more capable and intended for tasks that require deeper analysis, correlation across multiple files, or complex project-wide reasoning. It is "ask-only" — HeadWrench must request user confirmation via the `question` tool before delegating to it.

Also register ContextInsurgent in `opencode.json` with the correct model assignment.

---

## Todolist

### 1. Create ContextInsurgent agent file
- [ ] Write `opencode/agents/subagents/context-insurgent.md`
- [ ] Frontmatter: `mode: subagent`, `steps: 20` (more steps than ContextScout's 12), `color: "#f59e0b"` (amber, distinct from ContextScout's cyan)
- [ ] Permissions: read-only (read/glob/grep/list allow; edit/write/task deny); sequential-thinking: allow; bash allowlist same as ContextScout (cat/ls/find/grep/rg/head/tail/wc)
- [ ] Description field: `"ContextInsurgent — deep project exploration with sequential thinking. Ask-only (HeadWrench must confirm with user before invoking)."`
- [ ] System prompt: covers complex exploration (multi-file correlation, dependency tracing, pattern analysis), output format (structured findings report), rules (read-only, never modifies files)

### 2. Register in opencode.json
- [ ] Add model entry: `"subagents/context-insurgent": { "model": "github-copilot/claude-sonnet-4.6" }` to the `agent` block in `opencode/opencode.json`
- [ ] Verify the entry follows the same pattern as other subagent entries

### 3. Verify
- [ ] Read back both files to confirm correct structure

---

## Scope
- **Write:** `opencode/agents/subagents/context-insurgent.md` (new file)
- **Edit:** `opencode/opencode.json` (add one model entry)
- **Read:** `opencode/agents/subagents/context-scout.md` (reference for permissions pattern), `opencode/agents/subagents/architect.md` (reference for sequential-thinking permission pattern)
- **Excluded:** All other agent files, all protocol files, all session files

---

## Patterns
```
✅ GOOD — Permission block: read: allow, edit: deny, write: deny, task: deny, sequential-thinking: allow
❌ BAD  — Adding model: entry to the frontmatter (models go in opencode.json only)

✅ GOOD — steps: 20 (ContextInsurgent is more capable, needs more steps)
❌ BAD  — steps: 8 or 12 (too few for complex multi-file exploration)

✅ GOOD — Bash allowlist: only safe read-only commands (cat/ls/find/grep/rg/head/tail/wc)
❌ BAD  — bash: "*": allow or bash: "*": ask (too permissive for a read-only agent)
```

---

## Constraints
- ContextInsurgent is read-only — it must NEVER have write, edit, or bash write permissions
- No `model:` in frontmatter — model assignment lives exclusively in `opencode.json`
- `task: deny` is mandatory — no delegation chains from subagents
- The description must mention "ask-only" so SubagentBuilder and other processes know this agent requires user confirmation
- Do NOT add `question: allow` to ContextInsurgent — it cannot ask the user itself (only HW asks on its behalf)

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
