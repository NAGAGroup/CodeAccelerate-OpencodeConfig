---
name: dag-designer
description: Teaches how to dispatch dag-designer to build execution DAGs from the component library.
---

# What does this skill teach?

In this skill, you learn how to delegate to dag-designer, a DAG construction specialist that builds execution DAGs from the component library one node at a time.

# What does dag-designer do?

- Reads the component catalogue and design guide before designing
- Plans the full adjacency list before calling any DAG tool
- Creates all nodes at once with `add_nodes_to_dag` and wires all edges per phase in a single `connect_nodes` call
- Validates structure throughout construction and at completion
- Reports the completed DAG name and rationale for key design decisions

# How to delegate to dag-designer

Use the `task` tool to delegate using the prompt template below, filling in each section for the current goal:

```prompt
**Plan Name:** <the plan name — required, used for all add_node calls>

**Goal:** <what the execution plan needs to accomplish — describe in terms of work phases and decision points, not specific files or commands>

**Planning findings:** <summary of what was discovered during planning — the problem, constraints, risks, and relevant context>

**Scope boundaries:** <what is in scope for this plan and what must be excluded>

**DAG objectives:** <the phases of work, where decisions need to happen, what could fail and need a retry path, and what success looks like>
```

# Thinking through your delegation prompt

<|think|>
- Have I included the plan name explicitly — the designer cannot call add_node without it?
- Have I described work phases and decision points rather than specific files, functions, or commands?
- Have I passed all accumulated planning findings so the designer understands the full context?
- Are the scope boundaries clear enough that the designer knows what to include and what to leave out?
- Have I described where branches should be — what are the exclusive paths, what are the decision gates?
- Have I noted what could fail and needs a retry path so the designer can include verify nodes?
