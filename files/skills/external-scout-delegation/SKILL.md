---
name: external-scout-delegation
description: Teaches how to dispatch @external-scout for external research on public information and documentation.
---

# Delegating to @external-scout

Dispatch @external-scout for research on public information and documentation.

## How to Dispatch

Call task tool with: `subagent_type="external-scout"`, description (3-5 words), goal-based prompt with research question, what's known, sources to search, and reporting format.

## What @external-scout Does

- Searches external sources: public documentation, community resources, published guides
- Uses web search and URL reading tools
- No access to internal project materials
- Use only for questions that cannot be answered from project code

## Rules
- Provide background so agent understands what and why
- Use general, public terms; no private details or internal identifiers
- State what is already known so agent focuses on new information
- Instruct it to search and read sources rather than answer from memory
- Ask for verification distinctions: verified (from source), inferred (from summaries), uncertain
- **Always require an explicit unknowns section** — what was searched for but could not be confirmed, contradictions between sources, gaps in available information. This is non-negotiable in every dispatch prompt.
