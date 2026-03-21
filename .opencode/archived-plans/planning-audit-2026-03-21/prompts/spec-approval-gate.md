# Spec Approval Gate

The spec document has been written at `.opencode/planning-audit-spec.md`.

## Your Task

Review the spec for:
1. **Clarity** — Is each improvement explained clearly?
2. **Completeness** — Does it cover all 4 leverage issues + 10 improvements?
3. **Actionability** — Can downstream DAG updates reference it and know exactly what to do?
4. **Consistency** — Are recommendations uniform across DAGs (or are differences justified)?

If satisfied, present to user for approval. The user will decide:

- **Approve** — Spec is solid; proceed to update planning DAGs
- **Refine** — Spec needs adjustment before proceeding

## If User Approves

Proceed to `next_step()` with target `update-plan-generic`.

## If User Requests Refinement

Call `next_step()` back to `design-improvements-spec` to iterate on the spec.

---

**Note for HeadWrench:** You are the gate here. Present the spec to the user, let them review, and route their decision through the appropriate next_step() call.
