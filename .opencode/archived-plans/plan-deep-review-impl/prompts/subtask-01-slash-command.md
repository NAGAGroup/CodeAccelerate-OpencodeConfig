<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 01: Write Slash Command File

## Objective

Create the slash command registration file for `/plan-deep-review`. This file is discovered automatically by OpenCode from the `opencode/commands/` directory — its filename becomes the command name. The file must include YAML frontmatter, a `$ARGUMENTS` placeholder, and a mandatory protocol instructing the agent to call `plan_deep_review()` immediately.

## Scope

- **Write:** `opencode/commands/plan-deep-review.md`
- **Reference pattern:** `opencode/commands/plan-deep-research.md` (read this first for exact format)
- **Do not touch** any other files

## Constraints

- YAML frontmatter must include a `description` field describing the command
- The body must include `$ARGUMENTS` as a placeholder for the slash command arguments
- Must include a bold WARNING block with "MANDATORY EXECUTION PROTOCOL — NOT OPTIONAL" telling the agent to call `plan_deep_review()` immediately
- The tool name to call is `plan_deep_review()` (with underscore, not hyphen)
- Match the style and structure of `plan-deep-research.md` exactly

## Todolist

- [ ] Read `opencode/commands/plan-deep-research.md` to understand the exact format
- [ ] Write `opencode/commands/plan-deep-review.md` following the same pattern
- [ ] Verify: frontmatter has `description`, body has `$ARGUMENTS`, MANDATORY PROTOCOL calls `plan_deep_review()`

## Delegation

**Agent:** @QuickDoc (single instance)
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/commands/plan-deep-research.md`
- Goal: Write `opencode/commands/plan-deep-review.md` following the exact same format but for the `/plan-deep-review` command, calling `plan_deep_review()` as the tool
- Constraints: Match formatting exactly; tool name uses underscore not hyphen; description should describe code review planning
- Verify: File exists and has the three required elements (frontmatter description, $ARGUMENTS, MANDATORY PROTOCOL)

## Advance

Call `next_step()` when this subtask is complete.
