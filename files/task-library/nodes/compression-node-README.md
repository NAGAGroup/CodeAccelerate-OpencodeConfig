# Compression Node Type

---

## DAG v2.0 Schema Compliance

Compression nodes follow the strict DAG v2.0 schema:

| Field | Value |
|-------|-------|
| `id` | `"compression-node"` or custom ID |
| `prompt` | Bare filename: `"compression-node.md"` |
| `todo` | `["task"]` only — compress is invoked WITHIN the task, not as a todo item |
| `next` | Single node or branch array |

**❌ INVALID:**
- `"todo": ["compress"]` — compress is NOT a todo item
- `"prompt_filename"` — use `"prompt"` in v2.0
- Custom metadata fields in the node definition

See `files/planning/reference/dag-design-guide.md` for complete v2.0 spec.

---

The **compression-node** uses ContextInsurgent's compress tool to distill, condense, and synthesize outputs from prior steps into highly relevant, compressed context. This node takes large amounts of exploration, analysis, or scouting output and extracts key insights while maintaining traceability to original sources. Ideal for reducing token burden on downstream agents.

## Purpose

- Compress multiple scout reports into unified summary
- Distill deep analysis findings into key insights
- Consolidate exploration outputs for decision-making
- Reduce token overhead for downstream processing
- Maintain traceability while achieving 80-90% compression

## Important: Compress is a Tool, Not a Todo Item

**❌ INVALID:** `"todo": ["compress"]`  
**✅ VALID:** `"todo": ["task"]` with compress tool invoked within the task

The **compress tool** is an MCP resource that agents use within their task execution. It is NOT a standalone todo item. Always use `["task"]` in the todo sequence; agents will invoke the compress tool as part of task execution based on the prompt instructions.

## Node Characteristics

| Attribute | Value |
|-----------|-------|
| **ID** | `compression-node` |
| **Category** | Optimization |
| **Todo Sequence** | `["task"]` (single compression task) |
| **Primary Agent** | ContextInsurgent |
| **Agent Step Budget** | 10 |
| **Branching Support** | Linear only |
| **Parallel Execution** | No (single task) |
| **Requires Prompt** | Yes |
| **Key Tool** | compress (MCP tool) |

## When to Use

- **After scout-parallel** to compress 3 scout reports into one summary
- **After analyze-deep** to distill complex findings into executive summary
- **After exploration workflows** to reduce context size
- **Before decision gates** to provide concise input for decisions
- **Before multi-agent dispatch** to optimize token usage
- **Token optimization** to enable larger downstream task budgets

## Compression Examples

### Example 1: Scout Reports Compression

**Input (Scout Report):**
- Scout 1: 5KB architecture findings
- Scout 2: 4KB dependency mapping
- Scout 3: 6KB pattern analysis
- **Total:** 15KB input

**After Compression:**
- Unified architecture summary: 1.5KB
- Key dependencies and boundaries: 0.8KB
- Top 5 patterns identified: 0.7KB
- **Total:** 3KB output
- **Compression Ratio:** 5:1
- **Token Savings:** ~75%

### Example 2: Analysis Findings Compression

**Input (Deep Analysis):**
- 25-page analysis with detailed findings
- Multiple interaction diagrams
- Performance metrics
- Risk assessments
- **Total:** 50KB input

**After Compression:**
- Executive summary: 2KB
- 5 key risks: 1KB
- Top 3 opportunities: 1KB
- Recommendations: 1KB
- **Total:** 5KB output
- **Compression Ratio:** 10:1
- **Token Savings:** ~90%

### Example 3: Exploration Outputs Compression

**Input (Multiple Explorations):**
- Codebase structure findings: 4KB
- Integration points: 3KB
- Setup documentation: 3KB
- Technology stack: 2KB
- **Total:** 12KB input

**After Compression:**
- Architecture overview: 1.2KB
- Critical integration points: 0.8KB
- Setup essentials: 0.7KB
- Tech decisions: 0.3KB
- **Total:** 3KB output
- **Compression Ratio:** 4:1
- **Token Savings:** ~75%

