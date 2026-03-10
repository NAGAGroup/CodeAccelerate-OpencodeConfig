---
description: Show a complete guide to the C++ development system — agents, commands, workflows, and usage patterns
---

# /cpp-help

Invoke CppDev to give a complete, practical guide to the C++ development system available in this config.

## Usage

```
/cpp-help
/cpp-help [topic]          # Focus on a specific area
```

## What CppDev Explains

When invoked without arguments, CppDev produces a full guide covering:

### 1. Agent Roster
What each agent does, when to use it, and what model tier it runs on:
- **CppDev** — orchestrator, reviewer, primary interaction point
- **cpp-coder** — per-file C++ implementation (cheap, fast)
- **cpp-build-engineer** — pixi/CMake/presets configuration
- **cpp-explorer** — parallel stateless codebase search (one goal per instance)
- **cpp-debugger** — stateful CI/crash/perf investigation
- **cpp-researcher** — stateful C++ standards / library deep dives

### 2. Commands Reference
When and how to use each command, with concrete example invocations:
- `/cpp-design` — design modes D1/D2/D3
- `/cpp-impl` — implementation with approach selector
- `/cpp-review` — file/range/PR-level review
- `/cpp-debug` — stateful debugging sessions
- `/cpp-research` — standards/spec research
- `/cpp-build` — build system configuration and diagnosis
- `/cpp-help` — this guide

### 3. Typical Workflows
End-to-end usage patterns:
- **New feature**: `/cpp-design` → approve plan → `/cpp-impl`
- **Bug investigation**: `/cpp-debug [paste error]` → `/cpp-debug continue` → fix
- **Code review**: `/cpp-review path/to/file.cpp` or `/cpp-review --pr`
- **Build broken**: `/cpp-build diagnose` or `/cpp-build scaffold`
- **Quick research**: `/cpp-research [specific question]`

### 4. Context System
What domain knowledge is available and where:
- If `.opencode/context/cpp-systems/` exists in the project → that is the source of truth, global is ignored
- If not → `~/.config/opencode/context/cpp-systems/navigation.md` is the fallback index
- Use `/context migrate` to permanently bring global domain knowledge into your project
- Domain: modern C++ standards, clarifying questions guide
- Processes: design-first flow, debug investigation, implementation approaches
- Standards: C++ code quality, performance
- Templates: pixi+CMake scaffold, plan doc

### 5. Power-User Tips
- `CppExplorer` can be launched in parallel — give each instance one goal
- `CppDebugger` and `CppResearcher` are re-entrant — say "continue" to resume
- `/cpp-design D3` produces a fully documented plan with ADRs, good for team review
- `/cpp-impl --approach=tdd` enforces test-first; use `source-first` for exploratory code
- CppDev always reviews delegated output before reporting back — you see the final result, not intermediate drafts

## Focus Topics

```
/cpp-help build         # pixi+CMake stack in detail
/cpp-help design        # D1/D2/D3 design modes explained
/cpp-help debug         # Debugging workflow and environment setup
/cpp-help agents        # Full agent delegation map
```
