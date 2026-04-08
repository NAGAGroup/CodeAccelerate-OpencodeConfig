---
name: asking-questions
description: Teaches how to ask users for information, decisions, or approval when blocked on work decisions.
---

# What does this skill teach?

In this skill, you learn how to ask the user focused questions when you need information, a decision, or approval to proceed.

## Related Tools

### `question`

| Parameter | Description |
|-----------|-------------|
| `questions` | Array of question objects (required) |
| `questions[].question` | The question to ask — 1-2 sentences (required) |
| `questions[].header` | Short label shown in the UI, max 30 characters (required) |
| `questions[].options` | Array of choices, each with `label` and `description` (required) |
| `questions[].multiple` | Set to `true` to allow selecting more than one option (optional) |

## How to ask questions

1. Provide context in your response text before calling the tool so the question itself can be short and focused
2. Ask one question per call unless multiple questions are genuinely independent and can be answered together
3. Set `multiple: true` when the user may need to select more than one option
4. Use `options` to present concrete choices — a "Type your own answer" option is added automatically

## How to think through this skill

<|think|>
- What exactly do I need from the user — information, a decision, or approval?
- Can I answer this myself with the information I already have, or do I genuinely need to ask?
- Have I provided enough context in my response so the question itself is short and clear?
- Am I asking one focused question, or am I bundling multiple unrelated things into one call?
- Are my options concrete and meaningfully different, or are they vague and overlapping?
