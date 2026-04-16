---
name: planning-schema
description: Phase types, field schemas, and naming conventions for writing executable plans in TOML format.
---

## user-discussion
Engages the user in open-ended discussion. Linear — no branching.
```toml
[[phases]]
id = <phase-id>           # unique descriptive identifier (required)
type = "user-discussion"  # phase type (required)
next = [<child-id>]       # next phase ids (required) -- use [] for leaf/exit phases
topic = "..."             # discussion topic or goal (required)
```

## project-survey
Broadly surveys the codebase to understand structure, conventions, and relevant areas.
```toml
[[phases]]
id = <phase-id>           # unique descriptive identifier (required)
type = "project-survey"   # phase type (required)
next = [<child-id>]       # next phase ids (required) -- use [] for leaf/exit phases
topics = ["...", ...]     # survey topics (required)
```

## web-search
Researches external sources to answer specific questions before work begins.
```toml
[[phases]]
id = <phase-id>           # unique descriptive identifier (required)
type = "web-search"       # phase type (required)
next = [<child-id>]       # next phase ids (required) -- use [] for leaf/exit phases
questions = ["...", ...]  # research questions (required)
```

## deep-project-search-and-analysis
Investigates the codebase to answer specific questions before work begins.
```toml
[[phases]]
id = <phase-id>                            # unique descriptive identifier (required)
type = "deep-project-search-and-analysis"  # phase type (required)
next = [<child-id>]                        # next phase ids (required) -- use [] for leaf/exit phases
questions = ["...", ...]                   # research questions (required)
```

## user-decision-gate
Asks the user to choose between branches.
```toml
[[phases]]
id = <phase-id>                         # unique descriptive identifier (required)
type = "user-decision-gate"             # phase type (required)
next = [<branch-a>, <branch-b>, ...]    # branch phase ids (required) -- must have 2 or more
question = "..."                        # question to present to the user (required)
```

## agentic-decision-gate
Executor decides between branches based on evidence.
```toml
[[phases]]
id = <phase-id>                         # unique descriptive identifier (required)
type = "agentic-decision-gate"          # phase type (required)
next = [<branch-a>, <branch-b>, ...]    # branch phase ids (required) -- must have 2 or more
question = "..."                        # decision question for the executor to answer from evidence (required)
```

## project-setup
Runs shell operations and edits config or build system files.
```toml
[[phases]]
id = <phase-id>           # unique descriptive identifier (required)
type = "project-setup"    # phase type (required)
next = [<child-id>]       # next phase ids (required) -- use [] for leaf/exit phases
goals = ["...", ...]      # setup goals (required)
commit = false            # commit after setup (optional) -- default false
```

## work
Researches, implements, and verifies a goal. Includes automatic retries on failure.
```toml
[[phases]]
id = <phase-id>                            # unique descriptive identifier (required)
type = "work"                              # phase type (required)
next = [<child-id>]                        # next phase ids (required) -- use [] for leaf/exit phases
work-type = "code"                         # implementation type (required) -- "code" or "docs"
project-survey-topics = ["...", ...]       # codebase areas to survey before work (required)
deep-search-questions = ["...", ...]  # codebase questions to answer before work (required)
web-search-questions = ["...", ...]   # web research questions to answer before work (optional) -- required if work involves external dependencies
pre-work-project-setup = ["...", ...]      # setup to run before work (optional) -- delegates to tailwrench to setup dependencies, scaffolding, env config
goal = "..."                               # what to implement (required) -- implementation goal, this is what gets delegated to junior-dev or documentation-expert
verify-description = "..."                 # success criteria (required) -- ensures the work was completed successfully via tailwrench, includes compilation, running tests, visual checks, etc.
commit = false                             # commit after successful verify (optional) -- default false
```

## write-notes
Documents findings, decisions, and context. Use as a checkpoint or leaf.
```toml
[[phases]]
id = <phase-id>           # unique descriptive identifier (required)
type = "write-notes"      # phase type (required)
next = []                 # next phase ids (required) -- use [] for leaf/exit phases
context = "..."           # what to document (optional)
```

## early-exit
A valid planned stopping point. Documents context and hands off to a future session.
```toml
[[phases]]
id = <phase-id>           # unique descriptive identifier (required)
type = "early-exit"       # phase type (required)
next = []                 # always a leaf -- early-exit never continues
reason = "..."            # reason for stopping (optional)
```

