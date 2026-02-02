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
{# required_skills: REQUIRED - Array of skill names junior_dev should load. Get via: query_required_skills({agent: "junior_dev"}). Pass empty array [] if none. #}

**Task:** {{task|required}}

**Files:**
{{files|required|list}}

**Spec:**
{{spec|required|multiline}}

**Acceptance Criteria:**
{{acceptance_criteria|required|multiline}}

**Constraints:**
{{constraints|optional|multiline}}

**Before starting:**

1. Load your required skills:
{% for skill in required_skills %}
   skill({name: "{{skill}}"})
{% endfor %}

2. Create todolist breaking down the spec into trackable steps
```
