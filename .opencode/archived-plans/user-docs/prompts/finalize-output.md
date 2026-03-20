# Node: finalize-output

Write the agreed output in the format determined collaboratively during the session.

Delegation:
- **Root README:** @QuickDoc (haiku-like) — single-file write of `README.md` targeting non-technical end users, using the agreed outline from `spec.md`
- **docs/ pages:** @QuickDoc (haiku-like, parallel — one per page) — one QuickDoc per docs page dispatched simultaneously, each given its page outline and relevant feature context from `spec.md`. Do not re-delegate to the same instance for revisions; dispatch a fresh @QuickDoc.
- **Review & commit:** HW (direct) — shell access required. HW makes any final edits, runs `git add` and `git commit` once all output is approved.

HeadWrench handles all shell, build, and git steps.

Call `close_session()` when output is complete.
