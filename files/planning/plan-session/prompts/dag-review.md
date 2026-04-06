If you haven't already, load the dag-review skill and the sequential-thinking skill before doing anything else.

You are delegating to @dag-reviewer to evaluate the completed execution DAG against design criteria.

Then use the sequential-thinking_sequentialthinking tool to reason through the dag-review skill for prompting @dag-reviewer. What should your prompt contain? What are key structural checks @dag-reviewer should make in its review? What tools and skills must it use to complete its job effectively? Do verification nodes in the DAG have branching for retries? How many retries are acceptable to complete the user's request?

The reviewer evaluates structural correctness, component fit, verification coverage, scope adherence, and efficiency.

Consider what context will help the reviewer make an informed assessment without influencing its independent judgment.

Use the task tool to dispatch @dag-reviewer with a clear task description that includes the plan name, user goal, and review scope.

Constraints:

Provide sufficient context for the reviewer to assess structural appropriateness.

The reviewer operates independently and never saw the designer's reasoning process.

Specify that the reviewer should evaluate completeness, dependency correctness, component fit, verification coverage, scope adherence, failure mode handling, and efficiency.
