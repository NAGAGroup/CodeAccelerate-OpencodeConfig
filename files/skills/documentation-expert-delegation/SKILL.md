---
name: documentation-expert-delegation
description: Teaches how to dispatch @documentation-expert for writing and editing documentation files.
---

# Delegating to @documentation-expert

This skill teaches how to dispatch @documentation-expert for writing and editing documentation. Load it before writing a dispatch prompt to understand what @documentation-expert can do and how to frame documentation tasks.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "documentation-expert", a short description (3-5 words) for logging purposes, and a complete goal-based prompt. The prompt should state the documentation goal, specify the target file path, describe what topics to cover, point to formatting reference files for structure and tone, include instructions to retrieve previous findings from the appropriate Qdrant collection using qdrant_qdrant-find before starting, specify any constraints (like not creating additional files), and store the work summary when done.

## What @documentation-expert Does

@documentation-expert writes and edits documentation files — Markdown, configuration files, and prompt files. It reads other documents as formatting references to match tone and structure. @documentation-expert works on single files per dispatch and has read-only access to code — it reads code as reference material but does not edit it. It excels at creating user-facing guides, API documentation, architecture overviews, configuration guides, and inline code comments. For code changes, dispatch @junior-dev. @documentation-expert focuses on documentation work, not code implementation.

## Rules for Good Dispatch Prompts

Name the exact file to write or edit precisely. Describe what the document should contain or what needs to change — what topics, what audience, what tone. When working within a plan session, include the plan name (the Qdrant collection name) in the dispatch prompt. Instruct @documentation-expert to use qdrant_qdrant-find to retrieve accumulated session knowledge from that collection before starting, and to store the work summary to the same collection when done. Point to existing documents to use as formatting references so the expert can match your project's style and structure. Explain the purpose so conventions can be applied correctly. State constraints — tone, structure, length, what should not be changed. Let @documentation-expert determine the best structure and wording to make the content clear and usable rather than prescribing exact structure.

## Examples

**Good:** "Write docs/guides/api-configuration.md. It should cover: available options, environment variable setup, and common patterns. Use docs/guides/database-setup.md as formatting reference. Keep it practical with complete examples. Before starting, retrieve context from Qdrant collection 'project-docs' using qdrant_qdrant-find. Store summary when done."

**Bad — multiple files:** "Update all the documentation files." @documentation-expert handles one file per dispatch.

**Bad — asks for code changes:** "Update the configuration and also fix the script." Code changes go to @junior-dev.

**Bad — too vague:** "Improve the documentation." Needs a specific file and what to write or change.

**Bad — missing context about changes:** "Write docs/architecture.md." Needs description of what should be covered, reference files for formatting, and context about what changed in the system.

**Bad — missing-context bad example:** "Update the API documentation." Needs specific file name, what parts changed, and what the documentation should convey to readers.

**Bad — multiple files in one dispatch:** "Write a getting started guide and API reference." Dispatch @documentation-expert once per file.

## When to Use @documentation-expert

Dispatch @documentation-expert for any documentation writing or editing work — user guides, API references, tutorials, architecture documentation, configuration guides, inline code comments. @documentation-expert is especially effective when you have reference documents available for style matching. Use it when documentation needs to be clear, well-structured, and consistent with project style. Dispatch @junior-dev for code changes, @tailwrench for shell operations.
