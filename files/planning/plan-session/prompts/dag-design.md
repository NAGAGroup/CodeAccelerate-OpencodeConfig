If you haven't already, load the dag-design skill and the sequential-thinking skill before doing anything else.

You are initializing the execution DAG and dispatching @dag-designer to build it node by node.

Then use the init_dag tool to create the plan.jsonl file with the root execution-kickoff node — this must happen before the designer begins adding nodes.

Use the sequential-thinking_sequentialthinking tool to consider what context the designer needs to produce an appropriate DAG: the full user goal and scope boundaries, all scout findings and research outcomes, user decisions and constraints, what execution phases are likely needed, and what components are likely appropriate for this type of work.

Consider what constraints the designer must respect and whether your dispatch prompt gives the designer everything needed to act without returning for clarification.

Use the task tool to dispatch @dag-designer with a goal-based prompt that includes the plan name ({{PLAN_NAME}}), all planning context from this session, and a clear description of what the execution DAG should accomplish.

The designer will begin adding nodes immediately using add_node — it must not call init_dag again.

Constraints: Call init_dag before dispatching the designer.

Provide complete planning context to the designer.

Specify that the designer must not call init_dag or create custom prompts — static templates are copied automatically.

Tell the designer to make node IDs descriptive of their purpose.

Provide the plan name for use in all add_node calls.
