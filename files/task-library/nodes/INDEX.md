# Task Library Node Types - Complete Index

**Version:** 2.0  
**Total Node Types:** 13  
**Status:** ✅ Complete - All 3 batches deployed  
**Last Updated:** 2026-03-27

## Overview

The CodeAccelerate task library provides 13 core node types organized into 3 batches, supporting diverse workflow patterns from exploration and analysis to execution, verification, and optimization.

## Node Type Directory

### Batch 1: Foundation & Terminals (4 types)

| Node Type | Category | Purpose | Agent | Budget |
|-----------|----------|---------|-------|--------|
| **[intake](intake-README.md)** | Intake | Gather user requirements via questions | HeadWrench | 5 |
| **[session-overview](session-overview-README.md)** | Utility | Initialize session and context | HeadWrench | 5 |
| **[output-success](output-success-README.md)** | Terminal | Summarize successful completion | HeadWrench | 5 |
| **[output-failure](output-failure-README.md)** | Terminal | Report failures with context | HeadWrench | 5 |

### Batch 2: Exploration, Analysis, Flow Control (5 types)

| Node Type | Category | Purpose | Agent | Budget |
|-----------|----------|---------|-------|--------|
| **[scout-parallel](scout-parallel-README.md)** | Exploration | 3 parallel scouts, shared budget | ContextScout | 12 (shared) |
| **[analyze-deep](analyze-deep-README.md)** | Processing | Deep synthesis and analysis | ContextInsurgent | 20 |
| **[loop-until-success](loop-until-success-README.md)** | Control | Retry tasks until completion | HeadWrench | 5 |
| **[conditional-branch](conditional-branch-README.md)** | Control | Route based on bash exit codes | HeadWrench | 5 |
| **[decision-gate](decision-gate-README.md)** | Control | Strategic decision point | HeadWrench | 5 |

### Batch 3: Execution, Verification, Optimization (4 types)

| Node Type | Category | Purpose | Agent | Budget |
|-----------|----------|---------|-------|--------|
| **[parallel-tasks](parallel-tasks-README.md)** | Execution | 1-3 agents in parallel | HeadWrench + agents | Independent |
| **[skill-invoke](skill-invoke-README.md)** | Execution | Load and inject reusable skills | HeadWrench | 5 |
| **[verification-check](verification-check-README.md)** | Validation | Test/build/lint with branching | HeadWrench | 5 |
| **[compression-node](compression-node-README.md)** | Optimization | Compress outputs 80-90% | ContextInsurgent | 10 |

## Quick Reference Matrix

### By Category

**Intake & Terminal (4)**
- intake
- session-overview
- output-success
- output-failure

**Exploration & Processing (2)**
- scout-parallel
- analyze-deep

**Control Flow (3)**
- loop-until-success
- conditional-branch
- decision-gate

**Execution (3)**
- parallel-tasks
- skill-invoke
- loop-until-success

**Validation (1)**
- verification-check

**Optimization (1)**
- compression-node

### By Agent Tier

**HeadWrench (Sonnet - Orchestrator)**
- intake, session-overview
- output-success, output-failure
- loop-until-success, conditional-branch
- decision-gate, skill-invoke
- parallel-tasks (coordination)
- verification-check

**ContextScout (Haiku - Explorer)**
- scout-parallel

**ContextInsurgent (Sonnet - Analyst)**
- analyze-deep
- compression-node

**Haiku Multi-Agent (Parallel)**
- parallel-tasks (@JuniorDev, @QuickDoc, @DeepResearcher)

### By Branching Support

**Linear Only (10)**
- intake, session-overview
- output-success, output-failure
- scout-parallel, analyze-deep
- skill-invoke, loop-until-success
- compression-node
- parallel-tasks

**Branching (3)**
- conditional-branch
- decision-gate
- verification-check

### By Budget Model

**Fixed Budget**
- HeadWrench nodes: 5 steps each
- ContextInsurgent: 10-20 steps
- ContextScout: 12 steps (shared across tasks)

**Independent Budgets (parallel-tasks)**
- JuniorDev: 10 steps
- QuickDoc: 8 steps
- DeepResearcher: 15 steps

## Common Workflow Patterns

### Pattern 1: Simple Intake → Execute → Verify
```json
intake → parallel-tasks → verification-check → output-success
```
- **Use Case:** Quick feature delivery
- **Time:** ~1-2 minutes