## Structure

```json
{
  "id": "compress-findings",
  "name": "Compression Node",
  "prompt": "compression-node.md",
  "todo": ["task"],
  "next": {
    "id": "decide",
    "prompt": "decision-gate.md",
    "todo": ["question"]
  }
}
```

## Implementation Notes

### Compression Process

1. **ContextInsurgent reads** prior outputs (scout reports, analysis, etc.)
2. **Identifies key insights** using compress tool
3. **Extracts top findings** and removes redundancy
4. **Structures output** for clarity and downstream use
5. **Maintains traceability** references to original sources
6. **Compresses token size** by 80-90%
7. **Produces summary** available for next node

### Compression Strategies

#### Strategy 1: Pattern Merging
```
Input:
- Scout 1: "Uses Express for API"
- Scout 2: "API built on Express"
- Scout 3: "Express framework detected"

Output:
- **Technology**: Express.js for REST API (all scouts confirmed)
```

#### Strategy 2: Deduplication
```
Input:
- Scout 1: "TypeScript used in 80% of codebase"
- Scout 2: "Primarily TypeScript, some JavaScript"
- Scout 3: "TypeScript is main language"

Output:
- **Language**: TypeScript primary (80%+), some JavaScript
```

#### Strategy 3: Prioritization
```
Input: 50+ findings across 3 scouts

Compress to:
1. **Critical** (Top 3 most important)
2. **Important** (Next 5 findings)
3. **Reference** (Full original available if needed)
```

### Compress Tool Integration

The compress tool API:

```typescript
compress({
  input: "Large context or text to compress",
  compression_level: "high",     // low, medium, high
  preserve_structure: true,       // Keep formatting
  include_metadata: true,         // Keep source refs
  extract_insights: true,         // Pull key findings
  max_output_tokens: 3000        // Target size
})
```

## Integration

### Typical Usage Patterns

#### Pattern 1: Scout → Compress → Decide
```json
{
  "id": "explore",
  "prompt": "scout-parallel.md",
  "todo": ["task", "task", "task"],
  "next": {
    "id": "compress",
    "prompt": "compression-node.md",
    "todo": ["task"],
    "next": {
      "id": "decide",
      "prompt": "decision-gate.md",
      "todo": ["question"]
    }
  }
}
```

#### Pattern 2: Analysis → Compress → Execute
```json
{
  "id": "analyze",
  "prompt": "analyze-deep.md",
  "todo": ["task"],
  "next": {
    "id": "compress",
    "prompt": "compression-node.md",
    "todo": ["task"],
    "next": {
      "id": "execute",
      "prompt": "parallel-tasks.md",
      "todo": ["task", "task", "task"]
    }
  }
}
```

#### Pattern 3: Exploration → Compress → Decision → Branch
```json
{
  "id": "scout",
  "prompt": "scout-parallel.md",
  "todo": ["task", "task", "task"],
  "next": {
    "id": "compress",
    "prompt": "compression-node.md",
    "todo": ["task"],
    "next": {
      "id": "decide",
      "prompt": "decision-gate.md",
      "todo": ["question"],
      "next": [
        {
          "when": "Path A",
          "node": { "id": "path-a", "prompt": "path-a.md", "todo": ["task"] }
        },
        {
          "when": "Path B",
          "node": { "id": "path-b", "prompt": "path-b.md", "todo": ["task"] }
        }
      ]
    }
  }
}
```

## Example DAG Usage

