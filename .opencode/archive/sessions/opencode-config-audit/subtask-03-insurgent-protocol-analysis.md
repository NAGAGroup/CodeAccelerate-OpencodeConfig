# Subtask 03 — insurgent-protocol-analysis

## Objective

Deep analysis of all protocol files and command implementations — assess completeness, internal consistency, command/protocol alignment, and whether protocols are used to their fullest potential. Identify gaps where the protocol specifies behavior but the implementation leaves room for drift.

---

## Scope

**Read**:
- `opencode/protocols/` — all 4 files (plan-workflow.md, checkpoint.md, session-plan-schema.md, context-management.md)
- `opencode/commands/` — all 10 command files
- `opencode/headwrench.md` (for HW-side protocol references and how protocols are invoked)
- `.opencode/sessions/opencode-config-audit/notes/01-surface-sweep.md`
- `.opencode/sessions/opencode-config-audit/notes/02-agent-analysis.md`

**Write**:
- `.opencode/sessions/opencode-config-audit/notes/03-protocol-analysis.md`

**Excluded**:
- `.opencode/` runtime state except the notes files listed above
- Subagent files (covered in subtask 02)

---

## Constraints

- **ContextInsurgent is ask-only**: HeadWrench must invoke the `question` tool before delegating
- Use sequential thinking to reason through each protocol systematically
- Must investigate these specific questions:
  1. **Checkpoint completeness**: Does `checkpoint.md`'s 8-step procedure cover all necessary recovery and state-preservation cases? Are any steps ambiguous or underspecified?
  2. **Session schema vs. reality**: Does `session-plan-schema.md` accurately reflect what the actual session directories contain? Are there fields or structures referenced in the schema that differ from what's used?
  3. **Context management promotion pipeline**: Is the inbox → context promotion process in `context-management.md` clear and complete? Could a user or agent misapply it?
  4. **Command/protocol alignment**: Do the 10 command files correctly reference and follow the protocols they depend on? Are there commands that should reference a protocol but don't?
  5. **Plan workflow completeness**: Does `plan-workflow.md` fully specify the planning flow, or are there gaps that leave HW with insufficient guidance? Specifically: is the collaborative session branching well-defined?
  6. **Protocol cross-consistency**: Do the 4 protocol files reference each other correctly? Are there contradictions between them?
  7. **Utilization gaps**: Are there protocol features or steps that exist in the files but are not referenced anywhere in commands or HW instructions?
- Reference findings from notes/01 and notes/02 to avoid redundancy
- Write findings as structured note: one section per question above, severity-tagged, file-referenced

---

## Todolist

- [ ] Read prior notes (01, 02)
- [ ] Analyze checkpoint.md for completeness and ambiguity
- [ ] Compare session-plan-schema.md against actual session structure
- [ ] Analyze context-management.md promotion pipeline clarity
- [ ] Check all 10 commands for protocol alignment
- [ ] Analyze plan-workflow.md completeness (especially collaborative branching)
- [ ] Check cross-consistency between the 4 protocol files
- [ ] Identify protocol features not referenced in HW or commands
- [ ] Write findings to `notes/03-protocol-analysis.md`

---

## Delegation

**Agent**: @ContextInsurgent (`subagents/context-insurgent`)  
**Model**: Standard (sonnet-equivalent)  
**Rationale**: Multi-file cross-referencing requiring sequential reasoning across protocol files and command implementations.  
**Note**: HeadWrench must ask the user for confirmation before delegating (ask-only pattern).
