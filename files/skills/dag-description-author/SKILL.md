---
name: dag-description-author
description: Teaches how to dispatch dag-description-author to write per-node context descriptions that guide the executing agent.
---

# What does this skill teach?

In this skill, you learn how to delegate to dag-description-author, a specialist that writes per-node context descriptions for a completed execution DAG. Descriptions ground each work node in the specific planning discoveries — telling the executing agent what to do here, not what the component type does generically.

# What does dag-description-author do?

- Retrieves planning context from Qdrant (user goal, scout findings, scope decisions, user answers) before writing anything
- Loads the DAG structure and component catalogue to understand what each node type already says — so descriptions don't repeat it
- Writes 2–4 sentence descriptions for work nodes only (work-item, project-search-and-analysis, external-scout, deep-research, sequential-thinking)
- Skips structural nodes (verify, decision-gate, write-notes, compress, kickoff-refresher, commit, run-project-commands) unless their purpose is genuinely ambiguous in context
- Stores a brief session note and responds with a summary of what was written

# How to delegate to dag-description-author

Use the `task` tool to delegate using the prompt template below, filling in each section for the current goal:

```prompt
**Plan Name:** <the plan name — required, used to load the DAG and retrieve Qdrant notes>

**User's goal:** <what the execution plan is supposed to accomplish>

**Planning context summary:** <key findings, scope decisions, and user answers from the investigation phase — the author will also query Qdrant directly, but this primes their understanding>

**Instructions:** Write per-node context descriptions for every work node in the DAG. Use `qdrant_qdrant-find` with `collection_name=<plan name>` to retrieve full planning context before starting. Ground every description in the planning discoveries — do not invent requirements.
```

# Thinking through your delegation prompt

<|think|>
- Have I included the plan name so the author can load the correct DAG and Qdrant collection?
- Have I summarised the key planning findings so the author can write grounded descriptions without re-discovering everything?
- Have I made clear the author should query Qdrant before writing — the planning notes are the source of truth for descriptions?
