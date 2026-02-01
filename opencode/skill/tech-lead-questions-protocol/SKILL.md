---
name: tech-lead-questions-protocol
description: How to ask questions to users using the question tool
---

## Asking Questions

> [!IMPORTANT]
> You MUST use the question tool to ask questions to the user. NEVER ask questions in plain text.

## Rules

- DO NOT ask questions in plain text responses
- DO NOT use informal question patterns like "Should I...?" or "Would you like...?"
- ALWAYS use the question tool with clear options for structured responses
- This ensures consistent, actionable user input that you can programmatically handle

## Examples

### Wrong (Plain Text)

```
Should I save this to project config or global config?
```

### Correct (Question Tool)

```typescript
question({
  questions: [
    {
      header: "Save Location",
      question: "Where should I save this configuration?",
      options: [
        { label: "Project config", description: "Save to $PWD/.opencode" },
        { label: "Global config", description: "Save to $XDG_CONFIG/opencode" },
      ],
    },
  ],
});
```

## Question Tool Structure

### Single Question

```typescript
question({
  questions: [
    {
      header: "Short Label (max 30 chars)",
      question: "Complete question text?",
      options: [
        { label: "Option 1", description: "Explanation of option 1" },
        { label: "Option 2", description: "Explanation of option 2" },
        { label: "Option 3", description: "Explanation of option 3" },
      ],
    },
  ],
});
```

### Multiple Questions

```typescript
question({
  questions: [
    {
      header: "OAuth Provider",
      question: "Which OAuth provider should we use?",
      options: [
        { label: "Google", description: "Google OAuth 2.0" },
        { label: "GitHub", description: "GitHub OAuth" },
        { label: "Custom", description: "Custom OAuth provider" },
      ],
    },
    {
      header: "Token Storage",
      question: "Where should tokens be stored?",
      options: [
        { label: "localStorage", description: "Browser localStorage" },
        { label: "sessionStorage", description: "Browser sessionStorage" },
        { label: "httpOnly cookie", description: "Secure cookie" },
      ],
    },
  ],
});
```

### Multiple Selection

```typescript
question({
  questions: [
    {
      header: "Features to Include",
      question: "Which features should we implement?",
      multiple: true, // Allow selecting multiple options
      options: [
        { label: "Authentication", description: "User login/logout" },
        { label: "Authorization", description: "Role-based access" },
        { label: "Password reset", description: "Forgot password flow" },
        { label: "Email verification", description: "Verify email on signup" },
      ],
    },
  ],
});
```

## Best Practices

### Clear and Specific Options

**Good:**
```typescript
{
  label: "Persist across sessions",
  description: "Save preference to localStorage, survives browser restart"
}
```

**Bad:**
```typescript
{
  label: "Yes",
  description: "Save it"
}
```

### Concise Headers

Headers should be 30 characters or less:

**Good:** "Save Location"
**Bad:** "Where should I save this configuration file?"

### Complete Questions

Questions should be complete sentences:

**Good:** "Where should I save this configuration?"
**Bad:** "Save location"

### Meaningful Descriptions

Descriptions should explain the implications:

**Good:**
```typescript
{
  label: "Project config",
  description: "Save to $PWD/.opencode - applies only to this project"
}
```

**Bad:**
```typescript
{
  label: "Project config",
  description: "Project"
}
```

## When to Use the Question Tool

Use the question tool when:
- User request is ambiguous
- Multiple valid approaches exist
- You need to clarify requirements
- Choice affects implementation significantly
- User preference is needed

Do NOT use the question tool when:
- Answer is obvious from context
- Industry standard approach exists
- User already specified the approach
- Question is trivial

## Common Patterns

### Clarifying Scope

```typescript
question({
  questions: [
    {
      header: "Implementation Scope",
      question: "How comprehensive should this feature be?",
      options: [
        { label: "Minimal (Recommended)", description: "Core functionality only, fastest to implement" },
        { label: "Standard", description: "Core + common use cases" },
        { label: "Comprehensive", description: "Full feature with edge cases and extras" },
      ],
    },
  ],
});
```

### Technology Choice

```typescript
question({
  questions: [
    {
      header: "Testing Framework",
      question: "Which testing framework should we use?",
      options: [
        { label: "Jest", description: "Popular, batteries-included, good for React" },
        { label: "Vitest", description: "Fast, Vite-native, modern ESM support" },
        { label: "Match existing", description: "Use whatever is already in the project" },
      ],
    },
  ],
});
```

### Confirming Approach

```typescript
question({
  questions: [
    {
      header: "Breaking Changes",
      question: "This refactor will change the API. How should we proceed?",
      options: [
        { label: "Breaking change", description: "Update API, update all callers (cleaner)" },
        { label: "Maintain compatibility", description: "Keep old API, add new one (safer)" },
        { label: "Deprecate gradually", description: "Add new API, deprecate old, migrate over time" },
      ],
    },
  ],
});
```
