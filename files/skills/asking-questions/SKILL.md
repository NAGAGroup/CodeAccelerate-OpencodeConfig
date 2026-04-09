---
name: asking-questions
description: Teaches how to ask users for information, decisions, or approval when blocked on work decisions.
---
<tools>
question — presents a structured question to the user. Parameters: questions (array of question objects, required). Each question object: question (the question text, required), header (short label max 30 characters, required), options (array of choices each with label and description, required), multiple (allow selecting more than one — optional).
</tools>

<procedure>
1. Provide context in your response text before calling the tool so the question itself can be short and focused.
2. Ask one question per call unless multiple questions are genuinely independent and can be answered together.
3. Set multiple: true when the user may need to select more than one option.
4. A "Type your own answer" option is added automatically — do not include an "Other" option.
</procedure>

<rules>
Only ask when you genuinely cannot proceed without the answer. Do not ask about things you can determine yourself.
Ask one focused question at a time. Do not bundle unrelated decisions into one call.
</rules>
