# Prompt Engineering Test Harness — Iterative Strategy

**Last updated:** 2026-04-07  
**Status:** Running

---

## Goal

Empirically determine what prompt structures work with Qwen3.5:9b (9B parameter local model) by running realistic dispatch prompts through each subagent and observing tool-call trajectories. Use findings to lock down system prompts, skills, and node library prompts.

---

## Three-Step Iterative Strategy

### Step 1 — Lock Down Each Subagent

For each subagent (context-scout, context-insurgent, dag-designer, dag-reviewer, junior-dev, documentation-expert, tailwrench, external-scout, autonomous-agent):

- Send a realistic single-dispatch prompt — what headwrench would actually send during a real task
- The agent runs with its system prompt + skills, constrained by its permission frontmatter
- Capture the full tool-call trajectory via SSE
- 3 trials per agent for non-determinism
- Observe: did it reason before acting? delegate correctly? store findings? return prose?

**Output:** Locked-down system prompts and skill files per agent, grounded in what actually works.

### Step 2 — Lock Down Headwrench + Planning DAG (Interactive)

- Use Step 1 findings to update planning DAG node prompts and headwrench-specific skill files
- Run a planning session E2E interactively with headwrench (requires human monitoring)
- If headwrench does unwanted things, stop, iterate, retry
- Goal: headwrench can design a DAG E2E without deviation

### Step 3 — Update Node Library Prompts

- By this point, established templates exist from Steps 1-2
- Apply templates to all node library component prompts
- No individual testing needed — templates are already validated

---

## Test Infrastructure

- **Server:** `ocx oc -p naga-ollama serve --port 4096` (Qwen3.5:9b, reasoningEffort:"none")
- **Runner:** `bun run test/runner.ts --type=<agents|node-library|catalogue>`
- **Agent tests:** `test/agent-prompts.ts` — one realistic dispatch prompt per agent
- **Qdrant:** localhost:6333, collection `prompt-engineering-test-harness`
- **Agent routing:** `POST /session {"agentID": "dag-designer"}` — routes to that agent's system prompt

### Key Design Decision

Agent tests use `agentID` in the session creation request to route to the correct agent. The test prompt is a realistic single-dispatch (what headwrench would send). Agents are constrained by their permission frontmatter — we observe actual behavior, not expected tool lists.

---

## Current Status

### Step 1 — Subagent Tests
- [ ] agents test run (9 agents × 3 trials)
- [ ] pattern analysis per agent
- [ ] update system prompts and skills based on findings

### Step 2 — Headwrench E2E (Interactive — requires human)
- [ ] update planning DAG node prompts
- [ ] update headwrench skills
- [ ] run E2E planning session, iterate until correct

### Step 3 — Node Library
- [ ] apply templates to node library prompts

---

## Findings (updated as work progresses)

*To be filled in during execution.*

---

## Changelog

- **2026-04-07:** Rebuilt test infrastructure. Removed `mode: subagent` from all agent files. Redesigned runner to use per-agent realistic dispatch prompts with `agentID` routing via OpenCode HTTP API. Fixed manifest catalogue path bug. Dropped `expectedTools` — agents are constrained by permission frontmatter, behavior is what we observe.
- **2026-04-06:** Initial test runner built. Fixed profile deployment to use `ocx oc -p naga-ollama serve`. Updated dag-design-guide, dag-designer, dag-reviewer, dag-design skill, spec/06 with sequential-only model and problem decomposition principles.
