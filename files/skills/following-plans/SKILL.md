# Following Plans

This skill teaches how to execute DAG step sequences exactly as specified. Load it when entering DAG mode or when the enforcement engine returns errors. It shows how to read enforcement errors, call required tools in sequence, use next_step to advance, and recover from context loss.

## How to Follow the DAG

When the enforcement engine blocks a tool call, read the error — it identifies which tool was expected:

```
[DAG BLOCKED] Expected sequential-thinking_sequentialthinking but you called task
Next expected tool: sequential-thinking_sequentialthinking
```

Call the required tool immediately. When it succeeds, call next_step to determine what comes next:

```
next_step()
```

The next_step response tells you the next required tool or indicates the node is complete. If context is lost between steps, call recover_context immediately:

```
recover_context()
```

This returns your position in the DAG and the remaining steps. Resume at the indicated step and continue in order.

## Rules

Call next_step after completing each required tool call to determine what comes next. When the enforcement engine returns an error, read the message to identify the required tool and call it immediately. Use recover_context when context loss occurs between steps to resume at the correct position. Treat enforcement errors as authoritative — the error message specifies which tool is required.

## Anti-patterns

**Anti-pattern: Skipping ahead without next_step**

What it looks like: You assume you know which tool comes next because you have seen this DAG pattern before (skill → sequential-thinking → task). After completing sequential-thinking_sequentialthinking, you call task immediately without calling next_step to confirm what comes next. The enforcement engine blocks your call: "Expected question but you called task".

Why it fails: DAGs may have conditional branches you did not anticipate. Each DAG is unique and may have different execution paths based on conditional logic and node dependencies. Skipping next_step triggers an enforcement error and wastes steps. Always use next_step to confirm progress.

**Anti-pattern: Retrying a blocked tool**

What it looks like: The enforcement engine returns: "Expected sequential-thinking_sequentialthinking but you called task". You read the error and then call task again, hoping it will work this time.

Why it fails: The error explicitly names the required tool. Retrying the blocked tool will fail again with the same error. Call the tool the error identifies — in this case, sequential-thinking_sequentialthinking.

**Anti-pattern: Predicting enforcement sequences**

What it looks like: You remember a DAG that had [skill, sequential-thinking, task]. You are now in a different DAG with enforcement sequence [skill, sequential-thinking, question, task]. You skip question and go straight to task because you assumed the sequence would be the same.

Why it fails: Each DAG is unique. Enforcement sequences differ based on conditional logic and node dependencies. Assuming sequences without using next_step wastes steps and triggers errors.

## Good and Bad Examples

**Good:** You complete sequential-thinking_sequentialthinking. You call next_step and read the response: "Next expected tool: task". You verify this matches what you want to do and then call task with your dispatch prompt. Later, you reach a different node where next_step returns "Next expected tool: question" — you call question without assuming anything from prior DAG patterns.

**Bad — skips next_step:** You complete sequential-thinking_sequentialthinking and call task immediately without calling next_step. The enforcement engine blocks your call: "Expected question but you called task". You wasted a step and now must backtrack.

**Bad — assumes sequence without confirmation:** You remember that planning nodes have [skill, sequential-thinking, task]. You are now in a different context where the sequence is [skill, sequential-thinking, question, task]. You skip question and call task. The enforcement engine blocks your call and specifies question is required. You wasted a step on the wrong assumption.
