---
name: junior_dev-task
description: Template for delegating implementation work to junior_dev agent
---

```jinja2
{# task: Single sentence describing what to accomplish #}
{# files: Array of absolute paths to all files to create/modify #}
{# spec: Numbered steps with exact locations, function names, line numbers, code blocks #}
{# acceptance_criteria: What "done" looks like - specific conditions that indicate successful completion #}
{# constraints: Optional - what NOT to do (style rules, APIs to avoid, patterns to follow) #}

**Task:** {{task|required}}

**Files:**
{{files|required|list}}

**Spec:**
{{spec|required|multiline}}

**Acceptance Criteria:**
{{acceptance_criteria|required|multiline}}

**Constraints:**
{{constraints|optional|multiline}}

**Important Guidelines:**
- Junior_dev gets ONE attempt per spec - cannot debug, improvise, or ask questions
- If they fail, YOU must write a completely new spec
- Always provide absolute paths for files
- Use specific locations (function names, line numbers, code anchors) in spec
- Junior_dev CANNOT run build/test commands - delegate verification to test_runner
- Never send multiple junior_dev tasks to same workspace simultaneously
```
