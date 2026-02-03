---
name: todo-usage
description: Guidelines for using todowrite/todoread tools to track multi-step work
---

## The Rule

**Use todolist to track progress on multi-step tasks. Keep todos updated in real-time.**

**NEVER create todo items for summarizing or reporting results. The system automatically prompts you to summarize when all todos are complete.**

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

> [!CAUTION]
> **Never Create Summary Todos**
>
> DO NOT create todo items like:
> - "Summarize work for user"
> - "Report results to tech_lead"
> - "Send summary of changes"
> - "Update user with findings"
>
> Why? The system AUTOMATICALLY injects a reflection prompt when you mark your last todo as complete. This prompt reminds you to summarize your work. Creating a summary todo is redundant and wastes a todo slot.

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

> [!CAUTION]
> **Summary Todos Are Prohibited**
>
> NEVER create todo items for summarizing, reporting, or communicating results.
>
> The guardrails plugin automatically injects a "[Todolist Complete]" reflection prompt when you mark all todos as complete. This prompt instructs you to:
> 1. Provide a complete summary for the user
> 2. (tech_lead only) Check if work should be stored in memory
>
> Summary todos are redundant, waste todo slots, and create confusion. Focus your todos on ACTIONABLE WORK ITEMS ONLY.

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
