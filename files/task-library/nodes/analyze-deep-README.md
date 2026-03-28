# Analyze Deep Node Type

---

## DAG v2.0 Schema Compliance

Analyze deep nodes follow the strict DAG v2.0 schema:

| Field | Value |
|-------|-------|
| `id` | Unique identifier (e.g., `"analyze-deep"`) |
| `prompt` | Bare filename: `"analyze-deep.md"` |
| `todo` | `["task"]` only — dispatch for synthesis analysis |
| `next` | Single node (typically compress or decision) |

**v2.0 Node Fields (only these 4 allowed):**
- No `node_id`, `name`, `description` in DAG node definitions
- No `prompt_filename` (use `prompt`)
- No custom metadata

See `files/planning/reference/dag-design-guide.md` for complete v2.0 spec.

---

## Overview

The **analyze-deep** node performs deep multi-file analysis and synthesis using context-insurgent. It transforms raw findings from scouts into cohesive, actionable insights through extended reasoning and careful analysis of complex interactions. Single task with 20-step budget allows thorough synthesis.

## Purpose

- Synthesize parallel scout findings into cohesive analysis
- Perform deep analysis of complex file interactions
- Identify architecture patterns and decomposition opportunities
- Generate insights and recommendations for implementation planning

## Node Characteristics

| Attribute | Value |
|-----------|-------|
| **ID** | `analyze-deep` |
| **Category** | Processing |
| **Todo Sequence** | `["task"]` (single task) |
| **Primary Agent** | @ContextInsurgent |
| **Agent Step Budget** | 20 |
| **Branching Support** | Linear only |
| **Parallel Execution** | No (single task) |
| **Requires Prompt** | Yes |

## When to Use

- **After scout-parallel** to synthesize multiple scout findings
- **Before decomposition** to understand complex interactions
- **For complex analysis** requiring extended reasoning
- **Before decision gates** to provide detailed analysis for user decision

## Context Insurgent Capabilities

Context-insurgent is optimized for:
- Deep reasoning and analysis
- Synthesizing multiple information sources
- Understanding complex interactions and dependencies
- Generating strategic recommendations
- Extended step budget (20) for thorough work

## Structure

```json
{
  "id": "analyze-deep",
  "name": "Analyze Deep",
  "prompt": "analyze-deep.md",
  "todo": ["task"],
  "next": {
    "id": "decision",
    "prompt": "decision-gate.md",
    "todo": ["question"]
  }
}
```

## Implementation Notes

### Task Design

A single focused task for deep analysis:

```
Synthesize scout findings and perform deep analysis:
- Review findings from parallel scouts
- Analyze interactions between components
- Identify patterns and opportunities
- Generate recommendations
- Flag risks and edge cases
```

### Why Single Task?

- **Coherent analysis** — All synthesis in one cohesive effort
- **Extended reasoning** — 20 steps allows for thorough work
- **No task switching** — Agent maintains context throughout
- **Better synthesis** — Single task can connect findings across scouts

### Analysis Depth

With 20-step budget, the node can:
- Deep-read multiple files mentioned by scouts
- Analyze complex interactions and dependencies
- Consider multiple implementation approaches
- Generate detailed recommendations
- Highlight risks and open questions

### Integration

- Typically follows `scout-parallel` node for synthesis
- Usually precedes `decision-gate` for user decision
- Output informs decomposition and implementation planning

### Example DAG Usage

```json
{
  "schema_version": "2.0",
  "id": "analysis-dag",
  "entry": {
    "id": "session-start",
    "prompt": "session-overview.md",
    "todo": [],
    "next": {
      "id": "requirements",
      "prompt": "intake.md",
      "todo": ["question"],
      "next": {
        "id": "explore",
        "prompt": "scout-parallel.md",
        "todo": ["task", "task", "task"],
        "next": {
          "id": "synthesize",
          "prompt": "analyze-deep.md",
          "todo": ["task"],
          "next": {
            "id": "plan",
            "prompt": "decompose.md",
            "todo": ["task"]
          }
        }
      }
    }
  }
}
```

## Prompt Template

The analyze-deep prompt should guide comprehensive synthesis and analysis:

