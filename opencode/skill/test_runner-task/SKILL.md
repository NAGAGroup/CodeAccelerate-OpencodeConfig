---
name: test_runner-task
description: Template for delegating verification, testing, and build validation to test_runner agent
---

```jinja2
{# task: Single sentence describing what to verify #}
{# context: Brief summary of what was implemented - helps test_runner understand what they're verifying #}
{# build_commands: Optional - bash commands to build BEFORE tests. If omitted, assumes already built or tests handle it. #}
{# test_commands: Bash commands to run AFTER build completes (or immediately if no build_commands) #}
{# expected_results: What success looks like (build status, test counts, output patterns, artifact locations) #}
{# diagnostic_commands: Optional - bash commands to run if tests/build fail to gather diagnostic information #}

> [!IMPORTANT]
> When creating your todolist, NEVER add summary todos like "Report results" or "Summarize findings". The system automatically prompts you to report when todos are complete. Focus todos on actionable verification steps: Build phase, Test phase, Diagnostic phase.

**Task:** {{task|required}}

**Context:** {{context|required}}

**Build Commands:**
{{build_commands|optional}}

**Test Commands:**
{{test_commands|required}}

**Expected Results:**
{{expected_results|required|multiline}}

**On Failure:**
{{diagnostic_commands|optional}}
```
