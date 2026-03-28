# Node Type Catalog — Modular Planning Library v2.0

This catalog documents all 13 core node types used in CodeAccelerate planning DAGs. It serves as the primary reference for developers composing project DAGs that guide agents through work decomposition, investigation, research, and collaboration.

**Schema Version:** 2.0  
**Last Audited:** 2026-03-27  
**Compliance Status:** ✅ All 13 nodes v2.0 compliant  

---

## DAG v2.0 Schema Compliance

**All nodes in this catalog follow the DAG v2.0 schema.** Each node must contain only these 4 fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique identifier within the DAG |
| `prompt` | string | yes | Bare filename of prompt (e.g., `"intake.md"`, NOT `"prompts/intake.md"`) |
| `todo` | array | yes | Valid OpenCode tool names ONLY: `["task"]`, `["question"]`, `["bash"]`, `["skill"]`, or `[]` for auto-advance |
| `next` | node/branch[] | no | Single node, array of branches, or omitted for terminal nodes |

**✅ VALID todo items (v2.0):**
- `"task"` — OpenCode task tool (execution, analysis, code generation)
- `"question"` — OpenCode question tool (user input, decision gates)
- `"bash"` — Execute shell commands with exit code branching
- `"skill"` — Invoke a delegated skill (e.g., refactor, decompose)
- `[]` — Empty array for auto-advance nodes (no tool invocation)

**❌ DO NOT INCLUDE:**
- `node_id`, `name`, `description` (those go in manifest.jsonc, not DAGs)
- `prompt_filename` (changed to `prompt` in v2.0)
- `todo_sequence` (changed to `todo` in v2.0)
- Invalid todo items: `observation`, `compress`, `analyze`, `research`
- Custom metadata or extra fields (use manifest for node metadata)

**For the complete v2.0 schema specification, see:** `files/planning/reference/dag-design-guide.md`

---

## Quick Reference Table

| Node ID | Name | Category | Primary Agent | Parallel? | When to Use |
|---------|------|----------|---|-----------|------------|
| `session-overview` | Session Overview | Entry/Initialization | HeadWrench | N/A | Start of any planning session |
| `intake` | Information Intake | Entry/Initialization | HeadWrench | No | Gather goal, acceptance criteria, scope |
| `scout-parallel` | Parallel Scouting | Exploration/Analysis | context-scout | Yes | Explore codebase independently (3 parallel tasks) |
| `analyze-deep` | Deep Analysis | Exploration/Analysis | context-insurgent | No | Synthesize scout findings, form hypothesis |
| `skill-invoke` | Skill Execution | Exploration/Analysis | Delegated | Yes | Execute a delegated skill (e.g., decompose, refactor) |
| `parallel-tasks` | Parallel Work | Execution | junior-dev | Yes | Execute 2–4 independent subtasks in parallel |
| `compression-node` | Compression & Summary | Execution | context-insurgent | No | Synthesize multi-branch outputs before terminal |
| `decision-gate` | User Decision Gate | Control Flow | HeadWrench | No | Branch execution based on user input |
| `conditional-branch` | Conditional Branch | Control Flow | HeadWrench | No | Branch based on agent evaluation (success/failure) |
| `loop-until-success` | Exhaustion Loop | Control Flow | HeadWrench | No | Retry pattern with visit counter enforcement |
| `verification-check` | Verification Gate | Control Flow | junior-dev | No | Validate intermediate output against criteria |
| `output-success` | Success Terminal | Terminal/Output | HeadWrench | N/A | Conclude with success artifact |
| `output-failure` | Failure Terminal | Terminal/Output | HeadWrench | N/A | Conclude with diagnostic output |

---

## Core Node Types — Detailed Reference

### Entry/Initialization Nodes

#### 1. Session Overview (`session-overview`)

**Purpose**  
Auto-advancing node that introduces the planning session and primes the orchestrator for focused context gathering. Reads session state without requiring agent dispatch or tool invocation.

**Category**  
Entry/Initialization

