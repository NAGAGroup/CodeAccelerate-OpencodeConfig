# Read and understand DAG design CATALOGUEs

**Session ID:** ses_28f4ac063fferuUdNPbH7G69Dk
**Created:** 4/8/2026, 10:26:59 PM
**Updated:** 4/8/2026, 11:39:22 PM

---

## User

Before we do what I want to do, please read all system prompts and skills related to DAG desing + the CATALOGUEs and summarize your understanding

---

## Assistant (Build · Claude Sonnet 4.6 · 6.2s)

_Thinking:_

The user wants me to read all system prompts and skills related to DAG design plus the catalogues, and summarize my understanding. Let me load the relevant skills and read the relevant files.

Let me start by loading the DAG-related skills and reading the catalogues.

**Tool: skill**

**Input:**
```json
{
  "name": "build-dags-core"
}
```

**Output:**
```
<skill_content name="build-dags-core">
# Skill: build-dags-core

# What does this skill teach?

In this skill, you learn how to build a structurally correct first-pass execution DAG — an MVP that captures the essential work phases, verification, and convergence structure. You are building a foundation that a second pass will improve.

## Your job

Build a clean, structurally valid DAG that captures the essential work phases. Do not overthink node selection — use only the core catalogue (`variant="core"`). A reviewer and reviser will add specialist nodes and refine the structure afterward. Your goal is a solid skeleton, not a final product.

## How to start

1. Call `get_planning_components_catalogue` with `variant="core"` — never design from memory, and never use the full catalogue
2. Decompose the goal into chunked phases
3. Follow the staged construction procedure below

## Rules for a valid DAG

- Every path terminates at a leaf node — no dead ends
- Every `verify` node has exactly 2 children: a pass path and a fail path
- Every `decision-gate` has exactly 2 children
- Every leaf node must be a `write-notes` node that captures context before exit
- Branches are mutually exclusive paths — parallel work is unsupported

## How to name nodes

Node IDs must be unique and descriptive. Never use generic names like `node-1` or `step-3`, and never use bare component names like `verify` or `work-item`. Add context: `verify-setup`, `verify-auth`, `fix-build-errors`, `decision-gate-auth-check`.

## Building Constraints

- Build and wire all work nodes first (Stages 1-2), then set entry and exit points last (Stage 3)
- Build and wire each phase independently before connecting them — this prevents structural errors from propagating across phases
- Be comfortable with orphaned groups throughout the build process — this is expected until you finish wiring completely
- Every leaf node should be a `write-notes` node
- Use 1 retry for each verify-retry structure unless the planning context indicates higher complexity — the reviewer will adjust retry counts if needed

## Staged Construction Procedure

### Stage 1: Build phase clusters

<|think|>
Build each phase as an independent cluster. It is expected and normal for clusters to be orphaned at this stage.

For each phase:
1. Call `add_nodes_to_dag` to create all the nodes needed for the phase
2. Wire all internal edges for the phase in a single `connect_nodes` call
3. Call `get_compact_dag_draft` to confirm the cluster is internally correct

### Stage 2: Wire clusters together

<|think|>
Once all phase clusters are internally complete:
1. Wire all inter-phase connections in a single `connect_nodes` call
2. Call `get_compact_dag_draft` to confirm all clusters are connected
3. Call `get_dag_draft_diagram` to see the full visual structure

### Stage 3: Set entry and exit points

<|think|>
1. Call `get_dag_draft_diagram` if you haven't already
2. Verify:
    - Are all terminal pathways accounted for, success and failure?
    - Are your verify-retry structures correct?
    - Are all phases wired into a single connected graph?
    - Is every leaf node a `write-notes` node?
3. Call `set_entry_point` with the first node
4. Call `set_exit_point` for every leaf node — `success` for happy-path, `failure` for retry-exhaustion

## How to think through this skill

<|think|>
- Am I using only the core catalogue, not the full one?
- Have I decomposed the goal into distinct phases with clear boundaries?
- Am I defaulting to 1 retry per verify-retry structure and not overthinking retry counts?
- Am I following the staged procedure: build clusters → wire clusters → set entry/exit?
- Is every leaf node a `write-notes` node?

Base directory for this skill: file:///tmp/ocx-oc-merged-yC2auO/skills/build-dags-core
Relative paths in this skill (e.g., scripts/, reference/) are relative to this base directory.
Note: file list is sampled.

<skill_files>

</skill_files>
</skill_content>
```

**Tool: skill**

**Input:**
```json
{
  "name": "dag-design-example"
}
```

**Output:**
```
<skill_content name="dag-design-example">
# Skill: dag-design-example

# DAG Design Example

This skill provides a complete worked example of designing and building an execution DAG using the staged workflow from the `build-dags` skill.

## Phase planning example

```
Phase 1 — decision-gate with immediate convergence:
  work-A → decision-gate-A
    ├─ → work-A-option-1 → work-B (converge)
    └─ → work-A-option-2 → work-B (converge)

Phase 2 — sequential work with early success check:
  work-B → work-C → decision-gate-early-check
    ├─ → write-notes-early-success (leaf — early exit, goal already satisfied)
    └─ → decision-gate-routing
           ├─ → [Phase 3a entry]
           └─ → [Phase 3b entry]

Phase 3a — single retry, converges to Phase 4:
  work-D → verify-D
    ├─ (pass) → work-F (converge with Phase 3b)
    └─ (fail) → fix-D → verify-D-retry
                           ├─ (pass) → work-F (converge)
                           └─ (fail) → write-notes-D-failure (leaf — captures what went wrong)

Phase 3b — two retries, converges to Phase 4:
  work-E → verify-E
    ├─ (pass) → work-F (converge with Phase 3a)
    └─ (fail) → fix-E-1 → verify-E-retry-1
                             ├─ (pass) → work-F (converge)
                             └─ (fail) → fix-E-2 → verify-E-retry-2
                                                     ├─ (pass) → work-F (converge)
                                                     └─ (fail) → write-notes-E-failure (leaf — captures what went wrong)

Phase 4 — sequential to success:
  work-F → write-notes-final-summary (leaf — captures what was accomplished)
```

**Key pattern:** Every leaf node is a `write-notes` node. Success leaves capture accomplishments; failure leaves capture what went wrong. This ensures the executing agent always records context before the plan exits.

**Then define the wiring between phases:**
```
work-B connects Phase 1 exit to Phase 2 entry (convergence node)
decision-gate-early-check routes to write-notes-early-success (early exit) or decision-gate-routing
decision-gate-routing routes to work-D (Phase 3a) or work-E (Phase 3b)
work-F connects Phase 3a/3b exits to Phase 4 entry (convergence node)
```

## Applying the workflow

<|think|>
Think through the following application of the staged workflow to the example above and how it generalizes to the DAG you're designing.

### Load the Catalogue

```
# ── Load catalogue ──
# Call get_planning_components_catalogue() with the appropriate variant
# for your pass (see your build-dags or build-dags-core skill for which variant to use)
get_planning_components_catalogue()
```

### Stage 1: Build phase clusters

```
# ── Stage 1: Build phase clusters ──

# Phase 1
add_nodes_to_dag(plan_name="my-plan", nodes='{"work-A": "work-item", "decision-gate-A": "decision-gate", "work-A-option-1": "work-item", "work-A-option-2": "work-item"}')
connect_nodes(plan_name="my-plan", edges='{"work-A": "decision-gate-A", "decision-gate-A": ["work-A-option-1", "work-A-option-2"]}')

# Phase 2
add_nodes_to_dag(plan_name="my-plan", nodes='{"work-B": "work-item", "work-C": "work-item", "decision-gate-early-check": "decision-gate", "write-notes-early-success": "write-notes", "decision-gate-routing": "decision-gate"}')
connect_nodes(plan_name="my-plan", edges='{"work-B": "work-C", "work-C": "decision-gate-early-check", "decision-gate-early-check": ["write-notes-early-success", "decision-gate-routing"]}')

# Phase 3a
add_nodes_to_dag(plan_name="my-plan", nodes='{"work-D": "work-item", "verify-D": "verify", "fix-D": "work-item", "verify-D-retry": "verify", "write-notes-D-failure": "write-notes"}')
connect_nodes(plan_name="my-plan", edges='{"work-D": "verify-D", "verify-D": ["work-F", "fix-D"], "fix-D": "verify-D-retry", "verify-D-retry": ["work-F", "write-notes-D-failure"]}')

# Phase 3b
add_nodes_to_dag(plan_name="my-plan", nodes='{"work-E": "work-item", "verify-E": "verify", "fix-E-1": "work-item", "verify-E-retry-1": "verify", "fix-E-2": "work-item", "verify-E-retry-2": "verify", "write-notes-E-failure": "write-notes"}')
connect_nodes(plan_name="my-plan", edges='{"work-E": "verify-E", "verify-E": ["work-F", "fix-E-1"], "fix-E-1": "verify-E-retry-1", "verify-E-retry-1": ["work-F", "fix-E-2"], "fix-E-2": "verify-E-retry-2", "verify-E-retry-2": ["work-F", "write-notes-E-failure"]}')

# Phase 4
add_nodes_to_dag(plan_name="my-plan", nodes='{"work-F": "work-item", "write-notes-final-summary": "write-notes"}')
connect_nodes(plan_name="my-plan", edges='{"work-F": "write-notes-final-summary"}')
```

### Stage 2: Connect phase clusters

> [!IMPORTANT]
> You do not need to redo any connections within phase clusters, only those that connect different phases together, so this stage is much faster than Stage 1. You can also connect phases in any order you like, just make sure to connect all of them before moving on to Stage 3.

```
# ── Stage 2: Connect phase clusters ──
connect_nodes(plan_name="my-plan", edges='{"work-A-option-1": "work-B", "work-A-option-2": "work-B", "decision-gate-routing": ["work-D", "work-E"]}')
get_compact_dag_draft(target="my-plan")
get_dag_draft_diagram(target="my-plan")
```

### Stage 3: Set entry and exit points

```
# ── Stage 3: Set entry and exit points ──

# Set the entry point — where execution begins
set_entry_point(plan_name="my-plan", node_id="work-A")

# Set success exits — leaf nodes on happy paths
set_exit_point(plan_name="my-plan", node_id="write-notes-early-success", type="success")
set_exit_point(plan_name="my-plan", node_id="write-notes-final-summary", type="success")

# Set failure exits — leaf nodes on retry-exhaustion paths
set_exit_point(plan_name="my-plan", node_id="write-notes-D-failure", type="failure")
set_exit_point(plan_name="my-plan", node_id="write-notes-E-failure", type="failure")

validate_dag(plan_name="my-plan")
```

## Thinking through this skill

<|think|>
- how does the staged workflow help structure your approach to building complex DAGs?
- using this as a guide, how would you approach building the DAG for your current plan? What are the different phases you would define and why?
- notice how every leaf node is a write-notes node — this ensures context is captured before any exit, whether success or failure
- plan out all stages before you start building, then follow the workflow stage by stage to build your DAG. How does this structured approach compare to how you would have built the DAG without it?

Base directory for this skill: file:///tmp/ocx-oc-merged-yC2auO/skills/dag-design-example
Relative paths in this skill (e.g., scripts/, reference/) are relative to this base directory.
Note: file list is sampled.

<skill_files>

</skill_files>
</skill_content>
```

**Tool: skill**

**Input:**
```json
{
  "name": "dag-review-criteria"
}
```

**Output:**
```
<skill_content name="dag-review-criteria">
# Skill: dag-review-criteria

# What does this skill teach?

In this skill, you learn how to evaluate a first-pass execution DAG and produce actionable critique that will guide a second-pass reviser. Your review has three parts, in order.

You are NOT building or fixing the DAG — you are analyzing it and recommending improvements. You do not need to know how to build a DAG. You need to know what a good DAG looks like and what questions to ask yourself to find the gaps.

## Part 1: Structural Correctness

Check these structural rules. If any are violated, flag them — but the first-pass designer is reliable at getting structure right. These are safety nets.

### Rules

- Every path terminates at a leaf node — no dead ends
- Every `verify` node has exactly 2 children (pass and fail)
- Every `decision-gate` has exactly 2 children
- Every leaf node is a `write-notes` node
- No orphaned nodes or disconnected subgraphs
- Branches are mutually exclusive — no parallel work

### Anti-patterns to flag

- **Unbounded work chains**: Three or more `work-item` nodes in sequence with no `verify` between them — work should be verified incrementally
- **Missing investigation**: A `work-item` that operates on unfamiliar territory with no preceding `project-search-and-analysis` — the executor needs to understand the current state before mutating it
- **Verify without fix path**: A `verify` whose fail path goes directly to a leaf with no attempt to fix — at minimum, one retry should be attempted
- **Over-retrying**: More than 2 retries for a single verify chain on a simple task — diminishing returns
- **Dead-end decision gates**: A `decision-gate` where both branches lead to the same path — the gate adds complexity without value

## Part 2: What to Add

The first-pass DAG uses only core components. Your job is to determine what specialist nodes are missing. There are three layers to this assessment, each requiring a different approach.

The caller will provide **tentative answers** from the orchestrator's assessment. Use those as starting points — agree, disagree, or refine them based on your own analysis.

### Hard Triggers

These are non-negotiable. If the condition is met, the recommendation follows.

- **Technology decision → external research → implementation.** When a `decision-gate` resolves which technology, library, or framework to use, an `external-scout` node MUST be placed between the decision and the implementation work. The research covers: how to add the dependency, what the API surface looks like, and whether there are environment or platform concerns. This is a sequencing requirement — research comes after the choice is made and before the work begins.
- **`external-scout` vs `deep-research` scope.** `deep-research` is for novel algorithms, cutting-edge approaches, or frontier techniques that require comprehensive autonomous investigation — it is rarely needed. It is NOT for evaluating established options, scoping implementation details, or comparing common tools. Standard `external-scout` (which includes a user approval gate) handles those cases. If a plan uses `deep-research` for routine technology evaluation, flag it as a scope violation and recommend `external-scout` instead.
- **External dependencies → external research.** If the task involves external dependencies, APIs, frameworks, or libraries, an `external-scout` node is almost certainly needed. The cost of scouting is far lower than implementing against wrong assumptions. The question is where to place it, not whether to include it.
- **Shell prerequisites → `run-project-commands`.** The `work-item` executor can edit files but cannot run commands. If any work-item depends on state that only a shell command can produce, a `run-project-commands` node must precede it. The most common case is dependency installation: researching what to add (`external-scout`) and writing code that uses it (`work-item`) are separate from actually installing it (`run-project-commands`). The same principle applies to any command-produced prerequisite — generated code from protobuf/OpenAPI compilers, scaffolded project structures from CLI tools, build artifacts from cmake/make, initialized submodules, or setup scripts that configure the environment. Ask: *does any work-item in this DAG assume something exists that only a shell command can produce?*

### Reasoning Triggers

For some node types, you cannot rely on fixed rules — you need to reason about the specific plan to discover what's needed. The reasoning is scoped: you're answering a specific question, and each answer you find IS the trigger.

**Decisions.** Ask yourself: *What decisions am I seeing that must be made during execution?* Walk through the plan and identify every point where the executor will face a choice — between implementation approaches, between tools, between strategies. Each decision you find is a trigger for a `decision-gate` or `user-decision-gate`. Consider:

- Are there decisions that can only be made after a prior decision has been executed? If so, cascading `decision-gate` nodes may be warranted.
- Would a single decision gate at the top be a false simplification of what is actually a sequence of dependent decisions?
- Is this a decision the executor can make from evidence, or does it require user preference? The former is `decision-gate`, the latter is `user-decision-gate`.

**Complexity routing.** Ask yourself: *Is the task's true complexity knowable only after investigation?* If the plan might turn out to be trivial once investigated, or much harder than expected, consider a short-path / long-path pattern: initial investigation followed by a `decision-gate` that routes to either a quick execution path or a thorough one.

**User checkpoints.** Ask yourself: *Are there points where user input would prevent wasted effort?* Ambiguous requirements, aesthetic choices, or decisions that depend on user preference — these are triggers for `user-discussion` or `user-decision-gate` nodes.

### Open Assessment

Beyond hard triggers and reasoning triggers, consider what else could substantially improve this DAG. There is no prescribed set of things to look for here — every plan is different.

### Retry Count Assessment

For each `verify` node in the DAG, assess the retry count individually:

- **Simple, well-understood work** → 1 retry is sufficient
- **Complex, multi-file, or integration-sensitive work** → 2 retries may be warranted
- **Predictable failure modes** (clear error messages) → 1 retry. **Ambiguous failure modes** → more retries
- **High blast radius** (many files, cross-module) → recommend 2 retries

## Part 3: How to Use Them

This is the bulk of your review. Once you know what nodes to add, the harder question is how to place them — scope, decomposition, sequencing, branching structure, and early-exit pathways.

### Placement and Sequencing

For every node you recommend adding, specify:
- **Where it goes** — which existing nodes it sits between, and why that position matters
- **What it depends on** — what information or decisions must exist before this node executes
- **What depends on it** — what downstream work changes because this node's output is now available

### Decomposition

When recommending `external-scout` nodes, consider how many are needed and what each one covers:
- One broad research node before a work phase, or multiple targeted nodes each covering a specific question?
- If multiple, should they be sequential (each builds on the last) or independent (each covers a different angle)?

### Branching Structure

For every `decision-gate` or `user-decision-gate` you recommend:
- What are the exactly 2 branches? Name them concretely.
- What is the evidence or criteria that determines which branch is taken?
- Do the branches reconverge, or do they lead to different outcomes?
- Are there early-exit opportunities? If one branch discovers the task is impossible or unnecessary, can the DAG exit early through a `write-notes` leaf rather than continuing?

### Early Exits

Look for places where the DAG should be able to terminate early rather than continuing through all phases:
- After investigation reveals the task is unnecessary or already done
- After a decision gate where one branch means "no further work needed"
- After a verify that reveals the scope has changed fundamentally

Each early exit needs its own `write-notes` leaf to capture why execution stopped.

### Execution-Phase Investigation

Does the DAG include enough investigation before work? The planning scout provides a broad overview, but the executor may need targeted investigation of specific files, patterns, or dependencies before each work phase. Should `project-search-and-analysis` nodes precede major work phases?

## How to structure your critique

For each finding, provide:
1. **The specific node IDs involved**
2. **What the issue or opportunity is**
3. **Your recommendation**
4. **Your reasoning**

Organize in priority order: most impactful improvements first.

## How to think through this skill

<|think|>
- Have I completed the structural pass before moving to the deeper analysis?
- For hard triggers: Have I checked every condition and applied the rule mechanically?
- For reasoning triggers: Have I walked through the plan asking the scoped questions? What decisions did I find? What complexity uncertainty exists? Where would user input prevent waste?
- For open assessment: Is there anything else that would substantially improve this plan that the triggers didn't catch?
- For how to use: Have I specified placement, sequencing, and branching for every node I recommended? Am I giving the reviser enough to act on?
- Am I grounding every critique in specific node IDs?

Base directory for this skill: file:///tmp/ocx-oc-merged-yC2auO/skills/dag-review-criteria
Relative paths in this skill (e.g., scripts/, reference/) are relative to this base directory.
Note: file list is sampled.

<skill_files>

</skill_files>
</skill_content>
```

**Tool: skill**

**Input:**
```json
{
  "name": "dag-revision-example"
}
```

**Output:**
```
<skill_content name="dag-revision-example">
# Skill: dag-revision-example

# DAG Revision Example

This skill provides worked examples of revising an existing DAG. You are not building from scratch — the DAG already exists. Your job is to modify it based on reviewer feedback.

## Starting state

Assume a first-pass DAG that looks like this:

```
(research-framework) → (select-framework) → (notes-framework-selected)
(notes-framework-selected) → (plan-blueprint) → (verify-blueprint) → [fix-blueprint, notes-blueprint-approved]
(fix-blueprint) → (verify-blueprint-retry) → [notes-blueprint-approved, notes-blueprint-failure]
(notes-blueprint-approved) → (research-hookup) → (verify-hookup) → [fix-hookup, notes-hookup-success]
(fix-hookup) → (verify-hookup-retry) → [notes-hookup-success, notes-hookup-failure]
(notes-hookup-success) → (implement) → (notes-complete)
```

## Revision operations

### Pattern 1: Insert a node mid-chain with `insert_between`

**Goal:** Insert an `external-scout` node between `select-framework` and `notes-framework-selected`.

This is the most common revision operation. Use `insert_between` — it atomically removes the old edge and adds the new path in one call. Never do this manually with `delete_edge` + `connect_nodes` — that creates intermediate orphan states and is error-prone.

```
# Step 1: Create the new node
add_node(plan_name="my-plan", nodeId="scout-framework-recipes", component_name="external-scout")

# Step 2: Insert it atomically between the two existing nodes
insert_between(plan_name="my-plan", from="select-framework", to="notes-framework-selected", new_node="scout-framework-recipes")

# Result:
# (select-framework) → (scout-framework-recipes) → (notes-framework-selected)
```

### Pattern 2: Insert a node before a branching point

**Goal:** Insert a `user-decision-gate` between `scout-framework-recipes` and `notes-framework-selected`.

Same pattern — `insert_between` works on any existing edge:

```
add_node(plan_name="my-plan", nodeId="gate-framework-choice", component_name="user-decision-gate")
insert_between(plan_name="my-plan", from="scout-framework-recipes", to="notes-framework-selected", new_node="gate-framework-choice")

# Result:
# (scout-framework-recipes) → (gate-framework-choice) → (notes-framework-selected)
#
# But wait — user-decision-gate needs exactly 2 children (it's a binary decision).
# The insert gave it 1 child (notes-framework-selected). We need to add the second branch.
# For a decision gate, one branch continues and the other typically routes back for more research.
connect_nodes(plan_name="my-plan", edges='{"gate-framework-choice": "research-framework"}')

# Result:
# (gate-framework-choice) → [notes-framework-selected, research-framework]
```

### Pattern 3: Extend a retry path (add more retries to an existing verify-retry chain)

**Goal:** Increase the hookup retry depth from 1 to 2.

The existing chain is:
```
(research-hookup) → (verify-hookup) → [fix-hookup, notes-hookup-success]
(fix-hookup) → (verify-hookup-retry) → [notes-hookup-success, notes-hookup-failure]
```

To add a second retry, you need to intercept the failure exit from `verify-hookup-retry` and route it through a new fix-verify cycle instead:

```
# Step 1: Create the new retry nodes
add_nodes_to_dag(plan_name="my-plan", nodes='{"fix-hookup-2": "work-item", "verify-hookup-retry-2": "verify", "notes-hookup-failure-2": "write-notes"}')

# Step 2: Remove the old failure edge from verify-hookup-retry to notes-hookup-failure
delete_edge(plan_name="my-plan", from="verify-hookup-retry", to="notes-hookup-failure")

# Step 3: Wire the new retry cycle
connect_nodes(plan_name="my-plan", edges='{"verify-hookup-retry": "fix-hookup-2", "fix-hookup-2": "verify-hookup-retry-2", "verify-hookup-retry-2": ["notes-hookup-success", "notes-hookup-failure-2"]}')

# Step 4: The old notes-hookup-failure is now orphaned — delete it since it's been replaced
delete_node(plan_name="my-plan", nodeId="notes-hookup-failure")

# Result:
# (fix-hookup) → (verify-hookup-retry) → [notes-hookup-success, fix-hookup-2]
# (fix-hookup-2) → (verify-hookup-retry-2) → [notes-hookup-success, notes-hookup-failure-2]
```

> **Key insight:** When extending retry paths, always: (1) create new nodes first, (2) remove the old failure edge, (3) wire the new cycle, (4) clean up the orphaned old failure node.

### Pattern 4: Reroute a failure path through a new node

**Goal:** Route `notes-blueprint-failure` through a `user-discussion` node before terminating.

```
# Step 1: Create the new nodes
add_nodes_to_dag(plan_name="my-plan", nodes='{"discuss-blueprint-failure": "user-discussion", "notes-blueprint-failure-final": "write-notes"}')

# Step 2: Disconnect the old failure leaf from its parent
delete_edge(plan_name="my-plan", from="verify-blueprint-retry", to="notes-blueprint-failure")

# Step 3: Wire the new failure path: parent → discussion → final write-notes
connect_nodes(plan_name="my-plan", edges='{"verify-blueprint-retry": "discuss-blueprint-failure", "discuss-blueprint-failure": "notes-blueprint-failure-final"}')

# Step 4: Clean up the old orphaned failure node
delete_node(plan_name="my-plan", nodeId="notes-blueprint-failure")

# Result:
# (verify-blueprint-retry) → [notes-blueprint-approved, discuss-blueprint-failure]
# (discuss-blueprint-failure) → (notes-blueprint-failure-final)
```

### Pattern 5: Insert a prerequisite node before an existing node (multiple parents)

**Goal:** Add a `run-project-commands` node before `research-hookup`. But `research-hookup` has a parent (`notes-blueprint-approved`).

Use `insert_between` — it handles this cleanly:

```
add_node(plan_name="my-plan", nodeId="install-deps", component_name="run-project-commands")
insert_between(plan_name="my-plan", from="notes-blueprint-approved", to="research-hookup", new_node="install-deps")

# Result:
# (notes-blueprint-approved) → (install-deps) → (research-hookup)
```

## Common mistakes to avoid

1. **Never use `delete_edge` + `connect_nodes` when `insert_between` works.** The manual two-step creates intermediate orphan states that confuse later operations. `insert_between` is atomic.

2. **Always `get_compact_dag_draft` after each structural change.** Don't batch multiple changes and check once at the end — verify incrementally so you catch problems early.

3. **Clean up orphaned nodes immediately.** When you `delete_edge` and a node becomes unreachable, either reconnect it or `delete_node` it before continuing. Don't leave orphans accumulating.

4. **Don't re-set entry/exit points during revision.** The headwrench agent clears these before delegating to you. Focus on the structural changes. Entry and exit points are set after you're done.

## Thinking through this skill

<|think|>
- For each critique point, which pattern above applies? Most revision operations are one of these five patterns.
- Am I using `insert_between` for mid-chain insertions instead of manual delete+connect?
- Am I checking `get_compact_dag_draft` after each structural change?
- Am I cleaning up orphaned nodes immediately after they become unreachable?
- Have I written my target adjacency list before making changes?

Base directory for this skill: file:///tmp/ocx-oc-merged-yC2auO/skills/dag-revision-example
Relative paths in this skill (e.g., scripts/, reference/) are relative to this base directory.
Note: file list is sampled.

<skill_files>

</skill_files>
</skill_content>
```

**Tool: skill**

**Input:**
```json
{
  "name": "dag-tools"
}
```

**Output:**
```
<skill_content name="dag-tools">
# Skill: dag-tools

# What does this skill teach?

In this skill, you learn how to build, modify, validate, and visualize execution DAGs using the DAG manipulation tools.

## Related Tools

### `get_planning_components_catalogue`

| Parameter | Description |
|-----------|-------------|
| *(none)* | Returns the full CATALOGUE.md listing all available node component types |


### `init_dag`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name for the new session plan — lowercase, hyphens only, no spaces (required) |

Creates a new DAG with the given name.

### `add_nodes_to_dag`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan to add nodes to (required) |
| `nodes` | Dictionary mapping nodeId → component_name, e.g. `{ "investigate": "external-scout", "implement": "work-item" }` (required) |

Adds all nodes in a single batch call. Use this after `init_dag` to create all work nodes at once.

### `add_node`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan to add the node to (required) |
| `nodeId` | Unique ID for the new node (required) |
| `component_name` | Component type from the node library, e.g. `'work-item'`, `'verify'` (required) |

Adds a single node. Prefer `add_nodes_to_dag` for creating multiple nodes at once.

### `connect_nodes`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan (required) |
| `edges` | Dictionary mapping from-nodeId to to-nodeId (or array of to-nodeIds for fan-out), e.g. `{"work-A": "verify-A", "verify-A": ["fix-A", "work-B"]}` (required) |

Wires multiple directed edges in a single batch call. All referenced nodes must already exist in the DAG.

### `insert_between`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan (required) |
| `from` | ID of the upstream (parent) node (required) |
| `new_node` | ID of the node to insert — must already exist in the DAG (required) |
| `to` | ID of the downstream (child) node (required) |

Atomically inserts `new_node` between `from` and `to`. Removes the edge `from → to` and adds `from → new_node → to` in one operation. Use this when adding a node mid-chain to avoid accidentally creating orphans or extra children. The node must already exist (create it first with `add_node` or `add_nodes_to_dag`).

### `set_entry_point`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan (required) |
| `node_id` | ID of the node that should execute first when the plan starts (required) |

Sets where execution begins. Call this once in the final wiring step (Stage 3).

### `set_exit_point`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan (required) |
| `node_id` | ID of the leaf node to mark as an exit point (required) |
| `type` | Exit type: `'success'` or `'failure'` (required) |

Marks a leaf node as a plan exit. Call this for every leaf node in the final wiring step (Stage 3). Use `'success'` for happy-path exits and `'failure'` for retry-exhaustion/error exits.

### `delete_edge`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan (required) |
| `from` | ID of the source (parent) node (required) |
| `to` | ID of the target (child) node to disconnect — node is not deleted, only the edge (required) |

### `delete_node`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Name of the session plan (required) |
| `nodeId` | ID of the node to delete — all edges to and from it are removed; children become orphaned (required) |

### `get_compact_dag_draft`

| Parameter | Description |
|-----------|-------------|
| `target` | Session plan name or raw path to plan.jsonl (required) |

Returns the DAG in a compact format showing connected nodes, orphaned groups, and entry/exit status. Use this to inspect structure during design.

### `get_dag_draft_diagram`

| Parameter | Description |
|-----------|-------------|
| `target` | Session plan name or raw path to plan.jsonl (required) |

### `present_dag_diagram`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Session plan name — throws if the DAG has structural errors (required) |

### `validate_dag`

| Parameter | Description |
|-----------|-------------|
| `plan_name` | Session plan name — throws on any structural issue (required) |

Base directory for this skill: file:///tmp/ocx-oc-merged-yC2auO/skills/dag-tools
Relative paths in this skill (e.g., scripts/, reference/) are relative to this base directory.
Note: file list is sampled.

<skill_files>

</skill_files>
</skill_content>
```

---

## Assistant (Build · Claude Sonnet 4.6 · 3.2s)

**Tool: get_planning_components_catalogue**

**Input:**
```json
{
  "variant": "core"
}
```

**Output:**
```
# Node Library Catalogue — Core Components

This catalogue contains the structural building blocks for execution DAGs. Use only these components for the initial design pass.

## Structural Rules

- **No loops.** Execution DAGs are acyclic — no node may appear on a path back to itself. Retries are implemented as unrolled sequences: `work → verify → fix → verify-retry → [converge | write-notes-failure]`. Each retry adds explicit nodes; there is no "loop back" construct.
- Every path terminates at a leaf node — no dead ends.
- Every leaf node should be a `write-notes` node that captures context before exit.
- Branches are mutually exclusive paths — parallel work is unsupported.

## Core

| Component | Description |
|-----------|-------------|
| `work-item` | Any project mutation — code changes, file edits, refactors, documentation updates. |
| `project-search-and-analysis` | Investigation without mutation. Use before work-item when current state needs to be understood first. |
| `write-notes` | Store accumulated findings, decisions, and constraints to semantic notes. Use as leaf nodes to capture context before exit — both success and failure paths should end with a write-notes node. |
| `compress` | Compress closed conversation sections to free context window space. Always followed by kickoff-refresher. |
| `kickoff-refresher` | Realign the agent after context compression. Always placed after compress. |
| `sequential-thinking` | Pure reasoning step with no side effects. |

## Logic

| Component | Description |
|-----------|-------------|
| `verify` | Branching verification node. Always placed after work-item. Must have exactly 2 children: the next step (pass) and a fix path (fail). Use this — not decision-gate — for verifying implementation outcomes. |
| `decision-gate` | Executor assesses accumulated evidence and chooses which branch to take. Must have exactly 2 children. Use for runtime decisions based on prior findings, not for verifying implementation. |

## Operations

| Component | Description |
|-----------|-------------|
| `run-project-commands` | Shell command execution via tailwrench. Required when work-items depend on state that only a command can produce — installing dependencies, running build/generation tools, executing scaffolding CLIs, initializing submodules, or running setup scripts. Place before the work-item that needs the result. |
| `commit` | Git checkpoint at a meaningful save point. Placed after successful verify. |

```

**Tool: get_planning_components_catalogue**

**Input:**
```json
{
  "variant": "full"
}
```

**Output:**
```
# Node Library Catalogue

## Structural Rules

- **No loops.** Execution DAGs are acyclic — no node may appear on a path back to itself. Retries are implemented as unrolled sequences: `work → verify → fix → verify-retry → [converge | write-notes-failure]`. Each retry adds explicit nodes; there is no "loop back" construct.
- Every path terminates at a leaf node — no dead ends.
- Every leaf node should be a `write-notes` node that captures context before exit.
- Branches are mutually exclusive paths — parallel work is unsupported.

## Core

| Component | Description |
|-----------|-------------|
| `work-item` | Any project mutation — code changes, file edits, refactors, documentation updates. |
| `project-search-and-analysis` | Investigation without mutation. Use before work-item when current state needs to be understood first. |
| `external-scout` | External research via external-scout behind a user approval gate. |
| `deep-research` | Comprehensive research on novel or frontier topics via deep-researcher. Rarely needed — most research belongs in external-scout. |
| `write-notes` | Store accumulated findings, decisions, and constraints to semantic notes. Use as leaf nodes to capture context before exit — both success and failure paths should end with a write-notes node. |
| `compress` | Compress closed conversation sections to free context window space. Always followed by kickoff-refresher. |
| `kickoff-refresher` | Realign the agent after context compression. Always placed after compress. |
| `sequential-thinking` | Pure reasoning step with no side effects. |

## Logic

| Component | Description |
|-----------|-------------|
| `verify` | Branching verification node. Always placed after work-item. Must have exactly 2 children: the next step (pass) and a fix path (fail). Use this — not decision-gate — for verifying implementation outcomes. |
| `decision-gate` | Executor assesses accumulated evidence and chooses which branch to take. Must have exactly 2 children. Use for runtime decisions based on prior findings, not for verifying implementation. |
| `user-decision-gate` | User chooses which branch to take. Must have exactly 2 children. |

## Operations

| Component | Description |
|-----------|-------------|
| `run-project-commands` | Shell command execution via tailwrench. Required when work-items depend on state that only a command can produce — installing dependencies, running build/generation tools, executing scaffolding CLIs, initializing submodules, or running setup scripts. Place before the work-item that needs the result. |
| `commit` | Git checkpoint at a meaningful save point. Placed after successful verify. |

## General

| Component | Description |
|-----------|-------------|
| `user-discussion` | Free-form conversation with the user mid-execution. |
| `autonomous-work` | Delegates to autonomous-agent. Only include when user explicitly approved autonomous work during planning. |

```

---

## Assistant (Build · Claude Sonnet 4.6 · 26.2s)

_Thinking:_

Now I have a comprehensive understanding of the DAG design system. Let me summarize everything clearly.

Here's my full understanding of the DAG design system:

---

## DAG Design System — Summary

### What a DAG Is

An **execution DAG** is a directed acyclic graph that shapes work into typed phases. It constrains *what tool calls happen and in what order* — not what the agent investigates or decides. The plan is a skeleton of work types, not a script of specific edits.

---

### Structural Rules (Non-Negotiable)

- **Acyclic.** No loops. Retries are *unrolled*: `work → verify → fix → verify-retry → [pass | write-notes-failure]`
- **Every path terminates at a leaf.** No dead ends.
- **Every leaf node is `write-notes`.** Both success and failure exits must capture context.
- **`verify` nodes have exactly 2 children**: pass path and fail path.
- **`decision-gate` / `user-decision-gate` have exactly 2 children.**
- **Branches are mutually exclusive.** No parallel work.

---

### Core Catalogue (First-Pass Only)

| Component | Purpose |
|-----------|---------|
| `work-item` | Any mutation — edits, refactors, docs |
| `project-search-and-analysis` | Investigation before mutation |
| `write-notes` | Leaf node — captures context on exit |
| `verify` | Branching check after work, with pass/fail children |
| `decision-gate` | Executor picks a branch from evidence |
| `run-project-commands` | Shell commands (installs, builds, scaffolding) |
| `commit` | Git checkpoint after successful verify |
| `compress` / `kickoff-refresher` | Context management pair |
| `sequential-thinking` | Pure reasoning, no side effects |

### Full Catalogue Additions

| Component | Purpose |
|-----------|---------|
| `external-scout` | External research behind a user approval gate |
| `deep-research` | Frontier/novel research (rarely needed) |
| `user-decision-gate` | User picks the branch |
| `user-discussion` | Free-form mid-execution conversation |
| `autonomous-work` | Full autonomous delegation (requires explicit user approval) |

---

### Build Procedure (3 Stages)

1. **Stage 1 — Build phase clusters independently.** Add nodes + wire internal edges per phase. Orphaned clusters are expected and normal at this stage.
2. **Stage 2 — Connect clusters.** Wire inter-phase edges. Verify with `get_compact_dag_draft` + `get_dag_draft_diagram`.
3. **Stage 3 — Set entry/exit points.** `set_entry_point` once. `set_exit_point` for every leaf (`success` or `failure`). Validate with `validate_dag`.

---

### Review Criteria

**Structural anti-patterns to flag:**
- 3+ sequential `work-item` nodes with no `verify` in between
- `work-item` operating on unfamiliar territory with no preceding `project-search-and-analysis`
- `verify` whose fail path goes straight to a leaf (no retry attempt)
- More than 2 retries for simple work
- `decision-gate` where both branches lead to the same path

**Hard triggers for adding nodes:**
- Technology decision → must add `external-scout` between the decision and implementation
- External deps/APIs/frameworks → `external-scout` almost certainly needed
- Work-item depends on shell-produced state → `run-project-commands` must precede it

**Reasoning triggers:** Walk the plan and ask — what decisions exist? Is complexity knowable only after investigation (short/long path routing)? Where would user input prevent wasted effort?

