If you haven't already, load the sequential-thinking skill before doing anything else.

You are re-establishing all planning context from the investigation phases before beginning DAG design.

Use the qdrant_qdrant-find tool to retrieve stored findings.

You may run multiple queries if needed, passing a query parameter with your search terms and setting collection_name to {{PLAN_NAME}}.

Then use the sequential-thinking_sequentialthinking tool to reason through what context is essential for DAG design: what the user's goal and scope boundaries are, what scout findings must shape the execution plan, what user decisions and constraints matter, and what questions remain unanswered.

Consider what queries will retrieve the most relevant findings from semantic storage.

Run separate queries for different aspects: goal and scope, scout findings, user decisions, constraints.

Once you have retrieved the findings, use the sequential-thinking_sequentialthinking tool again to synthesize what you retrieved into a coherent understanding: what the full picture is, what constraints shape the design, what unknowns remain, and whether you are ready to proceed to DAG design with complete context.

Constraints: Run as many queries as needed to build complete context.

Synthesize retrieved findings into a coherent understanding before proceeding.

This step is context retrieval and synthesis only — DAG design begins in the next node.
