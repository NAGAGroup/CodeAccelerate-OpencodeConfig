---
name: explore-task
description: Template for explore agent task delegation
---

```jinja2
{# goal: What you're trying to discover or understand (e.g., "Find all authentication-related files") #}
{# search_scope: "quick" (<30s, overview), "medium" (30s-2min, detailed), or "very thorough" (2-5min, comprehensive) #}
{# questions: Specific questions to answer (use multiline list) #}

> [!IMPORTANT]
> When creating your todolist, NEVER add summary todos like "Report findings" or "Summarize results". The system automatically prompts you to report when todos are complete. Focus todos on actionable exploration steps only.

**Goal:** {{goal|required}}

**Search Scope:** {{search_scope|required}}

**Questions to Answer:**
{{questions|required|multiline}}
```
