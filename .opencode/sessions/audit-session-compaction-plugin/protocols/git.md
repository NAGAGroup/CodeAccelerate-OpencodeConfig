# Protocol: Git

## Branch
Work directly on the current branch. No feature branch needed for this session — it is a fix to a single plugin file.

If you prefer isolation:
```bash
git checkout -b fix/session-compaction-plugin
```

## WIP commits (during subtasks)
Use during checkpoint protocol after each subtask:
```
wip: subtask-01 audit findings written
wip: subtask-02 path constants fixed (opencode/ not .opencode/)
wip: subtask-03 hook updated — spec.json + current subtask injected, path annotation fixed
wip: subtask-04 relay key invariant fixed, 30s cleanup timeout added
```

Format: `wip: subtask-NN <concise description>`

## Final commit (after integration test passes)
```
fix(plugin): correct session path detection and compaction relay

- Fix sessionsDir: .opencode/sessions → opencode/sessions (wrong dir segment)
- Fix contextDir: same correction
- Inject spec.json and current subtask file into compaction context
- Fix path annotation in injected session header
- Verify and fix async relay key: context.sessionID ↔ session.idle event payload
- Add 30s cleanup timeout for stale pending compaction entries
- Wrap compaction hook in try/catch for startup safety
```

## Rules
- Never force-push
- Never amend a commit that has been pushed
- Never skip pre-commit hooks
- Do not commit `node_modules/`
- Do not commit secrets (`.env`, API keys)

## Diff review (before integration test gate)
Before subtask-05, run:
```bash
git diff HEAD opencode/plugins/session-compaction.ts
```
Show this diff to the user for the `[🚫 GATE]` approval.
