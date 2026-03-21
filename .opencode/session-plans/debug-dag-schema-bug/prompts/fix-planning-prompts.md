# Fix: Update Planning Prompts with JSON Schema Guidance

## Objective

Fix the planning agent prompts to include explicit JSON schema specification and constraints for the `next` object structure.

## Root Cause Summary

Evidence indicates that planning prompts lack:
1. Explicit JSON schema example showing `next` object format with actual node IDs as keys
2. Clear constraint statement: "keys in branching `next` objects must be actual node IDs"
3. Bad examples demonstrating what NOT to do (e.g., using `"pass"`/`"fail"`)

Agents default to generic outcome labels because the prompts don't provide sufficient guidance.

## What to Fix

Update all planning mode prompts that generate or describe the `next` structure:

### Files to Update

- `files/planning/plan-generic/prompts/` — All prompts that guide DAG generation
- `files/planning/plan-debug/prompts/` — All prompts that guide DAG generation
- `files/planning/plan-collaborative/prompts/` — All prompts that guide DAG generation
- `files/planning/plan-deep-research/prompts/` — All prompts that guide DAG generation

Priority: Any prompt that says "produce a JSON structure", "generate a plan", "create nodes", or guides branching logic.

### What to Add

For each relevant prompt, add a section with:

#### 1. Correct JSON Schema Example

```json
{
  "next": {
    "clarify": {
      "desc": "User needs clarification on requirements",
      "choose_when": "The user provided ambiguous requirements or constraints"
    },
    "decompose": {
      "desc": "Requirements are clear; proceed to decomposition",
      "choose_when": "Requirements are well-defined and unambiguous"
    }
  }
}
```

**Key point:** Keys are actual node IDs from your DAG (`"clarify"`, `"decompose"`), not generic labels.

#### 2. Constraint Statement

```
CONSTRAINT: The keys in a branching `next` object MUST be actual node IDs from your DAG.
Each key must correspond to a real node defined in the DAG's nodes section.
Do NOT use generic outcome labels like "pass", "fail", "yes", "no" as keys.
```

#### 3. Bad Example (What NOT to Do)

```json
{
  "next": {
    "pass": {                    ❌ WRONG: "pass" is not a node ID
      "desc": "...",
      "choose_when": "..."
    },
    "fail": {                     ❌ WRONG: "fail" is not a node ID
      "desc": "...",
      "choose_when": "..."
    }
  }
}
```

#### 4. Three `next` Format Reference

Clarify that `next` supports three formats:

- **Single node (string):** `"next": "clarify"`
- **Multiple options without description (array):** `"next": ["clarify", "decompose", "finalize"]`
- **Multiple options with description (object):** `"next": { "clarify": {...}, "decompose": {...} }`

Only the object format requires node IDs as keys with descriptions.

## Verification

After updating prompts:

1. **Trigger a new planning session** to generate a test DAG
2. **Inspect the generated `plan.json`**
3. **Validate all `next` keys:**
   - Are they semantic node IDs (e.g., `"clarify"`, `"finalize"`, `"propose-hypothesis"`)?
   - Do they match actual node IDs in the DAG?
   - No generic labels like `"pass"`, `"fail"`, etc.?

## How to Advance

1. Update planning prompts with the JSON schema guidance, constraints, and examples
2. Commit the changes
3. Call `next_step()` to proceed to Step 6 (verify fix)

## Notes

- Focus on prompts that agents read and execute (agent-type nodes in planning DAGs)
- Gate prompts are especially important as they guide branching decisions
- The fix is straightforward: add clear examples and constraints
- If prompts are very long, add a "JSON Schema Reference" section at the end
