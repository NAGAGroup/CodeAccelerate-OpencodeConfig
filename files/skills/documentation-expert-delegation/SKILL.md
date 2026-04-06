---
name: documentation-expert-delegation
description: Teaches how to dispatch @documentation-expert for writing and editing documentation files.
---

# Delegating to @documentation-expert

This skill teaches how to dispatch @documentation-expert for writing and editing documentation. Load it before writing a dispatch prompt to understand what @documentation-expert can do and how to frame documentation tasks.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "documentation-expert", a short description (3-5 words) for logging purposes, and a complete goal-based prompt. The prompt should state the documentation goal, describe which files are in scope and what the documentation goal is, describe what topics to cover, point to formatting reference files for structure and tone, include instructions to retrieve previous findings from the appropriate Qdrant collection using qdrant_qdrant-find before starting, specify any constraints (like not creating additional files), and store the work summary when done.

## What @documentation-expert Does

@documentation-expert writes and edits documentation files — Markdown, configuration files, and prompt files. It reads other documents as formatting references to match tone and structure. It has read-only access to code — it reads code as reference material but does not edit it. It excels at creating user-facing guides, API documentation, architecture overviews, configuration guides, and inline code comments. For code changes, dispatch @junior-dev. @documentation-expert focuses on documentation work, not code implementation.

## Rules for Good Dispatch Prompts

Name the exact file to write or edit precisely. Describe what the document should contain or what needs to change — what topics, what audience, what tone. When working within a plan session, include the plan name (the Qdrant collection name) in the dispatch prompt. Instruct @documentation-expert to use qdrant_qdrant-find to retrieve accumulated session knowledge from that collection before starting, and to store the work summary to the same collection when done. Point to existing documents to use as formatting references so the expert can match your project's style and structure. Explain the purpose so conventions can be applied correctly. State constraints — tone, structure, length, what should not be changed. Let @documentation-expert determine the best structure and wording to make the content clear and usable rather than prescribing exact structure.

## Skill-Loading Instructions for @documentation-expert

Include explicit skill-loading instructions in your dispatch prompt so @documentation-expert loads necessary skills before starting work. Add these instructions near the top of the dispatch prompt:

- **Before making file edits:** Include "Load the file-operations skill for reading and editing documentation files."
- **Before storing findings:** Include "Load the qdrant-notes skill for persisting work summaries and decisions to the plan session collection."

Skill-loading instructions should appear early in the dispatch prompt so the subagent loads skills before beginning documentation work. This ensures @documentation-expert has access to file operations and knowledge persistence from the start.

## Examples

**Good:** "Load the file-operations skill for reading and editing files. Load the qdrant-notes skill for persisting work summaries. Document the authentication system. Write or update the following files: docs/guides/authentication-overview.md (system architecture and flow) and docs/guides/authentication-setup.md (user-facing setup instructions). Use docs/guides/database-setup.md as formatting reference to match our documentation style. Before starting, retrieve context from Qdrant collection 'project-docs' using qdrant_qdrant-find. Store summary when done."

**Bad — asks for code changes:** "Update the configuration and also fix the script." Code changes go to @junior-dev.

**Bad — too vague:** "Improve the documentation." Needs a specific file and what to write or change.

**Bad — missing context about changes:** "Write docs/architecture.md." Needs description of what should be covered, reference files for formatting, and context about what changed in the system.

**Bad — missing-context bad example:** "Update the API documentation." Needs specific file name, what parts changed, and what the documentation should convey to readers.

## When to Use @documentation-expert

Dispatch @documentation-expert for any documentation writing or editing work — user guides, API references, tutorials, architecture documentation, configuration guides, inline code comments. @documentation-expert is especially effective when you have reference documents available for style matching. Use it when documentation needs to be clear, well-structured, and consistent with project style. Dispatch @junior-dev for code changes, @tailwrench for shell operations.

## Documentation Tasks That Work Well

@documentation-expert excels at these types of work:

- **Writing new documentation files** from scratch based on specifications and reference materials
- **Editing existing documentation** to clarify, expand, or update content
- **Creating formatting consistency** across documentation by using reference files as style guides
- **Writing inline code comments** to clarify complex code logic
- **Creating configuration documentation** (YAML, JSON, environment variable guides)
- **Transcribing from specifications** to clear documentation that users can follow
- **Updating documentation** to reflect recent code changes or feature additions

@documentation-expert has read-only access to code — it reads code to understand patterns and can write documentation about code, but does not modify code. For code changes, dispatch @junior-dev.

## Qdrant Integration for Documentation Work

When using @documentation-expert within a plan session, the dispatch prompt should include Qdrant instructions. @documentation-expert retrieves prior findings and context (to inform what documentation should cover) and stores work summaries to the collection (so other agents can understand what documentation was created or updated).

This creates continuity in the planning process. Documentation decisions made early inform later documentation work.

## Dispatch Prompt Quality Checklist

Before dispatching @documentation-expert, verify your prompt includes:
- ✓ Exact file(s) to write or edit (not vague descriptions)
- ✓ What the documentation should contain (topics, audience, purpose)
- ✓ Formatting reference file(s) to match project style and tone
- ✓ Context about what changed or why this documentation is needed
- ✓ Any constraints (tone, structure, length, what should not be changed)
- ✓ Plan name and Qdrant collection name
- ✓ Instructions to retrieve context from the collection before starting
- ✓ Instructions to store work summary when done

## Common Documentation Anti-patterns

**Anti-pattern: Asking for code implementation.** You dispatch @documentation-expert to "write the API docs and also implement authentication checks". Code changes go to @junior-dev, documentation to @documentation-expert. Keep these separate.

**Anti-pattern: No formatting reference.** You ask for documentation without pointing to existing files to use as style reference. Without style guidance, the documentation may not match your project's conventions.

**Anti-pattern: Vague scope.** You ask to "improve the documentation" without specifying which files, what topics, or what audience. Documentation needs specific targets.
