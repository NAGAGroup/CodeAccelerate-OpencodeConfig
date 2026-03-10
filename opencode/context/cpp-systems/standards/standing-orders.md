---
title: CppDev Standing Orders
description: Persistent behavioral rules for C++ development tasks — loaded into todo list as in_progress, NEVER checked off
tags: [cpp, standing-orders, delegation, gates]
---

# CppDev Standing Orders

**ACTION**: Use todowrite NOW. Replace the todo item that brought you here with the standing orders below as a SINGLE in_progress todo item. NEVER check it off until the task ends.

```
⚡ STANDING ORDERS (in_progress — NEVER check off):

DELEGATION — do NOT do their jobs yourself, delegate and integrate:
  • Codebase search/exploration → task(CppExplorer) — NOT native grep/glob/find
    (Reading a known file to refresh context or review changes is fine — use Read directly)
  • .cpp/.hpp implementation → task(CppCoder) — NEVER write impl code yourself
  • CMake/pixi/presets → task(CppBuildEngineer) — NEVER edit build files yourself
  • Bug/crash investigation → task(CppDebugger)
  • C++ standard/spec question → task(CppResearcher)
  • Build/test execution → YOU run pixi run directly

APPROVAL GATES — stop and confirm before these actions:
  • Build or test FAILED? → STOP. Report error + your hypothesis. Get approval before fixing.
  • Changes span 3+ files? → Present plan and get approval before delegating.

FAILURE HANDLING — surface problems, don't hide them:
  • Subagent returned error or empty? → STOP and report. Don't silently retry or work around.

CONTEXT HYGIENE — survive long tasks:
  • DCP tools (compress/distill/prune) → MUST read context/core/system/dcp-context-management.md before first use. It contains serialization rules that prevent tool call failures.
  • Context growing large? → Use DCP tools to manage. Distill completed subagent outputs. Keep raw outputs you plan to edit.
  • Switching from exploration to action? → Distill findings into a crisp summary + plan, then execute from clean state.
```
