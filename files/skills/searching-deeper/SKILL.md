---
name: searching-deeper
description: Teaches how to use glob, grep, and read alongside grepai for deep, exhaustive investigation of specific code areas.
---
<rules>
Always start with grepai — never skip straight to glob or grep. grepai finds what you don't know to look for; glob and grep find what you already know to look for.
Always run multiple varied grepai queries — vary the angle, scope, and path.
Always use trace tools when investigating a specific function or symbol — they reveal relationships that semantic searches miss.
Use glob and grep to verify and expand on grepai findings, not as a substitute.
Never guess file paths — use Read only after grepai or glob/grep has identified the file.
</rules>

<workflow>
Phase 1 — Semantic discovery (grepai):
  grepai status  // check index health first
  grepai search "[describe what the code does]" --toon --compact  // broad orientation
  grepai search "[more specific angle]" --path [relevant-dir] --toon --compact  // focused
  grepai search "[another angle]" --path [relevant-dir] --toon --limit 5  // vary approach

Phase 2 — Relationship tracing (once you have a symbol):
  grepai trace callers "[FunctionName]" --json  // who calls this?
  grepai trace callees "[FunctionName]" --json  // what does this depend on?
  grepai trace graph "[FunctionName]" --depth 2 --json  // full call graph

Phase 3 — Precision targeting (glob/grep):
  Glob(pattern="**/*.ts")  // find files by name pattern
  Grep(pattern="[exact string or regex]", include="*.ts")  // find exact strings

Phase 4 — Full context (read):
  Read(filePath="[path identified above]")  // read full file for context
</workflow>
