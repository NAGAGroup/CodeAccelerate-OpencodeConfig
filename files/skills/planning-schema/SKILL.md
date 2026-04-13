---
name: planning-schema
description: Phase types, field schemas, and naming conventions for writing executable plans.
---
<rules>
Always precede every work phase with: project-survey, then external-research (if external dependencies are involved), then internal-research.
Always include external-research before any work phase touching an external dependency — training data is not sufficient.
Always include research phases throughout the plan as new dependencies emerge, not only at the start.
Never put multiple distinct outcomes in a single work phase — split them.
Always make every leaf a write-notes or early-exit phase.
Never use a decision gate to inform a later phase — branches must split immediately from the gate.
</rules>

<phase types>

## external-research
Expands to one external-scout node per question.
- questions: [list of strings] — required
- research-type: standard | deep — optional, default: standard

## internal-research
Expands to one context-scout + context-insurgent pair per question.
- questions: [list of strings] — required

## project-survey
Expands to one context-scout node per topic. For broad, shallow orientation.
- topics: [list of strings] — required

## work
Expands to: work → verify → (fix → verify-retry) × retries.
- goal: string — required. One bounded implementation goal.
- work-type: code | docs — required
- verify-description: string — required. What a passing verification looks like.
- retries: int — optional, default: 1
- commit: bool — optional, default: false

## project-setup
Pre-work setup via shell operations and edits to build/project configs — creates the conditions that work phases depend on. Expands to one project-setup node per goal, chained sequentially. Self-correcting agent, no verify-retry loop.
Use for: adding dependencies, running scaffolding or code generation tools, initializing submodules, environment or config setup.
Do not use for: building, running tests, or verifying implementation — those are handled inside every work phase's verify chain.
- goals: [list of strings] — required. Each string is one setup operation.
- commit: bool — optional, default: false

## user-discussion
Open discussion before a decision or to gather user preference.
- topic: string — required
- branches: [list of phase labels, one for each branch] - required

## agentic-decision-gate
Routes based on accumulated evidence. Executor decides.
- question: string — required
- branches: [list of phase labels, one for each branch] - required

## write-notes
Captures context. Use as a mid-plan checkpoint or leaf node.
- context: string — optional

## early-exit
A valid planned stopping point. Structurally identical to write-notes.
- reason: string — optional

</phase types>

<phase naming>
Format: {number}{branch letter}-{descriptive-name}

Sequential:       1-survey-project, 2-research-framework, 3-implement-core
Branching:        2-technology-decision → 3a-implement-option-a, 3b-implement-option-b
Convergence:      3a and 3b both declare from: [3a-..., 3b-...] on the shared next phase
Within a branch:  3c-early-exit (leaf, no children)

The first phase has no from. Every subsequent phase explicitly declares from as a JSON array.
Single parent: from: ["parent-id"]
Convergence:   from: ["parent-a-id", "parent-b-id"]
</phase naming>

<examples>

### 1-research-external-dependencies [external-research]
questions:
  - [specific question about an external technology, library, or API the plan depends on]
  - [question about its integration requirements or usage constraints]

---

### 2-survey-project [project-survey]
from: ["1-research-external-dependencies"]
topics:
  - [broad project area relevant to the plan goal]
  - [another area to understand before making decisions]

---

### 3-research-specific-approach [internal-research]
from: ["2-survey-project"]
questions:
  - [targeted question about how the project handles something specific to this plan]
  - [another targeted project question]

---

### 4-approach-decision [agentic-decision-gate]
from: ["3-research-specific-approach"]
question: [the routing decision the executor makes based on accumulated evidence]
branches: ["4a-implement-option-a", "4b-implement-option-b"]

---

### 4a-survey-option-a [project-survey]
from: ["3-research-specific-approach"]
topics:
  - [specific project area to survey if option A is chosen]
  ... // as many topics as needed to cover the project survey necessary for option A

### 5a-research-option-a [external-research]
from: ["4a-survey-option-a"]
questions:
  - [specific question about external dependencies, integration patterns, API usage, or best practices relevant to option A]
  ... // as many questions as needed to cover the external research necessary for option A

### 6a-project-deep-dive-option-a [internal-research]
from: ["4a-research-option-a"]
questions:
  - [specific question about the project structure, conventions, or existing code relevant to implementing option A]
  ... // as many questions as needed to cover the internal research necessary for option A

### 7a-project-commands-option-a [project-setup]
from: ["6a-project-deep-dive-option-a"]
goals:
    - [project commands to pull in dependencies]
    - [project commands to integrate into build system]
    - [project commands to check and update config files]
    ... // as many goals as needed to set up the project for implementing option A

