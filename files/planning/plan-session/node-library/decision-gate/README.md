# decision-gate

## When to use

Use `decision-gate` when **the user must choose between two or more paths, and the choice requires human judgment, preference, or approval** — not when the decision can be made automatically.

**Contrast:**
- **Use decision-gate:** "Should we prioritize API rate-limiting or database optimization?" (User must decide based on project priorities.)
- **Use conditional-branch:** "If exit code is 0, route to success-node; else route to failure-node." (Decision is machine-readable.)
- **Use decision-gate for:** Strategy choice, approval/rejection, preference between viable options.
- **Do NOT use decision-gate for:** Conditional logic based on file presence, exit codes, prior context, or any machine-determined state.

## What the planning agent must resolve

Before writing a `decision-gate` node, answer these four items explicitly:

1. **Decision statement** — What specific choice is the user making? Be concrete, not thematic.
   - ✓ Good: "Should we optimize the database before adding the new feature, or add the feature first?"
   - ✗ Bad: "What should we do next?"

2. **Option labels** — List each option with a short, clear label (one to five words). These labels become the `when` strings in the DAG branch array and must match exactly in the question the user sees.
   - ✓ Good: `"Optimize database first"` / `"Add feature first"`
   - ✗ Bad: `"Option A"` / `"Option B"` (user cannot decide without substance)
   - ✗ Bad: Long descriptive prose instead of a label

3. **Branch routing** — For each option, which node ID executes next? Each node ID must be a valid branch child node ID in the DAG.
   - ✓ Good: "Optimize database first" → routes to `optimize-db-node`; "Add feature first" → routes to `add-feature-node`
   - ✗ Bad: No explicit routing plan — HW will not know where to send the user's choice

4. **Routing constraint (cascade)** — After the user responds, the executing prompt must call `next_step({ next: '<node-id>' })` where `<node-id>` exactly matches the branch node's id in the DAG — NOT the `when` string. The `when` field is human-readable display text only; routing always uses the node ID.
   - ✓ Good: User selects "Optimize database first" → prompt calls `next_step({ next: 'optimize-db-node' })`
   - ✗ Bad: User selects "Optimize database first" → prompt calls `next_step({ next: 'Optimize database first' })`

## Notes

### Option label ↔ `when` string mismatch

**Failure mode:** The planning agent writes question option labels that do not exactly match the `when` strings in the DAG branch array. When the user selects an option, HW tries to route using the chosen option text but finds no matching `when` entry. The session stalls.

**Example:** Question offers "Optimize database" as an option. The DAG branch has `when: "Optimize database first"`. User selects "Optimize database". HW cannot match the response to any branch and stalls.

**Prevention:** The planning agent must verify that each question option label exactly matches the corresponding `when` string — including capitalization and punctuation. No fuzzy matching; the match is character-for-character.

### Routing by node ID, not `when` string

**Failure mode:** The executing prompt calls `next_step({ next: 'Optimize database first' })` using the `when` string instead of the node ID. The plugin expects a node ID and cannot find a node with that name, blocking the session.

**Example:** The DAG has `{ "when": "Optimize database first", "node": { "id": "optimize-db", ... } }`. The prompt calls `next_step({ next: 'Optimize database first' })`. The plugin looks for a node named "Optimize database first" (not "optimize-db") and fails.

**Prevention:** The fixed `## Routing requirement` section in the prompt template states this rule explicitly. HW reads it and routes using the node ID, never the `when` string.

### Using decision-gate for machine-readable decisions

**Failure mode:** The planning agent adds a decision-gate node to ask the user about something the DAG could determine itself (e.g., "Did the build succeed?"). This wastes user time and adds unnecessary friction.

**Prevention:** Use parallel research or analysis nodes to gather facts; use decision-gate only when the user's judgment is genuinely required.

## Output constraint (cascade)

After the user responds, call `next_step({ next: '<node-id>' })` where `<node-id>` exactly matches the branch node's id in the DAG — NOT the `when` string. The `when` field is human-readable display text only; routing must use the node's actual id value.