**Agents & Budgets**  
- Primary Agent: HeadWrench (orchestrator context only)
- Step Budget: 0 (no agent dispatch)
- Execution: Serial only
- Auto-advance: Yes (no todo items)

**v2.0 Compliant Definition**
```json
{
  "id": "session-overview",
  "prompt": "session-overview.md",
  "todo": []
}
```

**Branching**  
Linear → next node (typically `intake`)

**When to Use**  
- First node in every planning DAG
- Sets tone and clarifies planning mode (generic, debug, collaborative, etc.)
- Reads current session state and project context
- Session resumption or cross-team handoff

**Example in DAG Context**
```json
{
  "id": "session-overview",
  "prompt": "session-overview.md",
  "todo": [],
  "next": {
    "id": "intake",
    "prompt": "intake.md",
    "todo": ["question"]
  }
}
```

---

#### 2. Information Intake (`intake`)

**Purpose**  
Gather user intent, refine problem statement, and establish acceptance criteria.

**Category**  
Entry/Initialization

**Agents & Budgets**  
- Primary Agent: HeadWrench (orchestrator)
- Step Budget: 5
- Execution: Serial only

**v2.0 Compliant Definition**
```json
{
  "id": "intake",
  "prompt": "intake.md",
  "todo": ["question"]
}
```

**Todo Sequence (v2.0)**
- `"question"` — Ask user for goal, constraints, acceptance criteria

**Branching**  
Linear → next node (typically `scout-parallel` or `decision-gate`)

**When to Use**  
- Immediately after `session-overview`
- Need to formalize user requirements
- Establish scope boundaries and success metrics

**Example in DAG Context**
```json
{
  "id": "intake",
  "prompt": "intake.md",
  "todo": ["question"],
  "next": {
    "id": "scout-parallel",
    "prompt": "scout-parallel.md",
    "todo": ["task", "task", "task"]
  }
}
```

---

### Exploration/Analysis Nodes

#### 3. Parallel Scouting (`scout-parallel`)

**Purpose**  
Coordinate parallel exploration of the codebase via context-scout. Fans out 3 independent exploration tasks.

**Category**  
Exploration/Analysis

**Agents & Budgets**  
- Primary Agent: context-scout
- Step Budget: 12 (per task, 3 concurrent)
- Execution: Parallel (3 tasks concurrently)

**v2.0 Compliant Definition**
```json
{
  "id": "scout-parallel",
  "prompt": "scout-parallel.md",
  "todo": ["task", "task", "task"]
}
```

**Todo Sequence (v2.0)**
- `"task"` — Independent exploration task 1
- `"task"` — Independent exploration task 2
- `"task"` — Independent exploration task 3

**Branching**  
Linear → next node (typically `analyze-deep` or `compression-node`)

**When to Use**  
- Early in DAG after intake
- Need to gather context from multiple areas of codebase
- Can leverage parallel execution to reduce time
- Each task is independent (no coordination needed)

**Example in DAG Context**
```json
{
  "id": "scout-parallel",
  "prompt": "scout-parallel.md",
  "todo": ["task", "task", "task"],
  "next": {
    "id": "analyze-deep",
    "prompt": "analyze-deep.md",
    "todo": ["task"]
  }
}
```

---

#### 4. Deep Analysis (`analyze-deep`)

**Purpose**  
Synthesize findings from scouts and form hypothesis for implementation approach.

**Category**  
Exploration/Analysis

**Agents & Budgets**  
- Primary Agent: context-insurgent
- Step Budget: 20
- Execution: Serial only

**v2.0 Compliant Definition**
```json
{
  "id": "analyze-deep",
  "prompt": "analyze-deep.md",
  "todo": ["task"]
}
```

**Todo Sequence (v2.0)**
- `"task"` — Deep analysis, hypothesis formation

**Branching**  
Linear → next node (typically `decision-gate`, `skill-invoke`, or `parallel-tasks`)

**When to Use**  
- After parallel scouting
- Need comprehensive synthesis across multiple areas
- Form strategy before execution
- Complex analysis requiring sustained focus

