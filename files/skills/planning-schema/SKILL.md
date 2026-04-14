---
name: planning-schema
description: Phase types, field schemas, and naming conventions for writing executable plans in TOML format.
---
<rules>
Never put multiple distinct outcomes in a single work phase — split them.
Always make every leaf a write-notes or early-exit phase.
Never use a decision gate to inform a later phase — branches must split immediately from the gate.
Every branching phase (agentic-decision-gate, user-decision-gate) must have at least 2 direct child phases.
</rules>

## external-research
Researches external sources to answer specific questions before work begins.
```toml
[[phases]]
id = "phase-id"           # unique descriptive identifier (required)
type = "external-research" # phase type (required)
from = ["parent-id"]      # parent phase ids (optional) -- omit for entry phase
questions = ["...", ...]  # research questions (required)
```

## internal-research
Investigates the codebase to answer specific questions before work begins.
```toml
[[phases]]
id = "phase-id"           # unique descriptive identifier (required)
type = "internal-research" # phase type (required)
from = ["parent-id"]      # parent phase ids (optional) -- omit for entry phase
questions = ["...", ...]  # research questions (required)
```

## project-survey
Broadly surveys the codebase to understand structure, conventions, and relevant areas.
```toml
[[phases]]
id = "phase-id"           # unique descriptive identifier (required)
type = "project-survey"   # phase type (required)
from = ["parent-id"]      # parent phase ids (optional) -- omit for entry phase
topics = ["...", ...]     # survey topics (required)
```

## work
Researches, implements, and verifies a goal. Includes automatic retries on failure.
```toml
[[phases]]
id = "phase-id"                            # unique descriptive identifier (required)
type = "work"                              # phase type (required)
from = ["parent-id"]                       # parent phase ids (optional) -- omit for entry phase
goal = "..."                               # what to implement (required)
work-type = "code"                         # implementation type (required) -- "code" or "docs"
verify-description = "..."                 # success criteria (required)
project-survey-topics = ["...", ...]       # codebase areas to survey before work (required)
internal-research-questions = ["...", ...] # codebase questions to answer before work (required)
external-research-questions = ["...", ...] # external questions to answer before work (optional) -- required if work involves external dependencies
pre-work-project-setup = ["...", ...]      # setup to run before work (optional) -- dependencies, scaffolding, env config
commit = false                             # commit after successful verify (optional) -- default false
```

## project-setup
Runs shell operations and edits config or build system files.
```toml
[[phases]]
id = "phase-id"           # unique descriptive identifier (required)
type = "project-setup"    # phase type (required)
from = ["parent-id"]      # parent phase ids (optional) -- omit for entry phase
goals = ["...", ...]      # setup goals (required)
commit = false            # commit after setup (optional) -- default false
```

## user-discussion
Engages the user in open-ended discussion. Linear — no branching.
```toml
[[phases]]
id = "phase-id"           # unique descriptive identifier (required)
type = "user-discussion"  # phase type (required)
from = ["parent-id"]      # parent phase ids (optional) -- omit for entry phase
topic = "..."             # discussion topic or goal (required)
```

## user-decision-gate
Asks the user to choose between branches.
```toml
[[phases]]
id = "phase-id"              # unique descriptive identifier (required)
type = "user-decision-gate"  # phase type (required)
from = ["parent-id"]         # parent phase ids (optional) -- omit for entry phase
question = "..."             # question to present to the user (required)
```

## agentic-decision-gate
Executor decides between branches based on evidence.
```toml
[[phases]]
id = "phase-id"                 # unique descriptive identifier (required)
type = "agentic-decision-gate"  # phase type (required)
from = ["parent-id"]            # parent phase ids (optional) -- omit for entry phase
question = "..."                # decision question for the executor to answer from evidence (required)
```

