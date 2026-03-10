# Session: concepts-why-this-works

**Goal:** Add a "Why This Works" section to `docs/CONCEPTS.md` explaining the core design insight — complexity belongs in the session plan, not the config — committed to main.

---

## Done Criteria

- [ ] "Why This Works" H2 section written and inserted into `docs/CONCEPTS.md` after "The Plan Is the Product" and before "HeadWrench — The Orchestrator"
- [ ] Section covers all 4 required points: static template failure, Q&A-driven success, near-zero maintenance, contrast with prior approaches
- [ ] All existing CONCEPTS.md sections and content preserved unchanged
- [ ] Committed to main with a clean conventional commit message

---

## Subtask Table

| # | Status | Description |
|---|--------|-------------|
| 01 | 🔲 pending | Write "Why This Works" section in CONCEPTS.md — DocWriter / fast |
| 02 | 🔲 pending | Final commit to main — HeadWrench / direct |

---

## Gates

No gates for this session — pure documentation addition with no architectural risk.

---

## Current Focus

**Next:** Subtask 01 — Write the "Why This Works" section.

---

## Scope

**In scope:**
- `docs/CONCEPTS.md` — add one new H2 section only
- Commit to `main`

**Out of scope:**
- Any other file in the repository
- Rewrites or reformats of existing CONCEPTS.md content
- Changes to FEATURES.md, README.md, USAGE.md, or any protocol/agent files

---

## Patterns & Constraints

- Preserve all existing CONCEPTS.md section headers, prose, and structure — pure addition only
- Match the existing tone: direct, confident, declarative sentences, no jargon, no hedging
- Section placement: immediately after the horizontal rule ending "The Plan Is the Product", before the "HeadWrench — The Orchestrator" H2
- No H3 subsections — use flowing prose paragraphs, one per required point
- Git: straight to main, no feature branch
- Circuit breaker: 3 consecutive failures before stopping
- Architect: not enabled for this session
