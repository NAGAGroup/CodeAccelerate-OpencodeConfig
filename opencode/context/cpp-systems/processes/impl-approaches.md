# Implementation Approaches

## Overview

When implementing code (after design approval or for a direct task), the approach should be selected explicitly. Each approach has different tradeoffs for correctness guarantees, development speed, and review quality.

## Approach Selection

The orchestrator or `/cpp-impl` command asks:

```
How should we implement this?

1. TDD: write tests first, implement until tests pass
2. Source-first: implement all components, then write tests
3. Custom: describe your approach

[1/2/3]
```

## Approach 1: TDD

**Pattern**: Tests define behavior → implementation satisfies tests

```
Step 1: Write test file(s) first
  - Delegated to cpp-coder (per-file scope)
  - Tests define the public interface contract
  - Tests should compile but fail (no implementation yet)
  - Run: pixi run test → expect failures

Step 2: Implement source files
  - cpp-coder implements per file/component
  - Can be parallelized across independent components
  - Goal: make tests pass, not to over-engineer

Step 3: Verify
  - pixi run test → all pass
  - Check for sanitizer issues: pixi run test <sanitizer-preset>
  - Orchestrator reviews for correctness, RAII, UB

Step 4: Refactor (optional)
  - Clean up implementation while keeping tests green
  - cpp-coder per-file
```

**Best for**: Public APIs, components with clear behavioral contracts, team-facing code.

**Not ideal for**: Exploratory implementations where the interface isn't known upfront.

## Approach 2: Source-First

**Pattern**: Implement → test → verify

```
Step 1: Implement all source components
  - Orchestrator maps to files/components
  - cpp-coder handles per-file (parallelized where components are independent)
  - Headers designed first, then implementation

Step 2: Write tests
  - cpp-coder writes tests after implementation
  - Tests reflect actual behavior (risk: tests may not catch design flaws)

Step 3: Verify
  - pixi run test
  - Sanitizers
  - Orchestrator review

Step 4: Fix issues found
  - cpp-coder per-file for fixes
```

**Best for**: Exploratory implementations, greenfield projects, code where interface emerges from writing.

## Approach 3: Custom

User describes their own approach. Examples encountered:

```
"header-first": write all .hpp with full API docs → review API → implement .cpp → test
"spike-first": write throwaway prototype → extract clean design → implement properly → TDD
"benchmark-driven": write benchmark harness → implement → iterate on perf → test correctness last
"port": existing implementation in another language/API → direct translation → test equivalence
```

Orchestrator adapts delegation pattern to match described approach.

## Per-File Delegation Pattern

Regardless of approach, `cpp-coder` always operates at **per-file or per-component scope**:

```
# For a component with 3 files: foo.hpp, foo.cpp, foo_test.cpp

# Parallel (no dependencies between files):
  cpp-coder: write foo.hpp (public API)
  cpp-coder: write foo_test.cpp (test stubs, if TDD)

# Sequential (foo.cpp depends on foo.hpp):
  cpp-coder: write foo.cpp (after hpp approved)

# Do NOT: ask cpp-coder to implement entire library in one call
# Do: decompose into file/component boundaries
```

## Implementation Completion Criteria

Before declaring implementation done:

```
□ pixi run configure  → succeeds (no CMake errors)
□ pixi run build      → clean build, zero warnings (or explained exceptions)
□ pixi run test       → all tests pass
□ pixi run test <sanitizer-preset> (if available) → no sanitizer hits
□ Orchestrator review: RAII correct, no UB, memory ownership clear
□ Code formatted: clang-format applied
□ clang-tidy: no new warnings (if project uses it)
```

## Notes on Parallelizing cpp-coder

When multiple files are independent (no include dependencies), cpp-coder instances can be spawned in parallel:

```
# Example: 4 independent components
Parallel:
  cpp-coder: components/reduction.hpp + reduction.cpp
  cpp-coder: components/scan.hpp + scan.cpp
  cpp-coder: components/sort.hpp + sort.cpp
  cpp-coder: components/transform.hpp + transform.cpp

Sequential after all above:
  cpp-coder: tests/component_tests.cpp (depends on all components)
```

The orchestrator is responsible for identifying and managing these dependency boundaries.
