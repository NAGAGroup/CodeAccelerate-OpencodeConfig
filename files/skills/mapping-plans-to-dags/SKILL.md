---
name: mapping-plans-to-dags
description: Teaches how to translate a markdown phase plan into add_first_phase and add_phase tool calls.
---
<rules>
Call add_first_phase exactly once — for the first phase in the plan (the one with no from).
Call add_phase for every subsequent phase, in the order they appear in the plan.
Translate each phase's markdown fields directly to phase_options JSON. Do not interpret or rewrite.
The from argument is a single phase ID string, or a JSON array string for convergence: '["phase-a", "phase-b"]'.
</rules>

<mapping>
Each phase in the plan has this markdown structure:

### [phase-id] [phase-type]
from: [parent-phase-id]           ← absent on the first phase
[field]: [value]
[field]: [value]

Translates to:

// First phase (no from):
add_first_phase(
  plan_name={{PLAN_NAME}},
  phase_id="[phase-id]",
  phase_type="[phase-type]",
  phase_options='{"[field]": "[value]", "[field]": "[value]"}'
)

// Every subsequent phase (from is always a JSON array string):
add_phase(
  plan_name={{PLAN_NAME}},
  phase_id="[phase-id]",
  phase_type="[phase-type]",
  phase_options='{"[field]": "[value]", "[field]": "[value]"}',
  from='["[parent-phase-id]"]'
)

// Convergence (multiple parents):
add_phase(
  ...,
  from='["parent-a-id", "parent-b-id"]'
)

// from is ALWAYS a JSON array string — even for a single parent.
// Never pass a plain string like from="phase-id". Always: from='["phase-id"]'

Field types in phase_options JSON:
- string fields → "value"
- list fields (questions, topics, branches) → ["item1", "item2"]
- bool fields → true or false (no quotes)
- int fields → 1 (no quotes)
</mapping>
