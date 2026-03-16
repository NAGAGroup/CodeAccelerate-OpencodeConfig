# Subtask 05 — hw-audit-synthesis

## Objective

HeadWrench synthesizes all findings from subtasks 01–04 into a comprehensive `AUDIT.md` at the project root. This is the primary deliverable of the session.

---

## Scope

**Read**:
- `.opencode/sessions/opencode-config-audit/notes/01-surface-sweep.md`
- `.opencode/sessions/opencode-config-audit/notes/02-agent-analysis.md`
- `.opencode/sessions/opencode-config-audit/notes/03-protocol-analysis.md`
- `.opencode/sessions/opencode-config-audit/notes/04-session-analysis.md`

**Write**:
- `AUDIT.md` (project root: `/home/jack/CodeAccelerate-OpencodeConfig/AUDIT.md`)

**Excluded**:
- All other session directories
- Production config files (read-only audit; no changes)

---

## Constraints

- HeadWrench writes AUDIT.md directly — no subagent delegation for this step
- The document must follow this structure:
  1. **Executive Summary** — 3–5 bullet points: most critical findings, overall health assessment
  2. **Findings Table** — all findings from all subtasks, organized by category (Agents / Protocols / Commands / Plugins & Sessions / Infrastructure), each with:
     - Severity: `Critical` | `High` | `Medium` | `Low` | `Info`
     - Finding description (1–2 sentences)
     - File reference
     - Recommendation (1 sentence)
  3. **Contradictions** — explicit list of cases where two or more components disagree
  4. **Strengths** — what the system does well (not just problems)
  5. **Recommendations Summary** — grouped action items, ordered by impact
- **Invariants are not findings**: deny-by-default, plan-as-product, and HW-as-orchestrator are correct and must be stated as architectural strengths, not flagged as issues
- Be specific — reference exact file names and line-level details where known
- Do not editorialize — findings should be factual with clear evidence from the notes

---

## Todolist

- [ ] Read all 4 session notes (01, 02, 03, 04)
- [ ] Draft executive summary
- [ ] Build findings table (all categories)
- [ ] Compile contradictions list
- [ ] Write strengths section
- [ ] Write recommendations summary (ordered by impact)
- [ ] Write complete `AUDIT.md` to project root

---

## Delegation

**Agent**: HeadWrench direct  
**Model**: N/A (HeadWrench writes directly)  
**Rationale**: Synthesis requires judgment and authorship — this is the primary session deliverable and belongs to HeadWrench, not a subagent.
