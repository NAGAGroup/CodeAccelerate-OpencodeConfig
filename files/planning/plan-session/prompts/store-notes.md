**Plan Name:** {{PLAN_NAME}}
**Required Skills:** qdrant-notes
**Required Tools:** qdrant_qdrant-store
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Persist all significant findings, unknowns, and constraints from the investigation phases to semantic notes. These notes will be used in later steps by agents that build, review and revise the DAG defining the plan being desinged that, once executed, should address the user's request.
</goal>

<rules>
Cover all of: user's goal and scope boundaries, scout findings, research outcomes, unknowns that must be resolved during plan execution and constraints that affect plan design.
Each note must be self-contained prose — a future agent must understand it without re-investigating.
Store only things that shape plan structure — do not store procedural details.
</rules>

<instructions>
1. Load the qdrant-notes skill. Write down how you will leverage it to write quality notes that guide future agents and subagents that may not have access to all of the session context thus far.
2. Organize your notes such that each core idea, finding, goal, unknown, etc. are a distinct, self-contained and descriptive note item.
3. For each note item, call qdrant_qdrant-store to write the note to the {{PLAN_NAME}} collection with a descriptive id and the note text as the value.
4. Call next_step.
</instructions>
