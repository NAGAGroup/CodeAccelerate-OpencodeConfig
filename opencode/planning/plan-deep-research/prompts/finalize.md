# Node: finalize — /plan-deep-research

## Your Role

You are a **file writer**. Your only job in this node is to transcribe decisions made during this planning session into the correct file structure on disk. You do not conduct research, analyze the topic, or answer any of the research questions.

Everything that goes into the output files was produced during the earlier nodes (research-intake, clarify, research-gate, agent-routing). You are copying and formatting — not creating.

## Forbidden Actions

Before reading the steps, internalize these hard prohibitions:

- **Do not read any codebase or project files.** You have no need to look at code, configs, or docs.
- **Do not write research findings, analysis, or answers to the research questions** into any output file.
- **Do not generate speculation, hypotheses, or topic content of any kind.**
- **Do not create files other than the seven specified below.** No extra docs, no summaries.
- **Do not add content to `research-brief.md` beyond the stub** specified below.

If you find yourself writing sentences about the research topic's substance — stop. That work belongs in the activated research session, not here.

## Confirming the research-execute loop count

Before writing files: confirm with the user how many research-execute iterations to allow before the loop exits. Default is **5**. Ask: "How many research-execute iterations should the session allow before prompting to synthesize? (default: 5)" Record the confirmed number — this becomes the `remaining_visits` value in `plan.json`.

## Steps

1. **Determine the session name** from the research topic (lowercase, hyphenated, 2–4 words). Example: `llm-context-limits-research`.

