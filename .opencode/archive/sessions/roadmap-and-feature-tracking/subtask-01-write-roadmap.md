# Subtask 01 — Write ROADMAP.md Template

## Delegation
- **Agent:** @DocWriter
- **Model tier:** fast (claude-haiku-4.5) — pure documentation writing, clear spec, no judgment required
- **Reason:** This is a new markdown file with a well-defined structure. DocWriter handles all doc creation; no code, no exploration needed.

---

## Objective

Create a `ROADMAP.md` file at the repo root (`/home/jack/CodeAccelerate-OpencodeConfig/ROADMAP.md`). This is a human-facing feature tracking document for the CodeAccelerate-OpencodeConfig project. It should be a clean, scannable template with placeholder entries — not populated with real features yet. The structure should make it easy to add new entries and understand status at a glance.

---

## Todolist

### 1. Write ROADMAP.md
- [ ] Create `/home/jack/CodeAccelerate-OpencodeConfig/ROADMAP.md`
- [ ] Include a brief header explaining this document's purpose
- [ ] Include a status legend (🔲 Planned, ▶️ In Progress, ✅ Shipped, ❌ Dropped)
- [ ] Include sections: **In Progress**, **Planned**, **Backlog**, **Recently Shipped**
- [ ] Each section has 1–2 placeholder/example rows showing the expected format
- [ ] Keep tone consistent with existing project docs (technical, concise, no marketing fluff)

---

## Scope
- **Write:** `/home/jack/CodeAccelerate-OpencodeConfig/ROADMAP.md` (new file)
- **Read:** `/home/jack/CodeAccelerate-OpencodeConfig/FEATURES.md` and `/home/jack/CodeAccelerate-OpencodeConfig/CHANGELOG.md` — for tone/style reference only
- **Excluded:** All other files — do not modify anything else

---

## Patterns
```
✅ GOOD — "▶️ session-context plugin — inject active session state to system prompt on every turn"
✅ GOOD — "🔲 custom agent hot-reload — reload agent definitions without restarting OpenCode"
❌ BAD  — Vague entries like "improve performance" without a feature name or description
❌ BAD  — Marketing language like "revolutionary AI-powered feature tracking"
❌ BAD  — Populating sections with real unconfirmed feature plans
```

---

## Constraints
- Template only — no real feature entries; placeholder rows must be clearly marked as examples
- Status icons must use: 🔲 (planned), ▶️ (in progress), ✅ (shipped), ❌ (dropped)
- Consistent with project emoji and markdown style from `FEATURES.md`
- Do NOT add a "agent-awareness" section in ROADMAP.md — that pointer lives in `navigation.md` (handled in Subtask 02)
- File goes at repo root, not inside `.opencode/`

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
