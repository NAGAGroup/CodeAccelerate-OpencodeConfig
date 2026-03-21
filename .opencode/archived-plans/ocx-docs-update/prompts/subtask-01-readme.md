<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 01 — Rewrite README.md

## Objective

Rewrite the Quick Start section to use the OCX installation flow. Update the intro paragraph to mention the three profile choices. Remove all git clone / symlink / copy instructions. The Features and Documentation sections need minimal changes — review them for any stale installation references and fix if found.

## Scope

- **Edit:** `README.md`
- **No other files**

## Constraints

- Keep the overall structure: intro, Quick Start, Features, Documentation, License
- The intro (first two paragraphs) can be lightly updated but should remain terse and factual
- The three profiles are: `naga` (Anthropic), `naga-copilot` (GitHub Copilot), `naga-free` (OpenCode Zen free-tier)
- Do NOT say "open-source" for naga-free — it uses OpenCode Zen free-tier models, not open-source models
- The Quick Start should show all three profile options so users can pick the one that fits them
- Keep the tone direct and minimal — no marketing fluff
- The Documentation section links to `docs/*.md` — keep these links intact
- Do not add a GitHub repo link in Quick Start (OCX is the install path now)

## Todolist

- [ ] Read current `README.md` to understand exact content before editing
- [ ] Rewrite the Quick Start section with the full OCX flow (install → init → add registry → pick profile → launch)
- [ ] Update intro paragraph(s) to mention three profile choices exist
- [ ] Remove any git clone / symlink / copy references from Features section (if present)
- [ ] Verify Documentation section links are still accurate
- [ ] Final read-through: confirm no stale references remain

## Delegation

**Agent:** @QuickDoc
**Model:** haiku-like
**Prompt structure:**
- Read: `README.md`
- Goal: Rewrite Quick Start with OCX install flow; update intro to mention three profiles; remove git/symlink/copy references
- Constraints: Keep Features + Documentation sections; three profiles are naga (Anthropic), naga-copilot (Copilot), naga-free (OpenCode Zen free-tier — NOT open-source); keep tone terse and direct
- Verify: No git clone / ln -s / cp -r instructions remain; all three profile install commands present; file reads coherently

## Advance

Call `next_step()` when this subtask is complete.
