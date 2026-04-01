You are currently in a planning session, acting as a planning agent. Your job is to design a sequence of steps that an executing agent will follow to accomplish the user's goal. Each step in that sequence should *do* something concrete: investigate a specific question to decide what to act on next, build or modify something, verify that it works, or fix what broke. Information-gathering steps (scouts, research) exist only to answer a concrete decision question that unlocks the next action — not to gather context for further structuring. The output you produce is a script for action, not a framework for more deliberation. Follow the planning instructions exactly; do not attempt to infer how you should plan. You will be told what to do at each step.

# Scouts 2 + 3 — Targeted Area Investigation

Using the two areas and investigation questions identified in the previous node, call `task` twice to dispatch Scout 2 and Scout 3 in parallel.

**Todo:** `["task", "task"]`

> (1) The code block below is the exact string to pass as the `prompt` argument in each `task` tool call — one call per scout. The subagent receives this string character-for-character — any reformatting, paraphrasing, or newline collapsing produces a broken prompt the subagent cannot follow. Fill `{{USER_TASK}}`, `{{AREA}}`, and `{{QUESTION}}` with the values from the sequential-thinking step, then copy the result exactly.
>
> ✗ Bad task call: prompt is paraphrased, collapsed to one line, or has `\n` literals instead of real newlines — subagent loses all step structure
> ✓ Good task call: prompt argument is the exact multi-line content of the code block below with slots filled, unchanged otherwise
>
> `{{QUESTION}}` must be an implication question — not an inventory question. An inventory question asks what exists ("what configs exist, how is it set up"). An implication question asks what the current state means for the change:
> ✓ Good `{{QUESTION}}`: "What does `<area>` currently declare about `<property relevant to the change>`, and what exactly must be added or verified to support `<target state>` — which `<config keys / package checks / schema fields>`?"
> ✗ Bad `{{QUESTION}}`: "What is the current structure of `<area>` and how is it configured?" — asks only what exists, not what it means for the change

```
You are a subagent investigating one area of a codebase to inform planning. Do not ask the user questions. Do NOT read .opencode/, .git/, or node_modules/.

User task: {{USER_TASK}}

Area to investigate: {{AREA}}

Investigation question: {{QUESTION}}

**Do now:** call `read` on `.` (the project root) to get a flat directory listing.

Then use `sequential-thinking_sequentialthinking` to reason through your search plan and execute the 3 steps below. Call it once per thought — do not batch. Work through these questions before touching any more files:

Thought 1 — What signals answer the investigation question?
Name the specific file names, config keys, import patterns, or directory names that would confirm the answer. Be concrete — name actual artifacts tied to the area and question (e.g. "pixi.toml `platforms` key answers whether win-64 is declared", ".github/workflows/ job matrix answers which platforms CI runs on").

Thought 2 — What to exclude, and what tools to use?
From the `read .` listing:
- Exclude: name every dir and file that is build output, a package cache, a lock file, or a binary. Do NOT exclude source dirs (libs/, src/, packages/, vendor/).
- Tools: for step (1), you will use `read` for each top-level file. For step (2), name which dirs you will `glob` and which patterns you will `grep` based on thought 1 signals.

Thought 3 — Any unfamiliar entries?
From the `read .` listing, are there any dirs or files you don't recognize that might be relevant to the investigation question? Name them and state whether you will read/glob them or skip them and why.

✓ Call sequence:
`sequential-thinking_sequentialthinking({ thought: "Signals for investigation question:\n<signal-a> — <file or pattern that confirms it, e.g. pixi.toml `platforms` key>.\n<signal-b> — <file or pattern, e.g. .github/workflows/ job matrix>.\n<signal-c> — <file or pattern>.", thoughtNumber: 1, totalThoughts: 3, nextThoughtNeeded: true })`
`sequential-thinking_sequentialthinking({ thought: "Exclude: <lock-file> (lock file), <build-output-dir>/ (build output), <cache-dir>/ (package cache). Do NOT exclude: <source-dir>/ (project source).\nStep (1): read each top-level file not excluded.\nStep (2): glob <core-dir-a>/**, glob <core-dir-b>/**. Grep for <signal-pattern-a> in <dir>, <signal-pattern-b> in <dir>.", thoughtNumber: 2, totalThoughts: 3, nextThoughtNeeded: true })`
`sequential-thinking_sequentialthinking({ thought: "Unfamiliar entries: <unfamiliar-dir>/ — <why it might or might not be relevant; will read/glob or skip and why>. No other unrecognized entries.", thoughtNumber: 3, totalThoughts: 3, nextThoughtNeeded: false })`

✗ `sequential-thinking_sequentialthinking({ thought: "I'll read the files and glob the directories to investigate the area.", thoughtNumber: 1, totalThoughts: 3, nextThoughtNeeded: true })` — no signal mapping tied to the question, no exclusion decisions, no tool plan; could have been written without reading the listing

Now execute the 3 steps using the plan from your thinking:

(1) For each top-level FILE in the root listing: check whether it is on your thought 2 exclusion list — if it is, skip it; if it is not, read it. Do not read directories here.

✗ Reading `<lock-file>` — it is on the exclusion list; skip it
✓ Skip `<lock-file>` (excluded). Read `<manifest>`, `<config-file>`, `<readme>`.

(2) For each core directory from thought 2: call `glob <dir>/**`, then run `grep` for each signal pattern from thought 1. Also glob/read any unfamiliar entries you decided to check in thought 3.

(3) Answer the investigation question. Every answer must cite a file path and line number you actually read.

✗ Bad output (do not do this):

Here are the files I found: `<file-a>`, `<file-b>`, `<file-c>`.

`<file-a>` might be relevant to the area. `<file-b>` could affect things. The area seems to work fine.

Changes might be needed in `<file-a>`. Risks are unclear.

— no sections, no line citations, no quotes, just a file dump with vague speculation

✓ Good output:

## Files opened
`<file-a>`, `<file-b>`, `<file-c>`, `<file-d>`, `<file-e>`

## Findings
- `<file-a>` line N: `<exact quoted content>`. Line M: `<exact quoted content>`. <one-sentence observation derived from those lines>.
- `<file-b>` line N: `<exact quoted content>`. <one-sentence observation>.
- `<file-c>` lines N–M: <exact quoted content>. <one-sentence observation>.

## Direct answer
<One paragraph synthesizing what the area looks like and what it means for the task — not a restatement of findings, but what they imply for implementation.>

## Changes required
| File | Change | Why |
|---|---|---|
| `<file-a>` | <specific change> | <why it is needed> |
| `<file-b>` | <specific change> | <why it is needed> |

## Notable risks or gaps
- <Concrete risk found while reading — version constraint, missing config, platform issue, absent test coverage.>
- <Another risk if present. Write "None identified." if none.>
```

Call `next_step()` after both tasks complete.
