# Research: MCP Memory Plugins with Recency Decay

**Date:** 2026-03-19
**Subtask:** 01 (Slot A)
**Status:** Research complete; selection pending user gate

## Top 3 Candidates

### 🥇 OMEGA Memory
- **Install:** `pip install omega-memory[server]`
- **Backend:** SQLite + ONNX (bge-small-en-v1.5)
- **Decay:** Time-decay scoring + conflict resolution + auto-capture of decisions/lessons
- **Structured context:** Entity extraction, typed relationship graphs, semantic search, checkpoint/resume
- **MCP tools:** 25 tools (memory CRUD, search, analysis, task management)
- **Last update:** Mar 2026 (very active, v1.3.1)
- **Local-first:** ✅ zero cloud deps, no API keys
- **Trade-offs:** Python-only (3.11+), PyTorch/transformers dependency

### 🥈 @adamrdrew/agent-memory-mcp
- **Install:** `npm install -g @adamrdrew/agent-memory-mcp`
- **Backend:** LanceDB + ONNX (MiniLM ~80MB)
- **Decay:** Exponential half-life (default 30d); exempt tags `evergreen`/`never-forget`; formula: `score * 0.5^(age/half_life)`
- **Structured context:** 12 typed categories (code-solution, architecture, bug-fix, etc.), tagging, batch ops, JSON backup
- **Last update:** Feb 2026 (active, v1.1.2)
- **Local-first:** ✅ zero cloud deps
- **Trade-offs:** Node.js only, LanceDB less mature than SQLite

### 🥉 Engram (Sankhya-AI)
- **Install:** `pip install engram-memory`
- **Backend:** HelixDB (SQLite) + multi-trace ONNX
- **Decay:** FadeMem (Ebbinghaus curve) + SML/LML dual-layer; promotes on access; ~45% less storage
- **Structured context:** Skill memory, episodic scenes, agent registry, knowledge graph, handoff bus for cross-agent resumption
- **Last update:** Mar 2026 (very active, v0.4.1+)
- **Local-first:** ✅ core local; optional cloud embeddings
- **Trade-offs:** Python-only, larger footprint, multi-agent features may be overkill

## Key Finding
Official `@modelcontextprotocol/server-memory` has **no recency decay** — feature request closed as `not_planned`. The three candidates above are the only known MCP-compatible memory servers with native recency decay.

## Decision Pending
User must select plugin at Gate 1 (end of subtask 01). Selection drives:
- MCP config block in opencode.json
- Memory usage protocol in headwrench.md
- Install/setup instructions in validation subtask
