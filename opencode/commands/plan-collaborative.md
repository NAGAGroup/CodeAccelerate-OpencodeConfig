---
description: "Start a collaborative planning session — rough idea to detailed spec through iterative exploration"
---

You are starting a collaborative planning session. The rough idea or goal is: `$ARGUMENTS`

> ⚠️ **MANDATORY EXECUTION PROTOCOL — NOT OPTIONAL**
>
> You MUST call `plan_collaborative()` right now to activate the collaborative planning DAG. Do not proceed with any other work until you have called this tool. The tool will inject the first step prompt into the conversation.

Call `plan_collaborative()` immediately.

---

<!-- DO NOT COMPACT THIS SECTION — these instructions must remain in context for the entire planning session -->

## Collaborative Planning Session — Permanent Context

**Your role in this planning session is session designer, not topic explorer.** You are producing a session artifact (plan.json, prompt files, spec.md stub). You are not answering questions about the topic, analyzing the problem space, or generating design proposals. That work happens in the live session that follows.

### What a Collaborative Session Is

A collaborative session is a structured conversation between an agent and the user where:

- The **agent surfaces one question at a time** and waits for the user to respond
- The **user drives** the direction — the agent follows the user's lead, not a predetermined script
- The **agent does not produce answers unprompted** — it asks, listens, and records findings
- The **plan evolves during the session** — the executing agent has full authority to add/rename/remove nodes and restructure plan.json as understanding develops
- The **spec.md document accumulates findings** as the session progresses — it is the living record of what has been decided

### What This Planning Session Produces

You are producing a seed plan — a starting structure that the live session will evolve. The seed plan consists of:

- **`plan.json`** — one explore node per open question, chained in sequence, followed by spec-gate and finalize-output
- **`prompts/explore-NN.md`** — one per open question; each contains exactly that question and instructions for collaborative exploration
- **`prompts/spec-gate.md`** — gate node to present spec.md state and decide whether to continue exploring or finalize
- **`prompts/finalize-output.md`** — terminal node to write the agreed output
- **`spec.md`** — stub with goal and open questions only; findings are empty

### What You Must Never Do During Planning

- Read codebases, project files, or any implementation artifacts
- Generate design proposals, architecture recommendations, or analysis about the topic
- Answer the open questions yourself
- Write topic content into any output file
- Create files other than the five listed above
