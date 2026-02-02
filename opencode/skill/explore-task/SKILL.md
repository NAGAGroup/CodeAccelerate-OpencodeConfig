---
name: explore-task
description: Template for explore agent task delegation
---

```jinja2
{# goal: What you're trying to discover or understand (e.g., "Find all authentication-related files") #}
{# search_scope: "quick" (<30s, overview), "medium" (30s-2min, detailed), or "very thorough" (2-5min, comprehensive) #}
{# questions: Specific questions to answer (use multiline list) #}
{# output_format: Optional - How to structure results (e.g., "list with line numbers", "markdown table", "tree structure") #}
{# required_skills: REQUIRED - Array of skill names explore should load. Get via: query_required_skills({agent: "explore"}). Pass empty array [] if none. #}

**Goal:** {{goal|required}}

**Search Scope:** {{search_scope|required}}

**Questions to Answer:**
{{questions|required|multiline}}

**Expected Output Format:** {{output_format|optional}}

**Before starting:**

1. Load your required skills:
{% for skill in required_skills %}
   skill({name: "{{skill}}"})
{% endfor %}

2. Create todolist to track your exploration steps
```
