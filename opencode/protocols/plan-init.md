# plan-init.md — Phase 1: Orientation

Phase 1 runs at the start of every `/plan` invocation, regardless of session type.

## Step 1 — Project Layout

HW runs a quick glob/grep to get project layout: file tree of key directories (`opencode/agents/`, `opencode/protocols/`, `opencode/commands/`, `opencode/skills/`, `.opencode/sessions/`, `.opencode/agents/`), and any obvious entry points.

## Step 2 — Parallel ContextScout Dispatch

Dispatch **multiple ContextScouts in parallel** — one per major concern relevant to the task. Typical concerns:

- Active agents and their capabilities
- Existing protocols and commands related to the request
- Current session state (any in_progress sessions)
- Codebase structure relevant to the requested change

Each scout gets a focused single-concern prompt. Do not combine all concerns into one scout — parallel dispatch is faster and produces cleaner focused reports.

## Step 3 — Synthesis Decision

After all ContextScout results return:

- If findings are straightforward and self-contained → synthesize directly from scout reports
- If complex inter-file relationships, circular dependencies, or conflicting conventions exist → delegate to **@ContextInsurgent** for deep synthesis before proceeding

## Step 4 — Session Type Selection

Use the `question` tool to ask the user to select the session type. Always ask — do not infer or default silently, even if one type seems obvious from the description.

Present the three options:

| Type | When to use |
|------|-------------|
| **Generic** | New feature, refactor, migration, documentation, multi-step implementation |
| **Debug** | Bug report, unexpected behavior, test failure, error trace |
| **Collaborative** | User wants active review or approval at each step |

Wait for the user's explicit selection before proceeding.

## Output

At the end of Phase 1, HW has:
- Project layout summary
- Key findings from all scouts (and ContextInsurgent synthesis if used)
- Session type determination

Continue to `plan-shared.md` for Q&A and synthesis.