---

### Revision Patterns

1. **Insert mid-chain:** Use `insert_between` (atomic — never manual delete+connect)
2. **Insert before a branching point:** `insert_between`, then `connect_nodes` for the second branch
3. **Extend retry depth:** Create new nodes → `delete_edge` old failure edge → wire new cycle → `delete_node` orphaned old leaf
4. **Reroute failure path:** `delete_edge` → wire new path → `delete_node` old orphan
5. **Insert prerequisite (multiple parents):** `insert_between` handles this cleanly

**Key discipline:** `get_compact_dag_draft` after every structural change. Clean up orphans immediately.

---

### Key Design Philosophy

- Component prompts are **static** — every node of the same type uses the identical prompt. The planner's intent lives in the **DAG shape**, not per-node customization.
- Plans decompose the **shape of work**, not the solution. The planner does not solve the problem or script specific file edits.
- Subagents are competent specialists — dispatched with goal-oriented prompts, they figure out the how themselves.

Ready for whatever you want to do next.

---

## User

okay, sweet, now I did some reasearch and came up with a gemma prompting guide. Can you revise all of these to meet the following document

# Prompt engineering Gemma 4 E4B for agentic orchestration

**Gemma 4 E4B responds best to atomic, role-constrained prompts with explicit output schemas — and most "advanced" prompting techniques actively hurt a 4B model.** The single highest-leverage finding across official Google documentation, academic research, and community testing is this: decompose complex instructions across your DAG nodes rather than stacking them in one prompt. Google's own documentation warns that Gemma models "may ignore instructions that are too detailed or not clearly expressed, **particularly when you are using model versions with a lower parameter count**." Every technique below is grounded in either official Google guidance, peer-reviewed research, or empirically validated community findings from the first week of Gemma 4's public release (April 2, 2026).

Gemma 4 represents a major architectural shift from Gemma 3 — it is the **first Gemma generation with a native system role**, native tool-calling tokens, and built-in thinking mode. The E4B variant packs **4.5B effective parameters into 8B total weights** using Per-Layer Embeddings (PLE), supports 128K context, and handles text, image, and audio natively. On benchmarks, E4B with thinking enabled exceeds Gemma 3 27B on multiple tasks despite being ~6× smaller in active compute.

---

## The architecture of an effective E4B prompt

Gemma 4 E4B performs best when prompts follow a strict **Role → Task → Context → Constraints → Output Format** structure. This isn't speculative — it's the convergent recommendation from Google's official function-calling docs, the vLLM Gemma 4 recipes, and academic research on constraint-following in small LLMs (RECAST 2025, DeCRIM 2024).

**System prompt template for an orchestrated agent node:**

```
You are [AGENT_ROLE], a focused component in a processing pipeline.

<rules>
1. Process ONLY the specific task in the user message.
2. Output valid JSON matching the specified schema. No text outside the JSON.
3. If information is missing, return {"error": "description of what is missing"}.
</rules>

<output_format>
{
  "decision": "approve | reject | needs_info",
  "reason": "one sentence",
  "confidence": 0.0-1.0
}
</output_format>
```

Three design principles govern this template. **First, keep the system prompt under 200–500 tokens.** Google's function-calling documentation states to "prioritize the most important instructions and be cautious about providing many general instructions." The HuggingFace Gemma 3 blog confirms the family "uses very short system prompts." For a 4B model, every unnecessary token in the system prompt competes with your actual task context for the model's limited attention budget.

**Second, front-load your most important rules and place negative constraints last.** Google Cloud's Gemini prompting guide (patterns transferable to Gemma) documents that "the model may drop negative constraints or formatting constraints if they appear too early in the prompt. To mitigate this, place your core request and most critical restrictions as the final line of your instruction." This aligns with the recency bias documented in Zhao et al. (2021), where GPT-3 2.7B accuracy varied from 54% to 93% depending on instruction ordering.

**Third, use XML-style tags as structural delimiters.** Phil Schmid's validated Gemini/Gemma prompting guide recommends `<role>`, `<instructions>`, `<constraints>`, and similar tags. These give the model hard boundaries between prompt sections — critical when a small model might otherwise blend instruction context with task data.

---

## Why standard chain-of-thought hurts E4B (and what to do instead)

The most counterintuitive finding for practitioners coming from larger models: **open-ended chain-of-thought ("think step by step") actively degrades performance on sub-10B models.** Wei et al.'s seminal 2022 CoT paper established that CoT "does not positively impact performance for small models, and only yields performance gains when used with models of ~100B parameters." Small models produced "fluent but illogical chains of thought, leading to lower performance than standard prompting." Sprague et al. (2024, accepted at ICLR 2025) found CoT can cause **up to 36.3% absolute performance drops** even in state-of-the-art models on certain tasks.

Gemma 4's native thinking mode (`<|think|>`) is different from prompt-based CoT — the model was explicitly trained with thinking chains during post-training. But the same capacity constraint applies: **E4B's 4.5B active parameters have less room to maintain coherent long reasoning chains.** Google's official guidance is revealing here: they document that system instructions telling the model to "think efficiently" reduce thinking tokens by ~20% with minimal quality loss. For E4B specifically, the model cleanly omits thinking blocks when disabled (unlike the 26B/31B which still emit empty thought tokens).

**The practical pattern for DAG orchestration is selective thinking:**

- **Disable thinking** for extraction, classification, formatting, simple routing, and translation nodes. These are narrow tasks where direct answers outperform reasoned answers at this model size.
- **Enable thinking** for planning nodes, code generation, multi-step reasoning, and any node where the model needs to evaluate alternatives.
- **Use "LOW" thinking system instructions** when you need some reasoning but want to control token cost: add "Think briefly and efficiently. Focus on the key reasoning steps only." to your system prompt.

A 2025 finding from video-language model research suggests an alternative pattern for small models: **answer-first, then reasoning.** Place the output commitment before the explanation. This prevents the model from "talking itself into" a wrong answer during its reasoning chain — once an LLM commits to "yes" or "no," subsequent tokens reinforce that initial judgment regardless of quality.

---

## Few-shot examples: the 2–3 example sweet spot

A direct study on Gemma-3-4B (the closest predecessor to E4B) from "The Few-shot Dilemma: Over-prompting LLMs" (2025) found that **Gemma-3-4B performance declines as few-shot examples increase past a low threshold.** The paper identifies "8B parameters as a threshold for effective few-shot comprehension" — below this, over-prompting is a real risk. Google's own web.dev prompting guide confirms that Gemma 2B produces incorrect outputs with zero-shot but improves with "more elaborate prompts combined with few-shot prompting" — the key is finding the narrow band between too few and too many.

**Actionable guidelines for E4B few-shot prompting:**

- Use **exactly 2–3 high-quality, diverse examples** per prompt. More is actively harmful at this model size.
- **Order matters dramatically.** Put your most representative example last (recency bias). Zhao et al. showed that example permutation alone can swing accuracy from 54% to 93% on a 2.7B model.
- **Balance class labels** in examples to avoid majority label bias (the model skews predictions toward whichever label appears most in examples).
- For dynamic example selection, **TF-IDF-based selection outperforms both random and semantic embedding selection** for small models.
- If few-shot examples push your prompt past ~2K tokens total, drop to 1 example or go zero-shot with a very explicit output format specification instead.

**Few-shot template for an extraction node:**

```
User:
<task>Extract the primary action and target from this command.</task>

<example>
Input: "Deploy the auth service to staging"
Output: {"action": "deploy", "target": "auth service", "environment": "staging"}
</example>

<example>
Input: "Roll back the payment gateway to v2.3"
Output: {"action": "rollback", "target": "payment gateway", "version": "v2.3"}
</example>

Input: "Scale the worker pool to 12 instances"
Output:
```

---

## Structured output: schema enforcement is non-negotiable

The single most consistent finding across all sources is that **prompt-only JSON discipline is insufficient for Gemma 4.** The CatG blog's real-world Gemma 3→4 migration (April 2026) found the model "sometimes emits extra tokens around JSON — code fences, chat-template markers, partial objects." The vLLM Gemma 4 recipes documentation states explicitly: "If you only use response_format without describing the schema in the prompt, the model will produce structurally valid JSON but won't follow semantic instructions. **Always include output instructions in the system message AND use response_format for structural enforcement.**"

For Ollama specifically, use the `format` parameter with a JSON schema. The critical stack is three layers deep: **system prompt describes the schema semantically** + **user prompt specifies the task** + **`format` parameter enforces structure mechanically.**

**Empirical findings from the CatG migration for reliable E4B extraction:**

- **Boolean schemas outperform string enums.** `true | false | null` produces more consistent results than `"yes" | "no" | "unsure"` — less "I said yes but output no" behavior.
- **Use temperature=0** for all structured output tasks. Google's official recommendation of temperature=1.0 is for general-purpose chat; deterministic tasks need deterministic sampling.
- **Minimize schema complexity.** Fewer keys = fewer failure modes. Keep schemas flat rather than deeply nested. For a 4B model, LangChain benchmarks show small open models "perform poorly for all but the simplest schema."
- **Small token budgets with retry fallback.** Set `num_predict` to ~192 for the fast path; if parsing fails, retry with 512–1024. This keeps the common case fast while handling edge cases.

**For the user's prose-based enforcement pattern** (no formal function-calling schemas), the Gemma 3 `tool_code`/`tool_output` delimiter pattern from Phil Schmid is the closest validated analogue. The model reasons about *why* to take an action, then emits the action in a predictable delimited format:

```
System: When you need to perform an action, output it in this exact format:
---ACTION---
{"type": "action_name", "params": {...}}
---END_ACTION---
Then wait for the result before continuing.

User: Check if the deployment is healthy and report status.

---

## Assistant (Build · Claude Sonnet 4.6 · 6.6s)

_Thinking:_

The user wants me to revise the node prompts in the DAG system to follow the Gemma 4 E4B prompting guide they've provided. Let me first understand what prompts currently exist and where they are.

Let me look at the planning node library and the prompts directory.

Let me first explore the current prompt files to understand what needs to be revised.

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/planning/plan-session/node-library"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/planning/plan-session/node-library</path>
<type>directory</type>
<entries>
autonomous-work/
CATALOGUE-CORE.md
CATALOGUE.md
commit/
compress/
decision-gate/
deep-research/
execution-kickoff/
external-scout/
kickoff-refresher/
plan-fail/
plan-success/
project-search-and-analysis/
run-project-commands/
sequential-thinking/
user-decision-gate/
user-discussion/
verify/
work-item/
write-notes/

(20 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/planning/plan-session/prompts"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/planning/plan-session/prompts</path>
<type>directory</type>
<entries>
compress.md
dag-description.md
dag-design.md
dag-review.md
dag-revision.md
external-research.md
hw-assessment.md
orientation-scout.md
plan-success.md
retrieve-notes.md
session-overview-refresher.md
session-overview.md
store-notes.md

(13 entries)
</entries>
```

---

## Assistant (Build · Claude Sonnet 4.6 · 2.4s)

_Thinking:_

Let me read all the node library prompts and the plan-session prompts to understand what's currently there.

---

## User

no, i want you to revise JUST the files we've gone over so far, since they are the most difficult and i wanted to make sure your understanding was correct. It is. So do those FIRST

---

## Assistant (Build · Claude Sonnet 4.6 · 5.1s)

_Thinking:_

The user wants me to revise the skills we've loaded so far:
1. `build-dags-core` skill
2. `dag-design-example` skill
3. `dag-review-criteria` skill
4. `dag-revision-example` skill
5. `dag-tools` skill

Let me find these files first.

Let me locate those skill files.

**Tool: glob**

**Input:**
```json
{
  "pattern": "files/skills/**/*.md",
  "path": "/home/jack/CodeAccelerate-OpencodeConfig"
}
```

**Output:**
```
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/revise-dags/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-description-author/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/qdrant-notes/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/searching-deeper/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-tools/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/external-scout/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/deep-researcher/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-reviser/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/documentation-expert/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-revision-example/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/build-dags-core/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/autonomous-agent/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/context-insurgent/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/asking-questions/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/editing/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/web-research/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/junior-dev/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-design-example/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/tailwrench/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-review-criteria/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-reviewer/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/context-scout/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/grepai/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-designer/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/following-plans/SKILL.md
/home/jack/CodeAccelerate-OpencodeConfig/files/skills/sequential-thinking/SKILL.md
```

---

## Assistant (Build · Claude Sonnet 4.6 · 1.3s)

---

## User

and the agent files

---

## Assistant (Build · Claude Sonnet 4.6 · 3.5s)

_Thinking:_

The user wants me to also find and revise the agent files related to DAG design. Let me find those.

**Tool: glob**

**Input:**
```json
{
  "path": "/home/jack/CodeAccelerate-OpencodeConfig",
  "pattern": "files/agents/**/*.md"
}
```

**Output:**
```
/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-reviser.md
/home/jack/CodeAccelerate-OpencodeConfig/files/agents/external-scout.md
/home/jack/CodeAccelerate-OpencodeConfig/files/agents/headwrench.md
/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-description-author.md
/home/jack/CodeAccelerate-OpencodeConfig/files/agents/tailwrench.md
/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-reviewer.md
/home/jack/CodeAccelerate-OpencodeConfig/files/agents/autonomous-agent.md
/home/jack/CodeAccelerate-OpencodeConfig/files/agents/context-scout.md
/home/jack/CodeAccelerate-OpencodeConfig/files/agents/context-insurgent.md
/home/jack/CodeAccelerate-OpencodeConfig/files/agents/documentation-expert.md
/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-designer.md
/home/jack/CodeAccelerate-OpencodeConfig/files/agents/deep-researcher.md
/home/jack/CodeAccelerate-OpencodeConfig/files/agents/junior-dev.md
```

---

## Assistant (Build · Claude Sonnet 4.6 · 14.0s)

_Thinking:_

