# Scout Node Library

Read the node library to understand what building blocks are available for composing DAGs. This is **pure information gathering** — no decomposition happens here. The findings feed into `pre-research-thinking` and then `sequential-thinking`, where HeadWrench will use this knowledge alongside the codebase and research context to design the complete plan.

## Todo

1. `read` — HeadWrench reads `{{SESSION_PATH}}/node-library/CATALOGUE.md` directly using the read tool. HW gets the CATALOGUE content in its own context without delegating to @ContextScout. This ensures the exact node type names and todo arrays are available to HW without summarization loss.

**Rationale:** HeadWrench reading CATALOGUE.md directly is more reliable than delegating — scouts summarize, which destroys the exact node type names and todo arrays needed for plan design. Node READMEs will be read by the write-DAG subagent when it needs them during DAG construction.

The scout's output is the node library context that sequential-thinking will use. There is nothing to decompose yet — just bring the knowledge in.

After reading CATALOGUE.md, call `next_step()` to advance.
