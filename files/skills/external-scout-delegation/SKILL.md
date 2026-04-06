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

## Skill-Loading Instructions for @external-scout

Include explicit skill-loading instructions in your dispatch prompt so @external-scout loads necessary skills before starting work. Add these instructions near the top of the dispatch prompt:

- **Before reasoning through research scope:** Include "Load the sequential-thinking skill and use it to reason through the research question, what you already know, and what verification strategy makes sense before starting."
- **Before doing web research:** Include "Load the web-research skill for searching external sources and reading documentation."
- **Before storing findings:** Include "Load the qdrant-notes skill for persisting research findings to the plan session collection."

Skill-loading instructions should appear early in the dispatch prompt so the subagent loads skills before beginning web research. This ensures @external-scout reasons through its research approach before searching and has access to web search and knowledge persistence from the start.

## Examples

**Good:** "Load the web-research skill for external research. Load the qdrant-notes skill for persisting findings. Research question: does JWT specification support custom claim types? We know JWT is standard. What we need to verify: whether custom claims are standard or non-standard. Search JWT documentation and guides. Read actual sources, not snippets. Before starting, retrieve findings from Qdrant collection 'research-findings' using qdrant_qdrant-find. Store new findings when done. Report verified/inferred/uncertain findings and what you could not confirm."

**Bad — leaks private details:** "Search for how to do X for our internal project name." Generalize project-specific terms first.

**Bad — answerable internally:** "Find out what tool our work uses." @external-scout has no internal access. Use @context-scout instead.

**Bad — accepts memory as evidence:** "Tell me about token specifications." @external-scout must search and verify sources, not answer from memory.

## When to Use @external-scout

Dispatch @external-scout for research on public information, documentation, frameworks, libraries, and other publicly accessible resources. Use it when the answer requires verification from external sources or when you need current information about public tools and standards.

Use @context-scout for internal project exploration. Use @external-scout only for questions that cannot be answered from project code or internal documentation.

## Research Questions That Work Well

@external-scout excels at these types of questions:

- **Verifying specifications and standards:** Does JWT support X? What does RFC 7519 say about custom claims?
- **Finding published guides and best practices:** How do industry sources recommend implementing token rotation?
- **Researching third-party libraries and frameworks:** What are the current best practices for dependency injection in Node.js?
- **Learning about tool capabilities:** What does Docker support in version X?
- **Finding example implementations:** Where can we find example code for WebSocket usage?
- **Verifying tool or library versions:** What features were added in version X of this library?

@external-scout does not have access to internal project code or documentation. For those questions, use @context-scout or @context-insurgent.

## Qdrant Integration for Research

When using @external-scout within a plan session, the dispatch prompt should include Qdrant instructions. @external-scout retrieves prior research findings (to avoid re-discovering what is already known) and stores new research findings (so other agents can build on what was discovered).

This creates a research knowledge base that persists through the planning session. Each research phase can reference prior findings.

## Dispatch Prompt Quality Checklist

Before dispatching @external-scout, verify your prompt includes:
- ✓ Clear research question (what needs verification or discovery)
- ✓ Background context (what you already know)
- ✓ What you need to verify or discover
- ✓ Sources to focus on (official docs, published guides, standards)
- ✓ Instruction to read actual sources, not rely on search snippets
- ✓ Plan name and Qdrant collection name
- ✓ Instructions to retrieve prior findings from the collection
- ✓ Instructions to store new findings when done
- ✓ Request for verification distinctions (verified/inferred/uncertain)
