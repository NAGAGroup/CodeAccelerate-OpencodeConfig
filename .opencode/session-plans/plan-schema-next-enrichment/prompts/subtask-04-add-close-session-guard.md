<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

## Objective

Add a terminal-node guard to `close_session()` in `opencode/plugins/planning-enforcement.ts`. The function must return an error if called while the current node has a `next` field (i.e., is not terminal).

## Scope

- **Edit:** `opencode/plugins/planning-enforcement.ts`
- **Excluded:** No files excluded

## Constraints

- Check `dag.nodes[state.current_node].next` — if it is defined (string or object), return the error message: `"close_session() may only be called on terminal nodes. Current node '${state.current_node}' has a next field."`
- Only add the guard — do not modify any other behavior

## Todolist

- [ ] Read `opencode/plugins/planning-enforcement.ts`
- [ ] Locate the `close_session()` function
- [ ] Add terminal guard: check if current node has a `next` field; if so, return error
- [ ] Verify: error is returned when called on a non-terminal node

## Delegation

**Agent:** @JuniorDev (haiku)
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/plugins/planning-enforcement.ts`
- Goal: Add a guard to `close_session()` that checks if `dag.nodes[state.current_node].next` is defined; if so, return `"close_session() may only be called on terminal nodes. Current node '${state.current_node}' has a next field."`
- Verify: Calling `close_session()` on a non-terminal node returns the error; terminal nodes proceed normally

## Advance

Call `next_step()` when this subtask is complete.
