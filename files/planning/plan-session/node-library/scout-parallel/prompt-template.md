You are currently executing a plan, acting as an executing agent. Your job is to carry out the instructions in this prompt exactly as written — no more, no less. Each prompt in this session will tell you exactly what to do. Do not scout the codebase, read files, or research topics unless this prompt instructs you to. Do not plan ahead or deliberate about future steps — focus only on what is in front of you. Follow the instructions exactly; the system will tell you what comes next.

# Codebase Exploration — scout-parallel

Dispatch two @ContextScout agents in parallel to investigate two areas of the codebase.

**Todo:** `["task", "task"]`

## Zone 1 — Fixed execution spec

1. Dispatch two @ContextScout subagents in a single response turn — one per template below
2. Fill all `{{SCOUT_N_*}}` slots, then pass the result as that scout's `prompt` argument

The code block for each template is the exact string to pass as `prompt`. The subagent receives it character-for-character — reformatting, paraphrasing, or collapsing newlines produces a broken prompt the subagent cannot follow.

✗ Bad task call: prompt is paraphrased, collapsed to one line, or has `\n` literals instead of real newlines — subagent loses all step structure
✓ Good task call: prompt argument is the exact multi-line template content with slots filled, unchanged otherwise

**Scout 1 template:**
```
You are a subagent investigating one area of a codebase. Do not ask the user questions. Do NOT read .opencode/, .git/, or node_modules/.

Area to investigate: {{SCOUT_1_AREA}}

Investigation question: {{SCOUT_1_QUESTION}}

First, call `todowrite` to create a todo list for all 7 steps below — mark each as pending. This keeps your work queue visible as you proceed. Complete each todo in order and mark it done when finished.

✗ Bad todowrite: skips steps, collapses multiple steps into one, or omits the todowrite call entirely
✓ Good todowrite: one todo per step, all 7 steps listed, all marked pending

Complete all 7 steps below in order. The step (2), (4), and (6) write-outs are required mid-step checkpoints — write them, then continue to the next step. Do not write your final answer until all 7 steps are complete. Every answer must cite file:line from what you actually read — not from memory.

(1) Use `read` on `.` (the project root) to get a flat directory listing.
(2) From the step (1) listing, identify directories AND files to exclude before reading or globbing anything. These are generated/build output dirs, package cache dirs, lock files, and binary files — you will not read or glob them in any later step.

✗ Do NOT exclude: `libs/`, `src/`, `packages/`, `vendor/` — these are source dirs owned by the project; read and glob them normally
✓ Exclude dirs: `<build-output-dir>/`, `<package-cache-dir>/` — generated or fetched content, not project source
✓ Exclude files: `<lock-file>`, `<binary-file>` — machine-generated or non-text

Write your exclusion list before continuing to step (3):
- Excluded dirs: <list every dir you are excluding>
- Excluded files: <list every file you are excluding>

(3) Read the contents of every top-level FILE not excluded in step (2) — manifests, config files, READMEs, dotfiles. Do not read directories here; directories are handled in steps (4) and (5). Do not skip a file because you assume you know what it contains.
(4) From the step (1) listing, identify the core project directories — source dirs, test dirs, CI dirs, config dirs. Do not include any directory already excluded in step (2).

✓ Core: `<source-dir>/`, `<test-dir>/`, `<ci-dir>/`, `<config-dir>/` — structural, serve the project directly
✗ Not core: already in the step (2) exclude list

Write your core directory list before continuing to step (5):
- Core dirs: <list every dir you will glob>

(5) For each core directory identified in step (4), call the `glob` tool with pattern `<dir>/**` — this is a real tool call, not a mental description. Do NOT glob `.` or `*` or `**/*` from the project root.

(6) Identify grep patterns that would surface files relevant to the investigation question (e.g. config keys, import statements, markers specific to the area).

Write your grep patterns before running them:
- Pattern `<pattern>` → dirs: <list of dirs to grep>
- Pattern `<pattern>` → dirs: <list of dirs to grep>

Then for each core directory from step (4), run `grep "<pattern>" <dir>` for each pattern. Do NOT grep `.` directly.

✗ Bad grep: `grep "<keyword>" .` — searches root, hits excluded dirs, too broad
✓ Good grep: `grep "<area-specific-pattern>" <dir-a>`, `grep "<config-key>" <dir-b>` — one pattern per discovery need, one named dir per call

(7) Read the contents of files discovered in steps (5) and (6) that are relevant to the investigation question.

✗ Bad output (do not do this):

Here are the files I found: `<file-a>`, `<file-b>`, `<file-c>`.

`<file-a>` might be relevant to the area. `<file-b>` could affect things. The area seems to work fine.

— no sections, no line citations, no quotes, just a file dump with vague speculation

✓ Good output:

## Files opened
`<file-a>`, `<file-b>`, `<file-c>`, `<file-d>`, `<file-e>`

## Findings
- `<file-a>` line N: `<exact quoted content>`. Line M: `<exact quoted content>`. <one-sentence observation derived from those lines>.
- `<file-b>` line N: `<exact quoted content>`. <one-sentence observation>.

## Direct answer
<One paragraph synthesizing what the area looks like and what it means for the task — not a restatement of findings, but what they imply for implementation.>

## Changes required
| File | Change | Why |
|---|---|---|
| `<file-a>` | <specific change> | <why it is needed> |

## Notable risks or gaps
- <Concrete risk found while reading — version constraint, missing config, platform issue, absent test coverage.>

**Outcome:** PASS — findings above. FAIL if unable to read files.
```

