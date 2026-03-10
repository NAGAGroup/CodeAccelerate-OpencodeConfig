# Plan Document Template

Use this template for design-first flows. Fill in all sections before beginning implementation. Sections marked `(optional)` can be omitted for small tasks.

## File Naming

- Temporary (session only): `/tmp/plan-<component-name>.md`
- Persistent in repo: `docs/plans/plan-<component-name>.md`
- Single active plan: `PLAN.md` at repo root

---

# Plan: \<Component Name\>

**Date**: YYYY-MM-DD
**Author**: \<name or agent\>
**Status**: draft | review | approved | in-progress | done

---

## Design Spec

### Problem Statement
> What problem does this solve? One paragraph max.

### Goals
- Goal 1
- Goal 2

### Non-Goals
> Explicitly state what this does NOT address (prevents scope creep).
- Not doing X
- Not doing Y

### Constraints
- Language: C++20
- Must compile with: Clang 17+, GCC 13+ (or project-specific requirements)
- Performance: \<specific target if applicable — e.g., "must process 1M records/sec"\>
- API stability: \<stable/unstable/internal\>

### Chosen Approach
> Which design option was selected and why. Reference rejected alternatives briefly.

**Selected**: \<approach name\>
**Rationale**: \<1-3 sentences\>
**Rejected alternatives**:
- Option A: rejected because \<reason\>
- Option B: rejected because \<reason\>

### Public API Sketch
```cpp
// Header-level sketch — not final, but captures intent

class ComponentName {
public:
    // construction
    explicit ComponentName(Config cfg);

    // primary interface
    Result compute(Input input);

    // (optional) async variant
    std::future<Result> compute_async(Input input);
};
```

### Data Structures (optional)
```cpp
struct Config { ... };
struct Input  { ... };
struct Result { ... };
```

---

## Implementation Spec

### Dependencies
- Internal: \<list headers/libs from this repo this component depends on\>
- External: \<conda packages / CMake find_package targets\>

### Key Algorithms / Patterns
> Describe non-obvious implementation choices. Link to reference if applicable.

1. **Algorithm name**: brief description + pseudocode if helpful
2. **Pattern name**: why this pattern, not alternatives

### Error Handling
- Return type: `std::expected<Result, Error>` / `std::optional<T>` / exceptions (init only)
- Error conditions: \<list what can go wrong and how it's surfaced\>

### Threading / Concurrency Model (optional)
- Single-threaded
- OR: thread pool with work queue
- OR: parallel STL (execution policies)
- Shared mutable state: \<none / list with protection mechanism\>

### Testing Strategy
- Unit tests: Catch2 / GTest
- Test cases: \<list key behavioral cases, edge cases, error cases\>
- Sanitizer coverage: must pass ASan + UBSan preset
- Performance test: \<benchmark name or N/A\>

---

## Implementation Plan

> Break into per-file or per-component tasks. Each task = one `cpp-coder` delegation.

### Implementation Approach
- [ ] TDD (tests first)
- [ ] Source-first
- [ ] Custom: \_\_\_\_\_

### Tasks

```
□ [ ] include/component.hpp          — public API declaration
□ [ ] src/component.cpp              — implementation
□ [ ] tests/component_test.cpp       — unit tests
□ [ ] bench/component_bench.cpp      — (optional) benchmark
□ [ ] CMakeLists.txt update          — add targets
□ [ ] docs/component.md              — (optional) API docs
```

### Dependency Order
```
# Parallel (no deps):
  include/component.hpp
  tests/component_test.cpp  (if TDD)

# After hpp:
  src/component.cpp

# After all source:
  CMakeLists.txt update
  bench/component_bench.cpp
```

### Completion Criteria
```
□ pixi run configure   → success
□ pixi run build       → zero warnings
□ pixi run test        → all pass
□ pixi run test asan   → no sanitizer hits
□ Code review: RAII, UB, memory safety (see standards/cpp-code-quality.md)
□ Performance: (if applicable) benchmark passes regression threshold
```

---

## Notes / Open Questions (optional)

- \<Any unresolved questions or follow-up items\>