**Example in DAG Context**
```json
{
  "id": "analyze-deep",
  "prompt": "analyze-deep.md",
  "todo": ["task"],
  "next": {
    "id": "decision-gate",
    "prompt": "decision-gate.md",
    "todo": ["question"]
  }
}
```

---

#### 5. Skill Invocation (`skill-invoke`)

**Purpose**  
Dispatch a delegated skill (e.g., refactor, decompose, research) that manages its own subtasks.

**Category**  
Exploration/Analysis

**Agents & Budgets**  
- Primary Agent: Varies (depends on skill)
- Step Budget: Varies (depends on skill)
- Execution: Can be parallel if skill allows

**v2.0 Compliant Definition**
```json
{
  "id": "skill-invoke",
  "prompt": "skill-invoke.md",
  "todo": ["skill"]
}
```

**Todo Sequence (v2.0)**
- `"skill"` — Invoke named skill (e.g., "decompose", "refactor", "research")

**Branching**  
Linear → next node or can branch based on skill outcome

**When to Use**  
- Delegating well-defined, repetitive work
- Invoking composition/decomposition logic
- Research or specialized analysis via MCP tools
- Refactoring or code generation skills

**Example in DAG Context**
```json
{
  "id": "skill-invoke",
  "prompt": "skill-invoke.md",
  "todo": ["skill"],
  "next": {
    "id": "verification-check",
    "prompt": "verification-check.md",
    "todo": ["bash"]
  }
}
```

---

### Execution Nodes

#### 6. Parallel Tasks (`parallel-tasks`)

**Purpose**  
Dispatch 2–4 independent work items (code changes, tests, documentation) to junior-dev in parallel.

**Category**  
Execution

**Agents & Budgets**  
- Primary Agent: junior-dev
- Step Budget: 10 (per task, up to 4 concurrent)
- Execution: Parallel (2–4 tasks concurrently)

**v2.0 Compliant Definition**
```json
{
  "id": "parallel-tasks",
  "prompt": "parallel-tasks.md",
  "todo": ["task", "task", "task"]
}
```

**Todo Sequence (v2.0)**
- `"task"` — Independent work task 1
- `"task"` — Independent work task 2
- `"task"` — Independent work task 3 (optional fourth)

**Branching**  
Linear → next node (typically `verification-check` or `compression-node`)

**When to Use**  
- Execute multiple independent code changes
- Each subtask has no dependency on others
- Can run in parallel to reduce time
- After planning/analysis phase is complete

**Example in DAG Context**
```json
{
  "id": "parallel-tasks",
  "prompt": "parallel-tasks.md",
  "todo": ["task", "task", "task"],
  "next": {
    "id": "verification-check",
    "prompt": "verification-check.md",
    "todo": ["bash"]
  }
}
```

---

#### 7. Compression & Summary (`compression-node`)

**Purpose**  
Aggregate and synthesize outputs from multiple parallel branches (scouts, tasks, or skills) into a unified summary before progressing to verification or terminal nodes.

**Category**  
Execution

**Agents & Budgets**  
- Primary Agent: context-insurgent
- Step Budget: 20
- Execution: Serial only

**v2.0 Compliant Definition**
```json
{
  "id": "compression-node",
  "prompt": "compression-node.md",
  "todo": ["task"]
}
```

**Todo Sequence (v2.0)**
- `"task"` — Compress and synthesize multi-branch outputs

**Branching**  
Linear → next node (typically `verification-check` or terminal)

**When to Use**  
- After parallel branches that need summarization
- Reduce context noise before verification
- Synthesize findings from scouts + analysis
- Prepare handoff to terminal node

**Example in DAG Context**
```json
{
  "id": "compression-node",
  "prompt": "compression-node.md",
  "todo": ["task"],
  "next": {
    "id": "output-success",
    "prompt": "output-success.md",
    "todo": []
  }
}
```

---

### Control Flow Nodes

#### 8. Decision Gate (`decision-gate`)

**Purpose**  
Ask user to choose between multiple execution paths (e.g., Approach A vs. Approach B vs. More exploration).

