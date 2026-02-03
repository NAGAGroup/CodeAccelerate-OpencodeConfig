---
name: todo-usage
description: Guidelines for using todowrite/todoread tools to track multi-step work
---

## The Rule

**Use todolist to track progress on multi-step tasks. Keep todos updated in real-time.**

## When to Use Todolist

Use todolist when:

- Task has 3+ sequential steps
- Work spans multiple files or phases
- Progress tracking helps coordination
- User or parent agent needs visibility into progress

Do NOT use todolist when:

- Task is single-step and trivial
- No benefit to tracking granular progress
- Task completes in one action

---

## How to Use Todolist

### Creating Todos

At the start of multi-step work:

```typescript
todowrite({
  todos: [
    {
      id: "1",
      content: "Brief description of step",
      status: "in_progress",
      priority: "high",
    },
    { id: "2", content: "Next step", status: "pending", priority: "high" },
    { id: "3", content: "Final step", status: "pending", priority: "medium" },
  ],
});
```

### Updating Progress

After completing each step:

```typescript
todowrite({
  todos: [
    {
      id: "1",
      content: "Brief description of step",
      status: "completed",
      priority: "high",
    },
    { id: "2", content: "Next step", status: "in_progress", priority: "high" },
    { id: "3", content: "Final step", status: "pending", priority: "medium" },
  ],
});
```

### Todo States

- `pending` - Not yet started
- `in_progress` - Currently working on (limit to ONE at a time)
- `completed` - Finished successfully
- `cancelled` - No longer needed

### Priority Levels

- `high` - Critical path items
- `medium` - Important but not blocking
- `low` - Nice to have

---

## Best Practices

**Real-time updates:**

- Update status immediately after completing each step
- Don't batch multiple completions
- Keep ONE task in_progress at a time

**Clear descriptions:**

- Use specific, actionable language
- "Create auth middleware" (good)
- "Work on auth" (bad)

**Appropriate granularity:**

- Break work into meaningful chunks
- Not too fine-grained (every line edit)
- Not too coarse (entire feature as one todo)

> [!WARNING]
> DO NOT CREATE TODO ITEMS FOR SUMMARIZING RESULTS, YOU WILL BE PROMPTED TO DO SO ONCE YOU MARK OFF LAST TODO ITEM AUTOMATICALLY.

---

## Role-Specific Examples

### For tech_lead

When coordinating work:

- Create high-level todos for your coordination tasks
- Use todolist when managing multi-agent workflows
- Track planning, delegating, and verifying phases

**Example:**

```typescript
todowrite({
  todos: [
    {
      id: "1",
      content: "Analyze authentication requirements",
      status: "completed",
      priority: "high",
    },
    {
      id: "2",
      content: "Delegate implementation to junior_dev",
      status: "in_progress",
      priority: "high",
    },
    {
      id: "3",
      content: "Verify with test_runner",
      status: "pending",
      priority: "high",
    },
    {
      id: "4",
      content: "Update documentation",
      status: "pending",
      priority: "medium",
    },
  ],
});
```

### For junior_dev

When executing multi-step specs:

- Create todos that mirror spec steps
- Update after completing each step
- Helps tech_lead track implementation progress

**Example:**

```typescript
todowrite({
  todos: [
    {
      id: "1",
      content: "Create auth middleware file",
      status: "completed",
      priority: "high",
    },
    {
      id: "2",
      content: "Implement JWT validation logic",
      status: "in_progress",
      priority: "high",
    },
    {
      id: "3",
      content: "Update routes to use middleware",
      status: "pending",
      priority: "high",
    },
    {
      id: "4",
      content: "Add error handling",
      status: "pending",
      priority: "medium",
    },
  ],
});
```

### For Other Agents

If you gain todo access in the future:

- Follow the same patterns
- Update in real-time
- Keep todos specific and actionable
