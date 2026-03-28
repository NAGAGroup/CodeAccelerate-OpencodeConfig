# Skill Invoke Node Type

---

## DAG v2.0 Schema Compliance

Skill invoke nodes follow the strict DAG v2.0 schema:

| Field | Value |
|-------|-------|
| `id` | Unique identifier (e.g., `"load-delegation-skill"`) |
| `prompt` | Bare filename: `"skill-invoke.md"` |
| `todo` | `["skill"]` ONLY — skill is exclusively valid here |
| `next` | Single node or omitted for terminal |

**v2.0 Node Fields (only these 4 allowed):**
- No `node_id`, `name`, `description` in DAG node definitions
- No `prompt_filename` (use `prompt`)
- No descriptions mixed into todo array values
- No custom metadata

See `files/planning/reference/dag-design-guide.md` for complete v2.0 spec.

---

## Overview

The **skill-invoke** node loads and applies a reusable skill to the current session context. HeadWrench reads the skill definition, extracts knowledge and procedural information, and injects it into the session where it becomes available to all downstream agents. Skills provide reference documentation, patterns, templates, and procedural knowledge.

## Purpose

- Load reusable skills (delegation, documentation patterns, code review, etc.)
- Inject procedural knowledge into session context
- Make best practices and patterns available to downstream agents
- Enable knowledge reuse across multiple tasks

## Node Characteristics

| Attribute | Value |
|-----------|-------|
| **ID** | `skill-invoke` |
| **Category** | Execution |
| **Todo Sequence** | `["skill"]` (exactly one skill) |
| **Primary Agent** | HeadWrench |
| **Agent Step Budget** | 5 (minimal overhead) |
| **Branching Support** | Linear only |
| **Parallel Execution** | No (single task) |
| **Requires Prompt** | Yes |

## When to Use

- **Apply delegation skill** before complex multi-agent orchestration
- **Load documentation patterns** before document generation tasks
- **Inject code review practices** before code quality tasks
- **Enable reference knowledge** for downstream processing
- **Establish procedural frameworks** for agent decision-making

## Important: "skill" is Only Valid in skill-invoke Nodes

**❌ INVALID in other nodes:** `"todo": ["skill"]` (used in intake, parallel-tasks, etc.)  
**✅ VALID only in skill-invoke:** `{ "id": "load-skill", "prompt": "skill-invoke.md", "todo": ["skill"] }`

The `skill` todo item is exclusively for the `skill-invoke` node type. In other nodes:
- Use `"task"` for agent dispatch
- Use `"bash"` for command execution  
- Use `"question"` for user input

## Available Skills

### delegation (Primary)
- **Purpose:** Coordinates multi-agent dispatch and routing
- **Provides:** Agent role definitions, assignment rules, communication patterns
- **Use before:** Complex multi-agent tasks requiring coordination
- **Size:** ~2KB knowledge artifact
- **Typical flow:** skill-invoke(delegation) → parallel-tasks

### documentation-patterns
- **Purpose:** Common documentation templates and conventions
- **Provides:** Markdown patterns, API doc templates, example structures
- **Use before:** Documentation generation and formatting tasks
- **Size:** ~3KB knowledge artifact
- **Typical flow:** skill-invoke(documentation-patterns) → QuickDoc task

### code-review
- **Purpose:** Best practices for code review and feedback
- **Provides:** Review criteria, feedback templates, architecture patterns
- **Use before:** Code quality assurance and architectural decisions
- **Size:** ~2.5KB knowledge artifact
- **Typical flow:** skill-invoke(code-review) → analysis tasks

### hello-world
- **Purpose:** Tutorial and reference for basic workflows
- **Provides:** Simple patterns and starter templates
- **Use before:** Onboarding or tutorial-focused sessions
- **Size:** ~1KB knowledge artifact
- **Typical flow:** skill-invoke(hello-world) → guided task

## Structure

```json
{
  "id": "skill-invoke",
  "name": "Skill Invoke",
  "prompt": "skill-invoke.md",
  "todo": ["skill"],
  "next": {
    "id": "execute-with-skill",
    "prompt": "parallel-tasks.md",
    "todo": ["task", "task", "task"]
  }
}
```

## Implementation Notes

### Skill Loading Process

