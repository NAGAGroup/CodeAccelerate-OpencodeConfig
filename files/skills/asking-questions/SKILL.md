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

## Tool Schema

```jsonc
{
  "questions": [
    {
      // The full question text shown to the user.
      "question": "string",

      // A very short label shown above the question (max 30 characters).
      "header": "string",

      // The list of choices the user can pick from.
      "options": [
        {
          // Display text for the choice (1–5 words).
          "label": "string",

          // A longer explanation of what this option means.
          "description": "string"
        }
      ],

      // Optional — set to true to allow selecting more than one option.
      "multiple": false
    }
  ]
}
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

## Examples

Ask for approval — show content first, then ask:
> [message]: "Here is what I plan to do: [details spanning many lines]."
> [question tool, question: "Does this look right to proceed?"]

Ask the user to pick one option:
> [question tool, multiple: false]: "Which direction do you want to take?"

Ask the user to pick one or more options:
> [question tool, multiple: true]: "Which of these apply? Select all that are relevant."

Ask for open-ended input:
> [question tool, no options]: "What should I change about this?"
