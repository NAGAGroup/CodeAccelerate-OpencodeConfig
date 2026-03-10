---
description: C++ design session — brainstorm, architecture, and planning
---

# /cpp-design

Invoke CppDev to start a structured design session for a C++ problem.

**First**: Read standing orders directly (do NOT search — use Read tool on the exact path `.opencode/context/cpp-systems/standards/standing-orders.md`, fallback `~/.config/opencode/context/cpp-systems/standards/standing-orders.md`). Follow its instructions before proceeding.

## Usage

```
/cpp-design [brief description of the problem or system]
```

## What Happens

CppDev will ask you to choose a design mode:

**D1 — Conversation-first**
Best for: exploratory problems where the solution space is unclear.
Flow: open-ended dialogue → constraint lock-in → parallel research (researcher+explorer) → plan doc

**D2 — Brief-and-fan-out**
Best for: well-understood problem class, need to move fast.
Flow: 1-paragraph brief → immediate fan-out (researcher + explorer in parallel) → draft design → iterate

**D3 — Structured phases**
Best for: high-stakes decisions that need documented rationale.
Flow: problem framing → design space mapping → decision → plan doc with ADRs

## Context Loaded by CppDev

ContextScout discovers and loads context files. If `.opencode/context/cpp-systems/` exists, only local context is used. If it doesn't exist, global `~/.config/opencode/context/cpp-systems/` is the fallback. Use `/context migrate` to bring global domain context into the project permanently.

## Output

A plan document following the plan doc template from `cpp-systems/templates/`, or
an in-progress design conversation if you choose D1/D2 mode.
