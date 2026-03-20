# /plan-collaborative Design

## Status: LOCKED (subtask 05)

## Definition
/plan-collaborative = rough-idea-to-detailed-spec session type. NOT general collaboration — specifically turning rough ideas into fully specced plans.

Key distinction: planning phase ONLY fleshes out the rough idea and surfaces quality clarifying questions. It does NOT attempt to answer open questions or produce decisions. That work happens in the live collaborative session itself.

## Planning DAG (`~/.config/opencode/planning/plan-collaborative/plan.json`)

```json
{
  "schema_version": "1.0",
  "id": "plan-collaborative",
  "session_type": "plan-collaborative",
  "description": "Rough-idea-to-detailed-spec — planning produces seed plan only",
  "entry": "idea-intake",
  "nodes": {
    "idea-intake": {
      "id": "idea-intake",
      "type": "agent",
      "prompt": "~/.config/opencode/planning/plan-collaborative/prompts/idea-intake.md",
      "next": "clarify"
    },
    "clarify": {
      "id": "clarify",
      "type": "agent",
      "prompt": "~/.config/opencode/planning/plan-collaborative/prompts/clarify.md",
      "next": ["clarify", "seed-gate"]
    },
    "seed-gate": {
      "id": "seed-gate",
      "type": "gate",
      "prompt": "~/.config/opencode/planning/plan-collaborative/prompts/seed-gate.md",
      "next": ["finalize", "clarify"]
    },
    "finalize": {
      "id": "finalize",
      "type": "agent",
      "prompt": "~/.config/opencode/planning/plan-collaborative/prompts/finalize.md"
    }
  }
}
```

### Node descriptions
- **idea-intake**: OMEGA query + capture rough idea from slash command context → next: clarify
- **clarify**: Ask quality clarifying questions; surface exploration paths; can loop. Goal: gather just enough to write a quality seed plan. Does NOT answer questions or produce decisions.
- **seed-gate**: Gate — present quality questions + exploration paths to user; user approves seed plan direction. next: ["finalize", "clarify"]
- **finalize**: Write seed session plan artifacts (plan.json + spec.md stub + explore-01.md) → terminal

## Seed Session Plan Output

Written by finalize to `.opencode/session-plans/<name>/`:

### plan.json (seed)
```json
{
  "schema_version": "1.0",
  "id": "<session-name>",
  "session_type": "plan-collaborative",
  "goal": "<rough goal from intake>",
  "created": "...",
  "status": "ready",
  "entry": "explore-01",
  "nodes": {
    "explore-01": {
      "id": "explore-01",
      "type": "agent",
      "prompt": ".opencode/session-plans/<name>/prompts/explore-01.md",
      "next": ["explore-01", "spec-gate"]
    },
    "spec-gate": {
      "id": "spec-gate",
      "type": "gate",
      "prompt": ".opencode/session-plans/<name>/prompts/spec-gate.md",
      "next": ["finalize", "explore-01"]
    },
    "finalize": {
      "id": "finalize",
      "type": "agent",
      "prompt": ".opencode/session-plans/<name>/prompts/finalize.md"
    }
  }
}
```

### spec.md (stub)
- Title + rough goal
- Open questions surfaced during planning phase
- Exploration paths identified

### explore-01.md
- First set of questions/exploration areas to work through with user

## Live Collaborative Session Pattern

1. Agent runs `explore-01`, works with user toward understanding
2. Agent freely rewrites `plan.json`: add `explore-02`, `explore-03`, remove stale nodes, update spec.md as understanding develops
3. Plugin holds NO state beyond current_node — agent can rewrite plan.json + prompts freely as long as current node still exists when `next_step()` fires
4. When ready: routes to `spec-gate` for user approval
5. If approved: `finalize` writes output in collaboratively-agreed format
6. If not: agent adds more explore nodes, continues

## Output Format
Collaboratively determined during session — NOT fixed at plan creation time. Finalize writes whatever was agreed:
- User-facing design spec document
- Multi-doc output
- Feed directly into /plan-generic (execution plan JSON)
- Any other format the session converges on

User can also hint output format in the slash command arguments.
