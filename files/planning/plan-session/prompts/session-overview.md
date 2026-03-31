# Session Overview

## Your Role

Your job in this node: call `next_step()` immediately. The DAG controls sequencing — each node will tell you exactly what to do.

## Permitted Actions

You MUST NOT call any tool except `next_step()` in this node. Do NOT call `question`, `task`, or any read/search tool. If any tool call unexpectedly succeeds, do not use its result — call `next_step()` immediately.

## Todo

- [ ] Call `next_step()` to advance
