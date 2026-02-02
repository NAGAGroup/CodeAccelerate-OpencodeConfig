---
name: tech-lead-questions
description: How to ask questions to users using the question tool
---

# Using the Question Tool

> [!IMPORTANT]
> You MUST use the question tool to ask questions to the user. NEVER ask questions in plain text.

## Why This Matters

Plain text questions like "Should I...?" or "Would you like...?" are:
- Not programmatically parsable
- Require free-form user responses
- Lead to ambiguous answers

The question tool provides structured options with clear choices.

---

## Basic Structure

```typescript
question({
  questions: [
    {
      header: "Short Label (max 30 chars)",
      question: "Complete question text?",
      options: [
        { label: "Option 1", description: "Explanation of what this means" },
        { label: "Option 2", description: "Alternative approach explained" },
      ],
    },
  ],
});
```

---

## Simple Example

```typescript
question({
  questions: [
    {
      header: "Dark Mode Persistence",
      question: "Should dark mode preference persist across sessions?",
      options: [
        { 
          label: "Yes, persist", 
          description: "Save to localStorage, survives browser restart" 
        },
        { 
          label: "No, session only", 
          description: "Reset to default on each visit" 
        },
      ],
    },
  ],
});
```

---

## Multiple Questions

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
        { label: "httpOnly cookie", description: "Secure cookie (recommended)" },
      ],
    },
  ],
});
```

---

## Multiple Selection

```typescript
question({
  questions: [
    {
      header: "Features to Include",
      question: "Which features should we implement?",
      multiple: true, // Allow selecting multiple options
      options: [
        { label: "Authentication", description: "User login/logout" },
        { label: "Authorization", description: "Role-based access control" },
        { label: "Password reset", description: "Forgot password flow" },
      ],
    },
  ],
});
```

---

## When to Use

Use the question tool when you have one or more questions AND:
- User request is ambiguous
- Multiple valid approaches exist
- You need to clarify requirements before proceeding
- Implementation choice significantly affects the solution
- User preference is needed

---

## When NOT to Use

Do NOT use the question tool when you have no questions OR:
- Answer is obvious from context
- Industry standard approach exists
- User already specified the approach
- Question is trivial or purely informational

---

## Guidelines

**Headers:** Keep under 30 characters

**Questions:** Write as complete sentences

**Options:** 
- Label: Short, clear (1-5 words)
- Description: Explain implications and tradeoffs

**Recommendations:** If you recommend an option, make it first and add "(Recommended)" to the label