### 8a-implement-option-a [work]
from: ["4-approach-decision"]
goal: [single bounded implementation goal for this branch]
work-type: code
verify-description: [observable criteria that define a passing result]
retries: 2
commit: true

---

### 4b-project-survey-option-b-step-1 [project-survey]
from: ["3-research-specific-approach"]
topics:
  - [specific project area to survey for option B, step 1]
  ... // as many topics as needed to cover the project survey necessary for option B, step 1

### 5b-external-research-option-b-step-1 [external-research]
from: ["4b-project-survey-option-b-step-1"]
questions:
  - [specific question about external dependencies, integration patterns, API usage, or best practices relevant to option B, step 1]
  ... // as many questions as needed to cover the external research necessary for option B, step 1

### 6b-internal-research-option-b-step-1 [internal-research]
from: ["5b-external-research-option-b-step-1"]
questions:
  - [specific question about the project structure, conventions, or existing code relevant to implementing option B, step 1]
  ... // as many questions as needed to cover the internal research necessary for option B, step 1

### 7b-project-commands-option-b-step-1 [project-setup]
from: ["6b-internal-research-option-b-step-1"]
goals:
    - [project commands to pull in dependencies for step 1]
    - [project commands to integrate into build system for step 1]
    - [project commands to check and update config files for step 1]
    ... // as many goals as needed to set up the project for implementing option B, step 1

### 8b-implement-option-b-step-1 [work]
from: ["4-approach-decision"]
goal: [single bounded implementation goal for option B, step 1]
work-type: code
verify-description: [observable criteria that define a passing result for step 1]
retries: 4
commit: true

### 8b-early-merge-or-exit-decision [agentic-decision-gate]
from: ["8b-implement-option-b-step-1"]
question: [the routing decision the executor makes based on the outcome of implementing option B, step 1]
branches: ["8b-implement-option-b-step-2", "5-research-next-dependency", "8b-early-exit"]

### 9b-project-survey-option-b-step-2 [project-survey]
from: ["8b-implement-option-b-step-1"]
topics:
  - [specific project area to survey for option B, step 2]
  ... // as many topics as needed to cover the project survey necessary for option B, step 2

### 10b-external-research-option-b-step-2 [external-research]
from: ["9b-project-survey-option-b-step-2"]
questions:
  - [specific question about external dependencies, integration patterns, API usage, or best practices relevant to option B, step 2]
  ... // as many questions as needed to cover the external research necessary for option B, step 2

### 11b-internal-research-option-b-step-2 [internal-research]
from: ["10b-external-research-option-b-step-2"]
questions:
  - [specific question about the project structure, conventions, or existing code relevant to implementing option B, step 2]
  ... // as many questions as needed to cover the internal research necessary for option B, step 2

### 12b-project-commands-option-b-step-2 [project-setup]
from: ["11b-internal-research-option-b-step-2"]
goals:
    - [project commands to pull in dependencies for step 2]
    - [project commands to integrate into build system for step 2]
    - [project commands to check and update config files for step 2]
    ... // as many goals as needed to set up the project for implementing option B, step 2

### 13b-implement-option-b-step-2 [work]
from: ["9b-project-survey-option-b-step-2"]
goal: [single bounded implementation goal for option B, step 2]
work-type: code
verify-description: [observable criteria that define a passing result for step 2]
retries: 3
commit: true

---

### 8b-early-exit [early-exit]
from: ["8b-early-merge-or-exit-decision"]
reason: [why stopping here is a valid planned outcome]

---

### 5-integration-commands [project-setup]
from: ["8a-implement-option-a", "13b-implement-option-b-step-2", "8b-early-merge-or-exit-decision"]
goals:
  - [first shell operation or group, e.g. install the required dependency]
  - [second shell operation, e.g. run the build to verify integration]
commit: true

---

### 6-research-next-dependency [external-research]
from: ["5-integration-commands"]
questions:
  - [question about a new external dependency surfaced by implementation]

---

### 7-user-review [user-discussion]
from: ["6-research-next-dependency"]
topic: [topic requiring user preference or approval before proceeding]
branches: [proceed, abort-and-replan]

---

### 7a-early-exit [early-exit]
from: ["7-user-review"]
reason: [why stopping here is a valid planned outcome]

---

### 8-completion-notes [write-notes]
from: ["7-user-review"]
context: [what to document: outcomes, decisions made, follow-up work]

</examples>
