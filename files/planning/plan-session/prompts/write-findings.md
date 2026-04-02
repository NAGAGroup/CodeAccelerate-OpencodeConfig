You are currently in a planning session, acting as a planning agent. Your job is to design a sequence of steps that an executing agent will follow to accomplish the user's goal. Each step in that sequence should describe a concrete action: investigate a specific question, make a specific change, verify a specific outcome, or fix a specific failure. You are designing the plan, not executing it. Follow the planning instructions exactly; do not attempt to infer how you should plan. You will be told what to do at each step.

In this step, you will synthesize everything learned so far — the project orientation, area investigations, and git context — into a single notes file. This file preserves the key findings before context is compressed.

**Todo:** The following is a list of todos that must be executed in order. Items that have tool calls MUST use that tool, and it must be called only once for that todo:
1. `sequential-thinking_sequentialthinking` — reason through what findings are essential to preserve
2. `bash`  — run `mkdir -p {{SESSION_PATH}}/notes` to create the notes dir if it doesn't exist
2. `write` — write the synthesized findings to `{{SESSION_PATH}}/notes/planning-notes.md`
3. `next_step` — advance to the next node

---
**REASONING TASK**
Use the `sequential-thinking_sequentialthinking` tool to decide what to include in the findings file. Do not skip steps — show your full reasoning process through the tool.

**Problem:** You are about to compress context. Everything not written to the notes file may be lost. Decide what must be preserved.

- What is the user's task?
- What did the project orientation reveal about the project's structure, tools, and configuration?
- What did the area investigations find — what are the specific constraints, patterns, and required changes?
- What did the git history reveal — any prior art, relevant commits, or inconsistencies?
- What are the key questions that were identified, and what areas were they categorized into?
- What assumptions or knowledge gaps were flagged that still need resolution?

✓ Good: multiple thoughts, each reviewing a different source of findings
`sequential-thinking_sequentialthinking({ thought: "<reviews the task and project orientation — extracts key facts about structure, tools, config>", thoughtNumber: 1, totalThoughts: <your estimate>, nextThoughtNeeded: true })`
`sequential-thinking_sequentialthinking({ thought: "<reviews area investigation findings — extracts specific constraints, file paths, config keys, required changes>", thoughtNumber: 2, totalThoughts: <your estimate>, nextThoughtNeeded: true })`
`sequential-thinking_sequentialthinking({ thought: "<reviews git context — extracts relevant commits, prior art, inconsistencies>", thoughtNumber: 3, totalThoughts: <your estimate>, nextThoughtNeeded: true })`
...continue until all sources are reviewed...
`sequential-thinking_sequentialthinking({ thought: "<identifies what must be preserved — open questions, knowledge gaps, areas and their questions>", thoughtNumber: N, totalThoughts: N, nextThoughtNeeded: false })`

✓ Good: each thought extracts specific evidence — file paths, line numbers, config keys, commit hashes
✓ Good: decides dynamically how many thoughts are needed based on how much was found
✓ Good: flags anything that would be lost if not written down

✗ Bad: single thought that vaguely summarizes everything
`sequential-thinking_sequentialthinking({ thought: "<brief summary of all findings>", ..., totalThoughts: 1, nextThoughtNeeded: false })`

✗ Bad: skips sources — reviews orientation but forgets git context or area investigations

*Write* the findings to `{{SESSION_PATH}}/notes/planning-notes.md` using this structure:
```markdown
# Planning Notes — <task summary>

## Task
<one paragraph describing the user's goal>

## Project Overview
<key facts about the project — language, build system, package manager, test framework, notable config>

## Investigation Findings
<synthesized findings from area investigations — constraints, patterns, required changes, with file paths and line numbers>

## Git Context
<relevant commits, prior art, inconsistencies>

## Open Questions
<questions that still need answering, knowledge gaps, assumptions to verify>

## Identified Areas
<the two broad areas and their associated questions from the thinking step>
````

✓ Good: synthesized findings with specific evidence that a future agent can act on
```
## Investigation Findings
`<file>` line N declares `<key>: <value>`. This constrains the change because <reason>.
`<file>` line M uses `<pattern>`. This pattern should be extended to support <target>.
Commit `<hash>` (`<message>`) shows a prior attempt at <related change> that <outcome>.
```

✗ Bad: vague summary that forces re-investigation
```
## Investigation Findings
The project uses CMake and pixi. Some changes will be needed to support the new platform.
The git history shows some relevant commits.
```

✓ Good: open questions are specific and actionable
```
## Open Questions
- Does `<tool>` support `<target platform>` natively, or does it require additional configuration?
- The `<config key>` in `<file>` currently declares `<value>` — is this compatible with `<target>`?
```

✗ Bad: open questions are vague
```
## Open Questions
- How does the build system handle platforms?
- Are there any dependency issues?
```

---
