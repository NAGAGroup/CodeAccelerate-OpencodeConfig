# scout-parallel Node Type

## When to use

Use this node type when you need targeted investigation of two specific areas of the codebase before acting — to understand what the task will need to change, what constraints exist, and what the implementation must account for.

Each scout investigates one conceptual area independently. The planning agent specifies the area and a focused investigation question; the scout self-directs its file discovery from there.

**Do NOT use scout-parallel if:**
- You need a broad orientation pass across the whole project (use `scout` + `scout-parallel` in sequence instead)
- The task requires deep multi-file analysis with synthesis across systems (use `analyze-deep` instead)
- You need execution-time context that only appears after prior steps complete

**Typical scenario:** Second scouting step after `scout` (project orientation). Precedes `analyze-deep`, `parallel-tasks`, or other action nodes.

## What the planning agent must resolve

Before writing this node, determine:

### For each scout (Scout 1 and Scout 2)

**Area:** The conceptual area to investigate — name the area, not a file.
- ✓ Good: `"build system"`, `"CI/CD pipeline"`, `"auth/security surface"`, `"deployment config"`
- ✗ Bad: `"pixi.toml"` — that's a file, not an area; the scout discovers which files belong to the area

**Investigation question:** What would a planner need to know about this area to design the implementation steps?
- ✓ Good: `"What system manages dependencies and platform targeting, and how is it configured?"`
- ✓ Good: `"Does any authentication mechanism already exist, and if so, how is it structured?"`
- ✗ Bad: `"Find auth files"` — not a planning question; scouts return findings that unlock decisions

**How scouts discover files:** Each scout traverses the full directory tree, enumerates every file it finds, casts a wide net over plausible candidates, then reads them to confirm relevance. The planning agent does NOT pre-specify file paths — the scout determines which files are relevant by reading them.

## Must-resolve checklist (planning agent)

Before writing the node prompt, confirm:

- [ ] **Scout 1 area named** — a conceptual area, not a file path or glob
- [ ] **Scout 1 question written** — a specific planning question that the scout's findings will answer
- [ ] **Scout 2 area named** — a different conceptual area from Scout 1
- [ ] **Scout 2 question written** — a specific planning question
- [ ] **Todo array matches scout count** — `["task", "task"]` for 2 scouts; add `"task"` for each additional scout
- [ ] **Downstream consumer identified** — which node receives these findings and what does it need?

## Failure modes

### Failure mode 1: Area named as a file

**Mechanism:** Planning agent writes `{{SCOUT_1_AREA}} = "pixi.toml"`. The scout reads only that one file, misses every other file in that area, and returns narrow findings that don't cover the full picture.

**Fix:** Name the conceptual area: `"dependency management"` or `"build system"`. The scout will then traverse the codebase and discover all relevant files for that area on its own.

### Failure mode 2: Investigation question is not a planning question

**Mechanism:** Planning agent writes `{{SCOUT_1_QUESTION}} = "What files exist in the build directory?"`. Scout returns a file listing instead of findings that unlock a specific planning decision.

**Fix:** Rewrite as a question whose answer changes what steps appear in the plan: `"What build system controls compilation, and does it have platform-specific configuration that win-64 support would need to extend?"`

### Failure mode 3: Todo array count mismatch

**Mechanism:** Planning agent fills 2 scout sections but leaves todo array as `["task", "task", "task"]`. Plugin advances after 2 tasks; the 3rd task is never called, leaving a blind spot.

**Fix:** Count how many scout sections your plan needs. Todo array length must equal the number of scout sections written in the prompt.

### Failure mode 4: No downstream consumer specified

**Mechanism:** Scout findings come back but HW doesn't know what the next node needs, so it compresses generically. Downstream steps have no actionable context.

**Fix:** In the checklist, explicitly name the next node and what it needs: `"Findings feed analyze-deep — must return exact file paths and specific config values, not summaries."`

## Scope restrictions

- Do NOT send scouts into `.opencode/` — session directories contain stale planning artifacts
- Exception: planning infrastructure files are permitted if explicitly required (e.g., `.opencode/session-plans/.../node-library/`)

## Customization

To use 3 scouts, add a third `"task"` to the todo array and a Scout 3 section to the prompt template (copy the Scout 2 template block, change all `SCOUT_2` to `SCOUT_3`, fill the slots).

To use 1 scout, reduce to `["task"]` and remove the Scout 2 section.
