If you haven't already, load the dag-design skill and the sequential-thinking skill before doing anything else.

You are retrieving the user's feedback and dispatching @dag-designer one final time to incorporate all requested changes.

Then use the qdrant_qdrant-find tool to retrieve the user's feedback and specific change requests stored at the user-review node by passing a query about user feedback from review and setting collection_name to {{PLAN_NAME}}.

Use the sequential-thinking_sequentialthinking tool to reason through what the user requested: what changes they specifically asked for, what concerns they raised, how to communicate each change clearly to the designer, and whether you have complete context of the user's feedback.

Use the task tool to dispatch @dag-designer with the user's specific feedback, the current plan.jsonl path, and clear instructions that this is a final revision round — all user feedback is accepted and implemented, and there will be no further review cycle after this.

Constraints: Retrieve user feedback before reasoning through the revision strategy.

Include all user-requested changes in the dispatch prompt.

Tell the designer this is the final revision round with no further review.

The result after this phase is accepted unconditionally.

Provide complete context so the designer can incorporate all feedback accurately.
