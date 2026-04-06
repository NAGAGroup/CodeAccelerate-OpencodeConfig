---
name: external-scout-delegation
description: Teaches how to dispatch @external-scout for external research on public information and documentation.
---

# Delegating to @external-scout

This skill teaches how to dispatch @external-scout for external research on public information. Load it before writing a dispatch prompt to understand what @external-scout can do and what kind of research questions work well.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "external-scout", a short description (3-5 words) for logging purposes, and a complete goal-based prompt. The prompt should state the research question clearly, describe what you already know and what needs verification, specify what sources to search (official documentation, published guides), emphasize reading actual sources rather than relying on search snippets, include instructions to retrieve previous research findings from the appropriate Qdrant collection using qdrant_qdrant-find before starting, store new findings when done, and specify the reporting format (verified from source, inferred from summaries, uncertain, and what could not be confirmed).

## What @external-scout Does

@external-scout searches external sources — public documentation, community resources, published guides. It uses web search, URL reading, and reasoning tools. It accesses only public, external information and has no access to internal project materials or private systems. Use @external-scout only for questions that cannot be answered from project code or internal documentation. Use @context-scout for internal project investigation instead.

## Rules for Good Dispatch Prompts

Provide enough background so @external-scout understands what it is researching and why. Use general, public terms — include no private details or internal identifiers. State what is already known so @external-scout focuses on new information rather than re-discovering confirmed findings. Instruct it to search and read sources rather than answer from memory. Ask for verification distinctions: verified (read from source), inferred (from summaries), and uncertain. When working within a plan session, include the plan name (the Qdrant collection name) in the dispatch prompt. Instruct @external-scout to use qdrant_qdrant-find to retrieve accumulated session knowledge from that collection before starting, and to store new findings to the same collection when done. Include an uncertainties section listing what was searched but not confirmed.

## Examples

**Good:** "Research question: does JWT specification support custom claim types? We know JWT is standard. What we need to verify: whether custom claims are standard or non-standard. Search JWT documentation and guides. Read actual sources, not snippets. Before starting, retrieve findings from Qdrant collection 'research-findings' using qdrant_qdrant-find. Store new findings when done. Report verified/inferred/uncertain findings and what you could not confirm."

**Bad — leaks private details:** "Search for how to do X for our internal project name." Generalize project-specific terms first.

**Bad — answerable internally:** "Find out what tool our work uses." @external-scout has no internal access. Use @context-scout instead.

**Bad — accepts memory as evidence:** "Tell me about token specifications." @external-scout must search and verify sources, not answer from memory.
