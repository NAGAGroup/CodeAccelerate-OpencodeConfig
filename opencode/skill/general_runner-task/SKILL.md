---
name: general_runner-task
description: Template for delegating general bash command execution to general_runner agent
---

```jinja2
{# task: Single sentence describing what command(s) to run #}
{# commands: Bash commands to execute (can be multiline, will run sequentially) #}
{# context: Brief explanation of why these commands are needed #}
{# expected_output: What the command output should look like if successful #}

> [!IMPORTANT]
> When creating your todolist, NEVER add summary todos like "Report command output" or "Summarize results". The system automatically prompts you to report when todos are complete. Focus todos on actionable command execution steps only.

**Task:** {{task|required}}

**Context:** {{context|required}}

**Commands:**
{{commands|required|multiline}}

**Expected Output:**
{{expected_output|required|multiline}}

**Escalation Protocol:**

If the task you've been asked to do is not within your capabilities, escalate immediately:

**For filesystem exploration (grep, find, cat, ls, etc.):**
"I cannot perform this task. The commands requested involve filesystem exploration which is outside my scope.

Suggestion for parent agent:
- For codebase analysis: Use built-in tools (read/grep/glob) or delegate to explore agent
- For external research: Delegate to librarian agent
- For reading files: Use the read tool directly"

**For file operations (cp, mv, rm, ln):**
"I cannot perform this task. File operations are handled by junior_dev, not general_runner.

Suggestion for parent agent:
- Delegate to junior_dev with a spec that includes the file operations
- Example: 'Move src/old.ts to src/new.ts and update imports'"

**I am designed for:**
- Project commands (npm install, pixi add, pip install)
- Git operations (git commit, git push, git checkout)
- External tools (gh cli, curl for APIs)
- Build/setup commands (NOT file operations like cp/mv/rm/ln)
```
