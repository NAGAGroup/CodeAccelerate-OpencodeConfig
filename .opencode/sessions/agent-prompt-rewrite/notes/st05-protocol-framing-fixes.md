# ST05 — Protocol Framing Fixes

## What Changed

6 plan-phase protocol files were updated to fix audience framing (HW→you) and remove slash command references.

## Changes Applied

### plan-init.md
- `every '/plan' invocation` → `every planning session`
- `HW runs a quick glob/grep` → `Run a quick glob/grep`
- `At the end of Phase 1, HW has:` → `At the end of Phase 1, you have:`

### plan-shared.md
- `Should HW create commits` → `Should commits be created`
- `before HW stops` → `before you stop`
- `HW runs autonomously` → `you run autonomously`

### plan-generic.md
- `HeadWrench checks for gates...HW stops, surfaces findings` → `you check for gates...stop, surface findings`

### plan-debug.md
- `HW runs directly` (×2) → `you run directly`

### plan-collaborative.md
- Involvement table: all `HW runs/pauses/surfaces` → passive/second-person equivalents
- `This is how HW enforces it at runtime` → `This is how you enforce it at runtime`
- `### What HW Does When It Encounters [⏸ PAUSE]` → `### What You Do When You Encounter [⏸ PAUSE]`

### plan-end.md
- Already clean — no changes needed

## Rule: HW-direct as Noun

`HW-direct` in plan-end.md line 33 is a technical subtask-type label (noun/adjective), not an action subject. Preserved as-is.