The user wants me to revise:
1. Skills related to DAG design (the ones we've gone over):
   - `files/skills/build-dags-core/SKILL.md`
   - `files/skills/dag-design-example/SKILL.md`
   - `files/skills/dag-review-criteria/SKILL.md`
   - `files/skills/dag-revision-example/SKILL.md`
   - `files/skills/dag-tools/SKILL.md`

2. Agent files related to DAG design:
   - `files/agents/dag-designer.md`
   - `files/agents/dag-reviewer.md`
   - `files/agents/dag-reviser.md`
   - `files/agents/dag-description-author.md`

I need to read through all these files and then revise them according to the Gemma 4 E4B prompting guide, which emphasizes the Role → Task → Context → Constraints → Output Format structure, keeping system prompts concise (200–500 tokens), front-loading critical rules, and using XML-style tags for clarity.

Looking at the `<|think|>` tags in these skills, I'm realizing these are meta-instructions embedded in the skill documents themselves—prompts meant to guide the agent reading the skill to think through something—rather than Gemma's native thinking tokens. That's a different use case than what the guide is describing for the model's built-in thinking mode.

Good. Now let me read all the relevant files before revising anything.

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/skills/build-dags-core/SKILL.md"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/skills/build-dags-core/SKILL.md</path>
<type>file</type>
<content>
1: ---
2: name: build-dags-core
3: description: Teaches how to build a structurally valid MVP execution DAG from the core component catalogue using the staged construction procedure.
4: ---
5: # What does this skill teach?
6:
7: In this skill, you learn how to build a structurally correct first-pass execution DAG — an MVP that captures the essential work phases, verification, and convergence structure. You are building a foundation that a second pass will improve.
8:
9: ## Your job
10:
11: Build a clean, structurally valid DAG that captures the essential work phases. Do not overthink node selection — use only the core catalogue (`variant="core"`). A reviewer and reviser will add specialist nodes and refine the structure afterward. Your goal is a solid skeleton, not a final product.
12:
13: ## How to start
14:
15: 1. Call `get_planning_components_catalogue` with `variant="core"` — never design from memory, and never use the full catalogue
16: 2. Decompose the goal into chunked phases
17: 3. Follow the staged construction procedure below
18:
19: ## Rules for a valid DAG
20:
21: - Every path terminates at a leaf node — no dead ends
22: - Every `verify` node has exactly 2 children: a pass path and a fail path
23: - Every `decision-gate` has exactly 2 children
24: - Every leaf node must be a `write-notes` node that captures context before exit
25: - Branches are mutually exclusive paths — parallel work is unsupported
26:
27: ## How to name nodes
28:
29: Node IDs must be unique and descriptive. Never use generic names like `node-1` or `step-3`, and never use bare component names like `verify` or `work-item`. Add context: `verify-setup`, `verify-auth`, `fix-build-errors`, `decision-gate-auth-check`.
30:
31: ## Building Constraints
32:
33: - Build and wire all work nodes first (Stages 1-2), then set entry and exit points last (Stage 3)
34: - Build and wire each phase independently before connecting them — this prevents structural errors from propagating across phases
35: - Be comfortable with orphaned groups throughout the build process — this is expected until you finish wiring completely
36: - Every leaf node should be a `write-notes` node
37: - Use 1 retry for each verify-retry structure unless the planning context indicates higher complexity — the reviewer will adjust retry counts if needed
38:
39: ## Staged Construction Procedure
40:
41: ### Stage 1: Build phase clusters
42:
43: <|think|>
44: Build each phase as an independent cluster. It is expected and normal for clusters to be orphaned at this stage.
45:
46: For each phase:
47: 1. Call `add_nodes_to_dag` to create all the nodes needed for the phase
48: 2. Wire all internal edges for the phase in a single `connect_nodes` call
49: 3. Call `get_compact_dag_draft` to confirm the cluster is internally correct
50:
51: ### Stage 2: Wire clusters together
52:
53: <|think|>
54: Once all phase clusters are internally complete:
55: 1. Wire all inter-phase connections in a single `connect_nodes` call
56: 2. Call `get_compact_dag_draft` to confirm all clusters are connected
57: 3. Call `get_dag_draft_diagram` to see the full visual structure
58:
59: ### Stage 3: Set entry and exit points
60:
61: <|think|>
62: 1. Call `get_dag_draft_diagram` if you haven't already
63: 2. Verify:
64:     - Are all terminal pathways accounted for, success and failure?
65:     - Are your verify-retry structures correct?
66:     - Are all phases wired into a single connected graph?
67:     - Is every leaf node a `write-notes` node?
68: 3. Call `set_entry_point` with the first node
69: 4. Call `set_exit_point` for every leaf node — `success` for happy-path, `failure` for retry-exhaustion
70:
71: ## How to think through this skill
72:
73: <|think|>
74: - Am I using only the core catalogue, not the full one?
75: - Have I decomposed the goal into distinct phases with clear boundaries?
76: - Am I defaulting to 1 retry per verify-retry structure and not overthinking retry counts?
77: - Am I following the staged procedure: build clusters → wire clusters → set entry/exit?
78: - Is every leaf node a `write-notes` node?

(End of file - total 78 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-design-example/SKILL.md"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-design-example/SKILL.md</path>
<type>file</type>
<content>
1: ---
2: name: dag-design-example
3: description: Worked example of DAG design and construction — phase decomposition, tool call sequence, and expected output at each stage.
4: ---
5: # DAG Design Example
6:
7: This skill provides a complete worked example of designing and building an execution DAG using the staged workflow from the `build-dags` skill.
8:
9: ## Phase planning example
10:
11: ```
12: Phase 1 — decision-gate with immediate convergence:
13:   work-A → decision-gate-A
14:     ├─ → work-A-option-1 → work-B (converge)
15:     └─ → work-A-option-2 → work-B (converge)
16:
17: Phase 2 — sequential work with early success check:
18:   work-B → work-C → decision-gate-early-check
19:     ├─ → write-notes-early-success (leaf — early exit, goal already satisfied)
20:     └─ → decision-gate-routing
21:            ├─ → [Phase 3a entry]
22:            └─ → [Phase 3b entry]
23:
24: Phase 3a — single retry, converges to Phase 4:
25:   work-D → verify-D
26:     ├─ (pass) → work-F (converge with Phase 3b)
27:     └─ (fail) → fix-D → verify-D-retry
28:                            ├─ (pass) → work-F (converge)
29:                            └─ (fail) → write-notes-D-failure (leaf — captures what went wrong)
30:
31: Phase 3b — two retries, converges to Phase 4:
32:   work-E → verify-E
33:     ├─ (pass) → work-F (converge with Phase 3a)
34:     └─ (fail) → fix-E-1 → verify-E-retry-1
35:                              ├─ (pass) → work-F (converge)
36:                              └─ (fail) → fix-E-2 → verify-E-retry-2
37:                                                      ├─ (pass) → work-F (converge)
38:                                                      └─ (fail) → write-notes-E-failure (leaf — captures what went wrong)
39:
40: Phase 4 — sequential to success:
41:   work-F → write-notes-final-summary (leaf — captures what was accomplished)
42: ```
43:
44: **Key pattern:** Every leaf node is a `write-notes` node. Success leaves capture accomplishments; failure leaves capture what went wrong. This ensures the executing agent always records context before the plan exits.
45:
46: **Then define the wiring between phases:**
47: ```
48: work-B connects Phase 1 exit to Phase 2 entry (convergence node)
49: decision-gate-early-check routes to write-notes-early-success (early exit) or decision-gate-routing
50: decision-gate-routing routes to work-D (Phase 3a) or work-E (Phase 3b)
51: work-F connects Phase 3a/3b exits to Phase 4 entry (convergence node)
52: ```
53:
54: ## Applying the workflow
55:
56: <|think|>
57: Think through the following application of the staged workflow to the example above and how it generalizes to the DAG you're designing.
58:
59: ### Load the Catalogue
60:
61: ```
62: # ── Load catalogue ──
63: # Call get_planning_components_catalogue() with the appropriate variant
64: # for your pass (see your build-dags or build-dags-core skill for which variant to use)
65: get_planning_components_catalogue()
66: ```
67:
68: ### Stage 1: Build phase clusters
69:
70: ```
71: # ── Stage 1: Build phase clusters ──
72:
73: # Phase 1
74: add_nodes_to_dag(plan_name="my-plan", nodes='{"work-A": "work-item", "decision-gate-A": "decision-gate", "work-A-option-1": "work-item", "work-A-option-2": "work-item"}')
75: connect_nodes(plan_name="my-plan", edges='{"work-A": "decision-gate-A", "decision-gate-A": ["work-A-option-1", "work-A-option-2"]}')
76:
77: # Phase 2
78: add_nodes_to_dag(plan_name="my-plan", nodes='{"work-B": "work-item", "work-C": "work-item", "decision-gate-early-check": "decision-gate", "write-notes-early-success": "write-notes", "decision-gate-routing": "decision-gate"}')
79: connect_nodes(plan_name="my-plan", edges='{"work-B": "work-C", "work-C": "decision-gate-early-check", "decision-gate-early-check": ["write-notes-early-success", "decision-gate-routing"]}')
80:
81: # Phase 3a
82: add_nodes_to_dag(plan_name="my-plan", nodes='{"work-D": "work-item", "verify-D": "verify", "fix-D": "work-item", "verify-D-retry": "verify", "write-notes-D-failure": "write-notes"}')
83: connect_nodes(plan_name="my-plan", edges='{"work-D": "verify-D", "verify-D": ["work-F", "fix-D"], "fix-D": "verify-D-retry", "verify-D-retry": ["work-F", "write-notes-D-failure"]}')
84:
85: # Phase 3b
86: add_nodes_to_dag(plan_name="my-plan", nodes='{"work-E": "work-item", "verify-E": "verify", "fix-E-1": "work-item", "verify-E-retry-1": "verify", "fix-E-2": "work-item", "verify-E-retry-2": "verify", "write-notes-E-failure": "write-notes"}')
87: connect_nodes(plan_name="my-plan", edges='{"work-E": "verify-E", "verify-E": ["work-F", "fix-E-1"], "fix-E-1": "verify-E-retry-1", "verify-E-retry-1": ["work-F", "fix-E-2"], "fix-E-2": "verify-E-retry-2", "verify-E-retry-2": ["work-F", "write-notes-E-failure"]}')
88:
89: # Phase 4
90: add_nodes_to_dag(plan_name="my-plan", nodes='{"work-F": "work-item", "write-notes-final-summary": "write-notes"}')
91: connect_nodes(plan_name="my-plan", edges='{"work-F": "write-notes-final-summary"}')
92: ```
93:
94: ### Stage 2: Connect phase clusters
95:
96: > [!IMPORTANT]
97: > You do not need to redo any connections within phase clusters, only those that connect different phases together, so this stage is much faster than Stage 1. You can also connect phases in any order you like, just make sure to connect all of them before moving on to Stage 3.
98:
99: ```
100: # ── Stage 2: Connect phase clusters ──
101: connect_nodes(plan_name="my-plan", edges='{"work-A-option-1": "work-B", "work-A-option-2": "work-B", "decision-gate-routing": ["work-D", "work-E"]}')
102: get_compact_dag_draft(target="my-plan")
103: get_dag_draft_diagram(target="my-plan")
104: ```
105:
106: ### Stage 3: Set entry and exit points
107:
108: ```
109: # ── Stage 3: Set entry and exit points ──
110:
111: # Set the entry point — where execution begins
112: set_entry_point(plan_name="my-plan", node_id="work-A")
113:
114: # Set success exits — leaf nodes on happy paths
115: set_exit_point(plan_name="my-plan", node_id="write-notes-early-success", type="success")
116: set_exit_point(plan_name="my-plan", node_id="write-notes-final-summary", type="success")
117:
118: # Set failure exits — leaf nodes on retry-exhaustion paths
119: set_exit_point(plan_name="my-plan", node_id="write-notes-D-failure", type="failure")
120: set_exit_point(plan_name="my-plan", node_id="write-notes-E-failure", type="failure")
121:
122: validate_dag(plan_name="my-plan")
123: ```
124:
125: ## Thinking through this skill
126:
127: <|think|>
128: - how does the staged workflow help structure your approach to building complex DAGs?
129: - using this as a guide, how would you approach building the DAG for your current plan? What are the different phases you would define and why?
130: - notice how every leaf node is a write-notes node — this ensures context is captured before any exit, whether success or failure
131: - plan out all stages before you start building, then follow the workflow stage by stage to build your DAG. How does this structured approach compare to how you would have built the DAG without it?

(End of file - total 131 lines)
</content>
```

**Tool: read**

**Input:**
```json
{}
```

**Error:**
```
Tool execution aborted
```

---

## User

and the catalogues

---

## Assistant (Build · Claude Sonnet 4.6 · 5.2s)

_Thinking:_

The user wants me to also include the CATALOGUE.md and CATALOGUE-CORE.md files in the revision. Let me read all remaining files I haven't read yet.

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/planning/plan-session/node-library/CATALOGUE.md"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/planning/plan-session/node-library/CATALOGUE.md</path>
<type>file</type>
<content>
1: # Node Library Catalogue
2:
3: ## Structural Rules
4:
5: - **No loops.** Execution DAGs are acyclic — no node may appear on a path back to itself. Retries are implemented as unrolled sequences: `work → verify → fix → verify-retry → [converge | write-notes-failure]`. Each retry adds explicit nodes; there is no "loop back" construct.
6: - Every path terminates at a leaf node — no dead ends.
7: - Every leaf node should be a `write-notes` node that captures context before exit.
8: - Branches are mutually exclusive paths — parallel work is unsupported.
9:
10: ## Core
11:
12: | Component | Description |
13: |-----------|-------------|
14: | `work-item` | Any project mutation — code changes, file edits, refactors, documentation updates. |
15: | `project-search-and-analysis` | Investigation without mutation. Use before work-item when current state needs to be understood first. |
16: | `external-scout` | External research via external-scout behind a user approval gate. |
17: | `deep-research` | Comprehensive research on novel or frontier topics via deep-researcher. Rarely needed — most research belongs in external-scout. |
18: | `write-notes` | Store accumulated findings, decisions, and constraints to semantic notes. Use as leaf nodes to capture context before exit — both success and failure paths should end with a write-notes node. |
19: | `compress` | Compress closed conversation sections to free context window space. Always followed by kickoff-refresher. |
20: | `kickoff-refresher` | Realign the agent after context compression. Always placed after compress. |
21: | `sequential-thinking` | Pure reasoning step with no side effects. |
22:
23: ## Logic
24:
25: | Component | Description |
26: |-----------|-------------|
27: | `verify` | Branching verification node. Always placed after work-item. Must have exactly 2 children: the next step (pass) and a fix path (fail). Use this — not decision-gate — for verifying implementation outcomes. |
28: | `decision-gate` | Executor assesses accumulated evidence and chooses which branch to take. Must have exactly 2 children. Use for runtime decisions based on prior findings, not for verifying implementation. |
29: | `user-decision-gate` | User chooses which branch to take. Must have exactly 2 children. |
30:
31: ## Operations
32:
33: | Component | Description |
34: |-----------|-------------|
35: | `run-project-commands` | Shell command execution via tailwrench. Required when work-items depend on state that only a command can produce — installing dependencies, running build/generation tools, executing scaffolding CLIs, initializing submodules, or running setup scripts. Place before the work-item that needs the result. |
36: | `commit` | Git checkpoint at a meaningful save point. Placed after successful verify. |
37:
38: ## General
39:
40: | Component | Description |
41: |-----------|-------------|
42: | `user-discussion` | Free-form conversation with the user mid-execution. |
43: | `autonomous-work` | Delegates to autonomous-agent. Only include when user explicitly approved autonomous work during planning. |

(End of file - total 43 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/planning/plan-session/node-library/CATALOGUE-CORE.md"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/planning/plan-session/node-library/CATALOGUE-CORE.md</path>
<type>file</type>
<content>
1: # Node Library Catalogue — Core Components
2:
3: This catalogue contains the structural building blocks for execution DAGs. Use only these components for the initial design pass.
4:
5: ## Structural Rules
6:
7: - **No loops.** Execution DAGs are acyclic — no node may appear on a path back to itself. Retries are implemented as unrolled sequences: `work → verify → fix → verify-retry → [converge | write-notes-failure]`. Each retry adds explicit nodes; there is no "loop back" construct.
8: - Every path terminates at a leaf node — no dead ends.
9: - Every leaf node should be a `write-notes` node that captures context before exit.
10: - Branches are mutually exclusive paths — parallel work is unsupported.
11:
12: ## Core
13:
14: | Component | Description |
15: |-----------|-------------|
16: | `work-item` | Any project mutation — code changes, file edits, refactors, documentation updates. |
17: | `project-search-and-analysis` | Investigation without mutation. Use before work-item when current state needs to be understood first. |
18: | `write-notes` | Store accumulated findings, decisions, and constraints to semantic notes. Use as leaf nodes to capture context before exit — both success and failure paths should end with a write-notes node. |
19: | `compress` | Compress closed conversation sections to free context window space. Always followed by kickoff-refresher. |
20: | `kickoff-refresher` | Realign the agent after context compression. Always placed after compress. |
21: | `sequential-thinking` | Pure reasoning step with no side effects. |
22:
23: ## Logic
24:
25: | Component | Description |
26: |-----------|-------------|
27: | `verify` | Branching verification node. Always placed after work-item. Must have exactly 2 children: the next step (pass) and a fix path (fail). Use this — not decision-gate — for verifying implementation outcomes. |
28: | `decision-gate` | Executor assesses accumulated evidence and chooses which branch to take. Must have exactly 2 children. Use for runtime decisions based on prior findings, not for verifying implementation. |
29:
30: ## Operations
31:
32: | Component | Description |
33: |-----------|-------------|
34: | `run-project-commands` | Shell command execution via tailwrench. Required when work-items depend on state that only a command can produce — installing dependencies, running build/generation tools, executing scaffolding CLIs, initializing submodules, or running setup scripts. Place before the work-item that needs the result. |
35: | `commit` | Git checkpoint at a meaningful save point. Placed after successful verify. |

(End of file - total 35 lines)
</content>
```

---

## Assistant (Build · Claude Sonnet 4.6 · 4.2s)

Good. Now let me read the remaining skill and agent files.

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-review-criteria/SKILL.md"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-review-criteria/SKILL.md</path>
<type>file</type>
<content>
1: ---
2: name: dag-review-criteria
3: description: Teaches how to evaluate execution DAGs — structural anti-patterns, specialist node assessment, complexity analysis, and sophisticated routing patterns.
4: ---
5: # What does this skill teach?
6:
7: In this skill, you learn how to evaluate a first-pass execution DAG and produce actionable critique that will guide a second-pass reviser. Your review has three parts, in order.
8:
9: You are NOT building or fixing the DAG — you are analyzing it and recommending improvements. You do not need to know how to build a DAG. You need to know what a good DAG looks like and what questions to ask yourself to find the gaps.
10:
11: ## Part 1: Structural Correctness
12:
13: Check these structural rules. If any are violated, flag them — but the first-pass designer is reliable at getting structure right. These are safety nets.
14:
15: ### Rules
16:
17: - Every path terminates at a leaf node — no dead ends
18: - Every `verify` node has exactly 2 children (pass and fail)
19: - Every `decision-gate` has exactly 2 children
20: - Every leaf node is a `write-notes` node
21: - No orphaned nodes or disconnected subgraphs
22: - Branches are mutually exclusive — no parallel work
23:
24: ### Anti-patterns to flag
25:
26: - **Unbounded work chains**: Three or more `work-item` nodes in sequence with no `verify` between them — work should be verified incrementally
27: - **Missing investigation**: A `work-item` that operates on unfamiliar territory with no preceding `project-search-and-analysis` — the executor needs to understand the current state before mutating it
28: - **Verify without fix path**: A `verify` whose fail path goes directly to a leaf with no attempt to fix — at minimum, one retry should be attempted
29: - **Over-retrying**: More than 2 retries for a single verify chain on a simple task — diminishing returns
30: - **Dead-end decision gates**: A `decision-gate` where both branches lead to the same path — the gate adds complexity without value
31:
32: ## Part 2: What to Add
33:
34: The first-pass DAG uses only core components. Your job is to determine what specialist nodes are missing. There are three layers to this assessment, each requiring a different approach.
35:
36: The caller will provide **tentative answers** from the orchestrator's assessment. Use those as starting points — agree, disagree, or refine them based on your own analysis.
37:
38: ### Hard Triggers
39:
40: These are non-negotiable. If the condition is met, the recommendation follows.
41:
42: - **Technology decision → external research → implementation.** When a `decision-gate` resolves which technology, library, or framework to use, an `external-scout` node MUST be placed between the decision and the implementation work. The research covers: how to add the dependency, what the API surface looks like, and whether there are environment or platform concerns. This is a sequencing requirement — research comes after the choice is made and before the work begins.
43: - **`external-scout` vs `deep-research` scope.** `deep-research` is for novel algorithms, cutting-edge approaches, or frontier techniques that require comprehensive autonomous investigation — it is rarely needed. It is NOT for evaluating established options, scoping implementation details, or comparing common tools. Standard `external-scout` (which includes a user approval gate) handles those cases. If a plan uses `deep-research` for routine technology evaluation, flag it as a scope violation and recommend `external-scout` instead.
44: - **External dependencies → external research.** If the task involves external dependencies, APIs, frameworks, or libraries, an `external-scout` node is almost certainly needed. The cost of scouting is far lower than implementing against wrong assumptions. The question is where to place it, not whether to include it.
45: - **Shell prerequisites → `run-project-commands`.** The `work-item` executor can edit files but cannot run commands. If any work-item depends on state that only a shell command can produce, a `run-project-commands` node must precede it. The most common case is dependency installation: researching what to add (`external-scout`) and writing code that uses it (`work-item`) are separate from actually installing it (`run-project-commands`). The same principle applies to any command-produced prerequisite — generated code from protobuf/OpenAPI compilers, scaffolded project structures from CLI tools, build artifacts from cmake/make, initialized submodules, or setup scripts that configure the environment. Ask: *does any work-item in this DAG assume something exists that only a shell command can produce?*
46:
47: ### Reasoning Triggers
48:
49: For some node types, you cannot rely on fixed rules — you need to reason about the specific plan to discover what's needed. The reasoning is scoped: you're answering a specific question, and each answer you find IS the trigger.
50:
51: **Decisions.** Ask yourself: *What decisions am I seeing that must be made during execution?* Walk through the plan and identify every point where the executor will face a choice — between implementation approaches, between tools, between strategies. Each decision you find is a trigger for a `decision-gate` or `user-decision-gate`. Consider:
52:
53: - Are there decisions that can only be made after a prior decision has been executed? If so, cascading `decision-gate` nodes may be warranted.
54: - Would a single decision gate at the top be a false simplification of what is actually a sequence of dependent decisions?
55: - Is this a decision the executor can make from evidence, or does it require user preference? The former is `decision-gate`, the latter is `user-decision-gate`.
56:
57: **Complexity routing.** Ask yourself: *Is the task's true complexity knowable only after investigation?* If the plan might turn out to be trivial once investigated, or much harder than expected, consider a short-path / long-path pattern: initial investigation followed by a `decision-gate` that routes to either a quick execution path or a thorough one.
58:
59: **User checkpoints.** Ask yourself: *Are there points where user input would prevent wasted effort?* Ambiguous requirements, aesthetic choices, or decisions that depend on user preference — these are triggers for `user-discussion` or `user-decision-gate` nodes.
60:
61: ### Open Assessment
62:
63: Beyond hard triggers and reasoning triggers, consider what else could substantially improve this DAG. There is no prescribed set of things to look for here — every plan is different.
64:
65: ### Retry Count Assessment
66:
67: For each `verify` node in the DAG, assess the retry count individually:
68:
69: - **Simple, well-understood work** → 1 retry is sufficient
70: - **Complex, multi-file, or integration-sensitive work** → 2 retries may be warranted
71: - **Predictable failure modes** (clear error messages) → 1 retry. **Ambiguous failure modes** → more retries
72: - **High blast radius** (many files, cross-module) → recommend 2 retries
73:
74: ## Part 3: How to Use Them
75:
76: This is the bulk of your review. Once you know what nodes to add, the harder question is how to place them — scope, decomposition, sequencing, branching structure, and early-exit pathways.
77:
78: ### Placement and Sequencing
79:
80: For every node you recommend adding, specify:
81: - **Where it goes** — which existing nodes it sits between, and why that position matters
82: - **What it depends on** — what information or decisions must exist before this node executes
83: - **What depends on it** — what downstream work changes because this node's output is now available
84:
85: ### Decomposition
86:
87: When recommending `external-scout` nodes, consider how many are needed and what each one covers:
88: - One broad research node before a work phase, or multiple targeted nodes each covering a specific question?
89: - If multiple, should they be sequential (each builds on the last) or independent (each covers a different angle)?
90:
91: ### Branching Structure
92:
93: For every `decision-gate` or `user-decision-gate` you recommend:
94: - What are the exactly 2 branches? Name them concretely.
95: - What is the evidence or criteria that determines which branch is taken?
96: - Do the branches reconverge, or do they lead to different outcomes?
97: - Are there early-exit opportunities? If one branch discovers the task is impossible or unnecessary, can the DAG exit early through a `write-notes` leaf rather than continuing?
98:
99: ### Early Exits
100:
101: Look for places where the DAG should be able to terminate early rather than continuing through all phases:
102: - After investigation reveals the task is unnecessary or already done
103: - After a decision gate where one branch means "no further work needed"
104: - After a verify that reveals the scope has changed fundamentally
105:
106: Each early exit needs its own `write-notes` leaf to capture why execution stopped.
107:
108: ### Execution-Phase Investigation
109:
110: Does the DAG include enough investigation before work? The planning scout provides a broad overview, but the executor may need targeted investigation of specific files, patterns, or dependencies before each work phase. Should `project-search-and-analysis` nodes precede major work phases?
111:
112: ## How to structure your critique
113:
114: For each finding, provide:
115: 1. **The specific node IDs involved**
116: 2. **What the issue or opportunity is**
117: 3. **Your recommendation**
118: 4. **Your reasoning**
119:
120: Organize in priority order: most impactful improvements first.
121:
122: ## How to think through this skill
123:
124: <|think|>
125: - Have I completed the structural pass before moving to the deeper analysis?
126: - For hard triggers: Have I checked every condition and applied the rule mechanically?
127: - For reasoning triggers: Have I walked through the plan asking the scoped questions? What decisions did I find? What complexity uncertainty exists? Where would user input prevent waste?
128: - For open assessment: Is there anything else that would substantially improve this plan that the triggers didn't catch?
129: - For how to use: Have I specified placement, sequencing, and branching for every node I recommended? Am I giving the reviser enough to act on?
130: - Am I grounding every critique in specific node IDs?

(End of file - total 130 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-revision-example/SKILL.md"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-revision-example/SKILL.md</path>
<type>file</type>
<content>
1: ---
2: name: dag-revision-example
3: description: Worked example of DAG revision — inserting nodes mid-chain, extending retry paths, rerouting edges, and avoiding orphans.
4: ---
5: # DAG Revision Example
6:
7: This skill provides worked examples of revising an existing DAG. You are not building from scratch — the DAG already exists. Your job is to modify it based on reviewer feedback.
8:
9: ## Starting state
10:
11: Assume a first-pass DAG that looks like this:
12:
13: ```
14: (research-framework) → (select-framework) → (notes-framework-selected)
15: (notes-framework-selected) → (plan-blueprint) → (verify-blueprint) → [fix-blueprint, notes-blueprint-approved]
16: (fix-blueprint) → (verify-blueprint-retry) → [notes-blueprint-approved, notes-blueprint-failure]
17: (notes-blueprint-approved) → (research-hookup) → (verify-hookup) → [fix-hookup, notes-hookup-success]
18: (fix-hookup) → (verify-hookup-retry) → [notes-hookup-success, notes-hookup-failure]
19: (notes-hookup-success) → (implement) → (notes-complete)
20: ```
21:
22: ## Revision operations
23:
24: ### Pattern 1: Insert a node mid-chain with `insert_between`
25:
26: **Goal:** Insert an `external-scout` node between `select-framework` and `notes-framework-selected`.
27:
28: This is the most common revision operation. Use `insert_between` — it atomically removes the old edge and adds the new path in one call. Never do this manually with `delete_edge` + `connect_nodes` — that creates intermediate orphan states and is error-prone.
29:
30: ```
31: # Step 1: Create the new node
32: add_node(plan_name="my-plan", nodeId="scout-framework-recipes", component_name="external-scout")
33:
34: # Step 2: Insert it atomically between the two existing nodes
35: insert_between(plan_name="my-plan", from="select-framework", to="notes-framework-selected", new_node="scout-framework-recipes")
36:
37: # Result:
38: # (select-framework) → (scout-framework-recipes) → (notes-framework-selected)
39: ```
40:
41: ### Pattern 2: Insert a node before a branching point
42:
43: **Goal:** Insert a `user-decision-gate` between `scout-framework-recipes` and `notes-framework-selected`.
44:
45: Same pattern — `insert_between` works on any existing edge:
46:
47: ```
48: add_node(plan_name="my-plan", nodeId="gate-framework-choice", component_name="user-decision-gate")
49: insert_between(plan_name="my-plan", from="scout-framework-recipes", to="notes-framework-selected", new_node="gate-framework-choice")
50:
51: # Result:
52: # (scout-framework-recipes) → (gate-framework-choice) → (notes-framework-selected)
53: #
54: # But wait — user-decision-gate needs exactly 2 children (it's a binary decision).
55: # The insert gave it 1 child (notes-framework-selected). We need to add the second branch.
56: # For a decision gate, one branch continues and the other typically routes back for more research.
57: connect_nodes(plan_name="my-plan", edges='{"gate-framework-choice": "research-framework"}')
58:
59: # Result:
60: # (gate-framework-choice) → [notes-framework-selected, research-framework]
61: ```
62:
63: ### Pattern 3: Extend a retry path (add more retries to an existing verify-retry chain)
64:
65: **Goal:** Increase the hookup retry depth from 1 to 2.
66:
67: The existing chain is:
68: ```
69: (research-hookup) → (verify-hookup) → [fix-hookup, notes-hookup-success]
70: (fix-hookup) → (verify-hookup-retry) → [notes-hookup-success, notes-hookup-failure]
71: ```
72:
73: To add a second retry, you need to intercept the failure exit from `verify-hookup-retry` and route it through a new fix-verify cycle instead:
74:
75: ```
76: # Step 1: Create the new retry nodes
77: add_nodes_to_dag(plan_name="my-plan", nodes='{"fix-hookup-2": "work-item", "verify-hookup-retry-2": "verify", "notes-hookup-failure-2": "write-notes"}')
78:
79: # Step 2: Remove the old failure edge from verify-hookup-retry to notes-hookup-failure
80: delete_edge(plan_name="my-plan", from="verify-hookup-retry", to="notes-hookup-failure")
81:
82: # Step 3: Wire the new retry cycle
83: connect_nodes(plan_name="my-plan", edges='{"verify-hookup-retry": "fix-hookup-2", "fix-hookup-2": "verify-hookup-retry-2", "verify-hookup-retry-2": ["notes-hookup-success", "notes-hookup-failure-2"]}')
84:
85: # Step 4: The old notes-hookup-failure is now orphaned — delete it since it's been replaced
86: delete_node(plan_name="my-plan", nodeId="notes-hookup-failure")
87:
88: # Result:
89: # (fix-hookup) → (verify-hookup-retry) → [notes-hookup-success, fix-hookup-2]
90: # (fix-hookup-2) → (verify-hookup-retry-2) → [notes-hookup-success, notes-hookup-failure-2]
91: ```
92:
93: > **Key insight:** When extending retry paths, always: (1) create new nodes first, (2) remove the old failure edge, (3) wire the new cycle, (4) clean up the orphaned old failure node.
94:
95: ### Pattern 4: Reroute a failure path through a new node
96:
97: **Goal:** Route `notes-blueprint-failure` through a `user-discussion` node before terminating.
98:
99: ```
100: # Step 1: Create the new nodes
101: add_nodes_to_dag(plan_name="my-plan", nodes='{"discuss-blueprint-failure": "user-discussion", "notes-blueprint-failure-final": "write-notes"}')
102:
103: # Step 2: Disconnect the old failure leaf from its parent
104: delete_edge(plan_name="my-plan", from="verify-blueprint-retry", to="notes-blueprint-failure")
105:
106: # Step 3: Wire the new failure path: parent → discussion → final write-notes
107: connect_nodes(plan_name="my-plan", edges='{"verify-blueprint-retry": "discuss-blueprint-failure", "discuss-blueprint-failure": "notes-blueprint-failure-final"}')
108:
109: # Step 4: Clean up the old orphaned failure node
110: delete_node(plan_name="my-plan", nodeId="notes-blueprint-failure")
111:
112: # Result:
113: # (verify-blueprint-retry) → [notes-blueprint-approved, discuss-blueprint-failure]
114: # (discuss-blueprint-failure) → (notes-blueprint-failure-final)
115: ```
116:
117: ### Pattern 5: Insert a prerequisite node before an existing node (multiple parents)
118:
119: **Goal:** Add a `run-project-commands` node before `research-hookup`. But `research-hookup` has a parent (`notes-blueprint-approved`).
120:
121: Use `insert_between` — it handles this cleanly:
122:
123: ```
124: add_node(plan_name="my-plan", nodeId="install-deps", component_name="run-project-commands")
125: insert_between(plan_name="my-plan", from="notes-blueprint-approved", to="research-hookup", new_node="install-deps")
126:
127: # Result:
128: # (notes-blueprint-approved) → (install-deps) → (research-hookup)
129: ```
130:
131: ## Common mistakes to avoid
132:
133: 1. **Never use `delete_edge` + `connect_nodes` when `insert_between` works.** The manual two-step creates intermediate orphan states that confuse later operations. `insert_between` is atomic.
134:
135: 2. **Always `get_compact_dag_draft` after each structural change.** Don't batch multiple changes and check once at the end — verify incrementally so you catch problems early.
136:
137: 3. **Clean up orphaned nodes immediately.** When you `delete_edge` and a node becomes unreachable, either reconnect it or `delete_node` it before continuing. Don't leave orphans accumulating.
138:
139: 4. **Don't re-set entry/exit points during revision.** The headwrench agent clears these before delegating to you. Focus on the structural changes. Entry and exit points are set after you're done.
140:
141: ## Thinking through this skill
142:
143: <|think|>
144: - For each critique point, which pattern above applies? Most revision operations are one of these five patterns.
145: - Am I using `insert_between` for mid-chain insertions instead of manual delete+connect?
146: - Am I checking `get_compact_dag_draft` after each structural change?
147: - Am I cleaning up orphaned nodes immediately after they become unreachable?
148: - Have I written my target adjacency list before making changes?

(End of file - total 148 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-tools/SKILL.md"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-tools/SKILL.md</path>
<type>file</type>
<content>
1: ---
2: name: dag-tools
3: description: Teaches how to build, modify, review, and validate execution DAGs using DAG manipulation and design tools.
4: ---
5:
6: # What does this skill teach?
7:
8: In this skill, you learn how to build, modify, validate, and visualize execution DAGs using the DAG manipulation tools.
9:
10: ## Related Tools
11:
12: ### `get_planning_components_catalogue`
13:
14: | Parameter | Description |
15: |-----------|-------------|
16: | *(none)* | Returns the full CATALOGUE.md listing all available node component types |
17:
18:
19: ### `init_dag`
20:
21: | Parameter | Description |
22: |-----------|-------------|
23: | `plan_name` | Name for the new session plan — lowercase, hyphens only, no spaces (required) |
24:
25: Creates a new DAG with the given name.
26:
27: ### `add_nodes_to_dag`
28:
29: | Parameter | Description |
30: |-----------|-------------|
31: | `plan_name` | Name of the session plan to add nodes to (required) |
32: | `nodes` | Dictionary mapping nodeId → component_name, e.g. `{ "investigate": "external-scout", "implement": "work-item" }` (required) |
33:
34: Adds all nodes in a single batch call. Use this after `init_dag` to create all work nodes at once.
35:
36: ### `add_node`
37:
38: | Parameter | Description |
39: |-----------|-------------|
40: | `plan_name` | Name of the session plan to add the node to (required) |
41: | `nodeId` | Unique ID for the new node (required) |
42: | `component_name` | Component type from the node library, e.g. `'work-item'`, `'verify'` (required) |
43:
44: Adds a single node. Prefer `add_nodes_to_dag` for creating multiple nodes at once.
45:
46: ### `connect_nodes`
47:
48: | Parameter | Description |
49: |-----------|-------------|
50: | `plan_name` | Name of the session plan (required) |
51: | `edges` | Dictionary mapping from-nodeId to to-nodeId (or array of to-nodeIds for fan-out), e.g. `{"work-A": "verify-A", "verify-A": ["fix-A", "work-B"]}` (required) |
52:
53: Wires multiple directed edges in a single batch call. All referenced nodes must already exist in the DAG.
54:
55: ### `insert_between`
56:
57: | Parameter | Description |
58: |-----------|-------------|
59: | `plan_name` | Name of the session plan (required) |
60: | `from` | ID of the upstream (parent) node (required) |
61: | `new_node` | ID of the node to insert — must already exist in the DAG (required) |
62: | `to` | ID of the downstream (child) node (required) |
63:
64: Atomically inserts `new_node` between `from` and `to`. Removes the edge `from → to` and adds `from → new_node → to` in one operation. Use this when adding a node mid-chain to avoid accidentally creating orphans or extra children. The node must already exist (create it first with `add_node` or `add_nodes_to_dag`).
65:
66: ### `set_entry_point`
67:
68: | Parameter | Description |
69: |-----------|-------------|
70: | `plan_name` | Name of the session plan (required) |
71: | `node_id` | ID of the node that should execute first when the plan starts (required) |
72:
73: Sets where execution begins. Call this once in the final wiring step (Stage 3).
74:
75: ### `set_exit_point`
76:
77: | Parameter | Description |
78: |-----------|-------------|
79: | `plan_name` | Name of the session plan (required) |
80: | `node_id` | ID of the leaf node to mark as an exit point (required) |
81: | `type` | Exit type: `'success'` or `'failure'` (required) |
82:
83: Marks a leaf node as a plan exit. Call this for every leaf node in the final wiring step (Stage 3). Use `'success'` for happy-path exits and `'failure'` for retry-exhaustion/error exits.
84:
85: ### `delete_edge`
86:
87: | Parameter | Description |
88: |-----------|-------------|
89: | `plan_name` | Name of the session plan (required) |
90: | `from` | ID of the source (parent) node (required) |
91: | `to` | ID of the target (child) node to disconnect — node is not deleted, only the edge (required) |
92:
93: ### `delete_node`
94:
95: | Parameter | Description |
96: |-----------|-------------|
97: | `plan_name` | Name of the session plan (required) |
98: | `nodeId` | ID of the node to delete — all edges to and from it are removed; children become orphaned (required) |
99:
100: ### `get_compact_dag_draft`
101:
102: | Parameter | Description |
103: |-----------|-------------|
104: | `target` | Session plan name or raw path to plan.jsonl (required) |
105:
106: Returns the DAG in a compact format showing connected nodes, orphaned groups, and entry/exit status. Use this to inspect structure during design.
107:
108: ### `get_dag_draft_diagram`
109:
110: | Parameter | Description |
111: |-----------|-------------|
112: | `target` | Session plan name or raw path to plan.jsonl (required) |
113:
114: ### `present_dag_diagram`
115:
116: | Parameter | Description |
117: |-----------|-------------|
118: | `plan_name` | Session plan name — throws if the DAG has structural errors (required) |
119:
120: ### `validate_dag`
121:
122: | Parameter | Description |
123: |-----------|-------------|
124: | `plan_name` | Session plan name — throws on any structural issue (required) |

(End of file - total 124 lines)
</content>
```

---

## Assistant (Build · Claude Sonnet 4.6 · 4.4s)

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-designer.md"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-designer.md</path>
<type>file</type>
<content>
1: ---
2: name: dag-designer
3: description: "DAG Designer — builds first-pass MVP execution DAGs from the core component library."
4: color: "#8b5cf6"
5: mode: subagent
6: permission:
7:     "*": deny
8:     add_node: allow
9:     add_nodes_to_dag: allow
10:     connect_nodes: allow
11:     delete_node: allow
12:     delete_edge: allow
13:     set_entry_point: allow
14:     set_exit_point: allow
15:     get_compact_dag_draft: allow
16:     get_dag_draft_diagram: allow
17:     validate_dag: allow
18:     get_planning_components_catalogue: allow
19:     qdrant_qdrant-store: allow
20:     qdrant_qdrant-find: allow
21:     skill:
22:         "*": deny
23:         qdrant-notes: allow
24:         dag-tools: allow
25:         build-dags-core: allow
26:         dag-design-example: allow
27: ---
28:
29: # Role
30:
31: You are @dag-designer, a first-pass DAG construction specialist. You build MVP execution DAGs from the core component catalogue — a solid structural skeleton that a reviewer and reviser will improve in subsequent passes. Focus on getting the phases, verification, and convergence right. Do not overthink specialist node selection — that comes later.
32:
33: <|think|>
34: - What are your required skills? Did you load them before doing anything else?
35: - You are building a first-pass MVP — not a final product. Keep it structurally clean.
36: - You use the core catalogue only (`variant="core"`), never the full catalogue.
37:
38: ## How to Respond
39:
40: 1. If you were provided the name of a session plan being worked on, use the `qdrant_qdrant-store` tool to store session notes from your work so they can be accessed later. Use the plan name as the `collection_name` argument.
41: 2. After storing any session notes, respond via a direct response to the caller with the completed DAG name and rationale for key design decisions (branching structure, verification placement, failure handling). Do not write your session summary to any summary files, they will be ignored.
42:
43: ## Required Skills
44:
45: - `dag-design-example`
46: - `build-dags-core`
47: - `dag-tools`
48: - `qdrant-notes`
49:
50: ## Methodology
51:
52: <|think|>
53: 2. Load `dag-tools`
54: 4. Load `dag-design-example` and `build-dags-core` together
55: 4. Review the example DAG design and think through how the patterns used there can be applied to your current plan's DAG design
56: 3. Think through the `build-dags-core` skill, plan your approach from start to finish, and only then can you begin
57:
58: ## Operational Constraints
59:
60: - Always call `get_planning_components_catalogue` with `variant="core"` — never use the full catalogue
61: - Build and wire all work nodes first, then use `set_entry_point` and `set_exit_point` as the final construction step
62: - Every leaf node should be a `write-notes` node that captures context before exit — use `set_exit_point` to mark each one as a success or failure exit
63: - Default to 1 retry per verify-retry structure — the reviewer will adjust if needed

(End of file - total 63 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-reviewer.md"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-reviewer.md</path>
<type>file</type>
<content>
1: ---
2: name: dag-reviewer
3: description: "DAG Reviewer — evaluates execution DAGs for structural correctness and recommends improvements through deep analysis."
4: color: "#10b981"
5: mode: subagent
6: permission:
7:     "*": deny
8:     get_compact_dag_draft: allow
9:     get_dag_draft_diagram: allow
10:     validate_dag: allow
11:     get_planning_components_catalogue: allow
12:     qdrant_qdrant-store: allow
13:     qdrant_qdrant-find: allow
14:     skill:
15:         "*": deny
16:         qdrant-notes: allow
17:         dag-tools: allow
18:         dag-review-criteria: allow
19: ---
20:
21: # Role
22:
23: You are @dag-reviewer, a DAG critique and analysis specialist. You evaluate first-pass execution DAGs for structural correctness AND — more importantly — analyze whether the DAG needs specialist nodes, more sophisticated routing patterns, or adjusted retry depths. You do not build or fix DAGs. You produce critiques and recommendations that guide the reviser.
24:
25: <|think|>
26: - How does your role influence your approach to tasks?
27: - What are your required skills? Have you loaded them yet?
28: - What tools do you have access to? How do you use them?
29: - How do you respond once you've completed all your work?
30: - What's your methodology?
31: - What are your operational constraints?
32:
33: ## How to Respond
34:
35: 1. If you were provided the name of a session plan being worked on, use the `qdrant_qdrant-store` tool to store session notes from your work so they can be accessed later. Use the plan name as the `collection_name` argument.
36: 2. After storing any session notes, respond via a direct response to the caller as a structured critique organized in two sections: (1) Structural Findings — quick-pass anti-pattern checks, and (2) Deep Analysis — specialist node recommendations, routing pattern improvements, retry count adjustments, and user interaction opportunities. Point to specific node IDs with evidence for every finding. Do not write your session summary to any summary files, they will be ignored.
37:
38: ## Required Skills
39:
40: - `dag-tools`
41: - `dag-review-criteria`
42: - `qdrant-notes`
43:
44: > [!IMPORTANT]
45: > Always load your required skills as the first thing you do before doing any work, these teach you important aspects of your workflow.
46:
47: ## Methodology
48:
49: 1. Load your required skills.
50: 2. Decompose the caller's request into the review dimensions from `dag-review-criteria`.
51: 3. If you were provided the name of a session plan, use the `qdrant_qdrant-find` tool with the plan name as the `collection_name` argument to search for relevant session notes (including the original design goal and the orchestrator's tentative assessment answers).
52: 4. Call `get_dag_draft_diagram` for a structural overview, then `get_compact_dag_draft` for full node-level detail, then `get_planning_components_catalogue` (full variant) to see all available components including specialist nodes.
53: 5. Run Part 1 (Structural Validation) from `dag-review-criteria` — this should be quick.
54: 6. Run Part 2 (Deep Analysis) from `dag-review-criteria` — this is the bulk of your review. Use the orchestrator's tentative answers as starting points for your analysis.
55:
56: ## Operational Constraints
57:
58: - Always load the full DAG structure before reviewing — never critique from memory or partial information
59: - Always point to specific node IDs with evidence for every finding — no general observations without grounding
60: - Always provide critiques and recommendations only — never propose specific DAG restructurings, node-by-node adjacency lists, or alternative designs
61: - Always use the full catalogue (`get_planning_components_catalogue` without variant, or with `variant="full"`) so you can recommend specialist nodes
62: - Always store your findings before writing your final response
63: - Spend the majority of your review on Part 2 (Deep Analysis), not Part 1 (Structural Validation)

(End of file - total 63 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-reviser.md"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-reviser.md</path>
<type>file</type>
<content>
1: ---
2: name: dag-reviser
3: description: "DAG Reviser — improves execution DAGs using the full component library and reviewer feedback."
4: color: "#a855f7"
5: mode: subagent
6: permission:
7:     "*": deny
8:     add_node: allow
9:     add_nodes_to_dag: allow
10:     connect_nodes: allow
11:     insert_between: allow
12:     delete_node: allow
13:     delete_edge: allow
14:     set_entry_point: allow
15:     set_exit_point: allow
16:     get_compact_dag_draft: allow
17:     get_dag_draft_diagram: allow
18:     validate_dag: allow
19:     get_planning_components_catalogue: allow
20:     qdrant_qdrant-store: allow
21:     qdrant_qdrant-find: allow
22:     skill:
23:         "*": deny
24:         qdrant-notes: allow
25:         dag-tools: allow
26:         revise-dags: allow
27:         dag-revision-example: allow
28: ---
29:
30: # Role
31:
32: You are @dag-reviser, a second-pass DAG improvement specialist. You take a structurally valid first-pass DAG and substantially improve it using the full component catalogue and the reviewer's critique. Your job is not just to fix issues — it is to elevate the DAG from a working skeleton into a well-designed execution plan.
33:
34: <|think|>
35: - What are your required skills? Did you load them before doing anything else?
36: - How do you use `delete_node` and `delete_edge` to revise DAGs?
37: - You have access to the FULL catalogue — specialist nodes like research, deep-research, user-discussion, user-decision-gate, autonomous-work are available to you
38: - You are improving an existing DAG, not building from scratch
39:
40: ## How to Respond
41:
42: 1. If you were provided the name of a session plan being worked on, use the `qdrant_qdrant-store` tool to store session notes from your work so they can be accessed later. Use the plan name as the `collection_name` argument.
43: 2. After storing any session notes, respond via a direct response to the caller with a summary of what you changed and why — covering each critique point addressed and any additional improvements you identified. Do not write your session summary to any summary files, they will be ignored.
44:
45: ## Required Skills
46:
47: - `dag-revision-example`
48: - `revise-dags`
49: - `dag-tools`
50: - `qdrant-notes`
51:
52: ## Methodology
53:
54: <|think|>
55: 1. Load `dag-tools`
56: 2. Load `dag-revision-example` and `revise-dags` together
57: 3. Call `get_planning_components_catalogue` with the full catalogue (no variant, or `variant="full"`) to see all available components including specialist nodes
58: 4. Call `get_compact_dag_draft` and `get_dag_draft_diagram` to fully understand the current DAG
59: 5. Use `qdrant_qdrant-find` with the plan name to retrieve session notes, including the reviewer's critique
60: 6. Plan your revisions before making any changes — write the target adjacency list first
61: 7. For each critique point, identify which revision pattern applies (insert mid-chain, extend retries, reroute failure path, etc.) and use the appropriate tool — prefer `insert_between` for mid-chain insertions
62: 8. Verify with `get_compact_dag_draft` after each structural change
63: 9. Validate the final DAG
64:
65: ## Operational Constraints
66:
67: - Entry and exit points have been cleared before you start — focus only on structural changes (adding nodes, inserting between, rewiring edges)
68: - When you're done with structural changes, set entry and exit points as your final step before validating
69: - Always call `get_planning_components_catalogue` with the full catalogue — you have access to all components
70: - Always load the current DAG structure before making any changes — never revise from memory
71: - Always plan revisions before executing — write the target adjacency list, then identify the diff
72: - Prefer `insert_between` for inserting nodes mid-chain — never manually `delete_edge` + `connect_nodes` when `insert_between` works
73: - After any `delete_node`, immediately rewire orphaned children before continuing
74: - Check `get_compact_dag_draft` after each structural change — don't batch multiple changes without verifying
75: - Every leaf node should be a `write-notes` node — maintain this invariant through all revisions
76: - Call `validate_dag` when all revisions are complete

(End of file - total 76 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-description-author.md"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-description-author.md</path>
<type>file</type>
<content>
1: ---
2: name: dag-description-author
3: description: "DAG Description Author — writes per-node context descriptions that guide the executing agent."
4: color: "#c084fc"
5: mode: subagent
6: permission:
7:     "*": deny
8:     get_compact_dag_draft: allow
9:     get_dag_draft_diagram: allow
10:     add_description_to_node: allow
11:     get_planning_components_catalogue: allow
12:     qdrant_qdrant-find: allow
13:     skill:
14:         "*": deny
15:         qdrant-notes: allow
16: ---
17:
18: # Role
19:
20: You are @dag-description-author. You write per-node descriptions for execution DAGs. Each description tells the executing agent what this specific node should accomplish — not what the component type does generically, but what work is needed here in the context of this plan.
21:
22: <|think|>
23: - What are your required skills? Did you load them before doing anything else?
24: - Descriptions are execution context, not instructions. The component prompt already has instructions.
25: - Good descriptions answer: "What specifically should the executor do at this node, given the plan's goals?"
26: - Bad descriptions repeat what the component type already says.
27:
28: ## How to Respond
29:
30: 1. Store session notes about the descriptions you wrote using `qdrant_qdrant-store` if a plan name was provided.
31: 2. Respond with a summary of the descriptions you wrote and any nodes you intentionally left without descriptions.
32:
33: ## Required Skills
34:
35: - `qdrant-notes`
36:
37: > [!IMPORTANT]
38: > Always load your required skills as the first thing you do before doing any work, these teach you important aspects of your workflow.
39:
40: ## Methodology
41:
42: 1. Use `qdrant_qdrant-find` to retrieve the planning context — the user's original request, the scout's findings, the planner's rationale.
43: 2. Use `get_dag_draft_diagram` and `get_compact_dag_draft` to understand the DAG structure.
44: 3. Use `get_planning_components_catalogue` to understand what each component type does — so you don't repeat that in your descriptions.
45: 4. For each work node, write a description that explains what this specific node should accomplish. Ground descriptions in the plan's goals and the planning context.
46: 5. Use `add_description_to_node` to set each description.
47:
48: ## Writing Descriptions
49:
50: A description should tell the executor what to do at this node that the static component prompt cannot. Focus on:
51:
52: - **What specifically to investigate, build, or change** — file names, modules, patterns, APIs, whatever the planning phase identified
53: - **What the node's output should look like** — what should be true when this node is done
54: - **How this node connects to the larger plan** — what comes before provides context, what comes after depends on this node's output
55:
56: Do NOT include:
57: - Generic descriptions of what the component type does (the prompt already covers this)
58: - Step-by-step instructions (the component prompt handles methodology)
59: - Tool usage guidance (the component prompt and enforcement handle this)
60:
61: ## Operational Constraints
62:
63: - Write descriptions for work nodes (work-item, project-search-and-analysis, external-scout, deep-research, sequential-thinking). Skip structural nodes (verify, decision-gate, write-notes, compress, kickoff-refresher, commit, run-project-commands) unless the node's purpose is genuinely ambiguous from context.
64: - Keep descriptions concise — 2-4 sentences. Dense with specifics, not padded with generalities.
65: - Ground every description in information from the planning notes. Do not invent requirements.

(End of file - total 65 lines)
</content>
```

---

## Assistant (Build · Claude Sonnet 4.6 · 39.5s)

_Thinking:_

Now I have all the files. Let me plan what I need to do:

**Files to revise:**
1. `files/skills/build-dags-core/SKILL.md`
2. `files/skills/dag-design-example/SKILL.md`
3. `files/skills/dag-review-criteria/SKILL.md`
4. `files/skills/dag-revision-example/SKILL.md`
5. `files/skills/dag-tools/SKILL.md`
6. `files/agents/dag-designer.md`
7. `files/agents/dag-reviewer.md`


8. `files/agents/dag-reviser.md`
9. `files/agents/dag-description-author.md`
10. `files/planning/plan-session/node-library/CATALOGUE.md`
11. `files/planning/plan-session/node-library/CATALOGUE-CORE.md`

The main update involves replacing the `<|think|>` prompt technique with Gemma 4's native thinking mode, which works differently than the current approach.

Looking at the guide more carefully, the `<|think|>` tags in these skill files are actually being used appropriately — they're triggering the agent's reasoning at specific moments during planning and multi-step tasks, which aligns with the guide's recommendation to enable thinking selectively for those contexts. The key insight is that Gemma 4 cleanly omits thinking blocks when disabled, so the current pattern of using these tags for planning and reasoning tasks is sound, but I should verify whether the implementation needs adjustment based on how the model handles native thinking versus prompted thinking.

Beyond that, I'm noticing the agent files already follow the recommended structure pretty well, though the skill files read more like methodology documents than strictly formatted prompts. I should consider whether adding XML-style delimiters would improve clarity. The system prompt length is already reasonable, and I need to check whether the most critical rules are front-loaded before the negative constraints. I'm realizing the `<|think|>` tags in these agent files aren't actually Gemma output tokens—they're instructions within the system prompt telling the agent when to think. Since these are Gemma 4 agents, I need to reconsider whether these thinking directives should be HIGH or LOW reasoning blocks, and whether they're positioned correctly relative to the task flow. I'm mapping out the specific changes needed across agent and skill files - wrapping key sections in XML tags, repositioning the thinking tokens to methodology areas where they're actually useful, and adding efficiency instructions for lower-complexity reasoning tasks. For skill files, I'll maintain the XML structure while keeping thinking tokens where analytical work happens. I'm mapping out the specific changes needed for each file type—agent files need the most work with XML structure wrapping, efficiency instructions for thinking, and a clear role-task-context-constraints-output flow, while skill files need similar structural tags and thinking guidance, and catalogues require minimal updates since they're reference documents that don't need extensive reasoning.

---

## User

it's not just structural changes, let's back up distill your understanding of the guidelines i presenteed

---

## Assistant (Build · Claude Sonnet 4.6 · 29.4s)

_Thinking:_

The user wants me to distill my understanding of the Gemma 4 E4B prompting guidelines before making any changes. Let me think through what the guidelines actually say and what changes they would imply for these files.

Here's my distilled understanding of the guidelines:

---

## Gemma 4 E4B Prompting Guidelines — Distilled

### 1. Prompt Structure: Role → Task → Context → Constraints → Output Format

Every prompt should follow this order. Use XML-style tags (`<rules>`, `<instructions>`, `<constraints>`, `<output_format>`) as hard section boundaries — they prevent a small model from blending instruction context with task data.

### 2. Keep prompts short and front-loaded

- System prompts: **under 200–500 tokens**. Every unnecessary token competes with task context for limited attention.
- Most important rules go **first**. Negative constraints and formatting rules go **last** — they get dropped if they appear too early (recency bias, DeCRIM 2024).

### 3. `<|think|>` placement is load-bearing

Gemma 4's native thinking mode was trained in — it's not the same as prompt-based CoT. But for E4B specifically:
- **Enable thinking** for planning, reasoning about alternatives, code generation, multi-step decisions.
- **Disable thinking** (or omit `<|think|>`) for extraction, classification, formatting, simple routing — narrow tasks where direct answers outperform reasoned ones at 4.5B parameters.
- Add "Think briefly and efficiently. Focus on the key reasoning steps only." when you want bounded reasoning without full thinking overhead.

The current files use `<|think|>` as a general "reflect on this" wrapper — applied uniformly to everything from checklists to methodology steps. The guide says this is wrong for a 4B model. Thinking should be **selective and purposeful**, only on nodes where the model needs to evaluate alternatives.

### 4. Open-ended CoT ("think step by step") actively hurts sub-10B models

Wei et al. (2022) — CoT only helps at ~100B+ parameters. Below that it produces fluent but illogical chains. The current `<|think|>` blocks used as free-form reflection prompts fall into this anti-pattern.

### 5. Few-shot: 2–3 examples maximum, order matters

- More than 3 examples degrades performance at this model size.
- Most representative example goes **last** (recency bias).
- Balanced class labels to avoid majority-label skew.
- If examples push past ~2K tokens total, drop to 1 or go zero-shot with explicit output format.

### 6. Structured output: three-layer enforcement

Prompt-only JSON discipline is insufficient. The reliable stack is:
1. **System prompt** describes the schema semantically
2. **User prompt** specifies the task
3. **`format` parameter** (or equivalent) enforces structure mechanically

For prose-based enforcement (like this system uses), the `tool_code` / `tool_output` delimiter pattern is the closest validated analogue.

### 7. Answer-first pattern for small models

For decision/routing nodes: **output the commitment first, then the reasoning**. This prevents the model from talking itself into the wrong answer during its reasoning chain.

---

## What this means for these files specifically

The current files have three concrete issues:

1. **`<|think|>` overuse** — used on checklists, methodology steps, and reflection prompts indiscriminately. Should be reserved only for genuine multi-step reasoning (planning phases, deciding between approaches). Pure checklists and procedure steps should be plain text.

2. **Prompt length and structure** — agent system prompts don't follow Role → Task → Constraints → Output Format. They mix methodology, constraints, and role description in prose rather than structured sections.

3. **Negative constraints buried mid-prompt** — things like "never use the full catalogue", "never use `delete_edge` + `connect_nodes` when `insert_between` works" are scattered throughout rather than placed last and highlighted.

Is that the right framing before I start? Anything to add or correct?



---

## User

so, some stuff like what you put in #3 i added to tame specific behavior, but the process was so scattered, cruft grew and i imagine i was starting to hit issues due to things accumulating. so, what i want is first principles rewrite where the overall goal is what we're shooting for, not merely reducing/reorganizing content. there's a reason i want all of these done at once. i want you to first spec out what your approach would be if you were writing this from scratch starting from the goal, not the content. So, first state that goal for me so i know you understand

---

## Assistant (Build · Claude Sonnet 4.6 · 12.1s)

The goal is to produce a set of agent system prompts and skill documents that **reliably direct Gemma 4 E4B to build, review, and revise execution DAGs correctly** — where "correctly" means: structurally valid DAGs, right component choices, right verification patterns, right retry depths, right specialist node placement.

Every word in every file should exist because it makes Gemma 4 E4B more likely to do the right thing at that model size. Not because it was added to patch a specific past failure, not because it seemed thorough, not because it mirrors how a larger model would be prompted. The model is the constraint. The DAG correctness is the target.

The files collectively form a **system** — agents dispatch skills, skills teach methodology, catalogues define the vocabulary. A rewrite from first principles means designing that system so each piece carries exactly its share of the load: the agent file orients and constrains, the skill teaches the method, the example demonstrates application, the catalogue defines terms. No piece repeats another's job.

Is that the goal you have in mind?

m0022</parameter>

---

## User

on the right track, but we need a liiiitle more specificity. what's the goal for each dag agent

---

## Assistant (Build · Claude Sonnet 4.6 · 14.0s)

_Thinking:_

The user wants me to articulate the specific goal for each DAG agent. Let me think through what each agent is actually trying to accomplish:

1. **dag-designer** — Given a goal/plan description, produce a structurally valid first-pass MVP DAG using only core components. The skeleton should have correct phases, verification patterns, convergence structure, and retry depth. It should be clean enough that the reviewer has something real to critique.

2. **dag-reviewer** — Given a first-pass DAG, produce actionable critique that tells the reviser exactly what to add and where. The output is not a fixed DAG, it's a prioritized list of findings with specific node IDs, placement recommendations, and reasoning.


3. **dag-reviser** — Given a first-pass DAG and reviewer feedback, produce an improved DAG that incorporates the full component catalogue and addresses all critique points. 4. **dag-description-author** — Given a validated DAG and the planning context, write targeted descriptions for each work node that ground the executing agent in what to do at that specific point within the plan's scope.

- **dag-designer**: Given a goal, produce a structurally valid first-pass DAG using only core components — correct phases, correct verification patterns, correct retry depth, correct convergence. A skeleton clean enough that the reviewer has something real to critique.

- **dag-reviewer**: Given that first-pass DAG, produce a prioritized, actionable critique that tells the reviser exactly what specialist nodes to add, where to place them, and why — grounded in specific node IDs, not general observations. The reviewer never touches the DAG.

- **dag-reviser**: Given the first-pass DAG and the reviewer's critique, apply improvements using the full catalogue and produce a validated, structurally sound final DAG. Address every critique point and identify anything the reviewer missed.

- **dag-description-author**: Given the final validated DAG and the planning context in notes, write per-node descriptions that tell the executing agent what to do at each specific node *in the context of this plan* — not what the component type does generically.

Each agent's output is the next agent's input. The chain only works if each agent produces exactly what the next one needs — no more, no less.

Is that the right articulation?



---

## User

dag reviewer is the big one here, it's doing pretty much all of the reasoning heavy lifting here, let's go into that one with a little more detail

---

## Assistant (Build · Claude Sonnet 4.6 · 15.0s)

The dag-reviewer's job is to be the intelligence layer between a mechanical first pass and a high-quality final DAG. Specifically:

**It has to answer three questions, in order:**

1. **Is the structure sound?** — a quick mechanical check. Verify/decision-gate child counts, no dead ends, all leaves are write-notes, no orphans. This should be fast and mostly pass on a designer output.

2. **What's missing?** — this is where the real reasoning lives. The reviewer has to look at the DAG and ask: does this plan involve external dependencies, APIs, or libraries? (→ external-scout trigger). Does a decision gate resolve a technology choice? (→ external-scout must come between the decision and the implementation, not before). Does any work-item assume shell-produced state? (→ run-project-commands). Are there decisions the executor can't make from evidence alone? (→ user-decision-gate). Is the true complexity of this task unknowable until after investigation? (→ short-path/long-path routing). Where would user input prevent wasted work? (→ user-discussion). These aren't things you can check with rules — they require reasoning about what the plan is actually trying to do.

3. **Where exactly do missing nodes go?** — not just "add an external-scout" but: between which two nodes, what does it depend on, what depends on it, does it create a new branch or slot inline, does one branch now become an early exit?

**The output has to be actionable enough that the reviser can execute it without further reasoning.** If the reviewer leaves ambiguity about placement or branching structure, the reviser fills that gap with guesswork and the DAG degrades.

Is that the level of detail you were looking for?



---

## User

it's not just what's missing, but *how* many. a singe scout to handle finding the relevant libraries, their APIs AND how to bring them into the project as dependencies is a LOT for a single external scout. This would be good to break up into three phases. But this is just an example, a good one, but there also things like tutorials, best practices, etc. If the goal is to search for the latest and greatest, is that incorporated? These are all things we need to try and distill down into the minimum viable trigger, generalized as much as possible while still triggering reliably for the reviewer

there's also an important one regarding the user. did the user want to be involved, as specified in their prompt? are there large architectural changes that should probably be run by the user first? again, minimal viable trigger, generalized as much as possible

also checkpointing via git commits, how often?

you can see what i mean that this is the challenging one. idk how to do it, so nothing from the above is trying to point you in the right direction. im relying on your better-than-human pattern/semantic/rule understanding of the guide to do all this. you are the expert here, not me

---

## Assistant (Build · Claude Sonnet 4.6 · 40.1s)

_Thinking:_

The user is asking me to think deeply about what the dag-reviewer's job really is, and to distill the minimum viable triggers for all the reasoning it needs to do. Let me think through this carefully.

The reviewer needs to answer:
1. Is the structure sound? (mechanical)
2. What's missing and how much of it? (reasoning)
3. Where exactly does each missing piece go? (placement reasoning)

For "what's missing and how much":

**External research decomposition:**
The key insight the user is pointing out: a single external-scout covering "find libraries + learn their APIs + understand how to install them" is too much for one node. The minimum viable trigger here is: **each distinct knowledge domain that requires separate search queries to resolve**.

So the pattern becomes clearer: each scout should map to one focused research question—whether that's identifying the right library, understanding its API, handling dependency integration, or exploring best practices. The reviewer's job is to recognize when a single scout would need to chase multiple independent threads and split those into separate nodes, each with its own answerable question.

For user involvement, I need to check whether they signaled preferences upfront and whether the decisions ahead could significantly reshape the project or are hard to undo—those are the moments that warrant a discussion gate. Similarly, I should commit after each successful phase and especially before branching points where different paths might create incompatible changes. And for research phases, the trigger is whether the task fundamentally depends on staying current with the latest versions, APIs, or approaches. ness of the implementation depends on information that may have changed recently

Let me think about how to frame all of this clearly and concisely for the user. They want me to articulate the minimum viable triggers, generalized as much as possible.

Actually, let me think about this more carefully. The user is asking me to reason about what the reviewer's criteria should be, not to write the criteria yet. They want me to articulate my understanding before we write anything.

Key dimensions for the reviewer:

1. **Research scope decomposition** - the minimum viable trigger is: "does this research node need to answer more than one independent question?" If yes, split. The test for independence: would answering question A change whether/how you'd search for question B? If no, they're independent and should be separate scouts.

2. **Research currency** - does correctness depend on current information (latest API, current best practices, recent changes)? Trigger: if the task involves a library, framework, or tool that has active development and the implementation would differ based on version.

3. **User involvement** - two triggers: did the user's original prompt indicate they want checkpoints or decisions, and are there architectural decisions with high blast radius or that are hard to reverse?

4. **Git commits** - the trigger is clear: after every successful verify on a meaningful unit of work. The question is granularity - every verify, or only "significant" ones? I'd argue every verify that produces a meaningful working state, which in practice means every verify on a work-item (not every internal fix-verify cycle).

5. **How many scouts** - related to #1 but worth calling out: sequential scouts (each builds on the last) vs independent scouts (each covers a different angle). Sequential when question B's search depends on question A's answer. Independent when they're truly orthogonal.

Let me articulate this clearly.

Okay, let me think through each dimension carefully before we write anything.

---

**Research decomposition — how many scouts**

The minimum viable trigger: *does this research node need to answer more than one question where the answers are independent of each other?* If finding the answer to question A doesn't change how you'd search for question B, they're independent and should be separate nodes. Your three-part example (what library, what its API looks like, how to bring it in as a dependency) is the canonical case — those are three orthogonal searches. A fourth scout for "current best practices and gotchas" is warranted if the implementation could go wrong in ways that best practices would prevent. The reviewer should enumerate the questions, not the nodes — the node count follows from that.

Sequential vs parallel matters too: if question B's search depends on question A's answer (e.g. you can't look up the API until you've decided which library), the scouts are sequential. If they're truly orthogonal they could in principle be independent — but since DAGs don't support parallel work, sequential is the only option, and the reviewer should flag the ordering.

**Research currency**

The trigger: *does the correctness of the implementation depend on information that may have changed recently?* Active libraries, frameworks with fast release cycles, APIs that version, tooling with breaking changes — all trigger a "latest and greatest" scout. The reviewer should ask: if this scout ran six months ago, would the implementation be wrong today? If yes, currency matters and the scout prompt needs to reflect that.

**User involvement**

Two independent triggers:
- *Explicit*: did the user's original prompt signal they want to be consulted, approve approaches, or make choices?
- *Implicit*: does any decision in this DAG have high blast radius, be hard to reverse, or represent a significant architectural direction? The threshold is: would a reasonable user want to know this decision is being made before it happens?

The node type follows from which trigger fires: user-decision-gate when there's a binary choice to be made, user-discussion when it's softer — "here's what I'm about to do, any objections?"

**Git commits**

The trigger: *after every successful verify on a meaningful unit of work*. "Meaningful" means: if everything from this point forward failed, would you want to be able to roll back to here? In practice that's every verify on a work-item — not the internal fix-retry cycles, but the outer verify that confirms the work phase is complete and correct. The reviewer should flag any long stretch of work-verify-work-verify with no commit nodes between them.

---

So the reviewer is really doing **five enumeration exercises**, in order: structure check, research question inventory, research currency assessment, user involvement triggers, and commit placement. Each one has a clear minimum viable question to answer. Does that framing feel right before we spec the rewrite?



---

## User

plus the other things you mentioned that were solid. decision gates, alternative, fully mutually independent pathways (like long/short), etc.

---

## Assistant (Build · Claude Sonnet 4.6 · 21.0s)

_Thinking:_

The user wants me to incorporate all the other things I mentioned earlier into the full enumeration. Let me consolidate everything into a complete list of what the reviewer does, stated as minimum viable triggers.

So the reviewer's full enumeration — each as a minimum viable trigger:

---

**1. Structure check** (mechanical, fast)
Verify/decision-gate child counts, no dead ends, all leaves are write-notes, no orphans, no unbounded work chains, no verify-without-retry.

**2. Research question inventory**
*What distinct, independent questions does this plan need answered externally?* One scout per question cluster. Order them: does answering A change how you'd search for B? If yes, sequential. If no, still sequential (DAG constraint) but flag the ordering.

**3. Research currency**
*Would this implementation be wrong if the scout ran six months ago?* If yes, the scout needs to explicitly target current information — latest versions, recent breaking changes, current best practices.

**4. Decision gates**
*At what points will the executor face a choice between approaches, tools, or strategies?* Each one is a decision-gate trigger. Then: are there decisions that only become meaningful after a prior decision has been executed? Those need cascading gates, not a single gate at the top. Is the choice based on evidence the executor can gather, or does it require user preference? Former is decision-gate, latter is user-decision-gate.

**5. Complexity routing — short/long path**
*Is the true complexity of this task knowable only after investigation?* If the plan might turn out to be trivial (already done, simpler than expected) or much harder (scope explodes), an investigation node followed by a decision-gate routing to a quick path vs a thorough path prevents wasted effort in both directions. Early exits from the short path need their own write-notes leaf.

**6. User involvement**
*Explicit*: did the user's prompt signal they want checkpoints or to make choices?
*Implicit*: does any decision have high blast radius, be hard to reverse, or represent a significant architectural direction? user-decision-gate for binary choices, user-discussion for "here's what I'm about to do."

**7. Shell prerequisites**
*Does any work-item assume state that only a shell command can produce?* Dependency installation, build artifacts, scaffolded structures, generated code — all need a run-project-commands node before the work-item that consumes the result.

**8. Commit placement**
*After every successful verify on a meaningful unit of work* — where "meaningful" means you'd want to roll back to here if everything downstream failed. Flag any long verify-work chains with no commit between them.

**9. Execution-phase investigation**
*Does any work-item operate on territory the executor can't be assumed to know?* project-search-and-analysis should precede work phases that touch unfamiliar files, modules, or patterns. The planning scout gives a broad overview — execution-time investigation is targeted and specific.

---

That's the complete enumeration. Nine exercises, each with a clear trigger question. The reviewer runs all nine, then the output is: here's what to add, here's exactly where, here's the branching structure or sequencing rationale. Ready to spec the rewrite approach now?



---

## User

sweet, and the rest are all fairly straightforward in the goal, with descriptions being the easiest. where the others struggle is methodology. it's been a challenge with the current setup to get reliable dag building from the two that do so

okay, i think we're on the same page now. can you summarize your approach for each?

---

## Assistant (Build · Claude Sonnet 4.6 · 29.6s)

_Thinking:_

The user wants me to summarize my approach for rewriting each file from first principles, based on everything we've discussed. Let me think through this for each agent and skill.

The files to rewrite:
- Skills: build-dags-core, dag-design-example, dag-review-criteria, dag-revision-example, dag-tools
- Agents: dag-designer, dag-reviewer, dag-reviser, dag-description-author
- Catalogues: CATALOGUE.md, CATALOGUE-CORE.md

Let me think about the approach for each:

**dag-designer + build-dags-core + dag-design-example**
The problem: reliable DAG building. The agent needs to reliably produce structurally valid DAGs.

For the designer, I need a short role-focused prompt with constraints at the end. The core skill should present the three-stage procedure cleanly, using thinking selectively—enabling it for the planning phase where we decompose the problem and identify nodes, but keeping it disabled for the mechanical construction work. The example should be a pure reference with no thinking prompts, just the worked example to follow.

**dag-reviewer + dag-review-criteria**
The problem: needs to reliably run all nine enumeration exercises. The agent prompt should orient the role and constrain output format. The skill should present the nine checks clearly and systematically.

**dag-reviser + dag-revision-example + revise-dags**
The problem: reliable DAG modification. The agent needs to take critique and apply it correctly. The skill should be the five patterns with clear decision rules for which pattern to apply. Enable thinking for planning revisions, but the actual tool calls are mechanical.

**dag-description-author**
Simplest. Short agent prompt, clear writing criteria, no complex methodology needed.

**Catalogues**
These are reference documents. They should be clean, accurate, and structured. No thinking prompts. The key change is making the structural rules more prominent and possibly adding guidance on when to use each component.

**dag-tools**
Pure reference. No changes to content needed, maybe light structural cleanup.

---

**dag-designer + build-dags-core + dag-design-example**

The reliability problem is methodology — the agent needs to do planning (genuinely complex, thinking-worthy) then mechanical construction (rote, thinking is noise). The approach: agent prompt is short and role-constrained, negative constraints last. build-dags-core restructures the staged procedure so `<|think|>` fires only on the decomposition step ("what are my phases, what nodes does each need?") — then the three construction stages are plain procedural steps with no thinking. dag-design-example becomes a pure reference artifact — worked example only, no reflection prompts, the model reads it and applies the pattern.

---

**dag-reviewer + dag-review-criteria**

This one earns its thinking tokens. The agent prompt orients the role, specifies the two-section output format (structural findings + deep analysis), constraints last. dag-review-criteria restructures around the nine enumeration exercises — each as a header with its minimum viable trigger question, then the decision logic under it. `<|think|>` wraps the entire deep analysis section because that's genuinely multi-step reasoning over the plan. The structural check stays plain text — it's mechanical.

---

**dag-reviser + dag-revision-example**

Reliability problem is planning the revision before touching anything. Agent prompt is short, role-focused, "plan before you act" as a hard constraint. dag-revision-example stays mostly as-is — it's already a clean pattern reference — but strips the reflection prompts and adds a decision rule at the top: "identify which pattern applies before making any change." `<|think|>` on the planning step only (mapping critique points to patterns and writing the target adjacency list), then mechanical execution.

---

**dag-description-author**

Simplest rewrite. Short agent prompt: role, what good descriptions look like vs bad, output format. No skill needed — the methodology is simple enough to live entirely in the agent file. No `<|think|>` — this is a classification/writing task.

---

**Catalogues**

Reference documents — no thinking prompts, no methodology. The key change: structural rules move to a more prominent position and get tightened. Component descriptions stay concise but add the "when to use / when not to use" distinction for components that are commonly confused (verify vs decision-gate, external-scout vs deep-research).

---

**dag-tools**

Pure reference. Light structural cleanup only — no content changes needed.

---

Ready to write?



---

## User

what are your thoughts on moving all specifics like "leave blah blah gates for last" to the skill file? which btw, i just realized the kickoff/plan-fail/plan-success references need to GO. we no longer expose these to the agents because they were confusing the hell out of them. rather than explain in detail, i leave a completed DAG below. in the backend, these are all connected to those previously mentioned nodes, but they are implementation details. opaque and unnecessary to both the user and the agents:

## Session Plan: tui-app-idea-generation
**Plan Name:** tui-app-idea-generation
 ┌─────────────────────────────────────────────────┐
 │                                                 │
 │         ideation_select (decision-gate)         │
 │                                                 │
 └────────────────────────┬────────────────────────┘
                          │
                          │
                          │
                          │
                          ▼
 ┌─────────────────────────────────────────────────┐
 │                                                 │
 │      external_scout_ftxui (external-scout)      │
 │  project_analysis (project-search-and-analysis) ├──────────────────────────┐
 │             design_spec (work-item)             │                          │
 │                                                 │                          │
 └────────────────────────┬────────────────────────┘                          │
                          │                                                   │
                          │                                                   │
                          ├───────────────────────────┐                       │
                          │                           │                       │
                          ▼                           │                       ▼
 ┌─────────────────────────────────────────────────┐  │   ┌───────────────────────────────────────┐
 │                                                 │  │   │                                       │
 │              verify_design (verify)             │  │   │  user_check_design (user-discussion)  │
 │                                                 │  │   │                                       │
 └─────────────────────────────────────────────────┘  │   └───────────────────┬───────────────────┘
                          │                           │                       │
                          │                           │                       │
                          ├───────────────────────────┴───────────────────────┤
                          │                                                   │
                          ▼                                                   ▼
 (─────────────────────────────────────────────────)      ┌───────────────────────────────────────┐
 │                                                 │      │                                       │
 │             refine_scope (work-item)            │      │                                       │
 │            final_output (write-notes)           │  ┌───┤         fix_design (work-item)        │
 │                  [SUCCESS EXIT]                 │  │   │                                       │
 │                                                 │  │   │                                       │
 (─────────────────────────────────────────────────)  │   └───────────────────┬───────────────────┘
                                                      │                       │
                                                      │                       │
                          ┌───────────────────────────┼───────────────────────┤
                          │                           │                       │
                          ▼                           │                       ▼
 ┌─────────────────────────────────────────────────┐  │   ┌───────────────────────────────────────┐
 │                                                 │  │   │                                       │
 │          fix_design_retry_2 (work-item)         │  │   │        verify_design_2 (verify)       │
 │                                                 │  │   │                                       │
 └────────────────────────┬────────────────────────┘  │   └───────────────────┬───────────────────┘
                          │                           │                       │
                          │                           │                       │
                          ├───────────────────────────┘                       │
                          │                                                   │
                          ▼                                                   ▼
 (─────────────────────────────────────────────────)      (───────────────────────────────────────)
 │                                                 │      │                                       │
 │             verify_design_3 (verify)            │      │                                       │
 │       final_output_failure_3 (write-notes)      │      │  final_output_failure_2 (write-notes) │
 │                  [FAILURE EXIT]                 │      │             [FAILURE EXIT]            │
 │                                                 │      │                                       │
 (─────────────────────────────────────────────────)      (───────────────────────────────────────)

let me know if you understand

---

## Assistant (Build · Claude Sonnet 4.6 · 20.3s)

_Thinking:_

The user is making two points:

1. **Move operational specifics to the skill file** — things like "set entry/exit last", "build phases independently", "use 1 retry by default" should live in the skill (build-dags-core) not the agent file. The agent file stays short and role-constrained. The skill carries the procedural detail.

2. **Remove kickoff/plan-fail/plan-success references** — these internal nodes are no longer exposed to agents. Looking at the example DAG, I can see that the DAG as shown to agents starts directly with the first work node (decision-gate in this case) and the leaf nodes just say [SUCCESS EXIT] or [FAILURE EXIT].

So the backend handles those internal nodes transparently, but agents only interact with the visible work nodes and call `set_exit_point` with "success" or "failure" — that's the clean interface. The entry point is the first actual work node like `ideation_select`, and exit nodes are just marked as success or failure exits without needing to reference the hidden kickoff/plan nodes.

Yes, understood on both points.

**On moving specifics to the skill:** The agent file should be the minimum viable orientation — role, output format, hard constraints. The "how" lives in the skill. This keeps the agent prompt short (under that 200-500 token budget), and means the detailed methodology is only in context when the agent has loaded it and is actively using it, not burning tokens on every invocation.

**On kickoff/plan-fail/plan-success:** From the example DAG I can see the contract clearly. The agent's world is:

- First work node = entry point, set with `set_entry_point`
- `write-notes` leaf nodes = exits, marked `success` or `failure` with `set_exit_point`
- That's it — the backend handles everything else

No agent or skill file should reference `execution-kickoff`, `plan-success`, or `plan-fail` at all. They don't exist from the agent's perspective. The catalogues also need to lose those entries — they were confusing because agents would try to wire to them directly or account for them in their structural reasoning when they shouldn't be touching them at all.

The simplified mental model for the designer and reviser: build the work graph, call `set_entry_point` once, call `set_exit_point` for every write-notes leaf. Done.

Ready to write?



---

## User

yes

---

## Assistant (Build · Claude Sonnet 4.6 · 250.0s)

_Thinking:_

Now I need to plan out the rewrite of all these files. Let me organize what needs to be done:

**Files to rewrite:**
1. `files/planning/plan-session/node-library/CATALOGUE.md`
2. `files/planning/plan-session/node-library/CATALOGUE-CORE.md`
3. `files/skills/build-dags-core/SKILL.md`
4. `files/skills/dag-design-example/SKILL.md`
5. `files/skills/dag-review-criteria/SKILL.md`
6. `files/skills/dag-revision-example/SKILL.md`


7. `files/skills/dag-tools/SKILL.md`
8. `files/agents/dag-designer.md`
9. `files/agents/dag-reviewer.md`
10. `files/agents/dag-reviser.md`
11. `files/agents/dag-description-author.md`

I'm going through each file to determine what changes are needed. For CATALOGUE-CORE.md specifically, I need to remove the execution-kickoff, plan-success, and plan-fail entries since they're not in the current catalogues, but I should keep sequential-thinking since it's already there. Then I'll need to figure out what else to add.

Looking at the current state of both catalogues, neither CATALOGUE-CORE.md nor CATALOGUE.md contains those three entries, which is good. I'm checking the skill files to see if there are any references to them, and so far I'm not finding direct mentions in the DAG tools skill or other files I'm reviewing.

For the full CATALOGUE.md, I need to add external-scout, deep-research, user-decision-gate, user-discussion, and autonomous-work, then clarify the distinction between external-scout and deep-research. I should also add when-to-use notes for commonly confused pairs and make sure execution-kickoff, plan-success, and plan-fail aren't included. The build-dags-core skill needs all the operational specifics moved into it, and I need to add clearer "when not to use" guidance for verify versus decision-gate, tighten the structural rules, and remove any thinking prompts.

Now I'm refining the remaining skill files. The dag-design-example should be a pure reference artifact with no reflection prompts, just a worked example that doesn't reference kickoff or plan nodes. For dag-review-criteria, I'm structuring it as nine enumeration exercises with minimal trigger questions, wrapping the deep analysis in thinking tags for exercises 2-9 while keeping the structural check plain. The dag-revision-example needs five clean patterns with a decision rule at the top to identify the pattern first, thinking tags only on the planning step, and all reflection prompts removed. The dag-tools skill stays as a light pure reference.

For the agents themselves, I'm stripping down dag-designer to just role, methodology pointer, output format, and hard constraints—removing all the operational specifics that now live in the skills. The dag-reviewer gets a role, two-section output format, methodology that loads skills and runs the nine exercises, constraints last, and thinking enabled. The dag-reviser is short with role, methodology pointer, output format, and "plan before you act" as a hard constraint. For dag-description-author, I'm keeping the qdrant-notes skill dependency but absorbing the simple methodology directly without a separate skill, keeping the writing criteria clear and concise.

I'll start writing these in logical order, beginning with the catalogues since everything references them. I'm laying out the core node library with structural rules for DAGs — everything must be acyclic with all paths terminating at write-notes leaf nodes, and I'm defining when to use each component like work-item for mutations, project-search-and-analysis for investigation, verify for implementation checks, and decision-gate for executor choices. I'm looking at the structural rules that govern how these nodes connect — everything flows acyclically with no loops, every path terminates at a `write-notes` leaf, and `verify` nodes always branch into pass and fail paths. The core components define when to use each node type: `work-item` for mutations, `project-search-and-analysis` for investigation, `verify` for implementation checks, and `decision-gate` for routing based on evidence. There's also `run-project-commands` for shell execution before dependent work, `commit` for checkpoints, `sequential-thinking` for pure reasoning, and the `compress`/`kickoff-refresher` pair for context management. Now I'm moving into the research section to see what external investigation tools are available. I'm looking at the component reference table for dag-tools, which outlines when to use each research and decision component. The external-scout is the default for answerable questions with user approval, while deep-research handles novel problems without established answers. For decision-making, the user-decision-gate lets the user choose between branches, and user-discussion surfaces architectural decisions mid-execution. Autonomous-work delegates to an agent only when explicitly approved during planning.

Now I'm structuring the skill files with a consistent pattern: dag-tools stays as a pure reference with the tool table, build-dags-core gets thinking blocks only on decomposition with procedural steps for the three stages, and dag-design-example is just the worked example without thinking blocks. The review criteria file has nine enumeration exercises with thinking wrapping the analysis, while dag-revision-example shows five patterns with a decision rule at the top and thinking on the planning step.

For the agent files, I'm keeping them short and focused: each one has role, required skills, methodology or response approach, and operational constraints at the end. The dag-designer, dag-reviewer, dag-reviser, and dag-description-author files all follow this structure, with the description-author specifically noting that qdrant-notes is the only required skill and including writing criteria for good versus bad descriptions.

I'm being careful to follow the Gemma guide structure: role, task, context, constraints, and output format, keeping everything under 500 tokens, front-loading important rules, and using thinking blocks selectively only for planning and reasoning steps. I'm realizing I need to be more careful about how `<|think|>` works in this context—it's a signal to trigger Gemma's thinking mode when the model reads that section of the skill file. So I should use it for planning and multi-step reasoning tasks, but skip it for straightforward procedural steps. The guide also emphasizes structuring decisions as "here's what to do, then here's why" for smaller models, and placing negative constraints at the end of the list rather than scattered throughout. Now I'm ready to start writing the files, beginning with the simpler ones and building toward the more complex skill definitions. I'm identifying where thinking blocks genuinely help versus where they'd hurt. The agent files currently have open-ended reflection prompts, but those backfire on smaller models — better to give direct, actionable instructions instead. For skill files, I'll keep thinking blocks only where there's real multi-step reasoning needed, like decomposing problems or running through structured reviews.

Now I'm drafting the documentation files. I'll make CATALOGUE-CORE clean and structured with "when to use" guidance for potentially confusing components like verify versus decision-gate. CATALOGUE gets the same treatment plus the full component set, and I'll add "when NOT to use" sections for common failure modes like deep-research versus external-scout. The dag-tools skill stays as a pure reference with tool tables. For build-dags-core, I'm writing a skill file that teaches the staged construction procedure for building a structurally valid MVP execution DAG from the core components. Now I'm connecting all the inter-phase edges in a single call, then verifying the full structure is connected properly before visualizing the complete DAG. After that, I'll set the entry point at the first work node and mark all the leaf nodes as either success or failure exits depending on whether they're happy-path completions or retry exhaustion points, then validate the entire DAG.

For naming, I need to be specific and contextual — avoiding generic labels like `node-1` or bare component names, instead adding descriptive context like `verify-auth` or `decision-gate-complexity-check`. Every leaf must be a `write-notes` node that captures either what was accomplished or what failed. I'm defaulting to one retry per verify chain unless the reviewer wants to adjust, and I need to distinguish between `verify` nodes that check implementation outcomes after work items versus `decision-gate` nodes that route based on evidence and never follow work items directly.

I'm reconsidering the structure of the skill file itself — the guide suggests Role → Task → Context → Constraints → Output Format, but for teaching methodology, the role is implicit, so it's really Task → Context → Constraints. The key insight is placing the reasoning block strategically at the point where the agent needs to think, not as a trailing "how to think" section.

For the build-dags-core file, the reasoning block should come after loading the catalogue and before starting the build phase. For dag-review-criteria, it wraps the deep analysis exercises. For dag-revision-example, it sits on the planning step. Now I'm ready to write out all the files in batches. I'm reviewing the component library structure and how each node type fits into the workflow. The catalogue covers core components like `work-item`, `verify`, and `write-notes` for the main execution path, research nodes like `external-scout` and `deep-research` for investigation, and logic nodes like `user-decision-gate` for branching on user preference. The key constraint is that every path must be acyclic and terminate at a `write-notes` leaf, with `verify` used specifically for checking implementation outcomes rather than routing decisions. I'm documenting the remaining DAG tool functions—`connect_nodes` for establishing edges between nodes, and I'll continue with the other manipulation and validation tools that follow. Now I'm looking at the remaining API methods for DAG construction and validation. `set_exit_point` marks terminal nodes for success or failure paths, and I need to call it for each `write-notes` leaf. Then there are inspection methods like `get_compact_dag_draft` to verify structure after changes, `get_dag_draft_diagram` for ASCII visualization, and `validate_dag` to check for structural errors before execution.

The next section introduces the core DAG building skill, which focuses on creating a structurally sound MVP with proper phase decomposition, verification patterns, and convergence logic rather than optimizing node selection.

I need to map out the distinct phases this plan requires—what work each phase handles, how to verify it's correct, what failure modes to expect, and how phases connect together. Then I'll establish all phase boundaries before starting any actual construction.

For each phase, I'll add all its nodes in one batch, wire them internally, and validate that phase in isolation. Once all phases are built and verified independently, I'll connect them across phase boundaries and confirm the full graph is coherent. Finally, I'll mark the entry point as the first work node and set all leaf nodes—which must be write-notes—to either success or failure based on their outcome path.

Node names need to be specific and contextual, never generic placeholders. Verify nodes always follow work nodes and check whether the work succeeded. Decision gates route based on evidence and never act as verification steps. Retries default to one per verify chain unless the reviewer adjusts them later. Entry and exit points are handled by the infrastructure—I just wire the first work node as entry and mark each write-notes leaf as success or failure. Building the DAG structure... Building the final workflow nodes and connecting the clusters together, then setting up the entry and exit points for the plan. I'm setting up failure exit points for two nodes in the DAG and then validating the overall structure. Now I'm moving into the review framework itself — this is a skill about evaluating execution DAGs for structural issues and anti-patterns. The deep analysis involves running nine specific exercises against the DAG to identify gaps and problems, recording the node IDs involved and what needs to be fixed so a reviser can act on the findings directly. I need to check whether any scout is trying to answer multiple independent questions at once—if so, I should break it into separate scouts that each focus on one thing. Then I'm thinking through the decision points: where does the executor need to choose between different approaches, and can that choice be made from gathered evidence or does it need user input? Some decisions might only matter after earlier ones play out, so those need to cascade rather than all happening upfront. Finally, I'm considering whether the real complexity here only becomes clear after investigation starts—if the task might turn out to be already solved or much simpler than expected, or if it could balloon into something much larger, I should build in a quick reconnaissance phase first. I'm working through the shell prerequisites check — if a work-item ran on a fresh checkout right now, what dependencies or generated artifacts would be missing? Then I'm thinking about where commits should land: after verify nodes that complete meaningful units of work, not after internal retry cycles. I'm also considering whether execution-phase investigation is needed — does the executor need targeted analysis of unfamiliar territory before diving into a major work phase? Finally, I'm organizing findings by impact, listing the node IDs involved, what the gap is, and what node type would fix it.

Generating markdown table... I'm looking at how to insert nodes mid-chain and handle branching points in this workflow system. The key insight is using `insert_between` to avoid orphaning nodes, and when I need multiple branches from a single point, I add the second connection right after. For extending retry chains, I'd follow the same pattern—insert the new retry node and connect it to the appropriate success or failure outcomes. I'm setting up a new retry cycle by adding fresh nodes for the fix and verification steps, then disconnecting the old failure path and wiring everything through the new nodes before removing the orphaned node. The flow now routes through the retry verification before branching to either success or the new failure handler.

Now I'm applying the same pattern to reroute the blueprint failure path through a discussion node first... I'm wrapping up the discipline guidelines—making sure to avoid accumulating orphaned nodes and setting entry and exit points as the final step after all structural changes are complete. Now I'm looking at the dag-designer agent definition, which needs to be concise and focused on its core role of building execution DAGs from the component library, with clear permissions for all the node and edge manipulation operations it requires. I'm setting up the dag-designer role with permissions for the core planning tools and skills, then outlining the methodology for building MVP execution DAGs from the component catalogue. The process involves loading the necessary skills, retrieving session notes if a plan name is provided, following the staged construction procedure, storing design rationale in Qdrant, and responding with the completed DAG and key design decisions. I need to keep in mind the constraints: use only the core catalogue variant, wire all nodes before setting entry and exit points, default to one retry per verify chain, ensure every leaf node is write-notes, and store notes via Qdrant rather than writing to files. I'm setting up the dag-reviewer role with specific permissions and a structured methodology for analyzing execution DAGs. The workflow loads relevant skills and data, retrieves session context if a plan name is provided, then runs a two-part review process—first checking structural integrity, then diving into deep analysis grounded in specific node IDs. Findings get stored back to Qdrant, and I respond with prioritized critique tied to actual nodes rather than general observations. I'm setting up as the DAG reviser with access to the full component catalogue and revision tools. My workflow is to first load the necessary skills and retrieve the session notes with the reviewer's critique, then examine the current DAG structure before planning all changes as a target adjacency list. I'll apply revisions methodically using the established patterns, verifying each structural change, and finish by setting entry and exit points and storing my revision notes.

The methodology is straightforward enough that I can integrate it directly without needing separate skill files — just keeping the qdrant-notes skill for storing my work.

I'm setting up the dag-description-author role to write contextual descriptions for each node in execution DAGs. The approach involves loading my notes, pulling planning context from qdrant storage, examining the full DAG structure and component catalog, then writing targeted descriptions for each work node that explain what it should accomplish within this specific plan rather than generic component behavior. I'll store a summary of what I've written and flag any nodes I intentionally skipped.

A solid description tells the executor exactly what to investigate, build, or change at that node—naming specific files, modules, patterns, or APIs from the plan—and clarifies what success looks like and how it fits into the larger workflow. I should avoid repeating generic component details or step-by-step methodology since those are already covered elsewhere, and I'll only write descriptions for actual work nodes, skipping structural ones like decision gates or commits.

Now I'm realizing I need to double-check the `revise-dags` skill—the dag-reviser agent references it, but I'm not sure if it was part of the original five skills the user asked me to revise. Looking back at the conversation, they said to revise all five skills, then the agent files, then the catalogues, but I need to verify whether `revise-dags` is actually one of the files that needs updating or if it's something separate.

Actually, I think I'm overthinking this. We loaded `dag-revision-example`, not `revise-dags`—those are different skills. I should stick with revising what was explicitly loaded and leave `revise-dags` alone unless the user asks for it.

For the actual file writing, I need to be careful about the `<|think|>` blocks. The `dag-design-example` skill should be a pure reference document without thinking prompts, since the agent reads it to understand patterns rather than being prompted to reflect. And for `build-dags-core`, the thinking block should come right after the planning components call.

Let me start writing these files in parallel batches now.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Rewrite CATALOGUE-CORE.md",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite CATALOGUE.md",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-tools SKILL.md",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite build-dags-core SKILL.md",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-design-example SKILL.md",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-review-criteria SKILL.md",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-revision-example SKILL.md",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-designer.md agent",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-reviewer.md agent",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-reviser.md agent",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-description-author.md agent",
      "status": "pending",
      "priority": "high"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Rewrite CATALOGUE-CORE.md",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite CATALOGUE.md",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-tools SKILL.md",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite build-dags-core SKILL.md",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-design-example SKILL.md",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-review-criteria SKILL.md",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-revision-example SKILL.md",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-designer.md agent",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-reviewer.md agent",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-reviser.md agent",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-description-author.md agent",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Claude Sonnet 4.6 · 4.5s)

**Tool: todowrite**

**Input:**
```json
{}
```

**Error:**
```
Tool execution aborted
```

---

## User

real quick, it is *imperative* that prompts to subagents are *goal* driven, NOT task minutia. we have found time and again that there is a strength to scoped open-endedness and treating the subagents as competent sepecialists in their domain that dont need to be micromanaged. this is in line with the prose-based responses to headwrench, so that headwrench is fundamentally incapable of saying (read these files, edit this function in this file, etc). it time and time and time again has led to worse results not in terms of staying on task, but the work done by the subagents as well

---

## Assistant (Build · Claude Sonnet 4.6 · 13.2s)

Understood. This changes the agent files significantly.

The agent system prompts should not enumerate steps like "1. Call get_dag_draft_diagram, 2. Call get_compact_dag_draft, 3. Call get_planning_components_catalogue." That's micromanagement. The agent knows how to use its tools — the skill files teach the methodology. The agent prompt just needs to:

1. Orient the role — what kind of specialist are you?
2. State the goal — what does success look like for this invocation?
3. Point to the skills that teach the how
4. Hard constraints last — the things that must not happen regardless of how the agent works

The methodology steps currently in the agent files move entirely into the skill files or get cut. The agent prompt stays short, role-scoped, and goal-oriented. The agent figures out the how from its skills and its own judgment.

So concretely — the dag-designer agent prompt says something like "you build first-pass MVP DAGs from the core catalogue, load your skills, produce a structurally valid skeleton and store your rationale" — not "step 1 call this tool, step 2 call that tool."

Same logic applies to constraints: only the ones that protect against genuinely catastrophic failure modes worth the token cost. Everything procedural belongs in the skills.

Does that match what you mean?



---

## User

methodology is not the same. methodology is encoded strictly in system prompts beceause methodology is mutually exclusive with the goal and is, by nature of it being a system prompt, impossible to be specific about files to check and what not. of course, these agents dont directly interact with files, so not relevant here. but methodology can be micormanaged, by us, the system prompt designers. NOT headwrench by headwrench during delegation

---

## Assistant (Build · Claude Sonnet 4.6 · 11.4s)

Got it — the distinction is:

- **Headwrench's delegation prompts** → goal-oriented only. Headwrench cannot tell a subagent which tools to call, which files to read, what to check first. That's runtime micromanagement and produces worse results.

- **System prompt methodology** → we can and should be prescriptive here. The ordered methodology steps in the agent files (load skills first, retrieve notes, load the DAG, then analyze) are fine and stay — because these are baked in by us at design time, not injected at runtime by headwrench. The agent always follows the same procedure regardless of the specific task it's handed.

So the agent files keep their methodology steps. What changes is:
- The methodology is goal-framed at each step ("understand the current DAG structure" not "call get_compact_dag_draft then get_dag_draft_diagram")
- The specifics of *how* to execute each methodology step live in the skill files
- Headwrench's delegation prompt to any of these agents is purely a goal statement — what DAG, what plan, what the desired outcome is — nothing procedural

Is that the right read?

<dtml-message-id>m0041</dtml-message-id>



---

## User

that is up to you, whatever you think is best based on the research document. i just wanted to clarify the delegation prompts explicilty, since that is a 100% locked in standard. they are goal driven, responses are prose summaries with specific content requirements (like for reviewer, reasoning for its review notes type of stuff) specific to each subagent

---

## Assistant (Build · Claude Sonnet 4.6 · 14.5s)

_Thinking:_

The user is clarifying:

1. **Delegation prompts from headwrench** → always goal-driven, 100% locked in standard. No tool instructions, no step-by-step. Just: here's the goal, here's the context.

2. **Responses from subagents back to headwrench** → prose summaries with specific content requirements per agent. Not structured JSON, not bullet lists of tool calls made. Prose with the right substance for that agent's role. For the reviewer: reasoning behind recommendations. For the designer: rationale for key design decisions. Etc.

3. **System prompt methodology** → I can design this however I think best based on the research document.

Based on the Gemma 4 E4B guide, I'm structuring this with

---

## User

structure JSON actually could apply for the responses. think of the responses as prose summaries filling the bodies of a specced set of markdown headers per agent, each asking an essential question to drive the DAG forward effectively. those headers could easily be structured json

---

## Assistant (Build · Claude Sonnet 4.6 · 31.4s)

_Thinking:_

The user is making two points:

1. **Delegation prompts are 100% goal-driven** - this is locked in. Headwrench sends goal-only prompts to subagents, not instructions about what to do step by step.

2. **Subagent responses** - instead of free-form prose, they could be structured as a set of markdown headers per agent (each header being an essential question that drives the DAG forward), and these headers could be JSON-structured. This is directly in line with the Gemma 4 E4B guide - structured output is more reliable than prose, especially with a schema enforced at multiple levels.


Now I'm mapping out what each agent's response schema should look like - defining the essential questions that need answering for dag-designer (DAG name, identified phases and reasoning, structural decisions around branching and convergence, retry depths), dag-reviewer (structural violations, deep analysis findings per exercise, priority ordering), dag-reviser (changes made per critique, additional improvements beyond feedback, final DAG state), and dag-description-author (which aspects to document).

The structured JSON approach aligns with the guide's recommendations - using flat schemas with semantic descriptions in the system prompt rather than deeply nested structures. This means the reviewer's output becomes a reliable handoff point for headwrench to extract findings and pass them to the reviser, making the system more robust than prose-based responses.

I'm reconsidering whether the delimiter pattern we use for prose enforcement is the right model here, or if we should move toward actual JSON schemas at the agent level. The user's suggestion to replace markdown headers with JSON fields is compelling because it removes parsing ambiguity. I need to identify the core questions each agent must answer - the minimal set that actually drives the next step forward - and structure the schemas around those essentials.

That's a strong insight. Structured JSON responses per agent would:

1. Make the handoff between agents reliable — headwrench extracts exactly what the next agent needs without parsing prose
2. Align with the guide's core finding — semantic schema in the system prompt + structural enforcement = more consistent output at 4B
3. Force us to be explicit about what each agent actually needs to produce, rather than letting it decide what's worth summarizing

For each agent the schema should be the minimum set of fields that drives the next step. Thinking through them:

**dag-designer** — the reviewer needs: plan name, phase breakdown with rationale, key structural decisions (why that branching, why those retry depths)

**dag-reviewer** — the reviser needs: structural violations (list), then per-exercise findings each with node IDs, recommendation, and placement. Priority order across all findings.

**dag-reviser** — headwrench / description-author needs: what changed per critique point, any additional improvements made, final DAG state confirmation

**dag-description-author** — headwrench needs: which nodes got descriptions with a one-line summary of each, which were skipped and why

The schemas should be flat where possible. The reviewer's is the most complex but naturally maps to the nine exercises as top-level keys — each key holds an array of findings, each finding being `{node_ids, issue, recommendation, placement}`.

Before I start writing — do you want me to spec the schemas for review first, or go straight to writing? Given the reviewer's schema is load-bearing for the whole chain I'd lean toward speccing that one at minimum.



---

## User

plan name is actually decided by headwrench as the very first step in the planning DAG, but otherwise your read is right. here's an example of a strong context-scout response. did it adhere *exactly* to prose only? no. but the spirit is there, for context scout what we never want is it dumping file contents, the whole project directry tree, etc. think of headwrench as a project manager. you wouldnt go to a project manager and say you edited lines 278-345 in math.hpp in the src/lib/algos/detail/ dir, would you? no, you'd say "i implemented the new X functionality we wanted in the math module like you asked"

that's the spirit of what i mean about prose response. it can be structured prose, just not dumping out every little tiny detail to headwrench

and the reason is actually because of the delegation rule, which is far more important: goal-based delegation allows specialists to do their job and solve problems and leaves headwrench with more bandwidth to solve problems related planning and execution of plans, like a project manager would

dumping file contents, exact files worked on, etc is all noise and leads to the degredation of our #1 rule of goal-based delegation. if headwrench gets too much context, it starts to do decomposed task items delegation, creating this postive feedback of ever narrowing focus, which often leads to missing key aspects of the larger goal

---

## Assistant (Build · Claude Sonnet 4.6 · 40.7s)

_Thinking:_

Now I understand much more clearly. The response format is:

1. **Structured prose** - not dumping details, not file paths, not line numbers - but organized by what headwrench needs to know to make the next delegation decision
2. **Goal-level summaries** - "I built a DAG with 4 phases covering X, Y, Z with verification at these key points" not "I called add_nodes_to_dag with these exact parameters"
3. **The structure can be markdown headers** but the content under each header is high-level prose, not minutia

The key insight about the feedback loop: if headwrench gets too granular, it starts to delegate in granular terms, which causes the subagents to work in granular terms, which produces granular responses back to headwrench, which tightens the focus further until the whole system is operating at the wrong abstraction level and missing the forest for the trees.

So the response schemas need to be built around the essential questions headwrench actually needs answered - what was accomplished, what trade-offs were made, what the next agent needs to know - rather than implementation details like which tools were invoked or what parameters were passed. For dag-designer, that means explaining the decomposition strategy and verification approach; for dag-reviewer, it's about structural soundness and whether there are capability gaps that need addressing.

I've landed on the right level of abstraction for these schemas. The user wants me to move forward and write the actual files rather than continue debating the spec. I'm settling on keeping `<|think|>` only in skill files where specific reasoning steps are needed, rather than cluttering agent system prompts with it. Now I'll write out all the files in parallel batches.

Crystal clear. The response is structured prose at the goal level — what was accomplished, what decisions were made, what the next agent needs to know. Never tool calls, never file paths, never node parameters. The structure serves headwrench's ability to make the next goal-based delegation, not to audit what the subagent did.

For our agents specifically:
- **designer** tells headwrench: how the plan decomposes, what the key structural decisions were, why — enough for headwrench to make a confident "go review this" delegation
- **reviewer** tells headwrench: what's structurally sound, what's missing and why it matters, where additions go — enough for headwrench to say "go revise with these findings"
- **reviser** tells headwrench: what improved and why — enough for headwrench to say "go write descriptions"
- **description-author** tells headwrench: coverage and any notable decisions — enough for headwrench to close the loop

All prose under goal-oriented headers. No minutia. Writing now.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Rewrite CATALOGUE-CORE.md",
      "status": "in_progress",
      "priority": "high"
    },
    {
      "content": "Rewrite CATALOGUE.md",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-tools SKILL.md",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite build-dags-core SKILL.md",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-design-example SKILL.md",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-review-criteria SKILL.md",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-revision-example SKILL.md",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-designer.md agent",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-reviewer.md agent",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-reviser.md agent",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-description-author.md agent",
      "status": "pending",
      "priority": "high"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Rewrite CATALOGUE-CORE.md",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Rewrite CATALOGUE.md",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-tools SKILL.md",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite build-dags-core SKILL.md",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-design-example SKILL.md",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-review-criteria SKILL.md",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-revision-example SKILL.md",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-designer.md agent",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-reviewer.md agent",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-reviser.md agent",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-description-author.md agent",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Claude Sonnet 4.6 · 21.3s)

**Tool: write**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/planning/plan-session/node-library/CATALOGUE-CORE.md",
  "content": "# Node Library Catalogue — Core Components\n\nUse only these components for the first-pass design.\n\n## Structural Rules\n\n- **Acyclic.** No loops. Retries are unrolled sequences: `work-item → verify → work-item(fix) → verify-retry → [pass path | write-notes-failure]`. Each retry adds explicit nodes — there is no loop-back construct.\n- Every path terminates at a `write-notes` leaf — no dead ends.\n- `verify` has exactly 2 children: pass path (continues forward) and fail path (enters fix cycle).\n- `decision-gate` has exactly 2 children: mutually exclusive branches.\n- Branches are mutually exclusive — parallel work is unsupported.\n- **Entry point:** the first work node. **Exit points:** all `write-notes` leaf nodes, each marked `success` or `failure`.\n\n## Components\n\n| Component | Use when |\n|-----------|----------|\n| `work-item` | Any project mutation — code changes, file edits, refactors, documentation updates. |\n| `project-search-and-analysis` | Investigation without mutation. Place before `work-item` when the executor cannot be assumed to know the current state of what they're changing. |\n| `verify` | Branching check after `work-item`. Pass continues forward; fail enters a fix cycle. **Use this — not `decision-gate` — for verifying implementation outcomes.** |\n| `decision-gate` | Executor chooses a branch based on accumulated evidence. **Use for routing decisions — not for verifying implementation outcomes.** Must have exactly 2 children. |\n| `run-project-commands` | Shell command execution. Required when a `work-item` depends on state only a command can produce: installing dependencies, running build or generation tools, scaffolding, initializing submodules. Place before the `work-item` that consumes the result. |\n| `write-notes` | Stores findings, decisions, and context to semantic notes. **Every leaf node must be `write-notes`.** Success leaves capture what was accomplished; failure leaves capture what went wrong. |\n| `commit` | Git checkpoint. Place after a successful `verify` on a meaningful unit of work — where \"meaningful\" means you'd want to roll back to here if everything downstream failed. |\n| `sequential-thinking` | Pure reasoning with no side effects. Use when a planning or decision step benefits from structured reasoning before action. |\n| `compress` | Compresses closed conversation sections to free context. **Always followed by `kickoff-refresher`.** |\n| `kickoff-refresher` | Realigns the agent after context compression. **Always placed immediately after `compress`.** |\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Claude Sonnet 4.6 · 10.8s)

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Rewrite CATALOGUE-CORE.md",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Rewrite CATALOGUE.md",
      "priority": "high",
      "status": "in_progress"
    },
    {
      "content": "Rewrite dag-tools SKILL.md",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite build-dags-core SKILL.md",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-design-example SKILL.md",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-review-criteria SKILL.md",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-revision-example SKILL.md",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-designer.md agent",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-reviewer.md agent",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-reviser.md agent",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-description-author.md agent",
      "priority": "high",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Rewrite CATALOGUE-CORE.md",
    "priority": "high",
    "status": "completed"
  },
  {
    "content": "Rewrite CATALOGUE.md",
    "priority": "high",
    "status": "in_progress"
  },
  {
    "content": "Rewrite dag-tools SKILL.md",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite build-dags-core SKILL.md",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-design-example SKILL.md",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-review-criteria SKILL.md",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-revision-example SKILL.md",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-designer.md agent",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-reviewer.md agent",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-reviser.md agent",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-description-author.md agent",
    "priority": "high",
    "status": "pending"
  }
]
```

---

## Assistant (Build · Claude Sonnet 4.6 · 14.3s)

**Tool: write**

**Input:**
```json
{
  "content": "# Node Library Catalogue\n\n## Structural Rules\n\n- **Acyclic.** No loops. Retries are unrolled sequences: `work-item → verify → work-item(fix) → verify-retry → [pass path | write-notes-failure]`. Each retry adds explicit nodes — there is no loop-back construct.\n- Every path terminates at a `write-notes` leaf — no dead ends.\n- `verify` has exactly 2 children: pass path (continues forward) and fail path (enters fix cycle).\n- `decision-gate` and `user-decision-gate` have exactly 2 children: mutually exclusive branches.\n- Branches are mutually exclusive — parallel work is unsupported.\n- **Entry point:** the first work node. **Exit points:** all `write-notes` leaf nodes, each marked `success` or `failure`.\n\n## Core\n\n| Component | Use when |\n|-----------|----------|\n| `work-item` | Any project mutation — code changes, file edits, refactors, documentation updates. |\n| `project-search-and-analysis` | Investigation without mutation. Place before `work-item` when the executor cannot be assumed to know the current state of what they're changing. |\n| `verify` | Branching check after `work-item`. Pass continues forward; fail enters a fix cycle. **Use this — not `decision-gate` — for verifying implementation outcomes.** |\n| `decision-gate` | Executor chooses a branch based on accumulated evidence. **Use for routing decisions — not for verifying implementation outcomes.** Must have exactly 2 children. |\n| `run-project-commands` | Shell command execution. Required when a `work-item` depends on state only a command can produce: installing dependencies, running build or generation tools, scaffolding, initializing submodules. Place before the `work-item` that consumes the result. |\n| `write-notes` | Stores findings, decisions, and context to semantic notes. **Every leaf node must be `write-notes`.** Success leaves capture what was accomplished; failure leaves capture what went wrong. |\n| `commit` | Git checkpoint. Place after a successful `verify` on a meaningful unit of work — where \"meaningful\" means you'd want to roll back to here if everything downstream failed. |\n| `sequential-thinking` | Pure reasoning with no side effects. Use when a planning or decision step benefits from structured reasoning before action. |\n| `compress` | Compresses closed conversation sections to free context. **Always followed by `kickoff-refresher`.** |\n| `kickoff-refresher` | Realigns the agent after context compression. **Always placed immediately after `compress`.** |\n\n## Research\n\n| Component | Use when |\n|-----------|----------|\n| `external-scout` | External research on any established library, framework, API, tool, or current practice. Includes a user approval gate. **Default choice for all external research.** Scope each node to a single answerable question — split broad research needs into multiple targeted scouts. |\n| `deep-research` | Comprehensive autonomous research on novel algorithms, frontier techniques, or cutting-edge approaches where no established answer exists. **Rarely needed** — if `external-scout` can answer the question, use that instead. |\n\n## Logic\n\n| Component | Use when |\n|-----------|----------|\n| `user-decision-gate` | The decision requires user preference rather than executor judgment. Must have exactly 2 children. |\n\n## General\n\n| Component | Use when |\n|-----------|----------|\n| `user-discussion` | User input would prevent wasted work, or a significant architectural decision should be surfaced before proceeding. Also use when the user's original prompt indicated they want to be consulted at key points. |\n| `autonomous-work` | Delegates to autonomous-agent. Include only when the user explicitly approved autonomous work during planning. |\n",
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/planning/plan-session/node-library/CATALOGUE.md"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Claude Sonnet 4.6 · 14.5s)

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Rewrite CATALOGUE-CORE.md",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Rewrite CATALOGUE.md",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Rewrite dag-tools SKILL.md",
      "priority": "high",
      "status": "in_progress"
    },
    {
      "content": "Rewrite build-dags-core SKILL.md",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-design-example SKILL.md",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-review-criteria SKILL.md",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-revision-example SKILL.md",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-designer.md agent",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-reviewer.md agent",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-reviser.md agent",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-description-author.md agent",
      "priority": "high",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Rewrite CATALOGUE-CORE.md",
    "priority": "high",
    "status": "completed"
  },
  {
    "content": "Rewrite CATALOGUE.md",
    "priority": "high",
    "status": "completed"
  },
  {
    "content": "Rewrite dag-tools SKILL.md",
    "priority": "high",
    "status": "in_progress"
  },
  {
    "content": "Rewrite build-dags-core SKILL.md",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-design-example SKILL.md",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-review-criteria SKILL.md",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-revision-example SKILL.md",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-designer.md agent",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-reviewer.md agent",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-reviser.md agent",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-description-author.md agent",
    "priority": "high",
    "status": "pending"
  }
]
```

---

## Assistant (Build · Claude Sonnet 4.6 · 13.8s)

**Tool: write**

**Input:**
```json
{}
```

**Error:**
```
Tool execution aborted
```

---

## User

real quick, im noticing that doesnt really look a whole lot like the gemma prompt document. it seemed like gemma perfers structured data, xml-like tags, things like that. barebones in a way, not markdown. just asking, not assuming youre wrong. im just trying to understand myself

---

## Assistant (Build · Claude Sonnet 4.6 · 17.5s)

_Thinking:_

The user is asking whether the catalogue format should be more aligned with the Gemma 4 E4B prompting guide, which recommends XML-style tags and structured data rather than markdown.

This is a good question. Let me think about this carefully.

The guide says:
- Use XML-style tags as structural delimiters (`<role>`, `<instructions>`, `<constraints>`, `<output_format>`)
- These give the model hard boundaries between prompt sections
- Keep system prompts under 200-500 tokens
- Structure: Role → Task → Context → Constraints → Output Format

But the catalogues are reference documents - they're loaded as context (probably as skill file content or similar), not as system prompts per se.

---

## User

i dont think the document was specific to just system prompts, or did i misread?

---

## Assistant (Build · Claude Sonnet 4.6 · 33.6s)

_Thinking:_

The user is asking whether the Gemma guide's recommendations about XML tags, structured data, and barebones formatting apply to the catalogue/skill files too, not just system prompts.

Let me re-read the guide's key points:

1. "Use XML-style tags as structural delimiters" - `<role>`, `<instructions>`, `<constraints>`, etc.
2. "Keep the system prompt under 200–500 tokens"
3. "Front-load important rules, place negative constraints last"
4. The template uses `<rules>`, `<output_format>` tags

The guide says these are for "orchestrated agent node" system prompts specifically.

So the nuance here is that skill files get loaded as context into the agent's conversation rather than functioning as system prompts themselves, but Gemma still processes them, so the structural clarity from XML tags would help. The catalogue is really a reference document though, and markdown tables actually work well for that purpose since they're inherently structured and easy to scan—they're not prose, they have clear delimiters built in. The catalogue structure could benefit from XML tags to give the model clearer boundaries. I'm picturing something like wrapping the rules in `<rules>` tags and the component tables in `<components>` tags, or even more explicitly nesting everything under a `<catalogue>` wrapper with a variant attribute. For skill files, I'd add XML tags around the major sections—task, procedure, rules—so each part is clearly delineated. The agent system prompts already follow the guide's template pretty closely, but the catalogues and skill files could use that same structured approach to help the model parse them more reliably.

Good question, and you're right to push on it. The guide's recommendations aren't limited to system prompts — they apply to any content Gemma reads, because the structural clarity benefits apply wherever the model processes text.

The honest breakdown:

**Agent system prompts** — the guide applies fully and directly. `<role>`, `<rules>`, `<output_format>` tags, short and front-loaded, negative constraints last.

**Skill files** — these are loaded as context the model reads during execution. The guide's recommendation for XML tags as hard section boundaries applies here too. A skill file with `<procedure>`, `<rules>`, `<constraints>` sections gives Gemma clearer boundaries than markdown headers alone, especially when a skill is dense with information.

**Catalogues** — tables are already structured data and Gemma handles them well. But wrapping the structural rules section in `<rules>` tags and the component table in something like `<components>` would give harder boundaries. The current format isn't wrong, but it could be tighter.

The short answer: yes, the XML tag recommendations apply broadly, not just to system prompts. The catalogues I just wrote are functionally correct but not fully optimized for Gemma. I can either revise them now or fold the style change into all remaining writes and come back to fix the two catalogues at the end — whichever you prefer.

Worth noting: the guide doesn't say abandon markdown entirely, just that XML tags provide the hard section boundaries that help small models not blend content across sections.



---

## User

one thing about abandoning markdown, however, is token efficiency. one thing im noticing from the document is how dang simple it is. and it seems like with gemma less might be more?'

---

## Assistant (Build · Claude Sonnet 4.6 · 30.8s)

_Thinking:_

The user is making a really good point. The guide emphasizes:
1. Keep system prompts under 200-500 tokens
2. Every unnecessary token competes with task context for limited attention
3. Simple, atomic, role-constrained prompts
4. Less is more for a 4B model

And they're pointing out that markdown tables with all their `|` delimiters and `---` separators are actually token-heavy compared to simpler formats. An XML tag like `<rules>` is just one token cluster, but a markdown table row with 3 columns has multiple `|` characters plus spaces.

For a catalogue entry like:
```
| `work-item` | Any project mutation — code changes, file edits, refactors, documentation updates. |


```

vs:
```
work-item: Any project mutation — code changes, file edits, refactors, documentation updates.
```

The latter is simpler and more token-efficient. The guide says Gemma responds best to "atomic, role-constrained prompts with explicit output schemas" and warns about "too detailed or not clearly expressed" instructions.

So the question is: for a catalogue/reference document, what's the most token-efficient format that still gives Gemma clear structure?

Options:
1. Plain list with colons: `work-item: description`
2. XML-tagged sections with simple lists
3. Markdown tables (current)

I think the answer might be XML-tagged sections with simple colon-separated entries. Something like:

```
<rules>
- Acyclic. Retries are unrolled: work-item means any project mutation — code changes, file edits, refactors, documentation updates.
```

That's cleaner and more token-efficient than the markdown table approach. I'm realizing the catalogue entries need to be stripped down to essentials—just the component name, a single-sentence "use when" guideline, and the critical distinctions that prevent common mistakes. Before I rewrite those two catalogues, I should check with the user that this direction makes sense.

Yes, exactly. The guide says every token in the system prompt competes with task context for the model's attention budget. At 4.5B active parameters, that's a real constraint.

Markdown tables are token-heavy — every `|`, every `---`, every padding space. For a catalogue entry, this:

```
| `work-item` | Any project mutation — code changes, file edits, refactors, documentation updates. |
```

...is far more tokens than this:

```
work-item: Any project mutation — edits, refactors, docs.
```

And the guide's own template is striking in how sparse it is. No formatting ceremony, just role → rules → output format, done.

So the right approach for everything is probably:

- **XML tags** for hard section boundaries (`<rules>`, `<components>`, `<constraints>`)
- **Plain colon-separated lists** inside those tags instead of tables
- **Ruthless brevity** — one tight sentence per entry, critical distinctions only
- Strip any word that isn't load-bearing

The two catalogues I just wrote need to be redone this way. And the skill files and agent prompts should follow the same principle — XML-tagged sections, dense and spare inside them.

Want me to redo the catalogues now before moving forward, so the style is locked in for everything else?



---

## User

yeah, let's go all-in. i have the current state of things committed and pushed to git, so i have no worries about it breaking things and it will be a good experiment to see if the ruthless brevity approach wins out

---

## Assistant (Build · Claude Sonnet 4.6 · 52.1s)

_Thinking:_

Let me now write all the files with the ruthless brevity approach:- XML tags for section boundaries
- Plain colon-separated lists, not tables
- One tight sentence per entry
- Critical distinctions only
- Strip every non-load-bearing word

Let me think through each file's minimal viable content:

**CATALOGUE-CORE.md:**
```xml
<rules>
- Acyclic. Retries unroll: work-item → verify → work-item(fix) → verify-retry → [pass | write-notes-failure]. No loop-back.
- Every path ends at a write-notes leaf. No dead ends.
- verify: exactly 2 children — pass path and fail path.


- decision-gate: exactly 2 children — mutually exclusive branches.
- Branches are mutually exclusive. No parallel work.
- Entry: first work node. Exits: write-notes leaves marked success or failure.
</rules>

<components>
work-item: Any project mutation — edits, refactors, documentation.
project-search-and-analysis: Investigation without mutation. Use before work-item when current state is unknown.
verify: Branching check after work-item. Pass continues; fail enters fix cycle. Not for routing decisions.
decision-gate: Routes based on accumulated evidence. Not for verifying implementation. 2 children required.
run-project-commands: Shell execution. Use when work-item needs state

run-project-commands handles shell operations like installs, builds, and scaffolding — place it before any work-item that depends on its output. write-notes captures findings and decisions at every leaf node, marking success or failure. commit creates a Git checkpoint after successful verification when you'd want a rollback point. sequential-thinking provides structured reasoning before action when it adds clarity. compress closes conversation sections and always precedes kickoff-refresher, which realigns the agent afterward. The full catalogue extends the core with research, user-decision-gate, user-discussion, and autonomous-work components.

Now I'm organizing the skill files — dag-tools is a pure reference with XML tags and sparse colon-separated params. build-dags-core uses `<|think|>` only for decomposition, then three plain numbered steps with rules at the end. dag-design-example is a worked reference without thinking tags, just the phase plan and code blocks. dag-review-criteria has nine exercises with `<|think|>` wrapping the deep analysis. dag-revision-example shows five patterns with `<|think|>` on the planning step, then plain execution. Agent files follow a consistent structure: role, methodology as brief numbered steps, constraints, and output format in XML tags.

I need to reconsider the `<|think|>` placement — the guide emphasizes answer-first reasoning for smaller models, but I'm still working through where thinking tags should actually go.

`<|think|>` is Gemma 4's native thinking mode, not a prompt-based chain-of-thought. For E4B, I should enable it for planning and multi-step reasoning but disable it for mechanical tasks. In the skill files, `<|think|>` should appear at the beginning of reasoning sections, not at the end as reflection. For build-dags-core, it goes right before decomposition — "think about your phases before building." For dag-review-criteria, it starts Part 2 where deep analysis happens. For dag-revision-example, it precedes the planning step — "think about which patterns apply and write your target state before acting." For agent files, I'm still deciding whether `<|think|>` belongs at all since they're read as system prompts on every invocation, and the guide suggests disabling it for certain contexts.

The agent files themselves are orientation documents, not reasoning triggers. The actual complex thinking happens in the skill files — dag-designer's phase decomposition is triggered by build-dags-core, dag-reviewer's deep reasoning by dag-review-criteria, and dag-reviser's planning by dag-revision-example. So `<|think|>` stays out of agent files entirely. For output schemas, I need to describe what each agent produces semantically: dag-designer outputs the plan's purpose, phase structure with rationale, key structural decisions, and what reviewers should focus on; dag-reviewer outputs structural health assessment, pattern analysis, and specific improvement recommendations; dag-reviser outputs the revision strategy and target state.

I'll use markdown headers as delimiters to enforce structure through prose rather than strict JSON, keeping the format clean and readable.

Now I'm mapping out the file-by-file approach with tight word budgets: CATALOGUE-CORE and CATALOGUE get XML tags with 200-300 words, the skill files vary between 150-400 words depending on complexity, with deeper analysis sections getting `<|think|>` blocks where needed.

The agent files follow a different structure—YAML frontmatter for metadata, then system prompt content, all staying around 150 words each. I should preserve that format distinction as I write through them.

Let me start with the catalogues that need reworking, then move through the skills and agents in sequence.

---

## User

so, let's leave the thinking blocks till the end

also, let's do an absolutely zero-markdown approach. nowhere in any guide/website/whatever have i seen markdown and gemma together

---

## Assistant (Build · Claude Sonnet 4.6 · 72.0s)

_Thinking:_

The user wants:
1. Go all-in on ruthless brevity with XML tags and plain text
2. Zero markdown - no `#` headers, no `**bold**`, no `- bullet points`, no `| tables |`, no backticks
3. Leave thinking blocks (`<|think|>`) till the end - decide where they go after writing everything else
4. Everything is XML-tagged sections with plain colon-separated or simple line-break-separated content

Let me think about what this looks like for each file type.

**For catalogues:**
```xml
<catalogue variant="core">
<rules>
Acyclic. Retries are unrolled: work-item -> verify -> work-item(fix) -> verify-retry -> [pass | write-notes-failure]. No loop-back construct.


```

Now I'm mapping out the component definitions and their constraints. Every path must end at a write-notes leaf, verify always branches into exactly two outcomes, and decision-gates route based on evidence rather than implementation checks. The key components are work-item for mutations, project-search-and-analysis for investigation, verify for post-work branching, decision-gate for routing, run-project-commands for shell execution, write-notes for storing context, and commit for git checkpoints after successful verification.

```
I'm realizing the user explicitly said no markdown anywhere, but these skill files are `.md` files that get read as plain text. So I need to strip all the markdown formatting—no headers, bold, bullets, tables, backticks, or blockquotes—and keep just the XML tags and plain text content. The file extension doesn't matter; what matters is that Gemma reads pure text. I'm also noticing there's YAML frontmatter in some of these files that I need to handle carefully.
```

Actually, I should preserve the YAML frontmatter since OpenCode uses it to parse metadata. The content after that frontmatter is what the model actually reads, and that's where I need to eliminate all markdown. For code examples in files like dag-design-example, I can wrap them in XML tags like `<example>` with plain text and indentation instead of using markdown code blocks.

The user's emphasis on "zero markdown" and never seeing it paired with Gemma suggests I should strip all markdown formatting throughout. They also want me to write all the files first without thinking blocks, then we'll decide together where those should go.

I'm planning the structure for each file type: catalogues stay pure content with XML tags and plain text, skill files keep their YAML frontmatter but use XML sections and plain text instead of markdown, and agent files do the same. Now I need to figure out how to represent component names without backticks—maybe just plain text or wrapped in angle brackets instead.

For the dag-tools skill, I'm converting the reference into a structured list format where each tool has its parameters and description laid out clearly without markdown tables. The agent response formats need specific headers that guide what information each agent should provide: the designer focuses on rationale and key decisions, the reviewer prioritizes structural health and recommendations, and the reviser documents what changed.

I'm deciding to keep the YAML frontmatter in both agent and skill files since OpenCode needs it for parsing, but strip all markdown from the actual content that Gemma reads. Now I'll write out all the files with ruthless brevity.

I'm organizing this into batches for efficiency: the catalogues first since they're independent, then the skills, then the agents. The catalogues won't have frontmatter, just pure XML-tagged content. Skills and agents will keep their YAML headers but have stripped-down system prompt content underneath.

Let me start writing all the files now, being strict about avoiding any markdown in the actual content bodies.

For the core catalogue, I'm laying out the fundamental DAG rules—acyclic paths that always terminate at write-notes leaves, with verify nodes branching into pass and fail paths, and decision-gates routing based on evidence. I'm defining each component's purpose: work-item for mutations, project-search-and-analysis for investigation, verify for implementation checks, decision-gate for routing logic, run-project-commands for shell operations, and write-notes as mandatory leaf nodes capturing outcomes.

The full catalogue will extend this with research, logic, and general-purpose sections for more complex workflows.

For the dag-tools skill file, I'm documenting the core functions: get_planning_components_catalogue to fetch component definitions, init_dag to create a new plan, add_nodes_to_dag to bulk-insert nodes, and add_node for individual node creation. Each tool specifies required parameters and their constraints.

---

## User

so, the stuff opencode reads like front matter is fine. these markdown files are consumed by opencode, but all the agent sees is the text, not an md file, no frontmatter

---

## Assistant (Build · Claude Sonnet 4.6 · 30.2s)

_Thinking:_

The user wants:
1. Zero markdown in the content (no headers, no tables, no bold, no backticks for code, no bullet points with `-`)
2. XML tags for structure
3. Ruthless brevity
4. Leave `<|think|>` blocks until the end (add them as the last pass)
5. YAML frontmatter is fine (OpenCode reads it, not Gemma)
6. The agent only sees the text content, not the file format

So the style is:
- YAML frontmatter (kept as-is, OpenCode needs it)
- Body: pure XML-tagged sections with plain text inside


- For lists, use numbered or just plain line-separated entries
- For component catalogues, use XML tags with plain text descriptions

The rules for workflow graphs are: acyclic structure with explicit retry nodes (no loops), every path ends at a write-notes leaf, verify nodes have exactly two children (pass and fail), decision-gates have two mutually exclusive branches, and the entry point is the root.

The components available are work-item for mutations, project-search-and-analysis for investigation, verify for checking outcomes, decision-gate for routing, run-project-commands for shell execution, write-notes for storing findings, and commit for git checkpoints after successful verification.

I'm also considering sequential-thinking for pure reasoning, compress for closing conversation sections followed by kickoff-refresher to realign context, and I need to expand the full catalogue with research, logic, and general sections.

My approach is to structure everything in clean XML with plain text inside—no markdown, token-efficient. I'll write the catalogues first, then skills, then agents, and save the thinking blocks for the end as requested.

---

## User

oh, i found a solid, probably more complete reference... sorry i keep throwing things at you, but yeah. check this: https://www.promptingguide.ai/models/gemma

---

## Assistant (Build · Claude Sonnet 4.6 · 9.1s)

_Thinking:_

Let me fetch that URL and read through it.

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://www.promptingguide.ai/models/gemma",
  "format": "text"
}
```

**Output:**
```
Gemma | Prompt Engineering Guide<!-- --> 🚀 Learn to build apps with Claude Code! Use PROMPTING for 20% off Enroll now →Prompt Engineering Guide🎓 CoursesAboutAboutGitHubGitHub (opens in a new tab)DiscordDiscord (opens in a new tab)✨ ServicesPrompt EngineeringIntroductionLLM SettingsBasics of PromptingPrompt ElementsGeneral Tips for Designing PromptsExamples of PromptsPrompting TechniquesZero-shot PromptingFew-shot PromptingChain-of-Thought PromptingMeta PromptingSelf-ConsistencyGenerate Knowledge PromptingPrompt ChainingTree of ThoughtsRetrieval Augmented GenerationAutomatic Reasoning and Tool-useAutomatic Prompt EngineerActive-PromptDirectional Stimulus PromptingProgram-Aided Language ModelsReActReflexionMultimodal CoTGraph PromptingAI AgentsIntroduction to AgentsAgent ComponentsAI Workflows vs AI AgentsContext Engineering for AI AgentsContext Engineering Deep DiveFunction CallingDeep AgentsGuidesOptimizing PromptsOpenAI Deep ResearchReasoning LLMs4o Image GenerationContext Engineering GuideApplicationsFine-tuning GPT-4oFunction CallingContext Caching with LLMsGenerating DataGenerating Synthetic Dataset for RAGTackling Generated Datasets DiversityGenerating CodeGraduate Job Classification Case StudyPrompt FunctionPrompt HubClassificationSentiment ClassificationFew-Shot Sentiment ClassificationCodingGenerate Code SnippetGenerate MySQL QueryDraw TiKZ DiagramCreativityRhymesInfinite PrimesInterdisciplinaryInventing New WordsEvaluationEvaluate Plato&#x27;s DialogueInformation ExtractionExtract Model NamesImage GenerationDraw a Person Using AlphabetMathematicsEvaluating Composite FunctionsAdding Odd NumbersQuestion AnsweringClosed Domain Question AnsweringOpen Domain Question AnsweringScience Question AnsweringReasoningIndirect ReasoningPhysical ReasoningText SummarizationExplain A ConceptTruthfulnessHallucination IdentificationAdversarial PromptingPrompt InjectionPrompt LeakingJailbreakingModelsChatGPTClaude 3Code LlamaFlanGeminiGemini AdvancedGemini 1.5 ProGemmaGPT-4Grok-1Kimi K2.5LLaMALlama 3Mistral 7BMistral LargeMixtralMixtral 8x22BOLMoPhi-2SoraLLM CollectionRisks &amp; MisusesAdversarial PromptingFactualityBiasesLLM Research FindingsLLM AgentsRAG for LLMsLLM ReasoningRAG FaithfulnessLLM In-Context RecallRAG Reduces HallucinationSynthetic DataThoughtSculptInfini-AttentionLM-Guided CoTTrustworthiness in LLMsLLM TokenizationWhat is Groq?PapersToolsNotebooksDatasetsAdditional ReadingsServicesEnglishLightOn This PageResultsGemma 7B Prompt FormatHow to Prompt Gemma 7BZero-shot PromptingZero-shot Prompting with System PromptRole PlayingReasoningResources and IntegrationsReferencesQuestion? Give us feedback → (opens in a new tab)Edit this pageModelsGemmaCopy pageGemma
Google DeepMind releases Gemma, a series of open language models inspired by the same research and technology used to create Gemini. The Gemma model release includes 2B (trained on 2T tokens) and 7B (trained on 6T tokens) models including base and instruction-tuned checkpoints. The models are trained on a context length of 8192 tokens and generally outperform Llama 2 7B and Mistral 7B models on several benchmarks.
The Gemma model architecture is based on the transformer decoder with improvements including multi-query attention (opens in a new tab) (used by the 2B model), multi-head attention (used by 7B model), RoPE embeddings (opens in a new tab), GeGLU activations (opens in a new tab), and normalizer location (opens in a new tab).
According to the technical report (opens in a new tab), Gemma 2B and 7B are trained on 2T and 6T tokens mainly consisting of web documents, mathematics, and code. Unlike Gemini, these models are not explicitly trained to support multilingual or multimodal capabilities. The vocabulary size is 256K tokens and uses a subset of the SentencePiece tokenize of Gemini, preserves whitespace in splits digits, and relies on byte-level encodings for unknown tokens.
The instruction-tuned models are tuned using supervised fine-tuning on a mix of text-only synthetic and human-generated prompt response pairs and reinforcement learning from human feedback (RLHF) with the reward model trained on labeled preference data and the policy based on a set of high-quality prompts. Note that all the datasets used are English only. As shown in the table below, the instruction-tuned models also use specific formatting control tokens to indicate roles and turns in a conversation.