**Category**  
Control Flow

**Agents & Budgets**  
- Primary Agent: HeadWrench (orchestrator)
- Step Budget: 5
- Execution: Serial only

**v2.0 Compliant Definition**
```json
{
  "id": "decision-gate",
  "prompt": "decision-gate.md",
  "todo": ["question"],
  "next": [
    {
      "when": "User chooses path A",
      "node": {
        "id": "implement-a",
        "prompt": "implement-a.md",
        "todo": ["task"]
      }
    },
    {
      "when": "User chooses path B",
      "node": {
        "id": "implement-b",
        "prompt": "implement-b.md",
        "todo": ["task"]
      }
    },
    {
      "when": "User wants more exploration",
      "node": {
        "id": "scout-more",
        "prompt": "scout-parallel.md",
        "todo": ["task", "task", "task"]
      }
    }
  ]
}
```

**Todo Sequence (v2.0)**
- `"question"` — Present options and get user decision

**Branching**  
Conditional → multiple branches based on user response

**When to Use**  
- Present multiple strategy options to user
- After analysis when decision point is reached
- Get explicit user approval before proceeding
- Split DAG into alternative execution paths

---

#### 9. Conditional Branch (`conditional-branch`)

**Purpose**  
Execute a command and branch based on exit code (0 = success, 1 = failure, 2 = error).

**Category**  
Control Flow

**Agents & Budgets**  
- Primary Agent: HeadWrench (orchestrator)
- Step Budget: 5
- Execution: Serial only

**v2.0 Compliant Definition**
```json
{
  "id": "conditional-branch",
  "prompt": "conditional-branch.md",
  "todo": ["bash"],
  "next": [
    {
      "when": "Exit code 0 - Tests passed",
      "node": {
        "id": "tests-passed",
        "prompt": "output-success.md",
        "todo": []
      }
    },
    {
      "when": "Exit code 1 - Tests failed",
      "node": {
        "id": "tests-failed-retry",
        "prompt": "loop-until-success.md",
        "todo": ["bash"]
      }
    },
    {
      "when": "Exit code 2 - Environment error",
      "node": {
        "id": "env-error",
        "prompt": "output-failure.md",
        "todo": []
      }
    }
  ]
}
```

**Todo Sequence (v2.0)**
- `"bash"` — Execute shell command and capture exit code

**Branching**  
Conditional → multiple branches based on exit codes (0, 1, 2)

**When to Use**  
- Run tests and decide next step based on pass/fail
- Validate build output
- Execute verification commands with different exit paths
- Environment checks with specific error codes

---

#### 10. Exhaustion Loop (`loop-until-success`)

**Purpose**  
Retry a bash command up to a configurable maximum (default: 3 iterations) until success (exit code 0) or max attempts reached.

**Category**  
Control Flow

**Agents & Budgets**  
- Primary Agent: HeadWrench (orchestrator)
- Step Budget: 5 per iteration (up to 3 iterations = 15 total)
- Execution: Serial only

**v2.0 Compliant Definition**
```json
{
  "id": "loop-until-success",
  "prompt": "loop-until-success.md",
  "todo": ["bash"],
  "next": [
    {
      "when": "Exit code 0 - Work succeeded",
      "node": {
        "id": "success",
        "prompt": "output-success.md",
        "todo": []
      }
    },
    {
      "when": "Iterations < max - Retry",
      "node": {
        "id": "retry-attempt",
        "prompt": "loop-until-success.md",
        "todo": ["bash"]
      }
    },
    {
      "when": "Iterations >= max - Give up",
      "node": {
        "id": "max-attempts-reached",
        "prompt": "output-failure.md",
        "todo": []
      }
    }
  ]
}
```

**Todo Sequence (v2.0)**
- `"bash"` — Execute command; looping is automatic within node

**Branching**  
Conditional → success, retry loop, or max attempts reached

**When to Use**  
- Retry failed tests or build commands
- Flaky environment checks
- Integration tests with transient failures
- Automatic recovery attempts (e.g., npm install retry)

