# Usage Guide

This guide shows practical examples of using tech_lead delegation for real-world development tasks.

## Example 1: Adding a New Feature

**Scenario:** You need to add authentication middleware to an Express.js API.

### Your Request

```
Add JWT authentication middleware to our Express API. Research best practices,
implement the middleware, and update all protected routes to use it.
```

### How tech_lead Handles It

**Step 1: Research (librarian)**
```
tech_lead delegates to librarian:
"Research JWT authentication best practices for Express.js, 
including token validation, error handling, and security considerations"
```

librarian returns current best practices and recommended patterns.

**Step 2: Find Existing Code (explore)**
```
tech_lead delegates to explore:
"Find all API route definitions and existing middleware setup"
```

explore identifies:
- `src/middleware/` directory
- `src/routes/api/*.js` files
- Current auth patterns (if any)

**Step 3: Implement (junior_dev)**
```
tech_lead delegates to junior_dev:
"Create JWT auth middleware at src/middleware/auth.js using the patterns
from research. Update routes in src/routes/api/ to use the middleware."
```

junior_dev creates the middleware and updates routes.

**Step 4: Verify (test_runner)**
```
tech_lead delegates to test_runner:
"Run the test suite and verify auth middleware is working correctly"
```

test_runner reports test results and any failures.

### What You See

```
I'll help you add JWT authentication. Let me research best practices,
locate the relevant code, implement the middleware, and verify it works.

[Progress updates as each step completes...]

[OK] Researched JWT best practices
[OK] Located 8 route files and existing middleware structure
[OK] Implemented auth.js middleware with token validation
[OK] Updated 12 protected routes to use authentication
[OK] Tests passing - authentication working correctly

The new middleware is at src/middleware/auth.js and includes:
- Token validation with proper error handling
- Automatic 401 responses for invalid tokens
- Request context enrichment with user data

All protected routes now require valid JWT tokens.
```

### Key Takeaway

You described the **goal**, tech_lead figured out the **workflow**.

## Example 2: Debugging and Fixing

**Scenario:** Tests are failing and you need to investigate why.

### Your Request

```
The user registration tests are failing. Figure out why and fix it.
```

### How tech_lead Handles It

**Step 1: Run Tests (test_runner)**
```
tech_lead delegates to test_runner:
"Run the user registration test suite and provide detailed failure output"
```

test_runner reports:
```
3 failures in user-registration.test.js:
- "should validate email format" - validation not working
- "should hash passwords" - bcrypt undefined error
- "should prevent duplicate emails" - database constraint missing
```

**Step 2: Find Related Code (explore)**
```
tech_lead delegates to explore:
"Find user registration handler, validation logic, and user model schema"
```

explore identifies the relevant files.

**Step 3: Fix Issues (junior_dev)**
```
tech_lead delegates to junior_dev:
"Fix three issues:
1. Add email validation using validator library
2. Import bcrypt in user controller
3. Add unique constraint to email field in user model"
```

junior_dev makes the fixes.

**Step 4: Verify Fix (test_runner)**
```
tech_lead delegates to test_runner:
"Re-run user registration tests to confirm fixes"
```

test_runner confirms all tests passing.

### What You See

```
I'll investigate the test failures and fix them.

[Runs tests first...]
Found 3 failures related to validation, missing imports, and database constraints.

[Locates code...]
Identified the user controller, validation logic, and model schema.

[Makes fixes...]
[OK] Added email validation
[OK] Fixed bcrypt import
[OK] Added database constraint

[Verifies...]
All user registration tests now passing [OK]

Changes made:
- src/controllers/user.js: Added validator import
- src/controllers/user.js: Fixed bcrypt import
- src/models/user.js: Added unique constraint to email field
```

### Key Takeaway

tech_lead **diagnosed the problem** and **coordinated the fix** across multiple files.

## Example 3: Refactoring for Maintainability

**Scenario:** You want to improve code organization.

### Your Request

```
Our API error handling is inconsistent. Create a centralized error handler
and update all routes to use it.
```

### How tech_lead Handles It

**Step 1: Assess Current State (explore)**
```
tech_lead delegates to explore:
"Find all error handling patterns in route files and middleware"
```

explore finds scattered try-catch blocks and inconsistent error responses.

**Step 2: Research Pattern (librarian)**
```
tech_lead delegates to librarian:
"Look up Express.js centralized error handling best practices"
```

librarian returns recommended patterns for error middleware.

**Step 3: Implement (junior_dev)**
```
tech_lead delegates to junior_dev:
"Create centralized error handling middleware at src/middleware/errorHandler.js.
Update all route files to use consistent error throwing instead of
scattered try-catch blocks."
```

junior_dev creates the middleware and refactors route files.

**Step 4: Verify (test_runner)**
```
tech_lead delegates to test_runner:
"Run full test suite to ensure error handling refactor didn't break anything"
```

test_runner confirms everything works.

### What You See