### Pattern 2: Explore → Analyze → Compress → Decide
```json
intake → scout-parallel → analyze-deep → compression-node → decision-gate
                            ↓
                     [choose path]
```
- **Use Case:** Complex feature planning
- **Time:** ~2-3 minutes
- **Token Saving:** 80%+ via compression

### Pattern 3: Multi-Feature with Skills
```json
intake → skill-invoke(delegation) → parallel-tasks → verification-check
         ↓
    [3 agents in parallel]
                                      ↓
                                 [pass/fail branch]
```
- **Use Case:** Feature + docs + research delivery
- **Time:** ~15 seconds (parallel wall-clock)

### Pattern 4: Explore → Skill → Execute → Verify → Retry
```json
intake → scout-parallel → skill-invoke → parallel-tasks → verification-check
                                                               ↓
                                                          [pass/fail]
                                                               ├→ success
                                                               └→ loop-until-success
```
- **Use Case:** Full exploration + implementation + quality gates
- **Time:** ~3-4 minutes

### Pattern 5: Quality Gate with Multiple Checks
```json
parallel-tasks → verification-check
                 ├→ (exit 0) → compression-node → output-success
                 ├→ (exit 1) → loop-until-success → verify again
                 └→ (exit 2) → output-failure
```
- **Use Case:** Multi-stage validation
- **Time:** Varies on retries

## Node Type Capabilities

### Data Flow Capabilities

| Node | Input | Output | Transforms | Branches |
|------|-------|--------|-----------|----------|
| intake | User Q&A | Requirements | None | No |
| scout-parallel | Context | 3 scout reports | Exploration | No |
| analyze-deep | Scout output | Analysis | Synthesis | No |
| parallel-tasks | Task spec | 3 work outputs | Implementation | No |
| skill-invoke | Skill name | Injected knowledge | None | No |
| verification-check | Code/tests | Exit code | Validation | Yes |
| compression-node | Large context | Compressed summary | Compression | No |
| decision-gate | Current state | Decision | None | Yes |
| conditional-branch | Bash result | Exit code | Routing | Yes |
| loop-until-success | Task spec | Success result | Retry | No |

### Parallelization Capabilities

| Node | Parallelizable | Details |
|------|--------|---------|
| scout-parallel | ✅ 3x parallel | Single agent, shared 12-step budget |
| parallel-tasks | ✅ 1-3x parallel | Multiple agents, independent budgets |
| All others | ❌ Sequential | Linear execution |

### Budget Characteristics

| Node | Budget | Type | Notes |
|------|--------|------|-------|
| intake | 5 | Fixed | Simple Q&A |
| session-overview | 5 | Fixed | Initialization |
| output-success | 5 | Fixed | Summarization |
| output-failure | 5 | Fixed | Error reporting |
| scout-parallel | 12 | Shared | Distributed across 3 tasks |
| analyze-deep | 20 | Fixed | Extended reasoning |
| parallel-tasks | Varied | Independent | 10+8+15 = 33 total, ~15 wall-clock |
| skill-invoke | 5 | Fixed | Minimal overhead |
| verification-check | 5 | Fixed | Direct bash execution |
| compression-node | 10 | Fixed | Synthesis and compression |
| decision-gate | 5 | Fixed | Decision logic |
| conditional-branch | 5 | Fixed | Routing logic |
| loop-until-success | 5 | Fixed | Retry orchestration |

## Best Practices

### DO:
- ✅ Start with `intake` to gather requirements
- ✅ Use `scout-parallel` before major decisions
- ✅ Apply `skill-invoke(delegation)` before multi-agent work
- ✅ Use `verification-check` after implementation
- ✅ Use `compression-node` to optimize token usage
- ✅ Chain multiple nodes for complex workflows
- ✅ Use `decision-gate` for strategic branching
- ✅ Use `loop-until-success` for retry scenarios

### DON'T:
- ❌ Skip verification before deployment
- ❌ Use parallelization for dependent tasks
- ❌ Ignore compression in token-heavy workflows
- ❌ Create infinite loops in retry nodes
- ❌ Over-branch decision gates (keep 2-4 paths)
- ❌ Load skills that won't be used
- ❌ Use linear nodes when branching is needed

## Performance Targets

