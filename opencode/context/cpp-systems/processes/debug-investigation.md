# Debug & Investigation Flow

## Overview

Investigation workflows cover: bug reproduction, performance regression analysis, CI failure diagnosis, and hypothesis-driven exploration. These flows are not enforced — they describe common patterns to inform how the `cpp-debugger` agent approaches open-ended investigations.

## Investigation Modes

### 1. CI Failure Investigation

Common in team/project workflows. General pattern regardless of specific CI system:

```
Gather context:
  - Ticket/issue describing the work (JIRA, GitHub issue, etc.)
  - PR description, commit list, diff
  - CI failure output: build errors, test failures, sanitizer output, linker errors

Identify failure class:
  - Build error → compiler diagnostic, missing symbol, CMake config issue
  - Test failure → assertion failure, segfault, timeout
  - Sanitizer hit → ASan/UBSan/TSan report → precise source location
  - Flaky test → race condition, timing-dependent, environment-dependent

Hypothesis formation:
  - cpp-explorer scans relevant source files (parallel, per-goal)
  - Cross-reference failure location with recent changes in diff
  - Form ranked hypothesis list

Iteration:
  - cpp-debugger maintains state between hypothesis iterations
  - Each iteration: refine hypothesis → explore → narrow → propose fix
  - cpp-coder implements fix (per-file scope)
  - Re-run CI or local test to verify
```

**Note**: Concrete details (CI system URLs, proxy config, auth) belong in project-specific context. This flow describes the general approach.

### 2. Performance Regression Investigation

```
Gather baseline:
  - What was the expected perf? (previous benchmark run, roofline model, theoretical peak)
  - What is observed perf? (profiler output, benchmark numbers)
  - What changed? (diff, new dependency version, compiler upgrade)

Profiler output interpretation:
  - perf / VTune: hotspot identification, cache miss rates, branch misprediction
  - nsight compute: GPU kernel metrics (occupancy, memory bandwidth, instruction throughput)
  - nsight systems: timeline view, CPU↔GPU transfers, queue depth (if GPU work)

Hypothesis formation:
  - Memory bandwidth bound vs compute bound (roofline analysis)
  - Vectorization regression (check assembly, -Rpass=vectorize output)
  - Synchronization overhead (too many queue.wait() calls, lock contention)
  - Cache thrashing (working set size, access pattern change)

Iteration:
  - Same re-entrant pattern as CI investigation
  - cpp-debugger holds profiler output + hypothesis state across turns
```

### 3. Greenfield / Home Project Debugging

Less structured — trust the investigator. General principles:

```
- Reproduce the issue minimally (smallest reproducer)
- Add assertions liberally: assert(), sanitizers enabled
- Binary search via git bisect for regressions
- Isolate: single-threaded first, then reintroduce concurrency
- Use cpp-explorer to check relevant source sections when needed
```

## Re-Entrant Session Pattern

The `cpp-debugger` agent is designed for **persistent investigation sessions**. Unlike single-shot agents:

- It retains hypothesis history across turns
- It accumulates evidence (profiler output snippets, test results, source excerpts)
- Each new message adds to the investigation context rather than replacing it
- User can say "that hypothesis is wrong, try X instead" and the agent updates state

**Triggering**: Use `/cpp-debug` to start a session. Subsequent messages in the same conversation continue the session.

**Closing**: When fix is identified, `cpp-debugger` hands off to `cpp-coder` for per-file implementation.

## cpp-explorer Delegation Pattern

For codebase exploration during investigation, the orchestrator spawns `cpp-explorer` instances in parallel, each with a single goal:

```
# Example: investigating a memory corruption bug
Parallel exploration:
  - cpp-explorer: "find all usages of SharedBuffer::allocate() in src/"
  - cpp-explorer: "find all places where memory is freed before synchronization"
  - cpp-explorer: "find recent changes to memory management in git log --since=2weeks"

Results fed back to cpp-debugger for synthesis.
```

Each `cpp-explorer` instance is stateless and independent — no re-entrancy.

## Sanitizer Output Quick Reference

```
# AddressSanitizer (heap/stack/global)
ASAN: heap-buffer-overflow → bounds check, check pointer arithmetic
ASAN: use-after-free → check lifetime, RAII issues
ASAN: stack-use-after-scope → dangling reference to local

# UndefinedBehaviorSanitizer
UBSAN: signed-integer-overflow → check arithmetic, use unsigned or checked_add
UBSAN: null-pointer-dereference → guard pointer before use
UBSAN: misaligned-address → check alignment assumptions

# ThreadSanitizer
TSAN: data race → identify shared mutable state, add synchronization or make thread-local

# Enable in CMake preset
"cacheVariables": {
  "CMAKE_CXX_FLAGS": "-fsanitize=address,undefined -fno-omit-frame-pointer",
  "CMAKE_EXE_LINKER_FLAGS": "-fsanitize=address,undefined"
}
```

## Key Questions to Anchor Investigation

1. Is this reproducible? (deterministic vs flaky)
2. What changed? (diff, env, compiler, dependency)
3. Where does it fail? (file/line from sanitizer/backtrace)
4. What was the intended behavior vs observed?
5. Is it a logic bug, memory bug, race, or performance issue?
