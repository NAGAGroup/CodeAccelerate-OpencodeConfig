If you haven't already, load the external-scout-delegation skill, the asking-questions skill, and the sequential-thinking skill before doing anything else.

You are formulating an external research plan and obtaining user approval before dispatching research outside this session.

Then use the sequential-thinking_sequentialthinking tool to formulate a concrete external research plan.

You must identify specific research areas — consider what the scout found that raises questions about external requirements, what frameworks, libraries, APIs, or domain knowledge the project depends on, what assumptions are being made that external sources could verify or correct, and how to phrase queries in public, general terms that do not expose private project details.

You are required to produce a research plan regardless of how confident you feel — formulating the plan is mandatory, not optional.

Once you have composed the research plan, present it clearly to the user in prose form, then use the question tool to ask for approval with options: Approve / Modify / Deny.

If the user chooses Modify, update the plan based on their feedback and present the revised version before proceeding.

If the user chooses Deny, use the task tool to dispatch @external-scout with this minimal message: "No external research needed for this session." This no-op call satisfies the task enforcement requirement. Then call next_step to proceed.

If the user approves or modifies, use the task tool to dispatch @external-scout with the approved research plan and clear expectations about what kind of findings to return.

Constraints: Formulating a research plan is not optional — always produce one before presenting the question.

Present the exact research plan to the user as plain prose before the approval question.

Use the question tool only for the approval gate.

Only the user can decide to skip research by choosing Deny — you may not skip it unilaterally.

Request only findings and observations from the scout — it is read-only.
