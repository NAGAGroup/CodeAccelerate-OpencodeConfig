---
topic: codewriter-permissions-risk
tier: local
promoted_from: inbox
session: deny-by-default-agent-permissions
created: 2026-03-11
last_reviewed: 2026-03-13
supersedes: ~
superseded_by: ~
---

# Pattern: CodeWriter as Highest-Risk Agent in Permission Audits

**Date:** 2026-03-11  
**Session:** deny-by-default-agent-permissions

## Observation

When auditing all 8 subagent permission blocks for deny-by-default compliance, only `code-writer.md` was non-compliant. All 7 other agents already had `"*": deny` as their bash default (or no bash access at all).

The only agent that had execution-capable bash permissions was CodeWriter, which had `npm test`, `make`, `cargo test`, `npx prettier`, and `npx eslint` explicitly allowed alongside a weak `"*": ask` default.

## Implication

Future permission audits can start with CodeWriter as the highest-risk agent. The pattern of allowing "just" formatting or testing commands (`npx prettier`, `npm test`) is a common creep path toward giving agents too much execution power.

## What Good Looks Like

DeepResearcher is the cleanest model: no `bash` block at all, just a root-level `"*": deny` with only the specific non-bash tools it needs. Agents that truly don't need bash should omit the bash block entirely rather than defining it with `"*": deny`.
