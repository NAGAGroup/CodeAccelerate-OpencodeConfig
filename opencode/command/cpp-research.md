---
description: C++ research — standards, library APIs, footguns, and deep technical analysis
---

# /cpp-research

Start or continue a stateful research session with `cpp-researcher`.

## Usage

```
/cpp-research [topic or question]
/cpp-research continue                 # Continue prior research session
```

## Research Domains

- **C++ standards** (C++11 through C++26): language rules, library behaviour, UB catalogue, new features
- **Concurrency**: memory model, atomics, memory ordering, jthread/stop_token, latch/barrier/semaphore, parallel STL
- **Libraries**: Boost, Abseil, fmt, ranges-v3, Catch2, Google Benchmark, and other commonly used C++ libraries
- **Known footguns**: subtle traps, implementation-defined behaviour, common misuse patterns

## Example Queries

```
/cpp-research C++23 std::expected vs exceptions for error handling in hot paths
/cpp-research std::atomic_ref memory order requirements for reduction
/cpp-research When is std::move on a const object silently a copy?
/cpp-research Correct use of std::jthread stop_token for cooperative cancellation
/cpp-research ranges::views pipeline lazy evaluation and dangling reference risks
```

## Output Style

- Cites spec sections, standard clauses, or paper titles
- Distinguishes standard-defined vs implementation-defined behaviour
- Flags known divergences between compilers/runtimes
- No tutorials — expert-level depth assumed

## Re-entrance

`/cpp-research continue` or `/cpp-research [follow-up question]` extends the research session.
Prior findings are summarized, then new ground is covered.

## Context Loaded

ContextScout discovers and loads context files. If `.opencode/context/cpp-systems/` exists, only local context is used. If it doesn't exist, global `~/.config/opencode/context/cpp-systems/` is the fallback. Use `/context migrate` to bring global domain context into the project permanently.