1. **HeadWrench reads** the skill definition file
2. **Extracts knowledge** from SKILL.md and related artifacts
3. **Parses structure** (metadata, procedures, templates)
4. **Injects into context** (makes available session-wide)
5. **Notifies session** that skill is now active
6. **Downstream agents** can reference the skill

### Knowledge Injection

Once a skill is invoked, its knowledge becomes available to **all subsequent agents**:

```
skill-invoke(delegation)
  ↓
  [Delegation knowledge injected into session context]
  ↓
parallel-tasks
  ↓
  @JuniorDev can reference delegation patterns
  @QuickDoc can reference delegation templates
  @DeepResearcher can reference delegation frameworks
```

### Skill Reference Format

Each skill provides structured reference information:

```yaml
# delegation skill example
agents:
  junior-dev:
    role: "Targeted code editing"
    budget: 10
    capabilities: ["file-edits", "implementation", "testing"]
  
  quick-doc:
    role: "Documentation generation"
    budget: 8
    capabilities: ["markdown", "examples", "formatting"]
  
  deep-researcher:
    role: "Research and analysis"
    budget: 15
    capabilities: ["investigation", "recommendations", "synthesis"]

patterns:
  parallel-dispatch: "1-3 independent agents, non-blocking"
  sequential-dispatch: "Linear agent chain with context passing"
  feedback-loop: "Agent output → analysis → dispatch"
```

## Integration

### Typical Usage Patterns

#### Pattern 1: Skill → Parallel Execution
```json
{
  "id": "step1",
  "prompt": "skill-invoke.md",
  "todo": ["skill"],
  "next": {
    "id": "step2",
    "prompt": "parallel-tasks.md",
    "todo": ["task", "task", "task"]
  }
}
```

#### Pattern 2: Skill → Decision → Dispatch
```json
{
  "id": "load-knowledge",
  "prompt": "skill-invoke.md",
  "todo": ["skill"],
  "next": {
    "id": "decide",
    "prompt": "decision-gate.md",
    "todo": ["question"],
    "next": [
      {
        "when": "Path A",
        "node": { "id": "path-a", "prompt": "task-a.md" }
      },
      {
        "when": "Path B",
        "node": { "id": "path-b", "prompt": "task-b.md" }
      }
    ]
  }
}
```

#### Pattern 3: Multiple Skills in Sequence
```json
{
  "id": "load-skills-1",
  "prompt": "skill-invoke.md",
  "todo": ["skill"],
  "next": {
    "id": "load-skills-2",
    "prompt": "skill-invoke.md",
    "todo": ["skill"],
    "next": {
      "id": "execute",
      "prompt": "parallel-tasks.md",
      "todo": ["task", "task", "task"]
    }
  }
}
```

### Skill Dependencies

Some skills may have prerequisites or work best with other skills:

| Skill | Works Well With | Prerequisites |
|-------|-----------------|---------------|
| delegation | parallel-tasks | None |
| documentation-patterns | quick-doc | None |
| code-review | analyze-deep | None |
| hello-world | intake | None |

## Example DAG Usage

```json
{
  "schema_version": "2.0",
  "id": "multi-feature-delivery",
  "entry": {
    "id": "session-start",
    "prompt": "session-overview.md",
    "todo": [],
    "next": {
      "id": "load-delegation-skill",
      "prompt": "skill-invoke.md",
      "todo": ["skill"],
      "next": {
        "id": "parallel-work",
        "prompt": "parallel-tasks.md",
        "todo": ["task", "task", "task"],
        "next": {
          "id": "verify",
          "prompt": "verification-check.md",
          "todo": ["bash"]
        }
      }
    }
  }
}
```

## Prompt Template

The skill-invoke prompt should specify which skill to load and why:

```markdown
# Skill Invocation

**Goal:** Load delegation skill to enable multi-agent coordination.

## What to do

Load and inject the delegation skill into the session context.

## Skill Details

**Skill Name:** delegation
**Purpose:** Multi-agent coordination and dispatch patterns
**Knowledge Provided:** Agent roles, assignment rules, communication frameworks
**Duration:** ~1 minute
**Dependencies:** None

## Todo

1. `skill` — Load delegation skill:
   - Read delegation skill definition
   - Extract agent role definitions
   - Extract assignment and routing rules
   - Extract communication patterns
   - Inject into session context
   - Confirm availability to downstream agents
```

## Performance Characteristics

