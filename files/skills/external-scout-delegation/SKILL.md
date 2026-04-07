---
name: external-scout-delegation
description: Teaches how to dispatch @external-scout for external research on public information and documentation.
---

# Delegating to @external-scout

Dispatch @external-scout for research on public information using the task tool.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "external-scout", a short description (3-5 words) for logging purposes, and a complete goal-based prompt. The prompt should state the research question clearly, describe what is already known and what needs verification, specify sources to search (official documentation, published guides), instruct reading actual sources rather than relying on snippets, and state the reporting format (verified, inferred, uncertain).

## What @external-scout Does

@external-scout searches external sources — public documentation, community resources, published guides. It uses web search and URL reading tools. It has no access to internal project materials. Use @external-scout only for questions that cannot be answered from project code or internal documentation. Use @context-scout for internal project investigation.

## Rules for Good Dispatch Prompts

- Provide background so @external-scout understands what it is researching and why
- Use general, public terms; include no private details or internal identifiers
- State what is already known so @external-scout focuses on new information
- Instruct it to search and read sources rather than answer from memory
- Ask for verification distinctions: verified (read from source), inferred (from summaries), uncertain
