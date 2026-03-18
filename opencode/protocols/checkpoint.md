# Global Checkpoint Protocol

## Overview
The canonical checkpoint procedure you run at the end of **EVERY** subtask. This protocol ensures state consistency, maintains a living record of session findings, and identifies reusable project-level observations.

## Checkpoint Procedure
Follow these steps in order at the end of each subtask:

1.  **WIP Commit**:
    -   You own ALL commits. Subagents do not commit. Apply the appropriate case:
        -   **Case 1 — Read-only subtask:** No implementation changes were made. Stage only session directory changes (`.opencode/sessions/{name}/`) and commit: `git add .opencode/sessions/{name}/ && git commit -m "wip: subtask NN — {short description}"`. If no session dir changes either, skip the commit.
        -   **Case 2 — HW-direct implementation:** You made all edits directly. Stage all changes and commit: `git add -A && git commit -m "wip: subtask NN — {short description}"`.
        -   **Case 3 — Session-local agent implementation:** A session-local agent made file edits. Verify the agent did NOT commit (`git log -1 --oneline` — the last commit should be from a prior checkpoint). Then stage all changes and commit: `git add -A && git commit -m "wip: subtask NN — {short description}"`.
        -   **Case 4 — Mixed subtask:** A session-local agent modified implementation files AND you updated session directory files. After the agent completes and you've confirmed no agent commit, stage all modified files plus session dir in a single commit: `git add -A && git commit -m "wip: subtask NN — {short description}"`.
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
    -   This keeps you oriented within the session context.

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
     -   **Qualification**: See "Inbox Qualification Guidance" below for deciding whether to write to inbox or to session notes.

7.  **Gate Check**:
    -   After completing this subtask, inspect the current subtask's `## Todolist` (Layer 2) for any `[🚫 GATE]` todo item that has NOT been resolved.
    -   If one exists:
    -   **Do NOT proceed to the next subtask.**
    -   Surface findings to the user with:
        (a) Summary of work since last gate.
        (b) Key findings.
        (c) Specific decision/approval needed.
    -   **Wait** for explicit approval before continuing.
    -   Note: Gates are embedded as `[🚫 GATE]` todo items inside the **preceding subtask's `## Todolist`** — never as standalone subtask rows in `index.md`.

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
-   Consider running `/context-audit` to review session notes for promotion candidates before the final commit.

## Inbox Qualification Guidance
Use this criteria to decide if an observation belongs in the project `inbox`:

-   **Primary Question**: "Would a future session benefit from knowing this?"
    -   If **No** → Findings specific to the current session only belong in **Session Notes** (step 5), not inbox.
    -   If **Yes** → Write to inbox.

-   **Include in Inbox** (when the answer to the Primary Question is Yes):
     -   Tool-specific findings that might apply across projects but need validation (e.g., "Tool X always requires flag Y when used with Z").
     -   Newly discovered naming conventions or patterns that need project consensus.
     -   Process improvements or workflows worth considering for future use.

-   **Include in Session Notes** (not inbox):
     -   Findings specific to the current session's task.
     -   Local decisions made only for this session.
     -   Transient implementation details.

See `~/.config/opencode/protocols/context-management.md` for full qualification criteria, staleness rules, and the archival process for promoting inbox items to permanent context.
