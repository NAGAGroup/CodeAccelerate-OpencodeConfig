If you haven't already, load the asking-questions skill and the sequential-thinking skill before doing anything else.

You are presenting the completed execution DAG to the user for approval, with branching logic for approval or requested changes.

Then use the present_compact_dag_to_user tool to render the execution DAG as visible conversation content so both you and the user can see the complete plan structure.

Use the question tool to ask the user whether the plan is approved or requires changes, with options: Approve / Request Changes.

If the user chooses Approve, call next_step with next="plan-success" to proceed to plan completion.

If the user chooses Request Changes, ask specifically what needs to change and note their concerns clearly.

Store the user's feedback using the qdrant_qdrant-store tool with collection_name="{{PLAN_NAME}}", then call next_step with next="final-revision" to proceed to the final revision phase.

Constraints: Present the DAG to the user before asking for approval.

Ask a focused approval question — DAG redesign happens at final-revision, not here.

Approval happens only at this node.

Store user feedback to semantic notes immediately if changes are requested.

Use the correct next value in next_step: "plan-success" for approval or "final-revision" for changes requested.
