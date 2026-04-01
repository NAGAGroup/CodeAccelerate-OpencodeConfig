# Research Gate

Call `question` twice to solicit user approval of planning-time and execution-time research decisions, then route to the next node based on the planning research outcome.

**Todo:** `["question", "question"]`

> (1) Read the `Planning research:` verdict from pre-research-thinking output. Ask: "HW recommends [NECESSARY|RECOMMENDED|NO] for planning research — [one-sentence reason]. Approve?" with options "Approve" and "Deny".
> (2) Read the `Execution research:` verdict and type from pre-research-thinking output. Ask: "HW recommends [NECESSARY|RECOMMENDED|NO] execution research ([research-basic|research-deep|N/A]) — [one-sentence reason]. Approve?" with options "Approve" and "Deny".
> (3) Resolve Q1 decision: if (NECESSARY or RECOMMENDED + Approve) or (NO + Deny), planning research is YES; otherwise NO.
> (4) If planning research is YES, call `next_step({ next: "research-brief" })`.
> (5) If planning research is NO, call `next_step({ next: "sequential-thinking" })`.
> (6) Carry Q2 outcome (execution research yes/no and type) forward in context for downstream plan design.

Route by exact node ID based on resolved Q1 decision (last line only).
