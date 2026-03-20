# Commands

Commands are invoked inside an active OpenCode session by typing `/command-name` in the chat input. Arguments, if accepted, are passed as free text after the command name — e.g. `/plan-generic refactor the auth module to use JWT`.

---

## Reference

### `/plan-generic [description]`

Starts a generic planning session — context analysis, Q&A, subtask decomposition, and finalization.

Pass a brief description of the feature, refactor, or migration you want to plan. If you omit the argument, the session will start and prompt you for a topic.

**Example:**
```
/plan-generic add pagination to the user listing API
```

---

### `/plan-debug [bug description]`

Starts a debug planning session — bug intake, context gathering, hypothesis formation, and session plan creation.

Pass a description of the bug or the context you already have. The workflow guides the agent through a structured investigation and produces a session plan.

**Example:**
```
/plan-debug users are seeing a 500 on checkout when the cart has a discount code
```

---

### `/plan-collaborative [rough idea]`

Starts a collaborative planning session — iterative, open-ended exploration from a rough idea to a detailed spec.

Use this when the problem is not yet well-defined and you want to think it through interactively before committing to a plan.

**Example:**
```
/plan-collaborative explore options for moving our background jobs to a queue system
```

---

### `/activate-plan [plan-name]`

Activates an execution plan that was produced by a previous planning session.

If a plan name is provided, it is activated immediately. If no argument is given, the agent scans `.opencode/session-plans/` for available plans, displays them with their goals and statuses, and asks you to choose one.

**Example:**
```
/activate-plan refactor-auth-module
```

Or with no argument to browse available plans:
```
/activate-plan
```

---

## Notes

- All planning commands (`plan-generic`, `plan-debug`, `plan-collaborative`) produce a saved plan in `.opencode/session-plans/` that can later be resumed with `/activate-plan`.
- Commands that accept arguments treat everything after the command name as the argument — no flags or structured syntax required.
- See [planning.md](planning.md) for a fuller explanation of what each planning mode does and when to use which.
