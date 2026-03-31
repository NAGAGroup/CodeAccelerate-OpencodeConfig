# session-overview Node Type

## When to use

**Always — every DAG starts with exactly one `session-overview` node.** It auto-advances immediately. Its only job is to give HeadWrench a one-sentence statement of what the session is for.

## What the planning agent must resolve

**Session goal** — One declarative sentence stating what the DAG accomplishes. This is what HW reads when the session starts.
- ✓ Good: "Implement token refresh logic in the auth module with full test coverage."
- ✓ Good: "Migrate the billing system from Stripe to Square."
- ✗ Bad: "Update the auth system." (too vague)
- ✗ Bad: A paragraph describing phases, scouts, or expected steps — HW will be guided through those by the DAG itself.

## Notes

- **Empty todo means auto-advance.** No tool calls, no user interaction, no action instructions. HW reads the goal and the DAG moves on.
- **Do not describe what comes next.** The DAG handles flow. Writing "Next, scouts will explore the codebase" is dead weight — it will never be acted on and may cause HW to try to predict or skip ahead.
- **One sentence only.** This is not a briefing document. Save detail for `propose-plan`.
- **The "STOP — Do not work ahead" block is fixed text.** It must appear verbatim in every generated session-overview prompt, below the `{{SESSION_GOAL}}` slot. Do not paraphrase, remove, or move it. This block is the primary guard against models working ahead before the DAG has a chance to sequence them.
