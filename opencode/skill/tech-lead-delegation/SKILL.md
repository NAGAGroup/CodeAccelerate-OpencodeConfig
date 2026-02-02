---
name: tech-lead-delegation
description: How to delegate work to specialized agents
---

# Delegation Guide

## Your Specialized Agents

| Agent | Use For |
|-------|---------|
| **explore** | Deep codebase analysis, extensive file mapping |
| **librarian** | External research, API docs, library usage |
| **junior_dev** | ALL code implementation (no bash access) |
| **test_runner** | ALL builds, tests, verification (bash for build/test commands) |
| **general_runner** | ALL other bash commands (git, setup, user-requested commands) |

> [!IMPORTANT]
> - junior_dev has NO bash access. Always delegate verification to test_runner after implementation.
> - You (tech_lead) have NO bash access. Delegate git/setup commands to general_runner.

---

## Delegation Protocol

> [!CAUTION]
> You MUST load the skill template before using the task tool.

### Every Delegation Follows This Pattern:

```typescript
// Step 1: Load the -task skill template
skill({ name: "junior_dev-task" })

// Step 2: Review template_data fields shown in skill
// Step 3: Delegate with complete data
task({
  description: "Brief task description",
  subagent_type: "junior_dev",
  template_data: {
    // Fill ALL required fields from template
    // The -task skill shows exactly what's needed
  }
})
```

> [!TIP]
> The `-task` skill shows all required template_data fields with descriptions. Load it first to see what you need to provide.

---

## Core Workflow Patterns

### Pattern 1: Simple Implementation

```
User request
    ↓
Analyze codebase (read/grep/glob)
    ↓
Ask clarifying questions if needed
    ↓
junior_dev implements
    ↓
test_runner verifies
    ↓
Success or iterate with NEW spec
```

**Example:** "Add dark mode toggle"
1. Read settings page components
2. Search for existing theme patterns
3. Ask: "Should preference persist?" (question tool)
4. Delegate to junior_dev with detailed spec
5. Delegate to test_runner to verify
6. Report results

---

### Pattern 2: Research-First Approach

```
User request
    ↓
librarian researches ← → explore analyzes
    ↓
Synthesize findings
    ↓
junior_dev implements
    ↓
test_runner verifies
```

**Example:** "Implement OAuth2"
1. Ask clarifying questions (which provider? token storage?)
2. Delegate to librarian (OAuth2 best practices)
3. Delegate to explore (existing auth code) - in parallel
4. Create architectural plan (write markdown)
5. Delegate to junior_dev in phases
6. Delegate to test_runner after each phase

---

### Pattern 3: Command Execution

```
User request (git/setup command)
    ↓
Understand what needs to be done
    ↓
general_runner executes command
    ↓
Review output and report
```

**Example:** "Commit these changes"
1. Review what files have been modified
2. Delegate to general_runner with git commands
3. Report results to user

**Example:** "Install dependencies"
1. Check package.json or requirements.txt
2. Delegate to general_runner with install command
3. Report results

---

### Pattern 4: Bug Fix

```
User report
    ↓
Read code + search patterns
    ↓
test_runner reproduces issue
    ↓
Analyze error output
    ↓
junior_dev fixes with detailed spec
    ↓
test_runner verifies fix
```

**Example:** "Login endpoint returns 500"
1. Read login endpoint code
2. Search for error handling patterns
3. Delegate to test_runner to run and capture errors
4. Analyze test_runner output to identify root cause
5. Delegate to junior_dev with specific fix
6. Delegate to test_runner to verify

---

## Iteration Pattern

> [!WARNING]
> When test_runner reports failures, NEVER say "try again" or reuse the same spec.

### Wrong Approach:
```
Tests failed. Try again.
```

### Correct Approach:
1. Analyze the failure output carefully
2. Identify the root cause
3. Write a NEW, MORE DETAILED spec
4. Delegate to junior_dev with improved spec
5. Delegate to test_runner again

> [!TIP]
> Each iteration should include MORE detail than the previous one, addressing specific failure points.

---

## Advanced Patterns

### Parallel Delegation

When tasks are independent:

```typescript
// Load both skills first
skill({ name: "librarian-task" })
skill({ name: "explore-task" })

// Delegate both in same message
task({ subagent_type: "librarian", template_data: {...} })
task({ subagent_type: "explore", template_data: {...} })

// Wait for both, then synthesize results
```

---

### Session Management

For multi-step tasks requiring shared context:

```typescript
// First delegation
task({
  session_id: "feature-oauth",
  subagent_type: "junior_dev",
  template_data: {...}
})

// Follow-up delegation (shares context)
task({
  session_id: "feature-oauth",  // Same ID = shared memory
  subagent_type: "junior_dev",
  template_data: {...}
})
```

> [!NOTE]
> Without session_id, each delegation is stateless. Use session_id when agents need to remember previous context.

---

### Phased Implementation

For large features, break into phases:

**Each phase:**
1. Delegate to junior_dev for implementation
2. Delegate to test_runner for verification
3. If pass → Next phase; if fail → Improve spec and retry

**Example phases:** Core functionality → Error handling → Edge cases

---

## When to Suggest Build Agent

The build agent is for exceptional circumstances only.

Suggest build agent when:
- Delegation has failed 3+ times
- Task requires tight integration across 15+ files
- Needs simultaneous changes to frontend, backend, database, infrastructure, tests, and docs
- User is frustrated with delegation overhead
- Task requires rapid iteration that delegation would slow down

> [!WARNING]
> Default approach: ALWAYS try delegation first. Build agent is the exception, not the rule.

---

## Common Delegation Mistakes

| Mistake | Correct Approach |
|---------|------------------|
| Delegating without loading skill | Load skill first, then delegate |
| Incomplete template_data | Fill ALL required fields shown in -task skill |
| Reusing failed specs | Write NEW spec with more detail |
| Sequential when parallel works | Delegate to multiple agents in same message |
| No session_id for multi-step | Use session_id for shared context |
