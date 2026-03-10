---
name: cpp-impl-workflow
description: Structured C++ implementation session — approach selection, delegation, and review
---

# C++ Implementation Workflow

## Purpose

Orchestrate a complete implementation session from spec/plan to reviewed, working code.
Selects the implementation approach, delegates to specialized agents, and reviews output.

## Trigger

Invoked by CppDev when the user runs `/cpp-impl` or when design approval leads directly into implementation.

## Approach Selection

```
Entry
  └─ Select approach: TDD / source-first / custom
       ├─ TDD: Tests first, implement to green, refactor
       ├─ source-first: Implement, then validate
       └─ custom: User-defined sequence
```

If invoked from a completed design session (plan doc available), CppDev reads the plan doc to determine the implementation scope before presenting approach selection.

## Phase 0 — Orient (before any approach selection)

CppDev fans out `CppExplorer` instances in parallel (via `task` tool) to map the existing codebase before writing anything:
- Existing implementations of related components (prevent duplication)
- Naming conventions and code patterns in use
- Related test files and test framework in use
- Build targets that will be affected

This is read-only and runs concurrently. Results inform the approach selection and delegation plan.

## TDD Flow

**Entry condition**: Interface is well-defined, correctness is primary concern, test framework is available.

**Steps**:
1. CppDev defines the interface
2. `CppCoder` writes test scaffold (GoogleTest or Catch2)
3. Tests confirmed to fail for the right reasons
4. `CppCoder` implements one component at a time, driven by failing tests
5. CppDev reviews complete output
6. `CppBuildEngineer` invoked if build system changes needed

**Invariant**: No implementation code written before corresponding test exists.

## Source-First Flow

**Entry condition**: Performance-critical code, exploratory implementation, or test framework adds unacceptable overhead.

**Steps**:
1. CppDev outlines the implementation plan
2. `CppCoder` implements per file/component in dependency order
3. After implementation complete, `CppCoder` writes validation tests
4. CppDev reviews implementation + tests together
5. `CppBuildEngineer` invoked if build system changes needed

**Invariant**: Each component implemented before moving to the next; no orphaned dependencies.

## Custom Flow

**Entry condition**: Unusual constraints — header-only library, kernel-only, no test framework, incremental migration.

**Steps**:
1. CppDev asks for sequence preference
2. CppDev constructs a bespoke delegation plan
3. Follows that plan, validating at each step

## Component Delegation Rules

| Component Type | Delegated To | Granularity |
|---------------|--------------|-------------|
| Regular C++ file | `CppCoder` | One file per delegation |
| Header file | `CppCoder` | One header per delegation |
| Build system file | `CppBuildEngineer` | Per file |
| Test file | `CppCoder` | One test file per component |

Multiple `CppCoder` instances can run in parallel for independent components.

## Review Gate

Before reporting completion to user, CppDev reviews all output against code quality and performance standards from `cpp-systems/standards/`. Local context is used if `.opencode/context/cpp-systems/` exists, otherwise global fallback.

Review findings are either fixed immediately (minor) or presented to user with proposed fix (major/critical).

## Context Files

Context is loaded by CppDev via ContextScout. If `.opencode/context/cpp-systems/` exists, only local context is used. If it doesn't exist, global `~/.config/opencode/context/cpp-systems/` is the fallback. Key files: implementation approaches process, code quality standards, performance standards, build scaffold template, domain files on-demand.

## Agent Coordination

```
CppDev (orchestrator + reviewer)
  ├─ CppExplorer       [Phase 0, parallel orient, via task tool]
  ├─ CppCoder          [parallel for independent components, via task tool]
  ├─ CppBuildEngineer  [if build system changes needed, via task tool]
  └─ reviews all output before handoff to user
```

## Exit Criteria

Implementation is complete when:
- [ ] All components implemented per spec/plan
- [ ] Build succeeds (all configured presets)
- [ ] Tests pass (where applicable to approach)
- [ ] CppDev review: no Critical or Major findings open
- [ ] Open risks documented if any trade-offs were made
