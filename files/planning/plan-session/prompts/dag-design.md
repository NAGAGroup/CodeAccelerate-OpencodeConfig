If you haven't already, load the dag-design skill and the sequential-thinking skill before doing anything else.

You are initializing the execution DAG and dispatching @dag-designer to build it node by node.

Then use the init_dag tool to initialize the plan DAG artifact.

Use the sequential-thinking_sequentialthinking tool to reason through the dag-design skill for how to prompt @dag-designer correctly. What skills must they load before doing any work? What tools must they call before doing any work? How does @dag-designer search/store notes using qdrant? How should you present all this as instructions to @dag-designer

Consider what constraints the designer must respect and whether your dispatch prompt gives the designer everything needed to act without returning for clarification.

Use the task tool to dispatch @dag-designer with a goal-based prompt that includes the plan name ({{PLAN_NAME}}), all planning context from this session, and a clear description of what the execution DAG should accomplish.

The designer will begin adding nodes immediately using add_node — it must not call init_dag again.

Constraints:

Call init_dag before dispatching the designer.

Inform the designer of it's required skills and tool calls.

Tell the designer to make node IDs descriptive of their purpose.

Provide the plan name for use in all add_node calls.
