---
name: tech-lead-workflow-patterns
description: Standard workflow patterns for different types of requests
---

## Standard Workflow Patterns

### Pattern 1: Simple Implementation

1. Analyze codebase (read, grep, glob)
2. Ask clarifying questions if needed
3. Delegate to junior_dev (implementation)
4. Delegate to test_runner (verification)
5. If tests fail: analyze output, create NEW refined spec for junior_dev

**Flow diagram:**

```
User request
    ↓
Read/analyze codebase
    ↓
Create implementation plan
    ↓
junior_dev implements
    ↓
test_runner verifies
    ↓
Success or iterate
```

### Pattern 2: Research-First Approach

1. Delegate to librarian (gather external knowledge)
2. Delegate to explore (understand existing codebase)
3. Synthesize findings into implementation plan
4. Delegate to junior_dev (implementation)
5. Delegate to test_runner (verification)

**Flow diagram:**

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

### Pattern 3: Complex Multi-Step Features

1. Ask clarifying questions to understand full scope
2. Create breakdown plan (consider using todolist for tracking)
3. Delegate exploration (explore) and research (librarian) in parallel
4. Document architectural approach in markdown
5. Delegate implementation in logical phases (junior_dev)
6. Delegate verification after each phase (test_runner)
7. Iterate based on feedback

> [!TIP]
> Use the todolist tool (todowrite/todoread) to track progress on complex multi-step tasks.

## Detailed Workflow Examples

### Example 1: Simple Feature Request

**User:** "Add a dark mode toggle to the settings page"

**Your approach:**

1. Read settings page and related components (read tool)
2. Search for existing theme/styling patterns (grep tool)
3. Ask: "Should dark mode preference persist across sessions?" (question tool)
4. Create plan:
   - Add toggle component to settings UI
   - Implement theme state management
   - Add CSS for dark theme
   - Persist preference in localStorage
5. Load skill → Delegate to junior_dev: implement toggle component and state
6. Load skill → Delegate to test_runner: verify functionality
7. Report results to user

### Example 2: Complex Feature with Unknowns

**User:** "Implement OAuth2 authentication"

**Your approach:**

1. Ask clarifying questions (question tool):
   - Which OAuth provider? (Google, GitHub, custom)
   - What grant type? (authorization code, implicit, etc.)
   - Where should tokens be stored?
2. Load skill → Delegate to librarian: research OAuth2 best practices for chosen provider
3. Load skill → Delegate to explore: find existing auth-related code
4. Create architectural plan document (write markdown)
5. Load skill → Delegate to junior_dev: implement in phases
   - Phase 1: Provider configuration
   - Phase 2: Auth routes and callbacks
   - Phase 3: Token handling and storage
6. Load skill → Delegate to test_runner: verify each phase
7. Document configuration steps in markdown
8. Report completion to user

### Example 3: Bug Fix Request

**User:** "Fix the login endpoint - it's returning 500 errors"

**Your approach:**

1. Read the login endpoint code (read tool)
2. Search for related error handling and logging (grep tool)
3. Load skill → Delegate to test_runner: run tests and capture error details
4. Analyze error output from test_runner
5. Identify root cause (e.g., missing null check, wrong error handling)
6. Load skill → Delegate to junior_dev: implement fix with detailed spec
7. Load skill → Delegate to test_runner: verify fix resolves issue
8. Ask: "Should we add better error handling?" (question tool)
9. Report completion and any recommendations

### Example 4: Refactoring Request

**User:** "Refactor the API routes to use a controller pattern"

**Your approach:**

1. Read existing route files (read tool)
2. Search for all route definitions (grep tool)
3. Load skill → Delegate to explore: map out all API routes and their handlers
4. Create refactoring plan (write markdown):
   - Extract business logic into controllers
   - Keep routes thin (routing only)
   - Maintain existing API contracts
5. Create todolist to track progress:
   - Extract user routes to UserController
   - Extract auth routes to AuthController
   - Extract product routes to ProductController
   - Update tests
6. Load skill → Delegate to junior_dev: implement controller extraction (one at a time)
7. Load skill → Delegate to test_runner: verify after each controller
8. Update documentation (write markdown)
9. Report completion

## Iteration & Failure Handling

> [!WARNING]
> When test_runner reports failures, NEVER say "try again" or delegate with the same spec.

### Wrong Approach

```
Tests failed. Try again.
```

### Correct Approach

1. Analyze the failure output carefully
2. Identify the root cause (what specific error occurred?)
3. Understand what went wrong (why did it fail?)
4. Write a NEW detailed spec addressing the specific issues
5. Delegate to junior_dev with the improved spec
6. Delegate to test_runner again

> [!TIP]
> Each iteration should have a MORE detailed spec than the previous one, based on lessons learned from the failure.

## Delegation Flow Chart

```
User Request
    ↓
┌───────────────────┐
│  Understand Req   │ ← Ask clarifying questions (question tool)
└─────────┬─────────┘
          ↓
┌───────────────────┐
│  Analyze Current  │ ← Read/grep/glob codebase
│     Codebase      │
└─────────┬─────────┘
          ↓
┌───────────────────┐
│  Research Needed? │
└─────────┬─────────┘
          ↓
    Yes ↙   ↘ No
       ↓     ↓
┌──────────┐ ┌──────────┐
│librarian │ │  explore │
│ research │ │ analyze  │
└────┬─────┘ └────┬─────┘
     ↓            ↓
     └─────┬──────┘
           ↓
┌───────────────────┐
│   Create Plan     │ ← Document in markdown
└─────────┬─────────┘
          ↓
┌───────────────────┐
│  junior_dev impl  │ ← Delegate implementation
└─────────┬─────────┘
          ↓
┌───────────────────┐
│ test_runner verify│ ← Delegate verification
└─────────┬─────────┘
          ↓
    Pass ↙  ↘ Fail
        ↓    ↓
    ┌────┐  ┌──────────────┐
    │Done│  │Analyze & Fix │ → Back to junior_dev (new spec)
    └────┘  └──────────────┘
```
