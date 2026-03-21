# Collaborative Planning: Design Plan (DAG Structure)

**Phase:** FINALIZE  
**Purpose:** Draft plan.json structure—DAG shape, nodes, branching, and execution logic  
**Duration:** 5-8 minutes  
**Domain:** Collaborative design exploration

---

## Task

Design the execution DAG: structure the design implementation into logical nodes, specify branching (alternative approaches), and task dependencies.

## Planning Decisions

Before drafting plan.json, decide:

1. **DAG Shape**
   - Linear: Design → Implement → Test → Deploy
   - Branching: Design → [Implement-Frontend / Implement-Backend] → Integrate → Test
   - Looping: Design → Implement → Test → {feedback gate} → [Refine / Approve]

2. **Core Execution Nodes**
   - Sketch scope for each major step
   - Identify gates where decisions fork (e.g., "Code review approval")
   - Identify loops where refinement happens (e.g., "Test failed → refine → re-test")

3. **Node Prompts**
   - What instructions does each task node need?
   - Which nodes need sequential-thinking or @ContextInsurgent? (Improvement B2, B3)
   - Where do we need web research? (Improvement B4)

## Plan Structure

Create plan.json structure with:

```json
{
  "id": "plan-collaborative",
  "entry": "first-node-id",
  "nodes": {
    "node-id": {
      "id": "node-id",
      "type": "agent" OR "gate",
      "prompt": "planning/plan-collaborative/prompts/[node-id].md",
      "next": "next-node-id" OR { "branch1": {}, "branch2": {} }
    }
  }
}
```

## Branching vs. Looping

**Branching:** Choose ONE path from multiple options  
- Example: Approve design → Choose implementation: [Frontend first / Backend first]
- Use object for `next` with multiple branch options

**Looping:** Return to earlier node for refinement  
- Example: Test fails → Refine → Re-test (up to 3 times)
- Use gate with `remaining_visits` tracking

## Sequential-Thinking & Routing Markers

For complex nodes, note:
- Which nodes need sequential-thinking for reasoning (Improvement B2)
- Which nodes should be routed to @ContextInsurgent for deep reasoning (Improvement B3)
- Which nodes should use web research tools (Improvement B4)

## Output

```
## Design Plan (DAG Structure)

### DAG Shape
[Linear / Branching / Looping / Mixed: describe why]

### Core Execution Nodes
- [Node 1]: [Purpose]
- [Node 2]: ...

### Gates & Branching Points
- Gate: [Decision]; branches into [Path A / Path B]

### Refinement Loops
- Loop 1: [Node] → refine → [Test gate] (max 3 iterations)

### Sequential-Thinking Markers
- Node [id]: Needs sequential-thinking for [decision point]

### Web Research Needs
- Node [id]: Use exa_web_search for [pattern/library research]

### plan.json Structure
[ASCII tree showing node flow, gates, branches, loops]

Example:
```
entry → design-phase → code-review-gate
                          ↓ approve
                      implement-phase → test-phase → quality-gate
                                                       ↓ pass → deploy
                                                       ↓ fail → refine (loop)
```
```

---

**See also:**
- `planning-audit-spec.md` Improvement 4 (Finalize split)
- `planning-audit-spec.md` Section B2 (Sequential-thinking markers)
