---
name: asking-questions
description: How to present questions and information to the user
---

# Asking Questions (Simple Instructions)

## Tool Schema

```jsonc
{
  // Top-level wrapper — an array so you can ask multiple
  // questions in a single tool call.
  "questions": [
    {
      // The full question text shown to the user.
      "question": "string",
      // A very short label (max 30 chars) displayed as a header
      // above the question — like a compact title/category.
      "header": "string",
      // The list of choices the user can pick from.
      "options": [
        {
          // Display text for the choice — keep it concise (1-5 words).
          "label": "string",
          // Longer explanation of what this option means/does.
          "description": "string"
        }
      ],
      // Optional — set to true to allow the user to select
      // more than one option at once. Defaults to false (single-select).
      "multiple": false
    }
  ]
}
```

## When to Ask Questions

- Only ask the user a question if you are unsure and need their input to continue.
- Use the `question` tool to ask questions. You can give options if needed.

## How to Ask Well

- If the user needs to review something, show it as a message first. Do not put review content inside the question.
- The question should be short and focused on what you need (approval, choice, or information).
- If you need approval, ask for approval. If you need a choice, give clear options. If you need information, ask directly.

## Multiple Choice

- Use multiple choice only if the user must pick from a few clear options (like approve/deny, pick a direction).
- Each option should be clearly different.
- Do not use multiple choice for open-ended feedback. Use a free-form question instead.

## Important Rules

- Do not ask questions unless the todo list says to.
- Do not ask about things the user cannot see.
- Do not ask more than one question at a time.
- Do not use multiple choice for open-ended feedback.
- Always use the `question` tool to ask questions. Do not ask questions in free-form messages.
- If getting approval, propose in a message what you want to do, then ask for approval in a separate question. This is because the question field in the tool call only accepts single sentences, not long-form prose like a proposal.
- If getting approval after `sequential-thinking_sequentialthinking`, you still must present what's being approved as a standalone message outside of any tool calls after thinking and before calling the question tool.

## Good Examples

- Show content as a message before approval questions and after any thinking steps:
  [thought tool]: "I think this is the right plan to propose."
  [message]: "Here is the plan I want to propose: [plan details]."
  [question tool]: "Does this look good to proceed?"

- Use multiple choice for clear options:
  [multiple choice question]: "Which of the following options do you want to proceed with? You can select multiple options if you want."
  [question tool with options]: "Options: Option 1, Option 2, Option 3, ..."

- Use free-form for feedback:
  [question tool]: "What should I adjust in the plan?"

## Bad Examples

- Put review content inside the question tool.
- Refer to things the user cannot see.
- Ask questions when not told to.
- Ask unrelated questions at once.
- Use multiple choice for open-ended feedback.

---

Follow these instructions exactly. Only ask questions when the todo list says to, and use the `question` tool.
