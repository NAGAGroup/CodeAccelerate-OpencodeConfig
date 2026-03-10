---
description: C++ code review — file, selection, or PR-level review with performance and correctness awareness
---

# /cpp-review

Invoke CppDev to review C++ code for correctness, performance, and standards compliance.

**First**: Read standing orders directly (do NOT search — use Read tool on the exact path `.opencode/context/cpp-systems/standards/standing-orders.md`, fallback `~/.config/opencode/context/cpp-systems/standards/standing-orders.md`). Follow its instructions before proceeding.

## Usage

```
/cpp-review                        # Review current file or selection
/cpp-review path/to/file.cpp       # Review specific file
/cpp-review path/to/file.cpp:10-50 # Review line range
/cpp-review --pr                   # Review all changes in current branch (git diff)
```

## Review Orchestration Protocol

CppDev follows a multi-pass, parallel-first approach. Do not short-circuit these phases.

### Phase 0 — Orient (CppDev, lightweight)

Before dispatching anything, CppDev does a minimal orient pass:
- Identify the review scope (files, line ranges, or PR diff)
- Scan file headers and includes to detect: concurrency primitives, build-system involvement, test code
- Determine which specialist lenses are needed (correctness, performance, standards, build)
- Decide how to partition the exploration goals for parallel dispatch

This is a fast read — not a full analysis. The goal is to dispatch intelligently, not to review yet.

### Phase 1 — Parallel First-Pass (fan-out)

CppDev dispatches **concurrently**:

**`CppExplorer` instances** (invoke via `task` tool, one per goal, all in parallel):
- Symbol usage: find all callers/users of types and functions being reviewed
- Dependency surface: what other components depend on the reviewed code
- Pattern scan: identify antipatterns (raw `new/delete`, mutex usage, thread safety issues)
- Test coverage: locate existing tests for the reviewed component (if any)

**`CppResearcher`** (invoke via `task` tool, if non-obvious standards questions arise during Phase 0):
- Specific UB questions, memory ordering correctness, C++20/23 feature usage

All first-pass agents operate **read-only**. Their output is structured findings, not a final verdict.

### Phase 2 — Synthesis + Gap Identification (CppDev)

CppDev receives all Phase 1 results and:
- Merges findings, eliminating duplicates
- Identifies gaps: findings that need more context (e.g. a suspected race needs the full lock acquisition order; a kernel issue needs the buffer lifetime trace)
- Ranks preliminary findings by severity: Critical / Major / Minor / Nit

### Phase 3 — Targeted Follow-up (CppDev-directed, as needed)

CppDev dispatches **focused** follow-up queries to fill confirmed gaps:
- `CppExplorer`: specific symbol traces, lock acquisition order, lifetime of a specific resource
- `CppResearcher`: confirm whether a specific pattern is UB or implementation-defined

This phase is narrow — only what Phase 2 identified as genuinely unresolved.

### Phase 4 — Final Review (CppDev)

CppDev synthesizes all findings into the output format below. This is the only thing the user sees — intermediate phase outputs are not surfaced unless the user asks.

---

## What Gets Reviewed

### Correctness
- UB: signed overflow, strict aliasing, lifetime violations, unsequenced modifications
- Memory: raw owning pointers, missing RAII, mismatched new/delete
- Concurrency: data races, incorrect memory ordering, lock misuse

### Performance
- False sharing in shared-memory structures
- Non-sequential or cache-unfriendly memory access patterns
- Unnecessary copies or redundant allocations in hot paths
- Threading overhead vs work ratio

### Standards Compliance
- C++20 idioms where applicable
- Naming conventions (snake_case for functions/variables, PascalCase for types)
- Include hygiene, forward declarations
- `const`-correctness throughout

### Code Quality
- Clarity vs cleverness tradeoffs flagged
- Magic numbers → named constants
- Comment quality (why, not what)

---

## Context Loaded

CppDev loads context during Phase 0 via ContextScout. If `.opencode/context/cpp-systems/` exists, only local context is used. If it doesn't exist, global `~/.config/opencode/context/cpp-systems/` is the fallback.

Passed to subagents explicitly — they do not load context independently.

---

## Output Format

```
## Review: <scope>

### Critical
- `file.cpp:NN` — <issue>: <explanation> → <fix>

### Major
- `file.cpp:NN` — <issue>: <explanation> → <fix>

### Minor
- ...

### Nits
- ...

### Coverage Notes
<what was NOT reviewed and why — e.g. "test files excluded", "build system out of scope">
```

If no issues found in a severity tier, omit that tier entirely.
