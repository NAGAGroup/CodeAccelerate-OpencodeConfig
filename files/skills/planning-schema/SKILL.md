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

<format>
Plans are written in TOML. Each phase is a [[phases]] table entry with an id, type, optional from array, and type-specific fields.
The first [[phases]] entry is the plan entry point — it has no from field.
Every subsequent phase declares from as an array of parent phase ids.
Single parent: from = ["parent-id"]
Convergence:   from = ["parent-a", "parent-b"]
Branching is implicit — multiple phases declaring from = ["same-gate-id"] define the branches of that gate.
Use ... in arrays to indicate that more items can and should be added as needed.
</format>

<phase types>

## external-research
Expands to one external-scout node per question.
questions = ["...", ...]                   # required

## internal-research
Expands to one context-insurgent node per question.
questions = ["...", ...]                   # required

## project-survey
Expands to one context-scout node per topic.
topics = ["...", ...]                      # required

## work
Embeds a full research pipeline before implementation. Expands to survey → external → internal → setup → work → verify → (triage → setup-fix → fix → verify-retry) × retries.
goal = "..."                               # required
work-type = "code" | "docs"               # required
verify-description = "..."                 # required
project-survey-topics = ["...", ...]       # required
internal-research-questions = ["...", ...] # required
external-research-questions = ["...", ...] # optional — required if work involves external dependencies
pre-work-project-setup = ["...", ...]      # optional
retries = 1                               # optional, default 1
commit = false                            # optional, default false

## project-setup
Shell operations and config/build system file edits. No verify-retry loop.
goals = ["...", ...]                       # required
commit = false                            # optional, default false

## user-discussion
Open-ended discussion with the user. Linear — no branching.
topic = "..."                              # required

## user-decision-gate
User's choice routes execution into branches.
question = "..."                           # required

## agentic-decision-gate
Executor's evidence-based decision routes execution into branches.
question = "..."                           # required

## write-notes
Captures context as a checkpoint or leaf.
context = "..."                            # optional

## early-exit
A valid planned stopping point. Identical to write-notes.
reason = "..."                             # optional

</phase types>

<phase naming>
Use descriptive ids only — no number prefixes required.
Group all phases within a branch sequentially before the next branch or merge point.
</phase naming>

<example>

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
retries = 2
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
retries = 5
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
retries = 1
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
retries = 1
commit = true

[[phases]]
id = "completion-notes"
type = "write-notes"
from = ["documentation"]
context = "Summarize the implementation process, key decisions, and any open questions for future work"

</example>