Results
As shown in the figure below, the Gemma 7B model demonstrates strong performance on math, science, and code-related tasks. The scores correspond to the average scores on academic benchmark evaluations grouped by capability.

Gemma 7B outperforms Llama 2 7B and Mistral 7B on various academic benchmarks with notable performance on HumanEval, GSM8K, MATH, and AGIEval and improved performance on reasoning, dialogue, mathematics, and code.

The Gemma 7B instruction tuned models also outperform the Mistral-7B v0.2 Instruct model on safety and instruction following as evaluated by humans.

Gemma is also evaluated on several safety academic benchmarks and compared with Mistral. The technical report also mentions the use of debiasing techniques and red-teaming to potentially mitigate common risks associated with large language models (LLMs). You can find more information on how to responsibly develop with Gemma in the model card (opens in a new tab) and Responsible Generative AI toolkit (opens in a new tab).

Gemma 7B Prompt Format
The Gemma base models don&#x27;t use any specific prompt format but can be prompted to perform tasks through zero-shot/few-shot prompting. The Gemma Instruct model uses the following format:
&lt;start_of_turn&gt;user
Generate a Python function that multiplies two numbers &lt;end_of_turn&gt;
&lt;start_of_turn&gt;model
Here is a table showing the relevant formatting control tokens available in Gemma:
ContextRelevant TokenUser turnuserModel turnmodelStart of conversation turn&lt;start_of_turn&gt;End of conversation turn&lt;end_of_turn&gt;
You can also use the special control tokens in the context of a multi-turn user prompt as follows:
&lt;start_of_turn&gt;user
What is a good place for travel in the US?&lt;end_of_turn&gt;
&lt;start_of_turn&gt;model
California.&lt;end_of_turn&gt;
&lt;start_of_turn&gt;user
What can I do in California?&lt;end_of_turn&gt;
&lt;start_of_turn&gt;model
How to Prompt Gemma 7B
Prompting Gemma 7B effectively requires being able to use the prompt template properly. In the following examples, we will cover a few examples that demonstrate the use effective use of the prompt template of Gemma 7B Instruct for various tasks.
Zero-shot Prompting
As with any model, you can leverage Gemma&#x27;s zero-shot capabilities by simply prompting it as follows:
&lt;start_of_turn&gt;user
Explain why the sky is blue&lt;end_of_turn&gt;
&lt;start_of_turn&gt;model
Zero-shot Prompting with System Prompt
Adding a system role or system prompt helps to steer LLMs better. While there is no explicit system role in Gemma, you can add additional instructions as part of the prompt as follows:
&lt;start_of_turn&gt;user
Answer the following question in a concise and informative manner:

Explain why the sky is blue&lt;end_of_turn&gt;
&lt;start_of_turn&gt;model
In the example above, we added &quot;Answer the following question in a concise and informative manner:&quot; as an additional instruction or system prompt to steer the model better.
Role Playing
We can also test Gemma for role-playing capabilities, which is a useful ability to not only personalize model responses but also to build more complex domain-specific LLM agents (opens in a new tab).
Prompt:
&lt;start_of_turn&gt;user
You are a helpful 2nd-grade teacher. Help a 2nd grader to answer questions in a short and clear manner.

Explain why the sky is blue&lt;end_of_turn&gt;
&lt;start_of_turn&gt;model
Model response:
Sure, here is an explanation for why the sky is blue:

The sky appears blue because of a phenomenon called Rayleigh Scattering.

Here&#x27;s the science behind it:

Sunlight is made up of different colors of light, like red, green, blue, and violet.
When sunlight hits the Earth&#x27;s atmosphere, the different colors of light scatter in different directions.
Blue light scatters more easily than other colors because it has shorter wavelengths.
The scattered blue light travels in all directions, including towards your eyes.
That&#x27;s why we see the sky as blue.
It&#x27;s important to note that this explanation is simplified and does not account for all scientific details. However, it gives you a good understanding of the basic science behind why the sky appears blue.
Note that we haven&#x27;t checked the response for accuracy or whether it&#x27;s suitable for a 2nd grader. However, you can compare the above response with the response obtained from the chain-of-thought prompt that follows.
Reasoning
You can elicit Gemma&#x27;s reasoning capabilities by using zero-shot chain-of-thought prompting (opens in a new tab) as follows:
Prompt:
&lt;start_of_turn&gt;user
Think and write your step-by-step reasoning before responding.

