---
topic: core-protocol-framing
session: agent-prompt-rewrite
created: 2026-03-17
---

# ST06 — Core Protocol Framing Fixes

## What Was Fixed

**plan-deep-research.md** (protocol): All `HW reads/constructs/dispatches/writes` → second-person imperatives. `HW-direct` label preserved as technical noun. `full HW session` preserved as compound noun.

**checkpoint.md**: `HeadWrench owns ALL commits` → `You own ALL commits`. `HeadWrench oriented` → `you oriented`. All 8 step numbers, case labels (Case 1/2/3/4), and git command strings preserved verbatim.

**context-management.md**: `HeadWrench runs the audit` → `You run the audit`. `when HW writes a context file` → `when you write a context file`. `/context-audit` command cross-references preserved (not slash command invocations). Quoted example strings (inside code blocks or summary displays) preserved as-is.

**session-plan-schema.md**: `HeadWrench stops at checkpoint` → `You stop at checkpoint`. `HeadWrench reads the file...and passes` → `You read...and pass`. Parallel delegation template: `HeadWrench launches all slots simultaneously` → `You launch all slots simultaneously`. Session summary todo rules: `HeadWrench creates/updates` → `You create/update`. Invariants: `HeadWrench owns and updates it. For HW orientation only` → `You own and update it. For your orientation only`. `HeadWrench runs them directly` → `You run them directly`.

## Preserved As-Is (Intentional)

- `The HeadWrench (HW) session plan is...` (line 4) — intro/overview sentence, factual third-person describing the tool to any reader
- `This subtask file is read by HeadWrench.` (audience note template line 98) — third-person correct here; it describes HW to whoever reads the subtask file
- `"HW must get user confirmation..."` (context-management line 237) — inside a quoted example summary string, not an instruction
- `full HW session` (plan-deep-research line 3) — compound noun label
- `HW-direct` labels throughout — technical subtask-type labels

## Pattern: Third-Person HW References

Not all HW/HeadWrench references are errors. The distinction:
- **Instruction context** (protocol telling HW what to do): always second-person "you"
- **Descriptive/overview context** (describing what HW is or does to any reader): third-person is correct
- **Template text** (audience note inside subtask template): third-person correct — it's describing HW to whoever reads the subtask file
- **Technical labels** (HW-direct, HW session type): preserve as noun/adjective
- **Quoted strings** (example output inside code blocks): preserve as-is
