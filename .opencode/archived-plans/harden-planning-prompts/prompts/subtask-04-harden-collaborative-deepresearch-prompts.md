<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 04 — Harden Collaborative + Deep-Research Workflow Prompts + Embedded Artifact Templates

## Objective

Apply strictness language standards to all planning workflow node prompts in the collaborative and deep-research workflows, AND to the embedded session artifact content inside their respective `finalize.md` files. These workflows have unique characteristics: collaborative sessions grant open-ended "restructuring authority" to explore nodes — the strictness must apply to Advance/Constraints/gate behavior without removing the intentional flexibility granted to explore-type nodes for their work scope.

## Scope

- **Edit:** all files in `opencode/planning/collaborative/` and `opencode/planning/deep-research/`
- **Write:** nothing new
- **Excluded:** all files outside those two directories

## Constraints

- Read `opencode/planning/plan-design-guidelines.md` first — specifically the "Prompt Strictness Standards" section. Use it as the canonical reference.
- Read ALL files in both directories before editing anything. The file lists are unknown — discover them first.
- Do NOT restructure file content. Preserve all existing sections, headings, and ordering.
- Do NOT add new top-level sections. Do NOT remove sections.
- **Critical for collaborative:** explore nodes are intentionally granted open-ended authority over their work content (they may restructure `plan.json`, add/split/remove explore nodes). This authority is NOT removed. Only the Advance sections, Constraints sections, and gate behavior get strict language. The work-scope freedom remains.
- **Critical for collaborative:** Any `spec-gate.md` or similar gate node embedded in collaborative's `finalize.md` must apply full gate node strictness: present, wait, explicit user approval before advancing.
- `finalize.md` files are terminal — their own Advance sections must use `close_session()`, not `next_step()`.
- For deep-research: the embedded `research-execute.md` template content must be strict about what the agent does per iteration — dispatch exactly the specified researchers, wait for all returns, accumulate to `research-brief.md`, then call `next_step()` exactly once. No deviation.
- For deep-research: the embedded `synthesis-gate.md` template must apply gate node strictness.

## Todolist

1. Read `opencode/planning/plan-design-guidelines.md` — locate and internalize the "Prompt Strictness Standards" section.
2. List and read all files in `opencode/planning/collaborative/`.
3. List and read all files in `opencode/planning/deep-research/`.
4. Edit all collaborative planning workflow node prompts — harden Advance, Constraints, and any loop/gate sections.
5. Edit collaborative `finalize.md` — harden own Constraints + Advance; update embedded artifact templates (especially gate nodes) to use strict language.
6. Edit all deep-research planning workflow node prompts — harden Advance, Constraints, and any loop/gate sections.
7. Edit deep-research `finalize.md` — harden own Constraints + Advance; update embedded `research-execute.md` template to use strict iteration behavior; update embedded `synthesis-gate.md` to use gate node strictness.

## Delegation

**Agent:** HW (direct)
**Reason:** Both workflows have nuanced embedded content where blanket strictness would break intentional design (collaborative's open-ended explore authority, deep-research's iterative accumulation pattern). Judgment is required to apply strictness correctly without breaking the workflow semantics.

## Advance

Call `next_step()` NOW. Do this exactly once. The DAG will detect this is the terminal subtask and prompt you to call `close_session()`. Do NOT read session files or DAG state. Do NOT take any other action.
