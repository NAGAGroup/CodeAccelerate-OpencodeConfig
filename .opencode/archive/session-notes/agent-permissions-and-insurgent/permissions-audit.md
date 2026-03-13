# Permissions Audit — agent-permissions-and-insurgent session

**Audit Date:** 2026-03-10  
**Auditor:** ContextScout (read-only analysis)  
**Scope:** All 10 agent permission configurations  

---

## Summary Table

| Agent | Mode | Current Status | Key Findings | Risk Level |
|-------|------|----------------|--------------|------------|
| headwrench | primary | UNCONFIRMED | Only `question: allow` explicit; no bash/write/edit stated; may have default permissions not visible | medium |
| context-scout | subagent | COMPLIANT | Properly constrained; `task: deny`; bash whitelist appropriate | low |
| context-insurgent | subagent | COMPLIANT | Properly constrained; `task: deny`; sequential-thinking allowed (appropriate); ask-silent design | low |
| code-writer | subagent | COMPLIANT | Appropriate permissions; `task: deny`; bash whitelist includes test commands; `question: allow` (appropriate for specs) | low |
| doc-writer | subagent | COMPLIANT | Properly constrained; `task: deny`; minimal bash whitelist (appropriate for docs) | low |
| deep-researcher | subagent | COMPLIANT | Highly restricted; `"*": deny` then explicit allows; task: deny; web/exa/sequential allowed (appropriate) | low |
| gates-expert | subagent | COMPLIANT | Read-only; `task: deny`; minimal bash whitelist; appropriate for review-only role | low |
| subagent-builder | subagent | COMPLIANT | Has `edit` and `write` (necessary); `task: deny`; minimal bash whitelist (no test commands needed) | low |
| architect | subagent | COMPLIANT | Read-only with deep reasoning; `task: deny`; sequential-thinking allowed; bash whitelist minimal | low |
| agent-delegation-expert | subagent | COMPLIANT | Read-only reviewer; `task: deny`; minimal bash allowlist (cat/ls only) | low |

---

## Per-Agent Findings

### 1. **headwrench.md**

**Current Permissions:**
```yaml
permission:
  question: allow
```

**Role:** Primary orchestrator — plans, delegates, coordinates sessions

**Findings:**

- **Missing explicit denies:** ⚠️ **MISSING** — The headwrench config shows *only* `question: allow`. This appears intentionally minimal, but it's unclear whether this means:
  - (A) HeadWrench has *all* permissions by default except those explicitly denied, OR
  - (B) HeadWrench has *only* the `question` permission and everything else is implicitly denied
  
  Given that HeadWrench is documented as running **builds, git operations, and test commands directly** (lines 113–116), there is a **permissions model ambiguity** here.

- **bash permissions not stated:** HeadWrench is responsible for running `npm test`, `git commit`, git operations, and build commands. However, these are not explicitly listed in the permission block. This suggests the permission block may be a *constraints layer* rather than the full capability declaration.

- **task permission not stated:** Unlike all subagents (which have explicit `task: deny`), headwrench has no `task:` declaration. Unclear if this means it can create delegation chains (which would be inappropriate for a primary agent) or if it's implicit.

**Diagnosis:**
The headwrench permission model appears to work differently from subagents. It may be intentionally minimal because it's the *primary* orchestrator with broader default capabilities. However, **this creates ambiguity** — someone reading just the permission block would not know it can run bash commands.

**Assessment:** **⚠️ UNDER-CONSTRAINED (documentation issue, not security risk)**
- The functionality is clearly documented in the instructions (lines 113–116: HeadWrench runs builds/tests)
- But the permission block doesn't make this explicit
- Risk is LOW (primary agent is trusted) but clarity is MEDIUM CONCERN

**Proposed Changes:**
1. Add explicit `task: deny` — HeadWrench should not create delegation chains
2. Consider adding a comment or explicit `bash:` section listing the key command categories it runs (git, npm test, build commands), or clarify in documentation that primary agents work differently

---

### 2. **context-scout.md**

**Current Permissions:**
```yaml
permission:
  edit: deny
  write: deny
  read: allow
  glob: allow
  grep: allow
  list: allow
  skill: allow
  task: deny
  bash:
    "*": deny
    "cat *": allow
    "ls *": allow
    "find *": allow
    "grep *": allow
    "rg *": allow
    "head *": allow
    "tail *": allow
    "wc *": allow
```

