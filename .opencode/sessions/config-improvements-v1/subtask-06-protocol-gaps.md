# Subtask 06 — protocol-gaps

## Delegation
**Agent:** @session-local-implementer (config-implementer)  
**Reason:** Targeted additive edits to 4 existing protocol/agent files plus creation of 1 new command file.

## Objective
Address the protocol gaps identified during Scout 2 analysis: clarify undefined thresholds and recovery paths in checkpoint.md, add operational guidance to the 3 subagent files, and create the missing context-audit.md command file.

## Todolist
- Read `~/.config/opencode/protocols/checkpoint.md` in full
- Read `~/.config/opencode/agents/subagents/context-scout.md` in full
- Read `~/.config/opencode/agents/subagents/context-insurgent.md` in full
- Read `~/.config/opencode/agents/subagents/deep-researcher.md` in full
- Read `~/.config/opencode/protocols/context-management.md` (the 7-step /context-audit workflow) to use as source for context-audit.md command
- Update checkpoint.md: add hanging task definition, significant findings definition, partial checkpoint recovery note
- Update context-scout.md: add max report length, malformed file guidance, conflict reporting instruction
- Update context-insurgent.md: define "non-trivial" heuristic, add max depth guidance
- Update deep-researcher.md: add tool priority guidance, citation format, max API call limit
- Write `~/.config/opencode/commands/context-audit.md` (new)

## Scope
**Edit:**
- `~/.config/opencode/protocols/checkpoint.md`
- `~/.config/opencode/agents/subagents/context-scout.md`
- `~/.config/opencode/agents/subagents/context-insurgent.md`
- `~/.config/opencode/agents/subagents/deep-researcher.md`

**Write:**
- `~/.config/opencode/commands/context-audit.md` (new)

**Excluded:** All other files. Do not touch headwrench.md, plan protocols, skills, or session files.

## Patterns

### checkpoint.md additions
- **Hanging task definition**: A subtask is "hanging" if it has received no tool output or progress signal for >10 minutes. Action: mark failed, surface to user with last-known state. Do not silently retry.
- **Significant findings threshold**: A finding qualifies for session notes if it meets at least one of: (a) it will affect how a future session approaches this codebase, OR (b) it documents a pattern applicable to other files/components beyond the current subtask scope.
- **Partial checkpoint recovery**: If a commit fails after session notes have already been written, retry the commit with the same staged files. Do NOT re-run the notes step — notes are already written. If retry fails twice, surface to user with the staged file list.

### context-scout.md additions
- **Max report length**: 500 lines / ~10,000 tokens. If the scope requires more, split into multiple findings sections with explicit section labels.
- **Malformed context files**: If a context file is missing YAML frontmatter or has invalid headers, report the issue in the "Concerns" section of the output. Continue with available data — do not halt.
- **Conflict reporting**: If two context files contain contradictory information, note the contradiction explicitly in the "Concerns" section with both file paths and the conflicting statements.

### context-insurgent.md additions
- **"Non-trivial" heuristic**: Use sequential thinking when the task involves ANY of: (a) >2 source files, (b) >1 reasoning hop (a conclusion requires evidence from multiple sources), (c) ambiguous scope that requires judgment to define. Single-file reads or direct lookups do not require sequential thinking.
- **Max depth guidance**: Limit exploration to 5 files depth from the entry point unless a critical finding warrants deeper traversal. If going beyond 5 files, note why in the findings.

### deep-researcher.md additions
- **Tool priority**: Use `exa_deep_search_exa` for synthesis questions requiring multiple sources. Use `exa_web_search_exa` for targeted lookups. Use `context7_query-docs` for official library/framework documentation. Prefer Context7 for library docs over general web search.
- **Citation format**: Every claim must be cited as: `[Title](URL) — accessed 2026-03-XX`. Include both URL and title. If no URL is available, include author/publication.
- **API call limit**: Max 10 exa calls per research task. If more are needed, note that research was depth-limited and surface the most important remaining questions.

### context-audit.md command (new)
- YAML frontmatter with description: "Run the /context-audit workflow to review, classify, and promote context files"
- Body: the 7-step /context-audit workflow from context-management.md, written as HeadWrench instructions
- The 7 steps (from context-management.md):
  1. Inventory all inbox items, classify each with a flag ([INBOX] / [ARCHIVE] / [RETROFIT] / [MISCLASSIFIED] / [SUPERSEDED] / [CONTEXT-REVIEW])
  2. Present inventory to user for review
  3. For items marked [CONTEXT-REVIEW]: surface the item content and ask user to confirm promotion vs. archive
  4. For items marked [SUPERSEDED]: update superseded_by fields and move to archive
  5. For items marked [MISCLASSIFIED]: move to correct tier
  6. For items marked [RETROFIT]: add YAML frontmatter to the existing file
  7. Write a summary note to session notes documenting what changed

## Constraints
- Do NOT commit any files. HeadWrench owns all git commits.
- Do NOT modify any files outside the Scope list above.
- Additive only — do not remove or restructure existing content in the subagent files or checkpoint.md.
- The context-audit.md command should be self-contained: a user running /context-audit should be able to follow the workflow from the command file alone (without referencing context-management.md).

## Success Criteria
- checkpoint.md contains definitions for: hanging task (>10 min), significant findings qualification, partial checkpoint recovery procedure
- context-scout.md contains: max report length (500 lines / ~10K tokens), malformed file handling, conflict reporting in Concerns section
- context-insurgent.md contains: non-trivial heuristic (>2 files OR >1 hop OR ambiguous scope), max 5-file depth guideline
- deep-researcher.md contains: tool priority ordering (exa_deep_search > exa_web_search > context7), citation format, max 10 exa calls
- `~/.config/opencode/commands/context-audit.md` exists with YAML frontmatter + 7-step workflow body

## Context Files
- `~/.config/opencode/protocols/checkpoint.md` — edit target
- `~/.config/opencode/agents/subagents/context-scout.md` — edit target
- `~/.config/opencode/agents/subagents/context-insurgent.md` — edit target
- `~/.config/opencode/agents/subagents/deep-researcher.md` — edit target
- `~/.config/opencode/protocols/context-management.md` — read only (source for /context-audit workflow)

---
*Checkpoint: Final session commit after this subtask completes. Circuit breaker threshold: 3.*
