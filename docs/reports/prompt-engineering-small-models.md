# Prompt Engineering for Small Models: Audit & De-densification Hypothesis

## Context: The De-densification Hypothesis

CodeAccelerate prompts were written for and tested against frontier models (Claude Sonnet-class). When run on 7B–30B local models via the Ollama profile, the density, NEVER-heavy framing, redundant rules, and suboptimal section ordering degrade compliance. The hypothesis: de-densification — removing redundancy, reordering sections by positional weight, converting NEVER to positive framing, consolidating near-duplicate rules — will improve reliability on weaker models without regressing on stronger ones.

---

## Audit Findings: Category A — Agent Prompts (`files/agents/`)

### headwrench.md (212 lines) — highest density risk

- **Lines 165–196: Dense constraint matrix** — ~18 rules for 5 agents in ~32 lines. The densest single section in any agent prompt. A 7B–30B model reading this must track 18 distinct per-agent constraints simultaneously.
- **Communication Style section (section 2):** Contains 5 NEVER rules for behavioral preferences (e.g., "NEVER open a response with affirmation filler"). Per prompt engineering best practices, behavioral preferences should use positive framing ("Respond directly"), not NEVER. NEVER/prohibition framing is less reliable on smaller models.
- **Section ordering violation:** Communication Style (all-NEVER guardrails) is section 2 but belongs last. Core instructions should precede guardrails — the model applies role context to what follows; guardrails belong in high-recency position.
- **Partial duplication:** "What You Don't Do" section partially duplicates the Delegation section.
- **Conflated content:** Planning section mixes two distinct topics: HW's own reasoning process vs. DAG-authoring design rules for the write-dag node.

### context-scout.md (98 lines) — structural dead weight

- **Pre-instruction preamble:** Goal + Backstory sections appear before Rules — 2 sections of dead weight inflating the pre-instruction zone before behavioral rules appear.
- **Hard Constraints density:** ~10 distinct rules in the Hard Constraints section, some redundant with the Role statement.

### junior-dev.md (82 lines) — rule duplication

- **Near-duplicate rules (lines 33–51):** Rules section contains ~7 rules, with near-duplicates that cause semantic confusion on weaker models:
  - "Edit code only" ≈ "Stay focused on edits"
  - "Scoped edits" ≈ "Stay within scope"
  - "No questions" ≈ "Interpret ambiguity"
- **Backstory section:** Redundant preamble.
- **Section ordering:** Issues & Ambiguities section continues adding behavioral rules after what should be the final guardrails section.

### quick-doc.md (88 lines) — structural dead weight

- **Three-section preamble:** Goal + Backstory + "What You Handle" sections appear before Rules — three sections of dead weight before behavioral instructions.
- **Content duplication:** Anti-Patterns section duplicates Rules content (NEVER ask questions, NEVER spend >3 steps).
- **Unclear relationship:** 3-step context limit rule conflates reads with the 8-step budget; relationship unclear.

### context-insurgent.md (92 lines) — best structured, minor issues

- **Minor duplication:** "Your Role" section restates the opening Role paragraph.
- **Ambiguous threshold:** Sequential-thinking threshold "3 files" could be misread as a hard cutoff rather than a guideline.
- **Missing example:** No output format example provided.

### external-scout.md (102 lines) — generally good, two issues

- **Negative framing:** Context7 invocation section leads with a negative constraint; positive framing missing.
- **Structural weakness:** Tool selection table not anchored by the primary rule — the Context7-first preference should appear before the table, not after.
- **Critical capability gap (not a prompt issue, but prompt-addressable):** ExternalScout has no `read` permission in its frontmatter. When Exa tool calls return truncated output, the tool informs the agent where the full content was written (a file in `~/.local/share/opencode/`). ExternalScout cannot read that file, so truncated content is silently lost, producing shallow research outputs. Possible change: add `read` to ExternalScout frontmatter, constrained by prompt instructions to truncated-output recovery only.

---

## Audit Findings: Category B — Planning DAG Delegation Prompts (`files/planning/plan-session/prompts/`)

### write-dag.md (195 lines) — densest Category B prompt

- **Duplicated schema reminders:** Lines 40–44 and 88–96 repeat the same schema principles. Duplication adds length without clarity; on weaker models, it adds noise.
- **Structural fragmentation:** Dispatch blockquote (lines 5–9) is separated from the todo items (lines 23–38) by a Do NOT block and a task tool reference — fragmentation disrupts the coherence of the dispatch instruction.

### sequential-thinking.md — framework at edge of reliable following

- **Oversized framework:** 8-item reasoning framework. Items 7 and 7a both address the same topic (research gate handling) and should be merged. 8 items is at the edge of reliable following for models <30B.
- **Non-standard numbering:** Todo item numbered "0" (non-standard, should be "1").
- **Stale reference:** Reference to `pre-research-thinking` node (line 33) — that node does not exist in the current DAG.

### research-gate.md — unstructured prose section

- **Unstructured assessment section:** "How to assess" section is unstructured prose where a table would be more reliable for weaker models.
- **Contains critical routing bug:** See dag-workflow-analysis.md for details.

---

## Audit Findings: Category C — Node Library Templates (`files/planning/plan-session/node-library/`)

### Consistent Ordering Violation

