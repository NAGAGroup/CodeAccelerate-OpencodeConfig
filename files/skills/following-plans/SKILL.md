---
name: following-plans
description: Teaches how to execute DAG step sequences exactly as specified, handling enforcement errors and context recovery.
---

# Following Plans

Execute DAG step sequences exactly as specified. Load this skill when entering DAG mode or when the enforcement engine returns errors.

## How to Follow the DAG

When the enforcement engine blocks a tool call, read the error — it identifies which tool was expected. Call that tool immediately. After success, call next_step with no parameters to determine what comes next. If context is lost, call recover_context with no parameters to return your position in the DAG and remaining steps. Resume at the indicated step and continue in order.

## Rules

- Call next_step after completing each required tool call to determine what comes next
- When the enforcement engine returns an error, read the message to identify the required tool and call it immediately
- Use recover_context when context loss occurs to resume at the correct position
- Treat enforcement errors as authoritative — they specify which tool is required
- Load relevant skills when instructed (asking-questions, sequential-thinking)
- Questions are always asked using the question tool, not in response content

## Understanding Enforcement Errors

The enforcement engine maintains the correct order of tool calls in a DAG node. When it returns an error, the error message is authoritative — it specifies the exact tool that should be called next.

**Error pattern:** "Expected X but you called Y" means the required next tool is X; call that tool, not Y.

## recover_context for Context Loss

If context is lost between steps, call recover_context immediately with no parameters. It returns your current position in the DAG, remaining enforcement steps, completed steps, and divergence flags. Resume at the indicated step and continue the enforcement sequence.

## Anti-patterns

**Skipping next_step:** Assuming you know which tool comes next and calling it without next_step. DAGs have conditional branches. Always use next_step to confirm progress.

**Retrying a blocked tool:** The error explicitly names the required tool. Retrying the blocked tool fails again. Call the tool the error identifies.

**Predicting enforcement sequences:** Assuming different DAGs have the same sequence. Each DAG is unique. Enforcement sequences differ based on conditional logic. Always use next_step.
