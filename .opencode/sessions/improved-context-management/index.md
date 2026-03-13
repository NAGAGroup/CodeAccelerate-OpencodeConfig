# Session: improved-context-management

**Goal:** Design and implement a tiered context management system that eliminates accumulated stale and competing context from reaching agents, with manual slash commands for guided context hygiene.

---

## Done Criteria

- [ ] A formal tiered context model exists as a protocol, defining which context sources agents see and under what staleness rules
- [ ] Inbox items have a standardized metadata header enabling staleness detection and supersession
- [ ] Session notes are scoped to active sessions only — completed-session notes are archived and not surfaced during planning
- [ ] At least one slash command exists that runs a guided context-audit workflow (auto-analyzes, proposes cleanup, user approves)
- [ ] Checkpoint protocol is updated to enforce new inbox metadata and note lifecycle rules
- [ ] Existing inbox and session notes are cleaned up and conform to the new system

---

## Subtask Table

| # | Status | Description |
|---|--------|-------------|
| 01 | ✅ completed | Deep audit of all session notes and inbox — ContextScout / fast |
| 02 | 🔄 in_progress | Design tiered context architecture — HeadWrench direct / standard |
| G1 | 🚫 GATE | Architecture review gate — user approves design before any writing begins |
| 03 | 🔲 pending | Write context-management protocol — DocWriter / standard |
| 04 | 🔲 pending | Update checkpoint protocol — DocWriter / standard |
| 05 | 🔲 pending | Write slash commands for context management — CodeWriter / standard |
| 06 | 🔲 pending | Archive and cleanup existing stale content — HeadWrench direct |
| 07 | 🔲 pending | Final validation — HeadWrench direct |

> Note: Subtasks 03 and 04 are sequential — 04 reads context-management.md written in 03.

---

## Gates

### G1 — Architecture Review

**Stop condition:** Subtask 02 has produced a complete architecture design (tiered model, staleness rules, slash command specs). Do not begin writing any protocol files or slash commands until the user has reviewed and approved the proposed architecture.

**What the user must approve:**
- The tiered context model (what tiers exist, what each tier contains)
- Staleness rules (when does each tier expire or get pruned?)
- Conflict resolution strategy (how do competing inbox items get resolved?)
- What each new slash command does and how it behaves

---

## Current Focus

**Now:** Subtask 02 in progress — synthesizing audit results into architecture design.  
**Next:** G1 gate — architecture review before writing begins.

---

## Scope

**In scope:**
- Protocol files in `opencode/protocols/`
- Slash commands in `opencode/commands/`
- Existing `.opencode/inbox/` files (cleanup/archival)
- Existing `.opencode/sessions/*/notes/` files (archival of completed session notes)
- Checkpoint protocol update to enforce new inbox metadata format

**Out of scope:**
- Automated plugins for continuous context monitoring
- Changes to `spec.json` / `index.md` format
- Changes to the DCP compaction override system
- Changes to subagent isolated prompt delivery (that system works correctly)
- Changes to how active session subtask files are loaded at runtime

---

## Patterns & Constraints

- `spec.json` remains the authoritative recovery anchor — no changes
- Subtask file isolation preserved — only current subtask loaded at runtime
- Checkpoint structure (8 steps) preserved
- Inbox continues as one-observation-per-file, but files gain a metadata header
- Session notes remain session-scoped; new rule added for post-session archival
- Circuit breaker threshold: 3
- Branch: commit directly to main
- Architect: disabled
