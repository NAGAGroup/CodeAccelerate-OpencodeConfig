---
name: following-plans
description: Teaches how to execute DAG step sequences exactly as specified, handling enforcement errors and context recovery.
---

# Following Plans

Execute DAG step sequences exactly as specified.

## Tools
**next_step** — Determine what comes next. Key params: none.

**recover_context** — Resume at correct position after context loss. Key params: none.

## Rules
- Call next_step after completing each required tool call
- When enforcement engine returns error, read it to identify required tool and call immediately
- Use recover_context when context is lost
- Treat enforcement errors as authoritative
- Load relevant skills when instructed (asking-questions, sequential-thinking)
- Questions are always asked using the question tool

## Understanding Enforcement Errors

The enforcement engine maintains correct tool call order. Error message is authoritative and specifies the exact next tool.

**Error pattern:** "Expected X but you called Y" means call tool X, not Y.

## Anti-patterns
- Skipping next_step and assuming you know which tool comes next — DAGs have conditional branches
- Retrying a blocked tool — the error names the required tool; call that instead
- Predicting enforcement sequences — each DAG is unique; always use next_step
