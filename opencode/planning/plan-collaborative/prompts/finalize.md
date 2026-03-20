# Node: finalize — /plan-collaborative

Your role in this node is to write the seed session plan to disk. The collaborative session is live and self-editing — the seed plan is a starting point, not a fixed structure.

## Steps

1. **Write session plan files** to `.opencode/session-plans/{session-name}/`:

   **`plan.json`** — Seed DAG with stub explore nodes:
   ```json
   {
     "schema_version": "1.0",
     "id": "{session-name}",
     "session_type": "plan-collaborative",
     "goal": "{rough goal statement}",
     "created": "{today}",
     "status": "ready",
     "entry": "explore-01",
     "nodes": {
       "explore-01": {
         "id": "explore-01",
         "type": "agent",
         "prompt": ".opencode/session-plans/{session-name}/prompts/explore-01.md",
         "next": ["explore-01", "spec-gate"]
       },
       "spec-gate": {
         "id": "spec-gate",
         "type": "gate",
         "prompt": ".opencode/session-plans/{session-name}/prompts/spec-gate.md",
         "next": ["finalize-output", "explore-01"]
       },
       "finalize-output": {
         "id": "finalize-output",
         "type": "agent",
         "prompt": ".opencode/session-plans/{session-name}/prompts/finalize-output.md"
       }
     }
   }
   ```

   **`prompts/explore-01.md`** — Bake in the first exploration area and the open questions identified during clarify. Instruct the agent to work through this area with the user, update `spec.md` with findings, and either loop (`next_step({ next: "explore-01" })`) or advance (`next_step({ next: "spec-gate" })`) when ready.

   **`prompts/spec-gate.md`** — Gate prompt: present current state of `spec.md` to user and ask: "Are we ready to finalize, or is there more to explore?"

   **`prompts/finalize-output.md`** — Terminal prompt: write the agreed output in the collaboratively determined format. Call `close_session()` when done.

   **`spec.md`** — Stub document:
   ```
   # {session-name}
   
   **Goal:** {rough goal}
   
   **Open Questions:**
   {list of open questions from clarify}
   
   **Findings:** (populated during session)
   ```

2. **Key constraint**: ALL nodes and prompts in this plan are freely rewriteable by the agent during execution. The agent may add new explore nodes, rename them, update spec.md, and restructure plan.json — as long as the currently-executing node ID still exists when `next_step()` is called.

3. **Commit**:
   ```
   git add .opencode/session-plans/{session-name}/
   git commit -m "plan: add collaborative session {session-name}"
   ```

4. **Present the seed plan** to the user:
   - Rough goal and open questions
   - Seed structure (explore-01 → spec-gate → finalize-output)
   - Note: the plan is deliberately flexible — the agent will rewrite it as the session evolves
   - Next step: "Run '/activate-plan {session-name}' when ready to begin."

## Constraints

- Do not call `next_step()` — this is a terminal node. Call `close_session()` after presenting the plan.
