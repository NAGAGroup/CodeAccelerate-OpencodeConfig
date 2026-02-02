# Infinite Reflection Loop Prevention

## Date
February 2, 2026

## Critical Issue: Infinite Reflection Loop

### The Problem

**Without Protection:**
1. Agent creates todolist: `["Research codebase", "Analyze structure", "Document findings"]`
2. Pattern 2 triggers: "Your todos don't mention delegating"
3. Agent responds to reflection, updates todos: `["Research codebase", "Delegate analysis to explore", "Document"]`
4. Pattern 3 triggers: "You have multiple pending delegations..."
5. Agent responds again, updates todos...
6. **INFINITE LOOP**

### Root Cause

The `tool.execute.after` hook for `todowrite` had no memory of previous reflections:

```typescript
// BEFORE (BROKEN):
if (agent === "tech_lead" && !allComplete) {
  const analysis = analyzeTodos(todos);
  if (analysis.needsReflection && analysis.prompt) {
    await injectReflection(sessionID, analysis.prompt);  // Triggers EVERY time!
  }
}
```

Every time the agent updated the todolist, the same patterns would trigger again.

### The Fix: Per-Session Reflection Tracking

**Added State:**
```typescript
type ReflectionPattern = 'implementation' | 'no-delegation' | 'parallel' | 'large-list';
const sessionReflections = new Map<string, Set<ReflectionPattern>>();
```

**Protection Logic:**
```typescript
// AFTER (FIXED):
if (agent === "tech_lead" && !allComplete) {
  const analysis = analyzeTodos(todos);
  if (analysis.needsReflection && analysis.pattern && analysis.prompt) {
    // Check if we've already reflected on this pattern
    const reflectedPatterns = sessionReflections.get(sessionID) || new Set();
    
    if (!reflectedPatterns.has(analysis.pattern)) {
      // First time - inject reflection
      reflectedPatterns.add(analysis.pattern);
      sessionReflections.set(sessionID, reflectedPatterns);
      await injectReflection(sessionID, analysis.prompt);
    } else {
      // Already reflected - skip
      console.log('[tech-lead-guardrails] Skipping duplicate reflection:', {
        sessionID,
        pattern: analysis.pattern
      });
    }
  }
}
```

**Reset on Completion:**
```typescript
if (allComplete) {
  await injectReflection(sessionID, `[Completion Checkpoint]...`);
  
  // Clear reflection tracking - allow reflections for next todolist
  sessionReflections.delete(sessionID);
}
```

### How It Works

**Scenario 1: First Todolist**
1. Agent creates todos with implementation pattern
2. `sessionReflections.get(sessionID)` → `undefined`
3. Pattern NOT in set → Inject reflection
4. Add 'implementation' to set
5. Agent responds, updates todos
6. `sessionReflections.get(sessionID)` → `Set(['implementation'])`
7. Pattern IS in set → Skip (no infinite loop!)

**Scenario 2: New Todolist After Completion**
1. Agent completes all todos
2. Completion checkpoint triggers
3. `sessionReflections.delete(sessionID)` → Clear tracking
4. Agent creates new todolist for new work
5. Reflections can trigger again for new patterns

**Scenario 3: Multiple Patterns**
1. Agent creates todos: `["Write code for feature X", "Test it", "Deploy"]`
2. Pattern 1 triggers: 'implementation' → Reflected ✓
3. Agent updates: `["Delegate to junior_dev", "Test it", "Deploy"]`
4. Pattern 1 check: Already in set → Skip ✓
5. Pattern 4 might trigger: 'large-list' (if 7+ todos) → New pattern, reflect ✓

### Edge Cases Handled

**Q: What if agent creates terrible todos twice?**
A: First creation triggers reflection. Second update skips. Agent must figure it out themselves.

**Q: What if agent never completes todos?**
A: Reflection tracking persists for entire session. Once you've been warned about a pattern, you don't get warned again until you finish the current work.

**Q: What if user starts new task without completing todos?**
A: Reflection tracking persists (intentional). If user explicitly requests new work, the "all complete" guard will force new todolist, which resets tracking.

**Q: Can agent game the system by marking todos complete and reopening?**
A: Yes, but that's agent misbehavior we can't prevent. The reflection system is a gentle nudge, not a hard constraint.

### Testing the Protection

**Test Case 1: Same Pattern Twice**
```
1. Agent: todowrite(["Research X", "Research Y"])
   → Pattern: "no-delegation" → Reflect
2. Agent responds, updates: todowrite(["Research X", "Delegate Y"])
   → Pattern: "no-delegation" (still no delegation in X) → Skip (already reflected)
✓ No loop
```

**Test Case 2: Different Patterns**
```
1. Agent: todowrite(["Create foo.js", "Create bar.js"])
   → Pattern: "implementation" → Reflect
2. Agent: todowrite(["Delegate foo", "Delegate bar", "Delegate baz"])
   → Pattern: "parallel" (2+ pending delegations) → Reflect (new pattern)
✓ Both reflections appropriate
```

**Test Case 3: Completion Reset**
```
1. Agent: todowrite([todo1, todo2]) → Pattern X → Reflect
2. Agent: todowrite([todo1✓, todo2✓]) → All complete → Clear tracking
3. Agent: todowrite([todo3, todo4]) → Pattern X again → Reflect (new todolist)
✓ Fresh start after completion
```

### Why This Approach

**Alternative 1: Never reflect more than once per session**
❌ Too restrictive - agent might need multiple nudges for different anti-patterns

**Alternative 2: Compare todo content hashes**
❌ Too complex - agent might rephrase todos, hard to detect genuine changes

**Alternative 3: Time-based cooldown**
❌ Arbitrary - doesn't align with natural workflow boundaries

**Alternative 4: Track per-pattern, reset on completion** ✓
✓ Aligns with natural workflow (one set of work = one reflection per pattern)
✓ Simple to understand and debug
✓ Allows multiple patterns per todolist
✓ Resets when work naturally completes

### Monitoring

The plugin now logs when reflections are skipped:

```
console.log('[tech-lead-guardrails] Skipping duplicate reflection:', {
  sessionID,
  pattern: analysis.pattern,
  reason: 'Already reflected on this pattern'
});
```

This helps debug if agent is repeatedly hitting the same patterns.

### Future Enhancements

**Option 1: Configurable Reset Strategy**
```typescript
interface GuardrailsConfig {
  reflection: {
    resetOn: 'completion' | 'never' | 'each-todowrite';
  };
}
```

**Option 2: Pattern-Specific Limits**
```typescript
// Allow 'no-delegation' pattern to trigger twice, but 'implementation' only once
const patternLimits: Record<ReflectionPattern, number> = {
  'implementation': 1,
  'no-delegation': 2,
  'parallel': 1,
  'large-list': 1,
};
```

**Option 3: Smart Reset on Major Changes**
```typescript
// Reset tracking if todos change dramatically (>50% different)
const similarity = calculateTodoSimilarity(oldTodos, newTodos);
if (similarity < 0.5) {
  sessionReflections.delete(sessionID);  // Fresh analysis needed
}
```

### Summary

**Before**: Reflection could loop infinitely when agent updated todolist
**After**: Each reflection pattern triggers ONCE per todolist lifecycle
**Reset**: Tracking clears when todos complete, allowing fresh reflections for new work
**Result**: Gentle nudges without nagging loops

This makes the meta-reflection system production-ready!
