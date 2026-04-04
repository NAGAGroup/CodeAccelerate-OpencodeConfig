---
name: asking-questions
description: How to present questions and information to the user
---

# Asking Questions

## When to Ask

Only ask the user a question when:
- The todo list tells you to ask.
- You need information you cannot get any other way.

Do not ask questions at any other time.

## How to Call the question Tool

Call the `question` tool with a `questions` array. Each question has these fields:

- `question`: the full question text shown to the user (one short sentence)
- `header`: a very short label shown above the question (max 30 characters)
- `options`: list of choices, each with a `label` (1–5 words) and `description` (explanation)
- `multiple`: optional — set to `true` to allow selecting more than one option

Example — single choice:

```
question(
  questions=[{
    "question": "Which approach do you want to take?",
    "header": "Choose approach",
    "options": [
      {"label": "Option A", "description": "Does X with tradeoff Y"},
      {"label": "Option B", "description": "Does X differently with tradeoff Z"}
    ]
  }]
)
```

Example — approval gate (after presenting content in a plain message first):

```
question(
  questions=[{
    "question": "Does this look right?",
    "header": "Confirm plan",
    "options": [
      {"label": "Yes, proceed", "description": "Continue with this approach"},
      {"label": "No, change it", "description": "I want to adjust something"}
    ]
  }]
)
```

Example — multiple select:

```
question(
  questions=[{
    "question": "Which of these apply to your project?",
    "header": "Select all that apply",
    "multiple": true,
    "options": [
      {"label": "Has tests", "description": "The project has an automated test suite"},
      {"label": "Has CI", "description": "There is a CI pipeline configured"},
      {"label": "Monorepo", "description": "Multiple packages in one repository"}
    ]
  }]
)
```

## The Most Important Rule

**Never put proposals, plans, or long content inside the `question` tool.**

The question tool displays in a small UI window. Long content overflows and becomes unreadable.

Always follow this order:
1. Send your proposal or content as a plain message first.
2. Then call the `question` tool with only a short question (one sentence).

The `question` field must be a single short sentence — not a summary, not a plan, not a list.

## Rules

- Use the `question` tool to ask. Do not ask questions in free-form messages.
- Ask only one question at a time.
- The `question` field must be one short sentence. Put all other content in a message before the tool call.
- Set `multiple: true` when the user may want to select more than one option at once.
- Leave `multiple` unset (or false) when the user should pick exactly one option.
- Do not ask about things the user cannot see.
- Do not use options for open-ended feedback. Ask a free-form question instead.

Example — open-ended (no options):

```
question(
  questions=[{
    "question": "What should I change about this?",
    "header": "Your feedback"
  }]
)
```

Example — multiple questions in one call:

```
question(
  questions=[
    {
      "question": "What is the primary goal of this task?",
      "header": "Primary goal",
      "options": [
        {"label": "Fix a bug", "description": "Correct something that is broken"},
        {"label": "Add a feature", "description": "Introduce new capability"},
        {"label": "Refactor", "description": "Improve structure without changing behavior"}
      ]
    },
    {
      "question": "Are there parts of the codebase that must not change?",
      "header": "Off-limits areas",
      "options": [
        {"label": "Yes", "description": "I will describe them in the next question"},
        {"label": "No", "description": "Everything is in scope"}
      ]
    }
  ]
)
```
