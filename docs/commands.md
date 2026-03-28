# Commands

Commands are invoked inside an active OpenCode session by typing `/command-name` in the chat input. Arguments, if accepted, are passed as free text after the command name — e.g. `/plan-generic refactor the auth module to use JWT`.

---

## Reference

### `/plan-generic [description]`

**What it does:**  
Starts a structured planning session that analyzes your codebase, breaks down your task into actionable subtasks, and produces a step-by-step execution plan.

**When to use it:**  
Use this command to plan a feature, refactor, bug fix, migration, or any significant development work. The session performs context analysis, explores implementation options, and decomposes the work into parallel and sequential tasks where appropriate.

**What it produces:**  
A saved execution plan file in `.opencode/session-plans/` that can be activated later with `/activate-plan`. The plan is a directed acyclic graph (DAG) of nodes, each representing a task, decision, or verification step. Plans are designed to run autonomously or semi-autonomously depending on user preferences.

**Example:**
```
/plan-generic add pagination to the user listing API
```

Or without an argument to let the agent prompt you:
```
/plan-generic
```

---

### `/activate-plan [plan-name]`

**What it does:**  
Activates and executes a previously generated execution plan.

**When to use it:**  
After you've created a plan with `/plan-generic`, use this command to begin executing it. You can resume an existing plan at any time, picking up where you left off or restarting it from the beginning.

**What it produces:**  
Begins execution of the named plan's DAG, progressing through tasks, decision gates, and verification steps according to the plan structure. The agent tracks progress, asks for approvals at gates, and reports results as tasks complete.

**Examples:**

With a plan name (immediate activation):
```
/activate-plan refactor-auth-module
```

Without an argument to browse available plans:
```
/activate-plan
```

The agent will scan `.opencode/session-plans/`, display saved plans with their goals and statuses, and prompt you to choose one.

---

## Notes

- All planning commands produce saved plans in `.opencode/session-plans/` that persist across sessions.
- Commands that accept arguments treat everything after the command name as the argument — no flags or structured syntax required.
- See [planning.md](planning.md) for a deeper explanation of the planning system and how DAGs work.
