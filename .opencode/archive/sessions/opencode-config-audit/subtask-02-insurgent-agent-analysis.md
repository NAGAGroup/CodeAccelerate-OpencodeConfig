# Subtask 02 — insurgent-agent-analysis

## Objective

Deep analysis of all agent definitions — instruction/permission alignment, enforcement quality, collaborative session mode differentiation, cross-agent consistency, and ask-only pattern enforcement. The goal is not just "does the instruction exist?" but **"is it actually enforced, and does it produce the intended behavior?"**

---

## Scope

**Read**:
- `opencode/headwrench.md`
- `opencode/subagents/` — all 8 agent files
- `opencode/protocols/plan-workflow.md`
- `opencode/skills/agent-delegation-expert/SKILL.md`
- `opencode/opencode.json`
- `.opencode/sessions/opencode-config-audit/notes/01-surface-sweep.md` (findings from subtask 01)

**Write**:
- `.opencode/sessions/opencode-config-audit/notes/02-agent-analysis.md`

**Excluded**:
- `.opencode/` runtime state except the subtask-01 notes file above
- Protocol files other than plan-workflow.md
- Command files (covered in subtask 03)

---

## Constraints

- **ContextInsurgent is ask-only**: HeadWrench must invoke the `question` tool to get user confirmation before delegating this subtask
- Use sequential thinking to reason through each agent systematically
- Must investigate these specific questions:
  1. **Collaborative mode differentiation**: Does `plan-workflow.md` actually branch differently for Collaborative sessions vs. Generic? If so, do the agent definitions support that branching?
  2. **Ask-only enforcement**: Is the ask-only requirement for ContextInsurgent actually enforced in `headwrench.md`? Is there a code path that could bypass it?
  3. **Permission vs. instruction gaps**: For each agent, compare what the instructions say the agent can do vs. what the permission block actually allows. Flag any mismatch.
  4. **Cross-agent terminology consistency**: Do agents use the same vocabulary for shared concepts (e.g., "gate", "checkpoint", "subtask", "session notes")?
  5. **Dead references**: Do any agents reference tools, commands, or other agents that don't exist or are named differently?
  6. **Double-gating completeness**: Architect is double-gated — is the double-gate fully implemented in HW?
- Reference findings from `notes/01-surface-sweep.md` to prioritize focus
- Write findings as structured note: one section per question above, severity-tagged, file-referenced

---

## Todolist

- [ ] Read surface sweep notes (01-surface-sweep.md)
- [ ] Analyze each agent's permission block vs. instructions
- [ ] Analyze collaborative mode differentiation in plan-workflow.md
- [ ] Verify ask-only enforcement for ContextInsurgent in headwrench.md
- [ ] Analyze cross-agent terminology consistency
- [ ] Check for dead references across agent files
- [ ] Verify Architect double-gating implementation
- [ ] Write findings to `notes/02-agent-analysis.md`

---

## Delegation

**Agent**: @ContextInsurgent (`subagents/context-insurgent`)  
**Model**: Standard (sonnet-equivalent — deep analysis with sequential thinking)  
**Rationale**: Requires deep sequential reasoning across multiple interacting files. ContextInsurgent is the correct agent for multi-file analysis requiring cross-referencing and judgment.  
**Note**: HeadWrench must ask the user for confirmation before delegating (ask-only pattern).