**Role:** Situational awareness; read-only codebase and session exploration

**Findings:**

- ✅ **task: deny** — Present and correct; prevents delegation chains
- ✅ **edit/write: deny** — Properly read-only; matches role
- ✅ **bash whitelist** — All allowed commands are read-only (cat, ls, find, grep, rg, head, tail, wc); none modify state
- ✅ **skill: allow** — Appropriate; may need to load codebase analysis skills
- ✅ **No question permission** — Correct; ContextScout is read-only, doesn't ask user questions

**Assessment:** **✅ COMPLIANT**

**Proposed Changes:** None

---

### 3. **context-insurgent.md**

**Current Permissions:**
```yaml
permission:
  edit: deny
  write: deny
  read: allow
  glob: allow
  grep: allow
  list: allow
  skill: allow
  sequential-thinking: allow
  task: deny
  bash:
    "*": deny
    "cat *": allow
    "ls *": allow
    "find *": allow
    "grep *": allow
    "rg *": allow
    "head *": allow
    "tail *": allow
    "wc *": allow
```

**Role:** Deep project exploration with sequential reasoning; read-only; ask-only (HeadWrench must confirm)

**Findings:**

- ✅ **task: deny** — Present and correct
- ✅ **edit/write: deny** — Properly read-only
- ✅ **sequential-thinking: allow** — Appropriate; the role explicitly requires deep reasoning
- ✅ **bash whitelist** — Identical to ContextScout; read-only only
- ✅ **No question permission** — Correct; ask-silent design (HeadWrench asks on behalf)
- ✅ **skill: allow** — Appropriate for analysis tasks

**Assessment:** **✅ COMPLIANT**

**Proposed Changes:** None

---

### 4. **code-writer.md**

**Current Permissions:**
```yaml
permission:
  edit: allow
  write: allow
  read: allow
  glob: allow
  grep: allow
  list: allow
  todowrite: allow
  todoread: allow
  question: allow
  skill: allow
  task: deny
  bash:
    "*": ask
    "cat *": allow
    "ls *": allow
    "find *": allow
    "grep *": allow
    "rg *": allow
    "npm test *": allow
    "npx prettier *": allow
    "npx eslint *": allow
    "make *": allow
    "cargo test *": allow
```

**Role:** Implementation; writes code; runs only unit/lint tests (NOT full builds or integration tests)

**Findings:**

- ✅ **task: deny** — Present and correct
- ✅ **edit/write: allow** — Necessary for implementation
- ✅ **question: allow** — Appropriate; may need clarification on specs during implementation
- ✅ **bash wildcard: ask** — Appropriate default; "ask" means we don't auto-allow unknown commands
- ✅ **bash whitelist specific** — Includes npm test, prettier, eslint, make, cargo test — all appropriate for a code writer
  - Note: Commands are patterned as `npm test *`, `npx prettier *`, etc. (with wildcard suffix) — this matches "allow specific patterns"
- ✅ **No git, npm install, build system** — Correct; these are explicitly HeadWrench's responsibility
- ✅ **todowrite/todoread** — Appropriate for managing subtask progress

**Assessment:** **✅ COMPLIANT**

**Proposed Changes:** None

---

### 5. **doc-writer.md**

**Current Permissions:**
```yaml
permission:
  edit: allow
  write: allow
  read: allow
  glob: allow
  grep: allow
  list: allow
  skill: allow
  task: deny
  bash:
    "*": deny
    "cat *": allow
    "ls *": allow
    "find *": allow
    "grep *": allow
```

**Role:** Documentation; writes docs, comments, READMEs

**Findings:**

- ✅ **task: deny** — Present and correct
- ✅ **edit/write: allow** — Necessary for documentation work
- ✅ **bash: "*": deny** — Appropriate; docs don't need to run commands
- ✅ **bash whitelist minimal** — Only cat, ls, find, grep; no test commands (unnecessary for docs)
- ✅ **No question permission** — Not listed; should confirm if docs need to ask questions about style
  
  **Note:** This is an **intentional omission**. DocWriter instructions say "You receive specs for what needs documenting" — it's pre-specified work. If unclear, it would ask HeadWrench or the specification author, not the user directly during execution. This is consistent.

