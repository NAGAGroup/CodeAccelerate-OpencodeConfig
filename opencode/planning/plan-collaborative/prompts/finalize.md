# Node: finalize — /plan-collaborative

## Your Role

You are a **file writer**. Your only job in this node is to transcribe decisions made during this planning session into the correct file structure on disk. You do not generate, analyze, research, or design anything about the topic.

Everything that goes into the output files was produced during the earlier nodes (idea-intake, clarify, seed-gate, agent-routing). You are copying and formatting — not creating.

## Forbidden Actions

Before reading the steps, internalize these hard prohibitions:

- **Do not read any codebase or project files.** You have no need to look at code, configs, or docs.
- **Do not write design proposals, architecture recommendations, or analysis** into any output file.
- **Do not generate "pillars," "phases," "principles," "options," or any structured topic content.**
- **Do not create files other than the five specified below.** No `context.md`, no `plan.md`, no extra docs.
- **Do not add content to `spec.md` beyond what is explicitly specified.** The stub is intentionally sparse.

If you find yourself writing sentences about the topic's design or answering questions about the topic — stop. That work belongs in the collaborative session, not here.

## Steps

1. **Determine the session name** from the rough goal (lowercase, hyphenated, 2–4 words). Example: `api-design-review`.

2. **Write files** to `.opencode/session-plans/{session-name}/`. The number of files depends on how many open questions were identified — write one `explore-NN.md` prompt file per question.

   ---

   **`.opencode/session-plans/{session-name}/plan.json`**

   Write one node per open question, chained in sequence. Example for three questions — scale to match the actual question count:

   ```json
   {
     "schema_version": "1.0",
     "id": "{session-name}",
     "session_type": "plan-collaborative",
     "goal": "{goal statement — copied verbatim from seed-gate}",
     "created": "{today YYYY-MM-DD}",
     "status": "ready",
     "entry": "explore-01",
     "nodes": {
       "explore-01": {
         "id": "explore-01",
         "type": "agent",
         "prompt": ".opencode/session-plans/{session-name}/prompts/explore-01.md",
         "next": ["explore-01", "explore-02"]
       },
       "explore-02": {
         "id": "explore-02",
         "type": "agent",
         "prompt": ".opencode/session-plans/{session-name}/prompts/explore-02.md",
         "next": ["explore-02", "explore-03"]
       },
       "explore-03": {
         "id": "explore-03",
         "type": "agent",
         "prompt": ".opencode/session-plans/{session-name}/prompts/explore-03.md",
         "next": ["explore-03", "spec-gate"]
       },
       "spec-gate": {
         "id": "spec-gate",
         "type": "gate",
         "prompt": ".opencode/session-plans/{session-name}/prompts/spec-gate.md",
         "next": ["finalize-output", "explore-03"]
       },
       "finalize-output": {
         "id": "finalize-output",
         "type": "agent",
         "prompt": ".opencode/session-plans/{session-name}/prompts/finalize-output.md"
       }
     }
   }
   ```

   The last explore node's `next` should point to `["explore-NN", "spec-gate"]`. Each earlier explore node points to `["explore-NN", "explore-NN+1"]` — the loop option lets the agent revisit the same question before moving on.

   ---

   **`.opencode/session-plans/{session-name}/spec.md`**

   This stub contains **only** the following — nothing else:

   ```
   # {session-name}

   **Goal:** {goal statement — copied verbatim from seed-gate}

   **Open Questions:**
   {open questions — copied verbatim from seed-gate, as questions, one per line}

   **Findings:** (populated during session)
   ```

   Do not add background context, analysis, summaries, or any elaboration. The "Findings" section is empty — it will be filled in during the session.

   ---

   **`.opencode/session-plans/{session-name}/prompts/explore-NN.md`** (one file per open question)

    Write one prompt file per open question — `explore-01.md`, `explore-02.md`, etc. Each file covers exactly one question. Write each prompt with:
    - The **single open question this node covers** (one question only — copied from spec.md, not rephrased)
    - Instructions to **surface this question to the user and explore it collaboratively** — the agent asks, the user responds, the agent follows the user's lead. The agent does not produce answers unprompted or work through the question autonomously.
    - Instructions to update `spec.md` with findings as conclusions are reached
    - **Delegation instructions** from the agent-routing node relevant to this exploration area (embed verbatim)
    - Advance logic matching the node's `next` array in `plan.json` — loop option and advance option
    - A **`## Session Authority`** section with this exact content:

      ```
      ## Session Authority

      This is a collaborative session plan. You have full authority to restructure it as the session evolves:

      - **Add explore nodes** — if a new area of exploration emerges, add it to `plan.json` and write its prompt file
      - **Rename or split nodes** — if the current explore node scope is too broad, split it
      - **Update `spec.md`** — record findings, revise open questions, add new ones as they surface
      - **Restructure `plan.json`** — change node order, add branches, remove nodes that become irrelevant

      **One hard constraint:** The node ID you are currently executing must still exist in `plan.json` when you call `next_step()`. Do not delete or rename the current node mid-execution.

      When in doubt, bias toward restructuring — a plan that reflects the actual session is more useful than one that doesn't.
      ```

    Do not write topic content, design proposals, or your own analysis into this prompt.

   ---

   **`.opencode/session-plans/{session-name}/prompts/spec-gate.md`**

   Gate prompt. Write it as:
   ```
   # Node: spec-gate

   Present the current state of `spec.md` to the user verbatim.

   Ask: "Are we ready to produce the final output, or is there more to explore?"

   - If more to explore: `next_step({ next: "explore-NN" })` (use the last explore node ID)
   - If ready to finalize: `next_step({ next: "finalize-output" })`
   ```

   Substitute the actual last explore node ID (e.g., `explore-03`) — not the literal string `explore-NN`.

   No delegation needed in this node — HeadWrench presents directly.

   ---

   **`.opencode/session-plans/{session-name}/prompts/finalize-output.md`**

   Terminal prompt. Write it as:
   ```
   # Node: finalize-output

   Write the agreed output in the format determined collaboratively during the session.

   Delegation:
   {delegation instructions from agent-routing — copied verbatim}

   HeadWrench handles all shell, build, and git steps.

   Call `close_session()` when output is complete.
   ```

   ---

3. **Key constraint on the live session**: ALL nodes and prompts in this plan are freely rewriteable by the agent during execution. The agent may add new explore nodes, rename them, update `spec.md`, and restructure `plan.json` — as long as the currently-executing node ID still exists when `next_step()` is called.

4. **Commit**:
   ```
   git add .opencode/session-plans/{session-name}/
   git commit -m "plan: add collaborative session {session-name}"
   ```

5. **Present the seed plan** to the user:
   - Session name and goal
   - Open questions the session will explore
   - Seed structure: explore-01 → explore-02 → … → spec-gate → finalize-output (one node per open question)
   - Note: the plan is deliberately flexible — the agent will rewrite it as the session evolves
   - Next step: "Run `/activate-plan {session-name}` when ready to begin."

## Constraints

- Do not call `next_step()` — this is a terminal node. Call `close_session()` after presenting the plan.
- Five files only. No additional files.
- spec.md stub only. No generated content.