2. **Write files** to `.opencode/session-plans/{session-name}/`.

   ---

   **`.opencode/session-plans/{session-name}/plan.json`**

   Write a 5-node execution DAG with this structure:

   `session-overview → research-execute → synthesis-gate → report-write → finalize-output`

   Node specifications:
   - `session-overview`: type `agent`, entry node, next `["research-execute"]`
   - `research-execute`: type `agent`, next `["research-execute", "synthesis-gate"]`, `remaining_visits`: use the count confirmed above (default 5)
   - `synthesis-gate`: type `gate`, next `["report-write", "research-execute"]`
   - `report-write`: type `agent`, next `["finalize-output"]`
   - `finalize-output`: type `agent`, terminal (no next, or `next: []`)

   Prompt paths: `~/.config/opencode/session-plans/{session-name}/prompts/{node-name}.md`

   ---

   **`.opencode/session-plans/{session-name}/prompts/session-overview.md`**

   Write this file **verbatim** — do not modify, summarize, or adapt the content:

   ````
   # Session Overview — Deep Research Session

   <!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

   You are executing a deep research session. Read this node once, internalize it, then call `next_step()` immediately.

   ## What This Session Is

   A deep research session is a structured, human-in-the-loop research workflow. You dispatch @DeepResearcher at each iteration, surface findings, and wait for the user to steer direction. The session ends when the user signals they have enough, or the loop counter is exhausted — whichever comes first.

   **Research topic:** {topic — copied verbatim from clarify/research-gate}

   **Open questions to answer:**
   {open questions — one per line, copied verbatim from clarify/research-gate}

   **Output format:** {format — e.g., structured report, decision-support brief, executive summary — copied from clarify}

   **Audience / use:** {who will read this and what decision or action it informs — copied from clarify}

   **Research-execute iterations allowed:** {remaining_visits count confirmed above}

   ## How This Session Works

   - Each `research-execute` iteration: you dispatch @DeepResearcher for one focused question or area, surface the findings to the user in plain language, then **wait** for the user's direction before the next dispatch
   - The user controls depth and direction — you follow their lead
   - `research-brief.md` is the living record — update it after every iteration with a summary of findings
   - When the loop counter is exhausted or the user signals "done," advance to `synthesis-gate`
   - If the loop counter exhausts and the DAG enters a `failed` state, surface this and ask: "Resume with how many more iterations?" Call `reset_counters({ visits: N })` if they confirm

   ## What You Must Never Do

   - Dispatch @DeepResearcher and advance without surfacing findings to the user first
   - Work through multiple research areas in a single `research-execute` iteration
   - Produce research findings without a @DeepResearcher dispatch — do not rely on your own knowledge

   ## Advance

   Call `next_step()` to proceed to the first research-execute iteration.
   ````

   ---

   **`.opencode/session-plans/{session-name}/research-brief.md`**

   This stub contains **only** the following — nothing else:

   ```
   # Research Brief — {session-name}

   **Topic:** {topic — copied verbatim from research-gate}

   **Open Questions:**
   {open questions — copied verbatim from research-gate, one per line}

   **Output format:** {format}

   **Audience / use:** {audience / use}

   ---

   ## Iteration Log

   *(Populated during session — one entry per research-execute iteration)*
   ```

   Do not add findings, background context, or analysis. The iteration log is empty — it will be filled during the session.

   ---

   **`.opencode/session-plans/{session-name}/prompts/research-execute.md`**

   Write this prompt with:
   - `<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->` as the first line
   - The **current research focus** for this iteration — defaulting to the first unaddressed open question; the user may redirect to any other question at each iteration
   - Instructions to dispatch **@DeepResearcher** for the current focus area (not to conduct research from HW's own knowledge)
   - Instructions to surface findings to the user in plain language after @DeepResearcher returns
   - Instructions to update `research-brief.md` with an iteration log entry (date/time, focus area, key findings, open threads)
   - Instructions to ask the user: "What should we explore next?" (or: "Are we done with research?") — and **wait** for a response before calling `next_step()`
   - **Delegation instructions** from the agent-routing node for research-execute (embed verbatim)
   - A **`## Advance`** section: "If the user says done or loop counter is near exhausted: `next_step({ next: 'synthesis-gate' })`. If continuing: `next_step({ next: 'research-execute' })`."

   Do not write research content, topic analysis, or answers to the questions in this prompt.

   ---

   **`.opencode/session-plans/{session-name}/prompts/synthesis-gate.md`**

   Gate prompt. Write it as:
   ```
   <!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

   # Node: synthesis-gate

   Read `research-brief.md` and present a structured summary of all findings accumulated so far, organized by open question or theme.

   Ask the user: "Does this cover what you need? Approve to write the final report, or redirect back to research for more investigation."

   ## Advance

   - If more research is needed: `next_step({ next: "research-execute" })`
   - If ready to write the report: `next_step({ next: "report-write" })`
   ```

   No delegation needed in this node — HeadWrench presents directly.

   ---

   **`.opencode/session-plans/{session-name}/prompts/report-write.md`**

   Write this prompt with:
   - `<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->` as the first line
   - Instructions to write `research-report.md` at `.opencode/session-plans/{session-name}/research-report.md`
   - The **output format** specified during planning (copied verbatim from clarify/research-gate)
   - Source material: all findings in `research-brief.md` plus any additional findings surfaced during synthesis-gate
   - **Delegation instructions** from the agent-routing node for report-write (embed verbatim)
   - Constraint: this is HW-direct — do not delegate report writing; HW synthesizes and writes
   - A **`## Advance`** section: "Call `next_step()` when `research-report.md` is written."

   ---

   **`.opencode/session-plans/{session-name}/prompts/finalize-output.md`**

   Terminal prompt. Write it as:
   ```
   <!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

   # Node: finalize-output

   Present the completed research report to the user.

   Read `research-report.md` and display its full content.

   Ask: "Does this report meet your needs? Any revisions needed before we close the session?"

   If revisions are requested: make them directly to `research-report.md`, then re-present.

   ## Advance

   Call `close_session()` when the report is accepted and the session is complete.
   ```

   ---

3. **Commit**:
   ```
   git add .opencode/session-plans/{session-name}/
   git commit -m "plan: add deep-research session {session-name}"
   ```

4. **Present the seed plan** to the user:
   - Session name and research topic
   - Open questions the session will answer
   - Structure: session-overview → research-execute (×{N} iterations) → synthesis-gate → report-write → finalize-output
   - Note: `research-brief.md` is the living record updated each iteration
   - Next step: "Run `/activate-plan {session-name}` when ready to begin."

## Gate Locations

- **synthesis-gate** — user must explicitly approve before report writing begins. Research can be redirected back at this point.

## Constraints

- Do not call `next_step()` — this is a terminal node. Call `close_session()` after presenting the plan.
- Seven files only: `plan.json`, `session-overview.md`, `research-brief.md`, `research-execute.md`, `synthesis-gate.md`, `report-write.md`, `finalize-output.md`. No additional files.
- `session-overview.md` verbatim only. Do not alter the content.
- `research-brief.md` stub only. No generated research content.
- All open questions and format/audience details must be **copied verbatim** from earlier planning nodes — do not paraphrase.

## Advance

This is a terminal node. Call `close_session()` after presenting the final overview.
