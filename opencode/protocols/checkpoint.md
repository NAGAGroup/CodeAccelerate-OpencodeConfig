# Global Checkpoint Protocol

## Overview
The canonical checkpoint procedure run by HeadWrench at the end of **EVERY** subtask. This protocol ensures state consistency, maintains a living record of session findings, and identifies reusable project-level observations.

## Checkpoint Procedure
Follow these steps in order at the end of each subtask:

1.  **WIP Commit**:
    -   Apply the 3-way ownership rule:
        -   **Implementation subtask (CodeWriter/DocWriter):** the subagent already committed at task completion. HeadWrench verifies the commit exists with `git log -1 --oneline` and skips creating another commit if confirmed.
        -   **Read-only/analysis subtask:** **Skip** if the subtask was strictly analysis/read-only with no file changes.
        -   **HeadWrench-direct edits:** run `git add -A && git commit -m "wip: subtask-NN — <short description>"` (replace `NN` with the current subtask ID).
    -   Any commit created for the subtask must include updated session directory files (for example `.opencode/sessions/...`) when they were part of the task.
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
     -   **Important**: Session notes are session-scoped (Tier 4 context) and will be archived when the session completes. Write notes knowing they may eventually be promoted to permanent context (via inbox) or archived. Findings that should persist across sessions belong in the inbox (step 6) or later in context/ (via `/context-audit`).

6.  **Write Inbox**:
     -   Determine if any reusable project-level observations were made (e.g., naming conventions, tool quirks, process improvements, or patterns).
     -   **Format**: Write to `.opencode/inbox/<YYYY-MM-DD>-<topic>.md`.
     -   **YAML Header**: Every new inbox item must include this metadata header at the top of the file:
         ```yaml
         ---
         topic: short-topic-tag
         session: session-name
         created: YYYY-MM-DD
         active: true
         supersedes: ~
         superseded_by: ~
         ---
         ```
     -   **Supersession**: Use `supersedes:` and `superseded_by:` when writing an item that replaces an older one. Set the new item's `supersedes: old-filename.md` and update the old item's `superseded_by: new-filename.md`.
     -   **Rule**: One observation per file. Skip if nothing qualifies.
     -   **Qualification**: See "Inbox Qualification Guidance" below for deciding whether to write to inbox or directly to context/.

7.  **Gate Check**:
    -   If the next subtask has an ID format of `GN` or is prefixed with `[🚫 GATE]`:
    -   **Do NOT proceed.**
    -   Surface findings to the user with:
        (a) Summary of work since last gate.
        (b) Key findings.
        (c) Specific decision/approval needed.
    -   **Wait** for explicit approval before continuing.

8.  **Circuit Breaker**:
    -   If the last N subtasks failed (N = `circuitBreakerThreshold` in `spec.json`, default 3):
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

-   **Primary Question**: "Would a future session benefit from knowing this?"
    -   If **No** → Findings specific to the current session only belong in **Session Notes** (step 5), not inbox.
    -   If **Yes** → Proceed to the destination question below.

-   **Destination Question**: "Is the destination tier obvious and the item clearly reusable?"
    -   **Obvious destination + clearly reusable** → Write directly to context/ (`~/.config/opencode/context/` for global patterns or `.opencode/context/` for project-specific facts). These will have YAML headers with `promoted_from: direct`.
    -   **Uncertain destination or candidate for review** → Write to inbox. The item will be reviewed during `/context-audit` and promoted to global or local context (Tier 2 or Tier 3) by human decision.

-   **Include in Inbox** (when destination is uncertain):
     -   Tool-specific findings that might apply across projects but need validation (e.g., "Tool X always requires flag Y when used with Z").
     -   Newly discovered naming conventions or patterns that need project consensus.
     -   Process improvements or workflows worth considering for future use.

-   **Include in Session Notes** (not inbox):
     -   Findings specific to the current session's task.
     -   Local decisions made only for this session.
     -   Transient implementation details.

-   **Write Directly to Context** (not inbox):
     -   Universal patterns reusable across any project (write to `~/.config/opencode/context/`).
     -   Project-wide conventions clearly applicable to this codebase (write to `.opencode/context/`).
