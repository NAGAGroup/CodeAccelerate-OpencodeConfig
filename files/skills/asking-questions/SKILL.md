---
name: asking-questions
description: Teaches how to ask users for information, decisions, or approval when blocked on work decisions.
---

# Asking Questions

This skill teaches how to use the question tool to ask users for information, decisions, or approval. Load it whenever you need to gather input from the user that blocks your work.

## How to Call the Tool

Call the question tool with a concise question parameter. For approval gates with clear options, include an options array. For clarifications that require quick user input, provide just the question parameter.

## Rules

Ask one question at a time — each call to the question tool contains a single, focused question. Keep questions short and direct — one sentence maximum. Separate proposals and long content into plain messages; use the question tool only for quick input that cannot be inferred. Between questions, use the sequential-thinking_sequentialthinking tool to reason about what the answer means and whether more information is needed. Ask only when you have genuine uncertainty that blocks your work, not for small decisions you can make yourself.

## Anti-patterns

**Anti-pattern: Asking multiple unrelated questions in one call**

What it looks like: You ask: "Which module should we focus on? Should we refactor or build new? Do you want this done by next week?"

Why it fails: This overloads the user with multiple decisions at once and creates confusion about which answer applies to which question. Each question deserves focused attention and a dedicated response. Ask one question per call.

**Anti-pattern: Using the question tool for investigation work**

What it looks like: You ask in the tool: "Please explain the entire authentication flow, what protocols are involved, which libraries you are using, and what edge cases need handling."

Why it fails: This is investigation work that requires expert delegation, not clarification. Use the task tool to dispatch specialists to scouts or insurgents instead. The question tool is for quick user input, not extended explanations.

**Anti-pattern: Asking without sufficient context**

What it looks like: You ask: "Should we rename this internal class?" without explaining what class you mean or why renaming matters.

Why it fails: The user cannot make an informed decision without context. Present your proposal as a plain message first to provide background, then ask a follow-up question with the question tool.

**Anti-pattern: Batching related questions in one call**

What it looks like: You ask: "What is the authentication method and what is the session timeout?" in a single question call.

Why it fails: Even related questions should be asked separately to receive focused answers and allow for reasoning between them. Sequential questions with reasoning in between lead to better decisions.

## Good and Bad Examples

**Good:** You need to understand the user's priority. You use the question tool: "What is your priority: speed of implementation or flexibility for future changes?" The user responds. You use sequential-thinking_sequentialthinking to reason about what the answer means for your approach. Then, if you need clarification on one aspect, you ask a follow-up question.

**Bad — multiple questions:** You ask: "Which area should we focus on and should we refactor or build new and what timeline?" in one call. The user gets confused about which answer applies where.

**Bad — investigation disguised as question:** You ask: "Explain the entire authentication system and what protocols are used." Use task to dispatch @context-scout instead.

**Bad — no context:** You ask: "Should we change this?" without explaining what "this" is or why it matters. First present context as a plain message, then ask the question.
