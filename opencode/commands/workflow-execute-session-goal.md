---
description: Execute a session goal through structured workflow with hard constraints
agent: tech_lead
---

You are executing a session goal using a structured workflow. The workflow plugin enforces 5 mandatory steps before you can read files or delegate implementation.

User request: "$ARGUMENTS"

## Workflow Overview

This workflow creates hard constraints via the workflow-constraints plugin. You MUST complete steps 1-5 in order before using read/glob/grep/edit/write/bash or delegating to junior_dev.

## Mandatory Steps (Plugin-Enforced)

### Step 1: Memory Search

**Required:** Search and list memories with execution context.

```typescript
memory({ mode: "list", limit: 10 })
memory({ mode: "search", query: "specific implementation keywords" })
```

**Purpose:** Access both historical knowledge AND recent session goal findings. More context available now than during goal-setting.

---

### Step 2: Initial Exploration

**Required:** Delegate to explore to refresh understanding with execution context.

Load delegation skill first:
```typescript
skill({ name: "explore-task" })
```

Then delegate:
```typescript
task({
  subagent_type: "explore",
  template_data: {
    task_description: "Re-examine codebase with implementation focus",
    areas_to_explore: "Files to be modified, integration points, dependency chains",
    deliverables: "Implementation-focused map with file paths and key functions"
  }
})
```

**Purpose:** Identify what has changed since goal-setting and locate exact implementation points.

---

### Step 3: External Research (or Skip)

**Required:** Delegate to librarian for implementation patterns, OR skip if not needed.

**Option A - Research needed:**
```typescript
skill({ name: "librarian-task" })
task({
  subagent_type: "librarian",
  template_data: {
    research_goal: "Find implementation patterns and code examples for [specific feature]",
    sources: "API docs, implementation guides, security best practices",
    deliverables: "Code examples and implementation checklist"
  }
})
```

**Option B - Skip research:**
```typescript
skip_librarian({
  reason: "Sufficient context from goal-setting phase"
})
```

**Purpose:** Get concrete implementation patterns and examples for the work ahead.

---

### Step 4: Specialized Exploration

**Required:** Delegate to multiple explore agents (in parallel) for implementation-specific deep dives.

```typescript
// Load skill once
skill({ name: "explore-task" })

// Delegate multiple agents in parallel - focus on implementation details
task({
  subagent_type: "explore",
  template_data: {
    task_description: "Map exact functions and dependencies for auth middleware",
    areas_to_explore: "auth.js:15-45, session.js:20-30, validation.js",
    deliverables: "Function signatures, dependencies, test files"
  }
})

task({
  subagent_type: "explore",
  template_data: {
    task_description: "Identify test patterns and fixtures for this module",
    areas_to_explore: "test/ directory, existing test patterns, mock data",
    deliverables: "Test structure and patterns to follow"
  }
})
```

**Purpose:** Get precise implementation details - line numbers, function names, test patterns.

---

### Step 5: Clarifying Questions (or Skip)

**Required:** Ask user for implementation decisions, OR skip if approach is clear.

**Option A - Questions needed:**
```typescript
question({
  questions: [
    {
      header: "Error Handling Strategy",
      question: "How should validation errors be handled?",
      options: [
        { label: "Throw exceptions", description: "Use try-catch blocks with custom error classes" },
        { label: "Return error objects", description: "Return { error: ... } format" }
      ]
    }
  ]
})
```

**Option B - Skip questions:**
```typescript
skip_questions({
  reason: "Implementation approach is clear from goal-setting phase"
})
```

**Purpose:** Resolve any remaining ambiguities before writing code.

---

## After Steps 1-5 Complete

Once all 5 steps are done, proceed with goal-specific execution:

### Implementation Phase

