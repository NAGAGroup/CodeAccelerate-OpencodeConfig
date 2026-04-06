# DAG Design Guide

For @dag-designer and @dag-reviewer. Design principles are review criteria.

## Core Concept

You design **work structure, not work content**. Choose component types, node count, and connections. The executing agent decides what to do at each node by reading Qdrant notes.

**You control:** component types, node count, connections, branch conditions, rationale (stored to Qdrant)  
**You don't control:** what agent does at each node, component prompts (static templates)

**Common mistake:** Writing prescriptive rationale ("modify config file X"). Wrong. Write intent and context, not steps.

---

## Core Rules

1. **Investigate before work.** Place `project-search-and-analysis` before `work-item`. Agent needs current state before changing anything.

2. **Verify after each change.** Pattern: `work-item → verify`. Don't batch: `work → work → work → verify` makes failures hard to isolate.

3. **Commit after verified changes.** Pattern: `verify → commit`. Creates stable savepoints.

4. **Compress at phase boundaries.** Pattern: `write-notes → compress → kickoff-refresher`. Never skip `kickoff-refresher` after `compress` — agent needs to reload skills and context.

5. **Branch for real alternatives.** Use `decision-gate` when path depends on discoveries. Use `user-decision-gate` when user chooses.

6. **Converge when paths rejoin.** Multiple branches can point to the same node (multiple parents). Use when all paths need the same next step.

7. **Fail branches end in plan-fail.** Never end failure paths in `plan-success`. That signals false completion.

8. **More nodes is safer.** Extra capacity costs time but prevents replanning. When unsure, include it.

---

## Convergence (Multiple Parents)

Nodes can have multiple parents. Use when different paths need the same next step.

**When to converge:**
- After decision branches that all need the same verification
- After parallel investigations that feed into one analysis
- After retry loops that rejoin the main path

**Example — branches converge to shared commit:**
```
verify → decision-gate
  ├─ (pass) → commit-changes
  └─ (fail) → fix-work → verify-fix → commit-changes
                                          ↓
                                     write-notes → plan-success
```

Both paths point to `commit-changes`. It has 2 parents. Executes when either path reaches it.

**When NOT to converge:**
- Branches need different next steps (keep separate)
- Context from different paths conflicts (keep separate)
- Branches represent fundamentally different outcomes (use separate terminals)

---

## Component Selection

**project-search-and-analysis:** Understand codebase state (files, structure, tests)  
**sequential-thinking:** Pure reasoning (no external input needed)  
**write-notes:** Store findings to Qdrant for later retrieval  
**decision-gate:** Choose branch based on discoveries  
**user-decision-gate:** User chooses branch  
**user-discussion:** Open conversation (no branching)  
**autonomous-work:** Only with explicit user approval. No safety constraints.

---

## Node IDs

**Every node must have a unique ID.** No duplicates allowed, even for the same component type.

Good: `work-fix-auth`, `verify-tokens`, `investigate-logging`, `work-retry-auth`, `verify-retry`  
Bad: `node-1`, `step-3`, `work-item-2`, reusing `work-item` or `verify` multiple times

When using the same component type multiple times (like retry loops), add suffixes: `verify-initial`, `verify-retry`, `verify-final`.

Descriptive unique IDs help executor understand routing and make diagrams readable.

---

## Common Patterns

Node IDs shown are descriptive examples. Component type is separate (not shown in ASCII).

**Simple linear:**
```
investigate-auth → fix-validation → verify-fix → commit-auth → done
```

**With research:**
```
investigate-api → research-patterns → implement-handler → verify-handler → commit-api → done
```

**Multi-step:**
```
investigate-db → add-migration → verify-migration → update-models → verify-models → commit-db → done
```

**Branch with retry:**
```
investigate-auth → implement-tokens → verify-tokens → check-tests
  ├─ (pass) → commit-tokens → done
  └─ (fail) → fix-token-issues → verify-token-fix → recheck-tests
       ├─ (pass) → commit-tokens → done
       └─ (fail) → fail-tokens
```
Every node has unique descriptive ID. `verify-tokens` and `verify-token-fix` are different nodes.

**Convergent branches (multiple parents):**
```
investigate-config → choose-approach
  ├─ (json) → implement-json-parser → verify-json → finalize-config
  └─ (yaml) → implement-yaml-parser → verify-yaml → finalize-config
                                                         ↓
                                                    commit-config → done
```
Both `verify-json` and `verify-yaml` point to `finalize-config`. One node, two parents. This is convergence.

**With compression:**
```
investigate-large-refactor → analyze-dependencies → store-findings → compress-context → refresh-context → 
implement-phase-1 → verify-phase-1 → commit-phase-1 → done
```

---

## Rationale Storage

Store notes to Qdrant explaining structural decisions:
- Why this component at this position
- What executor should use this node for
- What failure scenarios the structure handles
- What assumptions the structure makes

**For branching nodes:** Store note by exact node ID explaining each branch and when to take it.

Executor reads rationale to understand intent, not to follow prescriptive steps.

---

## Anti-Patterns

**Investigation-free work:** `work-item` without prior `project-search-and-analysis`. Agent lacks context.

**Verification batching:** `work → work → work → verify`. Can't isolate which change broke.

**Compress without kickoff-refresher:** `compress → work-item`. Agent loses skills and context.

**Prescriptive rationale:** "Modify config file X". Agent decides implementation, not DAG.

**Failure → plan-success:** Signals false completion. Use `plan-fail` for failure terminals.

**autonomous-work by default:** Only with explicit user approval. Bypasses all safety constraints.

**Premature convergence:** Converging before branches are truly ready for shared next step. Keep separate if context differs.