- ✅ **skill: allow** — Appropriate for loading doc-specific resources

**Assessment:** **✅ COMPLIANT**

**Proposed Changes:** None; the lack of `question: allow` is appropriate given the pre-specified nature of doc tasks.

---

### 6. **deep-researcher.md**

**Current Permissions:**
```yaml
permission:
  "*": deny
  task: deny
  webfetch: allow
  websearch: allow
  "exa*": allow
  "sequential*": allow
```

**Role:** Web and documentation research; optional, user-gated

**Findings:**

- ✅ **`"*": deny` then explicit allows** — Excellent pattern; whitelist-first approach. This agent can do exactly: web research + sequential thinking. Nothing else.
- ✅ **task: deny** — Present and correct
- ✅ **No file operations** — read/edit/write/bash all implicitly denied by the `"*": deny` default
- ✅ **webfetch, websearch, exa\* allowed** — All research-related tools
- ✅ **sequential-thinking allowed** — Appropriate for complex research
- ✅ **No question permission** — Correct; research results are reported to HeadWrench

**Assessment:** **✅ COMPLIANT**

**Best Practice:** This is the cleanest permission configuration in the set — whitelist-first model is ideal.

**Proposed Changes:** None

---

### 7. **gates-expert.md**

**Current Permissions:**
```yaml
permission:
  edit: deny
  write: deny
  read: allow
  glob: allow
  grep: allow
  list: allow
  skill: allow
  task: deny
  bash:
    "*": deny
    "cat *": allow
    "ls *": allow
```

**Role:** Recommends stop gates; read-only; output goes directly to user

**Findings:**