1. **Delegate to junior_dev** for code implementation
   ```typescript
   skill({ name: "junior_dev-task" })
   task({
     subagent_type: "junior_dev",
     template_data: {
       task: "Implement OAuth2 middleware",
       files: ["/path/to/auth.js", "/path/to/middleware.js"],
       spec: "Detailed numbered steps with exact code",
       acceptance_criteria: "What done looks like",
       constraints: "Style rules and patterns to follow"
     }
   })
   ```

2. **Delegate to test_runner** for verification
   ```typescript
   skill({ name: "test_runner-task" })
   task({
     subagent_type: "test_runner",
     template_data: {
       test_commands: ["npm test", "npm run lint"],
       success_criteria: "All tests pass, no lint errors",
       on_failure: "Report detailed error output"
     }
   })
   ```

3. **Iterate** if needed
   - Analyze test_runner failures
   - Create NEW, MORE DETAILED spec for junior_dev
   - Never reuse failed specs - add more detail

4. **Document** changes
   - Update README or relevant docs
   - Add inline comments for complex logic
   - Update CHANGELOG if applicable

---

## Execution Patterns

### Pattern 1: Single-File Implementation

```
Steps 1-5 complete
→ Delegate to junior_dev (single file)
→ Delegate to test_runner (verify)
→ Done or iterate
```

### Pattern 2: Multi-Phase Implementation

```
Steps 1-5 complete
→ Phase 1: Core functionality (junior_dev → test_runner)
→ Phase 2: Error handling (junior_dev → test_runner)
→ Phase 3: Edge cases (junior_dev → test_runner)
→ Documentation (tech_lead edits .md files)
```

### Pattern 3: Complex Refactor

```
Steps 1-5 complete
→ Parallel junior_dev delegations (multiple independent files)
→ Single test_runner delegation (verify all)
→ If failures: targeted fixes
→ Final verification
```

---

## Examples

**Example 1: Implement OAuth2 from goal**
```
After steps 1-5:

1. Delegate to junior_dev:
   - Create auth/oauth2.js with PKCE implementation
   - Update middleware/auth.js to use OAuth2
   - Add config/oauth.js for provider configuration

2. Delegate to test_runner:
   - Run npm test
   - Verify OAuth flow tests pass
   - Check for TypeScript errors

3. If tests pass:
   - Update README.md with OAuth2 setup instructions
   - Mark session complete

4. If tests fail:
   - Analyze failure output
   - Create detailed fix spec for junior_dev
   - Re-verify with test_runner
```

**Example 2: Refactor error handling**
```
After steps 1-5:

1. Phase 1 - Create infrastructure:
   - junior_dev: Create middleware/errorHandler.js
   - junior_dev: Create utils/errors.js with error classes
   - test_runner: Verify no regressions

2. Phase 2 - Update routes (parallel):
   - junior_dev: Update routes/auth.js
   - junior_dev: Update routes/api.js
   - junior_dev: Update routes/admin.js
   - test_runner: Run full test suite

3. Phase 3 - Documentation:
   - Edit docs/ERROR_HANDLING.md
   - Update API documentation

4. Final verification:
   - test_runner: Full suite + lint
   - Commit and push if passing
```

---

## Why This Workflow?

**Hard constraints before implementation:**
- Forces thorough understanding before code changes
- Prevents "code first, understand later" antipattern
- Ensures consistency across all implementation sessions

**Structured delegation:**
- junior_dev gets precise, detailed specs
- test_runner provides immediate feedback
- tech_lead coordinates without touching code

**Iterative refinement:**
- Test failures inform better specs
- Each iteration adds more detail
- Never reuse failed approaches

**Cost optimization:**
- Haiku 4.5 (junior_dev, explore) for routine work
- Sonnet 4.5 (tech_lead, librarian) for coordination and research
- No wasted context on premature implementation

---

## Success Criteria

Execution is complete when:
- All implementation code is written and tested
- All tests pass (verified by test_runner)
- Documentation is updated
- Changes are committed to version control
- User receives complete summary of what was accomplished
