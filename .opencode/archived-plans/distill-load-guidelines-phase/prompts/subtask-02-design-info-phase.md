<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 02: Design Informational Phase Architecture

## Objective

Design the new informational/educational phase that will be inserted before the user gate across all 5 planning DAGs. This includes defining each informational node's purpose, prompt content, and how it adapts per DAG type.

## Scope

Based on the user's rough outline, design the following informational nodes:

### Proposed Informational Nodes (before user gate)

1. **info-prime** — A priming task that instructs the planning agent: "The following tasks will teach you how to design a proper plan spec. Pay attention — you will need this knowledge." (Priming framing, not a task to complete)

2. **info-loop-analysis** — Identify loop patterns in the session plan; summarize what loops exist and their purpose

3. **info-visit-counter** — Identify which loops should have `remaining_visits` counters; propose counts (default 3)

4. **info-gate-analysis** — Identify areas that should have user gates; ask the user if they want them; provide a "fully auto" option where appropriate (NOT for collab/collaborative flows)

5. **info-flow-specific** — Any information specific to the flow type (debug has different info than generic, etc.) — presented as bite-size tasks

6. **info-schema-ref** — Plan.json schema reference — reminder of required fields, valid types, etc.

7. **info-validity-checks** — DAG validity checklist:
   - Loops must have exit branches
   - Can have multiple ending nodes
   - Must have at least one valid path to an ending node at all times
   - Invariant 1 & 2 enforcement

8. **info-summarize-consumption** — Instruct the agent to summarize key decisions made in the informational phase, creating explicit indication it has consumed all of the above

## Design Questions to Answer

1. Should these be linear nodes or a loop where users can skip sections?
2. Should they share prompts across DAGs with variable content, or be DAG-specific?
3. Should each informational node have a terminal "skip" branch or be linear?

## Constraints

- Do not write any files — produce a design document in your response
- Design must be adaptable across all 5 DAG types
- Each node should have a clear, single cognitive purpose

## Delegation

**Agent:** HW (direct)
**Reason:** Complex architectural design decisions requiring understanding of all 5 DAGs and their unique characteristics

## Advance

Call `next_step()` when the design document is complete.
