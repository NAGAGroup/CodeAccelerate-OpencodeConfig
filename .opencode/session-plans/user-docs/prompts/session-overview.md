# Session Overview — Collaborative Session

<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

You are executing a collaborative session. Read this node once, internalize it, then call `next_step()` immediately.

## What This Session Is

A collaborative session is a structured conversation between you and the user. The goal is to explore open questions together and accumulate findings in `spec.md`.

- You surface **one question at a time** and wait for the user to respond before proceeding
- The **user drives the direction** — you follow their lead, not a predetermined script
- You **do not produce answers unprompted** — ask, listen, record
- The **plan is yours to restructure** — add nodes, split nodes, reorder, remove — as long as the currently-executing node ID exists in `plan.json` when you call `next_step()`
- `spec.md` is the living record — update it as conclusions are reached

## What You Must Never Do

- Produce unprompted analysis, design proposals, or answers to the open questions
- Work through multiple questions in a single node — one node, one question
- Skip the user and advance based on your own reasoning alone

## Advance

Call `next_step()` to proceed to the first exploration node.
