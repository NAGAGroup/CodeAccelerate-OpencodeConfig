If you haven't already, load the sequential-thinking skill before doing anything else.

You are evaluating accumulated evidence to choose which branch to take.

Use the qdrant_qdrant-find tool to retrieve findings and decisions from earlier in the session using {{PLAN_NAME}} as the collection_name.

Consider what prior nodes discovered, what constraints were documented, and what prior reasoning is relevant.

Use the sequential-thinking_sequentialthinking tool to evaluate the evidence and choose which branch is correct.

Consider what the available branches represent, what evidence supports each choice, and which path best aligns with the evidence and constraints.

After you have reasoned through the choice, use the next_step tool with the next parameter set to the ID of the chosen child node.

**Constraints:** Base your choice on evidence from prior nodes documented in planning notes, with priority given to evidence over assumptions.

The DAG structure defines the available branches.

Retrieve planning notes about the branch conditions if they were stored during planning.
