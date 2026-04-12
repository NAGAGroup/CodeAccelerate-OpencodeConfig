---
name: following-plans
description: Teaches how to execute DAG step sequences exactly as specified, handling enforcement errors and context recovery.
---
<rules>
Always load required skills before executing a node's instructions.
Always write down your approach before executing.
Never ask the user questions unless the current node explicitly allows it.
Never do work outside what is instructed at the current node.
Never delegate to a different agent than the one specified.
Always call next_step immediately after completing a node's instructions.
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

<rules>
[Binding constraints that apply throughout this node's execution. Rules take precedence over instructions if there is any conflict. Apply these before and during execution of every instruction.]
</rules>

<instructions>
[Numbered instructions that you must follow to achieve the goal. These will often include calls to required tools, and may include calls to optional tools. You must follow these instructions exactly as specified, in order, and call next_step immediately after completing them. Do not wait for any user input or response unless explicitly allowed in the instructions.]
</instructions>
</instruction prompt format>


<methodology>
1. Read and understand the instruction prompt format below — this is the format of instructions you will receive at every node.
2. Write down what following plans means in the context of this session.
3. Call next_step immediately — do not wait for a response.
</methodology>