```json
{
  "schema_version": "2.0",
  "id": "optimized-exploration",
  "entry": {
    "id": "session-start",
    "prompt": "session-overview.md",
    "todo": [],
    "next": {
      "id": "intake",
      "prompt": "intake.md",
      "todo": ["question"],
      "next": {
        "id": "parallel-scout",
        "prompt": "scout-parallel.md",
        "todo": ["task", "task", "task"],
        "next": {
          "id": "deep-analysis",
          "prompt": "analyze-deep.md",
          "todo": ["task"],
          "next": {
            "id": "compress-findings",
            "prompt": "compression-node.md",
            "todo": ["task"],
            "next": {
              "id": "decision",
              "prompt": "decision-gate.md",
              "todo": ["question"],
              "next": [
                {
                  "when": "Implement feature",
                  "node": {
                    "id": "load-skills",
                    "prompt": "skill-invoke.md",
                    "todo": ["skill"],
                    "next": {
                      "id": "parallel-work",
                      "prompt": "parallel-tasks.md",
                      "todo": ["task", "task", "task"]
                    }
                  }
                },
                {
                  "when": "Need more exploration",
                  "node": {
                    "id": "more-scout",
                    "prompt": "scout-parallel.md",
                    "todo": ["task", "task", "task"]
                  }
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

## Prompt Template

The compression-node prompt should specify what to compress and how:

```markdown
# Compression Node

**Goal:** Compress scout findings and analysis into concise summary.

## What to do

Use the compress tool to distill multiple reports into unified summary.

## Input Sources

- Scout Report 1: Architecture exploration findings
- Scout Report 2: Dependency mapping and boundaries
- Scout Report 3: Pattern and convention analysis
- Analysis Report: Deep synthesis and insights

## Compression Strategy

1. **Merge patterns** — Combine redundant findings
2. **Prioritize insights** — Keep only critical findings
3. **Deduplicate** — Remove repeated information
4. **Structure output** — Organize for clarity
5. **Maintain traceability** — Reference original sources

## Todo

1. `task` — Dispatch @ContextInsurgent to compress findings:
   - Use compress tool on all scout reports
   - Extract top 5-10 key insights
   - Consolidate patterns and technologies
   - Create executive summary
   - Reference original sources
   - Target 3-5KB output from 12+ KB input
   - Make compressed summary available for decision-gate node
```

## Performance Characteristics

| Aspect | Value |
|--------|-------|
| **Input size** | 10-50+ KB typical |
| **Output size** | 1-5 KB typical |
| **Compression ratio** | 5:1 to 10:1 typical |
| **Token savings** | 75-90% typical |
| **Execution time** | 30-60 seconds |
| **Steps used** | 5-8 (of 10 available) |

## Best Practices

### DO:
- Compress after scout-parallel for maximum token savings
- Use compression before decision gates
- Maintain references to original sources
- Target 80%+ compression ratio
- Use high compression level for token optimization
- Keep structured output for downstream clarity
- Document compression strategy in prompt

### DON'T:
- Compress less than 5KB input (not worth it)
- Lose traceability to original findings
- Over-compress and lose important details
- Compress prematurely (need full analysis first)
- Compress at end of DAG (too late to help)
- Use for single small reports (unnecessary)
- Skip compression for token-heavy workflows

## Validation Rules

- `todo` array must be exactly `["task"]`
- Must have a prompt file (required)
- `next` must be a single node (linear)
- DAG node must only contain: `id`, `prompt`, `todo`, `next`
- Input must be substantial (5+ KB) to justify compression
- Compress tool must be available in session MCP context
- No custom metadata in node definition

## Tool Requirements

The compress tool must be available in the session's MCP tools:

```json
{
  "mcp_tools": ["compress", "summarize", "extract-insights"]
}
```

## Error Handling

| Error | Resolution |
|-------|-----------|
| Input too small | Skip compression if <5KB input |
| Compress tool fails | Fallback to manual summary by ContextInsurgent |
| Output still too large | Increase compression_level or reduce scope |
| Traceability lost | Include source references in prompt |
| Key insights missed | Review compression strategy in prompt |

## Output Structure

The compressed output should follow this structure:

```markdown
# Compressed Summary

## Executive Summary
[1-2 sentence overview of findings]

## Key Insights (Top 5-10)
1. [Most important finding with source reference]
2. [Next most important]
...

## Architecture Overview
[Consolidated architecture summary with key components]

## Technology Stack
[Merged tech findings from all scouts]

## Critical Patterns
[Top 3-5 patterns identified]

## Risks & Concerns
[Top 3 risks from analysis]

