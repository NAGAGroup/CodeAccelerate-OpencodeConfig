---
name: planning-patterns
description: Compact topology examples for composing phase plans — branching, convergence, early exit, and research distribution.
---
These patterns show plan topologies using adjacency notation. Phase IDs, types, and options are abstract. Use them as structural references, not templates to fill in.

```
// Linear: research → work → notes
{1, project-survey} -> [2]
{2, external-research} -> [3]
{3, work} -> [4]
{4, write-notes}


// Branching decision with convergence
{1, external-research} -> [2]
{2, agentic-decision-gate} -> [3a, 3b]
{3a, work} -> [4]
{3b, work} -> [4]     // both branches converge at 4
{4, project-commands} -> [5]
{5, write-notes}


// Three-way routing: two paths merge, one early-exits
{1, external-research} -> [2]
{2, agentic-decision-gate} -> [3a, 3b, 3c]
{3a, work} -> [4]     // complex path
{3b, work} -> [4]     // simpler path, converges with 3a
{3c, early-exit}      // decision determined this direction isn't viable
{4, write-notes}


// User-gated decision
{1, internal-research} -> [2]
{2, user-discussion} -> [3a, 3b]
{3a, work} -> [4]
{3b, early-exit}      // user chose to stop
{4, write-notes}


// Research distributed throughout (not only at start)
{1, project-survey} -> [2]
{2, external-research} -> [3]
{3, work} -> [4]
{4, internal-research} -> [5]   // mid-plan research after first implementation
{5, external-research} -> [6]   // new external dependency surfaced
{6, work} -> [7]
{7, write-notes}


// Complexity routing: short vs long path, no convergence
{1, external-research} -> [2]
{2, internal-research} -> [3]
{3, agentic-decision-gate} -> [4a, 4b]
{4a, work} -> [5a]              // simple case
{4b, work} -> [5b]              // complex case
{5b, work} -> [6b]              // extra phase only on complex path
{5a, write-notes}               // leaf — simple path done
{6b, write-notes}               // leaf — complex path done
```
