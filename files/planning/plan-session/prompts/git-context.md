# Git Context Collection

This node runs after the scout phase and before the node library scout. It dispatches HeadWrench as a subagent to collect git context using file paths identified by the preceding scouts. The subagent runs a fixed set of git commands and returns output verbatim under labeled headings.

## Todo

1. `task` — Dispatch @HeadWrench as a subagent to collect git context. Wait for it to return before calling `next_step()`.

> **Dispatch @HeadWrench (subagent):** Your task prompt must tell the HW subagent to execute the following steps:
>
> 1. Run `git rev-parse --git-dir 2>/dev/null` — if this returns an error, stop immediately and report "Not a git repository."
> 2. Run `git branch --show-current` to identify the current branch.
> 3. Run `git status --short` to show working tree status.
> 4. Run `git log --oneline -10` to show the 10 most recent commits.
> 5. Run `git diff --stat HEAD` to show the diff stat vs HEAD.
> 6. Using the file paths identified by the scouts as relevant to the task, run `git log --oneline -10 -- <relevant-file-paths>` for the most task-relevant files (up to 5 files).
> 7. Run `git log --oneline -20 --all --grep="<task-keywords>"` using 2–3 keywords from the task description to find semantically related prior commits.
> 8. Report each section under labeled headings: **Branch**, **Working Tree Status**, **Recent Commits (last 10)**, **Diff Stat vs HEAD**, **File History** (one subsection per relevant file), **Related Commits** (keyword search results). Use "[empty]" if a command produces no output.
> 9. Run only the listed commands. Do not read source files. Return all command output verbatim — do not summarize or paraphrase.
> 10. End with: `**Outcome:** [PASS | FAIL | PARTIAL] — [one-sentence summary]`

After the task returns, MUST call `next_step()` to advance to the next node. Do NOT read files, summarize findings for the user, or add commentary — advance immediately.