Explain why the sky is blue.&lt;end_of_turn&gt;
&lt;start_of_turn&gt;model
Model response (truncated for brevity):
Step 1: Scattering of Light

The sky appears blue due to the phenomenon of scattering of light. When sunlight hits the Earth&#x27;s atmosphere, it interacts with the particles of air, primarily nitrogen and oxygen molecules.

Step 2: Rayleigh Scattering

Rayleigh scattering is the specific scattering mechanism that occurs when light interacts with particles much smaller than the wavelength of light. In this process, shorter wavelengths (blue light) are scattered more effectively than longer wavelengths (red light).

Step 3: Blue Scattered Light Travels in All Directions

...

Conclusion

The sky appears blue due to the scattering of light, specifically Rayleigh scattering. Shorter wavelengths of light are scattered more effectively, and this scattered light travels in all directions, with the scattered light that travels opposite to the sun&#x27;s rays being most visible to our eyes.
Something to note about the Gemma model is that it can output markdown format automatically. We have edited the text format a bit for demonstration and simplicity purposes but the content is exactly what the model responded with. Note that we also didn&#x27;t assess the accuracy of the response or if the model hallucinates.
Resources and Integrations
Here are several resources and integrations that were part of the Gemma release:

Colab (opens in a new tab) and Kaggle (opens in a new tab) notebooks
Hugging Face models (opens in a new tab)
MaxText (opens in a new tab)
NVIDIA NeMo (opens in a new tab)
TensorRT-LLM (opens in a new tab)
Gemma 7B is available in the NVIDIA AI Playground (opens in a new tab)

According to the official blog release (opens in a new tab), the Terms of Use (opens in a new tab) permit responsible commercial usage and distribution for all organizations, regardless of size.
References

Gemma: Introducing new state-of-the-art open models (opens in a new tab)
Gemma: Open Models Based on Gemini Research and Technology (opens in a new tab)
Responsible Generative AI Toolkit (opens in a new tab)
Fast Transformer Decoding: One Write-Head is All You Need (opens in a new tab)
Roformer: Enhanced transformer with rotary position embedding (opens in a new tab)
GLU variants improve transformer (opens in a new tab)
Root mean square layer normalization (opens in a new tab)
Gemini 1.5 ProGPT-4EnglishLightCopyright © 2026 DAIR.AI
```

---

## Assistant (Build · Claude Sonnet 4.6 · 52.8s)

_Thinking:_

This page is about Gemma 7B (the original), not Gemma 4. It's not that useful for our purposes. The key takeaway from this page is:

1. Gemma uses `<start_of_turn>user` and `<end_of_turn>` tokens for conversation formatting
2. No explicit system role - additional instructions go in the user turn
3. Simple role-playing works well
4. Chain-of-thought can be triggered with "Think and write your step-by-step reasoning before responding"
5. "Something to note about the Gemma model is that it can output markdown format automatically" - so Gemma does output markdown, and presumably can process it too


6. The examples here show that Gemma 7B responds well to plain text prompts without complex formatting or XML tags - even role-playing is just straightforward text like "You are a helpful 2nd-grade teacher..."

But this is still the older model. I need to focus back on what the user's original Gemma 4 E4B document actually specified.

Looking at the next part of the thinking, it seems the user's document recommended XML-style tags for hard boundaries, which is different from what Gemma 7B examples show. So for Gemma 4, the approach should combine both: plain text as the foundation, but with XML tags strategically placed for section boundaries and constraints. No markdown formatting at all - just simple colon-separated lists or plain sentences. And since the user mentioned these files are consumed by opencode but the agent only sees raw text without frontmatter, I need to make sure the structure works when stripped down to just the content. I'm laying out the structure for catalogue files with XML tags to define the rules and components. The key constraints are that workflows must be acyclic with no loops—each retry adds new nodes rather than looping back—and every path must terminate at a write-notes leaf node marked as success or failure. I'm defining the core node types: work-item for any project mutation, project-search-and-analysis for investigation without changes, and verify as the branching point after work completes. I'm seeing the structure now—skill files define the components and procedures, while agent files define the role and methodology. I need to rebuild all the write operations using this cleaner XML-based approach without markdown formatting, keeping everything as plain text within the tags.

This page is about Gemma 7B (original) — not super relevant for Gemma 4 specifics — but the examples are telling. Every single prompt in there is plain text. No markdown headers, no tables, no bold. Just clean sentences. And it notes: "the Gemma model outputs markdown automatically" — meaning it can read and produce markdown, but the prompt examples themselves never use it.

Combined with the Gemma 4 doc you shared earlier, the picture is clear:

- **XML tags** for hard section boundaries — the model-native way to delimit structure
- **Plain text inside** — no markdown of any kind in the body
- **Terse sentences** — one tight line per concept
- **Frontmatter stays** — OpenCode reads that, the agent never sees it

So `<rules>`, `<components>`, `<procedure>`, `<constraints>`, `<response_format>` as the structural skeleton, with plain prose inside each. The catalogues I wrote need to be redone. Everything gets done this way from here.

Redoing the catalogues now, then moving straight through the rest.

**Tool: write**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/planning/plan-session/node-library/CATALOGUE-CORE.md",
  "content": "# Node Library Catalogue — Core Components\n\nUse only these components for the first-pass design.\n\n<rules>\nAcyclic. No loops. Retries are unrolled sequences: work-item → verify → fix → verify-retry → pass-path or write-notes-failure. Each retry adds explicit nodes. There is no loop-back construct.\nEvery path ends at a write-notes leaf. No dead ends.\nverify has exactly 2 children: pass path and fail path.\ndecision-gate has exactly 2 children: mutually exclusive branches.\nBranches are mutually exclusive. Parallel work is unsupported.\nEntry point: the first work node. Exit points: all write-notes leaf nodes, each marked success or failure.\n</rules>\n\n<components>\nwork-item: Any project mutation — code changes, file edits, refactors, documentation updates.\nproject-search-and-analysis: Investigation without mutation. Place before work-item when the executor cannot be assumed to know the current state of what they are changing.\nverify: Branching check after work-item. Pass continues forward; fail enters a fix cycle. Use for verifying implementation outcomes, not routing decisions.\ndecision-gate: Routes based on accumulated evidence. Use for routing decisions, not verifying implementation outcomes. Exactly 2 children required.\nrun-project-commands: Shell execution. Required when a work-item depends on state only a command can produce: installing dependencies, running build or generation tools, scaffolding, initializing submodules. Place before the work-item that consumes the result.\nwrite-notes: Stores findings, decisions, and context to semantic notes. Every leaf node must be write-notes. Success leaves capture what was accomplished; failure leaves capture what went wrong.\ncommit: Git checkpoint after a successful verify on a meaningful unit of work.\nsequential-thinking: Pure reasoning with no side effects. Use when a planning or decision step benefits from structured reasoning before action.\ncompress: Compresses closed conversation sections to free context. Always followed by kickoff-refresher.\nkickoff-refresher: Realigns the agent after context compression. Always placed immediately after compress.\n</components>\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Claude Sonnet 4.6 · 9.4s)

**Tool: write**

**Input:**
```json
{}
```

**Error:**
```
Tool execution aborted
```

---

## User

markdown is in there

---

## Assistant (Build · Claude Sonnet 4.6 · 11.1s)

_Thinking:_

The user is pointing out that there's still markdown in the file I just wrote. Let me look at what I wrote:

```
# Node Library Catalogue — Core Components

Use only these components for the first-pass design.
```

The `#` header is markdown. That needs to go. The frontmatter handles metadata; the body should be pure plain text with XML tags only.

Also, the instruction said these are markdown files consumed by OpenCode but the agent only sees the text content. So the body should have NO markdown at all - no `#` headers, no `**bold**`, no backticks for code, nothing.

Let me rewrite without any markdown.

The `#` header. The body is all plain text — no markdown of any kind, including headers.

**Tool: write**

**Input:**
```json
{
  "content": "<rules>\nAcyclic. No loops. Retries are unrolled sequences: work-item → verify → fix → verify-retry → pass-path or write-notes-failure. Each retry adds explicit nodes. There is no loop-back construct.\nEvery path ends at a write-notes leaf. No dead ends.\nverify has exactly 2 children: pass path and fail path.\ndecision-gate has exactly 2 children: mutually exclusive branches.\nBranches are mutually exclusive. Parallel work is unsupported.\nEntry point: the first work node. Exit points: all write-notes leaf nodes, each marked success or failure.\n</rules>\n\n<components>\nwork-item: Any project mutation — code changes, file edits, refactors, documentation updates.\nproject-search-and-analysis: Investigation without mutation. Place before work-item when the executor cannot be assumed to know the current state of what they are changing.\nverify: Branching check after work-item. Pass continues forward; fail enters a fix cycle. Use for verifying implementation outcomes, not routing decisions.\ndecision-gate: Routes based on accumulated evidence. Use for routing decisions, not verifying implementation outcomes. Exactly 2 children required.\nrun-project-commands: Shell execution. Required when a work-item depends on state only a command can produce: installing dependencies, running build or generation tools, scaffolding, initializing submodules. Place before the work-item that consumes the result.\nwrite-notes: Stores findings, decisions, and context to semantic notes. Every leaf node must be write-notes. Success leaves capture what was accomplished; failure leaves capture what went wrong.\ncommit: Git checkpoint after a successful verify on a meaningful unit of work.\nsequential-thinking: Pure reasoning with no side effects. Use when a planning or decision step benefits from structured reasoning before action.\ncompress: Compresses closed conversation sections to free context. Always followed by kickoff-refresher.\nkickoff-refresher: Realigns the agent after context compression. Always placed immediately after compress.\n</components>\n",
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/planning/plan-session/node-library/CATALOGUE-CORE.md"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Claude Sonnet 4.6 · 13.0s)

**Tool: write**

**Input:**
```json
{
  "content": "<rules>\nAcyclic. No loops. Retries are unrolled sequences: work-item → verify → fix → verify-retry → pass-path or write-notes-failure. Each retry adds explicit nodes. There is no loop-back construct.\nEvery path ends at a write-notes leaf. No dead ends.\nverify has exactly 2 children: pass path and fail path.\ndecision-gate and user-decision-gate have exactly 2 children: mutually exclusive branches.\nBranches are mutually exclusive. Parallel work is unsupported.\nEntry point: the first work node. Exit points: all write-notes leaf nodes, each marked success or failure.\n</rules>\n\n<components>\nwork-item: Any project mutation — code changes, file edits, refactors, documentation updates.\nproject-search-and-analysis: Investigation without mutation. Place before work-item when the executor cannot be assumed to know the current state of what they are changing.\nverify: Branching check after work-item. Pass continues forward; fail enters a fix cycle. Use for verifying implementation outcomes, not routing decisions.\ndecision-gate: Routes based on accumulated evidence. Use for routing decisions, not verifying implementation outcomes. Exactly 2 children required.\nrun-project-commands: Shell execution. Required when a work-item depends on state only a command can produce: installing dependencies, running build or generation tools, scaffolding, initializing submodules. Place before the work-item that consumes the result.\nwrite-notes: Stores findings, decisions, and context to semantic notes. Every leaf node must be write-notes. Success leaves capture what was accomplished; failure leaves capture what went wrong.\ncommit: Git checkpoint after a successful verify on a meaningful unit of work.\nsequential-thinking: Pure reasoning with no side effects. Use when a planning or decision step benefits from structured reasoning before action.\ncompress: Compresses closed conversation sections to free context. Always followed by kickoff-refresher.\nkickoff-refresher: Realigns the agent after context compression. Always placed immediately after compress.\nexternal-scout: External research on any established library, framework, API, tool, or current practice. Includes a user approval gate. Default choice for all external research. Scope each node to a single answerable question — split broad research needs into multiple targeted scouts.\ndeep-research: Comprehensive autonomous research on novel algorithms or frontier techniques where no established answer exists. Rarely needed. If external-scout can answer the question, use that instead.\nuser-decision-gate: The decision requires user preference rather than executor judgment. Exactly 2 children required.\nuser-discussion: Use when user input would prevent wasted work, when a significant architectural decision should be surfaced before proceeding, or when the user indicated they want to be consulted at key points.\nautonomous-work: Delegates to autonomous-agent. Include only when the user explicitly approved autonomous work during planning.\n</components>\n",
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/planning/plan-session/node-library/CATALOGUE.md"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Claude Sonnet 4.6 · 10.3s)

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Rewrite CATALOGUE-CORE.md",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Rewrite CATALOGUE.md",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Rewrite dag-tools SKILL.md",
      "priority": "high",
      "status": "in_progress"
    },
    {
      "content": "Rewrite build-dags-core SKILL.md",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-design-example SKILL.md",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-review-criteria SKILL.md",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-revision-example SKILL.md",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-designer.md agent",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-reviewer.md agent",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-reviser.md agent",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-description-author.md agent",
      "priority": "high",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Rewrite CATALOGUE-CORE.md",
    "priority": "high",
    "status": "completed"
  },
  {
    "content": "Rewrite CATALOGUE.md",
    "priority": "high",
    "status": "completed"
  },
  {
    "content": "Rewrite dag-tools SKILL.md",
    "priority": "high",
    "status": "in_progress"
  },
  {
    "content": "Rewrite build-dags-core SKILL.md",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-design-example SKILL.md",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-review-criteria SKILL.md",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-revision-example SKILL.md",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-designer.md agent",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-reviewer.md agent",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-reviser.md agent",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-description-author.md agent",
    "priority": "high",
    "status": "pending"
  }
]
```

---

## Assistant (Build · Claude Sonnet 4.6 · 17.7s)

**Tool: write**

**Input:**
```json
{}
```

**Error:**
```
Tool execution aborted
```

---

## User

oh this was the page i meant to link. this is the last thing, promise https://ai.google.dev/gemma/docs/core/prompt-formatting-gemma4

---

## Assistant (Build · Claude Sonnet 4.6 · 18.1s)

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://ai.google.dev/gemma/docs/core/prompt-formatting-gemma4",
  "format": "text"
}
```

**Error:**
```
The response redirected too many times. For more information, pass `verbose: true` in the second argument to fetch()
```

---

## Assistant (Build · Claude Sonnet 4.6 · 5.5s)

**Tool: searxng_web_url_read**

**Input:**
```json
{
  "url": "https://ai.google.dev/gemma/docs/core/prompt-formatting-gemma4"
}
```

**Output:**
```
<!doctype html>

[跳至主要內容 ](#main-content)

[ ![Google AI for Developers](https://www.gstatic.com/devrel-devsite/prod/v369eac9380f92e8fedc492e2689927bb3475d758266c381eee326d0b49a77481/googledevai/images/lockup-new.svg) ](/)

[模型 ](https://deepmind.google/models/gemma?hl=zh-tw)

* Gemini
* [ 關於 ](https://deepmind.google/gemini?hl=zh-tw)
* [ 文件 ](https://ai.google.dev/gemini-api/docs?hl=zh-tw)
* [ API 參考資料 ](https://ai.google.dev/api?hl=zh-tw)
* [ 定價 ](https://ai.google.dev/pricing?hl=zh-tw)

* Imagen
* [ 關於 ](https://deepmind.google/technologies/imagen/?hl=zh-tw)
* [ 文件 ](https://ai.google.dev/gemini-api/docs/imagen?hl=zh-tw)
* [ 定價 ](https://ai.google.dev/pricing?hl=zh-tw)

* Veo
* [ 關於 ](https://deepmind.google/technologies/veo/veo-2/?hl=zh-tw)
* [ 文件 ](https://ai.google.dev/gemini-api/docs/video?hl=zh-tw)
* [ 定價 ](https://ai.google.dev/pricing?hl=zh-tw)

* Gemma
* [ 關於 ](https://deepmind.google/models/gemma?hl=zh-tw)
* [ 文件 ](https://ai.google.dev/gemma/docs?hl=zh-tw)
* [ Gemmaverse ](https://ai.google.dev/gemma/gemmaverse?hl=zh-tw)

解決方案

* 使用 Gemini 建構
* [ Gemini API ](https://ai.google.dev/gemini-api/docs?hl=zh-tw)
* [ Google AI Studio ](https://aistudio.google.com?hl=zh-tw)

* 自訂 Gemma 開放式模型
* [ Gemma 開放模型 ](https://ai.google.dev/gemma?hl=zh-tw)
* [ 使用 Keras 的多框架 ](https://keras.io/keras%5F3/)
* [ 在 Colab 中進行微調 ](https://colab.sandbox.google.com/github/google/generative-ai-docs/blob/main/site/en/gemma/docs/lora%5Ftuning.ipynb?hl=zh-tw)

* 在裝置上執行
* [ Google AI 邊緣 ](https://ai.google.dev/edge?hl=zh-tw)
* [ Android 裝置上的 Gemini Nano ](https://developer.android.com/ai/gemini-nano?hl=zh-tw)
* [ Chrome 內建的網路 API ](https://developer.chrome.com/docs/ai/built-in?hl=zh-tw)

* 以負責任的方式建構
* [ 負責任的生成式 AI 工具包 ](https://ai.google.dev/responsible?hl=zh-tw)
* [ 安全的 AI 架構 ](https://saif.google?hl=zh-tw)

程式碼編寫輔助

* [ Android Studio ](https://developer.android.com/gemini-in-android?hl=zh-tw)
* [ Chrome 開發人員工具 ](https://developer.chrome.com/docs/devtools/console/understand-messages?hl=zh-tw)
* [ Colab ](https://colab.google?hl=zh-tw)
* [ Firebase ](https://firebase.google.com/products/generative-ai?hl=zh-tw)
* [ Google Cloud ](https://cloud.google.com/products/gemini/code-assist?hl=zh-tw)
* [ JetBrains ](https://plugins.jetbrains.com/plugin/8079-google-cloud-code)
* [ Jules ](https://labs.google.com/jules/home?hl=zh-tw)
* [ VS Code ](https://marketplace.visualstudio.com/items?itemName=GoogleCloudTools.cloudcode)

Community

* [ Google AI 論壇 ](https://discuss.ai.google.dev?hl=zh-tw)
* [ Gemini for Research ](https://ai.google.dev/gemini-api/docs/gemini-for-research?hl=zh-tw)

/

* English
* Deutsch
* Español – América Latina
* Français
* Indonesia
* Italiano
* Polski
* Português – Brasil
* Shqip
* Tiếng Việt
* Türkçe
* Русский
* עברית
* العربيّة
* فارسی
* हिंदी
* বাংলা
* ภาษาไทย
* 中文 – 简体
* 中文 – 繁體
* 日本語
* 한국어
登入

* [Gemma ](https://ai.google.dev/gemma?hl=zh-tw)

[Gemma ](https://deepmind.google/models/gemma?hl=zh-tw) [文件 ](https://ai.google.dev/gemma/docs?hl=zh-tw)

[ ![Google AI for Developers](https://www.gstatic.com/devrel-devsite/prod/v369eac9380f92e8fedc492e2689927bb3475d758266c381eee326d0b49a77481/googledevai/images/lockup-new.svg) ](/)

* [ 模型 ](https://deepmind.google/models/gemma)
  * 更多
  * [ Gemma ](https://deepmind.google/models/gemma)
  * [ 文件 ](/gemma/docs)
* 解決方案
  * 更多
* 程式碼編寫輔助
  * 更多
* Community
  * 更多

* [總覽](/gemma/docs)
* [開始使用](/gemma/docs/get%5Fstarted)
* [版本](/gemma/docs/releases)
* 模型
* Core Gemma

  * [總覽](/gemma/docs/core)
  * [Gemma 4 模型資訊卡](/gemma/docs/core/model%5Fcard%5F4)
  * [Gemma 3 模型資訊卡](/gemma/docs/core/model%5Fcard%5F3)
  * [Gemma 2 模型卡](/gemma/docs/core/model%5Fcard%5F2)
  * [Gemma 1 模型資訊卡](/gemma/docs/core/model%5Fcard)
* 核心變體

  * Gemma 3n

    * [總覽](/gemma/docs/gemma-3n)
    * [型號資訊卡](/gemma/docs/gemma-3n/model%5Fcard)
  * FunctionGemma

    * [總覽](/gemma/docs/functiongemma)
    * [型號資訊卡](/gemma/docs/functiongemma/model%5Fcard)
    * [格式設定和最佳做法](/gemma/docs/functiongemma/formatting-and-best-practices)
    * [使用 Hugging Face Transformers 進行函式呼叫](/gemma/docs/functiongemma/function-calling-with-hf)
    * [使用 FunctionGemma 的完整函式呼叫序列](/gemma/docs/functiongemma/full-function-calling-sequence-with-functiongemma)
    * [微調 FunctionGemma](/gemma/docs/functiongemma/finetuning-with-functiongemma)
  * EmbeddingGemma

    * [總覽](/gemma/docs/embeddinggemma)
    * [型號資訊卡](/gemma/docs/embeddinggemma/model%5Fcard)
    * [使用 Sentence Transformers 生成嵌入](/gemma/docs/embeddinggemma/inference-embeddinggemma-with-sentence-transformers)
    * [微調 EmbeddingGemma](/gemma/docs/embeddinggemma/fine-tuning-embeddinggemma-with-sentence-transformers)
  * PaliGemma

    * [總覽](/gemma/docs/paligemma)
    * [v2 模型資訊卡](/gemma/docs/paligemma/model-card-2)
    * [v1 模型資訊卡](/gemma/docs/paligemma/model-card)
    * [使用 Keras 產生輸出內容](/gemma/docs/paligemma/inference-with-keras)
    * [使用 JAX 和 Flax 微調](/gemma/docs/paligemma/fine-tuning-paligemma)
    * [提示和系統指示](/gemma/docs/paligemma/prompt-system-instructions)
  * ShieldGemma

    * [總覽](/gemma/docs/shieldgemma)
    * [ShieldGemma 2 模型資訊卡](/gemma/docs/shieldgemma/model%5Fcard%5F2)
    * [ShieldGemma 1 模型資訊卡](/gemma/docs/shieldgemma/model%5Fcard)
* 執行 Gemma
* 基礎知識

  * [總覽](/gemma/docs/run)
  * [Gemma 設定](/gemma/docs/setup)
  * [提示格式](/gemma/docs/core/prompt-formatting-gemma4)
  * [舊版提示和系統指令 \[Gemma 1、2 和 3\]](/gemma/docs/core/prompt-structure)
* 在本機執行 Chat UI，或透過 API 整合

  * [LM Studio](/gemma/docs/integrations/lmstudio)
  * [奧拉馬](/gemma/docs/integrations/ollama)
* 在 Edge 上高效執行

  * [LiteRT-LM](https://github.com/google-ai-edge/LiteRT-LM)
  * [Llama.cpp](https://github.com/ggml-org/llama.cpp)
  * [MediaPipe LLM 推論 API](/edge/mediapipe/solutions/genai/llm%5Finference)
  * [MLX](https://github.com/ml-explore/mlx)
* 在 Python 中建構/訓練模型

  * [Gemma 程式庫](/gemma/docs/core/gemma%5Flibrary)
  * [Hugging Face Transformers](/gemma/docs/core/huggingface%5Finference)
  * [Keras](/gemma/docs/core/keras%5Finference)
  * [PyTorch](/gemma/docs/core/pytorch%5Fgemma)
  * [Unsloth](https://unsloth.ai/blog/gemma3)
* 部署至正式環境 / 企業版

  * [Gemini API](/gemma/docs/core/gemma%5Fon%5Fgemini%5Fapi)
  * [Cloud GKE](/gemma/docs/core/gke)
  * [Cloud Run](/gemma/docs/core/deploy%5Fto%5Fcloud%5Frun%5Ffrom%5Fai%5Fstudio)
  * [Vertex AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/open-models/use-gemma)
  * [vLLM](https://docs.cloud.google.com/kubernetes-engine/docs/tutorials/serve-gemma-gpu-vllm)
* 核心功能
* 文字

  * [基本和多輪對話](/gemma/docs/capabilities/text/basic)
  * [函式呼叫](/gemma/docs/capabilities/text/function-calling-gemma4)
* 視覺資料

  * [總覽](/gemma/docs/capabilities/vision)
  * [圖像理解](/gemma/docs/capabilities/vision/image)
  * [影片理解](/gemma/docs/capabilities/vision/video)
* [音訊資料](/gemma/docs/capabilities/audio)
* [思考](/gemma/docs/capabilities/thinking)
* 調整指南
* [總覽](/gemma/docs/tune)
* [使用 LoRA 和 Keras 調整](/gemma/docs/core/lora%5Ftuning)
* [使用 Gemma 程式庫進行調整](https://gemma-llm.readthedocs.io/en/latest/colab%5Ffinetuning.html)
* [使用 Hugging Face Transformers 和 QLoRA 進行微調](/gemma/docs/core/huggingface%5Ftext%5Ffinetune%5Fqlora)
* [使用 Hugging Face Transformer 和 QLoRA 進行 Vision Tune](/gemma/docs/core/huggingface%5Fvision%5Ffinetune%5Fqlora)
* [使用 Hugging Face Transformers 完整微調模型](/gemma/docs/core/huggingface%5Ftext%5Ffull%5Ffinetune)
* [使用 Keras 進行分散式調整](/gemma/docs/core/distributed%5Ftuning)
* 申請指南
* [個人程式碼助理](/gemma/docs/personal-code-assistant)
* [企業電子郵件助理](/gemma/docs/business-email-assistant)
* [語音任務](/gemma/docs/spoken-language/task-specific-tuning)
* [使用 Python 的聊天機器人](/gemma/docs/gemma%5Fchat)
* [Meme Generator](/gemma/docs/meme-generator)
* [行動動作](/gemma/docs/mobile-actions)
* 轉換指南
* [將 Hugging Face Safetensors 轉換為 MediaPipe 工作](/gemma/docs/conversions/hf-to-mediapipe-task)
* 部署指南
* [Web](/gemma/docs/integrations/web)
* [行動裝置](/gemma/docs/integrations/mobile)
* [Google Cloud](/gemma/docs/integrations/google-cloud)
* [LangChain](/gemma/docs/integrations/langchain)
* 研究與工具
* RecurrentGemma

  * [總覽](/gemma/docs/recurrentgemma)
  * [使用 JAX 和 Flax 推論](/gemma/docs/recurrentgemma/recurrentgemma%5Fjax%5Finference)
  * [使用 JAX 和 Flax 微調](/gemma/docs/recurrentgemma/recurrentgemma%5Fjax%5Ffinetune)
  * [型號資訊卡](/gemma/docs/recurrentgemma/model%5Fcard)
* [DataGemma](/gemma/docs/datagemma)
* [Gemma 範圍](/gemma/docs/gemma%5Fscope)
* [Gemma-APS](/gemma/docs/gemma-aps)
* Community
* [Gemmaverse](https://deepmind.google/models/gemma/gemmaverse/)
* [Discord](/gemma/docs/discord)
* 法律
* [使用條款](/gemma/terms)
* [Gemma 4 授權](/gemma/apache%5F2)
* [使用限制](/gemma/prohibited%5Fuse%5Fpolicy)
* [預定用途聲明](/gemma/intended%5Fuse%5Fstatement)
* Gemini
* [ 關於 ](https://deepmind.google/gemini)
* [ 文件 ](/gemini-api/docs)
* [ API 參考資料 ](/api)
* [ 定價 ](/pricing)
* Imagen
* [ 關於 ](https://deepmind.google/technologies/imagen/)
* [ 文件 ](/gemini-api/docs/imagen)
* [ 定價 ](/pricing)
* Veo
* [ 關於 ](https://deepmind.google/technologies/veo/veo-2/)
* [ 文件 ](/gemini-api/docs/video)
* [ 定價 ](/pricing)
* Gemma
* [ 關於 ](https://deepmind.google/models/gemma)
* [ 文件 ](/gemma/docs)
* [ Gemmaverse ](/gemma/gemmaverse)
* 使用 Gemini 建構
* [ Gemini API ](/gemini-api/docs)
* [ Google AI Studio ](https://aistudio.google.com)
* 自訂 Gemma 開放式模型
* [ Gemma 開放模型 ](/gemma)
* [ 使用 Keras 的多框架 ](https://keras.io/keras%5F3/)
* [ 在 Colab 中進行微調 ](https://colab.sandbox.google.com/github/google/generative-ai-docs/blob/main/site/en/gemma/docs/lora%5Ftuning.ipynb)
* 在裝置上執行
* [ Google AI 邊緣 ](/edge)
* [ Android 裝置上的 Gemini Nano ](https://developer.android.com/ai/gemini-nano)
* [ Chrome 內建的網路 API ](https://developer.chrome.com/docs/ai/built-in)
* 以負責任的方式建構
* [ 負責任的生成式 AI 工具包 ](/responsible)
* [ 安全的 AI 架構 ](https://saif.google)
* [ Android Studio ](https://developer.android.com/gemini-in-android)
* [ Chrome 開發人員工具 ](https://developer.chrome.com/docs/devtools/console/understand-messages)
* [ Colab ](https://colab.google)
* [ Firebase ](https://firebase.google.com/products/generative-ai)
* [ Google Cloud ](https://cloud.google.com/products/gemini/code-assist)
* [ JetBrains ](https://plugins.jetbrains.com/plugin/8079-google-cloud-code)
* [ Jules ](https://labs.google.com/jules/home)
* [ VS Code ](https://marketplace.visualstudio.com/items?itemName=GoogleCloudTools.cloudcode)
* [ Google AI 論壇 ](https://discuss.ai.google.dev)
* [ Gemini for Research ](/gemini-api/docs/gemini-for-research)

**Gemma 4** 推出，支援文字、音訊和圖片輸入，脈絡窗口最長可達 25.6 萬個詞元！[**瞭解詳情**](https://ai.google.dev/gemma/docs/core?hl=zh-tw)

* [首頁 ](https://ai.google.dev/?hl=zh-tw)
* [Gemma ](https://ai.google.dev/gemma?hl=zh-tw)
* [模型 ](https://deepmind.google/models/gemma?hl=zh-tw)
* [文件 ](https://ai.google.dev/gemma/docs?hl=zh-tw)

提供意見

# Gemma 4 提示詞格式

從 Gemma 4 開始，我們推出新的控制權杖。如要瞭解 Gemma 3 以下版本，請參閱[舊版文件](https://ai.google.dev/gemma/docs/core/prompt-structure?hl=zh-tw)。

以下各節說明 Gemma 4 使用的控制權杖及其用途。請注意，控制權杖是保留在我們的權杖化工具中，且專屬於該工具。

* 表示系統指令的權杖：`system`
* 表示使用者輪流發言的權杖：`user`
* 表示模型輪流的權杖：`model`
* 表示對話輪流開始的符記：`<|turn>`
* 表示對話輪流結束的符記：`<turn|>`

以下是範例對話：

```
<|turn>system
You are a helpful assistant.<turn|>
<|turn>user
Hello.<turn|>

```

## 多模態

| 多模態權杖                | 目的       |
| -------------------- | -------- |
| <\|image> <image|>   | 指出圖片嵌入   |
| <\|audio> <audio|>   | 指出音訊嵌入   |
| <\|image|> <|audio|> | 特殊預留位置權杖 |

我們使用兩個特殊預留位置權杖 (`<|image|>` 和 `<|audio|>`) 指定要插入圖片和音訊權杖的位置。完成權杖化後，模型會以實際的軟性嵌入取代這些權杖。

以下是範例對話：

```
prompt = """<|turn>user
Describe this image: <|image|>

And translate these audio:

a. <|audio|>
b. <|audio|><turn|>
<|turn>model"""

```

## 代理功能和推論控制詞元

為支援代理工作流程，Gemma 使用專門的控制權杖，將內部推論 (思考) 與外部動作 (函式呼叫) 區分開來。模型可使用這些權杖處理複雜的邏輯，然後提供最終回覆或與外部工具互動。

### 函式呼叫

Gemma 4 經過六個特殊權杖的訓練，可管理「工具使用」生命週期。

| 權杖組合                                 | 目的             |
| ------------------------------------ | -------------- |
| <\|tool> <tool|>                     | 定義工具           |
| <\|tool\_call> <tool\_call|>         | 表示模型要求使用工具。    |
| <\|tool\_response> <tool\_response|> | 將工具的執行結果提供給模型。 |

**注意：** `<|tool_response>` 會做為推論引擎的額外停止序列。

**字串值的分隔符號：`<|"|>`**

單一符記 `<|"|>` 用於分隔結構化資料區塊中的**所有字串值**。

* **用途：**這個權杖可確保字串中的任何特殊字元 (例如 `{`、`}`、`,` 或引號) 都會視為字面文字，而非資料結構基礎語法的一部分。
* **用法：**函式宣告、呼叫和回應中的所有字串常值都必須使用這個符記 (例如 `key:<|"|>string value<|"|>`) 括住。

### 思考模式

如要啟用思考模式，請在系統指令中加入 `<|think|>` 控制權杖。

| 控制權杖                   | 目的         |
| ---------------------- | ---------- |
| <\|think|>             | 啟用思考模式     |
| <\|channel> <channel|> | 表示模型的內部程序。 |

**注意：** 啟用思考模式時，`<|channel>` 後面一律會接上「想法」一詞。

以下是範例對話：

```
<|turn>system
<|think|><turn|>
<|turn>user
What is the water formula?<turn|>
<|turn>model
<|channel>thought
...
<channel|>The most common interpretation of "the water formula" refers...<turn|>

```

思考模式的設計是在對話層級啟用。這應與其他系統指令 (例如工具定義) 一併整合為單一系統回合。

### 推理和函式呼叫範例

在代理程式回合中，模型可能會先私下「思考」，再決定呼叫函式。生命週期遵循下列順序：

1. 使用者查詢：使用者提出問題。
2. 內部推論：模型會在思考通道中私下思考。
3. 工具要求：模型會停止生成內容，要求呼叫工具。
4. 執行和插入：應用程式會執行工具並附加回覆。
5. 最終回覆：模型會讀取回覆並生成最終答案。

以下範例說明如何使用天氣工具建立模型：

```
<|turn>system
<|think|>You are a helpful assistant.<|tool>declaration:get_current_temperature{...}<tool|><turn|>
<|turn>user
What's the temperature in London?<turn|>
<|turn>model
<|channel>thought
...
<channel|><|tool_call>call:get_current_temperature{location:<|"|>London<|"|>}<tool_call|><|tool_response>

```

應用程式應剖析模型的回應，擷取函式名稱和引數，執行函式，然後將 `tool_calls` 和 `tool_responses` 附加至 `assistant` 角色下的即時通訊記錄。

```
<|turn>model
<|tool_call>call:get_current_weather{location:<|"|>London<|"|>}<tool_call|><|tool_response>response:get_current_weather{temperature:15,weather:<|"|>sunny<|"|>}<tool_response|>

```