| Workflow | Typical Time | Agents Used | Total Budget | Token Usage |
|----------|--------------|-------------|--------------|-------------|
| Intake → Success | 30 seconds | 1 | 10 | 15KB |
| Simple Execute | 1-2 min | 1-3 | 5-40 | 30KB |
| Explore → Decide | 2-3 min | 1-2 | 25-40 | 50KB → 10KB (compressed) |
| Full Pipeline | 3-5 min | 3-4 | 50-70 | 80KB → 20KB (compressed) |

## Extending the Library

To add new node types:

1. **Follow Schema 2.0** — Use consistent structure
2. **Add to appropriate batch** — Or create new batch
3. **Document thoroughly** — JSON definition + README
4. **Validate against rules** — All validation rules must pass
5. **Update this index** — Keep registry current
6. **Test integration** — Verify DAG compatibility

## Schema Reference

Every node type file includes:
- `id` — Unique identifier (kebab-case)
- `name` — Display name
- `description` — Purpose and use
- `category` — Node category
- `schema_version` — "2.0"
- `todo_sequence` — Array of todo item types
- `primary_agent` — Agent that executes
- `agent_step_budget` — Step budget for agent
- `branching_support` — "linear" or "branch"
- `prompt_reference` — Prompt file reference
- `use_cases` — Array of use cases
- `validation_rules` — Rules for node validation
- `metadata` — Version, tags, creation date
- `example_todo_section` — Template todo section
- `performance_notes` — Timing and characteristics

## Documentation Files

Each node type has a comprehensive README documenting:
- Overview and purpose
- Node characteristics table
- When to use guidance
- Execution model (if applicable)
- Integration patterns
- Prompt templates
- Best practices (DO/DON'T)
- Validation rules
- Error handling
- Troubleshooting guide
- Examples and typical workflows
- Cross-references to related nodes

## Navigation

### By Use Case

**Gathering Requirements**
- Start: [intake](intake-README.md)

**Exploration & Discovery**
- Fast exploration: [scout-parallel](scout-parallel-README.md)
- Deep analysis: [analyze-deep](analyze-deep-README.md)
- Compression: [compression-node](compression-node-README.md)

**Implementation & Execution**
- Multi-agent execution: [parallel-tasks](parallel-tasks-README.md)
- Knowledge injection: [skill-invoke](skill-invoke-README.md)

**Quality & Verification**
- Test/build verification: [verification-check](verification-check-README.md)
- Decision routing: [decision-gate](decision-gate-README.md)

**Control Flow**
- Retry logic: [loop-until-success](loop-until-success-README.md)
- Conditional routing: [conditional-branch](conditional-branch-README.md)

**Reporting**
- Success output: [output-success](output-success-README.md)
- Failure handling: [output-failure](output-failure-README.md)

## Troubleshooting Guide

### "Node type not found"
- Verify node ID matches documentation
- Check file exists in `.opencode/task-library/nodes/`
- Ensure JSON is valid (use validator)

### "Branching configuration invalid"
- Review [verification-check](verification-check-README.md) for branching examples
- Ensure minimum 2 branches with `when` conditions
- Verify all branches have destination nodes

### "Budget exceeded"
- Check node's `agent_step_budget` field
- Review [BATCH3-COMPLETION.md](BATCH3-COMPLETION.md) for budget distribution
- Consider compression-node for token optimization

### "Agents not responding"
- Verify `primary_agent` field matches deployed agent
- Check agent is available in session configuration
- Review agent capabilities and tier level

### "Too many sequential steps"
- Use parallelization: [scout-parallel](scout-parallel-README.md) or [parallel-tasks](parallel-tasks-README.md)
- Consider compression: [compression-node](compression-node-README.md)
- Review workflow for optimization opportunities

## Version History

- **v2.0** — Current (All 13 node types, complete schema)
- **v1.0** — Initial release (Foundation nodes)

## Support & Reference

- **Main Documentation:** See individual README files
- **JSON Schemas:** See `.json` definition files
- **Examples:** See README "Example DAG Usage" sections
- **Integration:** See "Integration with Other Nodes" sections
- **Best Practices:** See README "Best Practices" sections

---

**Total Node Types:** 13  
**Documentation Files:** 14 (13 README + 1 index)  
**Total Lines:** ~3,000+  
**Status:** ✅ Production Ready  
**Last Updated:** 2026-03-27