`## Before advancing` appears **after** the dispatch blockquote/todo section in all `prompt-template.md` files examined. Best practice: dispatch blockquote should be the final element (high-recency position for model reading order). This is a batch fix candidate across all node type templates.

### parallel-tasks Node — Incomplete Constraint Cascade

Output constraint cascade is incomplete — the critical "no generic section headers" constraint does not propagate through all three required layers:
1. README → (missing)
2. Fixed exec-spec section → (present)
3. Dispatch blockquote → (missing)

A constraint missing from any one layer gets dropped at that indirection hop. The constraint must appear in all three layers for reliable propagation to executing subagents.

### decision-gate Node — Route-Matching Documentation Bug

README implies automatic `when`-string matching for branch routing, which is **incorrect**. Branch routing uses **node ID matching**: the `next` param in `next_step()` is matched against each branch's `nodeId`, not against `when`. This misleads the planning agent when writing decision-gate nodes, causing incorrect branch target specifications.

---

## External Research Findings: Prompting Weaker Models

- Models under 30B are disproportionately sensitive to instruction ordering and section density
- Positive framing ("Do X") outperforms prohibition framing ("NEVER do X") for models under 30B — prohibitions require the model to invert the instruction before applying it, adding cognitive load
- Near-duplicate rules produce semantic confusion — the model attempts to satisfy both interpretations simultaneously, producing inconsistent output
- Shorter, cleaner prompts with fewer rules produce more reliable behavior; redundancy doesn't add safety margin, it adds noise
- Examples and inline ✓/✗ pairs are critical for weaker models where abstract rules fail — concrete exemplars anchor behavior
- Section headers help smaller models chunk and follow multi-part instructions
- Pre-instruction dead weight (preamble sections before core instructions) dilutes the model's attention toward the behavioral rules

---

## High-Level Possible Changes

### Agent Prompt Changes

- **headwrench.md (de-densify):**
  - Move the Per-Agent Prompt Requirements section (lines 165–196, ~18 rules) to AGENTS.md as reference material, not inline prompt content.
  - Convert the 5 NEVER behavioral rules in Communication Style section to positive framing (e.g., "NEVER open a response with affirmation filler" → "Respond directly without affirmation filler").
  - Fix section ordering: move Communication Style and guardrails to the end; core instructions should precede guardrails.

- **context-scout.md, junior-dev.md, quick-doc.md (remove dead weight):**
  - Drop Goal + Backstory sections entirely. Begin prompts with Role definition + core instructions.
  - Reduces pre-instruction preamble that dilutes attention on weaker models.

- **junior-dev.md (deduplicate rules):**
  - Consolidate the ~7 near-duplicate rules in the Rules section (lines 33–51) into ~4 distinct, non-overlapping rules.
  - Example: merge "Edit code only" + "Stay focused on edits" into a single, positive rule.

- **quick-doc.md (clarify and simplify):**
  - Clarify the relationship between the 3-step context limit and the 8-step budget (or consolidate if they are the same concept).
  - Remove Anti-Patterns section if it duplicates Rules; otherwise move it after the output format section.

- **external-scout.md:**
  - Move the Context7-first preference to immediately after the role definition, before the tool selection table.
  - Reframe the negative Context7 invocation guidance using positive framing.
  - Add `read` permission to ExternalScout frontmatter; constrain via prompt instructions to truncated-output recovery only (not general codebase reads).

### Planning DAG Delegation Prompt Changes

- **write-dag.md (de-densify):**
  - Remove one instance of the duplicated schema reminders (lines 88–96).
  - Move the dispatch blockquote to immediately precede the todo items, eliminating structural fragmentation.

- **sequential-thinking.md:**
  - Merge items 7 and 7a (research gate handling) into a single item. Reduce framework from 8 items to 7.
  - Renumber starting from "1" instead of "0".
  - Remove the stale reference to `pre-research-thinking` node.

- **research-gate.md:**
  - Convert the unstructured "How to assess" prose section into a decision table with three columns: [Research needed?] [Research at planning time] [Research at execution time].

### Node Library Template Changes

- **Batch fix — all node types:**
  - Move `## Before advancing` section to immediately before the dispatch blockquote (so dispatch blockquote remains the final, high-recency element).

- **parallel-tasks node:**
  - Add the "no generic section headers" constraint to the README's "must resolve" section.
  - Add the constraint to the dispatch blockquote (where currently missing).

- **decision-gate node:**
  - Correct the README's branch routing explanation: clarify that routing uses node ID matching (the `next` param in `next_step()` matches against `b.nodeId`), not `when`-string matching.
  - Add an example: `next_step({ next: "branch-a" })` where `branch-a` is the actual node ID of the selected branch.

---

## Scope & Next Steps

**This document is a research input to a future redesign session — complete rewrites are in scope.** The audit identifies specific prompt engineering gaps at the file and line-number level. A redesign session should:

1. Review these findings against live session data (weak model compliance rates before/after).
2. Prioritize fixes by impact: density reductions (headwrench.md, write-dag.md) and constraint-cascade completeness (Category C) are highest-impact candidates.
3. Decide on a fix strategy for each issue: targeted edits vs. full rewrites.
4. Validate changes against both frontier and small models to verify the de-densification hypothesis.

Note: This audit does not recommend specific model sizing thresholds, training data cutoffs, or architecture-specific tuning — only prompt-level observations that affect reliability across the 7B–30B range.
