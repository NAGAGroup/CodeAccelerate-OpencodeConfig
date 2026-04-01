# Research Brief

Dispatch @ExternalScout to gather targeted external research on topics identified as needed during research-gate, then advance to plan design.

**Todo:** `["task"]`

> (1) Fill `{{USER_TASK}}` from the user's original task description.
> (2) Fill `{{RESEARCH_GAPS}}` from the pre-research-thinking node output — paste the identified gaps verbatim.
> (3) Use this prompt template verbatim as the `prompt` field.
> (4) After task returns, call `next_step()`.

```
Task: {{USER_TASK}}

Research gaps identified:
{{RESEARCH_GAPS}}

Your job: research the gaps listed above using external sources. Use Context7 first for API/library docs; use Exa for recency-sensitive questions.

Do not read project files — external sources only.

Return a flat bulleted list of findings with source citations. No prose narrative.
```
