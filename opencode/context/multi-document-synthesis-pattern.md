---
topic: multi-document-research-synthesis
tier: global
promoted_from: inbox
session: neural-field-design-space-research
created: 2026-03-15
last_reviewed: 2026-03-17
supersedes: ~
superseded_by: ~
---

# Multi-Document Research Reports Are Better Than Single-File Summaries

## Observation

During the neural-field-design-space-research session, ST6 produced a 6-document synthesis covering architecture foundations, temporal dynamics, compute↔memory tradeoffs, I/O representation, and training dynamics. Having separate part files (part-1 through part-5) plus an executive brief (research-brief.md) was significantly more useful than a single-file summary would have been.

## Why It Matters

- **Scoped reading:** A developer debugging the training collapse only needs `part-5-training-dynamics.md` — they don't have to scan through architecture theory to find the relevant config diff table.
- **Cross-referencing:** Each part file explicitly references findings from other rounds, enabling a reader to follow threads across domains without re-reading everything.
- **Executive brief:** `research-brief.md` provides the top 5 actionable items in 2–3 pages — a fast entry point for the most time-constrained review.
- **Longevity:** Individual files are easier to update when new experiments produce new findings.

## Pattern to Reuse

For any substantial research session (≥3 research rounds), structure the synthesis as:
- `research-brief.md` — executive summary + top N prioritized recommendations
- `part-N-{topic}.md` — one file per research domain, with cross-references

This pattern scales well and matches how practitioners actually read research output.
