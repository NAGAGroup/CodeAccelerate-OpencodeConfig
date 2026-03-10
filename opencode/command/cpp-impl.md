---
description: C++ implementation session — write code with approach selector (TDD / source-first / custom)
---

# /cpp-impl

Invoke CppDev to plan and execute a C++ implementation, with a choice of implementation approach.

**First**: Read standing orders directly (do NOT search — use Read tool on the exact path `.opencode/context/cpp-systems/standards/standing-orders.md`, fallback `~/.config/opencode/context/cpp-systems/standards/standing-orders.md`). Follow its instructions before proceeding.

## Usage

```
/cpp-impl [brief description of what to implement]
/cpp-impl [description] --approach=tdd
/cpp-impl [description] --approach=source-first
/cpp-impl [description] --approach=custom
```

## Approach Selector

If `--approach` is not specified, CppDev will ask.

**TDD** — Test-Driven Development
- Write failing tests first (GoogleTest / Catch2)
- Implement to make tests pass
- Refactor under green
- Best for: well-defined interfaces, library code, correctness-critical paths

**source-first** — Implementation then tests
- Implement the component
- Write tests that validate observed behaviour
- Best for: exploratory code, performance-sensitive code where test harness adds noise

**custom** — You define the approach
- CppDev will ask for your preferred sequence
- Best for: unusual constraints (no test framework, kernel-only, header-only)

## Context Loaded by CppDev

ContextScout discovers and loads context files. If `.opencode/context/cpp-systems/` exists, only local context is used. If it doesn't exist, global `~/.config/opencode/context/cpp-systems/` is the fallback. Use `/context migrate` to bring global domain context into the project permanently.

## Orientation

Before implementation begins, CppDev does a lightweight orient via `CppExplorer` (one instance per goal, in parallel) to map existing patterns, naming conventions, related tests, and integration surface. This prevents duplicate implementations and ensures new code fits the existing codebase.

## Delegation

CppDev delegates per-file/component work to `CppCoder`.
Build system changes to `CppBuildEngineer`.
