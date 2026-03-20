# Subtask 04 — Synthesis

## Delegation
- **Agent:** HeadWrench-direct
- **Reason:** The synthesis subtask reads all accumulated round notes and compiles a research brief and design document. No subagent invocation needed — HW reads the notes directly and writes the output files.

---

## Objective

Read all three round findings files and compile two output documents:

1. **`notes/research-brief.md`** — A concise executive summary: session goal, research scope, key findings per round, open questions, and recommended next steps (including a pointer to creating an executable session plan via `/plan`).

2. **`notes/design-doc.md`** — A structured design document covering all 8 feature areas, with a section for each. Each section must: state the recommended design, explain the rationale (citing round findings), and explicitly flag where the recommendation diverges from the current config's implementation.

**The 8 feature areas (one section each in the design doc):**
1. Planning system & planning modes
2. Session plan structure & execution design
3. Context management (lifecycle, tiers, staleness, archival)
4. Writing session-specific subagents
5. Delegation design & routing strategy
6. Speed/cost/correctness trade-off framework
7. Protocol & skills system design
8. Slash commands & general UX

No subagent invocation. No new research. This subtask only synthesizes what is already in the notes.

> **Audience note:** This subtask file is read by HeadWrench only. HW executes it directly.

---

## Todolist

### 1. Read all round notes
- [ ] Read `notes/round-01-findings.md`
- [ ] Read `notes/round-02-findings.md`
- [ ] Read `notes/round-03-findings.md`

### 2. Write research-brief.md
- [ ] Write `notes/research-brief.md` with: session goal, research scope summary, key findings per round (3–5 bullets each), open questions, recommended next steps

### 3. Write design-doc.md
- [ ] Write `notes/design-doc.md` with one section per feature area (8 total); each section: recommended design, rationale, divergence notes

### 4. Final review
- [ ] Verify both output files are internally consistent and cross-reference each other where appropriate
- [ ] Confirm all 8 feature areas are covered in design-doc.md

---

## Scope

- **Read:** `notes/round-01-findings.md`, `notes/round-02-findings.md`, `notes/round-03-findings.md`
- **Write:** `notes/research-brief.md`, `notes/design-doc.md`
- **Excluded:** All subtask files, config files, implementation files; no web research; no subagent invocation

---

## Constraints

- Do not invoke any subagent — HW-direct only
- Do not conduct new research — only synthesize what is in the three round notes files
- Both output files must be self-contained — a reader who hasn't seen the round notes should understand the findings and recommendations from the design-doc alone
- Flag design divergences from current implementation explicitly using `⚠️ Diverges from current:` callout in design-doc.md
- The design-doc is the primary deliverable; the brief is the executive summary layer

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`. This is the final subtask — use the session close commit format: `feat: complete session — config-reimplementation-research`.*
