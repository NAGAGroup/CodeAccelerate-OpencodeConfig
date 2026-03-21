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

   Generate this file **dynamically** using the research topic, open questions, output format, audience/use, and iteration count confirmed during this planning session. Do not copy a static template.

   The file must include:
   - `<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->` as the first line
   - A brief description of what this session is (a deep research session — automated, loop-based research using @DeepResearcher agents)
   - **Research topic** (copied verbatim from research-intake/clarify)
   - **Open questions to answer** (copied verbatim from clarify/research-gate, one per line)
   - **Output format** (from clarify — e.g., structured report, decision-support brief, executive summary)
   - **Audience / use** (from clarify — who will read this and what decision it informs)
   - **Research-execute iterations allowed** (the confirmed remaining_visits count)
   - **How This Session Works** — describe the UNSUPERVISED loop:
     - Each `research-execute` iteration: dispatch multiple @DeepResearcher agents in parallel (one per open question or sub-area), accumulate all findings to `research-brief.md`, then loop automatically
     - No user interaction mid-loop — the agent does not surface findings or wait between iterations
     - When the loop counter is exhausted, the DAG advances to `synthesis-gate` automatically
     - If the loop counter exhausts and the DAG enters a `failed` state, surface this and ask how many more iterations to allow; call `reset_counters({ visits: N })` if confirmed
     - At `synthesis-gate`, HW presents all accumulated findings for user review and steering
   - **What You Must Never Do** — surface findings mid-loop, wait for user input between iterations, conduct research from your own knowledge (always dispatch @DeepResearcher)
   - **Advance** — call `next_step()` to proceed to the first research-execute iteration

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
   - Instructions to dispatch **multiple @DeepResearcher agents in parallel** — one per open question or research sub-area — each iteration
   - Instructions to accumulate all findings to `research-brief.md` with an iteration log entry (date/time, focus areas, key findings, open threads)
   - Instructions to loop automatically via `next_step()` without surfacing findings or waiting for user input — the loop is fully unsupervised
   - Instructions: when the loop counter is exhausted, the DAG advances automatically to `synthesis-gate` — no action needed
   - **Delegation instructions** from the agent-routing node for research-execute (embed verbatim)
   - A **`## Constraints`** section with this exact content:

     ```
     ## Constraints

     You are in a loop node. You have ONE action: dispatch all @DeepResearcher agents in parallel, wait for all to return, accumulate findings to `research-brief.md`, then call `next_step()` immediately. Do NOT surface findings to the user mid-loop. Do NOT wait for user input between iterations. Do NOT synthesize or interpret findings here — that happens at synthesis-gate. After calling `next_step()`, stop — the DAG determines whether to loop again or advance. You MUST NOT make that determination yourself.
     ```

   - A **`## Advance`** section: "Call `next_step()` to loop for another research iteration, or advance to synthesis-gate when the loop counter is exhausted. The DAG plugin will present the available options — do not hardcode branch IDs."

   Do not write research content, topic analysis, or answers to the questions in this prompt.

   ---

   **`.opencode/session-plans/{session-name}/prompts/synthesis-gate.md`**

   Gate prompt. Write it as:
   ```
   <!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

   # Node: synthesis-gate

   Read `research-brief.md` and present a structured summary of all findings accumulated so far, organized by open question or theme.

    Ask the user: "Does this cover what you need? Approve to write the final report, or redirect back to research for more investigation."

     ## Constraints

     You are in a gate node. Present the question to the user. Then stop and wait. Do NOT call `next_step()` until the user has provided an explicit response. Do NOT infer a response from silence or partial responses. When the user responds:
     - If **redirect back to research**: Call `next_step()` exactly once. Stop.
     - If **approve to write report**: Call `next_step()` exactly once. Stop.

     ## Advance

     Call `next_step()` NOW. Do this exactly once. Do NOT read session files or DAG state. Do NOT take any other action before or after calling `next_step()`.
   ```

   No delegation needed in this node — HeadWrench presents directly.

   ---

   **`.opencode/session-plans/{session-name}/prompts/report-write.md`**

   Write this prompt with:
   - `<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->` as the first line
   - Instructions to write `research-report.md` at `.opencode/session-plans/{session-name}/research-report.md`
   - The **output format** specified during planning (copied verbatim from clarify/research-gate)
   - Source material: all findings in `research-brief.md` plus any additional findings surfaced during synthesis-gate
    - **Delegation instructions** from the agent-routing node for report-write (embed verbatim — follow agent-routing delegation instructions; do not override with hardcoded HW-direct constraint)
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

- You MUST NOT call `next_step()` — this is a terminal node. Call `close_session()` after presenting the plan.
- Seven files only: `plan.json`, `session-overview.md`, `research-brief.md`, `research-execute.md`, `synthesis-gate.md`, `report-write.md`, `finalize-output.md`. No additional files.
- `session-overview.md` must be dynamically generated — do not copy a static template.
- `research-brief.md` stub only. No generated research content.
- All open questions and format/audience details must be **copied verbatim** from earlier planning nodes — do not paraphrase.
- You MUST NOT engage with the research topic's content in any way.

## Advance

Call `close_session()` exactly once. Do this exactly once. Do NOT call `next_step()` — this is a terminal node. Do NOT read session files or DAG state. Do NOT take any other action before or after calling `close_session()`.
