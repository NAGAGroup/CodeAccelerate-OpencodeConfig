# C++ Systems Context Navigation

This directory contains context files for C++ development agents — a specialized set of agents for expert-level modern C++20 development.

## Structure

```
cpp-systems/
├── domain/                         ← What the domain IS (concepts, tools, guidance)
│   ├── cpp-modern-standards.md     ← C++17/20/23 features and adoption status
│   └── clarifying-questions.md     ← How agents ask domain-specific questions when context is missing
├── processes/                      ← How work FLOWS (workflows, decision patterns)
│   ├── design-first-flow.md       ← D1/D2/D3 brainstorm modes + plan doc flow
│   ├── debug-investigation.md     ← CI failure, perf regression, greenfield debug
│   └── impl-approaches.md         ← TDD vs source-first vs custom + per-file delegation
├── standards/                      ← What GOOD looks like (quality gates, rules)
│   ├── cpp-code-quality.md        ← RAII, UB prevention, ownership, naming, review checklist
│   ├── performance.md             ← Roofline model, memory hierarchy, vectorization, profiling
│   └── standing-orders.md         ← Persistent delegation + approval gate rules
└── templates/                      ← Reusable OUTPUT FORMATS
    ├── pixi-cmake-scaffold.md     ← Exact pixi+CMake+nushell+preset patterns
    └── plan-doc-template.md       ← Design spec + impl spec + impl plan format
```

## Context Loading Strategy

### Always load (baked into agent system prompts)
- `standards/cpp-code-quality.md` — every implementation task
- `standards/standing-orders.md` — every orchestrator task
- `templates/pixi-cmake-scaffold.md` — every build/configure task

### Load on demand (referenced but not always active)
- `domain/cpp-modern-standards.md` — C++ language feature questions
- `domain/clarifying-questions.md` — when project context is insufficient
- `standards/performance.md` — optimization or performance-critical tasks
- `processes/design-first-flow.md` — only during `/cpp-design` flow
- `processes/debug-investigation.md` — only during `/cpp-debug` flow
- `processes/impl-approaches.md` — only during `/cpp-impl` flow
- `templates/plan-doc-template.md` — only when writing a plan doc

## Agents That Use This Context

| Agent | Primary Context Files |
|---|---|
| `CppDev` (orchestrator) | All standards + processes |
| `CppCoder` | `cpp-code-quality.md`, `pixi-cmake-scaffold.md` |
| `CppBuildEngineer` | `pixi-cmake-scaffold.md`, `cpp-code-quality.md` |
| `CppExplorer` | Domain files (on demand per exploration goal) |
| `CppDebugger` | `debug-investigation.md` + domain files (on demand) |
| `CppResearcher` | Domain files (on demand per research goal) |

## Project-Specific Context

This global context covers concepts and patterns. For project-specific details, add `.opencode/context/` to the project repo:

```
project/.opencode/context/
├── integrations/
│   ├── ci-cd.md               ← CI/CD specifics, auth, pipelines
│   ├── internal-tools.md      ← internal tool URLs, APIs
│   └── team-workflow.md       ← team-specific conventions
└── project/
    ├── architecture.md        ← this project's structure
    └── build-config.md        ← project-specific CMake/pixi overrides
```