## Recommendations
[Top 2-3 recommended actions]

## Original Sources
- Scout Report 1 (Architecture): [Reference]
- Scout Report 2 (Dependencies): [Reference]
- Analysis Report: [Reference]
```

## Typical Workflows

### Workflow 1: Explore → Compress → Decide → Implement
```
scout-parallel (3 scouts, 12-step budget)
  ↓ 15KB findings
compress-node (ContextInsurgent, 10-step)
  ↓ 3KB compressed
decision-gate (HeadWrench, 5-step)
  ↓ Decision with full context but 80% fewer tokens
parallel-tasks (3 agents, independent budgets)
```

### Workflow 2: Scout → Analyze → Compress → Verify
```
scout-parallel (parallel exploration)
  ↓
analyze-deep (synthesis)
  ↓
compression-node (token optimization)
  ↓
verification-check (verify compressed findings)
  ↓
output-success
```

### Workflow 3: Multiple Explorations → Compress → Branch
```
scout-parallel (exploration 1)
  ↓
scout-parallel (exploration 2)
  ↓
compression-node (consolidate all)
  ↓
decision-gate (choose path based on compressed summary)
```

## Token Efficiency

### Before Compression
```
Session context: 50KB
Scout findings: 15KB
Analysis: 20KB
Decision input: 25KB
→ Total: 110KB input to decision-gate
→ Token usage: ~150 tokens overhead
```

### After Compression
```
Session context: 50KB
Compressed summary: 3KB
→ Total: 53KB input to decision-gate
→ Token usage: ~70 tokens overhead
→ Savings: ~50% tokens
→ Enables larger budgets for downstream agents
```

## Troubleshooting

### Compression ratio too low
**Check:** Ensure input is truly redundant. May need high compression level.

### Key insight lost
**Review:** Check prompt compression strategy; may need to reduce compression level.

### Traceability broken
**Fix:** Include source references in prompt; use include_metadata flag.

### Output structure not as expected
**Adjust:** Specify exact output format in compress tool parameters.

## Valid vs. Invalid Todo Items

### ✅ Valid Todo Items (Across All Node Types)

| Todo Item | Valid Contexts | Notes |
|-----------|----------------|-------|
| `task` | All action nodes | For agent dispatch (junior-dev, quick-doc, deep-researcher, context-insurgent) |
| `question` | intake, decision-gate, output-failure | For HeadWrench to ask user input |
| `bash` | conditional-branch, verification-check, loop-until-success | For command execution |
| `skill` | skill-invoke node only | For loading procedural knowledge (delegation, documentation-patterns, etc.) |

### ❌ Invalid Todo Items (Never Use)

| Invalid Item | Why | What to Use Instead |
|--------------|-----|-------------------|
| `observation` | Not a valid action | Use `task` to dispatch agents for observation |
| `compress` | Is a TOOL, not a todo item | Use `task` with compress tool invoked in prompt |
| `analyze` | Not a valid action | Use `task` to dispatch context-insurgent for analysis |
| `research` | Not a valid action | Use `task` to dispatch deep-researcher for research |

### Examples

**❌ WRONG:**
```json
{ "id": "node", "todo": ["observation"] }
{ "id": "node", "todo": ["compress"] }
{ "id": "node", "todo": ["skill"] }  // Only valid in skill-invoke
```

**✅ CORRECT:**
```json
{ "id": "node", "todo": ["task"] }  // Dispatch agent to perform observation
{ "id": "compress", "prompt": "compression-node.md", "todo": ["task"] }  // compress is invoked in task
{ "id": "skill-invoke", "prompt": "skill-invoke.md", "todo": ["skill"] }  // Only here
```

## See Also

- **Scout Parallel Node** — Typical precursor
- **Analyze Deep Node** — Alternative or complementary input
- **Decision Gate Node** — Typical successor
- **Context Insurgent Agent** — Agent performing compression
- **Compress Tool** — MCP tool used for compression (invoked within task)
- **Token Optimization** — Primary use case
- **Valid Todo Items Reference** — Comprehensive todo item rules