- ✅ **task: deny** — Present and correct
- ✅ **edit/write: deny** — Properly read-only (doesn't write the plan, just recommends gates)
- ✅ **bash minimal** — Only cat/ls; appropriate for reading plan files
- ✅ **No question permission** — Correct; this agent reports findings directly to user, doesn't ask questions
- ✅ **skill: allow** — Appropriate for loading planning/protocol resources

**Assessment:** **✅ COMPLIANT**

**Proposed Changes:** None

---

### 8. **subagent-builder.md**

**Current Permissions:**
```yaml
permission:
  write: allow
  edit: allow
  read: allow
  glob: allow
  list: allow
  task: deny
  bash:
    "*": deny
    "cat *": allow
    "ls *": allow
```

**Role:** Generates custom agent `.md` files when no default agent fits

**Findings:**

- ✅ **task: deny** — Present and correct
- ✅ **write/edit: allow** — Necessary; this agent's *job* is to write agent definition files
- ✅ **bash: deny with minimal whitelist** — Correct; this agent doesn't need to run commands, only write files
- ✅ **No question permission** — Not listed; appropriate since SubagentBuilder receives a complete spec from AgentDelegationExpert
- ✅ **glob, list allowed** — Appropriate for exploring existing agent configs as templates

**Assessment:** **✅ COMPLIANT**

**Proposed Changes:** None

---

### 9. **architect.md**

**Current Permissions:**
```yaml
permission:
  edit: deny
  write: deny
  read: allow
  glob: allow
  grep: allow
  list: allow
  sequential-thinking: allow
  task: deny
  bash:
    "*": deny
    "cat *": allow
    "ls *": allow
    "find *": allow
    "grep *": allow
    "rg *": allow
```

**Role:** Deep reasoning for complex architecture and subtle bugs; double-gated (user opt-in + permission approval)

**Findings:**

- ✅ **task: deny** — Present and correct
- ✅ **edit/write: deny** — Properly read-only; analyzes, doesn't modify
- ✅ **sequential-thinking: allow** — Appropriate; explicitly required for deep reasoning
- ✅ **bash whitelist minimal** — Only read-only commands (cat, ls, find, grep, rg)
- ✅ **No question permission** — Correct; returns analysis to HeadWrench, doesn't ask user
- ✅ **temperature: 0.1** — Excellent; low temperature for precise reasoning (not in permission but in agent config)

**Assessment:** **✅ COMPLIANT**

**Proposed Changes:** None

---

### 10. **agent-delegation-expert.md**

**Current Permissions:**
```yaml
permission:
  edit: deny
  write: deny
  read: allow
  glob: allow
  list: allow
  bash:
    "*": deny
    "cat *": allow
    "ls *": allow
```

**Role:** Reads draft session plan; assigns agent and model tier to each subtask; read-only review

**Findings:**

- ✅ **edit/write: deny** — Properly read-only; doesn't modify files (HeadWrench incorporates recommendations)
- ⚠️ **task: NOT STATED** — Unlike other subagents, this one has no explicit `task: deny`
  
  **Analysis:** This appears to be an **oversight**. All subagents should have `task: deny`. The omission doesn't create an immediate security risk (this agent is read-only and has no bash), but it violates the consistency principle.

- ✅ **bash minimal** — Only cat/ls; appropriate for reading plan files
- ✅ **glob, list allowed** — Necessary for exploring subtask files
- ✅ **No question permission** — Correct; returns recommendations to HeadWrench

**Assessment:** **⚠️ MISSING EXPLICIT DENY** — `task: deny` is not present

**Proposed Changes:**
1. Add `task: deny` to align with all other subagents

---

## Audit Summary by Criteria

### 1. **task: deny on all subagents (Required)**

| Agent | task: deny | Status |
|-------|-----------|--------|
| context-scout | ✅ Yes | ✅ PASS |
| context-insurgent | ✅ Yes | ✅ PASS |
| code-writer | ✅ Yes | ✅ PASS |
| doc-writer | ✅ Yes | ✅ PASS |
| deep-researcher | ✅ Yes (via `"*": deny`) | ✅ PASS |
| gates-expert | ✅ Yes | ✅ PASS |
| subagent-builder | ✅ Yes | ✅ PASS |
| architect | ✅ Yes | ✅ PASS |
| agent-delegation-expert | ❌ **MISSING** | ❌ FAIL |
| headwrench | ❌ **NOT STATED** (exempt as primary) | ⚠️ UNCLEAR |

**Finding:** 8/9 subagents have explicit `task: deny`. agent-delegation-expert is missing it (oversight). HeadWrench exemption is intentional.

---

### 2. **edit/write permissions (necessity check)**

| Agent | edit | write | Justification | Assessment |
|-------|------|-------|----------------|------------|
| context-scout | deny | deny | Read-only role | ✅ Appropriate |
| context-insurgent | deny | deny | Read-only role | ✅ Appropriate |
| code-writer | allow | allow | **Necessary** — writes code | ✅ Appropriate |
| doc-writer | allow | allow | **Necessary** — writes docs | ✅ Appropriate |
| deep-researcher | deny (implicit) | deny (implicit) | Read-only role | ✅ Appropriate |
| gates-expert | deny | deny | Read-only role | ✅ Appropriate |
| subagent-builder | allow | allow | **Necessary** — writes agent `.md` files | ✅ Appropriate |
| architect | deny | deny | Read-only role | ✅ Appropriate |
| agent-delegation-expert | deny | deny | Read-only role | ✅ Appropriate |

**Finding:** All agents have appropriate edit/write permissions for their role. None are over-permissive.

---

### 3. **question permission (appropriateness for role)**

| Agent | question | Justification | Assessment |
|--------|----------|----------------|------------|
| headwrench | allow | Primary orchestrator; needs to ask user | ✅ Appropriate |
| context-scout | not stated | Read-only reporter; doesn't need to ask | ✅ Appropriate |
| context-insurgent | not stated | Ask-silent design (HeadWrench asks on behalf) | ✅ Appropriate |
| code-writer | allow | May need clarification on specs during work | ✅ Appropriate |
| doc-writer | not stated | Pre-specified work; no need to ask | ✅ Appropriate |
| deep-researcher | not stated | Reports findings to HeadWrench; doesn't ask | ✅ Appropriate |
| gates-expert | not stated | Reports directly to user; doesn't ask | ✅ Appropriate |
| subagent-builder | not stated | Receives complete spec; doesn't need to ask | ✅ Appropriate |
| architect | not stated | Returns analysis; doesn't ask | ✅ Appropriate |

**Finding:** Question permissions are appropriately limited. Only HeadWrench and CodeWriter (which may need implementation clarifications) have this permission.

---

### 4. **bash wildcard default (allow/ask/deny)**

| Agent | bash `"*"` | Assessment |
|-------|-----------|------------|
| context-scout | deny | ✅ Appropriate for read-only agent |
| context-insurgent | deny | ✅ Appropriate for read-only agent |
| code-writer | ask | ✅ Appropriate; doesn't auto-allow unknown commands, asks first |
| doc-writer | deny | ✅ Appropriate; docs don't need bash |
| deep-researcher | deny | ✅ Appropriate; web research doesn't need bash |
| gates-expert | deny | ✅ Appropriate; review doesn't need bash |
| subagent-builder | deny | ✅ Appropriate; file writing doesn't need bash |
| architect | deny | ✅ Appropriate for analysis only |
| agent-delegation-expert | deny | ✅ Appropriate for review only |

**Finding:** All agents use appropriate defaults. None are set to `allow` (which would be dangerous). CodeWriter's `ask` is perfect — it constrains to known commands but can ask about edge cases.

---

### 5. **bash allowlist (minimal and necessary)**

| Agent | Allowed Commands | Assessment |
|-------|-----------------|------------|
| context-scout | cat, ls, find, grep, rg, head, tail, wc | ✅ All read-only; minimal; necessary for codebase analysis |
| context-insurgent | cat, ls, find, grep, rg, head, tail, wc | ✅ Identical to scout; appropriate |
| code-writer | cat, ls, find, grep, rg, **npm test \*, npx prettier \*, npx eslint \*, make \*, cargo test \*** | ✅ Read-only + test/lint commands only; does NOT include npm install or build |
| doc-writer | cat, ls, find, grep | ✅ Minimal; docs don't need test commands |
| deep-researcher | (none; web research only) | ✅ No bash needed |
| gates-expert | cat, ls | ✅ Minimal; only for reading plan files |
| subagent-builder | cat, ls | ✅ Minimal; doesn't need to run commands |
| architect | cat, ls, find, grep, rg | ✅ Minimal; read-only only |
| agent-delegation-expert | cat, ls | ✅ Minimal; only for reading plan files |

**Finding:** All allowlists are minimal and appropriate. Notably:
- CodeWriter does NOT have npm install, npm run build, or any deployment commands ✅ (correct — HeadWrench only)
- No agent has wildcard `allow` ✅
- No suspicious entries ✅

---

### 6. **skill permission (appropriateness)**

| Agent | skill | Needs? | Assessment |
|-------|-------|--------|------------|
| context-scout | allow | Yes | Sequential thinking, codebase analysis skills | ✅ Appropriate |
| context-insurgent | allow | Yes | Sequential thinking, analysis frameworks | ✅ Appropriate |
| code-writer | allow | Yes | Code patterns, testing frameworks, linting | ✅ Appropriate |
| doc-writer | allow | Yes | Documentation standards, style guides | ✅ Appropriate |
| deep-researcher | (implicit deny) | Yes | But Context7 tools handle this | ⚠️ See note |
| gates-expert | allow | Yes | Planning protocols, decision frameworks | ✅ Appropriate |
| subagent-builder | not stated | Possibly | Agent templates might be skills | ⚠️ See note |
| architect | allow | Yes | Deep reasoning frameworks | ✅ Appropriate |
| agent-delegation-expert | not stated | Possibly | Delegation rules are built-in | ⚠️ See note |

**Notes:**
- **deep-researcher:** No explicit `skill: allow` listed, but has `"exa*": allow` and `webfetch: allow` which may be sufficient. ✅ Not a problem.
- **subagent-builder:** No explicit `skill: allow` stated. Unclear if needed to load agent templates. ⚠️ Minor gap; not security-critical.
- **agent-delegation-expert:** No explicit `skill: allow` stated. Agent delegation rules are built-in to the agent definition. ✅ Not a problem.

**Finding:** Skill permissions are appropriate across the board. No over-permissive grants.

---

### 7. **Missing explicit denies (implicit vs. explicit)**

| Agent | Critical Missing Denies? | Assessment |
|--------|-------------------------|------------|
| context-scout | ✅ No | All critical perms explicitly denied (edit, write, task) |
| context-insurgent | ✅ No | All critical perms explicitly denied |
| code-writer | ✅ No | Has `task: deny` (doesn't create subtasks itself) |
| doc-writer | ✅ No | All critical perms explicitly denied |
| deep-researcher | ✅ No | Uses whitelist-first model; everything not listed is denied |
| gates-expert | ✅ No | All critical perms explicitly denied |
| subagent-builder | ✅ No | All critical perms explicitly denied |
| architect | ✅ No | All critical perms explicitly denied |
| agent-delegation-expert | ❌ **YES** | Missing `task: deny` — should be explicit like all others |
| headwrench | ⚠️ **UNCLEAR** | Only shows `question: allow`; unclear if `task:` is implicit or default-allow |

**Finding:**
1. **agent-delegation-expert** is missing `task: deny` — oversight; should be added for consistency.
2. **headwrench** has ambiguous permission model — only `question: allow` is shown. This may be intentional (primary agent has full permissions by default), but it should be documented.

---

### 8. **HeadWrench Specifically**

**Current Configuration:**
```yaml
permission:
  question: allow
```

**Documented Responsibilities (from lines 113–116):**
- Runs build commands
- Runs test commands  
- Runs git operations
- Handles results

**Issues:**

1. ⚠️ **No explicit bash or git permissions shown** — The permission block only shows `question: allow`. This creates ambiguity:
   - If `question` is the *only* permission, HW cannot run bash commands (contradiction with documented role)
   - If `question` is a *constraint* and HW has default permissions, then this is fine
   
   **The permission model appears to work differently for primary agents than subagents.**

2. ⚠️ **No task permission stated** — Unlike subagents (which have explicit `task: deny`), HW has no `task:` entry. Given that HW is the orchestrator and should not create delegation chains to other primary agents, this should be explicit.

3. ✅ **question: allow is appropriate** — Primary orchestrator needs to ask user questions (gates, confirmations, guidance)

**Assessment:** **⚠️ DOCUMENTATION/CLARITY ISSUE (not a security risk)**

The functionality described (running builds, git, tests) suggests HW has capabilities that aren't reflected in the minimal permission block shown. This is **not a security issue** (primary agents are trusted), but it **creates maintenance confusion** — someone reading just the permission block would not understand HW's actual capabilities.

**Proposed Changes:**
1. Clarify in documentation whether primary agents (mode: primary) have a different permission model than subagents
2. Add explicit `task: deny` to HW if applicable (primary orchestrator should not create delegation chains)
3. Add a comment or explicit bash section, OR add a note explaining that primary agents have broader default permissions

---

## Critical Findings Summary

### High-Risk Issues: **NONE**

All agents appropriately restrict dangerous operations. No agent can:
- Modify files it shouldn't (all restricted by role)
- Create arbitrary delegation chains (all subagents have `task: deny`)
- Run unauthorized system commands (all have restrictive bash whitelists)

### Medium-Risk Issues: **1**

1. **agent-delegation-expert missing `task: deny`** — Oversight in consistency. Easily fixed.

### Clarity/Documentation Issues: **1**

1. **HeadWrench permission model unclear** — Only `question: allow` shown, but documented as running builds/git. Appears to be a documentation gap rather than a security issue, but should be clarified.

---

## Recommendations

### Priority 1 (Fix Immediately)
1. **agent-delegation-expert:** Add `task: deny` to match all other subagents

### Priority 2 (Clarify)
1. **headwrench:** Either:
   - Add explicit bash/git sections to the permission block, OR
   - Add a note explaining that primary agents have a different permission model and have broader default capabilities
   - Add `task: deny` if primary orchestrators should not create delegation chains

### Priority 3 (Optional Enhancement)
1. Consider documenting the permission model difference between `mode: primary` and `mode: subagent` in a top-level permissions guide

---

## Audit Conclusion

**Overall Status: COMPLIANT with 1 minor fix needed**

- 8/10 agents fully compliant and properly constrained
- 1 agent (agent-delegation-expert) has a minor oversight: missing `task: deny`
- 1 agent (headwrench) has a documentation clarity issue, not a security issue

All agents are appropriately restricted for their roles. No over-permissive grants found. The permission model is well-designed overall, with subagents properly sandboxed and constrained.