**Loop Behavior**  
- Automatically tracks iteration count (stored in node state)
- Retries up to `max_iterations` (default: 3)
- On exit code 0 → branch to success
- On exit code 1 + iterations < max → auto-loop
- On iterations >= max → branch to failure

---

#### 11. Verification Gate (`verification-check`)

**Purpose**  
Validate intermediate output (tests, builds, lint) against acceptance criteria and branch based on exit code.

**Category**  
Control Flow

**Agents & Budgets**  
- Primary Agent: junior-dev
- Step Budget: 10
- Execution: Serial only

**v2.0 Compliant Definition**
```json
{
  "id": "verification-check",
  "prompt": "verification-check.md",
  "todo": ["bash"],
  "next": [
    {
      "when": "Exit code 0 - All checks passed",
      "node": {
        "id": "verification-success",
        "prompt": "output-success.md",
        "todo": []
      }
    },
    {
      "when": "Exit code 1 - Tests failed",
      "node": {
        "id": "fix-tests",
        "prompt": "loop-until-success.md",
        "todo": ["task"]
      }
    },
    {
      "when": "Exit code 2 - Build failed",
      "node": {
        "id": "fix-build",
        "prompt": "loop-until-success.md",
        "todo": ["task"]
      }
    }
  ]
}
```

**Todo Sequence (v2.0)**
- `"bash"` — Run verification checks (tests, build, lint)

**Branching**  
Conditional → success, fix tests, or fix build

**When to Use**  
- After `parallel-tasks` or `skill-invoke`
- Validate code quality and functionality
- Gate progress to terminal based on criteria
- Provide diagnostic feedback on failures

---

### Terminal Nodes

#### 12. Success Terminal (`output-success`)

**Purpose**  
Conclude DAG with success, generate final artifact/summary, and communicate results to user.

**Category**  
Terminal/Output

**Agents & Budgets**  
- Primary Agent: HeadWrench (orchestrator)
- Step Budget: N/A (terminal)
- Execution: Serial only

**v2.0 Compliant Definition**
```json
{
  "id": "output-success",
  "prompt": "output-success.md",
  "todo": []
}
```

**Todo Sequence (v2.0)**
- (empty) — No tool calls; terminal node auto-completes

**Branching**  
None (terminal)

**When to Use**  
- Final node in successful execution paths
- Generate summary artifact or deliverable
- Communicate completion to user
- DAG reaches success criteria

**Example in DAG Context**
```json
{
  "id": "output-success",
  "prompt": "output-success.md",
  "todo": []
}
```

---

#### 13. Failure Terminal (`output-failure`)

**Purpose**  
Conclude DAG with failure, provide diagnostic information, and communicate error context to user.

**Category**  
Terminal/Output

**Agents & Budgets**  
- Primary Agent: HeadWrench (orchestrator)
- Step Budget: N/A (terminal)
- Execution: Serial only

**v2.0 Compliant Definition**
```json
{
  "id": "output-failure",
  "prompt": "output-failure.md",
  "todo": []
}
```

**Todo Sequence (v2.0)**
- (empty) — No tool calls; terminal node auto-completes

**Branching**  
None (terminal)

**When to Use**  
- Final node in failure paths (retries exhausted, verification failed, etc.)
- Provide diagnostic information and next steps
- Communicate error to user with context
- DAG fails to meet success criteria

**Example in DAG Context**
```json
{
  "id": "output-failure",
  "prompt": "output-failure.md",
  "todo": []
}
```

---

## v2.0 Compliance Changes Summary

### What Changed from Earlier Versions

1. **Schema Field Simplification**
   - `todo_sequence` → `todo` (shorter, matches OpenCode terminology)
   - `prompt_filename` → `prompt` (bare filename only, no directory path)
   - Removed: `node_id`, `name`, `description` (now in manifest.jsonc only)
   - Removed: custom metadata fields

