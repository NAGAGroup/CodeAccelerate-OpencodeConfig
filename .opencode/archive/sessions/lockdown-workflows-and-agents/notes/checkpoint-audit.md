# Checkpoint Protocol Audit — lockdown-workflows-and-agents

## Summary
The `protocols/checkpoint.md` file for this session does not exist — the directory was created during bootstrap but the file was never written. The only checkpoint protocol in the repository lives in `.opencode/sessions/audit-session-compaction-plugin/protocols/checkpoint.md`, making it session-scoped and not globally reusable. Additionally, `headwrench.md` references `protocols/checkpoint.md` generically but several behaviors described in `headwrench.md` are not codified in any protocol file.

---

## Protocol Contents (as-found)

**Source:** `.opencode/sessions/audit-session-compaction-plugin/protocols/checkpoint.md`

The existing protocol defines 5 steps:
1. Git WIP commit (`wip: subtask-NN — <description>`)
2. Update `index.md` subtask status table + increment `spec.json` `currentSubtask`
3. Write notes — one concept per file, in `sessions/{name}/notes/`
4. Write inbox observations to `.opencode/inbox/` — format `<date>-<topic>.md`
5. Continue — or stop at `[🚫 GATE]` for explicit user approval

---

## Gap Analysis

### Defined Clearly
- WIP commit format and when to skip (analysis-only subtasks)
- index.md status table update format
- spec.json `currentSubtask` increment
- Notes: one concept per file, filename convention
- Inbox: format convention (`<date>-<topic>.md`)
- Gate behavior: stop, surface findings, wait for explicit approval

### Missing or Underspecified

- **No global protocol file**: The checkpoint protocol lives inside a specific session directory. Every new session must either copy it or reference it from another session. There is no canonical global protocol that all sessions inherit. Should live at `opencode/protocols/checkpoint.md` (or similar) and be referenced by `headwrench.md`.

- **Circuit breaker not in protocol**: `headwrench.md` defines "stop after N consecutive failures (N set during planning, default 3)" but this rule is nowhere in the checkpoint protocol. An agent following only the protocol would not know when to break the debug loop.

- **Failure / empty-result handling not defined**: What does HW do when a subagent returns an empty result or hits its step limit (as ContextScout did in this session)? The protocol has no recovery step — no note, no retry guidance, no escalation path.

- **Session close procedure not defined**: The protocol covers end-of-subtask but not end-of-session. What does "closing" a session look like? Final commit format (not WIP), index.md final status update, any wrap-up notes?

- **Inbox — what qualifies**: The protocol says "pattern/convention observations" but gives no examples of what does and doesn't qualify. `headwrench.md` is equally vague. Agents have no guidance on what rises to inbox level vs. just being a note.

- **Notes — content spec underspecified**: Protocol says "what was discovered, what was changed, why, and any open questions" — but doesn't specify that notes from *this session* inform future sessions via ContextScout. The *why notes matter* is only in `headwrench.md`.

- **Gate — what to surface**: Protocol says "stop and surface findings" at a gate, but doesn't specify what format that surface should take or what minimum information is required for the user to make an informed approval decision.

- **`spec.json` schema not defined anywhere**: The protocol references incrementing `currentSubtask` but there's no documented schema for what `spec.json` must contain. An agent bootstrapping a new session has no spec to follow.

### Inconsistencies with headwrench.md

- `headwrench.md` says "follow the checkpoint protocol in `protocols/checkpoint.md`" — but this file does not exist in this session (or globally). HW is referencing a non-existent file.
- `headwrench.md` mentions `@SessionPlanDrafter` as a delegate — **this agent is being retired**. Reference must be removed.
- `headwrench.md` lists delegation rules but does not reflect the corrected `/plan` flow (HW writes the plan directly, not SessionPlanDrafter).

---

## Recommended Additions

1. **Create a global checkpoint protocol** at `opencode/protocols/checkpoint.md` (project-level, not session-level). Update `headwrench.md` to reference it.
2. **Add circuit breaker step** to the protocol: "If this is the Nth consecutive failed subtask (N defined in spec.json, default 3), stop and surface to user."
3. **Add failure/empty-result recovery step**: "If a subagent returns empty or hits step limit: write a note describing the failure, retry once with adjusted prompt, then escalate to user on second failure."
4. **Add session close procedure**: Final commit format, final index.md status, any closing notes.
5. **Add inbox qualification guidance**: e.g., "inbox items are reusable project-level observations — naming conventions, tool quirks, process improvements. One-off findings go in notes, not inbox."
6. **Add gate surface format**: Minimum gate output = summary of work done + key findings + specific question requiring approval.
7. **Document `spec.json` schema**: Required fields, types, meaning of each field.

---

## Priority Findings

1. **CRITICAL — No global protocol file**: Every session must reinvent or copy the checkpoint. The protocol must be extracted to a global location.
2. **HIGH — Circuit breaker absent from protocol**: The debug loop safety valve exists only in `headwrench.md`. If an agent reads only the protocol, it won't know to stop.
3. **HIGH — No failure/empty-result handling**: This session already hit this gap (ContextScout step limit, empty results). Protocol must define recovery steps.
4. **MEDIUM — Session close undefined**: No canonical procedure for closing a session cleanly.
5. **MEDIUM — headwrench.md references non-existent protocol path + stale SessionPlanDrafter reference**: Both must be fixed.
