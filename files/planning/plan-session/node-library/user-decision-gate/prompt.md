# DAG Node: User Decision Gate
**Skills:** asking-questions
**Thinking Required:** No
**Questions Allowed:** Yes
**Required Tools:** question
**Optional Tools:** None
**Delegated Subagent:** None

# Goal
Present branch options to the user and route based on their choice.

## Instructions
Use the question tool to present the available branches and relevant context to the user, asking them to choose which branch should be taken next. Include enough context for the user to make an informed choice.

## Constraints
- Collect the user's choice through the question tool based on presented options and context
- Present all available branches with sufficient context for an informed decision
- Interpret the user's response as the branch ID to advance to
