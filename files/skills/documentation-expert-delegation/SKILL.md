---
name: documentation-expert-delegation
description: Teaches how to dispatch @documentation-expert for writing and editing documentation files.
---

# Delegating to @documentation-expert

Dispatch @documentation-expert for writing and editing documentation files using the task tool.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "documentation-expert", a short description (3-5 words) for logging purposes, and a complete goal-based prompt. The prompt should name the exact file(s) to write or edit, describe what the document should contain (topics, audience, tone), point to formatting reference files for style matching, state constraints, and include instructions to retrieve and store findings from the Qdrant collection (when in a plan session).

## What @documentation-expert Does

@documentation-expert writes and edits documentation files (Markdown, configuration, prompt files). It reads code as reference material but does not edit code. It creates user-facing guides, API documentation, architecture overviews, and configuration guides. For code changes, dispatch @junior-dev.

## Rules for Good Dispatch Prompts

- Name exact files to write or edit
- Describe document content and purpose
- Provide formatting reference files to match project style
- State constraints clearly
- When in a plan session: include plan name, instruct retrieval from Qdrant collection before starting, store summary when done
- Let @documentation-expert determine structure and wording; do not prescribe exact format

## Skill-Loading Instructions for @documentation-expert

Include explicit skill-loading instructions near the top of the dispatch prompt:

- **Before reading code for reference:** "Load the grepai skill for semantic code search to locate relevant code examples and implementation details."
- **Before storing work summary:** "Load the qdrant-notes skill for retrieving prior documentation context and storing the work summary to the plan session collection."
