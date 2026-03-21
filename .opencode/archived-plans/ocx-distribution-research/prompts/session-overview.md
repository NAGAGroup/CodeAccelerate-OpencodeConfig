<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Session Overview — ocx-distribution-research

This is a **deep research session** — an automated, loop-based research session using @DeepResearcher agents. The session iteratively investigates the research topic through multiple research iterations, accumulates findings to a living brief, and produces a structured document.

---

## Research Topic

How to distribute the opencode config in ./opencode via https://github.com/kdcokenny/ocx

The goal is to create a drop-in installer / distro like "oh-my-opencode" where users can easily install the opencode configuration framework.

---

## Open Questions to Answer

1. What distribution mechanisms does ocx/opencode support for sharing configs?
2. How do existing opencode configurations handle repo-based distribution?
3. What repo structure works best for a "distro" style config distribution?
4. How to handle installation, updates, and versioning for a config repo?
5. What modifications to the current opencode directory are needed for distribution?

---

## Output Format

Single document in `docs/distribution-via-ocx.md` explaining:
- Available distribution mechanisms
- Recommended repo structure
- Implementation steps
- Installation workflow for end users

---

## Audience / Use

The output is for the repo owner to understand what's needed to set up the GitHub distribution repo. It will serve as the implementation guide for creating kdcokenny/ocx.

---

## Research-Execute Iterations Allowed

**5 iterations** before the loop counter is exhausted and the session advances to synthesis-gate.

---

## How This Session Works

1. **research-execute loop** (up to 5 iterations):
   - Each iteration: dispatch multiple @DeepResearcher agents in parallel (one per open question or sub-area)
   - All findings accumulate to `research-brief.md` with an iteration log entry
   - **No user interaction mid-loop** — the loop is fully unsupervised
   - When the loop counter is exhausted, the DAG advances automatically to `synthesis-gate`

2. **synthesis-gate**:
   - HeadWrench presents all accumulated findings for user review
   - User can approve to write the final report, or redirect back for more research

3. **report-write**:
   - @QuickDoc writes the final document based on accumulated findings

4. **finalize-output**:
   - HeadWrench presents the completed report to the user

---

## What You Must Never Do

- Surface findings mid-loop or wait for user input between research iterations
- Conduct research from your own knowledge — always dispatch @DeepResearcher
- Write research content, topic analysis, or answers to the questions in this prompt

---

## Advance

Call `next_step()` to proceed to the first research-execute iteration.
