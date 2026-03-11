# Subtask 03 — Final Commit and Create PR

## Delegation
- **Agent:** HeadWrench (inline — no subagent)
- **Model tier:** N/A — git operations and GitHub CLI, no subagent needed

---

## Objective

Create the final non-WIP commit on the `feat/mermaid-tool` branch, then open a pull request to `main` using the `gh` CLI. All implementation and documentation changes should already be complete and committed as WIP commits from prior checkpoints.

---

## Todolist

### 1. Verify branch state
- [ ] Run `git status` to confirm no uncommitted changes remain
- [ ] Run `git log --oneline feat/mermaid-tool..HEAD` (or `git log --oneline main..HEAD`) to review all WIP commits since branch creation

### 2. Create final commit (squash optional)
- [ ] Run final commit: `git add -A && git commit -m "feat: add render_mermaid tool plugin (beautiful-mermaid)"`
  - If all changes are already committed as WIP commits, amend the last WIP commit or create a conventional final commit
  - Follow the repo convention from prior sessions

### 3. Push branch
- [ ] `git push -u origin feat/mermaid-tool`

### 4. Create PR
- [ ] Run `gh pr create` with:
  - Title: `feat: add render_mermaid tool plugin`
  - Body covering: what was added, library used, tool API (three formats), how to test
  - Base: `main`

---

## Scope
- **Commands:** `git`, `gh pr create`
- **Excluded:** No file edits. All content changes must be complete before this subtask.

---

## Constraints
- Do NOT force-push to main
- Use `gh pr create` — do not use the GitHub web UI
- PR body should include: brief description, tool signature, example usage, link to `beautiful-mermaid` library

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