| Aspect | Value |
|--------|-------|
| **Execution time** | ~10-30 seconds |
| **Steps used** | 2-3 (minimal overhead) |
| **Knowledge artifact size** | 1-3 KB typical |
| **Injection latency** | Near-instant |
| **Session persistence** | Entire session duration |

## Best Practices

### DO:
- Load delegation skill before multi-agent tasks
- Use skill-invoke early in DAG for maximum downstream benefit
- Load skills that provide value to immediate next steps
- Document which skill is being loaded and why
- Keep skill invocation as first step of complex workflows
- Combine multiple skill invocations if needed

### DON'T:
- Load skills that won't be used by downstream agents
- Load same skill multiple times unnecessarily
- Assume skills persist across separate sessions
- Load skills late in DAG (waste of knowledge window)
- Forget to invoke delegation before complex dispatch
- Create skill-invoke → linear task chains (use parallel-tasks instead)

## Validation Rules

- `todo` array must be exactly `["skill"]`
- Must have a prompt file (required)
- `next` must be a single node (linear) or omitted
- DAG node must only contain: `id`, `prompt`, `todo`, `next`
- Skill being invoked must exist and be registered
- `skill` todo item is ONLY valid in skill-invoke nodes

## Valid Todo Items Reference

### ✅ Valid in skill-invoke
- `skill` — Load reusable skill (ONLY in skill-invoke nodes)

### ✅ Valid in other nodes  
- `task` — Agent dispatch
- `bash` — Command execution
- `question` — User input

### ❌ Never Use
- `observation`, `compress`, `analyze`, `research` — Not valid todo items
- `skill` (in non-skill-invoke nodes) — Use only in skill-invoke

## Error Handling

| Error | Resolution |
|-------|-----------|
| Skill file not found | Verify skill exists in skills directory |
| Skill definition invalid | Check SKILL.md format and structure |
| Knowledge injection fails | Ensure skill has proper metadata section |
| Skill not available downstream | Confirm skill-invoke precedes relevant tasks |
| Context overflow | Compress prior outputs before invoking skill |

## Skill Format Reference

Each skill follows this structure:

```
skills/
├── delegation/
│   ├── SKILL.md                 # Main skill definition
│   ├── agents-table.md          # Agent reference
│   ├── dispatch-patterns.md     # Dispatch strategies
│   └── examples/
│       ├── parallel-example.json
│       └── sequential-example.json
│
├── documentation-patterns/
│   ├── SKILL.md
│   ├── templates/
│   │   ├── api-docs.md
│   │   ├── readme.md
│   │   └── examples.md
│   └── conventions.md
```

## Integration with Other Nodes

### After These Nodes:
- `session-overview` — Start of session
- `intake` — After gathering requirements
- Any prior skill-invoke — For skill chaining

### Before These Nodes:
- `parallel-tasks` — For multi-agent coordination
- `analyze-deep` — For analysis patterns
- `quick-doc` — For documentation generation
- Any task node — To provide reference knowledge

## Typical Workflows

### Workflow 1: Multi-Agent Feature Delivery
```
intake (gather requirements)
  ↓
skill-invoke (delegation)
  ↓
parallel-tasks (code + docs + research)
  ↓
verification-check (validate)
  ↓
output-success
```

### Workflow 2: Documentation-Heavy Refactor
```
intake (understand current state)
  ↓
skill-invoke (documentation-patterns)
  ↓
analyze-deep (plan refactor)
  ↓
parallel-tasks (refactor + document)
  ↓
output-success
```

### Workflow 3: Code Review with Standards
```
intake (current code review request)
  ↓
skill-invoke (code-review)
  ↓
analyze-deep (deep code analysis)
  ↓
output-success (review report)
```

## Troubleshooting

### Skill knowledge not visible in downstream agents
**Check:** Ensure skill-invoke node precedes the agent task immediately.

### Wrong skill loaded
**Check:** Verify skill name in prompt matches available skills.

### Skill injection taking too long
**Check:** Ensure skill file is not excessively large (>5KB).

### Multiple skills needed
**Solution:** Chain multiple skill-invoke nodes, or load all skills first.

## See Also

- **Parallel Tasks Node** — Typical use after skill-invoke
- **Analyze Deep Node** — Deep processing with skill knowledge
- **Decision Gate Node** — Route based on skill recommendations
- **HeadWrench Agent** — The agent performing skill loading
- **Skills Directory** — Location of all available skills