2. **Todo Item Standardization**
   - Valid items: `"task"`, `"question"`, `"bash"`, `"skill"`, `[]`
   - Removed invalid items: `"observation"`, `"compress"`, `"analyze"`, `"research"`
   - All node definitions in `files/task-library/nodes/*.json` updated

3. **Branching Structure Clarified**
   - Single `next` node for linear progression
   - Array of branches with `when`/`node` pairs for conditional
   - Clear separation between user input (`question`) and exit code (`bash`) branching

4. **Auto-advance Nodes**
   - Session overview and terminal nodes use `"todo": []`
   - No tool invocation; DAG engine auto-completes
   - Reduces unnecessary agent dispatch

5. **Parallel Execution**
   - `scout-parallel` and `parallel-tasks` run 3 tasks concurrently
   - Iteration/visit counter enforced within `loop-until-success`
   - Parallel execution configurable per node

### All Valid Todo Items (v2.0)

```json
{
  "valid_items": [
    {
      "item": "task",
      "description": "Dispatch work to an agent (analysis, code, planning)",
      "examples": ["Scout the files", "Analyze the error", "Write the function"],
      "tool_mapped_to": "OpenCode task tool"
    },
    {
      "item": "question",
      "description": "Ask user for decision, input, or confirmation",
      "examples": ["Which approach?", "Approve changes?", "Additional context?"],
      "tool_mapped_to": "OpenCode question tool"
    },
    {
      "item": "bash",
      "description": "Execute shell command; branches on exit code (0, 1, 2)",
      "examples": ["npm test", "git diff", "bun run build"],
      "tool_mapped_to": "OpenCode bash tool"
    },
    {
      "item": "skill",
      "description": "Invoke a named delegated skill",
      "examples": ["decompose", "refactor", "research"],
      "tool_mapped_to": "Skill invocation via delegation"
    }
  ],
  "empty_array": {
    "item": "[]",
    "description": "Auto-advance node (no tool invocation)",
    "examples": ["session-overview", "output-success", "output-failure"],
    "behavior": "DAG engine auto-completes without agent dispatch"
  }
}
```

### Compression Tool Pattern (v2.0)

The `compression-node` pattern is **not** a todo item. It uses a standard `"task"` item that internally:

1. Reads outputs from all previous branches
2. Synthesizes findings into a unified summary
3. Stores compressed context for next node
4. Reduces context overhead for terminal node

**Example:**
```json
{
  "id": "compression-node",
  "prompt": "compression-node.md",
  "todo": ["task"],
  "next": {
    "id": "output-success",
    "prompt": "output-success.md",
    "todo": []
  }
}
```

---

## Certification: DAG v2.0 Compliance

✅ **All 13 nodes audited and corrected** (2026-03-27)

- `session-overview` — Entry, auto-advance ✓
- `intake` — Entry, question-based ✓
- `scout-parallel` — 3 parallel tasks ✓
- `analyze-deep` — Single deep analysis task ✓
- `skill-invoke` — Single skill invocation ✓
- `parallel-tasks` — 3 parallel execution tasks ✓
- `compression-node` — Multi-branch aggregation ✓
- `decision-gate` — User choice branching ✓
- `conditional-branch` — Exit code branching ✓
- `loop-until-success` — Retry loop with iteration counter ✓
- `verification-check` — Validation with branching ✓
- `output-success` — Terminal auto-advance ✓
- `output-failure` — Terminal auto-advance ✓

✅ **Schema violations fixed:**
- Removed custom metadata from node files
- Standardized `todo` field format
- Removed invalid todo items (`observation`, `compress`, `analyze`, `research`)
- Updated all `prompt` fields to bare filenames
- Corrected branching structure for conditional nodes

✅ **Examples verified:**
- All JSON examples use v2.0 schema
- All todo sequences use valid items only
- All branching patterns match OpenCode DAG semantics

✅ **Ready for production deployment**

---

## References

- **DAG Design Guide:** `files/planning/reference/dag-design-guide.md`
- **Node Templates:** `files/task-library/templates/`
- **Node Definitions:** `files/task-library/nodes/`
- **Manifest Registry:** `files/task-library/manifest.jsonc`

