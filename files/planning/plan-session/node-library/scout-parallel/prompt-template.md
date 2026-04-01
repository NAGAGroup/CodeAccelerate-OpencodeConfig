You are currently executing a plan, acting as an executing agent. Your job is to carry out the instructions in this prompt exactly as written — no more, no less. Each prompt in this session will tell you exactly what to do. Do not scout the codebase, read files, or research topics unless this prompt instructs you to. Do not plan ahead or deliberate about future steps — focus only on what is in front of you. Follow the instructions exactly; the system will tell you what comes next.

# Codebase Exploration — scout-parallel

Dispatch two @ContextScout agents in parallel to investigate two areas of the codebase.

**Todo:** `["task", "task"]`

## Zone 1 — Fixed execution spec

1. Dispatch two @ContextScout subagents in a single response turn — one per template below
2. Fill all `{{SCOUT_N_*}}` slots, then use each template verbatim as that scout's `prompt` field

**Scout 1 template:**
```
You are a subagent investigating one area of a codebase. Do not ask the user questions. Do NOT read .opencode/, .git/, or node_modules/.

Area to investigate: {{SCOUT_1_AREA}}

Investigation question: {{SCOUT_1_QUESTION}}

Answer the investigation question above with file:line citations from what you actually read. Do not answer from memory.

To answer you MUST follow these steps in order:

(1) Use `read` on `.` (the project root) to get a flat directory listing.
(2) Read the contents of every top-level file relevant to the area — manifests, lock files, config files, READMEs, dotfiles. Do not skip a file because you assume you know what it contains.
(3) From the step (1) listing, identify the core project directories — source dirs, test dirs, CI dirs, config dirs. Exclude generated/build output and package cache dirs.

✓ Core: `<source-dir>/`, `<test-dir>/`, `<ci-dir>/`, `<config-dir>/` — structural, serve the project directly
✗ Not core: `<build-output-dir>/`, `<package-cache-dir>/` — generated or fetched content, not project source

(4) For each core directory identified in step (3), run `glob <dir>/**` to list its contents. Do NOT glob `.` or `*` or `**/*` from the project root.

(5) Identify grep patterns that would surface files relevant to the investigation question (e.g. config keys, import statements, markers specific to the area). For each core directory from step (3), run `grep "<pattern>" <dir>` for each pattern. Do NOT grep `.` directly.

✗ Bad grep: `grep "<keyword>" .` — searches root, hits excluded dirs, too broad
✓ Good grep: `grep "<area-specific-pattern>" <dir-a>`, `grep "<config-key>" <dir-b>` — one pattern per discovery need, one named dir per call

(6) Read the contents of files discovered in steps (4) and (5) that are relevant to the investigation question.

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

Answer the investigation question above with file:line citations from what you actually read. Do not answer from memory.

To answer you MUST follow these steps in order:

(1) Use `read` on `.` (the project root) to get a flat directory listing.
(2) Read the contents of every top-level file relevant to the area — manifests, lock files, config files, READMEs, dotfiles. Do not skip a file because you assume you know what it contains.
(3) From the step (1) listing, identify the core project directories — source dirs, test dirs, CI dirs, config dirs. Exclude generated/build output and package cache dirs.

✓ Core: `<source-dir>/`, `<test-dir>/`, `<ci-dir>/`, `<config-dir>/` — structural, serve the project directly
✗ Not core: `<build-output-dir>/`, `<package-cache-dir>/` — generated or fetched content, not project source

(4) For each core directory identified in step (3), run `glob <dir>/**` to list its contents. Do NOT glob `.` or `*` or `**/*` from the project root.

(5) Identify grep patterns that would surface files relevant to the investigation question (e.g. config keys, import statements, markers specific to the area). For each core directory from step (3), run `grep "<pattern>" <dir>` for each pattern. Do NOT grep `.` directly.

✗ Bad grep: `grep "<keyword>" .` — searches root, hits excluded dirs, too broad
✓ Good grep: `grep "<area-specific-pattern>" <dir-a>`, `grep "<config-key>" <dir-b>` — one pattern per discovery need, one named dir per call

(6) Read the contents of files discovered in steps (4) and (5) that are relevant to the investigation question.

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
