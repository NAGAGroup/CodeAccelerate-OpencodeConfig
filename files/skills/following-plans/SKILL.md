---
name: following-plans
description: Teaches how to execute DAG step sequences exactly as specified, handling enforcement errors and context recovery.
---
<rules>
Always explain to the user how you will execute each node's instructions before executing them, so they understand how you are following the plan.
Always load the required skills specified in each prompt before executing the instructions.
Only delegate to the agent name specified, if the step requires delegation.
Never ask the user questions or discuss plans with them unless the current instructions say otherwise.
Never do work outside of what is instructed at each step, the DAG will guide you through each step in the correct order — doing work early or out of order will cause enforcement errors that block progress.
Always call next_step immediately after completing all instructions for a node, do not summarize, reflect, or wait after completing a node's goal.
</rules>

<instruction prompt format>
**Plan Name:** [plan name filled out automatically by the DAG system]
**Required Skills:** [list of required skills, you must load them]
**Required Tools:** [list of required tools you must call in order before you can call next_step]
**Optional Tools:** [list of optional tools that can called at any point in this node]
**Questions Allowed?:** [yes/no, if no, you cannot ask the user any questions or wait for any user input, you must execute the instructions and call next_step immediately]

<goal>
[A clear, concise statement of what the outcome of this step should be. This is what you should focus on achieving in this step, using the required skills and tools. The instructions provided will guide you on how to achieve this goal, but the goal itself is the key focus.]
</goal>

<instructions>
[Numbered instructions that you must follow to achieve the goal. These will often include calls to required tools, and may include calls to optional tools. You must follow these instructions exactly as specified, in order, and call next_step immediately after completing them. Do not wait for any user input or response unless explicitly allowed in the instructions.]
</instructions>

<check>
[Checklist to verify that you have completed the instructions and achieved the goal. This is a self-check to ensure you have done everything required before calling next_step. You must go through this checklist and confirm that each item is complete before proceeding.]
</check>
</instruction prompt format>


<getting started>
1. Understand the instruction prompt format, this will be the format of instructions provided to you for executing each step in a DAG.
2. Explain to the user what it means to follow plans
3. Call next_step immediately after your explanation and any additional instructions provided, do not wait for a response.
</getting started>