```
I'll help refactor error handling to use a centralized approach.

[Analyzes current state...]
Found inconsistent error handling across 15 route files.

[Researches best practices...]
Identified the Express error middleware pattern as the best approach.

[Implements changes...]
[OK] Created centralized error handler middleware
[OK] Refactored 15 route files to use consistent error throwing
[OK] Added custom error classes for different error types

[Verifies...]
All tests passing - error handling now centralized and consistent [OK]

The new error handler provides:
- Consistent JSON error responses
- Proper HTTP status codes
- Development vs production error details
- Logging of all errors
```

### Key Takeaway

tech_lead can **research**, **implement**, and **verify** refactoring work.

## Common Patterns

### Pattern: Find All Instances

**Use Case:** Update all uses of a deprecated pattern

```
Find all instances of the old database connection pattern
and update them to use the new connection pool
```

tech_lead will:
1. Use **explore** to find all files with old pattern
2. Use **junior_dev** to update each file
3. Use **test_runner** to verify nothing broke

### Pattern: Document as You Go

**Use Case:** Create documentation from existing code

```
Read through our authentication flow and create a markdown doc
explaining how it works
```

tech_lead will:
1. Use **explore** to find auth-related files
2. **Directly edit** markdown to create the documentation
(no need to delegate markdown work!)

### Pattern: Research Then Decide

**Use Case:** Evaluate technology options

```
Research different rate limiting approaches for our API
and recommend the best one for our use case
```

tech_lead will:
1. Use **librarian** to research approaches
2. Use **explore** to understand current infrastructure
3. **Synthesize** a recommendation based on your context

### Pattern: Bulk Operations

**Use Case:** Make the same change across many files

```
Add TypeScript type imports to all our React component files
```

tech_lead will:
1. Use **explore** to find all component files
2. Use **junior_dev** to add imports systematically
3. Use **test_runner** to verify type checking passes

## Advanced Usage

### Chaining Multiple Workflows

You can request complex multi-phase work:

```
First, audit our API endpoints for security issues.
Then, research best practices for the issues you find.
Finally, implement fixes for the top 3 critical issues.
```

tech_lead will break this into phases and execute them sequentially.

### Iterative Development

tech_lead maintains context across messages:

```
Message 1: "Find all database query functions"
Message 2: "Add error handling to the ones in the user module"
Message 3: "Now do the same for the product module"
```

Each message builds on previous context.

### Asking for Clarification

If your request is ambiguous, tech_lead will ask:

```
Your request: "Fix the performance issue"

tech_lead response: "I need more context:
- Which part of the application has the performance issue?
- What symptoms are you seeing (slow API, high memory, etc.)?
- Do you have profiling data or logs I should examine?"
```

## Tips for Effective Collaboration

### Be Specific About Goals

[X] **Vague:** "Make the code better"
[OK] **Specific:** "Add input validation to all API endpoints"

### Trust the Workflow

[X] **Micromanaging:** "First use explore to find files, then use junior_dev to..."
[OK] **Goal-oriented:** "Add logging to all error handlers"

Let tech_lead figure out the workflow.

### Provide Context When Needed

[X] **Assuming:** "Fix the bug"
[OK] **Context:** "The user registration endpoint returns 500 errors when email is malformed"

### Use Direct Requests for Simple Tasks

[X] **Over-delegating:** Complex workflow for simple markdown edit
[OK] **Direct:** "Update the README to mention the new authentication feature"

tech_lead can handle simple edits directly.

## When tech_lead Says No

Sometimes tech_lead will suggest alternatives:

### "Consider using the build agent"

```
This task requires extensive refactoring across the entire codebase.
I recommend switching to the build agent using Tab.
```

**Why?** Full rebuilds are better handled by the build agent's end-to-end approach.

**What to do:** Press Tab → select build → continue the conversation

### "I need bash access confirmation"

```
To run the database migration, I need to execute a bash command.
Would you like me to proceed?
```

**Why?** tech_lead has bash on "ask" permission for safety.

**What to do:** Review the command and confirm or deny

### "This file contains sensitive data"

```
The file .env.production contains environment variables.
Should I read it to understand the configuration?
```

**Why?** Sensitive files require explicit permission.

**What to do:** Approve if needed, or provide info another way

## Measuring Success

Good indicators you're using tech_lead effectively:

[OK] **You describe WHAT, not HOW** - Focus on goals, not implementation steps
[OK] **Multi-step tasks complete smoothly** - tech_lead coordinates the workflow
[OK] **You're not context-switching** - Stay in conversation, let agents work
[OK] **Changes are verified** - test_runner confirms work before completion

## Next Steps

- **[Core Concepts](CONCEPTS.md)** - Understand the architecture deeper
- **[Reference](REFERENCE.md)** - Quick lookup for capabilities
- **[Troubleshooting](TROUBLESHOOTING.md)** - Solve common issues

## Quick Reference

### Best Requests for tech_lead

- "Find X and update it to Y"
- "Research X then implement it"
- "Fix the failing tests"
- "Add feature X with proper error handling"
- "Refactor X to follow Y pattern"

### Best Requests for Direct Handling

- "Update the README"
- "Explain how X works"
- "Should I use pattern X or Y?"
- "Review this approach and give feedback"

### Requests Better for Build Agent

- "Migrate entire codebase from X to Y"
- "Restructure the project architecture"
- "Add comprehensive testing across all modules"
- "Implement a new framework setup"