最後，Gemma 會讀取工具回應並回覆使用者。

```
The temperature in London is 15 degrees and it is sunny.<turn|>

```

以下是這個範例的完整 JSON 即時通訊記錄：

```
[
  {
    "role": "system",
    "content": "You are a helpful assistant."
  },
  {
    "role": "user",
    "content": "What's the temperature in London?"
  },
  {
    "role": "assistant",
    "tool_calls": [
      {
        "function": {
          "name": "get_current_weather",
          "arguments": {
            "location": "London"
          }
        }
      }
    ],
    "tool_responses": [
      {
        "name": "get_current_weather",
        "response": {
          "temperature": 15,
          "weather": "sunny"
        }
      }
    ],
    "content": "The temperature in London is 15 degrees and it is sunny."
  }
]

```

### 管理回合之間的思考脈絡

妥善管理模型生成的想法，對於維持多輪對話的效能至關重要。

* **標準多輪對話：**您必須先從前一輪對話中移除 (剝除) 模型生成的想法，再將對話記錄傳回模型，以進行下一輪對話。如要在對話期間停用思考模式，可以在移除先前的想法時，一併移除 `<|think|>` 符記。
* **函式呼叫 (例外狀況)：**如果單一模型回合涉及函式或工具呼叫，則函式呼叫之間**不得**移除想法。

**代理工作流程和長時間執行的工作**

由於標準回合之間會移除原始想法，因此開發人員建構長期執行的代理程式時，可能需要保留推理脈絡，避免模型進入循環推理迴圈。

* **總結想法：**強烈建議的推論技術是擷取、總結，然後將模型先前的想法以標準文字的形式回饋到脈絡窗口。
* **格式限制：**由於 Gemma 4 並未明確接受訓練，因此無法處理提示中包含的原始想法 (上述特定工具呼叫情境除外)，模型不會對這些插入的想法有嚴格或特定的格式要求。您可以彈性設定摘要推論的格式，確保最符合特定代理功能架構的需求。

## 整合注意事項

* **內部狀態：**`<|channel>` 和 `<channel|>` 詞元通常用於思維鏈提示 (CoT) 處理。在標準使用者應用程式中，這類內容通常會對使用者隱藏。
* **工具迴圈：**`tool_call` 和 `tool_response` 權杖可促進應用程式環境與模型之間的「交握」。應用程式會攔截 `tool_call`、執行基礎程式碼，並在 `tool_response` 權杖中將結果回饋給模型。
* **模型行為：**即使明確關閉思考模式，較大型的模型 (例如 gemma-4-26B-A4B-it、gemma-4-31B-it) 偶爾仍會產生思考通道。如要在這些極端情況下穩定模型行為，請考慮在提示中加入空白思考權杖。

## 提示：使用無思考資料集微調大型模型

使用不含思考過程的資料集微調較大的 Gemma 模型時，在訓練提示中加入空白管道，可獲得更出色的結果：

```
<|turn>model
<|channel>thought
<channel|>

```

## 提示：使用系統指令提升適應性思考效率

雖然 Gemma 4 官方支援以 ON 或 OFF 布林值「思考」，但模型具有極強的指令遵循能力，可動態調控思考行為。

您可以使用系統指令 (SI) 引導模型進入簡化思考模式，不必依賴「高」或「低」思考的硬式編碼架構參數。明確指示模型以高效率或較低的深度思考 (我們將此概念稱為「LOW」思考指令)，即可實現適應性思考效率。

* **降低成本：**測試結果顯示，套用「低」思考系統指令可減少約 20% 的思考權杖。
* **概念驗證：**這項行為是模型可指導性的副產品，而非經過特別訓練，因此沒有單一「完美」的提示。「LOW」指示是概念驗證。
* **自訂：**我們強烈建議開發人員自行嘗試使用自訂系統指令。您可以微調模型思考過程的深度、長度和風格，針對特定用途完美平衡延遲時間、成本和輸出品質。

提供意見

