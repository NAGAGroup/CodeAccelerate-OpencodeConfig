---
name: dag-reviser
description: Teaches how to dispatch dag-reviser to improve execution DAGs using the full component library and reviewer feedback.
---

# What does this skill teach?

In this skill, you learn how to delegate to dag-reviser, a second-pass DAG improvement specialist that takes a structurally valid first-pass DAG and substantially improves it using the full component catalogue and the reviewer's critique.

# What does dag-reviser do?

- Loads the current DAG structure and the full component catalogue before making changes
- Retrieves session notes including the reviewer's critique via qdrant
- Plans all revisions before executing — writes the target adjacency list, identifies the diff
- Adds specialist nodes (research, deep-research, user-discussion, user-decision-gate, autonomous-work) where the reviewer recommended them
- Adjusts retry counts, adds routing patterns, and restructures as needed
- Validates the final DAG after all changes

# How to delegate to dag-reviser

Use the `task` tool to delegate using the prompt template below, filling in each section for the current goal:

```prompt
**Plan Name:** <the plan name — required, the DAG already exists under this name>

**User's goal:** <what the plan is supposed to accomplish>

**Reviewer's critique:** <the reviewer's full structured critique — include verbatim or closely paraphrased>

**Orchestrator's assessment:** <the tentative answers from the hw-assessment step — what the orchestrator thinks about external research needs, complexity, retry counts, user interaction points>

**Revision scope:** This is a second-pass improvement. The DAG is already structurally valid. Your job is to substantially improve it based on the reviewer's critique — add specialist nodes, adjust retry counts, improve routing patterns, and address every critique point. Use the full catalogue (no variant restriction). Use `qdrant_qdrant-find` with `collection_name=<plan name>` to access session notes including the reviewer's detailed findings.
```

# Thinking through your delegation prompt

<|think|>
- Have I included the reviewer's critique verbatim or closely paraphrased — the reviser needs the exact issues?
- Have I included the orchestrator's tentative assessment to provide additional context?
- Have I made clear this is a second-pass improvement, not a from-scratch build?
- Does the reviser know to use the full catalogue?
- Have I included the plan name so the reviser can load the existing DAG?
