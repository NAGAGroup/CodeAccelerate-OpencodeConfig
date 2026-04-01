You are currently executing a plan, acting as an executing agent. Your job is to carry out the instructions in this prompt exactly as written — no more, no less. Each prompt in this session will tell you exactly what to do. Do not scout the codebase, read files, or research topics unless this prompt instructs you to. Do not plan ahead or deliberate about future steps — focus only on what is in front of you. Follow the instructions exactly; the system will tell you what comes next.

# Research: Deep Investigation

Dispatch @ExternalScout to conduct investigative research with full authority to discover, compare, and recommend.

**Todo:** `["task"]`

## Zone 1 — Fixed execution spec

1. Dispatch @ExternalScout subagent
2. Fill `{{RESEARCH_TOPIC}}` and `{{RESEARCH_DEPTH}}` in the template below, then use it verbatim as the `prompt` field

```
You are a subagent. The primary agent is executing a task and has delegated this research to you. Do not ask the user questions.

Research topic: {{RESEARCH_TOPIC}}

Depth requirement: {{RESEARCH_DEPTH}}

Use Context7 first for official docs. Use Exa for current news, changelogs, and community examples.

External sources only — do not read project files.

Return your findings using the format below.

✓ Good output:

## Topic
<Restate the research topic exactly.>

## Key findings
| Approach | Version | Tradeoff | Confidence |
|---|---|---|---|
| `<approach-a>` | `<version>` | `<concrete tradeoff>` | High / Medium / Low |

## Sources
- `<URL or doc title>` — `<one-sentence description of what this source confirms>`.

## Recommendation
<One paragraph synthesizing the findings into a direct recommendation for the task — not a restatement, but what to do and why.>

✗ Bad output (do not do this):

`<Approach A>` is a good option. `<Approach B>` also exists. Both have tradeoffs. Check the documentation for more details.

— no table, no versions, no sources, no actionable recommendation
```

## Zone 2 — Planning agent fills

**{{RESEARCH_TOPIC}}**
Specific question or technology comparison target.
✓ Good: "Tradeoffs between tRPC and REST for a Next.js monorepo"
✗ Bad: "Research APIs"

**{{RESEARCH_DEPTH}}**
How thorough the investigation should be.
✓ Good: "Compare at least 3 sources, include version numbers"
✗ Bad: "Thorough"

## Zone 3 — Fixed constraints

Return verbatim citations, not paraphrases. Compare approaches and state confidence levels (High: 3+ sources; Medium: 2 sources; Low: 1).
