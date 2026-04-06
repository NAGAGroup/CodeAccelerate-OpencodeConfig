If you haven't already, load the external-scout-delegation skill, the asking-questions skill, and the sequential-thinking skill before doing anything else.

You are conducting external research with IP approval required before dispatch.

Use the sequential-thinking_sequentialthinking tool to compose a focused research query.

Consider what external information is most valuable, what scope makes sense, and what boundaries protect proprietary information.

Use the question tool to present the exact research query to the user for approval before the external scout is dispatched.

This gate ensures the user reviews any information that will be shared outside the organization.

If the user approves, use the task tool to dispatch @external-scout with the approved query.

If the user declines, you may still dispatch @external-scout with a prompt instructing it to return immediately without research — this satisfies the enforcement sequence without requiring a branch.

After external-scout returns, use the next_step tool to advance to the next step.

**Constraints:** Collect user approval before sending external queries to ensure information security.

Be specific in your research question.

Remove or redact any proprietary, sensitive, or confidential information before submitting the query.
