<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 01 — Codify Strictness Language Standards

## Objective

Add a new "Prompt Strictness Standards" section to `opencode/planning/plan-design-guidelines.md`. This section becomes the canonical reference for how all planning workflow prompt files and generated session artifact prompts must be written. It must define exact language patterns for five node categories: Advance sections, Constraints sections, loop nodes, verification nodes, and gate nodes.

## Scope

- **Edit:** `opencode/planning/plan-design-guidelines.md`
- **Write:** nothing else
- **Excluded:** all other files

## Constraints

- Read the current `plan-design-guidelines.md` in full before editing.
- Insert the new section AFTER the existing "Planning Best-Practices" section and BEFORE the "plan.json Schema Reference" section. Do not move any existing content.
- Do not alter any existing sections — additive only.
- The new section must be titled exactly: `## Prompt Strictness Standards`
- All language examples in the new section must use fenced code blocks with `markdown` syntax highlighting.

## Todolist

1. Read `opencode/planning/plan-design-guidelines.md` in full.
2. Draft the "Prompt Strictness Standards" section covering all five categories below (see Content Requirements).
3. Insert the section between "Planning Best-Practices" and "plan.json Schema Reference".

## Content Requirements

The section must define the following five categories. For each, include a **Bad** (current style) and **Good** (required style) example.

### 1. Advance Sections

**Bad (too soft):**
```markdown
## Advance

Call `next_step()` to advance.
```

**Good (strict):**
```markdown
## Advance

Call `next_step()` NOW. Do this exactly once. Do NOT read session files or DAG state to determine whether to advance. Do NOT take any other action before or after calling `next_step()`.
```

### 2. Constraints Sections

**Bad (too soft):**
```markdown
## Constraints

- Do not begin decomposing the work yet.
- Do not propose solutions.
```

**Good (strict):**
```markdown
## Constraints

- You MUST NOT begin decomposing the work. Stop immediately if you find yourself doing so.
- You MUST NOT propose solutions or implementation approaches of any kind.
- Violating these constraints means this node has failed. Stop and re-read the objective.
```

### 3. Loop Nodes

**Bad (too soft):**
```markdown
Loop back if more questions are needed.
```

**Good (strict):**
```markdown
You are in a loop node. You have ONE action: ask the single most important clarifying question using the `question` tool, then call `next_step()` immediately. Do NOT ask more than one question. Do NOT summarize, analyze, or propose solutions. After calling `next_step()`, stop — the DAG determines whether to loop again or advance. You MUST NOT make that determination yourself.
```

### 4. Verification Nodes (especially debug fix→verify)

**Bad (too soft):**
```markdown
Run the full test suite. If all pass: call `close_session()`. If any fail: call `next_step()` to loop back.
```

**Good (strict):**
```markdown
## Verification Steps

Execute ONLY the following steps, in order, exactly once:

1. [specific step 1]
2. [specific step 2]
3. [specific step 3]

Do NOT run additional commands. Do NOT take any other action. Do NOT interpret results beyond the pass/fail criteria below.

**If all steps pass:** Call `close_session()` exactly once. Stop.
**If any step fails:** Call `next_step()` exactly once. Stop. Do NOT attempt to fix anything here — that is the diagnose node's job.
```

### 5. Gate Nodes

**Bad (too soft):**
```markdown
Present the plan and ask for approval.
```

**Good (strict):**
```markdown
Present the complete summary to the user. Then stop and wait. Do NOT call `next_step()` until the user has provided an explicit approval or redirect response. Do NOT infer approval from silence or partial responses. When the user responds, call `next_step({ next: "chosen-branch-id" })` exactly once with the branch the user selected.
```

## Delegation

**Agent:** @QuickDoc
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/planning/plan-design-guidelines.md`
- Goal: Add a "Prompt Strictness Standards" section defining canonical language patterns for five node categories (Advance, Constraints, Loop, Verification, Gate) — with Bad/Good examples for each
- Constraints: Additive only; insert between "Planning Best-Practices" and "plan.json Schema Reference"; use exact section title `## Prompt Strictness Standards`; all examples in fenced `markdown` blocks
- Verify: Section exists in the file, contains all five categories, each with a Bad and Good example

## Advance

Call `next_step()` NOW. Do this exactly once. Do NOT read session files or DAG state to determine whether to advance. Do NOT take any other action before or after calling `next_step()`.