**Scout 2 template:**
```
You are a subagent investigating one area of a codebase. Do not ask the user questions. Do NOT read .opencode/, .git/, or node_modules/.

Area to investigate: {{SCOUT_2_AREA}}

Investigation question: {{SCOUT_2_QUESTION}}

First, call `todowrite` to create a todo list for all 7 steps below — mark each as pending. This keeps your work queue visible as you proceed. Complete each todo in order and mark it done when finished.

✗ Bad todowrite: skips steps, collapses multiple steps into one, or omits the todowrite call entirely
✓ Good todowrite: one todo per step, all 7 steps listed, all marked pending

Complete all 7 steps below in order. The step (2), (4), and (6) write-outs are required mid-step checkpoints — write them, then continue to the next step. Do not write your final answer until all 7 steps are complete. Every answer must cite file:line from what you actually read — not from memory.

(1) Use `read` on `.` (the project root) to get a flat directory listing.
(2) From the step (1) listing, identify directories AND files to exclude before reading or globbing anything. These are generated/build output dirs, package cache dirs, lock files, and binary files — you will not read or glob them in any later step.

✗ Do NOT exclude: `libs/`, `src/`, `packages/`, `vendor/` — these are source dirs owned by the project; read and glob them normally
✓ Exclude dirs: `<build-output-dir>/`, `<package-cache-dir>/` — generated or fetched content, not project source
✓ Exclude files: `<lock-file>`, `<binary-file>` — machine-generated or non-text

Write your exclusion list before continuing to step (3):
- Excluded dirs: <list every dir you are excluding>
- Excluded files: <list every file you are excluding>

(3) Read the contents of every top-level FILE not excluded in step (2) — manifests, config files, READMEs, dotfiles. Do not read directories here; directories are handled in steps (4) and (5). Do not skip a file because you assume you know what it contains.
(4) From the step (1) listing, identify the core project directories — source dirs, test dirs, CI dirs, config dirs. Do not include any directory already excluded in step (2).

✓ Core: `<source-dir>/`, `<test-dir>/`, `<ci-dir>/`, `<config-dir>/` — structural, serve the project directly
✗ Not core: already in the step (2) exclude list

Write your core directory list before continuing to step (5):
- Core dirs: <list every dir you will glob>

(5) For each core directory identified in step (4), call the `glob` tool with pattern `<dir>/**` — this is a real tool call, not a mental description. Do NOT glob `.` or `*` or `**/*` from the project root.

(6) Identify grep patterns that would surface files relevant to the investigation question (e.g. config keys, import statements, markers specific to the area).

Write your grep patterns before running them:
- Pattern `<pattern>` → dirs: <list of dirs to grep>
- Pattern `<pattern>` → dirs: <list of dirs to grep>

Then for each core directory from step (4), run `grep "<pattern>" <dir>` for each pattern. Do NOT grep `.` directly.

✗ Bad grep: `grep "<keyword>" .` — searches root, hits excluded dirs, too broad
✓ Good grep: `grep "<area-specific-pattern>" <dir-a>`, `grep "<config-key>" <dir-b>` — one pattern per discovery need, one named dir per call

(7) Read the contents of files discovered in steps (5) and (6) that are relevant to the investigation question.

✗ Bad output (do not do this):

Here are the files I found: `<file-a>`, `<file-b>`, `<file-c>`.

`<file-a>` might be relevant to the area. `<file-b>` could affect things. The area seems to work fine.

— no sections, no line citations, no quotes, just a file dump with vague speculation

✓ Good output:

## Files opened
`<file-a>`, `<file-b>`, `<file-c>`, `<file-d>`, `<file-e>`

## Findings
- `<file-a>` line N: `<exact quoted content>`. Line M: `<exact quoted content>`. <one-sentence observation derived from those lines>.
- `<file-b>` line N: `<exact quoted content>`. <one-sentence observation>.

## Direct answer
<One paragraph synthesizing what the area looks like and what it means for the task — not a restatement of findings, but what they imply for implementation.>

## Changes required
| File | Change | Why |
|---|---|---|
| `<file-a>` | <specific change> | <why it is needed> |

## Notable risks or gaps
- <Concrete risk found while reading — version constraint, missing config, platform issue, absent test coverage.>

**Outcome:** PASS — findings above. FAIL if unable to read files.
```

## Zone 2 — Planning agent fills

**{{SCOUT_1_AREA}}**
The conceptual area Scout 1 investigates (e.g., "build system", "auth/security surface", "deployment config").
✓ Good: `"dependency management"`
✗ Bad: `"pixi.toml"` — name the area, not a specific file

**{{SCOUT_1_QUESTION}}**
An implication question: what does the current state of this area constrain or enable for the specific change? Not an inventory question.
✓ Good: `"What does <area> currently declare about <property relevant to the change>, and what exactly must be added or verified to support <target state> — which <config keys / schema fields / availability checks>?"`
✗ Bad: `"What <area> files does this project use?"` — asks only what exists; does not ask what constraint it imposes or what change is needed

**{{SCOUT_2_AREA}}**
The conceptual area Scout 2 investigates.
✓ Good: `"CI/CD pipeline"`
✗ Bad: `".github/workflows/"` — name the area, not a path

**{{SCOUT_2_QUESTION}}**
An implication question: what does the current state of this area constrain or enable for the specific change? Not an inventory question.
✓ Good: `"What does <area> currently run on, and what exactly must be added to extend that to <target state> — which <matrix entries / runner images / environment steps>?"`
✗ Bad: `"What <area> files exist in the project?"` — asks only what exists; does not ask what must change

## Zone 3 — Fixed constraints

Do not read `.opencode/`. Each scout is independent — they run in parallel and do not share context. Return specific findings with file:line citations — not thematic summaries or generic section headers like "Codebase Overview" or "Key Decisions".