```markdown
# Deep Analysis

**Goal:** Synthesize scout findings and perform deep analysis to generate actionable insights.

## What to do

Conduct deep analysis by:

1. Reviewing all scout findings from parallel exploration
2. Analyzing interactions and dependencies discovered
3. Identifying patterns, risks, and opportunities
4. Generating recommendations for implementation
5. Highlighting open questions and areas needing clarification

## Delegation

**Agent:** @ContextInsurgent
**Step budget:** 20
**Type:** Deep synthesis and analysis

## Todo

1. `task` — Dispatch @ContextInsurgent to perform deep analysis:
   - Synthesize all scout findings into cohesive narrative
   - Analyze complex interactions between components
   - Identify architecture patterns and opportunities
   - Generate step-by-step recommendations
   - Document risks, edge cases, and open questions
   - Suggest approach for implementation
```

## Best Practices

### DO:
- Always follow with synthesis/analysis node
- Use after scout-parallel for synthesis
- Make the task focused and comprehensive
- Leverage the full 20-step budget
- Ask for specific insights and recommendations
- Link linearly to next node (no branching)
- Document analysis clearly for decision makers

### DON'T:
- Add multiple task items (use only single task)
- Use before scout findings (schedule after scouts)
- Skip analysis for quick decisions (this prevents quality planning)
- Create branching from this node (linear only)
- Underutilize the 20-step budget (it's there for reason)

## Validation Rules

- `todo` array must be exactly `["task"]`
- Must have a prompt file (required)
- `next` must be a single node (linear)
- DAG node must only contain: `id`, `prompt`, `todo`, `next`
- No custom metadata in node definition

## Valid Todo Items Reference

### ✅ Valid in analyze-deep
- `task` — Single task for context-insurgent deep analysis

### ✅ Valid in other nodes  
- `bash` — Command execution (conditional-branch, verification-check, etc.)
- `question` — User input (intake, decision-gate, output-failure)
- `skill` — Load reusable knowledge (skill-invoke only)

### ❌ Never Use
- `observation`, `compress`, `analyze`, `research` — Not valid todo items

## Error Handling

| Error | Resolution |
|-------|-----------|
| Multiple todo items | Keep only one task item |
| Missing prompt file | Create analyze-deep.md with analysis prompt |
| Branching structure | Use linear `next` only, no conditions |
| Low step budget | Ensure budget is 20 for thorough analysis |
| Analysis feels shallow | Increase detail in prompt guidance |

## Example in DAG Context

```json
{
  "id": "comprehensive-analysis-dag",
  "entry": {
    "id": "session",
    "prompt": "session-overview.md",
    "todo": [],
    "next": {
      "id": "requirements",
      "prompt": "intake.md",
      "todo": ["question"],
      "next": {
        "id": "scout-a",
        "prompt": "scout-parallel.md",
        "todo": ["task", "task", "task"],
        "next": {
          "id": "deep-analysis",
          "prompt": "analyze-deep.md",
          "todo": ["task"],
          "next": {
            "id": "user-review",
            "prompt": "decision-gate.md",
            "todo": ["question"],
            "next": [
              {
                "when": "Proceed with recommendations",
                "node": {
                  "id": "decompose",
                  "prompt": "decompose.md",
                  "todo": ["task"]
                }
              },
              {
                "when": "Need more analysis",
                "node": {
                  "id": "scout-b",
                  "prompt": "scout-parallel.md",
                  "todo": ["task", "task", "task"],
                  "next": {
                    "id": "reanalyze",
                    "prompt": "analyze-deep.md",
                    "todo": ["task"]
                  }
                }
              }
            ]
          }
        }
      }
    }
  }
}
```

## Performance Characteristics

- **Execution time:** ~20 steps (serial, not parallel)
- **Best for:** Synthesis, deep analysis, recommendations
- **Token efficiency:** Cohesive task maintains full context
- **Reasoning depth:** Extended analysis within single task

## Comparison with Other Nodes

| Node | Agent | Budget | Use Case |
|------|-------|--------|----------|
| `scout-parallel` | context-scout | 12 (3×4) | Quick exploration |
| `analyze-deep` | context-insurgent | 20 | Deep synthesis |
| `compress-synthesis` | context-insurgent | 20 | Token compression before gate |

## See Also

- **Scout Parallel Node** — Typical predecessor
- **Decision Gate Node** — Typical successor
- **Decompose Node** — Typical next step for implementation planning
- **Context Insurgent Agent** — Extended reasoning capability
- **Deep Research Patterns** — More analysis patterns