## write-notes
Documents findings, decisions, and context. Use as a checkpoint or leaf.
```toml
[[phases]]
id = "phase-id"           # unique descriptive identifier (required)
type = "write-notes"      # phase type (required)
from = ["parent-id"]      # parent phase ids (optional) -- omit for entry phase
context = "..."           # what to document (optional)
```

## early-exit
A valid planned stopping point. Documents context and hands off to a future session.
```toml
[[phases]]
id = "phase-id"           # unique descriptive identifier (required)
type = "early-exit"       # phase type (required)
from = ["parent-id"]      # parent phase ids (optional) -- omit for entry phase
reason = "..."            # reason for stopping (optional)
```


<example>

```toml
[[phases]]
id = "research-approach"
type = "external-research"
questions = [
  "What are the integration requirements for X?",
  "What are best practices for Y in this context?",
  ...
]

[[phases]]
id = "approach-decision"
type = "agentic-decision-gate"
from = ["research-approach"]
question = "Based on research, which approach is most viable?"

# Branch A — straightforward path
[[phases]]
id = "implement-approach-a"
type = "work"
from = ["approach-decision"]
goal = "Implement the core feature using approach A"
work-type = "code"
verify-description = "Feature builds and all tests pass"
project-survey-topics = ["existing implementation patterns", "test conventions", ...]
external-research-questions = ["Approach A library API and integration patterns", ...]
internal-research-questions = ["How is the existing module API structured?", ...]
pre-work-project-setup = ["Install approach A dependency", "Configure build system", ...]
commit = true

# Branch B — more complex path with nested viability check
[[phases]]
id = "implement-approach-b-core"
type = "work"
from = ["approach-decision"]
goal = "Implement the core feature using approach B"
work-type = "code"
verify-description = "Core feature builds and basic functionality works"
project-survey-topics = ["existing implementation patterns", ...]
internal-research-questions = ["How is the existing module API structured?", ...]
commit = false

[[phases]]
id = "approach-b-viability-check"
type = "agentic-decision-gate"
from = ["implement-approach-b-core"]
question = "Did approach B core succeed? If not, the approach is not viable."

[[phases]]
id = "approach-b-not-viable"
type = "early-exit"
from = ["approach-b-viability-check"]
reason = "Approach B determined not viable after initial implementation attempt"

[[phases]]
id = "implement-approach-b-refinement"
type = "work"
from = ["approach-b-viability-check"]
goal = "Refine and polish the approach B implementation"
work-type = "code"
verify-description = "Edge cases handled and code reviewed"
project-survey-topics = ["code quality conventions in the project", ...]
internal-research-questions = ["What refactoring patterns are used here?", ...]
pre-work-project-setup = ["Run scaffolding tool for additional module", ...]
commit = true

# Branch C — immediate early-exit if no approach is viable from research alone
[[phases]]
id = "no-viable-approach"
type = "early-exit"
from = ["approach-decision"]
reason = "Research determined no approach is viable within project constraints — replanning required"

# Merge
[[phases]]
id = "user-review"
type = "user-discussion"
from = ["implement-approach-a", "implement-approach-b-refinement"]
topic = "Review the implementation and discuss next steps"

[[phases]]
id = "direction-decision"
type = "user-decision-gate"
from = ["user-review"]
question = "Should we proceed with the current implementation or revise?"

[[phases]]
id = "revision-exit"
type = "early-exit"
from = ["direction-decision"]
reason = "User chose to revise — start a new planning session with updated scope"

[[phases]]
id = "documentation"
type = "work"
from = ["direction-decision"]
goal = "Capture implementation changes in user-facing documentation"
work-type = "docs"
verify-description = "Documentation reviewed and accurate"
project-survey-topics = ["Documentation standards and conventions", ...]
internal-research-questions = ["What are the relevant changes to document?", ...]
commit = true

[[phases]]
id = "completion-notes"
type = "write-notes"
from = ["documentation"]
context = "Summarize the implementation process, key decisions, and any open questions for future work"
```

</example>
