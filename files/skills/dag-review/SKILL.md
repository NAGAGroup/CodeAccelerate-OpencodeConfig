---
name: dag-review
description: Teaches how to dispatch @dag-reviewer to review execution DAGs against design criteria and produce structured critiques.
---

# Delegating to @dag-reviewer

This skill teaches how to dispatch @dag-reviewer to review execution DAGs against design criteria. Load it before writing a dispatch prompt to understand what @dag-reviewer needs to produce a thorough critique.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "dag-reviewer", a short description (3-5 words) for logging purposes, and a complete goal-based prompt. The prompt must specify the plan name to review, state the user's goal, list the review dimensions to evaluate, include instructions to retrieve previous findings from the appropriate Qdrant collection using qdrant_qdrant-find before starting, and store findings and critique when done.

## What @dag-reviewer Does

@dag-reviewer evaluates execution DAGs against design criteria and produces structured critiques. It reads the DAG structure, understands the intended goal and scope, and assesses the design against multiple dimensions: completeness, dependency ordering, component fit, verification coverage, scope discipline, failure handling, and efficiency. When it needs to spot-check codebase assumptions, it investigates directly using its search and file reading tools — it does not delegate to scouts. @dag-reviewer reviews and critiques DAGs thoroughly but does not revise them — revisions are separate work.

## Rules for Good Dispatch Prompts

State the plan_name explicitly so the reviewer knows which DAG to evaluate. Provide the user's goal so the reviewer can assess whether the DAG fits the intention and scope. Describe the review dimensions: completeness, dependency order, component fit, verification coverage, scope discipline, failure handling, and efficiency. When working within a plan session, include the plan name (the Qdrant collection name) in the dispatch prompt. The prompt must be self-contained.

## Skill-Loading Instructions for @dag-reviewer

Include explicit skill-loading instructions in your dispatch prompt so @dag-reviewer loads necessary skills before starting work. Add these instructions near the top of the dispatch prompt:

- **Before inspecting or validating the DAG:** Include "Load the dag-tools skill for reading, inspecting, and validating DAG structures."
- **Before retrieving or storing findings:** Include "Load the qdrant-notes skill for retrieving prior design context and storing review findings to the plan session collection."
- **Before reasoning through review criteria:** Include "Load the sequential-thinking skill for step-by-step reasoning through review dimensions and identifying gaps."

Skill-loading instructions should appear early in the dispatch prompt so @dag-reviewer loads skills before beginning review work. This ensures the reviewer has access to DAG tools, knowledge persistence, and structured reasoning from the start.

## Examples

**Good:** "Load the dag-tools skill for reading and validating DAG structures. Load the qdrant-notes skill for retrieving design context and storing review findings. Load the sequential-thinking skill for reasoning through review dimensions. Review DAG for plan: logging-auth-module. Goal: add logging to authentication module only. Review dimensions: completeness, dependency order, component fit, verification coverage, scope discipline, failure handling, efficiency. Before starting, retrieve previous findings from Qdrant collection 'logging-auth-module' using qdrant_qdrant-find. Store findings and critique when done."

**Bad — no plan_name:** "Review the DAG." The reviewer needs the plan name to identify which DAG to evaluate.

**Bad — asks for revision:** "Review the DAG and fix any problems." Reviewer critiques only. Revision is separate work with its own dispatch.

**Bad — missing goal context:** "Review the DAG for plan: logging-auth-module." The reviewer needs the user's goal to assess whether the DAG is appropriate and complete.

**Bad — asks for implementation:** "Review the DAG and tell me what files to edit." Review evaluates design only.

## When to Use @dag-reviewer

Dispatch @dag-reviewer after a DAG has been designed, before execution begins. Use it for quality assurance on DAG structure to catch structural problems, missing work, verification gaps, or scope violations. Do not use it for implementation, investigation, or DAG redesign.

## DAG Review Dimensions

@dag-reviewer evaluates DAGs against multiple dimensions to produce thorough critiques:

- **Completeness:** Does the DAG include all work phases needed to accomplish the goal?
- **Dependency ordering:** Are work phases sequenced so that information from earlier phases informs later phases?
- **Component fit:** Are the selected component types appropriate for their intended work?
- **Verification coverage:** Are verification nodes placed appropriately? Are success criteria verifiable?
- **Scope discipline:** Does the DAG stay within stated boundaries? Are out-of-scope areas avoided?
- **Failure handling:** If a phase fails, is there appropriate failure mode handling?
- **Efficiency:** Is the DAG structured to avoid unnecessary work or redundant phases?

A good review assesses the DAG against all these dimensions and identifies gaps or problems.

## Review Context Requirements

@dag-reviewer needs specific context to conduct thorough reviews:

- **Plan name:** The DAG to review
- **User's goal:** Why this DAG was designed; what problem it solves
- **Planning findings:** What investigation revealed that informed the design
- **Review dimensions:** Which dimensions to focus on (or all if not specified)

Without this context, the reviewer cannot assess whether the DAG is appropriate for its intended use.

## Qdrant Integration for Reviews

When using @dag-reviewer within a plan session, the dispatch prompt should include Qdrant instructions. @dag-reviewer retrieves prior design context and findings (to understand why the DAG was designed this way) and stores its critique findings to the collection (so other agents can understand the review results).

This creates continuity in the planning process. Designers and reviewers work from shared context.

## Dispatch Prompt Quality Checklist

Before dispatching @dag-reviewer, verify your prompt includes:
- ✓ Plan_name (the DAG to review)
- ✓ User's goal (what the DAG is supposed to accomplish)
- ✓ Planning findings (context about constraints and discoveries)
- ✓ Review dimensions (what aspects to evaluate)
- ✓ Plan name and Qdrant collection name
- ✓ Instructions to retrieve prior findings from the collection
- ✓ Instructions to store critique and findings when done

## Common Review Findings

Experienced reviewers often identify these patterns:

- **Missing verification:** A work phase produces output but includes no verification that the output is correct.
- **Ordering dependency:** Phase B depends on information from Phase A, but they are ordered to execute in parallel or Phase B before Phase A.
- **Scope creep:** A node performs work outside the stated scope boundaries.
- **Unclear success criteria:** Verification nodes check success but success criteria are ambiguous or unmeasurable.
- **Incomplete paths:** Some user interactions may branch, leaving certain paths uncovered or unhandled.
