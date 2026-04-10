---
name: asking-questions
description: Teaches how to ask users for information, decisions, or approval when blocked on work decisions.
---
<rules>
Only ask when you genuinely cannot proceed without the answer — do not ask about things you can determine yourself.
Ask one focused question at a time. Do not bundle unrelated decisions into one call.
Provide context in your response text before calling the tool so the question itself can be short and focused.
</rules>

<example>
question tool — presents a structured question to the user.
  questions: array of question objects
    question: the question text
    header: short label, max 30 characters
    options: array of choices, each with label and description
    multiple: true if the user may select more than one option (optional)

A "Type your own answer" option is added automatically — do not include an "Other" option.

Set multiple: true when the user may need to select more than one option.
</example>