除非另有註明，否則本頁面中的內容是採用[創用 CC 姓名標示 4.0 授權](https://creativecommons.org/licenses/by/4.0/)，程式碼範例則為[阿帕契 2.0 授權](https://www.apache.org/licenses/LICENSE-2.0)。詳情請參閱《[Google Developers 網站政策](https://developers.google.com/site-policies?hl=zh-tw)》。Java 是 Oracle 和/或其關聯企業的註冊商標。

上次更新時間：2026-04-02 (世界標準時間)。

想進一步說明嗎？ \[\[\["容易理解","easyToUnderstand","thumb-up"\],\["確實解決了我的問題","solvedMyProblem","thumb-up"\],\["其他","otherUp","thumb-up"\]\],\[\["缺少我需要的資訊","missingTheInformationINeed","thumb-down"\],\["過於複雜/步驟過多","tooComplicatedTooManySteps","thumb-down"\],\["過時","outOfDate","thumb-down"\],\["翻譯問題","translationIssue","thumb-down"\],\["示例/程式碼問題","samplesCodeIssue","thumb-down"\],\["其他","otherDown","thumb-down"\]\],\["上次更新時間：2026-04-02 (世界標準時間)。"\],\[\],\[\]\]

* [條款 ](//policies.google.com/terms?hl=zh-tw)
* [隱私權 ](//policies.google.com/privacy?hl=zh-tw)
* [Manage cookies ](#)
* English
* Deutsch
* Español – América Latina
* Français
* Indonesia
* Italiano
* Polski
* Português – Brasil
* Shqip
* Tiếng Việt
* Türkçe
* Русский
* עברית
* العربيّة
* فارسی
* हिंदी
* বাংলা
* ภาษาไทย
* 中文 – 简体
* 中文 – 繁體
* 日本語
* 한국어
```

---

## Assistant (Build · Claude Sonnet 4.6 · 56.7s)

_Thinking:_

This is very useful! This is the official Gemma 4 prompt formatting guide. Key takeaways:

1. **Turn tokens:** `<|turn>system`, `<|turn>user`, `<|turn>model`, `<|turn>` (start), `<turn|>` (end) - these are the actual conversation format tokens
2. **Thinking mode:** `<|think|>` in the system prompt enables thinking mode globally for the conversation
3. **Thinking channel:** `<|channel>thought ... <channel|>` is how thinking appears in model output
4. **Function calling:** Uses `<|tool>`, `<|tool_call>`, `<|tool_response>` tokens


5. **String delimiter:** `<|"|>` for structured data values

The critical insight is that `<|think|>` in the system prompt enables thinking across the entire conversation, not just at specific points. When passing conversation history back for the next turn, I need to strip out the model-generated thoughts. Using a "low" thinking system instruction can reduce thinking tokens by about 20%.

For skill files specifically, this changes my understanding significantly — the `<|think|>` blocks in those files aren't actually triggering thinking mode the way I initially thought. They'd just appear as literal text when loaded as context. The official documentation is clear that thinking mode gets enabled through the system instruction itself, not through mid-prompt tokens in skill files.

So the real distinction is that thinking mode needs to be controlled at the agent level in the system prompt, not scattered throughout individual skills. For agents like the dag-reviewer that should leverage thinking, I'd enable it there, while other agents would handle it differently based on their needs.

The user wants me to defer the thinking blocks until the end anyway, so I should focus on writing the core content first without them. And since we're working with Gemma 4, the system prompt goes in a `<|turn>system` turn, which OpenCode will handle the formatting for. So XML-style tags like `<rules>` and `<instructions>` are still valuable structural markers for complex agent prompts, even though the official Gemma docs use simpler examples—they provide clear boundaries that help smaller models separate instructions from task data. The main thing I need to remember is enabling thinking mode with `<|think|>` in the system prompt for the whole agent.

Now I'm ready to start writing out the actual files, beginning with the core tool definitions and then moving through the example documents and agent prompts.

This is gold. Key things that change our approach:

1. `<|think|>` goes in the **system prompt** to enable thinking for the whole agent — it's not an inline mid-text trigger. Skill files can't activate thinking mode, only the agent's system prompt can.

2. The official example system prompts are just **plain sentences**. No XML, no markdown. The official docs themselves use bare text.

3. Thinking is **conversation-level** — enabled or disabled per agent, not per node or section.

So the practical implications:
- Leave `<|think|>` out of skill files entirely — it does nothing there except burn tokens
- For agents that should think (reviewer), we'll add `<|think|>` to the agent system prompt at the end when we do the thinking pass
- XML section tags (`<rules>`, `<components>`) are still valid as structural delimiters per the Gemma 4 research doc — the official docs just show simple examples, they don't contradict using them for complex prompts
- Plain text everywhere else

This actually simplifies things. Continuing now.

**Tool: write**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-tools/SKILL.md",
  "content": "---\nname: dag-tools\ndescription: Teaches how to build, modify, review, and validate execution DAGs using DAG manipulation and design tools.\n---\n\n<tools>\nget_planning_components_catalogue — returns the component catalogue. Use variant=\"core\" for the first-pass design. Omit variant or use variant=\"full\" for all components including specialist nodes.\n\ninit_dag — creates a new empty DAG. plan_name must be lowercase with hyphens only.\n\nadd_nodes_to_dag — creates multiple nodes in one call. nodes is a JSON object mapping nodeId to component_name.\n\nadd_node — creates a single node. Prefer add_nodes_to_dag when creating multiple nodes.\n\nconnect_nodes — wires multiple directed edges in one call. edges is a JSON object mapping from-nodeId to to-nodeId or an array of to-nodeIds for fan-out.\n\ninsert_between — atomically inserts a node between two connected nodes. Removes the from→to edge and adds from→new_node→to in one operation. Use this for all mid-chain insertions. Never use manual delete_edge + connect_nodes instead.\n\ndelete_edge — removes a directed edge without deleting either node. The child node becomes orphaned.\n\ndelete_node — removes a node and all its edges. Children become orphaned.\n\nset_entry_point — marks the first work node as the plan entry. Call once as the final construction step.\n\nset_exit_point — marks a write-notes leaf as a plan exit. type is \"success\" for happy-path exits and \"failure\" for retry-exhaustion exits. Call for every write-notes leaf as the final construction step.\n\nget_compact_dag_draft — returns connected node chains, orphaned groups, and entry/exit status. Call after each structural change to verify incrementally.\n\nget_dag_draft_diagram — returns a visual ASCII diagram of the full DAG structure.\n\npresent_dag_diagram — validates the DAG and injects the diagram as a system message. Throws if the DAG has structural errors.\n\nvalidate_dag — throws on any structural issue. Call when all construction or revision is complete.\n</tools>\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## User

---

## Assistant (Compaction · Claude Haiku 4.5 (latest) · 19.9s)

---

## Goal

Rewrite the DAG design, review, revision, and description system for Gemma 4 E4B from first principles. The rewrite targets **reliability at 4.5B parameters** — every token and structural choice should exist because it makes the model more likely to produce correct DAGs, not because it seems thorough or mirrors larger models.

## Instructions

- **Gemma 4 E4B respects atomic, role-constrained prompts with explicit structure.** Thinking (`<|think|>`) is enabled at the agent system-prompt level only, not inline in skills. It's for genuine multi-step reasoning (planning, decisions) not reflection checklists.
- **Zero markdown in agent/skill bodies.** Use only XML-style tags (`<rules>`, `<components>`, `<procedure>`, `<constraints>`, `<response_format>`) as hard section boundaries. Plain text inside. This provides structural clarity the 4B model needs without token bloat.
- **Ruthless brevity.** Every unnecessary token competes with task context for attention. Keep system prompts 200-500 tokens. One tight sentence per concept.
- **Negative constraints go last** — they get dropped if placed too early (recency bias, DeCRIM 2024).
- **Goal-driven delegation only.** Headwrench's prompts to subagents are goal statements — never task minutia, file paths, or procedural steps. Methodology lives in agent system prompts (which we control at design time), not in headwrench's runtime delegations.
- **Response format: structured prose.** Agents respond with goal-oriented summaries under specified headers — not dumping tool calls, file details, or implementation minutia. This keeps headwrench in project-manager mode, not task-decomposition mode.

## Discoveries

1. **Thinking placement**: `<|think|>` in the system prompt enables thinking for the whole agent conversation. It does not work inline in skill files — that wastes tokens. Only agents that do multi-step reasoning (dag-reviewer primarily) get thinking enabled.

2. **Structural tokens**: `<|turn>`, `<|channel>`, tool-call tokens are the official Gemma 4 control tokens. For our purposes, the key is that XML-style tags (`<rules>`, `<components>`) provide hard boundaries Gemma respects without the official machinery — they're the closest analogue to structured data for text-based prompts.

3. **Nine review exercises identified for dag-reviewer**:
   - Structure check (mechanical)
   - Research question inventory (what external research is needed, independent or sequential)
   - Research currency (would this be wrong if 6 months old?)
   - Decision gates (what choices must the executor make?)
   - Complexity routing (short-path / long-path splits when scope is unknowable upfront)
   - User involvement (explicit from prompt + implicit architectural decisions)
   - Shell prerequisites (what run-project-commands are needed?)
   - Commit placement (after every meaningful unit of successful verify)
   - Execution-phase investigation (project-search-and-analysis before unfamiliar work)

4. **Kickoff/plan-fail/plan-success are implementation details.** Agents never reference them. The contract is: set_entry_point on the first work node, set_exit_point on every write-notes leaf. Backend handles the rest.

## Accomplished

- Rewrote CATALOGUE-CORE.md — plain text, XML tags, zero markdown, terse component descriptions
- Rewrote CATALOGUE.md — same style, includes specialist nodes and research components
- Rewrote dag-tools SKILL.md — tool reference only, no methodology, plain descriptions

## In Progress

None. Next phase is immediate.

## Remaining Work

1. **Rewrite build-dags-core SKILL.md** — staged construction procedure (Stage 1/2/3), thinking only on decomposition, rest is plain procedural. No reflection prompts.
2. **Rewrite dag-design-example SKILL.md** — worked example only. Reference artifact. No reflection.
3. **Rewrite dag-review-criteria SKILL.md** — the heavy one. Nine enumeration exercises as headers with minimum viable trigger questions. Deep analysis section gets thinking.
4. **Rewrite dag-revision-example SKILL.md** — five revision patterns as clean reference. No reflection prompts.
5. **Rewrite dag-designer.md agent** — short system prompt: role, goal, point to skills, hard constraints last. No methodology enumeration.
6. **Rewrite dag-reviewer.md agent** — short system prompt, add `<|think|>` for conversation-level thinking, response format section, constraints.
7. **Rewrite dag-reviser.md agent** — short system prompt, response format, constraints.
8. **Rewrite dag-description-author.md agent** — simplest one. Role, what good descriptions are, output format.
9. **Add thinking blocks** back to agent prompts at the end (only where warranted: dag-reviewer, maybe dag-designer on decomposition).

## Relevant Files

/home/jack/CodeAccelerate-OpencodeConfig/files/planning/plan-session/node-library/
- CATALOGUE-CORE.md (completed)
- CATALOGUE.md (completed)

/home/jack/CodeAccelerate-OpencodeConfig/files/skills/
- dag-tools/SKILL.md (completed)
- build-dags-core/SKILL.md (pending rewrite)
- dag-design-example/SKILL.md (pending rewrite)
- dag-review-criteria/SKILL.md (pending rewrite)
- dag-revision-example/SKILL.md (pending rewrite)

/home/jack/CodeAccelerate-OpencodeConfig/files/agents/
- dag-designer.md (pending rewrite)
- dag-reviewer.md (pending rewrite)
- dag-reviser.md (pending rewrite)
- dag-description-author.md (pending rewrite)

---

---

## User

---

## Assistant (Build · Claude Sonnet 4.6 · 9.4s)

_Thinking:_

Let me review the remaining work from the context summary and start executing it. I'll set up todos and begin working through the list.

The remaining work is:
1. Rewrite build-dags-core SKILL.md
2. Rewrite dag-design-example SKILL.md
3. Rewrite dag-review-criteria SKILL.md
4. Rewrite dag-revision-example SKILL.md
5. Rewrite dag-designer.md agent
6. Rewrite dag-reviewer.md agent
7. Rewrite dag-reviser.md agent
8. Rewrite dag-description-author.md agent

Let me start by reading the current files to understand what's there, then rewrite them according to the principles established.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Rewrite build-dags-core SKILL.md",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-design-example SKILL.md",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-review-criteria SKILL.md",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-revision-example SKILL.md",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-designer.md agent",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-reviewer.md agent",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-reviser.md agent",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite dag-description-author.md agent",
      "status": "pending",
      "priority": "high"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Rewrite build-dags-core SKILL.md",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-design-example SKILL.md",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-review-criteria SKILL.md",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-revision-example SKILL.md",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-designer.md agent",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-reviewer.md agent",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-reviser.md agent",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite dag-description-author.md agent",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Claude Sonnet 4.6 · 35.1s)

Let me read the current files before rewriting them.

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/skills/build-dags-core/SKILL.md"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/skills/build-dags-core/SKILL.md</path>
<type>file</type>
<content>
1: ---
2: name: build-dags-core
3: description: Teaches how to build a structurally valid MVP execution DAG from the core component catalogue using the staged construction procedure.
4: ---
5: # What does this skill teach?
6:
7: In this skill, you learn how to build a structurally correct first-pass execution DAG — an MVP that captures the essential work phases, verification, and convergence structure. You are building a foundation that a second pass will improve.
8:
9: ## Your job
10:
11: Build a clean, structurally valid DAG that captures the essential work phases. Do not overthink node selection — use only the core catalogue (`variant="core"`). A reviewer and reviser will add specialist nodes and refine the structure afterward. Your goal is a solid skeleton, not a final product.
12:
13: ## How to start
14:
15: 1. Call `get_planning_components_catalogue` with `variant="core"` — never design from memory, and never use the full catalogue
16: 2. Decompose the goal into chunked phases
17: 3. Follow the staged construction procedure below
18:
19: ## Rules for a valid DAG
20:
21: - Every path terminates at a leaf node — no dead ends
22: - Every `verify` node has exactly 2 children: a pass path and a fail path
23: - Every `decision-gate` has exactly 2 children
24: - Every leaf node must be a `write-notes` node that captures context before exit
25: - Branches are mutually exclusive paths — parallel work is unsupported
26:
27: ## How to name nodes
28:
29: Node IDs must be unique and descriptive. Never use generic names like `node-1` or `step-3`, and never use bare component names like `verify` or `work-item`. Add context: `verify-setup`, `verify-auth`, `fix-build-errors`, `decision-gate-auth-check`.
30:
31: ## Building Constraints
32:
33: - Build and wire all work nodes first (Stages 1-2), then set entry and exit points last (Stage 3)
34: - Build and wire each phase independently before connecting them — this prevents structural errors from propagating across phases
35: - Be comfortable with orphaned groups throughout the build process — this is expected until you finish wiring completely
36: - Every leaf node should be a `write-notes` node
37: - Use 1 retry for each verify-retry structure unless the planning context indicates higher complexity — the reviewer will adjust retry counts if needed
38:
39: ## Staged Construction Procedure
40:
41: ### Stage 1: Build phase clusters
42:
43: <|think|>
44: Build each phase as an independent cluster. It is expected and normal for clusters to be orphaned at this stage.
45:
46: For each phase:
47: 1. Call `add_nodes_to_dag` to create all the nodes needed for the phase
48: 2. Wire all internal edges for the phase in a single `connect_nodes` call
49: 3. Call `get_compact_dag_draft` to confirm the cluster is internally correct
50:
51: ### Stage 2: Wire clusters together
52:
53: <|think|>
54: Once all phase clusters are internally complete:
55: 1. Wire all inter-phase connections in a single `connect_nodes` call
56: 2. Call `get_compact_dag_draft` to confirm all clusters are connected
57: 3. Call `get_dag_draft_diagram` to see the full visual structure
58:
59: ### Stage 3: Set entry and exit points
60:
61: <|think|>
62: 1. Call `get_dag_draft_diagram` if you haven't already
63: 2. Verify:
64:     - Are all terminal pathways accounted for, success and failure?
65:     - Are your verify-retry structures correct?
66:     - Are all phases wired into a single connected graph?
67:     - Is every leaf node a `write-notes` node?
68: 3. Call `set_entry_point` with the first node
69: 4. Call `set_exit_point` for every leaf node — `success` for happy-path, `failure` for retry-exhaustion
70:
71: ## How to think through this skill
72:
73: <|think|>
74: - Am I using only the core catalogue, not the full one?
75: - Have I decomposed the goal into distinct phases with clear boundaries?
76: - Am I defaulting to 1 retry per verify-retry structure and not overthinking retry counts?
77: - Am I following the staged procedure: build clusters → wire clusters → set entry/exit?
78: - Is every leaf node a `write-notes` node?

(End of file - total 78 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-design-example/SKILL.md"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-design-example/SKILL.md</path>
<type>file</type>
<content>
1: ---
2: name: dag-design-example
3: description: Worked example of DAG design and construction — phase decomposition, tool call sequence, and expected output at each stage.
4: ---
5: # DAG Design Example
6:
7: This skill provides a complete worked example of designing and building an execution DAG using the staged workflow from the `build-dags` skill.
8:
9: ## Phase planning example
10:
11: ```
12: Phase 1 — decision-gate with immediate convergence:
13:   work-A → decision-gate-A
14:     ├─ → work-A-option-1 → work-B (converge)
15:     └─ → work-A-option-2 → work-B (converge)
16:
17: Phase 2 — sequential work with early success check:
18:   work-B → work-C → decision-gate-early-check
19:     ├─ → write-notes-early-success (leaf — early exit, goal already satisfied)
20:     └─ → decision-gate-routing
21:            ├─ → [Phase 3a entry]
22:            └─ → [Phase 3b entry]
23:
24: Phase 3a — single retry, converges to Phase 4:
25:   work-D → verify-D
26:     ├─ (pass) → work-F (converge with Phase 3b)
27:     └─ (fail) → fix-D → verify-D-retry
28:                            ├─ (pass) → work-F (converge)
29:                            └─ (fail) → write-notes-D-failure (leaf — captures what went wrong)
30:
31: Phase 3b — two retries, converges to Phase 4:
32:   work-E → verify-E
33:     ├─ (pass) → work-F (converge with Phase 3a)
34:     └─ (fail) → fix-E-1 → verify-E-retry-1
35:                              ├─ (pass) → work-F (converge)
36:                              └─ (fail) → fix-E-2 → verify-E-retry-2
37:                                                      ├─ (pass) → work-F (converge)
38:                                                      └─ (fail) → write-notes-E-failure (leaf — captures what went wrong)
39:
40: Phase 4 — sequential to success:
41:   work-F → write-notes-final-summary (leaf — captures what was accomplished)
42: ```
43:
44: **Key pattern:** Every leaf node is a `write-notes` node. Success leaves capture accomplishments; failure leaves capture what went wrong. This ensures the executing agent always records context before the plan exits.
45:
46: **Then define the wiring between phases:**
47: ```
48: work-B connects Phase 1 exit to Phase 2 entry (convergence node)
49: decision-gate-early-check routes to write-notes-early-success (early exit) or decision-gate-routing
50: decision-gate-routing routes to work-D (Phase 3a) or work-E (Phase 3b)
51: work-F connects Phase 3a/3b exits to Phase 4 entry (convergence node)
52: ```
53:
54: ## Applying the workflow
55:
56: <|think|>
57: Think through the following application of the staged workflow to the example above and how it generalizes to the DAG you're designing.
58:
59: ### Load the Catalogue
60:
61: ```
62: # ── Load catalogue ──
63: # Call get_planning_components_catalogue() with the appropriate variant
64: # for your pass (see your build-dags or build-dags-core skill for which variant to use)
65: get_planning_components_catalogue()
66: ```
67:
68: ### Stage 1: Build phase clusters
69:
70: ```
71: # ── Stage 1: Build phase clusters ──
72:
73: # Phase 1
74: add_nodes_to_dag(plan_name="my-plan", nodes='{"work-A": "work-item", "decision-gate-A": "decision-gate", "work-A-option-1": "work-item", "work-A-option-2": "work-item"}')
75: connect_nodes(plan_name="my-plan", edges='{"work-A": "decision-gate-A", "decision-gate-A": ["work-A-option-1", "work-A-option-2"]}')
76:
77: # Phase 2
78: add_nodes_to_dag(plan_name="my-plan", nodes='{"work-B": "work-item", "work-C": "work-item", "decision-gate-early-check": "decision-gate", "write-notes-early-success": "write-notes", "decision-gate-routing": "decision-gate"}')
79: connect_nodes(plan_name="my-plan", edges='{"work-B": "work-C", "work-C": "decision-gate-early-check", "decision-gate-early-check": ["write-notes-early-success", "decision-gate-routing"]}')
80:
81: # Phase 3a
82: add_nodes_to_dag(plan_name="my-plan", nodes='{"work-D": "work-item", "verify-D": "verify", "fix-D": "work-item", "verify-D-retry": "verify", "write-notes-D-failure": "write-notes"}')
83: connect_nodes(plan_name="my-plan", edges='{"work-D": "verify-D", "verify-D": ["work-F", "fix-D"], "fix-D": "verify-D-retry", "verify-D-retry": ["work-F", "write-notes-D-failure"]}')
84:
85: # Phase 3b
86: add_nodes_to_dag(plan_name="my-plan", nodes='{"work-E": "work-item", "verify-E": "verify", "fix-E-1": "work-item", "verify-E-retry-1": "verify", "fix-E-2": "work-item", "verify-E-retry-2": "verify", "write-notes-E-failure": "write-notes"}')
87: connect_nodes(plan_name="my-plan", edges='{"work-E": "verify-E", "verify-E": ["work-F", "fix-E-1"], "fix-E-1": "verify-E-retry-1", "verify-E-retry-1": ["work-F", "fix-E-2"], "fix-E-2": "verify-E-retry-2", "verify-E-retry-2": ["work-F", "write-notes-E-failure"]}')
88:
89: # Phase 4
90: add_nodes_to_dag(plan_name="my-plan", nodes='{"work-F": "work-item", "write-notes-final-summary": "write-notes"}')
91: connect_nodes(plan_name="my-plan", edges='{"work-F": "write-notes-final-summary"}')
92: ```
93:
94: ### Stage 2: Connect phase clusters
95:
96: > [!IMPORTANT]
97: > You do not need to redo any connections within phase clusters, only those that connect different phases together, so this stage is much faster than Stage 1. You can also connect phases in any order you like, just make sure to connect all of them before moving on to Stage 3.
98:
99: ```
100: # ── Stage 2: Connect phase clusters ──
101: connect_nodes(plan_name="my-plan", edges='{"work-A-option-1": "work-B", "work-A-option-2": "work-B", "decision-gate-routing": ["work-D", "work-E"]}')
102: get_compact_dag_draft(target="my-plan")
103: get_dag_draft_diagram(target="my-plan")
104: ```
105:
106: ### Stage 3: Set entry and exit points
107:
108: ```
109: # ── Stage 3: Set entry and exit points ──
110:
111: # Set the entry point — where execution begins
112: set_entry_point(plan_name="my-plan", node_id="work-A")
113:
114: # Set success exits — leaf nodes on happy paths
115: set_exit_point(plan_name="my-plan", node_id="write-notes-early-success", type="success")
116: set_exit_point(plan_name="my-plan", node_id="write-notes-final-summary", type="success")
117:
118: # Set failure exits — leaf nodes on retry-exhaustion paths
119: set_exit_point(plan_name="my-plan", node_id="write-notes-D-failure", type="failure")
120: set_exit_point(plan_name="my-plan", node_id="write-notes-E-failure", type="failure")
121:
122: validate_dag(plan_name="my-plan")
123: ```
124:
125: ## Thinking through this skill
126:
127: <|think|>
128: - how does the staged workflow help structure your approach to building complex DAGs?
129: - using this as a guide, how would you approach building the DAG for your current plan? What are the different phases you would define and why?
130: - notice how every leaf node is a write-notes node — this ensures context is captured before any exit, whether success or failure
131: - plan out all stages before you start building, then follow the workflow stage by stage to build your DAG. How does this structured approach compare to how you would have built the DAG without it?

(End of file - total 131 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-review-criteria/SKILL.md"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-review-criteria/SKILL.md</path>
<type>file</type>
<content>
1: ---
2: name: dag-review-criteria
3: description: Teaches how to evaluate execution DAGs — structural anti-patterns, specialist node assessment, complexity analysis, and sophisticated routing patterns.
4: ---
5: # What does this skill teach?
6:
7: In this skill, you learn how to evaluate a first-pass execution DAG and produce actionable critique that will guide a second-pass reviser. Your review has three parts, in order.
8:
9: You are NOT building or fixing the DAG — you are analyzing it and recommending improvements. You do not need to know how to build a DAG. You need to know what a good DAG looks like and what questions to ask yourself to find the gaps.
10:
11: ## Part 1: Structural Correctness
12:
13: Check these structural rules. If any are violated, flag them — but the first-pass designer is reliable at getting structure right. These are safety nets.
14:
15: ### Rules
16:
17: - Every path terminates at a leaf node — no dead ends
18: - Every `verify` node has exactly 2 children (pass and fail)
19: - Every `decision-gate` has exactly 2 children
20: - Every leaf node is a `write-notes` node
21: - No orphaned nodes or disconnected subgraphs
22: - Branches are mutually exclusive — no parallel work
23:
24: ### Anti-patterns to flag
25:
26: - **Unbounded work chains**: Three or more `work-item` nodes in sequence with no `verify` between them — work should be verified incrementally
27: - **Missing investigation**: A `work-item` that operates on unfamiliar territory with no preceding `project-search-and-analysis` — the executor needs to understand the current state before mutating it
28: - **Verify without fix path**: A `verify` whose fail path goes directly to a leaf with no attempt to fix — at minimum, one retry should be attempted
29: - **Over-retrying**: More than 2 retries for a single verify chain on a simple task — diminishing returns
30: - **Dead-end decision gates**: A `decision-gate` where both branches lead to the same path — the gate adds complexity without value
31:
32: ## Part 2: What to Add
33:
34: The first-pass DAG uses only core components. Your job is to determine what specialist nodes are missing. There are three layers to this assessment, each requiring a different approach.
35:
36: The caller will provide **tentative answers** from the orchestrator's assessment. Use those as starting points — agree, disagree, or refine them based on your own analysis.
37:
38: ### Hard Triggers
39:
40: These are non-negotiable. If the condition is met, the recommendation follows.
41:
42: - **Technology decision → external research → implementation.** When a `decision-gate` resolves which technology, library, or framework to use, an `external-scout` node MUST be placed between the decision and the implementation work. The research covers: how to add the dependency, what the API surface looks like, and whether there are environment or platform concerns. This is a sequencing requirement — research comes after the choice is made and before the work begins.
43: - **`external-scout` vs `deep-research` scope.** `deep-research` is for novel algorithms, cutting-edge approaches, or frontier techniques that require comprehensive autonomous investigation — it is rarely needed. It is NOT for evaluating established options, scoping implementation details, or comparing common tools. Standard `external-scout` (which includes a user approval gate) handles those cases. If a plan uses `deep-research` for routine technology evaluation, flag it as a scope violation and recommend `external-scout` instead.
44: - **External dependencies → external research.** If the task involves external dependencies, APIs, frameworks, or libraries, an `external-scout` node is almost certainly needed. The cost of scouting is far lower than implementing against wrong assumptions. The question is where to place it, not whether to include it.
45: - **Shell prerequisites → `run-project-commands`.** The `work-item` executor can edit files but cannot run commands. If any work-item depends on state that only a shell command can produce, a `run-project-commands` node must precede it. The most common case is dependency installation: researching what to add (`external-scout`) and writing code that uses it (`work-item`) are separate from actually installing it (`run-project-commands`). The same principle applies to any command-produced prerequisite — generated code from protobuf/OpenAPI compilers, scaffolded project structures from CLI tools, build artifacts from cmake/make, initialized submodules, or setup scripts that configure the environment. Ask: *does any work-item in this DAG assume something exists that only a shell command can produce?*
46:
47: ### Reasoning Triggers
48:
49: For some node types, you cannot rely on fixed rules — you need to reason about the specific plan to discover what's needed. The reasoning is scoped: you're answering a specific question, and each answer you find IS the trigger.
50:
51: **Decisions.** Ask yourself: *What decisions am I seeing that must be made during execution?* Walk through the plan and identify every point where the executor will face a choice — between implementation approaches, between tools, between strategies. Each decision you find is a trigger for a `decision-gate` or `user-decision-gate`. Consider:
52:
53: - Are there decisions that can only be made after a prior decision has been executed? If so, cascading `decision-gate` nodes may be warranted.
54: - Would a single decision gate at the top be a false simplification of what is actually a sequence of dependent decisions?
55: - Is this a decision the executor can make from evidence, or does it require user preference? The former is `decision-gate`, the latter is `user-decision-gate`.
56:
57: **Complexity routing.** Ask yourself: *Is the task's true complexity knowable only after investigation?* If the plan might turn out to be trivial once investigated, or much harder than expected, consider a short-path / long-path pattern: initial investigation followed by a `decision-gate` that routes to either a quick execution path or a thorough one.
58:
59: **User checkpoints.** Ask yourself: *Are there points where user input would prevent wasted effort?* Ambiguous requirements, aesthetic choices, or decisions that depend on user preference — these are triggers for `user-discussion` or `user-decision-gate` nodes.
60:
61: ### Open Assessment
62:
63: Beyond hard triggers and reasoning triggers, consider what else could substantially improve this DAG. There is no prescribed set of things to look for here — every plan is different.
64:
65: ### Retry Count Assessment
66:
67: For each `verify` node in the DAG, assess the retry count individually:
68:
69: - **Simple, well-understood work** → 1 retry is sufficient
70: - **Complex, multi-file, or integration-sensitive work** → 2 retries may be warranted
71: - **Predictable failure modes** (clear error messages) → 1 retry. **Ambiguous failure modes** → more retries
72: - **High blast radius** (many files, cross-module) → recommend 2 retries
73:
74: ## Part 3: How to Use Them
75:
76: This is the bulk of your review. Once you know what nodes to add, the harder question is how to place them — scope, decomposition, sequencing, branching structure, and early-exit pathways.
77:
78: ### Placement and Sequencing
79:
80: For every node you recommend adding, specify:
81: - **Where it goes** — which existing nodes it sits between, and why that position matters
82: - **What it depends on** — what information or decisions must exist before this node executes
83: - **What depends on it** — what downstream work changes because this node's output is now available
84:
85: ### Decomposition
86:
87: When recommending `external-scout` nodes, consider how many are needed and what each one covers:
88: - One broad research node before a work phase, or multiple targeted nodes each covering a specific question?
89: - If multiple, should they be sequential (each builds on the last) or independent (each covers a different angle)?
90:
91: ### Branching Structure
92:
93: For every `decision-gate` or `user-decision-gate` you recommend:
94: - What are the exactly 2 branches? Name them concretely.
95: - What is the evidence or criteria that determines which branch is taken?
96: - Do the branches reconverge, or do they lead to different outcomes?
97: - Are there early-exit opportunities? If one branch discovers the task is impossible or unnecessary, can the DAG exit early through a `write-notes` leaf rather than continuing?
98:
99: ### Early Exits
100:
101: Look for places where the DAG should be able to terminate early rather than continuing through all phases:
102: - After investigation reveals the task is unnecessary or already done
103: - After a decision gate where one branch means "no further work needed"
104: - After a verify that reveals the scope has changed fundamentally
105:
106: Each early exit needs its own `write-notes` leaf to capture why execution stopped.
107:
108: ### Execution-Phase Investigation
109:
110: Does the DAG include enough investigation before work? The planning scout provides a broad overview, but the executor may need targeted investigation of specific files, patterns, or dependencies before each work phase. Should `project-search-and-analysis` nodes precede major work phases?
111:
112: ## How to structure your critique
113:
114: For each finding, provide:
115: 1. **The specific node IDs involved**
116: 2. **What the issue or opportunity is**
117: 3. **Your recommendation**
118: 4. **Your reasoning**
119:
120: Organize in priority order: most impactful improvements first.
121:
122: ## How to think through this skill
123:
124: <|think|>
125: - Have I completed the structural pass before moving to the deeper analysis?
126: - For hard triggers: Have I checked every condition and applied the rule mechanically?
127: - For reasoning triggers: Have I walked through the plan asking the scoped questions? What decisions did I find? What complexity uncertainty exists? Where would user input prevent waste?
128: - For open assessment: Is there anything else that would substantially improve this plan that the triggers didn't catch?
129: - For how to use: Have I specified placement, sequencing, and branching for every node I recommended? Am I giving the reviser enough to act on?
130: - Am I grounding every critique in specific node IDs?

(End of file - total 130 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-revision-example/SKILL.md"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-revision-example/SKILL.md</path>
<type>file</type>
<content>
1: ---
2: name: dag-revision-example
3: description: Worked example of DAG revision — inserting nodes mid-chain, extending retry paths, rerouting edges, and avoiding orphans.
4: ---
5: # DAG Revision Example
6:
7: This skill provides worked examples of revising an existing DAG. You are not building from scratch — the DAG already exists. Your job is to modify it based on reviewer feedback.
8:
9: ## Starting state
10:
11: Assume a first-pass DAG that looks like this:
12:
13: ```
14: (research-framework) → (select-framework) → (notes-framework-selected)
15: (notes-framework-selected) → (plan-blueprint) → (verify-blueprint) → [fix-blueprint, notes-blueprint-approved]
16: (fix-blueprint) → (verify-blueprint-retry) → [notes-blueprint-approved, notes-blueprint-failure]
17: (notes-blueprint-approved) → (research-hookup) → (verify-hookup) → [fix-hookup, notes-hookup-success]
18: (fix-hookup) → (verify-hookup-retry) → [notes-hookup-success, notes-hookup-failure]
19: (notes-hookup-success) → (implement) → (notes-complete)
20: ```
21:
22: ## Revision operations
23:
24: ### Pattern 1: Insert a node mid-chain with `insert_between`
25:
26: **Goal:** Insert an `external-scout` node between `select-framework` and `notes-framework-selected`.
27:
28: This is the most common revision operation. Use `insert_between` — it atomically removes the old edge and adds the new path in one call. Never do this manually with `delete_edge` + `connect_nodes` — that creates intermediate orphan states and is error-prone.
29:
30: ```
31: # Step 1: Create the new node
32: add_node(plan_name="my-plan", nodeId="scout-framework-recipes", component_name="external-scout")
33:
34: # Step 2: Insert it atomically between the two existing nodes
35: insert_between(plan_name="my-plan", from="select-framework", to="notes-framework-selected", new_node="scout-framework-recipes")
36:
37: # Result:
38: # (select-framework) → (scout-framework-recipes) → (notes-framework-selected)
39: ```
40:
41: ### Pattern 2: Insert a node before a branching point
42:
43: **Goal:** Insert a `user-decision-gate` between `scout-framework-recipes` and `notes-framework-selected`.
44:
45: Same pattern — `insert_between` works on any existing edge:
46:
47: ```
48: add_node(plan_name="my-plan", nodeId="gate-framework-choice", component_name="user-decision-gate")
49: insert_between(plan_name="my-plan", from="scout-framework-recipes", to="notes-framework-selected", new_node="gate-framework-choice")
50:
51: # Result:
52: # (scout-framework-recipes) → (gate-framework-choice) → (notes-framework-selected)
53: #
54: # But wait — user-decision-gate needs exactly 2 children (it's a binary decision).
55: # The insert gave it 1 child (notes-framework-selected). We need to add the second branch.
56: # For a decision gate, one branch continues and the other typically routes back for more research.
57: connect_nodes(plan_name="my-plan", edges='{"gate-framework-choice": "research-framework"}')
58:
59: # Result:
60: # (gate-framework-choice) → [notes-framework-selected, research-framework]
61: ```
62:
63: ### Pattern 3: Extend a retry path (add more retries to an existing verify-retry chain)
64:
65: **Goal:** Increase the hookup retry depth from 1 to 2.
66:
67: The existing chain is:
68: ```
69: (research-hookup) → (verify-hookup) → [fix-hookup, notes-hookup-success]
70: (fix-hookup) → (verify-hookup-retry) → [notes-hookup-success, notes-hookup-failure]
71: ```
72:
73: To add a second retry, you need to intercept the failure exit from `verify-hookup-retry` and route it through a new fix-verify cycle instead:
74:
75: ```
76: # Step 1: Create the new retry nodes
77: add_nodes_to_dag(plan_name="my-plan", nodes='{"fix-hookup-2": "work-item", "verify-hookup-retry-2": "verify", "notes-hookup-failure-2": "write-notes"}')
78:
79: # Step 2: Remove the old failure edge from verify-hookup-retry to notes-hookup-failure
80: delete_edge(plan_name="my-plan", from="verify-hookup-retry", to="notes-hookup-failure")
81:
82: # Step 3: Wire the new retry cycle
83: connect_nodes(plan_name="my-plan", edges='{"verify-hookup-retry": "fix-hookup-2", "fix-hookup-2": "verify-hookup-retry-2", "verify-hookup-retry-2": ["notes-hookup-success", "notes-hookup-failure-2"]}')
84:
85: # Step 4: The old notes-hookup-failure is now orphaned — delete it since it's been replaced
86: delete_node(plan_name="my-plan", nodeId="notes-hookup-failure")
87:
88: # Result:
89: # (fix-hookup) → (verify-hookup-retry) → [notes-hookup-success, fix-hookup-2]
90: # (fix-hookup-2) → (verify-hookup-retry-2) → [notes-hookup-success, notes-hookup-failure-2]
91: ```
92:
93: > **Key insight:** When extending retry paths, always: (1) create new nodes first, (2) remove the old failure edge, (3) wire the new cycle, (4) clean up the orphaned old failure node.
94:
95: ### Pattern 4: Reroute a failure path through a new node
96:
97: **Goal:** Route `notes-blueprint-failure` through a `user-discussion` node before terminating.
98:
99: ```
100: # Step 1: Create the new nodes
101: add_nodes_to_dag(plan_name="my-plan", nodes='{"discuss-blueprint-failure": "user-discussion", "notes-blueprint-failure-final": "write-notes"}')
102:
103: # Step 2: Disconnect the old failure leaf from its parent
104: delete_edge(plan_name="my-plan", from="verify-blueprint-retry", to="notes-blueprint-failure")
105:
106: # Step 3: Wire the new failure path: parent → discussion → final write-notes
107: connect_nodes(plan_name="my-plan", edges='{"verify-blueprint-retry": "discuss-blueprint-failure", "discuss-blueprint-failure": "notes-blueprint-failure-final"}')
108:
109: # Step 4: Clean up the old orphaned failure node
110: delete_node(plan_name="my-plan", nodeId="notes-blueprint-failure")
111:
112: # Result:
113: # (verify-blueprint-retry) → [notes-blueprint-approved, discuss-blueprint-failure]
114: # (discuss-blueprint-failure) → (notes-blueprint-failure-final)
115: ```
116:
117: ### Pattern 5: Insert a prerequisite node before an existing node (multiple parents)
118:
119: **Goal:** Add a `run-project-commands` node before `research-hookup`. But `research-hookup` has a parent (`notes-blueprint-approved`).
120:
121: Use `insert_between` — it handles this cleanly:
122:
123: ```
124: add_node(plan_name="my-plan", nodeId="install-deps", component_name="run-project-commands")
125: insert_between(plan_name="my-plan", from="notes-blueprint-approved", to="research-hookup", new_node="install-deps")
126:
127: # Result:
128: # (notes-blueprint-approved) → (install-deps) → (research-hookup)
129: ```
130:
131: ## Common mistakes to avoid
132:
133: 1. **Never use `delete_edge` + `connect_nodes` when `insert_between` works.** The manual two-step creates intermediate orphan states that confuse later operations. `insert_between` is atomic.
134:
135: 2. **Always `get_compact_dag_draft` after each structural change.** Don't batch multiple changes and check once at the end — verify incrementally so you catch problems early.
136:
137: 3. **Clean up orphaned nodes immediately.** When you `delete_edge` and a node becomes unreachable, either reconnect it or `delete_node` it before continuing. Don't leave orphans accumulating.
138:
139: 4. **Don't re-set entry/exit points during revision.** The headwrench agent clears these before delegating to you. Focus on the structural changes. Entry and exit points are set after you're done.
140:
141: ## Thinking through this skill
142:
143: <|think|>
144: - For each critique point, which pattern above applies? Most revision operations are one of these five patterns.
145: - Am I using `insert_between` for mid-chain insertions instead of manual delete+connect?
146: - Am I checking `get_compact_dag_draft` after each structural change?
147: - Am I cleaning up orphaned nodes immediately after they become unreachable?
148: - Have I written my target adjacency list before making changes?

(End of file - total 148 lines)
</content>
```

---

## Assistant (Build · Claude Sonnet 4.6 · 9.6s)

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-designer.md"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-designer.md</path>
<type>file</type>
<content>
1: ---
2: name: dag-designer
3: description: "DAG Designer — builds first-pass MVP execution DAGs from the core component library."
4: color: "#8b5cf6"
5: mode: subagent
6: permission:
7:     "*": deny
8:     add_node: allow
9:     add_nodes_to_dag: allow
10:     connect_nodes: allow
11:     delete_node: allow
12:     delete_edge: allow
13:     set_entry_point: allow
14:     set_exit_point: allow
15:     get_compact_dag_draft: allow
16:     get_dag_draft_diagram: allow
17:     validate_dag: allow
18:     get_planning_components_catalogue: allow
19:     qdrant_qdrant-store: allow
20:     qdrant_qdrant-find: allow
21:     skill:
22:         "*": deny
23:         qdrant-notes: allow
24:         dag-tools: allow
25:         build-dags-core: allow
26:         dag-design-example: allow
27: ---
28:
29: # Role
30:
31: You are @dag-designer, a first-pass DAG construction specialist. You build MVP execution DAGs from the core component catalogue — a solid structural skeleton that a reviewer and reviser will improve in subsequent passes. Focus on getting the phases, verification, and convergence right. Do not overthink specialist node selection — that comes later.
32:
33: <|think|>
34: - What are your required skills? Did you load them before doing anything else?
35: - You are building a first-pass MVP — not a final product. Keep it structurally clean.
36: - You use the core catalogue only (`variant="core"`), never the full catalogue.
37:
38: ## How to Respond
39:
40: 1. If you were provided the name of a session plan being worked on, use the `qdrant_qdrant-store` tool to store session notes from your work so they can be accessed later. Use the plan name as the `collection_name` argument.
41: 2. After storing any session notes, respond via a direct response to the caller with the completed DAG name and rationale for key design decisions (branching structure, verification placement, failure handling). Do not write your session summary to any summary files, they will be ignored.
42:
43: ## Required Skills
44:
45: - `dag-design-example`
46: - `build-dags-core`
47: - `dag-tools`
48: - `qdrant-notes`
49:
50: ## Methodology
51:
52: <|think|>
53: 2. Load `dag-tools`
54: 4. Load `dag-design-example` and `build-dags-core` together
55: 4. Review the example DAG design and think through how the patterns used there can be applied to your current plan's DAG design
56: 3. Think through the `build-dags-core` skill, plan your approach from start to finish, and only then can you begin
57:
58: ## Operational Constraints
59:
60: - Always call `get_planning_components_catalogue` with `variant="core"` — never use the full catalogue
61: - Build and wire all work nodes first, then use `set_entry_point` and `set_exit_point` as the final construction step
62: - Every leaf node should be a `write-notes` node that captures context before exit — use `set_exit_point` to mark each one as a success or failure exit
63: - Default to 1 retry per verify-retry structure — the reviewer will adjust if needed

(End of file - total 63 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-reviewer.md"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-reviewer.md</path>
<type>file</type>
<content>
1: ---
2: name: dag-reviewer
3: description: "DAG Reviewer — evaluates execution DAGs for structural correctness and recommends improvements through deep analysis."
4: color: "#10b981"
5: mode: subagent
6: permission:
7:     "*": deny
8:     get_compact_dag_draft: allow
9:     get_dag_draft_diagram: allow
10:     validate_dag: allow
11:     get_planning_components_catalogue: allow
12:     qdrant_qdrant-store: allow
13:     qdrant_qdrant-find: allow
14:     skill:
15:         "*": deny
16:         qdrant-notes: allow
17:         dag-tools: allow
18:         dag-review-criteria: allow
19: ---
20:
21: # Role
22:
23: You are @dag-reviewer, a DAG critique and analysis specialist. You evaluate first-pass execution DAGs for structural correctness AND — more importantly — analyze whether the DAG needs specialist nodes, more sophisticated routing patterns, or adjusted retry depths. You do not build or fix DAGs. You produce critiques and recommendations that guide the reviser.
24:
25: <|think|>
26: - How does your role influence your approach to tasks?
27: - What are your required skills? Have you loaded them yet?
28: - What tools do you have access to? How do you use them?
29: - How do you respond once you've completed all your work?
30: - What's your methodology?
31: - What are your operational constraints?
32:
33: ## How to Respond
34:
35: 1. If you were provided the name of a session plan being worked on, use the `qdrant_qdrant-store` tool to store session notes from your work so they can be accessed later. Use the plan name as the `collection_name` argument.
36: 2. After storing any session notes, respond via a direct response to the caller as a structured critique organized in two sections: (1) Structural Findings — quick-pass anti-pattern checks, and (2) Deep Analysis — specialist node recommendations, routing pattern improvements, retry count adjustments, and user interaction opportunities. Point to specific node IDs with evidence for every finding. Do not write your session summary to any summary files, they will be ignored.
37:
38: ## Required Skills
39:
40: - `dag-tools`
41: - `dag-review-criteria`
42: - `qdrant-notes`
43:
44: > [!IMPORTANT]
45: > Always load your required skills as the first thing you do before doing any work, these teach you important aspects of your workflow.
46:
47: ## Methodology
48:
49: 1. Load your required skills.
50: 2. Decompose the caller's request into the review dimensions from `dag-review-criteria`.
51: 3. If you were provided the name of a session plan, use the `qdrant_qdrant-find` tool with the plan name as the `collection_name` argument to search for relevant session notes (including the original design goal and the orchestrator's tentative assessment answers).
52: 4. Call `get_dag_draft_diagram` for a structural overview, then `get_compact_dag_draft` for full node-level detail, then `get_planning_components_catalogue` (full variant) to see all available components including specialist nodes.
53: 5. Run Part 1 (Structural Validation) from `dag-review-criteria` — this should be quick.
54: 6. Run Part 2 (Deep Analysis) from `dag-review-criteria` — this is the bulk of your review. Use the orchestrator's tentative answers as starting points for your analysis.
55:
56: ## Operational Constraints
57:
58: - Always load the full DAG structure before reviewing — never critique from memory or partial information
59: - Always point to specific node IDs with evidence for every finding — no general observations without grounding
60: - Always provide critiques and recommendations only — never propose specific DAG restructurings, node-by-node adjacency lists, or alternative designs
61: - Always use the full catalogue (`get_planning_components_catalogue` without variant, or with `variant="full"`) so you can recommend specialist nodes
62: - Always store your findings before writing your final response
63: - Spend the majority of your review on Part 2 (Deep Analysis), not Part 1 (Structural Validation)

(End of file - total 63 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-reviser.md"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-reviser.md</path>
<type>file</type>
<content>
1: ---
2: name: dag-reviser
3: description: "DAG Reviser — improves execution DAGs using the full component library and reviewer feedback."
4: color: "#a855f7"
5: mode: subagent
6: permission:
7:     "*": deny
8:     add_node: allow
9:     add_nodes_to_dag: allow
10:     connect_nodes: allow
11:     insert_between: allow
12:     delete_node: allow
13:     delete_edge: allow
14:     set_entry_point: allow
15:     set_exit_point: allow
16:     get_compact_dag_draft: allow
17:     get_dag_draft_diagram: allow
18:     validate_dag: allow
19:     get_planning_components_catalogue: allow
20:     qdrant_qdrant-store: allow
21:     qdrant_qdrant-find: allow
22:     skill:
23:         "*": deny
24:         qdrant-notes: allow
25:         dag-tools: allow
26:         revise-dags: allow
27:         dag-revision-example: allow
28: ---
29:
30: # Role
31:
32: You are @dag-reviser, a second-pass DAG improvement specialist. You take a structurally valid first-pass DAG and substantially improve it using the full component catalogue and the reviewer's critique. Your job is not just to fix issues — it is to elevate the DAG from a working skeleton into a well-designed execution plan.
33:
34: <|think|>
35: - What are your required skills? Did you load them before doing anything else?
36: - How do you use `delete_node` and `delete_edge` to revise DAGs?
37: - You have access to the FULL catalogue — specialist nodes like research, deep-research, user-discussion, user-decision-gate, autonomous-work are available to you
38: - You are improving an existing DAG, not building from scratch
39:
40: ## How to Respond
41:
42: 1. If you were provided the name of a session plan being worked on, use the `qdrant_qdrant-store` tool to store session notes from your work so they can be accessed later. Use the plan name as the `collection_name` argument.
43: 2. After storing any session notes, respond via a direct response to the caller with a summary of what you changed and why — covering each critique point addressed and any additional improvements you identified. Do not write your session summary to any summary files, they will be ignored.
44:
45: ## Required Skills
46:
47: - `dag-revision-example`
48: - `revise-dags`
49: - `dag-tools`
50: - `qdrant-notes`
51:
52: ## Methodology
53:
54: <|think|>
55: 1. Load `dag-tools`
56: 2. Load `dag-revision-example` and `revise-dags` together
57: 3. Call `get_planning_components_catalogue` with the full catalogue (no variant, or `variant="full"`) to see all available components including specialist nodes
58: 4. Call `get_compact_dag_draft` and `get_dag_draft_diagram` to fully understand the current DAG
59: 5. Use `qdrant_qdrant-find` with the plan name to retrieve session notes, including the reviewer's critique
60: 6. Plan your revisions before making any changes — write the target adjacency list first
61: 7. For each critique point, identify which revision pattern applies (insert mid-chain, extend retries, reroute failure path, etc.) and use the appropriate tool — prefer `insert_between` for mid-chain insertions
62: 8. Verify with `get_compact_dag_draft` after each structural change
63: 9. Validate the final DAG
64:
65: ## Operational Constraints
66:
67: - Entry and exit points have been cleared before you start — focus only on structural changes (adding nodes, inserting between, rewiring edges)
68: - When you're done with structural changes, set entry and exit points as your final step before validating
69: - Always call `get_planning_components_catalogue` with the full catalogue — you have access to all components
70: - Always load the current DAG structure before making any changes — never revise from memory
71: - Always plan revisions before executing — write the target adjacency list, then identify the diff
72: - Prefer `insert_between` for inserting nodes mid-chain — never manually `delete_edge` + `connect_nodes` when `insert_between` works
73: - After any `delete_node`, immediately rewire orphaned children before continuing
74: - Check `get_compact_dag_draft` after each structural change — don't batch multiple changes without verifying
75: - Every leaf node should be a `write-notes` node — maintain this invariant through all revisions
76: - Call `validate_dag` when all revisions are complete

(End of file - total 76 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-description-author.md"
}
```

**Output:**
```
<path>/home/jack/CodeAccelerate-OpencodeConfig/files/agents/dag-description-author.md</path>
<type>file</type>
<content>
1: ---
2: name: dag-description-author
3: description: "DAG Description Author — writes per-node context descriptions that guide the executing agent."
4: color: "#c084fc"
5: mode: subagent
6: permission:
7:     "*": deny
8:     get_compact_dag_draft: allow
9:     get_dag_draft_diagram: allow
10:     add_description_to_node: allow
11:     get_planning_components_catalogue: allow
12:     qdrant_qdrant-find: allow
13:     skill:
14:         "*": deny
15:         qdrant-notes: allow
16: ---
17:
18: # Role
19:
20: You are @dag-description-author. You write per-node descriptions for execution DAGs. Each description tells the executing agent what this specific node should accomplish — not what the component type does generically, but what work is needed here in the context of this plan.
21:
22: <|think|>
23: - What are your required skills? Did you load them before doing anything else?
24: - Descriptions are execution context, not instructions. The component prompt already has instructions.
25: - Good descriptions answer: "What specifically should the executor do at this node, given the plan's goals?"
26: - Bad descriptions repeat what the component type already says.
27:
28: ## How to Respond
29:
30: 1. Store session notes about the descriptions you wrote using `qdrant_qdrant-store` if a plan name was provided.
31: 2. Respond with a summary of the descriptions you wrote and any nodes you intentionally left without descriptions.
32:
33: ## Required Skills
34:
35: - `qdrant-notes`
36:
37: > [!IMPORTANT]
38: > Always load your required skills as the first thing you do before doing any work, these teach you important aspects of your workflow.
39:
40: ## Methodology
41:
42: 1. Use `qdrant_qdrant-find` to retrieve the planning context — the user's original request, the scout's findings, the planner's rationale.
43: 2. Use `get_dag_draft_diagram` and `get_compact_dag_draft` to understand the DAG structure.
44: 3. Use `get_planning_components_catalogue` to understand what each component type does — so you don't repeat that in your descriptions.
45: 4. For each work node, write a description that explains what this specific node should accomplish. Ground descriptions in the plan's goals and the planning context.
46: 5. Use `add_description_to_node` to set each description.
47:
48: ## Writing Descriptions
49:
50: A description should tell the executor what to do at this node that the static component prompt cannot. Focus on:
51:
52: - **What specifically to investigate, build, or change** — file names, modules, patterns, APIs, whatever the planning phase identified
53: - **What the node's output should look like** — what should be true when this node is done
54: - **How this node connects to the larger plan** — what comes before provides context, what comes after depends on this node's output
55:
56: Do NOT include:
57: - Generic descriptions of what the component type does (the prompt already covers this)
58: - Step-by-step instructions (the component prompt handles methodology)
59: - Tool usage guidance (the component prompt and enforcement handle this)
60:
61: ## Operational Constraints
62:
63: - Write descriptions for work nodes (work-item, project-search-and-analysis, external-scout, deep-research, sequential-thinking). Skip structural nodes (verify, decision-gate, write-notes, compress, kickoff-refresher, commit, run-project-commands) unless the node's purpose is genuinely ambiguous from context.
64: - Keep descriptions concise — 2-4 sentences. Dense with specifics, not padded with generalities.
65: - Ground every description in information from the planning notes. Do not invent requirements.

(End of file - total 65 lines)
</content>
```

---

## Assistant (Build · Claude Sonnet 4.6 · 125.7s)

_Thinking:_

Now I have a clear picture of all the files. Let me analyze them against the principles established:

**Principles to apply:**
1. Zero markdown - use only XML-style tags as hard section boundaries
2. Ruthless brevity - system prompts 200-500 tokens
3. `<|think|>` only at agent system-prompt level for multi-step reasoning; NOT inline in skill files (wastes tokens)
4. Negative constraints go last
5. Goal-driven delegation only
6. Response format: structured prose under specified headers
7. Plain text inside XML tags

**Issues I see:**

### Skills - all four have `<|think|>` blocks that should NOT be there


All four skill files are violating the token-efficiency rules: they're embedding thinking blocks inline within procedure steps and adding "How to think" sections at the end, which defeats the purpose of keeping skills lean and focused. They're also using markdown formatting (headers, bullets, code blocks, blockquotes) when they should be using only XML tags and plain prose.

For the agents, there's a deeper issue—the `<|think|>` blocks are currently positioned inline as reasoning prompts within methodology sections, but the design direction calls for them to live at the system-prompt level. However, since these agent files *are* system prompts, I need to reconsider whether inline thinking blocks serve a legitimate purpose here as multi-step reasoning scaffolds versus just being reflection checklists.

Looking at the actual instruction more carefully: thinking should enable genuine multi-step reasoning for the whole agent conversation, not scattered reflection prompts. So the fix is to place a single `<|think|>` block at the very top of each agent's system prompt (right after the YAML frontmatter) to enable thinking globally, then remove all the inline ones.

For skills, the approach is cleaner—strip `<|think|>` entirely since skills shouldn't have thinking enabled, convert markdown formatting to XML tags, and keep the content terse.

So my rewrite plan: skills get `<|think|>` removed and markdown converted to XML; agents get consolidated to a single `<|think|>` at the top with inline ones removed and markdown converted to XML.

For the skill files, I need to preserve the core logic and examples while removing markdown headers and making the language more direct. For the agent files, same approach but with the thinking consolidation at the top level.

The dag-review-criteria file is the complex one—I'm reorganizing nine exercises into a logical flow: first the mechanical checks, then the hard stops, then the nine reasoning exercises in order, then placement guidance. This needs to be terse but complete enough that an agent can actually use it.

For the agent files, I need to be careful about the YAML frontmatter—that stays as-is, and I'm only rewriting the body content that comes after the closing `---`.

Looking at the nine review exercises, I notice the current file is missing research currency and commit placement. Let me work through each file in parallel, starting with the core skill definition. I'm setting up the procedure for building a structurally valid MVP execution DAG using only the core component catalogue, then moving through the rules that ensure every path terminates cleanly, verify nodes have proper branching, and all node IDs are descriptive rather than generic.

Now I'm moving into the staged construction approach: first building phase clusters independently with internal wiring, then connecting those clusters together, and finally setting entry and exit points. The key is confirming each stage with a compact DAG draft before moving forward. I'm looking at a reference artifact that breaks down how to structure a DAG through phase decomposition and tool call sequencing — showing decision gates with convergence, sequential work with early exit checks, and how different phases route into each other.

Now I'm examining the detailed phase structures: Phase 3a has a single verification with one retry path that either succeeds into Phase 4 or fails with a note, while Phase 3b implements a two-retry strategy where each failure triggers another fix-and-verify cycle before ultimately converging or writing a failure note.

I'm also mapping out how the phases connect together—the initial decision gate routes work into either the single-retry or double-retry paths, and both eventually feed into Phase 4's final work and summary documentation.

Setting up the DAG structure... Building out the remaining workflow stages...

Now I'm connecting the clusters together and then retrieving the compact DAG representation to visualize the current structure. After that, I need to set the entry and exit points for the workflow, marking which nodes represent success versus failure outcomes, and finally validate the entire DAG to ensure it's properly constructed.

I'm also noticing I need to update the review criteria documentation to include the nine exercises that were identified, plus incorporate research currency and commit placement considerations that aren't currently captured. Looking at the nine exercises, I need to make sure the current dag-review-criteria file captures all of them. The file already has structure checks, hard triggers, reasoning triggers, retry counts, and various execution considerations covered. But I'm missing research question inventory, research currency, and commit placement specifics. Let me integrate these three gaps along with the existing content, then restructure how the hard triggers fit in since they partially overlap with research questions and shell prerequisites. Now I'm drafting the updated SKILL.md file with the five core patterns, keeping the content solid but removing any meta-commentary and converting to XML formatting for the agents section.

For the agent prompts themselves, I need to be selective about where thinking blocks go. The dag-reviewer definitely needs extended thinking enabled since it's making complex validation decisions. The dag-designer might benefit from it when decomposing problems, but the dag-reviser and dag-description-author probably don't need it. The key is placing a single thinking token at the start of the system prompt body to signal the model to enable extended thinking for the whole conversation, rather than scattering reflection checklists throughout. I see the issue now - these `<|think|>` tokens are scattered throughout as prompts to trigger thinking at specific points, but that's not the right approach for Gemma 4. I should consolidate this into a single `<|think|>` token at the very beginning of the system prompt to enable extended reasoning for the entire conversation, then remove all the scattered instances. The new structure would place it right before the role definition so the model engages thinking mode from the start.

For the code examples in the skills, I need to avoid markdown code blocks since the guidelines specify XML-only formatting. I'll use plain indented text within the example tags instead - it'll be readable without the backtick fences since the context makes it clear.

Now I'm ready to rewrite all the files, starting with the skills and then moving through each agent. I'll move forward with drafting all the files now, keeping the JSON examples as plain indented text without markdown formatting.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Rewrite build-dags-core SKILL.md",
      "priority": "high",
      "status": "in_progress"
    },
    {
      "content": "Rewrite dag-design-example SKILL.md",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-review-criteria SKILL.md",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-revision-example SKILL.md",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-designer.md agent",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-reviewer.md agent",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-reviser.md agent",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-description-author.md agent",
      "priority": "high",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Rewrite build-dags-core SKILL.md",
    "priority": "high",
    "status": "in_progress"
  },
  {
    "content": "Rewrite dag-design-example SKILL.md",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-review-criteria SKILL.md",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-revision-example SKILL.md",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-designer.md agent",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-reviewer.md agent",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-reviser.md agent",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-description-author.md agent",
    "priority": "high",
    "status": "pending"
  }
]
```

---

## Assistant (Build · Claude Sonnet 4.6 · 20.7s)

**Tool: write**

**Input:**
```json
{
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/skills/build-dags-core/SKILL.md",
  "content": "---\nname: build-dags-core\ndescription: Teaches how to build a structurally valid MVP execution DAG from the core component catalogue using the staged construction procedure.\n---\n<overview>\nYou are building a first-pass MVP execution DAG using only the core catalogue. A reviewer and reviser improve it in subsequent passes. Your goal is a structurally clean skeleton — correct phases, verification, and convergence. Do not overthink specialist node selection; that is not your job.\n</overview>\n\n<procedure name=\"how-to-start\">\n1. Call get_planning_components_catalogue with variant=\"core\". Never design from memory; never use the full catalogue.\n2. Decompose the goal into phases.\n3. Follow the staged construction procedure below.\n</procedure>\n\n<rules>\nEvery path terminates at a leaf node — no dead ends.\nEvery verify node has exactly 2 children: pass path and fail path.\nEvery decision-gate has exactly 2 children.\nEvery leaf node is a write-notes node.\nBranches are mutually exclusive — no parallel work.\nNode IDs must be unique and descriptive. Never use generic names like node-1 or step-3. Add context: verify-setup, fix-build-errors, decision-gate-auth-check.\nDefault to 1 retry per verify-retry structure — the reviewer adjusts if needed.\nBuild and wire all work nodes first (Stages 1 and 2), then set entry and exit points last (Stage 3).\n</rules>\n\n<procedure name=\"staged-construction\">\nStage 1 — Build phase clusters.\nFor each phase: call add_nodes_to_dag to create all phase nodes, then call connect_nodes to wire internal edges, then call get_compact_dag_draft to confirm the cluster is correct. Orphaned clusters at this stage are expected and normal.\n\nStage 2 — Wire clusters together.\nCall connect_nodes for all inter-phase connections. Call get_compact_dag_draft to confirm all clusters are connected. Call get_dag_draft_diagram to see the full visual structure.\n\nStage 3 — Set entry and exit points.\nVerify: every terminal path is accounted for (success and failure), every verify-retry structure is correct, all phases are wired into a single connected graph, every leaf is a write-notes node.\nCall set_entry_point with the first work node.\nCall set_exit_point for every leaf node — success for happy-path, failure for retry-exhaustion.\n</procedure>\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Claude Sonnet 4.6 · 10.2s)

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Rewrite build-dags-core SKILL.md",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Rewrite dag-design-example SKILL.md",
      "priority": "high",
      "status": "in_progress"
    },
    {
      "content": "Rewrite dag-review-criteria SKILL.md",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-revision-example SKILL.md",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-designer.md agent",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-reviewer.md agent",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-reviser.md agent",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-description-author.md agent",
      "priority": "high",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Rewrite build-dags-core SKILL.md",
    "priority": "high",
    "status": "completed"
  },
  {
    "content": "Rewrite dag-design-example SKILL.md",
    "priority": "high",
    "status": "in_progress"
  },
  {
    "content": "Rewrite dag-review-criteria SKILL.md",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-revision-example SKILL.md",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-designer.md agent",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-reviewer.md agent",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-reviser.md agent",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-description-author.md agent",
    "priority": "high",
    "status": "pending"
  }
]
```

---

## Assistant (Build · Claude Sonnet 4.6 · 25.0s)

**Tool: write**

**Input:**
```json
{
  "content": "---\nname: dag-design-example\ndescription: Worked example of DAG design and construction — phase decomposition, tool call sequence, and expected output at each stage.\n---\n<overview>\nThis is a reference artifact. Study the phase decomposition and tool call sequence, then apply the same structure to the DAG you are building. Every leaf node is a write-notes node — success leaves capture accomplishments, failure leaves capture what went wrong.\n</overview>\n\n<example name=\"phase-decomposition\">\nPhase 1 — decision-gate with immediate convergence:\n  work-A → decision-gate-A\n    ├─ → work-A-option-1 → work-B (converge)\n    └─ → work-A-option-2 → work-B (converge)\n\nPhase 2 — sequential work with early success check:\n  work-B → work-C → decision-gate-early-check\n    ├─ → write-notes-early-success (leaf — early exit, goal already satisfied)\n    └─ → decision-gate-routing\n           ├─ → [Phase 3a entry]\n           └─ → [Phase 3b entry]\n\nPhase 3a — single retry, converges to Phase 4:\n  work-D → verify-D\n    ├─ (pass) → work-F (converge with Phase 3b)\n    └─ (fail) → fix-D → verify-D-retry\n                           ├─ (pass) → work-F (converge)\n                           └─ (fail) → write-notes-D-failure (leaf)\n\nPhase 3b — two retries, converges to Phase 4:\n  work-E → verify-E\n    ├─ (pass) → work-F (converge with Phase 3a)\n    └─ (fail) → fix-E-1 → verify-E-retry-1\n                             ├─ (pass) → work-F (converge)\n                             └─ (fail) → fix-E-2 → verify-E-retry-2\n                                                     ├─ (pass) → work-F (converge)\n                                                     └─ (fail) → write-notes-E-failure (leaf)\n\nPhase 4 — sequential to success:\n  work-F → write-notes-final-summary (leaf)\n\nInter-phase wiring:\n  work-A-option-1, work-A-option-2 → work-B\n  decision-gate-routing → work-D, work-E\n  verify-D pass, verify-E pass → work-F (convergence node)\n</example>\n\n<example name=\"stage-1-build-clusters\">\nLoad the catalogue first.\n  get_planning_components_catalogue(variant=\"core\")\n\nPhase 1:\n  add_nodes_to_dag(plan_name=\"my-plan\", nodes='{\"work-A\": \"work-item\", \"decision-gate-A\": \"decision-gate\", \"work-A-option-1\": \"work-item\", \"work-A-option-2\": \"work-item\"}')\n  connect_nodes(plan_name=\"my-plan\", edges='{\"work-A\": \"decision-gate-A\", \"decision-gate-A\": [\"work-A-option-1\", \"work-A-option-2\"]}')\n\nPhase 2:\n  add_nodes_to_dag(plan_name=\"my-plan\", nodes='{\"work-B\": \"work-item\", \"work-C\": \"work-item\", \"decision-gate-early-check\": \"decision-gate\", \"write-notes-early-success\": \"write-notes\", \"decision-gate-routing\": \"decision-gate\"}')\n  connect_nodes(plan_name=\"my-plan\", edges='{\"work-B\": \"work-C\", \"work-C\": \"decision-gate-early-check\", \"decision-gate-early-check\": [\"write-notes-early-success\", \"decision-gate-routing\"]}')\n\nPhase 3a:\n  add_nodes_to_dag(plan_name=\"my-plan\", nodes='{\"work-D\": \"work-item\", \"verify-D\": \"verify\", \"fix-D\": \"work-item\", \"verify-D-retry\": \"verify\", \"write-notes-D-failure\": \"write-notes\"}')\n  connect_nodes(plan_name=\"my-plan\", edges='{\"work-D\": \"verify-D\", \"verify-D\": [\"work-F\", \"fix-D\"], \"fix-D\": \"verify-D-retry\", \"verify-D-retry\": [\"work-F\", \"write-notes-D-failure\"]}')\n\nPhase 3b:\n  add_nodes_to_dag(plan_name=\"my-plan\", nodes='{\"work-E\": \"work-item\", \"verify-E\": \"verify\", \"fix-E-1\": \"work-item\", \"verify-E-retry-1\": \"verify\", \"fix-E-2\": \"work-item\", \"verify-E-retry-2\": \"verify\", \"write-notes-E-failure\": \"write-notes\"}')\n  connect_nodes(plan_name=\"my-plan\", edges='{\"work-E\": \"verify-E\", \"verify-E\": [\"work-F\", \"fix-E-1\"], \"fix-E-1\": \"verify-E-retry-1\", \"verify-E-retry-1\": [\"work-F\", \"fix-E-2\"], \"fix-E-2\": \"verify-E-retry-2\", \"verify-E-retry-2\": [\"work-F\", \"write-notes-E-failure\"]}')\n\nPhase 4:\n  add_nodes_to_dag(plan_name=\"my-plan\", nodes='{\"work-F\": \"work-item\", \"write-notes-final-summary\": \"write-notes\"}')\n  connect_nodes(plan_name=\"my-plan\", edges='{\"work-F\": \"write-notes-final-summary\"}')\n</example>\n\n<example name=\"stage-2-connect-clusters\">\n  connect_nodes(plan_name=\"my-plan\", edges='{\"work-A-option-1\": \"work-B\", \"work-A-option-2\": \"work-B\", \"decision-gate-routing\": [\"work-D\", \"work-E\"]}')\n  get_compact_dag_draft(target=\"my-plan\")\n  get_dag_draft_diagram(target=\"my-plan\")\n</example>\n\n<example name=\"stage-3-entry-exit\">\n  set_entry_point(plan_name=\"my-plan\", node_id=\"work-A\")\n\n  set_exit_point(plan_name=\"my-plan\", node_id=\"write-notes-early-success\", type=\"success\")\n  set_exit_point(plan_name=\"my-plan\", node_id=\"write-notes-final-summary\", type=\"success\")\n\n  set_exit_point(plan_name=\"my-plan\", node_id=\"write-notes-D-failure\", type=\"failure\")\n  set_exit_point(plan_name=\"my-plan\", node_id=\"write-notes-E-failure\", type=\"failure\")\n\n  validate_dag(plan_name=\"my-plan\")\n</example>\n",
  "filePath": "/home/jack/CodeAccelerate-OpencodeConfig/files/skills/dag-design-example/SKILL.md"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Claude Sonnet 4.6 · 9.5s)

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Rewrite build-dags-core SKILL.md",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Rewrite dag-design-example SKILL.md",
      "priority": "high",
      "status": "completed"
    },
    {
      "content": "Rewrite dag-review-criteria SKILL.md",
      "priority": "high",
      "status": "in_progress"
    },
    {
      "content": "Rewrite dag-revision-example SKILL.md",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-designer.md agent",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-reviewer.md agent",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-reviser.md agent",
      "priority": "high",
      "status": "pending"
    },
    {
      "content": "Rewrite dag-description-author.md agent",
      "priority": "high",
      "status": "pending"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Rewrite build-dags-core SKILL.md",
    "priority": "high",
    "status": "completed"
  },
  {
    "content": "Rewrite dag-design-example SKILL.md",
    "priority": "high",
    "status": "completed"
  },
  {
    "content": "Rewrite dag-review-criteria SKILL.md",
    "priority": "high",
    "status": "in_progress"
  },
  {
    "content": "Rewrite dag-revision-example SKILL.md",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-designer.md agent",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-reviewer.md agent",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-reviser.md agent",
    "priority": "high",
    "status": "pending"
  },
  {
    "content": "Rewrite dag-description-author.md agent",
    "priority": "high",
    "status": "pending"
  }
]
```

---

## Assistant (Build · Claude Sonnet 4.6 · 0.2s)

---

## User

sorry continue

---

## Assistant (Build · Claude Sonnet 4.6 · 130.1s)

_Thinking:_

Let me continue with the dag-review-criteria SKILL.md rewrite. This is the heavy one with nine enumeration exercises.

**Tool: write**

**Input:**
```json
{}
```

**Error:**
```
Tool execution aborted
```

---

