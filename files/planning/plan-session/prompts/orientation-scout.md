# Project Orientation

Delegate a context-scout subagent using the `task` tool to survey the current project to help orient the planning process.

## Hard Rules (violating any = task failure)

1. Always write your prompt as instructions *to* context-scout, not about context-scout. Treat it as a message to another agent.
2. Always write structured prompts, not a dense block of text. Use formatting, lists, and sections to make the prompt easy to parse.
3. Always instruct context-scout how you want it to report back (e.g. structure, content, what to exclude, etc.)

## Preflight Checklist (fill out the preflight before continuing)

1. Call `qdrant_qdrant-find` using `collection_name={{PLAN_NAME}}` and query "user goal and request".
2. Call `qdrant_qdrant-find` using `collection_name={{PLAN_NAME}}` and query "user involvement and constraints".
3. Fill out the following fully before continuing.

```toml
[preflight]
user_goal_and_request = <summarize the user's overall goal and specific request in one sentence>
subagent_type = context-scout
description = <3-5 word summary of the delegation's purpose — e.g., "project orientation survey">
topics_and_questions = <decide on topics and questions you want context-scout to survey>
constraints_and_involvement = <summarize any constraints on the project and the user's desired level of involvement in one sentence>
report_format = <decide on the format and content for the context-scout's report response>
goal_driven_delegation_prompt = <true/false sanity check>
```

## Delegation Protocol

1. Decide how you want to structure your prompt and what the content is. Leverage your preflight checklist.
2. Call the task tool, filling in the `prompt` argument with the structured prompt you decided on. Use the preflight checklist to fill in `subagent_type` and `description` arguments.
3. Once context-scout responds, categorize the report into distinct notes. Call `qdrant_qdrant-store` for each distinct note using `collection_name={{PLAN_NAME}}`. Do not store as a monolithic note, this makes discoverability and parsing of notes more difficult.

## Gate (fill out the toml before continuing)

```toml
[gate]
findings = <findings surfaced by context-scout, summarized in your own words>
unknowns = <unknowns or gaps that remain after context-scout's survey, summarized in your own words>
qdrant_store_note_count = <N>
qdrant_collection_name_used = <collection name used in qdrant_qdrant-store calls>
gate_passed = <true/false> # false if your qdrant_qdrant-store calls were insufficient or you used the wrong collection name
```

If your gate checks revealed poor note taking, leading the `gate_passed = false`, correct that with additional calls to `qdrant_qdrant-store` before calling `next_step`. Do not call `next_step` until your gate checks are all satisfactory.

## How to Proceed

Call `next_step` once preflight checks, delegation and final gate have all been completed. Proceed immediately, do not wait for user instruction to proceed.
