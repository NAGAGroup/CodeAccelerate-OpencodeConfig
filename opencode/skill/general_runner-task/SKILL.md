---
name: general_runner-task
description: Template for delegating general bash command execution to general_runner agent
---

```jinja2
{# task: Single sentence describing what command(s) to run #}
{# commands: Bash commands to execute (can be multiline, will run sequentially) #}
{# context: Brief explanation of why these commands are needed #}
{# expected_output: What the command output should look like if successful #}
{# required_skills: REQUIRED - Array of skill names general_runner should load. Get via: query_required_skills({agent: "general_runner"}). Pass empty array [] if none. #}

**Task:** {{task|required}}

**Context:** {{context|required}}

**Commands:**
{{commands|required|multiline}}

**Expected Output:**
{{expected_output|required|multiline}}

**Before starting:**

1. Load your required skills:
{% for skill in required_skills %}
   skill({name: "{{skill}}"})
{% endfor %}

2. Create todolist to track command execution steps
```
