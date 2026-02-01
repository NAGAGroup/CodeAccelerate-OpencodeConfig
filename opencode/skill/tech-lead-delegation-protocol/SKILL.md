---
name: tech-lead-delegation-protocol
description: Complete protocol for delegating work to specialized agents
---

## Delegation Protocol

> [!IMPORTANT]
> You must ALWAYS load the skill template before using the task tool.

## Delegation Steps

1. **Load skill:** `skill({name: 'agent-task'})` where agent is explore, librarian, junior_dev, or test_runner
2. **Review template fields:** Check what template_data fields are required
3. **Populate ALL fields:** No undefined, null, or placeholder values
4. **Provide detailed instructions:** Be specific and comprehensive
5. **Specify expected output:** Tell the agent exactly what you want back

## Examples

### Wrong (Incomplete Delegation)

```typescript
task({
  description: "implement feature",
  subagent_type: "junior_dev",
  template_data: {},
});
```

### Correct (Complete Delegation)

```typescript
// Step 1: Load skill template
skill({ name: "junior_dev-task" });

// Step 2: Delegate with complete data
task({
  description: "Implement user authentication middleware",
  subagent_type: "junior_dev",
  template_data: {
    task: "Create Express middleware for JWT authentication",
    files: ["src/middleware/auth.js"],
    spec: "- Verify JWT tokens\n- Extract user ID\n- Handle expired tokens",
    acceptance_criteria: "Middleware exports authenticateUser function that can be used in routes",
    constraints: "This connects to existing user service at src/services/user.js"
  },
});
```

## Delegation Checklist

Before delegating to any agent:

- [ ] Load the skill template: `skill({name: 'agent-task'})`
- [ ] Review required template_data fields
- [ ] Populate ALL required fields (no undefined/null)
- [ ] Provide specific, detailed instructions
- [ ] Specify expected output format
- [ ] Include relevant context from codebase analysis

## Advanced Delegation Patterns

### Parallel Delegation

When tasks are independent, delegate in parallel:

```typescript
// Load skills first
skill({ name: "librarian-task" });
skill({ name: "explore-task" });

// Then delegate both in same message
task({ subagent_type: "librarian", ... }); // Research external docs
task({ subagent_type: "explore", ... }); // Analyze codebase

// Wait for both to complete, then synthesize
```

### Phased Implementation

For large features, break into phases:

**Phase 1: Core functionality**
- Load skill → junior_dev implements
- Load skill → test_runner verifies
- [PASS] Proceed to Phase 2

**Phase 2: Error handling**
- Load skill → junior_dev implements
- Load skill → test_runner verifies
- [PASS] Proceed to Phase 3

**Phase 3: Edge cases**
- Load skill → junior_dev implements
- Load skill → test_runner verifies
- [PASS] Complete

### Session Management

For multi-step tasks that need context across delegations:

```typescript
// First delegation
task({
  subagent_type: "junior_dev",
  session_id: "feature-oauth-impl",
  template_data: { ... },
});

// Follow-up delegation (same session)
task({
  subagent_type: "junior_dev",
  session_id: "feature-oauth-impl", // Same ID = shared context
  template_data: { ... },
});
```

> [!NOTE]
> Without session_id, each delegation is stateless. Use session_id when you need agents to remember previous context.

## Critical Pattern: Implementation + Verification

> [!IMPORTANT]
> ALWAYS follow this pattern for implementations:
>
> 1. Load skill → Delegate to junior_dev (implementation)
> 2. Load skill → Delegate to test_runner (verification)
> 3. If tests fail: Analyze results → Write NEW spec (not "try again")

### Why junior_dev Can't Run Commands

Junior_dev previously had bash access but would:
- Try to build/test after implementation
- Encounter failures and attempt debugging
- Sometimes run destructive commands (like git reset) that destroyed working changes

**Solution:** Revoked bash privileges. Junior_dev only edits files, test_runner only runs commands.

## When to Suggest Build Agent

The build agent is for "hail mary" contexts when delegation isn't working well or the task is exceptionally complex.

Suggest build agent only when:
- Task has failed multiple times through delegation
- Requires extremely tight integration across 15+ files
- Needs simultaneous changes to frontend, backend, database, infrastructure, tests, and docs
- User is frustrated with delegation overhead
- Task requires rapid iteration that delegation would slow down

> [!WARNING]
> This task is extremely complex with specific reasons. Given the tight integration required, you might get better results using the build agent as a 'hail mary' approach. Press Tab and select 'build'. However, I can continue coordinating through subagents if you prefer.

**Default approach:** Always try delegation first. Build agent is the exception, not the rule.
