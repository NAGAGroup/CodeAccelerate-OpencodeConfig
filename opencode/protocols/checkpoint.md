# Global Checkpoint Protocol

## Overview
The canonical checkpoint procedure run by HeadWrench at the end of **EVERY** subtask. This protocol ensures state consistency, maintains a living record of session findings, and identifies reusable project-level observations.

## Checkpoint Procedure
Follow these steps in order at the end of each subtask:

1.  **WIP Commit**:
    -   Run `git add -A && git commit -m "wip: subtask-NN — <short description>"` (replace `NN` with the current subtask ID).
    -   **Skip** if the subtask was strictly analysis/read-only with no file changes.
    -   The WIP commit ensures `spec.json` always reflects the last known good state.
    -   This file is the authoritative recovery anchor — if context is lost mid-session, reading `spec.json` is always the correct first step.
    -   It tells you the `currentSubtask` index, which resolves which subtask file to load next.
    -   Do not use `index.md` as the recovery anchor — it is human-readable documentation, not the state source.

2.  **Update index.md**:
    -   Mark the just-completed subtask as `completed` in the Subtask Table.
    -   Mark the next subtask as `in_progress` if it's about to be executed.

3.  **Update spec.json**:
    -   Increment `currentSubtask` by 1.
    -   Update the status of the completed subtask to `"completed"`.

4.  **Update Session Summary Todo**:
    -   Update the session summary todo item (created at session bootstrap) to reflect the new current subtask number and description.
    -   This keeps HeadWrench oriented within the session context.

5.  **Write Session Notes**:
    -   Identify any significant findings, decisions, or discoveries from this subtask.
    -   Write one file per concept to `.opencode/sessions/{name}/notes/`.
    -   **Filename**: `kebab-case-topic.md`.
    -   **Content**: Must include what was found/decided, why, and any open questions.

6.  **Write Inbox**:
    -   Determine if any reusable project-level observations were made (e.g., naming conventions, tool quirks, process improvements, or patterns).
    -   **Format**: Write to `.opencode/inbox/<YYYY-MM-DD>-<topic>.md`.
    -   **Rule**: One observation per file. Skip if nothing qualifies.

7.  **Gate Check**:
    -   If the next subtask has an ID format of `GN` or is prefixed with `[🚫 GATE]`:
    -   **Do NOT proceed.**
    -   Surface findings to the user with:
        (a) Summary of work since last gate.
        (b) Key findings.
        (c) Specific decision/approval needed.
    -   **Wait** for explicit approval before continuing.

8.  **Circuit Breaker**:
    -   If the last N subtasks failed (N = `circuitBreakerN` in `spec.json`, default 3):
    -   **Stop immediately.** Do not attempt the next subtask.
    -   Report all N failures and ask the user how to proceed.

## Build-Test-Debug Loop — Hypothesis Formation

Before writing a hypothesis note at step 4 of the debug loop, use **Sequential Thinking** to reason through possible root causes systematically. Consider:
- What changed since the last passing state?
- Which component owns the failing behaviour?
- What are the 2-3 most likely causes, ranked by probability?

Write the winning hypothesis to `.opencode/sessions/{name}/notes/` then proceed to delegate the fix.


If a subagent returns empty results or hits its step limit:
-   Write a note describing the failure.
-   Retry **once** with a revised or more specific prompt.
-   On the **second failure**, escalate to the user before retrying again.

## Session Close (Final Subtask Complete)
When all subtasks in the session plan are finished:
-   **Final Commit (not WIP)**: `git commit -m "feat: complete session — <session-name>"`
-   Update `index.md` session status to `completed`.
-   Update all remaining `spec.json` subtask statuses to their final state.
-   Write a **closing note** summarizing the session: what changed, final outcomes, and follow-up recommendations.

## Inbox Qualification Guidance
Use this criteria to decide if an observation belongs in the project `inbox`:

-   **Ask**: "Would a future session benefit from knowing this?"
-   **Include (Inbox)**:
    -   Tool-specific findings (e.g., "Tool X always requires flag Y").
    -   Newly discovered naming conventions or project-wide patterns.
    -   Process improvements that should be applied to future workflows.
-   **Exclude (Notes Only)**:
    -   Findings specific to the current session's task.
    -   Local decisions made only for this session.
    -   Transient implementation details.
